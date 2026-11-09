import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";
import JsonLd from "@/components/public/JsonLd";
import PageHero from "@/components/public/PageHero";
import CtaBand from "@/components/public/CtaBand";

const SLUG = "/punta-cana-wheelchair-guide";

export const metadata: Metadata = buildPageMetadata({
  slug: SLUG,
  title: "Traveling Punta Cana in a Wheelchair — Guide",
  description:
    "Everything a wheelchair user needs to know before visiting Punta Cana: accessible resorts, beaches, transport and tips.",
});

export default function PuntaCanaWheelchairGuidePage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "The Complete Guide to Punta Cana in a Wheelchair",
    description:
      "Everything a wheelchair user needs to know before visiting Punta Cana: accessible resorts, beaches, transport and tips.",
    author: { "@type": "Organization", name: "Medit RD" },
    publisher: { "@type": "Organization", name: "Medit RD", url: "https://www.meditrd.site" },
    mainEntityOfPage: `https://www.meditrd.site${SLUG}`,
  };

  return (
    <>
      <JsonLd schema={articleSchema} />

      <PageHero
        eyebrow="Guide"
        h1="The Complete Guide to Punta Cana in a Wheelchair"
        intro="A practical, honest look at what to expect — airport to beach to resort room — written from years of actually moving wheelchair users around this part of the Dominican Republic."
        ctaMessage="Hi, I'm planning a wheelchair-accessible trip to Punta Cana and have some questions."
        ctaLabel="Ask Us on WhatsApp"
      />

      <article className="bg-white px-4 py-16 dark:bg-black sm:py-20">
        <div className="mx-auto max-w-3xl">
          <section>
            <h2 className="font-display text-2xl font-bold text-medit-fg dark:text-white">1. Flying to Punta Cana in a Wheelchair</h2>
            <p className="font-body mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              Most major carriers flying into Punta Cana International Airport (PUJ) handle wheelchair boarding
              routinely — request it when you book, confirm it again 48 hours before departure, and once more at
              check-in. If you use a power wheelchair, ask your airline about battery requirements (most lithium
              batteries are fine if under a certain wattage, but confirm specifics for your model) and whether the
              chair will be gate-checked or stored in the cabin hold. Bring your charger in carry-on, and consider
              photographing your chair before it&apos;s gate-checked in case of damage claims. The flight itself to PUJ
              from most US and Canadian hubs runs 3–5 hours, which is manageable for most travelers but worth
              planning bathroom and positioning breaks around if you&apos;re on a longer connection.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold text-medit-fg dark:text-white">2. PUJ Airport — What to Expect</h2>
            <p className="font-body mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              Punta Cana&apos;s airport is unusual in a good way: much of it is open-air, with thatched-roof walkways
              rather than enclosed corridors, which generally means wider, flatter paths than you&apos;d find in a
              typical terminal. Immigration and baggage claim are on one level with ramped access throughout.
              Where it gets trickier is ground transportation outside — the taxi and shuttle queue area can be
              crowded and chaotic, especially right after a wave of flights lands, and standard taxis and shared
              shuttles are not wheelchair-adapted. This is exactly why we recommend arranging a{" "}
              <a href="/punta-cana-airport-transfer" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
                private accessible transfer
              </a>{" "}
              in advance: your driver meets you inside arrivals with a name sign, so you skip the curb scramble
              entirely.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold text-medit-fg dark:text-white">3. Resorts — The Reality of Accessibility</h2>
            <p className="font-body mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              &quot;Accessible room&quot; means different things at different resorts, and the gap between marketing copy and
              reality can be significant. A room labeled accessible might have a roll-in shower and grab bars, or it
              might just mean &quot;near the elevator.&quot; Always ask for specific measurements — bathroom door width, roll-in
              shower vs. step-over tub, bed height — rather than taking &quot;yes, we&apos;re accessible&quot; at face value. Resort
              grounds themselves vary widely too: some are flat and paved throughout, others involve slopes, sand
              paths to the beach, or buggy-only access to certain buildings. We&apos;ve ranked specific properties on our{" "}
              <a href="/accessible-resorts-punta-cana" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
                accessible resorts guide
              </a>{" "}
              based on what we&apos;ve actually seen moving guests around them.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold text-medit-fg dark:text-white">4. Punta Cana&apos;s Best Accessible Beaches</h2>
            <p className="font-body mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              Sand is sand — no beach in Punta Cana is naturally wheelchair-friendly without help — but some are far
              easier than others. Bávaro Beach&apos;s resort-front sections are usually the flattest and most developed,
              with some properties offering beach mats (rollable matting that creates a firmer path from the
              boardwalk to the shoreline) or beach wheelchairs with balloon tires on request. Macao Beach, popular
              for its wilder Atlantic surf and our{" "}
              <a href="/punta-cana-tours" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
                beach tour
              </a>
              , also has beach mats available in the main access areas. Ask your resort directly whether they stock
              beach mats or chairs — not every property does, and availability can be first-come, first-served
              during busy weeks.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold text-medit-fg dark:text-white">5. Tours That Actually Work for Wheelchair Users</h2>
            <p className="font-body mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              Not every popular excursion translates well to a wheelchair, and it&apos;s worth being selective rather
              than trying to do everything. Beach tours and nightlife outings tend to work best since the
              surfaces are flat and venues are used to accommodating guests. Boat-based excursions like Isla Saona
              are doable but require assisted boarding onto a catamaran, which isn&apos;t for everyone. Cultural day
              trips involving cobblestones — Altos de Chavón, the Colonial Zone — are genuinely rewarding but
              benefit hugely from a driver who stays close rather than one who drops you off and waits in the van.
              Our tours page rates each option as Fully or Partially Accessible so you can choose with real
              information rather than guessing.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold text-medit-fg dark:text-white">6. Getting Around — Why You Need a Private Accessible Van</h2>
            <p className="font-body mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              Punta Cana&apos;s tourist zone is spread out — resorts, restaurants and attractions can be 15–40 minutes
              apart by road — and public transport infrastructure for wheelchair users essentially doesn&apos;t exist
              outside of pre-arranged private vehicles. Regular taxis and resort shuttles are not ramp-equipped, and
              rideshare apps in the region don&apos;t guarantee accessible vehicles. A private accessible van isn&apos;t a
              luxury here so much as the only realistic way to move around with a wheelchair once you&apos;re outside
              resort grounds, which is why transport should be one of the first things you book, not an
              afterthought handled at the last minute.
            </p>
          </section>
        </div>
      </article>

      <CtaBand
        heading="Planning your trip to Punta Cana?"
        subheading="Tell us your resort and travel dates — we'll help you plan accessible transport and tours."
        ctaMessage="Hi, I'm planning a wheelchair-accessible trip to Punta Cana and have some questions."
      />
    </>
  );
}
