import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SEED_TRIPS } from "@/lib/seed-trips-data";

export async function POST() {
  const supabase = await createClient();

  const { data: services } = await supabase.from("services").select("id, name");
  const serviceByName = new Map((services ?? []).map((s) => [s.name.toLowerCase(), s.id]));

  const { data: existingTrips } = await supabase.from("trips").select("date, total_fare, client_name");
  const existingKeys = new Set(
    (existingTrips ?? []).map((t) => `${t.date}|${t.total_fare}|${(t.client_name ?? "").toLowerCase()}`)
  );

  const toInsert: Record<string, unknown>[] = [];
  let skipped = 0;

  for (const trip of SEED_TRIPS) {
    const clientName = trip.client_name ?? "";
    const key = `${trip.date}|${trip.price}|${clientName.toLowerCase()}`;
    if (existingKeys.has(key)) {
      skipped++;
      continue;
    }
    existingKeys.add(key);

    toInsert.push({
      date: trip.date,
      time: "12:00:00",
      service_id: trip.service ? serviceByName.get(trip.service.toLowerCase()) ?? null : null,
      client_name: trip.client_name,
      pickup_address: "Imported record",
      destination_address: "Imported record",
      trip_type: "one-way",
      transportation_mode: "private",
      base_fare: trip.price,
      distance_cost: 0,
      duration_cost: 0,
      waiting_cost: 0,
      additional_fees: 0,
      total_fare: trip.price,
      status: "completed",
      notes: null,
    });
  }

  let imported = 0;
  if (toInsert.length > 0) {
    const { error } = await supabase.from("trips").insert(toInsert);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    imported = toInsert.length;
  }

  return NextResponse.json({
    total_records: SEED_TRIPS.length,
    imported,
    skipped,
  });
}
