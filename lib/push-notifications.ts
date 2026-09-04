import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT ?? "mailto:medicapatrans@gmail.com",
    vapidPublicKey,
    vapidPrivateKey
  );
}

interface TripNotificationPayload {
  title: string;
  body: string;
  url?: string;
}

/** Sends a web push notification to every device a driver has subscribed from. */
export async function notifyDriver(driverId: string, payload: TripNotificationPayload) {
  if (!vapidPublicKey || !vapidPrivateKey) {
    console.warn("VAPID keys not configured; skipping push notification");
    return;
  }

  const supabase = await createClient();
  const { data: subscriptions } = await supabase
    .from("driver_push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .eq("driver_id", driverId);

  if (!subscriptions || subscriptions.length === 0) return;

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload)
        );
      } catch (err: any) {
        // Subscription is no longer valid (unsubscribed, expired, browser data cleared) — remove it.
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          await supabase.from("driver_push_subscriptions").delete().eq("id", sub.id);
        } else {
          console.error(`Push notification failed for driver ${driverId}:`, err);
        }
      }
    })
  );
}

export function tripAssignedNotification(trip: {
  client_name?: string | null;
  date?: string | null;
  time?: string | null;
}): TripNotificationPayload {
  return {
    title: "🚗 Nuevo viaje asignado",
    body: `${trip.client_name ?? "Cliente"} · ${trip.date ?? ""} ${trip.time ?? ""}`.trim(),
    url: "/driver/dashboard",
  };
}
