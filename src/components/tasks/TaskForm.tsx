"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { Priority, Reminder, Task } from "@/types";
import type { TaskInput } from "@/hooks/useTasks";

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "alta", label: "Alta" },
  { value: "media", label: "Média" },
  { value: "baixa", label: "Baixa" },
];

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: TaskInput) => Promise<void> | void;
  initialTask?: Task;
}

const DEFAULT_REMINDER: Reminder = { enabled: false, repeat: "none", minutesBefore: 10 };

/** Formulário único usado tanto para criar quanto para editar uma tarefa. */
export function TaskForm({ open, onClose, onSubmit, initialTask }: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(initialTask?.description ?? "");
  const [priority, setPriority] = useState<Priority>(initialTask?.priority ?? "media");
  const [dueDate, setDueDate] = useState(initialTask?.dueDate ?? "");
  const [dueTime, setDueTime] = useState(initialTask?.dueTime ?? "");
  const [reminderEnabled, setReminderEnabled] = useState(initialTask?.reminder.enabled ?? false);
  const [repeat, setRepeat] = useState(initialTask?.reminder.repeat ?? "none");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      reminder: { ...DEFAULT_REMINDER, enabled: reminderEnabled, repeat },
    });
    setSaving(false);
    onClose();
    if (!initialTask) {
      setTitle("");
      setDescription("");
      setPriority("media");
      setDueDate("");
      setDueTime("");
      setReminderEnabled(false);
      setRepeat("none");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={initialTask ? "Editar tarefa" : "Nova tarefa"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-ink dark:text-ink-dark">
            O que você precisa fazer?
          </label>
          <input
            id="title"
            autoFocus
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex.: Responder e-mail da faculdade"
            className="w-full rounded-xl border border-border bg-base px-3.5 py-3 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus-500 dark:border-border-dark dark:bg-base-dark dark:text-ink-dark"
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-ink dark:text-ink-dark">
            Detalhes (opcional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Alguma observação rápida"
            className="w-full resize-none rounded-xl border border-border bg-base px-3.5 py-3 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus-500 dark:border-border-dark dark:bg-base-dark dark:text-ink-dark"
          />
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink dark:text-ink-dark">Prioridade</span>
          <div className="flex gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                  priority === p.value
                    ? "border-focus-500 bg-focus-50 text-focus-600 dark:bg-focus-500/10 dark:text-focus-400"
                    : "border-border text-ink-soft dark:border-border-dark dark:text-ink-darkSoft"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="dueDate" className="mb-1.5 block text-sm font-medium text-ink dark:text-ink-dark">
              Data
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-base px-3 py-2.5 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus-500 dark:border-border-dark dark:bg-base-dark dark:text-ink-dark"
            />
          </div>
          <div>
            <label htmlFor="dueTime" className="mb-1.5 block text-sm font-medium text-ink dark:text-ink-dark">
              Horário
            </label>
            <input
              id="dueTime"
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-full rounded-xl border border-border bg-base px-3 py-2.5 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus-500 dark:border-border-dark dark:bg-base-dark dark:text-ink-dark"
            />
          </div>
        </div>

        <div className="rounded-xl bg-surfaceMuted px-3.5 py-3 dark:bg-surfaceMuted-dark">
          <label className="flex items-center justify-between gap-2 text-sm font-medium text-ink dark:text-ink-dark">
            Lembrar dessa tarefa
            <input
              type="checkbox"
              checked={reminderEnabled}
              onChange={(e) => setReminderEnabled(e.target.checked)}
              className="h-5 w-5 accent-focus-500"
            />
          </label>
          {reminderEnabled && (
            <div className="mt-3 flex gap-2">
              {(["none", "daily", "weekly"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRepeat(r)}
                  className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
                    repeat === r
                      ? "bg-focus-500 text-white"
                      : "bg-surface text-ink-soft dark:bg-surface-dark dark:text-ink-darkSoft"
                  }`}
                >
                  {r === "none" ? "Uma vez" : r === "daily" ? "Diariamente" : "Semanalmente"}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" size="lg" disabled={saving || !title.trim()}>
          {initialTask ? "Salvar alterações" : "Adicionar tarefa"}
        </Button>
      </form>
    </Modal>
  );
}
