"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#destinos", label: "Destinos" },
  { href: "#tours", label: "Tours" },
  { href: "#reservar", label: "Reservar" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar({ hasLogo }: { hasLogo: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
        <a href="#top" className="flex shrink-0 items-center gap-2">
          {hasLogo ? (
            <Image src="/medit-logo.png" alt="Medit" width={36} height={36} className="h-9 w-9 object-contain" />
          ) : null}
          <span className="font-display bg-gradient-to-r from-medit-teal to-cyan-300 bg-clip-text text-xl font-bold text-transparent">
            MEDIT
          </span>
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="font-body text-sm font-medium text-white/80 transition-colors hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a href="tel:+18293296920" className="font-body text-sm font-semibold text-white/90 hover:text-white">
            +1 (829) 329-6920
          </a>
          <a
            href="#reservar"
            className="rounded-full bg-medit-teal px-5 py-2 text-sm font-bold text-medit-navy transition-transform duration-150 hover:scale-105 hover:bg-medit-teal-2"
          >
            Reservar Ahora
          </a>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded-lg p-2 text-white lg:hidden"
          aria-label="Abrir menú"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-1 border-t border-white/10 bg-medit-navy px-4 pb-4 pt-2 lg:hidden">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="font-body rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <a href="tel:+18293296920" className="font-body px-3 py-2 text-sm font-semibold text-white/90">
            +1 (829) 329-6920
          </a>
          <a
            href="#reservar"
            onClick={() => setMenuOpen(false)}
            className="mt-2 rounded-full bg-medit-teal px-5 py-2 text-center text-sm font-bold text-medit-navy"
          >
            Reservar Ahora
          </a>
        </div>
      )}
    </header>
  );
}
