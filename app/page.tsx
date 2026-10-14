import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import SchemaMarkup from "@/components/public/SchemaMarkup";
import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import HowItWorks from "@/components/public/HowItWorks";
import Services from "@/components/public/Services";
import Destinations from "@/components/public/Destinations";
import ToursGallery from "@/components/public/ToursGallery";
import BookingWizard from "@/components/public/BookingWizard";
import TrustStrip from "@/components/public/TrustStrip";
import Reviews from "@/components/public/Reviews";
import FAQ from "@/components/public/FAQ";
import PortalLinks from "@/components/public/PortalLinks";
import Footer from "@/components/public/Footer";

export const metadata: Metadata = {
  title: "Wheelchair-Accessible Transfers & Tours in Punta Cana",
  description:
    "Private wheelchair-accessible airport transfers, resort pickups & tours across Punta Cana & Santo Domingo, Dominican Republic. GPS-tracked vehicles. Certified drivers. Available 24/7. Book instantly via WhatsApp.",
  alternates: {
    canonical: "https://www.meditrd.site",
  },
  openGraph: {
    title: "Wheelchair-Accessible Transfers & Tours — Dominican Republic | Medit RD",
    description:
      "The DR's premier accessible transport service. Airport transfers, resort pickups & private tours for wheelchair users. Punta Cana · Santo Domingo · 24/7.",
    url: "https://www.meditrd.site",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "Medit RD — Accessible Transport in Dominican Republic" }],
  },
};

export default function Home() {
  const hasLogo = fs.existsSync(path.join(process.cwd(), "public", "medit-logo.png"));

  return (
    <div className="flex flex-1 flex-col font-body">
      <SchemaMarkup />
      <Navbar hasLogo={hasLogo} />
      <Hero />
      <HowItWorks />
      <Services />
      <Destinations />
      <ToursGallery />
      <BookingWizard />
      <TrustStrip />
      <Reviews />
      <FAQ />
      <PortalLinks />
      <Footer />
    </div>
  );
}
