"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewVehiclePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    type: "",
    license_plate: "",
    fuel_consumption: "",
    current_km: "",
    status: "active",
    purchase_date: "",
    notes: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save vehicle");
      return;
    }
    router.push("/admin/vehicles");
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Add vehicle</h1>
      <form
        onSubmit={handleSubmit}
        className="grid max-w-2xl gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-2"
      >
        <label className="flex flex-col gap-1 text-sm font-medium">
          Vehicle name
          <input required value={form.name} onChange={(e) => update("name", e.target.value)} className="input" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Type
          <input
            placeholder="KYC V7, Nissan Serena..."
            value={form.type}
            onChange={(e) => update("type", e.target.value)}
            className="input"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          License plate
          <input value={form.license_plate} onChange={(e) => update("license_plate", e.target.value)} className="input" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Status
          <select value={form.status} onChange={(e) => update("status", e.target.value)} className="input">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Fuel consumption (km/liter)
          <input
            type="number"
            step="0.1"
            value={form.fuel_consumption}
            onChange={(e) => update("fuel_consumption", e.target.value)}
            className="input"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Current km
          <input
            type="number"
            value={form.current_km}
            onChange={(e) => update("current_km", e.target.value)}
            className="input"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Purchase date
          <input
            type="date"
            value={form.purchase_date}
            onChange={(e) => update("purchase_date", e.target.value)}
            className="input"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium md:col-span-2">
          Notes
          <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} className="input" rows={3} />
        </label>

        {error && <p className="col-span-2 text-sm text-red-600">{error}</p>}

        <div className="col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
}
