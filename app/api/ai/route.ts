import { NextResponse } from "next/server";
import {
  queryTrips,
  queryExpenses,
  queryVehicles,
  queryDrivers,
  queryServices,
  getBusinessMetrics,
} from "@/lib/database-queries";
import {
  predictNextWeekRevenue,
  detectAnomalies,
  generateRecommendations,
  generateReport,
  calculateDriverSalary,
  findDriverIdByName,
} from "@/lib/advanced-queries";

const HF_MODEL = "meta-llama/Llama-3.1-8B-Instruct";
const HF_ROUTER_URL = "https://router.huggingface.co/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 25000;

const SYSTEM_PROMPT = `You are Medit AI — an enterprise business intelligence assistant for Medit, a medical transportation company in the Dominican Republic.

CAPABILITIES:
1. Natural language queries about trips, revenue, expenses, drivers, vehicles, services
2. Report generation (daily/weekly/monthly)
3. Predictive analytics (revenue forecasting)
4. Anomaly detection (unusual revenue/expense patterns)
5. Recommendation engine (business optimization suggestions)
6. Driver salary calculations (base salary + overtime + dieta + elevator fees)

RULES:
1. Always analyze the real data provided to you — never invent numbers.
2. Give specific figures and cite the data.
3. Answer in Spanish or English, matching the user's language.
4. If asked about something not in the provided data, say so honestly.
5. Format currency as RD$ (Dominican Pesos).
6. Be professional, concise, and actionable.
7. If the user asks to schedule/book a trip, tell them to use the "Log new trip" page in the admin panel — you can help them figure out the fare and details, but you do not create bookings directly.`;

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
        stream: false,
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function buildGeneralDataContext(userMessage: string) {
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
  }

  const contextString = `
BUSINESS METRICS:
${JSON.stringify(metrics)}

${trips.length > 0 ? `TRIPS (showing ${Math.min(30, trips.length)} of ${trips.length}):\n${JSON.stringify(trips.slice(0, 30))}` : ""}
${expenses.length > 0 ? `EXPENSES (showing ${Math.min(20, expenses.length)} of ${expenses.length}):\n${JSON.stringify(expenses.slice(0, 20))}` : ""}
${vehicles.length > 0 ? `VEHICLES:\n${JSON.stringify(vehicles)}` : ""}
${drivers.length > 0 ? `DRIVERS:\n${JSON.stringify(drivers)}` : ""}
${services.length > 0 ? `SERVICES:\n${JSON.stringify(services)}` : ""}
`.trim();

  return {
    contextString,
    dataUsed: {
      tripsIncluded: trips.length > 0,
      expensesIncluded: expenses.length > 0,
      vehiclesIncluded: vehicles.length > 0,
      driversIncluded: drivers.length > 0,
      servicesIncluded: services.length > 0,
    },
  };
}

/** Detects a specific analytics/report/salary intent and computes real numbers for it. Returns null for general queries. */
async function executeAdvancedTask(userMessage: string): Promise<{ contextString: string; capability: string } | null> {
  const upper = userMessage.toUpperCase();

  try {
    if (/REPORT|REPORTE/.test(upper)) {
      const reportType = /DAILY|DIARIO/.test(upper) ? "daily" : /WEEKLY|SEMANAL/.test(upper) ? "weekly" : "monthly";
      const report = await generateReport(reportType);
      return { contextString: `GENERATED ${reportType.toUpperCase()} REPORT:\n${JSON.stringify(report)}`, capability: "report" };
    }

    if (/PREDICT|FORECAST|PRONÓSTICO|PROYECT/.test(upper)) {
      const prediction = await predictNextWeekRevenue();
      return { contextString: `REVENUE PREDICTION:\n${JSON.stringify(prediction)}`, capability: "prediction" };
    }

    if (/ANOMAL|UNUSUAL|INUSUAL/.test(upper)) {
      const anomalies = await detectAnomalies("revenue");
      return { contextString: `ANOMALY DETECTION:\n${JSON.stringify(anomalies)}`, capability: "anomaly" };
    }

    if (/RECOMMEND|IMPROVE|OPTIMI[ZS]E|RECOMIEND|MEJORAR/.test(upper)) {
      const recs = await generateRecommendations();
      return { contextString: `BUSINESS RECOMMENDATIONS:\n${JSON.stringify(recs)}`, capability: "recommendation" };
    }

    if (/SALARY|PAYROLL|SALARIO|N[OÓ]MINA/.test(upper)) {
      // Try to find "for <name>" / "de <name>" and a YYYY-MM month in the message
      const monthMatch = userMessage.match(/\b(\d{4}-\d{2})\b/);
      const month = monthMatch ? monthMatch[1] : new Date().toISOString().slice(0, 7);
      const nameMatch = userMessage.match(/(?:for|de|driver|conductor)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ][\w'\-. ]{2,40})/i);
      const driverName = nameMatch ? nameMatch[1].trim() : null;

      if (!driverName) {
        return {
          contextString:
            "SALARY REQUEST: The user asked about salary/payroll but did not specify a driver name. Ask them which driver and which month (YYYY-MM) they mean.",
          capability: "salary",
        };
      }

      const driverId = await findDriverIdByName(driverName);
      if (!driverId) {
        return {
          contextString: `SALARY REQUEST: No driver found matching "${driverName}". Tell the user this driver name wasn't found.`,
          capability: "salary",
        };
      }

      const salary = await calculateDriverSalary(driverId, month);
      return { contextString: `DRIVER SALARY CALCULATION:\n${JSON.stringify(salary)}`, capability: "salary" };
    }

    return null;
  } catch (error) {
    console.error("AI copilot: advanced task execution failed", error);
    return {
      contextString: `An error occurred while computing this: ${error instanceof Error ? error.message : "unknown error"}. Tell the user briefly and suggest they try again.`,
      capability: "error",
    };
  }
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

    const today = new Date().toISOString().slice(0, 10);

    const advancedResult = await executeAdvancedTask(message);
    const dataUsed: Record<string, boolean> = {};
    let dataContext: string;

    if (advancedResult) {
      dataContext = advancedResult.contextString;
      dataUsed[advancedResult.capability] = true;
    } else {
      const general = await buildGeneralDataContext(message);
      dataContext = general.contextString;
      Object.assign(dataUsed, general.dataUsed);
    }

    const sanitizedHistory = Array.isArray(history)
      ? history
          .filter(
            (m): m is { role: string; content: string } =>
              m && typeof m.content === "string" && (m.role === "user" || m.role === "assistant")
          )
          .map((m) => ({ role: m.role, content: m.content }))
      : [];

    const chatMessages = [
      {
        role: "system",
        content: `${SYSTEM_PROMPT}\n\nToday is ${today}.\n\nCURRENT BUSINESS DATA:\n${dataContext}`,
      },
      ...sanitizedHistory,
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
      dataUsed,
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Internal server error", details: errorMsg }, { status: 500 });
  }
}
