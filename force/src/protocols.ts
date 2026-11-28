// Training protocols: phase sequences the app walks through with beeps and voice.
export interface Phase {
  name: string; // "Get ready", "PUSH", "Hold", "Rest", ...
  seconds: number;
  cue: "rest" | "work" | "ramp";
}

export interface Protocol {
  id: string;
  label: string;
  describe: string;
  phases: Phase[];
  repeat?: number; // repeat the work/rest block n times
}

export function buildProtocol(id: string, p: Record<string, number> = {}): Protocol {
  const hold = p.hold ?? 10, rest = p.rest ?? 20, reps = p.reps ?? 6, ramp = p.ramp ?? 5, total = p.total ?? 60;
  switch (id) {
    case "free":
      return { id, label: "Free set", describe: "Open-ended. Start, work, stop.", phases: [] };
    case "offset":
      return { id, label: "Offset capture", describe: `Hang from the scale and stay still. When the raw reading holds steady for ${p.steady ?? 5} s, that value is proposed as the offset (e.g. your body weight) — you confirm, nothing is logged.`, phases: [] };
    case "countdown":
      return {
        id, label: `Countdown ${total}s`, describe: "One continuous max effort for the whole timer — the ARX protocol.",
        phases: [{ name: "Get ready", seconds: 3, cue: "rest" }, { name: "GO — max effort", seconds: total, cue: "work" }],
      };
    case "ramp":
      return {
        id, label: `Ramp ${ramp}s + hold ${hold}s`, describe: "Build to max over the ramp, then hold it. Joint-friendly way to reach peak force.",
        phases: [
          { name: "Get ready", seconds: 3, cue: "rest" },
          { name: "Build up", seconds: ramp, cue: "ramp" },
          { name: "HOLD", seconds: hold, cue: "work" },
          { name: "Release", seconds: 3, cue: "rest" },
        ],
      };
    case "repeaters":
      return {
        id, label: `Repeaters ${reps}×(${hold}s on/${rest}s off)`, describe: "Repeated holds. Per-rep peaks give the fatigue curve; long sets give critical force.",
        phases: [{ name: "Get ready", seconds: 3, cue: "rest" }, { name: "PULL", seconds: hold, cue: "work" }, { name: "Rest", seconds: rest, cue: "rest" }],
        repeat: reps,
      };
    case "maxtest":
      return {
        id, label: "Max test (3 efforts)", describe: "Three 5-second max efforts with 60s rest. Best one becomes your max.",
        phases: [{ name: "Get ready", seconds: 5, cue: "rest" }, { name: "MAX EFFORT", seconds: 5, cue: "work" }, { name: "Rest", seconds: 60, cue: "rest" }],
        repeat: 3,
      };
    case "critical":
      return {
        id, label: "Critical force (7s/3s ×24)", describe: "7s on, 3s off, 24 reps. The plateau at the end is the force you can sustain.",
        phases: [{ name: "Get ready", seconds: 3, cue: "rest" }, { name: "PULL", seconds: 7, cue: "work" }, { name: "Off", seconds: 3, cue: "rest" }],
        repeat: 24,
      };
    default:
      return buildProtocol("free");
  }
}

/** Flatten a protocol into a timeline of phases. */
export function expand(p: Protocol): Phase[] {
  if (!p.repeat || p.phases.length < 2) return p.phases;
  const [ready, ...block] = p.phases;
  const out: Phase[] = [ready];
  for (let i = 0; i < p.repeat; i++) {
    for (const ph of block) {
      // drop the trailing rest after the final rep
      if (i === p.repeat - 1 && ph === block[block.length - 1] && ph.cue === "rest") continue;
      out.push({ ...ph, name: block.length > 1 && ph.cue !== "rest" ? `${ph.name} ${i + 1}/${p.repeat}` : ph.name });
    }
  }
  return out;
}

export class ProtocolRunner {
  private timeline: Phase[] = [];
  private idx = -1;
  private phaseStart = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  running = false;
  onPhase: (ph: Phase, idx: number, total: number) => void = () => {};
  onTick: (remaining: number, ph: Phase) => void = () => {};
  onDone: () => void = () => {};

  start(p: Protocol) {
    this.timeline = expand(p);
    this.idx = -1;
    this.running = true;
    this.next();
    this.timer = setInterval(() => this.tick(), 100);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.running = false;
  }

  current(): Phase | null { return this.timeline[this.idx] ?? null; }

  private next() {
    this.idx++;
    if (this.idx >= this.timeline.length) { this.stop(); this.onDone(); return; }
    this.phaseStart = Date.now();
    this.onPhase(this.timeline[this.idx], this.idx, this.timeline.length);
  }

  private tick() {
    const ph = this.timeline[this.idx];
    if (!ph) return;
    const remaining = ph.seconds - (Date.now() - this.phaseStart) / 1000;
    if (remaining <= 0) this.next();
    else this.onTick(remaining, ph);
  }
}
