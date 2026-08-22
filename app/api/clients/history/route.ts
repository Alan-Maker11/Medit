import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name || !name.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const columns =
    "pickup_address, destination_address, driver_id, vehicle_id, service_id, total_fare, client_phone, trip_type, transportation_mode, waiting_hours, additional_fees, distance_km, duration_minutes, needs_wheelchair, needs_stair_climber, stair_climber_floor";

  // Prefer the most recent trip that actually has a usable fare recorded — some historical/imported
  // rows have no total_fare, and using one of those would silently leave the fare field empty.
  const { data: withFare, error: fareError } = await supabase
    .from("trips")
    .select(columns)
    .ilike("client_name", name.trim())
    .not("total_fare", "is", null)
    .order("date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fareError) return NextResponse.json({ error: fareError.message }, { status: 400 });
  if (withFare) return NextResponse.json(withFare);

  // Fall back to the most recent trip regardless of fare, so addresses/driver/vehicle still autofill
  const { data, error } = await supabase
    .from("trips")
    .select(columns)
    .ilike("client_name", name.trim())
    .order("date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data ?? null);
}
