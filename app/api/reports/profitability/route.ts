import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const vehicleId = searchParams.get("vehicle_id");

  let tripsQuery = supabase.from("trips").select("total_fare, distance_km, vehicle_id");
  let expensesQuery = supabase.from("expenses").select("amount, vehicle_id");

  if (vehicleId) {
    tripsQuery = tripsQuery.eq("vehicle_id", vehicleId);
    expensesQuery = expensesQuery.eq("vehicle_id", vehicleId);
  }

  const [{ data: trips }, { data: expenses }] = await Promise.all([tripsQuery, expensesQuery]);

  const revenue = (trips ?? []).reduce((sum, t) => sum + (t.total_fare ?? 0), 0);
  const totalExpenses = (expenses ?? []).reduce((sum, e) => sum + (e.amount ?? 0), 0);
  const totalKm = (trips ?? []).reduce((sum, t) => sum + (t.distance_km ?? 0), 0);
  const profit = revenue - totalExpenses;

  return NextResponse.json({
    revenue,
    expenses: totalExpenses,
    profit,
    profit_margin: revenue > 0 ? Number(((profit / revenue) * 100).toFixed(1)) : 0,
    cost_per_km: totalKm > 0 ? Number((totalExpenses / totalKm).toFixed(2)) : 0,
    trip_count: trips?.length ?? 0,
  });
}
