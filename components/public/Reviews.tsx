const REVIEWS = [
  {
    name: "Carmen R.",
    text: "El conductor fue puntual y muy atento con mi madre en silla de ruedas. Todo el viaje al aeropuerto sin estrés.",
  },
  {
    name: "James T.",
    text: "Booked a transfer from Punta Cana airport — the van was fully accessible and the driver tracked our flight delay perfectly.",
  },
  {
    name: "Luisa M.",
    text: "Uso Medit para las terapias de mi hijo cada semana. Siempre llegan a tiempo y son muy amables.",
  },
];

export default function Reviews() {
  return (
    <section className="bg-medit-bg px-4 py-16 dark:bg-[#0d1421] sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-display text-3xl font-bold text-medit-fg dark:text-white sm:text-4xl">Lo que dicen nuestros clientes</h2>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-medit-gold">★★★★★</span>
            <span className="font-body text-sm font-semibold text-zinc-600 dark:text-zinc-400">4.9 de 5</span>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {REVIEWS.map((r) => (
            <div key={r.name} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-black">
              <span className="text-medit-gold">★★★★★</span>
              <p className="font-body mt-2 text-sm text-zinc-600 dark:text-zinc-400">&ldquo;{r.text}&rdquo;</p>
              <p className="font-body mt-3 text-sm font-bold text-medit-fg dark:text-white">{r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
