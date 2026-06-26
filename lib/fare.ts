import type { FareBreakdown, TransportationMode, TripType } from "./types";

export const BASE_FARE = 1250;
export const DISTANCE_RATE_PER_KM = 2 * 35; // 70 DOP/km
export const DURATION_RATE_PER_MIN = 2 * 15; // 30 DOP/min
export const WAITING_RATE_PER_HOUR = 350;

export const PUBLIC_BASE_FARE = 150;
export const PUBLIC_DISTANCE_RATE_PER_KM = 15;
export const PUBLIC_DURATION_RATE_PER_MIN = 10;
export const PUBLIC_WAITING_RATE_PER_HOUR = 100;

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
