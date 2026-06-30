"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { formatDOP } from "@/lib/fare";
import { todayLocalISO, currentLocalMonth } from "@/lib/date";

interface WeeklyReport {
  period_start: string;
  period_end: string;
  revenue: number;
  expenses: number;
  profit: number;
  profit_margin: number;
  trip_count: number;
  average_fare: number;
  by_service: Record<string, number>;
  by_vehicle_revenue: Record<string, number>;
  by_vehicle_expense: Record<string, number>;
  by_driver: Record<string, number>;
  by_expense_category: Record<string, number>;
}

interface PayrollDriver {
  driver_id: string;
  name: string;
  base_salary: number;
  overtime_hours: number;
  overtime_pay: number;
  diet_allowance_total: number;
  total_compensation: number;
  paid_status: string;
}

export default function ReportsPage() {
  const [weekOf, setWeekOf] = useState(todayLocalISO());
  const [month, setMonth] = useState(currentLocalMonth());
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [payroll, setPayroll] = useState<{ drivers: PayrollDriver[]; grand_total: number } | null>(null);

  useEffect(() => {
    fetch(`/api/reports/weekly?week_of=${weekOf}`)
      .then((res) => res.json())
      .then(setReport);
  }, [weekOf]);

  useEffect(() => {
    fetch(`/api/reports/payroll?month=${month}`)
      .then((res) => res.json())
      .then(setPayroll);
  }, [month]);

  function exportWeeklyReport() {
    if (!report) return;
    const wb = XLSX.utils.book_new();

    const summary = [
      ["Period", `${report.period_start} to ${report.period_end}`],
      ["Revenue", report.revenue],
      ["Expenses", report.expenses],
      ["Profit", report.profit],
      ["Profit margin %", report.profit_margin],
      ["Trips", report.trip_count],
      ["Average fare", report.average_fare],
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summary), "Summary");

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([["Service", "Revenue"], ...Object.entries(report.by_service)]),
      "By Service"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([["Vehicle", "Revenue"], ...Object.entries(report.by_vehicle_revenue)]),
      "Revenue by Vehicle"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([["Vehicle", "Expenses"], ...Object.entries(report.by_vehicle_expense)]),
      "Expenses by Vehicle"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([["Driver", "Revenue"], ...Object.entries(report.by_driver)]),
      "By Driver"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([["Category", "Amount"], ...Object.entries(report.by_expense_category)]),
      "Expenses by Category"
    );

    XLSX.writeFile(wb, `medit-weekly-report-${report.period_start}.xlsx`);
  }

  function exportPayroll() {
    if (!payroll) return;
    const wb = XLSX.utils.book_new();
    const rows = [
      ["Driver", "Base salary", "Overtime hours", "Overtime pay", "Diet allowance", "Total", "Status"],
      ...payroll.drivers.map((d) => [
        d.name,
        d.base_salary,
        d.overtime_hours,
        d.overtime_pay,
        d.diet_allowance_total,
        d.total_compensation,
        d.paid_status,
      ]),
      ["Grand total", "", "", "", "", payroll.grand_total, ""],
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), "Payroll");
    XLSX.writeFile(wb, `medit-payroll-${month}.xlsx`);
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Reports</h1>

      <section className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Weekly report</h2>
          <div className="flex flex-wrap items-center gap-3">
            <input type="date" value={weekOf} onChange={(e) => setWeekOf(e.target.value)} className="input" />
            <button
              onClick={exportWeeklyReport}
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Export to Excel
            </button>
          </div>
        </div>
        {report && (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Stat label="Revenue" value={formatDOP(report.revenue)} />
              <Stat label="Expenses" value={formatDOP(report.expenses)} />
              <Stat label="Profit" value={formatDOP(report.profit)} />
              <Stat label="Margin" value={`${report.profit_margin}%`} />
              <Stat label="Trips" value={String(report.trip_count)} />
              <Stat label="Avg fare" value={formatDOP(report.average_fare)} />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <BreakdownTable title="Revenue by service" data={report.by_service} />
              <BreakdownTable title="Revenue by vehicle" data={report.by_vehicle_revenue} />
              <BreakdownTable title="Revenue by driver" data={report.by_driver} />
              <BreakdownTable title="Expenses by category" data={report.by_expense_category} />
            </div>
          </>
        )}
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Driver payroll</h2>
          <div className="flex flex-wrap items-center gap-3">
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="input" />
            <button
              onClick={exportPayroll}
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Export to Excel
            </button>
          </div>
        </div>
        {payroll && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-800">
                  <th className="px-3 py-2">Driver</th>
                  <th className="px-3 py-2">Base</th>
                  <th className="px-3 py-2">Overtime</th>
                  <th className="px-3 py-2">Diet</th>
                  <th className="px-3 py-2">Total</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {payroll.drivers.map((d) => (
                  <tr key={d.driver_id} className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="px-3 py-2">{d.name}</td>
                    <td className="px-3 py-2">{formatDOP(d.base_salary)}</td>
                    <td className="px-3 py-2">{formatDOP(d.overtime_pay)}</td>
                    <td className="px-3 py-2">{formatDOP(d.diet_allowance_total)}</td>
                    <td className="px-3 py-2 font-medium">{formatDOP(d.total_compensation)}</td>
                    <td className="px-3 py-2 capitalize">{d.paid_status}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="px-3 py-2 font-semibold" colSpan={4}>
                    Grand total
                  </td>
                  <td className="px-3 py-2 font-semibold">{formatDOP(payroll.grand_total)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

function BreakdownTable({ title, data }: { title: string; data: Record<string, number> }) {
  const entries = Object.entries(data);
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
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
  );
}
