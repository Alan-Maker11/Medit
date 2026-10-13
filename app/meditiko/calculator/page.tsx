"use client";

import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

const WHATSAPP_NUMBER = "18293296920";
const MAX_EXPRESS_KM = 7;
const MAX_EXPRESS_MINUTES = 20;

// Meditiko vehicles top out at 35km/h — much slower than regular traffic, so a plain
// Google Maps driving estimate (assumes normal car speeds) always undersells the real
// travel time. Google's duration is doubled as a practical correction; the manual
// fallback (no Maps key) computes straight from the 35km/h top speed instead.
const MEDITIKO_TOP_SPEED_KMH = 35;
const GOOGLE_DURATION_MULTIPLIER = 2;

interface BreakdownItem {
  label: string;
  amount: number;
}

function calculateMeditikoPrice(km: number, isRoundtrip: boolean, waitHours: number) {
  const steps: BreakdownItem[] = [];

  const basePrice = 150;
  steps.push({ label: "Base (first 1km)", amount: basePrice });

  const additionalKm = Math.max(0, km - 1);
  const additionalPrice = additionalKm * 100;
  if (additionalKm > 0) {
    steps.push({ label: `Extra km (${additionalKm.toFixed(1)}km × RD$100)`, amount: Math.round(additionalPrice) });
  }

  let price = basePrice + additionalPrice;

  if (isRoundtrip) {
    price = price * 2;
    steps.push({ label: "Round trip (×2)", amount: Math.round(price) });

    const cappedWaitHours = Math.min(waitHours, 2);
    const waitingPrice = cappedWaitHours * 100;
    if (cappedWaitHours > 0) {
      steps.push({
        label: `Waiting time (${cappedWaitHours}h × RD$100${waitHours > 2 ? " — max. 2h" : ""})`,
        amount: waitingPrice,
      });
      price += waitingPrice;
    }
  }

  return { price: Math.round(price), steps };
}

