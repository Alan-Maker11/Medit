import { createClient } from "@/lib/supabase/server";

export interface TripFilters {
  startDate?: string;
  endDate?: string;
  driverId?: string;
  vehicleId?: string;
  status?: string;
  serviceId?: string;
}

export interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  vehicleId?: string;
  category?: string;
}

export async function queryTrips(filters: TripFilters = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("trips")
    .select("*, services(name), drivers(name), vehicles(name)")
    .order("date", { ascending: false });

  if (filters.startDate) query = query.gte("date", filters.startDate);
  if (filters.endDate) query = query.lte("date", filters.endDate);
  if (filters.driverId) query = query.eq("driver_id", filters.driverId);
  if (filters.vehicleId) query = query.eq("vehicle_id", filters.vehicleId);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.serviceId) query = query.eq("service_id", filters.serviceId);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch trips: ${error.message}`);
  return data ?? [];
}

export async function queryExpenses(filters: ExpenseFilters = {}) {
  const supabase = await createClient();
  let query = supabase.from("expenses").select("*").order("date", { ascending: false });

  if (filters.startDate) query = query.gte("date", filters.startDate);
  if (filters.endDate) query = query.lte("date", filters.endDate);
  if (filters.vehicleId) query = query.eq("vehicle_id", filters.vehicleId);
  if (filters.category) query = query.eq("category", filters.category);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch expenses: ${error.message}`);
  return data ?? [];
}

export async function queryVehicles() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("vehicles").select("*").order("name");
  if (error) throw new Error(`Failed to fetch vehicles: ${error.message}`);
  return data ?? [];
}

export async function queryDrivers() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("drivers").select("*").order("name");
  if (error) throw new Error(`Failed to fetch drivers: ${error.message}`);
  return data ?? [];
}

export async function queryServices() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("services").select("*").order("name");
  if (error) throw new Error(`Failed to fetch services: ${error.message}`);
  return data ?? [];
}

interface TripRow {
  total_fare: number | null;
  service_id: string | null;
  vehicle_id: string | null;
  driver_id: string | null;
  services?: { name: string } | null;
  vehicles?: { name: string } | null;
  drivers?: { name: string } | null;
}

interface ExpenseRow {
  amount: number;
  category: string | null;
}

export async function getBusinessMetrics(startDate?: string, endDate?: string) {
  const [trips, expenses, vehicles, drivers] = await Promise.all([
    queryTrips({ startDate, endDate, status: "completed" }) as Promise<TripRow[]>,
    queryExpenses({ startDate, endDate }) as Promise<ExpenseRow[]>,
    queryVehicles(),
    queryDrivers(),
  ]);

  const totalRevenue = trips.reduce((sum, trip) => sum + (trip.total_fare ?? 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount ?? 0), 0);
  const totalTrips = trips.length;
  const totalProfit = totalRevenue - totalExpenses;

  const revenueByService = trips.reduce((acc: Record<string, number>, trip) => {
    const key = trip.services?.name ?? trip.service_id ?? "unknown";
    acc[key] = (acc[key] ?? 0) + (trip.total_fare ?? 0);
    return acc;
  }, {});

  const revenueByVehicle = trips.reduce((acc: Record<string, number>, trip) => {
    const key = trip.vehicles?.name ?? trip.vehicle_id ?? "unknown";
    acc[key] = (acc[key] ?? 0) + (trip.total_fare ?? 0);
    return acc;
  }, {});

  const revenueByDriver = trips.reduce((acc: Record<string, number>, trip) => {
    const key = trip.drivers?.name ?? trip.driver_id ?? "unknown";
    acc[key] = (acc[key] ?? 0) + (trip.total_fare ?? 0);
    return acc;
  }, {});

  const expensesByCategory = expenses.reduce((acc: Record<string, number>, exp) => {
    const key = exp.category ?? "uncategorized";
    acc[key] = (acc[key] ?? 0) + (exp.amount ?? 0);
    return acc;
  }, {});

  return {
    totalRevenue,
    totalExpenses,
    totalProfit,
    profitMargin: totalRevenue > 0 ? Number(((totalProfit / totalRevenue) * 100).toFixed(2)) : 0,
    totalTrips,
    averageFarePerTrip: totalTrips > 0 ? Number((totalRevenue / totalTrips).toFixed(2)) : 0,
    vehicleCount: vehicles.length,
    driverCount: drivers.length,
    revenueByService,
    revenueByVehicle,
    revenueByDriver,
    expensesByCategory,
  };
}
