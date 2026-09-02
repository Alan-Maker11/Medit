"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DriverEditForm({ driver }: { driver: Record<string, any> }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: driver.name ?? "",
    phone: driver.phone ?? "",
    email: driver.email ?? "",
    base_monthly_salary: driver.base_monthly_salary ?? "",
    overtime_hourly_rate: driver.overtime_hourly_rate ?? "",
    diet_morning_allowance: driver.diet_morning_allowance ?? "100",
    diet_evening_allowance: driver.diet_evening_allowance ?? "200",
    status: driver.status ?? "active",
    start_date: driver.start_date ?? "",
  });
  const [isMeditiko, setIsMeditiko] = useState(Boolean(driver.is_meditiko));

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSaved(false);
    const res = await fetch(`/api/drivers/${driver.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        base_monthly_salary: form.base_monthly_salary ? Number(form.base_monthly_salary) : null,
        overtime_hourly_rate: form.overtime_hourly_rate ? Number(form.overtime_hourly_rate) : null,
        diet_morning_allowance: Number(form.diet_morning_allowance),
        diet_evening_allowance: Number(form.diet_evening_allowance),
        start_date: form.start_date || null,
        is_meditiko: isMeditiko,
      }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to update driver");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    const res = await fetch(`/api/drivers/${driver.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setDeleting(false);
      setDeleteError(data.error ?? "Failed to delete driver");
      return;
    }
    router.push("/admin/drivers");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h2 className="text-lg font-semibold">Driver details</h2>
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
        Status
        <select value={form.status} onChange={(e) => update("status", e.target.value)} className="input">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
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

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={isMeditiko} onChange={(e) => setIsMeditiko(e.target.checked)} />
        ⚡ Conductor Meditiko (base + 20% comisión por cliente, en vez de horas extra/dieta)
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-green-600">Saved.</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Save changes"}
      </button>

      <div className="mt-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
        {deleteError && <p className="mb-2 text-sm text-red-600">{deleteError}</p>}
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="rounded-full border border-red-300 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
        >
          Eliminar conductor
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">¿Eliminar a {driver.name}?</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Esta acción no se puede deshacer. Se eliminará el conductor y todos sus datos de salario,
              horas extra y comisiones. Sus viajes se conservarán sin conductor asignado.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
