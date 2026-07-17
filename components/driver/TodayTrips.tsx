"use client";

import Link from "next/link";
import { formatDOP } from "@/lib/fare";

interface TripRow {
  id: string;
  time: string;
  client_name: string | null;
  total_fare: number | null;
  services: { name: string } | null;
}

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
              <p className="text-sm text-zinc-500">{trip.services?.name ?? "-"}</p>
              <p className="mt-2 text-xs text-zinc-400">Click for details →</p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
        <p className="mb-1 text-zinc-500">
          <span className="font-medium text-zinc-900 dark:text-white">{trips.length}</span> trip{trips.length !== 1 ? "s" : ""} scheduled
        </p>
        <p className="text-zinc-500">
          Total: <span className="font-medium text-green-600">{formatDOP(trips.reduce((sum, t) => sum + (t.total_fare ?? 0), 0))}</span>
        </p>
      </div>
    </div>
  );
}
