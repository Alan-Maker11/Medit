import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import EraseAllTripsButton from "./EraseAllTripsButton";
import TripsByMonth from "./TripsByMonth";

export default async function TripsPage() {
  const supabase = await createClient();
  const { data: trips } = await supabase
    .from("trips")
    .select("id, date, client_name, trip_type, status, total_fare, services(name), drivers(name), vehicles(name)")
    .order("date", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Trips</h1>
        <Link
          href="/admin/trips/new"
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Log new trip
        </Link>
      </div>
      <TripsByMonth trips={(trips ?? []) as unknown as Parameters<typeof TripsByMonth>[0]["trips"]} />
      <EraseAllTripsButton />
    </div>
  );
}
