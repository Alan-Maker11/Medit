import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("vehicles").select("*").order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ vehicles: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  const { name, type, license_plate, fuel_consumption, current_km, status, purchase_date, notes } = body;

  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });

  const { data, error } = await supabase
    .from("vehicles")
    .insert({
      name,
      type,
      license_plate,
      fuel_consumption: fuel_consumption ? Number(fuel_consumption) : null,
      current_km: current_km ? Number(current_km) : null,
      status: status || "active",
      purchase_date: purchase_date || null,
      notes,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
