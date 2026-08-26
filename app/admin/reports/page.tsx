"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { formatDOP } from "@/lib/fare";
import { currentLocalMonth } from "@/lib/date";

interface DayRow {
  date: string;
  trip_count: number;
  revenue: number;
  expenses: number;
  salary: number;
  net: number;
}

interface MonthlyReport {
  month: string;
  days: DayRow[];
  summary: {
    revenue: number;
    expenses: number;
    salary: number;
    base_salary_total: number;
    salary_extras_total: number;
    profit: number;
    profit_margin: number;
    trip_count: number;
    average_fare: number;
    wheelchair_trip_count: number;
    wheelchair_income: number;
    stair_climber_trip_count: number;
    stair_climber_income: number;
    by_service: Record<string, number>;
    by_driver: Record<string, number>;
    by_vehicle_revenue: Record<string, number>;
    by_expense_category: Record<string, number>;
  };
}

interface PayrollDriver {
  driver_id: string;
  name: string;
  base_salary: number;
  overtime_hours: number;
  overtime_pay: number;
  diet_allowance_total: number;
  elevator_total: number;
  total_compensation: number;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function monthLabel(month: string) {
  const [year, mon] = month.split("-");
  return `${MONTH_NAMES[Number(mon) - 1]} ${year}`;
}

export default function ReportsPage() {
  const [month, setMonth] = useState(currentLocalMonth());
  const [payrollMonth, setPayrollMonth] = useState(currentLocalMonth());
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [payroll, setPayroll] = useState<{ drivers: PayrollDriver[]; grand_total: number } | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [payrollLoading, setPayrollLoading] = useState(false);

  useEffect(() => {
    setReportLoading(true);
    fetch(`/api/reports/monthly?month=${month}`)
      .then((res) => res.json())
      .then((data) => { setReport(data); setReportLoading(false); });
  }, [month]);

  useEffect(() => {
    setPayrollLoading(true);
    fetch(`/api/reports/payroll?month=${payrollMonth}`)
      .then((res) => res.json())
      .then((data) => { setPayroll(data); setPayrollLoading(false); });
  }, [payrollMonth]);

  function exportMonthlyReport() {
    if (!report) return;
    const wb = XLSX.utils.book_new();

    // Day-by-day sheet
    const dayRows = [
      ["Date", "Trips", "Revenue (DOP)", "Expenses (DOP)", "Salary extras (DOP)", "Net (DOP)"],
      ...report.days.map((d) => [d.date, d.trip_count, d.revenue, d.expenses, d.salary, d.net]),
      [],
      ["Base salaries (fixed, not day-specific)", "", "", "", report.summary.base_salary_total, ""],
      [
        "TOTAL",
        report.summary.trip_count,
        report.summary.revenue,
        report.summary.expenses,
        report.summary.salary,
        report.summary.profit,
      ],
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(dayRows), "Daily Breakdown");

    // Summary sheet
    const summary = [
      ["Monthly Report", monthLabel(report.month)],
      [],
      ["Revenue", report.summary.revenue],
      ["Expenses", report.summary.expenses],
      ["Salary (base + overtime + dieta + ascensor)", report.summary.salary],
      ["  Base salaries", report.summary.base_salary_total],
      ["  Overtime/dieta/ascensor", report.summary.salary_extras_total],
      ["Profit", report.summary.profit],
      ["Profit margin %", report.summary.profit_margin],
      ["Total trips", report.summary.trip_count],
      ["Average fare", report.summary.average_fare],
      [],
      ["Wheelchair income", report.summary.wheelchair_income, `${report.summary.wheelchair_trip_count} trips`],
      ["Stair climber income", report.summary.stair_climber_income, `${report.summary.stair_climber_trip_count} trips`],
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summary), "Summary");

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([["Service", "Revenue"], ...Object.entries(report.summary.by_service)]),
      "By Service"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([["Driver", "Revenue"], ...Object.entries(report.summary.by_driver)]),
      "By Driver"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([["Vehicle", "Revenue"], ...Object.entries(report.summary.by_vehicle_revenue)]),
      "By Vehicle"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([["Category", "Expenses"], ...Object.entries(report.summary.by_expense_category)]),
      "Expenses by Category"
    );

