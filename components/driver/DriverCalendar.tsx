"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDriverMonthTrips } from "@/lib/driver-auth";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

interface TripRow {
  id: string;
  date: string;
}

export default function DriverCalendar({
  driverId,
  selectedMonth,
  onSelectMonth,
}: {
  driverId: string;
  selectedMonth: Date;
  onSelectMonth: (date: Date) => void;
}) {
  const [trips, setTrips] = useState<TripRow[]>([]);
  const [loading, setLoading] = useState(false);

  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();
  const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getDriverMonthTrips(driverId, monthStr)
      .then((data) => {
        if (!cancelled) setTrips(data as unknown as TripRow[]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [driverId, monthStr]);

  const tripsByDay = new Map<number, number>();
  for (const trip of trips) {
    const day = Number(trip.date.slice(8, 10));
    tripsByDay.set(day, (tripsByDay.get(day) ?? 0) + 1);
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = [...Array(firstDayOfWeek).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-6 text-lg font-bold text-zinc-900 dark:text-white">My Schedule</h2>

      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => onSelectMonth(new Date(year, month - 1, 1))}
          className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          ← Previous
        </button>
        <h3 className="text-base font-bold text-zinc-900 dark:text-white">
          {MONTH_NAMES[month]} {year}
        </h3>
        <button
          onClick={() => onSelectMonth(new Date(year, month + 1, 1))}
          className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          Next →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {DAYS_OF_WEEK.map((d) => (
          <div key={d} className="py-1 text-center text-xs font-bold text-zinc-500">
            {d}
          </div>
        ))}
        {cells.map((day, i) =>
          day === null ? (
            <div key={`empty-${i}`} />
          ) : (
            <Link
              key={day}
              href={`/driver/calendar/${monthStr}-${String(day).padStart(2, "0")}`}
              className={`rounded-lg p-2 text-center transition-colors ${
                tripsByDay.has(day)
                  ? "bg-blue-600 font-bold text-white hover:bg-blue-700"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              <div className="text-sm sm:text-base">{day}</div>
              {tripsByDay.has(day) && (
                <div className="text-[10px]">{tripsByDay.get(day)} trip{tripsByDay.get(day) !== 1 ? "s" : ""}</div>
              )}
            </Link>
          )
        )}
      </div>

      {loading && <p className="mt-4 text-center text-sm text-zinc-500">Loading trips...</p>}
    </div>
  );
}
