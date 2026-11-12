export default function SchemaMarkup() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "TaxiService"],
    "@id": "https://www.meditrd.site/#business",
    name: "Medit RD — Transporte Accesible",
    alternateName: "Medit Transport",
    description:
      "Wheelchair-accessible private transfers, airport pickups, resort transportation, and private tours in Punta Cana and Santo Domingo, Dominican Republic.",
    url: "https://www.meditrd.site",
    telephone: "+18293296920",
    email: "medicapatrans@gmail.com",
    logo: {
      "@type": "ImageObject",
      url: "https://www.meditrd.site/medit-logo.png",
    },
    image: "https://www.meditrd.site/api/og",
    priceRange: "$60 – $180 USD",
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Credit Card, Debit Card, Bank Transfer, CashApp, Zelle, PayPal, Revolut",
    areaServed: [
      { "@type": "City", name: "Punta Cana", containedInPlace: { "@type": "Country", name: "Dominican Republic" } },
      { "@type": "City", name: "Santo Domingo", containedInPlace: { "@type": "Country", name: "Dominican Republic" } },
      { "@type": "City", name: "Bávaro", containedInPlace: { "@type": "Country", name: "Dominican Republic" } },
      { "@type": "City", name: "La Romana", containedInPlace: { "@type": "Country", name: "Dominican Republic" } },
      { "@type": "City", name: "Las Terrenas", containedInPlace: { "@type": "Country", name: "Dominican Republic" } },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Accessible Transportation Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Airport Transfer — Punta Cana (PUJ)",
            description:
              "Wheelchair-accessible private transfer to/from Punta Cana International Airport (PUJ). Door-to-door, GPS-tracked, certified vehicle.",
          },
          price: "120",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Airport Transfer — Santo Domingo (SDQ)",
            description:
              "Wheelchair-accessible private transfer to/from Las Américas International Airport (SDQ). Direct, private, 24/7.",
          },
          price: "120",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "City Tour + Lunch — Santo Domingo",
            description:
              "Full accessible city tour of Santo Domingo's UNESCO Zona Colonial with lunch included. Wheelchair ramp, certified guide.",
          },
          price: "120",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Full Day Accessible Tour — Santo Domingo",
            description: "Complete 9am–6pm accessible private tour of Santo Domingo for wheelchair users and companions.",
          },
          price: "160",
          priceCurrency: "USD",
        },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "47",
    },
    sameAs: ["https://www.facebook.com/meditrd", "https://www.instagram.com/meditrd"],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Are your vehicles wheelchair accessible?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. All Medit RD vehicles are equipped with manual and electric rear ramps, 4-point wheelchair anchoring systems, and certified accessible seating. We accommodate both manual and motorized wheelchairs.",
        },
      },
      {
        "@type": "Question",
        name: "Do you monitor flights for airport pickups?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. We track your flight in real time using flight monitoring tools. If your flight is delayed, your driver adjusts accordingly at no extra charge.",
        },
      },
      {
        "@type": "Question",
        name: "What areas do you serve in the Dominican Republic?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We cover Punta Cana, Bávaro, Cap Cana, La Romana, Macao, Santo Domingo, Las Terrenas, and routes between all major tourist destinations. We also offer intercity transfers (PUJ ↔ SDQ).",
        },
      },
      {
        "@type": "Question",
        name: "How do I book a transfer or tour?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use our online booking wizard on this page to select your route, add-ons, date and passengers, then confirm instantly via WhatsApp. We respond within minutes.",
        },
      },
      {
        "@type": "Question",
        name: "What accessibility add-ons are available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We offer wheelchair transport (+$10), electric stair climber (+$15), child safety seat (+$10), and in-vehicle refreshments. All add-ons are selected during the booking process.",
        },
      },
      {
        "@type": "Question",
        name: "What is the passenger limit per vehicle?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Airport transfers accommodate up to 3 passengers (wheelchair user + 2 companions + luggage). Tours accommodate up to 5 passengers (wheelchair user + 4 companions).",
        },
      },
      {
        "@type": "Question",
        name: "Do you offer round-trip transfers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Round-trip transfers are available and can be selected during the booking process. The return journey is priced the same as the outbound transfer.",
        },
      },
      {
        "@type": "Question",
        name: "Is there wheelchair accessible transport in Punta Cana?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Medit RD is the only certified wheelchair-accessible transportation company operating in Punta Cana. We provide airport transfers, resort-to-resort transport, medical transport, and accessible tours with ramp-equipped vans and trained drivers, available 24/7.",
        },
      },
      {
        "@type": "Question",
        name: "How much does a wheelchair accessible airport transfer from PUJ cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Wheelchair accessible airport transfers from Punta Cana International Airport (PUJ) start at $80 USD for Cap Cana, $120 USD for Bávaro/Punta Cana hotel zone, and $180 USD for La Romana. All prices include the ramp-equipped van, driver assistance, and wheelchair securement.",
        },
      },
      {
        "@type": "Question",
        name: "Can I bring my power wheelchair on a flight to Punta Cana?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. All major airlines flying into PUJ must accept power wheelchairs in the cargo hold with advance notice. Notify your airline at the time of booking, not at check-in. Remove lithium batteries per airline policy. Medit RD will transport you in your own wheelchair from the moment you land.",
        },
      },
      {
        "@type": "Question",
        name: "Does Medit RD offer medical transport for dialysis patients in Santo Domingo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Medit RD provides recurring wheelchair-accessible medical transport for dialysis patients, chemotherapy patients, and other regular medical appointments in Santo Domingo and Punta Cana. We work with all major private hospitals including UCE, Plaza de la Salud, Abreu, CEDIMAT, and Corominas.",
        },
      },
      {
        "@type": "Question",
        name: "Are there wheelchair accessible tours in Punta Cana?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Medit RD offers wheelchair-accessible tours from Punta Cana including the Zona Colonial UNESCO heritage tour in Santo Domingo ($60-80), Punta Cana city tour ($120), cigar and rum distillery tour ($130), Dinner in the Sky ($200), and full-day island tours. All tours use adapted vans with ramps.",
        },
      },
      {
        "@type": "Question",
        name: "How do I book wheelchair accessible transport in Dominican Republic?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Book Medit RD via WhatsApp at +1 (829) 329-6920. Send a message with your pickup location, destination, date, time, and wheelchair type. We respond within 15 minutes and confirm your booking with a price quote. No app required.",
        },
      },
      {
        "@type": "Question",
        name: "Is Medit RD available in Santo Domingo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Medit RD operates in Santo Domingo, Punta Cana, La Romana, Cap Cana, and routes between all cities. In Santo Domingo we serve airport transfers (SDQ), medical transport to all major hospitals, and guided tours of the Zona Colonial.",
        },
      },
      {
        "@type": "Question",
        name: "What type of wheelchair accessible vehicles does Medit RD use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Medit RD uses full-size accessible vans equipped with ramps, four-point wheelchair tie-down securement systems, and air conditioning. Vehicles accommodate manual and power wheelchairs up to 700 lbs / 318 kg combined passenger and chair weight.",
        },
      },
    ],
  };

  const airportTransferService = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Wheelchair Accessible Airport Transfer — Punta Cana (PUJ)",
    provider: { "@type": "LocalBusiness", name: "Medit RD" },
    areaServed: "Punta Cana, Dominican Republic",
    offers: { "@type": "AggregateOffer", priceCurrency: "USD", lowPrice: "80", highPrice: "250" },
  };

  const touristTripService = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: "Wheelchair-Accessible Tours — Punta Cana & Santo Domingo",
    description:
      "Private wheelchair-accessible day tours and excursions across the Dominican Republic. Includes Isla Catalina, Hoyo Azul, Altos de Chavón, Zona Colonial, Los Haitises, and more.",
    touristType: [
      { "@type": "Audience", audienceType: "Wheelchair users" },
      { "@type": "Audience", audienceType: "Travelers with disabilities" },
      { "@type": "Audience", audienceType: "Post-surgery travelers" },
    ],
    itinerary: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Isla Catalina & Snorkeling",
          item: { "@type": "TouristAttraction", name: "Isla Catalina", address: { "@type": "PostalAddress", addressCountry: "DO" } },
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Hoyo Azul & Scape Park",
          item: {
            "@type": "TouristAttraction",
            name: "Hoyo Azul",
            address: { "@type": "PostalAddress", addressLocality: "Cap Cana", addressCountry: "DO" },
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Zona Colonial UNESCO",
          item: {
            "@type": "TouristAttraction",
            name: "Zona Colonial",
            address: { "@type": "PostalAddress", addressLocality: "Santo Domingo", addressCountry: "DO" },
          },
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Los Haitises National Park",
          item: { "@type": "TouristAttraction", name: "Los Haitises", address: { "@type": "PostalAddress", addressCountry: "DO" } },
        },
      ],
    },
    provider: {
      "@type": "LocalBusiness",
      name: "Medit RD",
      url: "https://www.meditrd.site",
      telephone: "+18293296920",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(touristTripService) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(airportTransferService) }} />
    </>
  );
}
