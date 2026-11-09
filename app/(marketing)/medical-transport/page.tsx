import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";
import JsonLd from "@/components/public/JsonLd";
import PageHero from "@/components/public/PageHero";
import TrustBar from "@/components/public/TrustBar";
import PageFAQ, { type FAQItem } from "@/components/public/PageFAQ";
import CtaBand from "@/components/public/CtaBand";

const SLUG = "/medical-transport";

export const metadata: Metadata = buildPageMetadata({
  slug: SLUG,
  title: "Medical Transportation Dominican Republic",
  description:
    "Reliable wheelchair transport to clinics, hospitals & therapy centers in Santo Domingo and Punta Cana. Discreet, punctual, certified.",
});

const FEATURES = [
  "Ramp-equipped van — no transferring out of the wheelchair",
  "Punctual pickup timed to your appointment, with buffer for traffic",
  "Trained, calm drivers experienced with patients and medical equipment",
  "Discreet, unmarked vehicles — no logos, no attention drawn",
  "Room for a companion or caregiver to ride along",
  "Available for one-off appointments or recurring therapy schedules",
];

const PLACES = ["CEDIMAT", "Hospital General Plaza de la Salud", "Clínica Corominas", "Clínica Abreu", "private therapy and rehab centers"];

const FAQS: FAQItem[] = [
  {
    q: "Which clinics and hospitals do you serve?",
    a: "We regularly transport patients to CEDIMAT, Hospital General Plaza de la Salud and Clínica Corominas in Santo Domingo, as well as clinics and therapy centers around Punta Cana and Bávaro. If your facility isn't listed, just send us the address on WhatsApp and we'll confirm the route.",
  },
  {
    q: "Can you accommodate a recurring schedule, like weekly dialysis or physical therapy?",
    a: "Yes. Many of our medical-transport clients book a standing weekly or bi-weekly slot for ongoing treatment. We'll set a consistent pickup time and driver so the routine stays predictable for you and your family.",
  },
  {
    q: "Do your drivers help getting in and out of the appointment, not just the van?",
    a: "Our drivers assist with the ramp, the van, and getting safely to the clinic's entrance or reception desk. For assistance inside the appointment itself (lifting onto an exam table, for example), that typically falls to clinic staff, but let us know your specific needs when booking and we'll tell you honestly what we can and can't help with.",
  },
  {
    q: "Is this different from a regular taxi or ambulance?",
    a: "Yes — we're not an ambulance and don't provide medical care in transit, but we're also not a regular taxi. Our vans are purpose-built with a wheelchair ramp and secure tie-downs, and our drivers are specifically trained to work calmly and carefully with patients, which makes us a good fit for non-emergency medical transport.",
  },
];

export default function MedicalTransportPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Non-emergency wheelchair medical transportation",
    name: "Wheelchair Medical Transportation — Dominican Republic",
    description:
      "Discreet, punctual wheelchair transport to clinics, hospitals and therapy centers in Santo Domingo and Punta Cana, Dominican Republic.",
    provider: { "@type": "LocalBusiness", name: "Medit RD", url: "https://www.meditrd.site", telephone: "+18293296920" },
    areaServed: [
      { "@type": "City", name: "Santo Domingo" },
      { "@type": "City", name: "Punta Cana" },
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
        eyebrow="Santo Domingo & Punta Cana"
        h1="Wheelchair Medical Transportation — DR"
        intro="Punctual, discreet wheelchair transport to clinics, hospitals and therapy centers, with drivers trained to work calmly and carefully with patients."
        ctaMessage="Hi, I need wheelchair medical transportation to a clinic/hospital appointment."
        ctaLabel="Request Medical Transport"
      />

      <TrustBar />

      <section className="bg-white px-4 py-16 dark:bg-black sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-medit-fg dark:text-white sm:text-4xl">
            Built for appointments, not just rides
          </h2>
          <p className="font-body mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Getting to a medical appointment shouldn&apos;t add stress on top of an already difficult day. Medit RD
            runs a dedicated wheelchair-accessible van for patients across Santo Domingo and Punta Cana, timed to
            arrive with enough buffer for traffic, and staffed by a driver who treats punctuality and discretion as
            part of the job — not an afterthought.
          </p>
          <p className="font-body mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            We regularly serve patients heading to {PLACES.join(", ")}, for everything from one-off specialist
            visits to standing weekly therapy schedules. A companion or caregiver is always welcome to ride along at
            no extra charge for the seat. If your trip follows a recent procedure rather than a routine appointment,
            our{" "}
            <a href="/post-surgery-transport" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
              post-surgery transport
            </a>{" "}
            service is built specifically for that.
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

          <h2 className="font-display mt-12 text-2xl font-bold text-medit-fg dark:text-white">Where we take patients</h2>
          <p className="font-body mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            In Santo Domingo, our most frequent destinations are CEDIMAT, Hospital General Plaza de la Salud and
            Clínica Corominas — all reachable as a standalone trip or combined with an{" "}
            <a href="/santo-domingo-airport-transfer" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
              SDQ airport transfer
            </a>{" "}
            if you&apos;re flying in specifically for care. In Punta Cana, we cover clinics and rehab centers across
            Bávaro and the surrounding resort corridor.
          </p>
        </div>
      </section>

      <PageFAQ items={FAQS} />

      <CtaBand
        heading="Need a dependable ride to your next appointment?"
        subheading="Tell us the clinic, the date and the time — we'll confirm your driver on WhatsApp."
        ctaMessage="Hi, I need wheelchair medical transportation to a clinic/hospital appointment."
      />
    </>
  );
}
