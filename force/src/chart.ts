// Canvas force-over-time chart in the ARX style: live trace, ghost of the last set,
// optional target zone band, rep markers.
export interface ChartOptions {
  windowS: number; // seconds visible (grows if set is longer)
  zone?: { lo: number; hi: number } | null;
  ghost?: { t: number; kg: number }[] | null;
  marks?: number[]; // rep boundaries (seconds)
  peaks?: { t: number; kg: number }[]; // per-rep peak markers
}

export class ForceChart {
  private ctx: CanvasRenderingContext2D;
  private dpr = Math.max(1, window.devicePixelRatio || 1);
  opts: ChartOptions = { windowS: 60, zone: null, ghost: null, marks: [] };
  private last: [{ t: number; kg: number }[], number, number] | null = null;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
    this.resize();
    new ResizeObserver(() => this.resize()).observe(canvas.parentElement ?? canvas);
  }

  resize() {
    const parent = this.canvas.parentElement ?? this.canvas;
    const w = parent.clientWidth || 320;
    // landscape layouts give the wrapper an explicit height (flagged by --chart-fill) and the canvas fills it
    const fill = getComputedStyle(parent).getPropertyValue("--chart-fill").trim() === "1";
    const h = fill ? Math.max(140, parent.clientHeight - 12) : Math.max(220, Math.min(380, Math.round(w * 0.6)));
    this.canvas.width = w * this.dpr;
    this.canvas.height = h * this.dpr;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (this.last) this.render(...this.last);
  }

  draw(samples: { t: number; kg: number }[], elapsedS: number, live: number) {
    this.last = [samples, elapsedS, live];
    this.render(samples, elapsedS, live);
  }

  private render(samples: { t: number; kg: number }[], elapsedS: number, live: number) {
    const { ctx } = this;
    const W = this.canvas.width / this.dpr, H = this.canvas.height / this.dpr;
    const padL = 42, padR = 12, padT = 12, padB = 24;
    const pw = W - padL - padR, ph = H - padT - padB;
    const css = getComputedStyle(document.getElementById("view-force") ?? document.documentElement);
    const cText = css.getPropertyValue("--muted").trim() || "#888";
    const cGrid = css.getPropertyValue("--grid").trim() || "#333";
    const cLive = css.getPropertyValue("--accent").trim() || "#e8552f";
    const cGhost = css.getPropertyValue("--ghost").trim() || "#7a7a7a";
    const cZone = css.getPropertyValue("--zone").trim() || "rgba(60,180,90,0.18)";

    ctx.clearRect(0, 0, W, H);

    const windowS = Math.max(this.opts.windowS, Math.ceil(elapsedS / 10) * 10 || 10);
    const ghost = this.opts.ghost ?? [];
    let maxKg = 10;
    for (const p of samples) maxKg = Math.max(maxKg, p.kg);
    for (const p of ghost) maxKg = Math.max(maxKg, p.kg);
    if (this.opts.zone) maxKg = Math.max(maxKg, this.opts.zone.hi);
    maxKg = niceCeil(maxKg * 1.1);

    const x = (t: number) => padL + (t / windowS) * pw;
    const y = (kg: number) => padT + ph - (Math.max(0, kg) / maxKg) * ph;

    // zone band
    if (this.opts.zone) {
      ctx.fillStyle = cZone;
      const yh = y(this.opts.zone.hi), yl = y(this.opts.zone.lo);
      ctx.fillRect(padL, yh, pw, yl - yh);
    }

    // grid
    ctx.strokeStyle = cGrid; ctx.lineWidth = 1; ctx.fillStyle = cText;
    ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const v = (maxKg / ySteps) * i; const yy = y(v);
      ctx.beginPath(); ctx.moveTo(padL, yy); ctx.lineTo(W - padR, yy); ctx.stroke();
      ctx.fillText(v.toFixed(0), padL - 6, yy);
    }
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    const xStep = windowS <= 30 ? 5 : windowS <= 90 ? 10 : 30;
    for (let t = 0; t <= windowS; t += xStep) {
      const xx = x(t);
      ctx.beginPath(); ctx.moveTo(xx, padT); ctx.lineTo(xx, padT + ph); ctx.stroke();
      ctx.fillText(fmtT(t), xx, padT + ph + 6);
    }

    // rep marks
    if (this.opts.marks?.length) {
      ctx.strokeStyle = cGhost; ctx.setLineDash([3, 4]);
      for (const m of this.opts.marks) { ctx.beginPath(); ctx.moveTo(x(m), padT); ctx.lineTo(x(m), padT + ph); ctx.stroke(); }
      ctx.setLineDash([]);
    }

    // ghost
    if (ghost.length > 1) {
      ctx.strokeStyle = cGhost; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ghost.forEach((p, i) => (i ? ctx.lineTo(x(p.t), y(p.kg)) : ctx.moveTo(x(p.t), y(p.kg))));
      ctx.stroke(); ctx.globalAlpha = 1;
    }

    // live trace
    if (samples.length > 1) {
      ctx.strokeStyle = cLive; ctx.lineWidth = 2.5; ctx.lineJoin = "round";
      ctx.beginPath();
      samples.forEach((p, i) => (i ? ctx.lineTo(x(p.t), y(p.kg)) : ctx.moveTo(x(p.t), y(p.kg))));
      ctx.stroke();
      // fill under
      const last = samples[samples.length - 1];
      ctx.lineTo(x(last.t), y(0)); ctx.lineTo(x(samples[0].t), y(0)); ctx.closePath();
      ctx.fillStyle = cLive; ctx.globalAlpha = 0.12; ctx.fill(); ctx.globalAlpha = 1;
      // per-rep peak markers (ARX-style): dot + kg label, the best one highlighted
      const peaks = this.opts.peaks ?? [];
      if (peaks.length) {
        const best = Math.max(...peaks.map((p) => p.kg));
        ctx.font = "bold 11px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
        for (const p of peaks) {
          const px = x(p.t), py = y(p.kg);
          ctx.fillStyle = p.kg === best ? cLive : "#ecebe6"; ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2); ctx.fill();
          const label = p.kg.toFixed(0), tw = ctx.measureText(label).width + 8, lx = Math.min(Math.max(px, padL + tw / 2), padL + pw - tw / 2), ly = Math.max(padT + 14, py - 6);
          ctx.fillStyle = p.kg === best ? cLive : "rgba(40,42,48,0.92)"; ctx.fillRect(lx - tw / 2, ly - 14, tw, 14);
          ctx.fillStyle = "#fff"; ctx.fillText(label, lx, ly - 1);
        }
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      }
      // cursor
      ctx.fillStyle = cLive; ctx.beginPath(); ctx.arc(x(last.t), y(last.kg), 4, 0, Math.PI * 2); ctx.fill();
    } else if (live > 0) {
      ctx.fillStyle = cLive; ctx.beginPath(); ctx.arc(x(0), y(live), 4, 0, Math.PI * 2); ctx.fill();
    }
  }
}

function niceCeil(v: number) {
  const steps = [10, 20, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500];
  for (const s of steps) if (v <= s) return s;
  return Math.ceil(v / 100) * 100;
}
function fmtT(t: number) {
  const m = Math.floor(t / 60), s = t % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
