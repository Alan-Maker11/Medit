"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteExpenseButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!window.confirm("Delete this expense? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
    >
      {loading ? "..." : "Delete"}
    </button>
  );
}
