import type { Metadata } from "next";
import BookingLanding from "@/components/public/BookingLanding";
import { hasMeditLogo } from "@/lib/hasLogo";

const BASE_URL = "https://www.meditrd.site";
const URL_ES = `${BASE_URL}/es/reservar`;
const URL_EN = `${BASE_URL}/en/book`;

export const metadata: Metadata = {
  title: "Book Wheelchair-Accessible Transport in DR | Medit RD",
  description:
    "Book your wheelchair-accessible transport in the Dominican Republic in minutes. Ramp vans, stair-climber service and door-to-door assistance. From RD$1,250.",
  alternates: {
    canonical: URL_EN,
    languages: {
      "es-DO": URL_ES,
      en: URL_EN,
      "x-default": URL_EN,
    },
  },
  openGraph: {
    title: "Book Wheelchair-Accessible Transport in DR | Medit RD",
    description:
      "Book your wheelchair-accessible transport in the Dominican Republic in minutes. Ramp vans, stair-climber service and door-to-door assistance.",
    url: URL_EN,
    siteName: "Medit RD",
    locale: "en_US",
    images: [{ url: "/medit-logo.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Wheelchair-Accessible Transport in DR | Medit RD",
    description: "Ramp vans, stair-climber service and door-to-door assistance. From RD$1,250.",
    images: ["/medit-logo.png"],
  },
};

export default function BookPage() {
  return <BookingLanding lang="en" hasLogo={hasMeditLogo()} />;
}
