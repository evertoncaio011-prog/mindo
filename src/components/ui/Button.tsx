"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-focus-500 text-white hover:bg-focus-600 active:bg-focus-700 shadow-soft",
  secondary:
    "bg-surfaceMuted dark:bg-surfaceMuted-dark text-ink dark:text-ink-dark hover:brightness-95",
  ghost: "bg-transparent text-ink dark:text-ink-dark hover:bg-surfaceMuted dark:hover:bg-surfaceMuted-dark",
  danger: "bg-transparent text-priority-alta hover:bg-priority-alta/10",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5 rounded-xl gap-1.5",
  md: "text-sm px-4 py-2.5 rounded-xl gap-2",
  lg: "text-base px-5 py-3.5 rounded-2xl gap-2",
};

/** Botão padrão do Mindo — sempre com alvo de toque generoso (poucos cliques, fácil de acertar). */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-500 focus-visible:ring-offset-2 focus-visible:ring-offset-base dark:focus-visible:ring-offset-base-dark",
          "disabled:opacity-50 disabled:pointer-events-none",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
