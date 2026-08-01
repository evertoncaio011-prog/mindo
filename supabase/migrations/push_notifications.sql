-- Push notifications reais para o Mindo.
-- Rode este script no SQL Editor do Supabase (Database > SQL Editor > New query).

-- 1) Tabela que guarda a "inscrição" push de cada dispositivo do usuário.
-- Um mesmo usuário pode ter várias (celular, desktop, etc).
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

alter table push_subscriptions enable row level security;

drop policy if exists "push_subscriptions_select_own" on push_subscriptions;
create policy "push_subscriptions_select_own"
  on push_subscriptions for select
  using (auth.uid() = user_id);

drop policy if exists "push_subscriptions_insert_own" on push_subscriptions;
create policy "push_subscriptions_insert_own"
  on push_subscriptions for insert
  with check (auth.uid() = user_id);

drop policy if exists "push_subscriptions_delete_own" on push_subscriptions;
create policy "push_subscriptions_delete_own"
  on push_subscriptions for delete
  using (auth.uid() = user_id);

-- 2) Controle de "já avisei essa tarefa hoje", para o job que roda a cada
-- minuto não mandar a mesma notificação repetidas vezes.
alter table tasks
  add column if not exists reminder_last_sent_date date;

-- 3) Extensões necessárias para o agendamento automático (pg_cron chama
-- a Edge Function via pg_net a cada minuto).
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- 4) Agendamento: roda a cada minuto, chamando a Edge Function
-- "send-reminders". Troque <PROJECT_REF> e <ANON_KEY> pelos valores reais
-- do seu projeto (Project Settings > API) antes de rodar este bloco.
select cron.schedule(
  'mindo-send-reminders',
  '* * * * *',
  $$
  select net.http_post(
    url := 'https://<PROJECT_REF>.supabase.co/functions/v1/send-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <ANON_KEY>'
    ),
    body := '{}'::jsonb
  );
  $$
);
