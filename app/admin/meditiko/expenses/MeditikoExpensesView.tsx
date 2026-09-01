"use client";

import { useEffect, useState } from "react";
import { formatDOP } from "@/lib/fare";
import { currentLocalMonth, todayLocalISO } from "@/lib/date";
import { MEDITIKO_EXPENSE_CATEGORIES, type MeditikoExpense } from "@/lib/types";

interface DriverOption {
  id: string;
  name: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  storage: "🅿️ Almacenaje/Parqueo",
  gas: "⛽ Gasolina",
  maintenance: "🔧 Mantenimiento",
  insurance: "🛡️ Seguro",
  tolls: "🛣️ Peajes",
  other: "📋 Otro",
};

/** Monday-start week key + label for a "YYYY-MM-DD" date string. */
function weekOf(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (x: Date) => x.toISOString().slice(0, 10);
  return { key: fmt(monday), start: fmt(monday), end: fmt(sunday) };
}

export default function MeditikoExpensesView({ drivers }: { drivers: DriverOption[] }) {
  const [month, setMonth] = useState(currentLocalMonth());
  const [expenses, setExpenses] = useState<MeditikoExpense[]>([]);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState(todayLocalISO());
  const [category, setCategory] = useState<string>(MEDITIKO_EXPENSE_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [driverId, setDriverId] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function loadExpenses() {
    setLoading(true);
    fetch(`/api/meditiko/expenses?month=${month}`)
      .then((res) => res.json())
      .then((data) => setExpenses(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }

  useEffect(loadExpenses, [month]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/meditiko/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, category, description, amount, driver_id: driverId || null, notes }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "No se pudo guardar el gasto");
      return;
    }
    setDescription("");
    setAmount("");
    setNotes("");
    loadExpenses();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("¿Eliminar este gasto?")) return;
    const res = await fetch(`/api/meditiko/expenses/${id}`, { method: "DELETE" });
    if (res.ok) setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  const weekMap = new Map<string, { start: string; end: string; expenses: MeditikoExpense[] }>();
  for (const expense of expenses) {
    const { key, start, end } = weekOf(expense.date);
    const bucket = weekMap.get(key) ?? { start, end, expenses: [] };
    bucket.expenses.push(expense);
    weekMap.set(key, bucket);
  }
  const weeks = [...weekMap.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  const monthTotal = expenses.reduce((sum, e) => sum + (e.amount ?? 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Mes
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          />
        </label>
      </div>

      {/* Add expense form */}
      <form
        onSubmit={handleAdd}
        className="flex flex-wrap items-end gap-3 rounded-2xl border border-orange-200 bg-orange-50/50 p-4 dark:border-orange-900 dark:bg-orange-950/10"
      >
        <label className="flex flex-col gap-1 text-sm font-medium">
          Fecha
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Categoría
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800">
            {MEDITIKO_EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c] ?? c}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Descripción
          <input required value={description} onChange={(e) => setDescription(e.target.value)} className="w-44 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Monto (DOP)
          <input type="number" min={0} required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-32 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Conductor
          <select value={driverId} onChange={(e) => setDriverId(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800">
            <option value="">-</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Notas
          <input value={notes} onChange={(e) => setNotes(e.target.value)} className="w-40 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
        </label>
        <button type="submit" disabled={submitting} className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50">
          {submitting ? "Guardando..." : "Agregar gasto"}
        </button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white dark:border-orange-900">
        <p className="text-sm text-orange-100">Total del mes</p>
        <p className="text-3xl font-black">{formatDOP(monthTotal)}</p>
        <p className="text-sm text-orange-100">{expenses.length} gasto{expenses.length !== 1 ? "s" : ""}</p>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Cargando…</p>
      ) : (
        <div className="flex flex-col gap-3">
          {weeks.map(([key, week]) => {
            const weekTotal = week.expenses.reduce((sum, e) => sum + (e.amount ?? 0), 0);
            return (
              <details key={key} open className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2 bg-zinc-50 px-4 py-3 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800">
                  <span className="font-medium">
                    Semana {week.start} — {week.end}
                  </span>
                  <span className="flex items-center gap-3 text-sm text-zinc-500">
                    <span>{week.expenses.length} gasto{week.expenses.length !== 1 ? "s" : ""}</span>
                    <span className="font-semibold text-orange-600">{formatDOP(weekTotal)}</span>
                  </span>
                </summary>
                <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                  {week.expenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between gap-3 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">
                          {CATEGORY_LABELS[expense.category] ?? expense.category} · {expense.description}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {expense.date}
                          {expense.notes ? ` · ${expense.notes}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{formatDOP(expense.amount)}</span>
                        <button onClick={() => handleDelete(expense.id)} className="text-xs font-medium text-red-500 hover:underline">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            );
          })}
          {weeks.length === 0 && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
              No hay gastos registrados este mes.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
