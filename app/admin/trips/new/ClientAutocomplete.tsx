"use client";

import { useEffect, useRef, useState } from "react";
import type { Client } from "@/lib/types";

export default function ClientAutocomplete({
  value,
  onChange,
  onSelect,
}: {
  value: string;
  onChange: (value: string) => void;
  onSelect: (client: Client) => void;
}) {
  const [matches, setMatches] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value || value.trim().length < 2) {
      setMatches([]);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetch(`/api/clients?search=${encodeURIComponent(value)}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => setMatches(data))
        .catch(() => {});
    }, 200);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        autoComplete="off"
        className="input"
      />
      {open && matches.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full max-h-56 overflow-y-auto rounded-lg border border-zinc-300 bg-white text-sm shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          {matches.map((client) => (
            <li key={client.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(client);
                  setOpen(false);
                }}
                className="flex w-full flex-col px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-700"
              >
                <span className="font-medium">{client.name}</span>
                <span className="text-xs text-zinc-500">
                  {client.phone ?? "no phone"} · {client.last_service_name ?? "no service"} ·{" "}
                  {client.last_trip_date ?? ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
