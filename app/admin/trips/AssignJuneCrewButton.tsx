"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AssignJuneCrewButton() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/trips/bulk-assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: "2026-06", driver_name: "Juan F Mora", vehicle_name: "Medissan" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(`Error: ${data.error ?? "assignment failed"}`);
        return;
      }
      setStatus(`Assigned Juan F Mora / Medissan to ${data.updated} trips in June 2026.`);
      router.refresh();
    } catch {
      setStatus("Error: could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm font-medium">One-time: assign driver/vehicle to June 2026 trips</p>
      <p className="mt-1 text-sm text-zinc-500">
        Sets driver to Juan F Mora and vehicle to Medissan on every trip dated June 2026. Creates the driver/vehicle
        if they don&apos;t exist yet. Safe to click more than once.
      </p>
      <button
        onClick={handleClick}
        disabled={loading}
        className="mt-3 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Assigning..." : "Assign June 2026 trips"}
      </button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
}
