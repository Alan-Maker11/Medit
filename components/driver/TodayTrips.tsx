"use client";

import Link from "next/link";

interface TripRow {
  id: string;
  time: string;
  client_name: string | null;
  status: string;
  services: { name: string } | null;
}

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  cancelled: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
};

export default function TodayTrips({ trips }: { trips: TripRow[] }) {
  return (
    <div className="sticky top-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-4 text-base font-bold text-zinc-900 dark:text-white">Today&apos;s Trips</h3>

      {trips.length === 0 ? (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center dark:border-blue-900 dark:bg-blue-950/30">
          <p className="font-medium text-blue-900 dark:text-blue-300">No trips scheduled</p>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">Enjoy your day off!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {trips.map((trip) => (
            <Link
              key={trip.id}
              href={`/driver/trip/${trip.id}`}
              className="block rounded-xl border border-zinc-200 p-4 transition-colors hover:border-blue-500 hover:bg-blue-50 dark:border-zinc-800 dark:hover:bg-blue-950/20"
            >
              <div className="mb-2 flex items-start justify-between">
                <h4 className="font-bold text-zinc-900 dark:text-white">{trip.client_name ?? "-"}</h4>
                <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {trip.time?.slice(0, 5)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">{trip.services?.name ?? "-"}</p>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[trip.status] ?? STATUS_STYLES.pending}`}>
                  {trip.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
        <p className="text-zinc-500">
          <span className="font-medium text-zinc-900 dark:text-white">{trips.length}</span> trip{trips.length !== 1 ? "s" : ""} scheduled
        </p>
      </div>
    </div>
  );
}
