import { createClient } from "@/lib/supabase/server";
import { formatDOP } from "@/lib/fare";
import { startOfWeek, endOfWeek, formatISO } from "date-fns";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const weekStart = formatISO(startOfWeek(new Date()), { representation: "date" });
  const weekEnd = formatISO(endOfWeek(new Date()), { representation: "date" });

  const [{ data: trips }, { data: expenses }, { data: uberEarnings }, { data: drivers }] = await Promise.all([
    supabase.from("trips").select("total_fare, status").gte("date", weekStart).lte("date", weekEnd),
    supabase.from("expenses").select("amount").gte("date", weekStart).lte("date", weekEnd),
    supabase.from("driver_uber_earnings").select("driver_id, amount, date").gte("date", weekStart).lte("date", weekEnd),
    supabase.from("drivers").select("id, name"),
  ]);

  const revenue = (trips ?? []).reduce((sum, t) => sum + (t.total_fare ?? 0), 0);
  const expenseTotal = (expenses ?? []).reduce((sum, e) => sum + (e.amount ?? 0), 0);
  const profit = revenue - expenseTotal;
  const tripCount = trips?.length ?? 0;

  const driverNameById = new Map((drivers ?? []).map((d) => [d.id, d.name]));
  const uberByDriver = new Map<string, { name: string; total: number; days: number }>();
  for (const e of uberEarnings ?? []) {
    const acc = uberByDriver.get(e.driver_id) ?? { name: driverNameById.get(e.driver_id) ?? "Unknown", total: 0, days: 0 };
    acc.total += e.amount ?? 0;
    acc.days += 1;
    uberByDriver.set(e.driver_id, acc);
  }
  const uberTotal = [...uberByDriver.values()].reduce((sum, d) => sum + d.total, 0);
  const combinedTotal = revenue + uberTotal;

  const stats = [
    { label: "Weekly revenue", value: formatDOP(revenue) },
    { label: "Weekly expenses", value: formatDOP(expenseTotal) },
    { label: "Weekly profit", value: formatDOP(profit) },
    { label: "Trips this week", value: String(tripCount) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-sm text-zinc-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30">
          <p className="text-sm text-blue-700 dark:text-blue-300">Medit earnings (week)</p>
          <p className="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-200">{formatDOP(revenue)}</p>
          <p className="mt-1 text-xs text-blue-700/70 dark:text-blue-300/70">{tripCount} trips</p>
        </div>
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-900 dark:bg-orange-950/30">
          <p className="text-sm text-orange-700 dark:text-orange-300">Uber earnings (week)</p>
          <p className="mt-1 text-2xl font-bold text-orange-900 dark:text-orange-200">{formatDOP(uberTotal)}</p>
          <p className="mt-1 text-xs text-orange-700/70 dark:text-orange-300/70">{uberByDriver.size} driver{uberByDriver.size !== 1 ? "s" : ""}</p>
        </div>
        <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-500 to-green-600 p-5 text-white">
          <p className="text-sm text-green-50">Combined weekly total</p>
          <p className="mt-1 text-2xl font-bold">{formatDOP(combinedTotal)}</p>
          <p className="mt-1 text-xs text-green-50/80">{weekStart} to {weekEnd}</p>
        </div>
      </div>

      {uberByDriver.size > 0 && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-5 dark:border-orange-900 dark:bg-orange-950/10">
          <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Uber breakdown by driver</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[...uberByDriver.entries()].map(([driverId, d]) => (
              <div key={driverId} className="rounded-xl bg-white p-3 dark:bg-zinc-900">
                <p className="text-xs text-zinc-500">{d.name}</p>
                <p className="text-lg font-bold text-orange-600">{formatDOP(d.total)}</p>
                <p className="text-xs text-zinc-500">{d.days} day{d.days !== 1 ? "s" : ""}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
