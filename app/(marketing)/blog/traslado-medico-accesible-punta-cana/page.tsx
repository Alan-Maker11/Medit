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
  ArticleP,
  ArticleUL,
  ArticleTable,
  ArticleCallout,
  ArticleCtaBox,
} from "../_components";

const SLUG = "/blog/traslado-medico-accesible-punta-cana";
const CTA_MESSAGE = "Hola, necesito traslado médico accesible en Punta Cana.";

export const metadata: Metadata = buildPageMetadata({
  slug: SLUG,
  title: "Traslado Médico Accesible Punta Cana — Clínicas y Hospitales",
  description:
    "Transporte médico accesible en Punta Cana para silla de ruedas. Traslados a clínicas, hospital, fisioterapia y post-cirugía. Disponible 24/7. Reserva por WhatsApp.",
});

const FAQS: FAQItem[] = [
  {
    q: "¿Pueden recogerme directamente en el lobby del resort?",
    a: "Sí. El chofer llega directamente al lobby o entrada principal del resort. Para resorts de mayor tamaño, coordina el punto exacto de encuentro por WhatsApp antes del servicio.",
  },
  {
    q: "¿Qué pasa si termino en urgencias y necesito irme al día siguiente?",
    a: "Escríbenos por WhatsApp cuando estés listo para el traslado de regreso. Coordinamos la recogida desde la clínica u hospital cuando tú nos indiques.",
  },
  {
    q: "¿Pueden llevar al acompañante también?",
    a: "Sí. Un acompañante viaja sin cargo adicional en el mismo vehículo.",
  },
];

export default function Article8Page() {
  // The source article had no JSON-LD block; per the content brief we add a
  // simple Article schema here for consistency with the other 7 articles.
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Traslado Médico Accesible Punta Cana — Clínicas y Hospitales",
    description:
      "Transporte médico accesible en Punta Cana para silla de ruedas. Traslados a clínicas, hospital, fisioterapia y post-cirugía. Disponible 24/7. Reserva por WhatsApp.",
    author: { "@type": "Organization", name: "Medit RD", url: "https://www.meditrd.site" },
    publisher: { "@type": "Organization", name: "Medit RD", url: "https://www.meditrd.site" },
    datePublished: "2025-11-01",
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
        eyebrow="Blog · Punta Cana"
        h1="Traslado Médico Accesible en Punta Cana — Guía Completa"
        intro="Transporte accesible a clínicas y hospitales de Bávaro, disponible las 24 horas para visitantes y residentes en silla de ruedas."
        ctaMessage={CTA_MESSAGE}
        ctaLabel="Solicitar traslado"
      />

      <ArticleWrapper>
        <ArticleMeta>Por Medit RD · Actualizado noviembre 2025</ArticleMeta>
        <ArticleIntro>
          Los visitantes y residentes en Punta Cana que necesitan transporte a una clínica u hospital en silla de
          ruedas enfrentan un problema real: los taxis y shuttles del resort no tienen rampas, y el sistema de
          salud local no ofrece transporte accesible no urgente. Medit RD cubre exactamente esta necesidad.
        </ArticleIntro>

        <ArticleCallout emoji="⚠️">
          Aviso importante: Medit RD ofrece transporte no urgente programado. Para emergencias médicas, llama al
          911. Para el SEMED (Servicio de Emergencias): 829-200-7000.
        </ArticleCallout>

        <ArticleH2>Centros médicos en Punta Cana a los que trasladamos</ArticleH2>
        <ArticleUL
          items={[
            "Centro Médico Punta Cana (Bávaro) — clínica privada principal de la zona turística",
            "Hospiten Bávaro — hospital privado con servicios de especialidades",
            "Clínica Dr. Canela — consultorio médico en Bávaro",
            "Farmacias Carol / Farmacia Suiza — para traslados de pacientes post-consulta",
            "Centros de fisioterapia en Bávaro — terapia física para turistas lesionados en resort",
          ]}
        />
        <ArticleP>
          Para tratamientos especializados (oncología, cardiología, neurología), coordinamos el traslado hasta
          Santo Domingo o La Romana.
        </ArticleP>

        <ArticleH2>Situaciones comunes que atendemos en Punta Cana</ArticleH2>
        <ArticleUL
          items={[
            "Lesión en resort: visitante que se lastimó en la piscina, playa o excursión y necesita ir a la clínica en silla de ruedas",
            "Viajero con silla de ruedas: turista que llegó con su propia silla y necesita transporte médico durante la estadía",
            "Adulto mayor: huéspedes mayores que necesitan llegar a una cita médica fuera del resort",
            "Post-cirugía reciente: paciente que viajó poco después de una operación y necesita movilizarse de forma segura",
            "Residente expat: extranjero que vive en Punta Cana y necesita transporte médico regular",
          ]}
        />

        <ArticleH2>Punta Cana → Santo Domingo: traslado médico de larga distancia</ArticleH2>
        <ArticleP>
          Para tratamientos especializados que no están disponibles en Punta Cana, Medit RD realiza traslados
          accesibles desde la zona turística hasta los principales hospitales de Santo Domingo. El trayecto dura
          aproximadamente 2.5–3 horas en vehículo adaptado con asientos confortables para el paciente en su silla
          de ruedas. Precio: desde USD $250 por trayecto. Incluye espera de hasta 2 horas en el centro médico para
          el retorno.
        </ArticleP>

        <ArticleH2>Transporte para turistas lesionados en resorts</ArticleH2>
        <ArticleP>
          Los resorts de Punta Cana atienden miles de huéspedes cada semana. Las lesiones ocurren — torceduras en
          la playa, caídas en la piscina, problemas de salud preexistentes que se agudizan. Cuando el resort no
          puede proveer transporte médico accesible, Medit RD responde. Muchos coordinadores de salud de los
          resorts de la zona tienen nuestro número guardado.
        </ArticleP>

        <ArticleCtaBox ctaMessage={CTA_MESSAGE} ctaLabel="Solicitar traslado por WhatsApp">
          ¿Necesitas traslado médico accesible en Punta Cana? Respuesta en 15 minutos — disponible 24/7.
        </ArticleCtaBox>

        <ArticleH2>Precios de traslado médico en Punta Cana</ArticleH2>
        <ArticleTable
          headers={["Servicio", "Precio estimado"]}
          rows={[
            ["Resort → Clínica en Bávaro (ida)", "USD $40–60"],
            ["Resort → Clínica y retorno (espera incluida)", "USD $80–120"],
            ["Punta Cana → Santo Domingo (médico)", "USD $250"],
            ["Traslado de alta hospitalaria", "Consultar según destino"],
          ]}
        />

        <ArticleH2>Sobre Medit RD</ArticleH2>
        <ArticleP>
          Medit RD es la única empresa certificada de transporte accesible en silla de ruedas operando en Punta
          Cana, Santo Domingo y La Romana. Vehículos con rampa, choferes certificados, disponibles 24/7.
        </ArticleP>
      </ArticleWrapper>

      <PageFAQ items={FAQS} eyebrow="Preguntas frecuentes" heading="Preguntas frecuentes" />

      <CtaBand
        heading="¿Necesitas traslado médico en Punta Cana?"
        subheading="Escríbenos con la ubicación y la hora — coordinamos el traslado accesible en minutos."
        ctaMessage={CTA_MESSAGE}
      />
    </>
  );
}
