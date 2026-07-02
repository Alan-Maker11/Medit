"use client";

import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { calculateFare, formatDOP } from "@/lib/fare";
import { SERVICE_TYPES, type FareBreakdown, type ServiceName, type TripType, type TransportationMode } from "@/lib/types";

const INPUT_CLASS = "rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800";

export default function FareCalculator() {
  const pickupRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);
  const [mapsReady, setMapsReady] = useState(false);
  const [mapsError, setMapsError] = useState<string | null>(() =>
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      ? null
      : "Google Maps is not configured. Enter distance and duration manually below."
  );

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);

  const [serviceType, setServiceType] = useState<ServiceName>(SERVICE_TYPES[0]);
  const [tripType, setTripType] = useState<TripType>("one-way");
  const [mode, setMode] = useState<TransportationMode>("private");
  const [waitingHours, setWaitingHours] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState("0");
  const [wheelchair, setWheelchair] = useState(false);
  const [stairsElevator, setStairsElevator] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [breakdown, setBreakdown] = useState<FareBreakdown | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const isSubirBajar = serviceType === "Subir/Bajar";
  const [subBajarRoundTrip, setSubBajarRoundTrip] = useState(false);
  const subBajarMultiplier = subBajarRoundTrip ? 2 : 1;

  // For Subir/Bajar: live total from fees, no Calculate button needed
  const subBajarTotal =
    (Number(deliveryFee) || 0) * subBajarMultiplier +
    (wheelchair ? 350 : 0) +
    (stairsElevator ? 500 * subBajarMultiplier : 0);

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
            setPickup(ac.getPlace().formatted_address ?? pickupRef.current?.value ?? "");
          });
        }
        if (destinationRef.current) {
          const ac = new google.maps.places.Autocomplete(destinationRef.current, {
            fields: ["formatted_address"],
            componentRestrictions: { country: "do" },
          });
          ac.addListener("place_changed", () => {
            setDestination(ac.getPlace().formatted_address ?? destinationRef.current?.value ?? "");
          });
        }
        setMapsReady(true);
      })
      .catch(() => setMapsError("Could not load Google Maps. Enter distance and duration manually below."));
  }, []);

  async function fetchDistance() {
    if (isSubirBajar) return;
    setCalcError(null);
    if (!mapsReady || !pickup || !destination) return;
    try {
      const { DistanceMatrixService } = (await google.maps.importLibrary("routes")) as google.maps.RoutesLibrary;
      const service = new DistanceMatrixService();
      const result = await service.getDistanceMatrix({
        origins: [pickup],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
      });
      const element = result.rows[0]?.elements[0];
      if (!element || element.status !== "OK") {
        setCalcError("Could not calculate distance for those addresses.");
        return;
      }
      setDistanceKm(Math.round((element.distance.value / 1000) * 10) / 10);
      setDurationMinutes(Math.round(element.duration.value / 60));
    } catch {
      setCalcError("Could not calculate distance for those addresses.");
    }
  }

  function handleCalculate() {
    if (isSubirBajar) return;
    setCalcError(null);
    if (distanceKm === null || durationMinutes === null) {
      setCalcError("Please provide pickup/destination (or enter distance and duration manually).");
      return;
    }
    const additionalFees = (Number(deliveryFee) || 0) + (wheelchair ? 350 : 0) + (stairsElevator ? 500 : 0);
    setBreakdown(
      calculateFare({
        distanceKm,
        durationMinutes,
        tripType,
        mode,
        waitingHours: tripType === "round-trip" ? waitingHours : 0,
        additionalFees,
      })
    );
  }

  const whatsappMessage = isSubirBajar
    ? encodeURIComponent(
        `Hola, quisiera reservar un servicio Subir/Bajar Medit.\nEdificio/dirección: ${pickup}\nViaje: ${subBajarRoundTrip ? "Ida y vuelta (×2)" : "Un solo viaje"}\nEquipo: ${[
          wheelchair ? `Silla de ruedas (${formatDOP(350)})` : "",
          stairsElevator ? `Escalera/Ascensor (${formatDOP(500 * subBajarMultiplier)})` : "",
          Number(deliveryFee) > 0 ? `Transporte (${formatDOP(Number(deliveryFee) * subBajarMultiplier)})` : "",
        ]
          .filter(Boolean)
          .join(", ") || "Sin equipo adicional"}\nTotal estimado: ${breakdown ? formatDOP(breakdown.totalFare) : ""}\nNombre: ${name}\nTel: ${phone}`
      )
    : encodeURIComponent(
        `Hola, quisiera reservar un viaje Medit.\nServicio: ${serviceType}\nDesde: ${pickup}\nHasta: ${destination}\nTipo: ${tripType}\nTotal estimado: ${
          breakdown ? formatDOP(breakdown.totalFare) : ""
        }\nNombre: ${name}\nTel: ${phone}`
      );

  return (
    <div className="grid w-full max-w-5xl gap-8 md:grid-cols-2">
      {/* Left panel — trip details */}
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">Trip details</h2>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Service type
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as ServiceName)}
            className={INPUT_CLASS}
          >
            {SERVICE_TYPES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          {isSubirBajar ? "Building / pickup address" : "Pickup location"}
          <input
            ref={pickupRef}
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            onBlur={fetchDistance}
            placeholder={isSubirBajar ? "Building address, sector, Santo Domingo" : "Calle, sector, Santo Domingo"}
            className={INPUT_CLASS}
          />
        </label>

        {/* Destination — hidden for Subir/Bajar */}
        {!isSubirBajar && (
          <label className="flex flex-col gap-1 text-sm font-medium">
            Destination
            <input
              ref={destinationRef}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onBlur={fetchDistance}
              placeholder="Hospital, aeropuerto, etc."
              className={INPUT_CLASS}
            />
          </label>
        )}

        {/* Manual distance/duration — only for regular trips */}
        {!isSubirBajar && mapsError && (
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm font-medium">
              Distance (km)
              <input
                type="number"
                min={0}
                step={0.1}
                value={distanceKm ?? ""}
                onChange={(e) => setDistanceKm(e.target.value ? Number(e.target.value) : null)}
                className={INPUT_CLASS}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
              Duration (min)
              <input
                type="number"
                min={0}
                value={durationMinutes ?? ""}
                onChange={(e) => setDurationMinutes(e.target.value ? Number(e.target.value) : null)}
                className={INPUT_CLASS}
              />
            </label>
          </div>
        )}

        {/* Trip type / mode / waiting — only for regular trips */}
        {!isSubirBajar && (
          <>
            <div className="flex gap-6">
              <fieldset className="flex flex-col gap-1 text-sm font-medium">
                Trip type
                <div className="flex gap-3 text-sm font-normal">
                  <label className="flex items-center gap-1">
                    <input type="radio" checked={tripType === "one-way"} onChange={() => setTripType("one-way")} />
                    One-way
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" checked={tripType === "round-trip"} onChange={() => setTripType("round-trip")} />
                    Round-trip
                  </label>
                </div>
              </fieldset>
              <fieldset className="flex flex-col gap-1 text-sm font-medium">
                Mode
                <div className="flex gap-3 text-sm font-normal">
                  <label className="flex items-center gap-1">
                    <input type="radio" checked={mode === "private"} onChange={() => setMode("private")} />
                    Private
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" checked={mode === "public"} onChange={() => setMode("public")} />
                    Public (Meditiko)
                  </label>
                </div>
              </fieldset>
            </div>
            {tripType === "round-trip" && (
              <label className="flex flex-col gap-1 text-sm font-medium">
                Waiting hours at destination
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={waitingHours}
                  onChange={(e) => setWaitingHours(Number(e.target.value))}
                  className={INPUT_CLASS}
                />
              </label>
            )}
          </>
        )}

        {/* Fees — always shown, label adapts */}
        <fieldset className="flex flex-col gap-2 text-sm font-medium">
          {isSubirBajar ? "Service fees" : "Additional fees"}
          <div className="flex flex-col gap-2 text-sm font-normal">
            {isSubirBajar && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={subBajarRoundTrip}
                  onChange={(e) => setSubBajarRoundTrip(e.target.checked)}
                />
                Round-trip (×2 — client goes down and comes back up)
              </label>
            )}
            <label className="flex items-center gap-2">
              {isSubirBajar ? "Transportation fee per way (optional, DOP)" : "Transportation / Delivery (DOP)"}
              <input
                type="number"
                min={0}
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                className="w-28 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              />
              {isSubirBajar && subBajarRoundTrip && Number(deliveryFee) > 0 && (
                <span className="text-zinc-500">= {formatDOP(Number(deliveryFee) * 2)}</span>
              )}
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={wheelchair} onChange={(e) => setWheelchair(e.target.checked)} />
              Wheelchair (+{formatDOP(350)}{isSubirBajar && subBajarRoundTrip ? ` × 2 = ${formatDOP(700)}` : ""})
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={stairsElevator} onChange={(e) => setStairsElevator(e.target.checked)} />
              Stair climber / Elevator (+{formatDOP(500)}{isSubirBajar && subBajarRoundTrip ? ` × 2 = ${formatDOP(1000)}` : ""})
            </label>
          </div>
        </fieldset>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Name (optional)
            <input value={name} onChange={(e) => setName(e.target.value)} className={INPUT_CLASS} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Phone (optional)
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={INPUT_CLASS} />
          </label>
        </div>

        {calcError && <p className="text-sm text-red-600">{calcError}</p>}

        {/* Calculate button only for regular trips */}
        {!isSubirBajar && (
          <button
            onClick={handleCalculate}
            className="mt-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Calculate fare
          </button>
        )}

        {/* Subir/Bajar hint */}
        {isSubirBajar && (
          <p className="text-xs text-zinc-500">
            Total updates automatically as you select equipment above.
          </p>
        )}
      </div>

      {/* Right panel — estimated fare */}
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">Estimated fare</h2>
        {breakdown ? (
          <>
            <dl className="flex flex-col gap-2 text-sm">
              {!isSubirBajar && (
                <>
                  <Row label="Base fare" value={formatDOP(breakdown.baseFare)} />
                  <Row label={`Distance (${breakdown.distanceKm} km)`} value={formatDOP(breakdown.distanceCost)} />
                  <Row label={`Duration (${breakdown.durationMinutes} min)`} value={formatDOP(breakdown.durationCost)} />
                  {breakdown.waitingCost > 0 && <Row label="Waiting time" value={formatDOP(breakdown.waitingCost)} />}
                </>
              )}
              {isSubirBajar && Number(deliveryFee) > 0 && (
                <Row
                  label={subBajarRoundTrip ? `Transportation (${formatDOP(Number(deliveryFee))} × 2)` : "Transportation fee"}
                  value={formatDOP(Number(deliveryFee) * subBajarMultiplier)}
                />
              )}
              {wheelchair && (
                <Row label="Wheelchair (one-time rental)" value={formatDOP(350)} />
              )}
              {stairsElevator && (
                <Row
                  label={isSubirBajar && subBajarRoundTrip ? `Stair climber (${formatDOP(500)} × 2)` : "Stair climber / Elevator"}
                  value={formatDOP(500 * subBajarMultiplier)}
                />
              )}
              {!isSubirBajar && breakdown.additionalFees > 0 && (
                <Row label="Other fees" value={formatDOP(breakdown.additionalFees - (wheelchair ? 350 : 0) - (stairsElevator ? 500 : 0) - (Number(deliveryFee) || 0))} />
              )}
            </dl>
            <div className="mt-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
              <p className="text-sm text-zinc-500">Total estimated fare</p>
              <p className="text-3xl font-bold">{formatDOP(breakdown.totalFare)}</p>
            </div>
            <a
              href={`https://wa.me/?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 rounded-full bg-green-600 px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              Confirm booking on WhatsApp
            </a>
          </>
        ) : (
          <p className="text-sm text-zinc-500">
            {isSubirBajar
              ? "Select your equipment needs above to see the total."
              : "Fill in your trip details and click “Calculate fare” to see an estimate."}
          </p>
        )}
      </div>
    </div>
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
