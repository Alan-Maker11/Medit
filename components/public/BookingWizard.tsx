"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import "./booking.css";
import DatePicker from "./DatePicker";
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
  { key: "wheelchair", emoji: "♿", label: "Wheelchair", hint: "Assistance and wheelchair handling", price: 10, unit: "", max: 3 },
  { key: "stairclimber", emoji: "🪜", label: "Electric stair climber", hint: "For buildings without an elevator", price: 15, unit: "", max: 3 },
  { key: "carseat", emoji: "🧒", label: "Car seat", hint: "Certified car seat", price: 10, unit: "", max: 3 },
];

const DRINK_ADDONS: AddonDef[] = [
  { key: "champagne", emoji: "🍾", label: "Champagne", hint: "Chilled bottle on board", price: 65, unit: "btl", max: 4 },
  { key: "beer", emoji: "🍺", label: "Beer", hint: "Presidente, Corona or similar", price: 5, unit: "ea", max: 12 },
  { key: "water", emoji: "💧", label: "Bottled water", hint: "500ml bottle", price: 2, unit: "ea", max: 12 },
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
  const [returnTime, setReturnTime] = useState("");
  const [waitingHours, setWaitingHours] = useState("");
  const [flight, setFlight] = useState("");
  const [passengerName, setPassengerName] = useState("");

  // Fare estimator tab (static range, per direction)
  const [calcOrigin, setCalcOrigin] = useState("");
  const [calcDest, setCalcDest] = useState("");
  const [calcWheelchair, setCalcWheelchair] = useState(false);
  const [calcStairclimber, setCalcStairclimber] = useState(false);
  const [calcFloor, setCalcFloor] = useState(0);
  const calcOriginRef = useRef<HTMLInputElement>(null);
  const calcDestRef = useRef<HTMLInputElement>(null);

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
    window.addEventListener("medit:book-route", onBookRoute);
    return () => window.removeEventListener("medit:book-route", onBookRoute);
  }, []);

  // Same Google Maps key/Places Autocomplete used by the real fare calculator — reused here
  // so the Origen/Destino fields on the "Cotizar" tab get address suggestions too. These inputs
  // only exist in the DOM once the user switches to that tab, so this must re-run on tab change,
  // not just once on mount.
  useEffect(() => {
    if (tab !== "calc") return;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    let cancelled = false;
    setOptions({ key: apiKey });
    importLibrary("places").then(() => {
      if (cancelled) return;
      if (calcOriginRef.current) {
        const ac = new google.maps.places.Autocomplete(calcOriginRef.current, {
          fields: ["formatted_address"],
          componentRestrictions: { country: "do" },
        });
        ac.addListener("place_changed", () => {
          setCalcOrigin(ac.getPlace().formatted_address ?? calcOriginRef.current?.value ?? "");
        });
      }
      if (calcDestRef.current) {
        const ac = new google.maps.places.Autocomplete(calcDestRef.current, {
          fields: ["formatted_address"],
          componentRestrictions: { country: "do" },
        });
        ac.addListener("place_changed", () => {
          setCalcDest(ac.getPlace().formatted_address ?? calcDestRef.current?.value ?? "");
        });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [tab]);

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
    const serviceLabel = type === "transfer" ? "Transfer" : type === "tour" ? "Tour" : "Custom";
    const regionLabel = region === "puj" ? "Punta Cana (PUJ)" : "Santo Domingo (SDQ)";
    const addonLines = ALL_ADDONS.filter((a) => addons[a.key] > 0)
      .map((a) => `   • ${a.emoji} ${a.label}${addons[a.key] > 1 ? ` ×${addons[a.key]}` : ""} (+$${a.price * addons[a.key]} USD)`)
      .join("\n");

    const message =
      `🔵 *MEDIT TRANSPORT BOOKING*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      (passengerName ? `👤 Passenger: ${passengerName}\n` : "") +
      `📍 Region: ${regionLabel}\n` +
      `🗺️ Service: ${serviceLabel}\n` +
      (selectedRoute ? `🎯 Route: ${selectedRoute.name}\n💰 Ref. price: ${selectedRoute.price}\n` : "") +
      `📅 Date: ${date || "—"}\n` +
      `🕐 Time: ${time || "—"}\n` +
      `👥 Passengers: ${pax}\n` +
      `↔️ Type: ${trip === "one" ? "One Way" : "Round Trip"}\n` +
      (trip === "round" && returnTime ? `🕐 Return time: ${returnTime}\n` : "") +
      (trip === "round" && !returnTime && waitingHours ? `⏳ Waiting at destination: ${waitingHours}h\n` : "") +
      (flight ? `✈️ Flight: *${flight}*\n` : "") +
      (addonLines ? `\n🎁 *Requested add-ons:*\n${addonLines}\n   Add-ons subtotal: $${addonsSubtotal} USD\n` : "") +
      `\nPlease confirm availability and final price. Thank you! 🙏`;

    window.open(`https://wa.me/18293296920?text=${encodeURIComponent(message)}`, "_blank");
  }

  function whaCalc() {
    const addonsLabel = [calcWheelchair ? "Wheelchair" : "", calcStairclimber ? "Stair climber" : ""]
      .filter(Boolean)
      .join(", ");
    const { range } = fareRange;
    const message =
      `🧮 *MEDIT TRANSPORT QUOTE*\n` +
      `📍 Origin: ${calcOrigin || "—"}\n` +
      `🏁 Destination: ${calcDest || "—"}\n` +
      `↔️ Type: Round trip (up to 3h)\n` +
      (addonsLabel ? `♿ Add-ons: ${addonsLabel}\n` : "") +
      `💰 Estimate: ${range}\n\n` +
      `Please confirm the exact fare and availability. Thank you!`;
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
        <p className="font-body text-xs font-bold uppercase tracking-widest text-medit-teal">Book Online</p>
        <h2 className="font-display mt-2 text-3xl font-bold text-medit-fg dark:text-white">Book Your Transportation</h2>
        <p className="font-body mx-auto mt-2 max-w-md text-sm text-zinc-500">
          Fill in the details and we will contact you on WhatsApp within minutes.
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
            🧮 Calculator
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
                <label className="form-label">Region / Airport</label>
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

                <label className="form-label">Service Type</label>
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
                      {t === "transfer" ? "🚗 Transfer" : t === "tour" ? "🗺️ Tour" : "✏️ Custom"}
                    </button>
                  ))}
                </div>

                <label className="form-label">Route / Tour</label>
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
                  Next →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="wizard-step show">
                <h3 className="font-display mb-1.5 text-base text-medit-fg dark:text-white">Extras &amp; Add-ons</h3>
                <p className="mb-5 text-sm text-zinc-500">
                  Customize your service. Add what you need and we will confirm the total via WhatsApp.
                </p>

                <label className="form-label">♿ Accessibility</label>
                <div className="addon-list">
                  {ACCESS_ADDONS.map((a) => (
                    <AddonRow key={a.key} def={a} qty={addons[a.key] || 0} onChange={(d) => changeAddon(a.key, d)} />
                  ))}
                </div>

                <label className="form-label mt-5">🥂 Drinks &amp; Comfort</label>
                <div className="addon-list">
                  {DRINK_ADDONS.map((a) => (
                    <AddonRow key={a.key} def={a} qty={addons[a.key] || 0} onChange={(d) => changeAddon(a.key, d)} />
                  ))}
                </div>

                {addonsSubtotal > 0 && (
                  <div className="addon-subtotal">
                    <span>Add-ons subtotal:</span>
                    <strong>${addonsSubtotal} USD</strong>
                  </div>
                )}

                <button className="btn-next" onClick={() => goStep(3)}>
                  Next →
                </button>
                <button className="btn-back" onClick={() => goStep(1)}>
                  ← Back
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="wizard-step show">
                <div className="form-row">
                  <div>
                    <label className="form-label">Date</label>
                    <DatePicker value={date} onChange={setDate} />
                  </div>
                  <div>
                    <label className="form-label">Time</label>
                    <input type="time" className="form-input" value={time} onChange={(e) => setTime(e.target.value)} />
                  </div>
                </div>

                <label className="form-label">
                  Passengers{" "}
                  <span className="font-normal text-zinc-500">
                    {type === "transfer"
                      ? "(max. 3 incl. wheelchair user + 2 companions)"
                      : type === "tour"
                        ? "(max. 5 incl. wheelchair user + 4 companions)"
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
                  <span className="text-sm text-zinc-500">passengers</span>
                </div>

                <label className="form-label">Trip Type</label>
                <div className="trip-toggle">
                  <button className={`trip-opt ${trip === "one" ? "active" : ""}`} onClick={() => setTrip("one")}>
                    One Way
                  </button>
                  <button className={`trip-opt ${trip === "round" ? "active" : ""}`} onClick={() => setTrip("round")}>
                    Round Trip
                  </button>
                </div>

                {trip === "round" && (
                  <div className="form-row">
                    <div>
                      <label className="form-label">Return time (if known)</label>
                      <input type="time" className="form-input" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Or, waiting hours at destination</label>
                      <input
                        type="number"
                        min={0}
                        step={0.5}
                        className="form-input"
                        placeholder="E.g.: 2"
                        value={waitingHours}
                        onChange={(e) => setWaitingHours(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {isAirportFlight && (
                  <>
                    <label className="form-label mt-4">
                      ✈️ Flight number <span className="font-normal text-zinc-500">(optional — we track your arrival)</span>
                    </label>
                    <input
                      className="form-input uppercase"
                      type="text"
                      placeholder="E.g.: AA 1234, JBU 456, IB 6547"
                      value={flight}
                      onChange={(e) => setFlight(e.target.value.toUpperCase())}
                    />
                  </>
                )}

                <label className="form-label mt-4">📝 Passenger Name</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Full name"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                />

                <button className="btn-next" onClick={() => goStep(4)}>
                  Review Booking →
                </button>
                <button className="btn-back" onClick={() => goStep(2)}>
                  ← Back
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="wizard-step show">
                <h3 className="font-display mb-4 text-base text-medit-fg dark:text-white">Your Booking Summary</h3>
                <div className="summary-card">
                  {passengerName && <SummaryRow label="Passenger" value={passengerName} />}
                  <SummaryRow label="Region" value={region === "puj" ? "Punta Cana (PUJ)" : "Santo Domingo (SDQ)"} />
                  <SummaryRow label="Service" value={type === "transfer" ? "Transfer" : type === "tour" ? "Tour" : "Custom"} />
                  <SummaryRow label="Route/Tour" value={selectedRoute?.name ?? "—"} />
                  <SummaryRow label="Ref. price" value={selectedRoute?.price ?? "—"} />
                  <SummaryRow label="Date" value={date || "—"} />
                  <SummaryRow label="Time" value={time || "—"} />
                  <SummaryRow label="Passengers" value={String(pax)} />
                  <SummaryRow label="Trip" value={trip === "one" ? "One Way" : "Round Trip"} />
                  {trip === "round" && returnTime && <SummaryRow label="Return time" value={returnTime} />}
                  {trip === "round" && !returnTime && waitingHours && <SummaryRow label="Waiting at destination" value={`${waitingHours}h`} />}
                  {flight && <SummaryRow label="✈️ Flight" value={flight} />}
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
                  📱 Confirm via WhatsApp
                </button>
                <button className="btn-back" onClick={() => goStep(3)}>
                  ← Edit
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="calc-inner">
            <p className="mb-4 text-sm text-zinc-500">
              Estimate the cost of your trip in Santo Domingo. For airport transfers or tours, check the fixed rates above.
            </p>

            <div className="calc-group">
              <label className="form-label">Origin</label>
              <input
                ref={calcOriginRef}
                className="form-input"
                type="text"
                placeholder="E.g.: Hotel Jaragua, Piantini"
                value={calcOrigin}
                onChange={(e) => setCalcOrigin(e.target.value)}
              />
            </div>
            <div className="calc-group">
              <label className="form-label">Destination</label>
              <input
                ref={calcDestRef}
                className="form-input"
                type="text"
                placeholder="E.g.: Zona Colonial, Clínica Abel González"
                value={calcDest}
                onChange={(e) => setCalcDest(e.target.value)}
              />
            </div>

            <div className="calc-group">
              <label className="form-label">Accessibility Add-ons</label>
              <div className="addons-grid">
                <label className={`addon-check ${calcWheelchair ? "checked" : ""}`}>
                  <input type="checkbox" checked={calcWheelchair} onChange={(e) => setCalcWheelchair(e.target.checked)} />
                  <span>
                    ♿ Wheelchair <small>+$10</small>
                  </span>
                </label>
                <label className={`addon-check ${calcStairclimber ? "checked" : ""}`}>
                  <input type="checkbox" checked={calcStairclimber} onChange={(e) => setCalcStairclimber(e.target.checked)} />
                  <span>
                    🪜 Stair climber <small>+$15</small>
                  </span>
                </label>
              </div>
            </div>

            <div className="calc-group">
              <label className="form-label">Floor (stairs at destination)</label>
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
                  <span>Round trip (up to 3h)</span>
                  <span>
                    ${fareRange.baseMin} USD – ${fareRange.baseMax} USD
                  </span>
                </div>
                {fareRange.stairFee > 0 && (
                  <div className="fare-row">
                    <span>Stairs (floor {calcFloor + 1})</span>
                    <span>+${fareRange.stairFee} USD</span>
                  </div>
                )}
                {fareRange.wcFee > 0 && (
                  <div className="fare-row">
                    <span>Wheelchair</span>
                    <span>+${fareRange.wcFee} USD</span>
                  </div>
                )}
                {fareRange.scFee > 0 && (
                  <div className="fare-row">
                    <span>Electric stair climber</span>
                    <span>+${fareRange.scFee} USD</span>
                  </div>
                )}
                <div className="fare-row fare-total">
                  <span>ESTIMATED TOTAL</span>
                  <span>{fareRange.range}</span>
                </div>
                <p className="fare-note">
                  ⚠️ Reference estimate for trips within SD. The exact fare is confirmed via WhatsApp before the service.
                </p>
              </div>
            )}
            {showFareResult && (
              <button className="fare-wha" onClick={whaCalc}>
                📱 Confirm via WhatsApp
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
