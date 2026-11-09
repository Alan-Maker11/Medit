import type { Metadata } from "next";

const BASE_URL = "https://www.meditrd.site";

/**
 * Builds the standard per-page metadata block (title/description/canonical/
 * OpenGraph/Twitter) for the 11 new marketing pages. `slug` starts with "/".
 * The root layout's title template ("%s | Medit RD") appends the brand name,
 * so `title` here should be the bare page title from the content spec.
 */
export function buildPageMetadata({
  slug,
  title,
  description,
}: {
  slug: string;
  title: string;
  description: string;
}): Metadata {
  const url = `${BASE_URL}${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Medit RD",
      images: [{ url: "/medit-logo.png", width: 512, height: 512 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/medit-logo.png"],
    },
  };
}
