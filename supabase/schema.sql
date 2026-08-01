-- Esquema do banco de dados do Mindo (Supabase / Postgres)
-- Execute este script no SQL Editor do seu projeto Supabase.

-- Extensão para gerar UUIDs
create extension if not exists "pgcrypto";

-- ============================================================
-- USUÁRIOS
-- O Supabase Auth já cria e gerencia a tabela auth.users.
-- Aqui guardamos apenas dados extras de perfil, ligados por id.
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  sound_enabled boolean not null default true,
  notifications_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- TAREFAS
-- ============================================================
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  priority text not null default 'media' check (priority in ('alta', 'media', 'baixa')),
  due_date date,
  due_time time,
  completed boolean not null default false,
  reminder_enabled boolean not null default false,
  reminder_repeat text not null default 'none' check (reminder_repeat in ('none', 'daily', 'weekly')),
  reminder_minutes_before int not null default 10,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_user_id_idx on public.tasks (user_id);
create index if not exists tasks_due_date_idx on public.tasks (due_date);

-- ============================================================
-- ROTINAS + ETAPAS
-- ============================================================
create table if not exists public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.routine_steps (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routines (id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  position int not null default 0
);

create index if not exists routines_user_id_idx on public.routines (user_id);
create index if not exists routine_steps_routine_id_idx on public.routine_steps (routine_id);

-- ============================================================
-- SESSÕES DE FOCO (Pomodoro)
-- ============================================================
create table if not exists public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  duration_minutes int not null default 25,
  completed_at timestamptz not null default now()
);

create index if not exists focus_sessions_user_id_idx on public.focus_sessions (user_id);

-- ============================================================
-- SEGURANÇA (Row Level Security)
-- Cada usuário só acessa os próprios dados.
-- ============================================================
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.routines enable row level security;
alter table public.routine_steps enable row level security;
alter table public.focus_sessions enable row level security;

create policy "Perfil próprio" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Tarefas próprias" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Rotinas próprias" on public.routines
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Etapas das próprias rotinas" on public.routine_steps
  for all using (
    exists (select 1 from public.routines r where r.id = routine_id and r.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.routines r where r.id = routine_id and r.user_id = auth.uid())
  );

create policy "Sessões de foco próprias" on public.focus_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Cria automaticamente um perfil quando um usuário se cadastra
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data ->> 'name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
