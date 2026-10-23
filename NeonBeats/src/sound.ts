import type { Preset } from "./state";

// Pentatonic synth scale notes (in Hz)
const SCALE = [
  261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0,
];

export class SoundEngine {
  muted = false;
  private ctx: AudioContext | null = null;

  init(): void {
    if (this.ctx) return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (AudioCtx) this.ctx = new AudioCtx();
  }

  playTone(
    freq: number,
    type: OscillatorType = "sine",
    duration = 0.4,
    delay = 0,
  ): void {
    if (this.muted) return;
    this.init();
    const ctx = this.ctx;
    if (!ctx) return;
    if (ctx.state === "suspended") void ctx.resume();

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  playNoteByIndex(idx: number, preset: Preset): void {
    const wave: OscillatorType =
      preset === "synthwave"
        ? "sawtooth"
        : preset === "ambient"
          ? "triangle"
          : "sine";
    this.playTone(SCALE[idx % SCALE.length], wave, 0.6);
  }

  playHitSound(): void {
    this.playTone(587.33, "sine", 0.15);
    this.playTone(880.0, "triangle", 0.2, 0.05);
  }

  playMissSound(): void {
    this.playTone(130.81, "sawtooth", 0.3);
  }
}

export const sound = new SoundEngine();
