"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentDriver, type DriverSession } from "@/lib/driver-auth";
import { formatDOP } from "@/lib/fare";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

interface SalaryEntry {
  date: string;
  hours: number;
  dieta_amount: number;
  elevator_amount: number;
}

interface SalaryResponse {
  month: string;
  isMeditiko?: boolean;
  driver: { name: string; baseMonthlySalary: number; overtimeHourlyRate?: number; commissionRate?: number };
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
  const [openTerm, setOpenTerm] = useState<1 | 2 | null>(null);

  const todayISO = new Date().toISOString().slice(0, 10);
  const currentMonth = todayISO.slice(0, 7);
  const currentTerm = termOf(todayISO);

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
        if (!res.ok) throw new Error(json.error ?? "No se pudo cargar el salario");
        setData(json);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [session, month]);

  useEffect(() => {
    setOpenTerm(month === currentMonth ? currentTerm : null);
  }, [month, currentMonth, currentTerm]);

  const termGroups = useMemo(() => {
    if (!data) return [];
    const halfBaseSalary = data.driver.baseMonthlySalary / 2;
    const rate = data.driver.overtimeHourlyRate ?? 0;
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
          label: term === 1 ? "1er quincena (1-15)" : "2da quincena (16-fin)",
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
    return <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-5 sm:py-6">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">Mi Salario</h1>
            <p className="text-sm text-zinc-500">{session.driver.name}</p>
          </div>
          <button
            onClick={() => router.push("/driver/dashboard")}
            className="rounded-full bg-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
          >
            Volver
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
        <div className="mb-4 flex items-center justify-between gap-2">
          <button
            onClick={() => shiftMonth(-1)}
            className="rounded-full bg-white px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            ← Anterior
          </button>
          <p className="font-semibold text-zinc-900 dark:text-white">{monthLabel}</p>
          <button
            onClick={() => shiftMonth(1)}
            className="rounded-full bg-white px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Siguiente →
          </button>
        </div>

        {loading && <p className="text-sm text-zinc-500">Cargando...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && data && data.isMeditiko && (
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 text-center shadow-sm dark:border-orange-900 dark:bg-orange-950/20">
            <p className="text-lg font-bold text-orange-700 dark:text-orange-300">⚡ Conductor Meditiko</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Salario base mensual: <span className="font-semibold text-zinc-900 dark:text-white">{formatDOP(data.driver.baseMonthlySalary)}</span>
            </p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Comisión: <span className="font-semibold text-zinc-900 dark:text-white">{(data.driver.commissionRate ?? 0.2) * 100}%</span> por cliente contratado
            </p>
            <p className="mt-3 text-xs text-zinc-500">Contacta a tu supervisor para el detalle de pagos.</p>
          </div>
        )}

        {!loading && !error && data && !data.isMeditiko && (
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              Salario base mensual {formatDOP(data.driver.baseMonthlySalary)} · Tarifa hora extra{" "}
              {formatDOP(data.driver.overtimeHourlyRate ?? 0)}/hr
            </div>

            {termGroups.length === 0 && (
              <p className="text-sm text-zinc-500">No hay registros de horas extra para {monthLabel}.</p>
            )}

            {termGroups.map((group) => {
              const isOpen = openTerm === group.term;
              const isCurrent = month === currentMonth && group.term === currentTerm;
              return (
                <div key={group.term} className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <button
                    onClick={() => setOpenTerm(isOpen ? null : group.term)}
                    className="flex w-full flex-wrap items-baseline justify-between gap-2 px-4 py-3 text-left"
                  >
                    <span className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white">
                      {group.label}
                      {isCurrent && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          En curso
                        </span>
                      )}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-lg font-bold text-blue-700 dark:text-blue-300">{formatDOP(group.termTotal)}</span>
                      <span className={`text-zinc-400 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}>▾</span>
                    </span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-200 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <div className="grid grid-cols-2 gap-3 border-t border-zinc-200 p-4 dark:border-zinc-800 sm:grid-cols-4">
                        <Stat label="Mitad del salario base" value={formatDOP(group.halfBaseSalary)} />
                        <Stat label="Horas extras" value={`${group.termHours}h / ${formatDOP(group.termOvertimePay)}`} />
                        <Stat label="Dieta" value={formatDOP(group.termDieta)} />
                        <Stat label="Ascensor/Bajador" value={formatDOP(group.termElevator)} />
                      </div>
                      <div className="overflow-x-auto border-t border-zinc-200 dark:border-zinc-800">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-800">
                              <th className="px-4 py-2">Fecha</th>
                              <th className="px-4 py-2">Horas</th>
                              <th className="px-4 py-2">Pago hora extra</th>
                              <th className="px-4 py-2">Dieta</th>
                              <th className="px-4 py-2">Ascensor/Bajador</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.entries.map((entry) => (
                              <tr key={entry.date} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800">
                                <td className="px-4 py-2">{entry.date}</td>
                                <td className="px-4 py-2">{entry.hours}</td>
                                <td className="px-4 py-2">{formatDOP(Number(entry.hours) * (data.driver.overtimeHourlyRate ?? 0))}</td>
                                <td className="px-4 py-2">{formatDOP(entry.dieta_amount)}</td>
                                <td className="px-4 py-2">{entry.elevator_amount ? formatDOP(entry.elevator_amount) : "-"}</td>
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
