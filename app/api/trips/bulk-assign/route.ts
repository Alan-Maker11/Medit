import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { notifyDriver } from "@/lib/push-notifications";

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  const { month, driver_name, vehicle_name } = body as { month: string; driver_name: string; vehicle_name: string };

  if (!month || !driver_name || !vehicle_name) {
    return NextResponse.json({ error: "month, driver_name and vehicle_name are required" }, { status: 400 });
  }

  let { data: driver } = await supabase.from("drivers").select("id").ilike("name", driver_name).maybeSingle();
  if (!driver) {
    const { data: newDriver, error } = await supabase
      .from("drivers")
      .insert({ name: driver_name, status: "active" })
      .select("id")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    driver = newDriver;
  }

  let { data: vehicle } = await supabase.from("vehicles").select("id").ilike("name", vehicle_name).maybeSingle();
  if (!vehicle) {
    const { data: newVehicle, error } = await supabase
      .from("vehicles")
      .insert({ name: vehicle_name, status: "active" })
      .select("id")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    vehicle = newVehicle;
  }

  const startDate = `${month}-01`;
  const [year, monthNum] = month.split("-").map(Number);
  const nextMonth = monthNum === 12 ? `${year + 1}-01-01` : `${year}-${String(monthNum + 1).padStart(2, "0")}-01`;

  const { data: updated, error: updateError } = await supabase
    .from("trips")
    .update({ driver_id: driver.id, vehicle_id: vehicle.id })
    .gte("date", startDate)
    .lt("date", nextMonth)
    .select("id");

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });

  if (updated && updated.length > 0) {
    notifyDriver(driver.id, {
      title: "🚗 Viajes asignados",
      body: `Se te asignaron ${updated.length} viaje${updated.length !== 1 ? "s" : ""} en ${month}`,
      url: "/driver/dashboard",
    }).catch((err) => console.error("Failed to send bulk-assign push notification:", err));
  }

  return NextResponse.json({ updated: updated?.length ?? 0 });
}
