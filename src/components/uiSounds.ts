// synthesized UI chimes — soft glassy arpeggios, no audio assets needed
let ctx: AudioContext | null = null;

function ensureContext(): AudioContext {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function playTone(c: AudioContext, freq: number, start: number, dur: number, peak: number) {
  const osc = c.createOscillator();
  const shimmer = c.createOscillator();
  const gain = c.createGain();

  osc.type = "sine";
  osc.frequency.value = freq;
  // faint detuned upper octave gives the glassy, iridescent quality
  shimmer.type = "sine";
  shimmer.frequency.value = freq * 2.003;

  const shimmerGain = c.createGain();
  shimmerGain.gain.value = 0.18;

  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(peak, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

  osc.connect(gain);
  shimmer.connect(shimmerGain).connect(gain);
  gain.connect(c.destination);

  osc.start(start);
  shimmer.start(start);
  osc.stop(start + dur + 0.05);
  shimmer.stop(start + dur + 0.05);
}

// C5 → G5 → C6, rising: "opening"
export function playCardOpen() {
  const c = ensureContext();
  const t = c.currentTime;
  [523.25, 783.99, 1046.5].forEach((freq, i) => {
    playTone(c, freq, t + i * 0.055, 0.5, 0.1);
  });
}

// C6 → G5 → C5, falling: "closing"
export function playCardClose() {
  const c = ensureContext();
  const t = c.currentTime;
  [1046.5, 783.99, 523.25].forEach((freq, i) => {
    playTone(c, freq, t + i * 0.05, 0.4, 0.075);
  });
}
