"use client";

import { useLocalStorage } from "./useLocalStorage";
import type { AppSettings } from "@/types";

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  notificationsEnabled: true,
};

/** Preferências do app (som, notificações) — sempre locais ao dispositivo. */
export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>("mindo:settings", DEFAULT_SETTINGS);

  return {
    settings,
    setSoundEnabled: (value: boolean) => setSettings((s) => ({ ...s, soundEnabled: value })),
    setNotificationsEnabled: (value: boolean) =>
      setSettings((s) => ({ ...s, notificationsEnabled: value })),
  };
}
