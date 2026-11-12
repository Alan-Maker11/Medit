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
  ArticleCallout,
  ArticleCtaBox,
} from "../_components";

const SLUG = "/blog/turismo-accesible-republica-dominicana";
const CTA_MESSAGE = "Hola, quiero planificar mi visita accesible a República Dominicana.";

export const metadata: Metadata = buildPageMetadata({
  slug: SLUG,
  title: "Turismo Accesible República Dominicana — Guía Completa 2025",
  description:
    "Guía completa de turismo accesible en República Dominicana para personas con discapacidad física y usuarios de silla de ruedas. Hoteles, playas, tours y transporte accesible en Punta Cana y Santo Domingo.",
});

const FAQS: FAQItem[] = [
  {
    q: "¿Puedo llevar mi silla de ruedas eléctrica en el avión a Punta Cana?",
    a: "Sí. Las aerolíneas están obligadas a aceptar sillas de ruedas eléctricas en la bodega de cargo con notificación previa. Notifica a la aerolínea al momento de la reserva, no en el aeropuerto. Las baterías de litio deben seguir las normas específicas de cada aerolínea.",
  },
  {
    q: "¿Cuánto cuesta el transporte accesible en Punta Cana?",
    a: "Los traslados desde el aeropuerto de Punta Cana comienzan en $80 USD para Cap Cana y $120 USD para la zona de Bávaro. Los tours accesibles comienzan en $60 USD. Ver la tabla de precios en meditrd.site.",
  },
  {
    q: "¿La República Dominicana tiene leyes de accesibilidad?",
    a: "Sí. La Ley 5-13 sobre Discapacidad establece derechos de accesibilidad. En la práctica, la aplicación varía. Los grandes establecimientos turísticos generalmente cumplen mejor que los pequeños negocios locales.",
  },
  {
    q: "¿Puedo alquilar una silla de ruedas en Punta Cana?",
    a: "Algunos resorts tienen sillas de ruedas para préstamo interno. Para transporte fuera del resort, necesitarás tu propia silla. No existe un servicio amplio de alquiler de sillas de ruedas en zonas turísticas.",
  },
];

