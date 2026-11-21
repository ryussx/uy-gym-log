import "./style.css";
import { BleScale, SimScale, type ForceSource, type ScaleStatus } from "./scale";
import { SetRecorder, computeMetrics, criticalForce, detectReps, repsFor, performedAt, type SetRecord } from "./metrics";
import { ForceChart } from "./chart";
import { buildProtocol, expand, ProtocolRunner, type Phase } from "./protocols";
import { sounds, Voice, spokenCount } from "./audio";
import { Capacitor } from "@capacitor/core";
import { KeepAwake } from "@capacitor-community/keep-awake";
import { store } from "./store";
import { exportText, toCSV, samplesCSV, isoDate } from "./export";
import { CamPreview } from "./camera";
import { host, toHostSet, seedHostExercises } from "./bridge";
import { attachPicker } from "./picker";

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

// ---------- state ----------
let source: ForceSource | null = null;
let sim: SimScale | null = null;
let liveKg = 0;
let exercises: string[] = [];
let sets: SetRecord[] = [];
let lastSetForExercise: SetRecord | null = null;
let bestOutputForExercise = 0;
let currentMax = 0;
let zoneState: "in" | "out" | null = null;
let beepOn = true;
let ghostOn = localStorage.getItem("ufl.ghostOn") !== "0";
let cam: CamPreview | null = null;
const pref = (k: string, d: string) => localStorage.getItem(k) ?? d;
let calloutEvery = Math.max(1, Number(pref("ufl.calloutEvery", "5")));
let calloutOn = pref("ufl.calloutOn", "1") === "1";
let secBeep = pref("ufl.secBeep", "0") === "1";
let secCount = pref("ufl.secCount", "0") === "1";
let secTimer: ReturnType<typeof setInterval> | null = null;
let lastSec = -1;
const voice = new Voice();
const recorder = new SetRecorder();
const runner = new ProtocolRunner();
const chart = new ForceChart($<HTMLCanvasElement>("chart"));
const progressChart = $<HTMLCanvasElement>("progressChart");

// protocol params per protocol id
const PARAMS: Record<string, { key: string; label: string; def: number }[]> = {
  countdown: [{ key: "total", label: "seconds", def: 60 }],
  ramp: [{ key: "ramp", label: "ramp s", def: 5 }, { key: "hold", label: "hold s", def: 10 }],
  repeaters: [{ key: "reps", label: "reps", def: 6 }, { key: "hold", label: "on s", def: 10 }, { key: "rest", label: "off s", def: 20 }],
};

// ---------- init ----------
async function init() {
  seedHostExercises();
  exercises = host()?.exerciseNames() ?? (await store.exercises());
  sets = await store.sets();
  fillExerciseSelects();
  renderParams();
  await refreshExerciseContext();
  renderHistory();
  renderSettings();
  bindUI();
  drawLoop();
  voice.enabled = $<HTMLInputElement>("voiceOn").checked;
}

/** Exercises used in Force Lab (sets or maxes), most recently used first. */
function recentForceExercises(): string[] {
  const last = new Map<string, number>();
  for (const st of sets) last.set(st.exercise, Math.max(last.get(st.exercise) ?? 0, st.startedAt));
  for (const k of Object.keys(maxesCache)) { const ex = k.split("|")[0]; if (!last.has(ex)) last.set(ex, 0); }
  return [...last.entries()].filter(([e]) => exercises.includes(e)).sort((a, b) => b[1] - a[1]).map(([e]) => e);
}
let maxesCache: Record<string, unknown> = {};

async function createExercise(n: string): Promise<boolean> {
  n = n.trim(); if (!n) return false;
  if (!exercises.includes(n)) { const h = host(); if (h) { h.addExercise(n); exercises = h.exerciseNames(); } else { exercises.push(n); await store.saveExercises(exercises); } }
  fillExerciseSelects(); renderSettings();
  return true;
}

function fillExerciseSelects() {
  for (const id of ["exercise", "maxExercise"]) {
    const sel = $<HTMLSelectElement>(id);
    const cur = sel.value;
    sel.innerHTML = exercises.map((e) => `<option>${esc(e)}</option>`).join("");
    if (cur && exercises.includes(cur)) sel.value = cur;
  }
  const h = $<HTMLSelectElement>("histExercise");
  const cur = h.value;
  h.innerHTML = `<option value="">All</option>` + exercises.map((e) => `<option>${esc(e)}</option>`).join("");
  h.value = cur;
}

function renderParams() {
  const pid = $<HTMLSelectElement>("protocol").value;
  const box = $("params");
  box.innerHTML = (PARAMS[pid] ?? []).map((p) => `<label>${p.label}<input type="number" data-k="${p.key}" value="${p.def}" min="1" /></label>`).join("");
  $("protocolHelp").textContent = buildProtocol(pid, readParams()).describe;
}

function readParams(): Record<string, number> {
  const out: Record<string, number> = {};
  $("params").querySelectorAll<HTMLInputElement>("input").forEach((i) => (out[i.dataset.k!] = Number(i.value) || 1));
  return out;
}

