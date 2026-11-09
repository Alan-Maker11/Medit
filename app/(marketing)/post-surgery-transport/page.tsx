import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";
import JsonLd from "@/components/public/JsonLd";
import PageHero from "@/components/public/PageHero";
import TrustBar from "@/components/public/TrustBar";
import PageFAQ, { type FAQItem } from "@/components/public/PageFAQ";
import CtaBand from "@/components/public/CtaBand";

const SLUG = "/post-surgery-transport";

export const metadata: Metadata = buildPageMetadata({
  slug: SLUG,
  title: "Post-Surgery Transport Dominican Republic",
  description:
    "Safe, discreet transportation after procedures in the DR. Reclining seats, no stairs, trained drivers. Santo Domingo & Punta Cana.",
});

const FEATURES = [
  "Reclining seats and extra legroom — no need to sit fully upright",
  "No stairs: ramp access from curb to seat, every time",
  "Smooth, careful driving with advance notice of bumps or turns",
  "Trained drivers comfortable assisting a recovering patient",
  "Room for a caregiver or companion at no extra charge for the seat",
  "Flexible scheduling around follow-up appointments",
];

const FAQS: FAQItem[] = [
  {
    q: "What kind of procedures do you typically support?",
    a: "We've transported patients recovering from orthopedic surgery, cosmetic procedures, and general post-operative care, among others. We don't provide medical supervision — we provide safe, comfortable, stair-free transport — so please confirm with your surgeon or clinic that ground transport is appropriate for your specific recovery stage.",
  },
  {
    q: "Can the seat recline?",
    a: "Yes, our vehicles have reclining seats and we're happy to adjust the angle before you get in, based on what your recovery requires. Tell us in advance and we'll have it set up.",
  },
  {
    q: "Do you only do airport-to-clinic trips, or also clinic-to-hotel and follow-ups?",
    a: "All of the above. Many clients book us for the initial pickup after a procedure, then again for follow-up visits over the following days or weeks. We're happy to set a recurring schedule if that's easier.",
  },
  {
    q: "Is this available in both Punta Cana and Santo Domingo?",
    a: "Yes, we run post-surgery transport in both regions. If your procedure is in Santo Domingo at a facility like CEDIMAT or Clínica Corominas, see our medical transportation page for more on those routes specifically.",
  },
];

export default function PostSurgeryTransportPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Post-surgery patient transportation",
    name: "Post-Surgery Transport — Dominican Republic",
    description:
      "Safe, discreet, stair-free transportation after medical procedures, with reclining seats and trained drivers, in Santo Domingo and Punta Cana.",
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
        h1="Post-Surgery Transport in the Dominican Republic"
        intro="Careful, stair-free transport after a procedure — reclining seats, no lifting, and a driver trained to go slow when it matters."
        ctaMessage="Hi, I need post-surgery transport in the Dominican Republic."
        ctaLabel="Arrange Post-Surgery Transport"
      />

      <TrustBar />

      <section className="bg-white px-4 py-16 dark:bg-black sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-medit-fg dark:text-white sm:text-4xl">
            The ride that respects your recovery
          </h2>
          <p className="font-body mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Leaving a clinic or hospital after a procedure is already a lot to manage — the last thing you need is a
            bumpy ride or a vehicle with steps up into it. Medit RD&apos;s vans were built around wheelchair access
            from the start, which happens to make them a genuinely good fit for post-surgery recovery too: no
            stairs, a ramp instead of a high step-up, and seats that recline so you&apos;re not forced upright the
            whole way.
          </p>
          <p className="font-body mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Our drivers are used to going slower on bumps, giving advance notice before turns, and simply not
            rushing a patient who needs a minute to get settled. We serve both Santo Domingo and Punta Cana, and
            can coordinate directly with your clinic&apos;s discharge timing. If your trip starts at the airport,
            pair this with our{" "}
            <a href="/santo-domingo-airport-transfer" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
              SDQ airport transfer
            </a>{" "}
            or{" "}
            <a href="/punta-cana-airport-transfer" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
              PUJ airport transfer
            </a>
            . For ongoing treatment rather than a one-off recovery trip, see{" "}
            <a href="/medical-transport" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
              medical transportation
            </a>
            .
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

          <h2 className="font-display mt-12 text-2xl font-bold text-medit-fg dark:text-white">Booking ahead of a procedure</h2>
          <p className="font-body mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            If you already know your discharge date, message us ahead of time and we&apos;ll hold the slot. If
            plans shift — procedures often do — just update us on WhatsApp and we&apos;ll adjust at no extra charge
            for a same-day change.
          </p>
        </div>
      </section>

      <PageFAQ items={FAQS} />

      <CtaBand
        heading="Planning a procedure and need transport sorted?"
        subheading="Reach out before your date and we'll have a van ready for discharge day."
        ctaMessage="Hi, I need post-surgery transport in the Dominican Republic."
      />
    </>
  );
}
