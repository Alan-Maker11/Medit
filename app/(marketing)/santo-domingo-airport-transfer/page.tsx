import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";
import JsonLd from "@/components/public/JsonLd";
import PageHero from "@/components/public/PageHero";
import TrustBar from "@/components/public/TrustBar";
import PageFAQ, { type FAQItem } from "@/components/public/PageFAQ";
import CtaBand from "@/components/public/CtaBand";

const SLUG = "/santo-domingo-airport-transfer";

export const metadata: Metadata = buildPageMetadata({
  slug: SLUG,
  title: "Wheelchair Airport Transfer Santo Domingo",
  description:
    "Door-to-door wheelchair transfer from Las Américas Airport. Ramp-equipped van, certified driver. Available 24/7.",
});

const FEATURES = [
  "Ramp-equipped van — roll on, no lifting or transferring required",
  "Driver meets you at Las Américas (SDQ) arrivals with a name sign",
  "Live flight tracking for early or delayed arrivals, no extra charge",
  "Direct drop-off at your hotel, apartment, clinic or hospital entrance",
  "Luggage and medical-equipment assistance from curb to door",
  "Available for overnight and early-morning flights, 24/7",
];

const PRICING = [
  { route: "Airport → Colonial Zone", price: "from $40", notes: "1–4 pax" },
  { route: "Airport → Piantini / Naco", price: "from $35", notes: "1–4 pax" },
  { route: "Airport → Bella Vista / Gazcue", price: "from $35", notes: "1–4 pax" },
  { route: "Additional passengers (5+)", price: "+$10 each", notes: "" },
  { route: "Power wheelchair surcharge", price: "+$0", notes: "Included" },
];

const SERVICE_AREA = [
  "Colonial Zone",
  "Piantini",
  "Naco",
  "Bella Vista",
  "Gazcue",
  "CEDIMAT",
  "Hospital General",
  "Clínica Corominas",
];

const FAQS: FAQItem[] = [
  {
    q: "How early should I book?",
    a: "24 hours' notice is ideal so we can confirm a ramp-equipped van for your exact arrival time. We regularly handle shorter-notice requests too, including early-morning and red-eye arrivals — message us on WhatsApp and we'll tell you right away if a vehicle is free.",
  },
  {
    q: "What if my flight is delayed?",
    a: "We track your flight number and adjust your pickup time automatically, at no extra cost. Just share the flight number when you book so our system — and your driver — can follow it.",
  },
  {
    q: "Can you fit a power wheelchair?",
    a: "Yes, our accessible van's rear ramp and four-point tie-down system handle manual chairs, power chairs and mobility scooters up to roughly 300 lbs (136 kg). Tell us the chair's dimensions ahead of time if it's unusually large.",
  },
  {
    q: "Do you go to the Colonial Zone or to hospitals like CEDIMAT?",
    a: "Yes to both. The Colonial Zone is one of our most common drop-offs (and a great base for our zona-colonial tour), and we regularly run patients and companions to CEDIMAT, Hospital General and Clínica Corominas for appointments and procedures.",
  },
];

export default function SantoDomingoAirportTransferPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Wheelchair-accessible airport transfer",
    name: "Wheelchair Airport Transfer — Santo Domingo (SDQ)",
    description:
      "Private wheelchair-accessible van transfer from Las Américas International Airport (SDQ) to hotels, apartments and clinics across Santo Domingo. Ramp-equipped van, certified driver, 24/7.",
    provider: { "@type": "LocalBusiness", name: "Medit RD", url: "https://www.meditrd.site", telephone: "+18293296920" },
    areaServed: SERVICE_AREA.map((name) => ({ "@type": "Place", name })),
    offers: PRICING.filter((p) => p.price.startsWith("from")).map((p) => ({
      "@type": "Offer",
      name: p.route,
      priceCurrency: "USD",
      price: p.price.replace(/[^0-9]/g, ""),
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <JsonLd schema={[serviceSchema, faqSchema]} />

      <PageHero
        eyebrow="Santo Domingo · SDQ Airport"
        h1="Accessible Airport Transfer — Santo Domingo (SDQ)"
        intro="Private, ramp-equipped van transfers from Las Américas International Airport to anywhere in the capital — hotels, apartments, clinics and hospitals. Flight tracking included, available around the clock."
        ctaMessage="Hi, I'd like to book a wheelchair-accessible airport transfer from SDQ."
        ctaLabel="Book Your Transfer"
      />

      <TrustBar />

      <section className="bg-white px-4 py-16 dark:bg-black sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-medit-fg dark:text-white sm:text-4xl">
            A reliable, accessible ride into the capital
          </h2>
          <p className="font-body mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Santo Domingo&apos;s Las Américas International Airport (SDQ) sits about 20–30 minutes east of the city
            center, and navigating a regular taxi queue in a wheelchair after a long flight is exactly the kind of
            friction Medit RD exists to remove. Our driver watches your flight in real time, meets you inside the
            arrivals hall with a name sign, and gets you onto the ramp without any lifting or awkward transfers.
          </p>
          <p className="font-body mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Whether you&apos;re arriving for vacation, for business, or for a medical appointment, we drop you
            directly at your destination&apos;s door — a hotel in the{" "}
            <a href="/zona-colonial-tour" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
              Colonial Zone
            </a>
            , an apartment in Piantini, or a clinic such as CEDIMAT. If your trip is specifically for treatment,
            therapy, or a procedure, take a look at our dedicated{" "}
            <a href="/medical-transport" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
              medical transportation
            </a>{" "}
            page, and if it&apos;s a recovery trip, see{" "}
            <a href="/post-surgery-transport" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
              post-surgery transport
            </a>
            .
          </p>

          <h2 className="font-display mt-12 text-2xl font-bold text-medit-fg dark:text-white">What&apos;s included</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <li key={f} className="font-body flex gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="mt-0.5 text-medit-teal-2 dark:text-medit-teal" aria-hidden="true">
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>

          <h2 className="font-display mt-12 text-2xl font-bold text-medit-fg dark:text-white">Transfer pricing</h2>
          <p className="font-body mt-3 text-sm text-zinc-500">
            Prices below are &quot;from&quot; rates for up to 4 passengers, in USD. Final price is confirmed on
            WhatsApp before pickup based on your exact destination and group size.
          </p>
          <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-medit-bg font-body text-xs uppercase tracking-wide text-zinc-500 dark:bg-[#0d1421]">
                <tr>
                  <th className="px-4 py-3">Transfer type</th>
                  <th className="px-4 py-3">Price (USD)</th>
                  <th className="px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody className="font-body divide-y divide-zinc-200 dark:divide-zinc-800">
                {PRICING.map((p) => (
                  <tr key={p.route}>
                    <td className="px-4 py-3 text-medit-fg dark:text-white">{p.route}</td>
                    <td className="px-4 py-3 font-bold text-medit-teal-2 dark:text-medit-teal">{p.price}</td>
                    <td className="px-4 py-3 text-zinc-500">{p.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="font-display mt-12 text-2xl font-bold text-medit-fg dark:text-white">Service area</h2>
          <p className="font-body mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            We cover {SERVICE_AREA.join(", ")}, plus intercity transfers to Punta Cana, La Romana and beyond. Want to
            make part of your trip a tour instead of just a transfer? See our{" "}
            <a href="/zona-colonial-tour" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
              Zona Colonial accessible tour
            </a>
            .
          </p>
        </div>
      </section>

      <PageFAQ items={FAQS} />

      <CtaBand ctaMessage="Hi, I'd like to book a wheelchair-accessible airport transfer from SDQ." />
    </>
  );
}
