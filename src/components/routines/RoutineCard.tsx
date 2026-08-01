"use client";

import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { Routine } from "@/types";

interface RoutineCardProps {
  routine: Routine;
  onToggleStep: (routineId: string, stepId: string) => void;
  onDelete: (id: string) => void;
}

export function RoutineCard({ routine, onToggleStep, onDelete }: RoutineCardProps) {
  const total = routine.steps.length;
  const done = routine.steps.filter((s) => s.completed).length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Card className="p-4 animate-fade-in">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="font-display text-base font-semibold text-ink dark:text-ink-dark">
            {routine.title}
          </p>
          {routine.description && (
            <p className="text-xs text-ink-soft dark:text-ink-darkSoft">{routine.description}</p>
          )}
        </div>
        <button
          onClick={() => onDelete(routine.id)}
          aria-label="Excluir rotina"
          className="shrink-0 rounded-lg p-1.5 text-ink-soft hover:bg-priority-alta/10 hover:text-priority-alta dark:text-ink-darkSoft"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {total > 0 && (
        <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-surfaceMuted dark:bg-surfaceMuted-dark">
          <div
            className="h-full rounded-full bg-calm-500 transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}

      <ul className="flex flex-col gap-2">
        {routine.steps.map((step) => (
          <li key={step.id}>
            <button
              onClick={() => onToggleStep(routine.id, step.id)}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left hover:bg-surfaceMuted dark:hover:bg-surfaceMuted-dark"
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  step.completed
                    ? "border-calm-500 bg-calm-500 text-white"
                    : "border-border dark:border-border-dark"
                )}
              >
                {step.completed && (
                  <svg width="10" height="8" viewBox="0 0 12 10" fill="none" aria-hidden>
                    <path d="M1 5L4.5 8.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span
                className={cn(
                  "text-sm text-ink dark:text-ink-dark",
                  step.completed && "text-ink-soft line-through dark:text-ink-darkSoft"
                )}
              >
                {step.title}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
