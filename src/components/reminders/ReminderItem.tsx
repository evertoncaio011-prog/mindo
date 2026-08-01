"use client";

import { BellOff, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatDateBR } from "@/lib/utils";
import type { RepeatMode, Task } from "@/types";

const REPEAT_LABEL: Record<RepeatMode, string> = {
  none: "Uma vez",
  daily: "Todos os dias",
  weekly: "Toda semana",
};

interface ReminderItemProps {
  task: Task;
  onChangeRepeat: (id: string, repeat: RepeatMode) => void;
  onDisable: (id: string) => void;
}

export function ReminderItem({ task, onChangeRepeat, onDisable }: ReminderItemProps) {
  return (
    <Card className="p-4 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink dark:text-ink-dark break-words">{task.title}</p>
          {(task.dueDate || task.dueTime) && (
            <span className="mt-1 inline-flex items-center gap-1 text-xs text-ink-soft dark:text-ink-darkSoft">
              <Clock size={12} />
              {formatDateBR(task.dueDate)}
              {task.dueTime && ` às ${task.dueTime}`}
            </span>
          )}
        </div>
        <button
          onClick={() => onDisable(task.id)}
          aria-label="Desativar lembrete"
          className="shrink-0 rounded-lg p-1.5 text-ink-soft hover:bg-surfaceMuted dark:text-ink-darkSoft dark:hover:bg-surfaceMuted-dark"
        >
          <BellOff size={16} />
        </button>
      </div>

      <div className="mt-3 flex gap-2">
        {(Object.keys(REPEAT_LABEL) as RepeatMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onChangeRepeat(task.id, mode)}
            className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
              task.reminder.repeat === mode
                ? "bg-focus-500 text-white"
                : "bg-surfaceMuted text-ink-soft dark:bg-surfaceMuted-dark dark:text-ink-darkSoft"
            }`}
          >
            {REPEAT_LABEL[mode]}
          </button>
        ))}
      </div>
    </Card>
  );
}
