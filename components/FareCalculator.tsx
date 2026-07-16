"use client";

import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { calculateFare, formatDOP } from "@/lib/fare";
import { SERVICE_TYPES, type FareBreakdown, type ServiceName, type TripType, type TransportationMode } from "@/lib/types";

const INPUT_CLASS = "rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800";

type Lang = "es" | "en";

const T = {
  es: {
    toggle: "English",
    tripDetails: "Detalles del viaje",
    serviceType: "Tipo de servicio",
    pickupLabel: "Lugar de recogida",
    pickupLabelSB: "Edificio / dirección de recogida",
    pickupPlaceholder: "Calle, sector, Santo Domingo",
    pickupPlaceholderSB: "Dirección del edificio, sector, Santo Domingo",
    destination: "Destino",
    destinationPlaceholder: "Hospital, aeropuerto, etc.",
    distanceKm: "Distancia (km)",
    durationMin: "Duración (min)",
    tripType: "Tipo de viaje",
    oneWay: "Solo ida",
    roundTrip: "Ida y vuelta",
    mode: "Modalidad",
    private: "Privado",
    public: "Público (Meditiko)",
    waitingHours: "Horas de espera en el destino",
    serviceFees: "Tarifas del servicio",
    additionalFees: "Cargos adicionales",
    roundTripSB: "Ida y vuelta (×2 — el cliente baja y sube de nuevo)",
    transportFeePerWay: "Tarifa de transporte por trayecto (opcional, DOP)",
    transportFee: "Transporte / Entrega (DOP)",
    wheelchair: "Silla de ruedas",
    wheelchairOneTime: "alquiler único",
    stairClimber: "Escalera mecánica / Ascensor",
    name: "Nombre (opcional)",
    phone: "Teléfono (opcional)",
    calcError: "Por favor indique origen/destino (o ingrese distancia y duración manualmente).",
    mapsError: "Google Maps no está configurado. Ingrese distancia y duración manualmente.",
    mapsLoadError: "No se pudo cargar Google Maps. Ingrese distancia y duración manualmente.",
    distanceError: "No se pudo calcular la distancia para esas direcciones.",
    calculate: "Calcular tarifa",
    autoUpdate: "El total se actualiza automáticamente al seleccionar los equipos arriba.",
    estimatedFare: "Tarifa estimada",
    baseFare: "Tarifa base",
    distance: "Distancia",
    duration: "Duración",
    waitingTime: "Tiempo de espera",
    transport: "Transporte",
    otherFees: "Otros cargos",
    totalEstimated: "Total estimado",
    confirmWhatsApp: "Confirmar reserva por WhatsApp",
    fillDetails: 'Complete los detalles del viaje y haga clic en "Calcular tarifa" para ver un estimado.',
    selectEquipment: "Seleccione los equipos necesarios arriba para ver el total.",
    waMsg: (pickup: string, destination: string, serviceType: string, tripType: string, total: string, name: string, phone: string) =>
      `Hola, quisiera reservar un viaje Medit.\nServicio: ${serviceType}\nDesde: ${pickup}\nHasta: ${destination}\nTipo: ${tripType}\nTotal estimado: ${total}\nNombre: ${name}\nTel: ${phone}`,
    waMsgSB: (pickup: string, roundTrip: boolean, equipment: string, total: string, name: string, phone: string) =>
      `Hola, quisiera reservar un servicio Subir/Bajar Medit.\nEdificio/dirección: ${pickup}\nViaje: ${roundTrip ? "Ida y vuelta (×2)" : "Solo un trayecto"}\nEquipo: ${equipment}\nTotal estimado: ${total}\nNombre: ${name}\nTel: ${phone}`,
  },
  en: {
    toggle: "Español",
    tripDetails: "Trip details",
    serviceType: "Service type",
    pickupLabel: "Pickup location",
    pickupLabelSB: "Building / pickup address",
    pickupPlaceholder: "Street, neighborhood, Santo Domingo",
    pickupPlaceholderSB: "Building address, neighborhood, Santo Domingo",
    destination: "Destination",
    destinationPlaceholder: "Hospital, airport, etc.",
    distanceKm: "Distance (km)",
    durationMin: "Duration (min)",
    tripType: "Trip type",
    oneWay: "One-way",
    roundTrip: "Round-trip",
    mode: "Mode",
    private: "Private",
    public: "Public (Meditiko)",
    waitingHours: "Waiting hours at destination",
    serviceFees: "Service fees",
    additionalFees: "Additional fees",
    roundTripSB: "Round-trip (×2 — client goes down and comes back up)",
    transportFeePerWay: "Transportation fee per way (optional, DOP)",
    transportFee: "Transportation / Delivery (DOP)",
    wheelchair: "Wheelchair",
    wheelchairOneTime: "one-time rental",
    stairClimber: "Stair climber / Elevator",
    name: "Name (optional)",
    phone: "Phone (optional)",
    calcError: "Please provide pickup/destination (or enter distance and duration manually).",
    mapsError: "Google Maps is not configured. Enter distance and duration manually.",
    mapsLoadError: "Could not load Google Maps. Enter distance and duration manually.",
    distanceError: "Could not calculate distance for those addresses.",
    calculate: "Calculate fare",
    autoUpdate: "Total updates automatically as you select equipment above.",
    estimatedFare: "Estimated fare",
    baseFare: "Base fare",
    distance: "Distance",
    duration: "Duration",
    waitingTime: "Waiting time",
    transport: "Transportation",
    otherFees: "Other fees",
    totalEstimated: "Total estimated fare",
    confirmWhatsApp: "Confirm booking on WhatsApp",
    fillDetails: 'Fill in your trip details and click "Calculate fare" to see an estimate.',
    selectEquipment: "Select your equipment needs above to see the total.",
    waMsg: (pickup: string, destination: string, serviceType: string, tripType: string, total: string, name: string, phone: string) =>
      `Hello, I'd like to book a Medit trip.\nService: ${serviceType}\nFrom: ${pickup}\nTo: ${destination}\nType: ${tripType}\nEstimated total: ${total}\nName: ${name}\nPhone: ${phone}`,
    waMsgSB: (pickup: string, roundTrip: boolean, equipment: string, total: string, name: string, phone: string) =>
      `Hello, I'd like to book a Subir/Bajar Medit service.\nBuilding/address: ${pickup}\nTrip: ${roundTrip ? "Round-trip (×2)" : "One way"}\nEquipment: ${equipment}\nEstimated total: ${total}\nName: ${name}\nPhone: ${phone}`,
  },
} as const;

