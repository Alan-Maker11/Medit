"use client";

import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "18293296920";
const MAX_EXPRESS_KM = 7;
const MAX_EXPRESS_MINUTES = 20;
const MINUTES_PER_KM = 3;

interface BreakdownItem {
  label: string;
  amount: number;
}

function calculateMeditikoPrice(km: number, isRoundtrip: boolean, waitHours: number) {
  const steps: BreakdownItem[] = [];

  const basePrice = 150;
  steps.push({ label: "Base (primer 1km)", amount: basePrice });

  const additionalKm = Math.max(0, km - 1);
  const additionalPrice = additionalKm * 100;
  if (additionalKm > 0) {
    steps.push({ label: `Km adicionales (${additionalKm}km × RD$100)`, amount: additionalPrice });
  }

  let price = basePrice + additionalPrice;

  if (isRoundtrip) {
    price = price * 2;
    steps.push({ label: "Ida y Vuelta (×2)", amount: price });

    const cappedWaitHours = Math.min(waitHours, 2);
    const waitingPrice = cappedWaitHours * 100;
    if (cappedWaitHours > 0) {
      steps.push({
        label: `Espera (${cappedWaitHours}h × RD$100${waitHours > 2 ? " — máx. 2h" : ""})`,
        amount: waitingPrice,
      });
      price += waitingPrice;
    }
  }

  return { price, steps };
}

