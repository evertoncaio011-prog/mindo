// Sons curtos gerados via Web Audio API — sem precisar de arquivos de áudio externos.
// Isso mantém o app leve e evita depender de assets binários no repositório.

type SoundKind = "complete" | "tick" | "notify";

function playTone(frequency: number, durationMs: number, volume = 0.15) {
  if (typeof window === "undefined") return;
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return;

  const ctx = new AudioCtx();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.value = volume;

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);
  oscillator.stop(ctx.currentTime + durationMs / 1000);

  oscillator.onended = () => ctx.close();
}

export function playSound(kind: SoundKind) {
  switch (kind) {
    case "complete":
      playTone(660, 180);
      setTimeout(() => playTone(880, 220), 140);
      break;
    case "notify":
      playTone(520, 200);
      break;
    case "tick":
      playTone(440, 80, 0.08);
      break;
  }
}
