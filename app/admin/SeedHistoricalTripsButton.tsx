"use client";

import { useState } from "react";

export default function SeedHistoricalTripsButton() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/import/seed-historical-trips", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setStatus(`Error: ${data.error ?? "import failed"}`);
        return;
      }
      setStatus(`Imported ${data.imported} trips, skipped ${data.skipped} already-present duplicates.`);
    } catch {
      setStatus("Error: could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm font-medium">One-time: import historical trips (Oct 2024 - Jun 2026)</p>
      <p className="mt-1 text-sm text-zinc-500">
        Loads the trips from your spreadsheet into the database. Safe to click more than once — already
        imported trips are skipped.
      </p>
      <button
        onClick={handleClick}
        disabled={loading}
        className="mt-3 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Importing..." : "Import historical trips"}
      </button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
}
