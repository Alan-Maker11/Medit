import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { message, history } = await request.json();
  if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });

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

  // OLLAMA API endpoint (runs on localhost:11434 by default)
  // For production, this should point at a persistent server running OLLAMA
  const ollamaUrl = process.env.OLLAMA_API_URL || "http://localhost:11434/api/generate";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

    const response = await fetch(ollamaUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral", // Can also use: 'llama2', 'neural-chat', 'orca-mini'
        prompt,
        stream: false,
        temperature: 0.4,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OLLAMA Error:", errorData);
      return NextResponse.json(
        { error: "OLLAMA service error", details: errorData.error || "Unknown error" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      reply: data.response || data.text || "No response generated",
      model: "mistral",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API Error:", error);
    const err = error as Error;

    if (err.name === "AbortError") {
      return NextResponse.json({ error: "OLLAMA request timed out" }, { status: 504 });
    }

    if (err.message?.includes("ECONNREFUSED") || err.message?.includes("fetch failed")) {
      return NextResponse.json(
        {
          error: "OLLAMA service not running",
          message: "Make sure OLLAMA is running on your system. Download from https://ollama.ai",
          help: "Run: ollama run mistral",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: "Internal server error", message: err.message }, { status: 500 });
  }
}
