import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month"); // YYYY-MM

  let query = supabase.from("meditiko_expenses").select("*").order("date", { ascending: false });
  if (month) {
    const [year, mon] = month.split("-").map(Number);
    const monthStart = `${month}-01`;
    const nextMonth = mon === 12 ? `${year + 1}-01` : `${year}-${String(mon + 1).padStart(2, "0")}`;
    query = query.gte("date", monthStart).lt("date", `${nextMonth}-01`);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  const { date, category, description, amount, driver_id, notes } = body;

  if (!date || !category || !description || amount == null) {
    return NextResponse.json({ error: "date, category, description and amount are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("meditiko_expenses")
    .insert({
      date,
      category,
      description,
      amount: Number(amount),
      driver_id: driver_id || null,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
