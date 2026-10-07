const ITEMS = [
  { icon: "📍", label: "GPS en tiempo real" },
  { icon: "🛡️", label: "Certificado seguro" },
  { icon: "♿", label: "Vehículo accesible" },
  { icon: "🕐", label: "Soporte 24/7" },
];

export default function TrustStrip() {
  return (
    <section className="medit-hero-gradient px-4 py-10">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-4">
        {ITEMS.map((i) => (
          <div key={i.label} className="flex flex-col items-center gap-2 text-center">
            <span className="text-3xl">{i.icon}</span>
            <p className="font-body text-sm font-semibold text-white/90">{i.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
