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
  async setMax(key: string, kg: number) {
    const m = await this.maxes();
    m[key] = { kg, at: Date.now() };
    await set(KEY_MAX, m);
  },
  async deleteMax(key: string) {
    const m = await this.maxes();
    delete m[key];
    await set(KEY_MAX, m);
  },
  async exercises(): Promise<string[]> { return get<string[]>(KEY_EX, DEFAULT_EXERCISES); },
  /** Rename an exercise in every stored set and max (and the local list). */
  async renameExercise(oldName: string, newName: string) {
    const all = await this.sets();
    for (const r of all) if (r.exercise === oldName) r.exercise = newName;
    await set(KEY_SETS, all);
    const m = await this.maxes(); const out: MaxMap = {};
    for (const [k, v] of Object.entries(m)) { const [ex, ...rest] = k.split("|"); const nk = [ex === oldName ? newName : ex, ...rest].join("|"); if (!out[nk] || out[nk].kg < v.kg) out[nk] = v; }
    await set(KEY_MAX, out);
    const list = await this.exercises();
    if (list.includes(oldName)) { const nl = list.map((e) => (e === oldName ? newName : e)); await set(KEY_EX, [...new Set(nl)]); }
  },
  async saveExercises(list: string[]) { await set(KEY_EX, list); },
};
