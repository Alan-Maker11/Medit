"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCurrentDriver, getTripDetails } from "@/lib/driver-auth";
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
  status: string;
  notes: string | null;
  needs_wheelchair: boolean;
  needs_stair_climber: boolean;
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
  const [updating, setUpdating] = useState(false);

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

  async function toggleStatus() {
    if (!trip) return;
    const nextStatus = trip.status === "completed" ? "pending" : "completed";
    setUpdating(true);
    try {
      const res = await fetch(`/api/driver/trips/${trip.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update trip");
      setTrip(data.trip);
    } catch {
      setError("Failed to update trip status");
    } finally {
      setUpdating(false);
    }
  }

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

  const hasEquipment = trip.needs_wheelchair || trip.needs_stair_climber;

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
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-4 py-2 text-sm font-medium ${STATUS_STYLES[trip.status] ?? STATUS_STYLES.pending}`}>
              {trip.status.toUpperCase()}
            </span>
          </div>

          {hasEquipment && (
            <div className="mb-6 rounded-xl border-2 border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
              <p className="mb-2 text-sm font-semibold text-amber-800 dark:text-amber-300">Bring with you</p>
              <div className="flex flex-wrap gap-2">
                {trip.needs_wheelchair && (
                  <span className="rounded-full bg-amber-200 px-3 py-1.5 text-sm font-medium text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                    ♿ Wheelchair
                  </span>
                )}
                {trip.needs_stair_climber && (
                  <span className="rounded-full bg-amber-200 px-3 py-1.5 text-sm font-medium text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                    🪜 Stair climber
                  </span>
                )}
              </div>
            </div>
          )}

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

          {trip.status !== "cancelled" && (
            <button
              onClick={toggleStatus}
              disabled={updating}
              className={`w-full rounded-xl px-5 py-3 text-base font-semibold text-white transition-transform duration-150 ease-out active:scale-[0.98] disabled:opacity-50 ${
                trip.status === "completed" ? "bg-zinc-600 hover:bg-zinc-700" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {updating
                ? "Updating..."
                : trip.status === "completed"
                ? "Mark as Pending"
                : "✓ Mark as Completed"}
            </button>
          )}

          <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              ℹ️ Update the status once you finish the trip. Contact your manager if you have questions.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
