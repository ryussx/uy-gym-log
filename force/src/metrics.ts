// Set recording and ARX-style metrics.
import type { ForceSample } from "./scale";

export type Contraction = "complete" | "concentric" | "eccentric";
export const SIDE_LABEL: Record<string, string> = { both: "", left: "Left", right: "Right" };
export const CONTRACTION_LABEL: Record<string, string> = { complete: "", concentric: "Concentric", eccentric: "Eccentric" };
/** Display name with how it was performed, e.g. "SR Chest Press — Right, Eccentric". */
export function displayName(exercise: string, side: string, contraction?: string, handle?: string) {
  const parts = [handle?.trim() ?? "", SIDE_LABEL[side] ?? "", CONTRACTION_LABEL[contraction ?? "complete"] ?? ""].filter(Boolean);
  return parts.length ? `${exercise} — ${parts.join(", ")}` : exercise;
}
/** Key for maxes / comparisons. Complete contraction keeps the legacy "exercise|side" key. */
export function variantKey(exercise: string, side: string, contraction?: string, handle?: string) {
  const c = contraction ?? "complete", h = handle?.trim() ?? "";
  let k = c === "complete" && !h ? `${exercise}|${side}` : `${exercise}|${side}|${c}`;
  if (h) k += `|${h}`;
  return k;
}
export function sameVariant(s: SetRecord, exercise: string, side: string, contraction?: string, handle?: string) {
  return s.exercise === exercise && s.side === side && (s.contraction ?? "complete") === (contraction ?? "complete") && (s.handle ?? "") === (handle?.trim() ?? "");
}

export interface SetRecord {
  id: string;
  exercise: string;
  side: "both" | "left" | "right";
  contraction?: Contraction; // undefined = complete
  handle?: string; // bar, rings, straps… (empty = unspecified)
  mode: string; // free | hold | ramp | reps | maxtest | critical
  startedAt: number;
  durationS: number;
  samples: { t: number; kg: number }[]; // t = seconds from start
  peak: number;
  avg: number; // "intensity"
  output: number; // kg·s, force integrated over time
  inroad: number; // % drop from early peak to late peak
  reps?: RepInfo[]; // auto-detected, informational only
  manualReps?: number; // user-entered; undefined/blank means 1
  performedAt?: number; // ms epoch of the day the set counts for; defaults to startedAt
  note?: string;
}

/** Reps to record for logging: the user's number, else 1. Never the auto count. */
export function repsFor(s: SetRecord): number { return s.manualReps && s.manualReps > 0 ? Math.round(s.manualReps) : 1; }
/** Day the set counts for. */
export function performedAt(s: SetRecord): number { return s.performedAt ?? s.startedAt; }

export interface RepInfo {
  index: number;
  peak: number;
  peakT?: number; // seconds, when the peak happened
  startS: number;
  endS: number;
  durationS: number;
}

const ACTIVE_KG = 2; // below this we consider the athlete "resting"

export class SetRecorder {
  private samples: { t: number; kg: number }[] = [];
  private t0 = 0;
  recording = false;

  start() {
    this.samples = [];
    this.t0 = Date.now();
    this.recording = true;
  }

  push(s: ForceSample) {
    if (!this.recording) return;
    this.samples.push({ t: (s.t - this.t0) / 1000, kg: s.kg });
  }

  peakSoFar(): number { let m = 0; for (const p of this.samples) if (p.kg > m) m = p.kg; return m; }

  elapsed(): number {
    return this.recording ? (Date.now() - this.t0) / 1000 : 0;
  }

  current(): { t: number; kg: number }[] {
    return this.samples;
  }

  finish(meta: { exercise: string; side: SetRecord["side"]; mode: string; contraction?: Contraction; handle?: string }): SetRecord | null {
    this.recording = false;
    const s = this.samples;
    if (s.length < 3) return null;
    const m = computeMetrics(s);
    return {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      exercise: meta.exercise,
      side: meta.side,
      contraction: meta.contraction ?? "complete",
      handle: meta.handle?.trim() || undefined,
      mode: meta.mode,
      startedAt: this.t0,
      durationS: s[s.length - 1].t,
      samples: s,
      ...m,
      reps: detectReps(s),
    };
  }
}

export function computeMetrics(s: { t: number; kg: number }[]) {
  let peak = 0, sum = 0, output = 0;
  for (let i = 0; i < s.length; i++) {
    const kg = Math.max(0, s[i].kg);
    peak = Math.max(peak, kg);
    sum += kg;
    if (i > 0) output += kg * (s[i].t - s[i - 1].t);
  }
  const avg = sum / s.length;
  // inroad: compare best force in the first active 20% vs the last active 20%
  const active = s.filter((p) => p.kg > ACTIVE_KG);
  let inroad = 0;
  if (active.length >= 10) {
    const n = Math.max(3, Math.floor(active.length * 0.2));
    const early = Math.max(...active.slice(0, n).map((p) => p.kg));
    const late = Math.max(...active.slice(-n).map((p) => p.kg));
    inroad = early > 0 ? Math.max(0, ((early - late) / early) * 100) : 0;
  }
  return { peak: r2(peak), avg: r2(avg), output: r2(output), inroad: r2(inroad) };
}

/** Split a set into reps by finding stretches where force rises above a threshold. */
export function detectReps(s: { t: number; kg: number }[]): RepInfo[] {
  if (s.length < 5) return [];
  const peakAll = Math.max(...s.map((p) => p.kg));
  if (peakAll < ACTIVE_KG * 2) return [];
  const on = Math.max(ACTIVE_KG, peakAll * 0.35);
  const off = Math.max(ACTIVE_KG * 0.5, peakAll * 0.2);
  const reps: RepInfo[] = [];
  let inRep = false, start = 0, peak = 0, peakT = 0;
  for (const p of s) {
    if (!inRep && p.kg >= on) { inRep = true; start = p.t; peak = p.kg; peakT = p.t; }
    else if (inRep) {
      if (p.kg > peak) { peak = p.kg; peakT = p.t; }
      if (p.kg <= off) {
        if (p.t - start >= 0.6) reps.push({ index: reps.length + 1, peak: r2(peak), peakT: r2(peakT), startS: r2(start), endS: r2(p.t), durationS: r2(p.t - start) });
        inRep = false;
      }
    }
  }
  if (inRep) {
    const end = s[s.length - 1].t;
    if (end - start >= 0.6) reps.push({ index: reps.length + 1, peak: r2(peak), peakT: r2(peakT), startS: r2(start), endS: r2(end), durationS: r2(end - start) });
  }
  // A single long hold is not "reps"
  return reps.length >= 2 ? reps : [];
}

/** Critical force: mean of the last third of a repeater test's per-rep peaks (plateau). */
export function criticalForce(reps: RepInfo[]): number | null {
  if (reps.length < 6) return null;
  const tail = reps.slice(-Math.max(3, Math.floor(reps.length / 3)));
  return r2(tail.reduce((a, r) => a + r.peak, 0) / tail.length);
}

export function r2(n: number) { return Math.round(n * 100) / 100; }
