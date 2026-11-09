const ITEMS = ["Flight tracking included", "Ramp-equipped vans", "Certified drivers", "Available 24/7"];

export default function TrustBar() {
  return (
    <section className="border-y border-zinc-200 bg-medit-bg px-4 py-6 dark:border-zinc-800 dark:bg-[#0d1421]">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {ITEMS.map((item) => (
          <span key={item} className="font-body flex items-center gap-2 text-sm font-semibold text-medit-fg dark:text-white">
            <span className="text-medit-teal-2 dark:text-medit-teal" aria-hidden="true">
              ✓
            </span>{" "}
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
