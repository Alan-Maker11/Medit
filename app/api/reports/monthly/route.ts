import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStairClimberPrice } from "@/lib/fare";

const WHEELCHAIR_FEE = 350;

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
    .select(
      "id, date, total_fare, trip_type, needs_wheelchair, needs_stair_climber, stair_climber_floor, services(name), vehicles(name), drivers(name)"
    )
    .gte("date", monthStart)
    .lt("date", monthEnd)
    .order("date", { ascending: true });

  const { data: expenses } = await supabase
    .from("expenses")
    .select("id, date, amount, category, vehicles(name)")
    .gte("date", monthStart)
    .lt("date", monthEnd)
    .order("date", { ascending: true });

  // Driver payroll: fixed monthly base salaries (not tied to a specific day) plus
  // per-day overtime/dieta/elevator entries — both count as real payroll cost that
  // must reduce profit just like any other expense.
  const { data: activeDrivers } = await supabase
    .from("drivers")
    .select("id, base_monthly_salary, overtime_hourly_rate")
    .eq("status", "active");

  const { data: overtimeEntries } = await supabase
    .from("overtime_entries")
    .select("driver_id, date, hours, dieta_amount, elevator_amount")
    .gte("date", monthStart)
    .lt("date", monthEnd);

  const driverRateById = new Map((activeDrivers ?? []).map((d) => [d.id, d.overtime_hourly_rate ?? 0]));
  const baseSalaryTotal = (activeDrivers ?? []).reduce((sum, d) => sum + (d.base_monthly_salary ?? 0), 0);

  // Build day-by-day map
  const daysInMonth = new Date(year, mon, 0).getDate();
  const dayMap = new Map<string, { trips: number; revenue: number; expenses: number; salary_extras: number }>();
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${month}-${String(d).padStart(2, "0")}`;
    dayMap.set(key, { trips: 0, revenue: 0, expenses: 0, salary_extras: 0 });
  }
  for (const t of trips ?? []) {
    const day = dayMap.get(t.date);
    if (day) { day.trips += 1; day.revenue += t.total_fare ?? 0; }
  }
  for (const e of expenses ?? []) {
    const day = dayMap.get(e.date);
    if (day) { day.expenses += e.amount ?? 0; }
  }
  for (const e of overtimeEntries ?? []) {
    const day = dayMap.get(e.date);
    if (!day) continue;
    const rate = driverRateById.get(e.driver_id) ?? 0;
    day.salary_extras += Number(e.hours ?? 0) * rate + Number(e.dieta_amount ?? 0) + Number(e.elevator_amount ?? 0);
  }

  const salaryExtrasTotal = [...dayMap.values()].reduce((sum, d) => sum + d.salary_extras, 0);
  const salaryTotal = baseSalaryTotal + salaryExtrasTotal;

  const days = [...dayMap.entries()].map(([date, d]) => ({
    date,
    trip_count: d.trips,
    revenue: d.revenue,
    expenses: d.expenses,
    salary: d.salary_extras,
    net: d.revenue - d.expenses - d.salary_extras,
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
  const profit = revenue - totalExpenses - salaryTotal;

  // Equipment income: trips don't store an itemized fee per add-on, so this is
  // reconstructed from the flags using the same pricing rules used when the fare
  // was originally calculated (wheelchair flat 350, stairs by floor, both doubled
  // on round-trips).
  const wheelchairTrips = (trips ?? []).filter((t) => t.needs_wheelchair);
  const stairTrips = (trips ?? []).filter((t) => t.needs_stair_climber);
  const wheelchairIncome = wheelchairTrips.length * WHEELCHAIR_FEE;
  const stairIncome = stairTrips.reduce((sum, t) => {
    const multiplier = t.trip_type === "round-trip" ? 2 : 1;
    return sum + getStairClimberPrice(t.stair_climber_floor ?? 0) * multiplier;
  }, 0);

  return NextResponse.json({
    month,
    days,
    summary: {
      revenue,
      expenses: totalExpenses,
      salary: salaryTotal,
      base_salary_total: baseSalaryTotal,
      salary_extras_total: salaryExtrasTotal,
      profit,
      profit_margin: revenue > 0 ? Number(((profit / revenue) * 100).toFixed(1)) : 0,
      trip_count: trips?.length ?? 0,
      average_fare: trips && trips.length > 0 ? Math.round(revenue / trips.length) : 0,
      wheelchair_trip_count: wheelchairTrips.length,
      wheelchair_income: wheelchairIncome,
      stair_climber_trip_count: stairTrips.length,
      stair_climber_income: stairIncome,
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
