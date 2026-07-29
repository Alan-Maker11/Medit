import { createClient } from "@/lib/supabase/server";
import TripsView from "./TripsView";
import TripsHeader from "./TripsHeader";

export default async function TripsPage() {
  const supabase = await createClient();
  const [{ data: trips }, { data: drivers }] = await Promise.all([
    supabase
      .from("trips")
      .select("id, date, time, client_name, trip_type, status, total_fare, driver_id, services(name), drivers(name), vehicles(name)")
      .order("date", { ascending: false }),
    supabase.from("drivers").select("id, name").order("name", { ascending: true }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <TripsHeader />
      <TripsView
        trips={(trips ?? []) as unknown as Parameters<typeof TripsView>[0]["trips"]}
        drivers={drivers ?? []}
      />
    </div>
  );
}
