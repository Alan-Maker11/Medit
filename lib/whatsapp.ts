export const WHATSAPP_NUMBER = "18293296920";
export const WHATSAPP_DISPLAY = "+1 (829) 329-6920";

/** Builds a wa.me deep link that pre-fills the given message. */
export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
