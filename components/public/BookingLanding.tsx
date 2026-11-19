"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from "@/lib/whatsapp";

type Lang = "es" | "en";

interface Content {
  htmlLang: string;
  eyebrow: string;
  h1: string;
  intro: string;
  trustPoints: string[];
  priceLine: string;
  whatsappCta: string;
  callCta: string;
  switchLabel: string;
  switchHref: string;
  reviewsTitle: string;
  ratingLabel: string;
  reviews: { name: string; text: string }[];
  formTitle: string;
  formIntro: string;
  labels: {
    name: string;
    phone: string;
    date: string;
    time: string;
    pickup: string;
    dropoff: string;
    tripType: string;
    oneWay: string;
    roundTrip: string;
    needs: string;
    needWheelchair: string;
    needStairClimber: string;
    notes: string;
    notesPlaceholder: string;
    submit: string;
  };
  requiredError: string;
  openingNote: string;
  messageTemplate: (f: FormState) => string;
}

interface FormState {
  name: string;
  phone: string;
  date: string;
  time: string;
  pickup: string;
  dropoff: string;
  tripType: "one-way" | "round-trip";
  needWheelchair: boolean;
  needStairClimber: boolean;
  notes: string;
}

const INITIAL_STATE: FormState = {
  name: "",
  phone: "",
  date: "",
  time: "",
  pickup: "",
  dropoff: "",
  tripType: "one-way",
  needWheelchair: false,
  needStairClimber: false,
  notes: "",
};

