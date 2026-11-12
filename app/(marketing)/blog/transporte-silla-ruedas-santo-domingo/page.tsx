import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";
import JsonLd from "@/components/public/JsonLd";
import PageHero from "@/components/public/PageHero";
import PageFAQ, { type FAQItem } from "@/components/public/PageFAQ";
import CtaBand from "@/components/public/CtaBand";
import {
  ArticleWrapper,
  ArticleMeta,
  ArticleIntro,
  ArticleH2,
  ArticleH3,
  ArticleP,
  ArticleUL,
  ArticleOL,
  ArticleTable,
  ArticleCallout,
  ArticleCtaBox,
} from "../_components";

const SLUG = "/blog/transporte-silla-ruedas-santo-domingo";
const CTA_MESSAGE = "Hola, necesito transporte accesible en silla de ruedas en Santo Domingo.";

export const metadata: Metadata = buildPageMetadata({
  slug: SLUG,
  title: "Transporte en Silla de Ruedas Santo Domingo — Guía Completa 2025",
  description:
    "El único transporte adaptado con rampa en Santo Domingo. Traslados médicos, citas de terapia, aeropuerto y tours en silla de ruedas. Reserva por WhatsApp en 2 minutos.",
});

const FAQS: FAQItem[] = [
  {
    q: "¿Qué tipos de silla de ruedas pueden subir al vehículo?",
    a: "La rampa permite la entrada de sillas de ruedas manuales, eléctricas y scooters de movilidad. Para sillas de tamaño bariátrico o dimensiones no estándar, indícanos las medidas al reservar para confirmar la compatibilidad.",
  },
  {
    q: "¿Pueden ir acompañantes en el mismo vehículo?",
    a: "Sí. El vehículo es privado. Pueden acompañarte hasta 3 personas adicionales sin costo extra.",
  },
  {
    q: "¿Ofrecen servicio de ambulancia?",
    a: "No. Medit RD es un servicio de transporte — no un servicio de emergencias médicas. Para emergencias, llama al SEMED o al 911. Nuestro servicio está diseñado para traslados programados no urgentes.",
  },
  {
    q: "¿Están disponibles los fines de semana y feriados?",
    a: "Sí. Operamos los 7 días de la semana, incluyendo feriados dominicanos y navidad. La disponibilidad puede ser más limitada en días de alta demanda, así que te recomendamos reservar con anticipación.",
  },
];

