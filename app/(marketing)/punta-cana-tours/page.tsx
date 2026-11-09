import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";
import JsonLd from "@/components/public/JsonLd";
import PageHero from "@/components/public/PageHero";
import TrustBar from "@/components/public/TrustBar";
import PageFAQ, { type FAQItem } from "@/components/public/PageFAQ";
import CtaBand from "@/components/public/CtaBand";
import { waLink } from "@/lib/whatsapp";

const SLUG = "/punta-cana-tours";

export const metadata: Metadata = buildPageMetadata({
  slug: SLUG,
  title: "Wheelchair Accessible Tours Punta Cana",
  description:
    "Wheelchair-accessible beach tours, nightlife, and day trips in Punta Cana. Fully adapted van with ramp. Private & group options.",
});

const TOURS = [
  {
    name: "Punta Cana Beach Tour",
    duration: "4 hours",
    accessibility: "Fully Accessible" as const,
    price: "from $80",
    desc: "A relaxed half-day at Macao Beach, one of the island's most dramatic stretches of sand. Beach mats are available so wheelchairs can roll closer to the water, and your driver stays on-site the whole time to help as needed.",
  },
  {
    name: "Altos de Chavón Day Trip",
    duration: "8 hours",
    accessibility: "Partially Accessible" as const,
    price: "from $120",
    desc: "A full day to the artists' village of Altos de Chavón near La Romana. Some areas have cobblestones, so our driver stays close to assist on uneven ground — most of the village, the amphitheater viewpoint and the main plaza are manageable with help.",
  },
  {
    name: "Punta Cana Nightlife Tour",
    duration: "3 hours",
    accessibility: "Fully Accessible" as const,
    price: "from $60",
    desc: "An evening out at Coco Bongo, Imagine, or Hard Rock Live, with accessible entry and seating arranged in advance where the venue allows it. Round-trip transport from your resort is included.",
  },
  {
    name: "Isla Saona Accessible Option",
    duration: "Full day",
    accessibility: "Partially Accessible" as const,
    price: "from $150",
    desc: "The classic Isla Saona excursion, adapted as far as the boat operators allow. Catamaran boarding requires driver assistance (and sometimes operator staff as well), so we coordinate the crossing in advance — once on the island, the beach areas are flat and manageable.",
  },
];

const FAQS: FAQItem[] = [
  {
    q: "What does \"Fully Accessible\" mean for a Medit RD tour?",
    a: "It means the van has a ramp and wide doors, the route and stops are on flat or paved ground, our driver is on hand to assist at every stop, and tie-down anchors are available if you want your chair secured in the van. You should be able to complete the whole tour without needing to get out of your chair unless you choose to.",
  },
  {
    q: "What does \"Partially Accessible\" mean?",
    a: "It means part of the route — cobblestones, a boat boarding, uneven terrain — requires driver assistance or isn't 100% flat. We're upfront about exactly which parts in the tour description so you can decide if it works for you, and our driver is trained to help at those specific points.",
  },
  {
    q: "Can I book a private tour instead of joining a group?",
    a: "Yes. All of the tours above can run privately for your group alone, usually with a modest price adjustment. Message us on WhatsApp with your group size and we'll quote it directly.",
  },
  {
    q: "Do you provide beach wheelchairs?",
    a: "For the Punta Cana Beach Tour we can arrange beach mats and, where available, a beach wheelchair rental — let us know when you book so we can confirm availability for your date.",
  },
];

export default function PuntaCanaToursPage() {
  const touristTripSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: "Wheelchair-Accessible Tours & Excursions — Punta Cana",
    description:
      "Private wheelchair-accessible day tours in Punta Cana: beach tours, nightlife, Altos de Chavón, and Isla Saona. Fully adapted ramp van with driver assistance.",
    touristType: [
      { "@type": "Audience", audienceType: "Wheelchair users" },
      { "@type": "Audience", audienceType: "Travelers with disabilities" },
    ],
    itinerary: {
      "@type": "ItemList",
      itemListElement: TOURS.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.name,
        item: { "@type": "TouristAttraction", name: t.name, address: { "@type": "PostalAddress", addressCountry: "DO" } },
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
        eyebrow="Punta Cana · Tours"
        h1="Accessible Tours & Excursions in Punta Cana"
        intro="Beaches, nightlife, and day trips around Punta Cana, run in a fully adapted ramp van with a driver who stays close to help every step of the way."
        ctaMessage="Hi, I'd like to book an accessible tour in Punta Cana."
        ctaLabel="Book a Tour"
      />

      <TrustBar />

      <section className="bg-white px-4 py-16 dark:bg-black sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-center text-3xl font-bold text-medit-fg dark:text-white sm:text-4xl">
            Tours built around wheelchair access, not retrofitted for it
          </h2>
          <p className="font-body mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Most tour operators in Punta Cana will tell you a trip is &quot;accessible&quot; without ever checking
            the ground conditions. We rate every one of our tours honestly — Fully Accessible or Partially
            Accessible — so you know exactly what to expect before you book. If you just landed, pair any of these
            with our{" "}
            <a href="/punta-cana-airport-transfer" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
              PUJ airport transfer
            </a>
            .
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {TOURS.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-2xl border border-zinc-200 bg-medit-bg p-6 shadow-sm dark:border-zinc-800 dark:bg-[#0d1421]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl font-bold text-medit-fg dark:text-white">{t.name}</h3>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                      t.accessibility === "Fully Accessible"
                        ? "bg-medit-teal/15 text-medit-teal-2 dark:text-medit-teal"
                        : "bg-medit-gold/15 text-medit-gold"
                    }`}
                  >
                    {t.accessibility}
                  </span>
                </div>
                <p className="font-body mt-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">{t.duration}</p>
                <p className="font-body mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{t.desc}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="font-body text-lg font-bold text-medit-teal-2 dark:text-medit-teal">{t.price}</span>
                  <a
                    href={waLink(`Hi, I'd like to book the ${t.name} (${t.duration}, ${t.price}).`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body rounded-full bg-medit-teal px-4 py-2 text-sm font-bold text-medit-navy transition-transform duration-150 hover:scale-105 hover:bg-medit-teal-2"
                  >
                    Book →
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-14 max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-medit-fg dark:text-white">Our accessibility standard</h2>
            <p className="font-body mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              When we label a tour <strong>Fully Accessible</strong>, it means our van has a ramp and wide door, the
              stops are on flat or paved ground, tie-down anchors are available, and our driver actively assists at
              every stop rather than waiting in the van. <strong>Partially Accessible</strong> means there&apos;s
              at least one point in the route — cobblestones, sand, a boat boarding — where driver assistance is
              required and the ground isn&apos;t perfectly flat. We tell you exactly which parts of each tour fall
              into that category so you can make an informed choice, rather than discovering it on the day.
            </p>
            <p className="font-body mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              Prefer a UNESCO old-town day instead of the beach? Our{" "}
              <a href="/zona-colonial-tour" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
                Zona Colonial tour
              </a>{" "}
              in Santo Domingo runs on the same honest-accessibility basis, and travelers recovering from a procedure
              should check our{" "}
              <a href="/post-surgery-transport" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
                post-surgery transport
              </a>{" "}
              page before booking any excursion.
            </p>
          </div>
        </div>
      </section>

      <PageFAQ items={FAQS} />

      <CtaBand ctaMessage="Hi, I'd like to book an accessible tour in Punta Cana." />
    </>
  );
}
