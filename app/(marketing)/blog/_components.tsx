import type { ReactNode } from "react";
import { waLink } from "@/lib/whatsapp";

/**
 * Small presentational building blocks shared by the blog article pages only.
 * These are intentionally scoped to app/(marketing)/blog — they exist to avoid
 * repeating the same long Tailwind class strings in all 8 article files, not
 * to become a new site-wide design-system layer. Visual language matches the
 * existing guide pages (punta-cana-wheelchair-guide, accessible-resorts-punta-cana).
 */

export function ArticleWrapper({ children }: { children: ReactNode }) {
  return (
    <article className="bg-white px-4 py-16 dark:bg-black sm:py-20">
      <div className="mx-auto max-w-3xl">{children}</div>
    </article>
  );
}

export function ArticleMeta({ children }: { children: ReactNode }) {
  return <p className="font-body text-sm font-medium text-zinc-500 dark:text-zinc-500">{children}</p>;
}

export function ArticleIntro({ children }: { children: ReactNode }) {
  return <p className="font-body mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{children}</p>;
}

export function ArticleH2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="font-display mt-10 text-2xl font-bold text-medit-fg dark:text-white">
      {children}
    </h2>
  );
}

export function ArticleH3({ children }: { children: ReactNode }) {
  return <h3 className="font-display mt-6 text-lg font-bold text-medit-fg dark:text-white">{children}</h3>;
}

export function ArticleP({ children }: { children: ReactNode }) {
  return <p className="font-body mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{children}</p>;
}

export function ArticleUL({ items }: { items: ReactNode[] }) {
  return (
    <ul className="font-body mt-4 flex flex-col gap-2 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-1.5 shrink-0 text-medit-teal-2 dark:text-medit-teal" aria-hidden="true">
            ●
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function ArticleOL({ items }: { items: ReactNode[] }) {
  return (
    <ol className="font-body mt-4 flex flex-col gap-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-medit-teal/15 text-xs font-bold text-medit-teal-2 dark:text-medit-teal">
            {i + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

export function ArticleTable({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="font-body w-full min-w-[480px] text-left text-sm">
        <thead className="bg-medit-bg dark:bg-[#0d1421]">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-bold text-medit-fg dark:text-white">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ArticleCallout({ children, emoji = "💡" }: { children: ReactNode; emoji?: string }) {
  return (
    <div className="font-body mt-6 rounded-xl bg-medit-teal/10 p-4 text-sm leading-relaxed text-medit-teal-2 dark:text-medit-teal">
      <span aria-hidden="true">{emoji}</span> {children}
    </div>
  );
}

export function ArticleCtaBox({
  children,
  ctaMessage,
  ctaLabel = "Message us on WhatsApp",
}: {
  children: ReactNode;
  ctaMessage: string;
  ctaLabel?: string;
}) {
  return (
    <div className="mt-8 rounded-2xl border border-medit-teal/30 bg-medit-teal/5 p-6 text-center dark:bg-medit-teal/10">
      <p className="font-body text-base leading-relaxed text-medit-fg dark:text-white">{children}</p>
      <a
        href={waLink(ctaMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="font-body mt-4 inline-block rounded-full bg-medit-teal px-6 py-3 text-sm font-bold text-medit-navy transition-transform duration-150 hover:scale-105 hover:bg-medit-teal-2"
      >
        💬 {ctaLabel}
      </a>
    </div>
  );
}

export function ArticleLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
      {children}
    </a>
  );
}
