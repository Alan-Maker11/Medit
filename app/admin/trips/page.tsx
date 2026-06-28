import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDOP } from "@/lib/fare";
import EraseAllTripsButton from "./EraseAllTripsButton";

export default async function TripsPage() {
  const supabase = await createClient();
  const { data: trips } = await supabase
    .from("trips")
    .select("id, date, client_name, trip_type, status, total_fare, services(name), drivers(name), vehicles(name)")
    .order("date", { ascending: false })
    .limit(100);

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
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-800">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Driver</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Fare</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(trips ?? []).map((trip) => (
              <tr key={trip.id} className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="px-4 py-3">{trip.date}</td>
                <td className="px-4 py-3">{(trip.services as unknown as { name: string } | null)?.name ?? "-"}</td>
                <td className="px-4 py-3">{trip.client_name ?? "-"}</td>
                <td className="px-4 py-3">{(trip.drivers as unknown as { name: string } | null)?.name ?? "-"}</td>
                <td className="px-4 py-3">{(trip.vehicles as unknown as { name: string } | null)?.name ?? "-"}</td>
                <td className="px-4 py-3">{trip.total_fare ? formatDOP(trip.total_fare) : "-"}</td>
                <td className="px-4 py-3 capitalize">{trip.status}</td>
              </tr>
            ))}
            {(!trips || trips.length === 0) && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-zinc-500">
                  No trips logged yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <EraseAllTripsButton />
    </div>
  );
}
