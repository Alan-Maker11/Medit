"use client";

import { useEffect, useState } from "react";
import { getExistingSubscription, isPushSupported, subscribeToPush, unsubscribeFromPush } from "@/lib/push-subscribe";

export default function NotificationToggle() {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPushSupported()) return;
    setSupported(true);
    getExistingSubscription().then((sub) => setSubscribed(Boolean(sub)));
  }, []);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      if (subscribed) {
        await unsubscribeFromPush();
        setSubscribed(false);
      } else {
        await subscribeToPush();
        setSubscribed(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al activar notificaciones");
    } finally {
      setLoading(false);
    }
  }

  if (!supported) return null;

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`rounded-full px-4 py-2 text-sm font-semibold transition-transform duration-150 ease-out active:scale-[0.98] disabled:opacity-50 ${
          subscribed
            ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {loading ? "..." : subscribed ? "🔔 Notificaciones activas" : "🔔 Activar notificaciones"}
      </button>
      {error && <p className="max-w-[220px] text-right text-xs text-red-600">{error}</p>}
    </div>
  );
}
