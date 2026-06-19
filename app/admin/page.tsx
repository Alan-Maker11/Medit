import { createClient } from "@/lib/supabase/server";
import { formatDOP } from "@/lib/fare";
import { startOfWeek, endOfWeek, formatISO } from "date-fns";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const weekStart = formatISO(startOfWeek(new Date()), { representation: "date" });
  const weekEnd = formatISO(endOfWeek(new Date()), { representation: "date" });

  const [{ data: trips }, { data: expenses }] = await Promise.all([
    supabase.from("trips").select("total_fare, status").gte("date", weekStart).lte("date", weekEnd),
    supabase.from("expenses").select("amount").gte("date", weekStart).lte("date", weekEnd),
  ]);

  const revenue = (trips ?? []).reduce((sum, t) => sum + (t.total_fare ?? 0), 0);
  const expenseTotal = (expenses ?? []).reduce((sum, e) => sum + (e.amount ?? 0), 0);
  const profit = revenue - expenseTotal;
  const tripCount = trips?.length ?? 0;

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
    </div>
  );
}
