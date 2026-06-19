"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { EXPENSE_CATEGORIES } from "@/lib/types";

interface Option {
  id: string;
  name: string;
}

export default function NewExpensePage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Option[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    category: EXPENSE_CATEGORIES[0],
    vehicle_id: "",
    amount: "",
    description: "",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("vehicles")
      .select("id, name")
      .then(({ data }) => setVehicles(data ?? []));
  }, []);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save expense");
      return;
    }
    router.push("/admin/expenses");
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Log new expense</h1>
      <form
        onSubmit={handleSubmit}
        className="grid max-w-2xl gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-2"
      >
        <label className="flex flex-col gap-1 text-sm font-medium">
          Date
          <input type="date" required value={form.date} onChange={(e) => update("date", e.target.value)} className="input" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Category
          <select value={form.category} onChange={(e) => update("category", e.target.value)} className="input">
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Vehicle
          <select value={form.vehicle_id} onChange={(e) => update("vehicle_id", e.target.value)} className="input">
            <option value="">Select vehicle</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Amount (DOP)
          <input
            type="number"
            required
            value={form.amount}
            onChange={(e) => update("amount", e.target.value)}
            className="input"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium md:col-span-2">
          Notes
          <textarea value={form.description} onChange={(e) => update("description", e.target.value)} className="input" rows={3} />
        </label>

        {error && <p className="col-span-2 text-sm text-red-600">{error}</p>}

        <div className="col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save expense"}
          </button>
        </div>
      </form>
    </div>
  );
}
