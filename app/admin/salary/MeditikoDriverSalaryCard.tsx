"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { formatDOP, MEDITIKO_DRIVER_COMMISSION_RATE } from "@/lib/fare";
import { todayLocalISO } from "@/lib/date";
import type { Driver, MeditikoDriverEarning } from "@/lib/types";

interface EditState {
  id: string;
  client_name: string;
  date: string;
  gross_amount: string;
  notes: string;
}

function EarningRow({
  entry,
  onSave,
  onDelete,
}: {
  entry: MeditikoDriverEarning;
  onSave: (state: EditState) => Promise<string | null>;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditState>({
    id: entry.id,
    client_name: entry.client_name,
    date: entry.date,
    gross_amount: String(entry.gross_amount),
    notes: entry.notes ?? "",
  });

  function startEdit() {
    setDraft({ id: entry.id, client_name: entry.client_name, date: entry.date, gross_amount: String(entry.gross_amount), notes: entry.notes ?? "" });
    setError(null);
    setEditing(true);
  }

  async function save() {
    setSaving(true);
    const err = await onSave(draft);
    setSaving(false);
    if (err) { setError(err); return; }
    setEditing(false);
  }

  const cellClass = "px-4 py-2";
  const inputClass = "w-full rounded-lg border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-800";

  if (editing) {
    const draftCommission = (Number(draft.gross_amount) || 0) * MEDITIKO_DRIVER_COMMISSION_RATE;
    return (
      <>
        <tr className="border-b border-zinc-100 bg-orange-50 dark:border-zinc-800 dark:bg-orange-950/30">
          <td className={cellClass}>
            <input value={draft.client_name} onChange={(e) => setDraft({ ...draft, client_name: e.target.value })} className={inputClass} />
          </td>
          <td className={cellClass}>
            <input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} className={inputClass} />
          </td>
          <td className={cellClass}>
            <input type="number" min={0} value={draft.gross_amount} onChange={(e) => setDraft({ ...draft, gross_amount: e.target.value })} className={inputClass} style={{ width: "7rem" }} />
          </td>
          <td className={cellClass}>{formatDOP(draftCommission)}</td>
          <td className={`${cellClass} whitespace-nowrap`}>
            <button onClick={save} disabled={saving} className="mr-2 text-xs font-medium text-blue-600 hover:underline disabled:opacity-50">
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={() => setEditing(false)} className="text-xs text-zinc-500 hover:underline">Cancel</button>
          </td>
        </tr>
        {error && (
          <tr>
            <td colSpan={5} className="px-4 pb-2 text-xs text-red-600">{error}</td>
          </tr>
        )}
      </>
    );
  }

  return (
    <tr className="group border-b border-zinc-100 last:border-0 dark:border-zinc-800">
      <td className={cellClass}>{entry.client_name}</td>
      <td className={cellClass}>{entry.date}</td>
      <td className={cellClass}>{formatDOP(entry.gross_amount)}</td>
      <td className={cellClass}>{formatDOP(entry.amount)}</td>
      <td className={`${cellClass} whitespace-nowrap`}>
        <button onClick={startEdit} className="mr-3 text-xs font-medium text-blue-600 hover:underline md:invisible md:group-hover:visible">
          Edit
        </button>
        <button onClick={() => onDelete(entry.id)} className="text-xs text-red-600 hover:underline">
          Remove
        </button>
      </td>
    </tr>
  );
}

export default function MeditikoDriverSalaryCard({ driver, earnings }: { driver: Driver; earnings: MeditikoDriverEarning[] }) {
  const router = useRouter();
  const baseSalary = driver.base_monthly_salary ?? 0;

  const [clientName, setClientName] = useState("");
  const [date, setDate] = useState(todayLocalISO());
  const [grossAmount, setGrossAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const commissionPreview = (Number(grossAmount) || 0) * MEDITIKO_DRIVER_COMMISSION_RATE;
  const sortedEarnings = useMemo(() => [...earnings].sort((a, b) => b.date.localeCompare(a.date)), [earnings]);
  const totalCommission = earnings.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalToPay = baseSalary + totalCommission;
  const clientsContracted = new Set(earnings.map((e) => e.client_name)).size;

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/meditiko/driver-earnings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ driver_id: driver.id, client_name: clientName, date, gross_amount: grossAmount, notes }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save earnings");
      return;
    }
    setClientName("");
    setGrossAmount("");
    setNotes("");
    router.refresh();
  }

  async function handleSave(state: EditState): Promise<string | null> {
    const res = await fetch(`/api/meditiko/driver-earnings/${state.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_name: state.client_name, date: state.date, gross_amount: state.gross_amount, notes: state.notes }),
    });
    if (!res.ok) {
      const data = await res.json();
      return data.error ?? "Failed to update earnings";
    }
    router.refresh();
    return null;
  }

  async function handleDelete(id: string) {
    await fetch(`/api/meditiko/driver-earnings/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm dark:border-orange-900 dark:bg-zinc-900">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">⚡ {driver.name}</h2>
        <p className="text-sm text-zinc-500">Salario base {formatDOP(baseSalary)} · Comisión {MEDITIKO_DRIVER_COMMISSION_RATE * 100}% por cliente</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Salario base" value={formatDOP(baseSalary)} />
        <Stat label="Clientes contratados" value={String(clientsContracted)} />
        <Stat label="Comisión total" value={formatDOP(totalCommission)} />
        <Stat label="Total a pagar" value={formatDOP(totalToPay)} highlight />
      </div>

      <form onSubmit={handleAdd} className="mt-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Cliente
          <input required value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-40 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Fecha
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Total del día del cliente (DOP)
          <input type="number" min={0} value={grossAmount} onChange={(e) => setGrossAmount(e.target.value)} className="w-40 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
        </label>
        <div className="flex flex-col gap-1 text-sm font-medium">
          Comisión ({MEDITIKO_DRIVER_COMMISSION_RATE * 100}%)
          <div className="flex h-[38px] items-center rounded-lg border border-dashed border-orange-300 bg-orange-50 px-3 text-sm font-semibold text-orange-700 dark:border-orange-800 dark:bg-orange-950/30 dark:text-orange-300">
            {formatDOP(commissionPreview)}
          </div>
        </div>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Notas
          <input value={notes} onChange={(e) => setNotes(e.target.value)} className="w-40 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
        </label>
        <button type="submit" disabled={submitting} className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50">
          {submitting ? "Guardando..." : "Agregar"}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {sortedEarnings.length > 0 && (
        <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-800">
                <th className="px-4 py-2">Cliente</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Total del día</th>
                <th className="px-4 py-2">Comisión</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {sortedEarnings.map((entry) => (
                <EarningRow key={entry.id} entry={entry} onSave={handleSave} onDelete={handleDelete} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-3 ${highlight ? "bg-orange-50 dark:bg-orange-950/30" : "bg-zinc-50 dark:bg-zinc-800"}`}>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className={`mt-0.5 font-semibold ${highlight ? "text-orange-600" : ""}`}>{value}</p>
    </div>
  );
}
