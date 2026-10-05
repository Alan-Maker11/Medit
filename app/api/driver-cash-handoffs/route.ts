import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const driverId = searchParams.get("driver_id");

  let query = supabase.from("driver_cash_handoffs").select("*").order("date", { ascending: false });
  if (driverId) query = query.eq("driver_id", driverId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  const { driver_id, date, amount, used_for, bank_account, notes } = body;

  if (!driver_id || !amount || Number(amount) <= 0) {
    return NextResponse.json({ error: "driver_id and a positive amount are required" }, { status: 400 });
  }
  if (!["gas", "salary", "bank_deposit", "other"].includes(used_for)) {
    return NextResponse.json({ error: "used_for is required" }, { status: 400 });
  }
  if (used_for === "bank_deposit" && !bank_account) {
    return NextResponse.json({ error: "bank_account is required when used_for is bank_deposit" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("driver_cash_handoffs")
    .insert({
      driver_id,
      date: date || new Date().toISOString().slice(0, 10),
      amount: Number(amount),
      used_for,
      bank_account: used_for === "bank_deposit" ? bank_account : null,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
