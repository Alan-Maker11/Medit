"use client";

import { useState } from "react";
import { useAdminLang, ADMIN_T } from "@/lib/adminLang";
import TripsByMonth from "./TripsByMonth";
import TripsCalendar from "./TripsCalendar";

interface TripRow {
  id: string;
  date: string;
  time: string;
  client_name: string | null;
  total_fare: number | null;
  status: string;
  driver_id: string | null;
  needs_wheelchair: boolean;
  needs_stair_climber: boolean;
  client_owes?: boolean;
  services: { name: string } | null;
  drivers: { name: string } | null;
  vehicles: { name: string } | null;
}

interface DriverOption {
  id: string;
  name: string;
}

export default function TripsView({ trips, drivers }: { trips: TripRow[]; drivers: DriverOption[] }) {
  const { lang } = useAdminLang();
  const t = ADMIN_T[lang];
  const [view, setView] = useState<"list" | "calendar">("list");

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex w-fit rounded-full border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
        <button
          onClick={() => setView("list")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            view === "list" ? "bg-blue-600 text-white" : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          }`}
        >
          {t.viewList}
        </button>
        <button
          onClick={() => setView("calendar")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            view === "calendar" ? "bg-blue-600 text-white" : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          }`}
        >
          {t.viewCalendar}
        </button>
      </div>

      {view === "list" ? <TripsByMonth trips={trips} /> : <TripsCalendar trips={trips} drivers={drivers} />}
    </div>
  );
}
