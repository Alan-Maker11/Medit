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

export const PAYMENT_METHODS = ["Banreservas - 7314", "Popular - 4389", "BHD - 0021", "Cash", "Check"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type AdvancePaymentStatus = "pending" | "received";
export type FinalPaymentStatus = "pending" | "received" | "collected";

export const WITHDRAWAL_ACCOUNTS = ["Banreservas - 7314", "Popular - 4389", "BHD - 0021", "Cash on hand", "Check"] as const;
export type WithdrawalAccount = (typeof WITHDRAWAL_ACCOUNTS)[number];
export const WITHDRAWAL_METHODS = ["ATM", "Transfer", "Cash payment", "Direct deposit", "Check"] as const;
export type WithdrawalMethod = (typeof WITHDRAWAL_METHODS)[number];

export const BANK_ACCOUNTS = ["Banreservas - 7314", "Popular - 4389", "BHD - 0021"] as const;
export type BankAccount = (typeof BANK_ACCOUNTS)[number];
export const CASH_HANDOFF_USES = ["gas", "salary", "bank_deposit", "other"] as const;
export type CashHandoffUse = (typeof CASH_HANDOFF_USES)[number];

export interface DriverCashHandoff {
  id: string;
  driver_id: string;
  date: string;
  amount: number;
  used_for: CashHandoffUse;
  bank_account: BankAccount | null;
  notes: string | null;
}

export const MEDITIKO_EXPENSE_CATEGORIES = ["storage", "gas", "maintenance", "insurance", "tolls", "other"] as const;
export type MeditikoExpenseCategory = (typeof MEDITIKO_EXPENSE_CATEGORIES)[number];

export type MeditikoBookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface MeditikoBooking {
  id: string;
  passenger_name: string;
  passenger_phone: string;
  pickup_address: string;
  destination_address: string;
  trip_distance_km: number;
  estimated_duration_minutes: number;
  trip_type: "one_way" | "round_trip";
  waiting_hours: number;
  estimated_price: number;
  assigned_driver_id: string | null;
  status: MeditikoBookingStatus;
  notes: string | null;
  created_at: string;
  drivers?: { name: string } | null;
}

export interface MeditikoExpense {
  id: string;
  date: string;
  category: MeditikoExpenseCategory;
  description: string;
  amount: number;
  driver_id: string | null;
  notes: string | null;
}

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
  is_meditiko: boolean;
}

export interface MeditikoDriverEarning {
  id: string;
  driver_id: string;
  client_name: string;
  date: string;
  gross_amount: number;
  amount: number; // driver's commission, computed from gross_amount
  notes: string | null;
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
  advance_payment_amount: number | null;
  advance_payment_method: PaymentMethod | null;
  advance_payment_status: AdvancePaymentStatus;
  advance_payment_date: string | null;
  final_payment_amount: number | null;
  final_payment_method: PaymentMethod | null;
  final_payment_status: FinalPaymentStatus;
  final_payment_date: string | null;
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
  gross_amount: number;
  amount: number; // driver's commission, computed from gross_amount
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
  withdrawal_account: WithdrawalAccount | null;
  withdrawal_method: WithdrawalMethod | null;
  driver_id: string | null;
}
