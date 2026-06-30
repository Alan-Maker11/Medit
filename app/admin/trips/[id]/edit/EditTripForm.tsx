"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Option {
  id: string;
  name: string;
}

export default function EditTripForm({
  trip,
  services,
  drivers,
  vehicles,
}: {
  trip: Record<string, any>;
  services: Option[];
  drivers: Option[];
  vehicles: Option[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    date: trip.date ?? "",
    service_id: trip.service_id ?? "",
    client_name: trip.client_name ?? "",
    client_phone: trip.client_phone ?? "",
    pickup_address: trip.pickup_address ?? "",
    destination_address: trip.destination_address ?? "",
    driver_id: trip.driver_id ?? "",
    vehicle_id: trip.vehicle_id ?? "",
    trip_type: trip.trip_type ?? "one-way",
    transportation_mode: trip.transportation_mode ?? "private",
    status: trip.status ?? "pending",
    total_fare: trip.total_fare ?? "",
    notes: trip.notes ?? "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch(`/api/trips/${trip.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        service_id: form.service_id || null,
        driver_id: form.driver_id || null,
        vehicle_id: form.vehicle_id || null,
        total_fare: form.total_fare === "" ? null : Number(form.total_fare),
      }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to update trip");
      return;
    }
    router.push("/admin/trips");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid max-w-2xl gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-2"
    >
      <label className="flex flex-col gap-1 text-sm font-medium">
        Date
        <input type="date" required value={form.date} onChange={(e) => update("date", e.target.value)} className="input" />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Service type
        <select value={form.service_id} onChange={(e) => update("service_id", e.target.value)} className="input">
          <option value="">Select service</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Client name
        <input value={form.client_name} onChange={(e) => update("client_name", e.target.value)} className="input" />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Client phone
        <input value={form.client_phone} onChange={(e) => update("client_phone", e.target.value)} className="input" />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium md:col-span-2">
        Pickup address
        <input value={form.pickup_address} onChange={(e) => update("pickup_address", e.target.value)} className="input" />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium md:col-span-2">
        Destination address
        <input value={form.destination_address} onChange={(e) => update("destination_address", e.target.value)} className="input" />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Driver
        <select value={form.driver_id} onChange={(e) => update("driver_id", e.target.value)} className="input">
          <option value="">Select driver</option>
          {drivers.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
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
        Trip type
        <select value={form.trip_type} onChange={(e) => update("trip_type", e.target.value)} className="input">
          <option value="one-way">One-way</option>
          <option value="round-trip">Round-trip</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Mode
        <select value={form.transportation_mode} onChange={(e) => update("transportation_mode", e.target.value)} className="input">
          <option value="private">Private</option>
          <option value="public">Public (Meditiko)</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Status
        <select value={form.status} onChange={(e) => update("status", e.target.value)} className="input">
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Total fare (DOP)
        <input
          type="number"
          value={form.total_fare}
          onChange={(e) => update("total_fare", e.target.value)}
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
          {submitting ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
