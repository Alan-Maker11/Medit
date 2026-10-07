const STEPS = [
  { icon: "🗺️", title: "Elige tu ruta", desc: "Selecciona tu región, tipo de servicio y destino." },
  { icon: "♿", title: "Personaliza", desc: "Agrega silla de ruedas, sube-escaleras u otros extras." },
  { icon: "✅", title: "Confirma por WhatsApp", desc: "Revisa el resumen y confirma con nuestro equipo al instante." },
];

export default function HowItWorks() {
  return (
    <section className="bg-medit-bg px-4 py-16 dark:bg-[#0d1421] sm:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-center text-3xl font-bold text-medit-fg dark:text-white sm:text-4xl">
          ¿Cómo funciona?
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-medit-teal/10 text-3xl">
                {s.icon}
              </div>
              <p className="font-body mt-4 text-xs font-bold uppercase tracking-wide text-medit-teal">Paso {i + 1}</p>
              <h3 className="font-display mt-1 text-xl font-bold text-medit-fg dark:text-white">{s.title}</h3>
              <p className="font-body mt-2 text-sm text-zinc-600 dark:text-zinc-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
