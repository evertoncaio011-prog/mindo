"use client";

import { useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

/** Converte a chave pública VAPID (base64url) para o formato que o navegador espera. */
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

/**
 * Inscreve o dispositivo atual para receber push notifications reais
 * (chegam mesmo com o app fechado) e salva a inscrição no Supabase, para
 * o job de lembretes conseguir enviar avisos para este dispositivo.
 */
export function usePushSubscription(userId: string | null) {
  const subscribe = useCallback(async () => {
    if (!userId || !isSupabaseConfigured || !supabase) return false;
    if (!VAPID_PUBLIC_KEY) {
      console.warn("NEXT_PUBLIC_VAPID_PUBLIC_KEY não configurada — push notifications desativadas.");
      return false;
    }
    if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      }

      const json = subscription.toJSON();
      if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) return false;

      const { error } = await supabase.from("push_subscriptions").upsert(
        {
          user_id: userId,
          endpoint: json.endpoint,
          p256dh: json.keys.p256dh,
          auth: json.keys.auth,
        },
        { onConflict: "endpoint" }
      );
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Falha ao inscrever push notifications:", err);
      return false;
    }
  }, [userId]);

  const unsubscribe = useCallback(async () => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        if (supabase) {
          await supabase.from("push_subscriptions").delete().eq("endpoint", subscription.endpoint);
        }
        await subscription.unsubscribe();
      }
    } catch (err) {
      console.error("Falha ao cancelar push notifications:", err);
    }
  }, []);

  return { subscribe, unsubscribe };
}
