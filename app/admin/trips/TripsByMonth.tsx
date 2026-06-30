"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDOP } from "@/lib/fare";

interface TripRow {
  id: string;
  date: string;
  client_name: string | null;
  total_fare: number | null;
  status: string;
  services: { name: string } | null;
  drivers: { name: string } | null;
  vehicles: { name: string } | null;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function TripsByMonth({ trips }: { trips: TripRow[] }) {
  const groups = useMemo(() => {
    const map = new Map<string, TripRow[]>();
    for (const trip of trips) {
      const key = trip.date.slice(0, 7);
      const list = map.get(key) ?? [];
      list.push(trip);
      map.set(key, list);
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [trips]);

  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(groups.slice(0, 1).map(([key]) => key)));

  function toggle(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {groups.map(([key, monthTrips]) => {
        const [year, month] = key.split("-");
        const label = `${MONTH_NAMES[Number(month) - 1]} ${year}`;
        const isOpen = expanded.has(key);
        const monthTotal = monthTrips.reduce((sum, t) => sum + (t.total_fare ?? 0), 0);
        return (
          <div key={key} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <button
              onClick={() => toggle(key)}
              className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <span className="font-semibold">{label}</span>
              <span className="flex items-center gap-4 text-sm text-zinc-500">
                <span>{monthTrips.length} trips</span>
                <span>{formatDOP(monthTotal)}</span>
                <span>{isOpen ? "▲" : "▼"}</span>
              </span>
            </button>
            {isOpen && (
              <div className="overflow-x-auto border-t border-zinc-200 dark:border-zinc-800">
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
                      <th className="px-4 py-3 w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthTrips.map((trip) => (
                      <tr key={trip.id} className="group relative border-b border-zinc-100 dark:border-zinc-800">
                        <td className="px-4 py-3">{trip.date}</td>
                        <td className="px-4 py-3">{trip.services?.name ?? "-"}</td>
                        <td className="px-4 py-3">{trip.client_name ?? "-"}</td>
                        <td className="px-4 py-3">{trip.drivers?.name ?? "-"}</td>
                        <td className="px-4 py-3">{trip.vehicles?.name ?? "-"}</td>
                        <td className="px-4 py-3">{trip.total_fare ? formatDOP(trip.total_fare) : "-"}</td>
                        <td className="px-4 py-3 capitalize">{trip.status}</td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/trips/${trip.id}/edit`}
                            className="invisible text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline group-hover:visible"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
      {groups.length === 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
          No trips logged yet.
        </div>
      )}
    </div>
  );
}
