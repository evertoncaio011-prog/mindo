"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListChecks, Repeat, Timer, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Início", icon: Home },
  { href: "/tarefas", label: "Tarefas", icon: ListChecks },
  { href: "/foco", label: "Foco", icon: Timer },
  { href: "/rotinas", label: "Rotinas", icon: Repeat },
  { href: "/configuracoes", label: "Ajustes", icon: Settings },
];

/** Navegação inferior fixa — poucos destinos, sempre visíveis, sem menus escondidos. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur dark:border-border-dark dark:bg-surface-dark/95 sm:hidden"
      aria-label="Navegação principal"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[11px] font-medium transition-colors",
                  active
                    ? "text-focus-500"
                    : "text-ink-soft hover:text-ink dark:text-ink-darkSoft dark:hover:text-ink-dark"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={22} strokeWidth={active ? 2.4 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
