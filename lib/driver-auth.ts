import { createClient } from "@/lib/supabase/client";
import type { Driver } from "@/lib/types";

export interface DriverAccount {
  id: string;
  user_id: string;
  driver_id: string;
  status: "active" | "inactive" | "on_leave";
}

export interface DriverSession {
  driverAccount: DriverAccount;
  driver: Driver;
}

export async function driverLogin(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error("Login failed");

  const { data: driverAccount, error: driverError } = await supabase
    .from("driver_accounts")
    .select("*, drivers(*)")
    .eq("user_id", data.user.id)
    .single();

  if (driverError || !driverAccount) {
    await supabase.auth.signOut();
    throw new Error("This account is not set up as a driver. Contact your manager.");
  }

  return {
    driverAccount: driverAccount as unknown as DriverAccount,
    driver: driverAccount.drivers as unknown as Driver,
  };
}

export async function driverLogout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentDriver(): Promise<DriverSession | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: driverAccount, error } = await supabase
    .from("driver_accounts")
    .select("*, drivers(*)")
    .eq("user_id", user.id)
    .single();

  if (error || !driverAccount) return null;

  return {
    driverAccount: driverAccount as unknown as DriverAccount,
    driver: driverAccount.drivers as unknown as Driver,
  };
}

const TRIP_SELECT = "*, services(name), drivers(name), vehicles(name)";

export async function getDriverTripsForDate(driverId: string, date: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("trips")
    .select(TRIP_SELECT)
    .eq("driver_id", driverId)
    .eq("date", date)
    .order("time", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getDriverTodayTrips(driverId: string) {
  const today = new Date().toISOString().slice(0, 10);
  return getDriverTripsForDate(driverId, today);
}

/** month format: "2026-07" */
export async function getDriverMonthTrips(driverId: string, month: string) {
  const supabase = createClient();
  const [year, mon] = month.split("-").map(Number);
  const nextMonth = mon === 12 ? `${year + 1}-01-01` : `${year}-${String(mon + 1).padStart(2, "0")}-01`;
  const { data, error } = await supabase
    .from("trips")
    .select(TRIP_SELECT)
    .eq("driver_id", driverId)
    .gte("date", `${month}-01`)
    .lt("date", nextMonth)
    .order("date", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getTripDetails(tripId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("trips").select(TRIP_SELECT).eq("id", tripId).single();
  if (error) throw error;
  return data;
}
