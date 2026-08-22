"use client";

import { useState } from "react";

export default function PaymentStatusToggle({
  tripId,
  status,
  onToggled,
}: {
  tripId: string;
  status: string;
  onToggled: (nextStatus: string) => void;
}) {
  const [saving, setSaving] = useState(false);
  const isPaid = status === "paid";

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (saving) return;
    const next = isPaid ? "pending" : "paid";
    setSaving(true);
    onToggled(next); // optimistic
    const res = await fetch(`/api/trips/${tripId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment_status: next }),
    });
    setSaving(false);
    if (!res.ok) onToggled(status); // revert on failure
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={saving}
      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-60 ${
        isPaid
          ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300"
          : "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-300"
      }`}
    >
      {isPaid ? "Paid" : "Pending"}
    </button>
  );
}
