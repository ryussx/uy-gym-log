// Force source abstraction: the real WeiHeng WH-C06/WH-C100 Bluetooth crane scale,
// or a simulator for testing without hardware.
//
// WeiHeng protocol (reverse-engineered by the climbing community):
//   - pure BLE broadcaster, no GATT; weight lives in the advertisement's
//     manufacturer-specific data under company ID 0x0100
//   - bytes 10..11 of that payload = weight * 100, big-endian (kg)
//   - byte 14: high nibble = stable flag, low nibble = unit code
//   - ~8-10 packets per second

import { BleClient, type ScanResult } from "@capacitor-community/bluetooth-le";
import { Capacitor } from "@capacitor/core";

export interface ForceSample {
  t: number; // ms since epoch
  kg: number; // tared force in kg
}

export type SampleListener = (s: ForceSample) => void;
export type StatusListener = (status: ScaleStatus) => void;
export type ScaleStatus = "idle" | "scanning" | "live" | "lost" | "error";

const WEIHENG_COMPANY_ID = 0x0100;
const WEIGHT_OFFSET = 10;
const LOST_AFTER_MS = 4000;

export interface ForceSource {
  readonly name: string;
  start(): Promise<void>;
  stop(): Promise<void>;
  tare(): void;
  onSample(fn: SampleListener): void;
  onStatus(fn: StatusListener): void;
}

abstract class BaseSource implements ForceSource {
  abstract readonly name: string;
  protected sampleFns: SampleListener[] = [];
  protected statusFns: StatusListener[] = [];
  protected tareKg = 0;
  protected lastRaw = 0;
  protected lostTimer: ReturnType<typeof setTimeout> | null = null;
  protected status: ScaleStatus = "idle";

  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;

  onSample(fn: SampleListener) { this.sampleFns.push(fn); }
  onStatus(fn: StatusListener) { this.statusFns.push(fn); }
  tare() { this.tareKg = this.lastRaw; }

  protected setStatus(s: ScaleStatus) {
    if (s === this.status) return;
    this.status = s;
    this.statusFns.forEach((f) => f(s));
  }

  protected emitRaw(rawKg: number) {
    this.lastRaw = rawKg;
    const s: ForceSample = { t: Date.now(), kg: rawKg - this.tareKg };
    this.setStatus("live");
    this.sampleFns.forEach((f) => f(s));
    if (this.lostTimer) clearTimeout(this.lostTimer);
    this.lostTimer = setTimeout(() => this.setStatus("lost"), LOST_AFTER_MS);
  }

  protected clearLost() {
    if (this.lostTimer) clearTimeout(this.lostTimer);
    this.lostTimer = null;
  }
}

function hex(dv: DataView) { let o = ""; for (let i = 0; i < dv.byteLength; i++) o += dv.getUint8(i).toString(16).padStart(2, "0") + " "; return o.trim(); }

/** Find a manufacturer-specific (0xFF) AD block in a raw advertisement; returns the bytes after the company id. */
export function extractManufacturer(raw: DataView, companyId?: number): DataView | undefined {
  let i = 0;
  while (i < raw.byteLength) {
    const len = raw.getUint8(i); if (!len) break;
    const type = raw.getUint8(i + 1);
    if (type === 0xff && len >= 3) {
      const cid = raw.getUint8(i + 2) | (raw.getUint8(i + 3) << 8);
      if (companyId === undefined || cid === companyId) return new DataView(raw.buffer, raw.byteOffset + i + 4, len - 3);
    }
    i += len + 1;
  }
  return undefined;
}

/** Decode a WeiHeng manufacturer-data payload (company ID already stripped). */
export function decodeWeiheng(data: DataView): number | null {
  if (data.byteLength < WEIGHT_OFFSET + 2) return null;
  const raw = (data.getUint8(WEIGHT_OFFSET) << 8) | data.getUint8(WEIGHT_OFFSET + 1);
  return raw / 100;
}

