import { createClient } from "@/lib/supabase/server";

// ============ ANALYTICS FUNCTIONS ============

export async function getTripAnalytics(startDate?: string, endDate?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("trips")
    .select("*, services(name), drivers(name), vehicles(name)")
    .eq("status", "completed");

  if (startDate) query = query.gte("date", startDate);
  if (endDate) query = query.lte("date", endDate);

  const { data, error } = await query;
  if (error) throw error;
  if (!data || data.length === 0) return null;

  const totalTrips = data.length;
  const totalRevenue = data.reduce((sum, t) => sum + (t.total_fare ?? 0), 0);
  const avgFare = totalRevenue / totalTrips;
  const totalDistance = data.reduce((sum, t) => sum + (t.distance_km ?? 0), 0);
  const avgDistance = totalDistance / totalTrips;
  const totalDuration = data.reduce((sum, t) => sum + (t.duration_minutes ?? 0), 0);
  const avgDuration = totalDuration / totalTrips;

  const revenueByService: Record<string, number> = {};
  const revenueByDriver: Record<string, number> = {};
  const revenueByVehicle: Record<string, number> = {};
  for (const trip of data) {
    const service = trip.services?.name ?? "Unknown service";
    const driver = trip.drivers?.name ?? "Unassigned";
    const vehicle = trip.vehicles?.name ?? "Unassigned";
    revenueByService[service] = (revenueByService[service] ?? 0) + (trip.total_fare ?? 0);
    revenueByDriver[driver] = (revenueByDriver[driver] ?? 0) + (trip.total_fare ?? 0);
    revenueByVehicle[vehicle] = (revenueByVehicle[vehicle] ?? 0) + (trip.total_fare ?? 0);
  }

  return {
    totalTrips,
    totalRevenue,
    avgFare: Number(avgFare.toFixed(2)),
    totalDistance: Number(totalDistance.toFixed(2)),
    avgDistance: Number(avgDistance.toFixed(2)),
    totalDuration,
    avgDuration: Number(avgDuration.toFixed(1)),
    revenueByService,
    revenueByDriver,
    revenueByVehicle,
  };
}

export async function getExpenseAnalytics(startDate?: string, endDate?: string) {
  const supabase = await createClient();
  let query = supabase.from("expenses").select("*, vehicles(name)");

  if (startDate) query = query.gte("date", startDate);
  if (endDate) query = query.lte("date", endDate);

  const { data, error } = await query;
  if (error) throw error;
  if (!data || data.length === 0) return null;

  const totalExpenses = data.reduce((sum, e) => sum + (e.amount ?? 0), 0);

  const expensesByCategory: Record<string, number> = {};
  const expensesByVehicle: Record<string, number> = {};
  for (const exp of data) {
    const category = exp.category ?? "uncategorized";
    expensesByCategory[category] = (expensesByCategory[category] ?? 0) + (exp.amount ?? 0);
    if (exp.vehicle_id) {
      const vehicle = exp.vehicles?.name ?? "Unassigned";
      expensesByVehicle[vehicle] = (expensesByVehicle[vehicle] ?? 0) + (exp.amount ?? 0);
    }
  }

  return {
    totalExpenses: Number(totalExpenses.toFixed(2)),
    expenseCount: data.length,
    avgExpense: Number((totalExpenses / data.length).toFixed(2)),
    expensesByCategory,
    expensesByVehicle,
  };
}

function daysAgoISO(days: number) {
  const d = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10);
}

// ============ PREDICTIVE FUNCTIONS ============

export async function predictNextWeekRevenue() {
  const analytics = await getTripAnalytics(daysAgoISO(28), daysAgoISO(0));

  if (!analytics || analytics.totalTrips < 10) {
    return { prediction: null, confidence: 0, reason: "Insufficient data (need at least 10 completed trips in the last 4 weeks)" };
  }

  const avgDailyRevenue = analytics.totalRevenue / 28;
  const nextWeekPrediction = avgDailyRevenue * 7;

  return {
    prediction: Number(nextWeekPrediction.toFixed(2)),
    confidence: 65,
    avgDailyRevenue: Number(avgDailyRevenue.toFixed(2)),
    basis: "Last 4 weeks average",
  };
}

