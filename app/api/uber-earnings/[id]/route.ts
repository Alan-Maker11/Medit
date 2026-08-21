import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UBER_DRIVER_COMMISSION_RATE } from "@/lib/fare";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const body = await request.json();
  const { date, gross_amount, notes } = body;
  const gross = Number(gross_amount) || 0;

  const { data, error } = await supabase
    .from("driver_uber_earnings")
    .update({
      date,
      gross_amount: gross,
      amount: Math.round(gross * UBER_DRIVER_COMMISSION_RATE * 100) / 100,
      notes: notes || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { error } = await supabase.from("driver_uber_earnings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