export interface SeenDevice { id: string; name: string; rssi: number; keys: string; hex: string; kg: number | null; t: number }

export class BleScale extends BaseSource {
  readonly name = "WeiHeng scale";
  private scanning = false;
  /** Last few devices heard, for the debug panel. */
  seen = new Map<string, SeenDevice>();
  onSeen: (d: SeenDevice) => void = () => {};

  async start() {
    if (!Capacitor.isNativePlatform()) {
      throw new Error("Bluetooth scanning needs the Android build. Use the simulator in the browser.");
    }
    await BleClient.initialize({ androidNeverForLocation: true });
    const enabled = await BleClient.isEnabled().catch(() => true);
    if (!enabled) { try { await BleClient.requestEnable(); } catch { throw new Error("Bluetooth is off — turn it on and try again."); } }
    this.setStatus("scanning");
    this.scanning = true;
    await BleClient.requestLEScan(
      { allowDuplicates: true },
      (r: ScanResult) => {
        const name = r.localName ?? r.device.name ?? "";
        const md = r.manufacturerData ?? {};
        const keys = Object.keys(md);
        // 1) manufacturer data under WeiHeng's company id (plugin keys by decimal string)
        let payload: DataView | undefined = md[String(WEIHENG_COMPANY_ID)] ?? md[WEIHENG_COMPANY_ID.toString(16)];
        // 2) fallback: any manufacturer block when the name says it's a WeiHeng/IF scale
        if (!payload && /^(IF_|WH-|WEIHENG)/i.test(name) && keys.length) payload = md[keys[0]];
        // 3) fallback: parse the raw advertisement for an AD type 0xFF block
        if (!payload && r.rawAdvertisement) payload = extractManufacturer(r.rawAdvertisement, WEIHENG_COMPANY_ID) ?? (/^IF_/i.test(name) ? extractManufacturer(r.rawAdvertisement) : undefined);
        const kg = payload ? decodeWeiheng(payload) : null;
        const d: SeenDevice = { id: r.device.deviceId, name, rssi: r.rssi ?? 0, keys: keys.join(","), hex: payload ? hex(payload) : (r.rawAdvertisement ? hex(r.rawAdvertisement).slice(0, 60) : ""), kg, t: Date.now() };
        this.seen.set(d.id, d); this.onSeen(d);
        if (kg === null) return;
        this.emitRaw(kg);
      },
    );
  }

  async stop() {
    if (this.scanning) {
      try { await BleClient.stopLEScan(); } catch { /* ignore */ }
    }
    this.scanning = false;
    this.clearLost();
    this.setStatus("idle");
  }
}

/** Simulated scale: a human-shaped isometric effort you can drive from the UI. */
export class SimScale extends BaseSource {
  readonly name = "Simulator";
  private timer: ReturnType<typeof setInterval> | null = null;
  /** target effort in kg the "athlete" is trying to produce; 0 = resting */
  effort = 0;
  /** false = realistic (lag, fatigue, noise); true = reading equals the slider exactly */
  exact = false;
  private current = 0;
  private fatigue = 0;

  async start() {
    this.setStatus("scanning");
    this.timer = setInterval(() => this.tick(), 100); // 10 Hz like the real scale
  }

  async stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.clearLost();
    this.setStatus("idle");
  }

  private tick() {
    if (this.exact) { this.fatigue = 0; this.current = this.effort; this.emitRaw(this.effort); return; }
    // approach the effort with a lag, decay with fatigue while effort > 0
    const target = this.effort > 0 ? this.effort * (1 - this.fatigue) : 0;
    this.current += (target - this.current) * 0.25;
    if (this.effort > 0) this.fatigue = Math.min(0.6, this.fatigue + 0.0015);
    else this.fatigue = Math.max(0, this.fatigue - 0.01);
    const noise = (Math.random() - 0.5) * Math.max(0.3, this.current * 0.03);
    const kg = Math.max(0, Math.round((this.current + noise) * 100) / 100);
    this.emitRaw(kg);
  }
}
