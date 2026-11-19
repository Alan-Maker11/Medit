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

  const newsPages = ["/news"];

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

  const bookingLandingPages = [
    { url: `${baseUrl}/es/reservar`, lang: "es-DO" as const, altUrl: `${baseUrl}/en/book`, altLang: "en" as const },
    { url: `${baseUrl}/en/book`, lang: "en" as const, altUrl: `${baseUrl}/es/reservar`, altLang: "es-DO" as const },
  ];

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...bookingLandingPages.map((p) => ({
      url: p.url,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      alternates: {
        languages: {
          [p.lang]: p.url,
          [p.altLang]: p.altUrl,
          "x-default": `${baseUrl}/en/book`,
        },
      },
    })),
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
    ...newsPages.map((slug) => ({
      url: `${baseUrl}${slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
  ];
}
