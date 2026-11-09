"use client";

import { useState, type FormEvent } from "react";
import { waLink } from "@/lib/whatsapp";

const PASSENGER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

const WHEELCHAIR_OPTIONS = [
  { value: "manual", label: "Manual wheelchair" },
  { value: "power", label: "Power wheelchair" },
  { value: "scooter", label: "Mobility scooter" },
  { value: "none", label: "No wheelchair" },
];

/**
 * Lightweight, client-side-only booking helper for the /contact page.
 * It is NOT wired to Supabase and does not create trip records — it simply
 * composes a WhatsApp message from the fields and opens wa.me with it
 * pre-filled. The real booking flow (fare calculation, trip records admins
 * see) remains components/public/BookingWizard.tsx on the homepage.
 */
export default function BookingForm() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [wheelchair, setWheelchair] = useState("manual");
  const [requests, setRequests] = useState("");
  const [contactPref, setContactPref] = useState<"whatsapp" | "email">("whatsapp");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const wheelchairLabel = WHEELCHAIR_OPTIONS.find((w) => w.value === wheelchair)?.label ?? wheelchair;
    const message =
      `🔵 *MEDIT RD — BOOKING REQUEST*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      (name ? `👤 Name: ${name}\n` : "") +
      `📅 Date of travel: ${date || "—"}\n` +
      `📍 Pick-up location: ${pickup || "—"}\n` +
      `🏁 Drop-off location: ${dropoff || "—"}\n` +
      `👥 Passengers: ${passengers}\n` +
      `♿ Wheelchair type: ${wheelchairLabel}\n` +
      (requests ? `📝 Special requests: ${requests}\n` : "") +
      `☎️ Preferred contact: ${contactPref === "whatsapp" ? "WhatsApp" : "Email"}\n` +
      `\nPlease confirm availability and final price. Thank you! 🙏`;

    window.open(waLink(message), "_blank");
    setSubmitted(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="font-body flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-medit-bg p-6 shadow-sm dark:border-zinc-800 dark:bg-[#0d1421] sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-medit-fg dark:text-white">
          Name
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="input"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold text-medit-fg dark:text-white">
          Date of travel
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="input" />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold text-medit-fg dark:text-white">
          Pick-up location
          <input
            type="text"
            required
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="e.g. PUJ Airport, Hard Rock Hotel"
            className="input"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold text-medit-fg dark:text-white">
          Drop-off location
          <input
            type="text"
            required
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            placeholder="e.g. Bávaro, CEDIMAT"
            className="input"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold text-medit-fg dark:text-white">
          Number of passengers
          <select
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            className="input"
          >
            {PASSENGER_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "passenger" : "passengers"}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold text-medit-fg dark:text-white">
          Wheelchair type
          <select value={wheelchair} onChange={(e) => setWheelchair(e.target.value)} className="input">
            {WHEELCHAIR_OPTIONS.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-semibold text-medit-fg dark:text-white">
        Special requests
        <textarea
          value={requests}
          onChange={(e) => setRequests(e.target.value)}
          placeholder="Flight number, luggage, extra stops, accessibility needs…"
          rows={3}
          className="input resize-none"
        />
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-semibold text-medit-fg dark:text-white">Preferred contact</legend>
        <div className="flex gap-6">
          <label className="font-body flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <input
              type="radio"
              name="contactPref"
              value="whatsapp"
              checked={contactPref === "whatsapp"}
              onChange={() => setContactPref("whatsapp")}
              className="accent-medit-teal"
            />
            WhatsApp
          </label>
          <label className="font-body flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <input
              type="radio"
              name="contactPref"
              value="email"
              checked={contactPref === "email"}
              onChange={() => setContactPref("email")}
              className="accent-medit-teal"
            />
            Email
          </label>
        </div>
      </fieldset>

      <button
        type="submit"
        className="rounded-full bg-medit-teal px-6 py-3 text-base font-bold text-medit-navy transition-transform duration-150 hover:scale-[1.02] hover:bg-medit-teal-2"
      >
        💬 Send via WhatsApp
      </button>

      {submitted && (
        <p className="text-center text-sm font-semibold text-medit-teal-2 dark:text-medit-teal">
          Opening WhatsApp with your details… if nothing happened, check your browser&apos;s pop-up blocker.
        </p>
      )}
    </form>
  );
}
