import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("drivers").select("*").order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ drivers: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  const {
    name,
    phone,
    email,
    base_monthly_salary,
    overtime_hourly_rate,
    diet_morning_allowance,
    diet_evening_allowance,
    status,
    start_date,
    is_meditiko,
  } = body;

  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });

  const { data, error } = await supabase
    .from("drivers")
    .insert({
      name,
      phone,
      email,
      base_monthly_salary: base_monthly_salary ? Number(base_monthly_salary) : null,
      overtime_hourly_rate: overtime_hourly_rate ? Number(overtime_hourly_rate) : null,
      diet_morning_allowance: diet_morning_allowance ? Number(diet_morning_allowance) : 100,
      diet_evening_allowance: diet_evening_allowance ? Number(diet_evening_allowance) : 200,
      status: status || "active",
      start_date: start_date || null,
      is_meditiko: Boolean(is_meditiko),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
