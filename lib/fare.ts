import type { FareBreakdown, TransportationMode, TripType } from "./types";

export const BASE_FARE = 1250;
export const DISTANCE_RATE_PER_KM = 2 * 35; // 70 DOP/km
export const DURATION_RATE_PER_MIN = 2 * 15; // 30 DOP/min
export const WAITING_RATE_PER_HOUR = 350;

export const PUBLIC_BASE_FARE = 150;
export const PUBLIC_DISTANCE_RATE_PER_KM = 15;
export const PUBLIC_DURATION_RATE_PER_MIN = 10;
export const PUBLIC_WAITING_RATE_PER_HOUR = 100;

// Driver's cut of manually-logged Uber side earnings (day total, all trips combined).
export const UBER_DRIVER_COMMISSION_RATE = 0.2;

// Stair climber fee scales with how many floors up the client lives.
// Floor 1 (ground) needs no climb; floor 4+ is capped at the top rate.
export const STAIR_CLIMBER_PRICING = [
  { floor: 1, price: 0, label: "Ground floor" },
  { floor: 2, price: 350, label: "2nd floor" },
  { floor: 3, price: 450, label: "3rd floor" },
  { floor: 4, price: 500, label: "4th floor+" },
] as const;

export function getStairClimberPrice(floor: number): number {
  if (!floor || floor < 1) return 0;
  if (floor >= 4) return 500;
  return STAIR_CLIMBER_PRICING.find((p) => p.floor === floor)?.price ?? 500;
}

// One-way price is anchored to round-trip-with-2hr-wait divided by 2.
// This constant is the reference waiting hours used only for that anchor calculation.
const ONE_WAY_REFERENCE_WAIT_HOURS = 2;

export interface CalculateFareInput {
  distanceKm: number;
  durationMinutes: number;
  tripType: TripType;
  mode?: TransportationMode;
  waitingHours?: number;
  additionalFees?: number;
}

// Meditiko's small electric vehicles travel slower than a private car:
// 1km -> 10min, 2km -> 15min, 3km -> 20min, 4km -> 25min, 5km -> 30min.
function publicModeDurationMinutes(distanceKm: number): number {
  return 5 * distanceKm + 5;
}

export function calculateFare({
  distanceKm,
  durationMinutes,
  tripType,
  mode = "private",
  waitingHours = 0,
  additionalFees = 0,
}: CalculateFareInput): FareBreakdown {
  const isPublic = mode === "public";
  const isRoundTrip = tripType === "round-trip";

  // Private one-way: price = (private round-trip with 2hr wait) / 2
  if (!isPublic && !isRoundTrip) {
    const baseFare = BASE_FARE;
    const distanceCost = Math.round(distanceKm * DISTANCE_RATE_PER_KM);
    const durationCost = Math.round(durationMinutes * DURATION_RATE_PER_MIN);
    const refWaitCost = Math.round(ONE_WAY_REFERENCE_WAIT_HOURS * WAITING_RATE_PER_HOUR);
    const halfTotal = Math.round((baseFare + distanceCost + durationCost + refWaitCost) / 2);
    return {
      distanceKm,
      durationMinutes,
      baseFare: Math.round(baseFare / 2),
      distanceCost: Math.round(distanceCost / 2),
      durationCost: Math.round(durationCost / 2),
      waitingCost: Math.round(refWaitCost / 2),
      additionalFees,
      totalFare: halfTotal + additionalFees,
    };
  }

  // Public (Meditiko) round trips charge the one-way cost there and back;
  // private round trips only add waiting time on top of a single trip cost.
  const tripMultiplier = isPublic && isRoundTrip ? 2 : 1;

  const effectiveDurationMinutes = isPublic
    ? publicModeDurationMinutes(distanceKm)
    : durationMinutes;
  const baseFare = (isPublic ? PUBLIC_BASE_FARE : BASE_FARE) * tripMultiplier;
  const distanceCost = Math.round(
    distanceKm * (isPublic ? PUBLIC_DISTANCE_RATE_PER_KM : DISTANCE_RATE_PER_KM) * tripMultiplier
  );
  const durationCost = Math.round(
    effectiveDurationMinutes *
      (isPublic ? PUBLIC_DURATION_RATE_PER_MIN : DURATION_RATE_PER_MIN) *
      tripMultiplier
  );
  const waitingCost = isRoundTrip
    ? Math.round(waitingHours * (isPublic ? PUBLIC_WAITING_RATE_PER_HOUR : WAITING_RATE_PER_HOUR))
    : 0;

  const totalFare = baseFare + distanceCost + durationCost + waitingCost + additionalFees;

  return {
    distanceKm,
    durationMinutes: effectiveDurationMinutes,
    baseFare,
    distanceCost,
    durationCost,
    waitingCost,
    additionalFees,
    totalFare,
  };
}

export function formatDOP(amount: number): string {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    maximumFractionDigits: 0,
  }).format(amount);
}
