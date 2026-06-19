"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
    >
      Sign out
    </button>
  );
}
