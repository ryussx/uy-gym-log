// Bridge to the host app (UY Gym Log). The host exposes window.GymLog; when it is
// absent (standalone dev server) everything falls back to Force Lab's own storage.
import { DEFAULT_EXERCISES, variationFor } from "./store";
import { repsFor, performedAt, displayName, type SetRecord } from "./metrics";
import { isoDate } from "./export";

export interface GymLogHost {
  exerciseNames(): string[];
  addExercise(name: string): boolean;        // true if added (false if it already existed)
  removeExercise(name: string): boolean;     // only custom exercises can be removed
  renameExercise(oldName: string, newName: string): boolean;
  upsertForceSet(s: HostSet): void;
  removeForceSet(id: string): void;
}
export interface HostSet { id: string; date: string; exercise: string; kg: number; reps: number; variation: string; note: string; at: number; dur: number }

export function host(): GymLogHost | null { return (window as any).GymLog ?? null; }

export function toHostSet(s: SetRecord): HostSet {
  return {
    id: `fl-${s.id}`, date: isoDate(performedAt(s)), exercise: displayName(s.exercise, s.side, s.contraction, s.handle, s.links), kg: s.peak, reps: repsFor(s),
    variation: variationFor(s.exercise),
    at: s.startedAt, dur: s.durationS,
    note: [s.mode, s.note].filter(Boolean).join(" · "),
  };
}

/** Make sure the self-resisted / isometric defaults exist in the host library. */
export function seedHostExercises() {
  const h = host(); if (!h) return;
  for (const e of DEFAULT_EXERCISES) h.addExercise(e);
}
