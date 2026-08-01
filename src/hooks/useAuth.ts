"use client";

import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { LOCAL_GUEST_USER_ID } from "@/lib/data";

interface AuthState {
  userId: string | null;
  email: string | null;
  loading: boolean;
  /** Se falso, o app está em modo local e não exige login. */
  requiresLogin: boolean;
}

/**
 * Abstrai autenticação: quando o Supabase está configurado, usa a sessão
 * real (login por link mágico). Caso contrário, usa um usuário local fixo,
 * para que o app funcione imediatamente, sem configuração.
 */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    userId: isSupabaseConfigured ? null : LOCAL_GUEST_USER_ID,
    email: null,
    loading: isSupabaseConfigured,
    requiresLogin: isSupabaseConfigured,
  });

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setState({
        userId: data.session?.user.id ?? null,
        email: data.session?.user.email ?? null,
        loading: false,
        requiresLogin: true,
      });
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        userId: session?.user.id ?? null,
        email: session?.user.email ?? null,
        loading: false,
        requiresLogin: true,
      });
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return state;
}
