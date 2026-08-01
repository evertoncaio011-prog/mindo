"use client";

import { useCallback, useEffect, useState } from "react";
import { dataProvider } from "@/lib/data";
import { generateId } from "@/lib/utils";
import type { Routine } from "@/types";

export function useRoutines(userId: string | null) {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!userId) {
      setRoutines([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await dataProvider.listRoutines(userId);
    setRoutines(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const addRoutine = useCallback(
    async (title: string, description: string | undefined, stepTitles: string[]) => {
      if (!userId) return;
      const now = new Date().toISOString();
      const routine: Routine = {
        id: generateId(),
        userId,
        title,
        description,
        steps: stepTitles
          .filter((t) => t.trim().length > 0)
          .map((t) => ({ id: generateId(), title: t.trim(), completed: false })),
        createdAt: now,
        updatedAt: now,
      };
      setRoutines((prev) => [...prev, routine]);
      await dataProvider.saveRoutine(routine);
    },
    [userId]
  );

  const updateRoutine = useCallback(async (routine: Routine) => {
    const updated = { ...routine, updatedAt: new Date().toISOString() };
    setRoutines((prev) => prev.map((r) => (r.id === routine.id ? updated : r)));
    await dataProvider.saveRoutine(updated);
  }, []);

  const toggleStep = useCallback(
    async (routineId: string, stepId: string) => {
      const routine = routines.find((r) => r.id === routineId);
      if (!routine) return;
      const steps = routine.steps.map((s) =>
        s.id === stepId ? { ...s, completed: !s.completed } : s
      );
      await updateRoutine({ ...routine, steps });
    },
    [routines, updateRoutine]
  );

  const removeRoutine = useCallback(async (id: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== id));
    await dataProvider.deleteRoutine(id);
  }, []);

  return { routines, loading, addRoutine, updateRoutine, toggleStep, removeRoutine, reload };
}
