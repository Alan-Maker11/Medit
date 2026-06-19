"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SERVICE_TYPES } from "@/lib/types";

interface Option {
  id: string;
  name: string;
}

export default function NewTripPage() {
  const router = useRouter();
  const [services, setServices] = useState<Option[]>([]);
  const [drivers, setDrivers] = useState<Option[]>([]);
  const [vehicles, setVehicles] = useState<Option[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    service_id: "",
    client_name: "",
    client_phone: "",
    pickup_address: "",
    destination_address: "",
    driver_id: "",
    vehicle_id: "",
    distance_km: "",
    duration_minutes: "",
    trip_type: "one-way",
    transportation_mode: "private",
    waiting_hours: "0",
    additional_fees: "0",
    notes: "",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("services")
      .select("id, name")
      .then(({ data }) => setServices(data ?? []));
    supabase
      .from("drivers")
      .select("id, name")
      .eq("status", "active")
      .then(({ data }) => setDrivers(data ?? []));
    supabase
      .from("vehicles")
      .select("id, name")
      .eq("status", "active")
      .then(({ data }) => setVehicles(data ?? []));
  }, []);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save trip");
      return;
    }
    router.push("/admin/trips");
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Log new trip</h1>
      <form
        onSubmit={handleSubmit}
        className="grid max-w-3xl gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-2"
      >
        <Field label="Date">
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Service type">
          <select value={form.service_id} onChange={(e) => update("service_id", e.target.value)} className="input">
            <option value="">Select service</option>
            {services.length > 0
              ? services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))
              : SERVICE_TYPES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
          </select>
        </Field>
        <Field label="Client name">
          <input value={form.client_name} onChange={(e) => update("client_name", e.target.value)} className="input" />
        </Field>
        <Field label="Client phone">
          <input value={form.client_phone} onChange={(e) => update("client_phone", e.target.value)} className="input" />
        </Field>
        <Field label="Pickup address" full>
          <input
            required
            value={form.pickup_address}
            onChange={(e) => update("pickup_address", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Destination address" full>
          <input
            required
            value={form.destination_address}
            onChange={(e) => update("destination_address", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Driver">
          <select value={form.driver_id} onChange={(e) => update("driver_id", e.target.value)} className="input">
            <option value="">Select driver</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Vehicle">
          <select value={form.vehicle_id} onChange={(e) => update("vehicle_id", e.target.value)} className="input">
            <option value="">Select vehicle</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Distance (km)">
          <input
            type="number"
            step="0.1"
            required
            value={form.distance_km}
            onChange={(e) => update("distance_km", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Duration (minutes)">
          <input
            type="number"
            required
            value={form.duration_minutes}
            onChange={(e) => update("duration_minutes", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Trip type">
          <select value={form.trip_type} onChange={(e) => update("trip_type", e.target.value)} className="input">
            <option value="one-way">One-way</option>
            <option value="round-trip">Round-trip</option>
          </select>
        </Field>
        <Field label="Mode">
          <select
            value={form.transportation_mode}
            onChange={(e) => update("transportation_mode", e.target.value)}
            className="input"
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </Field>
        {form.trip_type === "round-trip" && (
          <Field label="Waiting hours">
            <input
              type="number"
              step="0.5"
              value={form.waiting_hours}
              onChange={(e) => update("waiting_hours", e.target.value)}
              className="input"
            />
          </Field>
        )}
        <Field label="Additional fees (DOP)">
          <input
            type="number"
            value={form.additional_fees}
            onChange={(e) => update("additional_fees", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Notes" full>
          <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} className="input" rows={3} />
        </Field>

        {error && <p className="col-span-2 text-sm text-red-600">{error}</p>}

        <div className="col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save trip"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`flex flex-col gap-1 text-sm font-medium ${full ? "md:col-span-2" : ""}`}>
      {label}
      {children}
    </label>
  );
}
