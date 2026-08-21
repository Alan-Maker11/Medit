/** Formats a "HH:MM" (or "HH:MM:SS") 24-hour time string as "H:MM AM/PM" for display. */
export function formatTime12(time24: string | null | undefined): string {
  if (!time24) return "-";
  const [hoursStr, minutesStr] = time24.split(":");
  const hours24 = Number(hoursStr);
  if (Number.isNaN(hours24) || !minutesStr) return time24;

  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${minutesStr} ${period}`;
}
