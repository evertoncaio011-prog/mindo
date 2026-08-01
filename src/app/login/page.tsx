"use client";

import { FormEvent, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Mail, Lock, Sparkles, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

type Mode = "senha" | "cadastro" | "magico";

function getAuthErrorMessage(code?: string, message?: string) {
  if (code === "over_email_send_rate_limit") {
    return "Muitos links foram solicitados. Aguarde alguns minutos antes de tentar novamente.";
  }
  if (code === "email_provider_disabled") {
    return "O envio de e-mails ainda não foi habilitado no Mindo.";
  }
  if (code === "invalid_credentials") {
    return "E-mail ou senha incorretos.";
  }
  if (code === "user_already_exists" || message?.includes("already registered")) {
    return "Já existe uma conta com esse e-mail. Tente entrar em vez de criar uma nova conta.";
  }
  if (code === "weak_password" || message?.toLowerCase().includes("password")) {
    return "A senha precisa ter pelo menos 6 caracteres.";
  }
  return "Não foi possível concluir. Tente novamente.";
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("senha");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sent, setSent] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLoginSenha(e: FormEvent) {
    e.preventDefault();
    if (!supabase || !email.trim() || !password) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) setError(getAuthErrorMessage(error.code, error.message));
    else router.replace("/");
  }

  async function handleCadastro(e: FormEvent) {
    e.preventDefault();
    if (!supabase || !email.trim() || !password) return;
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      setError(getAuthErrorMessage(error.code, error.message));
      return;
    }
    // Se a confirmação por e-mail estiver ativada no projeto, não há sessão ainda.
    if (data.session) {
      router.replace("/");
    } else {
      setConfirmSent(true);
    }
  }

  async function handleMagico(e: FormEvent) {
    e.preventDefault();
    if (!supabase || !email.trim()) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
    });
    setLoading(false);
    if (error) setError(getAuthErrorMessage(error.code, error.message));
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
            {mode === "cadastro" ? "Criar conta no Mindo" : "Entrar no Mindo"}
          </h1>
          <p className="text-sm text-ink-soft dark:text-ink-darkSoft">
            {mode === "magico"
              ? "Sem senha. Enviamos um link mágico para o seu e-mail."
              : mode === "cadastro"
              ? "Crie seu e-mail e senha para começar."
              : "Entre com seu e-mail e senha."}
          </p>
        </div>

        {/* Abas de alternância */}
        <div className="mb-5 flex rounded-xl bg-surfaceMuted p-1 text-sm dark:bg-surfaceMuted-dark">
          <button
            type="button"
            onClick={() => {
              setMode("senha");
              setError(null);
            }}
            className={`flex-1 rounded-lg py-1.5 font-medium transition-colors ${
              mode === "senha" || mode === "cadastro"
                ? "bg-base text-ink shadow-soft dark:bg-base-dark dark:text-ink-dark"
                : "text-ink-soft dark:text-ink-darkSoft"
            }`}
          >
            E-mail e senha
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("magico");
              setError(null);
            }}
            className={`flex-1 rounded-lg py-1.5 font-medium transition-colors ${
              mode === "magico"
                ? "bg-base text-ink shadow-soft dark:bg-base-dark dark:text-ink-dark"
                : "text-ink-soft dark:text-ink-darkSoft"
            }`}
          >
            Link mágico
          </button>
        </div>

        {mode === "magico" ? (
          sent ? (
            <div className="rounded-xl bg-calm-100 px-4 py-3 text-center text-sm text-calm-600">
              Link enviado! Confira sua caixa de entrada e clique para continuar.
            </div>
          ) : (
            <form onSubmit={handleMagico} className="flex flex-col gap-3">
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
          )
        ) : confirmSent ? (
          <div className="rounded-xl bg-calm-100 px-4 py-3 text-center text-sm text-calm-600">
            Conta criada! Se a confirmação por e-mail estiver ativa, verifique sua caixa de entrada antes de entrar.
          </div>
        ) : (
          <form
            onSubmit={mode === "cadastro" ? handleCadastro : handleLoginSenha}
            className="flex flex-col gap-3"
          >
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
            <label className="flex items-center gap-2 rounded-xl border border-border bg-base px-3.5 py-3 dark:border-border-dark dark:bg-base-dark">
              <Lock size={18} className="text-ink-soft dark:text-ink-darkSoft" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="w-full bg-transparent text-sm text-ink outline-none dark:text-ink-dark"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-ink-soft dark:text-ink-darkSoft"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </label>
            {error && <p className="text-sm text-priority-alta">{error}</p>}
            <Button type="submit" disabled={loading} size="lg">
              {loading
                ? "Aguarde..."
                : mode === "cadastro"
                ? "Criar conta"
                : "Entrar"}
            </Button>
            <button
              type="button"
              onClick={() => {
                setMode(mode === "cadastro" ? "senha" : "cadastro");
                setError(null);
              }}
              className="text-center text-sm text-focus-500 hover:underline"
            >
              {mode === "cadastro"
                ? "Já tenho conta — entrar"
                : "Não tenho conta — criar agora"}
            </button>
          </form>
        )}
      </Card>
    </div>
  );
}
