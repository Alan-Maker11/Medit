export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-medit-navy px-4 py-12 text-white/70">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-3">
        <div>
          <span className="font-display bg-gradient-to-r from-medit-teal to-cyan-300 bg-clip-text text-xl font-bold text-transparent">
            MEDIT
          </span>
          <p className="font-body mt-3 text-sm">Transporte accesible y confiable en República Dominicana.</p>
        </div>

        <div>
          <h3 className="font-body text-sm font-bold uppercase tracking-wide text-white">Contacto</h3>
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
          <h3 className="font-body text-sm font-bold uppercase tracking-wide text-white">Legal</h3>
          <ul className="font-body mt-3 flex flex-col gap-2 text-sm">
            <li>
              <a href="/login" className="hover:text-white">
                Panel administrativo
              </a>
            </li>
            <li>
              <a href="/driver/login" className="hover:text-white">
                Portal del conductor
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-center">
        <p className="font-body text-xs text-white/50">© {year} Medit Transport. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
