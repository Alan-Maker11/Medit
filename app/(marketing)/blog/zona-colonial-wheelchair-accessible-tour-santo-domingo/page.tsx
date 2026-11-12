import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";
import JsonLd from "@/components/public/JsonLd";
import PageHero from "@/components/public/PageHero";
import CtaBand from "@/components/public/CtaBand";
import {
  ArticleWrapper,
  ArticleMeta,
  ArticleIntro,
  ArticleH2,
  ArticleP,
  ArticleUL,
  ArticleOL,
  ArticleCtaBox,
  ArticleLink,
} from "../_components";

const SLUG = "/blog/zona-colonial-wheelchair-accessible-tour-santo-domingo";
const CTA_MESSAGE = "Hi, I'd like to book the Zona Colonial wheelchair accessible tour.";

export const metadata: Metadata = buildPageMetadata({
  slug: SLUG,
  title: "Zona Colonial Wheelchair Tour Santo Domingo — Accessible Guide 2025",
  description:
    "How to visit Santo Domingo's Zona Colonial (UNESCO World Heritage Site) in a wheelchair. Accessible routes, what to see, what to skip, and how to book an accessible guided tour.",
});

interface Site {
  name: string;
  rating: string;
  note: string;
}

const SITES: Site[] = [
  {
    name: "Catedral Primada de América (First Cathedral of the Americas)",
    rating: "Moderate Accessibility",
    note:
      "The ground floor of the cathedral — including the main nave — is accessible via a side entrance ramp. The main entrance steps can be bypassed. Interior floors are stone but relatively flat. Some sections require assistance over threshold lips.",
  },
  {
    name: "Alcázar de Colón (Columbus Palace)",
    rating: "Moderate Accessibility",
    note:
      "The ground floor is accessible. The plaza (Plaza España) in front is paved with tiles and is smooth enough for most chairs. The upper floors require stairs. Focus on the ground-floor historical exhibits and the view from the plaza.",
  },
  {
    name: "Calle Las Damas (First Paved Street in the Americas)",
    rating: "Moderate Accessibility",
    note:
      "The most historic street in the New World has been partially repaved. Some sections are smooth enough; others retain original stone. Your guide will walk the most navigable path alongside the fortification walls.",
  },
  {
    name: "Fortaleza Ozama (Ozama Fortress)",
    rating: "Moderate Accessibility",
    note:
      "The main entrance and courtyard are accessible. The tower (Torre del Homenaje) requires stairs. The courtyard and grounds offer excellent views without needing to climb.",
  },
  {
    name: "Parque Colón (Columbus Park)",
    rating: "Good Accessibility",
    note:
      "The park itself is flat and paved. Benches are plentiful. Surrounding the park are cafes and restaurants, most with ground-floor access. This is a good rest stop midway through the tour.",
  },
  {
    name: "Museo de las Casas Reales",
    rating: "Good Accessibility",
    note:
      "Well-maintained colonial-era government building with accessible ground-floor galleries. One of the more wheelchair-friendly museum experiences in the Zona Colonial.",
  },
];

