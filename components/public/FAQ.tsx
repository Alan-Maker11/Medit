"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "¿Qué tipo de vehículos usan?",
    a: "Vans y camionetas adaptadas con rampa o elevador para silla de ruedas, con espacio para acompañantes y equipaje.",
  },
  {
    q: "¿Puedo reservar sin crear una cuenta?",
    a: "Sí. Toda reserva se confirma directamente por WhatsApp con nuestro equipo — no necesitas registrarte.",
  },
  {
    q: "¿Monitorean mi vuelo si llega tarde?",
    a: "Sí, para transfers de aeropuerto puedes dejarnos tu número de vuelo y ajustamos la recogida según tu hora real de llegada.",
  },
  {
    q: "¿En qué zonas del país operan?",
    a: "Santo Domingo, Punta Cana, Bávaro, La Romana y Las Terrenas. Para otras zonas, contáctanos por WhatsApp.",
  },
  {
    q: "¿Cómo pago el viaje?",
    a: "El precio final se confirma por WhatsApp antes del viaje. Aceptamos efectivo y transferencia.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white px-4 py-16 dark:bg-black sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-center text-3xl font-bold text-medit-fg dark:text-white sm:text-4xl">
          Preguntas frecuentes
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
