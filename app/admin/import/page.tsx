"use client";

import { useRef, useState } from "react";

interface ImportResult {
  total_records: number;
  imported: number;
  skipped: number;
  errors: string[];
}

export default function ImportPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Please select a CSV file");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/import/trips", { method: "POST", body: formData });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Import failed");
      return;
    }
    setResult(data);
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Import historical data</h1>
      <div className="max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          Upload a CSV exported from Google Sheets with columns: <code>date</code> (YYYY-MM-DD),{" "}
          <code>price</code>, <code>service_type</code>, <code>client_name</code>. Optional:{" "}
          <code>notes</code>. Duplicate records (same date, price and client) are skipped automatically.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input ref={fileInputRef} type="file" accept=".csv" className="input" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="self-start rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Importing..." : "Import CSV"}
          </button>
        </form>

        {result && (
          <div className="mt-6 flex flex-col gap-2 text-sm">
            <p>
              <strong>{result.total_records}</strong> records found, <strong>{result.imported}</strong>{" "}
              imported, <strong>{result.skipped}</strong> duplicates skipped, <strong>{result.errors.length}</strong>{" "}
              errors.
            </p>
            {result.errors.length > 0 && (
              <ul className="mt-2 max-h-48 list-disc overflow-y-auto rounded-lg bg-red-50 p-3 pl-8 text-red-700 dark:bg-red-950 dark:text-red-300">
                {result.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
