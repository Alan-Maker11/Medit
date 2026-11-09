import { waLink, WHATSAPP_DISPLAY } from "@/lib/whatsapp";

interface PageHeroProps {
  eyebrow: string;
  h1: string;
  intro: string;
  ctaMessage: string;
  ctaLabel?: string;
}

/**
 * Shared above-the-fold hero for the 11 new marketing pages. Matches the visual
 * language of the homepage's Hero.tsx (same gradient, same button styling) so
 * navigating between the homepage and these pages feels like one site.
 */
export default function PageHero({ eyebrow, h1, intro, ctaMessage, ctaLabel = "Book on WhatsApp" }: PageHeroProps) {
  return (
    <section className="medit-hero-gradient relative overflow-hidden px-4 py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,theme(colors.medit-teal)_0%,transparent_45%)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <span className="font-body inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-medit-teal">
          {eyebrow}
        </span>
        <h1 className="font-display mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">{h1}</h1>
        <p className="font-body mx-auto mt-6 max-w-2xl text-lg text-white/80">{intro}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={waLink(ctaMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-medit-teal px-8 py-4 text-base font-bold text-medit-navy shadow-lg shadow-medit-teal/20 transition-transform duration-150 hover:scale-105 hover:bg-medit-teal-2"
          >
            💬 {ctaLabel}
          </a>
          <a
            href="tel:+18293296920"
            className="rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur transition-colors hover:bg-white/10"
          >
            📞 {WHATSAPP_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}
