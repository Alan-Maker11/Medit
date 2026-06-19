import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateFare } from "@/lib/fare";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  let query = supabase
    .from("trips")
    .select("*, services(name), drivers(name), vehicles(name)")
    .order("date", { ascending: false });

  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");
  const status = searchParams.get("status");
  const driverId = searchParams.get("driver_id");

  if (startDate) query = query.gte("date", startDate);
  if (endDate) query = query.lte("date", endDate);
  if (status) query = query.eq("status", status);
  if (driverId) query = query.eq("driver_id", driverId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ trips: data, total: data?.length ?? 0 });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();

  const {
    date,
    time,
    service_id,
    client_name,
    client_phone,
    pickup_address,
    destination_address,
    driver_id,
    vehicle_id,
    distance_km,
    duration_minutes,
    trip_type,
    transportation_mode,
    waiting_hours,
    additional_fees,
    notes,
  } = body;

  if (!date || !pickup_address || !destination_address || distance_km == null || duration_minutes == null) {
    return NextResponse.json({ error: "Missing required trip fields" }, { status: 400 });
  }

  const fare = calculateFare({
    distanceKm: Number(distance_km),
    durationMinutes: Number(duration_minutes),
    tripType: trip_type,
    waitingHours: Number(waiting_hours ?? 0),
    additionalFees: Number(additional_fees ?? 0),
  });

  const { data, error } = await supabase
    .from("trips")
    .insert({
      date,
      time: time || new Date().toISOString().slice(11, 19),
      service_id,
      client_name,
      client_phone,
      pickup_address,
      destination_address,
      driver_id,
      vehicle_id,
      distance_km: fare.distanceKm,
      duration_minutes: fare.durationMinutes,
      trip_type,
      transportation_mode: transportation_mode || "private",
      waiting_hours: waiting_hours ?? 0,
      base_fare: fare.baseFare,
      distance_cost: fare.distanceCost,
      duration_cost: fare.durationCost,
      waiting_cost: fare.waitingCost,
      additional_fees: fare.additionalFees,
      total_fare: fare.totalFare,
      notes,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
