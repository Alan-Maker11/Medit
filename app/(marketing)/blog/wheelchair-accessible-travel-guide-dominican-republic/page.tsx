import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";
import JsonLd from "@/components/public/JsonLd";
import PageHero from "@/components/public/PageHero";
import PageFAQ, { type FAQItem } from "@/components/public/PageFAQ";
import CtaBand from "@/components/public/CtaBand";
import {
  ArticleWrapper,
  ArticleMeta,
  ArticleIntro,
  ArticleH2,
  ArticleH3,
  ArticleP,
  ArticleUL,
  ArticleTable,
  ArticleCtaBox,
} from "../_components";

const SLUG = "/blog/wheelchair-accessible-travel-guide-dominican-republic";
const CTA_MESSAGE = "Hi, I'm planning a wheelchair-accessible trip to the Dominican Republic.";

export const metadata: Metadata = buildPageMetadata({
  slug: SLUG,
  title: "Wheelchair Accessible Travel Guide Dominican Republic 2025",
  description:
    "Complete wheelchair accessible travel guide for the Dominican Republic. Airports, hotels, beaches, tours, and transport — everything a wheelchair user needs to plan a trip to Punta Cana or Santo Domingo.",
});

const FAQS: FAQItem[] = [
  {
    q: "Is the Dominican Republic wheelchair friendly?",
    a: "Honestly, it's improving but not yet comparable to the US or Western Europe. The tourist infrastructure in Punta Cana is better than the general public infrastructure. With proper planning — especially transport — wheelchair users can have an excellent experience.",
  },
  {
    q: "Can I bring my power wheelchair on a flight to Punta Cana?",
    a: "Yes. All major airlines flying into PUJ must accept power wheelchairs in cargo with advance notice. Notify your airline at the time of booking, not at check-in. Remove any lithium batteries per airline policy and carry them in the cabin.",
  },
  {
    q: "Is tipping expected for accessible transport drivers?",
    a: "Tipping is appreciated but not required. A $5–10 USD tip for excellent service is a kind gesture.",
  },
];

