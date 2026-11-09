"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const SERVICE_LINKS = [
  { href: "/punta-cana-airport-transfer", label: "Punta Cana Airport Transfer" },
  { href: "/santo-domingo-airport-transfer", label: "Santo Domingo Airport Transfer" },
  { href: "/punta-cana-tours", label: "Punta Cana Tours" },
  { href: "/zona-colonial-tour", label: "Zona Colonial Tour" },
  { href: "/medical-transport", label: "Medical Transport" },
  { href: "/la-romana-transfer", label: "La Romana Transfer" },
  { href: "/post-surgery-transport", label: "Post-Surgery Transport" },
];

const GUIDE_LINKS = [
  { href: "/punta-cana-wheelchair-guide", label: "Punta Cana Wheelchair Guide" },
  { href: "/accessible-resorts-punta-cana", label: "Accessible Resorts Guide" },
];

export default function Navbar({ hasLogo }: { hasLogo: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  // On the homepage these are in-page anchors; from any other page they first
  // navigate home, then the browser scrolls to the matching id on load.
  const bookHref = isHome ? "#reservar" : "/#reservar";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-200 ${
        scrolled ? "bg-medit-navy/95 shadow-lg backdrop-blur" : "bg-medit-navy/70 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          {hasLogo ? (
            <Image src="/medit-logo.png" alt="Medit" width={36} height={36} className="h-9 w-9 object-contain" />
          ) : null}
          <span className="font-display bg-gradient-to-r from-medit-teal to-cyan-300 bg-clip-text text-xl font-bold text-transparent">
            MEDIT
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <div className="group relative">
            <button className="font-body flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white">
              Services <span className="text-[10px]">▾</span>
            </button>
            <div className="invisible absolute left-0 top-full z-50 w-64 rounded-xl border border-white/10 bg-medit-navy p-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100">
              {SERVICE_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="font-body block rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          <div className="group relative">
            <button className="font-body flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white">
              Guides <span className="text-[10px]">▾</span>
            </button>
            <div className="invisible absolute left-0 top-full z-50 w-60 rounded-xl border border-white/10 bg-medit-navy p-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100">
              {GUIDE_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="font-body block rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          <a href="/about" className="font-body text-sm font-medium text-white/80 transition-colors hover:text-white">
            About
          </a>
          <a href="/faq" className="font-body text-sm font-medium text-white/80 transition-colors hover:text-white">
            FAQ
          </a>
          <a href="/contact" className="font-body text-sm font-medium text-white/80 transition-colors hover:text-white">
            Contact
          </a>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a href="tel:+18293296920" className="font-body text-sm font-semibold text-white/90 hover:text-white">
            +1 (829) 329-6920
          </a>
          <a
            href={bookHref}
            className="rounded-full bg-medit-teal px-5 py-2 text-sm font-bold text-medit-navy transition-transform duration-150 hover:scale-105 hover:bg-medit-teal-2"
          >
            Book Now
          </a>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded-lg p-2 text-white lg:hidden"
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-1 border-t border-white/10 bg-medit-navy px-4 pb-4 pt-2 lg:hidden">
          <p className="font-body px-3 pt-2 text-xs font-bold uppercase tracking-wide text-white/40">Services</p>
          {SERVICE_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="font-body rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </a>
          ))}

          <p className="font-body px-3 pt-3 text-xs font-bold uppercase tracking-wide text-white/40">Guides</p>
          {GUIDE_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="font-body rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </a>
          ))}

          <div className="mt-2 flex flex-col gap-1 border-t border-white/10 pt-2">
            <a
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="font-body rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white"
            >
              About
            </a>
            <a
              href="/faq"
              onClick={() => setMenuOpen(false)}
              className="font-body rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white"
            >
              FAQ
            </a>
            <a
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="font-body rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white"
            >
              Contact
            </a>
          </div>

          <a href="tel:+18293296920" className="font-body px-3 py-2 text-sm font-semibold text-white/90">
            +1 (829) 329-6920
          </a>
          <a
            href={bookHref}
            onClick={() => setMenuOpen(false)}
            className="mt-2 rounded-full bg-medit-teal px-5 py-2 text-center text-sm font-bold text-medit-navy"
          >
            Book Now
          </a>
        </div>
      )}
    </header>
  );
}
