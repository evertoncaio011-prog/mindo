import { cn } from "@/lib/utils";
import type { Priority } from "@/types";

const LABEL: Record<Priority, string> = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
};

const DOT_CLASS: Record<Priority, string> = {
  alta: "bg-priority-alta",
  media: "bg-priority-media",
  baixa: "bg-priority-baixa",
};

/** Indicador visual de prioridade — usa cor + texto (nunca só cor), para acessibilidade. */
export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-surfaceMuted dark:bg-surfaceMuted-dark px-2.5 py-1 text-xs font-medium text-ink-soft dark:text-ink-darkSoft",
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", DOT_CLASS[priority])} aria-hidden />
      {LABEL[priority]}
    </span>
  );
}
