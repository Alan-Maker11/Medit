"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentDriver, getDriverTodayTrips, driverLogout, type DriverSession } from "@/lib/driver-auth";
import DriverCalendar from "@/components/driver/DriverCalendar";
import TodayTrips from "@/components/driver/TodayTrips";

interface TripRow {
  id: string;
  time: string;
  client_name: string | null;
  status: string;
  services: { name: string } | null;
}

export default function DriverDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<DriverSession | null>(null);
  const [todayTrips, setTodayTrips] = useState<TripRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    (async () => {
      try {
        const current = await getCurrentDriver();
        if (!current) {
          router.push("/driver/login");
          return;
        }
        setSession(current);
        const trips = await getDriverTodayTrips(current.driver.id);
        setTodayTrips(trips as unknown as TripRow[]);
      } catch {
        setError("No se pudieron cargar tus datos");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function handleLogout() {
    await driverLogout();
    router.push("/driver/login");
    router.refresh();
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">Cargando...</div>;
  }

  if (error || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <p className="mb-4 text-red-600">{error ?? "No se pudieron cargar los datos"}</p>
          <button
            onClick={() => router.push("/driver/login")}
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Volver a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:py-6">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">Bienvenido, {session.driver.name}</h1>
            <p className="text-sm text-zinc-500">Portal del Conductor Medit</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/driver/salary")}
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-transform duration-150 ease-out hover:bg-blue-700 active:scale-[0.98]"
            >
              Mi Salario
            </button>
            <button
              onClick={handleLogout}
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-transform duration-150 ease-out hover:bg-red-700 active:scale-[0.98]"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DriverCalendar driverId={session.driver.id} selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth} />
          </div>
          <div>
            <TodayTrips trips={todayTrips} />
          </div>
        </div>
      </main>
    </div>
  );
}
