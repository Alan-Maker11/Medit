import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateFare } from "@/lib/fare";
import { nowLocalTime } from "@/lib/date";
import { notifyDriver, tripAssignedNotification } from "@/lib/push-notifications";

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
    manual_total_fare,
    notes,
    needs_wheelchair,
    needs_stair_climber,
    stair_climber_floor,
  } = body;

  if (!date || !pickup_address) {
    return NextResponse.json({ error: "Missing required trip fields" }, { status: 400 });
  }

  // Subir/Bajar trips have no destination or distance — total is just equipment/transport fees
  const isSubirBajar = !destination_address || destination_address.trim() === "";
  const hasManualOverride = manual_total_fare != null && manual_total_fare !== "" && !Number.isNaN(Number(manual_total_fare));

  let fare;
  if (isSubirBajar) {
    fare = {
      distanceKm: 0,
      durationMinutes: 0,
      baseFare: 0,
      distanceCost: 0,
      durationCost: 0,
      waitingCost: 0,
      additionalFees: Number(additional_fees ?? 0),
      totalFare: Number(additional_fees ?? 0),
    };
  } else if (hasManualOverride) {
    // A manually entered total takes priority over any distance/duration-based calculation
    const total = Number(manual_total_fare);
    const fees = Number(additional_fees ?? 0);
    fare = {
      distanceKm: Number(distance_km) || 0,
      durationMinutes: Number(duration_minutes) || 0,
      baseFare: total - fees,
      distanceCost: 0,
      durationCost: 0,
      waitingCost: 0,
      additionalFees: fees,
      totalFare: total,
    };
  } else {
    fare = calculateFare({
      distanceKm: Number(distance_km),
      durationMinutes: Number(duration_minutes),
      tripType: trip_type,
      mode: transportation_mode || "private",
      waitingHours: Number(waiting_hours ?? 0),
      additionalFees: Number(additional_fees ?? 0),
    });
  }

  const { data, error } = await supabase
    .from("trips")
    .insert({
      date,
      time: time || nowLocalTime(),
      service_id: service_id || null,
      client_name,
      client_phone,
      pickup_address,
      destination_address,
      driver_id: driver_id || null,
      vehicle_id: vehicle_id || null,
      distance_km: Math.round(fare.distanceKm * 10) / 10,
      duration_minutes: Math.round(fare.durationMinutes),
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
      needs_wheelchair: Boolean(needs_wheelchair),
      needs_stair_climber: Boolean(needs_stair_climber),
      stair_climber_floor: Number(stair_climber_floor) || 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (client_name && client_name.trim()) {
    const { data: existing } = await supabase
      .from("clients")
      .select("id")
      .ilike("name", client_name.trim())
      .maybeSingle();

    const clientPayload = {
      name: client_name.trim(),
      phone: client_phone || null,
      last_service_id: data.service_id,
      last_total_fare: data.total_fare,
      last_trip_date: data.date,
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      await supabase.from("clients").update(clientPayload).eq("id", existing.id);
    } else {
      await supabase.from("clients").insert(clientPayload);
    }
  }

  if (data.driver_id) {
    notifyDriver(data.driver_id, tripAssignedNotification(data)).catch((err) =>
      console.error("Failed to send trip-assigned push notification:", err)
    );
  }

  return NextResponse.json(data, { status: 201 });
}

export async function DELETE() {
  const supabase = await createClient();
  const { error } = await supabase.from("trips").delete().gte("date", "1900-01-01");
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
