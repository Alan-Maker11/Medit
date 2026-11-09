"use client";

import { useState, type ReactNode } from "react";

export interface FAQItem {
  q: string;
  /** Plain text for most pages; can also hold short paragraphs / inline links. */
  a: ReactNode;
}

/**
 * Reusable FAQ accordion for the new marketing pages. Visual pattern matches
 * the homepage's FAQ.tsx. Pair with JsonLd + an FAQPage schema built from the
 * same `items` array so the markup and the structured data never drift apart.
 *
 * `eyebrow` + `className` let a page group several of these in sequence (e.g.
 * one per topic section) while keeping each one visually distinct; both are
 * optional so existing single-FAQ pages render exactly as before.
 */
export default function PageFAQ({
  id = "faq",
  heading = "Frequently asked questions",
  eyebrow,
  items,
  className = "bg-white dark:bg-black",
}: {
  id?: string;
  heading?: string;
  eyebrow?: string;
  items: FAQItem[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id={id} className={`px-4 py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-3xl">
        {eyebrow && (
          <span className="font-body block text-center text-xs font-bold uppercase tracking-widest text-medit-teal-2 dark:text-medit-teal">
            {eyebrow}
          </span>
        )}
        <h2 className={`font-display text-center text-3xl font-bold text-medit-fg dark:text-white sm:text-4xl ${eyebrow ? "mt-2" : ""}`}>
          {heading}
        </h2>
        <div className="mt-10 flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex min-h-12 w-full items-center justify-between gap-4 py-3 text-left"
                >
                  <span className="font-body font-semibold text-medit-fg dark:text-white">{item.q}</span>
                  <span className={`shrink-0 text-medit-teal transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>▾</span>
                </button>
                <div
                  className="grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="font-body flex flex-col gap-2 pb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {item.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
