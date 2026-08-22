"use client";

import { useState } from "react";
import { useAdminLang, ADMIN_T } from "@/lib/adminLang";

/**
 * Pure manual reminder — "this client still owes for this trip." Has no relationship
 * to trip completion status (pending/completed/cancelled). Off by default for every
 * trip; only becomes visible once clicked on.
 */
export default function PaymentStatusToggle({
  tripId,
  owes,
  onToggled,
}: {
  tripId: string;
  owes: boolean;
  onToggled: (nextOwes: boolean) => void;
}) {
  const { lang } = useAdminLang();
  const t = ADMIN_T[lang];
  const [saving, setSaving] = useState(false);

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (saving) return;
    const next = !owes;
    setSaving(true);
    onToggled(next); // optimistic
    const res = await fetch(`/api/trips/${tripId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_owes: next }),
    });
    setSaving(false);
    if (!res.ok) onToggled(owes); // revert on failure
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={saving}
      title={t.clientOwesHint}
      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-60 ${
        owes
          ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300"
          : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-500"
      }`}
    >
      {owes ? t.clientOwes : "—"}
    </button>
  );
}
