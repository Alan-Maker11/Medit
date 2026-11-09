import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";
import JsonLd from "@/components/public/JsonLd";
import PageHero from "@/components/public/PageHero";
import TrustBar from "@/components/public/TrustBar";
import PageFAQ, { type FAQItem } from "@/components/public/PageFAQ";
import CtaBand from "@/components/public/CtaBand";

const SLUG = "/zona-colonial-tour";

export const metadata: Metadata = buildPageMetadata({
  slug: SLUG,
  title: "Wheelchair Tour Zona Colonial Santo Domingo",
  description:
    "Explore Santo Domingo's UNESCO colonial district in a fully adapted van. Private guided wheelchair tours, half-day or full-day.",
});

const STOPS = [
  { name: "Plaza de España", note: "Open, mostly flat plaza — easy." },
  { name: "Catedral Primada de América", note: "Flat paved approach; interior aisles are wide." },
  { name: "Calle Las Damas", note: "Cobblestones — driver assistance recommended." },
  { name: "El Conde pedestrian mall", note: "Paved and flat for most of its length." },
  { name: "Alcázar de Colón", note: "Stone steps at the entrance; ground floor only is realistic." },
  { name: "Fortaleza Ozama", note: "Uneven stone surfaces throughout — driver assistance required." },
  { name: "Parque Independencia", note: "Paved walkways, flat and easy." },
];

const FAQS: FAQItem[] = [
  {
    q: "Is the Colonial Zone actually wheelchair accessible?",
    a: "Partially, and we're honest about it rather than overselling it. Several of the area's signature streets, including Calle Las Damas and the grounds around Fortaleza Ozama, are original colonial-era cobblestone — beautiful, but genuinely bumpy. Plaza de España, the Catedral's exterior, and El Conde's pedestrian mall are flat and manageable. Our driver stays with you at every stop to help on the rougher sections.",
  },
  {
    q: "Should I book the half-day or full-day tour?",
    a: "The half-day (4h) covers the core highlights — Plaza de España, the Catedral, Calle Las Damas and El Conde — at an easy pace with time for photos and a coffee stop. The full-day (7h) adds Alcázar de Colón, Fortaleza Ozama, Parque Independencia and a sit-down lunch, with more breaks built in.",
  },
  {
    q: "Can you pick us up directly from SDQ airport?",
    a: "Yes. We can start the tour straight from Las Américas Airport if your flight timing allows, or pick you up from your Santo Domingo hotel. Either way, see our dedicated SDQ airport transfer page for standalone transfer pricing.",
  },
  {
    q: "Is this tour good for someone recovering from surgery?",
    a: "The half-day option, taken at a relaxed pace with reclining seats and no stairs required in the van, works well for many post-surgery travelers. If you're specifically traveling for recovery, check our post-surgery transport page for guidance on what to expect.",
  },
];

export default function ZonaColonialTourPage() {
  const touristTripSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: "Wheelchair-Accessible Tour of Zona Colonial, Santo Domingo",
    description:
      "Private, guided wheelchair-accessible tour of Santo Domingo's UNESCO colonial district, available as a half-day (4h) or full-day (7h) itinerary.",
    touristType: [
      { "@type": "Audience", audienceType: "Wheelchair users" },
      { "@type": "Audience", audienceType: "History and culture travelers" },
    ],
    itinerary: {
      "@type": "ItemList",
      itemListElement: STOPS.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: s.name,
        item: {
          "@type": "TouristAttraction",
          name: s.name,
          address: { "@type": "PostalAddress", addressLocality: "Santo Domingo", addressCountry: "DO" },
        },
      })),
    },
    provider: { "@type": "LocalBusiness", name: "Medit RD", url: "https://www.meditrd.site", telephone: "+18293296920" },
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
      <JsonLd schema={[touristTripSchema, faqSchema]} />

      <PageHero
        eyebrow="Santo Domingo · Zona Colonial"
        h1="Wheelchair-Accessible Tour of Zona Colonial"
        intro="A private, guided tour of the Americas' first colonial city, in a fully adapted van with a driver who knows exactly which cobblestoned streets need a hand — and which don't."
        ctaMessage="Hi, I'd like to book a wheelchair-accessible Zona Colonial tour."
        ctaLabel="Book This Tour"
      />

      <TrustBar />

      <section className="bg-white px-4 py-16 dark:bg-black sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-medit-fg dark:text-white sm:text-4xl">
            Half-day or full-day itineraries
          </h2>
          <p className="font-body mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Founded in 1498, Santo Domingo&apos;s Zona Colonial is a UNESCO World Heritage Site and the oldest
            European settlement in the Americas — which also means a lot of its charm comes from original stone
            streets never designed with wheels in mind. Medit RD runs this tour the honest way: we tell you which
            stops are flat and easy, and which ones need our driver&apos;s help, rather than pretending the whole
            district is a smooth sidewalk.
          </p>
          <p className="font-body mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Choose the <strong>half-day (4 hours)</strong> for a focused tour of the core landmarks at a relaxed
            pace, or the <strong>full-day (7 hours)</strong> if you want to see the whole district plus a sit-down
            lunch and more time at each stop.
          </p>

          <h2 className="font-display mt-12 text-2xl font-bold text-medit-fg dark:text-white">Stops on this tour</h2>
          <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-medit-bg font-body text-xs uppercase tracking-wide text-zinc-500 dark:bg-[#0d1421]">
                <tr>
                  <th className="px-4 py-3">Stop</th>
                  <th className="px-4 py-3">Accessibility note</th>
                </tr>
              </thead>
              <tbody className="font-body divide-y divide-zinc-200 dark:divide-zinc-800">
                {STOPS.map((s) => (
                  <tr key={s.name}>
                    <td className="px-4 py-3 text-medit-fg dark:text-white">{s.name}</td>
                    <td className="px-4 py-3 text-zinc-500">{s.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="font-display mt-12 text-2xl font-bold text-medit-fg dark:text-white">Pickup logistics</h2>
          <p className="font-body mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            We can collect you directly from your hotel anywhere in Santo Domingo, or start the tour right from
            Las Américas Airport (SDQ) if your flight schedule allows — pair this with our{" "}
            <a href="/santo-domingo-airport-transfer" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
              SDQ airport transfer
            </a>{" "}
            for a seamless arrival day. If beaches are more your pace, our{" "}
            <a href="/punta-cana-tours" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
              Punta Cana tours
            </a>{" "}
            page covers accessible excursions on the east coast.
          </p>
        </div>
      </section>

      <PageFAQ items={FAQS} />

      <CtaBand ctaMessage="Hi, I'd like to book a wheelchair-accessible Zona Colonial tour." />
    </>
  );
}
