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
  getTripAnalytics,
  getExpenseAnalytics,
  predictNextWeekRevenue,
  detectAnomalies,
  generateRecommendations,
  generateReport,
  calculateDriverSalary,
  calculateDriverTermSalary,
  findDriverIdByName,
  type TermSalary,
} from "@/lib/advanced-queries";
import { formatDOP } from "@/lib/fare";
import { parseIntent } from "@/lib/intent-recognizer";
import { handleUncertainIntent } from "@/lib/confirmation-handler";
import { formatRevenueResponse, formatExpenseResponse, formatProfitResponse } from "@/lib/data-formatter";

const ES_HINTS = /[ñáéíóúÁÉÍÓÚÑ]|cu[aá]nto|pr[oó]ximo|siguiente|conductor|salario|sueldo|d[ií]a|mes|ascensor|dieta/i;
function detectLang(message: string): "es" | "en" {
  return ES_HINTS.test(message) ? "es" : "en";
}

const MONTH_NAMES: Record<"es" | "en", string[]> = {
  es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

/**
 * Builds the salary reply directly from calculateDriverTermSalary's real numbers.
 * We do NOT let the LLM restate these figures — a small model has been observed
 * fabricating numbers instead of faithfully reading the provided JSON, which is
 * unacceptable for pay calculations.
 */
function formatTermSalaryReply(ts: TermSalary, lang: "es" | "en"): string {
  const isEs = lang === "es";
  const monthName = MONTH_NAMES[lang][ts.month - 1];
  const periodLabel = ts.term === 1 ? (isEs ? "1ra quincena (1-15)" : "1st term (1-15)") : isEs ? "2da quincena (16-fin)" : "2nd term (16-end)";
  const statusLabel = ts.isPaid ? "" : isEs ? " — en curso" : " — in progress";

  const lines: string[] = [];
  lines.push(
    isEs
      ? `💰 Salario de ${ts.driverName} — ${monthName} ${ts.year}, ${periodLabel}${statusLabel}`
      : `💰 ${ts.driverName}'s salary — ${monthName} ${ts.year}, ${periodLabel}${statusLabel}`
  );
  lines.push("");
  lines.push(isEs ? `• Base (mitad del salario mensual): ${formatDOP(ts.halfBaseSalary)}` : `• Base (half of monthly salary): ${formatDOP(ts.halfBaseSalary)}`);
  lines.push(
    isEs
      ? `• Horas extra: ${ts.termHours}h × ${formatDOP(ts.overtimeRate)}/h = ${formatDOP(ts.termOvertimePay)}`
      : `• Overtime: ${ts.termHours}h × ${formatDOP(ts.overtimeRate)}/h = ${formatDOP(ts.termOvertimePay)}`
  );
  lines.push(isEs ? `• Dieta: ${formatDOP(ts.termDieta)}` : `• Meal allowance (dieta): ${formatDOP(ts.termDieta)}`);
  lines.push(isEs ? `• Ascensor/Bajador: ${formatDOP(ts.termElevator)}` : `• Elevator/stair-climber fees: ${formatDOP(ts.termElevator)}`);
  lines.push("");
  lines.push(isEs ? `**Total a pagar: ${formatDOP(ts.termTotal)}**` : `**Total to pay: ${formatDOP(ts.termTotal)}**`);

  const extraDays = ts.entries.filter((e) => e.hours > 0 || e.dieta > 0 || e.elevator > 0);
  if (extraDays.length > 0) {
    lines.push("");
    lines.push(isEs ? "Detalle por día (ingresos extra):" : "Day-by-day breakdown (extra income):");
    for (const e of extraDays) {
      const parts: string[] = [];
      if (e.hours > 0) parts.push(isEs ? `${e.hours}h extra (${formatDOP(e.overtimePay)})` : `${e.hours}h overtime (${formatDOP(e.overtimePay)})`);
      if (e.dieta > 0) parts.push(`dieta ${formatDOP(e.dieta)}`);
      if (e.elevator > 0) parts.push(`ascensor/bajador ${formatDOP(e.elevator)}`);
      lines.push(`  - ${e.date}: ${parts.join(", ")}`);
    }
  } else {
    lines.push("");
    lines.push(isEs ? "No hay ingresos extra registrados en este período aparte de la base." : "No extra income logged for this period besides the base.");
  }

  if (!ts.isPaid) {
    lines.push("");
    lines.push(
      isEs
        ? "Este período todavía está en curso — el total puede subir si se agregan más entradas antes de que termine."
        : "This period is still in progress — the total may increase if more entries are added before it ends."
    );
  }

  return lines.join("\n");
}

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
6. Driver salary calculations

IMPORTANT — HOW MEDIT DRIVER PAY ACTUALLY WORKS:
Drivers are paid TWICE per month, in two terms:
  - 1st term: days 1-15 of the month
  - 2nd term: day 16 to the end of the month
Each term's pay = HALF of the driver's base monthly salary + that term's overtime hours (× hourly rate)
+ that term's dieta (meal allowance) entries + that term's Ascensor/Bajador (elevator/stair-climber) fee entries.
Overtime hours, dieta, and elevator fees are logged per-day and only count toward whichever term their date falls in.
When asked "how much is the next salary" or "cuánto es el próximo salario" for a driver, this means the CURRENT,
still-accruing term (the one containing today's date) — that is the payment coming up next, based on entries logged so far.
Do NOT just add up the full monthly base salary — always use the half-base-per-term structure above.

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
async function executeAdvancedTask(
  userMessage: string
): Promise<{ contextString: string; capability: string; deterministicReply?: string } | null> {
  const upper = userMessage.toUpperCase();
  const today = new Date().toISOString().slice(0, 10);

  try {
    // Comprehensive financial-intent recognition: catches EVERY revenue/expense/profit/comparison/
    // forecast/analysis phrasing and EVERY date-format variation, with confidence scoring. If uncertain,
    // it asks a clarifying question instead of ever letting the LLM guess at numbers.
    const intent = parseIntent(userMessage, today);
    if (intent.category === "financial") {
      const lang = detectLang(userMessage);
      const confirmation = handleUncertainIntent(intent, lang);

      if (!confirmation.shouldProceed) {
        const parts = [confirmation.clarificationMessage ?? ""];
        if (confirmation.suggestedInterpretations?.length) {
          parts.push("", ...confirmation.suggestedInterpretations);
        }
        return {
          contextString: `CLARIFICATION NEEDED: confidence=${intent.confidence}, subType=${intent.subType}, timeframe=${intent.timeframe.type}`,
          capability: "clarification",
          deterministicReply: parts.join("\n"),
        };
      }

      const { startDate, endDate } = intent.timeframe;
      const [tripAnalytics, expenseAnalytics] = await Promise.all([
        getTripAnalytics(startDate, endDate),
        getExpenseAnalytics(startDate, endDate),
      ]);
      const revenue = tripAnalytics?.totalRevenue ?? 0;
      const expenses = expenseAnalytics?.totalExpenses ?? 0;

      let deterministicReply: string;
      switch (intent.subType) {
        case "expense":
          deterministicReply = expenseAnalytics
            ? formatExpenseResponse(expenseAnalytics, intent.timeframe, lang)
            : lang === "es"
            ? `No hay gastos registrados para ${intent.timeframe.displayName}.`
            : `No expenses found for ${intent.timeframe.displayName}.`;
          break;
        case "profit":
          deterministicReply = formatProfitResponse(revenue, expenses, intent.timeframe, lang);
          break;
        case "revenue":
        case "comparison":
        case "forecast":
        case "analysis":
        default:
          deterministicReply = tripAnalytics
            ? formatRevenueResponse(tripAnalytics, intent.timeframe, lang)
            : lang === "es"
            ? `No hay viajes completados registrados para ${intent.timeframe.displayName}.`
            : `No completed trips found for ${intent.timeframe.displayName}.`;
      }

      return {
        contextString: `FINANCIAL INTENT (${intent.subType}, ${intent.timeframe.displayName}): revenue=${revenue}, expenses=${expenses}, confidence=${intent.confidence}`,
        capability: intent.subType,
        deterministicReply,
      };
    }

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

    if (/SALARY|PAYROLL|SALARIO|N[OÓ]MINA|SUELDO/.test(upper)) {
      const asksNext = /NEXT|UPCOMING|CURRENT|PR[OÓ]XIMO|SIGUIENTE|ACTUAL/.test(upper);

      // Try "for <name>" / "de <name>" first, then fall back to matching against real driver names
      const nameMatch = userMessage.match(/(?:for|de|driver|conductor)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ][\w'\-. ]{2,40})/i);
      let driverName = nameMatch ? nameMatch[1].trim() : null;
      let driverId = driverName ? await findDriverIdByName(driverName) : null;

      if (!driverId) {
        const allDrivers = await queryDrivers();
        const found = allDrivers.find((d) => {
          const first = d.name.split(" ")[0];
          return userMessage.toLowerCase().includes(d.name.toLowerCase()) || userMessage.toLowerCase().includes(first.toLowerCase());
        });
        if (found) {
          driverId = found.id;
          driverName = found.name;
        }
      }

      if (!driverId) {
        return {
          contextString:
            "SALARY REQUEST: The user asked about salary/payroll but no matching driver name was found. Ask them which driver they mean.",
          capability: "salary",
        };
      }

      const lang = detectLang(userMessage);

      // "next/current" salary → the still-accruing term (half-base + that term's overtime/dieta/elevator)
      if (asksNext || !/\b\d{4}-\d{2}\b/.test(userMessage)) {
        const termSalary = await calculateDriverTermSalary(driverId);
        return {
          contextString: `DRIVER NEXT (CURRENT TERM) SALARY:\n${JSON.stringify(termSalary)}`,
          capability: "salary",
          deterministicReply: formatTermSalaryReply(termSalary, lang),
        };
      }

      const monthMatch = userMessage.match(/\b(\d{4}-\d{2})\b/);
      const month = monthMatch ? monthMatch[1] : new Date().toISOString().slice(0, 7);
      const fullMonthSalary = await calculateDriverSalary(driverId, month);
      return { contextString: `DRIVER FULL-MONTH SALARY:\n${JSON.stringify(fullMonthSalary)}`, capability: "salary" };
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

    const today = new Date().toISOString().slice(0, 10);

    const advancedResult = await executeAdvancedTask(message);

    // Salary (and other) figures are computed deterministically from real data — return them
    // directly without letting the LLM restate the numbers, since that's where it hallucinates.
    if (advancedResult?.deterministicReply) {
      return NextResponse.json({
        reply: advancedResult.deterministicReply,
        dataUsed: { [advancedResult.capability]: true },
      });
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
