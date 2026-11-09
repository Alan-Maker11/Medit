import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.meditrd.site";
  const now = new Date();

  const servicePages = [
    "/punta-cana-airport-transfer",
    "/santo-domingo-airport-transfer",
    "/punta-cana-tours",
    "/zona-colonial-tour",
    "/medical-transport",
    "/la-romana-transfer",
    "/post-surgery-transport",
  ];

  const guidePages = ["/punta-cana-wheelchair-guide", "/accessible-resorts-punta-cana"];

  const infoPages = ["/about", "/contact"];

  const faqPages = ["/faq"];

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...servicePages.map((slug) => ({
      url: `${baseUrl}${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...infoPages.map((slug) => ({
      url: `${baseUrl}${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...guidePages.map((slug) => ({
      url: `${baseUrl}${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...faqPages.map((slug) => ({
      url: `${baseUrl}${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
