import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  if (!search || search.trim().length < 2) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from("clients")
    .select("id, name, phone, last_service_id, last_total_fare, last_trip_date, services(name)")
    .ilike("name", `%${search.trim()}%`)
    .order("last_trip_date", { ascending: false })
    .limit(10);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const clients = (data ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    last_service_id: c.last_service_id,
    last_service_name: (c.services as unknown as { name: string } | null)?.name ?? null,
    last_total_fare: c.last_total_fare,
    last_trip_date: c.last_trip_date,
  }));

  return NextResponse.json(clients);
}
