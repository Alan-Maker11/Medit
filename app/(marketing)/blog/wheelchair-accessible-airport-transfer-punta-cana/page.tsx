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
  ArticleP,
  ArticleUL,
  ArticleOL,
  ArticleTable,
  ArticleCallout,
  ArticleCtaBox,
} from "../_components";

const SLUG = "/blog/wheelchair-accessible-airport-transfer-punta-cana";
const CTA_MESSAGE = "Hi, I need a wheelchair accessible airport transfer in Punta Cana.";

export const metadata: Metadata = buildPageMetadata({
  slug: SLUG,
  title: "Wheelchair Accessible Airport Transfer Punta Cana — Complete 2025 Guide",
  description:
    "Everything wheelchair users need to know about airport transfers in Punta Cana. Ramp-equipped vehicles, flight tracking, pricing, and how to book in 2 minutes via WhatsApp.",
});

const FAQS: FAQItem[] = [
  {
    q: "Can I bring a companion in the same vehicle?",
    a: "Yes. Up to 3 companions can ride in the same vehicle at no extra charge. The vehicle is private — it's yours for the entire trip.",
  },
  {
    q: "What if my flight is delayed significantly?",
    a: "Your driver tracks your flight and adjusts. Delays up to 60 minutes are covered at no extra charge. For longer delays, we ask that you contact us via WhatsApp and we will reschedule at no cost.",
  },
  {
    q: "Do you pick up at all terminals?",
    a: "Yes. Punta Cana airport has two main terminals (domestic and international). We meet you in the arrivals hall of whichever terminal your flight uses.",
  },
  {
    q: "Is payment in cash or card?",
    a: "Both are accepted. Cash (USD or Dominican Pesos) has no surcharge. Card and app payments carry a 6% processing fee.",
  },
];

