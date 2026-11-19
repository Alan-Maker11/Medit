import type { Metadata } from "next";
import BookingLanding from "@/components/public/BookingLanding";
import { hasMeditLogo } from "@/lib/hasLogo";

const BASE_URL = "https://www.meditrd.site";
const URL_ES = `${BASE_URL}/es/reservar`;
const URL_EN = `${BASE_URL}/en/book`;

export const metadata: Metadata = {
  title: "Reserva transporte en silla de ruedas en RD",
  description:
    "Reserve su transporte accesible en silla de ruedas en Santo Domingo y toda RD. Vans con rampa, silla salvaescaleras y asistencia puerta a puerta. Desde RD$1,250.",
  alternates: {
    canonical: URL_ES,
    languages: {
      "es-DO": URL_ES,
      en: URL_EN,
      "x-default": URL_EN,
    },
  },
  openGraph: {
    title: "Reserva transporte en silla de ruedas en RD | Medit RD",
    description:
      "Reserve su transporte accesible en silla de ruedas en Santo Domingo y toda RD. Vans con rampa, silla salvaescaleras y asistencia puerta a puerta.",
    url: URL_ES,
    siteName: "Medit RD",
    locale: "es_DO",
    images: [{ url: "/medit-logo.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reserva transporte en silla de ruedas en RD | Medit RD",
    description: "Vans con rampa, silla salvaescaleras y asistencia puerta a puerta. Desde RD$1,250.",
    images: ["/medit-logo.png"],
  },
};

export default function ReservarPage() {
  return <BookingLanding lang="es" hasLogo={hasMeditLogo()} />;
}