async function refreshExerciseContext() {
  const ex = $<HTMLSelectElement>("exercise").value;
  const side = $<HTMLSelectElement>("side").value;
  const mine = sets.filter((s) => s.exercise === ex && s.side === side);
  lastSetForExercise = mine.length ? mine[mine.length - 1] : null;
  bestOutputForExercise = mine.reduce((m, s) => Math.max(m, s.output), 0);
  const maxes = await store.maxes(); maxesCache = maxes;
  currentMax = maxes[`${ex}|${side}`]?.kg ?? 0;
  $("zoneMax").textContent = currentMax ? `(max ${currentMax} kg → ${zoneKg().lo.toFixed(1)}–${zoneKg().hi.toFixed(1)} kg)` : "(no max yet — run a Max test)";
  $("sGoal").textContent = bestOutputForExercise ? fmt(bestOutputForExercise) : "–";
  chart.opts.ghost = ghostOn ? (lastSetForExercise?.samples ?? null) : null;
  chart.opts.zone = zoneActive() ? zoneKg() : null;
  if (!recorder.recording) { chart.opts.marks = []; }
}

function zoneActive() { return $<HTMLInputElement>("zoneOn").checked && currentMax > 0; }
function zoneKg() {
  const lo = (Number($<HTMLInputElement>("zoneLo").value) / 100) * currentMax;
  const hi = (Number($<HTMLInputElement>("zoneHi").value) / 100) * currentMax;
  return { lo: Math.min(lo, hi), hi: Math.max(lo, hi) };
}

// ---------- scale connection ----------
async function connect(src: ForceSource) {
  if (source) await source.stop();
  source = src;
  src.onStatus(setStatus);
  src.onSample((s) => {
    liveKg = s.kg;
    if (curStatus === "live") $("statusKg").textContent = `· ${s.kg.toFixed(1)} kg`;
    recorder.push(s);
    zoneFeedback(s.kg);
  });
  try {
    await src.start();
    $<HTMLButtonElement>("btnTare").disabled = false;
    $<HTMLButtonElement>("btnStart").disabled = false;
  } catch (e) {
    setStatus("error");
    $("statusText").textContent = (e as Error).message;
    alert("Connect failed: " + (e as Error).message);
  }
}

let curStatus: ScaleStatus = "idle";
function keepAwakeEnabled() { return localStorage.getItem("ufl.keepAwake") !== "0"; }
function applyKeepAwake() {
  if (!Capacitor.isNativePlatform()) return;
  const on = keepAwakeEnabled() && (curStatus === "live" || curStatus === "scanning" || curStatus === "lost");
  (on ? KeepAwake.keepAwake() : KeepAwake.allowSleep()).catch(() => {});
}
function setStatus(s: ScaleStatus) {
  curStatus = s;
  applyKeepAwake();
  $("statusDot").className = `dot ${s}`;
  $("statusPill").className = `pill ${s}`;
  const labels: Record<ScaleStatus, string> = {
    idle: "Not connected",
    scanning: "Listening for scale… turn it on / pull the hook",
    live: `${source?.name ?? "Scale"} connected ✓`,
    lost: "Signal lost — reconnecting…",
    error: "Error",
  };
  $("statusText").textContent = labels[s];
  if (s !== "live") $("statusKg").textContent = "";
  const btn = $<HTMLButtonElement>("btnConnect");
  btn.textContent = s === "live" || s === "scanning" ? "Disconnect" : "Connect scale";
}


// ---------- auto-connect ----------
// On the phone the app listens for the scale by itself (Settings → "Auto-connect");
// the Connect button is only needed to restart after an error or a Disconnect.
function autoConnectEnabled() { return localStorage.getItem("ufl.autoConnect") !== "0"; }
let autoTried = false;
let manualOff = false; // user pressed Disconnect: stay off until they press Connect again
function autoConnect() {
  if (!autoConnectEnabled() || !Capacitor.isNativePlatform()) return;
  if (source instanceof BleScale || sim) return;
  if (manualOff) return;
  if (autoTried && curStatus === "error") return; // don't loop on a hard error (permission denied, BT off)
  autoTried = true;
  const b = new BleScale();
  b.onSeen = () => renderSeen(b);
  $("simPanel").classList.add("hidden");
  connect(b);
}

// ---------- zone feedback ----------
let lastZoneBeep = 0;
function zoneFeedback(kg: number) {
  if (!recorder.recording || !zoneActive()) { zoneState = null; return; }
  const ph = runner.running ? runner.current() : null;
  if (ph && ph.cue === "rest") { zoneState = null; return; }
  const z = zoneKg();
  const inZone = kg >= z.lo && kg <= z.hi;
  const banner = $("phaseBanner");
  if (inZone && zoneState !== "in") { zoneState = "in"; banner.classList.add("inzone"); banner.classList.remove("outzone"); voice.say("in zone"); }
  if (!inZone && zoneState !== "out") {
    zoneState = "out"; banner.classList.add("outzone"); banner.classList.remove("inzone");
    if (kg > 2) voice.say(kg < z.lo ? "more" : "ease off");
    if (beepOn && kg > 2 && Date.now() - lastZoneBeep > 1500) { sounds.outZone(); lastZoneBeep = Date.now(); }
  }
}

