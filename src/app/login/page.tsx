"use client";

import { FormEvent, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Mail, Sparkles } from "lucide-react";

function getAuthErrorMessage(code?: string) {
  if (code === "over_email_send_rate_limit") {
    return "Muitos links foram solicitados. Aguarde alguns minutos antes de tentar novamente.";
  }

  if (code === "email_provider_disabled") {
    return "O envio de e-mails ainda não foi habilitado no Mindo.";
  }

  return "Não foi possível enviar o link. Tente novamente.";
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!supabase || !email.trim()) return;
    setLoading(true);
    setError(null);
    const redirectUrl = process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      // Sem uma URL configurada, o Supabase usa a "Site URL" do projeto.
      // Assim, deployments temporários da Vercel não bloqueiam o envio do e-mail
      // por não estarem na lista de Redirect URLs autorizadas.
      options: redirectUrl ? { emailRedirectTo: redirectUrl } : undefined,
    });
    setLoading(false);
    if (error) setError(getAuthErrorMessage(error.code));
    else setSent(true);
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="max-w-sm p-6 text-center">
          <p className="text-sm text-ink-soft dark:text-ink-darkSoft">
            O Mindo está rodando em modo local — não é preciso login. Volte para a tela inicial.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm p-8 animate-fade-in">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-focus-500 text-white">
            <Sparkles size={22} />
          </div>
          <h1 className="font-display text-xl font-bold text-ink dark:text-ink-dark">
            Entrar no Mindo
          </h1>
          <p className="text-sm text-ink-soft dark:text-ink-darkSoft">
            Sem senha. Enviamos um link mágico para o seu e-mail.
          </p>
        </div>

        {sent ? (
          <div className="rounded-xl bg-calm-100 px-4 py-3 text-center text-sm text-calm-600">
            Link enviado! Confira sua caixa de entrada e clique para continuar.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="flex items-center gap-2 rounded-xl border border-border bg-base px-3.5 py-3 dark:border-border-dark dark:bg-base-dark">
              <Mail size={18} className="text-ink-soft dark:text-ink-darkSoft" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-transparent text-sm text-ink outline-none dark:text-ink-dark"
              />
            </label>
            {error && <p className="text-sm text-priority-alta">{error}</p>}
            <Button type="submit" disabled={loading} size="lg">
              {loading ? "Enviando..." : "Enviar link de acesso"}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