export async function detectAnomalies(metricType: "revenue" | "expense") {
  const historicalData =
    metricType === "revenue"
      ? await getTripAnalytics(daysAgoISO(30), daysAgoISO(0))
      : await getExpenseAnalytics(daysAgoISO(30), daysAgoISO(0));

  const recentData =
    metricType === "revenue"
      ? await getTripAnalytics(daysAgoISO(7), daysAgoISO(0))
      : await getExpenseAnalytics(daysAgoISO(7), daysAgoISO(0));

  if (!historicalData || !recentData) {
    return { anomalies: [] as { type: string; severity: string; message: string; deviation: number }[], analysis: "Insufficient data" };
  }

  const anomalies: { type: string; severity: string; message: string; deviation: number }[] = [];

  if (metricType === "revenue" && "totalRevenue" in historicalData && "totalRevenue" in recentData) {
    const historicalRevenue = historicalData.totalRevenue / 30;
    const recentRevenue = recentData.totalRevenue / 7;
    const deviation = ((recentRevenue - historicalRevenue) / historicalRevenue) * 100;

    if (Math.abs(deviation) > 20) {
      anomalies.push({
        type: "revenue_deviation",
        severity: Math.abs(deviation) > 30 ? "high" : "medium",
        message: `Revenue ${deviation > 0 ? "increased" : "decreased"} by ${Math.abs(deviation).toFixed(1)}%`,
        deviation: Number(deviation.toFixed(1)),
      });
    }
  }

  if (metricType === "expense" && "totalExpenses" in historicalData && "totalExpenses" in recentData) {
    const historicalExpenses = historicalData.totalExpenses / 30;
    const recentExpenses = recentData.totalExpenses / 7;
    const deviation = ((recentExpenses - historicalExpenses) / historicalExpenses) * 100;

    if (Math.abs(deviation) > 25) {
      anomalies.push({
        type: "expense_deviation",
        severity: Math.abs(deviation) > 40 ? "high" : "medium",
        message: `Expenses ${deviation > 0 ? "increased" : "decreased"} by ${Math.abs(deviation).toFixed(1)}%`,
        deviation: Number(deviation.toFixed(1)),
      });
    }
  }

  return { anomalies, analysis: anomalies.length > 0 ? "Anomalies detected" : "No anomalies" };
}

// ============ RECOMMENDATIONS ENGINE ============

export async function generateRecommendations() {
  const analytics = await getTripAnalytics();
  const expenseAnalytics = await getExpenseAnalytics();

  if (!analytics || !expenseAnalytics) {
    return { recommendations: [] as { type: string; priority: string; message: string; confidence: number }[], profitMargin: "0", summary: "Cannot generate recommendations — not enough data" };
  }

  const recommendations: { type: string; priority: string; message: string; confidence: number }[] = [];

  const revenue = analytics.totalRevenue;
  const expenses = expenseAnalytics.totalExpenses;
  const profit = revenue - expenses;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  if (margin < 20) {
    recommendations.push({
      type: "cost_optimization",
      priority: "high",
      message: "Profit margin is below 20%. Review expense categories and consider price adjustments.",
      confidence: 85,
    });
  }
  if (margin > 40) {
    recommendations.push({
      type: "growth_opportunity",
      priority: "medium",
      message: "Strong profit margin detected. Consider scaling operations or adding vehicles.",
      confidence: 75,
    });
  }

  const topService = Object.entries(analytics.revenueByService).sort((a, b) => b[1] - a[1])[0];
  if (topService) {
    recommendations.push({
      type: "service_focus",
      priority: "medium",
      message: `${topService[0]} generates the highest revenue. Consider scheduling more trips for this service.`,
      confidence: 80,
    });
  }

  if (analytics.totalDistance > 0) {
    const avgCostPerKm = expenseAnalytics.totalExpenses / analytics.totalDistance;
    recommendations.push({
      type: "fleet_efficiency",
      priority: "low",
      message: `Average cost per km is RD$${avgCostPerKm.toFixed(2)}. Monitor fuel consumption and maintenance.`,
      confidence: 70,
    });
  }

  return {
    recommendations,
    profitMargin: margin.toFixed(1),
    summary: recommendations.length > 0 ? `${recommendations.length} recommendations generated` : "No recommendations at this time",
  };
}