// ---------- set control ----------
function startSet() {
  const pid = $<HTMLSelectElement>("protocol").value;
  const proto = buildProtocol(pid, readParams());
  $("summary").classList.add("hidden");
  recorder.start();
  voice.unlock();
  startCallouts();
  chart.opts.marks = [];
  const totalS = proto.phases.length ? expand(proto).reduce((a, p) => a + p.seconds, 0) : 60;
  chart.opts.windowS = Math.max(10, Math.ceil(totalS / 10) * 10);
  $("btnStart").classList.add("hidden");
  $("btnStop").classList.remove("hidden");
  lockInputs(true);
  if (proto.phases.length) {
    runner.onPhase = onPhase;
    runner.onTick = onTick;
    runner.onDone = () => stopSet();
    runner.start(proto);
  } else {
    setBanner("work", "Free set — go", "");
    voice.say("Go", true);
    if (beepOn) sounds.go();
  }
}

function onPhase(ph: Phase, idx: number, total: number) {
  setBanner(ph.cue, ph.name, ph.seconds.toFixed(0));
  if (ph.cue === "work") { if (beepOn) sounds.go(); voice.say(ph.name.replace(/\d+\/\d+/, ""), true); chart.opts.marks!.push(recorder.elapsed()); }
  else if (ph.cue === "ramp") { if (beepOn) sounds.go(); voice.say("Build up", true); }
  else { if (idx > 0 && beepOn) sounds.rest(); if (idx > 0) voice.say(idx === total - 1 ? "Done" : "Rest", true); }
}

let lastTickSec = -1;
function onTick(remaining: number, ph: Phase) {
  $("phaseTime").textContent = remaining.toFixed(remaining < 10 ? 1 : 0);
  const sec = Math.ceil(remaining);
  if (sec !== lastTickSec) {
    lastTickSec = sec;
    if (sec <= 3 && sec > 0 && beepOn) sounds.tick();
  }
}

async function stopSet() {
  runner.stop();
  stopCallouts();
  const ex = $<HTMLSelectElement>("exercise").value;
  const side = $<HTMLSelectElement>("side").value as SetRecord["side"];
  const mode = $<HTMLSelectElement>("protocol").value;
  const rec = recorder.finish({ exercise: ex, side, mode });
  $("btnStop").classList.add("hidden");
  $("btnStart").classList.remove("hidden");
  lockInputs(false);
  setBanner("idle", "Done", "—");
  if (beepOn) sounds.done();
  if (!rec) return;
  // Max test: record the best 5-second effort as the new max
  if (mode === "maxtest" && rec.peak > 0) {
    await store.setMax(ex, side, rec.peak);
    voice.say(`New max ${rec.peak.toFixed(0)} kilos`, true);
  }
  await store.saveSet(rec);
  sets.push(rec);
  host()?.upsertForceSet(toHostSet(rec));
  await showSummary(rec);
  await refreshExerciseContext();
  renderHistory();
  renderSettings();
}

// One timer handles everything that happens "every second" during work:
// per-second beep, spoken count, and the force callout every N seconds.
function startCallouts() {
  stopCallouts();
  lastSec = -1;
  secTimer = setInterval(() => {
    if (!recorder.recording) return;
    const sec = Math.floor(recorder.elapsed());
    if (sec === lastSec || sec === 0) return;
    lastSec = sec;
    const ph = runner.running ? runner.current() : null;
    if (ph && ph.cue !== "work") return; // rest/ramp phases stay quiet; free sets count from the start
    const forceDue = calloutOn && !zoneActive() && sec % calloutEvery === 0;
    if (secBeep && beepOn) sounds.tick();
    else if (forceDue && beepOn) sounds.tick();
    const parts: string[] = [];
    if (secCount) parts.push(spokenCount(sec));
    if (forceDue) parts.push(liveKg.toFixed(0));
    if (!parts.length) return;
    // don't pile up: a plain count waits if the engine is still talking; a force callout interrupts
    if (!forceDue && voice.speaking()) return;
    voice.say(parts.join(", "), forceDue, true);
  }, 100);
}
function stopCallouts() { if (secTimer) clearInterval(secTimer); secTimer = null; }

function lockInputs(lock: boolean) {
  for (const id of ["exercise", "side", "protocol"]) ($(id) as HTMLSelectElement).disabled = lock;
}

function setBanner(cue: string, name: string, time: string) {
  const b = $("phaseBanner");
  b.className = `banner ${cue}`;
  $("phaseName").textContent = name;
  $("phaseTime").textContent = time;
}

