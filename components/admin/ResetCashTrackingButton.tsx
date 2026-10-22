"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { todayLocalISO } from "@/lib/date";

export default function ResetCashTrackingButton({
  driverId,
  driverName,
  currentResetAt,
  currentResetBalance,
}: {
  driverId: string;
  driverName: string;
  currentResetAt: string | null;
  currentResetBalance: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetAt, setResetAt] = useState(todayLocalISO());
  const [resetBalance, setResetBalance] = useState(String(currentResetBalance || 0));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch(`/api/drivers/${driverId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cash_reset_at: resetAt, cash_reset_balance: Number(resetBalance) || 0 }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to reset cash tracking");
      return;
    }
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-1 text-xs font-medium text-zinc-500 hover:underline dark:text-zinc-400"
      >
        {currentResetAt ? `Start fresh again (reset ${currentResetAt})` : "Start fresh →"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Start fresh — {driverName}</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Ignores every trip, expense, and handoff before this date, and starts the balance at the amount
              below instead of RD$0 — use this once you&apos;ve reconciled what {driverName.split(" ")[0]} actually
              has on hand, so you only need to track handoffs from here on.
            </p>
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-sm font-medium">
                Start tracking from
                <input
                  type="date"
                  required
                  value={resetAt}
                  onChange={(e) => setResetAt(e.target.value)}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                  autoFocus
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Actual cash in hand on that date (DOP)
                <input
                  type="number"
                  min={0}
                  value={resetBalance}
                  onChange={(e) => setResetBalance(e.target.value)}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                />
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="mt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={submitting}
                  className="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-200 dark:text-zinc-900"
                >
                  {submitting ? "Saving..." : "Start fresh"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