// ============ SALARY (matches the real payroll formula used in /admin/salary and /api/reports/payroll) ============

export async function calculateDriverSalary(driverId: string, month: string) {
  const supabase = await createClient();

  const { data: driver, error: driverError } = await supabase.from("drivers").select("*").eq("id", driverId).single();
  if (driverError) throw driverError;

  const monthStart = `${month}-01`;
  const [year, mon] = month.split("-").map(Number);
  const nextMonth = mon === 12 ? `${year + 1}-01` : `${year}-${String(mon + 1).padStart(2, "0")}-01`;

  const { data: entries, error: entriesError } = await supabase
    .from("overtime_entries")
    .select("*")
    .eq("driver_id", driverId)
    .gte("date", monthStart)
    .lt("date", nextMonth);
  if (entriesError) throw entriesError;

  const baseSalary = driver.base_monthly_salary ?? 0;
  const rate = driver.overtime_hourly_rate ?? 0;

  let overtimeHours = 0;
  let overtimePay = 0;
  let dieta = 0;
  let elevator = 0;
  for (const e of entries ?? []) {
    const hours = Number(e.hours) || 0;
    overtimeHours += hours;
    overtimePay += hours * rate;
    dieta += Number(e.dieta_amount) || 0;
    elevator += Number(e.elevator_amount) || 0;
  }

  const totalSalary = baseSalary + overtimePay + dieta + elevator;

  return {
    driverName: driver.name,
    month,
    baseSalary: Number(baseSalary.toFixed(2)),
    overtimeHours,
    overtimePay: Number(overtimePay.toFixed(2)),
    dietaTotal: Number(dieta.toFixed(2)),
    elevatorTotal: Number(elevator.toFixed(2)),
    totalSalary: Number(totalSalary.toFixed(2)),
    entryCount: (entries ?? []).length,
  };
}

// ============ TERM-BASED SALARY (matches the real pay cycle: paid twice a month) ============
// Medit pays drivers HALF the base monthly salary per term:
//   Term 1 = days 1-15, Term 2 = days 16-end of month.
// Each term also includes that term's own overtime hours, dieta, and elevator/stair-climber fees
// (from overtime_entries dated within that term). This matches app/admin/salary/DriverSalaryCard.tsx exactly.

function termOf(dateStr: string): 1 | 2 {
  const day = Number(dateStr.slice(8, 10));
  return day <= 15 ? 1 : 2;
}

function lastDayOfMonth(year: number, month1to12: number) {
  return new Date(year, month1to12, 0).getDate();
}

function termDateRange(year: number, month1to12: number, term: 1 | 2) {
  const mm = String(month1to12).padStart(2, "0");
  if (term === 1) {
    return { start: `${year}-${mm}-01`, end: `${year}-${mm}-15` };
  }
  const lastDay = String(lastDayOfMonth(year, month1to12)).padStart(2, "0");
  return { start: `${year}-${mm}-16`, end: `${year}-${mm}-${lastDay}` };
}

export interface TermSalary {
  driverName: string;
  year: number;
  month: number;
  term: 1 | 2;
  termLabel: string;
  periodStart: string;
  periodEnd: string;
  halfBaseSalary: number;
  termHours: number;
  termOvertimePay: number;
  termDieta: number;
  termElevator: number;
  termTotal: number;
  entryCount: number;
  isPaid: boolean; // true if the period has already fully ended
}

/**
 * Calculates the pay for one specific term (half-month) — this is how Medit actually pays drivers.
 * Defaults to the term containing `referenceDate` (i.e. the CURRENT, still-accruing term — the "next salary" due).
 */
