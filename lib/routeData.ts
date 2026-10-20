export interface Route {
  id: string;
  icon: string;
  name: string;
  desc: string;
  price: string;
}

export interface RegionRoutes {
  transfer: Route[];
  tour: Route[];
  custom: Route[];
}

export const ROUTE_DATA: { puj: RegionRoutes; sdq: RegionRoutes } = {
  puj: {
    transfer: [
      { id: "puj-bavaro", icon: "🏖️", name: "Bávaro / Punta Cana", desc: "Resorts zona este", price: "$120 USD" },
      { id: "puj-cap-cana", icon: "🏌️", name: "Cap Cana", desc: "Golf & Resorts de lujo", price: "$80 USD" },
      { id: "puj-macao", icon: "🌊", name: "Macao", desc: "Playa salvaje del Atlántico", price: "$180 USD" },
      { id: "puj-la-romana", icon: "⛵", name: "La Romana", desc: "Casa de Campo & puerto", price: "$120 USD" },
      { id: "puj-higuey", icon: "⛪", name: "Higüey", desc: "Basílica de Higüey", price: "$100 USD" },
      { id: "puj-sdo", icon: "🏙️", name: "Santo Domingo", desc: "Capital ~3h desde PUJ", price: "$250 USD" },
    ],
    tour: [
      { id: "puj-coco-bongo", icon: "🎉", name: "Coco Bongo Entry & Transfer", desc: "Entrada y transporte al show de Coco Bongo", price: "$160 USD" },
      { id: "puj-infinity", icon: "🌙", name: "Infinity Night Club", desc: "Vida nocturna en Punta Cana", price: "$180 USD" },
      { id: "puj-downtown", icon: "🏙️", name: "Downtown Punta Cana Group Tour", desc: "Recorrido grupal por el centro de Punta Cana", price: "$120 USD" },
      { id: "puj-cigar-rum", icon: "🚬", name: "Don Lucas Cigar Factory & Rum Tour", desc: "Fábrica de cigarros y degustación de ron", price: "$130 USD" },
      { id: "puj-dinner-sky", icon: "🍽️", name: "Dinner in the Sky Punta Cana", desc: "Cena suspendida con vista panorámica", price: "$200 USD" },
    ],
    custom: [{ id: "puj-c1", icon: "✏️", name: "Ruta Personalizada PUJ", desc: "Descripción libre", price: "Consultar" }],
  },
  sdq: {
    transfer: [
      { id: "sdq-aeropuerto", icon: "✈️", name: "SDQ Aeropuerto → Ciudad", desc: "Transfer desde Las Américas", price: "$120 USD" },
      { id: "sdq-centro", icon: "🏙️", name: "Paseo / City Show", desc: "Recorridos desde hotel, hasta 3h", price: "Desde $60 USD" },
      { id: "sdq-colonial", icon: "🏛️", name: "Zona Colonial", desc: "Ciudad vieja UNESCO", price: "Desde $60 USD" },
      { id: "sdq-las-am", icon: "✈️", name: "SDQ → PUJ", desc: "Salida tierra ~3h", price: "Consultar" },
    ],
    tour: [
      { id: "sdq-colonial-full", icon: "🏛️", name: "City Tour Zona Colonial", desc: "Recorrido por la ciudad vieja UNESCO (solo transporte, no incluye almuerzo)", price: "$60 – $80 USD" },
      { id: "sdq-full-day", icon: "☀️", name: "Full Day Tour", desc: "9am – 6pm, día completo", price: "Desde $160 USD" },
      { id: "sdq-night", icon: "🌙", name: "Night Tour SD", desc: "Vida nocturna capital", price: "Desde $80 USD" },
      { id: "sdq-bar-disco", icon: "🎉", name: "Bar / Disco Tour", desc: "Recorrido nocturno por bares y discotecas de la capital", price: "Desde $80 USD" },
    ],
    custom: [{ id: "sdq-c1", icon: "✏️", name: "Ruta Personalizada SDQ", desc: "Descripción libre", price: "Consultar" }],
  },
};

// Airport route IDs (show flight number field for these)
export const AIRPORT_ROUTE_IDS = [
  "sdq-aeropuerto",
  "sdq-las-am",
  "puj-bavaro",
  "puj-cap-cana",
  "puj-macao",
  "puj-la-romana",
  "puj-sdo",
];
