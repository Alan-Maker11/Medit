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

  const blogIndexPages = ["/blog"];

  const blogPages = [
    "/blog/wheelchair-accessible-airport-transfer-punta-cana",
    "/blog/transporte-silla-ruedas-santo-domingo",
    "/blog/wheelchair-accessible-tours-punta-cana",
    "/blog/wheelchair-medical-transport-dominican-republic",
    "/blog/wheelchair-accessible-travel-guide-dominican-republic",
    "/blog/turismo-accesible-republica-dominicana",
    "/blog/zona-colonial-wheelchair-accessible-tour-santo-domingo",
    "/blog/traslado-medico-accesible-punta-cana",
  ];

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
    ...blogIndexPages.map((slug) => ({
      url: `${baseUrl}${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...blogPages.map((slug) => ({
      url: `${baseUrl}${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
