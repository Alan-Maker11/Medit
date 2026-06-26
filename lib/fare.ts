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

export function calculateFare({
  distanceKm,
  durationMinutes,
  tripType,
  mode = "private",
  waitingHours = 0,
  additionalFees = 0,
}: CalculateFareInput): FareBreakdown {
  const isPublic = mode === "public";
  const baseFare = isPublic ? PUBLIC_BASE_FARE : BASE_FARE;
  const distanceCost = Math.round(
    distanceKm * (isPublic ? PUBLIC_DISTANCE_RATE_PER_KM : DISTANCE_RATE_PER_KM)
  );
  const durationCost = Math.round(
    durationMinutes * (isPublic ? PUBLIC_DURATION_RATE_PER_MIN : DURATION_RATE_PER_MIN)
  );
  const waitingCost =
    tripType === "round-trip"
      ? Math.round(waitingHours * (isPublic ? PUBLIC_WAITING_RATE_PER_HOUR : WAITING_RATE_PER_HOUR))
      : 0;

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
