import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const driverId = searchParams.get("driver_id");

  let query = supabase.from("overtime_entries").select("*").order("date", { ascending: false });
  if (driverId) query = query.eq("driver_id", driverId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  const { driver_id, date, hours, dieta_amount, notes } = body;

  if (!driver_id || !date) {
    return NextResponse.json({ error: "driver_id and date are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("overtime_entries")
    .insert({
      driver_id,
      date,
      hours: Number(hours) || 0,
      dieta_amount: Number(dieta_amount) || 0,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
