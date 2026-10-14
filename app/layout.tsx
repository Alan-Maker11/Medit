import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display, Nunito } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.meditrd.site"),
  title: {
    default: "Wheelchair-Accessible Transfers & Tours in Punta Cana | Medit RD",
    template: "%s | Medit RD",
  },
  description:
    "Private wheelchair-accessible airport transfers, resort pickups & tours across Punta Cana & Santo Domingo. GPS-tracked fleet. Certified drivers. 24/7 support. Book via WhatsApp.",
  keywords: [
    "wheelchair accessible transport punta cana",
    "accessible airport transfer dominican republic",
    "transporte accesible punta cana",
    "wheelchair tour santo domingo",
    "accessible mobility dominican republic",
    "silla de ruedas punta cana transfer",
    "handicap transport DR",
    "medit rd transport",
  ],
  authors: [{ name: "Medit RD", url: "https://www.meditrd.site" }],
  creator: "Medit RD",
  publisher: "Medit RD",
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "es_DO",
    url: "https://www.meditrd.site",
    siteName: "Medit RD",
    title: "Wheelchair-Accessible Transfers & Tours in Punta Cana | Medit RD",
    description:
      "The Dominican Republic's premier accessible transportation service. Airport transfers, resort pickups & private tours for wheelchair users. 24/7.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Medit RD — Wheelchair-Accessible Transportation in Punta Cana, Dominican Republic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wheelchair-Accessible Transfers & Tours in Punta Cana | Medit RD",
    description: "Private accessible airport transfers & tours across the Dominican Republic. GPS-tracked fleet. 24/7 support.",
    images: ["/api/og"],
  },
  alternates: {
    canonical: "https://www.meditrd.site",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Medit",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0B1F42",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
