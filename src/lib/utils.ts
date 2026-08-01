import { type ClassValue, clsx } from "clsx";

/** Combina classes condicionalmente (wrapper fino sobre clsx). */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Gera um id único simples, sem depender de pacotes externos. */
export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Formata uma data ISO (YYYY-MM-DD) para exibição em pt-BR. */
export function formatDateBR(iso?: string): string | null {
  if (!iso) return null;
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
}

/** Retorna a data de hoje no formato ISO (YYYY-MM-DD), no fuso local. */
export function todayISO(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

/** Compara datas/horas de tarefas para ordenação (tarefas sem data vão pro fim). */
export function compareByDueDateTime(
  a: { dueDate?: string; dueTime?: string },
  b: { dueDate?: string; dueTime?: string }
): number {
  const aKey = a.dueDate ? `${a.dueDate}T${a.dueTime ?? "23:59"}` : null;
  const bKey = b.dueDate ? `${b.dueDate}T${b.dueTime ?? "23:59"}` : null;
  if (aKey && bKey) return aKey.localeCompare(bKey);
  if (aKey) return -1;
  if (bKey) return 1;
  return 0;
}

const PRIORITY_WEIGHT: Record<string, number> = { alta: 0, media: 1, baixa: 2 };

/** Ordena por data/hora primeiro e, em empate, por prioridade. */
export function sortTasks<T extends { dueDate?: string; dueTime?: string; priority: string }>(
  tasks: T[]
): T[] {
  return [...tasks].sort((a, b) => {
    const byDate = compareByDueDateTime(a, b);
    if (byDate !== 0) return byDate;
    return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
  });
}
