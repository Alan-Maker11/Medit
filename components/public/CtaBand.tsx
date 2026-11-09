import { waLink } from "@/lib/whatsapp";

interface CtaBandProps {
  heading?: string;
  subheading?: string;
  ctaMessage: string;
}

/** Bottom-of-page WhatsApp CTA band, used on every one of the 11 new pages. */
export default function CtaBand({
  heading = "Ready to book your accessible ride?",
  subheading = "Message us now on WhatsApp — most trips are confirmed within minutes.",
  ctaMessage,
}: CtaBandProps) {
  return (
    <section className="medit-hero-gradient px-4 py-14 sm:py-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">{heading}</h2>
        <p className="font-body max-w-xl text-white/80">{subheading}</p>
        <a
          href={waLink(ctaMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-medit-teal px-8 py-4 text-base font-bold text-medit-navy shadow-lg shadow-medit-teal/20 transition-transform duration-150 hover:scale-105 hover:bg-medit-teal-2"
        >
          💬 Book on WhatsApp
        </a>
      </div>
    </section>
  );
}
