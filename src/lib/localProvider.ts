import type { DataProvider, FocusSession, Routine, Task } from "@/types";

// Camada de persistência local (localStorage), usada automaticamente quando
// o Supabase não está configurado. Implementa o mesmo contrato (DataProvider)
// da versão Supabase, então trocar de uma para a outra não exige mudar telas.

const KEYS = {
  tasks: "mindo:tasks",
  routines: "mindo:routines",
  focusSessions: "mindo:focus-sessions",
};

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const localProvider: DataProvider = {
  async listTasks(userId) {
    return read<Task>(KEYS.tasks).filter((t) => t.userId === userId);
  },

  async saveTask(task) {
    const all = read<Task>(KEYS.tasks);
    const idx = all.findIndex((t) => t.id === task.id);
    if (idx >= 0) all[idx] = task;
    else all.push(task);
    write(KEYS.tasks, all);
  },

  async deleteTask(id) {
    const all = read<Task>(KEYS.tasks).filter((t) => t.id !== id);
    write(KEYS.tasks, all);
  },

  async listRoutines(userId) {
    return read<Routine>(KEYS.routines).filter((r) => r.userId === userId);
  },

  async saveRoutine(routine) {
    const all = read<Routine>(KEYS.routines);
    const idx = all.findIndex((r) => r.id === routine.id);
    if (idx >= 0) all[idx] = routine;
    else all.push(routine);
    write(KEYS.routines, all);
  },

  async deleteRoutine(id) {
    const all = read<Routine>(KEYS.routines).filter((r) => r.id !== id);
    write(KEYS.routines, all);
  },

  async listFocusSessions(userId) {
    return read<FocusSession>(KEYS.focusSessions).filter((s) => s.userId === userId);
  },

  async addFocusSession(session) {
    const all = read<FocusSession>(KEYS.focusSessions);
    all.push(session);
    write(KEYS.focusSessions, all);
  },
};
