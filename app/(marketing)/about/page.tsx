import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";
import PageHero from "@/components/public/PageHero";
import CtaBand from "@/components/public/CtaBand";

const SLUG = "/about";

export const metadata: Metadata = buildPageMetadata({
  slug: SLUG,
  title: "About Medit RD — Accessible Transport DR",
  description:
    "Medit RD is the Dominican Republic's first dedicated wheelchair-accessible transport service. Meet our team and our mission.",
});

const VALUES = [
  {
    title: "Dignity first",
    desc: "No one should have to be lifted, dragged, or treated as cargo to get from an airport to a hotel room. Every part of our service is built around letting passengers move on their own terms.",
  },
  {
    title: "Honesty over hype",
    desc: "We'd rather tell you a beach has rough sand or a tour has cobblestones than oversell accessibility and let you find out the hard way. Our guides and tour ratings reflect what we've actually seen.",
  },
  {
    title: "Show up, every time",
    desc: "Flights get delayed, plans change, appointments move. We track flights, stay flexible, and treat punctuality as a promise, not a best-effort guess.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our story"
        h1="About Medit RD"
        intro="We started Medit RD because wheelchair users visiting or living in the Dominican Republic had almost no reliable transport option built for them. We're working to change that, one trip at a time."
        ctaMessage="Hi, I'd like to learn more about Medit RD's services."
        ctaLabel="Chat With Us"
      />

      <section className="bg-white px-4 py-16 dark:bg-black sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-medit-fg dark:text-white sm:text-4xl">Our team</h2>
          <p className="font-body mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Medit RD is a small, hands-on operation — which means the people who answer your WhatsApp message are
            the same people who plan your route and, often, the same people driving the van.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-medit-bg p-6 dark:border-zinc-800 dark:bg-[#0d1421]">
              <h3 className="font-display text-xl font-bold text-medit-fg dark:text-white">Lemic Melo — CEO</h3>
              <p className="font-body mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Lemic Melo leads Medit RD, overseeing the business day to day and making sure every booking gets a
                real, personal response rather than a canned one.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-medit-bg p-6 dark:border-zinc-800 dark:bg-[#0d1421]">
              <h3 className="font-display text-xl font-bold text-medit-fg dark:text-white">Our drivers</h3>
              <p className="font-body mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Every driver on our team is trained and highly professional, with deep experience navigating Punta
                Cana and Santo Domingo — from airport pickups to hospital transfers to cobblestoned tours of the
                Colonial Zone. They know which resort entrances are easiest to approach, which routes avoid the
                worst traffic, and how to help a passenger get settled without making a fuss about it.
              </p>
            </div>
          </div>

          <h2 className="font-display mt-14 text-2xl font-bold text-medit-fg dark:text-white">Our fleet</h2>
          <p className="font-body mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Every van in our fleet is built around comfort and accessibility — not just a ramp bolted onto a
            standard vehicle:
          </p>
          <ul className="mt-5 flex flex-col gap-4">
            <li className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="font-body font-semibold text-medit-fg dark:text-white">Rear ramp & secure tie-downs</p>
              <p className="font-body mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Wide doors, a rear ramp, and four-point tie-downs on every vehicle, used for{" "}
                <a href="/punta-cana-airport-transfer" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
                  airport transfers
                </a>
                ,{" "}
                <a href="/medical-transport" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
                  medical transport
                </a>{" "}
                and accessible tours.
              </p>
            </li>
            <li className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="font-body font-semibold text-medit-fg dark:text-white">On-board TV & WiFi</p>
              <p className="font-body mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Stay connected and entertained on longer transfers, like the drive between Punta Cana and Santo
                Domingo.
              </p>
            </li>
            <li className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="font-body font-semibold text-medit-fg dark:text-white">Climate-controlled comfort</p>
              <p className="font-body mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Cool, comfortable seating for the whole group, with room for companions and luggage alongside a
                secured wheelchair.
              </p>
            </li>
          </ul>

          <h2 className="font-display mt-14 text-2xl font-bold text-medit-fg dark:text-white">What we stand for</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
                <h3 className="font-display font-bold text-medit-fg dark:text-white">{v.title}</h3>
                <p className="font-body mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{v.desc}</p>
              </div>
            ))}
          </div>

          <p className="font-body mt-10 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Curious what a trip with us actually looks like? Browse our{" "}
            <a href="/punta-cana-tours" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
              Punta Cana tours
            </a>{" "}
            or{" "}
            <a href="/contact" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
              get in touch
            </a>{" "}
            and we&apos;ll walk you through it.
          </p>
        </div>
      </section>

      <CtaBand
        heading="Ready to work with us?"
        subheading="Message our team directly on WhatsApp — no call centers, no hold music."
        ctaMessage="Hi, I'd like to learn more about Medit RD's services."
      />
    </>
  );
}