// ---------- summary ----------
async function showSummary(rec: SetRecord) {
  const prev = lastSetForExercise;
  const maxes = await store.maxes();
  const other = rec.side === "left" ? "right" : rec.side === "right" ? "left" : null;
  const lines: string[] = [];
  lines.push(line("Duration", `${rec.durationS.toFixed(1)} s`));
  lines.push(line("Peak force", `${fmt(rec.peak)} kg`, delta(rec.peak, prev?.peak)));
  lines.push(line("Intensity (avg)", `${fmt(rec.avg)} kg`, delta(rec.avg, prev?.avg)));
  lines.push(line("Output (kg·s)", fmt(rec.output), delta(rec.output, prev?.output)));
  lines.push(line("Inroad", `${rec.inroad.toFixed(0)}%`, rec.inroad >= 30 ? `<span class="badge good">deep fatigue</span>` : rec.inroad >= 15 ? `<span class="badge">moderate</span>` : `<span class="badge warn">shallow — stopped early?</span>`));
  if (bestOutputForExercise) lines.push(line("vs. best output", `${((rec.output / bestOutputForExercise) * 100).toFixed(0)}%`, rec.output > bestOutputForExercise ? `<span class="badge good">new best</span>` : ""));
  if (currentMax) lines.push(line("Peak as % of max", `${((rec.peak / currentMax) * 100).toFixed(0)}%`));
  let reps = "";
  if (rec.reps && rec.reps.length) {
    const top = Math.max(...rec.reps.map((r) => r.peak));
    reps = `<div class="muted" style="margin-top:8px">Reps: ${rec.reps.length} · first ${fmt(rec.reps[0].peak)} → last ${fmt(rec.reps[rec.reps.length - 1].peak)} kg · avg rep ${(rec.reps.reduce((a, r) => a + r.durationS, 0) / rec.reps.length).toFixed(1)} s</div>
      <div class="repbars">${rec.reps.map((r) => `<div style="height:${Math.max(4, (r.peak / top) * 100)}%"><span>${r.peak.toFixed(0)}</span></div>`).join("")}</div>`;
    const cf = rec.mode === "critical" ? criticalForce(rec.reps) : null;
    if (cf) reps += line("Critical force", `${fmt(cf)} kg${currentMax ? ` (${((cf / currentMax) * 100).toFixed(0)}% of max)` : ""}`);
  }
  let lr = "";
  if (other) {
    const a = maxes[`${rec.exercise}|${rec.side}`]?.kg, b = maxes[`${rec.exercise}|${other}`]?.kg;
    if (a && b) {
      const gap = ((Math.abs(a - b) / Math.max(a, b)) * 100).toFixed(0);
      lr = line("Left/right gap", `${gap}% (L ${fmt(rec.side === "left" ? a : b)} / R ${fmt(rec.side === "left" ? b : a)})`, Number(gap) > 10 ? `<span class="badge warn">asymmetry</span>` : `<span class="badge good">balanced</span>`);
    }
  }
  const box = $("summary");
  box.innerHTML = `<h4>${esc(rec.exercise)} · ${rec.side} · ${rec.mode}</h4>${lines.join("")}${lr}${reps}
    ${setEditorHtml(rec, "sum")}`;
  box.classList.remove("hidden");
  bindSetEditor(rec, "sum", async () => { await refreshExerciseContext(); renderHistory(); });
}

/** Reps / date / note editor shared by the post-set summary and History detail. */
function setEditorHtml(rec: SetRecord, k: string) {
  const d = isoDate(performedAt(rec));
  return `<div class="editor">
      <label>Reps <input type="number" id="${k}Reps" min="1" step="1" inputmode="numeric" placeholder="1" value="${rec.manualReps ?? ""}" /></label>
      <label>Date performed <input type="date" id="${k}Date" value="${d}" max="${isoDate(Date.now())}" /></label>
      <label class="grow">Note <input type="text" id="${k}Note" placeholder="optional" value="${esc(rec.note ?? "")}" /></label>
      <button class="sm primary" id="${k}Save" type="button">Save</button>
      <span class="muted" id="${k}Msg">${rec.reps?.length ? `auto-detected ${rec.reps.length} — for info only` : "blank reps = 1"}</span>
    </div>`;
}
function bindSetEditor(rec: SetRecord, k: string, after: () => Promise<void> | void) {
  const save = async () => {
    const r = Number($<HTMLInputElement>(`${k}Reps`).value);
    rec.manualReps = r > 0 ? Math.round(r) : undefined;
    const dv = $<HTMLInputElement>(`${k}Date`).value;
    if (dv) {
      const [y, m, dd] = dv.split("-").map(Number);
      const t = new Date(rec.startedAt); // keep the time of day, change the day
      rec.performedAt = new Date(y, m - 1, dd, t.getHours(), t.getMinutes(), t.getSeconds()).getTime();
    }
    rec.note = $<HTMLInputElement>(`${k}Note`).value.trim() || undefined;
    await store.updateSet(rec);
    host()?.upsertForceSet(toHostSet(rec));
    const i = sets.findIndex((s) => s.id === rec.id); if (i >= 0) sets[i] = rec;
    $(`${k}Msg`).textContent = `saved · ${repsFor(rec)} rep${repsFor(rec) === 1 ? "" : "s"} · ${isoDate(performedAt(rec))}`;
    await after();
  };
  $(`${k}Save`).onclick = save;
  for (const id of [`${k}Reps`, `${k}Date`, `${k}Note`]) $<HTMLInputElement>(id).onkeydown = (e) => { if (e.key === "Enter") save(); };
}

function line(k: string, v: string, extra = "") { return `<div class="fl-line"><span>${k}</span><span>${v} ${extra}</span></div>`; }
function delta(now: number, prev?: number) {
  if (!prev) return "";
  const d = ((now - prev) / prev) * 100;
  return `<span class="${d >= 0 ? "fl-d up" : "fl-d down"}">${d >= 0 ? "+" : ""}${d.toFixed(1)}%</span>`;
}

