"use client";

import { useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  dataUsed?: Record<string, boolean>;
}

const CAPABILITY_LABELS: Record<string, string> = {
  report: "📊 Report",
  prediction: "🔮 Prediction",
  anomaly: "🚨 Anomaly check",
  recommendation: "💡 Recommendations",
  salary: "💰 Salary calc",
  tripsIncluded: "🚗 Trips data",
  expensesIncluded: "💸 Expenses data",
  vehiclesIncluded: "🚙 Vehicles data",
  driversIncluded: "🧑‍✈️ Drivers data",
  servicesIncluded: "🏷️ Services data",
};

const CAPABILITIES = [
  { icon: "📊", label: "Reports" },
  { icon: "🔮", label: "Predictions" },
  { icon: "🚨", label: "Anomalies" },
  { icon: "💡", label: "Recommendations" },
  { icon: "💰", label: "Salary" },
];

const QUICK_PROMPTS = [
  "What's this month's revenue?",
  "Generate a weekly report",
  "Predict next week's revenue",
  "Any anomalies in expenses?",
  "Give me business recommendations",
];

export default function AICopilot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: next.slice(-10).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply =
        data.reply ??
        (data.error ? `${data.error}${data.details ? `\n${data.details}` : ""}` : "Error getting response.");
      setMessages((prev) => [...prev, { role: "assistant", content: reply, dataUsed: data.dataUsed }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection error. Try again." }]);
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="AI Copilot"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a10 10 0 0 1 0 20H3l2.5-2.5A10 10 0 0 1 12 2z" strokeLinejoin="round" />
            <circle cx="8.5" cy="12" r="1" fill="currentColor" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
            <circle cx="15.5" cy="12" r="1" fill="currentColor" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex w-80 flex-col rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 sm:w-96">
          {/* Header */}
          <div className="flex items-center gap-2 rounded-t-2xl border-b border-zinc-200 bg-blue-600 px-4 py-3 dark:border-zinc-700">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2a10 10 0 0 1 0 20H3l2.5-2.5A10 10 0 0 1 12 2z" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Medit AI Manager</p>
              <p className="text-xs text-blue-100">Enterprise business intelligence</p>
            </div>
          </div>

          {/* Capability chips */}
          <div className="flex flex-wrap gap-1.5 border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
            {CAPABILITIES.map((c) => (
              <span
                key={c.label}
                className="rounded-full bg-zinc-100 px-2 py-1 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {c.icon} {c.label}
              </span>
            ))}
          </div>

          {/* Messages */}
          <div className="flex max-h-80 flex-col gap-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="flex flex-col gap-2 text-sm text-zinc-500">
                <p className="font-medium text-zinc-700 dark:text-zinc-200">👋 Hola! I can help you with:</p>
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); }}
                    className="rounded-xl border border-zinc-200 px-3 py-2 text-left text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            {messages.map((msg, i) => {
              const usedLabels = msg.dataUsed
                ? Object.entries(msg.dataUsed)
                    .filter(([, v]) => v)
                    .map(([k]) => CAPABILITY_LABELS[k])
                    .filter(Boolean)
                : [];
              return (
                <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                    }`}
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {msg.content}
                  </div>
                  {usedLabels.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {usedLabels.map((label) => (
                        <span key={label} className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-zinc-100 px-4 py-2 text-sm text-zinc-400 dark:bg-zinc-800">
                  <span className="animate-pulse">Thinking…</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-zinc-200 p-3 dark:border-zinc-700">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything…"
              className="flex-1 rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