export async function calculateDriverTermSalary(driverId: string, referenceDate?: string): Promise<TermSalary> {
  const supabase = await createClient();

  const { data: driver, error: driverError } = await supabase.from("drivers").select("*").eq("id", driverId).single();
  if (driverError) throw driverError;

  const ref = referenceDate ?? new Date().toISOString().slice(0, 10);
  const year = Number(ref.slice(0, 4));
  const month = Number(ref.slice(5, 7));
  const term = termOf(ref);
  const { start, end } = termDateRange(year, month, term);

  const { data: entries, error: entriesError } = await supabase
    .from("overtime_entries")
    .select("*")
    .eq("driver_id", driverId)
    .gte("date", start)
    .lte("date", end);
  if (entriesError) throw entriesError;

  const baseSalary = driver.base_monthly_salary ?? 0;
  const halfBaseSalary = baseSalary / 2;
  const rate = driver.overtime_hourly_rate ?? 0;

  let termHours = 0;
  let termOvertimePay = 0;
  let termDieta = 0;
  let termElevator = 0;
  for (const e of entries ?? []) {
    const hours = Number(e.hours) || 0;
    termHours += hours;
    termOvertimePay += hours * rate;
    termDieta += Number(e.dieta_amount) || 0;
    termElevator += Number(e.elevator_amount) || 0;
  }

  const termTotal = halfBaseSalary + termOvertimePay + termDieta + termElevator;
  const todayISO = new Date().toISOString().slice(0, 10);

  return {
    driverName: driver.name,
    year,
    month,
    term,
    termLabel: term === 1 ? "1st term (1-15)" : "2nd term (16-end)",
    periodStart: start,
    periodEnd: end,
    halfBaseSalary: Number(halfBaseSalary.toFixed(2)),
    termHours,
    termOvertimePay: Number(termOvertimePay.toFixed(2)),
    termDieta: Number(termDieta.toFixed(2)),
    termElevator: Number(termElevator.toFixed(2)),
    termTotal: Number(termTotal.toFixed(2)),
    entryCount: (entries ?? []).length,
    isPaid: end < todayISO,
  };
}

export async function findDriverIdByName(name: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("drivers").select("id, name").ilike("name", `%${name}%`).limit(1).maybeSingle();
  return data?.id ?? null;
}

// ============ REPORT GENERATION ============

export async function generateReport(reportType: "daily" | "weekly" | "monthly", date?: string) {
  const today = date ? new Date(date) : new Date();
  let startDate: string;
  let endDate: string;

  if (reportType === "daily") {
    startDate = today.toISOString().slice(0, 10);
    endDate = startDate;
  } else if (reportType === "weekly") {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    startDate = weekStart.toISOString().slice(0, 10);
    endDate = today.toISOString().slice(0, 10);
  } else {
    startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
    endDate = today.toISOString().slice(0, 10);
  }

  const [tripAnalytics, expenseAnalytics, anomalies, recommendations] = await Promise.all([
    getTripAnalytics(startDate, endDate),
    getExpenseAnalytics(startDate, endDate),
    detectAnomalies("revenue"),
    generateRecommendations(),
  ]);

  if (!tripAnalytics || !expenseAnalytics) {
    return { error: "Insufficient data for report" };
  }

  const profit = tripAnalytics.totalRevenue - expenseAnalytics.totalExpenses;
  const margin = tripAnalytics.totalRevenue > 0 ? (profit / tripAnalytics.totalRevenue) * 100 : 0;

  return {
    reportType,
    period: `${startDate} to ${endDate}`,
    summary: {
      totalTrips: tripAnalytics.totalTrips,
      totalRevenue: Number(tripAnalytics.totalRevenue.toFixed(2)),
      totalExpenses: Number(expenseAnalytics.totalExpenses.toFixed(2)),
      profit: Number(profit.toFixed(2)),
      profitMargin: Number(margin.toFixed(1)),
    },
    details: {
      avgFarePerTrip: tripAnalytics.avgFare,
      avgDistance: tripAnalytics.avgDistance,
      revenueByService: tripAnalytics.revenueByService,
      expensesByCategory: expenseAnalytics.expensesByCategory,
    },
    alerts: anomalies.anomalies,
    recommendations: recommendations.recommendations,
  };
}
