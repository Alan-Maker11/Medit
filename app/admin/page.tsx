import { createClient } from "@/lib/supabase/server";
import { formatDOP } from "@/lib/fare";
import { startOfWeek, endOfWeek, startOfMonth, formatISO } from "date-fns";

interface PaymentTrip {
  advance_payment_amount: number | null;
  advance_payment_method: string | null;
  advance_payment_status: string | null;
  final_payment_amount: number | null;
  final_payment_method: string | null;
  final_payment_status: string | null;
}

/** Sums trip advance/final payments actually received, grouped by account/method; also totals what's still pending. */
function accountBreakdown(trips: PaymentTrip[] | null) {
  const byAccount = new Map<string, number>();
  let pending = 0;
  for (const t of trips ?? []) {
    if (t.advance_payment_status === "received" && t.advance_payment_method) {
      byAccount.set(t.advance_payment_method, (byAccount.get(t.advance_payment_method) ?? 0) + (t.advance_payment_amount ?? 0));
    } else if (t.advance_payment_status === "pending") {
      pending += t.advance_payment_amount ?? 0;
    }
    if ((t.final_payment_status === "received" || t.final_payment_status === "collected") && t.final_payment_method) {
      byAccount.set(t.final_payment_method, (byAccount.get(t.final_payment_method) ?? 0) + (t.final_payment_amount ?? 0));
    } else if (t.final_payment_status === "pending") {
      pending += t.final_payment_amount ?? 0;
    }
  }
  return { byAccount, pending };
}

