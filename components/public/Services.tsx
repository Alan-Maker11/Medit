const SERVICES = [
  {
    icon: "✈️",
    title: "Transfer Aeropuerto",
    desc: "Recogida y entrega directa desde/hacia el aeropuerto, con rastreo de vuelo incluido.",
  },
  {
    icon: "🌴",
    title: "Tours & Excursiones",
    desc: "Playas, ciudad colonial y atracciones — accesibles, con guía y vehículo adaptado.",
  },
  {
    icon: "🏥",
    title: "Transporte Médico",
    desc: "Citas médicas, terapias y procedimientos, con acompañamiento y puntualidad.",
  },
];

export default function Services() {
  return (
    <section id="servicios" className="bg-white px-4 py-16 dark:bg-black sm:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-center text-3xl font-bold text-medit-fg dark:text-white sm:text-4xl">
          Nuestros servicios
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="group rounded-2xl border border-zinc-200 bg-medit-bg p-6 transition-shadow hover:shadow-xl dark:border-zinc-800 dark:bg-[#0d1421]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-medit-navy to-medit-teal-2 text-2xl">
                {s.icon}
              </div>
              <h3 className="font-display mt-4 text-xl font-bold text-medit-fg dark:text-white">{s.title}</h3>
              <p className="font-body mt-2 text-sm text-zinc-600 dark:text-zinc-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
