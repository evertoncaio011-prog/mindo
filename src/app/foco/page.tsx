"use client";

import { Flame } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { PomodoroTimer } from "@/components/focus/PomodoroTimer";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useFocusSessions } from "@/hooks/useFocusSessions";
import { useSettings } from "@/hooks/useSettings";

export default function FocoPage() {
  const { userId, ready } = useRequireAuth();
  const { todayCount, registerSession } = useFocusSessions(userId);
  const { settings } = useSettings();

  if (!ready) return null;

  return (
    <AppShell>
      <header className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold text-ink dark:text-ink-dark">Foco</h1>
        <p className="mt-1 text-sm text-ink-soft dark:text-ink-darkSoft">
          Uma tarefa de cada vez. 25 minutos de foco, 5 de descanso.
        </p>
      </header>

      <div className="flex flex-col items-center gap-8">
        <PomodoroTimer
          soundEnabled={settings.soundEnabled}
          notificationsEnabled={settings.notificationsEnabled}
          onSessionComplete={() => registerSession(25)}
        />

        <Card className="flex items-center gap-3 px-5 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-priority-alta/10 text-priority-alta">
            <Flame size={17} />
          </div>
          <p className="text-sm text-ink dark:text-ink-dark">
            <strong>{todayCount}</strong> sessão{todayCount === 1 ? "" : "es"} concluída{todayCount === 1 ? "" : "s"} hoje
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