export default function Article2Page() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Transporte en Silla de Ruedas en Santo Domingo — Guía Completa 2025",
    description:
      "Todo lo que necesitas saber sobre transporte accesible en silla de ruedas en Santo Domingo: traslados médicos, citas de fisioterapia, aeropuerto y tours.",
    author: { "@type": "Organization", name: "Medit RD", url: "https://www.meditrd.site" },
    publisher: { "@type": "Organization", name: "Medit RD" },
    datePublished: "2025-11-01",
    dateModified: "2025-11-01",
    inLanguage: "es",
    mainEntityOfPage: `https://www.meditrd.site${SLUG}`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a as string },
    })),
  };

  return (
    <>
      <JsonLd schema={[articleSchema, faqSchema]} />

      <PageHero
        eyebrow="Blog · Santo Domingo"
        h1="Transporte en Silla de Ruedas en Santo Domingo — Guía Completa 2025"
        intro="Traslados médicos, fisioterapia, aeropuerto y tours — todo lo que necesitas saber sobre el único transporte con rampa en la capital."
        ctaMessage={CTA_MESSAGE}
        ctaLabel="Reservar por WhatsApp"
      />

      <ArticleWrapper>
        <ArticleMeta>Por Medit RD · Actualizado noviembre 2025 · Lectura: 7 min</ArticleMeta>
        <ArticleIntro>
          Encontrar transporte accesible en silla de ruedas en Santo Domingo es uno de los mayores retos para
          personas con discapacidad física en la República Dominicana. Los taxis regulares y aplicaciones como Uber
          no garantizan vehículos adaptados, y los servicios de salud muchas veces quedan lejos. Esta guía explica
          las opciones reales disponibles y cómo reservar el único servicio certificado de transporte accesible en
          la ciudad.
        </ArticleIntro>

        <ArticleCallout>
          Respuesta rápida: Medit RD es el único servicio de transporte con rampa operando en Santo Domingo.
          Disponible las 24 horas, 7 días a la semana. Reserva por WhatsApp: +1 (829) 329-6920.
        </ArticleCallout>

        <ArticleH2>El problema del transporte accesible en Santo Domingo</ArticleH2>
        <ArticleP>
          La realidad del transporte en Santo Domingo para usuarios de silla de ruedas es difícil. Los carros de
          concho y los autobuses públicos (OMSA) no son accesibles. Los taxis regulares requieren que el pasajero
          pueda trasladarse al asiento — no existe la infraestructura para subir una silla de ruedas eléctrica o de
          alto peso. Las aplicaciones de rideshare permiten solicitar un viaje, pero el chofer puede cancelar sin
          consecuencias al ver que el pasajero usa silla de ruedas.
        </ArticleP>
        <ArticleP>Esto tiene consecuencias graves para:</ArticleP>
        <ArticleUL
          items={[
            "Pacientes que necesitan ir a fisioterapia 2–3 veces por semana",
            "Personas en recuperación post-quirúrgica que no pueden movilizarse solos",
            "Adultos mayores con movilidad reducida que necesitan llegar a citas médicas",
            "Visitantes extranjeros con discapacidad que llegan al aeropuerto Las Américas",
          ]}
        />

        <ArticleH2>Qué ofrece Medit RD en Santo Domingo</ArticleH2>
        <ArticleP>
          Medit RD opera vehículos tipo van con rampa de entrada, sistema de sujeción para la silla de ruedas durante
          el trayecto, y choferes entrenados en asistencia de movilidad. No es un taxi regular con asiento plegado —
          es un vehículo diseñado y equipado exclusivamente para el transporte de personas en silla de ruedas.
        </ArticleP>

        <ArticleH3>Servicios disponibles en Santo Domingo</ArticleH3>
        <ArticleUL
          items={[
            "Traslados médicos: hospitales, clínicas, centros de diálisis, quimioterapia, laboratorios",
            "Fisioterapia y rehabilitación: traslados recurrentes, 2–3 veces por semana",
            "Post-cirugía: alta hospitalaria y citas de seguimiento",
            "Aeropuerto Las Américas (SDQ): llegadas y salidas internacionales",
            "Tours en Santo Domingo: Zona Colonial, Malecón, atracciones culturales",
            "Eventos y compromisos personales: bodas, graduaciones, eventos familiares",
            "Servicios recurrentes: contrato mensual para pacientes con citas regulares",
          ]}
        />

        <ArticleH2>Precios de transporte accesible en Santo Domingo (2025)</ArticleH2>
        <ArticleTable
          headers={["Servicio", "Precio estimado", "Notas"]}
          rows={[
            ["Traslado médico en SD (dentro de la ciudad)", "RD$1,800–3,500", "Según distancia"],
            ["Traslado recurrente (fisioterapia, diálisis)", "Desde RD$1,500", "Descuento por volumen"],
            ["Santo Domingo → Aeropuerto SDQ", "RD$2,500–3,500", "Seguimiento de vuelo incluido"],
            ["Santo Domingo → Punta Cana", "USD $250", "Viaje completo ~3 horas"],
            ["Tour Zona Colonial", "USD $60–80", "Guía bilingüe incluido"],
            ["Contrato mensual (citas regulares)", "Consultar", "Precio especial por volumen"],
          ]}
        />

        <ArticleH2>Cómo reservar tu traslado accesible en Santo Domingo</ArticleH2>
        <ArticleOL
          items={[
            "Escríbenos por WhatsApp al +1 (829) 329-6920",
            "Comparte tu origen, destino, fecha y hora del servicio",
            "Indica el tipo de silla de ruedas (manual, eléctrica, scooter)",
            "Confirma el servicio y recibe los datos del chofer",
          ]}
        />
        <ArticleP>
          Para citas médicas recurrentes, te recomendamos crear un calendario fijo con nosotros para garantizar
          disponibilidad.
        </ArticleP>

        <ArticleCtaBox ctaMessage={CTA_MESSAGE} ctaLabel="Escríbenos por WhatsApp">
          ¿Necesitas transporte accesible en Santo Domingo? Respuesta en menos de 15 minutos.
        </ArticleCtaBox>

        <ArticleH2>Hospitales y clínicas que frecuentemente atendemos</ArticleH2>
        <ArticleUL
          items={[
            "Centro Médico UCE",
            "Hospital General Plaza de la Salud",
            "Clínica Abreu",
            "CEDIMAT (Centro Diagnóstico y Medicina Avanzada)",
            "Clínica Corominas",
            "Centro de Oncología Dr. Heriberto Pieter",
            "Centros de diálisis en la Zona Universitaria y Naco",
          ]}
        />

        <ArticleH2>¿Por qué no usar un taxi regular o Uber para silla de ruedas?</ArticleH2>
        <ArticleUL
          items={[
            "El conductor cancela al llegar y ver la silla de ruedas",
            "El vehículo no tiene espacio para la silla desmontada",
            "No hay mecanismo para asegurar la silla durante el viaje",
            "El pasajero debe transferirse al asiento sin asistencia capacitada",
            "Riesgo de daño a la silla de ruedas eléctrica durante la carga",
          ]}
        />
        <ArticleP>
          Medit RD elimina todos estos problemas. El pasajero permanece en su silla de ruedas durante todo el
          trayecto, que queda anclada con el sistema de sujeción del vehículo.
        </ArticleP>

        <ArticleH2>Sobre Medit RD</ArticleH2>
        <ArticleP>
          Medit RD es la única empresa de transporte accesible certificada en la República Dominicana. Operamos en
          Santo Domingo, Punta Cana, La Romana y San Cristóbal con vehículos adaptados, choferes certificados y
          atención 24/7. Nuestro objetivo es que ninguna persona con discapacidad en RD tenga que quedarse en casa
          por falta de transporte.
        </ArticleP>
      </ArticleWrapper>

      <PageFAQ items={FAQS} eyebrow="Preguntas frecuentes" heading="Preguntas frecuentes" />

      <CtaBand
        heading="¿Necesitas transporte accesible en Santo Domingo?"
        subheading="Escríbenos con tu origen y destino — confirmamos tu traslado con rampa en minutos."
        ctaMessage={CTA_MESSAGE}
      />
    </>
  );
}
