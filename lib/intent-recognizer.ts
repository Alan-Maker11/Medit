// Comprehensive financial-question intent recognition: identifies EVERY money-related
// intention (revenue/expense/profit/comparison/forecast/analysis) and EVERY date-format
// variation, with a confidence score so the AI asks for clarification instead of guessing.

export interface TimeframeResult {
  type: "specific-range" | "single-month" | "single-year" | "relative-period" | "unknown";
  startDate?: string;
  endDate?: string;
  displayName?: string;
  detectedFormat?: string;
}

export interface FilterResult {
  driverId?: string;
  vehicleId?: string;
  serviceType?: string;
  clientName?: string;
}

export type FinancialSubType = "revenue" | "expense" | "profit" | "comparison" | "forecast" | "analysis" | "unknown";

export interface ParsedIntent {
  category: "financial" | "unknown";
  subType: FinancialSubType;
  timeframe: TimeframeResult;
  filters: FilterResult;
  confidence: number;
  clarificationNeeded: boolean;
  clarificationQuestion?: string;
  rawMessage: string;
}

// ============ FINANCIAL INTENT KEYWORDS ============

const REVENUE_KEYWORDS = [
  "ingresos", "ingreso", "generado", "generó", "genero", "genera", "se generó", "se genero",
  "total generado", "efectivo entrada", "dinero entrada", "tarifa", "tarifa total", "facturado", "facturación",
  "revenue", "income", "generated", "earned", "made", "total revenue", "proceeds", "cash in", "money in",
];

const EXPENSE_KEYWORDS = [
  "gastos", "gasto", "gasté", "gaste", "costó", "costo", "egreso", "salida dinero", "dinero salida",
  "mantenimiento", "gasolina", "combustible", "seguro", "reparacion", "reparación", "pago", "pagué", "pague",
  "desembolso", "cantidad gastada",
  "expenses", "expense", "costs", "spent", "spending", "expenditure", "outflow", "maintenance", "gas", "fuel",
  "insurance", "repair", "payment",
];

const PROFIT_KEYWORDS = [
  "ganancia", "ganancias", "ganancia neta", "beneficio", "margen", "utilidad", "cuanto quedó", "cuanto queda",
  "cuánto quedó", "cuánto queda", "rentabilidad",
  "profit", "earnings", "net income", "bottom line", "margin", "return",
];

const COMPARISON_KEYWORDS = [
  "comparar", "vs", "versus", "diferencia", "cambio", "aumentó", "aumento", "disminuyó", "disminuyo",
  "compare", "difference", "change", "increased", "decreased", "more than", "less than",
];

const FORECAST_KEYWORDS = [
  "pronostico", "pronóstico", "proyección", "proyeccion", "próximo", "proximo", "estimado", "será", "sera", "espera",
  "forecast", "projection", "expected", "predict", "estimate",
];

const ANALYSIS_KEYWORDS = ["análisis", "analisis", "analizar", "desglose", "breakdown", "analyze", "detail", "segment"];

const MONTHS: Record<string, number> = {
  enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
  julio: 7, agosto: 8, septiembre: 9, setiembre: 9, octubre: 10, noviembre: 11, diciembre: 12,
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
};

function getMonthNumber(monthName: string): number | null {
  return MONTHS[monthName.toLowerCase()] ?? null;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function isoDate(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

function startOfWeek(d: Date): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() - copy.getDay());
  return copy;
}

// ============ DATE PATTERN RECOGNIZERS ============