export default function MeditikoCalculatorPage() {
  const [tripType, setTripType] = useState<"oneway" | "roundtrip">("oneway");
  const [kilometers, setKilometers] = useState(5);
  const [waitingHours, setWaitingHours] = useState(0);
  const [showFormulaTest, setShowFormulaTest] = useState(false);

  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [breakdown, setBreakdown] = useState<BreakdownItem[]>([]);
  const [estimatedTravelTime, setEstimatedTravelTime] = useState(0);
  const [isLongJourney, setIsLongJourney] = useState(false);

  useEffect(() => {
    const { price, steps } = calculateMeditikoPrice(kilometers, tripType === "roundtrip", waitingHours);
    const travelTime = Math.round(kilometers * MINUTES_PER_KM);
    setCalculatedPrice(price);
    setBreakdown(steps);
    setEstimatedTravelTime(travelTime);
    setIsLongJourney(kilometers > MAX_EXPRESS_KM || travelTime > MAX_EXPRESS_MINUTES);
  }, [tripType, kilometers, waitingHours]);

  const bookHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola Meditiko, quiero reservar un viaje de ${kilometers}km (${
      tripType === "roundtrip" ? "ida y vuelta" : "un sentido"
    }) — precio estimado RD$${calculatedPrice.toLocaleString()}`
  )}`;
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hola Medit, necesito transporte para un viaje largo"
  )}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 px-4 py-8">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">Meditiko</h1>
          <p className="text-lg text-blue-200">Calcula tu tarifa en segundos</p>
        </div>

        <div className="space-y-6 rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-md">
          {/* Trip type */}
          <div className="space-y-3">
            <label className="block text-sm font-bold uppercase tracking-wider text-gray-800">Tipo de Viaje</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTripType("oneway")}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-4 font-bold transition-all duration-300 ${
                  tripType === "oneway"
                    ? "scale-105 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                📍 Un Sentido
              </button>
              <button
                onClick={() => setTripType("roundtrip")}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-4 font-bold transition-all duration-300 ${
                  tripType === "roundtrip"
                    ? "scale-105 bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                ↔️ Ida y Vuelta
              </button>
            </div>
          </div>

          {/* Distance */}
          <div className="space-y-3">
            <label className="block text-sm font-bold uppercase tracking-wider text-gray-800">Distancia (km)</label>
            <div className="space-y-2">
              <input
                type="number"
                min="1"
                step="0.5"
                value={kilometers}
                onChange={(e) => setKilometers(parseFloat(e.target.value) || 1)}
                className="w-full rounded-xl border-2 border-blue-300 px-4 py-3 text-center text-2xl font-bold text-blue-600 focus:border-blue-600 focus:outline-none"
              />
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={kilometers}
                onChange={(e) => setKilometers(parseFloat(e.target.value))}
                className="h-3 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
              />
              <p className="text-center text-sm text-gray-600">
                {kilometers} km de distancia (~{estimatedTravelTime} minutos)
              </p>
            </div>
          </div>

          {/* Long journey warning */}
          {isLongJourney && (
            <div className="space-y-3 rounded-xl border-2 border-red-300 bg-gradient-to-br from-red-50 to-orange-50 p-4 shadow-md">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 text-2xl">⚠️</span>
                <div className="space-y-2">
                  <p className="font-bold text-red-900">Viaje Largo para Meditiko</p>
                  <p className="text-sm text-red-800">
                    Meditiko está optimizado para viajes expresos (máximo {MAX_EXPRESS_KM}km, ~{MAX_EXPRESS_MINUTES}{" "}
                    minutos).
                  </p>
                  <p className="text-sm text-red-800">
                    Tu viaje de <strong>{kilometers}km (~{estimatedTravelTime} minutos)</strong> sería mejor servido
                    por nuestro servicio <strong>Medit Premium</strong>.
                  </p>

                  <div className="mt-3 rounded-lg border border-red-200 bg-white p-3">
                    <p className="mb-2 text-xs font-bold text-gray-900">
                      💡 Sugerencia: Contacta a Medit para Transporte Regular
                    </p>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full rounded-lg bg-green-600 px-3 py-2 text-center text-sm font-bold text-white transition-all hover:bg-green-700"
                    >
                      📱 Contactar Medit por WhatsApp
                    </a>
                    <p className="mt-2 text-xs text-gray-600">
                      Teléfono: <strong>+1-829-329-6920</strong>
                    </p>
                  </div>

                  <p className="mt-2 border-t border-red-200 pt-2 text-xs text-red-700">
                    ✓ Medit Premium: Ideal para viajes largos, servicios médicos, paquetes corporativos
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Waiting time (roundtrip only) */}
          {tripType === "roundtrip" && (
            <div className="space-y-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
              <div className="flex items-center gap-2">
                <span>⏰</span>
                <label className="text-sm font-bold uppercase tracking-wider text-gray-800">
                  Tiempo de Espera en Destino
                </label>
              </div>
              <p className="text-xs text-gray-600">⏱️ Costo de espera: RD$100 por hora (máximo 2 horas)</p>
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
                  {Math.min(waitingHours, 2)} horas
                  {waitingHours > 2 && <span className="block font-bold text-orange-600">⚠️ Máximo 2 horas (capado)</span>}
                </p>
              </div>
            </div>
          )}

          {/* Price */}
          <div
            className={`space-y-3 rounded-2xl border-2 p-6 ${
              isLongJourney ? "border-gray-300 bg-gray-50" : "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">💵</span>
              <span className="text-sm font-bold uppercase text-gray-700">
                {isLongJourney ? "Precio (No Recomendado)" : "Precio Estimado"}
              </span>
            </div>

            <div className="py-4 text-center">
              <p className={`mb-2 text-5xl font-black ${isLongJourney ? "text-gray-600" : "text-green-600"}`}>
                RD${calculatedPrice.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">
                {isLongJourney ? "Considera Medit Premium para viajes largos" : "Pago en efectivo o transferencia"}
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

          {/* Info */}
          <div className="space-y-2 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs font-bold uppercase text-blue-900">ℹ️ Meditiko Express</p>
            <ul className="space-y-1 text-xs text-blue-800">
              <li>✓ Optimizado para viajes cortos y rápidos</li>
              <li>✓ Máximo {MAX_EXPRESS_KM}km (~{MAX_EXPRESS_MINUTES} minutos)</li>
              <li>✓ Conductores profesionales verificados</li>
              <li>✓ Disponible 6:00 AM - 10:00 PM</li>
            </ul>
          </div>

          {/* CTA */}
          {!isLongJourney ? (
            <a
              href={bookHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
            >
              📍 Reservar Ahora
            </a>
          ) : (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-red-700 hover:to-orange-700 hover:shadow-xl"
            >
              📍 Contactar Medit Premium
            </a>
          )}

          {/* Formula test toggle */}
          <button
            onClick={() => setShowFormulaTest(!showFormulaTest)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-xs font-bold text-gray-800 transition-all hover:bg-gray-300"
          >
            🧮 {showFormulaTest ? "Ocultar" : "Ver"} Fórmula de Cálculo
          </button>

          {showFormulaTest && (
            <div className="space-y-3 rounded-xl border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50 p-4">
              <div className="flex items-center gap-2">
                <span>ℹ️</span>
                <p className="text-xs font-bold uppercase text-purple-900">Fórmula de Cálculo</p>
              </div>

              <div className="space-y-2 rounded-lg bg-white/80 p-3 font-mono text-xs">
                <p className="mb-2 font-bold text-purple-900">FÓRMULA MEDITIKO EXPRESS:</p>

                <div className="space-y-2">
                  <div className="rounded border-l-4 border-green-600 bg-green-100 p-2">
                    <p className="font-bold text-green-900">UN SENTIDO:</p>
                    <p className="text-green-800">Base (RD$150) + [(km - 1) × RD$100]</p>
                  </div>

                  <div className="rounded border-l-4 border-purple-600 bg-purple-100 p-2">
                    <p className="font-bold text-purple-900">IDA Y VUELTA:</p>
                    <p className="text-purple-800">
                      [Base + (km - 1) × RD$100] × 2
                      <br />+ [Horas espera × RD$100] (máx 2h)
                    </p>
                  </div>
                </div>

                <div className="mt-2 rounded border border-gray-300 bg-white p-3">
                  <p className="mb-1 font-bold text-gray-900">TU CÁLCULO ACTUAL:</p>
                  <div className="space-y-1 text-gray-800">
                    <p>
                      • {kilometers}km = RD$150 + ({Math.max(0, kilometers - 1)}km × RD$100)
                    </p>
                    {tripType === "roundtrip" && (
                      <>
                        <p>• Ida y Vuelta (×2)</p>
                        {waitingHours > 0 && <p>• + Espera: {Math.min(waitingHours, 2)}h × RD$100</p>}
                      </>
                    )}
                    <p className={`mt-2 font-bold ${isLongJourney ? "text-red-600" : "text-green-600"}`}>
                      = RD${calculatedPrice.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-2 rounded border-l-4 border-yellow-600 bg-yellow-100 p-2">
                  <p className="mb-1 font-bold text-yellow-900">RANGO ÓPTIMO MEDITIKO:</p>
                  <div className="space-y-1 text-xs text-yellow-800">
                    <p>✓ 1km (~3 min) = RD$150</p>
                    <p>✓ 3km (~9 min) = RD$350</p>
                    <p>✓ 5km (~15 min) = RD$550</p>
                    <p>✓ 7km (~21 min) = RD$750 ← LÍMITE</p>
                    <p className="border-t border-yellow-400 pt-1">✗ 10km+ = Contactar Medit Premium</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-gray-600">
            Meditiko • Transporte Express en Santo Domingo
            <br />
            {isLongJourney ? "Para viajes largos, usa Medit Premium" : "Disponible 6:00 AM - 10:00 PM"}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/20 bg-white/10 p-3 text-center backdrop-blur-md">
            <p className="mb-1 text-2xl">⚡</p>
            <p className="text-xs font-bold text-white">Express</p>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/10 p-3 text-center backdrop-blur-md">
            <p className="mb-1 text-2xl">🛡️</p>
            <p className="text-xs font-bold text-white">Seguro</p>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/10 p-3 text-center backdrop-blur-md">
            <p className="mb-1 text-2xl">💰</p>
            <p className="text-xs font-bold text-white">Asequible</p>
          </div>
        </div>
      </div>
    </div>
  );
}
