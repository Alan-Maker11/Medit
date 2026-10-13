"use client";

const SERVICES = [
  {
    icon: "✈️",
    title: "Airport Transfer",
    desc: "Direct pickup and drop-off to/from the airport, with flight tracking included.",
    cta: "Book Transfer →",
    type: "transfer" as const,
  },
  {
    icon: "🌴",
    title: "Tours & Excursions",
    desc: "Beaches, the colonial city and attractions — accessible, with a guide and adapted vehicle.",
    cta: "View Tours →",
    type: "tour" as const,
  },
  {
    icon: "🏥",
    title: "Medical Transportation",
    desc: "Medical appointments, therapy sessions and procedures, with escort and punctuality.",
    cta: "Request →",
    type: "transfer" as const,
  },
];

export default function Services() {
  function go(type: "transfer" | "tour") {
    if (type === "tour") {
      document.getElementById("tours")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    window.dispatchEvent(new CustomEvent("medit:book-route", { detail: { region: "puj", type: "transfer" } }));
    document.getElementById("reservar")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="servicios" className="bg-white px-4 py-16 dark:bg-black sm:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-center text-3xl font-bold text-medit-fg dark:text-white sm:text-4xl">
          Our services
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {SERVICES.map((s) => (
            <button
              key={s.title}
              onClick={() => go(s.type)}
              className="group rounded-2xl border border-zinc-200 bg-medit-bg p-6 text-left transition-shadow hover:shadow-xl dark:border-zinc-800 dark:bg-[#0d1421]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-medit-navy to-medit-teal-2 text-2xl">
                {s.icon}
              </div>
              <h3 className="font-display mt-4 text-xl font-bold text-medit-fg dark:text-white">{s.title}</h3>
              <p className="font-body mt-2 text-sm text-zinc-600 dark:text-zinc-400">{s.desc}</p>
              <span className="font-body mt-3 inline-block text-sm font-bold text-medit-teal-2 dark:text-medit-teal">{s.cta}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
