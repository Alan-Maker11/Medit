"use client";

import { useEffect, useMemo, useState } from "react";
import "./booking.css";
import { ROUTE_DATA, AIRPORT_ROUTE_IDS, type Route } from "@/lib/routeData";

type Region = "puj" | "sdq";
type ServiceType = "transfer" | "tour" | "custom";
type TripKind = "one" | "round";

interface AddonDef {
  key: string;
  emoji: string;
  label: string;
  hint: string;
  price: number;
  unit: string;
  max: number;
}

const ACCESS_ADDONS: AddonDef[] = [
  { key: "wheelchair", emoji: "♿", label: "Silla de ruedas", hint: "Asistencia y manejo de silla", price: 10, unit: "", max: 3 },
  { key: "stairclimber", emoji: "🪜", label: "Sube-escaleras eléctrico", hint: "Para edificios sin ascensor", price: 15, unit: "", max: 3 },
  { key: "carseat", emoji: "🧒", label: "Silla para niño", hint: "Car seat certificado", price: 10, unit: "", max: 3 },
];

const DRINK_ADDONS: AddonDef[] = [
  { key: "champagne", emoji: "🍾", label: "Champán", hint: "Botella fría a bordo", price: 65, unit: "btl", max: 4 },
  { key: "beer", emoji: "🍺", label: "Cerveza", hint: "Presidente, Corona o similar", price: 5, unit: "c/u", max: 12 },
  { key: "water", emoji: "💧", label: "Agua embotellada", hint: "Botella 500ml", price: 2, unit: "c/u", max: 12 },
];

const ALL_ADDONS = [...ACCESS_ADDONS, ...DRINK_ADDONS];

type Addons = Record<string, number>;
const EMPTY_ADDONS: Addons = { wheelchair: 0, stairclimber: 0, carseat: 0, champagne: 0, beer: 0, water: 0 };

function addonTotal(addons: Addons) {
  return ALL_ADDONS.reduce((sum, a) => sum + a.price * (addons[a.key] || 0), 0);
}

function getPaxLimit(type: ServiceType) {
  if (type === "transfer") return 3; // airport transfers: wheelchair user + 2 companions + luggage
  if (type === "tour") return 5; // wheelchair user + 4 companions
  return 6;
}

const STAIR_USD = [0, 5, 8, 12];

