import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  let query = supabase.from("expenses").select("*, vehicles(name)").order("date", { ascending: false });

  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");
  const category = searchParams.get("category");
  const vehicleId = searchParams.get("vehicle_id");

  if (startDate) query = query.gte("date", startDate);
  if (endDate) query = query.lte("date", endDate);
  if (category) query = query.eq("category", category);
  if (vehicleId) query = query.eq("vehicle_id", vehicleId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ expenses: data, total: data?.length ?? 0 });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();

  const { date, category, vehicle_id, amount, km_at_fill, description } = body;
  if (!date || !category || amount == null) {
    return NextResponse.json({ error: "date, category and amount are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("expenses")
    .insert({
      date,
      category,
      vehicle_id: vehicle_id || null,
      amount: Number(amount),
      km_at_fill: km_at_fill ? Number(km_at_fill) : null,
      description,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
