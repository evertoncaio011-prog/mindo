"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Laptop, Moon, Sun, Volume2, BellRing, LogOut } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { useSettings } from "@/hooks/useSettings";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { requestNotificationPermission } from "@/lib/notifications";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Laptop },
];

export default function ConfiguracoesPage() {
  const { ready, email } = useRequireAuth();
  const { theme, setTheme } = useTheme();
  const { settings, setSoundEnabled, setNotificationsEnabled } = useSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  async function handleToggleNotifications(value: boolean) {
    if (value) await requestNotificationPermission();
    setNotificationsEnabled(value);
  }

  if (!ready) return null;

  return (
    <AppShell>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink dark:text-ink-dark">Ajustes</h1>
        {email && <p className="mt-1 text-sm text-ink-soft dark:text-ink-darkSoft">{email}</p>}
      </header>

      <div className="flex flex-col gap-4">
        <Card className="p-5">
          <p className="mb-3 text-sm font-semibold text-ink dark:text-ink-dark">Aparência</p>
          {mounted && (
            <div className="grid grid-cols-3 gap-2">
              {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-medium transition-colors",
                    theme === value
                      ? "border-focus-500 bg-focus-50 text-focus-600 dark:bg-focus-500/10 dark:text-focus-400"
                      : "border-border text-ink-soft dark:border-border-dark dark:text-ink-darkSoft"
                  )}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card className="flex items-center justify-between gap-3 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-focus-50 text-focus-500 dark:bg-focus-500/10">
              <Volume2 size={17} />
            </div>
            <div>
              <p className="text-sm font-medium text-ink dark:text-ink-dark">Sons</p>
              <p className="text-xs text-ink-soft dark:text-ink-darkSoft">Ao concluir tarefas e sessões de foco</p>
            </div>
          </div>
          <Switch checked={settings.soundEnabled} onChange={setSoundEnabled} label="Ativar sons" />
        </Card>

        <Card className="flex items-center justify-between gap-3 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-focus-50 text-focus-500 dark:bg-focus-500/10">
              <BellRing size={17} />
            </div>
            <div>
              <p className="text-sm font-medium text-ink dark:text-ink-dark">Notificações</p>
              <p className="text-xs text-ink-soft dark:text-ink-darkSoft">Avisos de lembretes das tarefas</p>
            </div>
          </div>
          <Switch
            checked={settings.notificationsEnabled}
            onChange={handleToggleNotifications}
            label="Ativar notificações"
          />
        </Card>

        {isSupabaseConfigured && (
          <Button variant="secondary" onClick={() => supabase?.auth.signOut()}>
            <LogOut size={16} />
            Sair da conta
          </Button>
        )}

        <p className="px-1 text-center text-xs text-ink-soft dark:text-ink-darkSoft">
          Mindo · feito para mentes que pensam diferente 💙
        </p>
      </div>
    </AppShell>
  );
}