export default function BookingWizard() {
  const [tab, setTab] = useState<"transfer" | "tour" | "calc">("transfer");
  const [step, setStep] = useState(1);

  const [region, setRegion] = useState<Region>("puj");
  const [type, setType] = useState<ServiceType>("transfer");
  const [routeId, setRouteId] = useState<string | null>(null);
  const [addons, setAddons] = useState<Addons>(EMPTY_ADDONS);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [pax, setPax] = useState(2);
  const [trip, setTrip] = useState<TripKind>("one");
  const [flight, setFlight] = useState("");
  const [passengerName, setPassengerName] = useState("");

  // Fare estimator tab (static range, per direction)
  const [calcOrigin, setCalcOrigin] = useState("");
  const [calcDest, setCalcDest] = useState("");
  const [calcWheelchair, setCalcWheelchair] = useState(false);
  const [calcStairclimber, setCalcStairclimber] = useState(false);
  const [calcFloor, setCalcFloor] = useState(0);

  const routes: Route[] = ROUTE_DATA[region]?.[type] ?? [];
  const selectedRoute = routes.find((r) => r.id === routeId) ?? null;
  const paxLimit = getPaxLimit(type);
  const isAirportFlight = type === "transfer" && !!routeId && AIRPORT_ROUTE_IDS.includes(routeId);
  const addonsSubtotal = addonTotal(addons);

  // Listen for "book this specific route" requests from Services/Destinations/ToursGallery
  useEffect(() => {
    function onBookRoute(e: Event) {
      const detail = (e as CustomEvent<{ region: Region; type: ServiceType; routeId?: string }>).detail;
      if (!detail) return;
      setTab(detail.type === "tour" ? "tour" : "transfer");
      setRegion(detail.region);
      setType(detail.type);
      setRouteId(detail.routeId ?? null);
      setAddons(EMPTY_ADDONS);
      setStep(1);
    }
    function onPrefillFlight(e: Event) {
      const num = (e as CustomEvent<string>).detail;
      setTab("transfer");
      setFlight(num ?? "");
      setStep(3);
    }
    window.addEventListener("medit:book-route", onBookRoute);
    window.addEventListener("medit:prefill-flight", onPrefillFlight);
    return () => {
      window.removeEventListener("medit:book-route", onBookRoute);
      window.removeEventListener("medit:prefill-flight", onPrefillFlight);
    };
  }, []);

  function switchTab(next: "transfer" | "tour" | "calc") {
    setTab(next);
    if (next === "calc") return;
    setAddons(EMPTY_ADDONS);
    setType(next);
    setRouteId(null);
    setStep(1);
  }

  function changeAddon(key: string, delta: number) {
    const def = ALL_ADDONS.find((a) => a.key === key);
    if (!def) return;
    setAddons((prev) => ({ ...prev, [key]: Math.max(0, Math.min(def.max, (prev[key] || 0) + delta)) }));
  }

  function goStep(n: number) {
    if (n === 3) setPax((p) => Math.min(p, paxLimit));
    setStep(n);
  }

  function submitBooking() {
    const serviceLabel = type === "transfer" ? "Transfer" : type === "tour" ? "Tour" : "Personalizado";
    const regionLabel = region === "puj" ? "Punta Cana (PUJ)" : "Santo Domingo (SDQ)";
    const addonLines = ALL_ADDONS.filter((a) => addons[a.key] > 0)
      .map((a) => `   • ${a.emoji} ${a.label}${addons[a.key] > 1 ? ` ×${addons[a.key]}` : ""} (+$${a.price * addons[a.key]} USD)`)
      .join("\n");

    const message =
      `🔵 *RESERVA MEDIT TRANSPORT*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      (passengerName ? `👤 Pasajero: ${passengerName}\n` : "") +
      `📍 Región: ${regionLabel}\n` +
      `🗺️ Servicio: ${serviceLabel}\n` +
      (selectedRoute ? `🎯 Ruta: ${selectedRoute.name}\n💰 Precio ref.: ${selectedRoute.price}\n` : "") +
      `📅 Fecha: ${date || "—"}\n` +
      `🕐 Hora: ${time || "—"}\n` +
      `👥 Pasajeros: ${pax}\n` +
      `↔️ Tipo: ${trip === "one" ? "Solo Ida" : "Ida y Vuelta"}\n` +
      (flight ? `✈️ Vuelo: *${flight}*\n` : "") +
      (addonLines ? `\n🎁 *Add-ons solicitados:*\n${addonLines}\n   Subtotal add-ons: $${addonsSubtotal} USD\n` : "") +
      `\nPor favor confirmar disponibilidad y precio final. ¡Gracias! 🙏`;

    window.open(`https://wa.me/18293296920?text=${encodeURIComponent(message)}`, "_blank");
  }

  function whaCalc() {
    const addonsLabel = [calcWheelchair ? "Silla de ruedas" : "", calcStairclimber ? "Sube-escaleras" : ""]
      .filter(Boolean)
      .join(", ");
    const { range } = fareRange;
    const message =
      `🧮 *COTIZACIÓN MEDIT TRANSPORT*\n` +
      `📍 Origen: ${calcOrigin || "—"}\n` +
      `🏁 Destino: ${calcDest || "—"}\n` +
      `↔️ Tipo: Recorrido ida y vuelta (hasta 3h)\n` +
      (addonsLabel ? `♿ Add-ons: ${addonsLabel}\n` : "") +
      `💰 Estimado: ${range}\n\n` +
      `Por favor confirmar tarifa exacta y disponibilidad. ¡Gracias!`;
    window.open(`https://wa.me/18293296920?text=${encodeURIComponent(message)}`, "_blank");
  }

  const fareRange = useMemo(() => {
    const baseMin = 60;
    const baseMax = 80;
    const stairFee = STAIR_USD[Math.min(calcFloor, 3)];
    const wcFee = calcWheelchair ? 10 : 0;
    const scFee = calcStairclimber ? 15 : 0;
    const extra = stairFee + wcFee + scFee;
    const totalMin = baseMin + extra;
    const totalMax = baseMax + extra;
    return {
      baseMin,
      baseMax,
      stairFee,
      wcFee,
      scFee,
      totalMin,
      totalMax,
      range: `$${totalMin} USD – $${totalMax} USD`,
    };
  }, [calcFloor, calcWheelchair, calcStairclimber]);

  const showFareResult = calcOrigin.trim() !== "" || calcDest.trim() !== "";

  return (
    <section id="reservar" className="booking-section">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-body text-xs font-bold uppercase tracking-widest text-medit-teal">Reserva Online</p>
        <h2 className="font-display mt-2 text-3xl font-bold text-medit-fg dark:text-white">Reserva tu Transporte</h2>
        <p className="font-body mx-auto mt-2 max-w-md text-sm text-zinc-500">
          Completa los datos y te contactamos por WhatsApp en minutos.
        </p>
      </div>

      <div className="booking-card font-body mt-10">
        <div className="booking-tabs">
          <button className={`booking-tab ${tab === "transfer" ? "active" : ""}`} onClick={() => switchTab("transfer")}>
            ✈️ Transfer
          </button>
          <button className={`booking-tab ${tab === "tour" ? "active" : ""}`} onClick={() => switchTab("tour")}>
            🗺️ Tour
          </button>
          <button className={`booking-tab ${tab === "calc" ? "active" : ""}`} onClick={() => switchTab("calc")}>
            🧮 Calculadora
          </button>
        </div>

        {tab !== "calc" ? (
          <div>
            <div className="step-indicator">
              {[1, 2, 3, 4].map((n, i) => (
                <div key={n} className="contents">
                  <div className={`step-dot ${step === n ? "active" : step > n ? "done" : ""}`}>{n}</div>
                  {i < 3 && <div className={`step-line ${step > n ? "done" : ""}`} />}
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className="wizard-step show">
                <label className="form-label">Región / Aeropuerto</label>
                <div className="pill-group">
                  <button
                    className={`pill ${region === "puj" ? "active" : ""}`}
                    onClick={() => {
                      setRegion("puj");
                      setRouteId(null);
                    }}
                  >
                    ✈️ Punta Cana (PUJ)
                  </button>
                  <button
                    className={`pill ${region === "sdq" ? "active" : ""}`}
                    onClick={() => {
                      setRegion("sdq");
                      setRouteId(null);
                    }}
                  >
                    ✈️ Santo Domingo (SDQ)
                  </button>
                </div>

                <label className="form-label">Tipo de Servicio</label>
                <div className="pill-group">
                  {(["transfer", "tour", "custom"] as ServiceType[]).map((t) => (
                    <button
                      key={t}
                      className={`pill ${type === t ? "active" : ""}`}
                      onClick={() => {
                        setType(t);
                        setRouteId(null);
                      }}
                    >
                      {t === "transfer" ? "🚗 Transfer" : t === "tour" ? "🗺️ Tour" : "✏️ Personalizado"}
                    </button>
                  ))}
                </div>

                <label className="form-label">Ruta / Tour</label>
                <div className="route-grid">
                  {routes.map((r) => (
                    <button key={r.id} className={`route-opt ${routeId === r.id ? "active" : ""}`} onClick={() => setRouteId(r.id)}>
                      <div className="ro-icon">{r.icon}</div>
                      <div className="ro-name">{r.name}</div>
                      <div className="ro-desc">{r.desc}</div>
                      <div className="ro-price">{r.price}</div>
                    </button>
                  ))}
                </div>

                <button className="btn-next" onClick={() => goStep(2)}>
                  Siguiente →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="wizard-step show">
                <h3 className="font-display mb-1.5 text-base text-medit-fg dark:text-white">Extras &amp; Add-ons</h3>
                <p className="mb-5 text-sm text-zinc-500">
                  Personaliza tu servicio. Agrega lo que necesitas y confirmaremos el total por WhatsApp.
                </p>

                <label className="form-label">♿ Accesibilidad</label>
                <div className="addon-list">
                  {ACCESS_ADDONS.map((a) => (
                    <AddonRow key={a.key} def={a} qty={addons[a.key] || 0} onChange={(d) => changeAddon(a.key, d)} />
                  ))}
                </div>

                <label className="form-label mt-5">🥂 Bebidas &amp; Confort</label>
                <div className="addon-list">
                  {DRINK_ADDONS.map((a) => (
                    <AddonRow key={a.key} def={a} qty={addons[a.key] || 0} onChange={(d) => changeAddon(a.key, d)} />
                  ))}
                </div>

                {addonsSubtotal > 0 && (
                  <div className="addon-subtotal">
                    <span>Subtotal add-ons:</span>
                    <strong>${addonsSubtotal} USD</strong>
                  </div>
                )}

                <button className="btn-next" onClick={() => goStep(3)}>
                  Siguiente →
                </button>
                <button className="btn-back" onClick={() => goStep(1)}>
                  ← Atrás
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="wizard-step show">
                <div className="form-row">
                  <div>
                    <label className="form-label">Fecha</label>
                    <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Hora</label>
                    <input type="time" className="form-input" value={time} onChange={(e) => setTime(e.target.value)} />
                  </div>
                </div>

                <label className="form-label">
                  Pasajeros{" "}
                  <span className="font-normal text-zinc-500">
                    {type === "transfer"
                      ? "(máx. 3 incl. usuario silla + 2 acompañantes)"
                      : type === "tour"
                        ? "(máx. 5 incl. usuario silla + 4 acompañantes)"
                        : ""}
                  </span>
                </label>
                <div className="pax-row">
                  <div className="pax-ctrl">
                    <button className="pax-btn" onClick={() => setPax((p) => Math.max(1, p - 1))}>
                      −
                    </button>
                    <span className="pax-num">{pax}</span>
                    <button className="pax-btn" onClick={() => setPax((p) => Math.min(paxLimit, p + 1))}>
                      +
                    </button>
                  </div>
                  <span className="text-sm text-zinc-500">pasajeros</span>
                </div>

                <label className="form-label">Tipo de Viaje</label>
                <div className="trip-toggle">
                  <button className={`trip-opt ${trip === "one" ? "active" : ""}`} onClick={() => setTrip("one")}>
                    Solo Ida
                  </button>
                  <button className={`trip-opt ${trip === "round" ? "active" : ""}`} onClick={() => setTrip("round")}>
                    Ida y Vuelta
                  </button>
                </div>

                {isAirportFlight && (
                  <>
                    <label className="form-label mt-4">
                      ✈️ Número de vuelo <span className="font-normal text-zinc-500">(opcional — monitoreamos tu llegada)</span>
                    </label>
                    <input
                      className="form-input uppercase"
                      type="text"
                      placeholder="Ej: AA 1234, JBU 456, IB 6547"
                      value={flight}
                      onChange={(e) => setFlight(e.target.value.toUpperCase())}
                    />
                  </>
                )}

                <label className="form-label mt-4">📝 Nombre del pasajero</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Nombre completo"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                />

                <button className="btn-next" onClick={() => goStep(4)}>
                  Revisar Reserva →
                </button>
                <button className="btn-back" onClick={() => goStep(2)}>
                  ← Atrás
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="wizard-step show">
                <h3 className="font-display mb-4 text-base text-medit-fg dark:text-white">Resumen de tu Reserva</h3>
                <div className="summary-card">
                  {passengerName && <SummaryRow label="Pasajero" value={passengerName} />}
                  <SummaryRow label="Región" value={region === "puj" ? "Punta Cana (PUJ)" : "Santo Domingo (SDQ)"} />
                  <SummaryRow label="Servicio" value={type === "transfer" ? "Transfer" : type === "tour" ? "Tour" : "Personalizado"} />
                  <SummaryRow label="Ruta/Tour" value={selectedRoute?.name ?? "—"} />
                  <SummaryRow label="Precio ref." value={selectedRoute?.price ?? "—"} />
                  <SummaryRow label="Fecha" value={date || "—"} />
                  <SummaryRow label="Hora" value={time || "—"} />
                  <SummaryRow label="Pasajeros" value={String(pax)} />
                  <SummaryRow label="Viaje" value={trip === "one" ? "Solo Ida" : "Ida y Vuelta"} />
                  {flight && <SummaryRow label="✈️ Vuelo" value={flight} />}
                  {ALL_ADDONS.filter((a) => addons[a.key] > 0).map((a) => (
                    <SummaryRow
                      key={a.key}
                      label={`${a.emoji} ${a.label}${addons[a.key] > 1 ? ` ×${addons[a.key]}` : ""}`}
                      value={`$${a.price * addons[a.key]} USD`}
                    />
                  ))}
                  {addonsSubtotal > 0 && (
                    <div className="summary-row mt-1 border-t-2 border-[rgba(0,191,160,0.3)] pt-2 font-extrabold">
                      <span>Add-ons subtotal</span>
                      <span className="val text-medit-teal-2">${addonsSubtotal} USD</span>
                    </div>
                  )}
                </div>
                <button className="btn-whatsapp" onClick={submitBooking}>
                  📱 Confirmar por WhatsApp
                </button>
                <button className="btn-back" onClick={() => goStep(3)}>
                  ← Editar
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="calc-inner">
            <p className="mb-4 text-sm text-zinc-500">
              Estima el costo de tu viaje en Santo Domingo. Para transfers de aeropuerto o tours consulta las tarifas fijas arriba.
            </p>

            <div className="calc-group">
              <label className="form-label">Origen</label>
              <input
                className="form-input"
                type="text"
                placeholder="Ej: Hotel Jaragua, Piantini"
                value={calcOrigin}
                onChange={(e) => setCalcOrigin(e.target.value)}
              />
            </div>
            <div className="calc-group">
              <label className="form-label">Destino</label>
              <input
                className="form-input"
                type="text"
                placeholder="Ej: Zona Colonial, Clínica Abel González"
                value={calcDest}
                onChange={(e) => setCalcDest(e.target.value)}
              />
            </div>

            <div className="calc-group">
              <label className="form-label">Add-ons de Accesibilidad</label>
              <div className="addons-grid">
                <label className={`addon-check ${calcWheelchair ? "checked" : ""}`}>
                  <input type="checkbox" checked={calcWheelchair} onChange={(e) => setCalcWheelchair(e.target.checked)} />
                  <span>
                    ♿ Silla de ruedas <small>+$10</small>
                  </span>
                </label>
                <label className={`addon-check ${calcStairclimber ? "checked" : ""}`}>
                  <input type="checkbox" checked={calcStairclimber} onChange={(e) => setCalcStairclimber(e.target.checked)} />
                  <span>
                    🪜 Sube-escaleras <small>+$15</small>
                  </span>
                </label>
              </div>
            </div>

            <div className="calc-group">
              <label className="form-label">Piso (escaleras en destino)</label>
              <div className="pill-group">
                {["PB", "2°", "3°", "4°+"].map((label, i) => (
                  <button key={label} className={`pill ${calcFloor === i ? "active" : ""}`} onClick={() => setCalcFloor(i)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {showFareResult && (
              <div className="fare-result">
                <div className="fare-row">
                  <span>Recorrido ida y vuelta (hasta 3h)</span>
                  <span>
                    ${fareRange.baseMin} USD – ${fareRange.baseMax} USD
                  </span>
                </div>
                {fareRange.stairFee > 0 && (
                  <div className="fare-row">
                    <span>Escaleras (piso {calcFloor + 1})</span>
                    <span>+${fareRange.stairFee} USD</span>
                  </div>
                )}
                {fareRange.wcFee > 0 && (
                  <div className="fare-row">
                    <span>Silla de ruedas</span>
                    <span>+${fareRange.wcFee} USD</span>
                  </div>
                )}
                {fareRange.scFee > 0 && (
                  <div className="fare-row">
                    <span>Sube-escaleras eléctrico</span>
                    <span>+${fareRange.scFee} USD</span>
                  </div>
                )}
                <div className="fare-row fare-total">
                  <span>ESTIMADO TOTAL</span>
                  <span>{fareRange.range}</span>
                </div>
                <p className="fare-note">
                  ⚠️ Estimado referencial para viajes dentro de SD. La tarifa exacta se confirma por WhatsApp antes del servicio.
                </p>
              </div>
            )}
            {showFareResult && (
              <button className="fare-wha" onClick={whaCalc}>
                📱 Confirmar por WhatsApp
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function AddonRow({ def, qty, onChange }: { def: AddonDef; qty: number; onChange: (delta: number) => void }) {
  return (
    <div className={`addon-row ${qty > 0 ? "active" : ""}`}>
      <div className="addon-info">
        <span className="addon-emoji">{def.emoji}</span>
        <div>
          <strong>{def.label}</strong>
          <small>{def.hint}</small>
        </div>
      </div>
      <div className="addon-qty">
        <span className="addon-price">
          +${def.price} {def.unit}
        </span>
        <div className="qty-ctrl">
          <button className="qty-btn" onClick={() => onChange(-1)}>
            −
          </button>
          <span className="qty-num">{qty}</span>
          <button className="qty-btn" onClick={() => onChange(1)}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="summary-row">
      <span>{label}</span>
      <span className="val">{value}</span>
    </div>
  );
}
