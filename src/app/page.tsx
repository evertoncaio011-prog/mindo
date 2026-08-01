"use client";

import { useMemo, useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PriorityBadge } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { EmptyState } from "@/components/ui/EmptyState";
import { TaskForm } from "@/components/tasks/TaskForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useTasks } from "@/hooks/useTasks";
import { formatDateBR, sortTasks, todayISO } from "@/lib/utils";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function HomePage() {
  const { userId, ready } = useRequireAuth();
  const { tasks, addTask, toggleComplete } = useTasks(userId);
  const [formOpen, setFormOpen] = useState(false);

  const today = todayISO();

  const pendingToday = useMemo(
    () => sortTasks(tasks.filter((t) => !t.completed && t.dueDate === today)),
    [tasks, today]
  );
  const allPending = useMemo(() => sortTasks(tasks.filter((t) => !t.completed)), [tasks]);
  const nextTask = pendingToday[0] ?? allPending[0];
  const doneToday = tasks.filter((t) => t.completed && t.dueDate === today).length;
  const totalToday = pendingToday.length + doneToday;
  const progress = totalToday > 0 ? doneToday / totalToday : 0;

  if (!ready) return null;

  return (
    <AppShell>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-soft dark:text-ink-darkSoft">{getGreeting()},</p>
          <h1 className="font-display text-2xl font-bold text-ink dark:text-ink-dark">
            vamos com calma hoje
          </h1>
        </div>
        <div className="sm:hidden">
          <ThemeToggle />
        </div>
      </header>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-stretch">
        <Card className="flex flex-1 items-center gap-4 p-5">
          <ProgressRing progress={progress} size={72} strokeWidth={8}>
            <span className="text-sm font-bold text-ink dark:text-ink-dark">
              {doneToday}/{totalToday || 0}
            </span>
          </ProgressRing>
          <div>
            <p className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
              {pendingToday.length === 0 ? "Tudo em dia!" : `${pendingToday.length} tarefa${pendingToday.length > 1 ? "s" : ""} hoje`}
            </p>
            <p className="text-sm text-ink-soft dark:text-ink-darkSoft">
              {pendingToday.length === 0
                ? "Nenhuma tarefa pendente para hoje."
                : "faltam para você concluir"}
            </p>
          </div>
        </Card>
      </div>

      <section className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-ink-darkSoft">
          Próxima tarefa
        </p>
        {nextTask ? (
          <Card className="p-5 animate-fade-in">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
                  {nextTask.title}
                </p>
                {nextTask.description && (
                  <p className="mt-1 text-sm text-ink-soft dark:text-ink-darkSoft">
                    {nextTask.description}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <PriorityBadge priority={nextTask.priority} />
                  {nextTask.dueDate && (
                    <span className="text-xs text-ink-soft dark:text-ink-darkSoft">
                      {formatDateBR(nextTask.dueDate)}
                      {nextTask.dueTime && ` às ${nextTask.dueTime}`}
                    </span>
                  )}
                </div>
              </div>
              <Button size="sm" variant="secondary" onClick={() => toggleComplete(nextTask.id)}>
                Concluir
              </Button>
            </div>
          </Card>
        ) : (
          <EmptyState
            icon={<Sparkles size={26} />}
            title="Nenhuma tarefa pendente"
            description="Aproveite para descansar ou planejar o que vem a seguir."
          />
        )}
      </section>

      <Button size="lg" className="w-full" onClick={() => setFormOpen(true)}>
        <Plus size={20} />
        Adicionar tarefa
      </Button>

      <TaskForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={addTask} />
    </AppShell>
  );
}
