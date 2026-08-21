"use client";

import { useMemo, useState } from "react";
import { currentLocalMonth } from "@/lib/date";
import DriverSalaryCard from "./DriverSalaryCard";
import type { Driver, OvertimeEntry, UberEarning } from "@/lib/types";

function groupByDriverForMonth<T extends { driver_id: string; date: string }>(items: T[], month: string) {
  const map = new Map<string, T[]>();
  for (const item of items) {
    if (!item.date.startsWith(month)) continue;
    const list = map.get(item.driver_id) ?? [];
    list.push(item);
    map.set(item.driver_id, list);
  }
  return map;
}

export default function SalaryView({
  drivers,
  entries,
  uberEarnings,
}: {
  drivers: Driver[];
  entries: OvertimeEntry[];
  uberEarnings: UberEarning[];
}) {
  const [month, setMonth] = useState(currentLocalMonth());

  const entriesByDriver = useMemo(() => groupByDriverForMonth(entries, month), [entries, month]);
  const uberByDriver = useMemo(() => groupByDriverForMonth(uberEarnings, month), [uberEarnings, month]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Month
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          />
        </label>
      </div>

      {drivers.map((driver) => (
        <DriverSalaryCard
          key={driver.id}
          driver={driver}
          entries={entriesByDriver.get(driver.id) ?? []}
          uberEarnings={uberByDriver.get(driver.id) ?? []}
        />
      ))}
      {drivers.length === 0 && <p className="text-sm text-zinc-500">No active drivers yet.</p>}
    </div>
  );
}
