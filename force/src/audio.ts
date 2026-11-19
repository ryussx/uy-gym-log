// Beeps (WebAudio) and voice callouts: native TTS on Android (Capacitor), SpeechSynthesis in the browser.
import { Capacitor } from "@capacitor/core";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
const NATIVE = Capacitor.isNativePlatform();
let ctx: AudioContext | null = null;
function ac() { if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)(); return ctx; }

export function beep(freq = 880, ms = 120, vol = 0.25) {
  try {
    const c = ac(); const o = c.createOscillator(); const g = c.createGain();
    o.frequency.value = freq; o.type = "sine"; g.gain.value = vol;
    o.connect(g); g.connect(c.destination); o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + ms / 1000);
    o.stop(c.currentTime + ms / 1000);
  } catch { /* audio not available */ }
}

export const sounds = {
  go: () => beep(1200, 220, 0.3),
  rest: () => beep(500, 220, 0.25),
  tick: () => beep(900, 60, 0.15),
  done: () => { beep(1000, 120); setTimeout(() => beep(1300, 160), 140); setTimeout(() => beep(1600, 220), 320); },
  inZone: () => beep(1000, 50, 0.1),
  outZone: () => beep(300, 120, 0.2),
};

export class Voice {
  enabled = true;
  onSpeak: (text: string) => void = () => {};
  private lastSpoke = 0;
  private lastText = "";
  private keep: SpeechSynthesisUtterance[] = []; // Chrome drops utterances that get garbage-collected
  private voice: SpeechSynthesisVoice | null = null;
  constructor() {
    if ("speechSynthesis" in window) {
      const pick = () => { const vs = speechSynthesis.getVoices(); this.voice = vs.find((v) => /^en/i.test(v.lang) && /google|english/i.test(v.name)) ?? vs.find((v) => /^en/i.test(v.lang)) ?? null; };
      pick(); speechSynthesis.addEventListener?.("voiceschanged", pick);
    }
  }
  /** Warm up the engine from a user gesture so later callouts aren't blocked. */
  unlock() { this.reset(); }
  private busySince = 0;
  /** True while the engine reports speaking; auto-resets if it's been "speaking" > 4 s (Chrome wedge). */
  speaking() {
    if (NATIVE) return this.nativeBusy;
    try {
      const b = speechSynthesis.speaking || speechSynthesis.pending;
      if (!b) { this.busySince = 0; return false; }
      if (!this.busySince) this.busySince = Date.now();
      if (Date.now() - this.busySince > 4000) { this.reset(); return false; }
      return true;
    } catch { return false; }
  }
  /** Hard reset of the engine. */
  reset() { if (NATIVE) { TextToSpeech.stop().catch(() => {}); this.nativeBusy = false; return; } try { speechSynthesis.cancel(); speechSynthesis.resume(); } catch { /* ignore */ } this.busySince = 0; this.keep = []; this.lastText = ""; }
  /** Human-readable availability for the Settings test button. */
  async status(): Promise<string> {
    if (NATIVE) { try { const v = await TextToSpeech.getSupportedVoices(); return `${v.voices.length} native voices`; } catch { return "native TTS unavailable"; } }
    if (!("speechSynthesis" in window)) return "no speech engine in this browser — open in Chrome";
    const n = speechSynthesis.getVoices().length; return n ? `${n} voices` : "no voices installed";
  }
  private nativeBusy = false;
  rate = 1.2;
  pitch = 1;
  say(text: string, priority = false, allowRepeat = false) {
    if (!this.enabled) return;
    this.onSpeak(text);
    if (NATIVE) {
      if (this.nativeBusy && !priority) return;
      this.nativeBusy = true;
      const go = priority ? TextToSpeech.stop().catch(() => {}) : Promise.resolve();
      go.then(() => TextToSpeech.speak({ text, lang: "en-US", rate: this.rate, pitch: this.pitch, volume: 1, category: "ambient" }))
        .catch(() => {}).finally(() => { this.nativeBusy = false; });
      return;
    }
    if (!("speechSynthesis" in window)) return;
    const now = Date.now();
    if (!priority && !allowRepeat && (now - this.lastSpoke < 1800 || text === this.lastText)) return;
    try {
      if (priority) speechSynthesis.cancel();
      speechSynthesis.resume();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = this.rate; u.pitch = this.pitch; u.lang = "en-US"; if (this.voice) u.voice = this.voice;
      this.keep.push(u); if (this.keep.length > 8) this.keep.shift();
      u.onend = () => { const i = this.keep.indexOf(u); if (i >= 0) this.keep.splice(i, 1); };
      speechSynthesis.speak(u);
      this.lastSpoke = now; this.lastText = text;
    } catch { /* ignore */ }
  }
}

/** Spoken count: 1…59, then "1 minute", 1…59, "2 minutes", … */
export function spokenCount(sec: number): string {
  const m = Math.floor(sec / 60), s = sec % 60;
  if (s === 0 && m > 0) return m === 1 ? "1 minute" : `${m} minutes`;
  return String(s);
}
