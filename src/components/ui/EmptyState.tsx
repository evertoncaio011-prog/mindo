import { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border dark:border-border-dark px-6 py-12 text-center animate-fade-in">
      {icon && <div className="text-focus-400">{icon}</div>}
      <p className="font-display text-base font-semibold text-ink dark:text-ink-dark">{title}</p>
      {description && (
        <p className="max-w-xs text-sm text-ink-soft dark:text-ink-darkSoft">{description}</p>
      )}
      {action}
    </div>
  );
}