export default function Article7Page() {
  const touristAttractionSchema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: "Zona Colonial Santo Domingo — Wheelchair Accessible Tour",
    description:
      "Guided wheelchair-accessible tour of the first European city in the Americas — UNESCO World Heritage Site in Santo Domingo, Dominican Republic.",
    url: `https://www.meditrd.site${SLUG}`,
    touristType: ["Wheelchair Users", "Accessible Tourism"],
    address: { "@type": "PostalAddress", addressLocality: "Santo Domingo", addressCountry: "DO" },
  };

  return (
    <>
      <JsonLd schema={touristAttractionSchema} />

      <PageHero
        eyebrow="Blog · Santo Domingo"
        h1="Visiting Zona Colonial Santo Domingo in a Wheelchair — Complete Guide"
        intro="An honest, site-by-site accessibility breakdown of the oldest European settlement in the Americas, plus the exact route our guided tour follows."
        ctaMessage={CTA_MESSAGE}
        ctaLabel="Book the Tour"
      />

      <ArticleWrapper>
        <ArticleMeta>By Medit RD · Updated November 2025</ArticleMeta>
        <ArticleIntro>
          The Zona Colonial of Santo Domingo is the oldest European settlement in the Americas and a UNESCO World
          Heritage Site. For wheelchair users, it&apos;s one of the most historically significant — and most
          logistically challenging — destinations in the Caribbean. This guide gives you the honest picture:
          what&apos;s accessible, what isn&apos;t, and how to do it well.
        </ArticleIntro>

        <ArticleH2>The Zona Colonial Accessibility Situation — Honest Assessment</ArticleH2>
        <ArticleP>
          Many travel sites describe the Zona Colonial as &quot;accessible with some limitations.&quot; The honest
          version: most streets are cobblestone, uneven, or sloped. This creates real challenges for manual
          wheelchair users. Power wheelchair users navigate it significantly better. With the right guide and the
          right route, it&apos;s absolutely doable and deeply rewarding — but it requires planning.
        </ArticleP>
        <ArticleP>
          Who will find it easiest: power wheelchair and scooter users, especially with mid-wheel or rear-wheel
          drive models with good torque on uneven surfaces. Who will find it harder but manageable: manual
          wheelchair users with an able-bodied companion who can assist over cobblestone sections.
        </ArticleP>
        <ArticleP>
          Key advantage of a Medit RD tour: our guides know exactly which streets have been repaved with smooth
          surfaces, which monuments have flat approach paths, and where to find the best accessible restrooms.
        </ArticleP>

        <ArticleH2>Top Sites in Zona Colonial — Accessibility by Site</ArticleH2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {SITES.map((s) => (
            <div
              key={s.name}
              className="flex flex-col rounded-2xl border border-zinc-200 bg-medit-bg p-6 shadow-sm dark:border-zinc-800 dark:bg-[#0d1421]"
            >
              <h3 className="font-display text-base font-bold text-medit-fg dark:text-white">{s.name}</h3>
              <span className="mt-2 inline-block w-fit rounded-full bg-medit-teal/15 px-3 py-1 text-xs font-bold text-medit-teal-2 dark:text-medit-teal">
                {s.rating}
              </span>
              <p className="font-body mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{s.note}</p>
            </div>
          ))}
        </div>

        <ArticleH2>The Best Accessible Route Through Zona Colonial</ArticleH2>
        <ArticleP>Medit RD&apos;s guided tour follows a carefully planned accessible route:</ArticleP>
        <ArticleOL
          items={[
            "Drop-off at Plaza España — your van can access the plaza directly, avoiding the main pedestrian entry",
            "Alcázar de Colón — ground floor and plaza view",
            "Calle Las Damas — the most accessible section of the historic street",
            "Fortaleza Ozama courtyard — without tower climb",
            "Parque Colón — rest stop, Cathedral exterior and ground-floor visit",
            "Museo de las Casas Reales (optional)",
            "Return to van at pre-arranged pickup point",
          ]}
        />
        <ArticleP>
          Total rolling distance: approximately 800m–1km on this route — manageable for most wheelchair users.
        </ArticleP>

        <ArticleH2>Accessible Restaurants in Zona Colonial</ArticleH2>
        <ArticleUL
          items={[
            "Mesón de Bari — traditional Dominican food, ground-floor seating, near Parque Colón",
            "Restaurante Jalao — Dominican gastronomy, Calle Arzobispo Meriño, ground level",
            "El Conuco — traditional atmosphere, slightly outside the Zona but worth the accessible van ride",
          ]}
        />
        <ArticleP>
          Always confirm accessibility of restrooms when arriving — many colonial-era buildings have narrow
          bathroom doors.
        </ArticleP>

        <ArticleH2>Medit RD Zona Colonial Tour — What&apos;s Included</ArticleH2>
        <ArticleUL
          items={[
            "Round-trip transport in a ramp-equipped accessible van from your Santo Domingo hotel",
            "Bilingual guide (Spanish/English) with knowledge of accessible routes",
            "3–4 hour guided tour at your pace — no rushing",
            "Accessible restroom breaks planned into the route",
            "Flexible itinerary — if you're tired or want to stay longer somewhere, we adjust",
          ]}
        />

        <ArticleCtaBox ctaMessage={CTA_MESSAGE} ctaLabel="Book the Zona Colonial Tour">
          Book the Zona Colonial Accessible Tour. From $60–80 USD · Bilingual guide · Private accessible van.
        </ArticleCtaBox>

        <ArticleH2>Practical Tips for Your Zona Colonial Visit</ArticleH2>
        <ArticleUL
          items={[
            "Best time to visit: morning (8–11am) is cooler, less crowded, and better lit for photography",
            "What to wear: comfortable clothes, sun hat, and closed-toe shoes for the guide",
            "Water: bring a water bottle — the heat can be intense",
            "Currency: the tour price is in USD. Entrance fees to some monuments are in Dominican Pesos (DOP) — your guide carries change",
            "Photography: some churches and museums prohibit photography — your guide will advise on site",
          ]}
        />

        <ArticleH2>Combining Zona Colonial with Other Santo Domingo Attractions</ArticleH2>
        <ArticleUL
          items={[
            "Malecón promenade (flat, smooth, great views)",
            "Blue Mall shopping (fully accessible modern mall)",
            "Jardín Botánico Nacional (accessible sections with paved paths)",
            "Dinner at a Santo Domingo restaurant of your choice",
          ]}
        />
        <ArticleP>
          Ready to book? See pricing and availability on our <ArticleLink href="/zona-colonial-tour">Zona Colonial tour</ArticleLink> page, or
          combine it with our <ArticleLink href="/santo-domingo-airport-transfer">Santo Domingo airport transfer</ArticleLink> for a full day
          in the capital.
        </ArticleP>

        <ArticleH2>About Medit RD</ArticleH2>
        <ArticleP>
          Medit RD is the Dominican Republic&apos;s only certified wheelchair-accessible transportation and tours
          company. We&apos;ve guided hundreds of wheelchair users through the Zona Colonial and across the country.
          Our commitment: every person, every corner of the Dominican Republic.
        </ArticleP>
      </ArticleWrapper>

      <CtaBand
        heading="Ready to explore Zona Colonial?"
        subheading="Book the guided accessible tour — we'll handle the route, the pace, and the pickup."
        ctaMessage={CTA_MESSAGE}
      />
    </>
  );
}