export default function MeditikoCalculatorPage() {
  const pickupRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);

  const [passengerName, setPassengerName] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [tripType, setTripType] = useState<"oneway" | "roundtrip">("oneway");
  const [waitingHours, setWaitingHours] = useState(0);
  const [showFormulaTest, setShowFormulaTest] = useState(false);
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const [mapsReady, setMapsReady] = useState(false);
  const [mapsError, setMapsError] = useState<string | null>(() =>
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? null : "Enter the distance manually below."
  );
  const [manualKm, setManualKm] = useState(5);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [breakdown, setBreakdown] = useState<BreakdownItem[]>([]);

  const effectiveKm = distanceKm ?? (mapsError ? manualKm : null);
  const effectiveMinutes =
    durationMinutes ?? (mapsError ? Math.round((manualKm / MEDITIKO_TOP_SPEED_KMH) * 60) : null);
  // Distance is the only restriction — time/duration is shown for information only.
  const isLongJourney = effectiveKm != null && effectiveKm > MAX_EXPRESS_KM;

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
            setPickupAddress(place.formatted_address ?? pickupRef.current?.value ?? "");
          });
        }
        if (destinationRef.current) {
          const ac = new google.maps.places.Autocomplete(destinationRef.current, {
            fields: ["formatted_address"],
            componentRestrictions: { country: "do" },
          });
          ac.addListener("place_changed", () => {
            const place = ac.getPlace();
            setDestinationAddress(place.formatted_address ?? destinationRef.current?.value ?? "");
          });
        }
        setMapsReady(true);
      })
      .catch(() => setMapsError("Could not load the map. Enter the distance manually below."));
  }, []);

  async function fetchDistance() {
    setRouteError(null);
    if (!mapsReady || !pickupAddress || !destinationAddress) return;
    setCalculating(true);
    try {
      const { DistanceMatrixService } = (await google.maps.importLibrary("routes")) as google.maps.RoutesLibrary;
      const service = new DistanceMatrixService();
      const result = await service.getDistanceMatrix({
        origins: [pickupAddress],
        destinations: [destinationAddress],
        travelMode: google.maps.TravelMode.DRIVING,
      });
      const element = result.rows[0]?.elements[0];
      if (!element || element.status !== "OK") {
        setRouteError("Could not calculate the distance for those addresses.");
        setCalculating(false);
        return;
      }
      setDistanceKm(Math.round((element.distance.value / 1000) * 10) / 10);
      setDurationMinutes(Math.round((element.duration.value / 60) * GOOGLE_DURATION_MULTIPLIER));
    } catch {
      setRouteError("Could not calculate the distance for those addresses.");
    }
    setCalculating(false);
  }

  useEffect(() => {
    if (effectiveKm == null) {
      setCalculatedPrice(0);
      setBreakdown([]);
      return;
    }
    const { price, steps } = calculateMeditikoPrice(effectiveKm, tripType === "roundtrip", waitingHours);
    setCalculatedPrice(price);
    setBreakdown(steps);
  }, [effectiveKm, tripType, waitingHours]);

  const tripSummary = `${pickupAddress || "?"} → ${destinationAddress || "?"} (${
    tripType === "roundtrip" ? "round trip" : "one way"
  }${effectiveKm != null ? `, ${effectiveKm}km` : ""})`;

  const bookHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi Meditiko, I'm ${passengerName || "?"} (${passengerPhone || "?"}). I want to book: ${tripSummary} — estimated price RD$${calculatedPrice.toLocaleString()}`
  )}`;
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi Medit, I need transportation for a long trip: ${tripSummary}`
  )}`;

  async function handleBook() {
    setBookingError(null);
    if (!passengerName.trim() || !passengerPhone.trim()) {
      setBookingError("Enter your name and phone number to book.");
      return;
    }
    if (effectiveKm == null) return;
    setBooking(true);
    try {
      const res = await fetch("/api/meditiko/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passenger_name: passengerName.trim(),
          passenger_phone: passengerPhone.trim(),
          pickup_address: pickupAddress,
          destination_address: destinationAddress,
          trip_distance_km: effectiveKm,
          estimated_duration_minutes: effectiveMinutes ?? 0,
          trip_type: tripType === "roundtrip" ? "round_trip" : "one_way",
          waiting_hours: waitingHours,
          estimated_price: calculatedPrice,
        }),
      });
      if (!res.ok) {
        setBookingError("Could not submit the booking. Try again or contact us on WhatsApp.");
        setBooking(false);
        return;
      }
      setBookingConfirmed(true);
      window.open(bookHref, "_blank", "noopener,noreferrer");
    } catch {
      setBookingError("Could not submit the booking. Try again or contact us on WhatsApp.");
    }
    setBooking(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 px-4 py-8">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">Meditiko</h1>
          <p className="text-lg text-blue-200">Calculate your fare in seconds</p>
        </div>

        <div className="space-y-6 rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-md">
          {/* Passenger info */}
          <div className="space-y-3">
            <label className="block text-sm font-bold uppercase tracking-wider text-gray-800">Your info</label>
            <input
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-xl border-2 border-blue-300 px-4 py-3 text-sm font-medium text-gray-900 focus:border-blue-600 focus:outline-none"
            />
            <input
              value={passengerPhone}
              onChange={(e) => setPassengerPhone(e.target.value)}
              placeholder="Phone / WhatsApp"
              type="tel"
              className="w-full rounded-xl border-2 border-blue-300 px-4 py-3 text-sm font-medium text-gray-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          {/* Trip type */}
          <div className="space-y-3">
            <label className="block text-sm font-bold uppercase tracking-wider text-gray-800">Trip Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTripType("oneway")}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-4 font-bold transition-all duration-300 ${
                  tripType === "oneway"
                    ? "scale-105 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                📍 One Way
              </button>
              <button
                onClick={() => setTripType("roundtrip")}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-4 font-bold transition-all duration-300 ${
                  tripType === "roundtrip"
                    ? "scale-105 bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                ↔️ Round Trip
              </button>
            </div>
          </div>

          {/* Addresses */}
          <div className="space-y-3">
            <label className="block text-sm font-bold uppercase tracking-wider text-gray-800">
              📍 Pickup Point
            </label>
            <input
              ref={pickupRef}
              value={pickupAddress}
              onChange={(e) => {
                setPickupAddress(e.target.value);
                setDistanceKm(null);
                setDurationMinutes(null);
              }}
              onBlur={fetchDistance}
              placeholder="E.g.: Av. 27 de Febrero, Santo Domingo"
              className="w-full rounded-xl border-2 border-blue-300 px-4 py-3 text-sm font-medium text-gray-900 focus:border-blue-600 focus:outline-none"
            />

            <label className="block text-sm font-bold uppercase tracking-wider text-gray-800">🏁 Destination</label>
            <input
              ref={destinationRef}
              value={destinationAddress}
              onChange={(e) => {
                setDestinationAddress(e.target.value);
                setDistanceKm(null);
                setDurationMinutes(null);
              }}
              onBlur={fetchDistance}
              placeholder="E.g.: Plaza Central, Santo Domingo"
              className="w-full rounded-xl border-2 border-blue-300 px-4 py-3 text-sm font-medium text-gray-900 focus:border-blue-600 focus:outline-none"
            />

            {calculating && <p className="text-center text-sm text-gray-500">Calculating distance…</p>}
            {routeError && <p className="text-center text-sm text-red-600">{routeError}</p>}
            {!mapsError && distanceKm != null && (
              <div className="text-center">
                <p className="text-sm font-semibold text-blue-700">
                  {distanceKm} km (~{durationMinutes} minutos)
                </p>
                <p className="text-xs text-gray-500">Time adjusted for Meditiko's speed (max. 35km/h)</p>
              </div>
            )}

            {/* Manual fallback when Maps isn't available */}
            {mapsError && (
              <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs text-amber-800">{mapsError}</p>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={manualKm}
                  onChange={(e) => setManualKm(parseFloat(e.target.value) || 1)}
                  className="w-full rounded-lg border-2 border-amber-300 px-4 py-2 text-center text-xl font-bold text-amber-700 focus:border-amber-600 focus:outline-none"
                />
                <p className="text-center text-xs text-gray-600">
                  {manualKm} km (~{Math.round((manualKm / MEDITIKO_TOP_SPEED_KMH) * 60)} minutes)
                </p>
              </div>
            )}
          </div>

          {/* Waiting time (roundtrip only) */}
          {tripType === "roundtrip" && (
            <div className="space-y-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
              <div className="flex items-center gap-2">
                <span>⏰</span>
                <label className="text-sm font-bold uppercase tracking-wider text-gray-800">
                  How long will you be at the destination?
                </label>
              </div>
              <p className="text-xs text-gray-600">⏱️ Waiting cost: RD$100 per hour (maximum 2 hours)</p>
              <div className="space-y-2">
                <input
                  type="number"
                  min="0"
                  max="4"
                  step="0.25"
                  value={waitingHours}
                  onChange={(e) => setWaitingHours(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border-2 border-orange-300 px-4 py-2 text-center text-lg font-bold focus:border-orange-600 focus:outline-none"
                />
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="0.25"
                  value={waitingHours}
                  onChange={(e) => setWaitingHours(parseFloat(e.target.value))}
                  className="h-3 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-orange-600"
                />
                <p className="text-center text-xs text-gray-600">
                  {Math.min(waitingHours, 2)} hours
                  {waitingHours > 2 && <span className="block font-bold text-orange-600">⚠️ Maximum 2 hours (capped)</span>}
                </p>
              </div>
            </div>
          )}

          {/* Long journey warning */}
          {isLongJourney && effectiveKm != null && (
            <div className="space-y-3 rounded-xl border-2 border-red-300 bg-gradient-to-br from-red-50 to-orange-50 p-4 shadow-md">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 text-2xl">⚠️</span>
                <div className="space-y-2">
                  <p className="font-bold text-red-900">Long Trip for Meditiko</p>
                  <p className="text-sm text-red-800">
                    Meditiko is optimized for express trips (maximum {MAX_EXPRESS_KM}km, ~{MAX_EXPRESS_MINUTES}{" "}
                    minutes).
                  </p>
                  <p className="text-sm text-red-800">
                    Your trip of <strong>{effectiveKm}km (~{effectiveMinutes} minutes)</strong> would be better served by
                    our <strong>Medit Premium</strong> service.
                  </p>

                  <div className="mt-3 rounded-lg border border-red-200 bg-white p-3">
                    <p className="mb-2 text-xs font-bold text-gray-900">
                      💡 Suggestion: Contact Medit for Regular Transportation
                    </p>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full rounded-lg bg-green-600 px-3 py-2 text-center text-sm font-bold text-white transition-all hover:bg-green-700"
                    >
                      📱 Contact Medit via WhatsApp
                    </a>
                    <p className="mt-2 text-xs text-gray-600">
                      Phone: <strong>+1-829-329-6920</strong>
                    </p>
                  </div>

                  <p className="mt-2 border-t border-red-200 pt-2 text-xs text-red-700">
                    ✓ Medit Premium: Ideal for long trips, medical services, corporate packages
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Price */}
          {effectiveKm == null ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
              Enter the pickup point and destination to see the price.
            </div>
          ) : (
            <div
              className={`space-y-3 rounded-2xl border-2 p-6 ${
                isLongJourney ? "border-gray-300 bg-gray-50" : "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">💵</span>
                <span className="text-sm font-bold uppercase text-gray-700">
                  {isLongJourney ? "Price (Not Recommended)" : "Estimated Price"}
                </span>
              </div>

              <div className="py-4 text-center">
                <p className={`mb-2 text-5xl font-black ${isLongJourney ? "text-gray-600" : "text-green-600"}`}>
                  RD${calculatedPrice.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">
                  {isLongJourney ? "Consider Medit Premium for long trips" : "Pay in cash or by transfer"}
                </p>
              </div>

              <div className="space-y-2 border-t-2 border-gray-300 pt-4 text-sm">
                {breakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-gray-700">{item.label}:</span>
                    <span className="font-bold text-gray-900">RD${item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="space-y-2 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs font-bold uppercase text-blue-900">ℹ️ Meditiko Express</p>
            <ul className="space-y-1 text-xs text-blue-800">
              <li>✓ Optimized for short, quick trips</li>
              <li>✓ Maximum {MAX_EXPRESS_KM}km (~{MAX_EXPRESS_MINUTES} minutes)</li>
              <li>✓ Verified professional drivers</li>
              <li>✓ Available 6:00 AM - 10:00 PM</li>
            </ul>
          </div>

          {/* CTA */}
          {effectiveKm != null && !bookingConfirmed && (
            <>
              {isLongJourney ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-red-700 hover:to-orange-700 hover:shadow-xl"
                >
                  📍 Contact Medit Premium
                </a>
              ) : (
                <button
                  onClick={handleBook}
                  disabled={booking}
                  className="flex w-full transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl disabled:opacity-60"
                >
                  📍 {booking ? "Submitting booking…" : "Book Now"}
                </button>
              )}
              {bookingError && <p className="text-center text-sm text-red-600">{bookingError}</p>}
            </>
          )}

          {bookingConfirmed && (
            <div className="rounded-xl border-2 border-green-300 bg-green-50 p-4 text-center">
              <p className="font-bold text-green-900">✅ Booking submitted!</p>
              <p className="text-sm text-green-800">We will contact you on WhatsApp to confirm your trip.</p>
            </div>
          )}

          {/* Formula test toggle */}
          <button
            onClick={() => setShowFormulaTest(!showFormulaTest)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-xs font-bold text-gray-800 transition-all hover:bg-gray-300"
          >
            🧮 {showFormulaTest ? "Hide" : "View"} Pricing Formula
          </button>

          {showFormulaTest && (
            <div className="space-y-3 rounded-xl border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50 p-4">
              <div className="flex items-center gap-2">
                <span>ℹ️</span>
                <p className="text-xs font-bold uppercase text-purple-900">Pricing Formula</p>
              </div>

              <div className="space-y-2 rounded-lg bg-white/80 p-3 font-mono text-xs">
                <p className="mb-2 font-bold text-purple-900">MEDITIKO EXPRESS FORMULA:</p>

                <div className="space-y-2">
                  <div className="rounded border-l-4 border-green-600 bg-green-100 p-2">
                    <p className="font-bold text-green-900">ONE WAY:</p>
                    <p className="text-green-800">Base (RD$150) + [(km - 1) × RD$100]</p>
                  </div>

                  <div className="rounded border-l-4 border-purple-600 bg-purple-100 p-2">
                    <p className="font-bold text-purple-900">ROUND TRIP:</p>
                    <p className="text-purple-800">
                      [Base + (km - 1) × RD$100] × 2
                      <br />+ [Waiting hours × RD$100] (max 2h)
                    </p>
                  </div>
                </div>

                <div className="mt-2 rounded border-l-4 border-yellow-600 bg-yellow-100 p-2">
                  <p className="mb-1 font-bold text-yellow-900">MEDITIKO OPTIMAL RANGE:</p>
                  <div className="space-y-1 text-xs text-yellow-800">
                    <p>✓ 1km (~2 min) = RD$150</p>
                    <p>✓ 3km (~5 min) = RD$350</p>
                    <p>✓ 5km (~9 min) = RD$550</p>
                    <p>✓ 7km (~12 min) = RD$750 ← LIMIT</p>
                    <p className="border-t border-yellow-400 pt-1">✗ 10km+ = Contact Medit Premium</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-gray-600">
            Meditiko • Express Transportation in Santo Domingo
            <br />
            {isLongJourney ? "For long trips, use Medit Premium" : "Available 6:00 AM - 10:00 PM"}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/20 bg-white/10 p-3 text-center backdrop-blur-md">
            <p className="mb-1 text-2xl">⚡</p>
            <p className="text-xs font-bold text-white">Express</p>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/10 p-3 text-center backdrop-blur-md">
            <p className="mb-1 text-2xl">🛡️</p>
            <p className="text-xs font-bold text-white">Safe</p>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/10 p-3 text-center backdrop-blur-md">
            <p className="mb-1 text-2xl">💰</p>
            <p className="text-xs font-bold text-white">Affordable</p>
          </div>
        </div>
      </div>
    </div>
  );
}