export default function FareCalculator() {
  const [lang, setLang] = useState<Lang>("es");
  const t = T[lang];

  const pickupRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);
  const [mapsReady, setMapsReady] = useState(false);
  const [mapsError, setMapsError] = useState<string | null>(() =>
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? null : t.mapsError
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

  // Stair climber doubles on round-trip (both Subir/Bajar and regular)
  const stairsMultiplier = isSubirBajar ? subBajarMultiplier : tripType === "round-trip" ? 2 : 1;

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
      .catch(() => setMapsError(t.mapsLoadError));
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
        setCalcError(t.distanceError);
        return;
      }
      setDistanceKm(Math.round((element.distance.value / 1000) * 10) / 10);
      setDurationMinutes(Math.round(element.duration.value / 60));
    } catch {
      setCalcError(t.distanceError);
    }
  }

  function handleCalculate() {
    if (isSubirBajar) return;
    setCalcError(null);
    if (distanceKm === null || durationMinutes === null) {
      setCalcError(t.calcError);
      return;
    }
    const additionalFees =
      (Number(deliveryFee) || 0) +
      (wheelchair ? 350 : 0) +
      (stairsElevator ? 500 * stairsMultiplier : 0);
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

  const equipmentList = [
    wheelchair ? `${lang === "es" ? "Silla de ruedas" : "Wheelchair"} (${formatDOP(350)})` : "",
    stairsElevator ? `${lang === "es" ? "Escalera/Ascensor" : "Stair climber"} (${formatDOP(500 * subBajarMultiplier)})` : "",
    Number(deliveryFee) > 0 ? `${lang === "es" ? "Transporte" : "Transport"} (${formatDOP(Number(deliveryFee) * subBajarMultiplier)})` : "",
  ].filter(Boolean).join(", ") || (lang === "es" ? "Sin equipo adicional" : "No additional equipment");

  const whatsappMessage = isSubirBajar
    ? encodeURIComponent(t.waMsgSB(pickup, subBajarRoundTrip, equipmentList, breakdown ? formatDOP(breakdown.totalFare) : "", name, phone))
    : encodeURIComponent(t.waMsg(pickup, destination, serviceType, tripType === "one-way" ? t.oneWay : t.roundTrip, breakdown ? formatDOP(breakdown.totalFare) : "", name, phone));

  return (
    <div className="grid w-full max-w-5xl gap-8 md:grid-cols-2">
      {/* Left panel — trip details */}
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t.tripDetails}</h2>
          <button
            type="button"
            onClick={() => setLang((l) => (l === "es" ? "en" : "es"))}
            className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            {t.toggle}
          </button>
        </div>

        <label className="flex flex-col gap-1 text-sm font-medium">
          {t.serviceType}
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
          {isSubirBajar ? t.pickupLabelSB : t.pickupLabel}
          <input
            ref={pickupRef}
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            onBlur={fetchDistance}
            placeholder={isSubirBajar ? t.pickupPlaceholderSB : t.pickupPlaceholder}
            className={INPUT_CLASS}
          />
        </label>

        {!isSubirBajar && (
          <label className="flex flex-col gap-1 text-sm font-medium">
            {t.destination}
            <input
              ref={destinationRef}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onBlur={fetchDistance}
              placeholder={t.destinationPlaceholder}
              className={INPUT_CLASS}
            />
          </label>
        )}

        {!isSubirBajar && mapsError && (
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm font-medium">
              {t.distanceKm}
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
              {t.durationMin}
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

        {!isSubirBajar && (
          <>
            <div className="flex gap-6">
              <fieldset className="flex flex-col gap-1 text-sm font-medium">
                {t.tripType}
                <div className="flex gap-3 text-sm font-normal">
                  <label className="flex items-center gap-1">
                    <input type="radio" checked={tripType === "one-way"} onChange={() => setTripType("one-way")} />
                    {t.oneWay}
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" checked={tripType === "round-trip"} onChange={() => setTripType("round-trip")} />
                    {t.roundTrip}
                  </label>
                </div>
              </fieldset>
              <fieldset className="flex flex-col gap-1 text-sm font-medium">
                {t.mode}
                <div className="flex gap-3 text-sm font-normal">
                  <label className="flex items-center gap-1">
                    <input type="radio" checked={mode === "private"} onChange={() => setMode("private")} />
                    {t.private}
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" checked={mode === "public"} onChange={() => setMode("public")} />
                    {t.public}
                  </label>
                </div>
              </fieldset>
            </div>
            {tripType === "round-trip" && (
              <label className="flex flex-col gap-1 text-sm font-medium">
                {t.waitingHours}
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

        <fieldset className="flex flex-col gap-2 text-sm font-medium">
          {isSubirBajar ? t.serviceFees : t.additionalFees}
          <div className="flex flex-col gap-2 text-sm font-normal">
            {isSubirBajar && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={subBajarRoundTrip}
                  onChange={(e) => setSubBajarRoundTrip(e.target.checked)}
                />
                {t.roundTripSB}
              </label>
            )}
            <label className="flex items-center gap-2">
              {isSubirBajar ? t.transportFeePerWay : t.transportFee}
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
              {t.wheelchair} (+{formatDOP(350)} — {t.wheelchairOneTime})
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={stairsElevator} onChange={(e) => setStairsElevator(e.target.checked)} />
              {t.stairClimber} (+{formatDOP(500)}{stairsMultiplier === 2 ? ` × 2 = ${formatDOP(1000)}` : ""})
            </label>
          </div>
        </fieldset>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm font-medium">
            {t.name}
            <input value={name} onChange={(e) => setName(e.target.value)} className={INPUT_CLASS} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            {t.phone}
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={INPUT_CLASS} />
          </label>
        </div>

        {calcError && <p className="text-sm text-red-600">{calcError}</p>}

        {!isSubirBajar && (
          <button
            onClick={handleCalculate}
            className="mt-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-blue-700 active:scale-[0.98]"
          >
            {t.calculate}
          </button>
        )}

        {isSubirBajar && (
          <p className="text-xs text-zinc-500">{t.autoUpdate}</p>
        )}
      </div>

      {/* Right panel — estimated fare */}
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">{t.estimatedFare}</h2>
        {breakdown ? (
          <div key={breakdown.totalFare + breakdown.distanceKm + breakdown.durationMinutes} className="animate-fade-in-up">
            <dl className="flex flex-col gap-2 text-sm">
              {!isSubirBajar && (
                <>
                  <Row label={t.baseFare} value={formatDOP(breakdown.baseFare)} />
                  <Row label={`${t.distance} (${breakdown.distanceKm} km)`} value={formatDOP(breakdown.distanceCost)} />
                  <Row label={`${t.duration} (${breakdown.durationMinutes} min)`} value={formatDOP(breakdown.durationCost)} />
                  {breakdown.waitingCost > 0 && <Row label={t.waitingTime} value={formatDOP(breakdown.waitingCost)} />}
                </>
              )}
              {isSubirBajar && Number(deliveryFee) > 0 && (
                <Row
                  label={subBajarRoundTrip ? `${t.transport} (${formatDOP(Number(deliveryFee))} × 2)` : t.transport}
                  value={formatDOP(Number(deliveryFee) * subBajarMultiplier)}
                />
              )}
              {wheelchair && (
                <Row label={`${t.wheelchair} (${t.wheelchairOneTime})`} value={formatDOP(350)} />
              )}
              {stairsElevator && (
                <Row
                  label={stairsMultiplier === 2 ? `${t.stairClimber} (${formatDOP(500)} × 2)` : t.stairClimber}
                  value={formatDOP(500 * stairsMultiplier)}
                />
              )}
              {!isSubirBajar && breakdown.additionalFees > 0 && (() => {
                const other = breakdown.additionalFees - (wheelchair ? 350 : 0) - (stairsElevator ? 500 * stairsMultiplier : 0) - (Number(deliveryFee) || 0);
                return other > 0 ? <Row label={t.otherFees} value={formatDOP(other)} /> : null;
              })()}
            </dl>
            <div className="mt-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
              <p className="text-sm text-zinc-500">{t.totalEstimated}</p>
              <p className="text-3xl font-bold">{formatDOP(breakdown.totalFare)}</p>
            </div>
            <a
              href={`https://wa.me/?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 rounded-full bg-green-600 px-5 py-3 text-center text-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-green-700 active:scale-[0.98]"
            >
              {t.confirmWhatsApp}
            </a>
          </div>
        ) : (
          <p className="text-sm text-zinc-500">
            {isSubirBajar ? t.selectEquipment : t.fillDetails}
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
