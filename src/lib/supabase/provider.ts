import { supabase } from "./client";
import type { DataProvider, FocusSession, Routine, Task } from "@/types";

/**
 * Implementação do DataProvider que fala com o Supabase.
 * Converte entre o formato "snake_case" do banco e o formato
 * "camelCase" usado no restante do app.
 */
function taskFromRow(row: any): Task {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description ?? undefined,
    priority: row.priority,
    dueDate: row.due_date ?? undefined,
    dueTime: row.due_time ?? undefined,
    completed: row.completed,
    reminder: {
      enabled: row.reminder_enabled,
      repeat: row.reminder_repeat,
      minutesBefore: row.reminder_minutes_before,
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function taskToRow(task: Task) {
  return {
    id: task.id,
    user_id: task.userId,
    title: task.title,
    description: task.description ?? null,
    priority: task.priority,
    due_date: task.dueDate ?? null,
    due_time: task.dueTime ?? null,
    completed: task.completed,
    reminder_enabled: task.reminder.enabled,
    reminder_repeat: task.reminder.repeat,
    reminder_minutes_before: task.reminder.minutesBefore,
    updated_at: new Date().toISOString(),
  };
}

export const supabaseProvider: DataProvider = {
  async listTasks(userId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("due_date", { ascending: true, nullsFirst: false });
    if (error) throw error;
    return (data ?? []).map(taskFromRow);
  },

  async saveTask(task) {
    if (!supabase) return;
    const { error } = await supabase.from("tasks").upsert(taskToRow(task));
    if (error) throw error;
  },

  async deleteTask(id) {
    if (!supabase) return;
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;
  },

  async listRoutines(userId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("routines")
      .select("*, routine_steps(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(
      (row: any): Routine => ({
        id: row.id,
        userId: row.user_id,
        title: row.title,
        description: row.description ?? undefined,
        steps: (row.routine_steps ?? [])
          .sort((a: any, b: any) => a.position - b.position)
          .map((s: any) => ({ id: s.id, title: s.title, completed: s.completed })),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })
    );
  },

  async saveRoutine(routine) {
    if (!supabase) return;
    const { error: routineError } = await supabase.from("routines").upsert({
      id: routine.id,
      user_id: routine.userId,
      title: routine.title,
      description: routine.description ?? null,
      updated_at: new Date().toISOString(),
    });
    if (routineError) throw routineError;

    // Substitui as etapas por completo (abordagem simples e previsível).
    await supabase.from("routine_steps").delete().eq("routine_id", routine.id);
    if (routine.steps.length > 0) {
      const { error: stepsError } = await supabase.from("routine_steps").insert(
        routine.steps.map((s, index) => ({
          id: s.id,
          routine_id: routine.id,
          title: s.title,
          completed: s.completed,
          position: index,
        }))
      );
      if (stepsError) throw stepsError;
    }
  },

  async deleteRoutine(id) {
    if (!supabase) return;
    const { error } = await supabase.from("routines").delete().eq("id", id);
    if (error) throw error;
  },

  async listFocusSessions(userId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("focus_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(
      (row: any): FocusSession => ({
        id: row.id,
        userId: row.user_id,
        completedAt: row.completed_at,
        durationMinutes: row.duration_minutes,
      })
    );
  },

  async addFocusSession(session) {
    if (!supabase) return;
    const { error } = await supabase.from("focus_sessions").insert({
      id: session.id,
      user_id: session.userId,
      completed_at: session.completedAt,
      duration_minutes: session.durationMinutes,
    });
    if (error) throw error;
  },
};
