"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita mismatch de hidratação: só lemos o tema depois de montar no cliente.
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className={cn("h-10 w-10", className)} />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full bg-surfaceMuted dark:bg-surfaceMuted-dark text-ink dark:text-ink-dark transition-colors",
        "hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-500",
        className
      )}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
