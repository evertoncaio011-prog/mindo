"use client";

import { useEffect, useState } from "react";

/**
 * Hook simples para persistir um pedaço de estado no localStorage.
 * Usado para preferências (som, notificações) que não dependem do Supabase.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch {
      // Ignora erros de leitura (ex: JSON inválido) e mantém o valor padrão.
    } finally {
      setHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, hydrated]);

  return [value, setValue] as const;
}
