"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListChecks, Repeat, Timer, Settings, BellRing } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

const ITEMS = [
  { href: "/", label: "Início", icon: Home },
  { href: "/tarefas", label: "Tarefas", icon: ListChecks },
  { href: "/lembretes", label: "Lembretes", icon: BellRing },
  { href: "/rotinas", label: "Rotinas", icon: Repeat },
  { href: "/foco", label: "Foco", icon: Timer },
  { href: "/configuracoes", label: "Ajustes", icon: Settings },
];

/** Navegação lateral para telas maiores (desktop/tablet). */
export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-surface px-4 py-6 dark:border-border-dark dark:bg-surface-dark sm:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-focus-500 font-display text-base font-bold text-white">
          M
        </div>
        <span className="font-display text-lg font-semibold text-ink dark:text-ink-dark">Mindo</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Navegação principal">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-focus-50 text-focus-600 dark:bg-focus-500/10 dark:text-focus-400"
                  : "text-ink-soft hover:bg-surfaceMuted hover:text-ink dark:text-ink-darkSoft dark:hover:bg-surfaceMuted-dark dark:hover:text-ink-dark"
              )}
            >
              <Icon size={19} strokeWidth={active ? 2.4 : 2} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center justify-between px-2">
        <span className="text-xs text-ink-soft dark:text-ink-darkSoft">Tema</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
