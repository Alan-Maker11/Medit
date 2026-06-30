"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { formatDOP } from "@/lib/fare";
import type { Driver, OvertimeEntry } from "@/lib/types";
import { todayLocalISO } from "@/lib/date";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function termOf(dateStr: string): 1 | 2 {
  const day = Number(dateStr.slice(8, 10));
  return day <= 15 ? 1 : 2;
}

export default function DriverSalaryCard({
  driver,
  entries,
}: {
  driver: Driver;
  entries: OvertimeEntry[];
}) {
  const router = useRouter();
  const [date, setDate] = useState(todayLocalISO());
  const [hours, setHours] = useState("");
  const [dieta, setDieta] = useState("");
  const [elevator, setElevator] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const overtimeRate = driver.overtime_hourly_rate ?? 0;
  const baseSalary = driver.base_monthly_salary ?? 0;
  const halfBaseSalary = baseSalary / 2;

  const totalHours = entries.reduce((sum, e) => sum + Number(e.hours), 0);
  const totalOvertimePay = entries.reduce((sum, e) => sum + Number(e.hours) * overtimeRate, 0);
  const totalDieta = entries.reduce((sum, e) => sum + Number(e.dieta_amount), 0);
  const totalElevator = entries.reduce((sum, e) => sum + Number(e.elevator_amount), 0);
  const totalToPay = baseSalary + totalOvertimePay + totalDieta + totalElevator;

  const termGroups = useMemo(() => {
    const map = new Map<string, OvertimeEntry[]>();
    for (const entry of entries) {
      const month = entry.date.slice(0, 7);
      const key = `${month}-${termOf(entry.date)}`;
      const list = map.get(key) ?? [];
      list.push(entry);
      map.set(key, list);
    }
    return [...map.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, termEntries]) => {
        const [year, month, term] = key.split("-");
        const termHours = termEntries.reduce((sum, e) => sum + Number(e.hours), 0);
        const termOvertimePay = termHours * overtimeRate;
        const termDieta = termEntries.reduce((sum, e) => sum + Number(e.dieta_amount), 0);
        const termElevator = termEntries.reduce((sum, e) => sum + Number(e.elevator_amount), 0);
        const termTotal = halfBaseSalary + termOvertimePay + termDieta + termElevator;
        return {
          key,
          label: `${MONTH_NAMES[Number(month) - 1]} ${year} - ${term === "1" ? "1st term (1-15)" : "2nd term (16-end)"}`,
          entries: termEntries,
          termHours,
          termOvertimePay,
          termDieta,
          termElevator,
          termTotal,
        };
      });
  }, [entries, overtimeRate, halfBaseSalary]);

  async function handleAddEntry(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/overtime-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        driver_id: driver.id,
        date,
        hours,
        dieta_amount: dieta,
        elevator_amount: elevator,
      }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save entry");
      return;
    }
    setHours("");
    setDieta("");
    setElevator("");
    router.refresh();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/overtime-entries/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">{driver.name}</h2>
        <p className="text-sm text-zinc-500">
          Base salary {formatDOP(baseSalary)} · Overtime rate {formatDOP(overtimeRate)}/hr
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        <Stat label="Salario regular" value={formatDOP(baseSalary)} />
        <Stat label="Horas extras" value={`${totalHours} h / ${formatDOP(totalOvertimePay)}`} />
        <Stat label="Dieta" value={formatDOP(totalDieta)} />
        <Stat label="Ascensor/Bajador" value={formatDOP(totalElevator)} />
        <Stat label="Total a pagar" value={formatDOP(totalToPay)} highlight />
      </div>

      <form onSubmit={handleAddEntry} className="mt-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Date
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Overtime hours
          <input
            type="number"
            min={0}
            step={0.5}
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-28 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Dieta (DOP)
          <input
            type="number"
            min={0}
            value={dieta}
            onChange={(e) => setDieta(e.target.value)}
            className="w-28 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Ascensor/Bajador (DOP)
          <input
            type="number"
            min={0}
            step={100}
            value={elevator}
            onChange={(e) => setElevator(e.target.value)}
            className="w-36 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            placeholder="100, 200…"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add entry"}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {termGroups.length > 0 && (
        <div className="mt-4 flex flex-col gap-4">
          {termGroups.map((group) => (
            <div key={group.key} className="rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
                <p className="text-sm font-semibold">{group.label}</p>
                <p className="text-sm text-zinc-500">
                  Half base {formatDOP(halfBaseSalary)} + {group.termHours}h ({formatDOP(group.termOvertimePay)}) +
                  dieta {formatDOP(group.termDieta)} + ascensor {formatDOP(group.termElevator)} ={" "}
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatDOP(group.termTotal)}</span>
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-800">
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Hours</th>
                      <th className="px-4 py-2">Price</th>
                      <th className="px-4 py-2">Dieta</th>
                      <th className="px-4 py-2">Ascensor/Bajador</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.entries.map((entry) => (
                      <tr key={entry.id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800">
                        <td className="px-4 py-2">{entry.date}</td>
                        <td className="px-4 py-2">{entry.hours}</td>
                        <td className="px-4 py-2">{formatDOP(Number(entry.hours) * overtimeRate)}</td>
                        <td className="px-4 py-2">{formatDOP(entry.dieta_amount)}</td>
                        <td className="px-4 py-2">{entry.elevator_amount ? formatDOP(entry.elevator_amount) : "-"}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-3 ${highlight ? "bg-blue-50 dark:bg-blue-950" : "bg-zinc-50 dark:bg-zinc-800"}`}>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className={`mt-0.5 font-semibold ${highlight ? "text-blue-700 dark:text-blue-300" : ""}`}>{value}</p>
    </div>
  );
}
