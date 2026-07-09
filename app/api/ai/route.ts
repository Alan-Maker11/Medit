import { NextResponse } from "next/server";
import {
  queryTrips,
  queryExpenses,
  queryVehicles,
  queryDrivers,
  queryServices,
  getBusinessMetrics,
} from "@/lib/database-queries";

const HF_MODEL = "meta-llama/Llama-3.1-8B-Instruct";
const HF_ROUTER_URL = "https://router.huggingface.co/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 25000;

const SYSTEM_PROMPT = `You are Medit AI, an intelligent business manager assistant for Medit Transportation Company in the Dominican Republic.

You have access to real-time business data including:
- Trips (bookings, fares, customers, routes)
- Expenses (gas, maintenance, insurance, repairs)
- Vehicles
- Drivers (names, status, performance)
- Services (Medical, Surgery, Airport, Therapy, Events, Subir/Bajar, etc.)

IMPORTANT RULES:
1. Always analyze the real data provided to you.
2. Give specific numbers and facts from the data.
3. Provide insights and recommendations based on patterns.
4. Answer in Spanish or English — match the user's language.
5. If asked about something not in the data, say so honestly.
6. Format currency amounts in DOP (Dominican Pesos).
7. Be professional but friendly and concise.
8. Focus on helping optimize business operations.

Available metrics you can analyze: revenue trends, expense patterns, driver performance,
vehicle utilization, service popularity, profitability, average fare per trip, and
revenue/expense breakdowns by category.`;

async function callHuggingFace(hfToken: string, messages: { role: string; content: string }[]) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(HF_ROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: HF_MODEL,
        messages,
        max_tokens: 800,
        temperature: 0.4,
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function buildDataContext(userMessage: string) {
  const upper = userMessage.toUpperCase();
  const needsTrips = /TRIP|REVENUE|FARE|BOOKING|VIAJE|INGRESO|TARIFA/.test(upper);
  const needsExpenses = /EXPENSE|COST|GAS|MAINTENANCE|GASTO|COSTO|MANTENIMIENTO/.test(upper);
  const needsVehicles = /VEHICLE|CAR|VEHÍCULO|CARRO/.test(upper);
  const needsDrivers = /DRIVER|STAFF|PERFORMANCE|CONDUCTOR|CHOFER/.test(upper);
  const needsServices = /SERVICE|MEDICAL|AIRPORT|THERAPY|SERVICIO/.test(upper);

  let trips: Awaited<ReturnType<typeof queryTrips>> = [];
  let expenses: Awaited<ReturnType<typeof queryExpenses>> = [];
  let vehicles: Awaited<ReturnType<typeof queryVehicles>> = [];
  let drivers: Awaited<ReturnType<typeof queryDrivers>> = [];
  let services: Awaited<ReturnType<typeof queryServices>> = [];
  let metrics: Awaited<ReturnType<typeof getBusinessMetrics>> = {
    totalRevenue: 0,
    totalExpenses: 0,
    totalProfit: 0,
    profitMargin: 0,
    totalTrips: 0,
    averageFarePerTrip: 0,
    vehicleCount: 0,
    driverCount: 0,
    revenueByService: {},
    revenueByVehicle: {},
    revenueByDriver: {},
    expensesByCategory: {},
  };

  try {
    [trips, expenses, vehicles, drivers, services, metrics] = await Promise.all([
      needsTrips ? queryTrips() : Promise.resolve([]),
      needsExpenses ? queryExpenses() : Promise.resolve([]),
      needsVehicles ? queryVehicles() : Promise.resolve([]),
      needsDrivers ? queryDrivers() : Promise.resolve([]),
      needsServices ? queryServices() : Promise.resolve([]),
      getBusinessMetrics(),
    ]);
  } catch (dbError) {
    console.error("AI copilot: failed to load Supabase context", dbError);
    // Continue with whatever partial data we have rather than failing the whole request
  }

  return { trips, expenses, vehicles, drivers, services, metrics };
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

    const dbContext = await buildDataContext(message);
    const today = new Date().toISOString().slice(0, 10);

    const contextString = `
Today is ${today}.

BUSINESS METRICS:
${JSON.stringify(dbContext.metrics, null, 2)}

${dbContext.trips.length > 0 ? `TRIPS (${dbContext.trips.length}):\n${JSON.stringify(dbContext.trips.slice(0, 100), null, 2)}` : ""}
${dbContext.expenses.length > 0 ? `EXPENSES (${dbContext.expenses.length}):\n${JSON.stringify(dbContext.expenses.slice(0, 50), null, 2)}` : ""}
${dbContext.vehicles.length > 0 ? `VEHICLES:\n${JSON.stringify(dbContext.vehicles, null, 2)}` : ""}
${dbContext.drivers.length > 0 ? `DRIVERS:\n${JSON.stringify(dbContext.drivers, null, 2)}` : ""}
${dbContext.services.length > 0 ? `SERVICES:\n${JSON.stringify(dbContext.services, null, 2)}` : ""}
`.trim();

    const chatMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `CURRENT BUSINESS DATA:\n${contextString}` },
      ...((history ?? []) as { role: string; content: string }[]),
      { role: "user", content: message },
    ];

    let response: Response;
    try {
      response = await callHuggingFace(hfToken, chatMessages);
    } catch (fetchError) {
      console.error("AI copilot: Hugging Face request failed, retrying once", fetchError);
      try {
        response = await callHuggingFace(hfToken, chatMessages);
      } catch (retryError) {
        console.error("AI copilot: Hugging Face retry also failed", retryError);
        const isAbort = retryError instanceof Error && retryError.name === "AbortError";
        const msg = isAbort
          ? `Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`
          : retryError instanceof Error
          ? retryError.message
          : "Unknown network error";
        return NextResponse.json({ error: "Could not reach Hugging Face", details: msg }, { status: 502 });
      }
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
            details: `Hugging Face returned 404 for ${HF_MODEL}. It may not be served by any provider right now — try a different model.`,
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

    let result: { choices?: { message?: { content?: string } }[] };
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

    const reply = result.choices?.[0]?.message?.content?.trim();

    return NextResponse.json({
      reply: reply || "Could not generate response",
      dataUsed: {
        tripsIncluded: dbContext.trips.length > 0,
        expensesIncluded: dbContext.expenses.length > 0,
        vehiclesIncluded: dbContext.vehicles.length > 0,
        driversIncluded: dbContext.drivers.length > 0,
        servicesIncluded: dbContext.services.length > 0,
      },
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Internal server error", details: errorMsg }, { status: 500 });
  }
}
