export interface FlightAirport {
  iata: string | null;
  airport: string | null;
  scheduled: string | null;
  estimated: string | null;
  actual?: string | null;
}

export interface FlightResult {
  flight: { iata: string | null; icao?: string | null };
  airline: { name: string | null };
  departure: FlightAirport;
  arrival: FlightAirport;
  flight_status: string | null;
  isDemo: boolean;
}

const DEMO_FLIGHT: Omit<FlightResult, "flight" | "isDemo"> = {
  airline: { name: "Aerolínea Demo" },
  departure: {
    iata: "JFK",
    airport: "John F. Kennedy Intl.",
    scheduled: "2026-10-07T08:30:00+00:00",
    estimated: "2026-10-07T08:45:00+00:00",
  },
  arrival: {
    iata: "SDQ",
    airport: "Las Américas Intl.",
    scheduled: "2026-10-07T13:10:00+00:00",
    estimated: "2026-10-07T13:25:00+00:00",
  },
  flight_status: "active",
};

/** Looks up a flight via AviationStack, or returns a realistic demo card when no API key is configured. */
export async function lookupFlight(flightNumber: string): Promise<FlightResult> {
  const key = process.env.NEXT_PUBLIC_AVIATIONSTACK_KEY;

  if (!key) {
    await new Promise((r) => setTimeout(r, 1100));
    return { ...DEMO_FLIGHT, flight: { iata: flightNumber }, isDemo: true };
  }

  const res = await fetch(`https://api.aviationstack.com/v1/flights?access_key=${key}&flight_iata=${flightNumber}`);
  const json = await res.json();
  const data = json?.data?.[0];
  if (!data) throw new Error("NOT_FOUND");

  return {
    flight: { iata: data.flight?.iata ?? null, icao: data.flight?.icao ?? null },
    airline: { name: data.airline?.name ?? null },
    departure: {
      iata: data.departure?.iata ?? null,
      airport: data.departure?.airport ?? null,
      scheduled: data.departure?.scheduled ?? null,
      estimated: data.departure?.estimated ?? null,
    },
    arrival: {
      iata: data.arrival?.iata ?? null,
      airport: data.arrival?.airport ?? null,
      scheduled: data.arrival?.scheduled ?? null,
      estimated: data.arrival?.estimated ?? null,
      actual: data.arrival?.actual ?? null,
    },
    flight_status: data.flight_status ?? null,
    isDemo: false,
  };
}

export function statusClass(status: string | null): string {
  if (!status) return "unknown";
  const s = status.toLowerCase();
  if (s.includes("land") || s === "arrived") return "landed";
  if (s.includes("activ") || s.includes("air") || s.includes("enroute")) return "active";
  if (s.includes("cancel")) return "cancelled";
  if (s.includes("sched") || s.includes("depart")) return "scheduled";
  return "unknown";
}

export function statusLabel(status: string | null): string {
  if (!status) return "Sin datos";
  const s = status.toLowerCase();
  if (s.includes("land") || s === "arrived") return "✅ Aterrizó";
  if (s.includes("activ") || s.includes("air") || s.includes("enroute")) return "✈️ En vuelo";
  if (s.includes("cancel")) return "❌ Cancelado";
  if (s.includes("sched")) return "🕐 Programado";
  if (s.includes("depart")) return "🛫 Despegó";
  return `📋 ${status}`;
}

export function fmtTime(isoStr: string | null): string {
  if (!isoStr) return "—";
  try {
    const d = new Date(isoStr);
    return (
      d.toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit", hour12: true }) +
      " (" +
      d.toLocaleDateString("es-DO", { day: "2-digit", month: "short" }) +
      ")"
    );
  } catch {
    return isoStr;
  }
}

export function delayMinutes(scheduled: string | null, actual: string | null | undefined): number {
  if (!scheduled || !actual) return 0;
  try {
    return Math.round((new Date(actual).getTime() - new Date(scheduled).getTime()) / 60000);
  } catch {
    return 0;
  }
}
