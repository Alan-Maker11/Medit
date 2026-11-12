import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";
import JsonLd from "@/components/public/JsonLd";
import PageHero from "@/components/public/PageHero";
import CtaBand from "@/components/public/CtaBand";
import { waLink } from "@/lib/whatsapp";
import {
  ArticleWrapper,
  ArticleMeta,
  ArticleIntro,
  ArticleH2,
  ArticleP,
  ArticleUL,
  ArticleTable,
  ArticleCtaBox,
} from "../_components";

const SLUG = "/blog/wheelchair-accessible-tours-punta-cana";
const CTA_MESSAGE = "Hi, I'm interested in booking a wheelchair accessible tour in Punta Cana.";

export const metadata: Metadata = buildPageMetadata({
  slug: SLUG,
  title: "Wheelchair Accessible Tours Punta Cana — Best Activities 2025",
  description:
    "Discover the best wheelchair accessible tours and excursions in Punta Cana. Zona Colonial, nightlife, cigar tours, beaches, and more — all with an accessible van and bilingual guide.",
});

interface TourCard {
  name: string;
  desc: string;
  price: string;
  duration: string;
  difficulty: string;
  note: string;
}

const TOURS: TourCard[] = [
  {
    name: "Zona Colonial City Tour — Santo Domingo",
    desc: "Explore the first European city in the Americas — a UNESCO World Heritage Site. Walk (or roll) along the cobblestone-paved Calle Las Damas, see the Alcázar de Colón, the first cathedral in the New World, and the Ozama Fortress.",
    price: "$60–80 USD",
    duration: "3–4 hours",
    difficulty: "Moderate (some cobblestone streets)",
    note: "Some Zona Colonial streets are cobblestone and can be challenging for manual chairs. Power wheelchairs handle these well. Your guide will plan the flattest accessible route.",
  },
  {
    name: "Don Lucas Cigar Factory & Rum Tour",
    desc: "Visit a working Dominican cigar factory and learn the craft behind one of the Caribbean's most famous exports. The tour continues to a local rum distillery for tastings.",
    price: "$130 USD",
    duration: "3–4 hours",
    difficulty: "Easy (fully flat, indoor)",
    note: "Fully accessible — flat floors, no steps, accessible restrooms at the factory.",
  },
  {
    name: "Dinner in the Sky",
    desc: "One of Punta Cana's most unique experiences — dining suspended high above the ground. The experience platform uses an elevator-style lift for boarding.",
    price: "$200 USD",
    duration: "2–3 hours",
    difficulty: "Contact us to confirm chair compatibility",
    note: "Confirm accessibility requirements when booking — the platform may require a standing transfer for some configurations.",
  },
  {
    name: "Nightlife Tours — Coco Bongo & Infinity Night Club",
    desc: "Punta Cana's nightlife is legendary. Medit RD provides accessible transport to and from Coco Bongo and Infinity Night Club, including pickup from your hotel and drop-off back at the end of the night.",
    price: "From $160 USD",
    duration: "Evening",
    difficulty: "Easy (accessible venue entrances)",
    note: "Both venues have wheelchair-accessible sections and entrances. Request wheelchair-accessible seating when booking the venue — we transport you there and back safely.",
  },
  {
    name: "Santo Domingo Night Tour",
    desc: "See the Dominican Republic's capital lit up at night. The tour covers the Malecón waterfront, the illuminated Zona Colonial, and the city's most iconic monuments.",
    price: "From $80 USD",
    duration: "2–3 hours",
    difficulty: "Easy (mostly vehicle-based)",
    note: "A relaxed, vehicle-based way to see the city at night with minimal walking required.",
  },
  {
    name: "Downtown Punta Cana Group Tour",
    desc: "Explore the local side of Punta Cana — markets, local restaurants, street art, and the town center.",
    price: "$120 USD",
    duration: "3 hours",
    difficulty: "Easy to moderate",
    note: "A good mix of resort-adjacent and local sightseeing with minimal uneven ground.",
  },
  {
    name: "Full Day Excursion",
    desc: "A custom full-day accessible excursion designed around your interests — combining natural, cultural, and culinary stops. Available from both Punta Cana and Santo Domingo.",
    price: "From $160 USD",
    duration: "7–9 hours",
    difficulty: "Varies by itinerary",
    note: "Tell us what you'd like to see and we build the day around what's genuinely accessible.",
  },
];

