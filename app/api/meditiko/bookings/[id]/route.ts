import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const body = await request.json();

  const update: Record<string, unknown> = {};
  if ("assigned_driver_id" in body) update.assigned_driver_id = body.assigned_driver_id || null;
  if ("status" in body) update.status = body.status;
  if ("notes" in body) update.notes = body.notes || null;

  // Assigning a driver to a pending booking naturally confirms it.
  if (update.assigned_driver_id && !("status" in body)) update.status = "confirmed";

  const { data, error } = await supabase
    .from("meditiko_bookings")
    .update(update)
    .eq("id", id)
    .select("*, drivers(name)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { error } = await supabase.from("meditiko_bookings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
