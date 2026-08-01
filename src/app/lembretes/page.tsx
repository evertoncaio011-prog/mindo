"use client";

import { useEffect, useMemo } from "react";
import { BellRing } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { ReminderItem } from "@/components/reminders/ReminderItem";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useTasks } from "@/hooks/useTasks";
import { requestNotificationPermission } from "@/lib/notifications";
import { sortTasks } from "@/lib/utils";
import type { RepeatMode } from "@/types";

export default function LembretesPage() {
  const { userId, ready } = useRequireAuth();
  const { tasks, updateTask } = useTasks(userId);

  useEffect(() => {
    // Pede permissão de notificação assim que a pessoa visita a tela de lembretes,
    // que é o momento em que essa permissão faz mais sentido.
    requestNotificationPermission();
  }, []);

  const withReminder = useMemo(
    () => sortTasks(tasks.filter((t) => t.reminder.enabled && !t.completed)),
    [tasks]
  );

  async function handleChangeRepeat(id: string, repeat: RepeatMode) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    await updateTask({ ...task, reminder: { ...task.reminder, repeat } });
  }

  async function handleDisable(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    await updateTask({ ...task, reminder: { ...task.reminder, enabled: false } });
  }

  if (!ready) return null;

  return (
    <AppShell>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink dark:text-ink-dark">Lembretes</h1>
        <p className="mt-1 text-sm text-ink-soft dark:text-ink-darkSoft">
          Avisos das tarefas que têm lembrete ativado.
        </p>
      </header>

      <Card className="mb-6 flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-focus-50 text-focus-500 dark:bg-focus-500/10">
          <BellRing size={18} />
        </div>
        <p className="text-sm text-ink-soft dark:text-ink-darkSoft">
          Para ativar um lembrete, abra a tarefa em <strong className="text-ink dark:text-ink-dark">Tarefas</strong> e
          marque a opção &ldquo;Lembrar dessa tarefa&rdquo;.
        </p>
      </Card>

      {withReminder.length === 0 ? (
        <EmptyState
          icon={<BellRing size={26} />}
          title="Nenhum lembrete ativo"
          description="Ative lembretes nas tarefas importantes para não perder o horário."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {withReminder.map((task) => (
            <ReminderItem
              key={task.id}
              task={task}
              onChangeRepeat={handleChangeRepeat}
              onDisable={handleDisable}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}
