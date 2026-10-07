const DESTINATIONS = [
  { icon: "🌴", name: "Punta Cana", desc: "Resorts y playas de arena blanca", gradient: "from-cyan-500 to-blue-700" },
  { icon: "🏛️", name: "Santo Domingo", desc: "Capital histórica y moderna", gradient: "from-indigo-600 to-purple-800" },
  { icon: "🌊", name: "Las Terrenas", desc: "Costa caribeña y francesa", gradient: "from-teal-500 to-emerald-700" },
  { icon: "⛵", name: "La Romana", desc: "Casa de Campo & Altos de Chavón", gradient: "from-amber-500 to-orange-700" },
];

export default function Destinations() {
  return (
    <section id="destinos" className="bg-medit-bg px-4 py-16 dark:bg-[#0d1421] sm:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-center text-3xl font-bold text-medit-fg dark:text-white sm:text-4xl">
          Destinos populares
        </h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DESTINATIONS.map((d) => (
            <div
              key={d.name}
              className={`relative flex h-48 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br ${d.gradient} p-5 text-white shadow-lg transition-transform duration-200 hover:scale-[1.02]`}
            >
              <span className="absolute right-4 top-4 text-4xl opacity-80">{d.icon}</span>
              <h3 className="font-display text-xl font-bold">{d.name}</h3>
              <p className="font-body text-sm text-white/80">{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
