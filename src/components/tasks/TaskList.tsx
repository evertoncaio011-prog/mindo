"use client";

import { ClipboardList } from "lucide-react";
import { TaskItem } from "./TaskItem";
import { EmptyState } from "@/components/ui/EmptyState";
import { sortTasks } from "@/lib/utils";
import type { Task } from "@/types";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

/** Separa tarefas pendentes das concluídas — reduz a poluição visual da lista. */
export function TaskList({ tasks, onToggle, onEdit, onDelete }: TaskListProps) {
  const pending = sortTasks(tasks.filter((t) => !t.completed));
  const completed = tasks.filter((t) => t.completed);

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardList size={28} />}
        title="Nenhuma tarefa por aqui"
        description="Adicione a primeira tarefa e comece devagar — um passo de cada vez."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {pending.length === 0 ? (
          <p className="text-sm text-ink-soft dark:text-ink-darkSoft">
            Tudo em dia por aqui. 🎉
          </p>
        ) : (
          pending.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
          ))
        )}
      </div>

      {completed.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-ink-darkSoft">
            Concluídas ({completed.length})
          </p>
          <div className="flex flex-col gap-3 opacity-80">
            {completed.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
