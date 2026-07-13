const DAYS_ES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const DAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

/** "Jueves, 18 de Septiembre 2025" */
export function formatDateWithDay(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);
  const dayOfWeek = DAYS_ES[date.getDay()];
  const day = date.getDate();
  const month = MONTHS_ES[date.getMonth()];
  const year = date.getFullYear();
  return `${dayOfWeek}, ${day} de ${month} ${year}`;
}

/** "Thursday, 18 de Septiembre 2025" — English day name, Spanish month (matches the rest of the app's date vocabulary) */
export function formatDateWithDayEnglish(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);
  const dayOfWeek = DAYS_EN[date.getDay()];
  const day = date.getDate();
  const month = MONTHS_ES[date.getMonth()];
  const year = date.getFullYear();
  return `${dayOfWeek}, ${day} de ${month} ${year}`;
}
