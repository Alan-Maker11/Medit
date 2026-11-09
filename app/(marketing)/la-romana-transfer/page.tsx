import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";
import JsonLd from "@/components/public/JsonLd";
import PageHero from "@/components/public/PageHero";
import TrustBar from "@/components/public/TrustBar";
import PageFAQ, { type FAQItem } from "@/components/public/PageFAQ";
import CtaBand from "@/components/public/CtaBand";

const SLUG = "/la-romana-transfer";

export const metadata: Metadata = buildPageMetadata({
  slug: SLUG,
  title: "Accessible Transfer La Romana Dominican Rep.",
  description:
    "Private accessible van from Punta Cana or Santo Domingo to La Romana, Casa de Campo & Altos de Chavón. Book online.",
});

const FEATURES = [
  "Ramp-equipped private van, direct from PUJ, SDQ, or your resort",
  "No shared shuttle stops — one group, one vehicle, your schedule",
  "Driver assistance at Altos de Chavón's cobblestoned areas",
  "Comfortable for the roughly 1–1.5 hour drive from either airport",
  "Round-trip or one-way, same-day or multi-day",
  "Luggage and golf-bag space available on request",
];

const FAQS: FAQItem[] = [
  {
    q: "How long does the drive to La Romana take?",
    a: "From Punta Cana (PUJ) it's roughly 60–75 minutes depending on your resort's location; from Santo Domingo (SDQ) plan for about 90 minutes to two hours. We build in extra time so you're not rushed.",
  },
  {
    q: "Is Casa de Campo accessible for wheelchair users?",
    a: "Much of the resort and marina area is flat and manageable, though specific villas and golf facilities vary — we recommend checking with Casa de Campo directly on individual room or venue accessibility. We can get you to and around the main areas without issue.",
  },
  {
    q: "What about Altos de Chavón — is that cobblestoned too?",
    a: "Yes, similar to Santo Domingo's Colonial Zone, Altos de Chavón's artists' village has cobblestone paths in several areas. Our driver stays with you to assist on those sections; the amphitheater viewpoint and main plaza are the most manageable parts.",
  },
  {
    q: "Can you combine this with an airport transfer?",
    a: "Yes — many clients book us straight from PUJ or SDQ to La Romana as a single transfer, skipping a separate resort stop entirely. Just let us know your flight details when booking.",
  },
];

export default function LaRomanaTransferPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Wheelchair-accessible private transfer",
    name: "Wheelchair Transfer to La Romana & Casa de Campo",
    description:
      "Private wheelchair-accessible van transfer between Punta Cana or Santo Domingo and La Romana, Casa de Campo and Altos de Chavón.",
    provider: { "@type": "LocalBusiness", name: "Medit RD", url: "https://www.meditrd.site", telephone: "+18293296920" },
    areaServed: [
      { "@type": "City", name: "La Romana" },
      { "@type": "Place", name: "Casa de Campo" },
      { "@type": "Place", name: "Altos de Chavón" },
    ],
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
        eyebrow="Punta Cana / Santo Domingo → La Romana"
        h1="Wheelchair Transfer to La Romana & Casa de Campo"
        intro="A private, ramp-equipped van from Punta Cana or Santo Domingo straight to La Romana — including Casa de Campo and the cobblestoned village of Altos de Chavón."
        ctaMessage="Hi, I'd like to book an accessible transfer to La Romana / Casa de Campo."
        ctaLabel="Book This Transfer"
      />

      <TrustBar />

      <section className="bg-white px-4 py-16 dark:bg-black sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-medit-fg dark:text-white sm:text-4xl">
            One private van, no transfers in between
          </h2>
          <p className="font-body mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            La Romana sits on the Dominican Republic&apos;s southeastern coast, home to the resort community of
            Casa de Campo and the artists&apos; village of Altos de Chavón perched above the Chavón River. It&apos;s
            close enough to Punta Cana for an easy day trip, and far enough from Santo Domingo that a private
            accessible van beats trying to coordinate multiple vehicles or shared shuttles.
          </p>
          <p className="font-body mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            We run this route directly from PUJ or SDQ airports, or from your resort, in the same ramp-equipped van
            used for our{" "}
            <a href="/punta-cana-airport-transfer" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
              Punta Cana airport transfers
            </a>
            . If Altos de Chavón&apos;s famous cobblestone streets are part of your plan, our driver stays close to
            help on the uneven sections — we also run it as a standalone excursion on our{" "}
            <a href="/punta-cana-tours" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
              Punta Cana tours
            </a>{" "}
            page.
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

          <h2 className="font-display mt-12 text-2xl font-bold text-medit-fg dark:text-white">Getting an exact price</h2>
          <p className="font-body mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Because pickup points vary so much (PUJ, SDQ, or a specific resort), we confirm an exact La Romana fare
            on WhatsApp rather than publishing a single rate here — it only takes a couple of minutes. Mention
            whether you also want to include Altos de Chavón and we&apos;ll build it into the same trip.
          </p>
        </div>
      </section>

      <PageFAQ items={FAQS} />

      <CtaBand ctaMessage="Hi, I'd like to book an accessible transfer to La Romana / Casa de Campo." />
    </>
  );
}
