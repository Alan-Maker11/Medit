"use client";

import { useMemo, useState } from "react";
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
  service_id: string | null;
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

interface ServiceOption {
  id: string;
  name: string;
}

export default function TripsView({
  trips,
  drivers,
  services,
}: {
  trips: TripRow[];
  drivers: DriverOption[];
  services: ServiceOption[];
}) {
  const { lang } = useAdminLang();
  const t = ADMIN_T[lang];
  const [view, setView] = useState<"list" | "calendar">("list");
  const [serviceId, setServiceId] = useState("");
  const [owesOnly, setOwesOnly] = useState(false);

  const filteredTrips = useMemo(
    () =>
      trips.filter(
        (trip) => (!serviceId || trip.service_id === serviceId) && (!owesOnly || trip.client_owes)
      ),
    [trips, serviceId, owesOnly]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
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

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          >
            <option value="">{t.allServices}</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={owesOnly} onChange={(e) => setOwesOnly(e.target.checked)} />
            {t.onlyOwes}
          </label>
        </div>
      </div>

      {view === "list" ? (
        <TripsByMonth trips={filteredTrips} />
      ) : (
        <TripsCalendar trips={filteredTrips} drivers={drivers} />
      )}
    </div>
  );
}
