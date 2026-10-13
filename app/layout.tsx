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
  metadataBase: new URL("https://meditrd.site"),
  title: "Medica Patrans",
  description: "Fare calculator and operations management for Medit transportation services.",
  manifest: "/manifest.json",
  icons: {
    icon: "/medit-logo.png",
    apple: "/medit-logo.png",
  },
  openGraph: {
    title: "Medit",
    description: "Fare calculator and operations management for Medit transportation services.",
    url: "https://meditrd.site",
    siteName: "Medit",
    images: [
      {
        url: "/medit-logo.png",
        width: 512,
        height: 512,
        alt: "Medit",
      },
    ],
    locale: "es_DO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Medit",
    description: "Fare calculator and operations management for Medit transportation services.",
    images: ["/medit-logo.png"],
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
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#2563eb",
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
