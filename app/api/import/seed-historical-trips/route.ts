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

  await backfillClients(supabase);

  return NextResponse.json({
    total_records: SEED_TRIPS.length,
    imported,
    skipped,
  });
}

async function backfillClients(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: trips } = await supabase
    .from("trips")
    .select("client_name, service_id, total_fare, date")
    .not("client_name", "is", null)
    .order("date", { ascending: true });

  const latestByName = new Map<string, { client_name: string; service_id: string | null; total_fare: number | null; date: string }>();
  for (const t of trips ?? []) {
    const name = (t.client_name ?? "").trim();
    if (!name) continue;
    latestByName.set(name.toLowerCase(), {
      client_name: name,
      service_id: t.service_id,
      total_fare: t.total_fare,
      date: t.date,
    });
  }

  if (latestByName.size === 0) return;

  const { data: existingClients } = await supabase.from("clients").select("id, name");
  const existingByLowerName = new Map((existingClients ?? []).map((c) => [c.name.toLowerCase(), c.id]));

  const toInsert: Record<string, unknown>[] = [];
  for (const [lowerName, latest] of latestByName) {
    if (existingByLowerName.has(lowerName)) continue;
    toInsert.push({
      name: latest.client_name,
      last_service_id: latest.service_id,
      last_total_fare: latest.total_fare,
      last_trip_date: latest.date,
    });
  }

  if (toInsert.length > 0) {
    await supabase.from("clients").insert(toInsert);
  }
}
