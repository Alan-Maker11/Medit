import type { Metadata } from "next";
import Script from "next/script";
import { buildPageMetadata } from "@/lib/pageMetadata";
import PageHero from "@/components/public/PageHero";

const SLUG = "/news";

export const metadata: Metadata = buildPageMetadata({
  slug: SLUG,
  title: "News & Updates — Medit RD",
  description: "Latest news and updates on wheelchair-accessible travel in the Dominican Republic from Medit RD.",
});

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="News"
        h1="News & Updates"
        intro="The latest from Medit RD and the world of accessible travel in the Dominican Republic."
        ctaMessage="Hi, I'd like to learn more about Medit RD's services."
        ctaLabel="Chat With Us"
      />

      <section className="bg-white px-4 py-16 dark:bg-black sm:py-20">
        <div className="mx-auto max-w-3xl">
          {/* Auto-posted content from the Soro widget — kept on its own page, isolated from
              the hand-written /blog section, so automated posts can't touch or override it. */}
          <div id="soro-blog" />
          <Script
            src="https://app.trysoro.com/api/embed/fb3ce344-75a7-456c-9059-38e25411c9eb"
            strategy="afterInteractive"
          />
        </div>
      </section>
    </>
  );
}
