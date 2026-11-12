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
  ArticleCallout,
  ArticleCtaBox,
} from "../_components";

const SLUG = "/blog/wheelchair-medical-transport-dominican-republic";
const CTA_MESSAGE = "Hello, I need recurring wheelchair medical transport in Santo Domingo.";

export const metadata: Metadata = buildPageMetadata({
  slug: SLUG,
  title: "Wheelchair Accessible Medical Transport Dominican Republic",
  description:
    "Certified wheelchair-accessible medical transportation for dialysis, chemotherapy, physical therapy, and hospital appointments in Santo Domingo & Punta Cana. Available 24/7.",
});

const FAQS: FAQItem[] = [
  {
    q: "Can a family member or caregiver ride with the patient?",
    a: "Yes. One accompanying person rides at no extra charge. Additional companions can ride for a small fee depending on vehicle capacity.",
  },
  {
    q: "Do you have trained medical staff on board?",
    a: "No. Our drivers are trained in mobility assistance and patient-handling protocols, but Medit RD is not a medical service. We do not provide nursing care, medication management, or medical monitoring during transport. For patients who need a nurse escort, we recommend coordinating with your clinical team to have a nurse accompany the patient in our vehicle.",
  },
  {
    q: "What happens if the appointment runs very late?",
    a: "We ask you to WhatsApp us if your appointment is running significantly over time. For wait times beyond 2 hours, an additional waiting fee may apply. We will never leave without you.",
  },
  {
    q: "Is there an accessible vehicle for bariatric patients?",
    a: "Contact us with the patient's weight and wheelchair dimensions to confirm vehicle compatibility. We handle most bariatric cases but need dimensions in advance.",
  },
];