export function extractDateRange(message: string, todayISO: string): TimeframeResult {
  const msg = message.toLowerCase();
  const today = new Date(`${todayISO}T00:00:00`);

  // PATTERN 1: explicit range "(del) X de [mes] al Y de [mes] (de YYYY)?" — "del" is optional
  const explicitRangePattern = /(?:del\s+)?(\d{1,2})\s+de\s+([a-zA-Zá-úñ]+)\s*(?:al|a|-)\s*(\d{1,2})\s+de\s+([a-zA-Zá-úñ]+)(?:\s+de\s+(\d{4}))?/i;
  const explicitRangeMatch = message.match(explicitRangePattern);
  if (explicitRangeMatch) {
    const [, day1, month1, day2, month2, year] = explicitRangeMatch;
    const m1 = getMonthNumber(month1);
    const m2 = getMonthNumber(month2);
    if (m1 && m2) {
      const y = year ? Number(year) : today.getFullYear();
      return {
        type: "specific-range",
        startDate: isoDate(y, m1, Number(day1)),
        endDate: isoDate(y, m2, Number(day2)),
        displayName: `${day1} de ${month1} al ${day2} de ${month2} ${y}`,
        detectedFormat: "explicit-range",
      };
    }
  }

  // PATTERN 1b: English range "July 6 to July 12" / "July 6-12"
  const enRangePattern = /([a-zA-Z]+)\s+(\d{1,2})(?:st|nd|rd|th)?\s*(?:to|through|-)\s*(?:([a-zA-Z]+)\s+)?(\d{1,2})(?:st|nd|rd|th)?/i;
  const enRangeMatch = message.match(enRangePattern);
  if (enRangeMatch) {
    const [, mon1, d1, mon2, d2] = enRangeMatch;
    const m1 = getMonthNumber(mon1);
    const m2 = mon2 ? getMonthNumber(mon2) : m1;
    if (m1 && m2) {
      const y = today.getFullYear();
      return {
        type: "specific-range",
        startDate: isoDate(y, m1, Number(d1)),
        endDate: isoDate(y, m2, Number(d2)),
        displayName: `${mon1} ${d1} - ${mon2 ?? mon1} ${d2}, ${y}`,
        detectedFormat: "explicit-range-en",
      };
    }
  }

  // PATTERN 2: single explicit date "6 de julio" (no range)
  const singleDatePattern = /(\d{1,2})\s+de\s+([a-zA-Zá-úñ]+)(?:\s+de\s+(\d{4}))?/i;
  const singleMatch = message.match(singleDatePattern);
  if (singleMatch && !explicitRangeMatch) {
    const [, day, monthName, year] = singleMatch;
    const m = getMonthNumber(monthName);
    if (m) {
      const y = year ? Number(year) : today.getFullYear();
      const date = isoDate(y, m, Number(day));
      return { type: "specific-range", startDate: date, endDate: date, displayName: `${day} de ${monthName} ${y}`, detectedFormat: "single-date" };
    }
  }

  // PATTERN 3: relative periods
  if (/esta semana|this week/.test(msg)) {
    const start = startOfWeek(today);
    return { type: "relative-period", startDate: start.toISOString().slice(0, 10), endDate: todayISO, displayName: "esta semana (this week)", detectedFormat: "this-week" };
  }
  if (/semana pasada|última semana|ultima semana|last week/.test(msg)) {
    const thisWeekStart = startOfWeek(today);
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
    return {
      type: "relative-period",
      startDate: lastWeekStart.toISOString().slice(0, 10),
      endDate: lastWeekEnd.toISOString().slice(0, 10),
      displayName: "semana pasada (last week)",
      detectedFormat: "last-week",
    };
  }
  if (/este mes|this month/.test(msg)) {
    return { type: "relative-period", startDate: isoDate(today.getFullYear(), today.getMonth() + 1, 1), endDate: todayISO, displayName: "este mes (this month)", detectedFormat: "this-month" };
  }
  if (/mes pasado|último mes|ultimo mes|last month/.test(msg)) {
    const m = today.getMonth() === 0 ? 12 : today.getMonth();
    const y = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
    const lastDay = new Date(y, m, 0).getDate();
    return { type: "relative-period", startDate: isoDate(y, m, 1), endDate: isoDate(y, m, lastDay), displayName: "mes pasado (last month)", detectedFormat: "last-month" };
  }
  if (/\bhoy\b|\btoday\b/.test(msg)) {
    return { type: "relative-period", startDate: todayISO, endDate: todayISO, displayName: "hoy (today)", detectedFormat: "today" };
  }
  if (/\bayer\b|\byesterday\b/.test(msg)) {
    const y = new Date(today);
    y.setDate(y.getDate() - 1);
    const d = y.toISOString().slice(0, 10);
    return { type: "relative-period", startDate: d, endDate: d, displayName: "ayer (yesterday)", detectedFormat: "yesterday" };
  }

  // PATTERN 4: bare month name, no day — "enero", "junio", "January"
  const monthPattern = /\b(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre|january|february|march|april|may|june|july|august|september|october|november|december)\b/i;
  const monthMatch = message.match(monthPattern);
  if (monthMatch) {
    const monthName = monthMatch[1].toLowerCase();
    const monthNum = getMonthNumber(monthName);
    if (monthNum) {
      let year = today.getFullYear();
      // If the guessed date is in the future, it's more likely the user means the last time that month occurred
      if (isoDate(year, monthNum, 1) > todayISO) year -= 1;
      const lastDay = new Date(year, monthNum, 0).getDate();
      return { type: "single-month", startDate: isoDate(year, monthNum, 1), endDate: isoDate(year, monthNum, lastDay), displayName: `${monthName} ${year}`, detectedFormat: "bare-month" };
    }
  }

  // PATTERN 5: year only "2026"
  const yearPattern = /\b(20\d{2})\b/;
  const yearMatch = message.match(yearPattern);
  if (yearMatch) {
    const year = yearMatch[1];
    return { type: "single-year", startDate: `${year}-01-01`, endDate: `${year}-12-31`, displayName: `año ${year}`, detectedFormat: "bare-year" };
  }

  return { type: "unknown", displayName: "unspecified period", detectedFormat: "none" };
}

