import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditVehicleForm from "./EditVehicleForm";

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: vehicle } = await supabase.from("vehicles").select("*").eq("id", id).single();

  if (!vehicle) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Edit vehicle</h1>
      <EditVehicleForm vehicle={vehicle} />
    </div>
  );
}
