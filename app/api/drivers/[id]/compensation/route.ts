import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month"); // YYYY-MM

  const { data: driver, error: driverError } = await supabase.from("drivers").select("*").eq("id", id).single();
  if (driverError) return NextResponse.json({ error: driverError.message }, { status: 404 });

  let compensation = null;
  if (month) {
    const monthDate = `${month}-01`;
    const { data } = await supabase
      .from("driver_compensation")
      .select("*")
      .eq("driver_id", id)
      .eq("month", monthDate)
      .maybeSingle();
    compensation = data;
  }

  return NextResponse.json({ driver, compensation });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const body = await request.json();
  const {
    month,
    overtime_hours = 0,
    diet_allowance_morning_count = 0,
    diet_allowance_evening_count = 0,
    paid_status = "pending",
    payment_date,
    notes,
  } = body;

  const { data: driver, error: driverError } = await supabase.from("drivers").select("*").eq("id", id).single();
  if (driverError) return NextResponse.json({ error: driverError.message }, { status: 404 });

  const baseSalary = driver.base_monthly_salary ?? 0;
  const overtimePay = (driver.overtime_hourly_rate ?? 0) * Number(overtime_hours);
  const dietTotal =
    driver.diet_morning_allowance * Number(diet_allowance_morning_count) +
    driver.diet_evening_allowance * Number(diet_allowance_evening_count);
  const totalCompensation = baseSalary + overtimePay + dietTotal;

  const { data, error } = await supabase
    .from("driver_compensation")
    .upsert(
      {
        driver_id: id,
        month: `${month}-01`,
        base_salary: baseSalary,
        overtime_hours: Number(overtime_hours),
        overtime_pay: overtimePay,
        diet_allowance_morning_count: Number(diet_allowance_morning_count),
        diet_allowance_evening_count: Number(diet_allowance_evening_count),
        diet_allowance_total: dietTotal,
        total_compensation: totalCompensation,
        paid_status,
        payment_date,
        notes,
      },
      { onConflict: "driver_id,month" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
