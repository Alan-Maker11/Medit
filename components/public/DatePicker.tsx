"use client";

import { useEffect, useRef, useState } from "react";
import { todayLocalISO } from "@/lib/date";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const DAY_NAMES = ["D", "L", "M", "M", "J", "V", "S"];

function toISO(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function DatePicker({ value, onChange }: { value: string; onChange: (iso: string) => void }) {
  const [open, setOpen] = useState(false);
  const today = todayLocalISO();
  const base = value || today;
  const [year, month] = base.split("-").map(Number);
  const [viewYear, setViewYear] = useState(year);
  const [viewMonth, setViewMonth] = useState(month - 1);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const cells: (number | null)[] = [...Array(firstDayOfWeek).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  function shiftMonth(delta: number) {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  function selectDay(day: number) {
    const iso = toISO(viewYear, viewMonth, day);
    if (iso < today) return;
    onChange(iso);
    setOpen(false);
  }

  const displayLabel = value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("es-DO", { day: "2-digit", month: "long", year: "numeric" })
    : "Seleccionar fecha";

  return (
    <div ref={rootRef} className="date-field">
      <button type="button" className="form-input date-field-btn" onClick={() => setOpen((v) => !v)}>
        <span className={value ? "" : "date-field-placeholder"}>{displayLabel}</span>
        <span>📅</span>
      </button>

      {open && (
        <div className="date-popover">
          <div className="date-popover-nav">
            <button type="button" onClick={() => shiftMonth(-1)}>
              ‹
            </button>
            <span>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={() => shiftMonth(1)}>
              ›
            </button>
          </div>
          <div className="date-popover-grid">
            {DAY_NAMES.map((d, i) => (
              <span key={`${d}-${i}`} className="date-popover-dow">
                {d}
              </span>
            ))}
            {cells.map((day, i) => {
              if (day === null) return <span key={`empty-${i}`} />;
              const iso = toISO(viewYear, viewMonth, day);
              const disabled = iso < today;
              const selected = iso === value;
              const isToday = iso === today;
              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectDay(day)}
                  className={`date-popover-day ${selected ? "selected" : ""} ${isToday ? "today" : ""}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
