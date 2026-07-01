import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month"); // YYYY-MM

  if (!month) {
    return NextResponse.json({ error: "month query param (YYYY-MM) is required" }, { status: 400 });
  }

  const monthStart = `${month}-01`;
  // Last day of month: go to first of next month then subtract a day via string comparison
  const [year, mon] = month.split("-").map(Number);
  const nextMonth = mon === 12 ? `${year + 1}-01` : `${year}-${String(mon + 1).padStart(2, "0")}`;
  const monthEnd = `${nextMonth}-01`; // exclusive upper bound using lt

  const { data: drivers } = await supabase.from("drivers").select("*").eq("status", "active");

  const { data: entries } = await supabase
    .from("overtime_entries")
    .select("*")
    .gte("date", monthStart)
    .lt("date", `${nextMonth}-01`);

  const entryByDriver = new Map<string, { hours: number; overtime_pay: number; dieta: number; elevator: number }>();
  for (const driver of drivers ?? []) {
    entryByDriver.set(driver.id, { hours: 0, overtime_pay: 0, dieta: 0, elevator: 0 });
  }
  for (const e of entries ?? []) {
    const acc = entryByDriver.get(e.driver_id);
    if (!acc) continue;
    const hours = Number(e.hours) || 0;
    const driver = (drivers ?? []).find((d) => d.id === e.driver_id);
    const rate = driver?.overtime_hourly_rate ?? 0;
    acc.hours += hours;
    acc.overtime_pay += hours * rate;
    acc.dieta += Number(e.dieta_amount) || 0;
    acc.elevator += Number(e.elevator_amount) || 0;
  }

  const results = (drivers ?? []).map((driver) => {
    const acc = entryByDriver.get(driver.id) ?? { hours: 0, overtime_pay: 0, dieta: 0, elevator: 0 };
    const base = driver.base_monthly_salary ?? 0;
    const total = base + acc.overtime_pay + acc.dieta + acc.elevator;
    return {
      driver_id: driver.id,
      name: driver.name,
      base_salary: base,
      overtime_hours: acc.hours,
      overtime_pay: acc.overtime_pay,
      diet_allowance_total: acc.dieta,
      elevator_total: acc.elevator,
      total_compensation: total,
    };
  });

  const grandTotal = results.reduce((sum, r) => sum + r.total_compensation, 0);

  return NextResponse.json({ month, drivers: results, grand_total: grandTotal });
}
