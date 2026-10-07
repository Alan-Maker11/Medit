import fs from "node:fs";
import path from "node:path";
import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import HowItWorks from "@/components/public/HowItWorks";
import Services from "@/components/public/Services";
import Destinations from "@/components/public/Destinations";
import ToursGallery from "@/components/public/ToursGallery";
import TrustStrip from "@/components/public/TrustStrip";
import Reviews from "@/components/public/Reviews";
import FAQ from "@/components/public/FAQ";
import PortalLinks from "@/components/public/PortalLinks";
import Footer from "@/components/public/Footer";

export default function Home() {
  const hasLogo = fs.existsSync(path.join(process.cwd(), "public", "medit-logo.png"));

  return (
    <div className="flex flex-1 flex-col font-body">
      <Navbar hasLogo={hasLogo} />
      <Hero />
      <HowItWorks />
      <Services />
      <Destinations />
      <ToursGallery />

      {/* Placeholder — Pass 2 replaces this with the full 4-step booking wizard, static
          "Cotizar" fare range tab, and live flight tracker. */}
      <section id="reservar" className="bg-medit-bg px-4 py-16 dark:bg-[#0d1421] sm:py-20">
        <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-medit-teal/40 bg-white p-8 text-center dark:bg-black">
          <h2 className="font-display text-2xl font-bold text-medit-fg dark:text-white">Reserva tu viaje</h2>
          <p className="font-body mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            El asistente de reserva paso a paso llega en la próxima actualización. Por ahora, contáctanos
            directamente por WhatsApp y te ayudamos a coordinar tu viaje.
          </p>
          <a
            href="https://wa.me/18293296920"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body mt-6 inline-block rounded-full bg-medit-teal px-8 py-3 font-bold text-medit-navy hover:bg-medit-teal-2"
          >
            💬 Reservar por WhatsApp
          </a>
        </div>
      </section>

      <TrustStrip />
      <Reviews />
      <FAQ />
      <PortalLinks />
      <Footer />
    </div>
  );
}
