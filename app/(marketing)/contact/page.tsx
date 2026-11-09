import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/pageMetadata";
import PageHero from "@/components/public/PageHero";
import BookingForm from "@/components/public/BookingForm";

const SLUG = "/contact";

export const metadata: Metadata = buildPageMetadata({
  slug: SLUG,
  title: "Book Accessible Transport — Medit RD",
  description:
    "Book your wheelchair-accessible transfer or tour in 2 minutes. WhatsApp, email or our booking form. Available 24/7 in DR.",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Book now"
        h1="Book Your Accessible Transport"
        intro="The fastest way to book is a WhatsApp message — most requests are confirmed within 15–30 minutes. Prefer a form? Fill in the details below and we'll open WhatsApp with everything pre-filled for you."
        ctaMessage="Hi, I'd like to book an accessible transfer or tour with Medit RD."
        ctaLabel="Message Us on WhatsApp"
      />

      <section className="bg-white px-4 py-16 dark:bg-black sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-center text-3xl font-bold text-medit-fg dark:text-white sm:text-4xl">
            How booking with Medit RD works
          </h2>
          <p className="font-body mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            There&apos;s no account to create and no app to download. Every booking, whether it&apos;s an airport
            transfer, a tour, or a recurring medical appointment, goes through the same simple process below.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
              <span className="font-display text-3xl font-bold text-medit-teal-2 dark:text-medit-teal">1</span>
              <h3 className="font-display mt-2 font-bold text-medit-fg dark:text-white">Tell us the trip</h3>
              <p className="font-body mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Message us on WhatsApp, call, or fill in the form below with your dates, pickup and drop-off, group
                size, and wheelchair type if it applies.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
              <span className="font-display text-3xl font-bold text-medit-teal-2 dark:text-medit-teal">2</span>
              <h3 className="font-display mt-2 font-bold text-medit-fg dark:text-white">We confirm availability</h3>
              <p className="font-body mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                We check our ramp van and driver schedule and reply with a final price in USD, usually within
                15–30 minutes, any time of day.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
              <span className="font-display text-3xl font-bold text-medit-teal-2 dark:text-medit-teal">3</span>
              <h3 className="font-display mt-2 font-bold text-medit-fg dark:text-white">Your driver shows up</h3>
              <p className="font-body mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                On the day, your driver arrives on time — tracking your flight automatically for airport pickups —
                and payment is settled directly with the driver, no prepayment required.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-medit-bg px-4 py-16 dark:bg-[#0d1421] sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="font-display text-2xl font-bold text-medit-fg dark:text-white sm:text-3xl">Request a booking</h2>
            <p className="font-body mt-3 text-sm text-zinc-500">
              This form doesn&apos;t submit anywhere on its own — it composes a WhatsApp message with everything
              you entered and opens it for you to send. Nothing is booked until you actually send the message and
              we confirm back.
            </p>
            <div className="mt-6">
              <BookingForm />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
              <h2 className="font-display text-xl font-bold text-medit-fg dark:text-white">Other ways to reach us</h2>
              <ul className="font-body mt-4 flex flex-col gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <li>
                  <a
                    href="https://wa.me/18293296920"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-medit-teal-2 underline dark:text-medit-teal"
                  >
                    💬 WhatsApp: +1 (829) 329-6920
                  </a>
                </li>
                <li>
                  <a href="tel:+18293296920" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
                    📞 Call: +1 (829) 329-6920
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:medicapatrans@gmail.com"
                    className="font-semibold text-medit-teal-2 underline dark:text-medit-teal"
                  >
                    ✉️ medicapatrans@gmail.com
                  </a>
                </li>
              </ul>
              <p className="font-body mt-5 rounded-lg bg-medit-teal/10 p-3 text-sm font-semibold text-medit-teal-2 dark:text-medit-teal">
                We typically respond within 15–30 minutes via WhatsApp, 24/7.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
              <h3 className="font-display text-lg font-bold text-medit-fg dark:text-white">Not sure what to book?</h3>
              <p className="font-body mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                See our{" "}
                <a href="/punta-cana-airport-transfer" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
                  Punta Cana
                </a>{" "}
                or{" "}
                <a href="/santo-domingo-airport-transfer" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
                  Santo Domingo
                </a>{" "}
                airport transfer pages for pricing, or browse{" "}
                <a href="/punta-cana-tours" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
                  accessible tours
                </a>{" "}
                if you&apos;re planning a full itinerary. You can also use the booking wizard on our{" "}
                <Link href="/" className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
                  homepage
                </Link>{" "}
                for instant fare estimates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
