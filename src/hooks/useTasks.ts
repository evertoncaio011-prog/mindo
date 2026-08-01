"use client";

import { useCallback, useEffect, useState } from "react";
import { dataProvider } from "@/lib/data";
import { generateId } from "@/lib/utils";
import type { Priority, Reminder, Task } from "@/types";

export interface TaskInput {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  dueTime?: string;
  reminder: Reminder;
}

const DEFAULT_REMINDER: Reminder = { enabled: false, repeat: "none", minutesBefore: 10 };

export function useTasks(userId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await dataProvider.listTasks(userId);
    setTasks(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const addTask = useCallback(
    async (input: TaskInput) => {
      if (!userId) return;
      const now = new Date().toISOString();
      const task: Task = {
        id: generateId(),
        userId,
        title: input.title,
        description: input.description,
        priority: input.priority,
        dueDate: input.dueDate,
        dueTime: input.dueTime,
        completed: false,
        reminder: input.reminder ?? DEFAULT_REMINDER,
        createdAt: now,
        updatedAt: now,
      };
      setTasks((prev) => [...prev, task]);
      await dataProvider.saveTask(task);
    },
    [userId]
  );

  const updateTask = useCallback(async (task: Task) => {
    const updated = { ...task, updatedAt: new Date().toISOString() };
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    await dataProvider.saveTask(updated);
  }, []);

  const toggleComplete = useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      await updateTask({ ...task, completed: !task.completed });
    },
    [tasks, updateTask]
  );

  const removeTask = useCallback(async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await dataProvider.deleteTask(id);
  }, []);

  return { tasks, loading, addTask, updateTask, toggleComplete, removeTask, reload };
}
