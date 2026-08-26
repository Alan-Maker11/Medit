import { createClient } from "@/lib/supabase/server";
import TripsView from "./TripsView";
import TripsHeader from "./TripsHeader";

export default async function TripsPage() {
  const supabase = await createClient();
  const [{ data: trips, error: tripsError }, { data: drivers }, { data: services }] = await Promise.all([
    supabase
      .from("trips")
      .select("id, date, time, client_name, trip_type, status, total_fare, driver_id, service_id, needs_wheelchair, needs_stair_climber, client_owes, services(name), drivers(name), vehicles(name)")
      .order("date", { ascending: false }),
    supabase.from("drivers").select("id, name").order("name", { ascending: true }),
    supabase.from("services").select("id, name").order("name", { ascending: true }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <TripsHeader />
      {tripsError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          Couldn&apos;t load trips: {tripsError.message}. This usually means a database migration hasn&apos;t been run yet — check the Supabase SQL Editor.
        </div>
      )}
      <TripsView
        trips={(trips ?? []) as unknown as Parameters<typeof TripsView>[0]["trips"]}
        drivers={drivers ?? []}
        services={services ?? []}
      />
    </div>
  );
}
