"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewDriverPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    base_monthly_salary: "",
    overtime_hourly_rate: "",
    diet_morning_allowance: "100",
    diet_evening_allowance: "200",
    status: "active",
    start_date: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/drivers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save driver");
      return;
    }
    router.push("/admin/drivers");
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Add driver</h1>
      <form
        onSubmit={handleSubmit}
        className="grid max-w-2xl gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-2"
      >
        <label className="flex flex-col gap-1 text-sm font-medium">
          Name
          <input required value={form.name} onChange={(e) => update("name", e.target.value)} className="input" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Phone
          <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="input" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Email
          <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="input" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Start date
          <input type="date" value={form.start_date} onChange={(e) => update("start_date", e.target.value)} className="input" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Base monthly salary (DOP)
          <input
            type="number"
            value={form.base_monthly_salary}
            onChange={(e) => update("base_monthly_salary", e.target.value)}
            className="input"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Overtime rate (DOP/hr)
          <input
            type="number"
            value={form.overtime_hourly_rate}
            onChange={(e) => update("overtime_hourly_rate", e.target.value)}
            className="input"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Morning diet allowance (DOP)
          <input
            type="number"
            value={form.diet_morning_allowance}
            onChange={(e) => update("diet_morning_allowance", e.target.value)}
            className="input"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Evening diet allowance (DOP)
          <input
            type="number"
            value={form.diet_evening_allowance}
            onChange={(e) => update("diet_evening_allowance", e.target.value)}
            className="input"
          />
        </label>

        {error && <p className="col-span-2 text-sm text-red-600">{error}</p>}

        <div className="col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save driver"}
          </button>
        </div>
      </form>
    </div>
  );
}
