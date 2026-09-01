import { createClient } from "@/lib/supabase/server";
import MeditikoExpensesView from "./MeditikoExpensesView";

export default async function MeditikoExpensesPage() {
  const supabase = await createClient();
  const { data: drivers } = await supabase.from("drivers").select("id, name").eq("status", "active").order("name");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-orange-600">⚡ Gastos Meditiko</h1>
        <p className="text-sm text-zinc-500">Gastos de la flota Meditiko, agrupados por semana y mes</p>
      </div>
      <MeditikoExpensesView drivers={drivers ?? []} />
    </div>
  );
}
