import { createClient } from "@/lib/supabase/server";
import TripsByMonth from "./TripsByMonth";
import TripsHeader from "./TripsHeader";

export default async function TripsPage() {
  const supabase = await createClient();
  const { data: trips } = await supabase
    .from("trips")
    .select("id, date, client_name, trip_type, status, total_fare, services(name), drivers(name), vehicles(name)")
    .order("date", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <TripsHeader />
      <TripsByMonth trips={(trips ?? []) as unknown as Parameters<typeof TripsByMonth>[0]["trips"]} />
    </div>
  );
}
