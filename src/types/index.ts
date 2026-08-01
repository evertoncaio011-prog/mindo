// Tipos centrais do Mindo.
// Mantidos em um único lugar para facilitar evolução (novas telas, novos campos, etc.).

export type Priority = "alta" | "media" | "baixa";

export type RepeatMode = "none" | "daily" | "weekly";

export interface Reminder {
  enabled: boolean;
  repeat: RepeatMode;
  /** Minutos antes do horário da tarefa para disparar o aviso. */
  minutesBefore: number;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string; // formato ISO (YYYY-MM-DD)
  dueTime?: string; // formato HH:mm
  completed: boolean;
  reminder: Reminder;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineStep {
  id: string;
  title: string;
  completed: boolean;
}

export interface Routine {
  id: string;
  userId: string;
  title: string;
  description?: string;
  steps: RoutineStep[];
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface FocusSession {
  id: string;
  userId: string;
  completedAt: string;
  durationMinutes: number;
}

/** Contrato comum para as camadas de persistência (local ou Supabase). */
export interface DataProvider {
  listTasks(userId: string): Promise<Task[]>;
  saveTask(task: Task): Promise<void>;
  deleteTask(id: string): Promise<void>;

  listRoutines(userId: string): Promise<Routine[]>;
  saveRoutine(routine: Routine): Promise<void>;
  deleteRoutine(id: string): Promise<void>;

  listFocusSessions(userId: string): Promise<FocusSession[]>;
  addFocusSession(session: FocusSession): Promise<void>;
}
