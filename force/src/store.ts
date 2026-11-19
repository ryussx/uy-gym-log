// Persistence: Capacitor Preferences on device, localStorage in the browser.
import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";
import type { SetRecord } from "./metrics";

const KEY_SETS = "ufl.sets.v1";
const KEY_MAX = "ufl.max.v1";
const KEY_EX = "ufl.exercises.v1";

export const DEFAULT_EXERCISES = [
  // Isometric
  "Isometric Row",
  "Isometric Deadlift Pull",
  "Isometric Curl",
  "Isometric Chest Press (strap)",
  "Isometric Overhead Press (strap)",
  "Isometric Squat (strap)",
  // Self-resisted (isokinetic)
  "SR Row",
  "SR One-Arm Row",
  "SR Rotating Pull-up / Chin-up",
  "SR One-Arm Lat Pulldown",
  "SR Military Press",
  "SR Chest Press",
  "SR One-Arm Chest Press",
  "SR Curl / Pushdown",
];

/** Gym Log variation for an exercise name. */
export function variationFor(name: string): "iso" | "self-resisted" {
  return /^SR\b|self.?resisted/i.test(name) ? "self-resisted" : "iso";
}

async function get<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = Capacitor.isNativePlatform()
      ? (await Preferences.get({ key })).value
      : localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

async function set(key: string, value: unknown) {
  const raw = JSON.stringify(value);
  if (Capacitor.isNativePlatform()) await Preferences.set({ key, value: raw });
  else localStorage.setItem(key, raw);
}

export type MaxMap = Record<string, { kg: number; at: number }>; // key = exercise|side

export const store = {
  async sets(): Promise<SetRecord[]> { return get<SetRecord[]>(KEY_SETS, []); },
  async saveSet(rec: SetRecord) {
    const all = await this.sets();
    all.push(rec);
    // keep the file bounded: last 500 sets
    await set(KEY_SETS, all.slice(-500));
  },
  async updateSet(rec: SetRecord) {
    const all = await this.sets();
    const i = all.findIndex((s) => s.id === rec.id);
    if (i >= 0) all[i] = rec; else all.push(rec);
    await set(KEY_SETS, all);
  },
  async deleteSet(id: string) {
    const all = await this.sets();
    await set(KEY_SETS, all.filter((s) => s.id !== id));
  },
  async maxes(): Promise<MaxMap> { return get<MaxMap>(KEY_MAX, {}); },
  async setMax(exercise: string, side: string, kg: number) {
    const m = await this.maxes();
    m[`${exercise}|${side}`] = { kg, at: Date.now() };
    await set(KEY_MAX, m);
  },
  async deleteMax(key: string) {
    const m = await this.maxes();
    delete m[key];
    await set(KEY_MAX, m);
  },
  async exercises(): Promise<string[]> { return get<string[]>(KEY_EX, DEFAULT_EXERCISES); },
  async saveExercises(list: string[]) { await set(KEY_EX, list); },
};
