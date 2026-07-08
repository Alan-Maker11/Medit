"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Lang = "es" | "en";
const LangContext = createContext<{ lang: Lang; toggleLang: () => void }>({
  lang: "es",
  toggleLang: () => {},
});

export function AdminLangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");

  useEffect(() => {
    const stored = localStorage.getItem("admin-lang");
    if (stored === "en" || stored === "es") setLang(stored);
  }, []);

  function toggleLang() {
    setLang((l) => {
      const next = l === "es" ? "en" : "es";
      localStorage.setItem("admin-lang", next);
      return next;
    });
  }

  return <LangContext.Provider value={{ lang, toggleLang }}>{children}</LangContext.Provider>;
}

export function useAdminLang() {
  return useContext(LangContext);
}

export const ADMIN_T = {
  es: {
    dashboard: "Panel",
    trips: "Viajes",
    expenses: "Gastos",
    vehicles: "Vehículos",
    drivers: "Conductores",
    salary: "Salario",
    reports: "Reportes",
    signOut: "Cerrar sesión",
    toggleLabel: "English",
    noTrips: "No hay viajes registrados.",
    monthTrips: (n: number) => `${n} viaje${n !== 1 ? "s" : ""}`,
    date: "Fecha",
    service: "Servicio",
    client: "Cliente",
    driver: "Conductor",
    vehicle: "Vehículo",
    fare: "Tarifa",
    status: "Estado",
    edit: "Editar",
    delete: "Eliminar",
    confirmDelete: "¿Eliminar este viaje? Esta acción no se puede deshacer.",
    logTrip: "Registrar viaje",
    deleteError: "No se pudo eliminar el viaje.",
  },
  en: {
    dashboard: "Dashboard",
    trips: "Trips",
    expenses: "Expenses",
    vehicles: "Vehicles",
    drivers: "Drivers",
    salary: "Salary",
    reports: "Reports",
    signOut: "Sign out",
    toggleLabel: "Español",
    noTrips: "No trips logged yet.",
    monthTrips: (n: number) => `${n} trip${n !== 1 ? "s" : ""}`,
    date: "Date",
    service: "Service",
    client: "Client",
    driver: "Driver",
    vehicle: "Vehicle",
    fare: "Fare",
    status: "Status",
    edit: "Edit",
    delete: "Delete",
    confirmDelete: "Delete this trip? This cannot be undone.",
    logTrip: "Log new trip",
    deleteError: "Failed to delete trip.",
  },
} as const;
