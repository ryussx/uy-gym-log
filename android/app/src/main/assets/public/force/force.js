var ht;
(function(n) {
  n[n.SCAN_MODE_LOW_POWER = 0] = "SCAN_MODE_LOW_POWER", n[n.SCAN_MODE_BALANCED = 1] = "SCAN_MODE_BALANCED", n[n.SCAN_MODE_LOW_LATENCY = 2] = "SCAN_MODE_LOW_LATENCY";
})(ht || (ht = {}));
var $t;
(function(n) {
  n[n.PHY_LE_1M = 1] = "PHY_LE_1M", n[n.PHY_LE_2M = 2] = "PHY_LE_2M", n[n.PHY_LE_CODED = 3] = "PHY_LE_CODED", n[n.PHY_LE_ALL_SUPPORTED = 255] = "PHY_LE_ALL_SUPPORTED";
})($t || ($t = {}));
var Dt;
(function(n) {
  n[n.CONNECTION_PRIORITY_BALANCED = 0] = "CONNECTION_PRIORITY_BALANCED", n[n.CONNECTION_PRIORITY_HIGH = 1] = "CONNECTION_PRIORITY_HIGH", n[n.CONNECTION_PRIORITY_LOW_POWER = 2] = "CONNECTION_PRIORITY_LOW_POWER";
})(Dt || (Dt = {}));
/*! Capacitor: https://capacitorjs.com/ - MIT License */
var ve;
(function(n) {
  n.Unimplemented = "UNIMPLEMENTED", n.Unavailable = "UNAVAILABLE";
})(ve || (ve = {}));
class Qe extends Error {
  constructor(e, t, s) {
    super(e), this.message = e, this.code = t, this.data = s;
  }
}
const wn = (n) => {
  var e, t;
  return n?.androidBridge ? "android" : !((t = (e = n?.webkit) === null || e === void 0 ? void 0 : e.messageHandlers) === null || t === void 0) && t.bridge ? "ios" : "web";
}, yn = (n) => {
  const e = n.CapacitorCustomPlatform || null, t = n.Capacitor || {}, s = t.Plugins = t.Plugins || {}, i = () => e !== null ? e.name : wn(n), a = () => i() !== "web", o = (p) => {
    const g = u.get(p);
    return !!(g?.platforms.has(i()) || c(p));
  }, c = (p) => {
    var g;
    return (g = t.PluginHeaders) === null || g === void 0 ? void 0 : g.find((l) => l.name === p);
  }, d = (p) => n.console.error(p), u = /* @__PURE__ */ new Map(), f = (p, g = {}) => {
    const l = u.get(p);
    if (l)
      return console.warn(`Capacitor plugin "${p}" already registered. Cannot register plugins twice.`), l.proxy;
    const h = i(), y = c(p);
    let b;
    const w = async () => (!b && h in g ? b = typeof g[h] == "function" ? b = await g[h]() : b = g[h] : e !== null && !b && "web" in g && (b = typeof g.web == "function" ? b = await g.web() : b = g.web), b), A = ($, R) => {
      var m, S;
      if (y) {
        const C = y?.methods.find((E) => R === E.name);
        if (C)
          return C.rtype === "promise" ? (E) => t.nativePromise(p, R.toString(), E) : (E, ce) => t.nativeCallback(p, R.toString(), E, ce);
        if ($)
          return (m = $[R]) === null || m === void 0 ? void 0 : m.bind($);
      } else {
        if ($)
          return (S = $[R]) === null || S === void 0 ? void 0 : S.bind($);
        throw new Qe(`"${p}" plugin is not implemented on ${h}`, ve.Unimplemented);
      }
    }, N = ($) => {
      let R;
      const m = (...S) => {
        const C = w().then((E) => {
          const ce = A(E, $);
          if (ce) {
            const le = ce(...S);
            return R = le?.remove, le;
          } else
            throw new Qe(`"${p}.${$}()" is not implemented on ${h}`, ve.Unimplemented);
        });
        return $ === "addListener" && (C.remove = async () => R()), C;
      };
      return m.toString = () => `${$.toString()}() { [capacitor code] }`, Object.defineProperty(m, "name", {
        value: $,
        writable: !1,
        configurable: !1
      }), m;
    }, V = N("addListener"), j = N("removeListener"), q = ($, R) => {
      const m = V({ eventName: $ }, R), S = async () => {
        const E = await m;
        j({
          eventName: $,
          callbackId: E
        }, R);
      }, C = new Promise((E) => m.then(() => E({ remove: S })));
      return C.remove = async () => {
        console.warn("Using addListener() without 'await' is deprecated."), await S();
      }, C;
    }, _ = new Proxy({}, {
      get($, R) {
        switch (R) {
          case "$$typeof":
            return;
          case "toJSON":
            return () => ({});
          case "addListener":
            return y ? q : V;
          case "removeListener":
            return j;
          default:
            return N(R);
        }
      }
    });
    return s[p] = _, u.set(p, {
      name: p,
      proxy: _,
      platforms: /* @__PURE__ */ new Set([...Object.keys(g), ...y ? [h] : []])
    }), _;
  };
  return t.convertFileSrc || (t.convertFileSrc = (p) => p), t.getPlatform = i, t.handleError = d, t.isNativePlatform = a, t.isPluginAvailable = o, t.registerPlugin = f, t.Exception = Qe, t.DEBUG = !!t.DEBUG, t.isLoggingEnabled = !!t.isLoggingEnabled, t;
}, bn = (n) => n.Capacitor = yn(n), B = /* @__PURE__ */ bn(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {}), se = B.registerPlugin;
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
    return new B.Exception(e, ve.Unimplemented);
  }
  unavailable(e = "not available") {
    return new B.Exception(e, ve.Unavailable);
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
const Ot = (n) => encodeURIComponent(n).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape), Tt = (n) => n.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class xn extends ie {
  async getCookies() {
    const e = document.cookie, t = {};
    return e.split(";").forEach((s) => {
      if (s.length <= 0)
        return;
      let [i, a] = s.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
      i = Tt(i).trim(), a = Tt(a).trim(), t[i] = a;
    }), t;
  }
  async setCookie(e) {
    try {
      const t = Ot(e.key), s = Ot(e.value), i = e.expires ? `; expires=${e.expires.replace("expires=", "")}` : "", a = (e.path || "/").replace("path=", ""), o = e.url != null && e.url.length > 0 ? `domain=${e.url}` : "";
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
  web: () => new xn()
});
const kn = async (n) => new Promise((e, t) => {
  const s = new FileReader();
  s.onload = () => {
    const i = s.result;
    e(i.indexOf(",") >= 0 ? i.split(",")[1] : i);
  }, s.onerror = (i) => t(i), s.readAsDataURL(n);
}), Sn = (n = {}) => {
  const e = Object.keys(n);
  return Object.keys(n).map((i) => i.toLocaleLowerCase()).reduce((i, a, o) => (i[a] = n[e[o]], i), {});
}, En = (n, e = !0) => n ? Object.entries(n).reduce((s, i) => {
  const [a, o] = i;
  let c, d;
  return Array.isArray(o) ? (d = "", o.forEach((u) => {
    c = e ? encodeURIComponent(u) : u, d += `${a}=${c}&`;
  }), d.slice(0, -1)) : (c = e ? encodeURIComponent(o) : o, d = `${a}=${c}`), `${s}&${d}`;
}, "").substr(1) : null, Gt = (n, e = {}) => {
  const t = Object.assign({ method: n.method || "GET", headers: n.headers }, e), i = Sn(n.headers)["content-type"] || "";
  if (typeof n.data == "string")
    t.body = n.data;
  else if (i.includes("application/x-www-form-urlencoded")) {
    const a = new URLSearchParams();
    for (const [o, c] of Object.entries(n.data || {}))
      a.set(o, c);
    t.body = a.toString();
  } else if (i.includes("multipart/form-data") || n.data instanceof FormData) {
    const a = new FormData();
    if (n.data instanceof FormData)
      n.data.forEach((c, d) => {
        a.append(d, c);
      });
    else
      for (const c of Object.keys(n.data))
        a.append(c, n.data[c]);
    t.body = a;
    const o = new Headers(t.headers);
    o.delete("content-type"), t.headers = o;
  } else (i.includes("application/json") || typeof n.data == "object") && (t.body = JSON.stringify(n.data));
  return t;
};
class Ln extends ie {
  /**
   * Perform an Http request given a set of options
   * @param options Options to build the HTTP request
   */
  async request(e) {
    const t = Gt(e, e.webFetchExtra), s = En(e.params, e.shouldEncodeUrlParams), i = s ? `${e.url}?${s}` : e.url, a = await fetch(i, t), o = a.headers.get("content-type") || "";
    let { responseType: c = "text" } = a.ok ? e : {};
    o.includes("application/json") && (c = "json");
    let d, u;
    switch (c) {
      case "arraybuffer":
      case "blob":
        u = await a.blob(), d = await kn(u);
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
    return a.headers.forEach((p, g) => {
      f[g] = p;
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
  web: () => new Ln()
});
var At;
(function(n) {
  n.Dark = "DARK", n.Light = "LIGHT", n.Default = "DEFAULT";
})(At || (At = {}));
var _t;
(function(n) {
  n.StatusBar = "StatusBar", n.NavigationBar = "NavigationBar";
})(_t || (_t = {}));
class Cn extends ie {
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
  web: () => new Cn()
});
function Pn(n) {
  return new DataView(Uint8Array.from(n).buffer);
}
function $n(n) {
  return Array.from(new Uint8Array(n.buffer, n.byteOffset, n.byteLength));
}
function Dn(n) {
  return `0000${n.toString(16).padStart(4, "0")}-0000-1000-8000-00805f9b34fb`;
}
function Le(n) {
  const e = [];
  let t, s, i = 1, a = 0;
  for (t = 0; t < n.length; t++)
    s = n.charCodeAt(t), (s > 47 && s < 58 || s > 64 && s < 71 || s > 96 && s < 103) && (a = a << 4 ^ (s > 64 ? s + 9 : s) & 15, (i ^= 1) && e.push(a & 255));
  return Pn(e);
}
function Ce(n) {
  return $n(n).map((e) => {
    let t = e.toString(16);
    return t.length == 1 && (t = "0" + t), t;
  }).join("");
}
function On(n) {
  if (typeof n == "string")
    return n;
  if (typeof n == "number")
    return Dn(n);
  throw new Error("Invalid UUID");
}
function Rt(n) {
  const e = {};
  if (n)
    return n.forEach((t, s) => {
      e[s.toString()] = t;
    }), e;
}
function Mt(n) {
  if (n !== void 0) {
    if (typeof n == "string") {
      const e = Le(n);
      return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
    }
    return n instanceof DataView ? new Uint8Array(n.buffer, n.byteOffset, n.byteLength) : n;
  }
}
function Me(n) {
  if (n !== void 0)
    return n instanceof DataView ? Ce(n) : Ce(new DataView(n.buffer, n.byteOffset, n.byteLength));
}
function et(n) {
  if (typeof SharedArrayBuffer < "u" && n.buffer instanceof SharedArrayBuffer) {
    const t = new Uint8Array(n.buffer, n.byteOffset, n.byteLength).slice().buffer;
    return new DataView(t);
  }
  return n;
}
const v = se("BluetoothLe", {
  web: () => Promise.resolve().then(() => ys).then((n) => new n.BluetoothLeWeb())
}), Tn = () => {
  let n = Promise.resolve();
  return (e) => new Promise((t, s) => {
    n = n.then(() => e()).then(t).catch(s);
  });
};
function tt(n) {
  return n ? Tn() : (e) => e();
}
function P(n) {
  if (typeof n != "string")
    throw new Error(`Invalid UUID type ${typeof n}. Expected string.`);
  if (n = n.toLowerCase(), !(n.search(/^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/) >= 0))
    throw new Error(`Invalid UUID format ${n}. Expected 128 bit string (e.g. "0000180d-0000-1000-8000-00805f9b34fb").`);
  return n;
}
class An {
  constructor() {
    this.scanListener = null, this.eventListeners = /* @__PURE__ */ new Map(), this.queue = tt(!0);
  }
  enableQueue() {
    this.queue = tt(!0);
  }
  disableQueue() {
    this.queue = tt(!1);
  }
  async initialize(e) {
    await this.queue(async () => {
      await v.initialize(e);
    });
  }
  async isEnabled() {
    return await this.queue(async () => (await v.isEnabled()).value);
  }
  async requestEnable() {
    await this.queue(async () => {
      await v.requestEnable();
    });
  }
  async enable() {
    await this.queue(async () => {
      await v.enable();
    });
  }
  async disable() {
    await this.queue(async () => {
      await v.disable();
    });
  }
  async startEnabledNotifications(e) {
    await this.queue(async () => {
      var t;
      const s = "onEnabledChanged";
      await ((t = this.eventListeners.get(s)) === null || t === void 0 ? void 0 : t.remove());
      const i = await v.addListener(s, (a) => {
        e(a.value);
      });
      this.eventListeners.set(s, i), await v.startEnabledNotifications();
    });
  }
  async stopEnabledNotifications() {
    await this.queue(async () => {
      var e;
      const t = "onEnabledChanged";
      await ((e = this.eventListeners.get(t)) === null || e === void 0 ? void 0 : e.remove()), this.eventListeners.delete(t), await v.stopEnabledNotifications();
    });
  }
  async isLocationEnabled() {
    return await this.queue(async () => (await v.isLocationEnabled()).value);
  }
  async openLocationSettings() {
    await this.queue(async () => {
      await v.openLocationSettings();
    });
  }
  async openBluetoothSettings() {
    await this.queue(async () => {
      await v.openBluetoothSettings();
    });
  }
  async openAppSettings() {
    await this.queue(async () => {
      await v.openAppSettings();
    });
  }
  async setDisplayStrings(e) {
    await this.queue(async () => {
      await v.setDisplayStrings(e);
    });
  }
  async requestDevice(e) {
    return e = e ? this.validateRequestBleDeviceOptions(e) : void 0, await this.queue(async () => await v.requestDevice(e));
  }
  async requestLEScan(e, t) {
    e = this.validateRequestBleDeviceOptions(e), await this.queue(async () => {
      var s;
      await ((s = this.scanListener) === null || s === void 0 ? void 0 : s.remove()), this.scanListener = await v.addListener("onScanResult", (i) => {
        const a = Object.assign(Object.assign({}, i), { manufacturerData: this.convertObject(i.manufacturerData), serviceData: this.convertObject(i.serviceData), rawAdvertisement: i.rawAdvertisement ? this.convertValue(i.rawAdvertisement) : void 0 });
        t(a);
      }), await v.requestLEScan(e);
    });
  }
  async stopLEScan() {
    await this.queue(async () => {
      var e;
      await ((e = this.scanListener) === null || e === void 0 ? void 0 : e.remove()), this.scanListener = null, await v.stopLEScan();
    });
  }
  async getDevices(e) {
    if (!Array.isArray(e))
      throw new Error("deviceIds must be an array");
    return this.queue(async () => (await v.getDevices({ deviceIds: e })).devices);
  }
  async getConnectedDevices(e) {
    if (!Array.isArray(e))
      throw new Error("services must be an array");
    return e = e.map(P), this.queue(async () => (await v.getConnectedDevices({ services: e })).devices);
  }
  async getBondedDevices() {
    return this.queue(async () => (await v.getBondedDevices()).devices);
  }
  async connect(e, t, s) {
    await this.queue(async () => {
      var i;
      if (t) {
        const a = `disconnected|${e}`;
        await ((i = this.eventListeners.get(a)) === null || i === void 0 ? void 0 : i.remove());
        const o = await v.addListener(a, () => {
          t(e);
        });
        this.eventListeners.set(a, o);
      }
      await v.connect(Object.assign({ deviceId: e }, s));
    });
  }
  async createBond(e, t) {
    await this.queue(async () => {
      await v.createBond(Object.assign({ deviceId: e }, t));
    });
  }
  async isBonded(e) {
    return await this.queue(async () => (await v.isBonded({ deviceId: e })).value);
  }
  async disconnect(e) {
    await this.queue(async () => {
      await v.disconnect({ deviceId: e });
    });
  }
  async getServices(e) {
    return await this.queue(async () => (await v.getServices({ deviceId: e })).services);
  }
  async discoverServices(e) {
    await this.queue(async () => {
      await v.discoverServices({ deviceId: e });
    });
  }
  async getMtu(e) {
    return await this.queue(async () => (await v.getMtu({ deviceId: e })).value);
  }
  async requestConnectionPriority(e, t) {
    await this.queue(async () => {
      await v.requestConnectionPriority({ deviceId: e, connectionPriority: t });
    });
  }
  async readRssi(e) {
    return await this.queue(async () => {
      const s = await v.readRssi({ deviceId: e });
      return parseFloat(s.value);
    });
  }
  async read(e, t, s, i) {
    return t = P(t), s = P(s), await this.queue(async () => {
      const o = await v.read(Object.assign({
        deviceId: e,
        service: t,
        characteristic: s
      }, i));
      return this.convertValue(o.value);
    });
  }
  async write(e, t, s, i, a) {
    return t = P(t), s = P(s), this.queue(async () => {
      if (!i?.buffer)
        throw new Error("Invalid data.");
      let o = i;
      B.getPlatform() !== "web" && (o = Ce(i)), await v.write(Object.assign({
        deviceId: e,
        service: t,
        characteristic: s,
        value: o
      }, a));
    });
  }
  async writeWithoutResponse(e, t, s, i, a) {
    t = P(t), s = P(s), await this.queue(async () => {
      if (!i?.buffer)
        throw new Error("Invalid data.");
      let o = i;
      B.getPlatform() !== "web" && (o = Ce(i)), await v.writeWithoutResponse(Object.assign({
        deviceId: e,
        service: t,
        characteristic: s,
        value: o
      }, a));
    });
  }
  async readDescriptor(e, t, s, i, a) {
    return t = P(t), s = P(s), i = P(i), await this.queue(async () => {
      const c = await v.readDescriptor(Object.assign({
        deviceId: e,
        service: t,
        characteristic: s,
        descriptor: i
      }, a));
      return this.convertValue(c.value);
    });
  }
  async writeDescriptor(e, t, s, i, a, o) {
    return t = P(t), s = P(s), i = P(i), this.queue(async () => {
      if (!a?.buffer)
        throw new Error("Invalid data.");
      let c = a;
      B.getPlatform() !== "web" && (c = Ce(a)), await v.writeDescriptor(Object.assign({
        deviceId: e,
        service: t,
        characteristic: s,
        descriptor: i,
        value: c
      }, o));
    });
  }
  async startNotifications(e, t, s, i, a) {
    t = P(t), s = P(s), await this.queue(async () => {
      var o;
      const c = `notification|${e}|${t}|${s}`;
      await ((o = this.eventListeners.get(c)) === null || o === void 0 ? void 0 : o.remove());
      const d = await v.addListener(c, (u) => {
        i(this.convertValue(u?.value));
      });
      this.eventListeners.set(c, d), await v.startNotifications(Object.assign({
        deviceId: e,
        service: t,
        characteristic: s
      }, a));
    });
  }
  async stopNotifications(e, t, s) {
    t = P(t), s = P(s), await this.queue(async () => {
      var i;
      const a = `notification|${e}|${t}|${s}`;
      await ((i = this.eventListeners.get(a)) === null || i === void 0 ? void 0 : i.remove()), this.eventListeners.delete(a), await v.stopNotifications({
        deviceId: e,
        service: t,
        characteristic: s
      });
    });
  }
  validateRequestBleDeviceOptions(e) {
    return e = Object.assign({}, e), e.services && (e.services = e.services.map(P)), e.optionalServices && (e.optionalServices = e.optionalServices.map(P)), e.serviceData && B.getPlatform() !== "web" && (e.serviceData = e.serviceData.map((t) => Object.assign(Object.assign({}, t), { serviceUuid: P(t.serviceUuid), dataPrefix: Me(t.dataPrefix), mask: Me(t.mask) }))), e.manufacturerData && (B.getPlatform() !== "web" ? e.manufacturerData = e.manufacturerData.map((t) => Object.assign(Object.assign({}, t), { dataPrefix: Me(t.dataPrefix), mask: Me(t.mask) })) : e.manufacturerData = e.manufacturerData.map((t) => Object.assign(Object.assign({}, t), { dataPrefix: Mt(t.dataPrefix), mask: Mt(t.mask) }))), e;
  }
  convertValue(e) {
    return typeof e == "string" ? Le(e) : e === void 0 ? new DataView(new ArrayBuffer(0)) : e;
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
const pe = new An(), nt = 256, st = 10, _n = 4e3;
class Yt {
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
    this.setStatus("live"), this.sampleFns.forEach((s) => s(t)), this.lostTimer && clearTimeout(this.lostTimer), this.lostTimer = setTimeout(() => this.setStatus("lost"), _n);
  }
  clearLost() {
    this.lostTimer && clearTimeout(this.lostTimer), this.lostTimer = null;
  }
}
function It(n) {
  let e = "";
  for (let t = 0; t < n.byteLength; t++) e += n.getUint8(t).toString(16).padStart(2, "0") + " ";
  return e.trim();
}
function Ft(n, e) {
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
function Rn(n) {
  return n.byteLength < st + 2 ? null : (n.getUint8(st) << 8 | n.getUint8(st + 1)) / 100;
}
class Pe extends Yt {
  constructor() {
    super(...arguments), this.name = "WeiHeng scale", this.scanning = !1, this.seen = /* @__PURE__ */ new Map(), this.onSeen = () => {
    }, this.lastScanStart = 0, this.healTimer = null, this.lastPacketAt = 0, this.restarts = 0;
  }
  async start() {
    if (!B.isNativePlatform())
      throw new Error("Bluetooth scanning needs the Android build. Use the simulator in the browser.");
    if (await pe.initialize({ androidNeverForLocation: !0 }), !await pe.isEnabled().catch(() => !0))
      try {
        await pe.requestEnable();
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
        await pe.stopLEScan();
      } catch {
      }
      await new Promise((e) => setTimeout(e, 300)), this.restarts++;
    }
    this.setStatus("scanning"), this.scanning = !0, this.lastScanStart = Date.now(), await pe.requestLEScan(
      { allowDuplicates: !0, scanMode: ht.SCAN_MODE_LOW_LATENCY },
      (e) => {
        const t = e.localName ?? e.device.name ?? "", s = e.manufacturerData ?? {}, i = Object.keys(s);
        let a = s[String(nt)] ?? s[nt.toString(16)];
        !a && /^(IF_|WH-|WEIHENG)/i.test(t) && i.length && (a = s[i[0]]), !a && e.rawAdvertisement && (a = Ft(e.rawAdvertisement, nt) ?? (/^IF_/i.test(t) ? Ft(e.rawAdvertisement) : void 0));
        const o = a ? Rn(a) : null, c = { id: e.device.deviceId, name: t, rssi: e.rssi ?? 0, keys: i.join(","), hex: a ? It(a) : e.rawAdvertisement ? It(e.rawAdvertisement).slice(0, 60) : "", kg: o, t: Date.now() };
        this.seen.set(c.id, c), this.onSeen(c), o !== null && (this.lastPacketAt = Date.now(), this.emitRaw(o));
      }
    );
  }
  async stop() {
    if (this.healTimer && (clearInterval(this.healTimer), this.healTimer = null), this.scanning)
      try {
        await pe.stopLEScan();
      } catch {
      }
    this.scanning = !1, this.clearLost(), this.setStatus("idle");
  }
}
class Mn extends Yt {
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
const In = { both: "", left: "Left", right: "Right" }, Fn = { complete: "", concentric: "Concentric", eccentric: "Eccentric" };
function be(n, e, t, s, i, a) {
  const o = [s?.trim() ?? "", In[e] ?? "", Fn[t ?? "complete"] ?? "", i ? `${i} link${i === 1 ? "" : "s"}` : "", a ? `+${a} kg` : ""].filter(Boolean);
  return o.length ? `${n} — ${o.join(", ")}` : n;
}
function Oe(n, e, t, s, i, a) {
  const o = t ?? "complete", c = s?.trim() ?? "", d = i ?? 0, u = a ?? 0;
  let f = o === "complete" && !c && !d && !u ? `${n}|${e}` : `${n}|${e}|${o}`;
  return (c || d || u) && (f += `|${c}`), (d || u) && (f += `|${d}L`), u && (f += `|${u}E`), f;
}
function Bn(n, e, t, s, i, a, o) {
  return n.exercise === e && n.side === t && (n.contraction ?? "complete") === (s ?? "complete") && (n.handle ?? "") === (i?.trim() ?? "") && (n.links ?? 0) === (a ?? 0) && (n.extKg ?? 0) === (o ?? 0);
}
function we(n) {
  return n.manualReps && n.manualReps > 0 ? Math.round(n.manualReps) : 1;
}
function fe(n) {
  return n.performedAt ?? n.startedAt;
}
const Ne = 2;
class qn {
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
    const s = Jt(t);
    return {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      exercise: e.exercise,
      side: e.side,
      contraction: e.contraction ?? "complete",
      handle: e.handle?.trim() || void 0,
      links: e.links || void 0,
      extKg: e.extKg || void 0,
      mode: e.mode,
      startedAt: this.t0,
      durationS: t[t.length - 1].t,
      samples: t,
      ...s,
      reps: xt(t)
    };
  }
}
function Jt(n) {
  let e = 0, t = 0, s = 0;
  for (let c = 0; c < n.length; c++) {
    const d = Math.max(0, n[c].kg);
    e = Math.max(e, d), t += d, c > 0 && (s += d * (n[c].t - n[c - 1].t));
  }
  const i = t / n.length, a = n.filter((c) => c.kg > Ne);
  let o = 0;
  if (a.length >= 10) {
    const c = Math.max(3, Math.floor(a.length * 0.2)), d = Math.max(...a.slice(0, c).map((f) => f.kg)), u = Math.max(...a.slice(-c).map((f) => f.kg));
    o = d > 0 ? Math.max(0, (d - u) / d * 100) : 0;
  }
  return { peak: F(e), avg: F(i), output: F(s), inroad: F(o) };
}
function xt(n) {
  if (n.length < 5) return [];
  const e = Math.max(...n.map((u) => u.kg));
  if (e < Ne * 2) return [];
  const t = Math.max(Ne, e * 0.35), s = Math.max(Ne * 0.5, e * 0.2), i = [];
  let a = !1, o = 0, c = 0, d = 0;
  for (const u of n)
    !a && u.kg >= t ? (a = !0, o = u.t, c = u.kg, d = u.t) : a && (u.kg > c && (c = u.kg, d = u.t), u.kg <= s && (u.t - o >= 0.6 && i.push({ index: i.length + 1, peak: F(c), peakT: F(d), startS: F(o), endS: F(u.t), durationS: F(u.t - o) }), a = !1));
  if (a) {
    const u = n[n.length - 1].t;
    u - o >= 0.6 && i.push({ index: i.length + 1, peak: F(c), peakT: F(d), startS: F(o), endS: F(u), durationS: F(u - o) });
  }
  return i.length >= 2 ? i : [];
}
function Nn(n) {
  if (n.length < 6) return null;
  const e = n.slice(-Math.max(3, Math.floor(n.length / 3)));
  return F(e.reduce((t, s) => t + s.peak, 0) / e.length);
}
function F(n) {
  return Math.round(n * 100) / 100;
}
class Xt {
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
    const { ctx: i } = this, a = this.canvas.width / this.dpr, o = this.canvas.height / this.dpr, c = 42, d = 12, u = 12, f = 24, p = a - c - d, g = o - u - f, l = getComputedStyle(document.getElementById("view-force") ?? document.documentElement), h = l.getPropertyValue("--muted").trim() || "#888", y = l.getPropertyValue("--grid").trim() || "#333", b = l.getPropertyValue("--accent").trim() || "#e8552f", w = l.getPropertyValue("--ghost").trim() || "#7a7a7a", A = l.getPropertyValue("--zone").trim() || "rgba(60,180,90,0.18)";
    i.clearRect(0, 0, a, o);
    const N = Math.max(this.opts.windowS, Math.ceil(t / 10) * 10 || 10), V = this.opts.ghost ?? [];
    let j = 10;
    for (const m of e) j = Math.max(j, m.kg);
    for (const m of V) j = Math.max(j, m.kg);
    this.opts.zone && (j = Math.max(j, this.opts.zone.hi)), j = jn(j * 1.1);
    const q = (m) => c + m / N * p, _ = (m) => u + g - Math.max(0, m) / j * g;
    if (this.opts.zone) {
      i.fillStyle = A;
      const m = _(this.opts.zone.hi), S = _(this.opts.zone.lo);
      i.fillRect(c, m, p, S - m);
    }
    i.strokeStyle = y, i.lineWidth = 1, i.fillStyle = h, i.font = "11px system-ui, sans-serif", i.textAlign = "right", i.textBaseline = "middle";
    const $ = 5;
    for (let m = 0; m <= $; m++) {
      const S = j / $ * m, C = _(S);
      i.beginPath(), i.moveTo(c, C), i.lineTo(a - d, C), i.stroke(), i.fillText(S.toFixed(0), c - 6, C);
    }
    i.textAlign = "center", i.textBaseline = "top";
    const R = N <= 30 ? 5 : N <= 90 ? 10 : 30;
    for (let m = 0; m <= N; m += R) {
      const S = q(m);
      i.beginPath(), i.moveTo(S, u), i.lineTo(S, u + g), i.stroke(), i.fillText(Un(m), S, u + g + 6);
    }
    if (this.opts.marks?.length) {
      i.strokeStyle = w, i.setLineDash([3, 4]);
      for (const m of this.opts.marks)
        i.beginPath(), i.moveTo(q(m), u), i.lineTo(q(m), u + g), i.stroke();
      i.setLineDash([]);
    }
    if (V.length > 1 && (i.strokeStyle = w, i.lineWidth = 1.5, i.globalAlpha = 0.55, i.beginPath(), V.forEach((m, S) => S ? i.lineTo(q(m.t), _(m.kg)) : i.moveTo(q(m.t), _(m.kg))), i.stroke(), i.globalAlpha = 1), e.length > 1) {
      i.strokeStyle = b, i.lineWidth = 2.5, i.lineJoin = "round", i.beginPath(), e.forEach((C, E) => E ? i.lineTo(q(C.t), _(C.kg)) : i.moveTo(q(C.t), _(C.kg))), i.stroke();
      const m = e[e.length - 1];
      i.lineTo(q(m.t), _(0)), i.lineTo(q(e[0].t), _(0)), i.closePath(), i.fillStyle = b, i.globalAlpha = 0.12, i.fill(), i.globalAlpha = 1;
      const S = this.opts.peaks ?? [];
      if (S.length) {
        const C = Math.max(...S.map((E) => E.kg));
        i.font = "bold 11px system-ui, sans-serif", i.textAlign = "center", i.textBaseline = "bottom";
        for (const E of S) {
          const ce = q(E.t), le = _(E.kg);
          i.fillStyle = E.kg === C ? b : "#ecebe6", i.beginPath(), i.arc(ce, le, 3.5, 0, Math.PI * 2), i.fill();
          const Lt = E.kg.toFixed(0), Re = i.measureText(Lt).width + 8, Ct = Math.min(Math.max(ce, c + Re / 2), c + p - Re / 2), Pt = Math.max(u + 14, le - 6);
          i.fillStyle = E.kg === C ? b : "rgba(40,42,48,0.92)", i.fillRect(Ct - Re / 2, Pt - 14, Re, 14), i.fillStyle = "#fff", i.fillText(Lt, Ct, Pt - 1);
        }
        i.textAlign = "left", i.textBaseline = "alphabetic";
      }
      i.fillStyle = b, i.beginPath(), i.arc(q(m.t), _(m.kg), 4, 0, Math.PI * 2), i.fill();
    } else s > 0 && (i.fillStyle = b, i.beginPath(), i.arc(q(0), _(s), 4, 0, Math.PI * 2), i.fill());
  }
}
function jn(n) {
  const e = [10, 20, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500];
  for (const t of e) if (n <= t) return t;
  return Math.ceil(n / 100) * 100;
}
function Un(n) {
  const e = Math.floor(n / 60), t = n % 60;
  return `${e}:${t.toString().padStart(2, "0")}`;
}
function Je(n, e = {}) {
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
      return Je("free");
  }
}
function Zt(n) {
  if (!n.repeat || n.phases.length < 2) return n.phases;
  const [e, ...t] = n.phases, s = [e];
  for (let i = 0; i < n.repeat; i++)
    for (const a of t)
      i === n.repeat - 1 && a === t[t.length - 1] && a.cue === "rest" || s.push({ ...a, name: t.length > 1 && a.cue !== "rest" ? `${a.name} ${i + 1}/${n.repeat}` : a.name });
  return s;
}
class Vn {
  constructor() {
    this.timeline = [], this.idx = -1, this.phaseStart = 0, this.timer = null, this.running = !1, this.onPhase = () => {
    }, this.onTick = () => {
    }, this.onDone = () => {
    };
  }
  start(e) {
    this.timeline = Zt(e), this.idx = -1, this.running = !0, this.next(), this.timer = setInterval(() => this.tick(), 100);
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
var Bt;
(function(n) {
  n[n.Flush = 0] = "Flush", n[n.Add = 1] = "Add";
})(Bt || (Bt = {}));
const Ie = se("TextToSpeech", {
  web: () => Promise.resolve().then(() => xs).then((n) => new n.TextToSpeechWeb())
}), Fe = B.isNativePlatform();
let it = null;
function Hn() {
  return it || (it = new (window.AudioContext || window.webkitAudioContext)()), it;
}
function ae(n = 880, e = 120, t = 0.25) {
  try {
    const s = Hn(), i = s.createOscillator(), a = s.createGain();
    i.frequency.value = n, i.type = "sine", a.gain.value = t, i.connect(a), a.connect(s.destination), i.start(), a.gain.exponentialRampToValueAtTime(1e-4, s.currentTime + e / 1e3), i.stop(s.currentTime + e / 1e3);
  } catch {
  }
}
const X = {
  go: () => ae(1200, 220, 0.3),
  rest: () => ae(500, 220, 0.25),
  tick: () => ae(900, 60, 0.15),
  done: () => {
    ae(1e3, 120), setTimeout(() => ae(1300, 160), 140), setTimeout(() => ae(1600, 220), 320);
  },
  inZone: () => ae(1e3, 50, 0.1),
  outZone: () => ae(300, 120, 0.2)
};
class Wn {
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
    if (Fe) return this.nativeBusy;
    try {
      return speechSynthesis.speaking || speechSynthesis.pending ? (this.busySince || (this.busySince = Date.now()), Date.now() - this.busySince > 4e3 ? (this.reset(), !1) : !0) : (this.busySince = 0, !1);
    } catch {
      return !1;
    }
  }
  /** Hard reset of the engine. */
  reset() {
    if (Fe) {
      Ie.stop().catch(() => {
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
    if (Fe)
      try {
        return `${(await Ie.getSupportedVoices()).voices.length} native voices`;
      } catch {
        return "native TTS unavailable";
      }
    if (!("speechSynthesis" in window)) return "no speech engine in this browser — open in Chrome";
    const e = speechSynthesis.getVoices().length;
    return e ? `${e} voices` : "no voices installed";
  }
  say(e, t = !1, s = !1) {
    if (!this.enabled) return;
    if (this.onSpeak(e), Fe) {
      if (this.nativeBusy && !t) return;
      this.nativeBusy = !0, (t ? Ie.stop().catch(() => {
      }) : Promise.resolve()).then(() => Ie.speak({ text: e, lang: "en-US", rate: this.rate, pitch: this.pitch, volume: 1, category: "ambient" })).catch(() => {
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
function Kn(n) {
  const e = Math.floor(n / 60), t = n % 60;
  return t === 0 && e > 0 ? e === 1 ? "1 minute" : `${e} minutes` : String(t);
}
const qt = se("KeepAwake", {
  web: () => Promise.resolve().then(() => Ss).then((n) => new n.KeepAwakeWeb())
}), Qt = se("Preferences", {
  web: () => Promise.resolve().then(() => Ls).then((n) => new n.PreferencesWeb())
}), xe = "ufl.sets.v1", Be = "ufl.max.v1", at = "ufl.exercises.v1", en = [
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
function zn(n) {
  return /^SR\b|self.?resisted/i.test(n) ? "self-resisted" : "iso";
}
async function rt(n, e) {
  try {
    const t = B.isNativePlatform() ? (await Qt.get({ key: n })).value : localStorage.getItem(n);
    return t ? JSON.parse(t) : e;
  } catch {
    return e;
  }
}
async function ee(n, e) {
  const t = JSON.stringify(e);
  B.isNativePlatform() ? await Qt.set({ key: n, value: t }) : localStorage.setItem(n, t);
}
const T = {
  async sets() {
    return rt(xe, []);
  },
  async saveSet(n) {
    const e = await this.sets();
    e.push(n), await ee(xe, e.slice(-500));
  },
  async updateSet(n) {
    const e = await this.sets(), t = e.findIndex((s) => s.id === n.id);
    t >= 0 ? e[t] = n : e.push(n), await ee(xe, e);
  },
  async deleteSet(n) {
    const e = await this.sets();
    await ee(xe, e.filter((t) => t.id !== n));
  },
  async maxes() {
    return rt(Be, {});
  },
  async setMax(n, e) {
    const t = await this.maxes();
    t[n] = { kg: e, at: Date.now() }, await ee(Be, t);
  },
  async deleteMax(n) {
    const e = await this.maxes();
    delete e[n], await ee(Be, e);
  },
  async exercises() {
    return rt(at, en);
  },
  /** Rename an exercise in every stored set and max (and the local list). */
  async renameExercise(n, e) {
    const t = await this.sets();
    for (const o of t) o.exercise === n && (o.exercise = e);
    await ee(xe, t);
    const s = await this.maxes(), i = {};
    for (const [o, c] of Object.entries(s)) {
      const [d, ...u] = o.split("|"), f = [d === n ? e : d, ...u].join("|");
      (!i[f] || i[f].kg < c.kg) && (i[f] = c);
    }
    await ee(Be, i);
    const a = await this.exercises();
    if (a.includes(n)) {
      const o = a.map((c) => c === n ? e : c);
      await ee(at, [...new Set(o)]);
    }
  },
  async saveExercises(n) {
    await ee(at, n);
  }
};
function Gn(n) {
  n.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, t) {
        return new Proxy({}, {
          get(s, i) {
            return (a, o, c) => {
              const d = n.Capacitor.Plugins[t];
              if (d === void 0) {
                c(new Error(`Capacitor plugin ${t} not found`));
                return;
              }
              if (typeof d[i] != "function") {
                c(new Error(`Method ${i} not found in Capacitor plugin ${t}`));
                return;
              }
              (async () => {
                try {
                  const u = await d[i](a);
                  o(u);
                } catch (u) {
                  c(u);
                }
              })();
            };
          }
        });
      }
    }
  );
}
function Yn(n) {
  n.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, t) {
        return n.cordova.plugins[t];
      }
    }
  );
}
function Jn(n = !1) {
  typeof window > "u" || (window.CapacitorUtils = window.CapacitorUtils || {}, window.Capacitor !== void 0 && !n ? Gn(window) : window.cordova !== void 0 && Yn(window));
}
var ft;
(function(n) {
  n.Documents = "DOCUMENTS", n.Data = "DATA", n.Library = "LIBRARY", n.Cache = "CACHE", n.External = "EXTERNAL", n.ExternalStorage = "EXTERNAL_STORAGE", n.ExternalCache = "EXTERNAL_CACHE", n.LibraryNoCloud = "LIBRARY_NO_CLOUD", n.Temporary = "TEMPORARY";
})(ft || (ft = {}));
var He;
(function(n) {
  n.UTF8 = "utf8", n.ASCII = "ascii", n.UTF16 = "utf16";
})(He || (He = {}));
const Xn = se("Filesystem", {
  web: () => Promise.resolve().then(() => Ps).then((n) => new n.FilesystemWeb())
});
Jn();
const Zn = se("Share", {
  web: () => Promise.resolve().then(() => Ds).then((n) => new n.ShareWeb())
});
function Qn(n) {
  const e = ["id", "date_performed", "recorded_at", "exercise", "side", "contraction", "handle", "links", "external_kg", "mode", "duration_s", "peak_kg", "avg_kg", "output_kgs", "inroad_pct", "reps", "auto_reps", "rep_peaks"], t = n.map((s) => [
    s.id,
    Te(fe(s)),
    new Date(s.startedAt).toISOString(),
    ot(s.exercise),
    s.side,
    s.contraction ?? "complete",
    ot(s.handle ?? ""),
    s.links ?? 0,
    s.extKg ?? 0,
    s.mode,
    s.durationS.toFixed(1),
    s.peak,
    s.avg,
    s.output,
    s.inroad,
    we(s),
    s.reps?.length ?? 0,
    ot((s.reps ?? []).map((i) => i.peak).join(" "))
  ].join(","));
  return [e.join(","), ...t].join(`
`);
}
function es(n) {
  return ["t_s,kg", ...n.samples.map((e) => `${e.t.toFixed(2)},${e.kg.toFixed(2)}`)].join(`
`);
}
function ot(n) {
  return `"${n.replace(/"/g, '""')}"`;
}
async function pt(n, e, t) {
  if (B.isNativePlatform()) {
    const o = await Xn.writeFile({ path: n, data: e, directory: ft.Cache, encoding: He.UTF8 });
    await Zn.share({ title: n, files: [o.uri] });
    return;
  }
  const s = new Blob([e], { type: t }), i = URL.createObjectURL(s), a = document.createElement("a");
  a.href = i, a.download = n, document.body.appendChild(a), a.click(), setTimeout(() => {
    URL.revokeObjectURL(i), a.remove();
  }, 500);
}
function Te(n) {
  const e = new Date(n);
  return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
class ts {
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
function G() {
  return window.GymLog ?? null;
}
function tn(n) {
  return {
    id: `fl-${n.id}`,
    date: Te(fe(n)),
    exercise: be(n.exercise, n.side, n.contraction, n.handle, n.links, n.extKg),
    kg: n.peak,
    reps: we(n),
    variation: zn(n.exercise),
    at: n.startedAt,
    dur: n.durationS,
    note: [n.extKg ? `external load ${n.extKg} kg` : "", n.mode, n.note].filter(Boolean).join(" · ")
  };
}
function ns() {
  const n = G();
  if (n)
    for (const e of en) n.addExercise(e);
}
let W = null;
const nn = /* @__PURE__ */ new Map();
function ss(n) {
  nn.get(n)?.();
}
function ue(n) {
  return n.replace(/[&<>"']/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[e]);
}
function ct(n, e) {
  n.classList.add("picker-hidden");
  const t = document.createElement("button");
  t.type = "button", t.className = "picker-btn", n.insertAdjacentElement("afterend", t);
  const s = () => {
    const i = n.value;
    t.textContent = i || (e.allOption?.label ?? "Choose…"), t.disabled = n.disabled;
  };
  return s(), new MutationObserver(s).observe(n, { attributes: !0, childList: !0 }), n.addEventListener("change", s), t.onclick = () => Nt(n, e, s), nn.set(n, () => Nt(n, e, s)), s;
}
function Nt(n, e, t) {
  ke();
  const s = document.getElementById("view-force") ?? document.body;
  W = document.createElement("div"), W.className = "picker-overlay", W.innerHTML = `<div class="picker-panel">
    <div class="picker-head"><input type="text" class="picker-search" placeholder="Search exercises…" autocomplete="off" /><button type="button" class="sm ghost picker-close">✕</button></div>
    <div class="picker-list"></div>
  </div>`, s.appendChild(W);
  const i = W.querySelector(".picker-search"), a = W.querySelector(".picker-list"), o = (d) => {
    n.value = d, n.dispatchEvent(new Event("change", { bubbles: !0 })), t(), ke();
  }, c = () => {
    const d = i.value.trim().toLowerCase(), u = e.recent().filter((l) => !d || l.toLowerCase().includes(d)), f = e.all().filter((l) => !u.includes(l) && (!d || l.toLowerCase().includes(d))).sort((l, h) => l.localeCompare(h));
    let p = "";
    e.allOption && (!d || e.allOption.label.toLowerCase().includes(d)) && (p += `<button type="button" class="picker-item" data-v="${ue(e.allOption.value)}">${ue(e.allOption.label)}</button>`), u.length && (p += '<div class="picker-group">Recent in Force Lab</div>' + u.map((l) => `<button type="button" class="picker-item" data-v="${ue(l)}">${ue(l)}</button>`).join("")), f.length && (p += `<div class="picker-group">${u.length ? "All exercises" : "Exercises"}</div>` + f.map((l) => `<button type="button" class="picker-item" data-v="${ue(l)}">${ue(l)}</button>`).join(""));
    const g = i.value.trim();
    g && e.onCreate && !e.all().some((l) => l.toLowerCase() === g.toLowerCase()) && (p += `<button type="button" class="picker-item picker-create" data-create="1">+ Create "${ue(g)}"</button>`), p || (p = '<div class="picker-group">No match</div>'), a.innerHTML = p, a.querySelectorAll(".picker-item").forEach((l) => {
      l.onclick = async () => {
        if (l.dataset.create) {
          const h = i.value.trim();
          await e.onCreate(h) && o(h);
          return;
        }
        o(l.dataset.v);
      };
    });
  };
  i.oninput = c, i.onkeydown = (d) => {
    d.key === "Escape" && ke(), d.key === "Enter" && a.querySelector(".picker-item")?.click();
  }, W.querySelector(".picker-close").onclick = ke, W.onclick = (d) => {
    d.target === W && ke();
  }, c(), setTimeout(() => i.focus(), 50);
}
function ke() {
  W?.remove(), W = null;
}
const r = (n) => document.getElementById(n);
let K = null, te = null, We = 0, x = [], U = [], he = null, re = 0, Y = 0, ge = null, z = !0, $e = localStorage.getItem("ufl.ghostOn") !== "0", qe = null;
const ye = (n, e) => localStorage.getItem(n) ?? e;
let je = Math.max(1, Number(ye("ufl.calloutEvery", "5"))), gt = ye("ufl.calloutOn", "1") === "1", mt = ye("ufl.secBeep", "0") === "1", vt = ye("ufl.secCount", "0") === "1", Ue = null, lt = -1;
const k = new Wn(), I = new qn(), ne = new Vn(), H = new Xt(r("chart")), Se = r("progressChart"), is = {
  countdown: [{ key: "total", label: "seconds", def: 60 }],
  ramp: [{ key: "ramp", label: "ramp s", def: 5 }, { key: "hold", label: "hold s", def: 10 }],
  repeaters: [{ key: "reps", label: "reps", def: 6 }, { key: "hold", label: "on s", def: 10 }, { key: "rest", label: "off s", def: 20 }]
};
function Ke() {
  const n = r("handle").value;
  return n === "__custom" ? "" : n;
}
function Ae() {
  return Math.max(0, Math.floor(Number(r("links").value) || 0));
}
function ze() {
  return Math.max(0, Math.round((Number(r("extKg").value) || 0) * 2) / 2);
}
function de() {
  const n = r("exercise").value || "Choose exercise", e = r("side").value, t = r("protocol").value, s = r("contraction").value;
  r("hdrExName").textContent = r("exercise").value ? be(n, e, s, Ke(), Ae(), ze()) : n, r("hdrExMeta").textContent = t;
}
async function as(n, e) {
  const t = G();
  if (t) {
    if (!t.renameExercise(n, e)) return;
    x = t.exerciseNames();
  } else
    await sn(n, e), x = await T.exercises();
  oe(), Z(), Q(), await D();
}
async function sn(n, e) {
  await T.renameExercise(n, e), U = await T.sets(), r("exercise").value === n && (oe(), r("exercise").value = e);
}
async function rs() {
  ns(), x = G()?.exerciseNames() ?? await T.exercises(), U = await T.sets(), oe(), rn(), await D(), Q(), Z(), ms(), pn(), k.enabled = r("voiceOn").checked;
}
function ut() {
  const n = /* @__PURE__ */ new Map();
  for (const e of U) n.set(e.exercise, Math.max(n.get(e.exercise) ?? 0, e.startedAt));
  for (const e of Object.keys(an)) {
    const t = e.split("|")[0];
    n.has(t) || n.set(t, 0);
  }
  return [...n.entries()].filter(([e]) => x.includes(e)).sort((e, t) => t[1] - e[1]).map(([e]) => e);
}
let an = {};
async function jt(n) {
  if (n = n.trim(), !n) return !1;
  if (!x.includes(n)) {
    const e = G();
    e ? (e.addExercise(n), x = e.exerciseNames()) : (x.push(n), await T.saveExercises(x));
  }
  return oe(), Z(), !0;
}
function oe() {
  setTimeout(de, 0);
  for (const t of ["exercise", "maxExercise"]) {
    const s = r(t), i = s.value;
    s.innerHTML = x.map((a) => `<option>${O(a)}</option>`).join(""), i && x.includes(i) && (s.value = i);
  }
  const n = r("histExercise"), e = n.value;
  n.innerHTML = '<option value="">All</option>' + x.map((t) => `<option>${O(t)}</option>`).join(""), n.value = e;
}
function rn() {
  const n = r("protocol").value, e = r("params");
  e.innerHTML = (is[n] ?? []).map((t) => `<label>${t.label}<input type="number" data-k="${t.key}" value="${t.def}" min="1" /></label>`).join(""), r("protocolHelp").textContent = Je(n, kt()).describe;
}
function kt() {
  const n = {};
  return r("params").querySelectorAll("input").forEach((e) => n[e.dataset.k] = Number(e.value) || 1), n;
}
async function D() {
  const n = r("exercise").value, e = r("side").value, t = r("contraction").value, s = Ke(), i = Ae(), a = ze(), o = U.filter((d) => Bn(d, n, e, t, s, i, a));
  he = o.length ? o[o.length - 1] : null, re = o.reduce((d, u) => Math.max(d, u.output), 0);
  const c = await T.maxes();
  if (an = c, Y = c[Oe(n, e, t, s, i, a)]?.kg ?? 0, !I.recording) {
    const d = o.reduce((u, f) => Math.max(u, f.peak), 0);
    r("sPeak").textContent = he ? L(he.peak) : "–", r("dPeak").innerHTML = he ? `<span class="muted">last · best ${L(d)} kg</span>` : '<span class="muted">no previous set</span>';
  }
  r("zoneMax").textContent = Y ? `(max ${Y} kg → ${Ve().lo.toFixed(1)}–${Ve().hi.toFixed(1)} kg)` : "(no max yet — run a Max test)", r("sGoal").textContent = re ? L(re) : "–", H.opts.ghost = $e ? he?.samples ?? null : null, H.opts.zone = St() ? Ve() : null, I.recording || (H.opts.marks = []);
}
function St() {
  return r("zoneOn").checked && Y > 0;
}
function Ve() {
  const n = Number(r("zoneLo").value) / 100 * Y, e = Number(r("zoneHi").value) / 100 * Y;
  return { lo: Math.min(n, e), hi: Math.max(n, e) };
}
async function wt(n) {
  K && await K.stop(), K = n, n.onStatus(Ge), n.onSample((e) => {
    We = e.kg, J === "live" && (r("statusKg").textContent = `${e.kg.toFixed(1)} kg`), I.push(e), os(e.kg);
  });
  try {
    await n.start(), r("btnTare").disabled = !1, r("btnStart").disabled = !1;
  } catch (e) {
    Ge("error"), r("statusText").textContent = e.message, alert("Connect failed: " + e.message);
  }
}
let J = "idle";
function on() {
  return localStorage.getItem("ufl.keepAwake") !== "0";
}
function cn() {
  if (!B.isNativePlatform()) return;
  (on() && (J === "live" || J === "scanning" || J === "lost") ? qt.keepAwake() : qt.allowSleep()).catch(() => {
  });
}
function Ge(n) {
  J = n, cn(), r("statusDot").className = `dot ${n}`, r("statusPill").className = `pill ${n}`;
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
function ln() {
  return localStorage.getItem("ufl.autoConnect") !== "0";
}
let Ye = !1, yt = !1, dt = !1;
function bt() {
  if (!ln() || !B.isNativePlatform() || K instanceof Pe || te || yt || Ye && J === "error") return;
  Ye = !0;
  const n = new Pe();
  n.onSeen = () => mn(n), r("simPanel").classList.add("hidden"), wt(n);
}
let Ut = 0;
function os(n) {
  if (!I.recording || !St()) {
    ge = null;
    return;
  }
  const e = ne.running ? ne.current() : null;
  if (e && e.cue === "rest") {
    ge = null;
    return;
  }
  const t = Ve(), s = n >= t.lo && n <= t.hi, i = r("phaseBanner");
  s && ge !== "in" && (ge = "in", i.classList.add("inzone"), i.classList.remove("outzone"), k.say("in zone")), !s && ge !== "out" && (ge = "out", i.classList.add("outzone"), i.classList.remove("inzone"), n > 2 && k.say(n < t.lo ? "more" : "ease off"), z && n > 2 && Date.now() - Ut > 1500 && (X.outZone(), Ut = Date.now()));
}
let Et = null, me = null;
function cs() {
  const n = Math.max(0, Math.floor(Number(r("preCount").value) || 0));
  if (!n) {
    Vt();
    return;
  }
  k.unlock(), r("btnStart").classList.add("hidden"), r("btnStop").classList.remove("hidden"), r("btnStop").textContent = "Cancel", Xe(!0);
  let e = n;
  const t = () => {
    _e("rest", "Get ready", String(e)), e > 0 && (k.say(String(e), !0), z && X.tick());
  };
  t(), me = setInterval(() => {
    if (e--, e <= 0) {
      clearInterval(me), me = null, r("btnStop").textContent = "Stop", Vt();
      return;
    }
    t();
  }, 1e3);
}
function ls() {
  return me ? (clearInterval(me), me = null, r("btnStop").textContent = "Stop", r("btnStop").classList.add("hidden"), r("btnStart").classList.remove("hidden"), Xe(!1), _e("rest", "Ready", ""), !0) : !1;
}
function Vt() {
  Et = null;
  const n = r("protocol").value, e = Je(n, kt());
  r("summary").classList.add("hidden"), I.start(), k.unlock(), hs(), H.opts.marks = [], H.opts.peaks = [];
  const t = e.phases.length ? Zt(e).reduce((s, i) => s + i.seconds, 0) : 60;
  H.opts.windowS = Math.max(10, Math.ceil(t / 10) * 10), r("btnStart").classList.add("hidden"), r("btnStop").classList.remove("hidden"), Xe(!0), e.phases.length ? (ne.onPhase = us, ne.onTick = ds, ne.onDone = () => un(), ne.start(e)) : (_e("work", "Free set — go", ""), k.say("Go", !0), z && X.go());
}
function us(n, e, t) {
  _e(n.cue, n.name, n.seconds.toFixed(0)), n.cue === "work" ? (z && X.go(), k.say(n.name.replace(/\d+\/\d+/, ""), !0), H.opts.marks.push(I.elapsed())) : n.cue === "ramp" ? (z && X.go(), k.say("Build up", !0)) : (e > 0 && z && X.rest(), e > 0 && k.say(e === t - 1 ? "Done" : "Rest", !0));
}
let Ht = -1;
function ds(n, e) {
  r("phaseTime").textContent = n.toFixed(n < 10 ? 1 : 0);
  const t = Math.ceil(n);
  t !== Ht && (Ht = t, t <= 3 && t > 0 && z && X.tick());
}
async function un() {
  if (ls()) return;
  ne.stop(), dn();
  const n = r("exercise").value, e = r("side").value, t = r("protocol").value, s = r("contraction").value, i = I.finish({ exercise: n, side: e, mode: t, contraction: s, handle: Ke(), links: Ae(), extKg: ze() });
  i && i.manualReps === void 0 && (i.reps?.length ?? 0) >= 2 && (i.manualReps = i.reps.length), Et = i, r("btnStop").classList.add("hidden"), r("btnStart").classList.remove("hidden"), Xe(!1), _e("idle", "Done", "—"), z && X.done(), i && (t === "maxtest" && i.peak > 0 && (await T.setMax(Oe(n, e, s, Ke(), Ae(), ze()), i.peak), k.say(`New max ${i.peak.toFixed(0)} kilos`, !0)), await T.saveSet(i), U.push(i), G()?.upsertForceSet(tn(i)), await fs(i), await D(), Q(), Z());
}
function hs() {
  dn(), lt = -1, Ue = setInterval(() => {
    if (!I.recording) return;
    const n = Math.floor(I.elapsed());
    if (n === lt || n === 0) return;
    lt = n;
    const e = ne.running ? ne.current() : null;
    if (e && e.cue !== "work") return;
    const t = gt && !St() && n % je === 0;
    (mt && z || t && z) && X.tick();
    const s = [];
    vt && s.push(Kn(n)), t && s.push(We.toFixed(0)), s.length && (!t && k.speaking() || k.say(s.join(", "), t, !0));
  }, 100);
}
function dn() {
  Ue && clearInterval(Ue), Ue = null;
}
function Xe(n) {
  for (const e of ["exercise", "side", "protocol", "contraction", "handle", "links", "extKg", "preCount"]) r(e).disabled = n;
}
function _e(n, e, t) {
  const s = r("phaseBanner");
  s.className = `banner ${n}`, r("phaseName").textContent = e, r("phaseTime").textContent = t;
}
async function fs(n) {
  const e = he, t = await T.maxes(), s = n.side === "left" ? "right" : n.side === "right" ? "left" : null, i = [];
  n.extKg && i.push(M("External load", `+${n.extKg} kg (not measured by the scale)`)), i.push(M("Duration", `${n.durationS.toFixed(1)} s`)), i.push(M("Peak force", `${L(n.peak)} kg`, De(n.peak, e?.peak))), i.push(M("Intensity (avg)", `${L(n.avg)} kg`, De(n.avg, e?.avg))), i.push(M("Output (kg·s)", L(n.output), De(n.output, e?.output))), i.push(M("Inroad", `${n.inroad.toFixed(0)}%`, n.inroad >= 30 ? '<span class="badge good">deep fatigue</span>' : n.inroad >= 15 ? '<span class="badge">moderate</span>' : '<span class="badge warn">shallow — stopped early?</span>')), re && i.push(M("vs. best output", `${(n.output / re * 100).toFixed(0)}%`, n.output > re ? '<span class="badge good">new best</span>' : "")), Y && i.push(M("Peak as % of max", `${(n.peak / Y * 100).toFixed(0)}%`));
  let a = "";
  if (n.reps && n.reps.length) {
    const d = Math.max(...n.reps.map((f) => f.peak));
    a = `<div class="muted" style="margin-top:8px">Reps: ${n.reps.length} · first ${L(n.reps[0].peak)} → last ${L(n.reps[n.reps.length - 1].peak)} kg · avg rep ${(n.reps.reduce((f, p) => f + p.durationS, 0) / n.reps.length).toFixed(1)} s</div>
      <div class="repbars">${n.reps.map((f) => `<div style="height:${Math.max(4, f.peak / d * 100)}%"><span>${f.peak.toFixed(0)}</span></div>`).join("")}</div>`;
    const u = n.mode === "critical" ? Nn(n.reps) : null;
    u && (a += M("Critical force", `${L(u)} kg${Y ? ` (${(u / Y * 100).toFixed(0)}% of max)` : ""}`));
  }
  let o = "";
  if (s) {
    const d = t[Oe(n.exercise, n.side, n.contraction, n.handle, n.links, n.extKg)]?.kg, u = t[Oe(n.exercise, s, n.contraction, n.handle, n.links, n.extKg)]?.kg;
    if (d && u) {
      const f = (Math.abs(d - u) / Math.max(d, u) * 100).toFixed(0);
      o = M("Left/right gap", `${f}% (L ${L(n.side === "left" ? d : u)} / R ${L(n.side === "left" ? u : d)})`, Number(f) > 10 ? '<span class="badge warn">asymmetry</span>' : '<span class="badge good">balanced</span>');
    }
  }
  const c = r("summary");
  c.innerHTML = `<h4>${O(be(n.exercise, n.side, n.contraction, n.handle, n.links, n.extKg))} · ${n.mode}</h4>${i.join("")}${o}${a}
    ${hn(n, "sum")}`, c.classList.remove("hidden"), fn(n, "sum", async () => {
    await D(), Q();
  });
}
function hn(n, e) {
  const t = Te(fe(n));
  return `<div class="editor">
      <label>Reps <input type="number" id="${e}Reps" min="1" step="1" inputmode="numeric" placeholder="1" value="${n.manualReps ?? ""}" /></label>
      <label>Date performed <input type="date" id="${e}Date" value="${t}" max="${Te(Date.now())}" /></label>
      <label class="grow">Note <input type="text" id="${e}Note" placeholder="optional" value="${O(n.note ?? "")}" /></label>
      <button class="sm primary" id="${e}Save" type="button">Save</button>
      <span class="muted" id="${e}Msg">${n.reps?.length ? `auto-detected ${n.reps.length} — change it if that's wrong` : "blank reps = 1"}</span>
    </div>`;
}
function fn(n, e, t) {
  const s = async () => {
    const i = Number(r(`${e}Reps`).value);
    n.manualReps = i > 0 ? Math.round(i) : void 0;
    const a = r(`${e}Date`).value;
    if (a) {
      const [c, d, u] = a.split("-").map(Number), f = new Date(n.startedAt);
      n.performedAt = new Date(c, d - 1, u, f.getHours(), f.getMinutes(), f.getSeconds()).getTime();
    }
    n.note = r(`${e}Note`).value.trim() || void 0, await T.updateSet(n), G()?.upsertForceSet(tn(n));
    const o = U.findIndex((c) => c.id === n.id);
    o >= 0 && (U[o] = n), r(`${e}Msg`).textContent = `saved · ${we(n)} rep${we(n) === 1 ? "" : "s"} · ${Te(fe(n))}`, await t();
  };
  r(`${e}Save`).onclick = s;
  for (const i of [`${e}Reps`, `${e}Date`, `${e}Note`]) r(i).onkeydown = (a) => {
    a.key === "Enter" && s();
  };
}
function M(n, e, t = "") {
  return `<div class="fl-line"><span>${n}</span><span>${e} ${t}</span></div>`;
}
function De(n, e) {
  if (!e) return "";
  const t = (n - e) / e * 100;
  return `<span class="${t >= 0 ? "fl-d up" : "fl-d down"}">${t >= 0 ? "+" : ""}${t.toFixed(1)}%</span>`;
}
function pn() {
  const n = I.current(), e = I.recording ? I.elapsed() : Et?.durationS ?? I.elapsed();
  if (r("liveKg").textContent = We.toFixed(1), r("elapsed").textContent = vn(e), H.draw(n, e, We), I.recording && n.length > 2) {
    const t = Jt(n);
    r("sPeak").textContent = L(t.peak), r("sAvg").textContent = L(t.avg), r("sOut").textContent = L(t.output), r("sInroad").textContent = `${t.inroad.toFixed(0)}%`;
    const s = he;
    r("dPeak").innerHTML = De(t.peak, s?.peak), r("dAvg").innerHTML = De(t.avg, s?.avg), r("dOut").innerHTML = re ? `<span class="muted">${(t.output / re * 100).toFixed(0)}% of goal</span>` : "";
    const i = xt(n);
    H.opts.peaks = i.map((a) => ({ t: a.peakT ?? a.startS, kg: a.peak })), r("sReps").textContent = i.length ? String(i.length) : "–", r("dReps").textContent = i.length ? `last ${i[i.length - 1].peak.toFixed(0)} kg` : "";
  }
  requestAnimationFrame(pn);
}
let Ee = null;
function Q() {
  const n = r("histExercise").value, e = U.filter((t) => !n || t.exercise === n).slice().sort((t, s) => fe(s) - fe(t) || s.startedAt - t.startedAt);
  r("histBody").innerHTML = e.map((t) => `<tr data-id="${t.id}" class="${Ee?.id === t.id ? "sel" : ""}">
      <td>${new Date(fe(t)).toLocaleDateString(void 0, { month: "short", day: "numeric" })}</td>
      <td>${O(be(t.exercise, t.side, t.contraction, t.handle, t.links, t.extKg))}</td>
      <td>${t.mode}</td><td>${we(t)}</td><td>${vn(t.durationS)}</td><td>${L(t.peak)}</td><td>${L(t.avg)}</td><td>${L(t.output)}</td><td>${t.inroad.toFixed(0)}%</td>
      <td><button data-del="${t.id}">✕</button></td></tr>`).join("") || '<tr><td colspan="10" class="muted">No sets yet.</td></tr>', r("histBody").querySelectorAll("tr[data-id]").forEach((t) => {
    t.onclick = (s) => {
      s.target.dataset.del || (Ee = U.find((i) => i.id === t.dataset.id) ?? null, Q(), ps());
    };
  }), r("histBody").querySelectorAll("button[data-del]").forEach((t) => {
    t.onclick = async () => {
      confirm("Delete this set?") && (await T.deleteSet(t.dataset.del), G()?.removeForceSet(`fl-${t.dataset.del}`), U = U.filter((s) => s.id !== t.dataset.del), Ee?.id === t.dataset.del && (Ee = null), Q(), await D());
    };
  }), gs(n ? e.slice().reverse() : []);
}
function ps() {
  const n = Ee, e = r("histDetail");
  if (!n) {
    e.classList.add("hidden");
    return;
  }
  e.classList.remove("hidden"), e.innerHTML = `<h4>${O(be(n.exercise, n.side, n.contraction, n.handle, n.links, n.extKg))} · ${new Date(n.startedAt).toLocaleString()}</h4>
    <div class="chartwrap small"><canvas id="histCanvas"></canvas></div>
    ${M("Peak", `${L(n.peak)} kg`)}${M("Intensity", `${L(n.avg)} kg`)}${M("Output", L(n.output))}${M("Inroad", `${n.inroad.toFixed(0)}%`)}
    ${M("Reps (logged)", String(we(n)))}
    ${n.reps?.length ? M("Auto-detected", `${n.reps.length} (${n.reps.map((s) => s.peak.toFixed(0)).join(", ")} kg)`) : ""}
    ${hn(n, "hist")}
    <div class="actions-inline" style="margin-top:8px"><button class="sm" id="btnUseGhost">Use as ghost trace</button><button class="sm ghost" id="btnSetCsv">Export samples CSV</button></div>`, fn(n, "hist", async () => {
    Q(), await D();
  });
  const t = new Xt(r("histCanvas"));
  t.opts.windowS = Math.max(10, Math.ceil(n.durationS / 10) * 10), t.opts.peaks = xt(n.samples).map((s) => ({ t: s.peakT ?? s.startS, kg: s.peak })), t.draw(n.samples, n.durationS, 0), r("btnUseGhost").onclick = () => {
    $e = !0, localStorage.setItem("ufl.ghostOn", "1"), r("ghostOn").checked = !0, H.opts.ghost = n.samples, gn("train");
  }, r("btnSetCsv").onclick = () => pt(`set-${n.id}.csv`, es(n), "text/csv");
}
function gs(n) {
  const e = r("progress");
  if (n.length < 2) {
    e.classList.add("hidden");
    return;
  }
  e.classList.remove("hidden");
  const t = Math.max(1, window.devicePixelRatio || 1), s = e.clientWidth - 12, i = 160;
  Se.width = s * t, Se.height = i * t, Se.style.width = `${s}px`, Se.style.height = `${i}px`;
  const a = Se.getContext("2d");
  a.setTransform(t, 0, 0, t, 0, 0), a.clearRect(0, 0, s, i);
  const o = getComputedStyle(document.getElementById("view-force") ?? document.documentElement), c = 36, d = 8, u = 10, f = 18, p = s - c - d, g = i - u - f, l = Math.max(10, ...n.map((w) => w.peak)) * 1.1, h = (w) => c + w / Math.max(1, n.length - 1) * p, y = (w) => u + g - w / l * g;
  a.strokeStyle = o.getPropertyValue("--grid"), a.fillStyle = o.getPropertyValue("--muted"), a.font = "10px system-ui", a.textAlign = "right";
  for (let w = 0; w <= 4; w++) {
    const A = l / 4 * w;
    a.beginPath(), a.moveTo(c, y(A)), a.lineTo(s - d, y(A)), a.stroke(), a.fillText(A.toFixed(0), c - 4, y(A) + 3);
  }
  const b = [["peak", o.getPropertyValue("--accent")], ["avg", o.getPropertyValue("--accent2")]];
  for (const [w, A] of b)
    a.strokeStyle = A, a.lineWidth = 2, a.beginPath(), n.forEach((N, V) => V ? a.lineTo(h(V), y(N[w])) : a.moveTo(h(V), y(N[w]))), a.stroke(), a.fillStyle = A, n.forEach((N, V) => {
      a.beginPath(), a.arc(h(V), y(N[w]), 3, 0, Math.PI * 2), a.fill();
    });
  a.fillStyle = o.getPropertyValue("--muted"), a.textAlign = "left", a.fillText("peak", c + 4, u + 10), a.fillStyle = o.getPropertyValue("--accent2"), a.fillText("intensity", c + 36, u + 10);
}
async function Z() {
  const n = await T.maxes(), e = Object.entries(n).map(([t, s]) => {
    const [i, a, o, c, d, u] = t.split("|");
    return `<tr><td>${O(be(i, "both", o, c, Number((d ?? "").replace("L", "")) || 0, Number((u ?? "").replace("E", "")) || 0))}</td><td>${a}</td><td>${L(s.kg)}</td><td>${new Date(s.at).toLocaleDateString()}</td><td><button data-mdel="${O(t)}">✕</button></td></tr>`;
  });
  r("maxBody").innerHTML = e.join("") || '<tr><td colspan="5" class="muted">No maxes yet.</td></tr>', r("maxBody").querySelectorAll("button[data-mdel]").forEach((t) => t.onclick = async () => {
    await T.deleteMax(t.dataset.mdel), Z(), D();
  }), r("exList").innerHTML = x.map((t) => `<span>${O(t)}<button data-xren="${O(t)}" title="Rename">✎</button><button data-xdel="${O(t)}">✕</button></span>`).join(""), r("exList").querySelectorAll("button[data-xren]").forEach((t) => t.onclick = async () => {
    const s = t.dataset.xren, i = prompt(`Rename "${s}" to:`, s);
    !i || i.trim() === s || await as(s, i.trim());
  }), r("exList").querySelectorAll("button[data-xdel]").forEach((t) => t.onclick = async () => {
    const s = G();
    if (s) {
      if (!s.removeExercise(t.dataset.xdel)) {
        alert("Built-in Gym Log exercises can't be removed here.");
        return;
      }
      x = s.exerciseNames();
    } else
      x = x.filter((i) => i !== t.dataset.xdel), await T.saveExercises(x);
    oe(), Z();
  });
}
function gn(n) {
  document.querySelectorAll(".fl-tabs button").forEach((e) => e.classList.toggle("active", e.dataset.tab === n)), document.querySelectorAll(".fl-tab").forEach((e) => e.classList.toggle("active", e.id === `tab-${n}`)), n === "train" && H.resize(), n === "history" && Q();
}
function ms() {
  document.querySelectorAll(".fl-tabs button").forEach((l) => l.onclick = () => gn(l.dataset.tab)), r("hdrExercise").onclick = () => {
    I.recording || ss(r("exercise"));
  };
  for (const l of ["exercise", "side", "protocol", "contraction", "handle", "links", "extKg"]) r(l).addEventListener("change", de);
  de(), r("btnConnect").onclick = async () => {
    if (K instanceof Pe && (J === "live" || J === "scanning")) {
      await K.stop(), K = null, Ge("idle"), yt = !0;
      return;
    }
    yt = !1, r("simPanel").classList.add("hidden"), te = null;
    const l = new Pe();
    l.onSeen = () => mn(l), wt(l);
  }, r("btnSim").onclick = () => {
    te = new Mn(), te.exact = r("simExact").checked, r("simPanel").classList.remove("hidden"), wt(te);
  }, r("simExact").onchange = (l) => {
    const h = l.target.checked;
    te && (te.exact = h), r("simHelp").textContent = h ? "Reading tracks the slider exactly." : 'Slide up to "push", back to 0 to rest. Fatigue is simulated.';
  }, r("btnTare").onclick = () => K?.tare(), r("btnStart").onclick = cs, r("camOn").checked = localStorage.getItem("ufl.camOn") === "1";
  const n = async () => {
    const l = r("camOn").checked;
    if (localStorage.setItem("ufl.camOn", l ? "1" : "0"), l) {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert("Camera not available here."), r("camOn").checked = !1;
        return;
      }
      qe ?? (qe = new ts(r("camVideo")));
      try {
        await qe.start(), r("camPip").classList.remove("hidden"), r("btnCamFlip").classList.remove("hidden");
      } catch (h) {
        alert("Camera failed: " + h.message + `
Allow the Camera permission for UY Force Lab in Android settings.`), r("camOn").checked = !1;
      }
    } else
      qe?.stop(), r("camPip").classList.add("hidden"), r("btnCamFlip").classList.add("hidden");
  };
  r("camOn").onchange = n, r("camOn").checked && n(), r("btnCamFlip").onclick = () => qe?.flip();
  const e = r("camPip"), t = localStorage.getItem("ufl.pipPos");
  if (t) {
    const [l, h] = t.split(",").map(Number);
    e.style.left = `${l}px`, e.style.top = `${h}px`;
  }
  let s = null;
  e.onpointerdown = (l) => {
    const h = e.getBoundingClientRect();
    s = { x: l.clientX, y: l.clientY, l: h.left, t: h.top, moved: !1 }, e.setPointerCapture(l.pointerId);
  }, e.onpointermove = (l) => {
    if (!s) return;
    const h = l.clientX - s.x, y = l.clientY - s.y;
    if (Math.abs(h) + Math.abs(y) > 6 && (s.moved = !0), !s.moved) return;
    const b = e.getBoundingClientRect(), w = Math.min(window.innerWidth - b.width, Math.max(0, s.l + h)), A = Math.min(window.innerHeight - b.height, Math.max(0, s.t + y));
    e.style.left = `${w}px`, e.style.top = `${A}px`;
  }, e.onpointerup = () => {
    if (s) {
      if (s.moved) {
        const l = e.getBoundingClientRect();
        localStorage.setItem("ufl.pipPos", `${Math.round(l.left)},${Math.round(l.top)}`);
      } else e.classList.toggle("large");
      s = null;
    }
  }, r("btnStop").onclick = un, r("simEffort").oninput = (l) => {
    const h = Number(l.target.value);
    te && (te.effort = h), r("simVal").textContent = String(h);
  }, r("exercise").onchange = D, ct(r("exercise"), { recent: ut, all: () => x, onCreate: jt }), ct(r("maxExercise"), { recent: ut, all: () => x, onCreate: jt }), ct(r("histExercise"), { recent: ut, all: () => x, allOption: { value: "", label: "All exercises" } }), r("btnNewEx").onclick = () => {
    r("newExBox").classList.remove("hidden"), r("newExName").focus();
  }, r("btnNewExCancel").onclick = () => {
    r("newExBox").classList.add("hidden"), r("newExName").value = "";
  };
  const i = async () => {
    const l = r("newExName").value.trim();
    if (l) {
      if (!x.includes(l)) {
        const h = G();
        h ? (h.addExercise(l), x = h.exerciseNames()) : (x.push(l), await T.saveExercises(x));
      }
      oe(), r("exercise").value = l, r("newExBox").classList.add("hidden"), r("newExName").value = "", Z(), await D();
    }
  };
  r("btnNewExSave").onclick = i, r("newExName").onkeydown = (l) => {
    l.key === "Enter" && i();
  }, r("side").onchange = D, r("contraction").onchange = D;
  const a = (l) => Number(localStorage.getItem(`ufl.links.${l}`) ?? "0") || 0, o = () => {
    r("links").value = String(a(r("exercise").value));
  };
  r("exercise").addEventListener("change", () => {
    o(), de();
  }), r("extKg").oninput = () => {
    de(), D();
  }, r("links").oninput = () => {
    localStorage.setItem(`ufl.links.${r("exercise").value}`, String(Ae())), de(), D();
  }, setTimeout(o, 0), r("preCount").value = localStorage.getItem("ufl.preCount") ?? "10", r("preCount").onchange = () => localStorage.setItem("ufl.preCount", String(Math.max(0, Number(r("preCount").value) || 0)));
  const c = r("handle"), d = localStorage.getItem("ufl.handle") ?? "";
  d && ![...c.options].some((l) => l.value === d) && c.insertAdjacentHTML("beforeend", `<option>${O(d)}</option>`), c.value = d;
  const u = JSON.parse(localStorage.getItem("ufl.handles") ?? "[]");
  for (const l of u) [...c.options].some((h) => h.value === l) || c.insertAdjacentHTML("beforeend", `<option>${O(l)}</option>`);
  c.onchange = () => {
    if (c.value === "__custom") {
      const l = (prompt("Handle / attachment name") ?? "").trim();
      if (!l) {
        c.value = localStorage.getItem("ufl.handle") ?? "";
        return;
      }
      [...c.options].some((h) => h.value === l) || (c.insertAdjacentHTML("beforeend", `<option>${O(l)}</option>`), u.push(l), localStorage.setItem("ufl.handles", JSON.stringify(u))), c.value = l;
    }
    localStorage.setItem("ufl.handle", c.value), de(), D();
  }, r("protocol").onchange = () => rn(), r("params").oninput = () => r("protocolHelp").textContent = Je(r("protocol").value, kt()).describe;
  for (const l of ["zoneOn", "zoneLo", "zoneHi"]) r(l).oninput = D;
  r("ghostOn").checked = $e, r("ghostOn").onchange = (l) => {
    $e = l.target.checked, localStorage.setItem("ufl.ghostOn", $e ? "1" : "0"), D();
  }, r("histExercise").onchange = Q, r("btnCsv").onclick = () => pt(`uy-force-lab-${Kt()}.csv`, Qn(U), "text/csv"), r("btnJson").onclick = () => pt(`uy-force-lab-${Kt()}.json`, JSON.stringify(U, null, 1), "application/json"), r("voiceOn").onchange = (l) => k.enabled = l.target.checked, r("keepAwake").checked = on(), r("keepAwake").onchange = (l) => {
    localStorage.setItem("ufl.keepAwake", l.target.checked ? "1" : "0"), cn();
  }, r("autoConnect").checked = ln(), r("autoConnect").onchange = (l) => {
    localStorage.setItem("ufl.autoConnect", l.target.checked ? "1" : "0"), Ye = !1, bt();
  }, document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "hidden") {
      K instanceof Pe && !I.recording && (await K.stop(), K = null, Ge("idle"), dt = !0);
      return;
    }
    (dt || J === "idle" || J === "error") && (dt = !1, Ye = !1, bt());
  }), k.rate = Number(ye("ufl.voiceRate", "1.2")) || 1.2, k.pitch = Number(ye("ufl.voicePitch", "1")) || 1;
  const f = (l, h, y, b) => {
    const w = r(l);
    w.value = String(b), r(l + "Val").textContent = b.toFixed(1) + "×", w.oninput = () => {
      const A = Number(w.value);
      y(A), localStorage.setItem(h, String(A)), r(l + "Val").textContent = A.toFixed(1) + "×";
    };
  };
  f("voiceRate", "ufl.voiceRate", (l) => k.rate = l, k.rate), f("voicePitch", "ufl.voicePitch", (l) => k.pitch = l, k.pitch), r("beepOn").onchange = (l) => z = l.target.checked, r("calloutEvery").value = String(je), r("calloutEvery").onchange = (l) => {
    je = Math.max(1, Number(l.target.value) || 1), localStorage.setItem("ufl.calloutEvery", String(je));
  };
  const p = (l, h, y, b) => {
    const w = r(l);
    w.checked = b, w.onchange = () => {
      y(w.checked), localStorage.setItem(h, w.checked ? "1" : "0");
    };
  };
  p("calloutOn", "ufl.calloutOn", (l) => gt = l, gt), p("secBeep", "ufl.secBeep", (l) => mt = l, mt), p("secCount", "ufl.secCount", (l) => vt = l, vt);
  let g = null;
  k.onSpeak = (l) => {
    const h = r("said");
    h.textContent = `🔊 ${l}`, h.classList.add("on"), g && clearTimeout(g), g = setTimeout(() => h.classList.remove("on"), 900);
  }, document.addEventListener("pointerdown", () => k.unlock(), { once: !0 }), document.addEventListener("visibilitychange", () => {
    document.visibilityState === "visible" && k.reset();
  }), r("btnTestVoice").onclick = async () => {
    k.reset();
    const l = r("voiceStatus");
    l.textContent = await k.status(), k.say("Force lab voice check, 1, 2, 3", !0);
  }, r("btnSetMax").onclick = async () => {
    const l = Number(r("maxKg").value);
    l && (await T.setMax(Oe(r("maxExercise").value, r("maxSide").value), l), r("maxKg").value = "", Z(), D());
  }, r("btnAddEx").onclick = async () => {
    const l = r("newEx").value.trim();
    if (!(!l || x.includes(l))) {
      {
        const h = G();
        h ? (h.addExercise(l), x = h.exerciseNames()) : (x.push(l), await T.saveExercises(x));
      }
      r("newEx").value = "", oe(), Z();
    }
  };
}
let Wt = 0;
function mn(n) {
  const e = Date.now();
  if (e - Wt < 1e3 || r("tab-settings").classList.contains("active") === !1) return;
  Wt = e;
  const t = [...n.seen.values()].sort((s, i) => i.t - s.t).slice(0, 12);
  r("seenBody").innerHTML = t.map((s) => `<tr><td>${O(s.name || "(no name)")}<br><small class="muted">${O(s.id)}</small></td><td>${s.rssi}</td><td>${O(s.keys || "–")}</td><td style="white-space:normal;font-family:monospace;font-size:11px">${O(s.hex || "–")}</td><td>${s.kg === null ? "–" : s.kg.toFixed(2)}</td></tr>`).join("") || '<tr><td colspan="5" class="muted">Listening… nothing heard yet.</td></tr>';
}
function L(n) {
  return n >= 100 ? n.toFixed(0) : n.toFixed(1);
}
function vn(n) {
  const e = Math.floor(n / 60), t = Math.floor(n % 60);
  return `${e}:${t.toString().padStart(2, "0")}`;
}
function Kt() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function O(n) {
  return n.replace(/[&<>"]/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[e]);
}
rs();
window.ForceLab = {
  onShow() {
    H.resize(), bt();
  },
  // called by the host after it renamed an exercise in its own data
  renameExercise(n, e) {
    sn(n, e).then(async () => {
      x = G()?.exerciseNames() ?? x, oe(), Z(), Q(), await D();
    });
  }
};
async function vs(n, e, t) {
  let s;
  return Promise.race([
    n,
    new Promise((i, a) => {
      s = setTimeout(() => a(t), e);
    })
  ]).finally(() => clearTimeout(s));
}
class ws extends ie {
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
      const c = this.getBleDevice(e.device), d = {
        device: c,
        localName: c.name,
        rssi: e.rssi,
        txPower: e.txPower,
        manufacturerData: Rt(e.manufacturerData),
        serviceData: Rt(e.serviceData),
        uuids: (i = e.uuids) === null || i === void 0 ? void 0 : i.map(On)
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
      await vs(i.gatt.connect(), o, a);
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
      const c = await o.getCharacteristics(), d = [];
      for (const u of c)
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
    typeof e.value == "string" ? s = Le(e.value) : s = e.value, await t?.writeValueWithResponse(et(s));
  }
  async writeWithoutResponse(e) {
    const t = await this.getCharacteristic(e);
    let s;
    typeof e.value == "string" ? s = Le(e.value) : s = e.value, await t?.writeValueWithoutResponse(et(s));
  }
  async readDescriptor(e) {
    const t = await this.getDescriptor(e);
    return { value: await t?.readValue() };
  }
  async writeDescriptor(e) {
    const t = await this.getDescriptor(e);
    let s;
    typeof e.value == "string" ? s = Le(e.value) : s = e.value, await t?.writeValue(et(s));
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
      const o = new Uint8Array(a.buffer), c = i.dataPrefix;
      if (!(o.length < c.byteLength))
        if (i.mask) {
          const d = i.mask;
          let u = !0;
          for (let f = 0; f < c.byteLength; f++)
            if ((o[f] & d.getUint8(f)) !== (c.getUint8(f) & d.getUint8(f))) {
              u = !1;
              break;
            }
          if (u)
            return !0;
        } else {
          let d = !0;
          for (let u = 0; u < c.byteLength; u++)
            if (o[u] !== c.getUint8(u)) {
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
const ys = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BluetoothLeWeb: ws
}, Symbol.toStringTag, { value: "Module" }));
class bs extends ie {
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
    const t = this.getSpeechSynthesisVoices(), s = new SpeechSynthesisUtterance(), { text: i, lang: a, rate: o, pitch: c, volume: d, voice: u } = e;
    return u !== void 0 && (s.voice = t[u]), d !== void 0 && (s.volume = d >= 0 && d <= 1 ? d : 1), o !== void 0 && (s.rate = o >= 0.1 && o <= 10 ? o : 1), c !== void 0 && (s.pitch = c >= 0 && c <= 2 ? c : 2), a && (s.lang = a), s.text = i, s;
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
const xs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  TextToSpeechWeb: bs
}, Symbol.toStringTag, { value: "Module" }));
class ks extends ie {
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
const Ss = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  KeepAwakeWeb: ks
}, Symbol.toStringTag, { value: "Module" }));
class Es extends ie {
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
      const c = o.substring(i.length), d = (e = this.impl.getItem(o)) !== null && e !== void 0 ? e : "", { value: u } = await this.get({ key: c });
      typeof u == "string" ? s.push(c) : (await this.set({ key: c, value: d }), t.push(c));
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
const Ls = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PreferencesWeb: Es
}, Symbol.toStringTag, { value: "Module" }));
function zt(n) {
  const e = n.split("/").filter((s) => s !== "."), t = [];
  return e.forEach((s) => {
    s === ".." && t.length > 0 && t[t.length - 1] !== ".." ? t.pop() : t.push(s);
  }), t.join("/");
}
function Cs(n, e) {
  n = zt(n), e = zt(e);
  const t = n.split("/"), s = e.split("/");
  return n !== e && t.every((i, a) => i === s[a]);
}
class Ze extends ie {
  constructor() {
    super(...arguments), this.DB_VERSION = 1, this.DB_NAME = "Disc", this._writeCmds = ["add", "put", "delete"], this.downloadFile = async (e) => {
      var t, s;
      const i = Gt(e, e.webFetchExtra), a = await fetch(e.url, i);
      let o;
      if (!e.progress)
        o = await a.blob();
      else if (!a?.body)
        o = new Blob();
      else {
        const d = a.body.getReader();
        let u = 0;
        const f = [], p = a.headers.get("content-type"), g = parseInt(a.headers.get("content-length") || "0", 10);
        for (; ; ) {
          const { done: y, value: b } = await d.read();
          if (y)
            break;
          f.push(b), u += b?.length || 0;
          const w = {
            url: e.url,
            bytes: u,
            contentLength: g
          };
          this.notifyListeners("progress", w);
        }
        const l = new Uint8Array(u);
        let h = 0;
        for (const y of f)
          typeof y > "u" || (l.set(y, h), h += y.length);
        o = new Blob([l.buffer], { type: p || void 0 });
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
      s.onupgradeneeded = Ze.doUpgrade, s.onsuccess = () => {
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
    return this.initDb().then((a) => new Promise((o, c) => {
      const p = a.transaction(["FileStorage"], i).objectStore("FileStorage").index(e)[t](...s);
      p.onsuccess = () => o(p.result), p.onerror = () => c(p.error);
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
    const c = t.substr(0, t.lastIndexOf("/"));
    if (await this.dbRequest("get", [c]) === void 0) {
      const p = c.indexOf("/", 1);
      if (p !== -1) {
        const g = c.substr(p);
        await this.mkdir({
          path: g,
          directory: e.directory,
          recursive: a
        });
      }
    }
    if (!i && !(s instanceof Blob) && (s = s.indexOf(",") >= 0 ? s.split(",")[1] : s, !this.isBase64String(s)))
      throw Error("The supplied data is not valid base64 content.");
    const u = Date.now(), f = {
      path: t,
      folder: c,
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
    let c = o;
    const d = await this.dbRequest("get", [t]);
    if (d && d.type === "directory")
      throw Error("The supplied path is a directory.");
    if (await this.dbRequest("get", [a]) === void 0) {
      const p = a.indexOf("/", 1);
      if (p !== -1) {
        const g = a.substr(p);
        await this.mkdir({
          path: g,
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
      d.content !== void 0 && !i ? s = btoa(atob(d.content) + atob(s)) : s = d.content + s, c = d.ctime;
    }
    const f = {
      path: t,
      folder: a,
      type: "file",
      size: s.length,
      ctime: c,
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
    const t = this.getPath(e.directory, e.path), s = e.recursive, i = t.substr(0, t.lastIndexOf("/")), a = (t.match(/\//g) || []).length, o = await this.dbRequest("get", [i]), c = await this.dbRequest("get", [t]);
    if (a === 1)
      throw Error("Cannot create Root directory");
    if (c !== void 0)
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
    const c = await this.readdir({ path: t, directory: s });
    if (c.files.length !== 0 && !i)
      throw Error("Folder is not empty");
    for (const d of c.files) {
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
      let c = await this.dbRequest("get", [o]);
      return c === void 0 && (c = await this.dbRequest("get", [o + "/"])), {
        name: o.substring(t.length + 1),
        type: c.type,
        size: c.size,
        ctime: c.ctime,
        mtime: c.mtime,
        uri: c.path
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
    const c = this.getPath(o, a), d = this.getPath(s, i);
    if (c === d)
      return {
        uri: d
      };
    if (Cs(c, d))
      throw Error("To path cannot contain the from path");
    let u;
    try {
      u = await this.stat({
        path: i,
        directory: s
      });
    } catch {
      const h = i.split("/");
      h.pop();
      const y = h.join("/");
      if (h.length > 0 && (await this.stat({
        path: y,
        directory: s
      })).type !== "directory")
        throw new Error("Parent directory of the to path is a file");
    }
    if (u && u.type === "directory")
      throw new Error("Cannot overwrite a directory with a file");
    const f = await this.stat({
      path: a,
      directory: o
    }), p = async (l, h, y) => {
      const b = this.getPath(s, l), w = await this.dbRequest("get", [b]);
      w.ctime = h, w.mtime = y, await this.dbRequest("put", [w]);
    }, g = f.ctime ? f.ctime : Date.now();
    switch (f.type) {
      case "file": {
        const l = await this.readFile({
          path: a,
          directory: o
        });
        t && await this.deleteFile({
          path: a,
          directory: o
        });
        let h;
        !(l.data instanceof Blob) && !this.isBase64String(l.data) && (h = He.UTF8);
        const y = await this.writeFile({
          path: i,
          directory: s,
          data: l.data,
          encoding: h
        });
        return t && await p(i, g, f.mtime), y;
      }
      case "directory": {
        if (u)
          throw Error("Cannot move a directory over an existing object");
        try {
          await this.mkdir({
            path: i,
            directory: s,
            recursive: !1
          }), t && await p(i, g, f.mtime);
        } catch {
        }
        const l = (await this.readdir({
          path: a,
          directory: o
        })).files;
        for (const h of l)
          await this._copy({
            from: `${a}/${h.name}`,
            to: `${i}/${h.name}`,
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
Ze._debug = !0;
const Ps = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  FilesystemWeb: Ze
}, Symbol.toStringTag, { value: "Module" }));
class $s extends ie {
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
const Ds = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ShareWeb: $s
}, Symbol.toStringTag, { value: "Module" }));
