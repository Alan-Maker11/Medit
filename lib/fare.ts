import type { FareBreakdown, TripType } from "./types";

export const BASE_FARE = 1250;
export const DISTANCE_RATE_PER_KM = 2 * 35; // 70 DOP/km
export const DURATION_RATE_PER_MIN = 2 * 15; // 30 DOP/min
export const WAITING_RATE_PER_HOUR = 350;

export interface CalculateFareInput {
  distanceKm: number;
  durationMinutes: number;
  tripType: TripType;
  waitingHours?: number;
  additionalFees?: number;
}

export function calculateFare({
  distanceKm,
  durationMinutes,
  tripType,
  waitingHours = 0,
  additionalFees = 0,
}: CalculateFareInput): FareBreakdown {
  const baseFare = BASE_FARE;
  const distanceCost = Math.round(distanceKm * DISTANCE_RATE_PER_KM);
  const durationCost = Math.round(durationMinutes * DURATION_RATE_PER_MIN);
  const waitingCost =
    tripType === "round-trip" ? Math.round(waitingHours * WAITING_RATE_PER_HOUR) : 0;

  const totalFare = baseFare + distanceCost + durationCost + waitingCost + additionalFees;

  return {
    distanceKm,
    durationMinutes,
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
