import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month"); // YYYY-MM

  if (!month) {
    return NextResponse.json({ error: "month query param (YYYY-MM) is required" }, { status: 400 });
  }

  const monthDate = `${month}-01`;

  const { data: drivers } = await supabase.from("drivers").select("*").eq("status", "active");
  const { data: compensations } = await supabase
    .from("driver_compensation")
    .select("*")
    .eq("month", monthDate);

  const compensationByDriver = new Map((compensations ?? []).map((c) => [c.driver_id, c]));

  const results = (drivers ?? []).map((driver) => {
    const comp = compensationByDriver.get(driver.id);
    return {
      driver_id: driver.id,
      name: driver.name,
      base_salary: comp?.base_salary ?? driver.base_monthly_salary ?? 0,
      overtime_hours: comp?.overtime_hours ?? 0,
      overtime_pay: comp?.overtime_pay ?? 0,
      diet_allowance_total: comp?.diet_allowance_total ?? 0,
      total_compensation: comp?.total_compensation ?? driver.base_monthly_salary ?? 0,
      paid_status: comp?.paid_status ?? "pending",
    };
  });

  const grandTotal = results.reduce((sum, r) => sum + r.total_compensation, 0);

  return NextResponse.json({ month, drivers: results, grand_total: grandTotal });
}
