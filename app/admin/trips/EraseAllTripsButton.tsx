"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EraseAllTripsButton() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!window.confirm("This will permanently delete ALL trips. This cannot be undone. Continue?")) {
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/trips", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setStatus(`Error: ${data.error ?? "delete failed"}`);
        return;
      }
      setStatus("All trips erased.");
      router.refresh();
    } catch {
      setStatus("Error: could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm dark:border-red-900 dark:bg-red-950/30">
      <p className="text-sm font-medium text-red-700 dark:text-red-400">Danger zone</p>
      <p className="mt-1 text-sm text-red-600 dark:text-red-400/80">
        Permanently delete all trips so you can start fresh. This cannot be undone.
      </p>
      <button
        onClick={handleClick}
        disabled={loading}
        className="mt-3 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? "Erasing..." : "Erase all trips"}
      </button>
      {status && <p className="mt-2 text-sm text-red-700 dark:text-red-400">{status}</p>}
    </div>
  );
}
