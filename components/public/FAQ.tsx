"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "What kind of vehicles do you use?",
    a: "Vans and SUVs adapted with a ramp or wheelchair lift, with room for companions and luggage.",
  },
  {
    q: "Can I book without creating an account?",
    a: "Yes. Every booking is confirmed directly on WhatsApp with our team — no sign-up required.",
  },
  {
    q: "Do you monitor my flight if it's delayed?",
    a: "Yes, for airport transfers you can give us your flight number and we adjust the pickup to your actual arrival time.",
  },
  {
    q: "Which areas of the country do you serve?",
    a: "Santo Domingo, Punta Cana, Bávaro and La Romana. For other areas, contact us on WhatsApp.",
  },
  {
    q: "How do I pay for the trip?",
    a: "The final price is confirmed on WhatsApp before the trip. We accept cash and bank transfer.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white px-4 py-16 dark:bg-black sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-center text-3xl font-bold text-medit-fg dark:text-white sm:text-4xl">
          Frequently asked questions
        </h2>
        <div className="mt-10 flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                >
                  <span className="font-body font-semibold text-medit-fg dark:text-white">{item.q}</span>
                  <span className={`shrink-0 text-medit-teal transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>▾</span>
                </button>
                <div
                  className="grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="font-body pb-4 text-sm text-zinc-600 dark:text-zinc-400">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
