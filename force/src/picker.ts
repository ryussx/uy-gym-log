// Searchable exercise picker that drives a hidden <select>. The select stays the
// source of truth (value / onchange keep working); the picker is just the UI.
export interface PickerOptions {
  /** Names to show on top ("recent"), most recent first. */
  recent: () => string[];
  /** All names (the rest is shown alphabetically below the recent ones). */
  all: () => string[];
  /** Extra first entry, e.g. { value: "", label: "All" } for a filter. */
  allOption?: { value: string; label: string };
  /** Called with a typed name that doesn't exist; return true if it was created. */
  onCreate?: (name: string) => Promise<boolean> | boolean;
}

let overlay: HTMLElement | null = null;

function esc(s: string) { return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)); }

export function attachPicker(select: HTMLSelectElement, opts: PickerOptions) {
  select.classList.add("picker-hidden");
  const btn = document.createElement("button");
  btn.type = "button"; btn.className = "picker-btn";
  select.insertAdjacentElement("afterend", btn);
  const refresh = () => {
    const v = select.value;
    btn.textContent = v ? v : (opts.allOption?.label ?? "Choose…");
    btn.disabled = select.disabled;
  };
  refresh();
  new MutationObserver(refresh).observe(select, { attributes: true, childList: true });
  select.addEventListener("change", refresh);
  btn.onclick = () => open(select, opts, refresh);
  return refresh;
}

function open(select: HTMLSelectElement, opts: PickerOptions, refresh: () => void) {
  close();
  const root = document.getElementById("view-force") ?? document.body;
  overlay = document.createElement("div");
  overlay.className = "picker-overlay";
  overlay.innerHTML = `<div class="picker-panel">
    <div class="picker-head"><input type="text" class="picker-search" placeholder="Search exercises…" autocomplete="off" /><button type="button" class="sm ghost picker-close">✕</button></div>
    <div class="picker-list"></div>
  </div>`;
  root.appendChild(overlay);
  const input = overlay.querySelector<HTMLInputElement>(".picker-search")!;
  const list = overlay.querySelector<HTMLElement>(".picker-list")!;
  const choose = (v: string) => { select.value = v; select.dispatchEvent(new Event("change", { bubbles: true })); refresh(); close(); };
  const render = () => {
    const q = input.value.trim().toLowerCase();
    const recent = opts.recent().filter((n) => !q || n.toLowerCase().includes(q));
    const rest = opts.all().filter((n) => !recent.includes(n) && (!q || n.toLowerCase().includes(q))).sort((a, b) => a.localeCompare(b));
    let html = "";
    if (opts.allOption && (!q || opts.allOption.label.toLowerCase().includes(q))) html += `<button type="button" class="picker-item" data-v="${esc(opts.allOption.value)}">${esc(opts.allOption.label)}</button>`;
    if (recent.length) html += `<div class="picker-group">Recent in Force Lab</div>` + recent.map((n) => `<button type="button" class="picker-item" data-v="${esc(n)}">${esc(n)}</button>`).join("");
    if (rest.length) html += `<div class="picker-group">${recent.length ? "All exercises" : "Exercises"}</div>` + rest.map((n) => `<button type="button" class="picker-item" data-v="${esc(n)}">${esc(n)}</button>`).join("");
    const typed = input.value.trim();
    if (typed && opts.onCreate && !opts.all().some((n) => n.toLowerCase() === typed.toLowerCase())) html += `<button type="button" class="picker-item picker-create" data-create="1">+ Create "${esc(typed)}"</button>`;
    if (!html) html = `<div class="picker-group">No match</div>`;
    list.innerHTML = html;
    list.querySelectorAll<HTMLButtonElement>(".picker-item").forEach((b) => {
      b.onclick = async () => {
        if (b.dataset.create) { const n = input.value.trim(); if (await opts.onCreate!(n)) choose(n); return; }
        choose(b.dataset.v!);
      };
    });
  };
  input.oninput = render;
  input.onkeydown = (e) => { if (e.key === "Escape") close(); if (e.key === "Enter") { const first = list.querySelector<HTMLButtonElement>(".picker-item"); first?.click(); } };
  overlay.querySelector<HTMLButtonElement>(".picker-close")!.onclick = close;
  overlay.onclick = (e) => { if (e.target === overlay) close(); };
  render();
  setTimeout(() => input.focus(), 50);
}

export function close() { overlay?.remove(); overlay = null; }
