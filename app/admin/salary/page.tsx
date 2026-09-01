import { createClient } from "@/lib/supabase/server";
import SalaryView from "./SalaryView";
import MeditikoDriverSalaryView from "./MeditikoDriverSalaryView";
import type { Driver, OvertimeEntry, UberEarning, MeditikoDriverEarning } from "@/lib/types";

export default async function SalaryPage() {
  const supabase = await createClient();
  const [{ data: allDrivers }, { data: entries }, { data: uberEarnings }, { data: meditikoEarnings }] =
    await Promise.all([
      supabase.from("drivers").select("*").eq("status", "active").order("name"),
      supabase.from("overtime_entries").select("*").order("date", { ascending: false }),
      supabase.from("driver_uber_earnings").select("*").order("date", { ascending: false }),
      supabase.from("meditiko_driver_earnings").select("*").order("date", { ascending: false }),
    ]);

  const drivers = ((allDrivers ?? []) as Driver[]).filter((d) => !d.is_meditiko);
  const meditikoDrivers = ((allDrivers ?? []) as Driver[]).filter((d) => d.is_meditiko);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Salary</h1>
        <p className="text-sm text-zinc-500">
          Base salary, overtime hours, and dieta per driver. Add an entry for each overtime day and the
          total updates automatically.
        </p>
      </div>
      <SalaryView
        drivers={drivers}
        entries={(entries ?? []) as OvertimeEntry[]}
        uberEarnings={(uberEarnings ?? []) as UberEarning[]}
      />

      {meditikoDrivers.length > 0 && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold text-orange-600">⚡ Conductores Meditiko</h2>
            <p className="text-sm text-zinc-500">
              Salario base + 20% de comisión por cliente contratado. Estructura totalmente distinta al resto —
              el conductor solo ve su tasa y salario base, nunca los montos calculados.
            </p>
          </div>
          <MeditikoDriverSalaryView
            drivers={meditikoDrivers}
            earnings={(meditikoEarnings ?? []) as MeditikoDriverEarning[]}
          />
        </div>
      )}
    </div>
  );
}
