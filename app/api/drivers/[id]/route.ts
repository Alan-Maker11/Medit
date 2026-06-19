import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const body = await request.json();
  const { data, error } = await supabase.from("drivers").update(body).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ driver: data });
}
