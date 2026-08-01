"use client";

import { useEffect } from "react";

/** Registra o service worker do PWA assim que o app carrega no navegador. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Falha de registro não deve quebrar o app — apenas fica sem modo offline.
      });
    });
  }, []);

  return null;
}
