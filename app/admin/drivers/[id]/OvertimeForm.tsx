"use client";

import { useEffect, useState } from "react";
import { formatDOP } from "@/lib/fare";

export default function OvertimeForm({ driverId }: { driverId: string }) {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [overtimeHours, setOvertimeHours] = useState("0");
  const [morningCount, setMorningCount] = useState("0");
  const [eveningCount, setEveningCount] = useState("0");
  const [paidStatus, setPaidStatus] = useState("pending");
  const [notes, setNotes] = useState("");
  const [total, setTotal] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSaved(false);
    fetch(`/api/drivers/${driverId}/compensation?month=${month}`)
      .then((res) => res.json())
      .then((data) => {
        const c = data.compensation;
        setOvertimeHours(String(c?.overtime_hours ?? 0));
        setMorningCount(String(c?.diet_allowance_morning_count ?? 0));
        setEveningCount(String(c?.diet_allowance_evening_count ?? 0));
        setPaidStatus(c?.paid_status ?? "pending");
        setNotes(c?.notes ?? "");
        setTotal(c?.total_compensation ?? null);
      });
  }, [driverId, month]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSaved(false);
    const res = await fetch(`/api/drivers/${driverId}/compensation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        month,
        overtime_hours: Number(overtimeHours),
        diet_allowance_morning_count: Number(morningCount),
        diet_allowance_evening_count: Number(eveningCount),
        paid_status: paidStatus,
        notes,
      }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save overtime/compensation");
      return;
    }
    const data = await res.json();
    setTotal(data.total_compensation);
    setSaved(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h2 className="text-lg font-semibold">Overtime &amp; monthly pay</h2>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Month
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="input" />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Overtime hours
        <input
          type="number"
          step="0.5"
          value={overtimeHours}
          onChange={(e) => setOvertimeHours(e.target.value)}
          className="input"
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Morning diets
          <input type="number" value={morningCount} onChange={(e) => setMorningCount(e.target.value)} className="input" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Evening diets
          <input type="number" value={eveningCount} onChange={(e) => setEveningCount(e.target.value)} className="input" />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Payment status
        <select value={paidStatus} onChange={(e) => setPaidStatus(e.target.value)} className="input">
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Notes
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="input" rows={2} />
      </label>

      {total !== null && (
        <div className="rounded-lg bg-zinc-50 p-3 text-sm dark:bg-zinc-800">
          Total compensation for {month}: <span className="font-semibold">{formatDOP(total)}</span>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-green-600">Saved.</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Save overtime / pay"}
      </button>
    </form>
  );
}
