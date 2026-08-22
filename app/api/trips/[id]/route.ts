import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .select("*, services(name), drivers(name), vehicles(name)")
    .eq("id", id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ trip: data });
}

const TRIP_COLUMNS = [
  "date",
  "time",
  "service_id",
  "client_name",
  "client_phone",
  "pickup_address",
  "destination_address",
  "driver_id",
  "vehicle_id",
  "distance_km",
  "duration_minutes",
  "trip_type",
  "transportation_mode",
  "waiting_hours",
  "base_fare",
  "distance_cost",
  "duration_cost",
  "waiting_cost",
  "additional_fees",
  "total_fare",
  "status",
  "notes",
  "needs_wheelchair",
  "needs_stair_climber",
  "stair_climber_floor",
  "payment_status",
  "payment_method",
  "paid_amount",
  "payment_date",
] as const;

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const body = await request.json();

  // Whitelist to real trip columns — the client may include convenience fields (e.g. pickup_time)
  // that aren't actual DB columns, which would otherwise error out on update().
  const update: Record<string, unknown> = {};
  for (const key of TRIP_COLUMNS) {
    if (key in body) update[key] = body[key];
  }

  const { data, error } = await supabase.from("trips").update(update).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Log a payment_history entry whenever this save records money received.
  if ((update.payment_status === "paid" || update.payment_status === "partial") && Number(update.paid_amount) > 0) {
    await supabase.from("payment_history").insert({
      trip_id: id,
      amount: Number(update.paid_amount),
      payment_method: update.payment_method ?? data.payment_method,
      payment_date: (update.payment_date as string | undefined) ?? new Date().toISOString().slice(0, 10),
    });
  }

  return NextResponse.json({ trip: data });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { error } = await supabase.from("trips").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
