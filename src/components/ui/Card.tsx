import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark shadow-soft",
        className
      )}
      {...props}
    />
  );
}
