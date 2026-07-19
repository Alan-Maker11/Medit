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

  const { status } = await request.json();
  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select("id, driver_id")
    .eq("id", id)
    .single();
  if (tripError || !trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  if (trip.driver_id !== driverAccount.driver_id) {
    return NextResponse.json({ error: "This trip is not assigned to you" }, { status: 403 });
  }

  const { data: updated, error: updateError } = await supabase
    .from("trips")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });

  return NextResponse.json({ trip: updated });
}
