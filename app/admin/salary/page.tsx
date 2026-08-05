import { createClient } from "@/lib/supabase/server";
import SalaryView from "./SalaryView";
import type { Driver, OvertimeEntry } from "@/lib/types";

export default async function SalaryPage() {
  const supabase = await createClient();
  const [{ data: drivers }, { data: entries }] = await Promise.all([
    supabase.from("drivers").select("*").eq("status", "active").order("name"),
    supabase.from("overtime_entries").select("*").order("date", { ascending: false }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Salary</h1>
      <p className="text-sm text-zinc-500">
        Base salary, overtime hours, and dieta per driver. Add an entry for each overtime day and the
        total updates automatically.
      </p>
      <SalaryView drivers={(drivers ?? []) as Driver[]} entries={(entries ?? []) as OvertimeEntry[]} />
    </div>
  );
}
