"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { createClient } from "@/lib/supabase/client";
import { calculateFare, formatDOP } from "@/lib/fare";
import { todayLocalISO } from "@/lib/date";
import { SERVICE_TYPES, type FareBreakdown, type TransportationMode, type TripType } from "@/lib/types";
import ClientAutocomplete from "./ClientAutocomplete";
import type { Client } from "@/lib/types";

interface Option {
  id: string;
  name: string;
}

export default function NewTripPage() {
  const router = useRouter();
  const pickupRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);

  const [services, setServices] = useState<Option[]>([]);
  const [drivers, setDrivers] = useState<Option[]>([]);
  const [vehicles, setVehicles] = useState<Option[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [mapsReady, setMapsReady] = useState(false);
  const [mapsError, setMapsError] = useState<string | null>(() =>
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      ? null
      : "Google Maps is not configured. Enter distance and duration manually below."
  );

  const [form, setForm] = useState({
    date: todayLocalISO(),
    service_id: "",
    client_name: "",
    client_phone: "",
    pickup_address: "",
    destination_address: "",
    driver_id: "",
    vehicle_id: "",
    distance_km: "",
    duration_minutes: "",
    trip_type: "one-way" as TripType,
    transportation_mode: "private" as TransportationMode,
    waiting_hours: "0",
    notes: "",
  });

  const [transportFee, setTransportFee] = useState("0");
  const [wheelchair, setWheelchair] = useState(false);
  const [stairsElevator, setStairsElevator] = useState(false);
  const [manualFare, setManualFare] = useState("");
  const [previousTrip, setPreviousTrip] = useState<Client | null>(null);

  const [breakdown, setBreakdown] = useState<FareBreakdown | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  // Detect Subir/Bajar mode
  const selectedService = services.find((s) => s.id === form.service_id);
  const isSubirBajar = selectedService?.name === "Subir/Bajar";

  // For Subir/Bajar: auto-compute breakdown live from fees — no Calculate button needed
  const subBajarTotal =
    (Number(transportFee) || 0) + (wheelchair ? 350 : 0) + (stairsElevator ? 500 : 0);

  useEffect(() => {
    if (!isSubirBajar) {
      setBreakdown(null);
      return;
    }
    setBreakdown({
      distanceKm: 0,
      durationMinutes: 0,
      baseFare: 0,
      distanceCost: 0,
      durationCost: 0,
      waitingCost: 0,
      additionalFees: subBajarTotal,
      totalFare: subBajarTotal,
    });
  }, [isSubirBajar, subBajarTotal]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("services").select("id, name").then(({ data }) => setServices(data ?? []));
    supabase.from("drivers").select("id, name").eq("status", "active").then(({ data }) => setDrivers(data ?? []));
    supabase.from("vehicles").select("id, name").eq("status", "active").then(({ data }) => setVehicles(data ?? []));
  }, []);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    setOptions({ key: apiKey });
    importLibrary("places")
      .then(() => {
        if (pickupRef.current) {
          const ac = new google.maps.places.Autocomplete(pickupRef.current, {
            fields: ["formatted_address"],
            componentRestrictions: { country: "do" },
          });
          ac.addListener("place_changed", () => {
            const place = ac.getPlace();
            update("pickup_address", place.formatted_address ?? pickupRef.current?.value ?? "");
          });
        }
        if (destinationRef.current) {
          const ac = new google.maps.places.Autocomplete(destinationRef.current, {
            fields: ["formatted_address"],
            componentRestrictions: { country: "do" },
          });
          ac.addListener("place_changed", () => {
            const place = ac.getPlace();
            update("destination_address", place.formatted_address ?? destinationRef.current?.value ?? "");
          });
        }
        setMapsReady(true);
      })
      .catch(() => setMapsError("Could not load Google Maps. Enter distance and duration manually below."));
  }, []);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSelectClient(client: Client) {
    setForm((prev) => ({
      ...prev,
      client_name: client.name,
      client_phone: client.phone ?? "",
      service_id: client.last_service_id ?? prev.service_id,
    }));
    setPreviousTrip(client);
  }

  async function fetchDistance() {
    if (isSubirBajar) return;
    setCalcError(null);
    if (!mapsReady || !form.pickup_address || !form.destination_address) return;
    try {
      const { DistanceMatrixService } = (await google.maps.importLibrary("routes")) as google.maps.RoutesLibrary;
      const service = new DistanceMatrixService();
      const result = await service.getDistanceMatrix({
        origins: [form.pickup_address],
        destinations: [form.destination_address],
        travelMode: google.maps.TravelMode.DRIVING,
      });
      const element = result.rows[0]?.elements[0];
      if (!element || element.status !== "OK") {
        setCalcError("Could not calculate distance for those addresses.");
        return;
      }
      update("distance_km", String(Math.round((element.distance.value / 1000) * 10) / 10));
      update("duration_minutes", String(Math.round(element.duration.value / 60)));
    } catch {
      setCalcError("Could not calculate distance for those addresses.");
    }
  }

  function regularAdditionalFees() {
    return (Number(transportFee) || 0) + (wheelchair ? 350 : 0) + (stairsElevator ? 500 : 0);
  }

  function handleCalculate() {
    if (isSubirBajar) return; // handled automatically
    setCalcError(null);
    const overrideFare = Number(manualFare);
    if (manualFare && !Number.isNaN(overrideFare) && overrideFare > 0) {
      setBreakdown({
        distanceKm: Number(form.distance_km) || 0,
        durationMinutes: Number(form.duration_minutes) || 0,
        baseFare: overrideFare,
        distanceCost: 0,
        durationCost: 0,
        waitingCost: 0,
        additionalFees: regularAdditionalFees(),
        totalFare: overrideFare + regularAdditionalFees(),
      });
      return;
    }
    const distanceKm = Number(form.distance_km);
    const durationMinutes = Number(form.duration_minutes);
    if (!form.distance_km || !form.duration_minutes || Number.isNaN(distanceKm) || Number.isNaN(durationMinutes)) {
      setCalcError("Please provide pickup/destination (or enter distance and duration manually).");
      return;
    }
    setBreakdown(
      calculateFare({
        distanceKm,
        durationMinutes,
        tripType: form.trip_type,
        mode: form.transportation_mode,
        waitingHours: form.trip_type === "round-trip" ? Number(form.waiting_hours) : 0,
        additionalFees: regularAdditionalFees(),
      })
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!breakdown && !isSubirBajar) {
      setError("Please calculate the fare before saving the trip.");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        additional_fees: isSubirBajar ? subBajarTotal : regularAdditionalFees(),
      }),
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
      <div className="grid max-w-5xl gap-6 md:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:grid-cols-2"
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
            <ClientAutocomplete
              value={form.client_name}
              onChange={(value) => update("client_name", value)}
              onSelect={handleSelectClient}
            />
          </Field>
          <Field label="Client phone">
            <input value={form.client_phone} onChange={(e) => update("client_phone", e.target.value)} className="input" />
          </Field>

          {previousTrip && (
            <p className="text-xs text-zinc-500 sm:col-span-2">
              Previous trip: {previousTrip.last_trip_date ?? "-"} · {previousTrip.last_service_name ?? "no service"} ·{" "}
              {previousTrip.last_total_fare != null ? formatDOP(previousTrip.last_total_fare) : "-"}
              {previousTrip.last_total_fare != null && (
                <button
                  type="button"
                  onClick={() => setManualFare(String(previousTrip.last_total_fare))}
                  className="ml-2 text-blue-600 hover:underline"
                >
                  Use this amount
                </button>
              )}
            </p>
          )}

          {/* Pickup address — always shown; label changes for Subir/Bajar */}
          <Field label={isSubirBajar ? "Building / pickup address" : "Pickup address"} full>
            <input
              ref={pickupRef}
              required
              value={form.pickup_address}
              onChange={(e) => update("pickup_address", e.target.value)}
              onBlur={fetchDistance}
              className="input"
            />
          </Field>

          {/* Destination only for regular trips */}
          {!isSubirBajar && (
            <Field label="Destination address" full>
              <input
                ref={destinationRef}
                required
                value={form.destination_address}
                onChange={(e) => update("destination_address", e.target.value)}
                onBlur={fetchDistance}
                className="input"
              />
            </Field>
          )}

          <Field label="Driver">
            <select value={form.driver_id} onChange={(e) => update("driver_id", e.target.value)} className="input">
              <option value="">Select driver</option>
              {drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </Field>
          <Field label="Vehicle">
            <select value={form.vehicle_id} onChange={(e) => update("vehicle_id", e.target.value)} className="input">
              <option value="">Select vehicle</option>
              {vehicles.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </Field>

          {/* Distance/duration manual entry — only for regular trips */}
          {!isSubirBajar && mapsError && (
            <>
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
            </>
          )}

          {/* Trip type / mode / waiting — only for regular trips */}
          {!isSubirBajar && (
            <>
              <Field label="Trip type">
                <select value={form.trip_type} onChange={(e) => update("trip_type", e.target.value as TripType)} className="input">
                  <option value="one-way">One-way</option>
                  <option value="round-trip">Round-trip</option>
                </select>
              </Field>
              <Field label="Mode">
                <select
                  value={form.transportation_mode}
                  onChange={(e) => update("transportation_mode", e.target.value as TransportationMode)}
                  className="input"
                >
                  <option value="private">Private</option>
                  <option value="public">Public (Meditiko)</option>
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
              <Field label="Quick fare override (DOP, optional)" full>
                <input
                  type="number"
                  min={0}
                  value={manualFare}
                  onChange={(e) => setManualFare(e.target.value)}
                  placeholder="Leave blank to calculate from distance/duration"
                  className="input"
                />
              </Field>
            </>
          )}

          {/* Equipment / fees section — always shown, label adapts */}
          <fieldset className="flex flex-col gap-2 text-sm font-medium sm:col-span-2">
            {isSubirBajar ? "Service fees" : "Additional fees"}
            <div className="flex flex-col gap-2 text-sm font-normal">
              <label className="flex items-center gap-2">
                {isSubirBajar ? "Transportation fee (optional, DOP)" : "Transportation / Delivery (DOP)"}
                <input
                  type="number"
                  min={0}
                  value={transportFee}
                  onChange={(e) => setTransportFee(e.target.value)}
                  className="input w-32"
                />
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={wheelchair} onChange={(e) => setWheelchair(e.target.checked)} />
                Wheelchair (+{formatDOP(350)})
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={stairsElevator} onChange={(e) => setStairsElevator(e.target.checked)} />
                Stair climber / Elevator (+{formatDOP(500)})
              </label>
            </div>

            {/* Live total for Subir/Bajar */}
            {isSubirBajar && (
              <div className="mt-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
                <p className="text-xs text-zinc-500">Total charge</p>
                <p className="text-2xl font-bold">{formatDOP(subBajarTotal)}</p>
              </div>
            )}
          </fieldset>

          <Field label="Notes" full>
            <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} className="input" rows={3} />
          </Field>

          {calcError && <p className="col-span-2 text-sm text-red-600">{calcError}</p>}

          {/* Calculate fare button only for regular trips */}
          {!isSubirBajar && (
            <div className="col-span-2">
              <button
                type="button"
                onClick={handleCalculate}
                className="rounded-full bg-zinc-800 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-200 dark:text-zinc-900"
              >
                Calculate fare
              </button>
            </div>
          )}

          {error && <p className="col-span-2 text-sm text-red-600">{error}</p>}

          <div className="col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save trip"}
            </button>
          </div>
        </form>

        {/* Fare breakdown side panel — only for regular trips */}
        {!isSubirBajar && (
          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold">Fare breakdown</h2>
            {breakdown ? (
              <dl className="flex flex-col gap-2 text-sm">
                <Row label="Base fare" value={formatDOP(breakdown.baseFare)} />
                <Row label={`Distance (${breakdown.distanceKm} km)`} value={formatDOP(breakdown.distanceCost)} />
                <Row label={`Duration (${breakdown.durationMinutes} min)`} value={formatDOP(breakdown.durationCost)} />
                {breakdown.waitingCost > 0 && <Row label="Waiting time" value={formatDOP(breakdown.waitingCost)} />}
                {breakdown.additionalFees > 0 && <Row label="Additional fees" value={formatDOP(breakdown.additionalFees)} />}
                <div className="mt-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
                  <p className="text-sm text-zinc-500">Total fare</p>
                  <p className="text-3xl font-bold">{formatDOP(breakdown.totalFare)}</p>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-zinc-500">
                Fill in trip details and click &ldquo;Calculate fare&rdquo; to preview the total before saving.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`flex flex-col gap-1 text-sm font-medium ${full ? "sm:col-span-2" : ""}`}>
      {label}
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
