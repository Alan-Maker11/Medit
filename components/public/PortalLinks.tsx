const LINKS = [
  { href: "/calculator", icon: "🧮", title: "Calculadora de tarifa", desc: "Cotiza tu viaje con el motor de precios real" },
  { href: "/driver/login", icon: "🚐", title: "Portal del conductor", desc: "Acceso para conductores Medit" },
  { href: "/login", icon: "🔐", title: "Panel administrativo", desc: "Acceso para personal de Medit" },
];

export default function PortalLinks() {
  return (
    <section className="bg-medit-bg px-4 py-14 dark:bg-[#0d1421]">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-body text-center text-xs font-bold uppercase tracking-widest text-zinc-500">Accesos</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-black"
            >
              <span className="text-2xl">{l.icon}</span>
              <div>
                <p className="font-body text-sm font-bold text-medit-fg dark:text-white">{l.title}</p>
                <p className="font-body text-xs text-zinc-500">{l.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
