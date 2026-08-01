"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

/**
 * Usado no topo de cada tela: garante que exista um userId utilizável.
 * - Modo local (sem Supabase): libera na hora, sem tela de login.
 * - Modo Supabase: espera a sessão carregar e redireciona para /login
 *   se não houver usuário autenticado.
 */
export function useRequireAuth() {
  const { userId, loading, requiresLogin, email } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && requiresLogin && !userId) {
      router.replace("/login");
    }
  }, [loading, requiresLogin, userId, router]);

  const ready = !loading && (!requiresLogin || Boolean(userId));

  return { userId, ready, loading, email };
}
