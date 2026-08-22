"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDOP } from "@/lib/fare";
import { useAdminLang, ADMIN_T } from "@/lib/adminLang";
import { formatDateWithDay, formatDateWithDayEnglish } from "@/lib/date-utils";
import AccessibilityIcons from "./AccessibilityIcons";
import PaymentStatusToggle from "./PaymentStatusToggle";

interface TripRow {
  id: string;
  date: string;
  client_name: string | null;
  total_fare: number | null;
  status: string;
  needs_wheelchair?: boolean;
  needs_stair_climber?: boolean;
  payment_status?: string;
  services: { name: string } | null;
  drivers: { name: string } | null;
  vehicles: { name: string } | null;
}

const MONTH_NAMES_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_NAMES_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function TripsByMonth({ trips }: { trips: TripRow[] }) {
  const { lang } = useAdminLang();
  const t = ADMIN_T[lang];
  const MONTH_NAMES = lang === "es" ? MONTH_NAMES_ES : MONTH_NAMES_EN;

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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [localTrips, setLocalTrips] = useState<TripRow[]>(trips);

  const localGroups = useMemo(() => {
    const map = new Map<string, TripRow[]>();
    for (const trip of localTrips) {
      const key = trip.date.slice(0, 7);
      const list = map.get(key) ?? [];
      list.push(trip);
      map.set(key, list);
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [localTrips]);

  function toggle(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function handlePaymentToggled(id: string, nextStatus: string) {
    setLocalTrips((prev) => prev.map((trip) => (trip.id === id ? { ...trip, payment_status: nextStatus } : trip)));
  }

  async function handleDelete(id: string) {
    if (!window.confirm(t.confirmDelete)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/trips/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLocalTrips((prev) => prev.filter((trip) => trip.id !== id));
      } else {
        alert(t.deleteError);
      }
    } catch {
      alert(t.deleteError);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {localGroups.map(([key, monthTrips]) => {
        const [year, month] = key.split("-");
        const label = `${MONTH_NAMES[Number(month) - 1]} ${year}`;
        const isOpen = expanded.has(key);
        const monthTotal = monthTrips.reduce((sum, t) => sum + (t.total_fare ?? 0), 0);
        return (
          <div key={key} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <button
              onClick={() => toggle(key)}
              className="flex w-full flex-wrap items-center justify-between gap-2 px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <span className="font-semibold">{label}</span>
              <span className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                <span>{t.monthTrips(monthTrips.length)}</span>
                <span>{formatDOP(monthTotal)}</span>
                <span>{isOpen ? "▲" : "▼"}</span>
              </span>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-200 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
              <div className="overflow-x-auto border-t border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-800">
                      <th className="px-4 py-3">{t.date}</th>
                      <th className="px-4 py-3">{t.service}</th>
                      <th className="px-4 py-3">{t.client}</th>
                      <th className="px-4 py-3">{t.driver}</th>
                      <th className="px-4 py-3">{t.vehicle}</th>
                      <th className="px-4 py-3">{t.fare}</th>
                      <th className="px-4 py-3">{t.status}</th>
                      <th className="px-4 py-3">Payment</th>
                      <th className="px-4 py-3 w-28"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthTrips.map((trip) => (
                      <tr key={trip.id} className="group relative border-b border-zinc-100 dark:border-zinc-800">
                        <td className="px-4 py-3 whitespace-nowrap">{lang === "es" ? formatDateWithDay(trip.date) : formatDateWithDayEnglish(trip.date)}</td>
                        <td className="px-4 py-3">{trip.services?.name ?? "-"}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5">
                            {trip.client_name ?? "-"}
                            <AccessibilityIcons wheelchair={trip.needs_wheelchair} stairClimber={trip.needs_stair_climber} />
                          </span>
                        </td>
                        <td className="px-4 py-3">{trip.drivers?.name ?? "-"}</td>
                        <td className="px-4 py-3">{trip.vehicles?.name ?? "-"}</td>
                        <td className="px-4 py-3">{trip.total_fare ? formatDOP(trip.total_fare) : "-"}</td>
                        <td className="px-4 py-3 capitalize">{trip.status}</td>
                        <td className="px-4 py-3">
                          <PaymentStatusToggle
                            tripId={trip.id}
                            status={trip.payment_status ?? "pending"}
                            onToggled={(next) => handlePaymentToggled(trip.id, next)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3 md:invisible md:group-hover:visible">
                            <Link
                              href={`/admin/trips/${trip.id}/edit`}
                              className="text-sm font-medium text-blue-600 hover:underline"
                            >
                              {t.edit}
                            </Link>
                            <button
                              onClick={() => handleDelete(trip.id)}
                              disabled={deletingId === trip.id}
                              className="text-sm font-medium text-red-500 hover:underline disabled:opacity-40"
                            >
                              {deletingId === trip.id ? "…" : t.delete}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </div>
            </div>
          </div>
        );
      })}
      {localGroups.length === 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
          {t.noTrips}
        </div>
      )}
    </div>
  );
}
