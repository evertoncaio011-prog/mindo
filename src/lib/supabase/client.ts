import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * O Mindo funciona com ou sem Supabase configurado:
 * - Sem as variáveis de ambiente, `isSupabaseConfigured` é falso e o app
 *   usa o armazenamento local (ver `src/lib/localProvider.ts`).
 * - Assim que você preenche o .env.local, o app passa a usar o Supabase
 *   automaticamente, sem precisar mudar nenhuma tela.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
