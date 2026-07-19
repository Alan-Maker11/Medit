"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentDriver, getDriverTripsForDate } from "@/lib/driver-auth";
import { formatDateWithDayEnglish } from "@/lib/date-utils";

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

export default function DateTripsPage() {
  const params = useParams<{ date: string }>();
  const router = useRouter();
  const dateStr = params.date;

  const [trips, setTrips] = useState<TripRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const current = await getCurrentDriver();
        if (!current) {
          router.push("/driver/login");
          return;
        }
        const data = await getDriverTripsForDate(current.driver.id, dateStr);
        setTrips(data as unknown as TripRow[]);
      } catch {
        setError("Failed to load trips");
      } finally {
        setLoading(false);
      }
    })();
  }, [dateStr, router]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <button onClick={() => router.push("/driver/dashboard")} className="mb-3 text-sm font-medium text-blue-600 hover:text-blue-800">
            ← Back to Dashboard
          </button>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">{formatDateWithDayEnglish(dateStr)}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        {trips.length === 0 ? (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-8 text-center dark:border-blue-900 dark:bg-blue-950/30">
            <p className="text-lg font-medium text-blue-900 dark:text-blue-300">No trips for this day</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                href={`/driver/trip/${trip.id}`}
                className="block rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{trip.client_name ?? "-"}</h3>
                    <p className="mt-1 text-sm text-zinc-500">Service: {trip.services?.name ?? "-"}</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {trip.time?.slice(0, 5)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-500">Click to view full details</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[trip.status] ?? STATUS_STYLES.pending}`}>
                    {trip.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
