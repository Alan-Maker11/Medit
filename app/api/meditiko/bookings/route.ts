import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const driverId = searchParams.get("driver_id");
  const status = searchParams.get("status");

  let query = supabase
    .from("meditiko_bookings")
    .select("*, drivers(name)")
    .order("created_at", { ascending: false });

  if (date) query = query.gte("created_at", `${date}T00:00:00`).lt("created_at", `${date}T23:59:59.999`);
  if (driverId) query = query.eq("assigned_driver_id", driverId);
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

// No auth required — this is called from the public /meditiko/calculator page.
// RLS on meditiko_bookings allows inserts from anyone but restricts reads/writes to staff.
export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  const {
    passenger_name,
    passenger_phone,
    pickup_address,
    destination_address,
    trip_distance_km,
    estimated_duration_minutes,
    trip_type,
    waiting_hours,
    estimated_price,
  } = body;

  if (!passenger_name || !passenger_phone || !pickup_address || !destination_address || !trip_distance_km) {
    return NextResponse.json({ error: "Missing required booking fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("meditiko_bookings")
    .insert({
      passenger_name,
      passenger_phone,
      pickup_address,
      destination_address,
      trip_distance_km: Number(trip_distance_km),
      estimated_duration_minutes: Number(estimated_duration_minutes) || 0,
      trip_type: trip_type === "round_trip" ? "round_trip" : "one_way",
      waiting_hours: Number(waiting_hours) || 0,
      estimated_price: Number(estimated_price) || 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
