"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentDriver, type DriverSession } from "@/lib/driver-auth";
import { formatDOP } from "@/lib/fare";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface SalaryEntry {
  date: string;
  hours: number;
  dieta_amount: number;
  elevator_amount: number;
}

interface SalaryResponse {
  month: string;
  driver: { name: string; baseMonthlySalary: number; overtimeHourlyRate: number };
  entries: SalaryEntry[];
}

function termOf(dateStr: string): 1 | 2 {
  return Number(dateStr.slice(8, 10)) <= 15 ? 1 : 2;
}

export default function DriverSalaryPage() {
  const router = useRouter();
  const [session, setSession] = useState<DriverSession | null>(null);
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [data, setData] = useState<SalaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const current = await getCurrentDriver();
      if (!current) {
        router.push("/driver/login");
        return;
      }
      setSession(current);
    })();
  }, [router]);

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    setError(null);
    fetch(`/api/driver/salary?month=${month}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Failed to load salary");
        setData(json);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [session, month]);

  const termGroups = useMemo(() => {
    if (!data) return [];
    const halfBaseSalary = data.driver.baseMonthlySalary / 2;
    const rate = data.driver.overtimeHourlyRate;
    const map = new Map<1 | 2, SalaryEntry[]>();
    for (const entry of data.entries) {
      const term = termOf(entry.date);
      const list = map.get(term) ?? [];
      list.push(entry);
      map.set(term, list);
    }
    return ([1, 2] as const)
      .filter((term) => map.has(term))
      .map((term) => {
        const termEntries = map.get(term)!;
        const termHours = termEntries.reduce((sum, e) => sum + Number(e.hours), 0);
        const termOvertimePay = termHours * rate;
        const termDieta = termEntries.reduce((sum, e) => sum + Number(e.dieta_amount), 0);
        const termElevator = termEntries.reduce((sum, e) => sum + Number(e.elevator_amount), 0);
        const termTotal = halfBaseSalary + termOvertimePay + termDieta + termElevator;
        return {
          term,
          label: term === 1 ? "1st term (1-15)" : "2nd term (16-end)",
          entries: termEntries,
          halfBaseSalary,
          termHours,
          termOvertimePay,
          termDieta,
          termElevator,
          termTotal,
        };
      });
  }, [data]);

  const [year, mon] = month.split("-").map(Number);
  const monthLabel = `${MONTH_NAMES[mon - 1]} ${year}`;

  function shiftMonth(delta: number) {
    const next = new Date(year, mon - 1 + delta, 1);
    setMonth(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`);
  }

  if (!session) {
    return <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-5 sm:py-6">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">My Salary</h1>
            <p className="text-sm text-zinc-500">{session.driver.name}</p>
          </div>
          <button
            onClick={() => router.push("/driver/dashboard")}
            className="rounded-full bg-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
          >
            Back
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
        <div className="mb-4 flex items-center justify-between gap-2">
          <button
            onClick={() => shiftMonth(-1)}
            className="rounded-full bg-white px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            ← Prev
          </button>
          <p className="font-semibold text-zinc-900 dark:text-white">{monthLabel}</p>
          <button
            onClick={() => shiftMonth(1)}
            className="rounded-full bg-white px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Next →
          </button>
        </div>

        {loading && <p className="text-sm text-zinc-500">Loading...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && data && (
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              Base monthly salary {formatDOP(data.driver.baseMonthlySalary)} · Overtime rate{" "}
              {formatDOP(data.driver.overtimeHourlyRate)}/hr
            </div>

            {termGroups.length === 0 && (
              <p className="text-sm text-zinc-500">No overtime entries recorded for {monthLabel}.</p>
            )}

            {termGroups.map((group) => (
              <div key={group.term} className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
                  <p className="font-semibold text-zinc-900 dark:text-white">{group.label}</p>
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{formatDOP(group.termTotal)}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
                  <Stat label="Half base salary" value={formatDOP(group.halfBaseSalary)} />
                  <Stat label="Overtime" value={`${group.termHours}h / ${formatDOP(group.termOvertimePay)}`} />
                  <Stat label="Dieta" value={formatDOP(group.termDieta)} />
                  <Stat label="Ascensor/Bajador" value={formatDOP(group.termElevator)} />
                </div>
                <div className="overflow-x-auto border-t border-zinc-200 dark:border-zinc-800">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-800">
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Hours</th>
                        <th className="px-4 py-2">Overtime pay</th>
                        <th className="px-4 py-2">Dieta</th>
                        <th className="px-4 py-2">Ascensor/Bajador</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.entries.map((entry) => (
                        <tr key={entry.date} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800">
                          <td className="px-4 py-2">{entry.date}</td>
                          <td className="px-4 py-2">{entry.hours}</td>
                          <td className="px-4 py-2">{formatDOP(Number(entry.hours) * data.driver.overtimeHourlyRate)}</td>
                          <td className="px-4 py-2">{formatDOP(entry.dieta_amount)}</td>
                          <td className="px-4 py-2">{entry.elevator_amount ? formatDOP(entry.elevator_amount) : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-0.5 font-semibold text-zinc-900 dark:text-zinc-100">{value}</p>
    </div>
  );
}
