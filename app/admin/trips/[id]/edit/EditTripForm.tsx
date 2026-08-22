"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDOP, STAIR_CLIMBER_PRICING, getStairClimberPrice } from "@/lib/fare";
import { formatDateWithDay } from "@/lib/date-utils";

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
    pickup_time: trip.time ?? "",
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
    total_fare: trip.total_fare != null ? String(trip.total_fare) : "",
    notes: trip.notes ?? "",
  });

  // Equipment flags — shown for every trip type so the driver knows what to bring
  const [wheelchair, setWheelchair] = useState(Boolean(trip.needs_wheelchair));
  const [stairsElevator, setStairsElevator] = useState(Boolean(trip.needs_stair_climber));
  const [stairFloor, setStairFloor] = useState(Number(trip.stair_climber_floor) || 0);

  // Subir/Bajar fee helper state
  const [transportFee, setTransportFee] = useState("0");
  const [subBajarRoundTrip, setSubBajarRoundTrip] = useState(false);

  const selectedService = services.find((s) => s.id === form.service_id);
  const isSubirBajar = selectedService?.name === "Subir/Bajar";

  const subBajarMultiplier = subBajarRoundTrip ? 2 : 1;
  const subBajarTotal =
    (Number(transportFee) || 0) * subBajarMultiplier +
    (wheelchair ? 350 : 0) +
    (stairsElevator ? getStairClimberPrice(stairFloor) * subBajarMultiplier : 0);

  // Keep total_fare in sync with fee calculator when in Subir/Bajar mode
  function handleFeeChange(newTransport: string, newWheelchair: boolean, newStairs: boolean, newFloor: number) {
    const m = subBajarRoundTrip ? 2 : 1;
    const total = (Number(newTransport) || 0) * m + (newWheelchair ? 350 : 0) + (newStairs ? getStairClimberPrice(newFloor) * m : 0);
    setForm((prev) => ({ ...prev, total_fare: total > 0 ? String(total) : prev.total_fare }));
  }

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
        time: form.pickup_time || undefined,
        service_id: form.service_id || null,
        driver_id: form.driver_id || null,
        vehicle_id: form.vehicle_id || null,
        total_fare: form.total_fare === "" ? null : Number(form.total_fare),
        needs_wheelchair: wheelchair,
        needs_stair_climber: stairsElevator,
        stair_climber_floor: stairFloor,
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
      className="grid max-w-2xl gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:grid-cols-2"
    >
      <label className="flex flex-col gap-1 text-sm font-medium">
        Date
        <input type="date" required value={form.date} onChange={(e) => update("date", e.target.value)} className="input" />
        {form.date && <span className="text-xs text-zinc-500">{formatDateWithDay(form.date)}</span>}
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Pickup time
        <input type="time" value={form.pickup_time} onChange={(e) => update("pickup_time", e.target.value)} className="input" />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Service type
        <select value={form.service_id} onChange={(e) => update("service_id", e.target.value)} className="input">
          <option value="">Select service</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
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

      {/* Pickup — always shown; label changes for Subir/Bajar */}
      <label className="flex flex-col gap-1 text-sm font-medium md:col-span-2">
        {isSubirBajar ? "Building / pickup address" : "Pickup address"}
        <input value={form.pickup_address} onChange={(e) => update("pickup_address", e.target.value)} className="input" />
      </label>

      {/* Destination — hidden for Subir/Bajar */}
      {!isSubirBajar && (
        <label className="flex flex-col gap-1 text-sm font-medium md:col-span-2">
          Destination address
          <input value={form.destination_address} onChange={(e) => update("destination_address", e.target.value)} className="input" />
        </label>
      )}

      <label className="flex flex-col gap-1 text-sm font-medium">
        Driver
        <select value={form.driver_id} onChange={(e) => update("driver_id", e.target.value)} className="input">
          <option value="">Select driver</option>
          {drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Vehicle
        <select value={form.vehicle_id} onChange={(e) => update("vehicle_id", e.target.value)} className="input">
          <option value="">Select vehicle</option>
          {vehicles.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
      </label>

      {/* Trip type / mode — only for regular trips */}
      {!isSubirBajar && (
        <>
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
        </>
      )}

      <label className="flex flex-col gap-1 text-sm font-medium">
        Status
        <select value={form.status} onChange={(e) => update("status", e.target.value)} className="input">
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </label>

      {/* For regular trips: direct total fare input + equipment flags for the driver */}
      {!isSubirBajar && (
        <>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Total fare (DOP)
            <input
              type="number"
              value={form.total_fare}
              onChange={(e) => update("total_fare", e.target.value)}
              className="input"
            />
          </label>
          <fieldset className="flex flex-col gap-2 text-sm font-medium md:col-span-2">
            Equipment (shown to the driver)
            <div className="flex flex-col gap-2 text-sm font-normal">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={wheelchair} onChange={(e) => setWheelchair(e.target.checked)} />
                Wheelchair
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={stairsElevator}
                  onChange={(e) => {
                    setStairsElevator(e.target.checked);
                    if (!e.target.checked) setStairFloor(0);
                    else if (!stairFloor) setStairFloor(2);
                  }}
                />
                Stair climber / Elevator
              </label>
              {stairsElevator && (
                <div className="ml-6 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-zinc-500">Floor:</span>
                  {STAIR_CLIMBER_PRICING.map((p) => (
                    <button
                      key={p.floor}
                      type="button"
                      onClick={() => setStairFloor(p.floor)}
                      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                        stairFloor === p.floor
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-zinc-300 bg-white text-zinc-700 hover:border-orange-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}
                    >
                      {p.label} {p.price > 0 ? `(+${formatDOP(p.price)})` : ""}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </fieldset>
        </>
      )}

      {/* For Subir/Bajar: fee calculator that sets total_fare */}
      {isSubirBajar && (
        <fieldset className="flex flex-col gap-2 text-sm font-medium md:col-span-2">
          Service fees
          <div className="flex flex-col gap-2 text-sm font-normal">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={subBajarRoundTrip}
                onChange={(e) => {
                  setSubBajarRoundTrip(e.target.checked);
                  // recalc with new multiplier
                  const m = e.target.checked ? 2 : 1;
                  const total = (Number(transportFee) || 0) * m + (wheelchair ? 350 : 0) + (stairsElevator ? getStairClimberPrice(stairFloor) * m : 0);
                  if (total > 0) setForm((prev) => ({ ...prev, total_fare: String(total) }));
                }}
              />
              Round-trip (×2 — client goes down and comes back up)
            </label>
            <label className="flex items-center gap-2">
              Transportation fee per way (optional, DOP)
              <input
                type="number"
                min={0}
                value={transportFee}
                onChange={(e) => {
                  setTransportFee(e.target.value);
                  handleFeeChange(e.target.value, wheelchair, stairsElevator, stairFloor);
                }}
                className="input w-32"
              />
              {subBajarRoundTrip && Number(transportFee) > 0 && (
                <span className="text-sm text-zinc-500">= {formatDOP(Number(transportFee) * 2)}</span>
              )}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={wheelchair}
                onChange={(e) => {
                  setWheelchair(e.target.checked);
                  handleFeeChange(transportFee, e.target.checked, stairsElevator, stairFloor);
                }}
              />
              Wheelchair (+{formatDOP(350)} — one-time rental)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={stairsElevator}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setStairsElevator(checked);
                  const nextFloor = checked ? (stairFloor || 2) : 0;
                  setStairFloor(nextFloor);
                  handleFeeChange(transportFee, wheelchair, checked, nextFloor);
                }}
              />
              Stair climber / Elevator
            </label>
            {stairsElevator && (
              <div className="ml-6 flex flex-wrap items-center gap-2">
                <span className="text-sm text-zinc-500">Floor:</span>
                {STAIR_CLIMBER_PRICING.map((p) => (
                  <button
                    key={p.floor}
                    type="button"
                    onClick={() => {
                      setStairFloor(p.floor);
                      handleFeeChange(transportFee, wheelchair, stairsElevator, p.floor);
                    }}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                      stairFloor === p.floor
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-zinc-300 bg-white text-zinc-700 hover:border-orange-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    {p.label} {p.price > 0 ? `(+${formatDOP(p.price)}${subBajarRoundTrip ? ` × 2 = ${formatDOP(p.price * 2)}` : ""})` : ""}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="mt-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
            <p className="text-xs text-zinc-500">Total charge</p>
            <p className="text-2xl font-bold">{formatDOP(Number(form.total_fare) || 0)}</p>
            {subBajarTotal > 0 && subBajarTotal !== Number(form.total_fare) && (
              <button
                type="button"
                onClick={() => update("total_fare", String(subBajarTotal))}
                className="mt-1 text-xs text-blue-600 hover:underline"
              >
                Apply fee total ({formatDOP(subBajarTotal)})
              </button>
            )}
          </div>
          {/* Allow manual override */}
          <label className="flex flex-col gap-1 text-sm font-normal">
            Manual override (DOP)
            <input
              type="number"
              value={form.total_fare}
              onChange={(e) => update("total_fare", e.target.value)}
              className="input"
            />
          </label>
        </fieldset>
      )}

      <label className="flex flex-col gap-1 text-sm font-medium md:col-span-2">
        Notes
        <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} className="input" rows={3} />
      </label>

      {error && <p className="col-span-2 text-sm text-red-600">{error}</p>}

      <div className="col-span-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-transform duration-150 ease-out hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
        >
          {submitting ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
