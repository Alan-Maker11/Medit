"use client";

import { useMemo, useState } from "react";
import { formatDOP } from "@/lib/fare";
import type { MeditikoBookingStatus } from "@/lib/types";

interface BookingRow {
  id: string;
  passenger_name: string;
  passenger_phone: string;
  pickup_address: string;
  destination_address: string;
  trip_distance_km: number;
  estimated_duration_minutes: number;
  trip_type: "one_way" | "round_trip";
  waiting_hours: number;
  estimated_price: number;
  assigned_driver_id: string | null;
  status: MeditikoBookingStatus;
  notes: string | null;
  created_at: string;
  drivers: { name: string } | null;
}

interface DriverOption {
  id: string;
  name: string;
}

const STATUS_STYLES: Record<MeditikoBookingStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
};

const STATUS_LABELS: Record<MeditikoBookingStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  completed: "Completado",
  cancelled: "Cancelado",
};

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

export default function MeditikoTripsView({ bookings, drivers }: { bookings: BookingRow[]; drivers: DriverOption[] }) {
  const [localBookings, setLocalBookings] = useState(bookings);
  const [statusFilter, setStatusFilter] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (statusFilter ? localBookings.filter((b) => b.status === statusFilter) : localBookings),
    [localBookings, statusFilter]
  );

  const groups = useMemo(() => {
    const map = new Map<string, BookingRow[]>();
    for (const b of filtered) {
      const key = dayKey(b.created_at);
      const list = map.get(key) ?? [];
      list.push(b);
      map.set(key, list);
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(groups.slice(0, 1).map(([k]) => k)));

  function toggleDay(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function patchBooking(id: string, body: Record<string, unknown>) {
    setSavingId(id);
    const res = await fetch(`/api/meditiko/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSavingId(null);
    if (!res.ok) {
      alert("No se pudo actualizar la reserva.");
      return;
    }
    const updated = await res.json();
    setLocalBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
  }

  const totalRevenue = filtered.reduce((sum, b) => sum + (b.estimated_price ?? 0), 0);
  const pendingCount = filtered.filter((b) => b.status === "pending").length;
  const completedCount = filtered.filter((b) => b.status === "completed").length;

  return (
    <div className="flex flex-col gap-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Reservas" value={String(filtered.length)} />
        <Stat label="Ingresos estimados" value={formatDOP(totalRevenue)} highlight />
        <Stat label="Pendientes" value={String(pendingCount)} />
        <Stat label="Completados" value={String(completedCount)} />
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="confirmed">Confirmado</option>
          <option value="completed">Completado</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      {/* Day groups */}
      <div className="flex flex-col gap-4">
        {groups.map(([key, dayBookings]) => {
          const isOpen = expanded.has(key);
          const dayTotal = dayBookings.reduce((sum, b) => sum + (b.estimated_price ?? 0), 0);
          return (
            <div key={key} className="overflow-hidden rounded-2xl border border-orange-200 bg-white dark:border-orange-900 dark:bg-zinc-900">
              <button
                onClick={() => toggleDay(key)}
                className="flex w-full flex-wrap items-center justify-between gap-2 bg-orange-50 px-4 py-3 text-left hover:bg-orange-100 dark:bg-orange-950/20 dark:hover:bg-orange-950/40"
              >
                <span className="font-semibold">{key}</span>
                <span className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                  <span>{dayBookings.length} reserva{dayBookings.length !== 1 ? "s" : ""}</span>
                  <span className="font-semibold text-orange-600">{formatDOP(dayTotal)}</span>
                  <span>{isOpen ? "▲" : "▼"}</span>
                </span>
              </button>

              <div className="grid transition-[grid-template-rows] duration-200 ease-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                <div className="overflow-hidden">
                  <div className="flex flex-col divide-y divide-zinc-100 border-t border-orange-100 dark:divide-zinc-800 dark:border-orange-900">
                    {dayBookings.map((b) => (
                      <div key={b.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-bold text-zinc-900 dark:text-white">{b.passenger_name}</p>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[b.status]}`}>
                              {STATUS_LABELS[b.status]}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-500">{b.passenger_phone}</p>
                          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                            📍 {b.pickup_address} → 🏁 {b.destination_address}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {b.trip_distance_km}km · ~{b.estimated_duration_minutes}min ·{" "}
                            {b.trip_type === "round_trip" ? "Ida y vuelta" : "Un sentido"}
                            {b.waiting_hours > 0 ? ` · Espera ${b.waiting_hours}h` : ""}
                          </p>
                        </div>

                        <div className="flex flex-col items-start gap-2 sm:items-end">
                          <p className="text-lg font-bold text-orange-600">{formatDOP(b.estimated_price)}</p>
                          <select
                            value={b.assigned_driver_id ?? ""}
                            onChange={(e) => patchBooking(b.id, { assigned_driver_id: e.target.value || null })}
                            disabled={savingId === b.id}
                            className="rounded-lg border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-800"
                          >
                            <option value="">Sin asignar</option>
                            {drivers.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.name}
                              </option>
                            ))}
                          </select>
                          <div className="flex gap-2">
                            {b.status !== "completed" && (
                              <button
                                onClick={() => patchBooking(b.id, { status: "completed" })}
                                disabled={savingId === b.id}
                                className="text-xs font-medium text-green-600 hover:underline disabled:opacity-50"
                              >
                                ✓ Completar
                              </button>
                            )}
                            {b.status !== "cancelled" && (
                              <button
                                onClick={() => patchBooking(b.id, { status: "cancelled" })}
                                disabled={savingId === b.id}
                                className="text-xs font-medium text-red-500 hover:underline disabled:opacity-50"
                              >
                                ✗ Cancelar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {groups.length === 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
            No hay reservas de Meditiko todavía.
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-4 ${highlight ? "bg-orange-50 dark:bg-orange-950/30" : "bg-zinc-50 dark:bg-zinc-800"}`}>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className={`mt-0.5 text-lg font-bold ${highlight ? "text-orange-600" : ""}`}>{value}</p>
    </div>
  );
}
