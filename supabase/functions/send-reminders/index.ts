// Edge Function do Mindo: verifica, a cada chamada (agendada de minuto em
// minuto via pg_cron), quais tarefas têm um lembrete batendo agora, e
// envia uma push notification real para os dispositivos do usuário dono
// da tarefa — funciona mesmo com o app fechado no celular.
//
// Deploy: supabase functions deploy send-reminders
// Secrets necessários (supabase secrets set ...):
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT (ex: mailto:voce@email.com)
//   SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY já existem por padrão no ambiente da função.

import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") ?? "mailto:contato@example.com";

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

function subtractMinutes(time: string, minutes: number) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m - minutes;
  const wrapped = ((total % 1440) + 1440) % 1440;
  return { hour: Math.floor(wrapped / 60), minute: wrapped % 60 };
}

// O horário salvo nas tarefas (due_time) é o horário local do usuário
// (Brasil). Como a Edge Function roda em UTC, convertemos "agora" para o
// horário de São Paulo antes de comparar, senão os lembretes disparariam
// com 3h de diferença.
const TIME_ZONE = "America/Sao_Paulo";

function nowInTimeZone(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  return {
    dateISO: `${get("year")}-${get("month")}-${get("day")}`,
    hour: Number(get("hour")) % 24, // "24" às vezes vem no lugar de "00" com hour12:false
    minute: Number(get("minute")),
    weekday: weekdayMap[get("weekday")] ?? date.getUTCDay(),
  };
}

Deno.serve(async () => {
  const now = new Date();
  const local = nowInTimeZone(now);
  const today = local.dateISO;
  const weekday = local.weekday;

  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("id, user_id, title, due_date, due_time, completed, reminder_enabled, reminder_repeat, reminder_minutes_before, reminder_last_sent_date")
    .eq("reminder_enabled", true)
    .eq("completed", false)
    .not("due_time", "is", null);

  if (tasksError) {
    return new Response(JSON.stringify({ error: tasksError.message }), { status: 500 });
  }

  const dueTasks = (tasks ?? []).filter((task) => {
    if (task.reminder_last_sent_date === today) return false;
    if (task.reminder_repeat === "none" && task.due_date !== today) return false;
    if (task.reminder_repeat === "weekly" && task.due_date) {
      const taskWeekday = new Date(`${task.due_date}T00:00:00Z`).getUTCDay();
      if (taskWeekday !== weekday) return false;
    }

    const target = subtractMinutes(task.due_time, task.reminder_minutes_before ?? 0);
    return local.hour === target.hour && local.minute === target.minute;
  });

  if (dueTasks.length === 0) {
    return new Response(JSON.stringify({ sent: 0 }), { status: 200 });
  }

  const userIds = [...new Set(dueTasks.map((t) => t.user_id))];
  const { data: subs, error: subsError } = await supabase
    .from("push_subscriptions")
    .select("user_id, endpoint, p256dh, auth")
    .in("user_id", userIds);

  if (subsError) {
    return new Response(JSON.stringify({ error: subsError.message }), { status: 500 });
  }

  let sent = 0;
  const errors: string[] = [];

  for (const task of dueTasks) {
    const userSubs = (subs ?? []).filter((s) => s.user_id === task.user_id);
    const payload = JSON.stringify({
      title: `Lembrete: ${task.title}`,
      body:
        task.reminder_minutes_before > 0
          ? `Em ${task.reminder_minutes_before} minuto(s), às ${task.due_time}`
          : "Agora",
      url: "/tarefas",
      tag: `task-${task.id}`,
    });

    for (const sub of userSubs) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload
        );
        sent += 1;
      } catch (err: any) {
        // Inscrição expirada/inválida (410/404) — remove para não tentar de novo.
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
        } else {
          errors.push(String(err?.message ?? err));
        }
      }
    }

    await supabase.from("tasks").update({ reminder_last_sent_date: today }).eq("id", task.id);
  }

  return new Response(JSON.stringify({ sent, errors }), { status: 200 });
});
