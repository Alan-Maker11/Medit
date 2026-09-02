import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const body = await request.json();
  const { data, error } = await supabase.from("drivers").update(body).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ driver: data });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // trips.driver_id has no ON DELETE behavior, so unassign the driver from their
  // trips first (keeping trip history) before removing the driver row. Related
  // rows in overtime_entries, driver_uber_earnings, meditiko_driver_earnings,
  // driver_vehicles, and driver_accounts cascade-delete automatically.
  const { error: unassignError } = await supabase.from("trips").update({ driver_id: null }).eq("driver_id", id);
  if (unassignError) return NextResponse.json({ error: unassignError.message }, { status: 400 });

  const { error } = await supabase.from("drivers").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
