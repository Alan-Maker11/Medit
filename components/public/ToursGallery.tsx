"use client";

import { useState } from "react";
import { ROUTE_DATA } from "@/lib/routeData";

type Filter = "puj" | "sdq" | "all";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "puj", label: "PUJ" },
  { key: "sdq", label: "SDQ" },
];

export default function ToursGallery() {
  const [filter, setFilter] = useState<Filter>("all");

  const tours =
    filter === "all"
      ? [...ROUTE_DATA.puj.tour, ...ROUTE_DATA.sdq.tour]
      : filter === "puj"
        ? ROUTE_DATA.puj.tour
        : ROUTE_DATA.sdq.tour;

  return (
    <section id="tours" className="bg-white px-4 py-16 dark:bg-black sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <h2 className="font-display text-3xl font-bold text-medit-fg dark:text-white sm:text-4xl">Tours & Excursiones</h2>
          <div className="flex gap-2 rounded-full bg-medit-bg p-1 dark:bg-zinc-900">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`font-body rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  filter === f.key
                    ? "bg-medit-teal text-medit-navy"
                    : "text-zinc-600 hover:text-medit-fg dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tours.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-zinc-200 bg-medit-bg p-5 transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-[#0d1421]"
            >
              <span className="text-3xl">{t.icon}</span>
              <h3 className="font-display mt-3 text-lg font-bold text-medit-fg dark:text-white">{t.name}</h3>
              <p className="font-body mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t.desc}</p>
              <p className="font-body mt-3 text-sm font-bold text-medit-teal-2 dark:text-medit-teal">{t.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
