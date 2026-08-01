"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { useSettings } from "@/hooks/useSettings";
import { useReminderScheduler } from "@/hooks/useReminderScheduler";

/** Componente "invisível" que apenas liga o agendador de lembretes em segundo plano. */
export function ReminderScheduler() {
  const { userId } = useAuth();
  const { tasks } = useTasks(userId);
  const { settings } = useSettings();

  useReminderScheduler(tasks, settings.soundEnabled, settings.notificationsEnabled);

  return null;
}
