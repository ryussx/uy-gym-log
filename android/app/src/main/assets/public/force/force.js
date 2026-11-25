var ot;
(function(n) {
  n[n.SCAN_MODE_LOW_POWER = 0] = "SCAN_MODE_LOW_POWER", n[n.SCAN_MODE_BALANCED = 1] = "SCAN_MODE_BALANCED", n[n.SCAN_MODE_LOW_LATENCY = 2] = "SCAN_MODE_LOW_LATENCY";
})(ot || (ot = {}));
var kt;
(function(n) {
  n[n.PHY_LE_1M = 1] = "PHY_LE_1M", n[n.PHY_LE_2M = 2] = "PHY_LE_2M", n[n.PHY_LE_CODED = 3] = "PHY_LE_CODED", n[n.PHY_LE_ALL_SUPPORTED = 255] = "PHY_LE_ALL_SUPPORTED";
})(kt || (kt = {}));
var Et;
(function(n) {
  n[n.CONNECTION_PRIORITY_BALANCED = 0] = "CONNECTION_PRIORITY_BALANCED", n[n.CONNECTION_PRIORITY_HIGH = 1] = "CONNECTION_PRIORITY_HIGH", n[n.CONNECTION_PRIORITY_LOW_POWER = 2] = "CONNECTION_PRIORITY_LOW_POWER";
})(Et || (Et = {}));
/*! Capacitor: https://capacitorjs.com/ - MIT License */
var pe;
(function(n) {
  n.Unimplemented = "UNIMPLEMENTED", n.Unavailable = "UNAVAILABLE";
})(pe || (pe = {}));
class Ge extends Error {
  constructor(e, t, s) {
    super(e), this.message = e, this.code = t, this.data = s;
  }
}
const fn = (n) => {
  var e, t;
  return n?.androidBridge ? "android" : !((t = (e = n?.webkit) === null || e === void 0 ? void 0 : e.messageHandlers) === null || t === void 0) && t.bridge ? "ios" : "web";
}, pn = (n) => {
  const e = n.CapacitorCustomPlatform || null, t = n.Capacitor || {}, s = t.Plugins = t.Plugins || {}, i = () => e !== null ? e.name : fn(n), a = () => i() !== "web", o = (c) => {
    const h = u.get(c);
    return !!(h?.platforms.has(i()) || l(c));
  }, l = (c) => {
    var h;
    return (h = t.PluginHeaders) === null || h === void 0 ? void 0 : h.find((p) => p.name === c);
  }, d = (c) => n.console.error(c), u = /* @__PURE__ */ new Map(), f = (c, h = {}) => {
    const p = u.get(c);
    if (p)
      return console.warn(`Capacitor plugin "${c}" already registered. Cannot register plugins twice.`), p.proxy;
    const g = i(), v = l(c);
    let y;
    const x = async () => (!y && g in h ? y = typeof h[g] == "function" ? y = await h[g]() : y = h[g] : e !== null && !y && "web" in h && (y = typeof h.web == "function" ? y = await h.web() : y = h.web), y), H = (P, A) => {
      var m, k;
      if (v) {
        const L = v?.methods.find((E) => A === E.name);
        if (L)
          return L.rtype === "promise" ? (E) => t.nativePromise(c, A.toString(), E) : (E, ce) => t.nativeCallback(c, A.toString(), E, ce);
        if (P)
          return (m = P[A]) === null || m === void 0 ? void 0 : m.bind(P);
      } else {
        if (P)
          return (k = P[A]) === null || k === void 0 ? void 0 : k.bind(P);
        throw new Ge(`"${c}" plugin is not implemented on ${g}`, pe.Unimplemented);
      }
    }, B = (P) => {
      let A;
      const m = (...k) => {
        const L = x().then((E) => {
          const ce = H(E, P);
          if (ce) {
            const le = ce(...k);
            return A = le?.remove, le;
          } else
            throw new Ge(`"${c}.${P}()" is not implemented on ${g}`, pe.Unimplemented);
        });
        return P === "addListener" && (L.remove = async () => A()), L;
      };
      return m.toString = () => `${P.toString()}() { [capacitor code] }`, Object.defineProperty(m, "name", {
        value: P,
        writable: !1,
        configurable: !1
      }), m;
    }, U = B("addListener"), q = B("removeListener"), F = (P, A) => {
      const m = U({ eventName: P }, A), k = async () => {
        const E = await m;
        q({
          eventName: P,
          callbackId: E
        }, A);
      }, L = new Promise((E) => m.then(() => E({ remove: k })));
      return L.remove = async () => {
        console.warn("Using addListener() without 'await' is deprecated."), await k();
      }, L;
    }, T = new Proxy({}, {
      get(P, A) {
        switch (A) {
          case "$$typeof":
            return;
          case "toJSON":
            return () => ({});
          case "addListener":
            return v ? F : U;
          case "removeListener":
            return q;
          default:
            return B(A);
        }
      }
    });
    return s[c] = T, u.set(c, {
      name: c,
      proxy: T,
      platforms: /* @__PURE__ */ new Set([...Object.keys(h), ...v ? [g] : []])
    }), T;
  };
  return t.convertFileSrc || (t.convertFileSrc = (c) => c), t.getPlatform = i, t.handleError = d, t.isNativePlatform = a, t.isPluginAvailable = o, t.registerPlugin = f, t.Exception = Ge, t.DEBUG = !!t.DEBUG, t.isLoggingEnabled = !!t.isLoggingEnabled, t;
}, gn = (n) => n.Capacitor = pn(n), I = /* @__PURE__ */ gn(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {}), se = I.registerPlugin;
class ie {
  constructor() {
    this.listeners = {}, this.retainedEventArguments = {}, this.windowListeners = {};
  }
  addListener(e, t) {
    let s = !1;
    this.listeners[e] || (this.listeners[e] = [], s = !0), this.listeners[e].push(t);
    const a = this.windowListeners[e];
    a && !a.registered && this.addWindowListener(a), s && this.sendRetainedArgumentsForEvent(e);
    const o = async () => this.removeListener(e, t);
    return Promise.resolve({ remove: o });
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
    return new I.Exception(e, pe.Unimplemented);
  }
  unavailable(e = "not available") {
    return new I.Exception(e, pe.Unavailable);
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
const Lt = (n) => encodeURIComponent(n).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape), Ct = (n) => n.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class mn extends ie {
  async getCookies() {
    const e = document.cookie, t = {};
    return e.split(";").forEach((s) => {
      if (s.length <= 0)
        return;
      let [i, a] = s.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
      i = Ct(i).trim(), a = Ct(a).trim(), t[i] = a;
    }), t;
  }
  async setCookie(e) {
    try {
      const t = Lt(e.key), s = Lt(e.value), i = e.expires ? `; expires=${e.expires.replace("expires=", "")}` : "", a = (e.path || "/").replace("path=", ""), o = e.url != null && e.url.length > 0 ? `domain=${e.url}` : "";
      document.cookie = `${t}=${s || ""}${i}; path=${a}; ${o};`;
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
  web: () => new mn()
});
const vn = async (n) => new Promise((e, t) => {
  const s = new FileReader();
  s.onload = () => {
    const i = s.result;
    e(i.indexOf(",") >= 0 ? i.split(",")[1] : i);
  }, s.onerror = (i) => t(i), s.readAsDataURL(n);
}), wn = (n = {}) => {
  const e = Object.keys(n);
  return Object.keys(n).map((i) => i.toLocaleLowerCase()).reduce((i, a, o) => (i[a] = n[e[o]], i), {});
}, yn = (n, e = !0) => n ? Object.entries(n).reduce((s, i) => {
  const [a, o] = i;
  let l, d;
  return Array.isArray(o) ? (d = "", o.forEach((u) => {
    l = e ? encodeURIComponent(u) : u, d += `${a}=${l}&`;
  }), d.slice(0, -1)) : (l = e ? encodeURIComponent(o) : o, d = `${a}=${l}`), `${s}&${d}`;
}, "").substr(1) : null, Ut = (n, e = {}) => {
  const t = Object.assign({ method: n.method || "GET", headers: n.headers }, e), i = wn(n.headers)["content-type"] || "";
  if (typeof n.data == "string")
    t.body = n.data;
  else if (i.includes("application/x-www-form-urlencoded")) {
    const a = new URLSearchParams();
    for (const [o, l] of Object.entries(n.data || {}))
      a.set(o, l);
    t.body = a.toString();
  } else if (i.includes("multipart/form-data") || n.data instanceof FormData) {
    const a = new FormData();
    if (n.data instanceof FormData)
      n.data.forEach((l, d) => {
        a.append(d, l);
      });
    else
      for (const l of Object.keys(n.data))
        a.append(l, n.data[l]);
    t.body = a;
    const o = new Headers(t.headers);
    o.delete("content-type"), t.headers = o;
  } else (i.includes("application/json") || typeof n.data == "object") && (t.body = JSON.stringify(n.data));
  return t;
};
class bn extends ie {
  /**
   * Perform an Http request given a set of options
   * @param options Options to build the HTTP request
   */
  async request(e) {
    const t = Ut(e, e.webFetchExtra), s = yn(e.params, e.shouldEncodeUrlParams), i = s ? `${e.url}?${s}` : e.url, a = await fetch(i, t), o = a.headers.get("content-type") || "";
    let { responseType: l = "text" } = a.ok ? e : {};
    o.includes("application/json") && (l = "json");
    let d, u;
    switch (l) {
      case "arraybuffer":
      case "blob":
        u = await a.blob(), d = await vn(u);
        break;
      case "json":
        d = await a.json();
        break;
      case "document":
      case "text":
      default:
        d = await a.text();
    }
    const f = {};
    return a.headers.forEach((c, h) => {
      f[h] = c;
    }), {
      data: d,
      headers: f,
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
  web: () => new bn()
});
var Pt;
(function(n) {
  n.Dark = "DARK", n.Light = "LIGHT", n.Default = "DEFAULT";
})(Pt || (Pt = {}));
var Dt;
(function(n) {
  n.StatusBar = "StatusBar", n.NavigationBar = "NavigationBar";
})(Dt || (Dt = {}));
class xn extends ie {
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
  web: () => new xn()
});
function Sn(n) {
  return new DataView(Uint8Array.from(n).buffer);
}
function kn(n) {
  return Array.from(new Uint8Array(n.buffer, n.byteOffset, n.byteLength));
}
function En(n) {
  return `0000${n.toString(16).padStart(4, "0")}-0000-1000-8000-00805f9b34fb`;
}
function Se(n) {
  const e = [];
  let t, s, i = 1, a = 0;
  for (t = 0; t < n.length; t++)
    s = n.charCodeAt(t), (s > 47 && s < 58 || s > 64 && s < 71 || s > 96 && s < 103) && (a = a << 4 ^ (s > 64 ? s + 9 : s) & 15, (i ^= 1) && e.push(a & 255));
  return Sn(e);
}
function ke(n) {
  return kn(n).map((e) => {
    let t = e.toString(16);
    return t.length == 1 && (t = "0" + t), t;
  }).join("");
}
function Ln(n) {
  if (typeof n == "string")
    return n;
  if (typeof n == "number")
    return En(n);
  throw new Error("Invalid UUID");
}
function $t(n) {
  const e = {};
  if (n)
    return n.forEach((t, s) => {
      e[s.toString()] = t;
    }), e;
}
function Ot(n) {
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
function Ye(n) {
  if (typeof SharedArrayBuffer < "u" && n.buffer instanceof SharedArrayBuffer) {
    const t = new Uint8Array(n.buffer, n.byteOffset, n.byteLength).slice().buffer;
    return new DataView(t);
  }
  return n;
}
const w = se("BluetoothLe", {
  web: () => Promise.resolve().then(() => fs).then((n) => new n.BluetoothLeWeb())
}), Cn = () => {
  let n = Promise.resolve();
  return (e) => new Promise((t, s) => {
    n = n.then(() => e()).then(t).catch(s);
  });
};
function Je(n) {
  return n ? Cn() : (e) => e();
}
function C(n) {
  if (typeof n != "string")
    throw new Error(`Invalid UUID type ${typeof n}. Expected string.`);
  if (n = n.toLowerCase(), !(n.search(/^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/) >= 0))
    throw new Error(`Invalid UUID format ${n}. Expected 128 bit string (e.g. "0000180d-0000-1000-8000-00805f9b34fb").`);
  return n;
}
class Pn {
  constructor() {
    this.scanListener = null, this.eventListeners = /* @__PURE__ */ new Map(), this.queue = Je(!0);
  }
  enableQueue() {
    this.queue = Je(!0);
  }
  disableQueue() {
    this.queue = Je(!1);
  }
  async initialize(e) {
    await this.queue(async () => {
      await w.initialize(e);
    });
  }
  async isEnabled() {
    return await this.queue(async () => (await w.isEnabled()).value);
  }
  async requestEnable() {
    await this.queue(async () => {
      await w.requestEnable();
    });
  }
  async enable() {
    await this.queue(async () => {
      await w.enable();
    });
  }
  async disable() {
    await this.queue(async () => {
      await w.disable();
    });
  }
  async startEnabledNotifications(e) {
    await this.queue(async () => {
      var t;
      const s = "onEnabledChanged";
      await ((t = this.eventListeners.get(s)) === null || t === void 0 ? void 0 : t.remove());
      const i = await w.addListener(s, (a) => {
        e(a.value);
      });
      this.eventListeners.set(s, i), await w.startEnabledNotifications();
    });
  }
  async stopEnabledNotifications() {
    await this.queue(async () => {
      var e;
      const t = "onEnabledChanged";
      await ((e = this.eventListeners.get(t)) === null || e === void 0 ? void 0 : e.remove()), this.eventListeners.delete(t), await w.stopEnabledNotifications();
    });
  }
  async isLocationEnabled() {
    return await this.queue(async () => (await w.isLocationEnabled()).value);
  }
  async openLocationSettings() {
    await this.queue(async () => {
      await w.openLocationSettings();
    });
  }
  async openBluetoothSettings() {
    await this.queue(async () => {
      await w.openBluetoothSettings();
    });
  }
  async openAppSettings() {
    await this.queue(async () => {
      await w.openAppSettings();
    });
  }
  async setDisplayStrings(e) {
    await this.queue(async () => {
      await w.setDisplayStrings(e);
    });
  }
  async requestDevice(e) {
    return e = e ? this.validateRequestBleDeviceOptions(e) : void 0, await this.queue(async () => await w.requestDevice(e));
  }
  async requestLEScan(e, t) {
    e = this.validateRequestBleDeviceOptions(e), await this.queue(async () => {
      var s;
      await ((s = this.scanListener) === null || s === void 0 ? void 0 : s.remove()), this.scanListener = await w.addListener("onScanResult", (i) => {
        const a = Object.assign(Object.assign({}, i), { manufacturerData: this.convertObject(i.manufacturerData), serviceData: this.convertObject(i.serviceData), rawAdvertisement: i.rawAdvertisement ? this.convertValue(i.rawAdvertisement) : void 0 });
        t(a);
      }), await w.requestLEScan(e);
    });
  }
  async stopLEScan() {
    await this.queue(async () => {
      var e;
      await ((e = this.scanListener) === null || e === void 0 ? void 0 : e.remove()), this.scanListener = null, await w.stopLEScan();
    });
  }
  async getDevices(e) {
    if (!Array.isArray(e))
      throw new Error("deviceIds must be an array");
    return this.queue(async () => (await w.getDevices({ deviceIds: e })).devices);
  }
  async getConnectedDevices(e) {
    if (!Array.isArray(e))
      throw new Error("services must be an array");
    return e = e.map(C), this.queue(async () => (await w.getConnectedDevices({ services: e })).devices);
  }
  async getBondedDevices() {
    return this.queue(async () => (await w.getBondedDevices()).devices);
  }
  async connect(e, t, s) {
    await this.queue(async () => {
      var i;
      if (t) {
        const a = `disconnected|${e}`;
        await ((i = this.eventListeners.get(a)) === null || i === void 0 ? void 0 : i.remove());
        const o = await w.addListener(a, () => {
          t(e);
        });
        this.eventListeners.set(a, o);
      }
      await w.connect(Object.assign({ deviceId: e }, s));
    });
  }
  async createBond(e, t) {
    await this.queue(async () => {
      await w.createBond(Object.assign({ deviceId: e }, t));
    });
  }
  async isBonded(e) {
    return await this.queue(async () => (await w.isBonded({ deviceId: e })).value);
  }
  async disconnect(e) {
    await this.queue(async () => {
      await w.disconnect({ deviceId: e });
    });
  }
  async getServices(e) {
    return await this.queue(async () => (await w.getServices({ deviceId: e })).services);
  }
  async discoverServices(e) {
    await this.queue(async () => {
      await w.discoverServices({ deviceId: e });
    });
  }
  async getMtu(e) {
    return await this.queue(async () => (await w.getMtu({ deviceId: e })).value);
  }
  async requestConnectionPriority(e, t) {
    await this.queue(async () => {
      await w.requestConnectionPriority({ deviceId: e, connectionPriority: t });
    });
  }
  async readRssi(e) {
    return await this.queue(async () => {
      const s = await w.readRssi({ deviceId: e });
      return parseFloat(s.value);
    });
  }
  async read(e, t, s, i) {
    return t = C(t), s = C(s), await this.queue(async () => {
      const o = await w.read(Object.assign({
        deviceId: e,
        service: t,
        characteristic: s
      }, i));
      return this.convertValue(o.value);
    });
  }
  async write(e, t, s, i, a) {
    return t = C(t), s = C(s), this.queue(async () => {
      if (!i?.buffer)
        throw new Error("Invalid data.");
      let o = i;
      I.getPlatform() !== "web" && (o = ke(i)), await w.write(Object.assign({
        deviceId: e,
        service: t,
        characteristic: s,
        value: o
      }, a));
    });
  }
  async writeWithoutResponse(e, t, s, i, a) {
    t = C(t), s = C(s), await this.queue(async () => {
      if (!i?.buffer)
        throw new Error("Invalid data.");
      let o = i;
      I.getPlatform() !== "web" && (o = ke(i)), await w.writeWithoutResponse(Object.assign({
        deviceId: e,
        service: t,
        characteristic: s,
        value: o
      }, a));
    });
  }
  async readDescriptor(e, t, s, i, a) {
    return t = C(t), s = C(s), i = C(i), await this.queue(async () => {
      const l = await w.readDescriptor(Object.assign({
        deviceId: e,
        service: t,
        characteristic: s,
        descriptor: i
      }, a));
      return this.convertValue(l.value);
    });
  }
  async writeDescriptor(e, t, s, i, a, o) {
    return t = C(t), s = C(s), i = C(i), this.queue(async () => {
      if (!a?.buffer)
        throw new Error("Invalid data.");
      let l = a;
      I.getPlatform() !== "web" && (l = ke(a)), await w.writeDescriptor(Object.assign({
        deviceId: e,
        service: t,
        characteristic: s,
        descriptor: i,
        value: l
      }, o));
    });
  }
  async startNotifications(e, t, s, i, a) {
    t = C(t), s = C(s), await this.queue(async () => {
      var o;
      const l = `notification|${e}|${t}|${s}`;
      await ((o = this.eventListeners.get(l)) === null || o === void 0 ? void 0 : o.remove());
      const d = await w.addListener(l, (u) => {
        i(this.convertValue(u?.value));
      });
      this.eventListeners.set(l, d), await w.startNotifications(Object.assign({
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
      await ((i = this.eventListeners.get(a)) === null || i === void 0 ? void 0 : i.remove()), this.eventListeners.delete(a), await w.stopNotifications({
        deviceId: e,
        service: t,
        characteristic: s
      });
    });
  }
  validateRequestBleDeviceOptions(e) {
    return e = Object.assign({}, e), e.services && (e.services = e.services.map(C)), e.optionalServices && (e.optionalServices = e.optionalServices.map(C)), e.serviceData && I.getPlatform() !== "web" && (e.serviceData = e.serviceData.map((t) => Object.assign(Object.assign({}, t), { serviceUuid: C(t.serviceUuid), dataPrefix: Oe(t.dataPrefix), mask: Oe(t.mask) }))), e.manufacturerData && (I.getPlatform() !== "web" ? e.manufacturerData = e.manufacturerData.map((t) => Object.assign(Object.assign({}, t), { dataPrefix: Oe(t.dataPrefix), mask: Oe(t.mask) })) : e.manufacturerData = e.manufacturerData.map((t) => Object.assign(Object.assign({}, t), { dataPrefix: Ot(t.dataPrefix), mask: Ot(t.mask) }))), e;
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
const he = new Pn(), Xe = 256, Ze = 10, Dn = 4e3;
class Vt {
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
    this.setStatus("live"), this.sampleFns.forEach((s) => s(t)), this.lostTimer && clearTimeout(this.lostTimer), this.lostTimer = setTimeout(() => this.setStatus("lost"), Dn);
  }
  clearLost() {
    this.lostTimer && clearTimeout(this.lostTimer), this.lostTimer = null;
  }
}
function Tt(n) {
  let e = "";
  for (let t = 0; t < n.byteLength; t++) e += n.getUint8(t).toString(16).padStart(2, "0") + " ";
  return e.trim();
}
function At(n, e) {
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
function $n(n) {
  return n.byteLength < Ze + 2 ? null : (n.getUint8(Ze) << 8 | n.getUint8(Ze + 1)) / 100;
}
class Ee extends Vt {
  constructor() {
    super(...arguments), this.name = "WeiHeng scale", this.scanning = !1, this.seen = /* @__PURE__ */ new Map(), this.onSeen = () => {
    }, this.lastScanStart = 0, this.healTimer = null, this.lastPacketAt = 0, this.restarts = 0;
  }
  async start() {
    if (!I.isNativePlatform())
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
      { allowDuplicates: !0, scanMode: ot.SCAN_MODE_LOW_LATENCY },
      (e) => {
        const t = e.localName ?? e.device.name ?? "", s = e.manufacturerData ?? {}, i = Object.keys(s);
        let a = s[String(Xe)] ?? s[Xe.toString(16)];
        !a && /^(IF_|WH-|WEIHENG)/i.test(t) && i.length && (a = s[i[0]]), !a && e.rawAdvertisement && (a = At(e.rawAdvertisement, Xe) ?? (/^IF_/i.test(t) ? At(e.rawAdvertisement) : void 0));
        const o = a ? $n(a) : null, l = { id: e.device.deviceId, name: t, rssi: e.rssi ?? 0, keys: i.join(","), hex: a ? Tt(a) : e.rawAdvertisement ? Tt(e.rawAdvertisement).slice(0, 60) : "", kg: o, t: Date.now() };
        this.seen.set(l.id, l), this.onSeen(l), o !== null && (this.lastPacketAt = Date.now(), this.emitRaw(o));
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
class On extends Vt {
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
const Tn = { both: "", left: "Left", right: "Right" }, An = { complete: "", concentric: "Concentric", eccentric: "Eccentric" };
function ve(n, e, t, s) {
  const i = [s?.trim() ?? "", Tn[e] ?? "", An[t ?? "complete"] ?? ""].filter(Boolean);
  return i.length ? `${n} — ${i.join(", ")}` : n;
}
function Pe(n, e, t, s) {
  const i = t ?? "complete", a = s?.trim() ?? "";
  let o = i === "complete" && !a ? `${n}|${e}` : `${n}|${e}|${i}`;
  return a && (o += `|${a}`), o;
}
function _n(n, e, t, s, i) {
  return n.exercise === e && n.side === t && (n.contraction ?? "complete") === (s ?? "complete") && (n.handle ?? "") === (i?.trim() ?? "");
}
function ge(n) {
  return n.manualReps && n.manualReps > 0 ? Math.round(n.manualReps) : 1;
}
function de(n) {
  return n.performedAt ?? n.startedAt;
}
const Me = 2;
class Rn {
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
    const s = Ht(t);
    return {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      exercise: e.exercise,
      side: e.side,
      contraction: e.contraction ?? "complete",
      handle: e.handle?.trim() || void 0,
      mode: e.mode,
      startedAt: this.t0,
      durationS: t[t.length - 1].t,
      samples: t,
      ...s,
      reps: mt(t)
    };
  }
}
function Ht(n) {
  let e = 0, t = 0, s = 0;
  for (let l = 0; l < n.length; l++) {
    const d = Math.max(0, n[l].kg);
    e = Math.max(e, d), t += d, l > 0 && (s += d * (n[l].t - n[l - 1].t));
  }
  const i = t / n.length, a = n.filter((l) => l.kg > Me);
  let o = 0;
  if (a.length >= 10) {
    const l = Math.max(3, Math.floor(a.length * 0.2)), d = Math.max(...a.slice(0, l).map((f) => f.kg)), u = Math.max(...a.slice(-l).map((f) => f.kg));
    o = d > 0 ? Math.max(0, (d - u) / d * 100) : 0;
  }
  return { peak: R(e), avg: R(i), output: R(s), inroad: R(o) };
}
function mt(n) {
  if (n.length < 5) return [];
  const e = Math.max(...n.map((u) => u.kg));
  if (e < Me * 2) return [];
  const t = Math.max(Me, e * 0.35), s = Math.max(Me * 0.5, e * 0.2), i = [];
  let a = !1, o = 0, l = 0, d = 0;
  for (const u of n)
    !a && u.kg >= t ? (a = !0, o = u.t, l = u.kg, d = u.t) : a && (u.kg > l && (l = u.kg, d = u.t), u.kg <= s && (u.t - o >= 0.6 && i.push({ index: i.length + 1, peak: R(l), peakT: R(d), startS: R(o), endS: R(u.t), durationS: R(u.t - o) }), a = !1));
  if (a) {
    const u = n[n.length - 1].t;
    u - o >= 0.6 && i.push({ index: i.length + 1, peak: R(l), peakT: R(d), startS: R(o), endS: R(u), durationS: R(u - o) });
  }
  return i.length >= 2 ? i : [];
}
function Mn(n) {
  if (n.length < 6) return null;
  const e = n.slice(-Math.max(3, Math.floor(n.length / 3)));
  return R(e.reduce((t, s) => t + s.peak, 0) / e.length);
}
function R(n) {
  return Math.round(n * 100) / 100;
}
class Wt {
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
    const { ctx: i } = this, a = this.canvas.width / this.dpr, o = this.canvas.height / this.dpr, l = 42, d = 12, u = 12, f = 24, c = a - l - d, h = o - u - f, p = getComputedStyle(document.getElementById("view-force") ?? document.documentElement), g = p.getPropertyValue("--muted").trim() || "#888", v = p.getPropertyValue("--grid").trim() || "#333", y = p.getPropertyValue("--accent").trim() || "#e8552f", x = p.getPropertyValue("--ghost").trim() || "#7a7a7a", H = p.getPropertyValue("--zone").trim() || "rgba(60,180,90,0.18)";
    i.clearRect(0, 0, a, o);
    const B = Math.max(this.opts.windowS, Math.ceil(t / 10) * 10 || 10), U = this.opts.ghost ?? [];
    let q = 10;
    for (const m of e) q = Math.max(q, m.kg);
    for (const m of U) q = Math.max(q, m.kg);
    this.opts.zone && (q = Math.max(q, this.opts.zone.hi)), q = In(q * 1.1);
    const F = (m) => l + m / B * c, T = (m) => u + h - Math.max(0, m) / q * h;
    if (this.opts.zone) {
      i.fillStyle = H;
      const m = T(this.opts.zone.hi), k = T(this.opts.zone.lo);
      i.fillRect(l, m, c, k - m);
    }
    i.strokeStyle = v, i.lineWidth = 1, i.fillStyle = g, i.font = "11px system-ui, sans-serif", i.textAlign = "right", i.textBaseline = "middle";
    const P = 5;
    for (let m = 0; m <= P; m++) {
      const k = q / P * m, L = T(k);
      i.beginPath(), i.moveTo(l, L), i.lineTo(a - d, L), i.stroke(), i.fillText(k.toFixed(0), l - 6, L);
    }
    i.textAlign = "center", i.textBaseline = "top";
    const A = B <= 30 ? 5 : B <= 90 ? 10 : 30;
    for (let m = 0; m <= B; m += A) {
      const k = F(m);
      i.beginPath(), i.moveTo(k, u), i.lineTo(k, u + h), i.stroke(), i.fillText(Fn(m), k, u + h + 6);
    }
    if (this.opts.marks?.length) {
      i.strokeStyle = x, i.setLineDash([3, 4]);
      for (const m of this.opts.marks)
        i.beginPath(), i.moveTo(F(m), u), i.lineTo(F(m), u + h), i.stroke();
      i.setLineDash([]);
    }
    if (U.length > 1 && (i.strokeStyle = x, i.lineWidth = 1.5, i.globalAlpha = 0.55, i.beginPath(), U.forEach((m, k) => k ? i.lineTo(F(m.t), T(m.kg)) : i.moveTo(F(m.t), T(m.kg))), i.stroke(), i.globalAlpha = 1), e.length > 1) {
      i.strokeStyle = y, i.lineWidth = 2.5, i.lineJoin = "round", i.beginPath(), e.forEach((L, E) => E ? i.lineTo(F(L.t), T(L.kg)) : i.moveTo(F(L.t), T(L.kg))), i.stroke();
      const m = e[e.length - 1];
      i.lineTo(F(m.t), T(0)), i.lineTo(F(e[0].t), T(0)), i.closePath(), i.fillStyle = y, i.globalAlpha = 0.12, i.fill(), i.globalAlpha = 1;
      const k = this.opts.peaks ?? [];
      if (k.length) {
        const L = Math.max(...k.map((E) => E.kg));
        i.font = "bold 11px system-ui, sans-serif", i.textAlign = "center", i.textBaseline = "bottom";
        for (const E of k) {
          const ce = F(E.t), le = T(E.kg);
          i.fillStyle = E.kg === L ? y : "#ecebe6", i.beginPath(), i.arc(ce, le, 3.5, 0, Math.PI * 2), i.fill();
          const bt = E.kg.toFixed(0), $e = i.measureText(bt).width + 8, xt = Math.min(Math.max(ce, l + $e / 2), l + c - $e / 2), St = Math.max(u + 14, le - 6);
          i.fillStyle = E.kg === L ? y : "rgba(40,42,48,0.92)", i.fillRect(xt - $e / 2, St - 14, $e, 14), i.fillStyle = "#fff", i.fillText(bt, xt, St - 1);
        }
        i.textAlign = "left", i.textBaseline = "alphabetic";
      }
      i.fillStyle = y, i.beginPath(), i.arc(F(m.t), T(m.kg), 4, 0, Math.PI * 2), i.fill();
    } else s > 0 && (i.fillStyle = y, i.beginPath(), i.arc(F(0), T(s), 4, 0, Math.PI * 2), i.fill());
  }
}
function In(n) {
  const e = [10, 20, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500];
  for (const t of e) if (n <= t) return t;
  return Math.ceil(n / 100) * 100;
}
function Fn(n) {
  const e = Math.floor(n / 60), t = n % 60;
  return `${e}:${t.toString().padStart(2, "0")}`;
}
function ze(n, e = {}) {
  const t = e.hold ?? 10, s = e.rest ?? 20, i = e.reps ?? 6, a = e.ramp ?? 5, o = e.total ?? 60;
  switch (n) {
    case "free":
      return { id: n, label: "Free set", describe: "Open-ended. Start, work, stop.", phases: [] };
    case "countdown":
      return {
        id: n,
        label: `Countdown ${o}s`,
        describe: "One continuous max effort for the whole timer — the ARX protocol.",
        phases: [{ name: "Get ready", seconds: 3, cue: "rest" }, { name: "GO — max effort", seconds: o, cue: "work" }]
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
      return ze("free");
  }
}
function zt(n) {
  if (!n.repeat || n.phases.length < 2) return n.phases;
  const [e, ...t] = n.phases, s = [e];
  for (let i = 0; i < n.repeat; i++)
    for (const a of t)
      i === n.repeat - 1 && a === t[t.length - 1] && a.cue === "rest" || s.push({ ...a, name: t.length > 1 && a.cue !== "rest" ? `${a.name} ${i + 1}/${n.repeat}` : a.name });
  return s;
}
class Bn {
  constructor() {
    this.timeline = [], this.idx = -1, this.phaseStart = 0, this.timer = null, this.running = !1, this.onPhase = () => {
    }, this.onTick = () => {
    }, this.onDone = () => {
    };
  }
  start(e) {
    this.timeline = zt(e), this.idx = -1, this.running = !0, this.next(), this.timer = setInterval(() => this.tick(), 100);
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
var _t;
(function(n) {
  n[n.Flush = 0] = "Flush", n[n.Add = 1] = "Add";
})(_t || (_t = {}));
const Te = se("TextToSpeech", {
  web: () => Promise.resolve().then(() => gs).then((n) => new n.TextToSpeechWeb())
}), Ae = I.isNativePlatform();
let Qe = null;
function qn() {
  return Qe || (Qe = new (window.AudioContext || window.webkitAudioContext)()), Qe;
}
function ae(n = 880, e = 120, t = 0.25) {
  try {
    const s = qn(), i = s.createOscillator(), a = s.createGain();
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
class Nn {
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
          const o = this.keep.indexOf(a);
          o >= 0 && this.keep.splice(o, 1);
        }, speechSynthesis.speak(a), this.lastSpoke = i, this.lastText = e;
      } catch {
      }
  }
}
function jn(n) {
  const e = Math.floor(n / 60), t = n % 60;
  return t === 0 && e > 0 ? e === 1 ? "1 minute" : `${e} minutes` : String(t);
}
const Rt = se("KeepAwake", {
  web: () => Promise.resolve().then(() => vs).then((n) => new n.KeepAwakeWeb())
}), Kt = se("Preferences", {
  web: () => Promise.resolve().then(() => ys).then((n) => new n.PreferencesWeb())
}), we = "ufl.sets.v1", _e = "ufl.max.v1", et = "ufl.exercises.v1", Gt = [
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
async function tt(n, e) {
  try {
    const t = I.isNativePlatform() ? (await Kt.get({ key: n })).value : localStorage.getItem(n);
    return t ? JSON.parse(t) : e;
  } catch {
    return e;
  }
}
async function Q(n, e) {
  const t = JSON.stringify(e);
  I.isNativePlatform() ? await Kt.set({ key: n, value: t }) : localStorage.setItem(n, t);
}
const O = {
  async sets() {
    return tt(we, []);
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
    return tt(_e, {});
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
    return tt(et, Gt);
  },
  /** Rename an exercise in every stored set and max (and the local list). */
  async renameExercise(n, e) {
    const t = await this.sets();
    for (const o of t) o.exercise === n && (o.exercise = e);
    await Q(we, t);
    const s = await this.maxes(), i = {};
    for (const [o, l] of Object.entries(s)) {
      const [d, ...u] = o.split("|"), f = [d === n ? e : d, ...u].join("|");
      (!i[f] || i[f].kg < l.kg) && (i[f] = l);
    }
    await Q(_e, i);
    const a = await this.exercises();
    if (a.includes(n)) {
      const o = a.map((l) => l === n ? e : l);
      await Q(et, [...new Set(o)]);
    }
  },
  async saveExercises(n) {
    await Q(et, n);
  }
};
function Vn(n) {
  n.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, t) {
        return new Proxy({}, {
          get(s, i) {
            return (a, o, l) => {
              const d = n.Capacitor.Plugins[t];
              if (d === void 0) {
                l(new Error(`Capacitor plugin ${t} not found`));
                return;
              }
              if (typeof d[i] != "function") {
                l(new Error(`Method ${i} not found in Capacitor plugin ${t}`));
                return;
              }
              (async () => {
                try {
                  const u = await d[i](a);
                  o(u);
                } catch (u) {
                  l(u);
                }
              })();
            };
          }
        });
      }
    }
  );
}
function Hn(n) {
  n.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, t) {
        return n.cordova.plugins[t];
      }
    }
  );
}
function Wn(n = !1) {
  typeof window > "u" || (window.CapacitorUtils = window.CapacitorUtils || {}, window.Capacitor !== void 0 && !n ? Vn(window) : window.cordova !== void 0 && Hn(window));
}
var ct;
(function(n) {
  n.Documents = "DOCUMENTS", n.Data = "DATA", n.Library = "LIBRARY", n.Cache = "CACHE", n.External = "EXTERNAL", n.ExternalStorage = "EXTERNAL_STORAGE", n.ExternalCache = "EXTERNAL_CACHE", n.LibraryNoCloud = "LIBRARY_NO_CLOUD", n.Temporary = "TEMPORARY";
})(ct || (ct = {}));
var Ne;
(function(n) {
  n.UTF8 = "utf8", n.ASCII = "ascii", n.UTF16 = "utf16";
})(Ne || (Ne = {}));
const zn = se("Filesystem", {
  web: () => Promise.resolve().then(() => xs).then((n) => new n.FilesystemWeb())
});
Wn();
const Kn = se("Share", {
  web: () => Promise.resolve().then(() => ks).then((n) => new n.ShareWeb())
});
function Gn(n) {
  const e = ["id", "date_performed", "recorded_at", "exercise", "side", "contraction", "handle", "mode", "duration_s", "peak_kg", "avg_kg", "output_kgs", "inroad_pct", "reps", "auto_reps", "rep_peaks"], t = n.map((s) => [
    s.id,
    De(de(s)),
    new Date(s.startedAt).toISOString(),
    nt(s.exercise),
    s.side,
    s.contraction ?? "complete",
    nt(s.handle ?? ""),
    s.mode,
    s.durationS.toFixed(1),
    s.peak,
    s.avg,
    s.output,
    s.inroad,
    ge(s),
    s.reps?.length ?? 0,
    nt((s.reps ?? []).map((i) => i.peak).join(" "))
  ].join(","));
  return [e.join(","), ...t].join(`
`);
}
function Yn(n) {
  return ["t_s,kg", ...n.samples.map((e) => `${e.t.toFixed(2)},${e.kg.toFixed(2)}`)].join(`
`);
}
function nt(n) {
  return `"${n.replace(/"/g, '""')}"`;
}
async function lt(n, e, t) {
  if (I.isNativePlatform()) {
    const o = await zn.writeFile({ path: n, data: e, directory: ct.Cache, encoding: Ne.UTF8 });
    await Kn.share({ title: n, files: [o.uri] });
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
class Jn {
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
function Yt(n) {
  return {
    id: `fl-${n.id}`,
    date: De(de(n)),
    exercise: ve(n.exercise, n.side, n.contraction, n.handle),
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
    for (const e of Gt) n.addExercise(e);
}
let W = null;
const Jt = /* @__PURE__ */ new Map();
function Zn(n) {
  Jt.get(n)?.();
}
function ue(n) {
  return n.replace(/[&<>"']/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[e]);
}
function st(n, e) {
  n.classList.add("picker-hidden");
  const t = document.createElement("button");
  t.type = "button", t.className = "picker-btn", n.insertAdjacentElement("afterend", t);
  const s = () => {
    const i = n.value;
    t.textContent = i || (e.allOption?.label ?? "Choose…"), t.disabled = n.disabled;
  };
  return s(), new MutationObserver(s).observe(n, { attributes: !0, childList: !0 }), n.addEventListener("change", s), t.onclick = () => Mt(n, e, s), Jt.set(n, () => Mt(n, e, s)), s;
}
function Mt(n, e, t) {
  ye();
  const s = document.getElementById("view-force") ?? document.body;
  W = document.createElement("div"), W.className = "picker-overlay", W.innerHTML = `<div class="picker-panel">
    <div class="picker-head"><input type="text" class="picker-search" placeholder="Search exercises…" autocomplete="off" /><button type="button" class="sm ghost picker-close">✕</button></div>
    <div class="picker-list"></div>
  </div>`, s.appendChild(W);
  const i = W.querySelector(".picker-search"), a = W.querySelector(".picker-list"), o = (d) => {
    n.value = d, n.dispatchEvent(new Event("change", { bubbles: !0 })), t(), ye();
  }, l = () => {
    const d = i.value.trim().toLowerCase(), u = e.recent().filter((p) => !d || p.toLowerCase().includes(d)), f = e.all().filter((p) => !u.includes(p) && (!d || p.toLowerCase().includes(d))).sort((p, g) => p.localeCompare(g));
    let c = "";
    e.allOption && (!d || e.allOption.label.toLowerCase().includes(d)) && (c += `<button type="button" class="picker-item" data-v="${ue(e.allOption.value)}">${ue(e.allOption.label)}</button>`), u.length && (c += '<div class="picker-group">Recent in Force Lab</div>' + u.map((p) => `<button type="button" class="picker-item" data-v="${ue(p)}">${ue(p)}</button>`).join("")), f.length && (c += `<div class="picker-group">${u.length ? "All exercises" : "Exercises"}</div>` + f.map((p) => `<button type="button" class="picker-item" data-v="${ue(p)}">${ue(p)}</button>`).join(""));
    const h = i.value.trim();
    h && e.onCreate && !e.all().some((p) => p.toLowerCase() === h.toLowerCase()) && (c += `<button type="button" class="picker-item picker-create" data-create="1">+ Create "${ue(h)}"</button>`), c || (c = '<div class="picker-group">No match</div>'), a.innerHTML = c, a.querySelectorAll(".picker-item").forEach((p) => {
      p.onclick = async () => {
        if (p.dataset.create) {
          const g = i.value.trim();
          await e.onCreate(g) && o(g);
          return;
        }
        o(p.dataset.v);
      };
    });
  };
  i.oninput = l, i.onkeydown = (d) => {
    d.key === "Escape" && ye(), d.key === "Enter" && a.querySelector(".picker-item")?.click();
  }, W.querySelector(".picker-close").onclick = ye, W.onclick = (d) => {
    d.target === W && ye();
  }, l(), setTimeout(() => i.focus(), 50);
}
function ye() {
  W?.remove(), W = null;
}
const r = (n) => document.getElementById(n);
let z = null, ee = null, je = 0, b = [], N = [], Ue = null, re = 0, G = 0, fe = null, J = !0, Le = localStorage.getItem("ufl.ghostOn") !== "0", Re = null;
const me = (n, e) => localStorage.getItem(n) ?? e;
let Ie = Math.max(1, Number(me("ufl.calloutEvery", "5"))), ut = me("ufl.calloutOn", "1") === "1", dt = me("ufl.secBeep", "0") === "1", ht = me("ufl.secCount", "0") === "1", Fe = null, it = -1;
const S = new Nn(), j = new Rn(), te = new Bn(), V = new Wt(r("chart")), be = r("progressChart"), Qn = {
  countdown: [{ key: "total", label: "seconds", def: 60 }],
  ramp: [{ key: "ramp", label: "ramp s", def: 5 }, { key: "hold", label: "hold s", def: 10 }],
  repeaters: [{ key: "reps", label: "reps", def: 6 }, { key: "hold", label: "on s", def: 10 }, { key: "rest", label: "off s", def: 20 }]
};
function Ve() {
  const n = r("handle").value;
  return n === "__custom" ? "" : n;
}
function Be() {
  const n = r("exercise").value || "Choose exercise", e = r("side").value, t = r("protocol").value, s = r("contraction").value;
  r("hdrExName").textContent = r("exercise").value ? ve(n, e, s, Ve()) : n, r("hdrExMeta").textContent = t;
}
async function es(n, e) {
  const t = K();
  if (t) {
    if (!t.renameExercise(n, e)) return;
    b = t.exerciseNames();
  } else
    await Xt(n, e), b = await O.exercises();
  oe(), X(), Z(), await _();
}
async function Xt(n, e) {
  await O.renameExercise(n, e), N = await O.sets(), r("exercise").value === n && (oe(), r("exercise").value = e);
}
async function ts() {
  Xn(), b = K()?.exerciseNames() ?? await O.exercises(), N = await O.sets(), oe(), Qt(), await _(), Z(), X(), us(), ln(), S.enabled = r("voiceOn").checked;
}
function at() {
  const n = /* @__PURE__ */ new Map();
  for (const e of N) n.set(e.exercise, Math.max(n.get(e.exercise) ?? 0, e.startedAt));
  for (const e of Object.keys(Zt)) {
    const t = e.split("|")[0];
    n.has(t) || n.set(t, 0);
  }
  return [...n.entries()].filter(([e]) => b.includes(e)).sort((e, t) => t[1] - e[1]).map(([e]) => e);
}
let Zt = {};
async function It(n) {
  if (n = n.trim(), !n) return !1;
  if (!b.includes(n)) {
    const e = K();
    e ? (e.addExercise(n), b = e.exerciseNames()) : (b.push(n), await O.saveExercises(b));
  }
  return oe(), X(), !0;
}
function oe() {
  setTimeout(Be, 0);
  for (const t of ["exercise", "maxExercise"]) {
    const s = r(t), i = s.value;
    s.innerHTML = b.map((a) => `<option>${$(a)}</option>`).join(""), i && b.includes(i) && (s.value = i);
  }
  const n = r("histExercise"), e = n.value;
  n.innerHTML = '<option value="">All</option>' + b.map((t) => `<option>${$(t)}</option>`).join(""), n.value = e;
}
function Qt() {
  const n = r("protocol").value, e = r("params");
  e.innerHTML = (Qn[n] ?? []).map((t) => `<label>${t.label}<input type="number" data-k="${t.key}" value="${t.def}" min="1" /></label>`).join(""), r("protocolHelp").textContent = ze(n, vt()).describe;
}
function vt() {
  const n = {};
  return r("params").querySelectorAll("input").forEach((e) => n[e.dataset.k] = Number(e.value) || 1), n;
}
async function _() {
  const n = r("exercise").value, e = r("side").value, t = r("contraction").value, s = Ve(), i = N.filter((o) => _n(o, n, e, t, s));
  Ue = i.length ? i[i.length - 1] : null, re = i.reduce((o, l) => Math.max(o, l.output), 0);
  const a = await O.maxes();
  Zt = a, G = a[Pe(n, e, t, s)]?.kg ?? 0, r("zoneMax").textContent = G ? `(max ${G} kg → ${qe().lo.toFixed(1)}–${qe().hi.toFixed(1)} kg)` : "(no max yet — run a Max test)", r("sGoal").textContent = re ? D(re) : "–", V.opts.ghost = Le ? Ue?.samples ?? null : null, V.opts.zone = wt() ? qe() : null, j.recording || (V.opts.marks = []);
}
function wt() {
  return r("zoneOn").checked && G > 0;
}
function qe() {
  const n = Number(r("zoneLo").value) / 100 * G, e = Number(r("zoneHi").value) / 100 * G;
  return { lo: Math.min(n, e), hi: Math.max(n, e) };
}
async function ft(n) {
  z && await z.stop(), z = n, n.onStatus(He), n.onSample((e) => {
    je = e.kg, Y === "live" && (r("statusKg").textContent = `${e.kg.toFixed(1)} kg`), j.push(e), ns(e.kg);
  });
  try {
    await n.start(), r("btnTare").disabled = !1, r("btnStart").disabled = !1;
  } catch (e) {
    He("error"), r("statusText").textContent = e.message, alert("Connect failed: " + e.message);
  }
}
let Y = "idle";
function en() {
  return localStorage.getItem("ufl.keepAwake") !== "0";
}
function tn() {
  if (!I.isNativePlatform()) return;
  (en() && (Y === "live" || Y === "scanning" || Y === "lost") ? Rt.keepAwake() : Rt.allowSleep()).catch(() => {
  });
}
function He(n) {
  Y = n, tn(), r("statusDot").className = `dot ${n}`, r("statusPill").className = `pill ${n}`;
  const e = {
    idle: "Not connected",
    scanning: "Listening…",
    live: "",
    lost: "Lost — retrying…",
    error: "Error"
  };
  r("statusText").textContent = e[n], n !== "live" && (r("statusKg").textContent = "");
  const t = r("btnConnect");
  t.textContent = n === "live" || n === "scanning" ? "Disconnect" : "Connect scale";
}
function nn() {
  return localStorage.getItem("ufl.autoConnect") !== "0";
}
let We = !1, pt = !1, rt = !1;
function gt() {
  if (!nn() || !I.isNativePlatform() || z instanceof Ee || ee || pt || We && Y === "error") return;
  We = !0;
  const n = new Ee();
  n.onSeen = () => dn(n), r("simPanel").classList.add("hidden"), ft(n);
}
let Ft = 0;
function ns(n) {
  if (!j.recording || !wt()) {
    fe = null;
    return;
  }
  const e = te.running ? te.current() : null;
  if (e && e.cue === "rest") {
    fe = null;
    return;
  }
  const t = qe(), s = n >= t.lo && n <= t.hi, i = r("phaseBanner");
  s && fe !== "in" && (fe = "in", i.classList.add("inzone"), i.classList.remove("outzone"), S.say("in zone")), !s && fe !== "out" && (fe = "out", i.classList.add("outzone"), i.classList.remove("inzone"), n > 2 && S.say(n < t.lo ? "more" : "ease off"), J && n > 2 && Date.now() - Ft > 1500 && (ne.outZone(), Ft = Date.now()));
}
function ss() {
  const n = r("protocol").value, e = ze(n, vt());
  r("summary").classList.add("hidden"), j.start(), S.unlock(), rs(), V.opts.marks = [], V.opts.peaks = [];
  const t = e.phases.length ? zt(e).reduce((s, i) => s + i.seconds, 0) : 60;
  V.opts.windowS = Math.max(10, Math.ceil(t / 10) * 10), r("btnStart").classList.add("hidden"), r("btnStop").classList.remove("hidden"), rn(!0), e.phases.length ? (te.onPhase = is, te.onTick = as, te.onDone = () => sn(), te.start(e)) : (yt("work", "Free set — go", ""), S.say("Go", !0), J && ne.go());
}
function is(n, e, t) {
  yt(n.cue, n.name, n.seconds.toFixed(0)), n.cue === "work" ? (J && ne.go(), S.say(n.name.replace(/\d+\/\d+/, ""), !0), V.opts.marks.push(j.elapsed())) : n.cue === "ramp" ? (J && ne.go(), S.say("Build up", !0)) : (e > 0 && J && ne.rest(), e > 0 && S.say(e === t - 1 ? "Done" : "Rest", !0));
}
let Bt = -1;
function as(n, e) {
  r("phaseTime").textContent = n.toFixed(n < 10 ? 1 : 0);
  const t = Math.ceil(n);
  t !== Bt && (Bt = t, t <= 3 && t > 0 && J && ne.tick());
}
async function sn() {
  te.stop(), an();
  const n = r("exercise").value, e = r("side").value, t = r("protocol").value, s = r("contraction").value, i = j.finish({ exercise: n, side: e, mode: t, contraction: s, handle: Ve() });
  i && i.manualReps === void 0 && (i.reps?.length ?? 0) >= 2 && (i.manualReps = i.reps.length), r("btnStop").classList.add("hidden"), r("btnStart").classList.remove("hidden"), rn(!1), yt("idle", "Done", "—"), J && ne.done(), i && (t === "maxtest" && i.peak > 0 && (await O.setMax(Pe(n, e, s, Ve()), i.peak), S.say(`New max ${i.peak.toFixed(0)} kilos`, !0)), await O.saveSet(i), N.push(i), K()?.upsertForceSet(Yt(i)), await os(i), await _(), Z(), X());
}
function rs() {
  an(), it = -1, Fe = setInterval(() => {
    if (!j.recording) return;
    const n = Math.floor(j.elapsed());
    if (n === it || n === 0) return;
    it = n;
    const e = te.running ? te.current() : null;
    if (e && e.cue !== "work") return;
    const t = ut && !wt() && n % Ie === 0;
    (dt && J || t && J) && ne.tick();
    const s = [];
    ht && s.push(jn(n)), t && s.push(je.toFixed(0)), s.length && (!t && S.speaking() || S.say(s.join(", "), t, !0));
  }, 100);
}
function an() {
  Fe && clearInterval(Fe), Fe = null;
}
function rn(n) {
  for (const e of ["exercise", "side", "protocol", "contraction", "handle"]) r(e).disabled = n;
}
function yt(n, e, t) {
  const s = r("phaseBanner");
  s.className = `banner ${n}`, r("phaseName").textContent = e, r("phaseTime").textContent = t;
}
async function os(n) {
  const e = Ue, t = await O.maxes(), s = n.side === "left" ? "right" : n.side === "right" ? "left" : null, i = [];
  i.push(M("Duration", `${n.durationS.toFixed(1)} s`)), i.push(M("Peak force", `${D(n.peak)} kg`, Ce(n.peak, e?.peak))), i.push(M("Intensity (avg)", `${D(n.avg)} kg`, Ce(n.avg, e?.avg))), i.push(M("Output (kg·s)", D(n.output), Ce(n.output, e?.output))), i.push(M("Inroad", `${n.inroad.toFixed(0)}%`, n.inroad >= 30 ? '<span class="badge good">deep fatigue</span>' : n.inroad >= 15 ? '<span class="badge">moderate</span>' : '<span class="badge warn">shallow — stopped early?</span>')), re && i.push(M("vs. best output", `${(n.output / re * 100).toFixed(0)}%`, n.output > re ? '<span class="badge good">new best</span>' : "")), G && i.push(M("Peak as % of max", `${(n.peak / G * 100).toFixed(0)}%`));
  let a = "";
  if (n.reps && n.reps.length) {
    const d = Math.max(...n.reps.map((f) => f.peak));
    a = `<div class="muted" style="margin-top:8px">Reps: ${n.reps.length} · first ${D(n.reps[0].peak)} → last ${D(n.reps[n.reps.length - 1].peak)} kg · avg rep ${(n.reps.reduce((f, c) => f + c.durationS, 0) / n.reps.length).toFixed(1)} s</div>
      <div class="repbars">${n.reps.map((f) => `<div style="height:${Math.max(4, f.peak / d * 100)}%"><span>${f.peak.toFixed(0)}</span></div>`).join("")}</div>`;
    const u = n.mode === "critical" ? Mn(n.reps) : null;
    u && (a += M("Critical force", `${D(u)} kg${G ? ` (${(u / G * 100).toFixed(0)}% of max)` : ""}`));
  }
  let o = "";
  if (s) {
    const d = t[Pe(n.exercise, n.side, n.contraction, n.handle)]?.kg, u = t[Pe(n.exercise, s, n.contraction, n.handle)]?.kg;
    if (d && u) {
      const f = (Math.abs(d - u) / Math.max(d, u) * 100).toFixed(0);
      o = M("Left/right gap", `${f}% (L ${D(n.side === "left" ? d : u)} / R ${D(n.side === "left" ? u : d)})`, Number(f) > 10 ? '<span class="badge warn">asymmetry</span>' : '<span class="badge good">balanced</span>');
    }
  }
  const l = r("summary");
  l.innerHTML = `<h4>${$(ve(n.exercise, n.side, n.contraction, n.handle))} · ${n.mode}</h4>${i.join("")}${o}${a}
    ${on(n, "sum")}`, l.classList.remove("hidden"), cn(n, "sum", async () => {
    await _(), Z();
  });
}
function on(n, e) {
  const t = De(de(n));
  return `<div class="editor">
      <label>Reps <input type="number" id="${e}Reps" min="1" step="1" inputmode="numeric" placeholder="1" value="${n.manualReps ?? ""}" /></label>
      <label>Date performed <input type="date" id="${e}Date" value="${t}" max="${De(Date.now())}" /></label>
      <label class="grow">Note <input type="text" id="${e}Note" placeholder="optional" value="${$(n.note ?? "")}" /></label>
      <button class="sm primary" id="${e}Save" type="button">Save</button>
      <span class="muted" id="${e}Msg">${n.reps?.length ? `auto-detected ${n.reps.length} — change it if that's wrong` : "blank reps = 1"}</span>
    </div>`;
}
function cn(n, e, t) {
  const s = async () => {
    const i = Number(r(`${e}Reps`).value);
    n.manualReps = i > 0 ? Math.round(i) : void 0;
    const a = r(`${e}Date`).value;
    if (a) {
      const [l, d, u] = a.split("-").map(Number), f = new Date(n.startedAt);
      n.performedAt = new Date(l, d - 1, u, f.getHours(), f.getMinutes(), f.getSeconds()).getTime();
    }
    n.note = r(`${e}Note`).value.trim() || void 0, await O.updateSet(n), K()?.upsertForceSet(Yt(n));
    const o = N.findIndex((l) => l.id === n.id);
    o >= 0 && (N[o] = n), r(`${e}Msg`).textContent = `saved · ${ge(n)} rep${ge(n) === 1 ? "" : "s"} · ${De(de(n))}`, await t();
  };
  r(`${e}Save`).onclick = s;
  for (const i of [`${e}Reps`, `${e}Date`, `${e}Note`]) r(i).onkeydown = (a) => {
    a.key === "Enter" && s();
  };
}
function M(n, e, t = "") {
  return `<div class="fl-line"><span>${n}</span><span>${e} ${t}</span></div>`;
}
function Ce(n, e) {
  if (!e) return "";
  const t = (n - e) / e * 100;
  return `<span class="${t >= 0 ? "fl-d up" : "fl-d down"}">${t >= 0 ? "+" : ""}${t.toFixed(1)}%</span>`;
}
function ln() {
  const n = j.current(), e = j.elapsed();
  if (r("liveKg").textContent = je.toFixed(1), r("elapsed").textContent = hn(e), V.draw(n, e, je), j.recording && n.length > 2) {
    const t = Ht(n);
    r("sPeak").textContent = D(t.peak), r("sAvg").textContent = D(t.avg), r("sOut").textContent = D(t.output), r("sInroad").textContent = `${t.inroad.toFixed(0)}%`;
    const s = Ue;
    r("dPeak").innerHTML = Ce(t.peak, s?.peak), r("dAvg").innerHTML = Ce(t.avg, s?.avg), r("dOut").innerHTML = re ? `<span class="muted">${(t.output / re * 100).toFixed(0)}% of goal</span>` : "";
    const i = mt(n);
    V.opts.peaks = i.map((a) => ({ t: a.peakT ?? a.startS, kg: a.peak })), r("sReps").textContent = i.length ? String(i.length) : "–", r("dReps").textContent = i.length ? `last ${i[i.length - 1].peak.toFixed(0)} kg` : "";
  }
  requestAnimationFrame(ln);
}
let xe = null;
function Z() {
  const n = r("histExercise").value, e = N.filter((t) => !n || t.exercise === n).slice().sort((t, s) => de(s) - de(t) || s.startedAt - t.startedAt);
  r("histBody").innerHTML = e.map((t) => `<tr data-id="${t.id}" class="${xe?.id === t.id ? "sel" : ""}">
      <td>${new Date(de(t)).toLocaleDateString(void 0, { month: "short", day: "numeric" })}</td>
      <td>${$(ve(t.exercise, t.side, t.contraction, t.handle))}</td>
      <td>${t.mode}</td><td>${ge(t)}</td><td>${hn(t.durationS)}</td><td>${D(t.peak)}</td><td>${D(t.avg)}</td><td>${D(t.output)}</td><td>${t.inroad.toFixed(0)}%</td>
      <td><button data-del="${t.id}">✕</button></td></tr>`).join("") || '<tr><td colspan="10" class="muted">No sets yet.</td></tr>', r("histBody").querySelectorAll("tr[data-id]").forEach((t) => {
    t.onclick = (s) => {
      s.target.dataset.del || (xe = N.find((i) => i.id === t.dataset.id) ?? null, Z(), cs());
    };
  }), r("histBody").querySelectorAll("button[data-del]").forEach((t) => {
    t.onclick = async () => {
      confirm("Delete this set?") && (await O.deleteSet(t.dataset.del), K()?.removeForceSet(`fl-${t.dataset.del}`), N = N.filter((s) => s.id !== t.dataset.del), xe?.id === t.dataset.del && (xe = null), Z(), await _());
    };
  }), ls(n ? e.slice().reverse() : []);
}
function cs() {
  const n = xe, e = r("histDetail");
  if (!n) {
    e.classList.add("hidden");
    return;
  }
  e.classList.remove("hidden"), e.innerHTML = `<h4>${$(ve(n.exercise, n.side, n.contraction, n.handle))} · ${new Date(n.startedAt).toLocaleString()}</h4>
    <div class="chartwrap small"><canvas id="histCanvas"></canvas></div>
    ${M("Peak", `${D(n.peak)} kg`)}${M("Intensity", `${D(n.avg)} kg`)}${M("Output", D(n.output))}${M("Inroad", `${n.inroad.toFixed(0)}%`)}
    ${M("Reps (logged)", String(ge(n)))}
    ${n.reps?.length ? M("Auto-detected", `${n.reps.length} (${n.reps.map((s) => s.peak.toFixed(0)).join(", ")} kg)`) : ""}
    ${on(n, "hist")}
    <div class="actions-inline" style="margin-top:8px"><button class="sm" id="btnUseGhost">Use as ghost trace</button><button class="sm ghost" id="btnSetCsv">Export samples CSV</button></div>`, cn(n, "hist", async () => {
    Z(), await _();
  });
  const t = new Wt(r("histCanvas"));
  t.opts.windowS = Math.max(10, Math.ceil(n.durationS / 10) * 10), t.opts.peaks = mt(n.samples).map((s) => ({ t: s.peakT ?? s.startS, kg: s.peak })), t.draw(n.samples, n.durationS, 0), r("btnUseGhost").onclick = () => {
    Le = !0, localStorage.setItem("ufl.ghostOn", "1"), r("ghostOn").checked = !0, V.opts.ghost = n.samples, un("train");
  }, r("btnSetCsv").onclick = () => lt(`set-${n.id}.csv`, Yn(n), "text/csv");
}
function ls(n) {
  const e = r("progress");
  if (n.length < 2) {
    e.classList.add("hidden");
    return;
  }
  e.classList.remove("hidden");
  const t = Math.max(1, window.devicePixelRatio || 1), s = e.clientWidth - 12, i = 160;
  be.width = s * t, be.height = i * t, be.style.width = `${s}px`, be.style.height = `${i}px`;
  const a = be.getContext("2d");
  a.setTransform(t, 0, 0, t, 0, 0), a.clearRect(0, 0, s, i);
  const o = getComputedStyle(document.getElementById("view-force") ?? document.documentElement), l = 36, d = 8, u = 10, f = 18, c = s - l - d, h = i - u - f, p = Math.max(10, ...n.map((x) => x.peak)) * 1.1, g = (x) => l + x / Math.max(1, n.length - 1) * c, v = (x) => u + h - x / p * h;
  a.strokeStyle = o.getPropertyValue("--grid"), a.fillStyle = o.getPropertyValue("--muted"), a.font = "10px system-ui", a.textAlign = "right";
  for (let x = 0; x <= 4; x++) {
    const H = p / 4 * x;
    a.beginPath(), a.moveTo(l, v(H)), a.lineTo(s - d, v(H)), a.stroke(), a.fillText(H.toFixed(0), l - 4, v(H) + 3);
  }
  const y = [["peak", o.getPropertyValue("--accent")], ["avg", o.getPropertyValue("--accent2")]];
  for (const [x, H] of y)
    a.strokeStyle = H, a.lineWidth = 2, a.beginPath(), n.forEach((B, U) => U ? a.lineTo(g(U), v(B[x])) : a.moveTo(g(U), v(B[x]))), a.stroke(), a.fillStyle = H, n.forEach((B, U) => {
      a.beginPath(), a.arc(g(U), v(B[x]), 3, 0, Math.PI * 2), a.fill();
    });
  a.fillStyle = o.getPropertyValue("--muted"), a.textAlign = "left", a.fillText("peak", l + 4, u + 10), a.fillStyle = o.getPropertyValue("--accent2"), a.fillText("intensity", l + 36, u + 10);
}
async function X() {
  const n = await O.maxes(), e = Object.entries(n).map(([t, s]) => {
    const [i, a, o, l] = t.split("|");
    return `<tr><td>${$(ve(i, "both", o, l))}</td><td>${a}</td><td>${D(s.kg)}</td><td>${new Date(s.at).toLocaleDateString()}</td><td><button data-mdel="${$(t)}">✕</button></td></tr>`;
  });
  r("maxBody").innerHTML = e.join("") || '<tr><td colspan="5" class="muted">No maxes yet.</td></tr>', r("maxBody").querySelectorAll("button[data-mdel]").forEach((t) => t.onclick = async () => {
    await O.deleteMax(t.dataset.mdel), X(), _();
  }), r("exList").innerHTML = b.map((t) => `<span>${$(t)}<button data-xren="${$(t)}" title="Rename">✎</button><button data-xdel="${$(t)}">✕</button></span>`).join(""), r("exList").querySelectorAll("button[data-xren]").forEach((t) => t.onclick = async () => {
    const s = t.dataset.xren, i = prompt(`Rename "${s}" to:`, s);
    !i || i.trim() === s || await es(s, i.trim());
  }), r("exList").querySelectorAll("button[data-xdel]").forEach((t) => t.onclick = async () => {
    const s = K();
    if (s) {
      if (!s.removeExercise(t.dataset.xdel)) {
        alert("Built-in Gym Log exercises can't be removed here.");
        return;
      }
      b = s.exerciseNames();
    } else
      b = b.filter((i) => i !== t.dataset.xdel), await O.saveExercises(b);
    oe(), X();
  });
}
function un(n) {
  document.querySelectorAll(".fl-tabs button").forEach((e) => e.classList.toggle("active", e.dataset.tab === n)), document.querySelectorAll(".fl-tab").forEach((e) => e.classList.toggle("active", e.id === `tab-${n}`)), n === "train" && V.resize(), n === "history" && Z();
}
function us() {
  document.querySelectorAll(".fl-tabs button").forEach((c) => c.onclick = () => un(c.dataset.tab)), r("hdrExercise").onclick = () => {
    j.recording || Zn(r("exercise"));
  };
  for (const c of ["exercise", "side", "protocol", "contraction", "handle"]) r(c).addEventListener("change", Be);
  Be(), r("btnConnect").onclick = async () => {
    if (z instanceof Ee && (Y === "live" || Y === "scanning")) {
      await z.stop(), z = null, He("idle"), pt = !0;
      return;
    }
    pt = !1, r("simPanel").classList.add("hidden"), ee = null;
    const c = new Ee();
    c.onSeen = () => dn(c), ft(c);
  }, r("btnSim").onclick = () => {
    ee = new On(), ee.exact = r("simExact").checked, r("simPanel").classList.remove("hidden"), ft(ee);
  }, r("simExact").onchange = (c) => {
    const h = c.target.checked;
    ee && (ee.exact = h), r("simHelp").textContent = h ? "Reading tracks the slider exactly." : 'Slide up to "push", back to 0 to rest. Fatigue is simulated.';
  }, r("btnTare").onclick = () => z?.tare(), r("btnStart").onclick = ss, r("camOn").checked = localStorage.getItem("ufl.camOn") === "1";
  const n = async () => {
    const c = r("camOn").checked;
    if (localStorage.setItem("ufl.camOn", c ? "1" : "0"), c) {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert("Camera not available here."), r("camOn").checked = !1;
        return;
      }
      Re ?? (Re = new Jn(r("camVideo")));
      try {
        await Re.start(), r("camPip").classList.remove("hidden"), r("btnCamFlip").classList.remove("hidden");
      } catch (h) {
        alert("Camera failed: " + h.message + `
Allow the Camera permission for UY Force Lab in Android settings.`), r("camOn").checked = !1;
      }
    } else
      Re?.stop(), r("camPip").classList.add("hidden"), r("btnCamFlip").classList.add("hidden");
  };
  r("camOn").onchange = n, r("camOn").checked && n(), r("btnCamFlip").onclick = () => Re?.flip();
  const e = r("camPip"), t = localStorage.getItem("ufl.pipPos");
  if (t) {
    const [c, h] = t.split(",").map(Number);
    e.style.left = `${c}px`, e.style.top = `${h}px`;
  }
  let s = null;
  e.onpointerdown = (c) => {
    const h = e.getBoundingClientRect();
    s = { x: c.clientX, y: c.clientY, l: h.left, t: h.top, moved: !1 }, e.setPointerCapture(c.pointerId);
  }, e.onpointermove = (c) => {
    if (!s) return;
    const h = c.clientX - s.x, p = c.clientY - s.y;
    if (Math.abs(h) + Math.abs(p) > 6 && (s.moved = !0), !s.moved) return;
    const g = e.getBoundingClientRect(), v = Math.min(window.innerWidth - g.width, Math.max(0, s.l + h)), y = Math.min(window.innerHeight - g.height, Math.max(0, s.t + p));
    e.style.left = `${v}px`, e.style.top = `${y}px`;
  }, e.onpointerup = () => {
    if (s) {
      if (s.moved) {
        const c = e.getBoundingClientRect();
        localStorage.setItem("ufl.pipPos", `${Math.round(c.left)},${Math.round(c.top)}`);
      } else e.classList.toggle("large");
      s = null;
    }
  }, r("btnStop").onclick = sn, r("simEffort").oninput = (c) => {
    const h = Number(c.target.value);
    ee && (ee.effort = h), r("simVal").textContent = String(h);
  }, r("exercise").onchange = _, st(r("exercise"), { recent: at, all: () => b, onCreate: It }), st(r("maxExercise"), { recent: at, all: () => b, onCreate: It }), st(r("histExercise"), { recent: at, all: () => b, allOption: { value: "", label: "All exercises" } }), r("btnNewEx").onclick = () => {
    r("newExBox").classList.remove("hidden"), r("newExName").focus();
  }, r("btnNewExCancel").onclick = () => {
    r("newExBox").classList.add("hidden"), r("newExName").value = "";
  };
  const i = async () => {
    const c = r("newExName").value.trim();
    if (c) {
      if (!b.includes(c)) {
        const h = K();
        h ? (h.addExercise(c), b = h.exerciseNames()) : (b.push(c), await O.saveExercises(b));
      }
      oe(), r("exercise").value = c, r("newExBox").classList.add("hidden"), r("newExName").value = "", X(), await _();
    }
  };
  r("btnNewExSave").onclick = i, r("newExName").onkeydown = (c) => {
    c.key === "Enter" && i();
  }, r("side").onchange = _, r("contraction").onchange = _;
  const a = r("handle"), o = localStorage.getItem("ufl.handle") ?? "";
  o && ![...a.options].some((c) => c.value === o) && a.insertAdjacentHTML("beforeend", `<option>${$(o)}</option>`), a.value = o;
  const l = JSON.parse(localStorage.getItem("ufl.handles") ?? "[]");
  for (const c of l) [...a.options].some((h) => h.value === c) || a.insertAdjacentHTML("beforeend", `<option>${$(c)}</option>`);
  a.onchange = () => {
    if (a.value === "__custom") {
      const c = (prompt("Handle / attachment name") ?? "").trim();
      if (!c) {
        a.value = localStorage.getItem("ufl.handle") ?? "";
        return;
      }
      [...a.options].some((h) => h.value === c) || (a.insertAdjacentHTML("beforeend", `<option>${$(c)}</option>`), l.push(c), localStorage.setItem("ufl.handles", JSON.stringify(l))), a.value = c;
    }
    localStorage.setItem("ufl.handle", a.value), Be(), _();
  }, r("protocol").onchange = () => Qt(), r("params").oninput = () => r("protocolHelp").textContent = ze(r("protocol").value, vt()).describe;
  for (const c of ["zoneOn", "zoneLo", "zoneHi"]) r(c).oninput = _;
  r("ghostOn").checked = Le, r("ghostOn").onchange = (c) => {
    Le = c.target.checked, localStorage.setItem("ufl.ghostOn", Le ? "1" : "0"), _();
  }, r("histExercise").onchange = Z, r("btnCsv").onclick = () => lt(`uy-force-lab-${Nt()}.csv`, Gn(N), "text/csv"), r("btnJson").onclick = () => lt(`uy-force-lab-${Nt()}.json`, JSON.stringify(N, null, 1), "application/json"), r("voiceOn").onchange = (c) => S.enabled = c.target.checked, r("keepAwake").checked = en(), r("keepAwake").onchange = (c) => {
    localStorage.setItem("ufl.keepAwake", c.target.checked ? "1" : "0"), tn();
  }, r("autoConnect").checked = nn(), r("autoConnect").onchange = (c) => {
    localStorage.setItem("ufl.autoConnect", c.target.checked ? "1" : "0"), We = !1, gt();
  }, document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "hidden") {
      z instanceof Ee && !j.recording && (await z.stop(), z = null, He("idle"), rt = !0);
      return;
    }
    (rt || Y === "idle" || Y === "error") && (rt = !1, We = !1, gt());
  }), S.rate = Number(me("ufl.voiceRate", "1.2")) || 1.2, S.pitch = Number(me("ufl.voicePitch", "1")) || 1;
  const d = (c, h, p, g) => {
    const v = r(c);
    v.value = String(g), r(c + "Val").textContent = g.toFixed(1) + "×", v.oninput = () => {
      const y = Number(v.value);
      p(y), localStorage.setItem(h, String(y)), r(c + "Val").textContent = y.toFixed(1) + "×";
    };
  };
  d("voiceRate", "ufl.voiceRate", (c) => S.rate = c, S.rate), d("voicePitch", "ufl.voicePitch", (c) => S.pitch = c, S.pitch), r("beepOn").onchange = (c) => J = c.target.checked, r("calloutEvery").value = String(Ie), r("calloutEvery").onchange = (c) => {
    Ie = Math.max(1, Number(c.target.value) || 1), localStorage.setItem("ufl.calloutEvery", String(Ie));
  };
  const u = (c, h, p, g) => {
    const v = r(c);
    v.checked = g, v.onchange = () => {
      p(v.checked), localStorage.setItem(h, v.checked ? "1" : "0");
    };
  };
  u("calloutOn", "ufl.calloutOn", (c) => ut = c, ut), u("secBeep", "ufl.secBeep", (c) => dt = c, dt), u("secCount", "ufl.secCount", (c) => ht = c, ht);
  let f = null;
  S.onSpeak = (c) => {
    const h = r("said");
    h.textContent = `🔊 ${c}`, h.classList.add("on"), f && clearTimeout(f), f = setTimeout(() => h.classList.remove("on"), 900);
  }, document.addEventListener("pointerdown", () => S.unlock(), { once: !0 }), document.addEventListener("visibilitychange", () => {
    document.visibilityState === "visible" && S.reset();
  }), r("btnTestVoice").onclick = async () => {
    S.reset();
    const c = r("voiceStatus");
    c.textContent = await S.status(), S.say("Force lab voice check, 1, 2, 3", !0);
  }, r("btnSetMax").onclick = async () => {
    const c = Number(r("maxKg").value);
    c && (await O.setMax(Pe(r("maxExercise").value, r("maxSide").value), c), r("maxKg").value = "", X(), _());
  }, r("btnAddEx").onclick = async () => {
    const c = r("newEx").value.trim();
    if (!(!c || b.includes(c))) {
      {
        const h = K();
        h ? (h.addExercise(c), b = h.exerciseNames()) : (b.push(c), await O.saveExercises(b));
      }
      r("newEx").value = "", oe(), X();
    }
  };
}
let qt = 0;
function dn(n) {
  const e = Date.now();
  if (e - qt < 1e3 || r("tab-settings").classList.contains("active") === !1) return;
  qt = e;
  const t = [...n.seen.values()].sort((s, i) => i.t - s.t).slice(0, 12);
  r("seenBody").innerHTML = t.map((s) => `<tr><td>${$(s.name || "(no name)")}<br><small class="muted">${$(s.id)}</small></td><td>${s.rssi}</td><td>${$(s.keys || "–")}</td><td style="white-space:normal;font-family:monospace;font-size:11px">${$(s.hex || "–")}</td><td>${s.kg === null ? "–" : s.kg.toFixed(2)}</td></tr>`).join("") || '<tr><td colspan="5" class="muted">Listening… nothing heard yet.</td></tr>';
}
function D(n) {
  return n >= 100 ? n.toFixed(0) : n.toFixed(1);
}
function hn(n) {
  const e = Math.floor(n / 60), t = Math.floor(n % 60);
  return `${e}:${t.toString().padStart(2, "0")}`;
}
function Nt() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function $(n) {
  return n.replace(/[&<>"]/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[e]);
}
ts();
window.ForceLab = {
  onShow() {
    V.resize(), gt();
  },
  // called by the host after it renamed an exercise in its own data
  renameExercise(n, e) {
    Xt(n, e).then(async () => {
      b = K()?.exerciseNames() ?? b, oe(), X(), Z(), await _();
    });
  }
};
async function ds(n, e, t) {
  let s;
  return Promise.race([
    n,
    new Promise((i, a) => {
      s = setTimeout(() => a(t), e);
    })
  ]).finally(() => clearTimeout(s));
}
class hs extends ie {
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
    const o = !this.discoveredDevices.has(a);
    if (!(!((t = this.requestBleDeviceOptions) === null || t === void 0) && t.serviceData && !this.matchesServiceDataFilter(e)) && (o || !((s = this.requestBleDeviceOptions) === null || s === void 0) && s.allowDuplicates)) {
      this.discoveredDevices.set(a, !0);
      const l = this.getBleDevice(e.device), d = {
        device: l,
        localName: l.name,
        rssi: e.rssi,
        txPower: e.txPower,
        manufacturerData: $t(e.manufacturerData),
        serviceData: $t(e.serviceData),
        uuids: (i = e.uuids) === null || i === void 0 ? void 0 : i.map(Ln)
      };
      this.notifyListeners("onScanResult", d);
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
      const o = (t = e.timeout) !== null && t !== void 0 ? t : this.DEFAULT_CONNECTION_TIMEOUT;
      await ds(i.gatt.connect(), o, a);
    } catch (o) {
      throw await ((s = i.gatt) === null || s === void 0 ? void 0 : s.disconnect()), o === a ? new Error("Connection timeout") : o;
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
    for (const o of i) {
      const l = await o.getCharacteristics(), d = [];
      for (const u of l)
        d.push({
          uuid: u.uuid,
          properties: this.getProperties(u),
          descriptors: await this.getDescriptors(u)
        });
      a.push({ uuid: o.uuid, characteristics: d });
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
    typeof e.value == "string" ? s = Se(e.value) : s = e.value, await t?.writeValueWithResponse(Ye(s));
  }
  async writeWithoutResponse(e) {
    const t = await this.getCharacteristic(e);
    let s;
    typeof e.value == "string" ? s = Se(e.value) : s = e.value, await t?.writeValueWithoutResponse(Ye(s));
  }
  async readDescriptor(e) {
    const t = await this.getDescriptor(e);
    return { value: await t?.readValue() };
  }
  async writeDescriptor(e) {
    const t = await this.getDescriptor(e);
    let s;
    typeof e.value == "string" ? s = Se(e.value) : s = e.value, await t?.writeValue(Ye(s));
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
      const o = new Uint8Array(a.buffer), l = i.dataPrefix;
      if (!(o.length < l.byteLength))
        if (i.mask) {
          const d = i.mask;
          let u = !0;
          for (let f = 0; f < l.byteLength; f++)
            if ((o[f] & d.getUint8(f)) !== (l.getUint8(f) & d.getUint8(f))) {
              u = !1;
              break;
            }
          if (u)
            return !0;
        } else {
          let d = !0;
          for (let u = 0; u < l.byteLength; u++)
            if (o[u] !== l.getUint8(u)) {
              d = !1;
              break;
            }
          if (d)
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
const fs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BluetoothLeWeb: hs
}, Symbol.toStringTag, { value: "Module" }));
class ps extends ie {
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
      }, s.onerror = (o) => {
        a(o);
      }, t.speak(s);
    });
  }
  async stop() {
    this.speechSynthesis || this.throwUnsupportedError(), this.speechSynthesis.cancel();
  }
  async getSupportedLanguages() {
    return { languages: this.getSpeechSynthesisVoices().map((i) => i.lang).filter((i, a, o) => o.indexOf(i) == a) };
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
    const t = this.getSpeechSynthesisVoices(), s = new SpeechSynthesisUtterance(), { text: i, lang: a, rate: o, pitch: l, volume: d, voice: u } = e;
    return u !== void 0 && (s.voice = t[u]), d !== void 0 && (s.volume = d >= 0 && d <= 1 ? d : 1), o !== void 0 && (s.rate = o >= 0.1 && o <= 10 ? o : 1), l !== void 0 && (s.pitch = l >= 0 && l <= 2 ? l : 2), a && (s.lang = a), s.text = i, s;
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
const gs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  TextToSpeechWeb: ps
}, Symbol.toStringTag, { value: "Module" }));
class ms extends ie {
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
const vs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  KeepAwakeWeb: ms
}, Symbol.toStringTag, { value: "Module" }));
class ws extends ie {
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
    const t = [], s = [], i = "_cap_", a = Object.keys(this.impl).filter((o) => o.indexOf(i) === 0);
    for (const o of a) {
      const l = o.substring(i.length), d = (e = this.impl.getItem(o)) !== null && e !== void 0 ? e : "", { value: u } = await this.get({ key: l });
      typeof u == "string" ? s.push(l) : (await this.set({ key: l, value: d }), t.push(l));
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
const ys = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PreferencesWeb: ws
}, Symbol.toStringTag, { value: "Module" }));
function jt(n) {
  const e = n.split("/").filter((s) => s !== "."), t = [];
  return e.forEach((s) => {
    s === ".." && t.length > 0 && t[t.length - 1] !== ".." ? t.pop() : t.push(s);
  }), t.join("/");
}
function bs(n, e) {
  n = jt(n), e = jt(e);
  const t = n.split("/"), s = e.split("/");
  return n !== e && t.every((i, a) => i === s[a]);
}
class Ke extends ie {
  constructor() {
    super(...arguments), this.DB_VERSION = 1, this.DB_NAME = "Disc", this._writeCmds = ["add", "put", "delete"], this.downloadFile = async (e) => {
      var t, s;
      const i = Ut(e, e.webFetchExtra), a = await fetch(e.url, i);
      let o;
      if (!e.progress)
        o = await a.blob();
      else if (!a?.body)
        o = new Blob();
      else {
        const d = a.body.getReader();
        let u = 0;
        const f = [], c = a.headers.get("content-type"), h = parseInt(a.headers.get("content-length") || "0", 10);
        for (; ; ) {
          const { done: v, value: y } = await d.read();
          if (v)
            break;
          f.push(y), u += y?.length || 0;
          const x = {
            url: e.url,
            bytes: u,
            contentLength: h
          };
          this.notifyListeners("progress", x);
        }
        const p = new Uint8Array(u);
        let g = 0;
        for (const v of f)
          typeof v > "u" || (p.set(v, g), g += v.length);
        o = new Blob([p.buffer], { type: c || void 0 });
      }
      return { path: (await this.writeFile({
        path: e.path,
        directory: (t = e.directory) !== null && t !== void 0 ? t : void 0,
        recursive: (s = e.recursive) !== null && s !== void 0 ? s : !1,
        data: o
      })).uri, blob: o };
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
      s.onupgradeneeded = Ke.doUpgrade, s.onsuccess = () => {
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
    return this.initDb().then((i) => new Promise((a, o) => {
      const u = i.transaction(["FileStorage"], s).objectStore("FileStorage")[e](...t);
      u.onsuccess = () => a(u.result), u.onerror = () => o(u.error);
    }));
  }
  async dbIndexRequest(e, t, s) {
    const i = this._writeCmds.indexOf(t) !== -1 ? "readwrite" : "readonly";
    return this.initDb().then((a) => new Promise((o, l) => {
      const c = a.transaction(["FileStorage"], i).objectStore("FileStorage").index(e)[t](...s);
      c.onsuccess = () => o(c.result), c.onerror = () => l(c.error);
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
    const i = e.encoding, a = e.recursive, o = await this.dbRequest("get", [t]);
    if (o && o.type === "directory")
      throw Error("The supplied path is a directory.");
    const l = t.substr(0, t.lastIndexOf("/"));
    if (await this.dbRequest("get", [l]) === void 0) {
      const c = l.indexOf("/", 1);
      if (c !== -1) {
        const h = l.substr(c);
        await this.mkdir({
          path: h,
          directory: e.directory,
          recursive: a
        });
      }
    }
    if (!i && !(s instanceof Blob) && (s = s.indexOf(",") >= 0 ? s.split(",")[1] : s, !this.isBase64String(s)))
      throw Error("The supplied data is not valid base64 content.");
    const u = Date.now(), f = {
      path: t,
      folder: l,
      type: "file",
      size: s instanceof Blob ? s.size : s.length,
      ctime: u,
      mtime: u,
      content: s
    };
    return await this.dbRequest("put", [f]), {
      uri: f.path
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
    const i = e.encoding, a = t.substr(0, t.lastIndexOf("/")), o = Date.now();
    let l = o;
    const d = await this.dbRequest("get", [t]);
    if (d && d.type === "directory")
      throw Error("The supplied path is a directory.");
    if (await this.dbRequest("get", [a]) === void 0) {
      const c = a.indexOf("/", 1);
      if (c !== -1) {
        const h = a.substr(c);
        await this.mkdir({
          path: h,
          directory: e.directory,
          recursive: !0
        });
      }
    }
    if (!i && !this.isBase64String(s))
      throw Error("The supplied data is not valid base64 content.");
    if (d !== void 0) {
      if (d.content instanceof Blob)
        throw Error("The occupied entry contains a Blob object which cannot be appended to.");
      d.content !== void 0 && !i ? s = btoa(atob(d.content) + atob(s)) : s = d.content + s, l = d.ctime;
    }
    const f = {
      path: t,
      folder: a,
      type: "file",
      size: s.length,
      ctime: l,
      mtime: o,
      content: s
    };
    await this.dbRequest("put", [f]);
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
    const t = this.getPath(e.directory, e.path), s = e.recursive, i = t.substr(0, t.lastIndexOf("/")), a = (t.match(/\//g) || []).length, o = await this.dbRequest("get", [i]), l = await this.dbRequest("get", [t]);
    if (a === 1)
      throw Error("Cannot create Root directory");
    if (l !== void 0)
      throw Error("Current directory does already exist.");
    if (!s && a !== 2 && o === void 0)
      throw Error("Parent directory must exist");
    if (s && a !== 2 && o === void 0) {
      const f = i.substr(i.indexOf("/", 1));
      await this.mkdir({
        path: f,
        directory: e.directory,
        recursive: s
      });
    }
    const d = Date.now(), u = {
      path: t,
      folder: i,
      type: "directory",
      size: 0,
      ctime: d,
      mtime: d
    };
    await this.dbRequest("put", [u]);
  }
  /**
   * Remove a directory
   * @param options the options for the directory remove
   */
  async rmdir(e) {
    const { path: t, directory: s, recursive: i } = e, a = this.getPath(s, t), o = await this.dbRequest("get", [a]);
    if (o === void 0)
      throw Error("Folder does not exist.");
    if (o.type !== "directory")
      throw Error("Requested path is not a directory");
    const l = await this.readdir({ path: t, directory: s });
    if (l.files.length !== 0 && !i)
      throw Error("Folder is not empty");
    for (const d of l.files) {
      const u = `${t}/${d.name}`;
      (await this.stat({ path: u, directory: s })).type === "file" ? await this.deleteFile({ path: u, directory: s }) : await this.rmdir({ path: u, directory: s, recursive: i });
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
    return { files: await Promise.all(i.map(async (o) => {
      let l = await this.dbRequest("get", [o]);
      return l === void 0 && (l = await this.dbRequest("get", [o + "/"])), {
        name: o.substring(t.length + 1),
        type: l.type,
        size: l.size,
        ctime: l.ctime,
        mtime: l.mtime,
        uri: l.path
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
    const { to: i, from: a, directory: o } = e;
    if (!i || !a)
      throw Error("Both to and from must be provided");
    s || (s = o);
    const l = this.getPath(o, a), d = this.getPath(s, i);
    if (l === d)
      return {
        uri: d
      };
    if (bs(l, d))
      throw Error("To path cannot contain the from path");
    let u;
    try {
      u = await this.stat({
        path: i,
        directory: s
      });
    } catch {
      const g = i.split("/");
      g.pop();
      const v = g.join("/");
      if (g.length > 0 && (await this.stat({
        path: v,
        directory: s
      })).type !== "directory")
        throw new Error("Parent directory of the to path is a file");
    }
    if (u && u.type === "directory")
      throw new Error("Cannot overwrite a directory with a file");
    const f = await this.stat({
      path: a,
      directory: o
    }), c = async (p, g, v) => {
      const y = this.getPath(s, p), x = await this.dbRequest("get", [y]);
      x.ctime = g, x.mtime = v, await this.dbRequest("put", [x]);
    }, h = f.ctime ? f.ctime : Date.now();
    switch (f.type) {
      case "file": {
        const p = await this.readFile({
          path: a,
          directory: o
        });
        t && await this.deleteFile({
          path: a,
          directory: o
        });
        let g;
        !(p.data instanceof Blob) && !this.isBase64String(p.data) && (g = Ne.UTF8);
        const v = await this.writeFile({
          path: i,
          directory: s,
          data: p.data,
          encoding: g
        });
        return t && await c(i, h, f.mtime), v;
      }
      case "directory": {
        if (u)
          throw Error("Cannot move a directory over an existing object");
        try {
          await this.mkdir({
            path: i,
            directory: s,
            recursive: !1
          }), t && await c(i, h, f.mtime);
        } catch {
        }
        const p = (await this.readdir({
          path: a,
          directory: o
        })).files;
        for (const g of p)
          await this._copy({
            from: `${a}/${g.name}`,
            to: `${i}/${g.name}`,
            directory: o,
            toDirectory: s
          }, t);
        t && await this.rmdir({
          path: a,
          directory: o
        });
      }
    }
    return {
      uri: d
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
Ke._debug = !0;
const xs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  FilesystemWeb: Ke
}, Symbol.toStringTag, { value: "Module" }));
class Ss extends ie {
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
const ks = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ShareWeb: Ss
}, Symbol.toStringTag, { value: "Module" }));
