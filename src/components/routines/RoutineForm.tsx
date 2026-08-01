"use client";

import { FormEvent, useState } from "react";
import { Plus, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface RoutineFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string | undefined, steps: string[]) => Promise<void> | void;
}

/** Formulário para criar uma rotina com uma lista dinâmica de etapas. */
export function RoutineForm({ open, onClose, onSubmit }: RoutineFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<string[]>(["", ""]);
  const [saving, setSaving] = useState(false);

  function updateStep(index: number, value: string) {
    setSteps((prev) => prev.map((s, i) => (i === index ? value : s)));
  }

  function addStepField() {
    setSteps((prev) => [...prev, ""]);
  }

  function removeStepField(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    await onSubmit(title.trim(), description.trim() || undefined, steps);
    setSaving(false);
    onClose();
    setTitle("");
    setDescription("");
    setSteps(["", ""]);
  }

  return (
    <Modal open={open} onClose={onClose} title="Nova rotina">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="routineTitle" className="mb-1.5 block text-sm font-medium text-ink dark:text-ink-dark">
            Nome da rotina
          </label>
          <input
            id="routineTitle"
            autoFocus
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex.: Rotina da manhã"
            className="w-full rounded-xl border border-border bg-base px-3.5 py-3 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus-500 dark:border-border-dark dark:bg-base-dark dark:text-ink-dark"
          />
        </div>

        <div>
          <label htmlFor="routineDescription" className="mb-1.5 block text-sm font-medium text-ink dark:text-ink-dark">
            Descrição (opcional)
          </label>
          <input
            id="routineDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex.: Para começar o dia com calma"
            className="w-full rounded-xl border border-border bg-base px-3.5 py-3 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus-500 dark:border-border-dark dark:bg-base-dark dark:text-ink-dark"
          />
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink dark:text-ink-dark">Etapas</span>
          <div className="flex flex-col gap-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  placeholder={`Etapa ${index + 1}`}
                  className="w-full rounded-xl border border-border bg-base px-3.5 py-2.5 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus-500 dark:border-border-dark dark:bg-base-dark dark:text-ink-dark"
                />
                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStepField(index)}
                    aria-label="Remover etapa"
                    className="shrink-0 rounded-lg p-2 text-ink-soft hover:bg-surfaceMuted dark:text-ink-darkSoft dark:hover:bg-surfaceMuted-dark"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addStepField}
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-focus-500 hover:text-focus-600"
          >
            <Plus size={16} /> Adicionar etapa
          </button>
        </div>

        <Button type="submit" size="lg" disabled={saving || !title.trim()}>
          Criar rotina
        </Button>
      </form>
    </Modal>
  );
}
