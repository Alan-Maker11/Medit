const EXPLORE_LINKS = [
  { href: "/punta-cana-airport-transfer", label: "Punta Cana Airport Transfer" },
  { href: "/santo-domingo-airport-transfer", label: "Santo Domingo Airport Transfer" },
  { href: "/punta-cana-tours", label: "Punta Cana Tours" },
  { href: "/zona-colonial-tour", label: "Zona Colonial Tour" },
  { href: "/medical-transport", label: "Medical Transport" },
  { href: "/la-romana-transfer", label: "La Romana Transfer" },
  { href: "/post-surgery-transport", label: "Post-Surgery Transport" },
  { href: "/punta-cana-wheelchair-guide", label: "Punta Cana Wheelchair Guide" },
  { href: "/accessible-resorts-punta-cana", label: "Accessible Resorts Guide" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About Medit RD" },
  { href: "/contact", label: "Contact / Book" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-medit-navy px-4 py-12 text-white/70">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="font-display bg-gradient-to-r from-medit-teal to-cyan-300 bg-clip-text text-xl font-bold text-transparent">
            MEDIT
          </span>
          <p className="font-body mt-3 text-sm">Accessible and reliable transportation in the Dominican Republic.</p>
        </div>

        <div>
          <h3 className="font-body text-sm font-bold uppercase tracking-wide text-white">Explore</h3>
          <ul className="font-body mt-3 flex flex-col gap-2 text-sm">
            {EXPLORE_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-body text-sm font-bold uppercase tracking-wide text-white">Contact</h3>
          <ul className="font-body mt-3 flex flex-col gap-2 text-sm">
            <li>
              <a href="https://wa.me/18293296920" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                💬 WhatsApp +1 (829) 329-6920
              </a>
            </li>
            <li>
              <a href="mailto:medicapatrans@gmail.com" className="hover:text-white">
                ✉️ medicapatrans@gmail.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-body text-sm font-bold uppercase tracking-wide text-white">Staff / Driver Login</h3>
          <ul className="font-body mt-3 flex flex-col gap-2 text-sm">
            <li>
              <a href="/login" className="hover:text-white">
                Admin Panel
              </a>
            </li>
            <li>
              <a href="/driver/login" className="hover:text-white">
                Driver Portal
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-center">
        <p className="font-body text-xs text-white/50">© {year} Medit Transport. All rights reserved.</p>
      </div>
    </footer>
  );
}
