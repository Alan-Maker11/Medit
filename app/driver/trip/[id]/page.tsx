"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCurrentDriver, getTripDetails } from "@/lib/driver-auth";
import { formatDOP } from "@/lib/fare";
import { formatDateWithDayEnglish } from "@/lib/date-utils";

interface TripDetail {
  id: string;
  driver_id: string | null;
  date: string;
  time: string;
  client_name: string | null;
  client_phone: string | null;
  pickup_address: string;
  destination_address: string;
  trip_type: string;
  waiting_hours: number;
  additional_fees: number;
  total_fare: number | null;
  status: string;
  notes: string | null;
  services: { name: string } | null;
}

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  cancelled: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
};

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</label>
      <input
        type="text"
        value={value}
        disabled
        className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
      />
    </div>
  );
}

function openMap(address: string) {
  const encoded = encodeURIComponent(address);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS) {
    window.open(`https://maps.apple.com/?address=${encoded}`, "_blank");
  } else {
    window.open(`https://maps.google.com/maps?q=${encoded}`, "_blank");
  }
}

export default function TripDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const tripId = params.id;

  const [trip, setTrip] = useState<TripDetail | null>(null);
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
        const tripData = (await getTripDetails(tripId)) as unknown as TripDetail;
        if (tripData.driver_id !== current.driver.id) {
          setError("Unauthorized: this trip is not assigned to you");
          return;
        }
        setTrip(tripData);
      } catch {
        setError("Failed to load trip details");
      } finally {
        setLoading(false);
      }
    })();
  }, [tripId, router]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">Loading...</div>;
  }

  if (error || !trip) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <p className="mb-4 text-red-600">{error ?? "Trip not found"}</p>
          <button
            onClick={() => router.push("/driver/dashboard")}
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <button onClick={() => router.push("/driver/dashboard")} className="mb-3 text-sm font-medium text-blue-600 hover:text-blue-800">
            ← Back to Dashboard
          </button>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">Trip Details</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          <div className="mb-6">
            <span className={`rounded-full px-4 py-2 text-sm font-medium ${STATUS_STYLES[trip.status] ?? STATUS_STYLES.pending}`}>
              {trip.status.toUpperCase()}
            </span>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <ReadOnlyField label="Date" value={formatDateWithDayEnglish(trip.date)} />
            <ReadOnlyField label="Time" value={trip.time?.slice(0, 5) ?? "-"} />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <ReadOnlyField label="Service Type" value={trip.services?.name ?? "-"} />
            <ReadOnlyField label="Trip Type" value={trip.trip_type ?? "N/A"} />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <ReadOnlyField label="Client Name" value={trip.client_name ?? "-"} />
            <ReadOnlyField label="Client Phone" value={trip.client_phone ?? "N/A"} />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Pickup Address</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={trip.pickup_address}
                disabled
                className="flex-1 rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
              <button
                onClick={() => openMap(trip.pickup_address)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-transform duration-150 ease-out hover:bg-blue-700 active:scale-[0.98]"
              >
                📍 Open Map
              </button>
            </div>
          </div>

          {trip.destination_address && (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Destination Address</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={trip.destination_address}
                  disabled
                  className="flex-1 rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
                <button
                  onClick={() => openMap(trip.destination_address)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-transform duration-150 ease-out hover:bg-blue-700 active:scale-[0.98]"
                >
                  📍 Open Map
                </button>
              </div>
            </div>
          )}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <ReadOnlyField label="Waiting Hours" value={String(trip.waiting_hours ?? 0)} />
            <ReadOnlyField label="Additional Fees" value={formatDOP(trip.additional_fees ?? 0)} />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Notes</label>
            <textarea
              value={trip.notes ?? ""}
              disabled
              rows={4}
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
            <p className="mb-1 text-sm text-blue-700 dark:text-blue-400">Total Trip Cost</p>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-300">{formatDOP(trip.total_fare ?? 0)}</p>
          </div>

          <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              ℹ️ This is a read-only view of your trip details. Contact your manager if you have questions.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
