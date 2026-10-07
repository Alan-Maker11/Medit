const CITIES = ["Santo Domingo", "Punta Cana", "Bávaro", "Las Terrenas"];

export default function Hero() {
  return (
    <section id="top" className="medit-hero-gradient relative overflow-hidden px-4 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,theme(colors.medit-teal)_0%,transparent_45%)]" />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
          {CITIES.map((c) => (
            <span
              key={c}
              className="font-body rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80"
            >
              📍 {c}
            </span>
          ))}
        </div>

        <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
          Transporte accesible,
          <br />
          <span className="bg-gradient-to-r from-medit-teal to-cyan-300 bg-clip-text text-transparent">a tu ritmo</span>
        </h1>

        <p className="font-body mt-6 max-w-2xl text-lg text-white/80">
          Vehículos adaptados, conductores certificados y seguimiento en tiempo real — para que viajar en silla de
          ruedas por República Dominicana sea simple, seguro y cómodo.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#reservar"
            className="rounded-full bg-medit-teal px-8 py-4 text-base font-bold text-medit-navy shadow-lg shadow-medit-teal/20 transition-transform duration-150 hover:scale-105 hover:bg-medit-teal-2"
          >
            Reservar mi viaje
          </a>
          <a
            href="https://wa.me/18293296920"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur transition-colors hover:bg-white/10"
          >
            💬 Hablar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
