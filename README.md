# Mindo

Um app simples e calmo para organizar tarefas, rotinas e foco — pensado para mentes com TDAH: poucos cliques, fontes legíveis, cores suaves e nenhuma distração desnecessária.

## Tecnologias

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Supabase** (banco de dados e autenticação) — opcional, veja abaixo
- **PWA** — instalável no Android e no iPhone

## Como rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

**Você não precisa configurar nada para testar.** Sem um Supabase conectado, o Mindo roda em **modo local**: os dados ficam salvos no navegador (`localStorage`), sem exigir login.

## Conectando o Supabase (opcional, recomendado para produção)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor** do projeto, rode o script `supabase/schema.sql` deste repositório. Ele cria as tabelas de perfis, tarefas, rotinas (com etapas) e sessões de foco, já com Row Level Security (cada pessoa só acessa os próprios dados).
3. Em **Project Settings → API**, copie a `URL` e a `anon public key`.
4. Copie `.env.local.example` para `.env.local` e preencha:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
   ```

5. Reinicie o servidor (`npm run dev`). O app passa a exigir login (link mágico por e-mail, sem senha) e a salvar tudo no Supabase automaticamente — nenhuma tela precisa mudar.

Em **Authentication → URL Configuration** do Supabase, adicione a URL do seu app (local e/ou de produção) em "Redirect URLs" para o link mágico funcionar corretamente.

## Deploy na Vercel

1. Suba este projeto para um repositório Git (GitHub, GitLab, etc.).
2. Em [vercel.com](https://vercel.com), clique em **New Project** e importe o repositório.
3. Se for usar o Supabase, adicione as duas variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`) nas configurações do projeto na Vercel.
4. Clique em **Deploy**.

O app já sai pronto para ser instalado como PWA (ícone na tela inicial, tela cheia, funciona offline para o "shell" básico).

## Estrutura do projeto

```
src/
  app/                 # Rotas (App Router) — uma pasta por tela
    page.tsx           # Início
    tarefas/
    lembretes/
    rotinas/
    foco/
    configuracoes/
    login/
  components/
    ui/                # Componentes de interface genéricos (Button, Card, Modal...)
    layout/             # Estrutura da página (menu lateral, navegação inferior)
    tasks/ routines/ focus/ reminders/   # Componentes específicos de cada tela
  hooks/               # Lógica de dados (useTasks, useRoutines, useAuth...)
  lib/
    supabase/          # Cliente e provedor de dados do Supabase
    localProvider.ts   # Provedor de dados local (fallback sem Supabase)
    data.ts            # Escolhe automaticamente Supabase ou local
  types/               # Tipos TypeScript compartilhados
supabase/
  schema.sql           # Script para criar as tabelas no Supabase
```

### Por que essa estrutura?

Tanto os hooks (`useTasks`, `useRoutines`, `useFocusSessions`) quanto os componentes de tela dependem apenas do contrato `DataProvider` (definido em `src/types/index.ts`), nunca diretamente do Supabase ou do localStorage. Isso significa que:

- Novas telas podem reaproveitar os mesmos hooks sem se preocupar em "onde" os dados são salvos.
- No futuro, é possível trocar ou adicionar uma nova forma de persistência (ex: uma API própria) editando só `src/lib/data.ts`.
- O design system (cores, tipografia, componentes de UI) está centralizado em `tailwind.config.ts` e `src/components/ui/`, facilitando manter a identidade visual conforme o app cresce.

## Próximos passos sugeridos

- Adicionar autenticação social (Google, Apple) via Supabase Auth.
- Sincronizar lembretes com notificações push reais (hoje usa a Web Notifications API, que só funciona com o app aberto ou em segundo plano no navegador).
- Adicionar gráficos de progresso semanal/mensal na tela de Foco.
- Suporte a subtarefas dentro de uma tarefa.
