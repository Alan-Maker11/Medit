import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import MeditikoTripsView from "./MeditikoTripsView";
import TripsByMonth from "../trips/TripsByMonth";

export default async function MeditikoTripsPage() {
  const supabase = await createClient();

  const { data: meditikoVehicle } = await supabase.from("vehicles").select("id").ilike("name", "Meditiko").maybeSingle();

  let registeredTripsQuery = supabase
    .from("trips")
    .select(
      "id, date, client_name, total_fare, status, needs_wheelchair, needs_stair_climber, services(name), drivers(name), vehicles(name)"
    )
    .order("date", { ascending: false });
  registeredTripsQuery = meditikoVehicle
    ? registeredTripsQuery.eq("vehicle_id", meditikoVehicle.id)
    : registeredTripsQuery.eq("vehicle_id", "00000000-0000-0000-0000-000000000000"); // no Meditiko vehicle yet — show nothing rather than everything

  const [{ data: bookings, error }, { data: drivers }, { data: registeredTrips }] = await Promise.all([
    supabase.from("meditiko_bookings").select("*, drivers(name)").order("created_at", { ascending: false }),
    supabase.from("drivers").select("id, name").eq("status", "active").order("name", { ascending: true }),
    registeredTripsQuery,
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-orange-600">⚡ Meditiko Express</h1>
          <p className="text-sm text-zinc-500">Reservas del calculador público y viajes registrados — 0 a 7km</p>
        </div>
        <Link
          href="/admin/meditiko/trips/new"
          className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
        >
          + Registrar viaje
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          Couldn&apos;t load bookings: {error.message}. This usually means the meditiko_bookings migration hasn&apos;t
          been run yet — check the Supabase SQL Editor.
        </div>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Reservas del calculador público</h2>
        <MeditikoTripsView
          bookings={(bookings ?? []) as unknown as Parameters<typeof MeditikoTripsView>[0]["bookings"]}
          drivers={drivers ?? []}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Viajes registrados manualmente</h2>
        <TripsByMonth trips={(registeredTrips ?? []) as unknown as Parameters<typeof TripsByMonth>[0]["trips"]} />
      </section>
    </div>
  );
}