// ---------- draw loop ----------
function drawLoop() {
  const samples = recorder.current();
  const el = recorder.elapsed();
  $("liveKg").textContent = liveKg.toFixed(1);
  $("elapsed").textContent = fmtT(el);
  chart.draw(samples, el, liveKg);
  if (recorder.recording && samples.length > 2) {
    const m = computeMetrics(samples);
    $("sPeak").textContent = fmt(m.peak);
    $("sAvg").textContent = fmt(m.avg);
    $("sOut").textContent = fmt(m.output);
    $("sInroad").textContent = `${m.inroad.toFixed(0)}%`;
    const p = lastSetForExercise;
    $("dPeak").innerHTML = delta(m.peak, p?.peak);
    $("dAvg").innerHTML = delta(m.avg, p?.avg);
    $("dOut").innerHTML = bestOutputForExercise ? `<span class="muted">${((m.output / bestOutputForExercise) * 100).toFixed(0)}% of goal</span>` : "";
    const reps = detectReps(samples);
    $("sReps").textContent = reps.length ? String(reps.length) : "–";
    $("dReps").textContent = reps.length ? `last ${reps[reps.length - 1].peak.toFixed(0)} kg` : "";
  }
  requestAnimationFrame(drawLoop);
}

// ---------- history ----------
let selectedHist: SetRecord | null = null;
function renderHistory() {
  const f = $<HTMLSelectElement>("histExercise").value;
  const list = sets.filter((s) => !f || s.exercise === f).slice().sort((a, b) => performedAt(b) - performedAt(a) || b.startedAt - a.startedAt);
  $("histBody").innerHTML = list.map((s) => `<tr data-id="${s.id}" class="${selectedHist?.id === s.id ? "sel" : ""}">
      <td>${new Date(performedAt(s)).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</td>
      <td>${esc(s.exercise)}${s.side !== "both" ? ` <small class="muted">${s.side[0].toUpperCase()}</small>` : ""}</td>
      <td>${s.mode}</td><td>${repsFor(s)}</td><td>${fmtT(s.durationS)}</td><td>${fmt(s.peak)}</td><td>${fmt(s.avg)}</td><td>${fmt(s.output)}</td><td>${s.inroad.toFixed(0)}%</td>
      <td><button data-del="${s.id}">✕</button></td></tr>`).join("") || `<tr><td colspan="10" class="muted">No sets yet.</td></tr>`;
  $("histBody").querySelectorAll<HTMLTableRowElement>("tr[data-id]").forEach((tr) => {
    tr.onclick = (e) => {
      if ((e.target as HTMLElement).dataset.del) return;
      selectedHist = sets.find((s) => s.id === tr.dataset.id) ?? null;
      renderHistory(); showHistDetail();
    };
  });
  $("histBody").querySelectorAll<HTMLButtonElement>("button[data-del]").forEach((b) => {
    b.onclick = async () => {
      if (!confirm("Delete this set?")) return;
      await store.deleteSet(b.dataset.del!);
      host()?.removeForceSet(`fl-${b.dataset.del}`);
      sets = sets.filter((s) => s.id !== b.dataset.del);
      if (selectedHist?.id === b.dataset.del) selectedHist = null;
      renderHistory(); await refreshExerciseContext();
    };
  });
  drawProgress(f ? list.slice().reverse() : []);
}

function showHistDetail() {
  const s = selectedHist;
  const box = $("histDetail");
  if (!s) { box.classList.add("hidden"); return; }
  box.classList.remove("hidden");
  box.innerHTML = `<h4>${esc(s.exercise)} · ${new Date(s.startedAt).toLocaleString()}</h4>
    <div class="chartwrap small"><canvas id="histCanvas"></canvas></div>
    ${line("Peak", `${fmt(s.peak)} kg`)}${line("Intensity", `${fmt(s.avg)} kg`)}${line("Output", fmt(s.output))}${line("Inroad", `${s.inroad.toFixed(0)}%`)}
    ${line("Reps (logged)", String(repsFor(s)))}
    ${s.reps?.length ? line("Auto-detected", `${s.reps.length} (${s.reps.map((r) => r.peak.toFixed(0)).join(", ")} kg)`) : ""}
    ${setEditorHtml(s, "hist")}
    <div class="actions-inline" style="margin-top:8px"><button class="sm" id="btnUseGhost">Use as ghost trace</button><button class="sm ghost" id="btnSetCsv">Export samples CSV</button></div>`;
  bindSetEditor(s, "hist", async () => { renderHistory(); await refreshExerciseContext(); });
  const c = new ForceChart($<HTMLCanvasElement>("histCanvas"));
  c.opts.windowS = Math.max(10, Math.ceil(s.durationS / 10) * 10);
  c.opts.marks = s.reps?.map((r) => r.startS) ?? [];
  c.draw(s.samples, s.durationS, 0);
  $("btnUseGhost").onclick = () => { ghostOn = true; localStorage.setItem("ufl.ghostOn", "1"); $<HTMLInputElement>("ghostOn").checked = true; chart.opts.ghost = s.samples; switchTab("train"); };
  $("btnSetCsv").onclick = () => exportText(`set-${s.id}.csv`, samplesCSV(s), "text/csv");
}

