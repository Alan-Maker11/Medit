import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";
import AdminSidebar from "@/components/AdminSidebar";
import { AdminLangProvider } from "@/lib/adminLang";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return (
    <AdminLangProvider>
      <div className="flex flex-1 flex-col md:flex-row">
        <AdminSidebar signOutSlot={<SignOutButton />} />
        <main className="flex-1 overflow-y-auto bg-zinc-50 p-4 dark:bg-black sm:p-6">{children}</main>
      </div>
    </AdminLangProvider>
  );
}
