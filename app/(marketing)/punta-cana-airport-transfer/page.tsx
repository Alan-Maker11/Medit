import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";
import JsonLd from "@/components/public/JsonLd";
import PageHero from "@/components/public/PageHero";
import TrustBar from "@/components/public/TrustBar";
import PageFAQ, { type FAQItem } from "@/components/public/PageFAQ";
import CtaBand from "@/components/public/CtaBand";

const SLUG = "/punta-cana-airport-transfer";

export const metadata: Metadata = buildPageMetadata({
  slug: SLUG,
  title: "Wheelchair Airport Transfer Punta Cana",
  description:
    "Private wheelchair-accessible van from Punta Cana Airport to any resort. Flight tracking included. Book in 2 minutes on WhatsApp.",
});

const FEATURES = [
  "Ramp or lift — no lifting required, roll straight into the van",
  "Driver meets you inside the arrivals hall with a name sign",
  "Live flight tracking, so your driver adjusts to delays automatically",
  "Direct, private drop-off at your resort's main entrance or lobby",
  "Luggage assistance from baggage claim to the van and at drop-off",
  "Wide side and rear doors, tie-down anchors for manual and power chairs",
];

const PRICING = [
  { route: "Airport → Bávaro / Punta Cana resort area", price: "from $45", notes: "1–4 pax" },
  { route: "Airport → Cap Cana", price: "from $55", notes: "1–4 pax" },
  { route: "Airport → Uvero Alto", price: "from $65", notes: "1–4 pax" },
  { route: "Additional passengers (5+)", price: "+$10 each", notes: "" },
  { route: "Power wheelchair surcharge", price: "+$0", notes: "Included" },
];

const SERVICE_AREA = ["Bávaro", "Cap Cana", "Uvero Alto", "Macao", "Punta Cana Village", "Higüey", "La Altagracia province"];

const FAQS: FAQItem[] = [
  {
    q: "How early should I book?",
    a: "We recommend booking at least 24 hours before your flight lands, especially during high season (December–April) when accessible vehicles are in high demand. That said, we do accommodate shorter-notice requests whenever a ramp van is available — message us on WhatsApp and we'll confirm availability right away.",
  },
  {
    q: "What if my flight is delayed?",
    a: "No problem, and no extra charge. We track your flight number in real time, so if your arrival shifts by an hour or by three, your driver's pickup time shifts with it. Just make sure to give us your flight number when you book.",
  },
  {
    q: "Can you fit a power wheelchair?",
    a: "Yes. Our accessible van has a rear ramp rated for wheelchairs and scooters up to roughly 300 lbs (136 kg), with four-point tie-down anchors to secure the chair safely in transit. If your chair is unusually large or heavy, let us know the dimensions beforehand so we can confirm fit.",
  },
  {
    q: "Do you go to Cap Cana?",
    a: "Yes — Cap Cana is one of our most frequent drop-off areas, including the marina, golf communities, and resorts like Hyatt Ziva and Eden Roc. The transfer from PUJ runs from $55 for up to 4 passengers.",
  },
];

export default function PuntaCanaAirportTransferPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Wheelchair-accessible airport transfer",
    name: "Wheelchair Airport Transfer — Punta Cana (PUJ)",
    description:
      "Private wheelchair-accessible van transfer from Punta Cana International Airport (PUJ) to resorts in Bávaro, Cap Cana, Uvero Alto and beyond. Flight tracking, ramp-equipped van, certified driver.",
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
        eyebrow="Punta Cana · PUJ Airport"
        h1="Accessible Airport Transfer — Punta Cana (PUJ)"
        intro="Private, ramp-equipped van transfers from Punta Cana International Airport straight to your resort. Your driver tracks your flight, meets you at arrivals with a name sign, and handles luggage so all you have to do is relax."
        ctaMessage="Hi, I'd like to book a wheelchair-accessible airport transfer from PUJ."
        ctaLabel="Book Your Transfer"
      />

      <TrustBar />

      <section className="bg-white px-4 py-16 dark:bg-black sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-medit-fg dark:text-white sm:text-4xl">
            Door-to-door accessibility, from touchdown to check-in
          </h2>
          <p className="font-body mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Landing at Punta Cana International Airport (PUJ) in a wheelchair shouldn&apos;t mean uncertainty about
            how you&apos;ll get to your resort. Medit RD runs a dedicated ramp-equipped van built specifically for
            wheelchair users — not a regular van with a borrowed ramp bolted on. Our driver watches your flight
            status from the moment you book, so whether you land early or your flight is delayed three hours, someone
            is waiting for you inside the arrivals hall holding a sign with your name on it.
          </p>
          <p className="font-body mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            From there it&apos;s a straight roll onto the ramp — no transferring out of your chair, no lifting, no
            awkward step-ups. We secure manual chairs, power chairs, and scooters with four-point tie-downs before
            we move, and we drop you directly at your resort&apos;s lobby or entrance, with help carrying luggage the
            whole way. If you&apos;re also planning{" "}
            <a href="/punta-cana-tours" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
              accessible tours and excursions
            </a>{" "}
            during your stay, we can set those up on the same WhatsApp thread.
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
            WhatsApp before pickup based on your exact resort and group size.
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
            We cover the full east coast tourist corridor out of PUJ: {SERVICE_AREA.join(", ")}. Heading further —
            to{" "}
            <a href="/la-romana-transfer" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
              La Romana or Casa de Campo
            </a>
            ? We run that route too. And if you need transport to a clinic or appointment instead of a resort, see
            our{" "}
            <a href="/medical-transport" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
              medical transportation
            </a>{" "}
            service.
          </p>
        </div>
      </section>

      <PageFAQ items={FAQS} />

      <CtaBand ctaMessage="Hi, I'd like to book a wheelchair-accessible airport transfer from PUJ." />
    </>
  );
}
