import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MEDITIKO_DRIVER_COMMISSION_RATE } from "@/lib/fare";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: driverAccount } = await supabase
    .from("driver_accounts")
    .select("driver_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (!driverAccount) return NextResponse.json({ error: "Not a driver account" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month") ?? new Date().toISOString().slice(0, 7);

  const { data: driver, error: driverError } = await supabase
    .from("drivers")
    .select("name, base_monthly_salary, overtime_hourly_rate, is_meditiko")
    .eq("id", driverAccount.driver_id)
    .single();
  if (driverError || !driver) return NextResponse.json({ error: "Driver not found" }, { status: 404 });

  // Meditiko drivers are paid base + 20% commission per client, but must never see the
  // computed dollar amounts — only their rate and base salary. No entries are returned.
  if (driver.is_meditiko) {
    return NextResponse.json({
      month,
      isMeditiko: true,
      driver: {
        name: driver.name,
        baseMonthlySalary: driver.base_monthly_salary ?? 0,
        commissionRate: MEDITIKO_DRIVER_COMMISSION_RATE,
      },
      entries: [],
    });
  }

  const monthStart = `${month}-01`;
  const [year, mon] = month.split("-").map(Number);
  const nextMonth = mon === 12 ? `${year + 1}-01-01` : `${year}-${String(mon + 1).padStart(2, "0")}-01`;

  const { data: entries, error: entriesError } = await supabase
    .from("overtime_entries")
    .select("date, hours, dieta_amount, elevator_amount")
    .eq("driver_id", driverAccount.driver_id)
    .gte("date", monthStart)
    .lt("date", nextMonth)
    .order("date", { ascending: true });
  if (entriesError) return NextResponse.json({ error: entriesError.message }, { status: 400 });

  return NextResponse.json({
    month,
    driver: {
      name: driver.name,
      baseMonthlySalary: driver.base_monthly_salary ?? 0,
      overtimeHourlyRate: driver.overtime_hourly_rate ?? 0,
    },
    entries: entries ?? [],
  });
}
