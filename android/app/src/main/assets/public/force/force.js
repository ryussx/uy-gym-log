var st;
(function(s) {
  s[s.SCAN_MODE_LOW_POWER = 0] = "SCAN_MODE_LOW_POWER", s[s.SCAN_MODE_BALANCED = 1] = "SCAN_MODE_BALANCED", s[s.SCAN_MODE_LOW_LATENCY = 2] = "SCAN_MODE_LOW_LATENCY";
})(st || (st = {}));
var yt;
(function(s) {
  s[s.PHY_LE_1M = 1] = "PHY_LE_1M", s[s.PHY_LE_2M = 2] = "PHY_LE_2M", s[s.PHY_LE_CODED = 3] = "PHY_LE_CODED", s[s.PHY_LE_ALL_SUPPORTED = 255] = "PHY_LE_ALL_SUPPORTED";
})(yt || (yt = {}));
var bt;
(function(s) {
  s[s.CONNECTION_PRIORITY_BALANCED = 0] = "CONNECTION_PRIORITY_BALANCED", s[s.CONNECTION_PRIORITY_HIGH = 1] = "CONNECTION_PRIORITY_HIGH", s[s.CONNECTION_PRIORITY_LOW_POWER = 2] = "CONNECTION_PRIORITY_LOW_POWER";
})(bt || (bt = {}));
/*! Capacitor: https://capacitorjs.com/ - MIT License */
var pe;
(function(s) {
  s.Unimplemented = "UNIMPLEMENTED", s.Unavailable = "UNAVAILABLE";
})(pe || (pe = {}));
class He extends Error {
  constructor(e, t, n) {
    super(e), this.message = e, this.code = t, this.data = n;
  }
}
const ls = (s) => {
  var e, t;
  return s?.androidBridge ? "android" : !((t = (e = s?.webkit) === null || e === void 0 ? void 0 : e.messageHandlers) === null || t === void 0) && t.bridge ? "ios" : "web";
}, us = (s) => {
  const e = s.CapacitorCustomPlatform || null, t = s.Capacitor || {}, n = t.Plugins = t.Plugins || {}, i = () => e !== null ? e.name : ls(s), a = () => i() !== "web", c = (h) => {
    const f = l.get(h);
    return !!(f?.platforms.has(i()) || u(h));
  }, u = (h) => {
    var f;
    return (f = t.PluginHeaders) === null || f === void 0 ? void 0 : f.find((p) => p.name === h);
  }, r = (h) => s.console.error(h), l = /* @__PURE__ */ new Map(), d = (h, f = {}) => {
    const p = l.get(h);
    if (p)
      return console.warn(`Capacitor plugin "${h}" already registered. Cannot register plugins twice.`), p.proxy;
    const v = i(), y = u(h);
    let b;
    const x = async () => (!b && v in f ? b = typeof f[v] == "function" ? b = await f[v]() : b = f[v] : e !== null && !b && "web" in f && (b = typeof f.web == "function" ? b = await f.web() : b = f.web), b), H = (P, T) => {
      var g, k;
      if (y) {
        const L = y?.methods.find((E) => T === E.name);
        if (L)
          return L.rtype === "promise" ? (E) => t.nativePromise(h, T.toString(), E) : (E, ce) => t.nativeCallback(h, T.toString(), E, ce);
        if (P)
          return (g = P[T]) === null || g === void 0 ? void 0 : g.bind(P);
      } else {
        if (P)
          return (k = P[T]) === null || k === void 0 ? void 0 : k.bind(P);
        throw new He(`"${h}" plugin is not implemented on ${v}`, pe.Unimplemented);
      }
    }, B = (P) => {
      let T;
      const g = (...k) => {
        const L = x().then((E) => {
          const ce = H(E, P);
          if (ce) {
            const le = ce(...k);
            return T = le?.remove, le;
          } else
            throw new He(`"${h}.${P}()" is not implemented on ${v}`, pe.Unimplemented);
        });
        return P === "addListener" && (L.remove = async () => T()), L;
      };
      return g.toString = () => `${P.toString()}() { [capacitor code] }`, Object.defineProperty(g, "name", {
        value: P,
        writable: !1,
        configurable: !1
      }), g;
    }, j = B("addListener"), q = B("removeListener"), I = (P, T) => {
      const g = j({ eventName: P }, T), k = async () => {
        const E = await g;
        q({
          eventName: P,
          callbackId: E
        }, T);
      }, L = new Promise((E) => g.then(() => E({ remove: k })));
      return L.remove = async () => {
        console.warn("Using addListener() without 'await' is deprecated."), await k();
      }, L;
    }, O = new Proxy({}, {
      get(P, T) {
        switch (T) {
          case "$$typeof":
            return;
          case "toJSON":
            return () => ({});
          case "addListener":
            return y ? I : j;
          case "removeListener":
            return q;
          default:
            return B(T);
        }
      }
    });
    return n[h] = O, l.set(h, {
      name: h,
      proxy: O,
      platforms: /* @__PURE__ */ new Set([...Object.keys(f), ...y ? [v] : []])
    }), O;
  };
  return t.convertFileSrc || (t.convertFileSrc = (h) => h), t.getPlatform = i, t.handleError = r, t.isNativePlatform = a, t.isPluginAvailable = c, t.registerPlugin = d, t.Exception = He, t.DEBUG = !!t.DEBUG, t.isLoggingEnabled = !!t.isLoggingEnabled, t;
}, ds = (s) => s.Capacitor = us(s), R = /* @__PURE__ */ ds(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {}), ne = R.registerPlugin;
class ie {
  constructor() {
    this.listeners = {}, this.retainedEventArguments = {}, this.windowListeners = {};
  }
  addListener(e, t) {
    let n = !1;
    this.listeners[e] || (this.listeners[e] = [], n = !0), this.listeners[e].push(t);
    const a = this.windowListeners[e];
    a && !a.registered && this.addWindowListener(a), n && this.sendRetainedArgumentsForEvent(e);
    const c = async () => this.removeListener(e, t);
    return Promise.resolve({ remove: c });
  }
  async removeAllListeners() {
    this.listeners = {};
    for (const e in this.windowListeners)
      this.removeWindowListener(this.windowListeners[e]);
    this.windowListeners = {};
  }
  notifyListeners(e, t, n) {
    const i = this.listeners[e];
    if (!i) {
      if (n) {
        let a = this.retainedEventArguments[e];
        a || (a = []), a.push(t), this.retainedEventArguments[e] = a;
      }
      return;
    }
    i.forEach((a) => a(t));
  }
  hasListeners(e) {
    var t;
    return !!(!((t = this.listeners[e]) === null || t === void 0) && t.length);
  }
  registerWindowListener(e, t) {
    this.windowListeners[t] = {
      registered: !1,
      windowEventName: e,
      pluginEventName: t,
      handler: (n) => {
        this.notifyListeners(t, n);
      }
    };
  }
  unimplemented(e = "not implemented") {
    return new R.Exception(e, pe.Unimplemented);
  }
  unavailable(e = "not available") {
    return new R.Exception(e, pe.Unavailable);
  }
  async removeListener(e, t) {
    const n = this.listeners[e];
    if (!n)
      return;
    const i = n.indexOf(t);
    this.listeners[e].splice(i, 1), this.listeners[e].length || this.removeWindowListener(this.windowListeners[e]);
  }
  addWindowListener(e) {
    window.addEventListener(e.windowEventName, e.handler), e.registered = !0;
  }
  removeWindowListener(e) {
    e && (window.removeEventListener(e.windowEventName, e.handler), e.registered = !1);
  }
  sendRetainedArgumentsForEvent(e) {
    const t = this.retainedEventArguments[e];
    t && (delete this.retainedEventArguments[e], t.forEach((n) => {
      this.notifyListeners(e, n);
    }));
  }
}
const xt = (s) => encodeURIComponent(s).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape), St = (s) => s.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class hs extends ie {
  async getCookies() {
    const e = document.cookie, t = {};
    return e.split(";").forEach((n) => {
      if (n.length <= 0)
        return;
      let [i, a] = n.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
      i = St(i).trim(), a = St(a).trim(), t[i] = a;
    }), t;
  }
  async setCookie(e) {
    try {
      const t = xt(e.key), n = xt(e.value), i = e.expires ? `; expires=${e.expires.replace("expires=", "")}` : "", a = (e.path || "/").replace("path=", ""), c = e.url != null && e.url.length > 0 ? `domain=${e.url}` : "";
      document.cookie = `${t}=${n || ""}${i}; path=${a}; ${c};`;
    } catch (t) {
      return Promise.reject(t);
    }
  }
  async deleteCookie(e) {
    try {
      document.cookie = `${e.key}=; Max-Age=0`;
    } catch (t) {
      return Promise.reject(t);
    }
  }
  async clearCookies() {
    try {
      const e = document.cookie.split(";") || [];
      for (const t of e)
        document.cookie = t.replace(/^ +/, "").replace(/=.*/, `=;expires=${(/* @__PURE__ */ new Date()).toUTCString()};path=/`);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  async clearAllCookies() {
    try {
      await this.clearCookies();
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
ne("CapacitorCookies", {
  web: () => new hs()
});
const fs = async (s) => new Promise((e, t) => {
  const n = new FileReader();
  n.onload = () => {
    const i = n.result;
    e(i.indexOf(",") >= 0 ? i.split(",")[1] : i);
  }, n.onerror = (i) => t(i), n.readAsDataURL(s);
}), ps = (s = {}) => {
  const e = Object.keys(s);
  return Object.keys(s).map((i) => i.toLocaleLowerCase()).reduce((i, a, c) => (i[a] = s[e[c]], i), {});
}, gs = (s, e = !0) => s ? Object.entries(s).reduce((n, i) => {
  const [a, c] = i;
  let u, r;
  return Array.isArray(c) ? (r = "", c.forEach((l) => {
    u = e ? encodeURIComponent(l) : l, r += `${a}=${u}&`;
  }), r.slice(0, -1)) : (u = e ? encodeURIComponent(c) : c, r = `${a}=${u}`), `${n}&${r}`;
}, "").substr(1) : null, qt = (s, e = {}) => {
  const t = Object.assign({ method: s.method || "GET", headers: s.headers }, e), i = ps(s.headers)["content-type"] || "";
  if (typeof s.data == "string")
    t.body = s.data;
  else if (i.includes("application/x-www-form-urlencoded")) {
    const a = new URLSearchParams();
    for (const [c, u] of Object.entries(s.data || {}))
      a.set(c, u);
    t.body = a.toString();
  } else if (i.includes("multipart/form-data") || s.data instanceof FormData) {
    const a = new FormData();
    if (s.data instanceof FormData)
      s.data.forEach((u, r) => {
        a.append(r, u);
      });
    else
      for (const u of Object.keys(s.data))
        a.append(u, s.data[u]);
    t.body = a;
    const c = new Headers(t.headers);
    c.delete("content-type"), t.headers = c;
  } else (i.includes("application/json") || typeof s.data == "object") && (t.body = JSON.stringify(s.data));
  return t;
};
class ms extends ie {
  /**
   * Perform an Http request given a set of options
   * @param options Options to build the HTTP request
   */
  async request(e) {
    const t = qt(e, e.webFetchExtra), n = gs(e.params, e.shouldEncodeUrlParams), i = n ? `${e.url}?${n}` : e.url, a = await fetch(i, t), c = a.headers.get("content-type") || "";
    let { responseType: u = "text" } = a.ok ? e : {};
    c.includes("application/json") && (u = "json");
    let r, l;
    switch (u) {
      case "arraybuffer":
      case "blob":
        l = await a.blob(), r = await fs(l);
        break;
      case "json":
        r = await a.json();
        break;
      case "document":
      case "text":
      default:
        r = await a.text();
    }
    const d = {};
    return a.headers.forEach((h, f) => {
      d[f] = h;
    }), {
      data: r,
      headers: d,
      status: a.status,
      url: a.url
    };
  }
  /**
   * Perform an Http GET request given a set of options
   * @param options Options to build the HTTP request
   */
  async get(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: "GET" }));
  }
  /**
   * Perform an Http POST request given a set of options
   * @param options Options to build the HTTP request
   */
  async post(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: "POST" }));
  }
  /**
   * Perform an Http PUT request given a set of options
   * @param options Options to build the HTTP request
   */
  async put(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: "PUT" }));
  }
  /**
   * Perform an Http PATCH request given a set of options
   * @param options Options to build the HTTP request
   */
  async patch(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: "PATCH" }));
  }
  /**
   * Perform an Http DELETE request given a set of options
   * @param options Options to build the HTTP request
   */
  async delete(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: "DELETE" }));
  }
}
ne("CapacitorHttp", {
  web: () => new ms()
});
var kt;
(function(s) {
  s.Dark = "DARK", s.Light = "LIGHT", s.Default = "DEFAULT";
})(kt || (kt = {}));
var Et;
(function(s) {
  s.StatusBar = "StatusBar", s.NavigationBar = "NavigationBar";
})(Et || (Et = {}));
class vs extends ie {
  async setStyle() {
    this.unavailable("not available for web");
  }
  async setAnimation() {
    this.unavailable("not available for web");
  }
  async show() {
    this.unavailable("not available for web");
  }
  async hide() {
    this.unavailable("not available for web");
  }
}
ne("SystemBars", {
  web: () => new vs()
});
function ws(s) {
  return new DataView(Uint8Array.from(s).buffer);
}
function ys(s) {
  return Array.from(new Uint8Array(s.buffer, s.byteOffset, s.byteLength));
}
function bs(s) {
  return `0000${s.toString(16).padStart(4, "0")}-0000-1000-8000-00805f9b34fb`;
}
function xe(s) {
  const e = [];
  let t, n, i = 1, a = 0;
  for (t = 0; t < s.length; t++)
    n = s.charCodeAt(t), (n > 47 && n < 58 || n > 64 && n < 71 || n > 96 && n < 103) && (a = a << 4 ^ (n > 64 ? n + 9 : n) & 15, (i ^= 1) && e.push(a & 255));
  return ws(e);
}
function Se(s) {
  return ys(s).map((e) => {
    let t = e.toString(16);
    return t.length == 1 && (t = "0" + t), t;
  }).join("");
}
function xs(s) {
  if (typeof s == "string")
    return s;
  if (typeof s == "number")
    return bs(s);
  throw new Error("Invalid UUID");
}
function Lt(s) {
  const e = {};
  if (s)
    return s.forEach((t, n) => {
      e[n.toString()] = t;
    }), e;
}
function Ct(s) {
  if (s !== void 0) {
    if (typeof s == "string") {
      const e = xe(s);
      return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
    }
    return s instanceof DataView ? new Uint8Array(s.buffer, s.byteOffset, s.byteLength) : s;
  }
}
function $e(s) {
  if (s !== void 0)
    return s instanceof DataView ? Se(s) : Se(new DataView(s.buffer, s.byteOffset, s.byteLength));
}
function We(s) {
  if (typeof SharedArrayBuffer < "u" && s.buffer instanceof SharedArrayBuffer) {
    const t = new Uint8Array(s.buffer, s.byteOffset, s.byteLength).slice().buffer;
    return new DataView(t);
  }
  return s;
}
const m = ne("BluetoothLe", {
  web: () => Promise.resolve().then(() => on).then((s) => new s.BluetoothLeWeb())
}), Ss = () => {
  let s = Promise.resolve();
  return (e) => new Promise((t, n) => {
    s = s.then(() => e()).then(t).catch(n);
  });
};
function ze(s) {
  return s ? Ss() : (e) => e();
}
function C(s) {
  if (typeof s != "string")
    throw new Error(`Invalid UUID type ${typeof s}. Expected string.`);
  if (s = s.toLowerCase(), !(s.search(/^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/) >= 0))
    throw new Error(`Invalid UUID format ${s}. Expected 128 bit string (e.g. "0000180d-0000-1000-8000-00805f9b34fb").`);
  return s;
}
class ks {
  constructor() {
    this.scanListener = null, this.eventListeners = /* @__PURE__ */ new Map(), this.queue = ze(!0);
  }
  enableQueue() {
    this.queue = ze(!0);
  }
  disableQueue() {
    this.queue = ze(!1);
  }
  async initialize(e) {
    await this.queue(async () => {
      await m.initialize(e);
    });
  }
  async isEnabled() {
    return await this.queue(async () => (await m.isEnabled()).value);
  }
  async requestEnable() {
    await this.queue(async () => {
      await m.requestEnable();
    });
  }
  async enable() {
    await this.queue(async () => {
      await m.enable();
    });
  }
  async disable() {
    await this.queue(async () => {
      await m.disable();
    });
  }
  async startEnabledNotifications(e) {
    await this.queue(async () => {
      var t;
      const n = "onEnabledChanged";
      await ((t = this.eventListeners.get(n)) === null || t === void 0 ? void 0 : t.remove());
      const i = await m.addListener(n, (a) => {
        e(a.value);
      });
      this.eventListeners.set(n, i), await m.startEnabledNotifications();
    });
  }
  async stopEnabledNotifications() {
    await this.queue(async () => {
      var e;
      const t = "onEnabledChanged";
      await ((e = this.eventListeners.get(t)) === null || e === void 0 ? void 0 : e.remove()), this.eventListeners.delete(t), await m.stopEnabledNotifications();
    });
  }
  async isLocationEnabled() {
    return await this.queue(async () => (await m.isLocationEnabled()).value);
  }
  async openLocationSettings() {
    await this.queue(async () => {
      await m.openLocationSettings();
    });
  }
  async openBluetoothSettings() {
    await this.queue(async () => {
      await m.openBluetoothSettings();
    });
  }
  async openAppSettings() {
    await this.queue(async () => {
      await m.openAppSettings();
    });
  }
  async setDisplayStrings(e) {
    await this.queue(async () => {
      await m.setDisplayStrings(e);
    });
  }
  async requestDevice(e) {
    return e = e ? this.validateRequestBleDeviceOptions(e) : void 0, await this.queue(async () => await m.requestDevice(e));
  }
  async requestLEScan(e, t) {
    e = this.validateRequestBleDeviceOptions(e), await this.queue(async () => {
      var n;
      await ((n = this.scanListener) === null || n === void 0 ? void 0 : n.remove()), this.scanListener = await m.addListener("onScanResult", (i) => {
        const a = Object.assign(Object.assign({}, i), { manufacturerData: this.convertObject(i.manufacturerData), serviceData: this.convertObject(i.serviceData), rawAdvertisement: i.rawAdvertisement ? this.convertValue(i.rawAdvertisement) : void 0 });
        t(a);
      }), await m.requestLEScan(e);
    });
  }
  async stopLEScan() {
    await this.queue(async () => {
      var e;
      await ((e = this.scanListener) === null || e === void 0 ? void 0 : e.remove()), this.scanListener = null, await m.stopLEScan();
    });
  }
  async getDevices(e) {
    if (!Array.isArray(e))
      throw new Error("deviceIds must be an array");
    return this.queue(async () => (await m.getDevices({ deviceIds: e })).devices);
  }
  async getConnectedDevices(e) {
    if (!Array.isArray(e))
      throw new Error("services must be an array");
    return e = e.map(C), this.queue(async () => (await m.getConnectedDevices({ services: e })).devices);
  }
  async getBondedDevices() {
    return this.queue(async () => (await m.getBondedDevices()).devices);
  }
  async connect(e, t, n) {
    await this.queue(async () => {
      var i;
      if (t) {
        const a = `disconnected|${e}`;
        await ((i = this.eventListeners.get(a)) === null || i === void 0 ? void 0 : i.remove());
        const c = await m.addListener(a, () => {
          t(e);
        });
        this.eventListeners.set(a, c);
      }
      await m.connect(Object.assign({ deviceId: e }, n));
    });
  }
  async createBond(e, t) {
    await this.queue(async () => {
      await m.createBond(Object.assign({ deviceId: e }, t));
    });
  }
  async isBonded(e) {
    return await this.queue(async () => (await m.isBonded({ deviceId: e })).value);
  }
  async disconnect(e) {
    await this.queue(async () => {
      await m.disconnect({ deviceId: e });
    });
  }
  async getServices(e) {
    return await this.queue(async () => (await m.getServices({ deviceId: e })).services);
  }
  async discoverServices(e) {
    await this.queue(async () => {
      await m.discoverServices({ deviceId: e });
    });
  }
  async getMtu(e) {
    return await this.queue(async () => (await m.getMtu({ deviceId: e })).value);
  }
  async requestConnectionPriority(e, t) {
    await this.queue(async () => {
      await m.requestConnectionPriority({ deviceId: e, connectionPriority: t });
    });
  }
  async readRssi(e) {
    return await this.queue(async () => {
      const n = await m.readRssi({ deviceId: e });
      return parseFloat(n.value);
    });
  }
  async read(e, t, n, i) {
    return t = C(t), n = C(n), await this.queue(async () => {
      const c = await m.read(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n
      }, i));
      return this.convertValue(c.value);
    });
  }
  async write(e, t, n, i, a) {
    return t = C(t), n = C(n), this.queue(async () => {
      if (!i?.buffer)
        throw new Error("Invalid data.");
      let c = i;
      R.getPlatform() !== "web" && (c = Se(i)), await m.write(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n,
        value: c
      }, a));
    });
  }
  async writeWithoutResponse(e, t, n, i, a) {
    t = C(t), n = C(n), await this.queue(async () => {
      if (!i?.buffer)
        throw new Error("Invalid data.");
      let c = i;
      R.getPlatform() !== "web" && (c = Se(i)), await m.writeWithoutResponse(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n,
        value: c
      }, a));
    });
  }
  async readDescriptor(e, t, n, i, a) {
    return t = C(t), n = C(n), i = C(i), await this.queue(async () => {
      const u = await m.readDescriptor(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n,
        descriptor: i
      }, a));
      return this.convertValue(u.value);
    });
  }
  async writeDescriptor(e, t, n, i, a, c) {
    return t = C(t), n = C(n), i = C(i), this.queue(async () => {
      if (!a?.buffer)
        throw new Error("Invalid data.");
      let u = a;
      R.getPlatform() !== "web" && (u = Se(a)), await m.writeDescriptor(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n,
        descriptor: i,
        value: u
      }, c));
    });
  }
  async startNotifications(e, t, n, i, a) {
    t = C(t), n = C(n), await this.queue(async () => {
      var c;
      const u = `notification|${e}|${t}|${n}`;
      await ((c = this.eventListeners.get(u)) === null || c === void 0 ? void 0 : c.remove());
      const r = await m.addListener(u, (l) => {
        i(this.convertValue(l?.value));
      });
      this.eventListeners.set(u, r), await m.startNotifications(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n
      }, a));
    });
  }
  async stopNotifications(e, t, n) {
    t = C(t), n = C(n), await this.queue(async () => {
      var i;
      const a = `notification|${e}|${t}|${n}`;
      await ((i = this.eventListeners.get(a)) === null || i === void 0 ? void 0 : i.remove()), this.eventListeners.delete(a), await m.stopNotifications({
        deviceId: e,
        service: t,
        characteristic: n
      });
    });
  }
  validateRequestBleDeviceOptions(e) {
    return e = Object.assign({}, e), e.services && (e.services = e.services.map(C)), e.optionalServices && (e.optionalServices = e.optionalServices.map(C)), e.serviceData && R.getPlatform() !== "web" && (e.serviceData = e.serviceData.map((t) => Object.assign(Object.assign({}, t), { serviceUuid: C(t.serviceUuid), dataPrefix: $e(t.dataPrefix), mask: $e(t.mask) }))), e.manufacturerData && (R.getPlatform() !== "web" ? e.manufacturerData = e.manufacturerData.map((t) => Object.assign(Object.assign({}, t), { dataPrefix: $e(t.dataPrefix), mask: $e(t.mask) })) : e.manufacturerData = e.manufacturerData.map((t) => Object.assign(Object.assign({}, t), { dataPrefix: Ct(t.dataPrefix), mask: Ct(t.mask) }))), e;
  }
  convertValue(e) {
    return typeof e == "string" ? xe(e) : e === void 0 ? new DataView(new ArrayBuffer(0)) : e;
  }
  convertObject(e) {
    if (e === void 0)
      return;
    const t = {};
    for (const n of Object.keys(e))
      t[n] = this.convertValue(e[n]);
    return t;
  }
}
const he = new ks(), Ke = 256, Ge = 10, Es = 4e3;
class Nt {
  constructor() {
    this.sampleFns = [], this.statusFns = [], this.tareKg = 0, this.lastRaw = 0, this.lostTimer = null, this.status = "idle";
  }
  onSample(e) {
    this.sampleFns.push(e);
  }
  onStatus(e) {
    this.statusFns.push(e);
  }
  tare() {
    this.tareKg = this.lastRaw;
  }
  setStatus(e) {
    e !== this.status && (this.status = e, this.statusFns.forEach((t) => t(e)));
  }
  emitRaw(e) {
    this.lastRaw = e;
    const t = { t: Date.now(), kg: e - this.tareKg };
    this.setStatus("live"), this.sampleFns.forEach((n) => n(t)), this.lostTimer && clearTimeout(this.lostTimer), this.lostTimer = setTimeout(() => this.setStatus("lost"), Es);
  }
  clearLost() {
    this.lostTimer && clearTimeout(this.lostTimer), this.lostTimer = null;
  }
}
function Pt(s) {
  let e = "";
  for (let t = 0; t < s.byteLength; t++) e += s.getUint8(t).toString(16).padStart(2, "0") + " ";
  return e.trim();
}
function $t(s, e) {
  let t = 0;
  for (; t < s.byteLength; ) {
    const n = s.getUint8(t);
    if (!n) break;
    if (s.getUint8(t + 1) === 255 && n >= 3) {
      const a = s.getUint8(t + 2) | s.getUint8(t + 3) << 8;
      if (e === void 0 || a === e) return new DataView(s.buffer, s.byteOffset + t + 4, n - 3);
    }
    t += n + 1;
  }
}
function Ls(s) {
  return s.byteLength < Ge + 2 ? null : (s.getUint8(Ge) << 8 | s.getUint8(Ge + 1)) / 100;
}
class ke extends Nt {
  constructor() {
    super(...arguments), this.name = "WeiHeng scale", this.scanning = !1, this.seen = /* @__PURE__ */ new Map(), this.onSeen = () => {
    }, this.lastScanStart = 0, this.healTimer = null, this.lastPacketAt = 0, this.restarts = 0;
  }
  async start() {
    if (!R.isNativePlatform())
      throw new Error("Bluetooth scanning needs the Android build. Use the simulator in the browser.");
    if (await he.initialize({ androidNeverForLocation: !0 }), !await he.isEnabled().catch(() => !0))
      try {
        await he.requestEnable();
      } catch {
        throw new Error("Bluetooth is off — turn it on and try again.");
      }
    await this.beginScan(), this.healTimer && clearInterval(this.healTimer), this.healTimer = setInterval(() => {
      if (!this.scanning) return;
      Date.now() - Math.max(this.lastPacketAt, this.lastScanStart) > 8e3 && Date.now() - this.lastScanStart > 3e4 && this.beginScan().catch(() => {
      });
    }, 2e3);
  }
  async beginScan() {
    if (this.scanning) {
      try {
        await he.stopLEScan();
      } catch {
      }
      await new Promise((e) => setTimeout(e, 300)), this.restarts++;
    }
    this.setStatus("scanning"), this.scanning = !0, this.lastScanStart = Date.now(), await he.requestLEScan(
      { allowDuplicates: !0, scanMode: st.SCAN_MODE_LOW_LATENCY },
      (e) => {
        const t = e.localName ?? e.device.name ?? "", n = e.manufacturerData ?? {}, i = Object.keys(n);
        let a = n[String(Ke)] ?? n[Ke.toString(16)];
        !a && /^(IF_|WH-|WEIHENG)/i.test(t) && i.length && (a = n[i[0]]), !a && e.rawAdvertisement && (a = $t(e.rawAdvertisement, Ke) ?? (/^IF_/i.test(t) ? $t(e.rawAdvertisement) : void 0));
        const c = a ? Ls(a) : null, u = { id: e.device.deviceId, name: t, rssi: e.rssi ?? 0, keys: i.join(","), hex: a ? Pt(a) : e.rawAdvertisement ? Pt(e.rawAdvertisement).slice(0, 60) : "", kg: c, t: Date.now() };
        this.seen.set(u.id, u), this.onSeen(u), c !== null && (this.lastPacketAt = Date.now(), this.emitRaw(c));
      }
    );
  }
  async stop() {
    if (this.healTimer && (clearInterval(this.healTimer), this.healTimer = null), this.scanning)
      try {
        await he.stopLEScan();
      } catch {
      }
    this.scanning = !1, this.clearLost(), this.setStatus("idle");
  }
}
class Cs extends Nt {
  constructor() {
    super(...arguments), this.name = "Simulator", this.timer = null, this.effort = 0, this.exact = !1, this.current = 0, this.fatigue = 0;
  }
  async start() {
    this.setStatus("scanning"), this.timer = setInterval(() => this.tick(), 100);
  }
  async stop() {
    this.timer && clearInterval(this.timer), this.timer = null, this.clearLost(), this.setStatus("idle");
  }
  tick() {
    if (this.exact) {
      this.fatigue = 0, this.current = this.effort, this.emitRaw(this.effort);
      return;
    }
    const e = this.effort > 0 ? this.effort * (1 - this.fatigue) : 0;
    this.current += (e - this.current) * 0.25, this.effort > 0 ? this.fatigue = Math.min(0.6, this.fatigue + 15e-4) : this.fatigue = Math.max(0, this.fatigue - 0.01);
    const t = (Math.random() - 0.5) * Math.max(0.3, this.current * 0.03), n = Math.max(0, Math.round((this.current + t) * 100) / 100);
    this.emitRaw(n);
  }
}
function ge(s) {
  return s.manualReps && s.manualReps > 0 ? Math.round(s.manualReps) : 1;
}
function de(s) {
  return s.performedAt ?? s.startedAt;
}
const _e = 2;
class Ps {
  constructor() {
    this.samples = [], this.t0 = 0, this.recording = !1;
  }
  start() {
    this.samples = [], this.t0 = Date.now(), this.recording = !0;
  }
  push(e) {
    this.recording && this.samples.push({ t: (e.t - this.t0) / 1e3, kg: e.kg });
  }
  peakSoFar() {
    let e = 0;
    for (const t of this.samples) t.kg > e && (e = t.kg);
    return e;
  }
  elapsed() {
    return this.recording ? (Date.now() - this.t0) / 1e3 : 0;
  }
  current() {
    return this.samples;
  }
  finish(e) {
    this.recording = !1;
    const t = this.samples;
    if (t.length < 3) return null;
    const n = Ut(t);
    return {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      exercise: e.exercise,
      side: e.side,
      mode: e.mode,
      startedAt: this.t0,
      durationS: t[t.length - 1].t,
      samples: t,
      ...n,
      reps: ht(t)
    };
  }
}
function Ut(s) {
  let e = 0, t = 0, n = 0;
  for (let u = 0; u < s.length; u++) {
    const r = Math.max(0, s[u].kg);
    e = Math.max(e, r), t += r, u > 0 && (n += r * (s[u].t - s[u - 1].t));
  }
  const i = t / s.length, a = s.filter((u) => u.kg > _e);
  let c = 0;
  if (a.length >= 10) {
    const u = Math.max(3, Math.floor(a.length * 0.2)), r = Math.max(...a.slice(0, u).map((d) => d.kg)), l = Math.max(...a.slice(-u).map((d) => d.kg));
    c = r > 0 ? Math.max(0, (r - l) / r * 100) : 0;
  }
  return { peak: A(e), avg: A(i), output: A(n), inroad: A(c) };
}
function ht(s) {
  if (s.length < 5) return [];
  const e = Math.max(...s.map((l) => l.kg));
  if (e < _e * 2) return [];
  const t = Math.max(_e, e * 0.35), n = Math.max(_e * 0.5, e * 0.2), i = [];
  let a = !1, c = 0, u = 0, r = 0;
  for (const l of s)
    !a && l.kg >= t ? (a = !0, c = l.t, u = l.kg, r = l.t) : a && (l.kg > u && (u = l.kg, r = l.t), l.kg <= n && (l.t - c >= 0.6 && i.push({ index: i.length + 1, peak: A(u), peakT: A(r), startS: A(c), endS: A(l.t), durationS: A(l.t - c) }), a = !1));
  if (a) {
    const l = s[s.length - 1].t;
    l - c >= 0.6 && i.push({ index: i.length + 1, peak: A(u), peakT: A(r), startS: A(c), endS: A(l), durationS: A(l - c) });
  }
  return i.length >= 2 ? i : [];
}
function $s(s) {
  if (s.length < 6) return null;
  const e = s.slice(-Math.max(3, Math.floor(s.length / 3)));
  return A(e.reduce((t, n) => t + n.peak, 0) / e.length);
}
function A(s) {
  return Math.round(s * 100) / 100;
}
class jt {
  constructor(e) {
    this.canvas = e, this.dpr = Math.max(1, window.devicePixelRatio || 1), this.opts = { windowS: 60, zone: null, ghost: null, marks: [] }, this.last = null, this.ctx = e.getContext("2d"), this.resize(), new ResizeObserver(() => this.resize()).observe(e.parentElement ?? e);
  }
  resize() {
    const t = (this.canvas.parentElement ?? this.canvas).clientWidth || 320, n = Math.max(220, Math.min(380, Math.round(t * 0.6)));
    this.canvas.width = t * this.dpr, this.canvas.height = n * this.dpr, this.canvas.style.width = `${t}px`, this.canvas.style.height = `${n}px`, this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0), this.last && this.render(...this.last);
  }
  draw(e, t, n) {
    this.last = [e, t, n], this.render(e, t, n);
  }
  render(e, t, n) {
    const { ctx: i } = this, a = this.canvas.width / this.dpr, c = this.canvas.height / this.dpr, u = 42, r = 12, l = 12, d = 24, h = a - u - r, f = c - l - d, p = getComputedStyle(document.getElementById("view-force") ?? document.documentElement), v = p.getPropertyValue("--muted").trim() || "#888", y = p.getPropertyValue("--grid").trim() || "#333", b = p.getPropertyValue("--accent").trim() || "#e8552f", x = p.getPropertyValue("--ghost").trim() || "#7a7a7a", H = p.getPropertyValue("--zone").trim() || "rgba(60,180,90,0.18)";
    i.clearRect(0, 0, a, c);
    const B = Math.max(this.opts.windowS, Math.ceil(t / 10) * 10 || 10), j = this.opts.ghost ?? [];
    let q = 10;
    for (const g of e) q = Math.max(q, g.kg);
    for (const g of j) q = Math.max(q, g.kg);
    this.opts.zone && (q = Math.max(q, this.opts.zone.hi)), q = Ds(q * 1.1);
    const I = (g) => u + g / B * h, O = (g) => l + f - Math.max(0, g) / q * f;
    if (this.opts.zone) {
      i.fillStyle = H;
      const g = O(this.opts.zone.hi), k = O(this.opts.zone.lo);
      i.fillRect(u, g, h, k - g);
    }
    i.strokeStyle = y, i.lineWidth = 1, i.fillStyle = v, i.font = "11px system-ui, sans-serif", i.textAlign = "right", i.textBaseline = "middle";
    const P = 5;
    for (let g = 0; g <= P; g++) {
      const k = q / P * g, L = O(k);
      i.beginPath(), i.moveTo(u, L), i.lineTo(a - r, L), i.stroke(), i.fillText(k.toFixed(0), u - 6, L);
    }
    i.textAlign = "center", i.textBaseline = "top";
    const T = B <= 30 ? 5 : B <= 90 ? 10 : 30;
    for (let g = 0; g <= B; g += T) {
      const k = I(g);
      i.beginPath(), i.moveTo(k, l), i.lineTo(k, l + f), i.stroke(), i.fillText(Os(g), k, l + f + 6);
    }
    if (this.opts.marks?.length) {
      i.strokeStyle = x, i.setLineDash([3, 4]);
      for (const g of this.opts.marks)
        i.beginPath(), i.moveTo(I(g), l), i.lineTo(I(g), l + f), i.stroke();
      i.setLineDash([]);
    }
    if (j.length > 1 && (i.strokeStyle = x, i.lineWidth = 1.5, i.globalAlpha = 0.55, i.beginPath(), j.forEach((g, k) => k ? i.lineTo(I(g.t), O(g.kg)) : i.moveTo(I(g.t), O(g.kg))), i.stroke(), i.globalAlpha = 1), e.length > 1) {
      i.strokeStyle = b, i.lineWidth = 2.5, i.lineJoin = "round", i.beginPath(), e.forEach((L, E) => E ? i.lineTo(I(L.t), O(L.kg)) : i.moveTo(I(L.t), O(L.kg))), i.stroke();
      const g = e[e.length - 1];
      i.lineTo(I(g.t), O(0)), i.lineTo(I(e[0].t), O(0)), i.closePath(), i.fillStyle = b, i.globalAlpha = 0.12, i.fill(), i.globalAlpha = 1;
      const k = this.opts.peaks ?? [];
      if (k.length) {
        const L = Math.max(...k.map((E) => E.kg));
        i.font = "bold 11px system-ui, sans-serif", i.textAlign = "center", i.textBaseline = "bottom";
        for (const E of k) {
          const ce = I(E.t), le = O(E.kg);
          i.fillStyle = E.kg === L ? b : "#ecebe6", i.beginPath(), i.arc(ce, le, 3.5, 0, Math.PI * 2), i.fill();
          const mt = E.kg.toFixed(0), Pe = i.measureText(mt).width + 8, vt = Math.min(Math.max(ce, u + Pe / 2), u + h - Pe / 2), wt = Math.max(l + 14, le - 6);
          i.fillStyle = E.kg === L ? b : "rgba(40,42,48,0.92)", i.fillRect(vt - Pe / 2, wt - 14, Pe, 14), i.fillStyle = "#fff", i.fillText(mt, vt, wt - 1);
        }
        i.textAlign = "left", i.textBaseline = "alphabetic";
      }
      i.fillStyle = b, i.beginPath(), i.arc(I(g.t), O(g.kg), 4, 0, Math.PI * 2), i.fill();
    } else n > 0 && (i.fillStyle = b, i.beginPath(), i.arc(I(0), O(n), 4, 0, Math.PI * 2), i.fill());
  }
}
function Ds(s) {
  const e = [10, 20, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500];
  for (const t of e) if (s <= t) return t;
  return Math.ceil(s / 100) * 100;
}
function Os(s) {
  const e = Math.floor(s / 60), t = s % 60;
  return `${e}:${t.toString().padStart(2, "0")}`;
}
function je(s, e = {}) {
  const t = e.hold ?? 10, n = e.rest ?? 20, i = e.reps ?? 6, a = e.ramp ?? 5, c = e.total ?? 60;
  switch (s) {
    case "free":
      return { id: s, label: "Free set", describe: "Open-ended. Start, work, stop.", phases: [] };
    case "countdown":
      return {
        id: s,
        label: `Countdown ${c}s`,
        describe: "One continuous max effort for the whole timer — the ARX protocol.",
        phases: [{ name: "Get ready", seconds: 3, cue: "rest" }, { name: "GO — max effort", seconds: c, cue: "work" }]
      };
    case "ramp":
      return {
        id: s,
        label: `Ramp ${a}s + hold ${t}s`,
        describe: "Build to max over the ramp, then hold it. Joint-friendly way to reach peak force.",
        phases: [
          { name: "Get ready", seconds: 3, cue: "rest" },
          { name: "Build up", seconds: a, cue: "ramp" },
          { name: "HOLD", seconds: t, cue: "work" },
          { name: "Release", seconds: 3, cue: "rest" }
        ]
      };
    case "repeaters":
      return {
        id: s,
        label: `Repeaters ${i}×(${t}s on/${n}s off)`,
        describe: "Repeated holds. Per-rep peaks give the fatigue curve; long sets give critical force.",
        phases: [{ name: "Get ready", seconds: 3, cue: "rest" }, { name: "PULL", seconds: t, cue: "work" }, { name: "Rest", seconds: n, cue: "rest" }],
        repeat: i
      };
    case "maxtest":
      return {
        id: s,
        label: "Max test (3 efforts)",
        describe: "Three 5-second max efforts with 60s rest. Best one becomes your max.",
        phases: [{ name: "Get ready", seconds: 5, cue: "rest" }, { name: "MAX EFFORT", seconds: 5, cue: "work" }, { name: "Rest", seconds: 60, cue: "rest" }],
        repeat: 3
      };
    case "critical":
      return {
        id: s,
        label: "Critical force (7s/3s ×24)",
        describe: "7s on, 3s off, 24 reps. The plateau at the end is the force you can sustain.",
        phases: [{ name: "Get ready", seconds: 3, cue: "rest" }, { name: "PULL", seconds: 7, cue: "work" }, { name: "Off", seconds: 3, cue: "rest" }],
        repeat: 24
      };
    default:
      return je("free");
  }
}
function Vt(s) {
  if (!s.repeat || s.phases.length < 2) return s.phases;
  const [e, ...t] = s.phases, n = [e];
  for (let i = 0; i < s.repeat; i++)
    for (const a of t)
      i === s.repeat - 1 && a === t[t.length - 1] && a.cue === "rest" || n.push({ ...a, name: t.length > 1 && a.cue !== "rest" ? `${a.name} ${i + 1}/${s.repeat}` : a.name });
  return n;
}
class Ts {
  constructor() {
    this.timeline = [], this.idx = -1, this.phaseStart = 0, this.timer = null, this.running = !1, this.onPhase = () => {
    }, this.onTick = () => {
    }, this.onDone = () => {
    };
  }
  start(e) {
    this.timeline = Vt(e), this.idx = -1, this.running = !0, this.next(), this.timer = setInterval(() => this.tick(), 100);
  }
  stop() {
    this.timer && clearInterval(this.timer), this.timer = null, this.running = !1;
  }
  current() {
    return this.timeline[this.idx] ?? null;
  }
  next() {
    if (this.idx++, this.idx >= this.timeline.length) {
      this.stop(), this.onDone();
      return;
    }
    this.phaseStart = Date.now(), this.onPhase(this.timeline[this.idx], this.idx, this.timeline.length);
  }
  tick() {
    const e = this.timeline[this.idx];
    if (!e) return;
    const t = e.seconds - (Date.now() - this.phaseStart) / 1e3;
    t <= 0 ? this.next() : this.onTick(t, e);
  }
}
var Dt;
(function(s) {
  s[s.Flush = 0] = "Flush", s[s.Add = 1] = "Add";
})(Dt || (Dt = {}));
const De = ne("TextToSpeech", {
  web: () => Promise.resolve().then(() => ln).then((s) => new s.TextToSpeechWeb())
}), Oe = R.isNativePlatform();
let Ye = null;
function As() {
  return Ye || (Ye = new (window.AudioContext || window.webkitAudioContext)()), Ye;
}
function ae(s = 880, e = 120, t = 0.25) {
  try {
    const n = As(), i = n.createOscillator(), a = n.createGain();
    i.frequency.value = s, i.type = "sine", a.gain.value = t, i.connect(a), a.connect(n.destination), i.start(), a.gain.exponentialRampToValueAtTime(1e-4, n.currentTime + e / 1e3), i.stop(n.currentTime + e / 1e3);
  } catch {
  }
}
const se = {
  go: () => ae(1200, 220, 0.3),
  rest: () => ae(500, 220, 0.25),
  tick: () => ae(900, 60, 0.15),
  done: () => {
    ae(1e3, 120), setTimeout(() => ae(1300, 160), 140), setTimeout(() => ae(1600, 220), 320);
  },
  inZone: () => ae(1e3, 50, 0.1),
  outZone: () => ae(300, 120, 0.2)
};
class _s {
  constructor() {
    if (this.enabled = !0, this.onSpeak = () => {
    }, this.lastSpoke = 0, this.lastText = "", this.keep = [], this.voice = null, this.busySince = 0, this.nativeBusy = !1, this.rate = 1.2, this.pitch = 1, "speechSynthesis" in window) {
      const e = () => {
        const t = speechSynthesis.getVoices();
        this.voice = t.find((n) => /^en/i.test(n.lang) && /google|english/i.test(n.name)) ?? t.find((n) => /^en/i.test(n.lang)) ?? null;
      };
      e(), speechSynthesis.addEventListener?.("voiceschanged", e);
    }
  }
  /** Warm up the engine from a user gesture so later callouts aren't blocked. */
  unlock() {
    this.reset();
  }
  /** True while the engine reports speaking; auto-resets if it's been "speaking" > 4 s (Chrome wedge). */
  speaking() {
    if (Oe) return this.nativeBusy;
    try {
      return speechSynthesis.speaking || speechSynthesis.pending ? (this.busySince || (this.busySince = Date.now()), Date.now() - this.busySince > 4e3 ? (this.reset(), !1) : !0) : (this.busySince = 0, !1);
    } catch {
      return !1;
    }
  }
  /** Hard reset of the engine. */
  reset() {
    if (Oe) {
      De.stop().catch(() => {
      }), this.nativeBusy = !1;
      return;
    }
    try {
      speechSynthesis.cancel(), speechSynthesis.resume();
    } catch {
    }
    this.busySince = 0, this.keep = [], this.lastText = "";
  }
  /** Human-readable availability for the Settings test button. */
  async status() {
    if (Oe)
      try {
        return `${(await De.getSupportedVoices()).voices.length} native voices`;
      } catch {
        return "native TTS unavailable";
      }
    if (!("speechSynthesis" in window)) return "no speech engine in this browser — open in Chrome";
    const e = speechSynthesis.getVoices().length;
    return e ? `${e} voices` : "no voices installed";
  }
  say(e, t = !1, n = !1) {
    if (!this.enabled) return;
    if (this.onSpeak(e), Oe) {
      if (this.nativeBusy && !t) return;
      this.nativeBusy = !0, (t ? De.stop().catch(() => {
      }) : Promise.resolve()).then(() => De.speak({ text: e, lang: "en-US", rate: this.rate, pitch: this.pitch, volume: 1, category: "ambient" })).catch(() => {
      }).finally(() => {
        this.nativeBusy = !1;
      });
      return;
    }
    if (!("speechSynthesis" in window)) return;
    const i = Date.now();
    if (!(!t && !n && (i - this.lastSpoke < 1800 || e === this.lastText)))
      try {
        t && speechSynthesis.cancel(), speechSynthesis.resume();
        const a = new SpeechSynthesisUtterance(e);
        a.rate = this.rate, a.pitch = this.pitch, a.lang = "en-US", this.voice && (a.voice = this.voice), this.keep.push(a), this.keep.length > 8 && this.keep.shift(), a.onend = () => {
          const c = this.keep.indexOf(a);
          c >= 0 && this.keep.splice(c, 1);
        }, speechSynthesis.speak(a), this.lastSpoke = i, this.lastText = e;
      } catch {
      }
  }
}
function Rs(s) {
  const e = Math.floor(s / 60), t = s % 60;
  return t === 0 && e > 0 ? e === 1 ? "1 minute" : `${e} minutes` : String(t);
}
const Ot = ne("KeepAwake", {
  web: () => Promise.resolve().then(() => dn).then((s) => new s.KeepAwakeWeb())
}), Ht = ne("Preferences", {
  web: () => Promise.resolve().then(() => fn).then((s) => new s.PreferencesWeb())
}), ve = "ufl.sets.v1", Te = "ufl.max.v1", Xe = "ufl.exercises.v1", Wt = [
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
  "SR Curl / Pushdown"
];
function Ms(s) {
  return /^SR\b|self.?resisted/i.test(s) ? "self-resisted" : "iso";
}
async function Je(s, e) {
  try {
    const t = R.isNativePlatform() ? (await Ht.get({ key: s })).value : localStorage.getItem(s);
    return t ? JSON.parse(t) : e;
  } catch {
    return e;
  }
}
async function Q(s, e) {
  const t = JSON.stringify(e);
  R.isNativePlatform() ? await Ht.set({ key: s, value: t }) : localStorage.setItem(s, t);
}
const D = {
  async sets() {
    return Je(ve, []);
  },
  async saveSet(s) {
    const e = await this.sets();
    e.push(s), await Q(ve, e.slice(-500));
  },
  async updateSet(s) {
    const e = await this.sets(), t = e.findIndex((n) => n.id === s.id);
    t >= 0 ? e[t] = s : e.push(s), await Q(ve, e);
  },
  async deleteSet(s) {
    const e = await this.sets();
    await Q(ve, e.filter((t) => t.id !== s));
  },
  async maxes() {
    return Je(Te, {});
  },
  async setMax(s, e, t) {
    const n = await this.maxes();
    n[`${s}|${e}`] = { kg: t, at: Date.now() }, await Q(Te, n);
  },
  async deleteMax(s) {
    const e = await this.maxes();
    delete e[s], await Q(Te, e);
  },
  async exercises() {
    return Je(Xe, Wt);
  },
  /** Rename an exercise in every stored set and max (and the local list). */
  async renameExercise(s, e) {
    const t = await this.sets();
    for (const c of t) c.exercise === s && (c.exercise = e);
    await Q(ve, t);
    const n = await this.maxes(), i = {};
    for (const [c, u] of Object.entries(n)) {
      const [r, l] = c.split("|"), d = `${r === s ? e : r}|${l}`;
      (!i[d] || i[d].kg < u.kg) && (i[d] = u);
    }
    await Q(Te, i);
    const a = await this.exercises();
    if (a.includes(s)) {
      const c = a.map((u) => u === s ? e : u);
      await Q(Xe, [...new Set(c)]);
    }
  },
  async saveExercises(s) {
    await Q(Xe, s);
  }
};
function Is(s) {
  s.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, t) {
        return new Proxy({}, {
          get(n, i) {
            return (a, c, u) => {
              const r = s.Capacitor.Plugins[t];
              if (r === void 0) {
                u(new Error(`Capacitor plugin ${t} not found`));
                return;
              }
              if (typeof r[i] != "function") {
                u(new Error(`Method ${i} not found in Capacitor plugin ${t}`));
                return;
              }
              (async () => {
                try {
                  const l = await r[i](a);
                  c(l);
                } catch (l) {
                  u(l);
                }
              })();
            };
          }
        });
      }
    }
  );
}
function Fs(s) {
  s.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, t) {
        return s.cordova.plugins[t];
      }
    }
  );
}
function Bs(s = !1) {
  typeof window > "u" || (window.CapacitorUtils = window.CapacitorUtils || {}, window.Capacitor !== void 0 && !s ? Is(window) : window.cordova !== void 0 && Fs(window));
}
var nt;
(function(s) {
  s.Documents = "DOCUMENTS", s.Data = "DATA", s.Library = "LIBRARY", s.Cache = "CACHE", s.External = "EXTERNAL", s.ExternalStorage = "EXTERNAL_STORAGE", s.ExternalCache = "EXTERNAL_CACHE", s.LibraryNoCloud = "LIBRARY_NO_CLOUD", s.Temporary = "TEMPORARY";
})(nt || (nt = {}));
var Fe;
(function(s) {
  s.UTF8 = "utf8", s.ASCII = "ascii", s.UTF16 = "utf16";
})(Fe || (Fe = {}));
const qs = ne("Filesystem", {
  web: () => Promise.resolve().then(() => gn).then((s) => new s.FilesystemWeb())
});
Bs();
const Ns = ne("Share", {
  web: () => Promise.resolve().then(() => vn).then((s) => new s.ShareWeb())
});
function Us(s) {
  const e = ["id", "date_performed", "recorded_at", "exercise", "side", "mode", "duration_s", "peak_kg", "avg_kg", "output_kgs", "inroad_pct", "reps", "auto_reps", "rep_peaks"], t = s.map((n) => [
    n.id,
    Ce(de(n)),
    new Date(n.startedAt).toISOString(),
    Tt(n.exercise),
    n.side,
    n.mode,
    n.durationS.toFixed(1),
    n.peak,
    n.avg,
    n.output,
    n.inroad,
    ge(n),
    n.reps?.length ?? 0,
    Tt((n.reps ?? []).map((i) => i.peak).join(" "))
  ].join(","));
  return [e.join(","), ...t].join(`
`);
}
function js(s) {
  return ["t_s,kg", ...s.samples.map((e) => `${e.t.toFixed(2)},${e.kg.toFixed(2)}`)].join(`
`);
}
function Tt(s) {
  return `"${s.replace(/"/g, '""')}"`;
}
async function it(s, e, t) {
  if (R.isNativePlatform()) {
    const c = await qs.writeFile({ path: s, data: e, directory: nt.Cache, encoding: Fe.UTF8 });
    await Ns.share({ title: s, files: [c.uri] });
    return;
  }
  const n = new Blob([e], { type: t }), i = URL.createObjectURL(n), a = document.createElement("a");
  a.href = i, a.download = s, document.body.appendChild(a), a.click(), setTimeout(() => {
    URL.revokeObjectURL(i), a.remove();
  }, 500);
}
function Ce(s) {
  const e = new Date(s);
  return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
class Vs {
  constructor(e) {
    this.video = e, this.stream = null, this.facing = "user";
  }
  get active() {
    return !!this.stream;
  }
  async start(e = this.facing) {
    this.stop(), this.facing = e, this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: e, width: { ideal: 720 }, height: { ideal: 1280 }, frameRate: { ideal: 30 } },
      audio: !1
    }), this.video.srcObject = this.stream, this.video.muted = !0, this.video.classList.toggle("mirror", e === "user"), await this.video.play().catch(() => {
    });
  }
  async flip() {
    await this.start(this.facing === "user" ? "environment" : "user");
  }
  stop() {
    this.stream?.getTracks().forEach((e) => e.stop()), this.stream = null, this.video.srcObject = null;
  }
}
function K() {
  return window.GymLog ?? null;
}
function zt(s) {
  return {
    id: `fl-${s.id}`,
    date: Ce(de(s)),
    exercise: s.exercise,
    kg: s.peak,
    reps: ge(s),
    variation: Ms(s.exercise),
    at: s.startedAt,
    dur: s.durationS,
    note: [s.side !== "both" ? s.side : "", s.mode, s.note].filter(Boolean).join(" · ")
  };
}
function Hs() {
  const s = K();
  if (s)
    for (const e of Wt) s.addExercise(e);
}
let W = null;
const Kt = /* @__PURE__ */ new Map();
function Ws(s) {
  Kt.get(s)?.();
}
function ue(s) {
  return s.replace(/[&<>"']/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[e]);
}
function Ze(s, e) {
  s.classList.add("picker-hidden");
  const t = document.createElement("button");
  t.type = "button", t.className = "picker-btn", s.insertAdjacentElement("afterend", t);
  const n = () => {
    const i = s.value;
    t.textContent = i || (e.allOption?.label ?? "Choose…"), t.disabled = s.disabled;
  };
  return n(), new MutationObserver(n).observe(s, { attributes: !0, childList: !0 }), s.addEventListener("change", n), t.onclick = () => At(s, e, n), Kt.set(s, () => At(s, e, n)), n;
}
function At(s, e, t) {
  we();
  const n = document.getElementById("view-force") ?? document.body;
  W = document.createElement("div"), W.className = "picker-overlay", W.innerHTML = `<div class="picker-panel">
    <div class="picker-head"><input type="text" class="picker-search" placeholder="Search exercises…" autocomplete="off" /><button type="button" class="sm ghost picker-close">✕</button></div>
    <div class="picker-list"></div>
  </div>`, n.appendChild(W);
  const i = W.querySelector(".picker-search"), a = W.querySelector(".picker-list"), c = (r) => {
    s.value = r, s.dispatchEvent(new Event("change", { bubbles: !0 })), t(), we();
  }, u = () => {
    const r = i.value.trim().toLowerCase(), l = e.recent().filter((p) => !r || p.toLowerCase().includes(r)), d = e.all().filter((p) => !l.includes(p) && (!r || p.toLowerCase().includes(r))).sort((p, v) => p.localeCompare(v));
    let h = "";
    e.allOption && (!r || e.allOption.label.toLowerCase().includes(r)) && (h += `<button type="button" class="picker-item" data-v="${ue(e.allOption.value)}">${ue(e.allOption.label)}</button>`), l.length && (h += '<div class="picker-group">Recent in Force Lab</div>' + l.map((p) => `<button type="button" class="picker-item" data-v="${ue(p)}">${ue(p)}</button>`).join("")), d.length && (h += `<div class="picker-group">${l.length ? "All exercises" : "Exercises"}</div>` + d.map((p) => `<button type="button" class="picker-item" data-v="${ue(p)}">${ue(p)}</button>`).join(""));
    const f = i.value.trim();
    f && e.onCreate && !e.all().some((p) => p.toLowerCase() === f.toLowerCase()) && (h += `<button type="button" class="picker-item picker-create" data-create="1">+ Create "${ue(f)}"</button>`), h || (h = '<div class="picker-group">No match</div>'), a.innerHTML = h, a.querySelectorAll(".picker-item").forEach((p) => {
      p.onclick = async () => {
        if (p.dataset.create) {
          const v = i.value.trim();
          await e.onCreate(v) && c(v);
          return;
        }
        c(p.dataset.v);
      };
    });
  };
  i.oninput = u, i.onkeydown = (r) => {
    r.key === "Escape" && we(), r.key === "Enter" && a.querySelector(".picker-item")?.click();
  }, W.querySelector(".picker-close").onclick = we, W.onclick = (r) => {
    r.target === W && we();
  }, u(), setTimeout(() => i.focus(), 50);
}
function we() {
  W?.remove(), W = null;
}
const o = (s) => document.getElementById(s);
let z = null, ee = null, Be = 0, w = [], N = [], qe = null, re = 0, G = 0, fe = null, X = !0, Ee = localStorage.getItem("ufl.ghostOn") !== "0", Ae = null;
const me = (s, e) => localStorage.getItem(s) ?? e;
let Re = Math.max(1, Number(me("ufl.calloutEvery", "5"))), at = me("ufl.calloutOn", "1") === "1", rt = me("ufl.secBeep", "0") === "1", ot = me("ufl.secCount", "0") === "1", Me = null, Qe = -1;
const S = new _s(), U = new Ps(), te = new Ts(), V = new jt(o("chart")), ye = o("progressChart"), zs = {
  countdown: [{ key: "total", label: "seconds", def: 60 }],
  ramp: [{ key: "ramp", label: "ramp s", def: 5 }, { key: "hold", label: "hold s", def: 10 }],
  repeaters: [{ key: "reps", label: "reps", def: 6 }, { key: "hold", label: "on s", def: 10 }, { key: "rest", label: "off s", def: 20 }]
};
function ct() {
  const s = o("exercise").value || "Choose exercise", e = o("side").value, t = o("protocol").value;
  o("hdrExName").textContent = s, o("hdrExMeta").textContent = [e !== "both" ? e : "", t].filter(Boolean).join(" · ");
}
async function Ks(s, e) {
  const t = K();
  if (t) {
    if (!t.renameExercise(s, e)) return;
    w = t.exerciseNames();
  } else
    await Gt(s, e), w = await D.exercises();
  oe(), J(), Z(), await F();
}
async function Gt(s, e) {
  await D.renameExercise(s, e), N = await D.sets(), o("exercise").value === s && (oe(), o("exercise").value = e);
}
async function Gs() {
  Hs(), w = K()?.exerciseNames() ?? await D.exercises(), N = await D.sets(), oe(), Xt(), await F(), Z(), J(), nn(), as(), S.enabled = o("voiceOn").checked;
}
function et() {
  const s = /* @__PURE__ */ new Map();
  for (const e of N) s.set(e.exercise, Math.max(s.get(e.exercise) ?? 0, e.startedAt));
  for (const e of Object.keys(Yt)) {
    const t = e.split("|")[0];
    s.has(t) || s.set(t, 0);
  }
  return [...s.entries()].filter(([e]) => w.includes(e)).sort((e, t) => t[1] - e[1]).map(([e]) => e);
}
let Yt = {};
async function _t(s) {
  if (s = s.trim(), !s) return !1;
  if (!w.includes(s)) {
    const e = K();
    e ? (e.addExercise(s), w = e.exerciseNames()) : (w.push(s), await D.saveExercises(w));
  }
  return oe(), J(), !0;
}
function oe() {
  setTimeout(ct, 0);
  for (const t of ["exercise", "maxExercise"]) {
    const n = o(t), i = n.value;
    n.innerHTML = w.map((a) => `<option>${M(a)}</option>`).join(""), i && w.includes(i) && (n.value = i);
  }
  const s = o("histExercise"), e = s.value;
  s.innerHTML = '<option value="">All</option>' + w.map((t) => `<option>${M(t)}</option>`).join(""), s.value = e;
}
function Xt() {
  const s = o("protocol").value, e = o("params");
  e.innerHTML = (zs[s] ?? []).map((t) => `<label>${t.label}<input type="number" data-k="${t.key}" value="${t.def}" min="1" /></label>`).join(""), o("protocolHelp").textContent = je(s, ft()).describe;
}
function ft() {
  const s = {};
  return o("params").querySelectorAll("input").forEach((e) => s[e.dataset.k] = Number(e.value) || 1), s;
}
async function F() {
  const s = o("exercise").value, e = o("side").value, t = N.filter((i) => i.exercise === s && i.side === e);
  qe = t.length ? t[t.length - 1] : null, re = t.reduce((i, a) => Math.max(i, a.output), 0);
  const n = await D.maxes();
  Yt = n, G = n[`${s}|${e}`]?.kg ?? 0, o("zoneMax").textContent = G ? `(max ${G} kg → ${Ie().lo.toFixed(1)}–${Ie().hi.toFixed(1)} kg)` : "(no max yet — run a Max test)", o("sGoal").textContent = re ? $(re) : "–", V.opts.ghost = Ee ? qe?.samples ?? null : null, V.opts.zone = pt() ? Ie() : null, U.recording || (V.opts.marks = []);
}
function pt() {
  return o("zoneOn").checked && G > 0;
}
function Ie() {
  const s = Number(o("zoneLo").value) / 100 * G, e = Number(o("zoneHi").value) / 100 * G;
  return { lo: Math.min(s, e), hi: Math.max(s, e) };
}
async function lt(s) {
  z && await z.stop(), z = s, s.onStatus(Ne), s.onSample((e) => {
    Be = e.kg, Y === "live" && (o("statusKg").textContent = `${e.kg.toFixed(1)} kg`), U.push(e), Ys(e.kg);
  });
  try {
    await s.start(), o("btnTare").disabled = !1, o("btnStart").disabled = !1;
  } catch (e) {
    Ne("error"), o("statusText").textContent = e.message, alert("Connect failed: " + e.message);
  }
}
let Y = "idle";
function Jt() {
  return localStorage.getItem("ufl.keepAwake") !== "0";
}
function Zt() {
  if (!R.isNativePlatform()) return;
  (Jt() && (Y === "live" || Y === "scanning" || Y === "lost") ? Ot.keepAwake() : Ot.allowSleep()).catch(() => {
  });
}
function Ne(s) {
  Y = s, Zt(), o("statusDot").className = `dot ${s}`, o("statusPill").className = `pill ${s}`;
  const e = {
    idle: "Not connected",
    scanning: "Listening…",
    live: "",
    lost: "Lost — retrying…",
    error: "Error"
  };
  o("statusText").textContent = e[s], s !== "live" && (o("statusKg").textContent = "");
  const t = o("btnConnect");
  t.textContent = s === "live" || s === "scanning" ? "Disconnect" : "Connect scale";
}
function Qt() {
  return localStorage.getItem("ufl.autoConnect") !== "0";
}
let Ue = !1, ut = !1, tt = !1;
function dt() {
  if (!Qt() || !R.isNativePlatform() || z instanceof ke || ee || ut || Ue && Y === "error") return;
  Ue = !0;
  const s = new ke();
  s.onSeen = () => os(s), o("simPanel").classList.add("hidden"), lt(s);
}
let Rt = 0;
function Ys(s) {
  if (!U.recording || !pt()) {
    fe = null;
    return;
  }
  const e = te.running ? te.current() : null;
  if (e && e.cue === "rest") {
    fe = null;
    return;
  }
  const t = Ie(), n = s >= t.lo && s <= t.hi, i = o("phaseBanner");
  n && fe !== "in" && (fe = "in", i.classList.add("inzone"), i.classList.remove("outzone"), S.say("in zone")), !n && fe !== "out" && (fe = "out", i.classList.add("outzone"), i.classList.remove("inzone"), s > 2 && S.say(s < t.lo ? "more" : "ease off"), X && s > 2 && Date.now() - Rt > 1500 && (se.outZone(), Rt = Date.now()));
}
function Xs() {
  const s = o("protocol").value, e = je(s, ft());
  o("summary").classList.add("hidden"), U.start(), S.unlock(), Qs(), V.opts.marks = [], V.opts.peaks = [];
  const t = e.phases.length ? Vt(e).reduce((n, i) => n + i.seconds, 0) : 60;
  V.opts.windowS = Math.max(10, Math.ceil(t / 10) * 10), o("btnStart").classList.add("hidden"), o("btnStop").classList.remove("hidden"), ss(!0), e.phases.length ? (te.onPhase = Js, te.onTick = Zs, te.onDone = () => es(), te.start(e)) : (gt("work", "Free set — go", ""), S.say("Go", !0), X && se.go());
}
function Js(s, e, t) {
  gt(s.cue, s.name, s.seconds.toFixed(0)), s.cue === "work" ? (X && se.go(), S.say(s.name.replace(/\d+\/\d+/, ""), !0), V.opts.marks.push(U.elapsed())) : s.cue === "ramp" ? (X && se.go(), S.say("Build up", !0)) : (e > 0 && X && se.rest(), e > 0 && S.say(e === t - 1 ? "Done" : "Rest", !0));
}
let Mt = -1;
function Zs(s, e) {
  o("phaseTime").textContent = s.toFixed(s < 10 ? 1 : 0);
  const t = Math.ceil(s);
  t !== Mt && (Mt = t, t <= 3 && t > 0 && X && se.tick());
}
async function es() {
  te.stop(), ts();
  const s = o("exercise").value, e = o("side").value, t = o("protocol").value, n = U.finish({ exercise: s, side: e, mode: t });
  n && n.manualReps === void 0 && (n.reps?.length ?? 0) >= 2 && (n.manualReps = n.reps.length), o("btnStop").classList.add("hidden"), o("btnStart").classList.remove("hidden"), ss(!1), gt("idle", "Done", "—"), X && se.done(), n && (t === "maxtest" && n.peak > 0 && (await D.setMax(s, e, n.peak), S.say(`New max ${n.peak.toFixed(0)} kilos`, !0)), await D.saveSet(n), N.push(n), K()?.upsertForceSet(zt(n)), await en(n), await F(), Z(), J());
}
function Qs() {
  ts(), Qe = -1, Me = setInterval(() => {
    if (!U.recording) return;
    const s = Math.floor(U.elapsed());
    if (s === Qe || s === 0) return;
    Qe = s;
    const e = te.running ? te.current() : null;
    if (e && e.cue !== "work") return;
    const t = at && !pt() && s % Re === 0;
    (rt && X || t && X) && se.tick();
    const n = [];
    ot && n.push(Rs(s)), t && n.push(Be.toFixed(0)), n.length && (!t && S.speaking() || S.say(n.join(", "), t, !0));
  }, 100);
}
function ts() {
  Me && clearInterval(Me), Me = null;
}
function ss(s) {
  for (const e of ["exercise", "side", "protocol"]) o(e).disabled = s;
}
function gt(s, e, t) {
  const n = o("phaseBanner");
  n.className = `banner ${s}`, o("phaseName").textContent = e, o("phaseTime").textContent = t;
}
async function en(s) {
  const e = qe, t = await D.maxes(), n = s.side === "left" ? "right" : s.side === "right" ? "left" : null, i = [];
  i.push(_("Duration", `${s.durationS.toFixed(1)} s`)), i.push(_("Peak force", `${$(s.peak)} kg`, Le(s.peak, e?.peak))), i.push(_("Intensity (avg)", `${$(s.avg)} kg`, Le(s.avg, e?.avg))), i.push(_("Output (kg·s)", $(s.output), Le(s.output, e?.output))), i.push(_("Inroad", `${s.inroad.toFixed(0)}%`, s.inroad >= 30 ? '<span class="badge good">deep fatigue</span>' : s.inroad >= 15 ? '<span class="badge">moderate</span>' : '<span class="badge warn">shallow — stopped early?</span>')), re && i.push(_("vs. best output", `${(s.output / re * 100).toFixed(0)}%`, s.output > re ? '<span class="badge good">new best</span>' : "")), G && i.push(_("Peak as % of max", `${(s.peak / G * 100).toFixed(0)}%`));
  let a = "";
  if (s.reps && s.reps.length) {
    const r = Math.max(...s.reps.map((d) => d.peak));
    a = `<div class="muted" style="margin-top:8px">Reps: ${s.reps.length} · first ${$(s.reps[0].peak)} → last ${$(s.reps[s.reps.length - 1].peak)} kg · avg rep ${(s.reps.reduce((d, h) => d + h.durationS, 0) / s.reps.length).toFixed(1)} s</div>
      <div class="repbars">${s.reps.map((d) => `<div style="height:${Math.max(4, d.peak / r * 100)}%"><span>${d.peak.toFixed(0)}</span></div>`).join("")}</div>`;
    const l = s.mode === "critical" ? $s(s.reps) : null;
    l && (a += _("Critical force", `${$(l)} kg${G ? ` (${(l / G * 100).toFixed(0)}% of max)` : ""}`));
  }
  let c = "";
  if (n) {
    const r = t[`${s.exercise}|${s.side}`]?.kg, l = t[`${s.exercise}|${n}`]?.kg;
    if (r && l) {
      const d = (Math.abs(r - l) / Math.max(r, l) * 100).toFixed(0);
      c = _("Left/right gap", `${d}% (L ${$(s.side === "left" ? r : l)} / R ${$(s.side === "left" ? l : r)})`, Number(d) > 10 ? '<span class="badge warn">asymmetry</span>' : '<span class="badge good">balanced</span>');
    }
  }
  const u = o("summary");
  u.innerHTML = `<h4>${M(s.exercise)} · ${s.side} · ${s.mode}</h4>${i.join("")}${c}${a}
    ${ns(s, "sum")}`, u.classList.remove("hidden"), is(s, "sum", async () => {
    await F(), Z();
  });
}
function ns(s, e) {
  const t = Ce(de(s));
  return `<div class="editor">
      <label>Reps <input type="number" id="${e}Reps" min="1" step="1" inputmode="numeric" placeholder="1" value="${s.manualReps ?? ""}" /></label>
      <label>Date performed <input type="date" id="${e}Date" value="${t}" max="${Ce(Date.now())}" /></label>
      <label class="grow">Note <input type="text" id="${e}Note" placeholder="optional" value="${M(s.note ?? "")}" /></label>
      <button class="sm primary" id="${e}Save" type="button">Save</button>
      <span class="muted" id="${e}Msg">${s.reps?.length ? `auto-detected ${s.reps.length} — change it if that's wrong` : "blank reps = 1"}</span>
    </div>`;
}
function is(s, e, t) {
  const n = async () => {
    const i = Number(o(`${e}Reps`).value);
    s.manualReps = i > 0 ? Math.round(i) : void 0;
    const a = o(`${e}Date`).value;
    if (a) {
      const [u, r, l] = a.split("-").map(Number), d = new Date(s.startedAt);
      s.performedAt = new Date(u, r - 1, l, d.getHours(), d.getMinutes(), d.getSeconds()).getTime();
    }
    s.note = o(`${e}Note`).value.trim() || void 0, await D.updateSet(s), K()?.upsertForceSet(zt(s));
    const c = N.findIndex((u) => u.id === s.id);
    c >= 0 && (N[c] = s), o(`${e}Msg`).textContent = `saved · ${ge(s)} rep${ge(s) === 1 ? "" : "s"} · ${Ce(de(s))}`, await t();
  };
  o(`${e}Save`).onclick = n;
  for (const i of [`${e}Reps`, `${e}Date`, `${e}Note`]) o(i).onkeydown = (a) => {
    a.key === "Enter" && n();
  };
}
function _(s, e, t = "") {
  return `<div class="fl-line"><span>${s}</span><span>${e} ${t}</span></div>`;
}
function Le(s, e) {
  if (!e) return "";
  const t = (s - e) / e * 100;
  return `<span class="${t >= 0 ? "fl-d up" : "fl-d down"}">${t >= 0 ? "+" : ""}${t.toFixed(1)}%</span>`;
}
function as() {
  const s = U.current(), e = U.elapsed();
  if (o("liveKg").textContent = Be.toFixed(1), o("elapsed").textContent = cs(e), V.draw(s, e, Be), U.recording && s.length > 2) {
    const t = Ut(s);
    o("sPeak").textContent = $(t.peak), o("sAvg").textContent = $(t.avg), o("sOut").textContent = $(t.output), o("sInroad").textContent = `${t.inroad.toFixed(0)}%`;
    const n = qe;
    o("dPeak").innerHTML = Le(t.peak, n?.peak), o("dAvg").innerHTML = Le(t.avg, n?.avg), o("dOut").innerHTML = re ? `<span class="muted">${(t.output / re * 100).toFixed(0)}% of goal</span>` : "";
    const i = ht(s);
    V.opts.peaks = i.map((a) => ({ t: a.peakT ?? a.startS, kg: a.peak })), o("sReps").textContent = i.length ? String(i.length) : "–", o("dReps").textContent = i.length ? `last ${i[i.length - 1].peak.toFixed(0)} kg` : "";
  }
  requestAnimationFrame(as);
}
let be = null;
function Z() {
  const s = o("histExercise").value, e = N.filter((t) => !s || t.exercise === s).slice().sort((t, n) => de(n) - de(t) || n.startedAt - t.startedAt);
  o("histBody").innerHTML = e.map((t) => `<tr data-id="${t.id}" class="${be?.id === t.id ? "sel" : ""}">
      <td>${new Date(de(t)).toLocaleDateString(void 0, { month: "short", day: "numeric" })}</td>
      <td>${M(t.exercise)}${t.side !== "both" ? ` <small class="muted">${t.side[0].toUpperCase()}</small>` : ""}</td>
      <td>${t.mode}</td><td>${ge(t)}</td><td>${cs(t.durationS)}</td><td>${$(t.peak)}</td><td>${$(t.avg)}</td><td>${$(t.output)}</td><td>${t.inroad.toFixed(0)}%</td>
      <td><button data-del="${t.id}">✕</button></td></tr>`).join("") || '<tr><td colspan="10" class="muted">No sets yet.</td></tr>', o("histBody").querySelectorAll("tr[data-id]").forEach((t) => {
    t.onclick = (n) => {
      n.target.dataset.del || (be = N.find((i) => i.id === t.dataset.id) ?? null, Z(), tn());
    };
  }), o("histBody").querySelectorAll("button[data-del]").forEach((t) => {
    t.onclick = async () => {
      confirm("Delete this set?") && (await D.deleteSet(t.dataset.del), K()?.removeForceSet(`fl-${t.dataset.del}`), N = N.filter((n) => n.id !== t.dataset.del), be?.id === t.dataset.del && (be = null), Z(), await F());
    };
  }), sn(s ? e.slice().reverse() : []);
}
function tn() {
  const s = be, e = o("histDetail");
  if (!s) {
    e.classList.add("hidden");
    return;
  }
  e.classList.remove("hidden"), e.innerHTML = `<h4>${M(s.exercise)} · ${new Date(s.startedAt).toLocaleString()}</h4>
    <div class="chartwrap small"><canvas id="histCanvas"></canvas></div>
    ${_("Peak", `${$(s.peak)} kg`)}${_("Intensity", `${$(s.avg)} kg`)}${_("Output", $(s.output))}${_("Inroad", `${s.inroad.toFixed(0)}%`)}
    ${_("Reps (logged)", String(ge(s)))}
    ${s.reps?.length ? _("Auto-detected", `${s.reps.length} (${s.reps.map((n) => n.peak.toFixed(0)).join(", ")} kg)`) : ""}
    ${ns(s, "hist")}
    <div class="actions-inline" style="margin-top:8px"><button class="sm" id="btnUseGhost">Use as ghost trace</button><button class="sm ghost" id="btnSetCsv">Export samples CSV</button></div>`, is(s, "hist", async () => {
    Z(), await F();
  });
  const t = new jt(o("histCanvas"));
  t.opts.windowS = Math.max(10, Math.ceil(s.durationS / 10) * 10), t.opts.peaks = ht(s.samples).map((n) => ({ t: n.peakT ?? n.startS, kg: n.peak })), t.draw(s.samples, s.durationS, 0), o("btnUseGhost").onclick = () => {
    Ee = !0, localStorage.setItem("ufl.ghostOn", "1"), o("ghostOn").checked = !0, V.opts.ghost = s.samples, rs("train");
  }, o("btnSetCsv").onclick = () => it(`set-${s.id}.csv`, js(s), "text/csv");
}
function sn(s) {
  const e = o("progress");
  if (s.length < 2) {
    e.classList.add("hidden");
    return;
  }
  e.classList.remove("hidden");
  const t = Math.max(1, window.devicePixelRatio || 1), n = e.clientWidth - 12, i = 160;
  ye.width = n * t, ye.height = i * t, ye.style.width = `${n}px`, ye.style.height = `${i}px`;
  const a = ye.getContext("2d");
  a.setTransform(t, 0, 0, t, 0, 0), a.clearRect(0, 0, n, i);
  const c = getComputedStyle(document.getElementById("view-force") ?? document.documentElement), u = 36, r = 8, l = 10, d = 18, h = n - u - r, f = i - l - d, p = Math.max(10, ...s.map((x) => x.peak)) * 1.1, v = (x) => u + x / Math.max(1, s.length - 1) * h, y = (x) => l + f - x / p * f;
  a.strokeStyle = c.getPropertyValue("--grid"), a.fillStyle = c.getPropertyValue("--muted"), a.font = "10px system-ui", a.textAlign = "right";
  for (let x = 0; x <= 4; x++) {
    const H = p / 4 * x;
    a.beginPath(), a.moveTo(u, y(H)), a.lineTo(n - r, y(H)), a.stroke(), a.fillText(H.toFixed(0), u - 4, y(H) + 3);
  }
  const b = [["peak", c.getPropertyValue("--accent")], ["avg", c.getPropertyValue("--accent2")]];
  for (const [x, H] of b)
    a.strokeStyle = H, a.lineWidth = 2, a.beginPath(), s.forEach((B, j) => j ? a.lineTo(v(j), y(B[x])) : a.moveTo(v(j), y(B[x]))), a.stroke(), a.fillStyle = H, s.forEach((B, j) => {
      a.beginPath(), a.arc(v(j), y(B[x]), 3, 0, Math.PI * 2), a.fill();
    });
  a.fillStyle = c.getPropertyValue("--muted"), a.textAlign = "left", a.fillText("peak", u + 4, l + 10), a.fillStyle = c.getPropertyValue("--accent2"), a.fillText("intensity", u + 36, l + 10);
}
async function J() {
  const s = await D.maxes(), e = Object.entries(s).map(([t, n]) => {
    const [i, a] = t.split("|");
    return `<tr><td>${M(i)}</td><td>${a}</td><td>${$(n.kg)}</td><td>${new Date(n.at).toLocaleDateString()}</td><td><button data-mdel="${M(t)}">✕</button></td></tr>`;
  });
  o("maxBody").innerHTML = e.join("") || '<tr><td colspan="5" class="muted">No maxes yet.</td></tr>', o("maxBody").querySelectorAll("button[data-mdel]").forEach((t) => t.onclick = async () => {
    await D.deleteMax(t.dataset.mdel), J(), F();
  }), o("exList").innerHTML = w.map((t) => `<span>${M(t)}<button data-xren="${M(t)}" title="Rename">✎</button><button data-xdel="${M(t)}">✕</button></span>`).join(""), o("exList").querySelectorAll("button[data-xren]").forEach((t) => t.onclick = async () => {
    const n = t.dataset.xren, i = prompt(`Rename "${n}" to:`, n);
    !i || i.trim() === n || await Ks(n, i.trim());
  }), o("exList").querySelectorAll("button[data-xdel]").forEach((t) => t.onclick = async () => {
    const n = K();
    if (n) {
      if (!n.removeExercise(t.dataset.xdel)) {
        alert("Built-in Gym Log exercises can't be removed here.");
        return;
      }
      w = n.exerciseNames();
    } else
      w = w.filter((i) => i !== t.dataset.xdel), await D.saveExercises(w);
    oe(), J();
  });
}
function rs(s) {
  document.querySelectorAll(".fl-tabs button").forEach((e) => e.classList.toggle("active", e.dataset.tab === s)), document.querySelectorAll(".fl-tab").forEach((e) => e.classList.toggle("active", e.id === `tab-${s}`)), s === "train" && V.resize(), s === "history" && Z();
}
function nn() {
  document.querySelectorAll(".fl-tabs button").forEach((r) => r.onclick = () => rs(r.dataset.tab)), o("hdrExercise").onclick = () => {
    U.recording || Ws(o("exercise"));
  };
  for (const r of ["exercise", "side", "protocol"]) o(r).addEventListener("change", ct);
  ct(), o("btnConnect").onclick = async () => {
    if (z instanceof ke && (Y === "live" || Y === "scanning")) {
      await z.stop(), z = null, Ne("idle"), ut = !0;
      return;
    }
    ut = !1, o("simPanel").classList.add("hidden"), ee = null;
    const r = new ke();
    r.onSeen = () => os(r), lt(r);
  }, o("btnSim").onclick = () => {
    ee = new Cs(), ee.exact = o("simExact").checked, o("simPanel").classList.remove("hidden"), lt(ee);
  }, o("simExact").onchange = (r) => {
    const l = r.target.checked;
    ee && (ee.exact = l), o("simHelp").textContent = l ? "Reading tracks the slider exactly." : 'Slide up to "push", back to 0 to rest. Fatigue is simulated.';
  }, o("btnTare").onclick = () => z?.tare(), o("btnStart").onclick = Xs, o("camOn").checked = localStorage.getItem("ufl.camOn") === "1";
  const s = async () => {
    const r = o("camOn").checked;
    if (localStorage.setItem("ufl.camOn", r ? "1" : "0"), r) {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert("Camera not available here."), o("camOn").checked = !1;
        return;
      }
      Ae ?? (Ae = new Vs(o("camVideo")));
      try {
        await Ae.start(), o("camPip").classList.remove("hidden"), o("btnCamFlip").classList.remove("hidden");
      } catch (l) {
        alert("Camera failed: " + l.message + `
Allow the Camera permission for UY Force Lab in Android settings.`), o("camOn").checked = !1;
      }
    } else
      Ae?.stop(), o("camPip").classList.add("hidden"), o("btnCamFlip").classList.add("hidden");
  };
  o("camOn").onchange = s, o("camOn").checked && s(), o("btnCamFlip").onclick = () => Ae?.flip();
  const e = o("camPip"), t = localStorage.getItem("ufl.pipPos");
  if (t) {
    const [r, l] = t.split(",").map(Number);
    e.style.left = `${r}px`, e.style.top = `${l}px`;
  }
  let n = null;
  e.onpointerdown = (r) => {
    const l = e.getBoundingClientRect();
    n = { x: r.clientX, y: r.clientY, l: l.left, t: l.top, moved: !1 }, e.setPointerCapture(r.pointerId);
  }, e.onpointermove = (r) => {
    if (!n) return;
    const l = r.clientX - n.x, d = r.clientY - n.y;
    if (Math.abs(l) + Math.abs(d) > 6 && (n.moved = !0), !n.moved) return;
    const h = e.getBoundingClientRect(), f = Math.min(window.innerWidth - h.width, Math.max(0, n.l + l)), p = Math.min(window.innerHeight - h.height, Math.max(0, n.t + d));
    e.style.left = `${f}px`, e.style.top = `${p}px`;
  }, e.onpointerup = () => {
    if (n) {
      if (n.moved) {
        const r = e.getBoundingClientRect();
        localStorage.setItem("ufl.pipPos", `${Math.round(r.left)},${Math.round(r.top)}`);
      } else e.classList.toggle("large");
      n = null;
    }
  }, o("btnStop").onclick = es, o("simEffort").oninput = (r) => {
    const l = Number(r.target.value);
    ee && (ee.effort = l), o("simVal").textContent = String(l);
  }, o("exercise").onchange = F, Ze(o("exercise"), { recent: et, all: () => w, onCreate: _t }), Ze(o("maxExercise"), { recent: et, all: () => w, onCreate: _t }), Ze(o("histExercise"), { recent: et, all: () => w, allOption: { value: "", label: "All exercises" } }), o("btnNewEx").onclick = () => {
    o("newExBox").classList.remove("hidden"), o("newExName").focus();
  }, o("btnNewExCancel").onclick = () => {
    o("newExBox").classList.add("hidden"), o("newExName").value = "";
  };
  const i = async () => {
    const r = o("newExName").value.trim();
    if (r) {
      if (!w.includes(r)) {
        const l = K();
        l ? (l.addExercise(r), w = l.exerciseNames()) : (w.push(r), await D.saveExercises(w));
      }
      oe(), o("exercise").value = r, o("newExBox").classList.add("hidden"), o("newExName").value = "", J(), await F();
    }
  };
  o("btnNewExSave").onclick = i, o("newExName").onkeydown = (r) => {
    r.key === "Enter" && i();
  }, o("side").onchange = F, o("protocol").onchange = () => Xt(), o("params").oninput = () => o("protocolHelp").textContent = je(o("protocol").value, ft()).describe;
  for (const r of ["zoneOn", "zoneLo", "zoneHi"]) o(r).oninput = F;
  o("ghostOn").checked = Ee, o("ghostOn").onchange = (r) => {
    Ee = r.target.checked, localStorage.setItem("ufl.ghostOn", Ee ? "1" : "0"), F();
  }, o("histExercise").onchange = Z, o("btnCsv").onclick = () => it(`uy-force-lab-${Ft()}.csv`, Us(N), "text/csv"), o("btnJson").onclick = () => it(`uy-force-lab-${Ft()}.json`, JSON.stringify(N, null, 1), "application/json"), o("voiceOn").onchange = (r) => S.enabled = r.target.checked, o("keepAwake").checked = Jt(), o("keepAwake").onchange = (r) => {
    localStorage.setItem("ufl.keepAwake", r.target.checked ? "1" : "0"), Zt();
  }, o("autoConnect").checked = Qt(), o("autoConnect").onchange = (r) => {
    localStorage.setItem("ufl.autoConnect", r.target.checked ? "1" : "0"), Ue = !1, dt();
  }, document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "hidden") {
      z instanceof ke && !U.recording && (await z.stop(), z = null, Ne("idle"), tt = !0);
      return;
    }
    (tt || Y === "idle" || Y === "error") && (tt = !1, Ue = !1, dt());
  }), S.rate = Number(me("ufl.voiceRate", "1.2")) || 1.2, S.pitch = Number(me("ufl.voicePitch", "1")) || 1;
  const a = (r, l, d, h) => {
    const f = o(r);
    f.value = String(h), o(r + "Val").textContent = h.toFixed(1) + "×", f.oninput = () => {
      const p = Number(f.value);
      d(p), localStorage.setItem(l, String(p)), o(r + "Val").textContent = p.toFixed(1) + "×";
    };
  };
  a("voiceRate", "ufl.voiceRate", (r) => S.rate = r, S.rate), a("voicePitch", "ufl.voicePitch", (r) => S.pitch = r, S.pitch), o("beepOn").onchange = (r) => X = r.target.checked, o("calloutEvery").value = String(Re), o("calloutEvery").onchange = (r) => {
    Re = Math.max(1, Number(r.target.value) || 1), localStorage.setItem("ufl.calloutEvery", String(Re));
  };
  const c = (r, l, d, h) => {
    const f = o(r);
    f.checked = h, f.onchange = () => {
      d(f.checked), localStorage.setItem(l, f.checked ? "1" : "0");
    };
  };
  c("calloutOn", "ufl.calloutOn", (r) => at = r, at), c("secBeep", "ufl.secBeep", (r) => rt = r, rt), c("secCount", "ufl.secCount", (r) => ot = r, ot);
  let u = null;
  S.onSpeak = (r) => {
    const l = o("said");
    l.textContent = `🔊 ${r}`, l.classList.add("on"), u && clearTimeout(u), u = setTimeout(() => l.classList.remove("on"), 900);
  }, document.addEventListener("pointerdown", () => S.unlock(), { once: !0 }), document.addEventListener("visibilitychange", () => {
    document.visibilityState === "visible" && S.reset();
  }), o("btnTestVoice").onclick = async () => {
    S.reset();
    const r = o("voiceStatus");
    r.textContent = await S.status(), S.say("Force lab voice check, 1, 2, 3", !0);
  }, o("btnSetMax").onclick = async () => {
    const r = Number(o("maxKg").value);
    r && (await D.setMax(o("maxExercise").value, o("maxSide").value, r), o("maxKg").value = "", J(), F());
  }, o("btnAddEx").onclick = async () => {
    const r = o("newEx").value.trim();
    if (!(!r || w.includes(r))) {
      {
        const l = K();
        l ? (l.addExercise(r), w = l.exerciseNames()) : (w.push(r), await D.saveExercises(w));
      }
      o("newEx").value = "", oe(), J();
    }
  };
}
let It = 0;
function os(s) {
  const e = Date.now();
  if (e - It < 1e3 || o("tab-settings").classList.contains("active") === !1) return;
  It = e;
  const t = [...s.seen.values()].sort((n, i) => i.t - n.t).slice(0, 12);
  o("seenBody").innerHTML = t.map((n) => `<tr><td>${M(n.name || "(no name)")}<br><small class="muted">${M(n.id)}</small></td><td>${n.rssi}</td><td>${M(n.keys || "–")}</td><td style="white-space:normal;font-family:monospace;font-size:11px">${M(n.hex || "–")}</td><td>${n.kg === null ? "–" : n.kg.toFixed(2)}</td></tr>`).join("") || '<tr><td colspan="5" class="muted">Listening… nothing heard yet.</td></tr>';
}
function $(s) {
  return s >= 100 ? s.toFixed(0) : s.toFixed(1);
}
function cs(s) {
  const e = Math.floor(s / 60), t = Math.floor(s % 60);
  return `${e}:${t.toString().padStart(2, "0")}`;
}
function Ft() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function M(s) {
  return s.replace(/[&<>"]/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[e]);
}
Gs();
window.ForceLab = {
  onShow() {
    V.resize(), dt();
  },
  // called by the host after it renamed an exercise in its own data
  renameExercise(s, e) {
    Gt(s, e).then(async () => {
      w = K()?.exerciseNames() ?? w, oe(), J(), Z(), await F();
    });
  }
};
async function an(s, e, t) {
  let n;
  return Promise.race([
    s,
    new Promise((i, a) => {
      n = setTimeout(() => a(t), e);
    })
  ]).finally(() => clearTimeout(n));
}
class rn extends ie {
  constructor() {
    super(...arguments), this.deviceMap = /* @__PURE__ */ new Map(), this.discoveredDevices = /* @__PURE__ */ new Map(), this.scan = null, this.DEFAULT_CONNECTION_TIMEOUT = 1e4, this.onAdvertisementReceivedCallback = this.onAdvertisementReceived.bind(this), this.onDisconnectedCallback = this.onDisconnected.bind(this), this.onCharacteristicValueChangedCallback = this.onCharacteristicValueChanged.bind(this);
  }
  async initialize() {
    if (typeof navigator > "u" || !navigator.bluetooth)
      throw this.unavailable("Web Bluetooth API not available in this browser.");
    if (!await navigator.bluetooth.getAvailability())
      throw this.unavailable("No Bluetooth radio available.");
  }
  async isEnabled() {
    return { value: !0 };
  }
  async requestEnable() {
    throw this.unavailable("requestEnable is not available on web.");
  }
  async enable() {
    throw this.unavailable("enable is not available on web.");
  }
  async disable() {
    throw this.unavailable("disable is not available on web.");
  }
  async startEnabledNotifications() {
  }
  async stopEnabledNotifications() {
  }
  async isLocationEnabled() {
    throw this.unavailable("isLocationEnabled is not available on web.");
  }
  async openLocationSettings() {
    throw this.unavailable("openLocationSettings is not available on web.");
  }
  async openBluetoothSettings() {
    throw this.unavailable("openBluetoothSettings is not available on web.");
  }
  async openAppSettings() {
    throw this.unavailable("openAppSettings is not available on web.");
  }
  async setDisplayStrings() {
  }
  async requestDevice(e) {
    const t = this.getFilters(e), n = await navigator.bluetooth.requestDevice({
      filters: t.length ? t : void 0,
      optionalServices: e?.optionalServices,
      acceptAllDevices: t.length === 0
    });
    return this.deviceMap.set(n.id, n), this.getBleDevice(n);
  }
  async requestLEScan(e) {
    this.requestBleDeviceOptions = e;
    const t = this.getFilters(e);
    await this.stopLEScan(), this.discoveredDevices = /* @__PURE__ */ new Map(), navigator.bluetooth.removeEventListener("advertisementreceived", this.onAdvertisementReceivedCallback), navigator.bluetooth.addEventListener("advertisementreceived", this.onAdvertisementReceivedCallback), this.scan = await navigator.bluetooth.requestLEScan({
      filters: t.length ? t : void 0,
      acceptAllAdvertisements: t.length === 0,
      keepRepeatedDevices: e?.allowDuplicates
    });
  }
  onAdvertisementReceived(e) {
    var t, n, i;
    const a = e.device.id;
    this.deviceMap.set(a, e.device);
    const c = !this.discoveredDevices.has(a);
    if (!(!((t = this.requestBleDeviceOptions) === null || t === void 0) && t.serviceData && !this.matchesServiceDataFilter(e)) && (c || !((n = this.requestBleDeviceOptions) === null || n === void 0) && n.allowDuplicates)) {
      this.discoveredDevices.set(a, !0);
      const u = this.getBleDevice(e.device), r = {
        device: u,
        localName: u.name,
        rssi: e.rssi,
        txPower: e.txPower,
        manufacturerData: Lt(e.manufacturerData),
        serviceData: Lt(e.serviceData),
        uuids: (i = e.uuids) === null || i === void 0 ? void 0 : i.map(xs)
      };
      this.notifyListeners("onScanResult", r);
    }
  }
  async stopLEScan() {
    var e;
    !((e = this.scan) === null || e === void 0) && e.active && this.scan.stop(), this.scan = null;
  }
  async getDevices(e) {
    return { devices: (await navigator.bluetooth.getDevices()).filter((i) => e.deviceIds.includes(i.id)).map((i) => (this.deviceMap.set(i.id, i), this.getBleDevice(i))) };
  }
  async getConnectedDevices(e) {
    return { devices: (await navigator.bluetooth.getDevices()).filter((i) => {
      var a;
      return (a = i.gatt) === null || a === void 0 ? void 0 : a.connected;
    }).map((i) => (this.deviceMap.set(i.id, i), this.getBleDevice(i))) };
  }
  async getBondedDevices() {
    return {};
  }
  async connect(e) {
    var t, n;
    const i = this.getDeviceFromMap(e.deviceId);
    i.removeEventListener("gattserverdisconnected", this.onDisconnectedCallback), i.addEventListener("gattserverdisconnected", this.onDisconnectedCallback);
    const a = Symbol();
    if (i.gatt === void 0)
      throw new Error("No gatt server available.");
    try {
      const c = (t = e.timeout) !== null && t !== void 0 ? t : this.DEFAULT_CONNECTION_TIMEOUT;
      await an(i.gatt.connect(), c, a);
    } catch (c) {
      throw await ((n = i.gatt) === null || n === void 0 ? void 0 : n.disconnect()), c === a ? new Error("Connection timeout") : c;
    }
  }
  onDisconnected(e) {
    const n = `disconnected|${e.target.id}`;
    this.notifyListeners(n, null);
  }
  async createBond(e) {
    throw this.unavailable("createBond is not available on web.");
  }
  async isBonded(e) {
    throw this.unavailable("isBonded is not available on web.");
  }
  async disconnect(e) {
    var t;
    (t = this.getDeviceFromMap(e.deviceId).gatt) === null || t === void 0 || t.disconnect();
  }
  async getServices(e) {
    var t, n;
    const i = (n = await ((t = this.getDeviceFromMap(e.deviceId).gatt) === null || t === void 0 ? void 0 : t.getPrimaryServices())) !== null && n !== void 0 ? n : [], a = [];
    for (const c of i) {
      const u = await c.getCharacteristics(), r = [];
      for (const l of u)
        r.push({
          uuid: l.uuid,
          properties: this.getProperties(l),
          descriptors: await this.getDescriptors(l)
        });
      a.push({ uuid: c.uuid, characteristics: r });
    }
    return { services: a };
  }
  async getDescriptors(e) {
    try {
      return (await e.getDescriptors()).map((n) => ({
        uuid: n.uuid
      }));
    } catch {
      return [];
    }
  }
  getProperties(e) {
    return {
      broadcast: e.properties.broadcast,
      read: e.properties.read,
      writeWithoutResponse: e.properties.writeWithoutResponse,
      write: e.properties.write,
      notify: e.properties.notify,
      indicate: e.properties.indicate,
      authenticatedSignedWrites: e.properties.authenticatedSignedWrites,
      reliableWrite: e.properties.reliableWrite,
      writableAuxiliaries: e.properties.writableAuxiliaries
    };
  }
  async getCharacteristic(e) {
    var t;
    const n = await ((t = this.getDeviceFromMap(e.deviceId).gatt) === null || t === void 0 ? void 0 : t.getPrimaryService(e?.service));
    return n?.getCharacteristic(e?.characteristic);
  }
  async getDescriptor(e) {
    const t = await this.getCharacteristic(e);
    return t?.getDescriptor(e?.descriptor);
  }
  async discoverServices(e) {
    throw this.unavailable("discoverServices is not available on web.");
  }
  async getMtu(e) {
    throw this.unavailable("getMtu is not available on web.");
  }
  async requestConnectionPriority(e) {
    throw this.unavailable("requestConnectionPriority is not available on web.");
  }
  async readRssi(e) {
    throw this.unavailable("readRssi is not available on web.");
  }
  async read(e) {
    const t = await this.getCharacteristic(e);
    return { value: await t?.readValue() };
  }
  async write(e) {
    const t = await this.getCharacteristic(e);
    let n;
    typeof e.value == "string" ? n = xe(e.value) : n = e.value, await t?.writeValueWithResponse(We(n));
  }
  async writeWithoutResponse(e) {
    const t = await this.getCharacteristic(e);
    let n;
    typeof e.value == "string" ? n = xe(e.value) : n = e.value, await t?.writeValueWithoutResponse(We(n));
  }
  async readDescriptor(e) {
    const t = await this.getDescriptor(e);
    return { value: await t?.readValue() };
  }
  async writeDescriptor(e) {
    const t = await this.getDescriptor(e);
    let n;
    typeof e.value == "string" ? n = xe(e.value) : n = e.value, await t?.writeValue(We(n));
  }
  async startNotifications(e) {
    const t = await this.getCharacteristic(e);
    t?.removeEventListener("characteristicvaluechanged", this.onCharacteristicValueChangedCallback), t?.addEventListener("characteristicvaluechanged", this.onCharacteristicValueChangedCallback), await t?.startNotifications();
  }
  onCharacteristicValueChanged(e) {
    var t, n;
    const i = e.target, a = `notification|${(t = i.service) === null || t === void 0 ? void 0 : t.device.id}|${(n = i.service) === null || n === void 0 ? void 0 : n.uuid}|${i.uuid}`;
    this.notifyListeners(a, {
      value: i.value
    });
  }
  async stopNotifications(e) {
    const t = await this.getCharacteristic(e);
    await t?.stopNotifications();
  }
  getFilters(e) {
    var t, n;
    const i = [];
    for (const a of (t = e?.services) !== null && t !== void 0 ? t : [])
      i.push({
        services: [a],
        name: e?.name,
        namePrefix: e?.namePrefix
      });
    (e?.name || e?.namePrefix) && i.length === 0 && i.push({
      name: e.name,
      namePrefix: e.namePrefix
    });
    for (const a of (n = e?.manufacturerData) !== null && n !== void 0 ? n : [])
      i.push({
        manufacturerData: [a]
      });
    return i;
  }
  matchesServiceDataFilter(e) {
    var t;
    const n = (t = this.requestBleDeviceOptions) === null || t === void 0 ? void 0 : t.serviceData;
    if (!n || n.length === 0)
      return !0;
    if (!e.serviceData)
      return !1;
    for (const i of n) {
      const a = e.serviceData.get(i.serviceUuid);
      if (!a)
        continue;
      if (!i.dataPrefix)
        return !0;
      const c = new Uint8Array(a.buffer), u = i.dataPrefix;
      if (!(c.length < u.byteLength))
        if (i.mask) {
          const r = i.mask;
          let l = !0;
          for (let d = 0; d < u.byteLength; d++)
            if ((c[d] & r.getUint8(d)) !== (u.getUint8(d) & r.getUint8(d))) {
              l = !1;
              break;
            }
          if (l)
            return !0;
        } else {
          let r = !0;
          for (let l = 0; l < u.byteLength; l++)
            if (c[l] !== u.getUint8(l)) {
              r = !1;
              break;
            }
          if (r)
            return !0;
        }
    }
    return !1;
  }
  getDeviceFromMap(e) {
    const t = this.deviceMap.get(e);
    if (t === void 0)
      throw new Error('Device not found. Call "requestDevice", "requestLEScan" or "getDevices" first.');
    return t;
  }
  getBleDevice(e) {
    var t;
    return {
      deviceId: e.id,
      // use undefined instead of null if name is not available
      name: (t = e.name) !== null && t !== void 0 ? t : void 0
    };
  }
}
const on = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BluetoothLeWeb: rn
}, Symbol.toStringTag, { value: "Module" }));
class cn extends ie {
  constructor() {
    super(), this.speechSynthesis = null, "speechSynthesis" in window && (this.speechSynthesis = window.speechSynthesis, window.addEventListener("beforeunload", () => {
      this.stop();
    }));
  }
  async speak(e) {
    this.speechSynthesis || this.throwUnsupportedError(), await this.stop();
    const t = this.speechSynthesis, n = this.createSpeechSynthesisUtterance(e);
    return new Promise((i, a) => {
      n.onend = () => {
        i();
      }, n.onerror = (c) => {
        a(c);
      }, t.speak(n);
    });
  }
  async stop() {
    this.speechSynthesis || this.throwUnsupportedError(), this.speechSynthesis.cancel();
  }
  async getSupportedLanguages() {
    return { languages: this.getSpeechSynthesisVoices().map((i) => i.lang).filter((i, a, c) => c.indexOf(i) == a) };
  }
  async getSupportedVoices() {
    return { voices: this.getSpeechSynthesisVoices() };
  }
  async isLanguageSupported(e) {
    return { supported: (await this.getSupportedLanguages()).languages.includes(e.lang) };
  }
  async openInstall() {
    this.throwUnimplementedError();
  }
  createSpeechSynthesisUtterance(e) {
    const t = this.getSpeechSynthesisVoices(), n = new SpeechSynthesisUtterance(), { text: i, lang: a, rate: c, pitch: u, volume: r, voice: l } = e;
    return l !== void 0 && (n.voice = t[l]), r !== void 0 && (n.volume = r >= 0 && r <= 1 ? r : 1), c !== void 0 && (n.rate = c >= 0.1 && c <= 10 ? c : 1), u !== void 0 && (n.pitch = u >= 0 && u <= 2 ? u : 2), a && (n.lang = a), n.text = i, n;
  }
  getSpeechSynthesisVoices() {
    return this.speechSynthesis || this.throwUnsupportedError(), (!this.supportedVoices || this.supportedVoices.length < 1) && (this.supportedVoices = this.speechSynthesis.getVoices()), this.supportedVoices;
  }
  throwUnsupportedError() {
    throw this.unavailable("SpeechSynthesis API not available in this browser.");
  }
  throwUnimplementedError() {
    throw this.unimplemented("Not implemented on web.");
  }
}
const ln = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  TextToSpeechWeb: cn
}, Symbol.toStringTag, { value: "Module" }));
class un extends ie {
  constructor() {
    super(...arguments), this.wakeLock = null, this._isSupported = typeof navigator < "u" && "wakeLock" in navigator, this.handleVisibilityChange = () => {
      document.visibilityState === "visible" && this.keepAwake();
    };
  }
  async keepAwake() {
    this._isSupported || this.throwUnsupportedError(), this.wakeLock && await this.allowSleep(), this.wakeLock = await navigator.wakeLock.request("screen"), document.addEventListener("visibilitychange", this.handleVisibilityChange), document.addEventListener("fullscreenchange", this.handleVisibilityChange);
  }
  async allowSleep() {
    var e;
    this._isSupported || this.throwUnsupportedError(), (e = this.wakeLock) === null || e === void 0 || e.release(), this.wakeLock = null, document.removeEventListener("visibilitychange", this.handleVisibilityChange), document.removeEventListener("fullscreenchange", this.handleVisibilityChange);
  }
  async isSupported() {
    return {
      isSupported: this._isSupported
    };
  }
  async isKeptAwake() {
    return this._isSupported || this.throwUnsupportedError(), {
      isKeptAwake: !!this.wakeLock
    };
  }
  throwUnsupportedError() {
    throw this.unavailable("Screen Wake Lock API not available in this browser.");
  }
}
const dn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  KeepAwakeWeb: un
}, Symbol.toStringTag, { value: "Module" }));
class hn extends ie {
  constructor() {
    super(...arguments), this.group = "CapacitorStorage";
  }
  async configure({ group: e }) {
    typeof e == "string" && (this.group = e);
  }
  async get(e) {
    return { value: this.impl.getItem(this.applyPrefix(e.key)) };
  }
  async set(e) {
    this.impl.setItem(this.applyPrefix(e.key), e.value);
  }
  async remove(e) {
    this.impl.removeItem(this.applyPrefix(e.key));
  }
  async keys() {
    return { keys: this.rawKeys().map((t) => t.substring(this.prefix.length)) };
  }
  async clear() {
    for (const e of this.rawKeys())
      this.impl.removeItem(e);
  }
  async migrate() {
    var e;
    const t = [], n = [], i = "_cap_", a = Object.keys(this.impl).filter((c) => c.indexOf(i) === 0);
    for (const c of a) {
      const u = c.substring(i.length), r = (e = this.impl.getItem(c)) !== null && e !== void 0 ? e : "", { value: l } = await this.get({ key: u });
      typeof l == "string" ? n.push(u) : (await this.set({ key: u, value: r }), t.push(u));
    }
    return { migrated: t, existing: n };
  }
  async removeOld() {
    const e = "_cap_", t = Object.keys(this.impl).filter((n) => n.indexOf(e) === 0);
    for (const n of t)
      this.impl.removeItem(n);
  }
  get impl() {
    return window.localStorage;
  }
  get prefix() {
    return this.group === "NativeStorage" ? "" : `${this.group}.`;
  }
  rawKeys() {
    return Object.keys(this.impl).filter((e) => e.indexOf(this.prefix) === 0);
  }
  applyPrefix(e) {
    return this.prefix + e;
  }
}
const fn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PreferencesWeb: hn
}, Symbol.toStringTag, { value: "Module" }));
function Bt(s) {
  const e = s.split("/").filter((n) => n !== "."), t = [];
  return e.forEach((n) => {
    n === ".." && t.length > 0 && t[t.length - 1] !== ".." ? t.pop() : t.push(n);
  }), t.join("/");
}
function pn(s, e) {
  s = Bt(s), e = Bt(e);
  const t = s.split("/"), n = e.split("/");
  return s !== e && t.every((i, a) => i === n[a]);
}
class Ve extends ie {
  constructor() {
    super(...arguments), this.DB_VERSION = 1, this.DB_NAME = "Disc", this._writeCmds = ["add", "put", "delete"], this.downloadFile = async (e) => {
      var t, n;
      const i = qt(e, e.webFetchExtra), a = await fetch(e.url, i);
      let c;
      if (!e.progress)
        c = await a.blob();
      else if (!a?.body)
        c = new Blob();
      else {
        const r = a.body.getReader();
        let l = 0;
        const d = [], h = a.headers.get("content-type"), f = parseInt(a.headers.get("content-length") || "0", 10);
        for (; ; ) {
          const { done: y, value: b } = await r.read();
          if (y)
            break;
          d.push(b), l += b?.length || 0;
          const x = {
            url: e.url,
            bytes: l,
            contentLength: f
          };
          this.notifyListeners("progress", x);
        }
        const p = new Uint8Array(l);
        let v = 0;
        for (const y of d)
          typeof y > "u" || (p.set(y, v), v += y.length);
        c = new Blob([p.buffer], { type: h || void 0 });
      }
      return { path: (await this.writeFile({
        path: e.path,
        directory: (t = e.directory) !== null && t !== void 0 ? t : void 0,
        recursive: (n = e.recursive) !== null && n !== void 0 ? n : !1,
        data: c
      })).uri, blob: c };
    };
  }
  readFileInChunks(e, t) {
    throw this.unavailable("Method not implemented.");
  }
  async initDb() {
    if (this._db !== void 0)
      return this._db;
    if (!("indexedDB" in window))
      throw this.unavailable("This browser doesn't support IndexedDB");
    return new Promise((e, t) => {
      const n = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      n.onupgradeneeded = Ve.doUpgrade, n.onsuccess = () => {
        this._db = n.result, e(n.result);
      }, n.onerror = () => t(n.error), n.onblocked = () => {
        console.warn("db blocked");
      };
    });
  }
  static doUpgrade(e) {
    const n = e.target.result;
    switch (e.oldVersion) {
      case 0:
      case 1:
      default:
        n.objectStoreNames.contains("FileStorage") && n.deleteObjectStore("FileStorage"), n.createObjectStore("FileStorage", { keyPath: "path" }).createIndex("by_folder", "folder");
    }
  }
  async dbRequest(e, t) {
    const n = this._writeCmds.indexOf(e) !== -1 ? "readwrite" : "readonly";
    return this.initDb().then((i) => new Promise((a, c) => {
      const l = i.transaction(["FileStorage"], n).objectStore("FileStorage")[e](...t);
      l.onsuccess = () => a(l.result), l.onerror = () => c(l.error);
    }));
  }
  async dbIndexRequest(e, t, n) {
    const i = this._writeCmds.indexOf(t) !== -1 ? "readwrite" : "readonly";
    return this.initDb().then((a) => new Promise((c, u) => {
      const h = a.transaction(["FileStorage"], i).objectStore("FileStorage").index(e)[t](...n);
      h.onsuccess = () => c(h.result), h.onerror = () => u(h.error);
    }));
  }
  getPath(e, t) {
    const n = t !== void 0 ? t.replace(/^[/]+|[/]+$/g, "") : "";
    let i = "";
    return e !== void 0 && (i += "/" + e), t !== "" && (i += "/" + n), i;
  }
  async clear() {
    (await this.initDb()).transaction(["FileStorage"], "readwrite").objectStore("FileStorage").clear();
  }
  /**
   * Read a file from disk
   * @param options options for the file read
   * @return a promise that resolves with the read file data result
   */
  async readFile(e) {
    const t = this.getPath(e.directory, e.path), n = await this.dbRequest("get", [t]);
    if (n === void 0)
      throw Error("File does not exist.");
    return { data: n.content ? n.content : "" };
  }
  /**
   * Write a file to disk in the specified location on device
   * @param options options for the file write
   * @return a promise that resolves with the file write result
   */
  async writeFile(e) {
    const t = this.getPath(e.directory, e.path);
    let n = e.data;
    const i = e.encoding, a = e.recursive, c = await this.dbRequest("get", [t]);
    if (c && c.type === "directory")
      throw Error("The supplied path is a directory.");
    const u = t.substr(0, t.lastIndexOf("/"));
    if (await this.dbRequest("get", [u]) === void 0) {
      const h = u.indexOf("/", 1);
      if (h !== -1) {
        const f = u.substr(h);
        await this.mkdir({
          path: f,
          directory: e.directory,
          recursive: a
        });
      }
    }
    if (!i && !(n instanceof Blob) && (n = n.indexOf(",") >= 0 ? n.split(",")[1] : n, !this.isBase64String(n)))
      throw Error("The supplied data is not valid base64 content.");
    const l = Date.now(), d = {
      path: t,
      folder: u,
      type: "file",
      size: n instanceof Blob ? n.size : n.length,
      ctime: l,
      mtime: l,
      content: n
    };
    return await this.dbRequest("put", [d]), {
      uri: d.path
    };
  }
  /**
   * Append to a file on disk in the specified location on device
   * @param options options for the file append
   * @return a promise that resolves with the file write result
   */
  async appendFile(e) {
    const t = this.getPath(e.directory, e.path);
    let n = e.data;
    const i = e.encoding, a = t.substr(0, t.lastIndexOf("/")), c = Date.now();
    let u = c;
    const r = await this.dbRequest("get", [t]);
    if (r && r.type === "directory")
      throw Error("The supplied path is a directory.");
    if (await this.dbRequest("get", [a]) === void 0) {
      const h = a.indexOf("/", 1);
      if (h !== -1) {
        const f = a.substr(h);
        await this.mkdir({
          path: f,
          directory: e.directory,
          recursive: !0
        });
      }
    }
    if (!i && !this.isBase64String(n))
      throw Error("The supplied data is not valid base64 content.");
    if (r !== void 0) {
      if (r.content instanceof Blob)
        throw Error("The occupied entry contains a Blob object which cannot be appended to.");
      r.content !== void 0 && !i ? n = btoa(atob(r.content) + atob(n)) : n = r.content + n, u = r.ctime;
    }
    const d = {
      path: t,
      folder: a,
      type: "file",
      size: n.length,
      ctime: u,
      mtime: c,
      content: n
    };
    await this.dbRequest("put", [d]);
  }
  /**
   * Delete a file from disk
   * @param options options for the file delete
   * @return a promise that resolves with the deleted file data result
   */
  async deleteFile(e) {
    const t = this.getPath(e.directory, e.path);
    if (await this.dbRequest("get", [t]) === void 0)
      throw Error("File does not exist.");
    if ((await this.dbIndexRequest("by_folder", "getAllKeys", [IDBKeyRange.only(t)])).length !== 0)
      throw Error("Folder is not empty.");
    await this.dbRequest("delete", [t]);
  }
  /**
   * Create a directory.
   * @param options options for the mkdir
   * @return a promise that resolves with the mkdir result
   */
  async mkdir(e) {
    const t = this.getPath(e.directory, e.path), n = e.recursive, i = t.substr(0, t.lastIndexOf("/")), a = (t.match(/\//g) || []).length, c = await this.dbRequest("get", [i]), u = await this.dbRequest("get", [t]);
    if (a === 1)
      throw Error("Cannot create Root directory");
    if (u !== void 0)
      throw Error("Current directory does already exist.");
    if (!n && a !== 2 && c === void 0)
      throw Error("Parent directory must exist");
    if (n && a !== 2 && c === void 0) {
      const d = i.substr(i.indexOf("/", 1));
      await this.mkdir({
        path: d,
        directory: e.directory,
        recursive: n
      });
    }
    const r = Date.now(), l = {
      path: t,
      folder: i,
      type: "directory",
      size: 0,
      ctime: r,
      mtime: r
    };
    await this.dbRequest("put", [l]);
  }
  /**
   * Remove a directory
   * @param options the options for the directory remove
   */
  async rmdir(e) {
    const { path: t, directory: n, recursive: i } = e, a = this.getPath(n, t), c = await this.dbRequest("get", [a]);
    if (c === void 0)
      throw Error("Folder does not exist.");
    if (c.type !== "directory")
      throw Error("Requested path is not a directory");
    const u = await this.readdir({ path: t, directory: n });
    if (u.files.length !== 0 && !i)
      throw Error("Folder is not empty");
    for (const r of u.files) {
      const l = `${t}/${r.name}`;
      (await this.stat({ path: l, directory: n })).type === "file" ? await this.deleteFile({ path: l, directory: n }) : await this.rmdir({ path: l, directory: n, recursive: i });
    }
    await this.dbRequest("delete", [a]);
  }
  /**
   * Return a list of files from the directory (not recursive)
   * @param options the options for the readdir operation
   * @return a promise that resolves with the readdir directory listing result
   */
  async readdir(e) {
    const t = this.getPath(e.directory, e.path), n = await this.dbRequest("get", [t]);
    if (e.path !== "" && n === void 0)
      throw Error("Folder does not exist.");
    const i = await this.dbIndexRequest("by_folder", "getAllKeys", [IDBKeyRange.only(t)]);
    return { files: await Promise.all(i.map(async (c) => {
      let u = await this.dbRequest("get", [c]);
      return u === void 0 && (u = await this.dbRequest("get", [c + "/"])), {
        name: c.substring(t.length + 1),
        type: u.type,
        size: u.size,
        ctime: u.ctime,
        mtime: u.mtime,
        uri: u.path
      };
    })) };
  }
  /**
   * Return full File URI for a path and directory
   * @param options the options for the stat operation
   * @return a promise that resolves with the file stat result
   */
  async getUri(e) {
    const t = this.getPath(e.directory, e.path);
    let n = await this.dbRequest("get", [t]);
    return n === void 0 && (n = await this.dbRequest("get", [t + "/"])), {
      uri: n?.path || t
    };
  }
  /**
   * Return data about a file
   * @param options the options for the stat operation
   * @return a promise that resolves with the file stat result
   */
  async stat(e) {
    const t = this.getPath(e.directory, e.path);
    let n = await this.dbRequest("get", [t]);
    if (n === void 0 && (n = await this.dbRequest("get", [t + "/"])), n === void 0)
      throw Error("Entry does not exist.");
    return {
      name: n.path.substring(t.length + 1),
      type: n.type,
      size: n.size,
      ctime: n.ctime,
      mtime: n.mtime,
      uri: n.path
    };
  }
  /**
   * Rename a file or directory
   * @param options the options for the rename operation
   * @return a promise that resolves with the rename result
   */
  async rename(e) {
    await this._copy(e, !0);
  }
  /**
   * Copy a file or directory
   * @param options the options for the copy operation
   * @return a promise that resolves with the copy result
   */
  async copy(e) {
    return this._copy(e, !1);
  }
  async requestPermissions() {
    return { publicStorage: "granted" };
  }
  async checkPermissions() {
    return { publicStorage: "granted" };
  }
  /**
   * Function that can perform a copy or a rename
   * @param options the options for the rename operation
   * @param doRename whether to perform a rename or copy operation
   * @return a promise that resolves with the result
   */
  async _copy(e, t = !1) {
    let { toDirectory: n } = e;
    const { to: i, from: a, directory: c } = e;
    if (!i || !a)
      throw Error("Both to and from must be provided");
    n || (n = c);
    const u = this.getPath(c, a), r = this.getPath(n, i);
    if (u === r)
      return {
        uri: r
      };
    if (pn(u, r))
      throw Error("To path cannot contain the from path");
    let l;
    try {
      l = await this.stat({
        path: i,
        directory: n
      });
    } catch {
      const v = i.split("/");
      v.pop();
      const y = v.join("/");
      if (v.length > 0 && (await this.stat({
        path: y,
        directory: n
      })).type !== "directory")
        throw new Error("Parent directory of the to path is a file");
    }
    if (l && l.type === "directory")
      throw new Error("Cannot overwrite a directory with a file");
    const d = await this.stat({
      path: a,
      directory: c
    }), h = async (p, v, y) => {
      const b = this.getPath(n, p), x = await this.dbRequest("get", [b]);
      x.ctime = v, x.mtime = y, await this.dbRequest("put", [x]);
    }, f = d.ctime ? d.ctime : Date.now();
    switch (d.type) {
      case "file": {
        const p = await this.readFile({
          path: a,
          directory: c
        });
        t && await this.deleteFile({
          path: a,
          directory: c
        });
        let v;
        !(p.data instanceof Blob) && !this.isBase64String(p.data) && (v = Fe.UTF8);
        const y = await this.writeFile({
          path: i,
          directory: n,
          data: p.data,
          encoding: v
        });
        return t && await h(i, f, d.mtime), y;
      }
      case "directory": {
        if (l)
          throw Error("Cannot move a directory over an existing object");
        try {
          await this.mkdir({
            path: i,
            directory: n,
            recursive: !1
          }), t && await h(i, f, d.mtime);
        } catch {
        }
        const p = (await this.readdir({
          path: a,
          directory: c
        })).files;
        for (const v of p)
          await this._copy({
            from: `${a}/${v.name}`,
            to: `${i}/${v.name}`,
            directory: c,
            toDirectory: n
          }, t);
        t && await this.rmdir({
          path: a,
          directory: c
        });
      }
    }
    return {
      uri: r
    };
  }
  isBase64String(e) {
    try {
      return btoa(atob(e)) == e;
    } catch {
      return !1;
    }
  }
}
Ve._debug = !0;
const gn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  FilesystemWeb: Ve
}, Symbol.toStringTag, { value: "Module" }));
class mn extends ie {
  async canShare() {
    return typeof navigator > "u" || !navigator.share ? { value: !1 } : { value: !0 };
  }
  async share(e) {
    if (typeof navigator > "u" || !navigator.share)
      throw this.unavailable("Share API not available in this browser");
    return await navigator.share({
      title: e.title,
      text: e.text,
      url: e.url
    }), {};
  }
}
const vn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ShareWeb: mn
}, Symbol.toStringTag, { value: "Module" }));
