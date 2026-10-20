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
      { id: "puj-bavaro", icon: "🏖️", name: "Bávaro / Punta Cana", desc: "East-side resorts", price: "$120 USD" },
      { id: "puj-cap-cana", icon: "🏌️", name: "Cap Cana", desc: "Golf & luxury resorts", price: "$80 USD" },
      { id: "puj-macao", icon: "🌊", name: "Macao", desc: "Wild Atlantic beach", price: "$180 USD" },
      { id: "puj-la-romana", icon: "⛵", name: "La Romana", desc: "Casa de Campo & marina", price: "$120 USD" },
      { id: "puj-higuey", icon: "⛪", name: "Higüey", desc: "Basilica of Higüey", price: "$100 USD" },
      { id: "puj-sdo", icon: "🏙️", name: "Santo Domingo", desc: "Capital, ~3h from PUJ", price: "$250 USD" },
    ],
    tour: [
      { id: "puj-coco-bongo", icon: "🎉", name: "Coco Bongo Entry & Transfer", desc: "Entry and transfer to the Coco Bongo show", price: "$160 USD" },
      { id: "puj-infinity", icon: "🌙", name: "Infinity Night Club", desc: "Nightlife in Punta Cana", price: "$180 USD" },
      { id: "puj-downtown", icon: "🏙️", name: "Downtown Punta Cana Group Tour", desc: "Group tour through downtown Punta Cana", price: "$120 USD" },
      { id: "puj-cigar-rum", icon: "🚬", name: "Don Lucas Cigar Factory & Rum Tour", desc: "Cigar factory and rum tasting", price: "$130 USD" },
      { id: "puj-dinner-sky", icon: "🍽️", name: "Dinner in the Sky Punta Cana", desc: "Suspended dining with panoramic views", price: "$200 USD" },
    ],
    custom: [{ id: "puj-c1", icon: "✏️", name: "Custom Route — PUJ", desc: "Free-form description", price: "Price on request" }],
  },
  sdq: {
    transfer: [
      { id: "sdq-aeropuerto", icon: "✈️", name: "SDQ Airport → City", desc: "Transfer from Las Américas", price: "$120 USD" },
      { id: "sdq-centro", icon: "🏙️", name: "City Tour / Night Out", desc: "Hotel pickup, up to 3h", price: "From $60 USD" },
      { id: "sdq-colonial", icon: "🏛️", name: "Zona Colonial", desc: "UNESCO old town", price: "From $60 USD" },
      { id: "sdq-las-am", icon: "✈️", name: "SDQ → PUJ", desc: "Overland transfer, ~3h", price: "Price on request" },
    ],
    tour: [
      { id: "sdq-colonial-full", icon: "🏛️", name: "City Tour — Zona Colonial", desc: "Tour of the UNESCO old town (transport only, lunch not included)", price: "$60 – $80 USD" },
      { id: "sdq-full-day", icon: "☀️", name: "Full Day Tour", desc: "9am – 6pm, full day", price: "From $160 USD" },
      { id: "sdq-night", icon: "🌙", name: "Night Tour — Santo Domingo", desc: "Capital nightlife", price: "From $80 USD" },
      { id: "sdq-bar-disco", icon: "🎉", name: "Bar / Club Tour", desc: "Night tour of the capital's bars and clubs", price: "From $80 USD" },
    ],
    custom: [{ id: "sdq-c1", icon: "✏️", name: "Custom Route — SDQ", desc: "Free-form description", price: "Price on request" }],
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
