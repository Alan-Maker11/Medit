import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MEDITIKO_DRIVER_COMMISSION_RATE } from "@/lib/fare";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const driverId = searchParams.get("driver_id");

  let query = supabase.from("meditiko_driver_earnings").select("*").order("date", { ascending: false });
  if (driverId) query = query.eq("driver_id", driverId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  const { driver_id, client_name, date, gross_amount, notes } = body;

  if (!driver_id || !client_name || !date) {
    return NextResponse.json({ error: "driver_id, client_name and date are required" }, { status: 400 });
  }

  const gross = Number(gross_amount) || 0;

  const { data, error } = await supabase
    .from("meditiko_driver_earnings")
    .upsert(
      {
        driver_id,
        client_name,
        date,
        gross_amount: gross,
        amount: Math.round(gross * MEDITIKO_DRIVER_COMMISSION_RATE * 100) / 100,
        notes: notes || null,
      },
      { onConflict: "driver_id,client_name,date" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