export default function Article1Page() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Wheelchair Accessible Airport Transfer Punta Cana — Complete 2025 Guide",
    description:
      "Everything wheelchair users need to know about airport transfers in Punta Cana — from PUJ airport to Bávaro, Cap Cana, La Romana, and beyond.",
    author: { "@type": "Organization", name: "Medit RD", url: "https://www.meditrd.site" },
    publisher: {
      "@type": "Organization",
      name: "Medit RD",
      logo: { "@type": "ImageObject", url: "https://www.meditrd.site/medit-logo.png" },
    },
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
        eyebrow="Blog · Punta Cana"
        h1="Wheelchair Accessible Airport Transfer Punta Cana — Complete Guide"
        intro="Everything you need to know about getting from PUJ to your hotel safely and comfortably — vehicles, pricing, flight tracking, and how to book."
        ctaMessage={CTA_MESSAGE}
        ctaLabel="Book Your Transfer"
      />

      <ArticleWrapper>
        <ArticleMeta>By Medit RD · Updated November 2025 · 7-min read</ArticleMeta>
        <ArticleIntro>
          Arriving at Punta Cana International Airport (PUJ) in a wheelchair presents a challenge most travel guides
          don&apos;t address: standard taxis and shuttle services cannot accommodate wheelchairs. This guide covers
          everything you need — from what to expect at PUJ to how to book a certified accessible transfer to any
          hotel in Bávaro, Cap Cana, or La Romana.
        </ArticleIntro>

        <ArticleCallout>
          Quick answer: the only certified wheelchair-accessible transport service operating at PUJ is Medit RD. Book
          via WhatsApp at +1 (829) 329-6920 at least 24 hours before your flight.
        </ArticleCallout>

        <ArticleH2>What to Expect at Punta Cana Airport (PUJ) for Wheelchair Users</ArticleH2>
        <ArticleP>
          Punta Cana International Airport has basic accessibility infrastructure — wheelchair assistance at
          check-in and gates is available through airlines — but the landside transport situation is a different
          story. Regular taxi queues at PUJ do not have adapted vehicles. The official shuttle services use standard
          vans. If you need a vehicle with a ramp, you must arrange private accessible transport in advance.
        </ArticleP>
        <ArticleP>What PUJ does have:</ArticleP>
        <ArticleUL
          items={[
            "Wheelchair assistance from the gate to arrivals (via your airline)",
            "Smooth terminal floors with no major barriers",
            "Accessible restrooms in the main terminal",
            "Covered pickup bay for pre-arranged private transfers",
          ]}
        />
        <ArticleP>What PUJ does not reliably have:</ArticleP>
        <ArticleUL
          items={[
            "Accessible public taxis at the taxi stand",
            "Shuttle services that can load a power wheelchair",
            "On-site rental wheelchairs for landside use",
          ]}
        />

        <ArticleH2>Medit RD Airport Transfer — What&apos;s Included</ArticleH2>
        <ArticleP>When you book an airport transfer with Medit RD, every service includes:</ArticleP>
        <ArticleUL
          items={[
            "Ramp entry — no manual lifting required",
            "Tie-down and securement system for your wheelchair in transit",
            "Flight tracking — your driver monitors your flight in real time and adjusts arrival time for delays (up to 60 minutes at no extra charge)",
            "Meet and greet inside arrivals with a name sign",
            "Door-to-door service from the terminal to your hotel room entrance",
            "Air-conditioned vehicle",
            "Certified and insured driver trained in wheelchair assistance",
            "24/7 WhatsApp support before, during, and after your trip",
          ]}
        />

        <ArticleH2>Punta Cana Airport Transfer Pricing (2025)</ArticleH2>
        <ArticleTable
          headers={["Destination", "Starting Price (USD)", "Approx. Drive Time"]}
          rows={[
            ["Bávaro / Punta Cana hotel zone", "$120", "20–35 min"],
            ["Cap Cana", "$80", "10–20 min"],
            ["Macao", "$180", "35–50 min"],
            ["Higüey", "$100", "25–35 min"],
            ["La Romana", "$120", "60–75 min"],
            ["Santo Domingo", "$250", "2.5–3 hrs"],
          ]}
        />
        <ArticleP>
          Prices are for a private accessible vehicle. No shared vans — you have the full vehicle. A 6% processing
          fee applies if paying by card or app.
        </ArticleP>

        <ArticleH2>How to Book Your Punta Cana Wheelchair Transfer</ArticleH2>
        <ArticleOL
          items={[
            "WhatsApp Medit RD at +1 (829) 329-6920 at least 24 hours before arrival",
            "Share your flight number, arrival date/time, and hotel name",
            "Tell us your wheelchair type (manual, power, scooter) and dimensions if known",
            "Confirm the booking and receive driver details the day before your flight",
          ]}
        />

        <ArticleCtaBox ctaMessage={CTA_MESSAGE} ctaLabel="Book Your Airport Transfer">
          Ready to book your Punta Cana airport transfer? WhatsApp us now — we reply within 15 minutes.
        </ArticleCtaBox>

        <ArticleH2>Can I Book a Round-Trip Transfer?</ArticleH2>
        <ArticleP>
          Yes. Round-trip bookings are available at a discounted rate. Mention both your arrival and departure
          details when you first contact us. For departure transfers, we recommend scheduling your pickup at least
          3.5 hours before your flight time given PUJ&apos;s international departure process.
        </ArticleP>

        <ArticleH2>What About Power Wheelchairs and Scooters?</ArticleH2>
        <ArticleP>
          Our vehicles can accommodate most standard power wheelchairs and mobility scooters. The vehicle entry width
          accommodates chairs up to 30 inches / 76 cm wide. For bariatric or non-standard chairs, please share
          dimensions when booking so we can confirm fit. We do not charge extra for power wheelchair transport.
        </ArticleP>

        <ArticleH2>Tips for Wheelchair Users Traveling to the Dominican Republic</ArticleH2>
        <ArticleUL
          items={[
            "Book transport before you book your hotel — confirm your chosen transfer service actually operates accessible vehicles",
            "Check resort accessibility — ask specifically about pool lift, room door width, and bathroom layout",
            "Keep Medit RD's number saved for same-day transport needs",
            "Currency: the Dominican Peso (DOP) is official; USD is widely accepted in tourist areas; Medit RD accepts both",
          ]}
        />

        <ArticleH2>About Medit RD</ArticleH2>
        <ArticleP>
          Medit RD is the Dominican Republic&apos;s only dedicated wheelchair-accessible transportation company. We
          serve Punta Cana, Santo Domingo, La Romana, Bávaro, and Cap Cana with ramp-equipped vehicles, certified
          drivers, and 24/7 WhatsApp support. We are GPS-tracked, fully insured, and committed to making the
          Dominican Republic accessible for every traveler.
        </ArticleP>
      </ArticleWrapper>

      <PageFAQ items={FAQS} eyebrow="Airport transfer questions" heading="Frequently Asked Questions" />

      <CtaBand
        heading="Ready to book your Punta Cana airport transfer?"
        subheading="Send us your flight number and hotel name — we'll confirm your ramp-equipped pickup within minutes."
        ctaMessage={CTA_MESSAGE}
      />
    </>
  );
}
