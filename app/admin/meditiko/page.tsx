import { createClient } from "@/lib/supabase/server";
import MeditikoTripsView from "./MeditikoTripsView";

export default async function MeditikoTripsPage() {
  const supabase = await createClient();
  const [{ data: bookings, error }, { data: drivers }] = await Promise.all([
    supabase.from("meditiko_bookings").select("*, drivers(name)").order("created_at", { ascending: false }),
    supabase.from("drivers").select("id, name").eq("status", "active").order("name", { ascending: true }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-orange-600">⚡ Meditiko Express</h1>
        <p className="text-sm text-zinc-500">Reservas del calculador público — 0 a 7km</p>
      </div>
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          Couldn&apos;t load bookings: {error.message}. This usually means the meditiko_bookings migration hasn&apos;t
          been run yet — check the Supabase SQL Editor.
        </div>
      )}
      <MeditikoTripsView
        bookings={(bookings ?? []) as unknown as Parameters<typeof MeditikoTripsView>[0]["bookings"]}
        drivers={drivers ?? []}
      />
    </div>
  );
}
