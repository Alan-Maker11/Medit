import { formatDOP } from "@/lib/fare";
import type { TimeframeResult } from "./intent-recognizer";

interface TripAnalyticsLike {
  totalTrips: number;
  totalRevenue: number;
  avgFare: number;
}

interface ExpenseAnalyticsLike {
  totalExpenses: number;
  expenseCount: number;
  expensesByCategory: Record<string, number>;
}

export function formatRevenueResponse(data: TripAnalyticsLike, timeframe: TimeframeResult, lang: "es" | "en"): string {
  const isEs = lang === "es";
  const lines: string[] = [];
  lines.push(isEs ? `💰 Ingresos — ${timeframe.displayName}` : `💰 Revenue — ${timeframe.displayName}`);
  lines.push("");
  lines.push(isEs ? `• Viajes completados: ${data.totalTrips}` : `• Completed trips: ${data.totalTrips}`);
  lines.push(isEs ? `• Ingresos totales: ${formatDOP(data.totalRevenue)}` : `• Total revenue: ${formatDOP(data.totalRevenue)}`);
  if (data.totalTrips > 0) {
    lines.push(isEs ? `• Tarifa promedio: ${formatDOP(data.avgFare)}` : `• Average fare: ${formatDOP(data.avgFare)}`);
  }
  return lines.join("\n");
}

export function formatExpenseResponse(data: ExpenseAnalyticsLike, timeframe: TimeframeResult, lang: "es" | "en"): string {
  const isEs = lang === "es";
  const lines: string[] = [];
  lines.push(isEs ? `💸 Gastos — ${timeframe.displayName}` : `💸 Expenses — ${timeframe.displayName}`);
  lines.push("");
  lines.push(isEs ? `• Total de gastos: ${formatDOP(data.totalExpenses)}` : `• Total expenses: ${formatDOP(data.totalExpenses)}`);
  lines.push(isEs ? `• Cantidad de registros: ${data.expenseCount}` : `• Number of entries: ${data.expenseCount}`);
  const categories = Object.entries(data.expensesByCategory).sort((a, b) => b[1] - a[1]);
  if (categories.length > 0) {
    lines.push("");
    lines.push(isEs ? "Por categoría:" : "By category:");
    for (const [category, amount] of categories) {
      lines.push(`  - ${category}: ${formatDOP(amount)}`);
    }
  }
  return lines.join("\n");
}

export function formatProfitResponse(revenue: number, expenses: number, timeframe: TimeframeResult, lang: "es" | "en"): string {
  const isEs = lang === "es";
  const profit = revenue - expenses;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const lines: string[] = [];
  lines.push(isEs ? `📊 Ganancia — ${timeframe.displayName}` : `📊 Profit — ${timeframe.displayName}`);
  lines.push("");
  lines.push(isEs ? `• Ingresos: ${formatDOP(revenue)}` : `• Revenue: ${formatDOP(revenue)}`);
  lines.push(isEs ? `• Gastos: ${formatDOP(expenses)}` : `• Expenses: ${formatDOP(expenses)}`);
  lines.push(isEs ? `• Ganancia neta: ${formatDOP(profit)} (${margin.toFixed(1)}% margen)` : `• Net profit: ${formatDOP(profit)} (${margin.toFixed(1)}% margin)`);
  return lines.join("\n");
}
