import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditTripForm from "./EditTripForm";

export default async function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: trip }, { data: services }, { data: drivers }, { data: vehicles }] = await Promise.all([
    supabase.from("trips").select("*").eq("id", id).single(),
    supabase.from("services").select("id, name").order("name"),
    supabase.from("drivers").select("id, name, is_meditiko").eq("status", "active").order("name"),
    supabase.from("vehicles").select("id, name").order("name"),
  ]);

  if (!trip) notFound();

  // The trip's currently assigned driver might have since been disabled — keep them selectable
  // (so the form doesn't silently blank out an existing assignment), the dropdown just won't
  // offer them for a *new* assignment.
  let driverOptions = drivers ?? [];
  if (trip.driver_id && !driverOptions.some((d) => d.id === trip.driver_id)) {
    const { data: currentDriver } = await supabase
      .from("drivers")
      .select("id, name, is_meditiko")
      .eq("id", trip.driver_id)
      .maybeSingle();
    if (currentDriver) driverOptions = [...driverOptions, currentDriver];
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Edit trip</h1>
      <EditTripForm trip={trip} services={services ?? []} drivers={driverOptions} vehicles={vehicles ?? []} />
    </div>
  );
}
