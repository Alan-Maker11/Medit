import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { startOfWeek, endOfWeek, formatISO } from "date-fns";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const weekOf = searchParams.get("week_of");
  const reference = weekOf ? new Date(weekOf) : new Date();

  const periodStart = formatISO(startOfWeek(reference), { representation: "date" });
  const periodEnd = formatISO(endOfWeek(reference), { representation: "date" });

  const { data: trips } = await supabase
    .from("trips")
    .select("total_fare, date, services(name), vehicles(name), drivers(name)")
    .gte("date", periodStart)
    .lte("date", periodEnd);

  const { data: expenses } = await supabase
    .from("expenses")
    .select("amount, category, date, vehicles(name)")
    .gte("date", periodStart)
    .lte("date", periodEnd);

  const revenue = (trips ?? []).reduce((sum, t) => sum + (t.total_fare ?? 0), 0);
  const totalExpenses = (expenses ?? []).reduce((sum, e) => sum + (e.amount ?? 0), 0);
  const profit = revenue - totalExpenses;

  const groupSum = <T,>(items: T[], keyFn: (item: T) => string, valueFn: (item: T) => number) => {
    const map: Record<string, number> = {};
    for (const item of items) {
      const key = keyFn(item);
      map[key] = (map[key] ?? 0) + valueFn(item);
    }
    return map;
  };

  const byService = groupSum(
    trips ?? [],
    (t) => (t.services as unknown as { name: string } | null)?.name ?? "Unknown",
    (t) => t.total_fare ?? 0
  );
  const byVehicleRevenue = groupSum(
    trips ?? [],
    (t) => (t.vehicles as unknown as { name: string } | null)?.name ?? "Unassigned",
    (t) => t.total_fare ?? 0
  );
  const byDriver = groupSum(
    trips ?? [],
    (t) => (t.drivers as unknown as { name: string } | null)?.name ?? "Unassigned",
    (t) => t.total_fare ?? 0
  );
  const byCategory = groupSum(
    expenses ?? [],
    (e) => e.category,
    (e) => e.amount ?? 0
  );
  const byVehicleExpense = groupSum(
    expenses ?? [],
    (e) => (e.vehicles as unknown as { name: string } | null)?.name ?? "Unassigned",
    (e) => e.amount ?? 0
  );

  return NextResponse.json({
    period_start: periodStart,
    period_end: periodEnd,
    revenue,
    expenses: totalExpenses,
    profit,
    profit_margin: revenue > 0 ? Number(((profit / revenue) * 100).toFixed(1)) : 0,
    trip_count: trips?.length ?? 0,
    average_fare: trips && trips.length > 0 ? Math.round(revenue / trips.length) : 0,
    by_service: byService,
    by_vehicle_revenue: byVehicleRevenue,
    by_vehicle_expense: byVehicleExpense,
    by_driver: byDriver,
    by_expense_category: byCategory,
  });
}
