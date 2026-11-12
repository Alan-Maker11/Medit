import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_STATUSES = ["pending", "completed"] as const;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: driverAccount } = await supabase
    .from("driver_accounts")
    .select("driver_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();
  if (!driverAccount) return NextResponse.json({ error: "Not a driver account" }, { status: 403 });

  const { status, leg } = await request.json();
  if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  if (leg !== undefined && !["down", "up"].includes(leg)) {
    return NextResponse.json({ error: "Invalid leg" }, { status: 400 });
  }

  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select("id, driver_id, return_time, down_completed_at, up_completed_at")
    .eq("id", id)
    .single();
  if (tripError || !trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  if (trip.driver_id !== driverAccount.driver_id) {
    return NextResponse.json({ error: "This trip is not assigned to you" }, { status: 403 });
  }

  // Trips with a return_time are two-leg jobs (e.g. Subir/Bajar: drop off now, pick back up
  // hours later) — each leg is marked separately, and the trip only becomes "completed" once
  // both legs are done, so a driver can't accidentally close out the job after the first leg.
  const update: Record<string, unknown> = {};
  if (leg === "down") update.down_completed_at = trip.down_completed_at ? null : new Date().toISOString();
  if (leg === "up") update.up_completed_at = trip.up_completed_at ? null : new Date().toISOString();
  if (status !== undefined) update.status = status;

  if (trip.return_time && leg) {
    const downDone = leg === "down" ? Boolean(update.down_completed_at) : Boolean(trip.down_completed_at);
    const upDone = leg === "up" ? Boolean(update.up_completed_at) : Boolean(trip.up_completed_at);
    update.status = downDone && upDone ? "completed" : "pending";
  }

  const { data: updated, error: updateError } = await supabase
    .from("trips")
    .update(update)
    .eq("id", id)
    .select()
    .single();
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });

  return NextResponse.json({ trip: updated });
}
