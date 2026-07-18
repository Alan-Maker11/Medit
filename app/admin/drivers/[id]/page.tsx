import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DriverEditForm from "./DriverEditForm";
import OvertimeForm from "./OvertimeForm";
import DriverPortalAccountForm from "./DriverPortalAccountForm";

export default async function DriverDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: driver } = await supabase.from("drivers").select("*").eq("id", id).single();

  if (!driver) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">{driver.name}</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <DriverEditForm driver={driver} />
        <OvertimeForm driverId={driver.id} />
        <DriverPortalAccountForm driverId={driver.id} />
      </div>
    </div>
  );
}