export default function Article4Page() {
  const medicalBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "Medit RD — Wheelchair Medical Transport",
    description:
      "Non-emergency wheelchair-accessible medical transportation for hospital appointments, dialysis, chemotherapy, and physical therapy in the Dominican Republic.",
    url: "https://www.meditrd.site",
    telephone: "+18293296920",
    areaServed: [{ "@type": "City", name: "Santo Domingo" }, { "@type": "City", name: "Punta Cana" }],
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
      <JsonLd schema={[medicalBusinessSchema, faqSchema]} />

      <PageHero
        eyebrow="Blog · Medical Transport"
        h1="Wheelchair Accessible Medical Transportation in Dominican Republic"
        intro="Dialysis, chemotherapy, physical therapy, and hospital appointments — non-emergency accessible transport for patients in Santo Domingo and Punta Cana."
        ctaMessage={CTA_MESSAGE}
        ctaLabel="Set Up Medical Transport"
      />

      <ArticleWrapper>
        <ArticleMeta>By Medit RD · Updated November 2025</ArticleMeta>
        <ArticleIntro>
          For wheelchair users in the Dominican Republic, getting to medical appointments is one of the most
          critical — and most difficult — logistics challenges of daily life. Standard taxis won&apos;t work.
          Ambulances are for emergencies. Non-emergency wheelchair-accessible medical transport is a category that
          barely existed in the DR before Medit RD began operations.
        </ArticleIntro>

        <ArticleCallout emoji="⚠️">
          Important: Medit RD provides non-emergency medical transport — scheduled trips to and from appointments.
          For medical emergencies, call 911 or SEMED (829-200-7000).
        </ArticleCallout>

        <ArticleH2>What Is Non-Emergency Medical Transportation (NEMT)?</ArticleH2>
        <ArticleP>
          NEMT covers scheduled transportation for medical appointments where the patient does not need an ambulance
          but cannot use standard transportation. This includes patients who:
        </ArticleP>
        <ArticleUL
          items={[
            "Use a manual or power wheelchair that cannot be loaded into a regular vehicle",
            "Are recovering from surgery and cannot transfer to a standard seat",
            "Have mobility limitations that make standard taxis unsafe or inaccessible",
            "Require regular transport to recurring appointments (dialysis 3x/week, chemotherapy, etc.)",
          ]}
        />

        <ArticleH2>Medical Services Medit RD Supports</ArticleH2>

        <ArticleH3>Dialysis Transport</ArticleH3>
        <ArticleP>
          Dialysis patients typically need transport to a dialysis center 3 times per week, often early in the
          morning before the center opens. Medit RD offers recurring dialysis transport contracts — the same
          driver, the same time, every session. No rebooking required each week. Santo Domingo and surrounding
          areas.
        </ArticleP>

        <ArticleH3>Oncology &amp; Chemotherapy Transport</ArticleH3>
        <ArticleP>
          Chemotherapy patients often experience fatigue and weakness after treatment, making taxi rides unsafe.
          Medit RD provides door-to-door transport with a trained driver who can assist with boarding and
          deboarding. We coordinate with the clinical team&apos;s schedule.
        </ArticleP>

        <ArticleH3>Post-Surgery Recovery Transport</ArticleH3>
        <ArticleP>
          After major orthopedic, abdominal, or neurological surgeries, patients may require a wheelchair for weeks
          or months. Medit RD handles all post-surgery transfers from hospital discharge through follow-up
          appointments and physical therapy.
        </ArticleP>

        <ArticleH3>Physical Therapy &amp; Rehabilitation</ArticleH3>
        <ArticleP>
          Rehabilitation programs often require visits 2–5 times per week. Medit RD offers subscription-style
          service for rehab patients — book your full month of appointments in one WhatsApp conversation and we
          handle the rest.
        </ArticleP>

        <ArticleH3>Specialist Consultations &amp; Diagnostic Appointments</ArticleH3>
        <ArticleP>
          Orthopedics, neurology, cardiology, ophthalmology — any specialist appointment requiring wheelchair
          transport in Santo Domingo or Punta Cana.
        </ArticleP>

        <ArticleH2>Why Hospitals and Clinics Recommend Medit RD</ArticleH2>
        <ArticleUL
          items={[
            "Reliability: we show up on time, every time",
            "Professionalism: drivers are trained in patient handling and discretion",
            "Safety: patients remain in their wheelchair during the entire ride — no dangerous transfers required",
            "Flexibility: appointments run late — we wait without rushing the patient",
            "WhatsApp coordination: families can coordinate transport for elderly parents without speaking directly to a dispatcher",
          ]}
        />

        <ArticleCtaBox ctaMessage={CTA_MESSAGE} ctaLabel="Set Up Recurring Transport">
          Set up recurring medical transport for your patient or family member. Share the appointment schedule and
          we build a transport plan.
        </ArticleCtaBox>

        <ArticleH2>Medical Transport for International Visitors</ArticleH2>
        <ArticleP>Common scenarios we handle for visitors:</ArticleP>
        <ArticleUL
          items={[
            "Guest sustained an injury at a Punta Cana resort and needs transport to a clinic",
            "Traveler arrived with a temporary wheelchair after surgery and needs airport-to-hotel transfer",
            "Long-term expat needs recurring medical transport in Santo Domingo",
            "Family member was hospitalized and needs daily accessible transport for hospital visits",
          ]}
        />

        <ArticleH2>Pricing for Medical Transport</ArticleH2>
        <ArticleTable
          headers={["Service Type", "Price Range (DOP)", "Notes"]}
          rows={[
            ["Single appointment trip (SD, within city)", "RD$1,800–3,500", "One way"],
            ["Round trip appointment (wait & return)", "RD$3,500–6,000", "Includes wait time up to 2 hrs"],
            ["Monthly recurring plan (3x/week)", "Contact for quote", "Dialysis, rehab, etc."],
            ["SD ↔ Punta Cana medical transfer", "USD $250", "Either direction"],
            ["Airport ↔ Hospital (international patient)", "From RD$2,500", "SDQ or PUJ"],
          ]}
        />

        <ArticleH2>How to Arrange Medical Transport</ArticleH2>
        <ArticleP>
          WhatsApp us at +1 (829) 329-6920 with the patient&apos;s name, appointment details, and wheelchair type.
          For recurring appointments, share the full schedule (days, times, clinic address). For same-day needs,
          contact us as early as possible.
        </ArticleP>

        <ArticleH2>About Medit RD</ArticleH2>
        <ArticleP>
          Medit RD is the Dominican Republic&apos;s first and only certified wheelchair-accessible transportation
          company. We operate 24/7 across Santo Domingo, Punta Cana, La Romana, and surrounding areas.
        </ArticleP>
      </ArticleWrapper>

      <PageFAQ items={FAQS} eyebrow="Medical transport questions" heading="Frequently Asked Questions" />

      <CtaBand
        heading="Need recurring medical transport?"
        subheading="Share the patient's appointment schedule and we'll build a reliable transport plan."
        ctaMessage={CTA_MESSAGE}
      />
    </>
  );
}
