import fs from "node:fs";
import path from "node:path";
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
      <BookingWizard />
      <TrustStrip />
      <Reviews />
      <FAQ />
      <PortalLinks />
      <Footer />
    </div>
  );
}
