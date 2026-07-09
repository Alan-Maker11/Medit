import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { message, history } = await request.json();
  if (!message) return NextResponse.json({ error: "No message" }, { status: 400 });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "AI not configured" }, { status: 503 });

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

  const messages = [
    ...(history ?? []),
    { role: "user", content: message },
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      max_tokens: 600,
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  const json = await response.json();
  const reply = json.choices?.[0]?.message?.content ?? "No response.";
  return NextResponse.json({ reply });
}