    XLSX.writeFile(wb, `medit-monthly-report-${report.month}.xlsx`);
  }

  function exportPayroll() {
    if (!payroll) return;
    const wb = XLSX.utils.book_new();
    const rows = [
      ["Driver", "Base salary", "Overtime hours", "Overtime pay", "Dieta", "Ascensor/Bajador", "Total"],
      ...payroll.drivers.map((d) => [
        d.name,
        d.base_salary,
        d.overtime_hours,
        d.overtime_pay,
        d.diet_allowance_total,
        d.elevator_total,
        d.total_compensation,
      ]),
      [],
      ["Grand total", "", "", "", "", "", payroll.grand_total],
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), "Payroll");
    XLSX.writeFile(wb, `medit-payroll-${payrollMonth}.xlsx`);
  }

  const activeDays = report?.days.filter((d) => d.trip_count > 0 || d.expenses > 0) ?? [];

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Reports</h1>

      {/* Monthly operations report */}
      <section className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Monthly report</h2>
            {report && (
              <p className="text-sm text-zinc-500">{monthLabel(report.month)}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="input"
            />
            <button
              onClick={exportMonthlyReport}
              disabled={!report}
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Export to Excel
            </button>
          </div>
        </div>

        {reportLoading && <p className="text-sm text-zinc-500">Loading…</p>}

        {report && !reportLoading && (
          <>
            {/* KPI summary cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-7">
              <Stat label="Revenue" value={formatDOP(report.summary.revenue)} />
              <Stat label="Expenses" value={formatDOP(report.summary.expenses)} />
              <Stat
                label="Salary"
                value={formatDOP(report.summary.salary)}
                sub={`Base ${formatDOP(report.summary.base_salary_total)} + extras ${formatDOP(report.summary.salary_extras_total)}`}
              />
              <Stat label="Profit" value={formatDOP(report.summary.profit)} highlight={report.summary.profit >= 0} />
              <Stat label="Margin" value={`${report.summary.profit_margin}%`} />
              <Stat label="Trips" value={String(report.summary.trip_count)} />
              <Stat label="Avg fare" value={formatDOP(report.summary.average_fare)} />
            </div>

            {/* Day-by-day table */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Day-by-day breakdown</h3>
              <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 text-left text-xs text-zinc-500 dark:border-zinc-800">
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2 text-right">Trips</th>
                      <th className="px-4 py-2 text-right">Revenue</th>
                      <th className="px-4 py-2 text-right">Expenses</th>
                      <th className="px-4 py-2 text-right">Salary</th>
                      <th className="px-4 py-2 text-right">Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.days.map((day) => (
                      <tr
                        key={day.date}
                        className={`border-b border-zinc-100 dark:border-zinc-800 ${
                          day.trip_count === 0 && day.expenses === 0 && day.salary === 0
                            ? "text-zinc-400 dark:text-zinc-600"
                            : ""
                        }`}
                      >
                        <td className="px-4 py-2">{day.date}</td>
                        <td className="px-4 py-2 text-right">{day.trip_count || "-"}</td>
                        <td className="px-4 py-2 text-right">{day.revenue > 0 ? formatDOP(day.revenue) : "-"}</td>
                        <td className="px-4 py-2 text-right">{day.expenses > 0 ? formatDOP(day.expenses) : "-"}</td>
                        <td className="px-4 py-2 text-right">{day.salary > 0 ? formatDOP(day.salary) : "-"}</td>
                        <td className={`px-4 py-2 text-right font-medium ${
                          day.net > 0 ? "text-green-600 dark:text-green-400" :
                          day.net < 0 ? "text-red-600 dark:text-red-400" : ""
                        }`}>
                          {(day.revenue > 0 || day.expenses > 0 || day.salary > 0) ? formatDOP(day.net) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-zinc-200 text-zinc-500 dark:border-zinc-800">
                      <td className="px-4 py-2" colSpan={4}>Base salaries (fixed, not tied to a specific day)</td>
                      <td className="px-4 py-2 text-right">{formatDOP(report.summary.base_salary_total)}</td>
                      <td className="px-4 py-2"></td>
                    </tr>
                    <tr className="border-t-2 border-zinc-300 bg-zinc-50 font-semibold dark:border-zinc-700 dark:bg-zinc-800">
                      <td className="px-4 py-2">Total</td>
                      <td className="px-4 py-2 text-right">{report.summary.trip_count}</td>
                      <td className="px-4 py-2 text-right">{formatDOP(report.summary.revenue)}</td>
                      <td className="px-4 py-2 text-right">{formatDOP(report.summary.expenses)}</td>
                      <td className="px-4 py-2 text-right">{formatDOP(report.summary.salary)}</td>
                      <td className={`px-4 py-2 text-right ${
                        report.summary.profit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }`}>
                        {formatDOP(report.summary.profit)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Equipment income */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Equipment income</h3>
              <div className="grid grid-cols-2 gap-4 sm:w-1/2">
                <Stat
                  label="Wheelchair"
                  value={formatDOP(report.summary.wheelchair_income)}
                  sub={`${report.summary.wheelchair_trip_count} trip${report.summary.wheelchair_trip_count !== 1 ? "s" : ""}`}
                />
                <Stat
                  label="Stair climber"
                  value={formatDOP(report.summary.stair_climber_income)}
                  sub={`${report.summary.stair_climber_trip_count} trip${report.summary.stair_climber_trip_count !== 1 ? "s" : ""}`}
                />
              </div>
            </div>

            {/* Breakdown tables */}
            <div className="grid gap-6 md:grid-cols-2">
              <BreakdownTable title="Revenue by service" data={report.summary.by_service} />
              <BreakdownTable title="Revenue by driver" data={report.summary.by_driver} />
              <BreakdownTable title="Revenue by vehicle" data={report.summary.by_vehicle_revenue} />
              <BreakdownTable title="Expenses by category" data={report.summary.by_expense_category} />
            </div>
          </>
        )}
      </section>

      {/* Driver payroll */}
      <section className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Driver payroll</h2>
            <p className="text-sm text-zinc-500">Base salary + overtime + dieta + ascensor/bajador</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="month"
              value={payrollMonth}
              onChange={(e) => setPayrollMonth(e.target.value)}
              className="input"
            />
            <button
              onClick={exportPayroll}
              disabled={!payroll}
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Export to Excel
            </button>
          </div>
        </div>

        {payrollLoading && <p className="text-sm text-zinc-500">Loading…</p>}

        {payroll && !payrollLoading && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-xs text-zinc-500 dark:border-zinc-800">
                  <th className="px-3 py-2">Driver</th>
                  <th className="px-3 py-2 text-right">Base</th>
                  <th className="px-3 py-2 text-right">OT hrs</th>
                  <th className="px-3 py-2 text-right">Overtime</th>
                  <th className="px-3 py-2 text-right">Dieta</th>
                  <th className="px-3 py-2 text-right">Ascensor</th>
                  <th className="px-3 py-2 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {payroll.drivers.map((d) => (
                  <tr key={d.driver_id} className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="px-3 py-2 font-medium">{d.name}</td>
                    <td className="px-3 py-2 text-right">{formatDOP(d.base_salary)}</td>
                    <td className="px-3 py-2 text-right">{d.overtime_hours > 0 ? `${d.overtime_hours}h` : "-"}</td>
                    <td className="px-3 py-2 text-right">{d.overtime_pay > 0 ? formatDOP(d.overtime_pay) : "-"}</td>
                    <td className="px-3 py-2 text-right">{d.diet_allowance_total > 0 ? formatDOP(d.diet_allowance_total) : "-"}</td>
                    <td className="px-3 py-2 text-right">{d.elevator_total > 0 ? formatDOP(d.elevator_total) : "-"}</td>
                    <td className="px-3 py-2 text-right font-semibold">{formatDOP(d.total_compensation)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
                  <td className="px-3 py-2 font-semibold" colSpan={6}>Grand total</td>
                  <td className="px-3 py-2 text-right font-semibold">{formatDOP(payroll.grand_total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, highlight, sub }: { label: string; value: string; highlight?: boolean; sub?: string }) {
  return (
    <div className={`rounded-xl p-4 ${highlight ? "bg-green-50 dark:bg-green-950" : "bg-zinc-50 dark:bg-zinc-800"}`}>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className={`text-lg font-bold ${highlight ? "text-green-700 dark:text-green-300" : ""}`}>{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-zinc-400">{sub}</p>}
    </div>
  );
}

function BreakdownTable({ title, data }: { title: string; data: Record<string, number> }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key} className="border-b border-zinc-100 dark:border-zinc-800">
              <td className="py-1 text-zinc-600 dark:text-zinc-400">{key}</td>
              <td className="py-1 text-right font-medium">{formatDOP(value)}</td>
            </tr>
          ))}
          {entries.length === 0 && (
            <tr>
              <td className="py-2 text-zinc-500">No data</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}
