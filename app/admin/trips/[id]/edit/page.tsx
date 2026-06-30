import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditTripForm from "./EditTripForm";

export default async function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: trip }, { data: services }, { data: drivers }, { data: vehicles }] = await Promise.all([
    supabase.from("trips").select("*").eq("id", id).single(),
    supabase.from("services").select("id, name").order("name"),
    supabase.from("drivers").select("id, name").order("name"),
    supabase.from("vehicles").select("id, name").order("name"),
  ]);

  if (!trip) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Edit trip</h1>
      <EditTripForm trip={trip} services={services ?? []} drivers={drivers ?? []} vehicles={vehicles ?? []} />
    </div>
  );
}