const CONTENT: Record<Lang, Content> = {
  es: {
    htmlLang: "es-DO",
    eyebrow: "RESERVA POR WHATSAPP",
    h1: "Transporte en silla de ruedas en Santo Domingo — reserve en minutos",
    intro:
      "Vans adaptadas, conductores capacitados y asistencia puerta a puerta. Complete el formulario y le enviamos la disponibilidad al instante por WhatsApp.",
    trustPoints: [
      "🚐 Vehículos adaptados con rampa, listos para silla de ruedas",
      "🪜 Servicio de máquina para bajar escaleras (2do piso en adelante)",
      "🤝 Asistencia puerta a puerta en cada viaje",
    ],
    priceLine: "Desde RD$1,250",
    whatsappCta: "Reservar por WhatsApp",
    callCta: "Llamar ahora",
    switchLabel: "English",
    switchHref: "/en/book",
    reviewsTitle: "Lo que dicen nuestros clientes",
    ratingLabel: "4.9 de 5",
    reviews: [
      {
        name: "Carmen R.",
        text: "El conductor fue puntual y muy atento con mi madre, que usa silla de ruedas. Todo el viaje al aeropuerto fue sin estrés.",
      },
      {
        name: "James T.",
        text: "Reservé un traslado desde el aeropuerto de Punta Cana — la van era totalmente accesible y el conductor siguió el retraso de nuestro vuelo a la perfección.",
      },
      {
        name: "Luisa M.",
        text: "Uso Medit cada semana para las terapias de mi hijo. Siempre llegan a tiempo y son muy amables.",
      },
    ],
    formTitle: "Solicite su reserva",
    formIntro:
      "Este formulario no envía nada por sí solo: arma un mensaje de WhatsApp con todos sus datos y lo abre para que usted lo envíe. Nada queda reservado hasta que lo confirmemos por WhatsApp.",
    labels: {
      name: "Nombre completo",
      phone: "Teléfono / WhatsApp",
      date: "Fecha",
      time: "Hora",
      pickup: "Dirección de recogida",
      dropoff: "Dirección de destino",
      tripType: "Tipo de viaje",
      oneWay: "Solo ida",
      roundTrip: "Ida y vuelta",
      needs: "Necesidades especiales",
      needWheelchair: "♿ Silla de ruedas",
      needStairClimber: "🪜 Máquina para bajar escaleras",
      notes: "Notas adicionales",
      notesPlaceholder: "Número de vuelo, equipaje, paradas extra…",
      submit: "Enviar por WhatsApp →",
    },
    requiredError: "Por favor complete nombre, teléfono, fecha, recogida y destino.",
    openingNote: "Abriendo WhatsApp con sus datos… si no ocurre nada, revise el bloqueador de ventanas emergentes.",
    messageTemplate: (f) =>
      `🔵 *MEDIT RD — SOLICITUD DE RESERVA*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 Nombre: ${f.name}\n` +
      `📱 Teléfono: ${f.phone}\n` +
      `📅 Fecha: ${f.date || "—"}\n` +
      `🕐 Hora: ${f.time || "—"}\n` +
      `📍 Recogida: ${f.pickup}\n` +
      `🏁 Destino: ${f.dropoff}\n` +
      `↔️ Tipo de viaje: ${f.tripType === "one-way" ? "Solo ida" : "Ida y vuelta"}\n` +
      (f.needWheelchair || f.needStairClimber
        ? `♿ Necesidades: ${[
            f.needWheelchair ? "Silla de ruedas" : "",
            f.needStairClimber ? "Máquina para bajar escaleras" : "",
          ]
            .filter(Boolean)
            .join(", ")}\n`
        : "") +
      (f.notes ? `📝 Notas: ${f.notes}\n` : "") +
      `\nPor favor confirmen disponibilidad y precio final. ¡Gracias! 🙏`,
  },
  en: {
    htmlLang: "en",
    eyebrow: "BOOK VIA WHATSAPP",
    h1: "Wheelchair-accessible transport in the Dominican Republic — book in minutes",
    intro:
      "Adapted vans, trained drivers, and door-to-door assistance. Fill in the form and we'll send availability instantly on WhatsApp.",
    trustPoints: [
      "🚐 Ramp-equipped, wheelchair-ready vehicles",
      "🪜 Stair-climber service (2nd floor and up)",
      "🤝 Door-to-door assistance on every trip",
    ],
    priceLine: "From RD$1,250",
    whatsappCta: "Book on WhatsApp",
    callCta: "Call now",
    switchLabel: "Español",
    switchHref: "/es/reservar",
    reviewsTitle: "What our customers say",
    ratingLabel: "4.9 out of 5",
    reviews: [
      {
        name: "Carmen R.",
        text: "The driver was punctual and very attentive to my mother, who uses a wheelchair. The whole trip to the airport was stress-free.",
      },
      {
        name: "James T.",
        text: "Booked a transfer from Punta Cana airport — the van was fully accessible and the driver tracked our flight delay perfectly.",
      },
      {
        name: "Luisa M.",
        text: "I use Medit for my son's therapy sessions every week. They always arrive on time and are very friendly.",
      },
    ],
    formTitle: "Request your booking",
    formIntro:
      "This form doesn't submit anywhere on its own — it composes a WhatsApp message with everything you entered and opens it for you to send. Nothing is booked until we confirm back on WhatsApp.",
    labels: {
      name: "Full name",
      phone: "Phone / WhatsApp",
      date: "Date",
      time: "Time",
      pickup: "Pick-up address",
      dropoff: "Destination address",
      tripType: "Trip type",
      oneWay: "One way",
      roundTrip: "Round trip",
      needs: "Special needs",
      needWheelchair: "♿ Wheelchair",
      needStairClimber: "🪜 Stair-climbing machine",
      notes: "Additional notes",
      notesPlaceholder: "Flight number, luggage, extra stops…",
      submit: "Send via WhatsApp →",
    },
    requiredError: "Please fill in name, phone, date, pickup, and destination first.",
    openingNote: "Opening WhatsApp with your details… if nothing happened, check your browser's pop-up blocker.",
    messageTemplate: (f) =>
      `🔵 *MEDIT RD — BOOKING REQUEST*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 Name: ${f.name}\n` +
      `📱 Phone: ${f.phone}\n` +
      `📅 Date: ${f.date || "—"}\n` +
      `🕐 Time: ${f.time || "—"}\n` +
      `📍 Pick-up: ${f.pickup}\n` +
      `🏁 Destination: ${f.dropoff}\n` +
      `↔️ Trip type: ${f.tripType === "one-way" ? "One way" : "Round trip"}\n` +
      (f.needWheelchair || f.needStairClimber
        ? `♿ Needs: ${[
            f.needWheelchair ? "Wheelchair" : "",
            f.needStairClimber ? "Stair-climbing machine" : "",
          ]
            .filter(Boolean)
            .join(", ")}\n`
        : "") +
      (f.notes ? `📝 Notes: ${f.notes}\n` : "") +
      `\nPlease confirm availability and final price. Thank you! 🙏`,
  },
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export default function BookingLanding({ lang }: { lang: Lang }) {
  const c = CONTENT[lang];
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [missingFields, setMissingFields] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Best-effort: keep <html lang> in sync with this route on the client,
  // since this page's own layout can't override the root layout's <html> tag.
  useEffect(() => {
    document.documentElement.lang = c.htmlLang;
    return () => {
      document.documentElement.lang = "en";
    };
  }, [c.htmlLang]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.date.trim() || !form.pickup.trim() || !form.dropoff.trim()) {
      setMissingFields(true);
      setSubmitted(false);
      return;
    }
    setMissingFields(false);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "whatsapp_booking_submit", form_language: lang });

    const message = c.messageTemplate(form);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  return (
    <div className="flex min-h-screen flex-col bg-white font-body dark:bg-black">
      <header className="flex items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-display bg-gradient-to-r from-medit-teal to-cyan-300 bg-clip-text text-xl font-bold text-transparent">
          MEDIT
        </Link>
        <Link
          href={c.switchHref}
          lang={lang === "es" ? "en" : "es"}
          className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-semibold text-medit-fg transition-colors hover:bg-medit-bg dark:border-zinc-700 dark:text-white dark:hover:bg-[#0d1421]"
        >
          🌐 {c.switchLabel}
        </Link>
      </header>

      <section className="medit-hero-gradient relative overflow-hidden px-4 py-12 sm:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,theme(colors.medit-teal)_0%,transparent_45%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="font-body inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-medit-teal">
            {c.eyebrow}
          </span>
          <h1 className="font-display mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">{c.h1}</h1>
          <p className="font-body mx-auto mt-6 max-w-2xl text-base text-white/80 sm:text-lg">{c.intro}</p>

          <p className="font-display mt-6 text-2xl font-bold text-medit-teal sm:text-3xl">{c.priceLine}</p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full max-w-xs rounded-full bg-medit-teal px-8 py-4 text-center text-base font-bold text-medit-navy no-underline shadow-lg shadow-medit-teal/20 transition-transform duration-150 hover:scale-105 hover:bg-medit-teal-2 sm:w-auto"
            >
              💬 {c.whatsappCta}
            </a>
            <a
              href="tel:+18293296920"
              className="block w-full max-w-xs rounded-full border border-white/20 bg-white/5 px-8 py-4 text-center text-base font-bold text-white no-underline backdrop-blur transition-colors hover:bg-white/10 sm:w-auto"
            >
              📞 {c.callCta} · {WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      <section className="bg-medit-bg px-4 py-10 dark:bg-[#0d1421] sm:py-14">
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
          {c.trustPoints.map((t) => (
            <div key={t} className="rounded-2xl border border-zinc-200 bg-white p-5 text-center text-sm font-semibold text-medit-fg dark:border-zinc-800 dark:bg-black dark:text-white">
              {t}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-12 dark:bg-black sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <h2 className="font-display text-2xl font-bold text-medit-fg dark:text-white sm:text-3xl">{c.reviewsTitle}</h2>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-medit-gold">★★★★★</span>
              <span className="font-body text-sm font-semibold text-zinc-600 dark:text-zinc-400">{c.ratingLabel}</span>
            </div>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {c.reviews.map((r) => (
              <div key={r.name} className="rounded-2xl border border-zinc-200 bg-medit-bg p-5 dark:border-zinc-800 dark:bg-[#0d1421]">
                <span className="text-medit-gold">★★★★★</span>
                <p className="font-body mt-2 text-sm text-zinc-600 dark:text-zinc-400">&ldquo;{r.text}&rdquo;</p>
                <p className="font-body mt-3 text-sm font-bold text-medit-fg dark:text-white">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-medit-bg px-4 py-12 dark:bg-[#0d1421] sm:py-16">
        <div className="mx-auto max-w-xl">
          <h2 className="font-display text-2xl font-bold text-medit-fg dark:text-white sm:text-3xl">{c.formTitle}</h2>
          <p className="font-body mt-3 text-sm text-zinc-500">{c.formIntro}</p>

          <form
            onSubmit={handleSubmit}
            className="font-body mt-6 flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-black sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm font-semibold text-medit-fg dark:text-white">
                {c.labels.name}
                <input type="text" required value={form.name} onChange={(e) => set("name", e.target.value)} className="input" />
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-semibold text-medit-fg dark:text-white">
                {c.labels.phone}
                <input type="tel" required value={form.phone} onChange={(e) => set("phone", e.target.value)} className="input" />
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-semibold text-medit-fg dark:text-white">
                {c.labels.date}
                <input type="date" required value={form.date} onChange={(e) => set("date", e.target.value)} className="input" />
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-semibold text-medit-fg dark:text-white">
                {c.labels.time}
                <input type="time" value={form.time} onChange={(e) => set("time", e.target.value)} className="input" />
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-semibold text-medit-fg dark:text-white">
                {c.labels.pickup}
                <input type="text" required value={form.pickup} onChange={(e) => set("pickup", e.target.value)} className="input" />
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-semibold text-medit-fg dark:text-white">
                {c.labels.dropoff}
                <input type="text" required value={form.dropoff} onChange={(e) => set("dropoff", e.target.value)} className="input" />
              </label>
            </div>

            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-semibold text-medit-fg dark:text-white">{c.labels.tripType}</legend>
              <div className="flex gap-6">
                <label className="font-body flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <input
                    type="radio"
                    name="tripType"
                    checked={form.tripType === "one-way"}
                    onChange={() => set("tripType", "one-way")}
                    className="accent-medit-teal"
                  />
                  {c.labels.oneWay}
                </label>
                <label className="font-body flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <input
                    type="radio"
                    name="tripType"
                    checked={form.tripType === "round-trip"}
                    onChange={() => set("tripType", "round-trip")}
                    className="accent-medit-teal"
                  />
                  {c.labels.roundTrip}
                </label>
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-semibold text-medit-fg dark:text-white">{c.labels.needs}</legend>
              <div className="flex flex-wrap gap-4">
                <label className="font-body flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <input
                    type="checkbox"
                    checked={form.needWheelchair}
                    onChange={(e) => set("needWheelchair", e.target.checked)}
                    className="accent-medit-teal"
                  />
                  {c.labels.needWheelchair}
                </label>
                <label className="font-body flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <input
                    type="checkbox"
                    checked={form.needStairClimber}
                    onChange={(e) => set("needStairClimber", e.target.checked)}
                    className="accent-medit-teal"
                  />
                  {c.labels.needStairClimber}
                </label>
              </div>
            </fieldset>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-medit-fg dark:text-white">
              {c.labels.notes}
              <textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder={c.labels.notesPlaceholder}
                rows={3}
                className="input resize-none"
              />
            </label>

            <button
              type="submit"
              className="rounded-full bg-medit-teal px-6 py-3 text-center text-base font-bold text-medit-navy transition-transform duration-150 hover:scale-[1.02] hover:bg-medit-teal-2"
            >
              {c.labels.submit}
            </button>

            {missingFields && <p className="text-center text-sm font-semibold text-red-600">{c.requiredError}</p>}

            {submitted && (
              <p className="text-center text-sm font-semibold text-medit-teal-2 dark:text-medit-teal">{c.openingNote}</p>
            )}
          </form>
        </div>
      </section>

      <footer className="bg-medit-navy px-4 py-8 text-center text-sm text-white/60">
        <p>© {new Date().getFullYear()} Medit RD — {WHATSAPP_DISPLAY}</p>
      </footer>
    </div>
  );
}
