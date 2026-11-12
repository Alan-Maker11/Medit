import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";
import PageHero from "@/components/public/PageHero";
import CtaBand from "@/components/public/CtaBand";

const SLUG = "/blog";

export const metadata: Metadata = buildPageMetadata({
  slug: SLUG,
  title: "Blog — Wheelchair Accessible Travel in the Dominican Republic",
  description:
    "Guides and articles on wheelchair-accessible travel, transport, tours, and medical transfers in Punta Cana and Santo Domingo, Dominican Republic.",
});

interface BlogEntry {
  href: string;
  title: string;
  description: string;
  lang: "en" | "es";
}

const POSTS: BlogEntry[] = [
  {
    href: "/blog/wheelchair-accessible-airport-transfer-punta-cana",
    title: "Wheelchair Accessible Airport Transfer Punta Cana — Complete 2025 Guide",
    description: "Ramp-equipped vehicles, flight tracking, pricing, and how to book your PUJ airport transfer in 2 minutes via WhatsApp.",
    lang: "en",
  },
  {
    href: "/blog/transporte-silla-ruedas-santo-domingo",
    title: "Transporte en Silla de Ruedas Santo Domingo — Guía Completa 2025",
    description: "El único transporte adaptado con rampa en Santo Domingo: traslados médicos, fisioterapia, aeropuerto y tours.",
    lang: "es",
  },
  {
    href: "/blog/wheelchair-accessible-tours-punta-cana",
    title: "Wheelchair Accessible Tours Punta Cana — Best Activities 2025",
    description: "Zona Colonial, nightlife, cigar tours, beaches, and more — all with an accessible van and bilingual guide.",
    lang: "en",
  },
  {
    href: "/blog/wheelchair-medical-transport-dominican-republic",
    title: "Wheelchair Accessible Medical Transport Dominican Republic",
    description: "Certified medical transport for dialysis, chemotherapy, physical therapy, and hospital appointments. Available 24/7.",
    lang: "en",
  },
  {
    href: "/blog/wheelchair-accessible-travel-guide-dominican-republic",
    title: "Wheelchair Accessible Travel Guide Dominican Republic 2025",
    description: "Airports, hotels, beaches, tours, and transport — everything a wheelchair user needs to plan a trip to the DR.",
    lang: "en",
  },
  {
    href: "/blog/turismo-accesible-republica-dominicana",
    title: "Turismo Accesible República Dominicana — Guía Completa 2025",
    description: "Hoteles, playas, tours y transporte accesible en Punta Cana y Santo Domingo para personas con discapacidad física.",
    lang: "es",
  },
  {
    href: "/blog/zona-colonial-wheelchair-accessible-tour-santo-domingo",
    title: "Zona Colonial Wheelchair Tour Santo Domingo — Accessible Guide 2025",
    description: "How to visit the UNESCO World Heritage Zona Colonial in a wheelchair — accessible routes, sites, and tour booking.",
    lang: "en",
  },
  {
    href: "/blog/traslado-medico-accesible-punta-cana",
    title: "Traslado Médico Accesible Punta Cana — Clínicas y Hospitales",
    description: "Transporte médico accesible para silla de ruedas a clínicas y hospitales en Punta Cana. Disponible 24/7.",
    lang: "es",
  },
];

export default function BlogIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Medit RD · Blog"
        h1="Accessible Travel Guides for the Dominican Republic"
        intro="Articles on wheelchair-accessible transport, tours, and medical transfers in Punta Cana and Santo Domingo — written from years of actually moving wheelchair users around the country."
        ctaMessage="Hi, I have a question after reading the Medit RD blog."
        ctaLabel="Ask Us on WhatsApp"
      />

      <section className="bg-white px-4 py-16 dark:bg-black sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2">
            {POSTS.map((post) => (
              <a
                key={post.href}
                href={post.href}
                className="flex flex-col rounded-2xl border border-zinc-200 bg-medit-bg p-6 shadow-sm transition-colors hover:border-medit-teal dark:border-zinc-800 dark:bg-[#0d1421]"
              >
                <span className="font-body w-fit rounded-full bg-medit-teal/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-medit-teal-2 dark:text-medit-teal">
                  {post.lang === "es" ? "Español" : "English"}
                </span>
                <h2 className="font-display mt-3 text-lg font-bold text-medit-fg dark:text-white">{post.title}</h2>
                <p className="font-body mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {post.description}
                </p>
                <span className="font-body mt-4 text-sm font-semibold text-medit-teal-2 dark:text-medit-teal">
                  Read more →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        heading="Have a question we didn't cover?"
        subheading="Message us on WhatsApp — we'll answer directly and help you plan your trip."
        ctaMessage="Hi, I have a question after reading the Medit RD blog."
      />
    </>
  );
}
