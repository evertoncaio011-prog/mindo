"use client";

import { useState } from "react";
import { Plus, Repeat } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { RoutineForm } from "@/components/routines/RoutineForm";
import { RoutineCard } from "@/components/routines/RoutineCard";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useRoutines } from "@/hooks/useRoutines";

export default function RotinasPage() {
  const { userId, ready } = useRequireAuth();
  const { routines, addRoutine, toggleStep, removeRoutine } = useRoutines(userId);
  const [formOpen, setFormOpen] = useState(false);

  if (!ready) return null;

  return (
    <AppShell>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink dark:text-ink-dark">Rotinas</h1>
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <Plus size={16} />
          Nova
        </Button>
      </header>

      {routines.length === 0 ? (
        <EmptyState
          icon={<Repeat size={26} />}
          title="Crie sua primeira rotina"
          description="Junte etapas simples que você repete sempre — como a rotina da manhã ou de estudo."
          action={
            <Button size="md" onClick={() => setFormOpen(true)}>
              <Plus size={16} />
              Criar rotina
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {routines.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onToggleStep={toggleStep}
              onDelete={removeRoutine}
            />
          ))}
        </div>
      )}

      <RoutineForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(title, description, steps) => addRoutine(title, description, steps)}
      />
    </AppShell>
  );
}
