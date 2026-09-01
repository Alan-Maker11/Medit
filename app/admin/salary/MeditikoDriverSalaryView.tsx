"use client";

import { useMemo, useState } from "react";
import { currentLocalMonth } from "@/lib/date";
import MeditikoDriverSalaryCard from "./MeditikoDriverSalaryCard";
import type { Driver, MeditikoDriverEarning } from "@/lib/types";

export default function MeditikoDriverSalaryView({
  drivers,
  earnings,
}: {
  drivers: Driver[];
  earnings: MeditikoDriverEarning[];
}) {
  const [month, setMonth] = useState(currentLocalMonth());

  const earningsByDriver = useMemo(() => {
    const map = new Map<string, MeditikoDriverEarning[]>();
    for (const e of earnings) {
      if (!e.date.startsWith(month)) continue;
      const list = map.get(e.driver_id) ?? [];
      list.push(e);
      map.set(e.driver_id, list);
    }
    return map;
  }, [earnings, month]);

  return (
    <div className="flex flex-col gap-6">
      <label className="flex w-fit flex-col gap-1 text-sm font-medium">
        Mes
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
        />
      </label>

      {drivers.map((driver) => (
        <MeditikoDriverSalaryCard key={driver.id} driver={driver} earnings={earningsByDriver.get(driver.id) ?? []} />
      ))}
    </div>
  );
}
