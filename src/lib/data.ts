import { isSupabaseConfigured } from "@/lib/supabase/client";
import { supabaseProvider } from "@/lib/supabase/provider";
import { localProvider } from "@/lib/localProvider";
import type { DataProvider } from "@/types";

// Ponto único de decisão: se o Supabase estiver configurado, usamos ele;
// caso contrário, caímos automaticamente para o armazenamento local.
// Todo o resto do app (hooks, telas) depende apenas de `DataProvider`,
// então novas formas de persistência podem ser adicionadas aqui no futuro.
export const dataProvider: DataProvider = isSupabaseConfigured ? supabaseProvider : localProvider;

/** Id de usuário usado no modo local (sem autenticação). */
export const LOCAL_GUEST_USER_ID = "guest-local";
