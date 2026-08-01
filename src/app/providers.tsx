"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

/**
 * Agrupa os provedores globais do app. Hoje só temos o tema (claro/escuro),
 * mas este é o lugar certo para adicionar novos contextos no futuro
 * (ex: um provedor de autenticação mais elaborado).
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
