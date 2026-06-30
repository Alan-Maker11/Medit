import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDOP } from "@/lib/fare";

export default async function VehiclesPage() {
  const supabase = await createClient();
  const { data: vehicles } = await supabase.from("vehicles").select("*").order("name");

  const cards = await Promise.all(
    (vehicles ?? []).map(async (vehicle) => {
      const [{ data: trips }, { data: expenses }] = await Promise.all([
        supabase.from("trips").select("total_fare").eq("vehicle_id", vehicle.id),
        supabase.from("expenses").select("amount").eq("vehicle_id", vehicle.id),
      ]);
      const revenue = (trips ?? []).reduce((sum, t) => sum + (t.total_fare ?? 0), 0);
      const expenseTotal = (expenses ?? []).reduce((sum, e) => sum + (e.amount ?? 0), 0);
      return { vehicle, tripCount: trips?.length ?? 0, revenue, expenseTotal };
    })
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Vehicles</h1>
        <Link
          href="/admin/vehicles/new"
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Add vehicle
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ vehicle, tripCount, revenue, expenseTotal }) => (
          <div
            key={vehicle.id}
            className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">{vehicle.name}</h3>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs capitalize dark:bg-zinc-800">
                  {vehicle.status}
                </span>
                <Link
                  href={`/admin/vehicles/${vehicle.id}/edit`}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  Edit
                </Link>
              </div>
            </div>
            <p className="text-sm text-zinc-500">{vehicle.type ?? "-"} · {vehicle.license_plate ?? "no plate"}</p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-zinc-500">Trips</p>
                <p className="font-medium">{tripCount}</p>
              </div>
              <div>
                <p className="text-zinc-500">Revenue</p>
                <p className="font-medium">{formatDOP(revenue)}</p>
              </div>
              <div>
                <p className="text-zinc-500">Expenses</p>
                <p className="font-medium">{formatDOP(expenseTotal)}</p>
              </div>
            </div>
          </div>
        ))}
        {cards.length === 0 && <p className="text-zinc-500">No vehicles yet.</p>}
      </div>
    </div>
  );
}
