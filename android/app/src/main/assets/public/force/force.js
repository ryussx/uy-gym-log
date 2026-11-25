var it;
(function(n) {
  n[n.SCAN_MODE_LOW_POWER = 0] = "SCAN_MODE_LOW_POWER", n[n.SCAN_MODE_BALANCED = 1] = "SCAN_MODE_BALANCED", n[n.SCAN_MODE_LOW_LATENCY = 2] = "SCAN_MODE_LOW_LATENCY";
})(it || (it = {}));
var xt;
(function(n) {
  n[n.PHY_LE_1M = 1] = "PHY_LE_1M", n[n.PHY_LE_2M = 2] = "PHY_LE_2M", n[n.PHY_LE_CODED = 3] = "PHY_LE_CODED", n[n.PHY_LE_ALL_SUPPORTED = 255] = "PHY_LE_ALL_SUPPORTED";
})(xt || (xt = {}));
var St;
(function(n) {
  n[n.CONNECTION_PRIORITY_BALANCED = 0] = "CONNECTION_PRIORITY_BALANCED", n[n.CONNECTION_PRIORITY_HIGH = 1] = "CONNECTION_PRIORITY_HIGH", n[n.CONNECTION_PRIORITY_LOW_POWER = 2] = "CONNECTION_PRIORITY_LOW_POWER";
})(St || (St = {}));
/*! Capacitor: https://capacitorjs.com/ - MIT License */
var pe;
(function(n) {
  n.Unimplemented = "UNIMPLEMENTED", n.Unavailable = "UNAVAILABLE";
})(pe || (pe = {}));
class ze extends Error {
  constructor(e, t, s) {
    super(e), this.message = e, this.code = t, this.data = s;
  }
}
const hn = (n) => {
  var e, t;
  return n?.androidBridge ? "android" : !((t = (e = n?.webkit) === null || e === void 0 ? void 0 : e.messageHandlers) === null || t === void 0) && t.bridge ? "ios" : "web";
}, fn = (n) => {
  const e = n.CapacitorCustomPlatform || null, t = n.Capacitor || {}, s = t.Plugins = t.Plugins || {}, i = () => e !== null ? e.name : hn(n), a = () => i() !== "web", c = (h) => {
    const f = l.get(h);
    return !!(f?.platforms.has(i()) || u(h));
  }, u = (h) => {
    var f;
    return (f = t.PluginHeaders) === null || f === void 0 ? void 0 : f.find((p) => p.name === h);
  }, r = (h) => n.console.error(h), l = /* @__PURE__ */ new Map(), d = (h, f = {}) => {
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
        throw new ze(`"${h}" plugin is not implemented on ${v}`, pe.Unimplemented);
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
            throw new ze(`"${h}.${P}()" is not implemented on ${v}`, pe.Unimplemented);
        });
        return P === "addListener" && (L.remove = async () => T()), L;
      };
      return g.toString = () => `${P.toString()}() { [capacitor code] }`, Object.defineProperty(g, "name", {
        value: P,
        writable: !1,
        configurable: !1
      }), g;
    }, j = B("addListener"), q = B("removeListener"), F = (P, T) => {
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
            return y ? F : j;
          case "removeListener":
            return q;
          default:
            return B(T);
        }
      }
    });
    return s[h] = O, l.set(h, {
      name: h,
      proxy: O,
      platforms: /* @__PURE__ */ new Set([...Object.keys(f), ...y ? [v] : []])
    }), O;
  };
  return t.convertFileSrc || (t.convertFileSrc = (h) => h), t.getPlatform = i, t.handleError = r, t.isNativePlatform = a, t.isPluginAvailable = c, t.registerPlugin = d, t.Exception = ze, t.DEBUG = !!t.DEBUG, t.isLoggingEnabled = !!t.isLoggingEnabled, t;
}, pn = (n) => n.Capacitor = fn(n), M = /* @__PURE__ */ pn(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {}), se = M.registerPlugin;
class ie {
  constructor() {
    this.listeners = {}, this.retainedEventArguments = {}, this.windowListeners = {};
  }
  addListener(e, t) {
    let s = !1;
    this.listeners[e] || (this.listeners[e] = [], s = !0), this.listeners[e].push(t);
    const a = this.windowListeners[e];
    a && !a.registered && this.addWindowListener(a), s && this.sendRetainedArgumentsForEvent(e);
    const c = async () => this.removeListener(e, t);
    return Promise.resolve({ remove: c });
  }
  async removeAllListeners() {
    this.listeners = {};
    for (const e in this.windowListeners)
      this.removeWindowListener(this.windowListeners[e]);
    this.windowListeners = {};
  }
  notifyListeners(e, t, s) {
    const i = this.listeners[e];
    if (!i) {
      if (s) {
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
      handler: (s) => {
        this.notifyListeners(t, s);
      }
    };
  }
  unimplemented(e = "not implemented") {
    return new M.Exception(e, pe.Unimplemented);
  }
  unavailable(e = "not available") {
    return new M.Exception(e, pe.Unavailable);
  }
  async removeListener(e, t) {
    const s = this.listeners[e];
    if (!s)
      return;
    const i = s.indexOf(t);
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
    t && (delete this.retainedEventArguments[e], t.forEach((s) => {
      this.notifyListeners(e, s);
    }));
  }
}
const kt = (n) => encodeURIComponent(n).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape), Et = (n) => n.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class gn extends ie {
  async getCookies() {
    const e = document.cookie, t = {};
    return e.split(";").forEach((s) => {
      if (s.length <= 0)
        return;
      let [i, a] = s.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
      i = Et(i).trim(), a = Et(a).trim(), t[i] = a;
    }), t;
  }
  async setCookie(e) {
    try {
      const t = kt(e.key), s = kt(e.value), i = e.expires ? `; expires=${e.expires.replace("expires=", "")}` : "", a = (e.path || "/").replace("path=", ""), c = e.url != null && e.url.length > 0 ? `domain=${e.url}` : "";
      document.cookie = `${t}=${s || ""}${i}; path=${a}; ${c};`;
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
se("CapacitorCookies", {
  web: () => new gn()
});
const mn = async (n) => new Promise((e, t) => {
  const s = new FileReader();
  s.onload = () => {
    const i = s.result;
    e(i.indexOf(",") >= 0 ? i.split(",")[1] : i);
  }, s.onerror = (i) => t(i), s.readAsDataURL(n);
}), vn = (n = {}) => {
  const e = Object.keys(n);
  return Object.keys(n).map((i) => i.toLocaleLowerCase()).reduce((i, a, c) => (i[a] = n[e[c]], i), {});
}, wn = (n, e = !0) => n ? Object.entries(n).reduce((s, i) => {
  const [a, c] = i;
  let u, r;
  return Array.isArray(c) ? (r = "", c.forEach((l) => {
    u = e ? encodeURIComponent(l) : l, r += `${a}=${u}&`;
  }), r.slice(0, -1)) : (u = e ? encodeURIComponent(c) : c, r = `${a}=${u}`), `${s}&${r}`;
}, "").substr(1) : null, Ut = (n, e = {}) => {
  const t = Object.assign({ method: n.method || "GET", headers: n.headers }, e), i = vn(n.headers)["content-type"] || "";
  if (typeof n.data == "string")
    t.body = n.data;
  else if (i.includes("application/x-www-form-urlencoded")) {
    const a = new URLSearchParams();
    for (const [c, u] of Object.entries(n.data || {}))
      a.set(c, u);
    t.body = a.toString();
  } else if (i.includes("multipart/form-data") || n.data instanceof FormData) {
    const a = new FormData();
    if (n.data instanceof FormData)
      n.data.forEach((u, r) => {
        a.append(r, u);
      });
    else
      for (const u of Object.keys(n.data))
        a.append(u, n.data[u]);
    t.body = a;
    const c = new Headers(t.headers);
    c.delete("content-type"), t.headers = c;
  } else (i.includes("application/json") || typeof n.data == "object") && (t.body = JSON.stringify(n.data));
  return t;
};
class yn extends ie {
  /**
   * Perform an Http request given a set of options
   * @param options Options to build the HTTP request
   */
  async request(e) {
    const t = Ut(e, e.webFetchExtra), s = wn(e.params, e.shouldEncodeUrlParams), i = s ? `${e.url}?${s}` : e.url, a = await fetch(i, t), c = a.headers.get("content-type") || "";
    let { responseType: u = "text" } = a.ok ? e : {};
    c.includes("application/json") && (u = "json");
    let r, l;
    switch (u) {
      case "arraybuffer":
      case "blob":
        l = await a.blob(), r = await mn(l);
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
se("CapacitorHttp", {
  web: () => new yn()
});
var Lt;
(function(n) {
  n.Dark = "DARK", n.Light = "LIGHT", n.Default = "DEFAULT";
})(Lt || (Lt = {}));
var Ct;
(function(n) {
  n.StatusBar = "StatusBar", n.NavigationBar = "NavigationBar";
})(Ct || (Ct = {}));
class bn extends ie {
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
se("SystemBars", {
  web: () => new bn()
});
function xn(n) {
  return new DataView(Uint8Array.from(n).buffer);
}
function Sn(n) {
  return Array.from(new Uint8Array(n.buffer, n.byteOffset, n.byteLength));
}
function kn(n) {
  return `0000${n.toString(16).padStart(4, "0")}-0000-1000-8000-00805f9b34fb`;
}
function Se(n) {
  const e = [];
  let t, s, i = 1, a = 0;
  for (t = 0; t < n.length; t++)
    s = n.charCodeAt(t), (s > 47 && s < 58 || s > 64 && s < 71 || s > 96 && s < 103) && (a = a << 4 ^ (s > 64 ? s + 9 : s) & 15, (i ^= 1) && e.push(a & 255));
  return xn(e);
}
function ke(n) {
  return Sn(n).map((e) => {
    let t = e.toString(16);
    return t.length == 1 && (t = "0" + t), t;
  }).join("");
}
function En(n) {
  if (typeof n == "string")
    return n;
  if (typeof n == "number")
    return kn(n);
  throw new Error("Invalid UUID");
}
function Pt(n) {
  const e = {};
  if (n)
    return n.forEach((t, s) => {
      e[s.toString()] = t;
    }), e;
}
function Dt(n) {
  if (n !== void 0) {
    if (typeof n == "string") {
      const e = Se(n);
      return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
    }
    return n instanceof DataView ? new Uint8Array(n.buffer, n.byteOffset, n.byteLength) : n;
  }
}
function Oe(n) {
  if (n !== void 0)
    return n instanceof DataView ? ke(n) : ke(new DataView(n.buffer, n.byteOffset, n.byteLength));
}
function Ke(n) {
  if (typeof SharedArrayBuffer < "u" && n.buffer instanceof SharedArrayBuffer) {
    const t = new Uint8Array(n.buffer, n.byteOffset, n.byteLength).slice().buffer;
    return new DataView(t);
  }
  return n;
}
const m = se("BluetoothLe", {
  web: () => Promise.resolve().then(() => hs).then((n) => new n.BluetoothLeWeb())
}), Ln = () => {
  let n = Promise.resolve();
  return (e) => new Promise((t, s) => {
    n = n.then(() => e()).then(t).catch(s);
  });
};
function Ge(n) {
  return n ? Ln() : (e) => e();
}
function C(n) {
  if (typeof n != "string")
    throw new Error(`Invalid UUID type ${typeof n}. Expected string.`);
  if (n = n.toLowerCase(), !(n.search(/^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/) >= 0))
    throw new Error(`Invalid UUID format ${n}. Expected 128 bit string (e.g. "0000180d-0000-1000-8000-00805f9b34fb").`);
  return n;
}
class Cn {
  constructor() {
    this.scanListener = null, this.eventListeners = /* @__PURE__ */ new Map(), this.queue = Ge(!0);
  }
  enableQueue() {
    this.queue = Ge(!0);
  }
  disableQueue() {
    this.queue = Ge(!1);
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
      const s = "onEnabledChanged";
      await ((t = this.eventListeners.get(s)) === null || t === void 0 ? void 0 : t.remove());
      const i = await m.addListener(s, (a) => {
        e(a.value);
      });
      this.eventListeners.set(s, i), await m.startEnabledNotifications();
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
      var s;
      await ((s = this.scanListener) === null || s === void 0 ? void 0 : s.remove()), this.scanListener = await m.addListener("onScanResult", (i) => {
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
  async connect(e, t, s) {
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
      await m.connect(Object.assign({ deviceId: e }, s));
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
      const s = await m.readRssi({ deviceId: e });
      return parseFloat(s.value);
    });
  }
  async read(e, t, s, i) {
    return t = C(t), s = C(s), await this.queue(async () => {
      const c = await m.read(Object.assign({
        deviceId: e,
        service: t,
        characteristic: s
      }, i));
      return this.convertValue(c.value);
    });
  }
  async write(e, t, s, i, a) {
    return t = C(t), s = C(s), this.queue(async () => {
      if (!i?.buffer)
        throw new Error("Invalid data.");
      let c = i;
      M.getPlatform() !== "web" && (c = ke(i)), await m.write(Object.assign({
        deviceId: e,
        service: t,
        characteristic: s,
        value: c
      }, a));
    });
  }
  async writeWithoutResponse(e, t, s, i, a) {
    t = C(t), s = C(s), await this.queue(async () => {
      if (!i?.buffer)
        throw new Error("Invalid data.");
      let c = i;
      M.getPlatform() !== "web" && (c = ke(i)), await m.writeWithoutResponse(Object.assign({
        deviceId: e,
        service: t,
        characteristic: s,
        value: c
      }, a));
    });
  }
  async readDescriptor(e, t, s, i, a) {
    return t = C(t), s = C(s), i = C(i), await this.queue(async () => {
      const u = await m.readDescriptor(Object.assign({
        deviceId: e,
        service: t,
        characteristic: s,
        descriptor: i
      }, a));
      return this.convertValue(u.value);
    });
  }
  async writeDescriptor(e, t, s, i, a, c) {
    return t = C(t), s = C(s), i = C(i), this.queue(async () => {
      if (!a?.buffer)
        throw new Error("Invalid data.");
      let u = a;
      M.getPlatform() !== "web" && (u = ke(a)), await m.writeDescriptor(Object.assign({
        deviceId: e,
        service: t,
        characteristic: s,
        descriptor: i,
        value: u
      }, c));
    });
  }
  async startNotifications(e, t, s, i, a) {
    t = C(t), s = C(s), await this.queue(async () => {
      var c;
      const u = `notification|${e}|${t}|${s}`;
      await ((c = this.eventListeners.get(u)) === null || c === void 0 ? void 0 : c.remove());
      const r = await m.addListener(u, (l) => {
        i(this.convertValue(l?.value));
      });
      this.eventListeners.set(u, r), await m.startNotifications(Object.assign({
        deviceId: e,
        service: t,
        characteristic: s
      }, a));
    });
  }
  async stopNotifications(e, t, s) {
    t = C(t), s = C(s), await this.queue(async () => {
      var i;
      const a = `notification|${e}|${t}|${s}`;
      await ((i = this.eventListeners.get(a)) === null || i === void 0 ? void 0 : i.remove()), this.eventListeners.delete(a), await m.stopNotifications({
        deviceId: e,
        service: t,
        characteristic: s
      });
    });
  }
  validateRequestBleDeviceOptions(e) {
    return e = Object.assign({}, e), e.services && (e.services = e.services.map(C)), e.optionalServices && (e.optionalServices = e.optionalServices.map(C)), e.serviceData && M.getPlatform() !== "web" && (e.serviceData = e.serviceData.map((t) => Object.assign(Object.assign({}, t), { serviceUuid: C(t.serviceUuid), dataPrefix: Oe(t.dataPrefix), mask: Oe(t.mask) }))), e.manufacturerData && (M.getPlatform() !== "web" ? e.manufacturerData = e.manufacturerData.map((t) => Object.assign(Object.assign({}, t), { dataPrefix: Oe(t.dataPrefix), mask: Oe(t.mask) })) : e.manufacturerData = e.manufacturerData.map((t) => Object.assign(Object.assign({}, t), { dataPrefix: Dt(t.dataPrefix), mask: Dt(t.mask) }))), e;
  }
  convertValue(e) {
    return typeof e == "string" ? Se(e) : e === void 0 ? new DataView(new ArrayBuffer(0)) : e;
  }
  convertObject(e) {
    if (e === void 0)
      return;
    const t = {};
    for (const s of Object.keys(e))
      t[s] = this.convertValue(e[s]);
    return t;
  }
}
const he = new Cn(), Ye = 256, Xe = 10, Pn = 4e3;
class jt {
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
    this.setStatus("live"), this.sampleFns.forEach((s) => s(t)), this.lostTimer && clearTimeout(this.lostTimer), this.lostTimer = setTimeout(() => this.setStatus("lost"), Pn);
  }
  clearLost() {
    this.lostTimer && clearTimeout(this.lostTimer), this.lostTimer = null;
  }
}
function $t(n) {
  let e = "";
  for (let t = 0; t < n.byteLength; t++) e += n.getUint8(t).toString(16).padStart(2, "0") + " ";
  return e.trim();
}
function Ot(n, e) {
  let t = 0;
  for (; t < n.byteLength; ) {
    const s = n.getUint8(t);
    if (!s) break;
    if (n.getUint8(t + 1) === 255 && s >= 3) {
      const a = n.getUint8(t + 2) | n.getUint8(t + 3) << 8;
      if (e === void 0 || a === e) return new DataView(n.buffer, n.byteOffset + t + 4, s - 3);
    }
    t += s + 1;
  }
}
function Dn(n) {
  return n.byteLength < Xe + 2 ? null : (n.getUint8(Xe) << 8 | n.getUint8(Xe + 1)) / 100;
}
class Ee extends jt {
  constructor() {
    super(...arguments), this.name = "WeiHeng scale", this.scanning = !1, this.seen = /* @__PURE__ */ new Map(), this.onSeen = () => {
    }, this.lastScanStart = 0, this.healTimer = null, this.lastPacketAt = 0, this.restarts = 0;
  }
  async start() {
    if (!M.isNativePlatform())
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
      { allowDuplicates: !0, scanMode: it.SCAN_MODE_LOW_LATENCY },
      (e) => {
        const t = e.localName ?? e.device.name ?? "", s = e.manufacturerData ?? {}, i = Object.keys(s);
        let a = s[String(Ye)] ?? s[Ye.toString(16)];
        !a && /^(IF_|WH-|WEIHENG)/i.test(t) && i.length && (a = s[i[0]]), !a && e.rawAdvertisement && (a = Ot(e.rawAdvertisement, Ye) ?? (/^IF_/i.test(t) ? Ot(e.rawAdvertisement) : void 0));
        const c = a ? Dn(a) : null, u = { id: e.device.deviceId, name: t, rssi: e.rssi ?? 0, keys: i.join(","), hex: a ? $t(a) : e.rawAdvertisement ? $t(e.rawAdvertisement).slice(0, 60) : "", kg: c, t: Date.now() };
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
class $n extends jt {
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
    const t = (Math.random() - 0.5) * Math.max(0.3, this.current * 0.03), s = Math.max(0, Math.round((this.current + t) * 100) / 100);
    this.emitRaw(s);
  }
}
const On = { both: "", left: "Left", right: "Right" }, Tn = { complete: "", concentric: "Concentric", eccentric: "Eccentric" };
function ve(n, e, t) {
  const s = [On[e] ?? "", Tn[t ?? "complete"] ?? ""].filter(Boolean);
  return s.length ? `${n} — ${s.join(", ")}` : n;
}
function Pe(n, e, t) {
  const s = t ?? "complete";
  return s === "complete" ? `${n}|${e}` : `${n}|${e}|${s}`;
}
function An(n, e, t, s) {
  return n.exercise === e && n.side === t && (n.contraction ?? "complete") === (s ?? "complete");
}
function ge(n) {
  return n.manualReps && n.manualReps > 0 ? Math.round(n.manualReps) : 1;
}
function de(n) {
  return n.performedAt ?? n.startedAt;
}
const Me = 2;
class _n {
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
    const s = Vt(t);
    return {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      exercise: e.exercise,
      side: e.side,
      contraction: e.contraction ?? "complete",
      mode: e.mode,
      startedAt: this.t0,
      durationS: t[t.length - 1].t,
      samples: t,
      ...s,
      reps: pt(t)
    };
  }
}
function Vt(n) {
  let e = 0, t = 0, s = 0;
  for (let u = 0; u < n.length; u++) {
    const r = Math.max(0, n[u].kg);
    e = Math.max(e, r), t += r, u > 0 && (s += r * (n[u].t - n[u - 1].t));
  }
  const i = t / n.length, a = n.filter((u) => u.kg > Me);
  let c = 0;
  if (a.length >= 10) {
    const u = Math.max(3, Math.floor(a.length * 0.2)), r = Math.max(...a.slice(0, u).map((d) => d.kg)), l = Math.max(...a.slice(-u).map((d) => d.kg));
    c = r > 0 ? Math.max(0, (r - l) / r * 100) : 0;
  }
  return { peak: A(e), avg: A(i), output: A(s), inroad: A(c) };
}
function pt(n) {
  if (n.length < 5) return [];
  const e = Math.max(...n.map((l) => l.kg));
  if (e < Me * 2) return [];
  const t = Math.max(Me, e * 0.35), s = Math.max(Me * 0.5, e * 0.2), i = [];
  let a = !1, c = 0, u = 0, r = 0;
  for (const l of n)
    !a && l.kg >= t ? (a = !0, c = l.t, u = l.kg, r = l.t) : a && (l.kg > u && (u = l.kg, r = l.t), l.kg <= s && (l.t - c >= 0.6 && i.push({ index: i.length + 1, peak: A(u), peakT: A(r), startS: A(c), endS: A(l.t), durationS: A(l.t - c) }), a = !1));
  if (a) {
    const l = n[n.length - 1].t;
    l - c >= 0.6 && i.push({ index: i.length + 1, peak: A(u), peakT: A(r), startS: A(c), endS: A(l), durationS: A(l - c) });
  }
  return i.length >= 2 ? i : [];
}
function Rn(n) {
  if (n.length < 6) return null;
  const e = n.slice(-Math.max(3, Math.floor(n.length / 3)));
  return A(e.reduce((t, s) => t + s.peak, 0) / e.length);
}
function A(n) {
  return Math.round(n * 100) / 100;
}
class Ht {
  constructor(e) {
    this.canvas = e, this.dpr = Math.max(1, window.devicePixelRatio || 1), this.opts = { windowS: 60, zone: null, ghost: null, marks: [] }, this.last = null, this.ctx = e.getContext("2d"), this.resize(), new ResizeObserver(() => this.resize()).observe(e.parentElement ?? e);
  }
  resize() {
    const t = (this.canvas.parentElement ?? this.canvas).clientWidth || 320, s = Math.max(220, Math.min(380, Math.round(t * 0.6)));
    this.canvas.width = t * this.dpr, this.canvas.height = s * this.dpr, this.canvas.style.width = `${t}px`, this.canvas.style.height = `${s}px`, this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0), this.last && this.render(...this.last);
  }
  draw(e, t, s) {
    this.last = [e, t, s], this.render(e, t, s);
  }
  render(e, t, s) {
    const { ctx: i } = this, a = this.canvas.width / this.dpr, c = this.canvas.height / this.dpr, u = 42, r = 12, l = 12, d = 24, h = a - u - r, f = c - l - d, p = getComputedStyle(document.getElementById("view-force") ?? document.documentElement), v = p.getPropertyValue("--muted").trim() || "#888", y = p.getPropertyValue("--grid").trim() || "#333", b = p.getPropertyValue("--accent").trim() || "#e8552f", x = p.getPropertyValue("--ghost").trim() || "#7a7a7a", H = p.getPropertyValue("--zone").trim() || "rgba(60,180,90,0.18)";
    i.clearRect(0, 0, a, c);
    const B = Math.max(this.opts.windowS, Math.ceil(t / 10) * 10 || 10), j = this.opts.ghost ?? [];
    let q = 10;
    for (const g of e) q = Math.max(q, g.kg);
    for (const g of j) q = Math.max(q, g.kg);
    this.opts.zone && (q = Math.max(q, this.opts.zone.hi)), q = Mn(q * 1.1);
    const F = (g) => u + g / B * h, O = (g) => l + f - Math.max(0, g) / q * f;
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
      const k = F(g);
      i.beginPath(), i.moveTo(k, l), i.lineTo(k, l + f), i.stroke(), i.fillText(In(g), k, l + f + 6);
    }
    if (this.opts.marks?.length) {
      i.strokeStyle = x, i.setLineDash([3, 4]);
      for (const g of this.opts.marks)
        i.beginPath(), i.moveTo(F(g), l), i.lineTo(F(g), l + f), i.stroke();
      i.setLineDash([]);
    }
    if (j.length > 1 && (i.strokeStyle = x, i.lineWidth = 1.5, i.globalAlpha = 0.55, i.beginPath(), j.forEach((g, k) => k ? i.lineTo(F(g.t), O(g.kg)) : i.moveTo(F(g.t), O(g.kg))), i.stroke(), i.globalAlpha = 1), e.length > 1) {
      i.strokeStyle = b, i.lineWidth = 2.5, i.lineJoin = "round", i.beginPath(), e.forEach((L, E) => E ? i.lineTo(F(L.t), O(L.kg)) : i.moveTo(F(L.t), O(L.kg))), i.stroke();
      const g = e[e.length - 1];
      i.lineTo(F(g.t), O(0)), i.lineTo(F(e[0].t), O(0)), i.closePath(), i.fillStyle = b, i.globalAlpha = 0.12, i.fill(), i.globalAlpha = 1;
      const k = this.opts.peaks ?? [];
      if (k.length) {
        const L = Math.max(...k.map((E) => E.kg));
        i.font = "bold 11px system-ui, sans-serif", i.textAlign = "center", i.textBaseline = "bottom";
        for (const E of k) {
          const ce = F(E.t), le = O(E.kg);
          i.fillStyle = E.kg === L ? b : "#ecebe6", i.beginPath(), i.arc(ce, le, 3.5, 0, Math.PI * 2), i.fill();
          const wt = E.kg.toFixed(0), $e = i.measureText(wt).width + 8, yt = Math.min(Math.max(ce, u + $e / 2), u + h - $e / 2), bt = Math.max(l + 14, le - 6);
          i.fillStyle = E.kg === L ? b : "rgba(40,42,48,0.92)", i.fillRect(yt - $e / 2, bt - 14, $e, 14), i.fillStyle = "#fff", i.fillText(wt, yt, bt - 1);
        }
        i.textAlign = "left", i.textBaseline = "alphabetic";
      }
      i.fillStyle = b, i.beginPath(), i.arc(F(g.t), O(g.kg), 4, 0, Math.PI * 2), i.fill();
    } else s > 0 && (i.fillStyle = b, i.beginPath(), i.arc(F(0), O(s), 4, 0, Math.PI * 2), i.fill());
  }
}
function Mn(n) {
  const e = [10, 20, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500];
  for (const t of e) if (n <= t) return t;
  return Math.ceil(n / 100) * 100;
}
function In(n) {
  const e = Math.floor(n / 60), t = n % 60;
  return `${e}:${t.toString().padStart(2, "0")}`;
}
function He(n, e = {}) {
  const t = e.hold ?? 10, s = e.rest ?? 20, i = e.reps ?? 6, a = e.ramp ?? 5, c = e.total ?? 60;
  switch (n) {
    case "free":
      return { id: n, label: "Free set", describe: "Open-ended. Start, work, stop.", phases: [] };
    case "countdown":
      return {
        id: n,
        label: `Countdown ${c}s`,
        describe: "One continuous max effort for the whole timer — the ARX protocol.",
        phases: [{ name: "Get ready", seconds: 3, cue: "rest" }, { name: "GO — max effort", seconds: c, cue: "work" }]
      };
    case "ramp":
      return {
        id: n,
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
        id: n,
        label: `Repeaters ${i}×(${t}s on/${s}s off)`,
        describe: "Repeated holds. Per-rep peaks give the fatigue curve; long sets give critical force.",
        phases: [{ name: "Get ready", seconds: 3, cue: "rest" }, { name: "PULL", seconds: t, cue: "work" }, { name: "Rest", seconds: s, cue: "rest" }],
        repeat: i
      };
    case "maxtest":
      return {
        id: n,
        label: "Max test (3 efforts)",
        describe: "Three 5-second max efforts with 60s rest. Best one becomes your max.",
        phases: [{ name: "Get ready", seconds: 5, cue: "rest" }, { name: "MAX EFFORT", seconds: 5, cue: "work" }, { name: "Rest", seconds: 60, cue: "rest" }],
        repeat: 3
      };
    case "critical":
      return {
        id: n,
        label: "Critical force (7s/3s ×24)",
        describe: "7s on, 3s off, 24 reps. The plateau at the end is the force you can sustain.",
        phases: [{ name: "Get ready", seconds: 3, cue: "rest" }, { name: "PULL", seconds: 7, cue: "work" }, { name: "Off", seconds: 3, cue: "rest" }],
        repeat: 24
      };
    default:
      return He("free");
  }
}
function Wt(n) {
  if (!n.repeat || n.phases.length < 2) return n.phases;
  const [e, ...t] = n.phases, s = [e];
  for (let i = 0; i < n.repeat; i++)
    for (const a of t)
      i === n.repeat - 1 && a === t[t.length - 1] && a.cue === "rest" || s.push({ ...a, name: t.length > 1 && a.cue !== "rest" ? `${a.name} ${i + 1}/${n.repeat}` : a.name });
  return s;
}
class Fn {
  constructor() {
    this.timeline = [], this.idx = -1, this.phaseStart = 0, this.timer = null, this.running = !1, this.onPhase = () => {
    }, this.onTick = () => {
    }, this.onDone = () => {
    };
  }
  start(e) {
    this.timeline = Wt(e), this.idx = -1, this.running = !0, this.next(), this.timer = setInterval(() => this.tick(), 100);
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
var Tt;
(function(n) {
  n[n.Flush = 0] = "Flush", n[n.Add = 1] = "Add";
})(Tt || (Tt = {}));
const Te = se("TextToSpeech", {
  web: () => Promise.resolve().then(() => ps).then((n) => new n.TextToSpeechWeb())
}), Ae = M.isNativePlatform();
let Je = null;
function Bn() {
  return Je || (Je = new (window.AudioContext || window.webkitAudioContext)()), Je;
}
function ae(n = 880, e = 120, t = 0.25) {
  try {
    const s = Bn(), i = s.createOscillator(), a = s.createGain();
    i.frequency.value = n, i.type = "sine", a.gain.value = t, i.connect(a), a.connect(s.destination), i.start(), a.gain.exponentialRampToValueAtTime(1e-4, s.currentTime + e / 1e3), i.stop(s.currentTime + e / 1e3);
  } catch {
  }
}
const ne = {
  go: () => ae(1200, 220, 0.3),
  rest: () => ae(500, 220, 0.25),
  tick: () => ae(900, 60, 0.15),
  done: () => {
    ae(1e3, 120), setTimeout(() => ae(1300, 160), 140), setTimeout(() => ae(1600, 220), 320);
  },
  inZone: () => ae(1e3, 50, 0.1),
  outZone: () => ae(300, 120, 0.2)
};
class qn {
  constructor() {
    if (this.enabled = !0, this.onSpeak = () => {
    }, this.lastSpoke = 0, this.lastText = "", this.keep = [], this.voice = null, this.busySince = 0, this.nativeBusy = !1, this.rate = 1.2, this.pitch = 1, "speechSynthesis" in window) {
      const e = () => {
        const t = speechSynthesis.getVoices();
        this.voice = t.find((s) => /^en/i.test(s.lang) && /google|english/i.test(s.name)) ?? t.find((s) => /^en/i.test(s.lang)) ?? null;
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
    if (Ae) return this.nativeBusy;
    try {
      return speechSynthesis.speaking || speechSynthesis.pending ? (this.busySince || (this.busySince = Date.now()), Date.now() - this.busySince > 4e3 ? (this.reset(), !1) : !0) : (this.busySince = 0, !1);
    } catch {
      return !1;
    }
  }
  /** Hard reset of the engine. */
  reset() {
    if (Ae) {
      Te.stop().catch(() => {
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
    if (Ae)
      try {
        return `${(await Te.getSupportedVoices()).voices.length} native voices`;
      } catch {
        return "native TTS unavailable";
      }
    if (!("speechSynthesis" in window)) return "no speech engine in this browser — open in Chrome";
    const e = speechSynthesis.getVoices().length;
    return e ? `${e} voices` : "no voices installed";
  }
  say(e, t = !1, s = !1) {
    if (!this.enabled) return;
    if (this.onSpeak(e), Ae) {
      if (this.nativeBusy && !t) return;
      this.nativeBusy = !0, (t ? Te.stop().catch(() => {
      }) : Promise.resolve()).then(() => Te.speak({ text: e, lang: "en-US", rate: this.rate, pitch: this.pitch, volume: 1, category: "ambient" })).catch(() => {
      }).finally(() => {
        this.nativeBusy = !1;
      });
      return;
    }
    if (!("speechSynthesis" in window)) return;
    const i = Date.now();
    if (!(!t && !s && (i - this.lastSpoke < 1800 || e === this.lastText)))
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
function Nn(n) {
  const e = Math.floor(n / 60), t = n % 60;
  return t === 0 && e > 0 ? e === 1 ? "1 minute" : `${e} minutes` : String(t);
}
const At = se("KeepAwake", {
  web: () => Promise.resolve().then(() => ms).then((n) => new n.KeepAwakeWeb())
}), zt = se("Preferences", {
  web: () => Promise.resolve().then(() => ws).then((n) => new n.PreferencesWeb())
}), we = "ufl.sets.v1", _e = "ufl.max.v1", Ze = "ufl.exercises.v1", Kt = [
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
function Un(n) {
  return /^SR\b|self.?resisted/i.test(n) ? "self-resisted" : "iso";
}
async function Qe(n, e) {
  try {
    const t = M.isNativePlatform() ? (await zt.get({ key: n })).value : localStorage.getItem(n);
    return t ? JSON.parse(t) : e;
  } catch {
    return e;
  }
}
async function Q(n, e) {
  const t = JSON.stringify(e);
  M.isNativePlatform() ? await zt.set({ key: n, value: t }) : localStorage.setItem(n, t);
}
const $ = {
  async sets() {
    return Qe(we, []);
  },
  async saveSet(n) {
    const e = await this.sets();
    e.push(n), await Q(we, e.slice(-500));
  },
  async updateSet(n) {
    const e = await this.sets(), t = e.findIndex((s) => s.id === n.id);
    t >= 0 ? e[t] = n : e.push(n), await Q(we, e);
  },
  async deleteSet(n) {
    const e = await this.sets();
    await Q(we, e.filter((t) => t.id !== n));
  },
  async maxes() {
    return Qe(_e, {});
  },
  async setMax(n, e) {
    const t = await this.maxes();
    t[n] = { kg: e, at: Date.now() }, await Q(_e, t);
  },
  async deleteMax(n) {
    const e = await this.maxes();
    delete e[n], await Q(_e, e);
  },
  async exercises() {
    return Qe(Ze, Kt);
  },
  /** Rename an exercise in every stored set and max (and the local list). */
  async renameExercise(n, e) {
    const t = await this.sets();
    for (const c of t) c.exercise === n && (c.exercise = e);
    await Q(we, t);
    const s = await this.maxes(), i = {};
    for (const [c, u] of Object.entries(s)) {
      const [r, ...l] = c.split("|"), d = [r === n ? e : r, ...l].join("|");
      (!i[d] || i[d].kg < u.kg) && (i[d] = u);
    }
    await Q(_e, i);
    const a = await this.exercises();
    if (a.includes(n)) {
      const c = a.map((u) => u === n ? e : u);
      await Q(Ze, [...new Set(c)]);
    }
  },
  async saveExercises(n) {
    await Q(Ze, n);
  }
};
function jn(n) {
  n.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, t) {
        return new Proxy({}, {
          get(s, i) {
            return (a, c, u) => {
              const r = n.Capacitor.Plugins[t];
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
function Vn(n) {
  n.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, t) {
        return n.cordova.plugins[t];
      }
    }
  );
}
function Hn(n = !1) {
  typeof window > "u" || (window.CapacitorUtils = window.CapacitorUtils || {}, window.Capacitor !== void 0 && !n ? jn(window) : window.cordova !== void 0 && Vn(window));
}
var at;
(function(n) {
  n.Documents = "DOCUMENTS", n.Data = "DATA", n.Library = "LIBRARY", n.Cache = "CACHE", n.External = "EXTERNAL", n.ExternalStorage = "EXTERNAL_STORAGE", n.ExternalCache = "EXTERNAL_CACHE", n.LibraryNoCloud = "LIBRARY_NO_CLOUD", n.Temporary = "TEMPORARY";
})(at || (at = {}));
var qe;
(function(n) {
  n.UTF8 = "utf8", n.ASCII = "ascii", n.UTF16 = "utf16";
})(qe || (qe = {}));
const Wn = se("Filesystem", {
  web: () => Promise.resolve().then(() => bs).then((n) => new n.FilesystemWeb())
});
Hn();
const zn = se("Share", {
  web: () => Promise.resolve().then(() => Ss).then((n) => new n.ShareWeb())
});
function Kn(n) {
  const e = ["id", "date_performed", "recorded_at", "exercise", "side", "contraction", "mode", "duration_s", "peak_kg", "avg_kg", "output_kgs", "inroad_pct", "reps", "auto_reps", "rep_peaks"], t = n.map((s) => [
    s.id,
    De(de(s)),
    new Date(s.startedAt).toISOString(),
    _t(s.exercise),
    s.side,
    s.contraction ?? "complete",
    s.mode,
    s.durationS.toFixed(1),
    s.peak,
    s.avg,
    s.output,
    s.inroad,
    ge(s),
    s.reps?.length ?? 0,
    _t((s.reps ?? []).map((i) => i.peak).join(" "))
  ].join(","));
  return [e.join(","), ...t].join(`
`);
}
function Gn(n) {
  return ["t_s,kg", ...n.samples.map((e) => `${e.t.toFixed(2)},${e.kg.toFixed(2)}`)].join(`
`);
}
function _t(n) {
  return `"${n.replace(/"/g, '""')}"`;
}
async function rt(n, e, t) {
  if (M.isNativePlatform()) {
    const c = await Wn.writeFile({ path: n, data: e, directory: at.Cache, encoding: qe.UTF8 });
    await zn.share({ title: n, files: [c.uri] });
    return;
  }
  const s = new Blob([e], { type: t }), i = URL.createObjectURL(s), a = document.createElement("a");
  a.href = i, a.download = n, document.body.appendChild(a), a.click(), setTimeout(() => {
    URL.revokeObjectURL(i), a.remove();
  }, 500);
}
function De(n) {
  const e = new Date(n);
  return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
class Yn {
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
function Gt(n) {
  return {
    id: `fl-${n.id}`,
    date: De(de(n)),
    exercise: ve(n.exercise, n.side, n.contraction),
    kg: n.peak,
    reps: ge(n),
    variation: Un(n.exercise),
    at: n.startedAt,
    dur: n.durationS,
    note: [n.mode, n.note].filter(Boolean).join(" · ")
  };
}
function Xn() {
  const n = K();
  if (n)
    for (const e of Kt) n.addExercise(e);
}
let W = null;
const Yt = /* @__PURE__ */ new Map();
function Jn(n) {
  Yt.get(n)?.();
}
function ue(n) {
  return n.replace(/[&<>"']/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[e]);
}
function et(n, e) {
  n.classList.add("picker-hidden");
  const t = document.createElement("button");
  t.type = "button", t.className = "picker-btn", n.insertAdjacentElement("afterend", t);
  const s = () => {
    const i = n.value;
    t.textContent = i || (e.allOption?.label ?? "Choose…"), t.disabled = n.disabled;
  };
  return s(), new MutationObserver(s).observe(n, { attributes: !0, childList: !0 }), n.addEventListener("change", s), t.onclick = () => Rt(n, e, s), Yt.set(n, () => Rt(n, e, s)), s;
}
function Rt(n, e, t) {
  ye();
  const s = document.getElementById("view-force") ?? document.body;
  W = document.createElement("div"), W.className = "picker-overlay", W.innerHTML = `<div class="picker-panel">
    <div class="picker-head"><input type="text" class="picker-search" placeholder="Search exercises…" autocomplete="off" /><button type="button" class="sm ghost picker-close">✕</button></div>
    <div class="picker-list"></div>
  </div>`, s.appendChild(W);
  const i = W.querySelector(".picker-search"), a = W.querySelector(".picker-list"), c = (r) => {
    n.value = r, n.dispatchEvent(new Event("change", { bubbles: !0 })), t(), ye();
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
    r.key === "Escape" && ye(), r.key === "Enter" && a.querySelector(".picker-item")?.click();
  }, W.querySelector(".picker-close").onclick = ye, W.onclick = (r) => {
    r.target === W && ye();
  }, u(), setTimeout(() => i.focus(), 50);
}
function ye() {
  W?.remove(), W = null;
}
const o = (n) => document.getElementById(n);
let z = null, ee = null, Ne = 0, w = [], N = [], Ue = null, re = 0, G = 0, fe = null, X = !0, Le = localStorage.getItem("ufl.ghostOn") !== "0", Re = null;
const me = (n, e) => localStorage.getItem(n) ?? e;
let Ie = Math.max(1, Number(me("ufl.calloutEvery", "5"))), ot = me("ufl.calloutOn", "1") === "1", ct = me("ufl.secBeep", "0") === "1", lt = me("ufl.secCount", "0") === "1", Fe = null, tt = -1;
const S = new qn(), U = new _n(), te = new Fn(), V = new Ht(o("chart")), be = o("progressChart"), Zn = {
  countdown: [{ key: "total", label: "seconds", def: 60 }],
  ramp: [{ key: "ramp", label: "ramp s", def: 5 }, { key: "hold", label: "hold s", def: 10 }],
  repeaters: [{ key: "reps", label: "reps", def: 6 }, { key: "hold", label: "on s", def: 10 }, { key: "rest", label: "off s", def: 20 }]
};
function ut() {
  const n = o("exercise").value || "Choose exercise", e = o("side").value, t = o("protocol").value, s = o("contraction").value;
  o("hdrExName").textContent = o("exercise").value ? ve(n, e, s) : n, o("hdrExMeta").textContent = t;
}
async function Qn(n, e) {
  const t = K();
  if (t) {
    if (!t.renameExercise(n, e)) return;
    w = t.exerciseNames();
  } else
    await Xt(n, e), w = await $.exercises();
  oe(), J(), Z(), await R();
}
async function Xt(n, e) {
  await $.renameExercise(n, e), N = await $.sets(), o("exercise").value === n && (oe(), o("exercise").value = e);
}
async function es() {
  Xn(), w = K()?.exerciseNames() ?? await $.exercises(), N = await $.sets(), oe(), Zt(), await R(), Z(), J(), ls(), cn(), S.enabled = o("voiceOn").checked;
}
function nt() {
  const n = /* @__PURE__ */ new Map();
  for (const e of N) n.set(e.exercise, Math.max(n.get(e.exercise) ?? 0, e.startedAt));
  for (const e of Object.keys(Jt)) {
    const t = e.split("|")[0];
    n.has(t) || n.set(t, 0);
  }
  return [...n.entries()].filter(([e]) => w.includes(e)).sort((e, t) => t[1] - e[1]).map(([e]) => e);
}
let Jt = {};
async function Mt(n) {
  if (n = n.trim(), !n) return !1;
  if (!w.includes(n)) {
    const e = K();
    e ? (e.addExercise(n), w = e.exerciseNames()) : (w.push(n), await $.saveExercises(w));
  }
  return oe(), J(), !0;
}
function oe() {
  setTimeout(ut, 0);
  for (const t of ["exercise", "maxExercise"]) {
    const s = o(t), i = s.value;
    s.innerHTML = w.map((a) => `<option>${I(a)}</option>`).join(""), i && w.includes(i) && (s.value = i);
  }
  const n = o("histExercise"), e = n.value;
  n.innerHTML = '<option value="">All</option>' + w.map((t) => `<option>${I(t)}</option>`).join(""), n.value = e;
}
function Zt() {
  const n = o("protocol").value, e = o("params");
  e.innerHTML = (Zn[n] ?? []).map((t) => `<label>${t.label}<input type="number" data-k="${t.key}" value="${t.def}" min="1" /></label>`).join(""), o("protocolHelp").textContent = He(n, gt()).describe;
}
function gt() {
  const n = {};
  return o("params").querySelectorAll("input").forEach((e) => n[e.dataset.k] = Number(e.value) || 1), n;
}
async function R() {
  const n = o("exercise").value, e = o("side").value, t = o("contraction").value, s = N.filter((a) => An(a, n, e, t));
  Ue = s.length ? s[s.length - 1] : null, re = s.reduce((a, c) => Math.max(a, c.output), 0);
  const i = await $.maxes();
  Jt = i, G = i[Pe(n, e, t)]?.kg ?? 0, o("zoneMax").textContent = G ? `(max ${G} kg → ${Be().lo.toFixed(1)}–${Be().hi.toFixed(1)} kg)` : "(no max yet — run a Max test)", o("sGoal").textContent = re ? D(re) : "–", V.opts.ghost = Le ? Ue?.samples ?? null : null, V.opts.zone = mt() ? Be() : null, U.recording || (V.opts.marks = []);
}
function mt() {
  return o("zoneOn").checked && G > 0;
}
function Be() {
  const n = Number(o("zoneLo").value) / 100 * G, e = Number(o("zoneHi").value) / 100 * G;
  return { lo: Math.min(n, e), hi: Math.max(n, e) };
}
async function dt(n) {
  z && await z.stop(), z = n, n.onStatus(je), n.onSample((e) => {
    Ne = e.kg, Y === "live" && (o("statusKg").textContent = `${e.kg.toFixed(1)} kg`), U.push(e), ts(e.kg);
  });
  try {
    await n.start(), o("btnTare").disabled = !1, o("btnStart").disabled = !1;
  } catch (e) {
    je("error"), o("statusText").textContent = e.message, alert("Connect failed: " + e.message);
  }
}
let Y = "idle";
function Qt() {
  return localStorage.getItem("ufl.keepAwake") !== "0";
}
function en() {
  if (!M.isNativePlatform()) return;
  (Qt() && (Y === "live" || Y === "scanning" || Y === "lost") ? At.keepAwake() : At.allowSleep()).catch(() => {
  });
}
function je(n) {
  Y = n, en(), o("statusDot").className = `dot ${n}`, o("statusPill").className = `pill ${n}`;
  const e = {
    idle: "Not connected",
    scanning: "Listening…",
    live: "",
    lost: "Lost — retrying…",
    error: "Error"
  };
  o("statusText").textContent = e[n], n !== "live" && (o("statusKg").textContent = "");
  const t = o("btnConnect");
  t.textContent = n === "live" || n === "scanning" ? "Disconnect" : "Connect scale";
}
function tn() {
  return localStorage.getItem("ufl.autoConnect") !== "0";
}
let Ve = !1, ht = !1, st = !1;
function ft() {
  if (!tn() || !M.isNativePlatform() || z instanceof Ee || ee || ht || Ve && Y === "error") return;
  Ve = !0;
  const n = new Ee();
  n.onSeen = () => un(n), o("simPanel").classList.add("hidden"), dt(n);
}
let It = 0;
function ts(n) {
  if (!U.recording || !mt()) {
    fe = null;
    return;
  }
  const e = te.running ? te.current() : null;
  if (e && e.cue === "rest") {
    fe = null;
    return;
  }
  const t = Be(), s = n >= t.lo && n <= t.hi, i = o("phaseBanner");
  s && fe !== "in" && (fe = "in", i.classList.add("inzone"), i.classList.remove("outzone"), S.say("in zone")), !s && fe !== "out" && (fe = "out", i.classList.add("outzone"), i.classList.remove("inzone"), n > 2 && S.say(n < t.lo ? "more" : "ease off"), X && n > 2 && Date.now() - It > 1500 && (ne.outZone(), It = Date.now()));
}
function ns() {
  const n = o("protocol").value, e = He(n, gt());
  o("summary").classList.add("hidden"), U.start(), S.unlock(), as(), V.opts.marks = [], V.opts.peaks = [];
  const t = e.phases.length ? Wt(e).reduce((s, i) => s + i.seconds, 0) : 60;
  V.opts.windowS = Math.max(10, Math.ceil(t / 10) * 10), o("btnStart").classList.add("hidden"), o("btnStop").classList.remove("hidden"), an(!0), e.phases.length ? (te.onPhase = ss, te.onTick = is, te.onDone = () => nn(), te.start(e)) : (vt("work", "Free set — go", ""), S.say("Go", !0), X && ne.go());
}
function ss(n, e, t) {
  vt(n.cue, n.name, n.seconds.toFixed(0)), n.cue === "work" ? (X && ne.go(), S.say(n.name.replace(/\d+\/\d+/, ""), !0), V.opts.marks.push(U.elapsed())) : n.cue === "ramp" ? (X && ne.go(), S.say("Build up", !0)) : (e > 0 && X && ne.rest(), e > 0 && S.say(e === t - 1 ? "Done" : "Rest", !0));
}
let Ft = -1;
function is(n, e) {
  o("phaseTime").textContent = n.toFixed(n < 10 ? 1 : 0);
  const t = Math.ceil(n);
  t !== Ft && (Ft = t, t <= 3 && t > 0 && X && ne.tick());
}
async function nn() {
  te.stop(), sn();
  const n = o("exercise").value, e = o("side").value, t = o("protocol").value, s = o("contraction").value, i = U.finish({ exercise: n, side: e, mode: t, contraction: s });
  i && i.manualReps === void 0 && (i.reps?.length ?? 0) >= 2 && (i.manualReps = i.reps.length), o("btnStop").classList.add("hidden"), o("btnStart").classList.remove("hidden"), an(!1), vt("idle", "Done", "—"), X && ne.done(), i && (t === "maxtest" && i.peak > 0 && (await $.setMax(Pe(n, e, s), i.peak), S.say(`New max ${i.peak.toFixed(0)} kilos`, !0)), await $.saveSet(i), N.push(i), K()?.upsertForceSet(Gt(i)), await rs(i), await R(), Z(), J());
}
function as() {
  sn(), tt = -1, Fe = setInterval(() => {
    if (!U.recording) return;
    const n = Math.floor(U.elapsed());
    if (n === tt || n === 0) return;
    tt = n;
    const e = te.running ? te.current() : null;
    if (e && e.cue !== "work") return;
    const t = ot && !mt() && n % Ie === 0;
    (ct && X || t && X) && ne.tick();
    const s = [];
    lt && s.push(Nn(n)), t && s.push(Ne.toFixed(0)), s.length && (!t && S.speaking() || S.say(s.join(", "), t, !0));
  }, 100);
}
function sn() {
  Fe && clearInterval(Fe), Fe = null;
}
function an(n) {
  for (const e of ["exercise", "side", "protocol", "contraction"]) o(e).disabled = n;
}
function vt(n, e, t) {
  const s = o("phaseBanner");
  s.className = `banner ${n}`, o("phaseName").textContent = e, o("phaseTime").textContent = t;
}
async function rs(n) {
  const e = Ue, t = await $.maxes(), s = n.side === "left" ? "right" : n.side === "right" ? "left" : null, i = [];
  i.push(_("Duration", `${n.durationS.toFixed(1)} s`)), i.push(_("Peak force", `${D(n.peak)} kg`, Ce(n.peak, e?.peak))), i.push(_("Intensity (avg)", `${D(n.avg)} kg`, Ce(n.avg, e?.avg))), i.push(_("Output (kg·s)", D(n.output), Ce(n.output, e?.output))), i.push(_("Inroad", `${n.inroad.toFixed(0)}%`, n.inroad >= 30 ? '<span class="badge good">deep fatigue</span>' : n.inroad >= 15 ? '<span class="badge">moderate</span>' : '<span class="badge warn">shallow — stopped early?</span>')), re && i.push(_("vs. best output", `${(n.output / re * 100).toFixed(0)}%`, n.output > re ? '<span class="badge good">new best</span>' : "")), G && i.push(_("Peak as % of max", `${(n.peak / G * 100).toFixed(0)}%`));
  let a = "";
  if (n.reps && n.reps.length) {
    const r = Math.max(...n.reps.map((d) => d.peak));
    a = `<div class="muted" style="margin-top:8px">Reps: ${n.reps.length} · first ${D(n.reps[0].peak)} → last ${D(n.reps[n.reps.length - 1].peak)} kg · avg rep ${(n.reps.reduce((d, h) => d + h.durationS, 0) / n.reps.length).toFixed(1)} s</div>
      <div class="repbars">${n.reps.map((d) => `<div style="height:${Math.max(4, d.peak / r * 100)}%"><span>${d.peak.toFixed(0)}</span></div>`).join("")}</div>`;
    const l = n.mode === "critical" ? Rn(n.reps) : null;
    l && (a += _("Critical force", `${D(l)} kg${G ? ` (${(l / G * 100).toFixed(0)}% of max)` : ""}`));
  }
  let c = "";
  if (s) {
    const r = t[Pe(n.exercise, n.side, n.contraction)]?.kg, l = t[Pe(n.exercise, s, n.contraction)]?.kg;
    if (r && l) {
      const d = (Math.abs(r - l) / Math.max(r, l) * 100).toFixed(0);
      c = _("Left/right gap", `${d}% (L ${D(n.side === "left" ? r : l)} / R ${D(n.side === "left" ? l : r)})`, Number(d) > 10 ? '<span class="badge warn">asymmetry</span>' : '<span class="badge good">balanced</span>');
    }
  }
  const u = o("summary");
  u.innerHTML = `<h4>${I(ve(n.exercise, n.side, n.contraction))} · ${n.mode}</h4>${i.join("")}${c}${a}
    ${rn(n, "sum")}`, u.classList.remove("hidden"), on(n, "sum", async () => {
    await R(), Z();
  });
}
function rn(n, e) {
  const t = De(de(n));
  return `<div class="editor">
      <label>Reps <input type="number" id="${e}Reps" min="1" step="1" inputmode="numeric" placeholder="1" value="${n.manualReps ?? ""}" /></label>
      <label>Date performed <input type="date" id="${e}Date" value="${t}" max="${De(Date.now())}" /></label>
      <label class="grow">Note <input type="text" id="${e}Note" placeholder="optional" value="${I(n.note ?? "")}" /></label>
      <button class="sm primary" id="${e}Save" type="button">Save</button>
      <span class="muted" id="${e}Msg">${n.reps?.length ? `auto-detected ${n.reps.length} — change it if that's wrong` : "blank reps = 1"}</span>
    </div>`;
}
function on(n, e, t) {
  const s = async () => {
    const i = Number(o(`${e}Reps`).value);
    n.manualReps = i > 0 ? Math.round(i) : void 0;
    const a = o(`${e}Date`).value;
    if (a) {
      const [u, r, l] = a.split("-").map(Number), d = new Date(n.startedAt);
      n.performedAt = new Date(u, r - 1, l, d.getHours(), d.getMinutes(), d.getSeconds()).getTime();
    }
    n.note = o(`${e}Note`).value.trim() || void 0, await $.updateSet(n), K()?.upsertForceSet(Gt(n));
    const c = N.findIndex((u) => u.id === n.id);
    c >= 0 && (N[c] = n), o(`${e}Msg`).textContent = `saved · ${ge(n)} rep${ge(n) === 1 ? "" : "s"} · ${De(de(n))}`, await t();
  };
  o(`${e}Save`).onclick = s;
  for (const i of [`${e}Reps`, `${e}Date`, `${e}Note`]) o(i).onkeydown = (a) => {
    a.key === "Enter" && s();
  };
}
function _(n, e, t = "") {
  return `<div class="fl-line"><span>${n}</span><span>${e} ${t}</span></div>`;
}
function Ce(n, e) {
  if (!e) return "";
  const t = (n - e) / e * 100;
  return `<span class="${t >= 0 ? "fl-d up" : "fl-d down"}">${t >= 0 ? "+" : ""}${t.toFixed(1)}%</span>`;
}
function cn() {
  const n = U.current(), e = U.elapsed();
  if (o("liveKg").textContent = Ne.toFixed(1), o("elapsed").textContent = dn(e), V.draw(n, e, Ne), U.recording && n.length > 2) {
    const t = Vt(n);
    o("sPeak").textContent = D(t.peak), o("sAvg").textContent = D(t.avg), o("sOut").textContent = D(t.output), o("sInroad").textContent = `${t.inroad.toFixed(0)}%`;
    const s = Ue;
    o("dPeak").innerHTML = Ce(t.peak, s?.peak), o("dAvg").innerHTML = Ce(t.avg, s?.avg), o("dOut").innerHTML = re ? `<span class="muted">${(t.output / re * 100).toFixed(0)}% of goal</span>` : "";
    const i = pt(n);
    V.opts.peaks = i.map((a) => ({ t: a.peakT ?? a.startS, kg: a.peak })), o("sReps").textContent = i.length ? String(i.length) : "–", o("dReps").textContent = i.length ? `last ${i[i.length - 1].peak.toFixed(0)} kg` : "";
  }
  requestAnimationFrame(cn);
}
let xe = null;
function Z() {
  const n = o("histExercise").value, e = N.filter((t) => !n || t.exercise === n).slice().sort((t, s) => de(s) - de(t) || s.startedAt - t.startedAt);
  o("histBody").innerHTML = e.map((t) => `<tr data-id="${t.id}" class="${xe?.id === t.id ? "sel" : ""}">
      <td>${new Date(de(t)).toLocaleDateString(void 0, { month: "short", day: "numeric" })}</td>
      <td>${I(ve(t.exercise, t.side, t.contraction))}</td>
      <td>${t.mode}</td><td>${ge(t)}</td><td>${dn(t.durationS)}</td><td>${D(t.peak)}</td><td>${D(t.avg)}</td><td>${D(t.output)}</td><td>${t.inroad.toFixed(0)}%</td>
      <td><button data-del="${t.id}">✕</button></td></tr>`).join("") || '<tr><td colspan="10" class="muted">No sets yet.</td></tr>', o("histBody").querySelectorAll("tr[data-id]").forEach((t) => {
    t.onclick = (s) => {
      s.target.dataset.del || (xe = N.find((i) => i.id === t.dataset.id) ?? null, Z(), os());
    };
  }), o("histBody").querySelectorAll("button[data-del]").forEach((t) => {
    t.onclick = async () => {
      confirm("Delete this set?") && (await $.deleteSet(t.dataset.del), K()?.removeForceSet(`fl-${t.dataset.del}`), N = N.filter((s) => s.id !== t.dataset.del), xe?.id === t.dataset.del && (xe = null), Z(), await R());
    };
  }), cs(n ? e.slice().reverse() : []);
}
function os() {
  const n = xe, e = o("histDetail");
  if (!n) {
    e.classList.add("hidden");
    return;
  }
  e.classList.remove("hidden"), e.innerHTML = `<h4>${I(ve(n.exercise, n.side, n.contraction))} · ${new Date(n.startedAt).toLocaleString()}</h4>
    <div class="chartwrap small"><canvas id="histCanvas"></canvas></div>
    ${_("Peak", `${D(n.peak)} kg`)}${_("Intensity", `${D(n.avg)} kg`)}${_("Output", D(n.output))}${_("Inroad", `${n.inroad.toFixed(0)}%`)}
    ${_("Reps (logged)", String(ge(n)))}
    ${n.reps?.length ? _("Auto-detected", `${n.reps.length} (${n.reps.map((s) => s.peak.toFixed(0)).join(", ")} kg)`) : ""}
    ${rn(n, "hist")}
    <div class="actions-inline" style="margin-top:8px"><button class="sm" id="btnUseGhost">Use as ghost trace</button><button class="sm ghost" id="btnSetCsv">Export samples CSV</button></div>`, on(n, "hist", async () => {
    Z(), await R();
  });
  const t = new Ht(o("histCanvas"));
  t.opts.windowS = Math.max(10, Math.ceil(n.durationS / 10) * 10), t.opts.peaks = pt(n.samples).map((s) => ({ t: s.peakT ?? s.startS, kg: s.peak })), t.draw(n.samples, n.durationS, 0), o("btnUseGhost").onclick = () => {
    Le = !0, localStorage.setItem("ufl.ghostOn", "1"), o("ghostOn").checked = !0, V.opts.ghost = n.samples, ln("train");
  }, o("btnSetCsv").onclick = () => rt(`set-${n.id}.csv`, Gn(n), "text/csv");
}
function cs(n) {
  const e = o("progress");
  if (n.length < 2) {
    e.classList.add("hidden");
    return;
  }
  e.classList.remove("hidden");
  const t = Math.max(1, window.devicePixelRatio || 1), s = e.clientWidth - 12, i = 160;
  be.width = s * t, be.height = i * t, be.style.width = `${s}px`, be.style.height = `${i}px`;
  const a = be.getContext("2d");
  a.setTransform(t, 0, 0, t, 0, 0), a.clearRect(0, 0, s, i);
  const c = getComputedStyle(document.getElementById("view-force") ?? document.documentElement), u = 36, r = 8, l = 10, d = 18, h = s - u - r, f = i - l - d, p = Math.max(10, ...n.map((x) => x.peak)) * 1.1, v = (x) => u + x / Math.max(1, n.length - 1) * h, y = (x) => l + f - x / p * f;
  a.strokeStyle = c.getPropertyValue("--grid"), a.fillStyle = c.getPropertyValue("--muted"), a.font = "10px system-ui", a.textAlign = "right";
  for (let x = 0; x <= 4; x++) {
    const H = p / 4 * x;
    a.beginPath(), a.moveTo(u, y(H)), a.lineTo(s - r, y(H)), a.stroke(), a.fillText(H.toFixed(0), u - 4, y(H) + 3);
  }
  const b = [["peak", c.getPropertyValue("--accent")], ["avg", c.getPropertyValue("--accent2")]];
  for (const [x, H] of b)
    a.strokeStyle = H, a.lineWidth = 2, a.beginPath(), n.forEach((B, j) => j ? a.lineTo(v(j), y(B[x])) : a.moveTo(v(j), y(B[x]))), a.stroke(), a.fillStyle = H, n.forEach((B, j) => {
      a.beginPath(), a.arc(v(j), y(B[x]), 3, 0, Math.PI * 2), a.fill();
    });
  a.fillStyle = c.getPropertyValue("--muted"), a.textAlign = "left", a.fillText("peak", u + 4, l + 10), a.fillStyle = c.getPropertyValue("--accent2"), a.fillText("intensity", u + 36, l + 10);
}
async function J() {
  const n = await $.maxes(), e = Object.entries(n).map(([t, s]) => {
    const [i, a, c] = t.split("|");
    return `<tr><td>${I(ve(i, "both", c))}</td><td>${a}</td><td>${D(s.kg)}</td><td>${new Date(s.at).toLocaleDateString()}</td><td><button data-mdel="${I(t)}">✕</button></td></tr>`;
  });
  o("maxBody").innerHTML = e.join("") || '<tr><td colspan="5" class="muted">No maxes yet.</td></tr>', o("maxBody").querySelectorAll("button[data-mdel]").forEach((t) => t.onclick = async () => {
    await $.deleteMax(t.dataset.mdel), J(), R();
  }), o("exList").innerHTML = w.map((t) => `<span>${I(t)}<button data-xren="${I(t)}" title="Rename">✎</button><button data-xdel="${I(t)}">✕</button></span>`).join(""), o("exList").querySelectorAll("button[data-xren]").forEach((t) => t.onclick = async () => {
    const s = t.dataset.xren, i = prompt(`Rename "${s}" to:`, s);
    !i || i.trim() === s || await Qn(s, i.trim());
  }), o("exList").querySelectorAll("button[data-xdel]").forEach((t) => t.onclick = async () => {
    const s = K();
    if (s) {
      if (!s.removeExercise(t.dataset.xdel)) {
        alert("Built-in Gym Log exercises can't be removed here.");
        return;
      }
      w = s.exerciseNames();
    } else
      w = w.filter((i) => i !== t.dataset.xdel), await $.saveExercises(w);
    oe(), J();
  });
}
function ln(n) {
  document.querySelectorAll(".fl-tabs button").forEach((e) => e.classList.toggle("active", e.dataset.tab === n)), document.querySelectorAll(".fl-tab").forEach((e) => e.classList.toggle("active", e.id === `tab-${n}`)), n === "train" && V.resize(), n === "history" && Z();
}
function ls() {
  document.querySelectorAll(".fl-tabs button").forEach((r) => r.onclick = () => ln(r.dataset.tab)), o("hdrExercise").onclick = () => {
    U.recording || Jn(o("exercise"));
  };
  for (const r of ["exercise", "side", "protocol", "contraction"]) o(r).addEventListener("change", ut);
  ut(), o("btnConnect").onclick = async () => {
    if (z instanceof Ee && (Y === "live" || Y === "scanning")) {
      await z.stop(), z = null, je("idle"), ht = !0;
      return;
    }
    ht = !1, o("simPanel").classList.add("hidden"), ee = null;
    const r = new Ee();
    r.onSeen = () => un(r), dt(r);
  }, o("btnSim").onclick = () => {
    ee = new $n(), ee.exact = o("simExact").checked, o("simPanel").classList.remove("hidden"), dt(ee);
  }, o("simExact").onchange = (r) => {
    const l = r.target.checked;
    ee && (ee.exact = l), o("simHelp").textContent = l ? "Reading tracks the slider exactly." : 'Slide up to "push", back to 0 to rest. Fatigue is simulated.';
  }, o("btnTare").onclick = () => z?.tare(), o("btnStart").onclick = ns, o("camOn").checked = localStorage.getItem("ufl.camOn") === "1";
  const n = async () => {
    const r = o("camOn").checked;
    if (localStorage.setItem("ufl.camOn", r ? "1" : "0"), r) {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert("Camera not available here."), o("camOn").checked = !1;
        return;
      }
      Re ?? (Re = new Yn(o("camVideo")));
      try {
        await Re.start(), o("camPip").classList.remove("hidden"), o("btnCamFlip").classList.remove("hidden");
      } catch (l) {
        alert("Camera failed: " + l.message + `
Allow the Camera permission for UY Force Lab in Android settings.`), o("camOn").checked = !1;
      }
    } else
      Re?.stop(), o("camPip").classList.add("hidden"), o("btnCamFlip").classList.add("hidden");
  };
  o("camOn").onchange = n, o("camOn").checked && n(), o("btnCamFlip").onclick = () => Re?.flip();
  const e = o("camPip"), t = localStorage.getItem("ufl.pipPos");
  if (t) {
    const [r, l] = t.split(",").map(Number);
    e.style.left = `${r}px`, e.style.top = `${l}px`;
  }
  let s = null;
  e.onpointerdown = (r) => {
    const l = e.getBoundingClientRect();
    s = { x: r.clientX, y: r.clientY, l: l.left, t: l.top, moved: !1 }, e.setPointerCapture(r.pointerId);
  }, e.onpointermove = (r) => {
    if (!s) return;
    const l = r.clientX - s.x, d = r.clientY - s.y;
    if (Math.abs(l) + Math.abs(d) > 6 && (s.moved = !0), !s.moved) return;
    const h = e.getBoundingClientRect(), f = Math.min(window.innerWidth - h.width, Math.max(0, s.l + l)), p = Math.min(window.innerHeight - h.height, Math.max(0, s.t + d));
    e.style.left = `${f}px`, e.style.top = `${p}px`;
  }, e.onpointerup = () => {
    if (s) {
      if (s.moved) {
        const r = e.getBoundingClientRect();
        localStorage.setItem("ufl.pipPos", `${Math.round(r.left)},${Math.round(r.top)}`);
      } else e.classList.toggle("large");
      s = null;
    }
  }, o("btnStop").onclick = nn, o("simEffort").oninput = (r) => {
    const l = Number(r.target.value);
    ee && (ee.effort = l), o("simVal").textContent = String(l);
  }, o("exercise").onchange = R, et(o("exercise"), { recent: nt, all: () => w, onCreate: Mt }), et(o("maxExercise"), { recent: nt, all: () => w, onCreate: Mt }), et(o("histExercise"), { recent: nt, all: () => w, allOption: { value: "", label: "All exercises" } }), o("btnNewEx").onclick = () => {
    o("newExBox").classList.remove("hidden"), o("newExName").focus();
  }, o("btnNewExCancel").onclick = () => {
    o("newExBox").classList.add("hidden"), o("newExName").value = "";
  };
  const i = async () => {
    const r = o("newExName").value.trim();
    if (r) {
      if (!w.includes(r)) {
        const l = K();
        l ? (l.addExercise(r), w = l.exerciseNames()) : (w.push(r), await $.saveExercises(w));
      }
      oe(), o("exercise").value = r, o("newExBox").classList.add("hidden"), o("newExName").value = "", J(), await R();
    }
  };
  o("btnNewExSave").onclick = i, o("newExName").onkeydown = (r) => {
    r.key === "Enter" && i();
  }, o("side").onchange = R, o("contraction").onchange = R, o("protocol").onchange = () => Zt(), o("params").oninput = () => o("protocolHelp").textContent = He(o("protocol").value, gt()).describe;
  for (const r of ["zoneOn", "zoneLo", "zoneHi"]) o(r).oninput = R;
  o("ghostOn").checked = Le, o("ghostOn").onchange = (r) => {
    Le = r.target.checked, localStorage.setItem("ufl.ghostOn", Le ? "1" : "0"), R();
  }, o("histExercise").onchange = Z, o("btnCsv").onclick = () => rt(`uy-force-lab-${qt()}.csv`, Kn(N), "text/csv"), o("btnJson").onclick = () => rt(`uy-force-lab-${qt()}.json`, JSON.stringify(N, null, 1), "application/json"), o("voiceOn").onchange = (r) => S.enabled = r.target.checked, o("keepAwake").checked = Qt(), o("keepAwake").onchange = (r) => {
    localStorage.setItem("ufl.keepAwake", r.target.checked ? "1" : "0"), en();
  }, o("autoConnect").checked = tn(), o("autoConnect").onchange = (r) => {
    localStorage.setItem("ufl.autoConnect", r.target.checked ? "1" : "0"), Ve = !1, ft();
  }, document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "hidden") {
      z instanceof Ee && !U.recording && (await z.stop(), z = null, je("idle"), st = !0);
      return;
    }
    (st || Y === "idle" || Y === "error") && (st = !1, Ve = !1, ft());
  }), S.rate = Number(me("ufl.voiceRate", "1.2")) || 1.2, S.pitch = Number(me("ufl.voicePitch", "1")) || 1;
  const a = (r, l, d, h) => {
    const f = o(r);
    f.value = String(h), o(r + "Val").textContent = h.toFixed(1) + "×", f.oninput = () => {
      const p = Number(f.value);
      d(p), localStorage.setItem(l, String(p)), o(r + "Val").textContent = p.toFixed(1) + "×";
    };
  };
  a("voiceRate", "ufl.voiceRate", (r) => S.rate = r, S.rate), a("voicePitch", "ufl.voicePitch", (r) => S.pitch = r, S.pitch), o("beepOn").onchange = (r) => X = r.target.checked, o("calloutEvery").value = String(Ie), o("calloutEvery").onchange = (r) => {
    Ie = Math.max(1, Number(r.target.value) || 1), localStorage.setItem("ufl.calloutEvery", String(Ie));
  };
  const c = (r, l, d, h) => {
    const f = o(r);
    f.checked = h, f.onchange = () => {
      d(f.checked), localStorage.setItem(l, f.checked ? "1" : "0");
    };
  };
  c("calloutOn", "ufl.calloutOn", (r) => ot = r, ot), c("secBeep", "ufl.secBeep", (r) => ct = r, ct), c("secCount", "ufl.secCount", (r) => lt = r, lt);
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
    r && (await $.setMax(Pe(o("maxExercise").value, o("maxSide").value), r), o("maxKg").value = "", J(), R());
  }, o("btnAddEx").onclick = async () => {
    const r = o("newEx").value.trim();
    if (!(!r || w.includes(r))) {
      {
        const l = K();
        l ? (l.addExercise(r), w = l.exerciseNames()) : (w.push(r), await $.saveExercises(w));
      }
      o("newEx").value = "", oe(), J();
    }
  };
}
let Bt = 0;
function un(n) {
  const e = Date.now();
  if (e - Bt < 1e3 || o("tab-settings").classList.contains("active") === !1) return;
  Bt = e;
  const t = [...n.seen.values()].sort((s, i) => i.t - s.t).slice(0, 12);
  o("seenBody").innerHTML = t.map((s) => `<tr><td>${I(s.name || "(no name)")}<br><small class="muted">${I(s.id)}</small></td><td>${s.rssi}</td><td>${I(s.keys || "–")}</td><td style="white-space:normal;font-family:monospace;font-size:11px">${I(s.hex || "–")}</td><td>${s.kg === null ? "–" : s.kg.toFixed(2)}</td></tr>`).join("") || '<tr><td colspan="5" class="muted">Listening… nothing heard yet.</td></tr>';
}
function D(n) {
  return n >= 100 ? n.toFixed(0) : n.toFixed(1);
}
function dn(n) {
  const e = Math.floor(n / 60), t = Math.floor(n % 60);
  return `${e}:${t.toString().padStart(2, "0")}`;
}
function qt() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function I(n) {
  return n.replace(/[&<>"]/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[e]);
}
es();
window.ForceLab = {
  onShow() {
    V.resize(), ft();
  },
  // called by the host after it renamed an exercise in its own data
  renameExercise(n, e) {
    Xt(n, e).then(async () => {
      w = K()?.exerciseNames() ?? w, oe(), J(), Z(), await R();
    });
  }
};
async function us(n, e, t) {
  let s;
  return Promise.race([
    n,
    new Promise((i, a) => {
      s = setTimeout(() => a(t), e);
    })
  ]).finally(() => clearTimeout(s));
}
class ds extends ie {
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
    const t = this.getFilters(e), s = await navigator.bluetooth.requestDevice({
      filters: t.length ? t : void 0,
      optionalServices: e?.optionalServices,
      acceptAllDevices: t.length === 0
    });
    return this.deviceMap.set(s.id, s), this.getBleDevice(s);
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
    var t, s, i;
    const a = e.device.id;
    this.deviceMap.set(a, e.device);
    const c = !this.discoveredDevices.has(a);
    if (!(!((t = this.requestBleDeviceOptions) === null || t === void 0) && t.serviceData && !this.matchesServiceDataFilter(e)) && (c || !((s = this.requestBleDeviceOptions) === null || s === void 0) && s.allowDuplicates)) {
      this.discoveredDevices.set(a, !0);
      const u = this.getBleDevice(e.device), r = {
        device: u,
        localName: u.name,
        rssi: e.rssi,
        txPower: e.txPower,
        manufacturerData: Pt(e.manufacturerData),
        serviceData: Pt(e.serviceData),
        uuids: (i = e.uuids) === null || i === void 0 ? void 0 : i.map(En)
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
    var t, s;
    const i = this.getDeviceFromMap(e.deviceId);
    i.removeEventListener("gattserverdisconnected", this.onDisconnectedCallback), i.addEventListener("gattserverdisconnected", this.onDisconnectedCallback);
    const a = Symbol();
    if (i.gatt === void 0)
      throw new Error("No gatt server available.");
    try {
      const c = (t = e.timeout) !== null && t !== void 0 ? t : this.DEFAULT_CONNECTION_TIMEOUT;
      await us(i.gatt.connect(), c, a);
    } catch (c) {
      throw await ((s = i.gatt) === null || s === void 0 ? void 0 : s.disconnect()), c === a ? new Error("Connection timeout") : c;
    }
  }
  onDisconnected(e) {
    const s = `disconnected|${e.target.id}`;
    this.notifyListeners(s, null);
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
    var t, s;
    const i = (s = await ((t = this.getDeviceFromMap(e.deviceId).gatt) === null || t === void 0 ? void 0 : t.getPrimaryServices())) !== null && s !== void 0 ? s : [], a = [];
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
      return (await e.getDescriptors()).map((s) => ({
        uuid: s.uuid
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
    const s = await ((t = this.getDeviceFromMap(e.deviceId).gatt) === null || t === void 0 ? void 0 : t.getPrimaryService(e?.service));
    return s?.getCharacteristic(e?.characteristic);
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
    let s;
    typeof e.value == "string" ? s = Se(e.value) : s = e.value, await t?.writeValueWithResponse(Ke(s));
  }
  async writeWithoutResponse(e) {
    const t = await this.getCharacteristic(e);
    let s;
    typeof e.value == "string" ? s = Se(e.value) : s = e.value, await t?.writeValueWithoutResponse(Ke(s));
  }
  async readDescriptor(e) {
    const t = await this.getDescriptor(e);
    return { value: await t?.readValue() };
  }
  async writeDescriptor(e) {
    const t = await this.getDescriptor(e);
    let s;
    typeof e.value == "string" ? s = Se(e.value) : s = e.value, await t?.writeValue(Ke(s));
  }
  async startNotifications(e) {
    const t = await this.getCharacteristic(e);
    t?.removeEventListener("characteristicvaluechanged", this.onCharacteristicValueChangedCallback), t?.addEventListener("characteristicvaluechanged", this.onCharacteristicValueChangedCallback), await t?.startNotifications();
  }
  onCharacteristicValueChanged(e) {
    var t, s;
    const i = e.target, a = `notification|${(t = i.service) === null || t === void 0 ? void 0 : t.device.id}|${(s = i.service) === null || s === void 0 ? void 0 : s.uuid}|${i.uuid}`;
    this.notifyListeners(a, {
      value: i.value
    });
  }
  async stopNotifications(e) {
    const t = await this.getCharacteristic(e);
    await t?.stopNotifications();
  }
  getFilters(e) {
    var t, s;
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
    for (const a of (s = e?.manufacturerData) !== null && s !== void 0 ? s : [])
      i.push({
        manufacturerData: [a]
      });
    return i;
  }
  matchesServiceDataFilter(e) {
    var t;
    const s = (t = this.requestBleDeviceOptions) === null || t === void 0 ? void 0 : t.serviceData;
    if (!s || s.length === 0)
      return !0;
    if (!e.serviceData)
      return !1;
    for (const i of s) {
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
const hs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BluetoothLeWeb: ds
}, Symbol.toStringTag, { value: "Module" }));
class fs extends ie {
  constructor() {
    super(), this.speechSynthesis = null, "speechSynthesis" in window && (this.speechSynthesis = window.speechSynthesis, window.addEventListener("beforeunload", () => {
      this.stop();
    }));
  }
  async speak(e) {
    this.speechSynthesis || this.throwUnsupportedError(), await this.stop();
    const t = this.speechSynthesis, s = this.createSpeechSynthesisUtterance(e);
    return new Promise((i, a) => {
      s.onend = () => {
        i();
      }, s.onerror = (c) => {
        a(c);
      }, t.speak(s);
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
    const t = this.getSpeechSynthesisVoices(), s = new SpeechSynthesisUtterance(), { text: i, lang: a, rate: c, pitch: u, volume: r, voice: l } = e;
    return l !== void 0 && (s.voice = t[l]), r !== void 0 && (s.volume = r >= 0 && r <= 1 ? r : 1), c !== void 0 && (s.rate = c >= 0.1 && c <= 10 ? c : 1), u !== void 0 && (s.pitch = u >= 0 && u <= 2 ? u : 2), a && (s.lang = a), s.text = i, s;
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
const ps = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  TextToSpeechWeb: fs
}, Symbol.toStringTag, { value: "Module" }));
class gs extends ie {
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
const ms = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  KeepAwakeWeb: gs
}, Symbol.toStringTag, { value: "Module" }));
class vs extends ie {
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
    const t = [], s = [], i = "_cap_", a = Object.keys(this.impl).filter((c) => c.indexOf(i) === 0);
    for (const c of a) {
      const u = c.substring(i.length), r = (e = this.impl.getItem(c)) !== null && e !== void 0 ? e : "", { value: l } = await this.get({ key: u });
      typeof l == "string" ? s.push(u) : (await this.set({ key: u, value: r }), t.push(u));
    }
    return { migrated: t, existing: s };
  }
  async removeOld() {
    const e = "_cap_", t = Object.keys(this.impl).filter((s) => s.indexOf(e) === 0);
    for (const s of t)
      this.impl.removeItem(s);
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
const ws = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PreferencesWeb: vs
}, Symbol.toStringTag, { value: "Module" }));
function Nt(n) {
  const e = n.split("/").filter((s) => s !== "."), t = [];
  return e.forEach((s) => {
    s === ".." && t.length > 0 && t[t.length - 1] !== ".." ? t.pop() : t.push(s);
  }), t.join("/");
}
function ys(n, e) {
  n = Nt(n), e = Nt(e);
  const t = n.split("/"), s = e.split("/");
  return n !== e && t.every((i, a) => i === s[a]);
}
class We extends ie {
  constructor() {
    super(...arguments), this.DB_VERSION = 1, this.DB_NAME = "Disc", this._writeCmds = ["add", "put", "delete"], this.downloadFile = async (e) => {
      var t, s;
      const i = Ut(e, e.webFetchExtra), a = await fetch(e.url, i);
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
        recursive: (s = e.recursive) !== null && s !== void 0 ? s : !1,
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
      const s = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      s.onupgradeneeded = We.doUpgrade, s.onsuccess = () => {
        this._db = s.result, e(s.result);
      }, s.onerror = () => t(s.error), s.onblocked = () => {
        console.warn("db blocked");
      };
    });
  }
  static doUpgrade(e) {
    const s = e.target.result;
    switch (e.oldVersion) {
      case 0:
      case 1:
      default:
        s.objectStoreNames.contains("FileStorage") && s.deleteObjectStore("FileStorage"), s.createObjectStore("FileStorage", { keyPath: "path" }).createIndex("by_folder", "folder");
    }
  }
  async dbRequest(e, t) {
    const s = this._writeCmds.indexOf(e) !== -1 ? "readwrite" : "readonly";
    return this.initDb().then((i) => new Promise((a, c) => {
      const l = i.transaction(["FileStorage"], s).objectStore("FileStorage")[e](...t);
      l.onsuccess = () => a(l.result), l.onerror = () => c(l.error);
    }));
  }
  async dbIndexRequest(e, t, s) {
    const i = this._writeCmds.indexOf(t) !== -1 ? "readwrite" : "readonly";
    return this.initDb().then((a) => new Promise((c, u) => {
      const h = a.transaction(["FileStorage"], i).objectStore("FileStorage").index(e)[t](...s);
      h.onsuccess = () => c(h.result), h.onerror = () => u(h.error);
    }));
  }
  getPath(e, t) {
    const s = t !== void 0 ? t.replace(/^[/]+|[/]+$/g, "") : "";
    let i = "";
    return e !== void 0 && (i += "/" + e), t !== "" && (i += "/" + s), i;
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
    const t = this.getPath(e.directory, e.path), s = await this.dbRequest("get", [t]);
    if (s === void 0)
      throw Error("File does not exist.");
    return { data: s.content ? s.content : "" };
  }
  /**
   * Write a file to disk in the specified location on device
   * @param options options for the file write
   * @return a promise that resolves with the file write result
   */
  async writeFile(e) {
    const t = this.getPath(e.directory, e.path);
    let s = e.data;
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
    if (!i && !(s instanceof Blob) && (s = s.indexOf(",") >= 0 ? s.split(",")[1] : s, !this.isBase64String(s)))
      throw Error("The supplied data is not valid base64 content.");
    const l = Date.now(), d = {
      path: t,
      folder: u,
      type: "file",
      size: s instanceof Blob ? s.size : s.length,
      ctime: l,
      mtime: l,
      content: s
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
    let s = e.data;
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
    if (!i && !this.isBase64String(s))
      throw Error("The supplied data is not valid base64 content.");
    if (r !== void 0) {
      if (r.content instanceof Blob)
        throw Error("The occupied entry contains a Blob object which cannot be appended to.");
      r.content !== void 0 && !i ? s = btoa(atob(r.content) + atob(s)) : s = r.content + s, u = r.ctime;
    }
    const d = {
      path: t,
      folder: a,
      type: "file",
      size: s.length,
      ctime: u,
      mtime: c,
      content: s
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
    const t = this.getPath(e.directory, e.path), s = e.recursive, i = t.substr(0, t.lastIndexOf("/")), a = (t.match(/\//g) || []).length, c = await this.dbRequest("get", [i]), u = await this.dbRequest("get", [t]);
    if (a === 1)
      throw Error("Cannot create Root directory");
    if (u !== void 0)
      throw Error("Current directory does already exist.");
    if (!s && a !== 2 && c === void 0)
      throw Error("Parent directory must exist");
    if (s && a !== 2 && c === void 0) {
      const d = i.substr(i.indexOf("/", 1));
      await this.mkdir({
        path: d,
        directory: e.directory,
        recursive: s
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
    const { path: t, directory: s, recursive: i } = e, a = this.getPath(s, t), c = await this.dbRequest("get", [a]);
    if (c === void 0)
      throw Error("Folder does not exist.");
    if (c.type !== "directory")
      throw Error("Requested path is not a directory");
    const u = await this.readdir({ path: t, directory: s });
    if (u.files.length !== 0 && !i)
      throw Error("Folder is not empty");
    for (const r of u.files) {
      const l = `${t}/${r.name}`;
      (await this.stat({ path: l, directory: s })).type === "file" ? await this.deleteFile({ path: l, directory: s }) : await this.rmdir({ path: l, directory: s, recursive: i });
    }
    await this.dbRequest("delete", [a]);
  }
  /**
   * Return a list of files from the directory (not recursive)
   * @param options the options for the readdir operation
   * @return a promise that resolves with the readdir directory listing result
   */
  async readdir(e) {
    const t = this.getPath(e.directory, e.path), s = await this.dbRequest("get", [t]);
    if (e.path !== "" && s === void 0)
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
    let s = await this.dbRequest("get", [t]);
    return s === void 0 && (s = await this.dbRequest("get", [t + "/"])), {
      uri: s?.path || t
    };
  }
  /**
   * Return data about a file
   * @param options the options for the stat operation
   * @return a promise that resolves with the file stat result
   */
  async stat(e) {
    const t = this.getPath(e.directory, e.path);
    let s = await this.dbRequest("get", [t]);
    if (s === void 0 && (s = await this.dbRequest("get", [t + "/"])), s === void 0)
      throw Error("Entry does not exist.");
    return {
      name: s.path.substring(t.length + 1),
      type: s.type,
      size: s.size,
      ctime: s.ctime,
      mtime: s.mtime,
      uri: s.path
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
    let { toDirectory: s } = e;
    const { to: i, from: a, directory: c } = e;
    if (!i || !a)
      throw Error("Both to and from must be provided");
    s || (s = c);
    const u = this.getPath(c, a), r = this.getPath(s, i);
    if (u === r)
      return {
        uri: r
      };
    if (ys(u, r))
      throw Error("To path cannot contain the from path");
    let l;
    try {
      l = await this.stat({
        path: i,
        directory: s
      });
    } catch {
      const v = i.split("/");
      v.pop();
      const y = v.join("/");
      if (v.length > 0 && (await this.stat({
        path: y,
        directory: s
      })).type !== "directory")
        throw new Error("Parent directory of the to path is a file");
    }
    if (l && l.type === "directory")
      throw new Error("Cannot overwrite a directory with a file");
    const d = await this.stat({
      path: a,
      directory: c
    }), h = async (p, v, y) => {
      const b = this.getPath(s, p), x = await this.dbRequest("get", [b]);
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
        !(p.data instanceof Blob) && !this.isBase64String(p.data) && (v = qe.UTF8);
        const y = await this.writeFile({
          path: i,
          directory: s,
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
            directory: s,
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
            toDirectory: s
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
We._debug = !0;
const bs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  FilesystemWeb: We
}, Symbol.toStringTag, { value: "Module" }));
class xs extends ie {
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
const Ss = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ShareWeb: xs
}, Symbol.toStringTag, { value: "Module" }));
