"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

/**
 * Modal simples, centrado, com fechamento por Esc, clique fora, ou botão X.
 * Em telas pequenas ocupa a parte inferior (estilo "bottom sheet"), o que
 * reduz o movimento do polegar em uso com uma mão só.
 */
export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center animate-fade-in"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={cn(
          "w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-surface dark:bg-surface-dark",
          "max-h-[85vh] overflow-y-auto p-6 shadow-softLg animate-pop"
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-full p-1.5 text-ink-soft hover:bg-surfaceMuted dark:text-ink-darkSoft dark:hover:bg-surfaceMuted-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-500"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