export default async function AdminDashboard() {
  const supabase = await createClient();
  const weekStart = formatISO(startOfWeek(new Date()), { representation: "date" });
  const weekEnd = formatISO(endOfWeek(new Date()), { representation: "date" });
  const monthStart = formatISO(startOfMonth(new Date()), { representation: "date" });
  const today = formatISO(new Date(), { representation: "date" });

  const [
    { data: meditikoVehicle },
    { data: weekTrips },
    { data: weekExpenses },
    { data: weekMeditikoExpenses },
    { data: uberEarnings },
    { data: drivers },
    { data: monthTrips },
    { data: monthExpenses },
    { data: monthMeditikoExpenses },
  ] = await Promise.all([
    supabase.from("vehicles").select("id").ilike("name", "Meditiko").maybeSingle(),
    supabase
      .from("trips")
      .select(
        "total_fare, status, vehicle_id, advance_payment_amount, advance_payment_method, advance_payment_status, final_payment_amount, final_payment_method, final_payment_status"
      )
      .gte("date", weekStart)
      .lte("date", weekEnd),
    supabase.from("expenses").select("amount, withdrawal_account").gte("date", weekStart).lte("date", weekEnd),
    supabase.from("meditiko_expenses").select("amount").gte("date", weekStart).lte("date", weekEnd),
    supabase.from("driver_uber_earnings").select("driver_id, gross_amount, amount, date").gte("date", weekStart).lte("date", weekEnd),
    supabase.from("drivers").select("id, name"),
    supabase.from("trips").select("total_fare, status, vehicle_id").gte("date", monthStart).lte("date", today),
    supabase.from("expenses").select("amount").gte("date", monthStart).lte("date", today),
    supabase.from("meditiko_expenses").select("amount").gte("date", monthStart).lte("date", today),
  ]);

  const meditikoVehicleId = meditikoVehicle?.id ?? null;

  const splitRevenue = (trips: { total_fare: number | null; vehicle_id: string | null }[] | null) => {
    let medit = 0;
    let meditiko = 0;
    for (const t of trips ?? []) {
      if (meditikoVehicleId && t.vehicle_id === meditikoVehicleId) meditiko += t.total_fare ?? 0;
      else medit += t.total_fare ?? 0;
    }
    return { medit, meditiko, total: medit + meditiko };
  };

  const weekRevenue = splitRevenue(weekTrips);
  const weekExpenseTotal = (weekExpenses ?? []).reduce((sum, e) => sum + (e.amount ?? 0), 0);
  const weekMeditikoExpenseTotal = (weekMeditikoExpenses ?? []).reduce((sum, e) => sum + (e.amount ?? 0), 0);
  const weekCombinedExpenses = weekExpenseTotal + weekMeditikoExpenseTotal;
  const profit = weekRevenue.medit - weekExpenseTotal;
  const meditikoProfit = weekRevenue.meditiko - weekMeditikoExpenseTotal;
  const tripCount = weekTrips?.length ?? 0;

  // Medit's Uber income is the day's whole take minus the driver's 20% commission (their cut),
  // not the driver's commission itself — that part belongs to the driver, not to Medit.
  const driverNameById = new Map((drivers ?? []).map((d) => [d.id, d.name]));
  const uberByDriver = new Map<string, { name: string; gross: number; driverCommission: number; days: number }>();
  for (const e of uberEarnings ?? []) {
    const acc = uberByDriver.get(e.driver_id) ?? { name: driverNameById.get(e.driver_id) ?? "Unknown", gross: 0, driverCommission: 0, days: 0 };
    acc.gross += e.gross_amount ?? 0;
    acc.driverCommission += e.amount ?? 0;
    acc.days += 1;
    uberByDriver.set(e.driver_id, acc);
  }
  const uberGrossTotal = [...uberByDriver.values()].reduce((sum, d) => sum + d.gross, 0);
  const uberDriverCommissionTotal = [...uberByDriver.values()].reduce((sum, d) => sum + d.driverCommission, 0);
  const uberMeditIncome = uberGrossTotal - uberDriverCommissionTotal;
  const combinedWeeklyRevenue = weekRevenue.total + uberMeditIncome;
  const combinedWeeklyTotal = combinedWeeklyRevenue - weekCombinedExpenses;

  const monthRevenue = splitRevenue(monthTrips);
  const monthExpenseTotal = (monthExpenses ?? []).reduce((sum, e) => sum + (e.amount ?? 0), 0);
  const monthMeditikoExpenseTotal = (monthMeditikoExpenses ?? []).reduce((sum, e) => sum + (e.amount ?? 0), 0);
  const monthToDateIncomeAfterExpenses =
    monthRevenue.total - monthExpenseTotal - monthMeditikoExpenseTotal;

  const { byAccount: weekByAccount, pending: weekPendingPayments } = accountBreakdown(weekTrips as PaymentTrip[] | null);
  const weekAccountTotal = [...weekByAccount.values()].reduce((sum, v) => sum + v, 0);
  const expensesByAccount = new Map<string, number>();
  for (const e of weekExpenses ?? []) {
    const key = e.withdrawal_account ?? "Unspecified";
    expensesByAccount.set(key, (expensesByAccount.get(key) ?? 0) + (e.amount ?? 0));
  }

  const stats = [
    { label: "Weekly revenue", value: formatDOP(weekRevenue.total) },
    { label: "Weekly expenses", value: formatDOP(weekCombinedExpenses) },
    { label: "Weekly profit", value: formatDOP(profit + meditikoProfit) },
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
          <p className="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-200">{formatDOP(weekRevenue.medit)}</p>
          <p className="mt-1 text-xs text-blue-700/70 dark:text-blue-300/70">
            {formatDOP(weekExpenseTotal)} expenses · {formatDOP(profit)} profit
          </p>
        </div>
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-900 dark:bg-orange-950/30">
          <p className="text-sm text-orange-700 dark:text-orange-300">Uber income — Medit's cut (week)</p>
          <p className="mt-1 text-2xl font-bold text-orange-900 dark:text-orange-200">{formatDOP(uberMeditIncome)}</p>
          <p className="mt-1 text-xs text-orange-700/70 dark:text-orange-300/70">
            {formatDOP(uberGrossTotal)} gross − {formatDOP(uberDriverCommissionTotal)} driver commission
          </p>
        </div>
        <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-500 to-green-600 p-5 text-white">
          <p className="text-sm text-green-50">Combined weekly total (after expenses)</p>
          <p className="mt-1 text-2xl font-bold">{formatDOP(combinedWeeklyTotal)}</p>
          <p className="mt-1 text-xs text-green-50/80">{weekStart} to {weekEnd}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-900 dark:bg-amber-950/10">
        <h3 className="mb-3 text-sm font-semibold text-amber-800 dark:text-amber-300">⚡ Meditiko (week)</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-white p-3 dark:bg-zinc-900">
            <p className="text-xs text-zinc-500">Revenue</p>
            <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{formatDOP(weekRevenue.meditiko)}</p>
          </div>
          <div className="rounded-xl bg-white p-3 dark:bg-zinc-900">
            <p className="text-xs text-zinc-500">Expenses</p>
            <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{formatDOP(weekMeditikoExpenseTotal)}</p>
          </div>
          <div className="rounded-xl bg-white p-3 dark:bg-zinc-900">
            <p className="text-xs text-zinc-500">Profit</p>
            <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{formatDOP(meditikoProfit)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Payments received by account (week)</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[...weekByAccount.entries()].map(([account, amount]) => (
            <div key={account} className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800">
              <p className="text-xs text-zinc-500">{account}</p>
              <p className="text-lg font-bold">{formatDOP(amount)}</p>
              <p className="text-xs text-zinc-500">{weekAccountTotal > 0 ? Math.round((amount / weekAccountTotal) * 100) : 0}%</p>
            </div>
          ))}
          {weekPendingPayments > 0 && (
            <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-950/30">
              <p className="text-xs text-amber-700 dark:text-amber-300">Pending collection</p>
              <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{formatDOP(weekPendingPayments)}</p>
            </div>
          )}
          {weekByAccount.size === 0 && weekPendingPayments === 0 && (
            <p className="col-span-full text-sm text-zinc-500">No payments logged with an account/method yet this week.</p>
          )}
        </div>
        {expensesByAccount.size > 0 && (
          <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Expenses withdrawn by account (week)</h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[...expensesByAccount.entries()].map(([account, amount]) => (
                <div key={account} className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800">
                  <p className="text-xs text-zinc-500">{account}</p>
                  <p className="text-lg font-bold">{formatDOP(amount)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-500 to-purple-600 p-5 text-white">
        <p className="text-sm text-purple-50">Month so far — total income after expenses</p>
        <p className="mt-1 text-2xl font-bold">{formatDOP(monthToDateIncomeAfterExpenses)}</p>
        <p className="mt-1 text-xs text-purple-50/80">
          {monthStart} to {today} · {formatDOP(monthRevenue.medit)} Medit + {formatDOP(monthRevenue.meditiko)} Meditiko revenue −{" "}
          {formatDOP(monthExpenseTotal)} Medit expenses − {formatDOP(monthMeditikoExpenseTotal)} Meditiko expenses
        </p>
      </div>

      {uberByDriver.size > 0 && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-5 dark:border-orange-900 dark:bg-orange-950/10">
          <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Uber breakdown by driver — Medit's cut</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[...uberByDriver.entries()].map(([driverId, d]) => (
              <div key={driverId} className="rounded-xl bg-white p-3 dark:bg-zinc-900">
                <p className="text-xs text-zinc-500">{d.name}</p>
                <p className="text-lg font-bold text-orange-600">{formatDOP(d.gross - d.driverCommission)}</p>
                <p className="text-xs text-zinc-500">
                  {formatDOP(d.gross)} gross · {d.days} day{d.days !== 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
