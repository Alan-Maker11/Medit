import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";
import JsonLd from "@/components/public/JsonLd";
import PageHero from "@/components/public/PageHero";
import CtaBand from "@/components/public/CtaBand";

const SLUG = "/accessible-resorts-punta-cana";

export const metadata: Metadata = buildPageMetadata({
  slug: SLUG,
  title: "Wheelchair Accessible Resorts Punta Cana",
  description:
    "The most accessible all-inclusive resorts in Punta Cana, ranked for mobility. Plus: how to book adapted transport from each.",
});

const RESORTS = [
  {
    name: "Hard Rock Hotel & Casino Punta Cana",
    score: 4,
    works: "Large, mostly flat property with wide walkways between buildings; several accessible rooms with roll-in showers; elevators throughout the main towers.",
    doesnt: "It's a huge resort — expect long distances between your room, the beach and restaurants, which adds up over a stay even with flat ground.",
    tip: "Request a room in a tower closest to the lobby and beach boardwalk, and book your airport transfer in advance so you're not navigating the (large) arrivals area alone.",
  },
  {
    name: "Iberostar Grand Bávaro",
    score: 3,
    works: "Adults-only section is relatively compact with paved paths; staff are generally attentive to mobility requests.",
    doesnt: "Some pathways between the pool and beach have gentle but noticeable slopes, and not every restaurant has step-free entry — ask before booking a specific accessible room.",
    tip: "Confirm your exact room's bathroom door width and shower type directly with the resort before arrival; 'accessible' listings here vary room to room.",
  },
  {
    name: "Paradisus Palma Real",
    score: 4,
    works: "Buggy service is available resort-wide and used proactively by staff for guests with mobility needs; beach boardwalk is flat and well-maintained.",
    doesnt: "The resort spans a large area, so without using the buggy service, distances on foot (or by wheelchair) between sections are significant.",
    tip: "Ask for buggy pickup at your room each morning rather than relying on walking — staff are used to the request and it makes the whole stay easier.",
  },
  {
    name: "Hyatt Ziva Cap Cana",
    score: 5,
    works: "Newer construction with genuinely wide doorways, roll-in showers in accessible rooms, flat pool decks, and a relatively compact layout compared to mega-resorts.",
    doesnt: "Being in Cap Cana rather than central Bávaro, it's a bit further from PUJ airport and from some off-resort excursions.",
    tip: "Our Cap Cana airport transfer runs from $55 — book it alongside your stay since Cap Cana taxis are less frequent than in central Bávaro.",
  },
  {
    name: "Excellence Playa Mujeres",
    score: 3,
    works: "Adults-only, generally calm property with paved main paths and attentive staff.",
    doesnt: "Note: this property's accessibility features can vary by building and renovation phase — some walkways include steps that aren't obvious from marketing photos, so direct confirmation is essential.",
    tip: "Request photos or a video call with the front desk before booking a specific room category if full wheelchair access is essential.",
  },
  {
    name: "Club Med Michès Playa Esmeralda",
    score: 2,
    works: "A newer property (opened 2022) in the less-developed Miches area, with modern construction standards that generally help with doorway widths and flooring.",
    doesnt: "This is a newer resort and we have limited first-hand accessibility information on it so far — treat this score as preliminary rather than a firm rating, and we'd recommend extra direct verification with the resort before booking.",
    tip: "Because Miches is further from PUJ than Bávaro or Cap Cana, budget extra transfer time and book your accessible van well in advance.",
  },
];

export default function AccessibleResortsPuntaCanaPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Best Wheelchair-Accessible Resorts in Punta Cana",
    description:
      "The most accessible all-inclusive resorts in Punta Cana, ranked for mobility, with transport tips for each.",
    author: { "@type": "Organization", name: "Medit RD" },
    publisher: { "@type": "Organization", name: "Medit RD", url: "https://www.meditrd.site" },
    mainEntityOfPage: `https://www.meditrd.site${SLUG}`,
  };

  return (
    <>
      <JsonLd schema={articleSchema} />

      <PageHero
        eyebrow="Guide"
        h1="Best Wheelchair-Accessible Resorts in Punta Cana"
        intro="Six resorts we've actually moved guests in and out of, scored honestly on real mobility conditions — not marketing copy."
        ctaMessage="Hi, I'm choosing a resort in Punta Cana and want advice on accessibility and transport."
        ctaLabel="Ask Us on WhatsApp"
      />

      <article className="bg-white px-4 py-16 dark:bg-black sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-medit-fg dark:text-white sm:text-4xl">
            How we score these resorts
          </h2>
          <p className="font-body mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Our scores (out of 5) come from our own drivers&apos; experience picking up and dropping off guests at each
            property — what the walkways, lobbies and room access actually look like in practice, not what the
            resort&apos;s own website claims. A high score means a wheelchair user can expect a genuinely easy stay; a
            lower score doesn&apos;t mean &quot;don&apos;t go,&quot; it means plan ahead and ask more specific questions before you
            book. For a broader look at what to expect across the region, read our{" "}
            <a href="/punta-cana-wheelchair-guide" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
              complete Punta Cana wheelchair guide
            </a>
            .
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {RESORTS.map((r) => (
              <div
                key={r.name}
                className="flex flex-col rounded-2xl border border-zinc-200 bg-medit-bg p-6 shadow-sm dark:border-zinc-800 dark:bg-[#0d1421]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-bold text-medit-fg dark:text-white">{r.name}</h3>
                  <span className="shrink-0 rounded-full bg-medit-teal/15 px-3 py-1 text-xs font-bold text-medit-teal-2 dark:text-medit-teal">
                    {r.score}/5
                  </span>
                </div>
                <p className="font-body mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  <span className="font-semibold text-medit-fg dark:text-white">What works: </span>
                  {r.works}
                </p>
                <p className="font-body mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  <span className="font-semibold text-medit-fg dark:text-white">What doesn&apos;t: </span>
                  {r.doesnt}
                </p>
                <p className="font-body mt-3 rounded-lg bg-medit-teal/10 p-3 text-sm leading-relaxed text-medit-teal-2 dark:text-medit-teal">
                  💬 Medit RD tip: {r.tip}
                </p>
              </div>
            ))}
          </div>

          <h2 className="font-display mt-14 text-2xl font-bold text-medit-fg dark:text-white">Booking transport to any of these</h2>
          <p className="font-body mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Whichever resort you choose, we run accessible transfers from PUJ to all of them — see pricing and
            details on our{" "}
            <a href="/punta-cana-airport-transfer" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
              Punta Cana airport transfer
            </a>{" "}
            page. Once you&apos;re checked in, our{" "}
            <a href="/punta-cana-tours" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
              accessible tours
            </a>{" "}
            can pick you up directly from the lobby.
          </p>
        </div>
      </article>

      <CtaBand
        heading="Not sure which resort fits your needs?"
        subheading="Tell us your priorities — we've driven guests to every property above and can give you a straight answer."
        ctaMessage="Hi, I'm choosing a resort in Punta Cana and want advice on accessibility and transport."
      />
    </>
  );
}
