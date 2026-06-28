import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDOP } from "@/lib/fare";

export default async function ExpensesPage() {
  const supabase = await createClient();
  const { data: expenses } = await supabase
    .from("expenses")
    .select("id, date, category, amount, km_at_fill, vehicle_id, description, vehicles(name)")
    .order("date", { ascending: false })
    .limit(100);

  const total = (expenses ?? []).reduce((sum, e) => sum + (e.amount ?? 0), 0);

  // km/tank = km since the previous gas fill-up for the same vehicle
  const kmPerTankById = new Map<string, number | null>();
  const gasByVehicle = new Map<string, { id: string; date: string; km_at_fill: number | null }[]>();
  for (const e of expenses ?? []) {
    if (e.category !== "gas" || e.km_at_fill == null || !e.vehicle_id) continue;
    const list = gasByVehicle.get(e.vehicle_id) ?? [];
    list.push({ id: e.id, date: e.date, km_at_fill: e.km_at_fill });
    gasByVehicle.set(e.vehicle_id, list);
  }
  for (const list of gasByVehicle.values()) {
    list.sort((a, b) => a.date.localeCompare(b.date));
    list.forEach((entry, i) => {
      const prev = list[i - 1];
      kmPerTankById.set(entry.id, prev ? (entry.km_at_fill ?? 0) - (prev.km_at_fill ?? 0) : entry.km_at_fill);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <Link
          href="/admin/expenses/new"
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Log new expense
        </Link>
      </div>
      <p className="text-sm text-zinc-500">Total shown: {formatDOP(total)}</p>
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-800">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Km</th>
              <th className="px-4 py-3">Km/tank</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {(expenses ?? []).map((expense) => (
              <tr key={expense.id} className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="px-4 py-3">{expense.date}</td>
                <td className="px-4 py-3 capitalize">{expense.category}</td>
                <td className="px-4 py-3">{(expense.vehicles as unknown as { name: string } | null)?.name ?? "-"}</td>
                <td className="px-4 py-3">{formatDOP(expense.amount)}</td>
                <td className="px-4 py-3">{expense.km_at_fill ?? "-"}</td>
                <td className="px-4 py-3">{kmPerTankById.get(expense.id) ?? "-"}</td>
                <td className="px-4 py-3">{expense.description ?? "-"}</td>
              </tr>
            ))}
            {(!expenses || expenses.length === 0) && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-zinc-500">
                  No expenses logged yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