export default function Article3Page() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Wheelchair Accessible Tours Punta Cana — Best Activities 2025",
    author: { "@type": "Organization", name: "Medit RD" },
    datePublished: "2025-11-01",
    dateModified: "2025-11-01",
    mainEntityOfPage: `https://www.meditrd.site${SLUG}`,
  };

  return (
    <>
      <JsonLd schema={articleSchema} />

      <PageHero
        eyebrow="Blog · Punta Cana"
        h1="Wheelchair Accessible Tours in Punta Cana — Complete Guide 2025"
        intro="Zona Colonial, cigar and rum tastings, nightlife, and full-day excursions — the best tours in Punta Cana and Santo Domingo, all run with a ramp-equipped van and a bilingual guide."
        ctaMessage={CTA_MESSAGE}
        ctaLabel="Book a Tour"
      />

      <ArticleWrapper>
        <ArticleMeta>By Medit RD · Updated November 2025</ArticleMeta>
        <ArticleIntro>
          Punta Cana offers world-class experiences — but most standard tour operators assume all guests can step
          onto a standard bus or walk through uneven terrain. This guide covers the best truly wheelchair-accessible
          tours and excursions in Punta Cana and Santo Domingo, all operated with an accessible van and trained
          guides through Medit RD.
        </ArticleIntro>

        <ArticleH2>Medit RD Accessible Tour Catalog — Punta Cana &amp; Santo Domingo</ArticleH2>
        <ArticleP>
          All tours below operate with Medit RD&apos;s ramp-equipped accessible van, a bilingual (Spanish/English)
          guide, and door-to-door hotel pickup. Prices are per vehicle (not per person), so you share the fixed cost
          with your travel party.
        </ArticleP>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {TOURS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl border border-zinc-200 bg-medit-bg p-6 shadow-sm dark:border-zinc-800 dark:bg-[#0d1421]"
            >
              <h3 className="font-display text-lg font-bold text-medit-fg dark:text-white">{t.name}</h3>
              <p className="font-body mt-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {t.duration} · {t.difficulty}
              </p>
              <p className="font-body mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{t.desc}</p>
              <p className="font-body mt-3 rounded-lg bg-medit-teal/10 p-3 text-sm leading-relaxed text-medit-teal-2 dark:text-medit-teal">
                ♿ {t.note}
              </p>
              <div className="mt-4 flex items-center justify-between">
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

        <ArticleH2>Tour Price Summary</ArticleH2>
        <ArticleTable
          headers={["Tour", "Price (USD)", "Difficulty"]}
          rows={[
            ["Zona Colonial City Tour", "$60–80", "Moderate"],
            ["Don Lucas Cigar & Rum Tour", "$130", "Easy"],
            ["Dinner in the Sky", "$200", "Confirm access"],
            ["Coco Bongo Nightlife", "$160", "Easy"],
            ["Infinity Night Club", "$180", "Easy"],
            ["Santo Domingo Night Tour", "From $80", "Easy"],
            ["Downtown PC Group Tour", "$120", "Easy–Moderate"],
            ["Full Day Excursion", "From $160", "Varies"],
          ]}
        />

        <ArticleH2>What Makes a Tour &quot;Truly Accessible&quot; for Wheelchair Users?</ArticleH2>
        <ArticleP>A truly wheelchair-accessible tour requires:</ArticleP>
        <ArticleUL
          items={[
            "A vehicle with a ramp — not a step-entry van",
            "Securement for the chair during transit — not just an extra-wide seat",
            "Guides who plan wheelchair-navigable routes — not standard walking routes",
            "Pre-screened venues — confirmed accessible entrance and restrooms",
            "Flexible pace — tour stops at your comfort level, not on a rushed schedule",
          ]}
        />
        <ArticleP>
          Medit RD&apos;s tours meet all five criteria. Our vehicles have ramps, our drivers are trained in mobility
          assistance, and our guides know which streets, entrances, and facilities are genuinely accessible.
        </ArticleP>

        <ArticleH2>Accessible Beaches in Punta Cana — What to Know</ArticleH2>
        <ArticleUL
          items={[
            "Bávaro Beach: some all-inclusive resorts have beach matting (floating mats) that extend to the water's edge — ask your resort specifically about this",
            "Cap Cana: Juanillo Beach within Cap Cana is calmer and flatter, with better surface access to the water's edge than Bávaro",
            "Beach wheelchairs: some resorts offer amphibious beach wheelchairs for free — confirm before arrival. Medit RD can transport you to any resort that offers these",
          ]}
        />

        <ArticleCtaBox ctaMessage={CTA_MESSAGE} ctaLabel="Book Your Accessible Tour">
          Book your accessible tour in Punta Cana or Santo Domingo. Tell us which tour interests you and your dates.
        </ArticleCtaBox>

        <ArticleH2>Tips for Wheelchair Users on Tours in the Dominican Republic</ArticleH2>
        <ArticleUL
          items={[
            "Book 48+ hours in advance — especially in high season (December–April)",
            "Share your chair's weight and dimensions",
            "Ask about bathroom breaks — guides pre-plan accessible restroom stops on all our tours",
            "Bring sun protection — outdoor parts of tours involve significant sun exposure year-round",
          ]}
        />

        <ArticleH2>About Medit RD</ArticleH2>
        <ArticleP>
          Medit RD is the Dominican Republic&apos;s only certified wheelchair-accessible transport and tours
          company. We operate in Punta Cana, Santo Domingo, La Romana, and Cap Cana. Our mission: make every corner
          of the Dominican Republic accessible to every traveler.
        </ArticleP>
      </ArticleWrapper>

      <CtaBand
        heading="Ready to book an accessible tour?"
        subheading="Tell us which tour interests you and your travel dates — we'll confirm availability within minutes."
        ctaMessage={CTA_MESSAGE}
      />
    </>
  );
}