export default function Article6Page() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Turismo Accesible en República Dominicana — Guía Completa 2025",
    inLanguage: "es",
    author: { "@type": "Organization", name: "Medit RD" },
    datePublished: "2025-11-01",
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
        eyebrow="Blog · República Dominicana"
        h1="Turismo Accesible en República Dominicana — Guía Completa 2025"
        intro="Una visión honesta y práctica del turismo accesible en RD: transporte, hoteles, playas y atracciones para personas con discapacidad física."
        ctaMessage={CTA_MESSAGE}
        ctaLabel="Planificar mi viaje"
      />

      <ArticleWrapper>
        <ArticleMeta>Por Medit RD · Actualizado noviembre 2025</ArticleMeta>
        <ArticleIntro>
          La República Dominicana recibe millones de visitantes cada año — pero las personas con discapacidad
          física y usuarios de silla de ruedas frecuentemente encuentran que la información sobre accesibilidad es
          incompleta, optimista en exceso, o simplemente incorrecta. Esta guía ofrece una visión honesta y práctica
          del turismo accesible en RD, con información real sobre transporte, hoteles, playas y atracciones.
        </ArticleIntro>

        <ArticleCallout>
          Medit RD es el único servicio de transporte accesible certificado en la República Dominicana, operando en
          Punta Cana, Santo Domingo y La Romana. Reserva por WhatsApp: +1 (829) 329-6920.
        </ArticleCallout>

        <ArticleH2>¿Es la República Dominicana accesible para personas con discapacidad?</ArticleH2>
        <ArticleP>
          La respuesta corta es: parcialmente, y depende mucho de la zona. Las zonas turísticas de Punta Cana y Cap
          Cana tienen mejor infraestructura que las ciudades. Santo Domingo tiene avances en algunas áreas pero
          deficiencias importantes en otras. El transporte público es generalmente inaccesible para silla de
          ruedas.
        </ArticleP>
        <ArticleP>Lo que funciona bien:</ArticleP>
        <ArticleUL
          items={[
            "Los grandes resorts all-inclusive de Punta Cana suelen tener habitaciones adaptadas",
            "Los centros comerciales modernos en Santo Domingo tienen elevadores y rampas",
            "El aeropuerto de Punta Cana (PUJ) tiene asistencia de movilidad a través de las aerolíneas",
            "El Malecón de Santo Domingo es amplio y sin escalones",
            "Medit RD cubre todo el país para transporte accesible privado",
          ]}
        />
        <ArticleP>Lo que necesita mejora:</ArticleP>
        <ArticleUL
          items={[
            "Los taxis y aplicaciones de rideshare no tienen vehículos adaptados",
            "El transporte público (guaguas, carros de concho) es completamente inaccesible",
            "Las calles históricas (Zona Colonial) son adoquinadas y difíciles para sillas",
            "Muchos restaurantes y negocios locales tienen escalones de entrada",
            "Las playas públicas raramente tienen acceso adaptado",
          ]}
        />

        <ArticleH2>Transporte accesible en República Dominicana</ArticleH2>
        <ArticleP>
          Medit RD es la única opción de transporte privado accesible para usuarios de silla de ruedas en el país.
          No existe una red de taxis adaptados, ni servicios de transporte público accesible. Lo que cubre Medit RD:
        </ArticleP>
        <ArticleUL
          items={[
            "Traslados desde y hacia los aeropuertos PUJ (Punta Cana) y SDQ (Santo Domingo)",
            "Traslados entre hoteles, resorts y atracciones",
            "Transporte médico a hospitales, clínicas y centros de rehabilitación",
            "Tours y excursiones accesibles en Punta Cana y Santo Domingo",
            "Transporte entre ciudades (Punta Cana ↔ Santo Domingo, Santo Domingo ↔ La Romana)",
          ]}
        />

        <ArticleCtaBox ctaMessage={CTA_MESSAGE} ctaLabel="Planificar por WhatsApp">
          Planifica todo tu transporte con Medit RD. Una sola conversación de WhatsApp para todos tus traslados.
        </ArticleCtaBox>

        <ArticleH2>Hoteles accesibles en Punta Cana — Qué preguntar</ArticleH2>
        <ArticleUL
          items={[
            "Ancho de la puerta de la habitación (mínimo 81 cm para sillas estándar)",
            "¿Baño con ducha roll-in o bañera? ¿Hay banco en la ducha?",
            "¿La habitación tiene acceso directo a la piscina sin escalones?",
            "¿Hay alfombra de acceso a la playa (beach matting)?",
            "¿Hay sillas de playa anfibias disponibles?",
          ]}
        />

        <ArticleH3>Zonas con mejor accesibilidad</ArticleH3>
        <ArticleUL
          items={[
            "Cap Cana: desarrollo más moderno con calzadas más amplias y mejor diseño de accesibilidad. Los resorts nuevos son generalmente mejores",
            "Zona de Bávaro/Punta Cana: variable. Los resorts nuevos (Grand Hyatt, Hard Rock) son mejores que los más antiguos",
          ]}
        />

        <ArticleH2>Playas accesibles en Punta Cana</ArticleH2>

        <ArticleH3>Beach matting (alfombra de playa)</ArticleH3>
        <ArticleP>
          Algunos resorts instalan alfombras flotantes desde el deck de la piscina hasta la orilla del mar. No
          todos los resorts tienen esto — confirma antes de reservar.
        </ArticleP>

        <ArticleH3>Sillas de playa anfibias</ArticleH3>
        <ArticleP>
          Varias cadenas hoteleras en Bávaro ofrecen sillas de ruedas anfibias (con ruedas tipo globo que flotan y
          pueden entrar al agua). Son gratuitas, pero se deben reservar con anticipación a través del resort.
        </ArticleP>

        <ArticleH2>Santo Domingo para usuarios de silla de ruedas</ArticleH2>

        <ArticleH3>Zona Colonial (Patrimonio UNESCO)</ArticleH3>
        <ArticleP>
          El casco histórico de Santo Domingo tiene calles adoquinadas que pueden ser difíciles para sillas
          manuales. Las sillas eléctricas las manejan bien. Los monumentos principales tienen acceso en planta baja
          o rutas alternativas accesibles. Medit RD ofrece el tour de Zona Colonial con un guía que conoce las
          rutas más accesibles.
        </ArticleP>

        <ArticleH3>Malecón</ArticleH3>
        <ArticleP>
          El paseo del Malecón es amplio, plano y accesible. Es ideal para un recorrido tranquilo con vista al mar
          Caribe.
        </ArticleP>

        <ArticleH3>Centros comerciales</ArticleH3>
        <ArticleP>
          Los centros comerciales modernos (Blue Mall, Agora Mall, Acropolis) tienen acceso completo: elevadores,
          rampas, estacionamiento accesible y baños adaptados.
        </ArticleP>

        <ArticleH2>Consejos prácticos para viajar a RD en silla de ruedas</ArticleH2>
        <ArticleUL
          items={[
            "Reserva el transporte antes de llegar: no llegues al aeropuerto esperando encontrar transporte accesible. Reserva Medit RD al menos 48 horas antes",
            "Guarda el número de Medit RD desde el primer día",
            "Confirma accesibilidad del resort en detalle: pide medidas específicas",
            "Para viajes de larga estadía: consulta sobre planes de transporte mensual",
            "Protección solar: el sol en RD es intenso todo el año",
          ]}
        />

        <ArticleH2>Sobre Medit RD</ArticleH2>
        <ArticleP>
          Medit RD es la única empresa de transporte accesible certificada en la República Dominicana. Operamos
          24/7 en Punta Cana, Santo Domingo, La Romana y Cap Cana con vehículos con rampa y choferes entrenados en
          asistencia de movilidad.
        </ArticleP>
      </ArticleWrapper>

      <PageFAQ items={FAQS} eyebrow="Preguntas frecuentes" heading="Preguntas frecuentes sobre turismo accesible en RD" />

      <CtaBand
        heading="¿Listo para planificar tu viaje accesible?"
        subheading="Cuéntanos tus fechas y destino — te ayudamos a coordinar transporte, tours y traslados."
        ctaMessage={CTA_MESSAGE}
      />
    </>
  );
}
