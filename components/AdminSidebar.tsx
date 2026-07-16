"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAdminLang, ADMIN_T } from "@/lib/adminLang";

export default function AdminSidebar({ signOutSlot }: { signOutSlot: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const pathname = usePathname();

  function openDrawer() {
    setOpen(true);
    setEverOpened(true);
  }
  const { lang, toggleLang } = useAdminLang();
  const t = ADMIN_T[lang];

  const NAV_ITEMS = [
    { href: "/admin", label: t.dashboard },
    { href: "/admin/trips", label: t.trips },
    { href: "/admin/expenses", label: t.expenses },
    { href: "/admin/vehicles", label: t.vehicles },
    { href: "/admin/drivers", label: t.drivers },
    { href: "/admin/salary", label: t.salary },
    { href: "/admin/reports", label: t.reports },
  ];

  function linkClass(href: string) {
    const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
    return `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? "bg-blue-600 text-white"
        : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
    }`;
  }

  const LangToggle = (
    <button
      onClick={toggleLang}
      className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-left text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
    >
      🌐 {t.toggleLabel}
    </button>
  );

  return (
    <>
      {/* Mobile header */}
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900 md:hidden">
        <h2 className="text-lg font-bold">Medit Admin</h2>
        <button
          onClick={openDrawer}
          aria-label="Open menu"
          className="rounded-lg p-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {/* Mobile drawer */}
      {everOpened && (
        <div className={`fixed inset-0 z-40 md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
          <div
            className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ease-out ${open ? "opacity-100" : "opacity-0"}`}
            onClick={() => setOpen(false)}
          />
          <aside
            className={`absolute left-0 top-0 flex h-full w-64 max-w-[80vw] flex-col gap-1 overflow-y-auto bg-white p-4 shadow-xl transition-transform duration-[250ms] dark:bg-zinc-900 ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
            style={{ transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" }}
          >
            <div className="mb-4 flex items-center justify-between px-2">
              <h2 className="text-lg font-bold">Medit Admin</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={linkClass(item.href)}>
                {item.label}
              </Link>
            ))}
            <div className="mt-auto flex flex-col gap-2 px-0 pt-4">
              {LangToggle}
              {signOutSlot}
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col gap-1 border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 md:flex">
        <h2 className="mb-4 px-2 text-lg font-bold">Medit Admin</h2>
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className={linkClass(item.href)}>
            {item.label}
          </Link>
        ))}
        <div className="mt-auto flex flex-col gap-2">
          {LangToggle}
          {signOutSlot}
        </div>
      </aside>
    </>
  );
}
