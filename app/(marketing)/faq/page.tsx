import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/pageMetadata";
import JsonLd from "@/components/public/JsonLd";
import PageHero from "@/components/public/PageHero";
import TrustBar from "@/components/public/TrustBar";
import PageFAQ, { type FAQItem } from "@/components/public/PageFAQ";
import CtaBand from "@/components/public/CtaBand";

const SLUG = "/faq";

export const metadata: Metadata = buildPageMetadata({
  slug: SLUG,
  title: "Wheelchair Travel FAQ — Dominican Republic",
  description:
    "Every question answered about traveling to the DR in a wheelchair — airports, transport, resorts, beaches, tours, medical travel, and booking with Medit RD.",
});

/** Inline internal link, styled exactly like the links used on the other 11 pages. */
function L({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="font-semibold text-medit-teal-2 underline dark:text-medit-teal">
      {children}
    </a>
  );
}

interface FaqEntry extends FAQItem {
  /** Plain-text answer, used to build the FAQPage JSON-LD (no markup, same facts). */
  plain: string;
}

interface FaqSection {
  id: string;
  number: string;
  title: string;
  items: FaqEntry[];
}

const SECTIONS: FaqSection[] = [
  {
    id: "flying-to-the-dr",
    number: "01",
    title: "Flying to the DR",
    items: [
      {
        q: "Can I fly to the Dominican Republic in a wheelchair?",
        plain:
          "Yes. The DR's main international airports — Punta Cana (PUJ) and Las Américas in Santo Domingo (SDQ) — handle wheelchair passengers daily. All major international airlines serving the DR are required by their home country regulations (US DOT for American carriers, EU 1107/2006 for European carriers) to provide wheelchair assistance at no charge.",
        a: "Yes. The DR's main international airports — Punta Cana (PUJ) and Las Américas in Santo Domingo (SDQ) — handle wheelchair passengers daily. All major international airlines serving the DR are required by their home country regulations (US DOT for American carriers, EU 1107/2006 for European carriers) to provide wheelchair assistance at no charge.",
      },
      {
        q: "Do I need to notify the airline about my wheelchair before flying?",
        plain:
          "Yes — notify your airline at least 48 hours before departure, and confirm again at check-in. Tell them: (1) whether you use a manual or power wheelchair, (2) battery type if power (lithium-ion vs. sealed lead-acid), and (3) whether you need an aisle chair to board.",
        a: "Yes — notify your airline at least 48 hours before departure, and confirm again at check-in. Tell them: (1) whether you use a manual or power wheelchair, (2) battery type if power (lithium-ion vs. sealed lead-acid), and (3) whether you need an aisle chair to board.",
      },
      {
        q: "Can I keep my wheelchair until I board the plane?",
        plain:
          "Yes. Gate-checking is standard. You roll to the jet bridge, transfer to an aisle chair if needed, and your wheelchair is stored in the hold. It should be waiting at the jet bridge upon arrival — not at baggage claim — though this sometimes fails. Always confirm this expectation at the gate.",
        a: "Yes. Gate-checking is standard. You roll to the jet bridge, transfer to an aisle chair if needed, and your wheelchair is stored in the hold. It should be waiting at the jet bridge upon arrival — not at baggage claim — though this sometimes fails. Always confirm this expectation at the gate.",
      },
      {
        q: "What happens to my power wheelchair during the flight?",
        plain:
          "Power wheelchairs are stored in the cargo hold. Lithium-ion batteries may need to be disconnected and carried in the cabin — check your airline's policy. Sealed lead-acid batteries must be disconnected and sometimes require documentation. Pack a bag with the battery's spec sheet, your chair's manual, and any tools needed to reconnect it.",
        a: "Power wheelchairs are stored in the cargo hold. Lithium-ion batteries may need to be disconnected and carried in the cabin — check your airline's policy. Sealed lead-acid batteries must be disconnected and sometimes require documentation. Pack a bag with the battery's spec sheet, your chair's manual, and any tools needed to reconnect it.",
      },
      {
        q: "What if my wheelchair is damaged by the airline?",
        plain:
          "Document everything before you fly: photograph your chair, note its dimensions and weight. If it arrives damaged, file a claim at the airport before leaving — do not wait. Under US DOT rules, airlines are liable for damage to wheelchairs and must provide a loaner if yours is unusable.",
        a: "Document everything before you fly: photograph your chair, note its dimensions and weight. If it arrives damaged, file a claim at the airport before leaving — do not wait. Under US DOT rules, airlines are liable for damage to wheelchairs and must provide a loaner if yours is unusable.",
      },
      {
        q: "Can I bring a manual travel wheelchair as a backup?",
        plain:
          "Absolutely — and it's strongly recommended. A lightweight folding travel chair is easy to gate-check and invaluable if your primary chair is delayed or damaged. It also makes navigating tighter spaces in the DR easier.",
        a: "Absolutely — and it's strongly recommended. A lightweight folding travel chair is easy to gate-check and invaluable if your primary chair is delayed or damaged. It also makes navigating tighter spaces in the DR easier.",
      },
      {
        q: "Does travel insurance cover wheelchair damage or airline delays?",
        plain:
          'Standard travel insurance usually covers lost or damaged baggage, which can include mobility equipment. Look for policies that specifically list "mobility equipment" or "medical devices" in their coverage. World Nomads and Battleface are frequently recommended by disabled travelers.',
        a: 'Standard travel insurance usually covers lost or damaged baggage, which can include mobility equipment. Look for policies that specifically list "mobility equipment" or "medical devices" in their coverage. World Nomads and Battleface are frequently recommended by disabled travelers.',
      },
    ],
  },
  {
    id: "arriving-and-departing",
    number: "02",
    title: "Arriving & Departing",
    items: [
      {
        q: "Is Punta Cana Airport (PUJ) wheelchair accessible?",
        plain:
          "Generally yes. PUJ has ramps, elevators, and wheelchair assistance staff. The newer terminals are more accessible than older sections. Wheelchair assistance is free — request it when you check in and again at the gate.",
        a: "Generally yes. PUJ has ramps, elevators, and wheelchair assistance staff. The newer terminals are more accessible than older sections. Wheelchair assistance is free — request it when you check in and again at the gate.",
      },
      {
        q: "Is Las Américas Airport (SDQ) in Santo Domingo wheelchair accessible?",
        plain:
          "SDQ is functional but less polished than PUJ. Ramps and elevators exist but signage is limited. The accessibility assistance team is present but may take longer to respond than at a large US hub. Book your ground transport in advance.",
        a: "SDQ is functional but less polished than PUJ. Ramps and elevators exist but signage is limited. The accessibility assistance team is present but may take longer to respond than at a large US hub. Book your ground transport in advance.",
      },
      {
        q: "Can I get through Customs and Immigration in a wheelchair at PUJ or SDQ?",
        plain:
          "Yes. Both airports have wheelchair-accessible passport control lanes. At peak arrival times, wait times can be 30–60 minutes. Tell the first officer you encounter that you need the accessible lane.",
        a: "Yes. Both airports have wheelchair-accessible passport control lanes. At peak arrival times, wait times can be 30–60 minutes. Tell the first officer you encounter that you need the accessible lane.",
      },
      {
        q: "Is there a place to charge a power wheelchair battery at PUJ or SDQ?",
        plain:
          "There are electrical outlets in the waiting areas of both airports. The voltage in the DR is 110V / 60Hz — the same as the US — so no converter is needed for US-bought equipment.",
        a: "There are electrical outlets in the waiting areas of both airports. The voltage in the DR is 110V / 60Hz — the same as the US — so no converter is needed for US-bought equipment.",
      },
      {
        q: "When departing, how early should I arrive at the airport in a wheelchair?",
        plain:
          "Arrive at least 3 hours before international departures. Pre-check-in online when possible to skip the check-in line and go directly to the assistance desk.",
        a: "Arrive at least 3 hours before international departures. Pre-check-in online when possible to skip the check-in line and go directly to the assistance desk.",
      },
    ],
  },
  {
    id: "ground-transportation",
    number: "03",
    title: "Ground Transportation",
    items: [
      {
        q: "Is there wheelchair-accessible transportation from Punta Cana Airport to the resorts?",
        plain:
          "Yes — but you have to book it in advance. Standard hotel shuttles and taxi vans are rarely ramp-equipped. Medit RD operates ramp-equipped accessible vans with flight tracking and driver meet-and-greet at arrivals, booked through our Punta Cana airport transfer service. Book at least 24 hours ahead via WhatsApp.",
        a: (
          <>
            Yes — but you have to book it in advance. Standard hotel shuttles and taxi vans are rarely ramp-equipped.
            Medit RD operates ramp-equipped accessible vans with flight tracking and driver meet-and-greet at
            arrivals, booked through our <L href="/punta-cana-airport-transfer">Punta Cana airport transfer</L>{" "}
            service. Book at least 24 hours ahead via WhatsApp.
          </>
        ),
      },
      {
        q: "Can I use a regular taxi in a wheelchair in the DR?",
        plain:
          "Only for folding manual chairs that fit in a trunk. Standard taxis are sedans or small SUVs with no ramp access. Power wheelchairs, large manual chairs, and scooters require a ramp-equipped van.",
        a: "Only for folding manual chairs that fit in a trunk. Standard taxis are sedans or small SUVs with no ramp access. Power wheelchairs, large manual chairs, and scooters require a ramp-equipped van.",
      },
      {
        q: "Can I use Uber in the Dominican Republic as a wheelchair user?",
        plain:
          "Uber operates in Santo Domingo but vehicles are standard cars with no accessibility features. No Uber wheelchair product exists in the DR. For accessible transport, a private accessible van service is the only reliable option.",
        a: "Uber operates in Santo Domingo but vehicles are standard cars with no accessibility features. No Uber wheelchair product exists in the DR. For accessible transport, a private accessible van service is the only reliable option.",
      },
      {
        q: "What if my flight is delayed — will my accessible van still be there?",
        plain:
          "Medit RD includes flight tracking in the service. We monitor your flight and adjust pickup time automatically. Always confirm this when you book.",
        a: "Medit RD includes flight tracking in the service. We monitor your flight and adjust pickup time automatically. Always confirm this when you book.",
      },
      {
        q: "Can I get from Punta Cana to Santo Domingo in a wheelchair?",
        plain:
          "Yes. A private accessible van covers the approximately 3-hour drive (200 km). Medit RD operates this intercity route. No accessible bus service exists for this route.",
        a: "Yes. A private accessible van covers the approximately 3-hour drive (200 km). Medit RD operates this intercity route. No accessible bus service exists for this route.",
      },
      {
        q: "Is there accessible public transportation in Santo Domingo?",
        plain:
          "Santo Domingo has a metro system with elevators at all stations. However, street-level access to stations is inconsistent. For anything beyond the metro corridor, a private accessible van is recommended — see our Santo Domingo airport transfer service for arrivals and point-to-point rides.",
        a: (
          <>
            Santo Domingo has a metro system with elevators at all stations. However, street-level access to stations
            is inconsistent. For anything beyond the metro corridor, a private accessible van is recommended — see
            our <L href="/santo-domingo-airport-transfer">Santo Domingo airport transfer</L> service for arrivals and
            point-to-point rides.
          </>
        ),
      },
    ],
  },
  {
    id: "hotels-and-resorts",
    number: "04",
    title: "Hotels & Resorts",
    items: [
      {
        q: "Are resorts in Punta Cana really wheelchair accessible?",
        plain:
          "Some are, some are not — marketing language is unreliable. The resorts that consistently score highest are Hyatt Ziva Cap Cana, Hard Rock Hotel & Casino Punta Cana, and Paradisus Palma Real. Always call the resort directly and ask specific questions.",
        a: "Some are, some are not — marketing language is unreliable. The resorts that consistently score highest are Hyatt Ziva Cap Cana, Hard Rock Hotel & Casino Punta Cana, and Paradisus Palma Real. Always call the resort directly and ask specific questions.",
      },
      {
        q: "What specific questions should I ask a resort before booking?",
        plain:
          "Ask: (1) Does the accessible room have a roll-in shower or a tub with a seat? (2) What is the door width? (3) Is there a beach wheelchair available? (4) Are the pool entry points ramped? (5) Is the path from my room to the beach/pool paved? (6) Are there lips or thresholds at the room entrance and bathroom?",
        a: "Ask: (1) Does the accessible room have a roll-in shower or a tub with a seat? (2) What is the door width? (3) Is there a beach wheelchair available? (4) Are the pool entry points ramped? (5) Is the path from my room to the beach/pool paved? (6) Are there lips or thresholds at the room entrance and bathroom?",
      },
      {
        q: "Can I get a beach wheelchair at Punta Cana resorts?",
        plain:
          "Some resorts offer them — Hyatt Ziva Cap Cana and Hard Rock are the most consistent. Call ahead and ask to reserve it for specific days.",
        a: "Some resorts offer them — Hyatt Ziva Cap Cana and Hard Rock are the most consistent. Call ahead and ask to reserve it for specific days.",
      },
      {
        q: "Are the resort pool areas wheelchair accessible?",
        plain:
          "Higher-end resorts generally have ramped pool entries or zero-entry pools. Mid-range resorts often have steps only. Hyatt Ziva Cap Cana and Barcelo resorts have zero-entry pools. Confirm before booking.",
        a: "Higher-end resorts generally have ramped pool entries or zero-entry pools. Mid-range resorts often have steps only. Hyatt Ziva Cap Cana and Barcelo resorts have zero-entry pools. Confirm before booking.",
      },
      {
        q: "Are hotels in Santo Domingo wheelchair accessible?",
        plain:
          "The major hotel chains (Hilton, Marriott, InterContinental) have accessible rooms. Boutique hotels in the Zona Colonial — often in historic buildings — almost never have elevators. Recommended: Hilton Santo Domingo (Piantini), Renaissance Jaragua (Gazcue).",
        a: "The major hotel chains (Hilton, Marriott, InterContinental) have accessible rooms. Boutique hotels in the Zona Colonial — often in historic buildings — almost never have elevators. Recommended: Hilton Santo Domingo (Piantini), Renaissance Jaragua (Gazcue).",
      },
    ],
  },
  {
    id: "beaches-and-outdoor-activities",
    number: "05",
    title: "Beaches & Outdoor Activities",
    items: [
      {
        q: "Can wheelchair users go to the beach in Punta Cana?",
        plain:
          "Yes — with the right preparation. Some beaches have beach mats that allow wheelchair access to the shoreline. Macao Beach has seasonal beach mats. Cap Cana resort beaches are flatter and firmer than Bávaro.",
        a: "Yes — with the right preparation. Some beaches have beach mats that allow wheelchair access to the shoreline. Macao Beach has seasonal beach mats. Cap Cana resort beaches are flatter and firmer than Bávaro.",
      },
      {
        q: "Can I go swimming in the ocean as a wheelchair user in Punta Cana?",
        plain:
          "Yes, with assistance. The Caribbean side of Punta Cana is calm and shallow — ideal for transfers from a beach wheelchair into the water. A companion is strongly recommended.",
        a: "Yes, with assistance. The Caribbean side of Punta Cana is calm and shallow — ideal for transfers from a beach wheelchair into the water. A companion is strongly recommended.",
      },
      {
        q: "Can I go to Isla Saona in a wheelchair?",
        plain:
          "Partially. The van transfer to the embarkation point is accessible with Medit RD. Boarding the catamaran requires a transfer and manual carry-on assistance at the dock. Recommended for wheelchair users with good upper body strength and a willing companion — it's one of the excursions on our Punta Cana tours page.",
        a: (
          <>
            Partially. The van transfer to the embarkation point is accessible with Medit RD. Boarding the catamaran
            requires a transfer and manual carry-on assistance at the dock. Recommended for wheelchair users with
            good upper body strength and a willing companion — it&apos;s one of the excursions on our{" "}
            <L href="/punta-cana-tours">Punta Cana tours</L> page.
          </>
        ),
      },
      {
        q: "Can I enjoy the DR's nightlife as a wheelchair user?",
        plain:
          "Yes — with private transport. In Punta Cana, venues like Hard Rock Live and Coco Bongo have flat entry points. A private accessible van makes nightlife viable — you control departure time rather than depending on resort shuttles, and this is one of the options on our Punta Cana tours page.",
        a: (
          <>
            Yes — with private transport. In Punta Cana, venues like Hard Rock Live and Coco Bongo have flat entry
            points. A private accessible van makes nightlife viable — you control departure time rather than
            depending on resort shuttles, and this is one of the options on our{" "}
            <L href="/punta-cana-tours">Punta Cana tours</L> page.
          </>
        ),
      },
    ],
  },
  {
    id: "tours-and-excursions",
    number: "06",
    title: "Tours & Excursions",
    items: [
      {
        q: "Are tours in Punta Cana wheelchair accessible?",
        plain:
          "Most standard group tours are not. The exception is tours specifically organized for wheelchair users with private accessible transport. Medit RD designs all its Punta Cana tours around wheelchair access from start to finish.",
        a: (
          <>
            Most standard group tours are not. The exception is tours specifically organized for wheelchair users
            with private accessible transport. Medit RD designs all its{" "}
            <L href="/punta-cana-tours">Punta Cana tours</L> around wheelchair access from start to finish.
          </>
        ),
      },
      {
        q: "Can I visit Altos de Chávon in a wheelchair?",
        plain:
          "Altos de Chávon has significant accessibility challenges: cobblestone streets and uneven stone surfaces throughout. A manual folding chair is easier to manage than a power chair. With a companion and an experienced driver, it is very doable.",
        a: "Altos de Chávon has significant accessibility challenges: cobblestone streets and uneven stone surfaces throughout. A manual folding chair is easier to manage than a power chair. With a companion and an experienced driver, it is very doable.",
      },
      {
        q: "Can I visit Santo Domingo's Zona Colonial in a wheelchair?",
        plain:
          "Yes, with private transport. The best approach: be driven to each major site, get out for short visits, return to the van. Walking the full historic district independently is not practical due to old stone streets. Our Zona Colonial tour is built around exactly this approach.",
        a: (
          <>
            Yes, with private transport. The best approach: be driven to each major site, get out for short visits,
            return to the van. Walking the full historic district independently is not practical due to old stone
            streets. Our <L href="/zona-colonial-tour">Zona Colonial tour</L> is built around exactly this approach.
          </>
        ),
      },
      {
        q: "Are GetYourGuide or Viator tours in Punta Cana wheelchair accessible?",
        plain:
          "Almost none of the standard listings are designed for wheelchair users. Medit RD's GYG listings are specifically listed as wheelchair accessible.",
        a: "Almost none of the standard listings are designed for wheelchair users. Medit RD's GYG listings are specifically listed as wheelchair accessible.",
      },
    ],
  },
  {
    id: "medical-and-post-surgery-travel",
    number: "07",
    title: "Medical & Post-Surgery Travel",
    items: [
      {
        q: "Can I travel to the DR after surgery?",
        plain:
          "Yes, with the right planning. Post-op patients need dedicated accessible transport for clinic-to-hotel, clinic-to-airport, and hotel-to-appointment transfers. Standard taxis and hotel shuttles are not suitable for post-op passengers — our medical transport service is built for this.",
        a: (
          <>
            Yes, with the right planning. Post-op patients need dedicated accessible transport for clinic-to-hotel,
            clinic-to-airport, and hotel-to-appointment transfers. Standard taxis and hotel shuttles are not suitable
            for post-op passengers — our <L href="/medical-transport">medical transport</L> service is built for
            this.
          </>
        ),
      },
      {
        q: "What transport do I need after a surgical procedure in the DR?",
        plain:
          "A vehicle with no step entry, reclining seats if needed, and a driver trained for post-op passengers. Medit RD's accessible vans are specifically suited for this. Book at minimum 48 hours in advance with your clinic discharge date.",
        a: "A vehicle with no step entry, reclining seats if needed, and a driver trained for post-op passengers. Medit RD's accessible vans are specifically suited for this. Book at minimum 48 hours in advance with your clinic discharge date.",
      },
      {
        q: "Which hospitals and clinics in Santo Domingo does Medit RD serve?",
        plain:
          "Medit RD serves all major medical facilities including CEDIMAT, Hospital General Plaza de la Salud, Clinica Corominas, Clinica Abreu, and Clinica Cruz Jiminian — see our medical transport page for details.",
        a: (
          <>
            Medit RD serves all major medical facilities including CEDIMAT, Hospital General Plaza de la Salud,
            Clinica Corominas, Clinica Abreu, and Clinica Cruz Jiminian — see our{" "}
            <L href="/medical-transport">medical transport</L> page for details.
          </>
        ),
      },
      {
        q: "What if I need emergency medical transport in Punta Cana?",
        plain:
          "For true emergencies, call 911. Punta Cana has a private emergency clinic (Hospiten Bavaro). For non-emergency urgent transport, Medit RD can respond within 1–2 hours during business hours. Save the number before you need it.",
        a: "For true emergencies, call 911. Punta Cana has a private emergency clinic (Hospiten Bavaro). For non-emergency urgent transport, Medit RD can respond within 1–2 hours during business hours. Save the number before you need it.",
      },
    ],
  },
  {
    id: "practical-logistics",
    number: "08",
    title: "Practical Logistics",
    items: [
      {
        q: "What is the electrical voltage in the Dominican Republic?",
        plain:
          "110V / 60Hz — the same as the United States and Canada. US plugs work without an adapter. Power outages are common outside of resort areas. Resorts use generators and have stable power.",
        a: "110V / 60Hz — the same as the United States and Canada. US plugs work without an adapter. Power outages are common outside of resort areas. Resorts use generators and have stable power.",
      },
      {
        q: "Can I charge my power wheelchair in the DR?",
        plain: "Yes. Standard US chargers plug directly into DR outlets with no adapter needed.",
        a: "Yes. Standard US chargers plug directly into DR outlets with no adapter needed.",
      },
      {
        q: "Can I find replacement parts for my wheelchair in the DR?",
        plain:
          "Basic manual wheelchair repairs are available at medical supply shops in Santo Domingo. Power wheelchair repairs and parts are very limited — bring your own repair kit and spare parts.",
        a: "Basic manual wheelchair repairs are available at medical supply shops in Santo Domingo. Power wheelchair repairs and parts are very limited — bring your own repair kit and spare parts.",
      },
      {
        q: "Are sidewalks in the DR accessible?",
        plain:
          "Generally no. Outside of resort areas and modern commercial districts, sidewalks are inconsistent, narrow, broken, or absent. This is one of the strongest arguments for private accessible transport.",
        a: "Generally no. Outside of resort areas and modern commercial districts, sidewalks are inconsistent, narrow, broken, or absent. This is one of the strongest arguments for private accessible transport.",
      },
      {
        q: "Is the weather in the DR manageable for wheelchair users?",
        plain:
          "The DR is hot and humid year-round (25–32°C). High season (December–April) is drier and cooler. Hurricane season (June–November) brings rain — September and October are peak risk months.",
        a: "The DR is hot and humid year-round (25–32°C). High season (December–April) is drier and cooler. Hurricane season (June–November) brings rain — September and October are peak risk months.",
      },
    ],
  },
  {
    id: "legal-rights-and-protections",
    number: "09",
    title: "Legal Rights & Protections",
    items: [
      {
        q: "Does the Dominican Republic have laws protecting the rights of wheelchair users?",
        plain:
          "Yes. DR Law 5-13 on Disability (2013) establishes rights for people with disabilities including equal access to transportation, public spaces, and services. The DR has also ratified the UN Convention on the Rights of Persons with Disabilities.",
        a: "Yes. DR Law 5-13 on Disability (2013) establishes rights for people with disabilities including equal access to transportation, public spaces, and services. The DR has also ratified the UN Convention on the Rights of Persons with Disabilities.",
      },
      {
        q: "Are airlines required by law to accommodate wheelchair users traveling to the DR?",
        plain:
          "Yes — by their own country's laws. US carriers are covered by the Air Carrier Access Act (ACAA). European carriers must follow EU Regulation 1107/2006.",
        a: "Yes — by their own country's laws. US carriers are covered by the Air Carrier Access Act (ACAA). European carriers must follow EU Regulation 1107/2006.",
      },
      {
        q: "Can I be denied boarding because of my wheelchair?",
        plain:
          "Airlines cannot deny boarding solely due to a disability or wheelchair use under the ACAA or EU 1107/2006. If denied boarding, request a written explanation and file a complaint with the DOT (US) or national civil aviation authority.",
        a: "Airlines cannot deny boarding solely due to a disability or wheelchair use under the ACAA or EU 1107/2006. If denied boarding, request a written explanation and file a complaint with the DOT (US) or national civil aviation authority.",
      },
      {
        q: "Are wheelchair users entitled to priority boarding?",
        plain:
          "Yes — on all major international airlines. Passengers who require wheelchair assistance are boarded first before general boarding begins.",
        a: "Yes — on all major international airlines. Passengers who require wheelchair assistance are boarded first before general boarding begins.",
      },
    ],
  },
  {
    id: "santo-domingo-and-zona-colonial",
    number: "10",
    title: "Santo Domingo & Zona Colonial",
    items: [
      {
        q: "Is Santo Domingo worth visiting as a wheelchair user?",
        plain:
          "Absolutely. Santo Domingo's Zona Colonial is one of the most historically rich neighborhoods in the Caribbean — the oldest continuously inhabited European settlement in the Americas. With private accessible transport, a wheelchair user can experience its architecture, museums, and plazas fully, especially on our Zona Colonial tour.",
        a: (
          <>
            Absolutely. Santo Domingo&apos;s Zona Colonial is one of the most historically rich neighborhoods in the
            Caribbean — the oldest continuously inhabited European settlement in the Americas. With private
            accessible transport, a wheelchair user can experience its architecture, museums, and plazas fully,
            especially on our <L href="/zona-colonial-tour">Zona Colonial tour</L>.
          </>
        ),
      },
      {
        q: "What are the most accessible sites in the Zona Colonial?",
        plain:
          "Plaza de España (large open plaza, flat pavers), El Conde pedestrian street (mostly flat near the entrance), Alcázar de Colón (ramp access at main entrance), Catedral Primada (wide entrance, flat interior), and Parque Independencia (open and flat).",
        a: "Plaza de España (large open plaza, flat pavers), El Conde pedestrian street (mostly flat near the entrance), Alcázar de Colón (ramp access at main entrance), Catedral Primada (wide entrance, flat interior), and Parque Independencia (open and flat).",
      },
      {
        q: "What is the best time of day to visit the Zona Colonial as a wheelchair user?",
        plain:
          "Early morning (8–10am) or late afternoon (4–6pm). Midday heat is intense and crowds are thicker on narrow sidewalks.",
        a: "Early morning (8–10am) or late afternoon (4–6pm). Midday heat is intense and crowds are thicker on narrow sidewalks.",
      },
      {
        q: "Can I combine Zona Colonial and beach in one DR trip?",
        plain:
          "Yes — and this is one of the best DR itineraries for wheelchair users. Fly into SDQ, spend 2–3 days in Santo Domingo, then transfer by private accessible van to Punta Cana for beach time. Medit RD covers the full intercity route, including the Santo Domingo airport transfer and the Punta Cana airport transfer on either end.",
        a: (
          <>
            Yes — and this is one of the best DR itineraries for wheelchair users. Fly into SDQ, spend 2–3 days in
            Santo Domingo, then transfer by private accessible van to Punta Cana for beach time. Medit RD covers the
            full intercity route, including the <L href="/santo-domingo-airport-transfer">Santo Domingo airport transfer</L> and the{" "}
            <L href="/punta-cana-airport-transfer">Punta Cana airport transfer</L> on either end.
          </>
        ),
      },
    ],
  },
  {
    id: "traveling-with-a-caregiver",
    number: "11",
    title: "Traveling with a Caregiver",
    items: [
      {
        q: "Do I need a caregiver or companion to travel to the DR as a wheelchair user?",
        plain:
          "Not necessarily — it depends on your level of independence. Many solo wheelchair travelers visit the DR successfully with pre-booked accessible transport and accessible resort accommodation. Medit RD drivers are trained to assist but are transport professionals, not caregivers.",
        a: "Not necessarily — it depends on your level of independence. Many solo wheelchair travelers visit the DR successfully with pre-booked accessible transport and accessible resort accommodation. Medit RD drivers are trained to assist but are transport professionals, not caregivers.",
      },
      {
        q: "Can Medit RD accommodate a wheelchair user and a companion in the same vehicle?",
        plain: "Yes. The accessible van accommodates the wheelchair (secured) plus 2–3 additional passengers.",
        a: "Yes. The accessible van accommodates the wheelchair (secured) plus 2–3 additional passengers.",
      },
      {
        q: "Can I hire a local caregiver or personal assistant in the DR?",
        plain:
          "This is possible but not standardized. Some medical tourism facilitators in Santo Domingo offer caregiver placement services. Ask your clinic or medical tourism coordinator if you need in-destination care support.",
        a: "This is possible but not standardized. Some medical tourism facilitators in Santo Domingo offer caregiver placement services. Ask your clinic or medical tourism coordinator if you need in-destination care support.",
      },
    ],
  },
  {
    id: "booking-and-planning",
    number: "12",
    title: "Booking & Planning",
    items: [
      {
        q: "How far in advance should I book everything for a wheelchair-accessible trip to the DR?",
        plain:
          "3+ months out: flights, resort, travel insurance. 4–6 weeks out: airport transfer and tours with Medit RD. 1–2 weeks out: confirm all bookings in writing. 48–72 hours out: reconfirm pickup details with Medit RD. Reach out through our contact page whenever you're ready to start planning.",
        a: (
          <>
            3+ months out: flights, resort, travel insurance. 4–6 weeks out: airport transfer and tours with Medit
            RD. 1–2 weeks out: confirm all bookings in writing. 48–72 hours out: reconfirm pickup details with Medit
            RD. Reach out through our <L href="/contact">contact page</L> whenever you&apos;re ready to start
            planning.
          </>
        ),
      },
      {
        q: "What is the best time of year to visit the DR as a wheelchair user?",
        plain:
          "December through April — dry season, lower humidity, lower storm risk. July–August also works but is more humid. Avoid September–October (peak hurricane months).",
        a: "December through April — dry season, lower humidity, lower storm risk. July–August also works but is more humid. Avoid September–October (peak hurricane months).",
      },
      {
        q: "Can I book Medit RD for my entire trip in advance?",
        plain:
          "Yes. Send your full itinerary, travel dates, and needs via WhatsApp, or through our contact page. We confirm pricing and availability for every leg of the trip in one conversation.",
        a: (
          <>
            Yes. Send your full itinerary, travel dates, and needs via WhatsApp, or through our{" "}
            <L href="/contact">contact page</L>. We confirm pricing and availability for every leg of the trip in one
            conversation.
          </>
        ),
      },
      {
        q: "What are the top 3 tips for a wheelchair user traveling to the DR for the first time?",
        plain:
          "1. Pre-book everything — accessible transport, your specific room, your beach wheelchair. Nothing is reliably available on the day. 2. Travel with a folding manual chair as backup, even if you primarily use a power chair. 3. Contact Medit RD before you arrive — local knowledge is the most valuable resource a first-time wheelchair traveler to the DR can have.",
        a: (
          <>
            1. Pre-book everything — accessible transport, your specific room, your beach wheelchair. Nothing is
            reliably available on the day. 2. Travel with a folding manual chair as backup, even if you primarily use
            a power chair. 3. <L href="/contact">Contact Medit RD</L> before you arrive — local knowledge is the most
            valuable resource a first-time wheelchair traveler to the DR can have.
          </>
        ),
      },
    ],
  },
];

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SECTIONS.flatMap((section) =>
      section.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.plain },
      })),
    ),
  };

  return (
    <>
      <JsonLd schema={faqSchema} />

      <PageHero
        eyebrow="Dominican Republic · FAQ"
        h1="Wheelchair Travel in the Dominican Republic — Complete FAQ"
        intro="Airports, transport, resorts, beaches, tours, medical travel, and booking — every question wheelchair travelers ask us before a trip to the DR, answered in one place."
        ctaMessage="Hi, I have a question about wheelchair-accessible travel in the DR."
        ctaLabel="Ask Us on WhatsApp"
      />

      <TrustBar />

      <nav aria-label="FAQ sections" className="bg-white px-4 py-8 dark:bg-black">
        <div className="mx-auto max-w-4xl">
          <p className="font-body mb-3 text-center text-xs font-bold uppercase tracking-widest text-medit-teal-2 dark:text-medit-teal">
            Jump to a section
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="font-body rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-medit-fg transition-colors hover:border-medit-teal hover:text-medit-teal-2 dark:border-zinc-800 dark:text-white dark:hover:text-medit-teal"
              >
                {section.number}. {section.title}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {SECTIONS.map((section, i) => (
        <PageFAQ
          key={section.id}
          id={section.id}
          eyebrow={`Section ${section.number} of ${SECTIONS.length}`}
          heading={section.title}
          items={section.items}
          className={`border-t border-zinc-200 dark:border-zinc-800 ${
            i % 2 === 0 ? "bg-white dark:bg-black" : "bg-medit-bg dark:bg-[#0d1421]"
          }`}
        />
      ))}

      <CtaBand
        heading="Still have a question about traveling to the DR?"
        subheading="Message us on WhatsApp with your dates and needs — we'll answer directly and help you plan the whole trip."
        ctaMessage="Hi, I have a question about wheelchair-accessible travel in the DR."
      />
    </>
  );
}
