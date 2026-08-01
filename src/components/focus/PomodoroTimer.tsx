"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Button } from "@/components/ui/Button";
import { playSound } from "@/lib/sound";
import { notify } from "@/lib/notifications";

const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;

type Mode = "focus" | "break";

interface PomodoroTimerProps {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  onSessionComplete: () => void;
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

/**
 * Timer Pomodoro: 25 min de foco + 5 min de descanso, alternando automaticamente.
 * Usa o mesmo anel de progresso da tela Início, para manter a identidade visual.
 */
export function PomodoroTimer({ soundEnabled, notificationsEnabled, onSessionComplete }: PomodoroTimerProps) {
  const [mode, setMode] = useState<Mode>("focus");
  const totalSeconds = (mode === "focus" ? FOCUS_MINUTES : BREAK_MINUTES) * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          handleCycleEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, mode]);

  function handleCycleEnd() {
    setRunning(false);
    if (soundEnabled) playSound("complete");
    if (notificationsEnabled) {
      notify(
        mode === "focus" ? "Sessão de foco concluída! 🎉" : "Descanso concluído.",
        { body: mode === "focus" ? "Hora de uma pausa de 5 minutos." : "Vamos para mais uma sessão de foco?" }
      );
    }

    if (mode === "focus") {
      onSessionComplete();
      setMode("break");
      setSecondsLeft(BREAK_MINUTES * 60);
    } else {
      setMode("focus");
      setSecondsLeft(FOCUS_MINUTES * 60);
    }
  }

  function reset() {
    setRunning(false);
    setMode("focus");
    setSecondsLeft(FOCUS_MINUTES * 60);
  }

  const progress = 1 - secondsLeft / totalSeconds;
  const ringColor = mode === "focus" ? "#5B8DEF" : "#3FB08E";

  return (
    <div className="flex flex-col items-center gap-6">
      <span className="rounded-full bg-surfaceMuted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink-soft dark:bg-surfaceMuted-dark dark:text-ink-darkSoft">
        {mode === "focus" ? "Tempo de foco" : "Tempo de descanso"}
      </span>

      <ProgressRing progress={progress} size={220} strokeWidth={14} color={ringColor}>
        <span className="font-display text-4xl font-bold text-ink dark:text-ink-dark">
          {formatTime(secondsLeft)}
        </span>
      </ProgressRing>

      <div className="flex items-center gap-3">
        <Button
          size="lg"
          onClick={() => setRunning((r) => !r)}
          className="w-40"
        >
          {running ? <Pause size={18} /> : <Play size={18} />}
          {running ? "Pausar" : "Iniciar"}
        </Button>
        <Button size="lg" variant="secondary" onClick={reset} aria-label="Reiniciar">
          <RotateCcw size={18} />
        </Button>
      </div>
    </div>
  );
}
