"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDOP } from "@/lib/fare";
import { useAdminLang, ADMIN_T } from "@/lib/adminLang";
import { todayLocalISO } from "@/lib/date";
import { formatTime12 } from "@/lib/time-utils";
import AccessibilityIcons from "./AccessibilityIcons";
import PaymentStatusToggle from "./PaymentStatusToggle";

interface TripRow {
  id: string;
  date: string;
  time: string;
  client_name: string | null;
  total_fare: number | null;
  status: string;
  driver_id: string | null;
  needs_wheelchair?: boolean;
  needs_stair_climber?: boolean;
  payment_status?: string;
  services: { name: string } | null;
  drivers: { name: string } | null;
  vehicles: { name: string } | null;
}

interface DriverOption {
  id: string;
  name: string;
}

const MONTH_NAMES_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_NAMES_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  cancelled: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
};

export default function TripsCalendar({ trips, drivers }: { trips: TripRow[]; drivers: DriverOption[] }) {
  const { lang } = useAdminLang();
  const t = ADMIN_T[lang];
  const MONTH_NAMES = lang === "es" ? MONTH_NAMES_ES : MONTH_NAMES_EN;
  const DAYS_OF_WEEK = lang === "es" ? DAYS_ES : DAYS_EN;

  const todayISO = todayLocalISO();
  const [selectedMonth, setSelectedMonth] = useState(() => new Date(`${todayISO}T00:00:00`));
  const [driverId, setDriverId] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(todayISO);
  const [localTrips, setLocalTrips] = useState<TripRow[]>(trips);

  function handlePaymentToggled(id: string, nextStatus: string) {
    setLocalTrips((prev) => prev.map((trip) => (trip.id === id ? { ...trip, payment_status: nextStatus } : trip)));
  }

  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();

  const filteredTrips = useMemo(
    () => (driverId ? localTrips.filter((trip) => trip.driver_id === driverId) : localTrips),
    [localTrips, driverId]
  );

  const tripsByDay = useMemo(() => {
    const map = new Map<number, number>();
    for (const trip of filteredTrips) {
      const [y, m, d] = trip.date.split("-").map(Number);
      if (y === year && m - 1 === month) {
        map.set(d, (map.get(d) ?? 0) + 1);
      }
    }
    return map;
  }, [filteredTrips, year, month]);

  const dayTrips = useMemo(
    () =>
      selectedDate
        ? filteredTrips.filter((trip) => trip.date === selectedDate).sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""))
        : [],
    [filteredTrips, selectedDate]
  );

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = [...Array(firstDayOfWeek).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  function shiftMonth(delta: number) {
    setSelectedMonth(new Date(year, month + delta, 1));
  }

  function selectDay(day: number) {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(iso);
  }

  const dayTotal = dayTrips.reduce((sum, trip) => sum + (trip.total_fare ?? 0), 0);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:col-span-2">
        <div className="mb-4">
          <select
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            className="w-full max-w-xs rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 sm:w-auto"
          >
            <option value="">{t.allDrivers}</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => shiftMonth(-1)}
            className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            {t.prev}
          </button>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            {MONTH_NAMES[month]} {year}
          </h3>
          <button
            onClick={() => shiftMonth(1)}
            className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            {t.next}
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {DAYS_OF_WEEK.map((d) => (
            <div key={d} className="py-1 text-center text-xs font-bold text-zinc-500">
              {d}
            </div>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} />;
            const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isSelected = iso === selectedDate;
            const isToday = iso === todayISO;
            return (
              <button
                key={day}
                onClick={() => selectDay(day)}
                className={`rounded-lg p-2 text-center transition-colors ${
                  isSelected
                    ? "bg-blue-600 font-bold text-white"
                    : tripsByDay.has(day)
                    ? "bg-blue-100 font-semibold text-blue-800 hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                } ${isToday && !isSelected ? "ring-2 ring-blue-500" : ""}`}
              >
                <div className="text-sm sm:text-base">{day}</div>
                {tripsByDay.has(day) && (
                  <div className="text-[10px]">
                    {tripsByDay.get(day)} {lang === "es" ? "viaje" + (tripsByDay.get(day) !== 1 ? "s" : "") : "trip" + (tripsByDay.get(day) !== 1 ? "s" : "")}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="sticky top-8 h-fit rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-base font-bold text-zinc-900 dark:text-white">
          {selectedDate ? `${t.tripsFor} — ${selectedDate}` : t.tripsFor}
        </h3>

        {!selectedDate && <p className="text-sm text-zinc-500">{t.selectDayHint}</p>}

        {selectedDate && dayTrips.length === 0 && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center dark:border-blue-900 dark:bg-blue-950/30">
            <p className="font-medium text-blue-900 dark:text-blue-300">{t.noTripsForDay}</p>
          </div>
        )}

        {selectedDate && dayTrips.length > 0 && (
          <div className="flex flex-col gap-3">
            {dayTrips.map((trip) => (
              <Link
                key={trip.id}
                href={`/admin/trips/${trip.id}/edit`}
                className="block rounded-xl border border-zinc-200 p-4 transition-colors hover:border-blue-500 hover:bg-blue-50 dark:border-zinc-800 dark:hover:bg-blue-950/20"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h4 className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-white">
                    {trip.client_name ?? "-"}
                    <AccessibilityIcons wheelchair={trip.needs_wheelchair} stairClimber={trip.needs_stair_climber} />
                  </h4>
                  <span className="whitespace-nowrap rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {formatTime12(trip.time)}
                  </span>
                </div>
                <p className="text-sm text-zinc-500">
                  {trip.services?.name ?? "-"} · {trip.drivers?.name ?? "-"}
                </p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="font-semibold text-green-600">{formatDOP(trip.total_fare ?? 0)}</span>
                  <div className="flex items-center gap-2">
                    <PaymentStatusToggle
                      tripId={trip.id}
                      status={trip.payment_status ?? "pending"}
                      onToggled={(next) => handlePaymentToggled(trip.id, next)}
                    />
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[trip.status] ?? STATUS_STYLES.pending}`}>
                      {trip.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {selectedDate && dayTrips.length > 0 && (
          <div className="mt-6 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
            <p className="text-zinc-500">
              <span className="font-medium text-zinc-900 dark:text-white">{dayTrips.length}</span>{" "}
              {lang === "es" ? "viaje" + (dayTrips.length !== 1 ? "s" : "") : "trip" + (dayTrips.length !== 1 ? "s" : "")}
            </p>
            <p className="text-zinc-500">
              {t.fare}: <span className="font-medium text-green-600">{formatDOP(dayTotal)}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
