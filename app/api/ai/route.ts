import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface HFResponse {
  generated_text?: string;
  text?: string;
}

export async function POST(request: Request) {
  const { message, history } = await request.json();
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const hfToken = process.env.HUGGINGFACE_API_KEY;
  if (!hfToken) {
    return NextResponse.json(
      {
        error: "Missing HUGGINGFACE_API_KEY environment variable",
        details: "Add HUGGINGFACE_API_KEY to Vercel environment variables",
      },
      { status: 500 }
    );
  }

  const supabase = await createClient();

  // Fetch a snapshot of recent data to give the AI context
  const [{ data: trips }, { data: drivers }, { data: expenses }, { data: clients }] = await Promise.all([
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

  const today = new Date().toISOString().slice(0, 10);
  const context = `
Today is ${today}.

RECENT TRIPS (last 100):
${JSON.stringify(trips ?? [], null, 2)}

DRIVERS:
${JSON.stringify(drivers ?? [], null, 2)}

RECENT EXPENSES (last 50):
${JSON.stringify(expenses ?? [], null, 2)}

RECENT CLIENTS (last 50):
${JSON.stringify(clients ?? [], null, 2)}
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

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
      {
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
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("HF Error:", error);

      if (response.status === 401) {
        return NextResponse.json(
          { error: "Invalid API key", details: "Check your HUGGINGFACE_API_KEY" },
          { status: 401 }
        );
      }

      return NextResponse.json({ error: "Hugging Face API error", details: error }, { status: response.status });
    }

    const result = (await response.json()) as HFResponse[];
    const generatedText = result[0]?.generated_text || result[0]?.text || "No response";

    // Strip the prompt from the model's echo, keep only the new reply
    const cleanedResponse = generatedText.replace(prompt, "").trim();

    return NextResponse.json({ reply: cleanedResponse || "Could not generate response" });
  } catch (error) {
    console.error("Chat API Error:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Internal server error", details: errorMsg }, { status: 500 });
  }
}
