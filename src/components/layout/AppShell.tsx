import { ReactNode } from "react";
import { SideNav } from "./SideNav";
import { BottomNav } from "./BottomNav";
import { ReminderScheduler } from "@/components/ReminderScheduler";

/**
 * Estrutura visual comum a todas as telas autenticadas:
 * menu lateral no desktop, navegação inferior no mobile.
 * Mantida em um único componente para facilitar adicionar novas
 * telas no futuro sem repetir o layout.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-base dark:bg-base-dark">
      <SideNav />
      <main className="flex-1 px-4 pb-24 pt-6 sm:px-8 sm:pb-10 sm:pt-8">
        <div className="mx-auto w-full max-w-2xl">{children}</div>
      </main>
      <BottomNav />
      <ReminderScheduler />
    </div>
  );
}