/** Progress chart: peak and intensity per set over time for the filtered exercise. */
function drawProgress(list: SetRecord[]) {
  const wrap = $("progress");
  if (list.length < 2) { wrap.classList.add("hidden"); return; }
  wrap.classList.remove("hidden");
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const W = wrap.clientWidth - 12, H = 160;
  progressChart.width = W * dpr; progressChart.height = H * dpr;
  progressChart.style.width = `${W}px`; progressChart.style.height = `${H}px`;
  const ctx = progressChart.getContext("2d")!; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  const css = getComputedStyle(document.getElementById("view-force") ?? document.documentElement);
  const padL = 36, padR = 8, padT = 10, padB = 18, pw = W - padL - padR, ph = H - padT - padB;
  const max = Math.max(10, ...list.map((s) => s.peak)) * 1.1;
  const x = (i: number) => padL + (i / Math.max(1, list.length - 1)) * pw;
  const y = (v: number) => padT + ph - (v / max) * ph;
  ctx.strokeStyle = css.getPropertyValue("--grid"); ctx.fillStyle = css.getPropertyValue("--muted"); ctx.font = "10px system-ui"; ctx.textAlign = "right";
  for (let i = 0; i <= 4; i++) { const v = (max / 4) * i; ctx.beginPath(); ctx.moveTo(padL, y(v)); ctx.lineTo(W - padR, y(v)); ctx.stroke(); ctx.fillText(v.toFixed(0), padL - 4, y(v) + 3); }
  const series: [keyof SetRecord, string][] = [["peak", css.getPropertyValue("--accent")], ["avg", css.getPropertyValue("--accent2")]];
  for (const [k, color] of series) {
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
    list.forEach((s, i) => (i ? ctx.lineTo(x(i), y(s[k] as number)) : ctx.moveTo(x(i), y(s[k] as number))));
    ctx.stroke();
    ctx.fillStyle = color; list.forEach((s, i) => { ctx.beginPath(); ctx.arc(x(i), y(s[k] as number), 3, 0, Math.PI * 2); ctx.fill(); });
  }
  ctx.fillStyle = css.getPropertyValue("--muted"); ctx.textAlign = "left";
  ctx.fillText("peak", padL + 4, padT + 10); ctx.fillStyle = css.getPropertyValue("--accent2"); ctx.fillText("intensity", padL + 36, padT + 10);
}

// ---------- settings ----------
async function renderSettings() {
  const maxes = await store.maxes();
  const rows = Object.entries(maxes).map(([k, v]) => {
    const [ex, side] = k.split("|");
    return `<tr><td>${esc(ex)}</td><td>${side}</td><td>${fmt(v.kg)}</td><td>${new Date(v.at).toLocaleDateString()}</td><td><button data-mdel="${esc(k)}">✕</button></td></tr>`;
  });
  $("maxBody").innerHTML = rows.join("") || `<tr><td colspan="5" class="muted">No maxes yet.</td></tr>`;
  $("maxBody").querySelectorAll<HTMLButtonElement>("button[data-mdel]").forEach((b) => (b.onclick = async () => {
    await store.deleteMax(b.dataset.mdel!);
    renderSettings(); refreshExerciseContext();
  }));
  $("exList").innerHTML = exercises.map((e) => `<span>${esc(e)}<button data-xdel="${esc(e)}">✕</button></span>`).join("");
  $("exList").querySelectorAll<HTMLButtonElement>("button[data-xdel]").forEach((b) => (b.onclick = async () => {
    const h = host(); if (h) { if (!h.removeExercise(b.dataset.xdel!)) { alert("Built-in Gym Log exercises can't be removed here."); return; } exercises = h.exerciseNames(); } else { exercises = exercises.filter((e) => e !== b.dataset.xdel); await store.saveExercises(exercises); }
    fillExerciseSelects(); renderSettings();
  }));
}

// ---------- UI binding ----------
function switchTab(name: string) {
  document.querySelectorAll<HTMLButtonElement>(".fl-tabs button").forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
  document.querySelectorAll<HTMLElement>(".fl-tab").forEach((t) => t.classList.toggle("active", t.id === `tab-${name}`));
  if (name === "train") chart.resize();
  if (name === "history") renderHistory();
}

