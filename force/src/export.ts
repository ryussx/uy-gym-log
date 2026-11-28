// Export sets as JSON or CSV. On Android: write to cache + share sheet (same pattern as UY Gym Log).
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { repsFor, performedAt, type SetRecord } from "./metrics";
import { variationFor } from "./store";

export function toCSV(sets: SetRecord[]): string {
  const head = ["id", "date_performed", "recorded_at", "exercise", "side", "contraction", "handle", "links", "external_kg", "offset_kg", "lowest_kg", "mode", "duration_s", "peak_kg", "avg_kg", "output_kgs", "inroad_pct", "reps", "auto_reps", "rep_peaks"];
  const rows = sets.map((s) => [
    s.id, isoDate(performedAt(s)), new Date(s.startedAt).toISOString(), q(s.exercise), s.side, s.contraction ?? "complete", q(s.handle ?? ""), s.links ?? 0, s.extKg ?? 0, s.offsetKg ?? 0, s.low ?? 0, s.mode, s.durationS.toFixed(1),
    s.peak, s.avg, s.output, s.inroad, repsFor(s), s.reps?.length ?? 0, q((s.reps ?? []).map((r) => r.peak).join(" ")),
  ].join(","));
  return [head.join(","), ...rows].join("\n");
}

export function samplesCSV(s: SetRecord): string {
  return ["t_s,kg", ...s.samples.map((p) => `${p.t.toFixed(2)},${p.kg.toFixed(2)}`)].join("\n");
}

function q(v: string) { return `"${v.replace(/"/g, '""')}"`; }

export async function exportText(filename: string, text: string, mime: string) {
  if (Capacitor.isNativePlatform()) {
    const res = await Filesystem.writeFile({ path: filename, data: text, directory: Directory.Cache, encoding: Encoding.UTF8 });
    await Share.share({ title: filename, files: [res.uri] });
    return;
  }
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 500);
}

// ---------- UY Gym Log bridge ----------
// Produces a Gym Log merge file: { forceLab: true, sessions: [...] } where each session is in
// Gym Log's own shape { id, name, date, exercises:[{ id, name, sets:[{ id, kg, reps, variation, note }], note }], note }.
// Gym Log's "all-time / last kg" stats read set.kg, so peak force shows up as the exercise max there.
function uid() { return Math.random().toString(36).slice(2, 10); }
export function isoDate(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function toGymLogSessions(sets: SetRecord[]) {
  const byDay = new Map<string, SetRecord[]>();
  for (const s of sets) {
    const k = isoDate(performedAt(s));
    (byDay.get(k) ?? byDay.set(k, []).get(k)!).push(s);
  }
  const sessions = [];
  for (const [date, daySets] of byDay) {
    const exMap = new Map<string, SetRecord[]>();
    for (const s of daySets) {
      const name = s.side === "both" ? s.exercise : `${s.exercise} (${s.side[0].toUpperCase()})`;
      (exMap.get(name) ?? exMap.set(name, []).get(name)!).push(s);
    }
    sessions.push({
      id: `fl-${date}`,
      name: "Force Lab",
      date,
      source: "force-lab",
      exercises: [...exMap].map(([name, list]) => ({
        id: uid(),
        name,
        track: "reps",
        sets: list.map((s) => ({
          id: `fl-${s.id}`,
          weight: "",
          kg: String(s.peak),
          reps: String(repsFor(s)),
          variation: variationFor(s.exercise),
          note: `${s.mode} · ${s.durationS.toFixed(0)}s · avg ${s.avg} · output ${s.output} · inroad ${s.inroad.toFixed(0)}%` + (s.note ? ` · ${s.note}` : ""),
        })),
        note: "",
      })),
      note: "Imported from UY Force Lab",
    });
  }
  return { forceLab: true, version: 1, exportedAt: Date.now(), sessions };
}
