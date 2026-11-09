import { waLink } from "@/lib/whatsapp";

/**
 * Floating fixed WhatsApp CTA, used on the 11 new marketing pages (see
 * app/(marketing)/layout.tsx). The homepage already has WhatsApp CTAs in
 * Hero/Navbar/BookingWizard, so this button is intentionally not rendered there.
 */
export default function WhatsAppButton() {
  return (
    <a
      href={waLink("Hi, I'd like to book an accessible transfer")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-xl transition-transform duration-150 hover:scale-105"
      style={{ backgroundColor: "#25D366" }}
      aria-label="Book on WhatsApp"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.26 4.9L2 22l5.25-1.26A9.94 9.94 0 0 0 12.04 22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm5.78 14.27c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.3-1.65-.6-2.9-1.25-4.78-4.17-4.93-4.37-.15-.2-1.17-1.56-1.17-2.97 0-1.41.74-2.1 1-2.39.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.42-.07.65.5.24.58.8 2 .87 2.15.07.15.11.33.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.45.52-.15.14-.3.3-.13.6.17.3.77 1.27 1.65 2.05 1.14 1.02 2.1 1.33 2.4 1.48.3.15.48.13.65-.05.22-.23.5-.6.78-.98.2-.26.44-.3.74-.18.3.11 1.9.9 2.23 1.06.33.16.55.24.63.38.08.14.08.8-.16 1.48Z" />
      </svg>
      <span className="hidden sm:inline">Book on WhatsApp</span>
      <span className="sm:hidden">WhatsApp</span>
    </a>
  );
}
