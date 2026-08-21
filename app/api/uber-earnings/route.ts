import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const driverId = searchParams.get("driver_id");

  let query = supabase.from("driver_uber_earnings").select("*").order("date", { ascending: false });
  if (driverId) query = query.eq("driver_id", driverId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  const { driver_id, date, amount, notes } = body;

  if (!driver_id || !date) {
    return NextResponse.json({ error: "driver_id and date are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("driver_uber_earnings")
    .upsert(
      {
        driver_id,
        date,
        amount: Number(amount) || 0,
        notes: notes || null,
      },
      { onConflict: "driver_id,date" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