function bindUI() {
  document.querySelectorAll<HTMLButtonElement>(".fl-tabs button").forEach((b) => (b.onclick = () => switchTab(b.dataset.tab!)));
  $("btnConnect").onclick = async () => {
    if (source instanceof BleScale && (curStatus === "live" || curStatus === "scanning")) {
      await source.stop(); source = null; setStatus("idle"); manualOff = true; return;
    }
    manualOff = false;
    $("simPanel").classList.add("hidden"); sim = null;
    const b = new BleScale();
    b.onSeen = () => renderSeen(b);
    connect(b);
  };
  $("btnSim").onclick = () => { sim = new SimScale(); sim.exact = $<HTMLInputElement>("simExact").checked; $("simPanel").classList.remove("hidden"); connect(sim); };
  $<HTMLInputElement>("simExact").onchange = (e) => {
    const on = (e.target as HTMLInputElement).checked;
    if (sim) sim.exact = on;
    $("simHelp").textContent = on ? "Reading tracks the slider exactly." : 'Slide up to "push", back to 0 to rest. Fatigue is simulated.';
  };
  $("btnTare").onclick = () => source?.tare();
  $("btnStart").onclick = startSet;
  $<HTMLInputElement>("camOn").checked = localStorage.getItem("ufl.camOn") === "1";
  const applyCam = async () => {
    const on = $<HTMLInputElement>("camOn").checked;
    localStorage.setItem("ufl.camOn", on ? "1" : "0");
    if (on) {
      if (!navigator.mediaDevices?.getUserMedia) { alert("Camera not available here."); $<HTMLInputElement>("camOn").checked = false; return; }
      cam ??= new CamPreview($<HTMLVideoElement>("camVideo"));
      try { await cam.start(); $("camPip").classList.remove("hidden"); $("btnCamFlip").classList.remove("hidden"); }
      catch (e) { alert("Camera failed: " + (e as Error).message + "\nAllow the Camera permission for UY Force Lab in Android settings."); $<HTMLInputElement>("camOn").checked = false; }
    } else { cam?.stop(); $("camPip").classList.add("hidden"); $("btnCamFlip").classList.add("hidden"); }
  };
  $("camOn").onchange = applyCam;
  if ($<HTMLInputElement>("camOn").checked) applyCam();
  $("btnCamFlip").onclick = () => cam?.flip();
  // draggable picture-in-picture; a tap (no movement) toggles the size
  const pip = $("camPip");
  const savedPos = localStorage.getItem("ufl.pipPos");
  if (savedPos) { const [l, t] = savedPos.split(",").map(Number); pip.style.left = `${l}px`; pip.style.top = `${t}px`; }
  let drag: { x: number; y: number; l: number; t: number; moved: boolean } | null = null;
  pip.onpointerdown = (e) => { const r = pip.getBoundingClientRect(); drag = { x: e.clientX, y: e.clientY, l: r.left, t: r.top, moved: false }; pip.setPointerCapture(e.pointerId); };
  pip.onpointermove = (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 6) drag.moved = true;
    if (!drag.moved) return;
    const r = pip.getBoundingClientRect();
    const l = Math.min(window.innerWidth - r.width, Math.max(0, drag.l + dx)), t = Math.min(window.innerHeight - r.height, Math.max(0, drag.t + dy));
    pip.style.left = `${l}px`; pip.style.top = `${t}px`;
  };
  pip.onpointerup = () => {
    if (!drag) return;
    if (drag.moved) { const r = pip.getBoundingClientRect(); localStorage.setItem("ufl.pipPos", `${Math.round(r.left)},${Math.round(r.top)}`); }
    else pip.classList.toggle("large");
    drag = null;
  };
  $("btnStop").onclick = stopSet;
  $<HTMLInputElement>("simEffort").oninput = (e) => { const v = Number((e.target as HTMLInputElement).value); if (sim) sim.effort = v; $("simVal").textContent = String(v); };
  $("exercise").onchange = refreshExerciseContext;
  attachPicker($<HTMLSelectElement>("exercise"), { recent: recentForceExercises, all: () => exercises, onCreate: createExercise });
  attachPicker($<HTMLSelectElement>("maxExercise"), { recent: recentForceExercises, all: () => exercises, onCreate: createExercise });
  attachPicker($<HTMLSelectElement>("histExercise"), { recent: recentForceExercises, all: () => exercises, allOption: { value: "", label: "All exercises" } });
  $("btnNewEx").onclick = () => { $("newExBox").classList.remove("hidden"); $<HTMLInputElement>("newExName").focus(); };
  $("btnNewExCancel").onclick = () => { $("newExBox").classList.add("hidden"); $<HTMLInputElement>("newExName").value = ""; };
  const saveNewEx = async () => {
    const n = $<HTMLInputElement>("newExName").value.trim();
    if (!n) return;
    if (!exercises.includes(n)) { const h = host(); if (h) { h.addExercise(n); exercises = h.exerciseNames(); } else { exercises.push(n); await store.saveExercises(exercises); } }
    fillExerciseSelects();
    $<HTMLSelectElement>("exercise").value = n;
    $("newExBox").classList.add("hidden"); $<HTMLInputElement>("newExName").value = "";
    renderSettings(); await refreshExerciseContext();
  };
  $("btnNewExSave").onclick = saveNewEx;
  $<HTMLInputElement>("newExName").onkeydown = (e) => { if (e.key === "Enter") saveNewEx(); };
  $("side").onchange = refreshExerciseContext;
  $("protocol").onchange = () => renderParams();
  $("params").oninput = () => ($("protocolHelp").textContent = buildProtocol($<HTMLSelectElement>("protocol").value, readParams()).describe);
  for (const id of ["zoneOn", "zoneLo", "zoneHi"]) $(id).oninput = refreshExerciseContext;
  $<HTMLInputElement>("ghostOn").checked = ghostOn;
  $<HTMLInputElement>("ghostOn").onchange = (e) => { ghostOn = (e.target as HTMLInputElement).checked; localStorage.setItem("ufl.ghostOn", ghostOn ? "1" : "0"); refreshExerciseContext(); };
  $("histExercise").onchange = renderHistory;
  $("btnCsv").onclick = () => exportText(`uy-force-lab-${today()}.csv`, toCSV(sets), "text/csv");
  $("btnJson").onclick = () => exportText(`uy-force-lab-${today()}.json`, JSON.stringify(sets, null, 1), "application/json");
  $<HTMLInputElement>("voiceOn").onchange = (e) => (voice.enabled = (e.target as HTMLInputElement).checked);
  $<HTMLInputElement>("keepAwake").checked = keepAwakeEnabled();
  $<HTMLInputElement>("keepAwake").onchange = (e) => { localStorage.setItem("ufl.keepAwake", (e.target as HTMLInputElement).checked ? "1" : "0"); applyKeepAwake(); };
  $<HTMLInputElement>("autoConnect").checked = autoConnectEnabled();
  $<HTMLInputElement>("autoConnect").onchange = (e) => { localStorage.setItem("ufl.autoConnect", (e.target as HTMLInputElement).checked ? "1" : "0"); autoTried = false; autoConnect(); };
  // resume listening when the app comes back to the foreground
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && (curStatus === "idle" || curStatus === "error")) { autoTried = false; autoConnect(); } });
  voice.rate = Number(pref("ufl.voiceRate", "1.2")) || 1.2; voice.pitch = Number(pref("ufl.voicePitch", "1")) || 1;
  const bindVoiceNum = (id: string, key: string, set: (v: number) => void, cur: number) => {
    const el = $<HTMLInputElement>(id); el.value = String(cur); $(id + "Val").textContent = cur.toFixed(1) + "×";
    el.oninput = () => { const v = Number(el.value); set(v); localStorage.setItem(key, String(v)); $(id + "Val").textContent = v.toFixed(1) + "×"; };
  };
  bindVoiceNum("voiceRate", "ufl.voiceRate", (v) => (voice.rate = v), voice.rate);
  bindVoiceNum("voicePitch", "ufl.voicePitch", (v) => (voice.pitch = v), voice.pitch);
  $<HTMLInputElement>("beepOn").onchange = (e) => (beepOn = (e.target as HTMLInputElement).checked);
  $<HTMLInputElement>("calloutEvery").value = String(calloutEvery);
  $<HTMLInputElement>("calloutEvery").onchange = (e) => { calloutEvery = Math.max(1, Number((e.target as HTMLInputElement).value) || 1); localStorage.setItem("ufl.calloutEvery", String(calloutEvery)); };
  const bindPref = (id: string, key: string, set: (v: boolean) => void, cur: boolean) => {
    const el = $<HTMLInputElement>(id); el.checked = cur;
    el.onchange = () => { set(el.checked); localStorage.setItem(key, el.checked ? "1" : "0"); };
  };
  bindPref("calloutOn", "ufl.calloutOn", (v) => (calloutOn = v), calloutOn);
  bindPref("secBeep", "ufl.secBeep", (v) => (secBeep = v), secBeep);
  bindPref("secCount", "ufl.secCount", (v) => (secCount = v), secCount);
  // show what was said, and wake the speech engine on any tap
  let saidTimer: ReturnType<typeof setTimeout> | null = null;
  voice.onSpeak = (t) => { const el = $("said"); el.textContent = `🔊 ${t}`; el.classList.add("on"); if (saidTimer) clearTimeout(saidTimer); saidTimer = setTimeout(() => el.classList.remove("on"), 900); };
  document.addEventListener("pointerdown", () => voice.unlock(), { once: true });
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") voice.reset(); });
  $("btnTestVoice").onclick = async () => {
    voice.reset();
    const st = $("voiceStatus");
    st.textContent = await voice.status();
    voice.say("Force lab voice check, 1, 2, 3", true);
  };
  $("btnSetMax").onclick = async () => {
    const kg = Number($<HTMLInputElement>("maxKg").value);
    if (!kg) return;
    await store.setMax($<HTMLSelectElement>("maxExercise").value, $<HTMLSelectElement>("maxSide").value, kg);
    $<HTMLInputElement>("maxKg").value = ""; renderSettings(); refreshExerciseContext();
  };
  $("btnAddEx").onclick = async () => {
    const n = $<HTMLInputElement>("newEx").value.trim();
    if (!n || exercises.includes(n)) return;
    { const h = host(); if (h) { h.addExercise(n); exercises = h.exerciseNames(); } else { exercises.push(n); await store.saveExercises(exercises); } }
    $<HTMLInputElement>("newEx").value = ""; fillExerciseSelects(); renderSettings();
  };
}

function renderSeen(b: BleScale) {
  const rows = [...b.seen.values()].sort((a, c) => c.t - a.t).slice(0, 12);
  $("seenBody").innerHTML = rows.map((d) => `<tr><td>${esc(d.name || "(no name)")}<br><small class="muted">${esc(d.id)}</small></td><td>${d.rssi}</td><td>${esc(d.keys || "–")}</td><td style="white-space:normal;font-family:monospace;font-size:11px">${esc(d.hex || "–")}</td><td>${d.kg === null ? "–" : d.kg.toFixed(2)}</td></tr>`).join("") || `<tr><td colspan="5" class="muted">Listening… nothing heard yet.</td></tr>`;
}

// ---------- utils ----------
function fmt(n: number) { return n >= 100 ? n.toFixed(0) : n.toFixed(1); }
function fmtT(t: number) { const m = Math.floor(t / 60), s = Math.floor(t % 60); return `${m}:${s.toString().padStart(2, "0")}`; }
function today() { return new Date().toISOString().slice(0, 10); }
function esc(s: string) { return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!)); }

init();

// Host hook: called by Gym Log when the Force view becomes visible.
(window as any).ForceLab = { onShow() { chart.resize(); autoConnect(); } };
