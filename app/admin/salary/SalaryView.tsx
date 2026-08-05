"use client";

import { useMemo, useState } from "react";
import { currentLocalMonth } from "@/lib/date";
import DriverSalaryCard from "./DriverSalaryCard";
import type { Driver, OvertimeEntry } from "@/lib/types";

export default function SalaryView({ drivers, entries }: { drivers: Driver[]; entries: OvertimeEntry[] }) {
  const [month, setMonth] = useState(currentLocalMonth());

  const entriesByDriver = useMemo(() => {
    const map = new Map<string, OvertimeEntry[]>();
    for (const entry of entries) {
      if (!entry.date.startsWith(month)) continue;
      const list = map.get(entry.driver_id) ?? [];
      list.push(entry);
      map.set(entry.driver_id, list);
    }
    return map;
  }, [entries, month]);

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
        <DriverSalaryCard key={driver.id} driver={driver} entries={entriesByDriver.get(driver.id) ?? []} />
      ))}
      {drivers.length === 0 && <p className="text-sm text-zinc-500">No active drivers yet.</p>}
    </div>
  );
}
