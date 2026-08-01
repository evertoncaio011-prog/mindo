// Camada fina sobre a Web Notifications API.
// Mantida separada para facilitar trocar por push notifications reais no futuro.

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) return "denied";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return Notification.requestPermission();
}

export function notify(title: string, options?: NotificationOptions) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { icon: "/icons/icon-192.png", ...options });
  } catch {
    // Notificações podem falhar silenciosamente em alguns navegadores/contextos — sem problema.
  }
}
