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
      { id: "puj-la-romana", icon: "⛵", name: "La Romana", desc: "Casa de Campo & puerto", price: "Consultar" },
      { id: "puj-sdo", icon: "🏙️", name: "Santo Domingo", desc: "Capital ~3h desde PUJ", price: "Consultar" },
    ],
    tour: [
      { id: "puj-cata", icon: "🐬", name: "Isla Catalina & Snorkel", desc: "Arrecifes y delfines", price: "Consultar" },
      { id: "puj-hoyo", icon: "🦀", name: "Hoyo Azul & Scape Park", desc: "Cenote cristalino", price: "Consultar" },
      { id: "puj-saona", icon: "🌴", name: "Isla Saona", desc: "Playa paradisíaca", price: "Consultar" },
      { id: "puj-altos", icon: "🎨", name: "Altos de Chavón", desc: "Aldea artística", price: "Consultar" },
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
      { id: "sdq-colonial-full", icon: "🏛️", name: "City Tour + Almuerzo", desc: "Zona Colonial + almuerzo incluido", price: "$120 USD" },
      { id: "sdq-full-day", icon: "☀️", name: "Full Day Tour", desc: "9am – 6pm, día completo", price: "$160 USD" },
      { id: "sdq-night", icon: "🌙", name: "Night Tour SD", desc: "Vida nocturna capital", price: "Consultar" },
      { id: "sdq-los-haitises", icon: "🐊", name: "Los Haitises", desc: "Manglares y cuevas taínas", price: "Consultar" },
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
