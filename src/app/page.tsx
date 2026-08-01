"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useTasks } from "@/hooks/useTasks";
import type { Task } from "@/types";

export default function TarefasPage() {
  const { userId, ready } = useRequireAuth();
  const { tasks, addTask, updateTask, toggleComplete, removeTask } = useTasks(userId);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  function openNewTask() {
    setEditingTask(undefined);
    setFormOpen(true);
  }

  function openEditTask(task: Task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  async function handleSubmit(input: Parameters<typeof addTask>[0]) {
    if (editingTask) {
      await updateTask({ ...editingTask, ...input });
    } else {
      await addTask(input);
    }
  }

  if (!ready) return null;

  return (
    <AppShell>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink dark:text-ink-dark">Tarefas</h1>
        <Button size="sm" onClick={openNewTask}>
          <Plus size={16} />
          Nova
        </Button>
      </header>

      <TaskList tasks={tasks} onToggle={toggleComplete} onEdit={openEditTask} onDelete={removeTask} />

      <TaskForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialTask={editingTask}
      />
    </AppShell>
  );
}
