import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDOP } from "@/lib/fare";
import DeleteExpenseButton from "./DeleteExpenseButton";

export default async function ExpensesPage() {
  const supabase = await createClient();
  const [{ data: expenses }, { data: vehicles }] = await Promise.all([
    supabase
      .from("expenses")
      .select("id, date, category, amount, km_at_fill, vehicle_id, description, vehicles(name)")
      .order("date", { ascending: false })
      .limit(300),
    supabase.from("vehicles").select("id, name").order("name", { ascending: true }),
  ]);

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

  // Every expense is allocated to the box of the vehicle it was logged against.
  const expensesByVehicle = new Map<string, typeof expenses>();
  const unassigned: typeof expenses = [];
  for (const e of expenses ?? []) {
    if (!e.vehicle_id) {
      unassigned.push(e);
      continue;
    }
    const list = expensesByVehicle.get(e.vehicle_id) ?? [];
    list.push(e);
    expensesByVehicle.set(e.vehicle_id, list);
  }

  const vehicleGroups = (vehicles ?? [])
    .map((v) => ({ id: v.id, name: v.name, expenses: expensesByVehicle.get(v.id) ?? [] }))
    .filter((g) => g.expenses.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <Link
          href="/admin/expenses/new"
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Log new expense
        </Link>
      </div>
      <p className="text-sm text-zinc-500">Total shown: {formatDOP(total)}</p>

      <div className="flex flex-col gap-6">
        {vehicleGroups.map((group) => (
          <ExpenseBox key={group.id} title={group.name} expenses={group.expenses} kmPerTankById={kmPerTankById} />
        ))}
        {unassigned.length > 0 && (
          <ExpenseBox title="Unassigned" expenses={unassigned} kmPerTankById={kmPerTankById} />
        )}
        {vehicleGroups.length === 0 && unassigned.length === 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
            No expenses logged yet.
          </div>
        )}
      </div>
    </div>
  );
}

interface ExpenseRow {
  id: string;
  date: string;
  category: string;
  amount: number;
  km_at_fill: number | null;
  description: string | null;
}

/** Monday-start week key + label for a "YYYY-MM-DD" date string. */
function weekOf(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (x: Date) => x.toISOString().slice(0, 10);
  return { key: fmt(monday), start: fmt(monday), end: fmt(sunday) };
}

function ExpenseBox({
  title,
  expenses,
  kmPerTankById,
}: {
  title: string;
  expenses: ExpenseRow[];
  kmPerTankById: Map<string, number | null>;
}) {
  const vehicleTotal = expenses.reduce((sum, e) => sum + (e.amount ?? 0), 0);

  const weekMap = new Map<string, { start: string; end: string; expenses: ExpenseRow[] }>();
  for (const expense of expenses) {
    const { key, start, end } = weekOf(expense.date);
    const bucket = weekMap.get(key) ?? { start, end, expenses: [] };
    bucket.expenses.push(expense);
    weekMap.set(key, bucket);
  }
  const weeks = [...weekMap.entries()].sort((a, b) => b[0].localeCompare(a[0]));

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-zinc-500">
          {expenses.length} expense{expenses.length !== 1 ? "s" : ""} · Total{" "}
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatDOP(vehicleTotal)}</span>
        </p>
      </div>
      <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
        {weeks.map(([key, week], i) => {
          const weekTotal = week.expenses.reduce((sum, e) => sum + (e.amount ?? 0), 0);
          return (
            <details key={key} open={i === 0}>
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2 px-6 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {week.start} — {week.end}
                </span>
                <span className="flex items-center gap-3 text-sm text-zinc-500">
                  <span>{week.expenses.length} expense{week.expenses.length !== 1 ? "s" : ""}</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatDOP(weekTotal)}</span>
                </span>
              </summary>
              <div className="overflow-x-auto border-t border-zinc-100 dark:border-zinc-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-800">
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Km</th>
                      <th className="px-4 py-3">Km/tank</th>
                      <th className="px-4 py-3">Notes</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {week.expenses.map((expense) => (
                      <tr key={expense.id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800">
                        <td className="px-4 py-3">{expense.date}</td>
                        <td className="px-4 py-3 capitalize">{expense.category}</td>
                        <td className="px-4 py-3">{formatDOP(expense.amount)}</td>
                        <td className="px-4 py-3">{expense.km_at_fill ?? "-"}</td>
                        <td className="px-4 py-3">{kmPerTankById.get(expense.id) ?? "-"}</td>
                        <td className="px-4 py-3">{expense.description ?? "-"}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Link href={`/admin/expenses/${expense.id}/edit`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                              Edit
                            </Link>
                            <DeleteExpenseButton id={expense.id} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
