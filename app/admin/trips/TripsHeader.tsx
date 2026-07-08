"use client";

import Link from "next/link";
import { useAdminLang, ADMIN_T } from "@/lib/adminLang";

export default function TripsHeader() {
  const { lang } = useAdminLang();
  const t = ADMIN_T[lang];
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-bold">{t.trips}</h1>
      <Link
        href="/admin/trips/new"
        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        {t.logTrip}
      </Link>
    </div>
  );
}
