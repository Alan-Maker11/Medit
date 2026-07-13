import type { ParsedIntent } from "./intent-recognizer";

export interface ConfirmationResult {
  shouldProceed: boolean;
  clarificationMessage?: string;
  suggestedInterpretations?: string[];
}

export function handleUncertainIntent(intent: ParsedIntent, lang: "es" | "en"): ConfirmationResult {
  const isEs = lang === "es";

  if (intent.timeframe.type === "unknown") {
    return {
      shouldProceed: false,
      clarificationMessage: isEs
        ? `Entendí que preguntas sobre "${intent.subType}", pero necesito saber el período. Por ejemplo:`
        : `I understood you're asking about "${intent.subType}", but I need to know which time period. For example:`,
      suggestedInterpretations: [
        '📅 "Esta semana" / "This week"',
        '📅 "Julio" / "July"',
        '📅 "Del 6 al 12 de julio" / "July 6-12"',
        '📅 "Este mes" / "This month"',
      ],
    };
  }

  if (intent.subType === "unknown") {
    return {
      shouldProceed: false,
      clarificationMessage: isEs
        ? `No estoy seguro de qué quieres saber sobre ${intent.timeframe.displayName}. ¿Te refieres a:`
        : `I'm not sure what you want to know about ${intent.timeframe.displayName}. Did you mean:`,
      suggestedInterpretations: [
        isEs ? `💰 Ingresos: "¿Cuánto se generó en ${intent.timeframe.displayName}?"` : `💰 Revenue: "How much revenue in ${intent.timeframe.displayName}?"`,
        isEs ? `💸 Gastos: "¿Cuáles fueron los gastos en ${intent.timeframe.displayName}?"` : `💸 Expenses: "What were the expenses in ${intent.timeframe.displayName}?"`,
        isEs ? `📊 Ganancia: "¿Cuánto ganamos en ${intent.timeframe.displayName}?"` : `📊 Profit: "How much profit in ${intent.timeframe.displayName}?"`,
      ],
    };
  }

  if (intent.confidence < 70) {
    return {
      shouldProceed: false,
      clarificationMessage: isEs ? "No estoy completamente seguro de tu pregunta. ¿Podrías ser más específico?" : "I'm not entirely sure what you're asking. Could you be more specific?",
    };
  }

  return { shouldProceed: true };
}
