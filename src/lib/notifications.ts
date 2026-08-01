// Camada fina sobre a Web Notifications API.
// Mantida separada para facilitar trocar por push notifications reais no futuro.

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) return "denied";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return Notification.requestPermission();
}

/**
 * Dispara uma notificação local.
 *
 * IMPORTANTE: no Android Chrome, `new Notification(...)` não funciona —
 * o navegador exige que a notificação seja mostrada através do Service
 * Worker (`registration.showNotification`). Por isso tentamos sempre o
 * caminho via Service Worker primeiro, e só caímos no construtor direto
 * (usado no desktop/iOS Safari) se não houver um Service Worker pronto.
 */
export async function notify(title: string, options?: NotificationOptions) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const opts = { icon: "/icons/icon-192.png", ...options };

  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration) {
        await registration.showNotification(title, opts);
        return;
      }
    } catch {
      // Segue para o fallback abaixo.
    }
  }

  try {
    new Notification(title, opts);
  } catch {
    // Notificações podem falhar silenciosamente em alguns navegadores/contextos — sem problema.
  }
}
