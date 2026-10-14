import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.meditrd.site";
  const now = new Date();

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/#servicios`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/#destinos`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/#tours`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/#reservar`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/#faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
