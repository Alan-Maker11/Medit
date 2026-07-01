import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month"); // YYYY-MM

  if (!month) {
    return NextResponse.json({ error: "month query param (YYYY-MM) is required" }, { status: 400 });
  }

  const [year, mon] = month.split("-").map(Number);
  const monthStart = `${month}-01`;
  const nextMonthStr = mon === 12 ? `${year + 1}-01` : `${year}-${String(mon + 1).padStart(2, "0")}`;
  const monthEnd = `${nextMonthStr}-01`; // exclusive

  const { data: trips } = await supabase
    .from("trips")
    .select("id, date, total_fare, services(name), vehicles(name), drivers(name)")
    .gte("date", monthStart)
    .lt("date", monthEnd)
    .order("date", { ascending: true });

  const { data: expenses } = await supabase
    .from("expenses")
    .select("id, date, amount, category, vehicles(name)")
    .gte("date", monthStart)
    .lt("date", monthEnd)
    .order("date", { ascending: true });

  // Build day-by-day map
  const daysInMonth = new Date(year, mon, 0).getDate();
  const dayMap = new Map<string, { trips: number; revenue: number; expenses: number }>();
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${month}-${String(d).padStart(2, "0")}`;
    dayMap.set(key, { trips: 0, revenue: 0, expenses: 0 });
  }
  for (const t of trips ?? []) {
    const day = dayMap.get(t.date);
    if (day) { day.trips += 1; day.revenue += t.total_fare ?? 0; }
  }
  for (const e of expenses ?? []) {
    const day = dayMap.get(e.date);
    if (day) { day.expenses += e.amount ?? 0; }
  }

  const days = [...dayMap.entries()].map(([date, d]) => ({
    date,
    trip_count: d.trips,
    revenue: d.revenue,
    expenses: d.expenses,
    net: d.revenue - d.expenses,
  }));

  // Summary breakdowns
  const groupSum = <T,>(items: T[], keyFn: (item: T) => string, valueFn: (item: T) => number) => {
    const map: Record<string, number> = {};
    for (const item of items) {
      const key = keyFn(item);
      map[key] = (map[key] ?? 0) + valueFn(item);
    }
    return map;
  };

  const revenue = (trips ?? []).reduce((sum, t) => sum + (t.total_fare ?? 0), 0);
  const totalExpenses = (expenses ?? []).reduce((sum, e) => sum + (e.amount ?? 0), 0);

  return NextResponse.json({
    month,
    days,
    summary: {
      revenue,
      expenses: totalExpenses,
      profit: revenue - totalExpenses,
      profit_margin: revenue > 0 ? Number((((revenue - totalExpenses) / revenue) * 100).toFixed(1)) : 0,
      trip_count: trips?.length ?? 0,
      average_fare: trips && trips.length > 0 ? Math.round(revenue / trips.length) : 0,
      by_service: groupSum(
        trips ?? [],
        (t) => (t.services as unknown as { name: string } | null)?.name ?? "Unknown",
        (t) => t.total_fare ?? 0
      ),
      by_driver: groupSum(
        trips ?? [],
        (t) => (t.drivers as unknown as { name: string } | null)?.name ?? "Unassigned",
        (t) => t.total_fare ?? 0
      ),
      by_vehicle_revenue: groupSum(
        trips ?? [],
        (t) => (t.vehicles as unknown as { name: string } | null)?.name ?? "Unassigned",
        (t) => t.total_fare ?? 0
      ),
      by_expense_category: groupSum(
        expenses ?? [],
        (e) => e.category,
        (e) => e.amount ?? 0
      ),
    },
  });
}
