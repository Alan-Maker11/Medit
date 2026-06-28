import { createClient } from "@/lib/supabase/server";
import DriverSalaryCard from "./DriverSalaryCard";
import type { Driver, OvertimeEntry } from "@/lib/types";

export default async function SalaryPage() {
  const supabase = await createClient();
  const [{ data: drivers }, { data: entries }] = await Promise.all([
    supabase.from("drivers").select("*").eq("status", "active").order("name"),
    supabase.from("overtime_entries").select("*").order("date", { ascending: false }),
  ]);

  const entriesByDriver = new Map<string, OvertimeEntry[]>();
  for (const entry of (entries ?? []) as OvertimeEntry[]) {
    const list = entriesByDriver.get(entry.driver_id) ?? [];
    list.push(entry);
    entriesByDriver.set(entry.driver_id, list);
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Salary</h1>
      <p className="text-sm text-zinc-500">
        Base salary, overtime hours, and dieta per driver. Add an entry for each overtime day and the
        total updates automatically.
      </p>
      <div className="flex flex-col gap-6">
        {(drivers ?? []).map((driver) => (
          <DriverSalaryCard
            key={driver.id}
            driver={driver as Driver}
            entries={entriesByDriver.get(driver.id) ?? []}
          />
        ))}
        {(!drivers || drivers.length === 0) && (
          <p className="text-sm text-zinc-500">No active drivers yet.</p>
        )}
      </div>
    </div>
  );
}
