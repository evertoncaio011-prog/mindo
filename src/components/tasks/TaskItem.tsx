"use client";

import { Bell, Clock, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PriorityBadge } from "@/components/ui/Badge";
import { cn, formatDateBR } from "@/lib/utils";
import type { Task } from "@/types";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const dateLabel = formatDateBR(task.dueDate);

  return (
    <Card className="flex items-start gap-3 p-4 animate-fade-in">
      <button
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? "Marcar como pendente" : "Marcar como concluída"}
        className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          task.completed
            ? "border-calm-500 bg-calm-500 text-white"
            : "border-border dark:border-border-dark hover:border-focus-500"
        )}
      >
        {task.completed && (
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden>
            <path d="M1 5L4.5 8.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-medium text-ink dark:text-ink-dark break-words",
            task.completed && "text-ink-soft line-through dark:text-ink-darkSoft"
          )}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 text-xs text-ink-soft dark:text-ink-darkSoft break-words">
            {task.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <PriorityBadge priority={task.priority} />
          {dateLabel && (
            <span className="inline-flex items-center gap-1 text-xs text-ink-soft dark:text-ink-darkSoft">
              <Clock size={12} />
              {dateLabel}
              {task.dueTime && ` às ${task.dueTime}`}
            </span>
          )}
          {task.reminder.enabled && (
            <span className="inline-flex items-center gap-1 text-xs text-ink-soft dark:text-ink-darkSoft">
              <Bell size={12} />
              {task.reminder.repeat === "daily"
                ? "Diário"
                : task.reminder.repeat === "weekly"
                ? "Semanal"
                : "Lembrete"}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={() => onEdit(task)}
          aria-label="Editar tarefa"
          className="rounded-lg p-1.5 text-ink-soft hover:bg-surfaceMuted hover:text-ink dark:text-ink-darkSoft dark:hover:bg-surfaceMuted-dark dark:hover:text-ink-dark"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          aria-label="Excluir tarefa"
          className="rounded-lg p-1.5 text-ink-soft hover:bg-priority-alta/10 hover:text-priority-alta dark:text-ink-darkSoft"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </Card>
  );
}
