import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function assertStaff(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return false;
  // Driver accounts must never call this route either
  const { data: driverAccount } = await supabase
    .from("driver_accounts")
    .select("id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  return !driverAccount;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("driver_accounts").select("id, status").eq("driver_id", id).maybeSingle();
  return NextResponse.json({ hasAccount: !!data, status: data?.status ?? null });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: driverId } = await params;
  const isStaff = await assertStaff(request);
  if (!isStaff) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is not configured on the server" },
      { status: 500 }
    );
  }

  const supabase = await createClient();
  const { data: existing } = await supabase.from("driver_accounts").select("id").eq("driver_id", driverId).maybeSingle();
  if (existing) {
    return NextResponse.json({ error: "This driver already has a portal login" }, { status: 400 });
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    return NextResponse.json({ error: createError?.message ?? "Failed to create login" }, { status: 400 });
  }

  const { error: linkError } = await admin.from("driver_accounts").insert({
    user_id: created.user.id,
    driver_id: driverId,
    status: "active",
  });

  if (linkError) {
    // Roll back the auth user so we don't leave an orphaned login
    await admin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json({ error: linkError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: driverId } = await params;
  const isStaff = await assertStaff(request);
  if (!isStaff) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is not configured on the server" },
      { status: 500 }
    );
  }

  const { data: account } = await admin.from("driver_accounts").select("id, user_id").eq("driver_id", driverId).maybeSingle();
  if (!account) return NextResponse.json({ error: "No portal login found for this driver" }, { status: 404 });

  await admin.from("driver_accounts").delete().eq("id", account.id);
  await admin.auth.admin.deleteUser(account.user_id);

  return NextResponse.json({ success: true });
}
