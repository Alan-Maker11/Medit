import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function getDriverId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;
  const { data: driverAccount } = await supabase
    .from("driver_accounts")
    .select("driver_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();
  return driverAccount?.driver_id ?? null;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const driverId = await getDriverId(supabase);
  if (!driverId) return NextResponse.json({ error: "Not a driver account" }, { status: 403 });

  const body = await request.json();
  const { endpoint, keys } = body as { endpoint: string; keys: { p256dh: string; auth: string } };
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }

  const { error } = await supabase
    .from("driver_push_subscriptions")
    .upsert(
      { driver_id: driverId, endpoint, p256dh: keys.p256dh, auth: keys.auth },
      { onConflict: "endpoint" }
    );
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const driverId = await getDriverId(supabase);
  if (!driverId) return NextResponse.json({ error: "Not a driver account" }, { status: 403 });

  const { endpoint } = await request.json();
  if (!endpoint) return NextResponse.json({ error: "endpoint is required" }, { status: 400 });

  const { error } = await supabase
    .from("driver_push_subscriptions")
    .delete()
    .eq("driver_id", driverId)
    .eq("endpoint", endpoint);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
