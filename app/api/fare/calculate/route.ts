import { NextResponse } from "next/server";
import { calculateFare } from "@/lib/fare";
import type { TripType } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json();
  const { distanceKm, durationMinutes, tripType, waitingHours, additionalFees } = body as {
    distanceKm: number;
    durationMinutes: number;
    tripType: TripType;
    waitingHours?: number;
    additionalFees?: number;
  };

  if (distanceKm == null || durationMinutes == null || !tripType) {
    return NextResponse.json({ error: "distanceKm, durationMinutes and tripType are required" }, { status: 400 });
  }

  const breakdown = calculateFare({
    distanceKm: Number(distanceKm),
    durationMinutes: Number(durationMinutes),
    tripType,
    waitingHours: Number(waitingHours ?? 0),
    additionalFees: Number(additionalFees ?? 0),
  });

  return NextResponse.json(breakdown);
}
