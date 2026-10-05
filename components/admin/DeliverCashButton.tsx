"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BANK_ACCOUNTS, CASH_HANDOFF_USES, type CashHandoffUse } from "@/lib/types";
import { todayLocalISO } from "@/lib/date";

const USE_LABELS: Record<CashHandoffUse, string> = {
  gas: "Gas",
  salary: "Salary",
  bank_deposit: "Bank deposit",
  other: "Other",
};

export default function DeliverCashButton({ driverId, driverName }: { driverId: string; driverName: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayLocalISO());
  const [usedFor, setUsedFor] = useState<CashHandoffUse>("gas");
  const [bankAccount, setBankAccount] = useState<string>(BANK_ACCOUNTS[0]);
  const [notes, setNotes] = useState("");

  function reset() {
    setAmount("");
    setDate(todayLocalISO());
    setUsedFor("gas");
    setBankAccount(BANK_ACCOUNTS[0]);
    setNotes("");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/driver-cash-handoffs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        driver_id: driverId,
        date,
        amount,
        used_for: usedFor,
        bank_account: usedFor === "bank_deposit" ? bankAccount : undefined,
        notes,
      }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to record handoff");
      return;
    }
    setOpen(false);
    reset();
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-1 text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-300"
      >
        Deliver cash →
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Deliver cash — {driverName}</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Records that this cash has left {driverName.split(" ")[0]}'s hand and been handed to you.
            </p>
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-sm font-medium">
                Amount (DOP)
                <input
                  type="number"
                  required
                  min={0}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                  autoFocus
                />
              </label>
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
                Used for
                <select
                  value={usedFor}
                  onChange={(e) => setUsedFor(e.target.value as CashHandoffUse)}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                >
                  {CASH_HANDOFF_USES.map((u) => (
                    <option key={u} value={u}>
                      {USE_LABELS[u]}
                    </option>
                  ))}
                </select>
              </label>
              {usedFor === "bank_deposit" && (
                <label className="flex flex-col gap-1 text-sm font-medium">
                  Bank account
                  <select
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                  >
                    {BANK_ACCOUNTS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label className="flex flex-col gap-1 text-sm font-medium">
                Notes (optional)
                <input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                />
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="mt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    reset();
                  }}
                  disabled={submitting}
                  className="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Record handoff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
