import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const body = await request.json();
  const { data, error } = await supabase.from("vehicles").update(body).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ vehicle: data });
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: trips }, { data: expenses }] = await Promise.all([
    supabase.from("trips").select("total_fare").eq("vehicle_id", id),
    supabase.from("expenses").select("amount").eq("vehicle_id", id),
  ]);

  const total_revenue = (trips ?? []).reduce((sum, t) => sum + (t.total_fare ?? 0), 0);
  const total_expenses = (expenses ?? []).reduce((sum, e) => sum + (e.amount ?? 0), 0);

  return NextResponse.json({
    total_trips: trips?.length ?? 0,
    total_revenue,
    total_expenses,
    net: total_revenue - total_expenses,
  });
}
