export type ServiceName =
  | "Cita Medica"
  | "Post Cirugia"
  | "Pre Cirugia"
  | "Aeropuerto"
  | "Terapia"
  | "Eventos"
  | "Recreativa"
  | "Subir/Bajar";

export const SERVICE_TYPES: ServiceName[] = [
  "Cita Medica",
  "Post Cirugia",
  "Pre Cirugia",
  "Aeropuerto",
  "Terapia",
  "Eventos",
  "Recreativa",
  "Subir/Bajar",
];

export type TripType = "one-way" | "round-trip";
export type TransportationMode = "private" | "public";
export type TripStatus = "pending" | "completed" | "cancelled";

export const EXPENSE_CATEGORIES = [
  "gas",
  "maintenance",
  "insurance",
  "registration",
  "tolls",
  "repairs",
] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export interface FareBreakdown {
  distanceKm: number;
  durationMinutes: number;
  baseFare: number;
  distanceCost: number;
  durationCost: number;
  waitingCost: number;
  additionalFees: number;
  totalFare: number;
}

export interface Service {
  id: string;
  name: ServiceName;
  description: string | null;
  is_active: boolean;
}

export interface Vehicle {
  id: string;
  name: string;
  type: string | null;
  license_plate: string | null;
  fuel_consumption: number | null;
  current_km: number | null;
  status: "active" | "inactive" | "maintenance";
  purchase_date: string | null;
  notes: string | null;
}

export interface Driver {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  base_monthly_salary: number | null;
  overtime_hourly_rate: number | null;
  diet_morning_allowance: number;
  diet_evening_allowance: number;
  status: "active" | "inactive";
  start_date: string | null;
}

export interface Trip {
  id: string;
  date: string;
  time: string;
  service_id: string | null;
  client_name: string | null;
  client_phone: string | null;
  pickup_address: string;
  destination_address: string;
  driver_id: string | null;
  vehicle_id: string | null;
  distance_km: number | null;
  duration_minutes: number | null;
  trip_type: TripType;
  transportation_mode: TransportationMode;
  waiting_hours: number;
  base_fare: number;
  distance_cost: number | null;
  duration_cost: number | null;
  waiting_cost: number;
  additional_fees: number;
  total_fare: number | null;
  status: TripStatus;
  notes: string | null;
  needs_wheelchair: boolean;
  needs_stair_climber: boolean;
}

export interface Client {
  id: string;
  name: string;
  phone: string | null;
  last_service_id: string | null;
  last_service_name: string | null;
  last_total_fare: number | null;
  last_trip_date: string | null;
}

export interface OvertimeEntry {
  id: string;
  driver_id: string;
  date: string;
  hours: number;
  dieta_amount: number;
  elevator_amount: number;
  notes: string | null;
}

export interface UberEarning {
  id: string;
  driver_id: string;
  date: string;
  amount: number;
  notes: string | null;
}

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  vehicle_id: string | null;
  amount: number;
  description: string | null;
  status: "recorded" | "verified";
}
