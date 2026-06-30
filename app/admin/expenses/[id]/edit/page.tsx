import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditExpenseForm from "./EditExpenseForm";

export default async function EditExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: expense } = await supabase.from("expenses").select("*").eq("id", id).single();
  const { data: vehicles } = await supabase.from("vehicles").select("id, name").order("name");

  if (!expense) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Edit expense</h1>
      <EditExpenseForm expense={expense} vehicles={vehicles ?? []} />
    </div>
  );
}
