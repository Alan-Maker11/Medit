"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/** Inline edit-date + delete controls for a cash-in-hand line item (an expense or a handoff),
 *  so a wrong date (like one defaulted to "today" instead of when the cash was actually used)
 *  can be fixed directly from the dashboard instead of via SQL. */
export default function CashEntryActions({
  kind,
  id,
  currentDate,
}: {
  kind: "expense" | "handoff";
  id: string;
  currentDate: string | null;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [date, setDate] = useState(currentDate ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiPath = kind === "expense" ? `/api/expenses/${id}` : `/api/driver-cash-handoffs/${id}`;

  async function saveDate() {
    setSubmitting(true);
    setError(null);
    const res = await fetch(apiPath, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save");
      return;
    }
    setEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this entry? This can't be undone.")) return;
    setSubmitting(true);
    const res = await fetch(apiPath, { method: "DELETE" });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to delete");
      return;
    }
    router.refresh();
  }

  if (editing) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded border border-zinc-300 px-1 py-0.5 text-[11px] dark:border-zinc-700 dark:bg-zinc-800"
        />
        <button onClick={saveDate} disabled={submitting} className="text-blue-600 hover:underline disabled:opacity-50">
          Save
        </button>
        <button onClick={() => setEditing(false)} disabled={submitting} className="text-zinc-400 hover:underline">
          Cancel
        </button>
        {error && <span className="text-red-600">{error}</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-1 text-zinc-400">
      <button onClick={() => setEditing(true)} className="hover:text-blue-600 hover:underline">
        Fix date
      </button>
      {kind === "expense" && (
        <Link href={`/admin/expenses/${id}/edit`} className="hover:text-blue-600 hover:underline">
          Edit
        </Link>
      )}
      <button onClick={handleDelete} disabled={submitting} className="hover:text-red-600 hover:underline disabled:opacity-50">
        Delete
      </button>
    </span>
  );
}
