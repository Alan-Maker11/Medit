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