// ============ MAIN PARSER ============

export function parseIntent(message: string, todayISO: string): ParsedIntent {
  const msg = message.toLowerCase();

  const allFinancialKeywords = [...REVENUE_KEYWORDS, ...EXPENSE_KEYWORDS, ...PROFIT_KEYWORDS, ...COMPARISON_KEYWORDS, ...FORECAST_KEYWORDS, ...ANALYSIS_KEYWORDS];
  // A bare "cuánto?" / "how much?" with nothing else is clearly a money question missing everything else
  const isBareQuantityQuestion = /^\s*(cu[aá]nto|how much)\??\s*$/i.test(message);
  const isFinancial = isBareQuantityQuestion || allFinancialKeywords.some((keyword) => msg.includes(keyword));

  if (!isFinancial) {
    return {
      category: "unknown",
      subType: "unknown",
      timeframe: { type: "unknown" },
      filters: {},
      confidence: 0,
      clarificationNeeded: false, // not financial — let the caller route this elsewhere, don't force a clarification
      rawMessage: message,
    };
  }

  let subType: FinancialSubType = "unknown";
  let confidence = 50;

  if (REVENUE_KEYWORDS.some((kw) => msg.includes(kw))) {
    subType = "revenue";
    confidence = 90;
  } else if (EXPENSE_KEYWORDS.some((kw) => msg.includes(kw))) {
    subType = "expense";
    confidence = 90;
  } else if (PROFIT_KEYWORDS.some((kw) => msg.includes(kw))) {
    subType = "profit";
    confidence = 85;
  } else if (COMPARISON_KEYWORDS.some((kw) => msg.includes(kw))) {
    subType = "comparison";
    confidence = 75;
  } else if (FORECAST_KEYWORDS.some((kw) => msg.includes(kw))) {
    subType = "forecast";
    confidence = 80;
  } else if (ANALYSIS_KEYWORDS.some((kw) => msg.includes(kw))) {
    subType = "analysis";
    confidence = 75;
  }

  const timeframe = extractDateRange(message, todayISO);

  if (timeframe.type !== "unknown") {
    confidence = Math.min(100, confidence + 10);
  } else {
    confidence = Math.max(0, confidence - 20);
  }

  const clarificationNeeded = confidence < 70 || timeframe.type === "unknown";

  let clarificationQuestion: string | undefined;
  if (clarificationNeeded) {
    if (timeframe.type === "unknown") {
      clarificationQuestion = `For which period? (e.g., "last week", "January", "June 6-12")`;
    } else if (subType === "unknown") {
      clarificationQuestion = `Do you want to know about revenue, expenses, or profit?`;
    }
  }

  return {
    category: "financial",
    subType,
    timeframe,
    filters: {},
    confidence,
    clarificationNeeded,
    clarificationQuestion,
    rawMessage: message,
  };
}