export default function Article5Page() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Wheelchair Accessible Travel Guide Dominican Republic 2025",
    description:
      "Complete planning guide for wheelchair users traveling to the Dominican Republic — airports, hotels, beaches, transport, and practical tips.",
    author: { "@type": "Organization", name: "Medit RD" },
    datePublished: "2025-11-01",
    dateModified: "2025-11-01",
    mainEntityOfPage: `https://www.meditrd.site${SLUG}`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a as string },
    })),
  };

  return (
    <>
      <JsonLd schema={[articleSchema, faqSchema]} />

      <PageHero
        eyebrow="Blog · Dominican Republic"
        h1="Wheelchair Accessible Travel Guide to the Dominican Republic (2025)"
        intro="Airports, hotels, beaches, transport, and practical tips — everything a wheelchair user needs to plan a trip to Punta Cana or Santo Domingo."
        ctaMessage={CTA_MESSAGE}
        ctaLabel="Plan My Trip"
      />

      <ArticleWrapper>
        <ArticleMeta>By Medit RD · Updated November 2025 · Complete guide</ArticleMeta>
        <ArticleIntro>
          The Dominican Republic is one of the Caribbean&apos;s most visited destinations — but its accessibility
          infrastructure is uneven. With the right preparation and the right transport, wheelchair users can have an
          extraordinary experience in Punta Cana, Santo Domingo, and beyond. This guide covers everything you need
          to know before you arrive.
        </ArticleIntro>

        <ArticleH2>Airports — PUJ (Punta Cana) and SDQ (Santo Domingo)</ArticleH2>

        <ArticleH3>Punta Cana International Airport (PUJ) — Moderate Accessibility</ArticleH3>
        <ArticleP>
          PUJ is the busier of the two airports for international arrivals. The main terminal has wheelchair
          assistance available through airlines (request at check-in), smooth terminal floors at the gate and
          baggage claim level, some steps between levels that may require staff assistance, and no accessible taxis
          at the taxi stand — private accessible transport must be pre-arranged.
        </ArticleP>
        <ArticleP>
          Recommendation: pre-arrange your Medit RD transfer before arriving. Do not expect to find accessible
          transport at the airport upon arrival.
        </ArticleP>

        <ArticleH3>Las Américas International Airport (SDQ) — Santo Domingo — Moderate Accessibility</ArticleH3>
        <ArticleP>
          SDQ has undergone partial modernization. The international terminal has flat surfaces and elevator access
          between levels. Landside transport for wheelchair users has the same limitation as PUJ — you must
          pre-arrange private accessible transport.
        </ArticleP>

        <ArticleH2>Getting Around — The Transport Problem (and Solution)</ArticleH2>
        <ArticleTable
          headers={["Transport Type", "Wheelchair Accessible?", "Notes"]}
          rows={[
            ["Standard taxi (taxi convencional)", "No", "No ramp, no securement"],
            ["Uber / InDrive", "No", "Drivers can and do cancel"],
            ["Resort shuttle", "No", "Standard step-entry buses"],
            ["OMSA public bus", "No", "No ramp or securement"],
            ["Medit RD private accessible van", "Yes", "Ramp, tie-down, certified driver"],
          ]}
        />
        <ArticleP>
          The only viable option for wheelchair users is Medit RD. Pre-book all transport before your trip. Do not
          arrive expecting to find accessible taxis on demand.
        </ArticleP>

        <ArticleCtaBox ctaMessage={CTA_MESSAGE} ctaLabel="Plan My Trip on WhatsApp">
          Book all your Dominican Republic transport with Medit RD. One WhatsApp contact handles all your transfers,
          tours, and medical trips.
        </ArticleCtaBox>

        <ArticleH2>Accessible Hotels in Punta Cana — What to Ask</ArticleH2>
        <ArticleP>Before booking, ask these specific questions:</ArticleP>
        <ArticleUL
          items={[
            'What is the width of the bedroom door? (Minimum 32" / 81cm for most wheelchairs)',
            "Is the bathroom roll-in shower or a tub? Is there a shower bench?",
            "Does the room connect directly to the pool deck without steps?",
            "Is the accessible room near the beach or far from it?",
            "Is there a beach matting path to the water?",
            "Is the main restaurant accessible without stairs?",
          ]}
        />

        <ArticleH3>Resort Areas by Accessibility</ArticleH3>
        <ArticleUL
          items={[
            "Cap Cana: most accessible — newer development with wider paths, flatter terrain, and more thoughtfully designed resort infrastructure",
            "Bávaro/Punta Cana hotel zone: variable — older resorts may have accessibility limitations. Newer resorts (Grand Hyatt, Hard Rock) are generally better",
            "La Romana / Bayahibe: variable — Casa de Campo is a notable exception with good grounds accessibility",
          ]}
        />

        <ArticleH2>Accessible Beaches in Punta Cana</ArticleH2>

        <ArticleH3>Beach Matting</ArticleH3>
        <ArticleP>
          Some all-inclusive resorts now install floating beach mats (also called mobi-mat or beach access matting)
          that create a firm surface from the pool deck to the water&apos;s edge. Ask your resort specifically about
          this feature.
        </ArticleP>

        <ArticleH3>Amphibious/Beach Wheelchairs</ArticleH3>
        <ArticleP>
          Several resorts in the Bávaro strip offer free amphibious beach wheelchairs (floating chairs with large
          balloon tires that can enter the water). These must be reserved in advance. Medit RD can transport you to
          any resort offering this service.
        </ArticleP>

        <ArticleH2>Santo Domingo Accessibility</ArticleH2>

        <ArticleH3>Zona Colonial — Partly Accessible</ArticleH3>
        <ArticleP>
          The Zona Colonial (UNESCO World Heritage Site) has primarily cobblestone streets, which are challenging
          but navigable for power wheelchairs. Some of the most important monuments have wheelchair-accessible
          routes or ground-floor access. A local guide who knows the accessible routes is essential. Medit RD&apos;s
          Zona Colonial tour navigates the flattest accessible paths.
        </ArticleP>

        <ArticleH3>Malecón (Waterfront) — Accessible</ArticleH3>
        <ArticleP>
          The Malecón waterfront promenade is flat and smooth, with ramp access at regular intervals. It&apos;s one
          of the most accessible public spaces in the city.
        </ArticleP>

        <ArticleH3>Shopping and Modern Areas — Generally Accessible</ArticleH3>
        <ArticleP>
          Modern malls (Acropolis, Blue Mall, Agora) have elevators, accessible parking, and smooth internal
          surfaces.
        </ArticleP>

        <ArticleH2>Medical and Health Services</ArticleH2>
        <ArticleP>
          Punta Cana: Centro Médico Punta Cana (near Bávaro) is the main private clinic for the tourist area. For
          serious cases, transfer to Santo Domingo is common. Santo Domingo: Clínica Abreu, Hospital General Plaza
          de la Salud, and CEDIMAT are well-regarded private facilities. Dialysis: multiple dialysis centers exist
          in Santo Domingo. Medit RD provides transport to all of these facilities.
        </ArticleP>

        <ArticleH2>Pre-Trip Accessibility Checklist</ArticleH2>
        <ArticleUL
          items={[
            "Book Medit RD airport transfer for arrival AND departure (at least 48h in advance)",
            "Ask resort specifically about room door width, shower type, and beach access",
            "Confirm resort has beach matting or amphibious wheelchair if beach access is a priority",
            "Save Medit RD's WhatsApp number: +1 (829) 329-6920",
            "Bring proof of your wheelchair brand/model in case of airline questions",
            "Carry any prescription medications with documentation (customs requirement)",
            "Purchase travel insurance that covers medical evacuation",
            "If you need dialysis, arrange with a Santo Domingo center 4+ weeks in advance",
            "Book any tours with Medit RD before arrival for high-season travel (Dec–Apr)",
          ]}
        />

        <ArticleH2>About Medit RD</ArticleH2>
        <ArticleP>
          Medit RD is the Dominican Republic&apos;s first and only certified wheelchair-accessible transportation
          company. We serve airport transfers, medical transport, and tours in Punta Cana, Santo Domingo, La Romana,
          and Cap Cana.
        </ArticleP>
      </ArticleWrapper>

      <PageFAQ items={FAQS} eyebrow="Trip-planning questions" heading="Frequently Asked Questions" />

      <CtaBand
        heading="Ready to plan your accessible DR trip?"
        subheading="Send us your dates and destination — we'll help you line up transport, tours, and transfers."
        ctaMessage={CTA_MESSAGE}
      />
    </>
  );
}
