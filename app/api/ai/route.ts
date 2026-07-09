import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface HFResponse {
  generated_text?: string;
  text?: string;
}

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const hfToken = process.env.HUGGINGFACE_API_KEY?.trim();
    if (!hfToken) {
      return NextResponse.json(
        {
          error: "Missing HUGGINGFACE_API_KEY environment variable",
          details: "Add HUGGINGFACE_API_KEY to Vercel environment variables",
        },
        { status: 500 }
      );
    }

    // Fetch a snapshot of recent data to give the AI context.
    // Guarded independently so a Supabase hiccup doesn't take down the whole chat.
    let trips: unknown[] = [];
    let drivers: unknown[] = [];
    let expenses: unknown[] = [];
    let clients: unknown[] = [];
    try {
      const supabase = await createClient();
      const [tripsRes, driversRes, expensesRes, clientsRes] = await Promise.all([
        supabase
          .from("trips")
          .select("date, client_name, trip_type, status, total_fare, services(name), drivers(name), vehicles(name)")
          .order("date", { ascending: false })
          .limit(100),
        supabase.from("drivers").select("name, status").order("name"),
        supabase
          .from("expenses")
          .select("date, category, amount, description")
          .order("date", { ascending: false })
          .limit(50),
        supabase.from("clients").select("name, phone, last_trip_date, last_total_fare").order("last_trip_date", { ascending: false }).limit(50),
      ]);
      trips = tripsRes.data ?? [];
      drivers = driversRes.data ?? [];
      expenses = expensesRes.data ?? [];
      clients = clientsRes.data ?? [];
    } catch (dbError) {
      console.error("AI copilot: failed to load Supabase context", dbError);
      // Continue without company data rather than failing the whole request
    }

    const today = new Date().toISOString().slice(0, 10);
    const context = `
Today is ${today}.

RECENT TRIPS (last 100):
${JSON.stringify(trips, null, 2)}

DRIVERS:
${JSON.stringify(drivers, null, 2)}

RECENT EXPENSES (last 50):
${JSON.stringify(expenses, null, 2)}

RECENT CLIENTS (last 50):
${JSON.stringify(clients, null, 2)}
`.trim();

    const systemPrompt = `You are a helpful AI assistant for Medit, a medical transportation company in the Dominican Republic.
You have access to the company's operational data provided below.
Answer questions about trips, revenue, drivers, clients, and expenses.
Be concise, friendly, and professional. Use DOP (Dominican pesos) for currency.
If asked something you don't know from the data, say so honestly.
Respond in the same language the user writes in (Spanish or English).

COMPANY DATA:
${context}`;

    const historyText = (history ?? [])
      .map((m: { role: string; content: string }) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");
    const prompt = `${systemPrompt}\n\n${historyText ? historyText + "\n" : ""}User: ${message}\nAssistant:`;

    let response: Response;
    try {
      response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
        headers: {
          Authorization: `Bearer ${hfToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 1024,
            temperature: 0.4,
            top_p: 0.9,
          },
        }),
      });
    } catch (fetchError) {
      console.error("AI copilot: Hugging Face request failed to send", fetchError);
      const msg = fetchError instanceof Error ? fetchError.message : "Unknown network error";
      return NextResponse.json(
        { error: "Could not reach Hugging Face", details: msg },
        { status: 502 }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF Error:", response.status, errorText);

      if (response.status === 401) {
        return NextResponse.json(
          { error: "Invalid API key", details: "Check your HUGGINGFACE_API_KEY" },
          { status: 401 }
        );
      }

      if (response.status === 404) {
        return NextResponse.json(
          {
            error: "AI model unavailable",
            details:
              "Hugging Face returned 404 for HuggingFaceH4/zephyr-7b-beta. This model may no longer be served on the free Inference API — try a different model or provider.",
          },
          { status: 502 }
        );
      }

      if (response.status === 503) {
        return NextResponse.json(
          { error: "Model is loading, please try again in a few seconds", details: errorText },
          { status: 503 }
        );
      }

      return NextResponse.json({ error: "Hugging Face API error", details: errorText }, { status: response.status });
    }

    let result: HFResponse[] | HFResponse;
    try {
      result = await response.json();
    } catch (parseError) {
      const raw = await response.text().catch(() => "");
      console.error("AI copilot: failed to parse Hugging Face response", parseError, raw);
      return NextResponse.json(
        { error: "Unexpected response from Hugging Face", details: raw.slice(0, 300) },
        { status: 502 }
      );
    }

    const first = Array.isArray(result) ? result[0] : result;
    const generatedText = first?.generated_text || first?.text || "";

    // Strip the prompt from the model's echo, keep only the new reply
    const cleanedResponse = generatedText.replace(prompt, "").trim();

    return NextResponse.json({ reply: cleanedResponse || "Could not generate response" });
  } catch (error) {
    console.error("Chat API Error:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Internal server error", details: errorMsg }, { status: 500 });
  }
}
