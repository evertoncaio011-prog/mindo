"use client";

import { useEffect, useRef } from "react";
import { notify } from "@/lib/notifications";
import { playSound } from "@/lib/sound";
import { todayISO } from "@/lib/utils";
import type { Task } from "@/types";

function subtractMinutes(time: string, minutes: number) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m - minutes;
  const wrapped = ((total % 1440) + 1440) % 1440;
  return { hour: Math.floor(wrapped / 60), minute: wrapped % 60 };
}

/**
 * Roda em segundo plano (montado uma vez no AppShell) verificando, a cada
 * 30 segundos, se alguma tarefa com lembrete deve avisar a pessoa agora.
 * Guarda em memória o que já foi avisado hoje, para não repetir o aviso.
 */
export function useReminderScheduler(tasks: Task[], soundEnabled: boolean, notificationsEnabled: boolean) {
  const notifiedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const check = () => {
      if (!notificationsEnabled) return;
      const now = new Date();
      const today = todayISO();
      const weekday = now.getDay();

      for (const task of tasks) {
        if (task.completed || !task.reminder.enabled || !task.dueTime) continue;

        const { repeat, minutesBefore } = task.reminder;
        if (repeat === "none" && task.dueDate !== today) continue;
        if (repeat === "weekly" && task.dueDate) {
          const taskWeekday = new Date(`${task.dueDate}T00:00:00`).getDay();
          if (taskWeekday !== weekday) continue;
        }

        const target = subtractMinutes(task.dueTime, minutesBefore);
        const matches = now.getHours() === target.hour && now.getMinutes() === target.minute;
        if (!matches) continue;

        const dedupeKey = `${task.id}:${today}:${now.getHours()}:${now.getMinutes()}`;
        if (notifiedRef.current.has(dedupeKey)) continue;
        notifiedRef.current.add(dedupeKey);

        notify(`Lembrete: ${task.title}`, {
          body: minutesBefore > 0 ? `Em ${minutesBefore} minuto(s), às ${task.dueTime}` : "Agora",
        });
        if (soundEnabled) playSound("notify");
      }
    };

    check();
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, [tasks, soundEnabled, notificationsEnabled]);
}
