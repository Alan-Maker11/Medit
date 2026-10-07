"use client";

import { useState } from "react";
import "./booking.css";
import { lookupFlight, statusClass, statusLabel, fmtTime, delayMinutes, type FlightResult } from "@/lib/flightApi";

type Status = "idle" | "loading" | "error" | "done";

export default function FlightTracker() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<FlightResult | null>(null);

  async function handleSearch() {
    const flightNumber = input.trim().replace(/\s+/g, "");
    if (!flightNumber) return;
    setStatus("loading");
    try {
      const data = await lookupFlight(flightNumber);
      setResult(data);
      setStatus("done");
    } catch {
      setResult(null);
      setStatus("error");
    }
  }

  function bookThisFlight() {
    const flightNumber = result?.flight.iata ?? input.trim();
    window.dispatchEvent(new CustomEvent("medit:prefill-flight", { detail: flightNumber }));
    document.getElementById("reservar")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="flight-tracker" className="bg-medit-bg px-4 py-16 dark:bg-[#0d1421] sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="font-body text-xs font-bold uppercase tracking-widest text-medit-teal">✈️ Monitoreo de Vuelos</p>
          <h2 className="font-display mt-2 text-3xl font-bold text-medit-fg dark:text-white sm:text-4xl">
            Rastreamos tu vuelo en tiempo real
          </h2>
          <p className="font-body mx-auto mt-2 max-w-lg text-sm text-zinc-500">
            Ingresa tu número de vuelo y veremos el estado de tu llegada para estar listos a tiempo.
          </p>
        </div>

        <div className="flight-tracker-card font-body mt-10">
          <div className="ft-search">
            <input
              className="form-input ft-input"
              type="text"
              placeholder="Ej: AA 1234, IB 6547, JBU 456"
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="btn-primary ft-btn" onClick={handleSearch}>
              🔍 Buscar vuelo
            </button>
          </div>

          {status === "loading" && (
            <div className="ft-loading">
              <span className="spin">✈️</span>
              <p className="mt-3">
                Buscando vuelo <strong>{input}</strong>…
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="ft-error">
              😕 No encontré el vuelo <strong>{input}</strong>.
              <br />
              <small>Verifica el número e inténtalo de nuevo.</small>
            </div>
          )}

          {status === "done" && result && <FlightCard result={result} onBook={bookThisFlight} />}

          <p className="ft-note">Datos proporcionados por AviationStack. Solo vuelos comerciales internacionales y domésticos.</p>
        </div>
      </div>
    </section>
  );
}

function FlightCard({ result, onBook }: { result: FlightResult; onBook: () => void }) {
  const { departure: dep, arrival: arr } = result;
  const delay = delayMinutes(arr.scheduled, arr.estimated ?? arr.actual);
  const cls = statusClass(result.flight_status);
  const label = statusLabel(result.flight_status);

  return (
    <div className="ft-result-card">
      {result.isDemo && (
        <p className="mb-3 text-xs font-bold text-medit-gold">⚠️ DEMO — Conecta tu API key de AviationStack para datos reales</p>
      )}
      <div className="ft-header">
        <div>
          <div className="ft-flight-num">✈️ {result.flight.iata || result.flight.icao || "—"}</div>
          <div className="mt-0.5 text-sm text-zinc-500">{result.airline.name}</div>
        </div>
        <span className={`ft-status ${cls}`}>{label}</span>
      </div>

      <div className="ft-route">
        <div className="ft-airport">
          <div className="ft-iata">{dep.iata || "—"}</div>
          <div className="ft-city">{dep.airport || ""}</div>
        </div>
        <div className="ft-arrow">→</div>
        <div className="ft-airport">
          <div className="ft-iata">{arr.iata || "—"}</div>
          <div className="ft-city">{arr.airport || ""}</div>
        </div>
      </div>

      <div className="ft-times">
        <div className="ft-time-block">
          <div className="ft-time-label">🛫 Salida programada</div>
          <div className="ft-time-val">{fmtTime(dep.scheduled)}</div>
          {dep.estimated && dep.estimated !== dep.scheduled && <div className="ft-time-sub ft-delay">Est: {fmtTime(dep.estimated)}</div>}
        </div>
        <div className="ft-time-block">
          <div className="ft-time-label">🛬 Llegada programada</div>
          <div className="ft-time-val">{fmtTime(arr.scheduled)}</div>
          <div className="ft-time-sub">
            {delay > 0 ? (
              <span className="ft-delay">+{delay} min demora</span>
            ) : delay < 0 ? (
              <span className="ft-ontime">{Math.abs(delay)} min adelantado</span>
            ) : (
              <span className="ft-ontime">A tiempo</span>
            )}
          </div>
          {arr.estimated && arr.estimated !== arr.scheduled && <div className="ft-time-sub">Est: {fmtTime(arr.estimated)}</div>}
        </div>
      </div>

      <button className="ft-book-cta" onClick={onBook}>
        📲 Reservar transfer para este vuelo
      </button>
    </div>
  );
}
