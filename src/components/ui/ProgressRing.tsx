"use client";

/**
 * Anel de progresso — elemento de assinatura visual do Mindo.
 * Usado tanto no resumo do dia (Início) quanto no timer de Foco,
 * para reforçar uma linguagem visual única e calma de "progresso".
 */
export function ProgressRing({
  progress, // 0 a 1
  size = 120,
  strokeWidth = 10,
  color = "#5B8DEF",
  trackClassName = "stroke-surfaceMuted dark:stroke-surfaceMuted-dark",
  children,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackClassName?: string;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(1, Math.max(0, progress));
  const offset = circumference * (1 - clamped);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className={trackClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}
