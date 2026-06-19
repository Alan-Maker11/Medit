import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDOP } from "@/lib/fare";

export default async function DriversPage() {
  const supabase = await createClient();
  const { data: drivers } = await supabase.from("drivers").select("*").order("name");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Drivers</h1>
        <Link
          href="/admin/drivers/new"
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Add driver
        </Link>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-800">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Base salary</th>
              <th className="px-4 py-3">Overtime rate</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(drivers ?? []).map((driver) => (
              <tr key={driver.id} className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="px-4 py-3">{driver.name}</td>
                <td className="px-4 py-3">{driver.phone ?? "-"}</td>
                <td className="px-4 py-3">
                  {driver.base_monthly_salary ? formatDOP(driver.base_monthly_salary) : "-"}
                </td>
                <td className="px-4 py-3">
                  {driver.overtime_hourly_rate ? formatDOP(driver.overtime_hourly_rate) + "/hr" : "-"}
                </td>
                <td className="px-4 py-3 capitalize">{driver.status}</td>
              </tr>
            ))}
            {(!drivers || drivers.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-zinc-500">
                  No drivers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
