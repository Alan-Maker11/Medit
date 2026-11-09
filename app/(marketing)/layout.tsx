import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import { hasMeditLogo } from "@/lib/hasLogo";

/**
 * Shared chrome for the 11 new marketing pages (the homepage at app/page.tsx
 * composes its own Navbar/Footer directly and is untouched). A Next.js route
 * group — the "(marketing)" segment is not part of the URL, so pages here
 * still resolve to e.g. /about, /contact, etc.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const hasLogo = hasMeditLogo();

  return (
    <div className="flex flex-1 flex-col font-body">
      <Navbar hasLogo={hasLogo} />
      {children}
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
