var ht;
(function(t) {
  t[t.SCAN_MODE_LOW_POWER = 0] = "SCAN_MODE_LOW_POWER", t[t.SCAN_MODE_BALANCED = 1] = "SCAN_MODE_BALANCED", t[t.SCAN_MODE_LOW_LATENCY = 2] = "SCAN_MODE_LOW_LATENCY";
})(ht || (ht = {}));
var $t;
(function(t) {
  t[t.PHY_LE_1M = 1] = "PHY_LE_1M", t[t.PHY_LE_2M = 2] = "PHY_LE_2M", t[t.PHY_LE_CODED = 3] = "PHY_LE_CODED", t[t.PHY_LE_ALL_SUPPORTED = 255] = "PHY_LE_ALL_SUPPORTED";
})($t || ($t = {}));
var Dt;
(function(t) {
  t[t.CONNECTION_PRIORITY_BALANCED = 0] = "CONNECTION_PRIORITY_BALANCED", t[t.CONNECTION_PRIORITY_HIGH = 1] = "CONNECTION_PRIORITY_HIGH", t[t.CONNECTION_PRIORITY_LOW_POWER = 2] = "CONNECTION_PRIORITY_LOW_POWER";
})(Dt || (Dt = {}));
/*! Capacitor: https://capacitorjs.com/ - MIT License */
var ve;
(function(t) {
  t.Unimplemented = "UNIMPLEMENTED", t.Unavailable = "UNAVAILABLE";
})(ve || (ve = {}));
class Qe extends Error {
  constructor(e, n, s) {
    super(e), this.message = e, this.code = n, this.data = s;
  }
}
const yn = (t) => {
  var e, n;
  return t?.androidBridge ? "android" : !((n = (e = t?.webkit) === null || e === void 0 ? void 0 : e.messageHandlers) === null || n === void 0) && n.bridge ? "ios" : "web";
}, bn = (t) => {
  const e = t.CapacitorCustomPlatform || null, n = t.Capacitor || {}, s = n.Plugins = n.Plugins || {}, i = () => e !== null ? e.name : yn(t), a = () => i() !== "web", o = (p) => {
    const g = u.get(p);
    return !!(g?.platforms.has(i()) || c(p));
  }, c = (p) => {
    var g;
    return (g = n.PluginHeaders) === null || g === void 0 ? void 0 : g.find((l) => l.name === p);
  }, d = (p) => t.console.error(p), u = /* @__PURE__ */ new Map(), h = (p, g = {}) => {
    const l = u.get(p);
    if (l)
      return console.warn(`Capacitor plugin "${p}" already registered. Cannot register plugins twice.`), l.proxy;
    const f = i(), y = c(p);
    let b;
    const w = async () => (!b && f in g ? b = typeof g[f] == "function" ? b = await g[f]() : b = g[f] : e !== null && !b && "web" in g && (b = typeof g.web == "function" ? b = await g.web() : b = g.web), b), A = ($, _) => {
      var m, S;
      if (y) {
        const C = y?.methods.find((E) => _ === E.name);
        if (C)
          return C.rtype === "promise" ? (E) => n.nativePromise(p, _.toString(), E) : (E, le) => n.nativeCallback(p, _.toString(), E, le);
        if ($)
          return (m = $[_]) === null || m === void 0 ? void 0 : m.bind($);
      } else {
        if ($)
          return (S = $[_]) === null || S === void 0 ? void 0 : S.bind($);
        throw new Qe(`"${p}" plugin is not implemented on ${f}`, ve.Unimplemented);
      }
    }, j = ($) => {
      let _;
      const m = (...S) => {
        const C = w().then((E) => {
          const le = A(E, $);
          if (le) {
            const ue = le(...S);
            return _ = ue?.remove, ue;
          } else
            throw new Qe(`"${p}.${$}()" is not implemented on ${f}`, ve.Unimplemented);
        });
        return $ === "addListener" && (C.remove = async () => _()), C;
      };
      return m.toString = () => `${$.toString()}() { [capacitor code] }`, Object.defineProperty(m, "name", {
        value: $,
        writable: !1,
        configurable: !1
      }), m;
    }, V = j("addListener"), U = j("removeListener"), q = ($, _) => {
      const m = V({ eventName: $ }, _), S = async () => {
        const E = await m;
        U({
          eventName: $,
          callbackId: E
        }, _);
      }, C = new Promise((E) => m.then(() => E({ remove: S })));
      return C.remove = async () => {
        console.warn("Using addListener() without 'await' is deprecated."), await S();
      }, C;
    }, M = new Proxy({}, {
      get($, _) {
        switch (_) {
          case "$$typeof":
            return;
          case "toJSON":
            return () => ({});
          case "addListener":
            return y ? q : V;
          case "removeListener":
            return U;
          default:
            return j(_);
        }
      }
    });
    return s[p] = M, u.set(p, {
      name: p,
      proxy: M,
      platforms: /* @__PURE__ */ new Set([...Object.keys(g), ...y ? [f] : []])
    }), M;
  };
  return n.convertFileSrc || (n.convertFileSrc = (p) => p), n.getPlatform = i, n.handleError = d, n.isNativePlatform = a, n.isPluginAvailable = o, n.registerPlugin = h, n.Exception = Qe, n.DEBUG = !!n.DEBUG, n.isLoggingEnabled = !!n.isLoggingEnabled, n;
}, xn = (t) => t.Capacitor = bn(t), B = /* @__PURE__ */ xn(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {}), se = B.registerPlugin;
class ie {
  constructor() {
    this.listeners = {}, this.retainedEventArguments = {}, this.windowListeners = {};
  }
  addListener(e, n) {
    let s = !1;
    this.listeners[e] || (this.listeners[e] = [], s = !0), this.listeners[e].push(n);
    const a = this.windowListeners[e];
    a && !a.registered && this.addWindowListener(a), s && this.sendRetainedArgumentsForEvent(e);
    const o = async () => this.removeListener(e, n);
    return Promise.resolve({ remove: o });
  }
  async removeAllListeners() {
    this.listeners = {};
    for (const e in this.windowListeners)
      this.removeWindowListener(this.windowListeners[e]);
    this.windowListeners = {};
  }
  notifyListeners(e, n, s) {
    const i = this.listeners[e];
    if (!i) {
      if (s) {
        let a = this.retainedEventArguments[e];
        a || (a = []), a.push(n), this.retainedEventArguments[e] = a;
      }
      return;
    }
    i.forEach((a) => a(n));
  }
  hasListeners(e) {
    var n;
    return !!(!((n = this.listeners[e]) === null || n === void 0) && n.length);
  }
  registerWindowListener(e, n) {
    this.windowListeners[n] = {
      registered: !1,
      windowEventName: e,
      pluginEventName: n,
      handler: (s) => {
        this.notifyListeners(n, s);
      }
    };
  }
  unimplemented(e = "not implemented") {
    return new B.Exception(e, ve.Unimplemented);
  }
  unavailable(e = "not available") {
    return new B.Exception(e, ve.Unavailable);
  }
  async removeListener(e, n) {
    const s = this.listeners[e];
    if (!s)
      return;
    const i = s.indexOf(n);
    this.listeners[e].splice(i, 1), this.listeners[e].length || this.removeWindowListener(this.windowListeners[e]);
  }
  addWindowListener(e) {
    window.addEventListener(e.windowEventName, e.handler), e.registered = !0;
  }
  removeWindowListener(e) {
    e && (window.removeEventListener(e.windowEventName, e.handler), e.registered = !1);
  }
  sendRetainedArgumentsForEvent(e) {
    const n = this.retainedEventArguments[e];
    n && (delete this.retainedEventArguments[e], n.forEach((s) => {
      this.notifyListeners(e, s);
    }));
  }
}
const Ot = (t) => encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape), Tt = (t) => t.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class kn extends ie {
  async getCookies() {
    const e = document.cookie, n = {};
    return e.split(";").forEach((s) => {
      if (s.length <= 0)
        return;
      let [i, a] = s.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
      i = Tt(i).trim(), a = Tt(a).trim(), n[i] = a;
    }), n;
  }
  async setCookie(e) {
    try {
      const n = Ot(e.key), s = Ot(e.value), i = e.expires ? `; expires=${e.expires.replace("expires=", "")}` : "", a = (e.path || "/").replace("path=", ""), o = e.url != null && e.url.length > 0 ? `domain=${e.url}` : "";
      document.cookie = `${n}=${s || ""}${i}; path=${a}; ${o};`;
    } catch (n) {
      return Promise.reject(n);
    }
  }
  async deleteCookie(e) {
    try {
      document.cookie = `${e.key}=; Max-Age=0`;
    } catch (n) {
      return Promise.reject(n);
    }
  }
  async clearCookies() {
    try {
      const e = document.cookie.split(";") || [];
      for (const n of e)
        document.cookie = n.replace(/^ +/, "").replace(/=.*/, `=;expires=${(/* @__PURE__ */ new Date()).toUTCString()};path=/`);
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
  web: () => new kn()
});
const Sn = async (t) => new Promise((e, n) => {
  const s = new FileReader();
  s.onload = () => {
    const i = s.result;
    e(i.indexOf(",") >= 0 ? i.split(",")[1] : i);
  }, s.onerror = (i) => n(i), s.readAsDataURL(t);
}), En = (t = {}) => {
  const e = Object.keys(t);
  return Object.keys(t).map((i) => i.toLocaleLowerCase()).reduce((i, a, o) => (i[a] = t[e[o]], i), {});
}, Ln = (t, e = !0) => t ? Object.entries(t).reduce((s, i) => {
  const [a, o] = i;
  let c, d;
  return Array.isArray(o) ? (d = "", o.forEach((u) => {
    c = e ? encodeURIComponent(u) : u, d += `${a}=${c}&`;
  }), d.slice(0, -1)) : (c = e ? encodeURIComponent(o) : o, d = `${a}=${c}`), `${s}&${d}`;
}, "").substr(1) : null, Gt = (t, e = {}) => {
  const n = Object.assign({ method: t.method || "GET", headers: t.headers }, e), i = En(t.headers)["content-type"] || "";
  if (typeof t.data == "string")
    n.body = t.data;
  else if (i.includes("application/x-www-form-urlencoded")) {
    const a = new URLSearchParams();
    for (const [o, c] of Object.entries(t.data || {}))
      a.set(o, c);
    n.body = a.toString();
  } else if (i.includes("multipart/form-data") || t.data instanceof FormData) {
    const a = new FormData();
    if (t.data instanceof FormData)
      t.data.forEach((c, d) => {
        a.append(d, c);
      });
    else
      for (const c of Object.keys(t.data))
        a.append(c, t.data[c]);
    n.body = a;
    const o = new Headers(n.headers);
    o.delete("content-type"), n.headers = o;
  } else (i.includes("application/json") || typeof t.data == "object") && (n.body = JSON.stringify(t.data));
  return n;
};
class Cn extends ie {
  /**
   * Perform an Http request given a set of options
   * @param options Options to build the HTTP request
   */
  async request(e) {
    const n = Gt(e, e.webFetchExtra), s = Ln(e.params, e.shouldEncodeUrlParams), i = s ? `${e.url}?${s}` : e.url, a = await fetch(i, n), o = a.headers.get("content-type") || "";
    let { responseType: c = "text" } = a.ok ? e : {};
    o.includes("application/json") && (c = "json");
    let d, u;
    switch (c) {
      case "arraybuffer":
      case "blob":
        u = await a.blob(), d = await Sn(u);
        break;
      case "json":
        d = await a.json();
        break;
      case "document":
      case "text":
      default:
        d = await a.text();
    }
    const h = {};
    return a.headers.forEach((p, g) => {
      h[g] = p;
    }), {
      data: d,
      headers: h,
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
  web: () => new Cn()
});
var At;
(function(t) {
  t.Dark = "DARK", t.Light = "LIGHT", t.Default = "DEFAULT";
})(At || (At = {}));
var Mt;
(function(t) {
  t.StatusBar = "StatusBar", t.NavigationBar = "NavigationBar";
})(Mt || (Mt = {}));
class Pn extends ie {
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
  web: () => new Pn()
});
function $n(t) {
  return new DataView(Uint8Array.from(t).buffer);
}
function Dn(t) {
  return Array.from(new Uint8Array(t.buffer, t.byteOffset, t.byteLength));
}
function On(t) {
  return `0000${t.toString(16).padStart(4, "0")}-0000-1000-8000-00805f9b34fb`;
}
function Ce(t) {
  const e = [];
  let n, s, i = 1, a = 0;
  for (n = 0; n < t.length; n++)
    s = t.charCodeAt(n), (s > 47 && s < 58 || s > 64 && s < 71 || s > 96 && s < 103) && (a = a << 4 ^ (s > 64 ? s + 9 : s) & 15, (i ^= 1) && e.push(a & 255));
  return $n(e);
}
function Pe(t) {
  return Dn(t).map((e) => {
    let n = e.toString(16);
    return n.length == 1 && (n = "0" + n), n;
  }).join("");
}
function Tn(t) {
  if (typeof t == "string")
    return t;
  if (typeof t == "number")
    return On(t);
  throw new Error("Invalid UUID");
}
function _t(t) {
  const e = {};
  if (t)
    return t.forEach((n, s) => {
      e[s.toString()] = n;
    }), e;
}
function Rt(t) {
  if (t !== void 0) {
    if (typeof t == "string") {
      const e = Ce(t);
      return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
    }
    return t instanceof DataView ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength) : t;
  }
}
function Re(t) {
  if (t !== void 0)
    return t instanceof DataView ? Pe(t) : Pe(new DataView(t.buffer, t.byteOffset, t.byteLength));
}
function et(t) {
  if (typeof SharedArrayBuffer < "u" && t.buffer instanceof SharedArrayBuffer) {
    const n = new Uint8Array(t.buffer, t.byteOffset, t.byteLength).slice().buffer;
    return new DataView(n);
  }
  return t;
}
const v = se("BluetoothLe", {
  web: () => Promise.resolve().then(() => ys).then((t) => new t.BluetoothLeWeb())
}), An = () => {
  let t = Promise.resolve();
  return (e) => new Promise((n, s) => {
    t = t.then(() => e()).then(n).catch(s);
  });
};
function tt(t) {
  return t ? An() : (e) => e();
}
function P(t) {
  if (typeof t != "string")
    throw new Error(`Invalid UUID type ${typeof t}. Expected string.`);
  if (t = t.toLowerCase(), !(t.search(/^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/) >= 0))
    throw new Error(`Invalid UUID format ${t}. Expected 128 bit string (e.g. "0000180d-0000-1000-8000-00805f9b34fb").`);
  return t;
}
class Mn {
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
      var n;
      const s = "onEnabledChanged";
      await ((n = this.eventListeners.get(s)) === null || n === void 0 ? void 0 : n.remove());
      const i = await v.addListener(s, (a) => {
        e(a.value);
      });
      this.eventListeners.set(s, i), await v.startEnabledNotifications();
    });
  }
  async stopEnabledNotifications() {
    await this.queue(async () => {
      var e;
      const n = "onEnabledChanged";
      await ((e = this.eventListeners.get(n)) === null || e === void 0 ? void 0 : e.remove()), this.eventListeners.delete(n), await v.stopEnabledNotifications();
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
  async requestLEScan(e, n) {
    e = this.validateRequestBleDeviceOptions(e), await this.queue(async () => {
      var s;
      await ((s = this.scanListener) === null || s === void 0 ? void 0 : s.remove()), this.scanListener = await v.addListener("onScanResult", (i) => {
        const a = Object.assign(Object.assign({}, i), { manufacturerData: this.convertObject(i.manufacturerData), serviceData: this.convertObject(i.serviceData), rawAdvertisement: i.rawAdvertisement ? this.convertValue(i.rawAdvertisement) : void 0 });
        n(a);
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
  async connect(e, n, s) {
    await this.queue(async () => {
      var i;
      if (n) {
        const a = `disconnected|${e}`;
        await ((i = this.eventListeners.get(a)) === null || i === void 0 ? void 0 : i.remove());
        const o = await v.addListener(a, () => {
          n(e);
        });
        this.eventListeners.set(a, o);
      }
      await v.connect(Object.assign({ deviceId: e }, s));
    });
  }
  async createBond(e, n) {
    await this.queue(async () => {
      await v.createBond(Object.assign({ deviceId: e }, n));
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
  async requestConnectionPriority(e, n) {
    await this.queue(async () => {
      await v.requestConnectionPriority({ deviceId: e, connectionPriority: n });
    });
  }
  async readRssi(e) {
    return await this.queue(async () => {
      const s = await v.readRssi({ deviceId: e });
      return parseFloat(s.value);
    });
  }
  async read(e, n, s, i) {
    return n = P(n), s = P(s), await this.queue(async () => {
      const o = await v.read(Object.assign({
        deviceId: e,
        service: n,
        characteristic: s
      }, i));
      return this.convertValue(o.value);
    });
  }
  async write(e, n, s, i, a) {
    return n = P(n), s = P(s), this.queue(async () => {
      if (!i?.buffer)
        throw new Error("Invalid data.");
      let o = i;
      B.getPlatform() !== "web" && (o = Pe(i)), await v.write(Object.assign({
        deviceId: e,
        service: n,
        characteristic: s,
        value: o
      }, a));
    });
  }
  async writeWithoutResponse(e, n, s, i, a) {
    n = P(n), s = P(s), await this.queue(async () => {
      if (!i?.buffer)
        throw new Error("Invalid data.");
      let o = i;
      B.getPlatform() !== "web" && (o = Pe(i)), await v.writeWithoutResponse(Object.assign({
        deviceId: e,
        service: n,
        characteristic: s,
        value: o
      }, a));
    });
  }
  async readDescriptor(e, n, s, i, a) {
    return n = P(n), s = P(s), i = P(i), await this.queue(async () => {
      const c = await v.readDescriptor(Object.assign({
        deviceId: e,
        service: n,
        characteristic: s,
        descriptor: i
      }, a));
      return this.convertValue(c.value);
    });
  }
  async writeDescriptor(e, n, s, i, a, o) {
    return n = P(n), s = P(s), i = P(i), this.queue(async () => {
      if (!a?.buffer)
        throw new Error("Invalid data.");
      let c = a;
      B.getPlatform() !== "web" && (c = Pe(a)), await v.writeDescriptor(Object.assign({
        deviceId: e,
        service: n,
        characteristic: s,
        descriptor: i,
        value: c
      }, o));
    });
  }
  async startNotifications(e, n, s, i, a) {
    n = P(n), s = P(s), await this.queue(async () => {
      var o;
      const c = `notification|${e}|${n}|${s}`;
      await ((o = this.eventListeners.get(c)) === null || o === void 0 ? void 0 : o.remove());
      const d = await v.addListener(c, (u) => {
        i(this.convertValue(u?.value));
      });
      this.eventListeners.set(c, d), await v.startNotifications(Object.assign({
        deviceId: e,
        service: n,
        characteristic: s
      }, a));
    });
  }
  async stopNotifications(e, n, s) {
    n = P(n), s = P(s), await this.queue(async () => {
      var i;
      const a = `notification|${e}|${n}|${s}`;
      await ((i = this.eventListeners.get(a)) === null || i === void 0 ? void 0 : i.remove()), this.eventListeners.delete(a), await v.stopNotifications({
        deviceId: e,
        service: n,
        characteristic: s
      });
    });
  }
  validateRequestBleDeviceOptions(e) {
    return e = Object.assign({}, e), e.services && (e.services = e.services.map(P)), e.optionalServices && (e.optionalServices = e.optionalServices.map(P)), e.serviceData && B.getPlatform() !== "web" && (e.serviceData = e.serviceData.map((n) => Object.assign(Object.assign({}, n), { serviceUuid: P(n.serviceUuid), dataPrefix: Re(n.dataPrefix), mask: Re(n.mask) }))), e.manufacturerData && (B.getPlatform() !== "web" ? e.manufacturerData = e.manufacturerData.map((n) => Object.assign(Object.assign({}, n), { dataPrefix: Re(n.dataPrefix), mask: Re(n.mask) })) : e.manufacturerData = e.manufacturerData.map((n) => Object.assign(Object.assign({}, n), { dataPrefix: Rt(n.dataPrefix), mask: Rt(n.mask) }))), e;
  }
  convertValue(e) {
    return typeof e == "string" ? Ce(e) : e === void 0 ? new DataView(new ArrayBuffer(0)) : e;
  }
  convertObject(e) {
    if (e === void 0)
      return;
    const n = {};
    for (const s of Object.keys(e))
      n[s] = this.convertValue(e[s]);
    return n;
  }
}
const pe = new Mn(), nt = 256, st = 10, _n = 4e3;
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
    e !== this.status && (this.status = e, this.statusFns.forEach((n) => n(e)));
  }
  emitRaw(e) {
    this.lastRaw = e;
    const n = { t: Date.now(), kg: e - this.tareKg };
    this.setStatus("live"), this.sampleFns.forEach((s) => s(n)), this.lostTimer && clearTimeout(this.lostTimer), this.lostTimer = setTimeout(() => this.setStatus("lost"), _n);
  }
  clearLost() {
    this.lostTimer && clearTimeout(this.lostTimer), this.lostTimer = null;
  }
}
function It(t) {
  let e = "";
  for (let n = 0; n < t.byteLength; n++) e += t.getUint8(n).toString(16).padStart(2, "0") + " ";
  return e.trim();
}
function Ft(t, e) {
  let n = 0;
  for (; n < t.byteLength; ) {
    const s = t.getUint8(n);
    if (!s) break;
    if (t.getUint8(n + 1) === 255 && s >= 3) {
      const a = t.getUint8(n + 2) | t.getUint8(n + 3) << 8;
      if (e === void 0 || a === e) return new DataView(t.buffer, t.byteOffset + n + 4, s - 3);
    }
    n += s + 1;
  }
}
function Rn(t) {
  return t.byteLength < st + 2 ? null : (t.getUint8(st) << 8 | t.getUint8(st + 1)) / 100;
}
class $e extends Yt {
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
        const n = e.localName ?? e.device.name ?? "", s = e.manufacturerData ?? {}, i = Object.keys(s);
        let a = s[String(nt)] ?? s[nt.toString(16)];
        !a && /^(IF_|WH-|WEIHENG)/i.test(n) && i.length && (a = s[i[0]]), !a && e.rawAdvertisement && (a = Ft(e.rawAdvertisement, nt) ?? (/^IF_/i.test(n) ? Ft(e.rawAdvertisement) : void 0));
        const o = a ? Rn(a) : null, c = { id: e.device.deviceId, name: n, rssi: e.rssi ?? 0, keys: i.join(","), hex: a ? It(a) : e.rawAdvertisement ? It(e.rawAdvertisement).slice(0, 60) : "", kg: o, t: Date.now() };
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
class In extends Yt {
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
    const n = (Math.random() - 0.5) * Math.max(0.3, this.current * 0.03), s = Math.max(0, Math.round((this.current + n) * 100) / 100);
    this.emitRaw(s);
  }
}
const Fn = { both: "", left: "Left", right: "Right" }, Bn = { complete: "", concentric: "Concentric", eccentric: "Eccentric" };
function xe(t, e, n, s, i, a) {
  const o = [s?.trim() ?? "", Fn[e] ?? "", Bn[n ?? "complete"] ?? "", (i ?? 0) > 1 ? `${i} links` : "", a ? `+${a} kg` : ""].filter(Boolean);
  return o.length ? `${t} — ${o.join(", ")}` : t;
}
function we(t, e, n, s, i, a) {
  const o = n ?? "complete", c = s?.trim() ?? "", d = (i ?? 0) > 1 ? i : 0, u = a ?? 0;
  let h = o === "complete" && !c && !d && !u ? `${t}|${e}` : `${t}|${e}|${o}`;
  return (c || d || u) && (h += `|${c}`), (d || u) && (h += `|${d}L`), u && (h += `|${u}E`), h;
}
function Jt(t, e, n, s, i, a, o) {
  return t.exercise === e && t.side === n && (t.contraction ?? "complete") === (s ?? "complete") && (t.handle ?? "") === (i?.trim() ?? "") && Math.max(1, t.links ?? 1) === Math.max(1, a ?? 1) && (t.extKg ?? 0) === (o ?? 0);
}
function ye(t) {
  return t.manualReps && t.manualReps > 0 ? Math.round(t.manualReps) : 1;
}
function fe(t) {
  return t.performedAt ?? t.startedAt;
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
    for (const n of this.samples) n.kg > e && (e = n.kg);
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
    const n = this.samples;
    if (n.length < 3) return null;
    const s = Xt(n);
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
      durationS: n[n.length - 1].t,
      samples: n,
      ...s,
      reps: xt(n)
    };
  }
}
function Xt(t) {
  let e = 0, n = 0, s = 0;
  for (let c = 0; c < t.length; c++) {
    const d = Math.max(0, t[c].kg);
    e = Math.max(e, d), n += d, c > 0 && (s += d * (t[c].t - t[c - 1].t));
  }
  const i = n / t.length, a = t.filter((c) => c.kg > Ne);
  let o = 0;
  if (a.length >= 10) {
    const c = Math.max(3, Math.floor(a.length * 0.2)), d = Math.max(...a.slice(0, c).map((h) => h.kg)), u = Math.max(...a.slice(-c).map((h) => h.kg));
    o = d > 0 ? Math.max(0, (d - u) / d * 100) : 0;
  }
  return { peak: F(e), avg: F(i), output: F(s), inroad: F(o) };
}
function xt(t) {
  if (t.length < 5) return [];
  const e = Math.max(...t.map((u) => u.kg));
  if (e < Ne * 2) return [];
  const n = Math.max(Ne, e * 0.35), s = Math.max(Ne * 0.5, e * 0.2), i = [];
  let a = !1, o = 0, c = 0, d = 0;
  for (const u of t)
    !a && u.kg >= n ? (a = !0, o = u.t, c = u.kg, d = u.t) : a && (u.kg > c && (c = u.kg, d = u.t), u.kg <= s && (u.t - o >= 0.6 && i.push({ index: i.length + 1, peak: F(c), peakT: F(d), startS: F(o), endS: F(u.t), durationS: F(u.t - o) }), a = !1));
  if (a) {
    const u = t[t.length - 1].t;
    u - o >= 0.6 && i.push({ index: i.length + 1, peak: F(c), peakT: F(d), startS: F(o), endS: F(u), durationS: F(u - o) });
  }
  return i.length >= 2 ? i : [];
}
function Nn(t) {
  if (t.length < 6) return null;
  const e = t.slice(-Math.max(3, Math.floor(t.length / 3)));
  return F(e.reduce((n, s) => n + s.peak, 0) / e.length);
}
function F(t) {
  return Math.round(t * 100) / 100;
}
class Zt {
  constructor(e) {
    this.canvas = e, this.dpr = Math.max(1, window.devicePixelRatio || 1), this.opts = { windowS: 60, zone: null, ghost: null, marks: [] }, this.last = null, this.ctx = e.getContext("2d"), this.resize(), new ResizeObserver(() => this.resize()).observe(e.parentElement ?? e);
  }
  resize() {
    const n = (this.canvas.parentElement ?? this.canvas).clientWidth || 320, s = Math.max(220, Math.min(380, Math.round(n * 0.6)));
    this.canvas.width = n * this.dpr, this.canvas.height = s * this.dpr, this.canvas.style.width = `${n}px`, this.canvas.style.height = `${s}px`, this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0), this.last && this.render(...this.last);
  }
  draw(e, n, s) {
    this.last = [e, n, s], this.render(e, n, s);
  }
  render(e, n, s) {
    const { ctx: i } = this, a = this.canvas.width / this.dpr, o = this.canvas.height / this.dpr, c = 42, d = 12, u = 12, h = 24, p = a - c - d, g = o - u - h, l = getComputedStyle(document.getElementById("view-force") ?? document.documentElement), f = l.getPropertyValue("--muted").trim() || "#888", y = l.getPropertyValue("--grid").trim() || "#333", b = l.getPropertyValue("--accent").trim() || "#e8552f", w = l.getPropertyValue("--ghost").trim() || "#7a7a7a", A = l.getPropertyValue("--zone").trim() || "rgba(60,180,90,0.18)";
    i.clearRect(0, 0, a, o);
    const j = Math.max(this.opts.windowS, Math.ceil(n / 10) * 10 || 10), V = this.opts.ghost ?? [];
    let U = 10;
    for (const m of e) U = Math.max(U, m.kg);
    for (const m of V) U = Math.max(U, m.kg);
    this.opts.zone && (U = Math.max(U, this.opts.zone.hi)), U = jn(U * 1.1);
    const q = (m) => c + m / j * p, M = (m) => u + g - Math.max(0, m) / U * g;
    if (this.opts.zone) {
      i.fillStyle = A;
      const m = M(this.opts.zone.hi), S = M(this.opts.zone.lo);
      i.fillRect(c, m, p, S - m);
    }
    i.strokeStyle = y, i.lineWidth = 1, i.fillStyle = f, i.font = "11px system-ui, sans-serif", i.textAlign = "right", i.textBaseline = "middle";
    const $ = 5;
    for (let m = 0; m <= $; m++) {
      const S = U / $ * m, C = M(S);
      i.beginPath(), i.moveTo(c, C), i.lineTo(a - d, C), i.stroke(), i.fillText(S.toFixed(0), c - 6, C);
    }
    i.textAlign = "center", i.textBaseline = "top";
    const _ = j <= 30 ? 5 : j <= 90 ? 10 : 30;
    for (let m = 0; m <= j; m += _) {
      const S = q(m);
      i.beginPath(), i.moveTo(S, u), i.lineTo(S, u + g), i.stroke(), i.fillText(Un(m), S, u + g + 6);
    }
    if (this.opts.marks?.length) {
      i.strokeStyle = w, i.setLineDash([3, 4]);
      for (const m of this.opts.marks)
        i.beginPath(), i.moveTo(q(m), u), i.lineTo(q(m), u + g), i.stroke();
      i.setLineDash([]);
    }
    if (V.length > 1 && (i.strokeStyle = w, i.lineWidth = 1.5, i.globalAlpha = 0.55, i.beginPath(), V.forEach((m, S) => S ? i.lineTo(q(m.t), M(m.kg)) : i.moveTo(q(m.t), M(m.kg))), i.stroke(), i.globalAlpha = 1), e.length > 1) {
      i.strokeStyle = b, i.lineWidth = 2.5, i.lineJoin = "round", i.beginPath(), e.forEach((C, E) => E ? i.lineTo(q(C.t), M(C.kg)) : i.moveTo(q(C.t), M(C.kg))), i.stroke();
      const m = e[e.length - 1];
      i.lineTo(q(m.t), M(0)), i.lineTo(q(e[0].t), M(0)), i.closePath(), i.fillStyle = b, i.globalAlpha = 0.12, i.fill(), i.globalAlpha = 1;
      const S = this.opts.peaks ?? [];
      if (S.length) {
        const C = Math.max(...S.map((E) => E.kg));
        i.font = "bold 11px system-ui, sans-serif", i.textAlign = "center", i.textBaseline = "bottom";
        for (const E of S) {
          const le = q(E.t), ue = M(E.kg);
          i.fillStyle = E.kg === C ? b : "#ecebe6", i.beginPath(), i.arc(le, ue, 3.5, 0, Math.PI * 2), i.fill();
          const Lt = E.kg.toFixed(0), _e = i.measureText(Lt).width + 8, Ct = Math.min(Math.max(le, c + _e / 2), c + p - _e / 2), Pt = Math.max(u + 14, ue - 6);
          i.fillStyle = E.kg === C ? b : "rgba(40,42,48,0.92)", i.fillRect(Ct - _e / 2, Pt - 14, _e, 14), i.fillStyle = "#fff", i.fillText(Lt, Ct, Pt - 1);
        }
        i.textAlign = "left", i.textBaseline = "alphabetic";
      }
      i.fillStyle = b, i.beginPath(), i.arc(q(m.t), M(m.kg), 4, 0, Math.PI * 2), i.fill();
    } else s > 0 && (i.fillStyle = b, i.beginPath(), i.arc(q(0), M(s), 4, 0, Math.PI * 2), i.fill());
  }
}
function jn(t) {
  const e = [10, 20, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500];
  for (const n of e) if (t <= n) return n;
  return Math.ceil(t / 100) * 100;
}
function Un(t) {
  const e = Math.floor(t / 60), n = t % 60;
  return `${e}:${n.toString().padStart(2, "0")}`;
}
function Je(t, e = {}) {
  const n = e.hold ?? 10, s = e.rest ?? 20, i = e.reps ?? 6, a = e.ramp ?? 5, o = e.total ?? 60;
  switch (t) {
    case "free":
      return { id: t, label: "Free set", describe: "Open-ended. Start, work, stop.", phases: [] };
    case "countdown":
      return {
        id: t,
        label: `Countdown ${o}s`,
        describe: "One continuous max effort for the whole timer — the ARX protocol.",
        phases: [{ name: "Get ready", seconds: 3, cue: "rest" }, { name: "GO — max effort", seconds: o, cue: "work" }]
      };
    case "ramp":
      return {
        id: t,
        label: `Ramp ${a}s + hold ${n}s`,
        describe: "Build to max over the ramp, then hold it. Joint-friendly way to reach peak force.",
        phases: [
          { name: "Get ready", seconds: 3, cue: "rest" },
          { name: "Build up", seconds: a, cue: "ramp" },
          { name: "HOLD", seconds: n, cue: "work" },
          { name: "Release", seconds: 3, cue: "rest" }
        ]
      };
    case "repeaters":
      return {
        id: t,
        label: `Repeaters ${i}×(${n}s on/${s}s off)`,
        describe: "Repeated holds. Per-rep peaks give the fatigue curve; long sets give critical force.",
        phases: [{ name: "Get ready", seconds: 3, cue: "rest" }, { name: "PULL", seconds: n, cue: "work" }, { name: "Rest", seconds: s, cue: "rest" }],
        repeat: i
      };
    case "maxtest":
      return {
        id: t,
        label: "Max test (3 efforts)",
        describe: "Three 5-second max efforts with 60s rest. Best one becomes your max.",
        phases: [{ name: "Get ready", seconds: 5, cue: "rest" }, { name: "MAX EFFORT", seconds: 5, cue: "work" }, { name: "Rest", seconds: 60, cue: "rest" }],
        repeat: 3
      };
    case "critical":
      return {
        id: t,
        label: "Critical force (7s/3s ×24)",
        describe: "7s on, 3s off, 24 reps. The plateau at the end is the force you can sustain.",
        phases: [{ name: "Get ready", seconds: 3, cue: "rest" }, { name: "PULL", seconds: 7, cue: "work" }, { name: "Off", seconds: 3, cue: "rest" }],
        repeat: 24
      };
    default:
      return Je("free");
  }
}
function Qt(t) {
  if (!t.repeat || t.phases.length < 2) return t.phases;
  const [e, ...n] = t.phases, s = [e];
  for (let i = 0; i < t.repeat; i++)
    for (const a of n)
      i === t.repeat - 1 && a === n[n.length - 1] && a.cue === "rest" || s.push({ ...a, name: n.length > 1 && a.cue !== "rest" ? `${a.name} ${i + 1}/${t.repeat}` : a.name });
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
    this.timeline = Qt(e), this.idx = -1, this.running = !0, this.next(), this.timer = setInterval(() => this.tick(), 100);
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
    const n = e.seconds - (Date.now() - this.phaseStart) / 1e3;
    n <= 0 ? this.next() : this.onTick(n, e);
  }
}
var Bt;
(function(t) {
  t[t.Flush = 0] = "Flush", t[t.Add = 1] = "Add";
})(Bt || (Bt = {}));
const Ie = se("TextToSpeech", {
  web: () => Promise.resolve().then(() => xs).then((t) => new t.TextToSpeechWeb())
}), Fe = B.isNativePlatform();
let it = null;
function Hn() {
  return it || (it = new (window.AudioContext || window.webkitAudioContext)()), it;
}
function ae(t = 880, e = 120, n = 0.25) {
  try {
    const s = Hn(), i = s.createOscillator(), a = s.createGain();
    i.frequency.value = t, i.type = "sine", a.gain.value = n, i.connect(a), a.connect(s.destination), i.start(), a.gain.exponentialRampToValueAtTime(1e-4, s.currentTime + e / 1e3), i.stop(s.currentTime + e / 1e3);
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
        const n = speechSynthesis.getVoices();
        this.voice = n.find((s) => /^en/i.test(s.lang) && /google|english/i.test(s.name)) ?? n.find((s) => /^en/i.test(s.lang)) ?? null;
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
  say(e, n = !1, s = !1) {
    if (!this.enabled) return;
    if (this.onSpeak(e), Fe) {
      if (this.nativeBusy && !n) return;
      this.nativeBusy = !0, (n ? Ie.stop().catch(() => {
      }) : Promise.resolve()).then(() => Ie.speak({ text: e, lang: "en-US", rate: this.rate, pitch: this.pitch, volume: 1, category: "ambient" })).catch(() => {
      }).finally(() => {
        this.nativeBusy = !1;
      });
      return;
    }
    if (!("speechSynthesis" in window)) return;
    const i = Date.now();
    if (!(!n && !s && (i - this.lastSpoke < 1800 || e === this.lastText)))
      try {
        n && speechSynthesis.cancel(), speechSynthesis.resume();
        const a = new SpeechSynthesisUtterance(e);
        a.rate = this.rate, a.pitch = this.pitch, a.lang = "en-US", this.voice && (a.voice = this.voice), this.keep.push(a), this.keep.length > 8 && this.keep.shift(), a.onend = () => {
          const o = this.keep.indexOf(a);
          o >= 0 && this.keep.splice(o, 1);
        }, speechSynthesis.speak(a), this.lastSpoke = i, this.lastText = e;
      } catch {
      }
  }
}
function zn(t) {
  const e = Math.floor(t / 60), n = t % 60;
  return n === 0 && e > 0 ? e === 1 ? "1 minute" : `${e} minutes` : String(n);
}
const qt = se("KeepAwake", {
  web: () => Promise.resolve().then(() => Ss).then((t) => new t.KeepAwakeWeb())
}), en = se("Preferences", {
  web: () => Promise.resolve().then(() => Ls).then((t) => new t.PreferencesWeb())
}), ke = "ufl.sets.v1", Be = "ufl.max.v1", at = "ufl.exercises.v1", tn = [
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
function Kn(t) {
  return /^SR\b|self.?resisted/i.test(t) ? "self-resisted" : "iso";
}
async function rt(t, e) {
  try {
    const n = B.isNativePlatform() ? (await en.get({ key: t })).value : localStorage.getItem(t);
    return n ? JSON.parse(n) : e;
  } catch {
    return e;
  }
}
async function ee(t, e) {
  const n = JSON.stringify(e);
  B.isNativePlatform() ? await en.set({ key: t, value: n }) : localStorage.setItem(t, n);
}
const T = {
  async sets() {
    return rt(ke, []);
  },
  async saveSet(t) {
    const e = await this.sets();
    e.push(t), await ee(ke, e.slice(-500));
  },
  async updateSet(t) {
    const e = await this.sets(), n = e.findIndex((s) => s.id === t.id);
    n >= 0 ? e[n] = t : e.push(t), await ee(ke, e);
  },
  async deleteSet(t) {
    const e = await this.sets();
    await ee(ke, e.filter((n) => n.id !== t));
  },
  async maxes() {
    return rt(Be, {});
  },
  async setMax(t, e) {
    const n = await this.maxes();
    n[t] = { kg: e, at: Date.now() }, await ee(Be, n);
  },
  async deleteMax(t) {
    const e = await this.maxes();
    delete e[t], await ee(Be, e);
  },
  async exercises() {
    return rt(at, tn);
  },
  /** Rename an exercise in every stored set and max (and the local list). */
  async renameExercise(t, e) {
    const n = await this.sets();
    for (const o of n) o.exercise === t && (o.exercise = e);
    await ee(ke, n);
    const s = await this.maxes(), i = {};
    for (const [o, c] of Object.entries(s)) {
      const [d, ...u] = o.split("|"), h = [d === t ? e : d, ...u].join("|");
      (!i[h] || i[h].kg < c.kg) && (i[h] = c);
    }
    await ee(Be, i);
    const a = await this.exercises();
    if (a.includes(t)) {
      const o = a.map((c) => c === t ? e : c);
      await ee(at, [...new Set(o)]);
    }
  },
  async saveExercises(t) {
    await ee(at, t);
  }
};
function Gn(t) {
  t.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, n) {
        return new Proxy({}, {
          get(s, i) {
            return (a, o, c) => {
              const d = t.Capacitor.Plugins[n];
              if (d === void 0) {
                c(new Error(`Capacitor plugin ${n} not found`));
                return;
              }
              if (typeof d[i] != "function") {
                c(new Error(`Method ${i} not found in Capacitor plugin ${n}`));
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
function Yn(t) {
  t.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, n) {
        return t.cordova.plugins[n];
      }
    }
  );
}
function Jn(t = !1) {
  typeof window > "u" || (window.CapacitorUtils = window.CapacitorUtils || {}, window.Capacitor !== void 0 && !t ? Gn(window) : window.cordova !== void 0 && Yn(window));
}
var ft;
(function(t) {
  t.Documents = "DOCUMENTS", t.Data = "DATA", t.Library = "LIBRARY", t.Cache = "CACHE", t.External = "EXTERNAL", t.ExternalStorage = "EXTERNAL_STORAGE", t.ExternalCache = "EXTERNAL_CACHE", t.LibraryNoCloud = "LIBRARY_NO_CLOUD", t.Temporary = "TEMPORARY";
})(ft || (ft = {}));
var He;
(function(t) {
  t.UTF8 = "utf8", t.ASCII = "ascii", t.UTF16 = "utf16";
})(He || (He = {}));
const Xn = se("Filesystem", {
  web: () => Promise.resolve().then(() => Ps).then((t) => new t.FilesystemWeb())
});
Jn();
const Zn = se("Share", {
  web: () => Promise.resolve().then(() => Ds).then((t) => new t.ShareWeb())
});
function Qn(t) {
  const e = ["id", "date_performed", "recorded_at", "exercise", "side", "contraction", "handle", "links", "external_kg", "mode", "duration_s", "peak_kg", "avg_kg", "output_kgs", "inroad_pct", "reps", "auto_reps", "rep_peaks"], n = t.map((s) => [
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
    ye(s),
    s.reps?.length ?? 0,
    ot((s.reps ?? []).map((i) => i.peak).join(" "))
  ].join(","));
  return [e.join(","), ...n].join(`
`);
}
function es(t) {
  return ["t_s,kg", ...t.samples.map((e) => `${e.t.toFixed(2)},${e.kg.toFixed(2)}`)].join(`
`);
}
function ot(t) {
  return `"${t.replace(/"/g, '""')}"`;
}
async function pt(t, e, n) {
  if (B.isNativePlatform()) {
    const o = await Xn.writeFile({ path: t, data: e, directory: ft.Cache, encoding: He.UTF8 });
    await Zn.share({ title: t, files: [o.uri] });
    return;
  }
  const s = new Blob([e], { type: n }), i = URL.createObjectURL(s), a = document.createElement("a");
  a.href = i, a.download = t, document.body.appendChild(a), a.click(), setTimeout(() => {
    URL.revokeObjectURL(i), a.remove();
  }, 500);
}
function Te(t) {
  const e = new Date(t);
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
function nn(t) {
  return {
    id: `fl-${t.id}`,
    date: Te(fe(t)),
    exercise: xe(t.exercise, t.side, t.contraction, t.handle, t.links, t.extKg),
    kg: t.peak,
    reps: ye(t),
    variation: Kn(t.exercise),
    at: t.startedAt,
    dur: t.durationS,
    note: [t.extKg ? `external load ${t.extKg} kg` : "", t.mode, t.note].filter(Boolean).join(" · ")
  };
}
function ns() {
  const t = G();
  if (t)
    for (const e of tn) t.addExercise(e);
}
let W = null;
const sn = /* @__PURE__ */ new Map();
function ss(t) {
  sn.get(t)?.();
}
function de(t) {
  return t.replace(/[&<>"']/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[e]);
}
function ct(t, e) {
  t.classList.add("picker-hidden");
  const n = document.createElement("button");
  n.type = "button", n.className = "picker-btn", t.insertAdjacentElement("afterend", n);
  const s = () => {
    const i = t.value;
    n.textContent = i || (e.allOption?.label ?? "Choose…"), n.disabled = t.disabled;
  };
  return s(), new MutationObserver(s).observe(t, { attributes: !0, childList: !0 }), t.addEventListener("change", s), n.onclick = () => Nt(t, e, s), sn.set(t, () => Nt(t, e, s)), s;
}
function Nt(t, e, n) {
  Se();
  const s = document.getElementById("view-force") ?? document.body;
  W = document.createElement("div"), W.className = "picker-overlay", W.innerHTML = `<div class="picker-panel">
    <div class="picker-head"><input type="text" class="picker-search" placeholder="Search exercises…" autocomplete="off" /><button type="button" class="sm ghost picker-close">✕</button></div>
    <div class="picker-list"></div>
  </div>`, s.appendChild(W);
  const i = W.querySelector(".picker-search"), a = W.querySelector(".picker-list"), o = (d) => {
    t.value = d, t.dispatchEvent(new Event("change", { bubbles: !0 })), n(), Se();
  }, c = () => {
    const d = i.value.trim().toLowerCase(), u = e.recent().filter((l) => !d || l.toLowerCase().includes(d)), h = e.all().filter((l) => !u.includes(l) && (!d || l.toLowerCase().includes(d))).sort((l, f) => l.localeCompare(f));
    let p = "";
    e.allOption && (!d || e.allOption.label.toLowerCase().includes(d)) && (p += `<button type="button" class="picker-item" data-v="${de(e.allOption.value)}">${de(e.allOption.label)}</button>`), u.length && (p += '<div class="picker-group">Recent in Force Lab</div>' + u.map((l) => `<button type="button" class="picker-item" data-v="${de(l)}">${de(l)}</button>`).join("")), h.length && (p += `<div class="picker-group">${u.length ? "All exercises" : "Exercises"}</div>` + h.map((l) => `<button type="button" class="picker-item" data-v="${de(l)}">${de(l)}</button>`).join(""));
    const g = i.value.trim();
    g && e.onCreate && !e.all().some((l) => l.toLowerCase() === g.toLowerCase()) && (p += `<button type="button" class="picker-item picker-create" data-create="1">+ Create "${de(g)}"</button>`), p || (p = '<div class="picker-group">No match</div>'), a.innerHTML = p, a.querySelectorAll(".picker-item").forEach((l) => {
      l.onclick = async () => {
        if (l.dataset.create) {
          const f = i.value.trim();
          await e.onCreate(f) && o(f);
          return;
        }
        o(l.dataset.v);
      };
    });
  };
  i.oninput = c, i.onkeydown = (d) => {
    d.key === "Escape" && Se(), d.key === "Enter" && a.querySelector(".picker-item")?.click();
  }, W.querySelector(".picker-close").onclick = Se, W.onclick = (d) => {
    d.target === W && Se();
  }, c(), setTimeout(() => i.focus(), 50);
}
function Se() {
  W?.remove(), W = null;
}
const r = (t) => document.getElementById(t);
let z = null, te = null, We = 0, x = [], N = [], re = null, oe = 0, Y = 0, ge = null, K = !0, De = localStorage.getItem("ufl.ghostOn") !== "0", qe = null;
const be = (t, e) => localStorage.getItem(t) ?? e;
let je = Math.max(1, Number(be("ufl.calloutEvery", "5"))), gt = be("ufl.calloutOn", "1") === "1", mt = be("ufl.secBeep", "0") === "1", vt = be("ufl.secCount", "0") === "1", Ue = null, lt = -1;
const k = new Wn(), I = new qn(), ne = new Vn(), H = new Zt(r("chart")), Ee = r("progressChart"), is = {
  countdown: [{ key: "total", label: "seconds", def: 60 }],
  ramp: [{ key: "ramp", label: "ramp s", def: 5 }, { key: "hold", label: "hold s", def: 10 }],
  repeaters: [{ key: "reps", label: "reps", def: 6 }, { key: "hold", label: "on s", def: 10 }, { key: "rest", label: "off s", def: 20 }]
};
function ze() {
  const t = r("handle").value;
  return t === "__custom" ? "" : t;
}
function Ae() {
  return Math.max(1, Math.floor(Number(r("links").value) || 1));
}
function Ke() {
  return Math.max(0, Math.round((Number(r("extKg").value) || 0) * 2) / 2);
}
function he() {
  const t = r("exercise").value || "Choose exercise", e = r("side").value, n = r("protocol").value, s = r("contraction").value;
  r("hdrExName").textContent = r("exercise").value ? xe(t, e, s, ze(), Ae(), Ke()) : t, r("hdrExMeta").textContent = n;
}
async function as(t, e) {
  const n = G();
  if (n) {
    if (!n.renameExercise(t, e)) return;
    x = n.exerciseNames();
  } else
    await an(t, e), x = await T.exercises();
  ce(), Z(), Q(), await D();
}
async function an(t, e) {
  await T.renameExercise(t, e), N = await T.sets(), r("exercise").value === t && (ce(), r("exercise").value = e);
}
async function rs() {
  ns(), x = G()?.exerciseNames() ?? await T.exercises(), N = await T.sets(), ce(), on(), await D(), Q(), Z(), ms(), gn(), k.enabled = r("voiceOn").checked;
}
function ut() {
  const t = /* @__PURE__ */ new Map();
  for (const e of N) t.set(e.exercise, Math.max(t.get(e.exercise) ?? 0, e.startedAt));
  for (const e of Object.keys(rn)) {
    const n = e.split("|")[0];
    t.has(n) || t.set(n, 0);
  }
  return [...t.entries()].filter(([e]) => x.includes(e)).sort((e, n) => n[1] - e[1]).map(([e]) => e);
}
let rn = {};
async function jt(t) {
  if (t = t.trim(), !t) return !1;
  if (!x.includes(t)) {
    const e = G();
    e ? (e.addExercise(t), x = e.exerciseNames()) : (x.push(t), await T.saveExercises(x));
  }
  return ce(), Z(), !0;
}
function ce() {
  setTimeout(he, 0);
  for (const n of ["exercise", "maxExercise"]) {
    const s = r(n), i = s.value;
    s.innerHTML = x.map((a) => `<option>${O(a)}</option>`).join(""), i && x.includes(i) && (s.value = i);
  }
  const t = r("histExercise"), e = t.value;
  t.innerHTML = '<option value="">All</option>' + x.map((n) => `<option>${O(n)}</option>`).join(""), t.value = e;
}
function on() {
  const t = r("protocol").value, e = r("params");
  e.innerHTML = (is[t] ?? []).map((n) => `<label>${n.label}<input type="number" data-k="${n.key}" value="${n.def}" min="1" /></label>`).join(""), r("protocolHelp").textContent = Je(t, kt()).describe;
}
function kt() {
  const t = {};
  return r("params").querySelectorAll("input").forEach((e) => t[e.dataset.k] = Number(e.value) || 1), t;
}
async function D() {
  const t = r("exercise").value, e = r("side").value, n = r("contraction").value, s = ze(), i = Ae(), a = Ke(), o = N.filter((h) => Jt(h, t, e, n, s, i, a));
  re = o.length ? o[o.length - 1] : null, oe = o.reduce((h, p) => Math.max(h, p.output), 0);
  const c = await T.maxes();
  rn = c;
  const d = o.reduce((h, p) => Math.max(h, p.peak), 0), u = r("zoneRef").value;
  if (Y = u === "last" ? re?.peak ?? 0 : u === "maxtest" ? c[we(t, e, n, s, i, a)]?.kg ?? 0 : Math.max(c[we(t, e, n, s, i, a)]?.kg ?? 0, d), !I.recording) {
    const h = o.reduce((p, g) => Math.max(p, g.peak), 0);
    r("sPeak").textContent = re ? L(re.peak) : "–", r("dPeak").innerHTML = re ? `<span class="muted">last · best ${L(h)} kg</span>` : '<span class="muted">no previous set</span>';
  }
  r("zoneMax").textContent = Y ? `(${u === "last" ? "last" : u === "maxtest" ? "max test" : "best"} ${Y.toFixed(1)} kg → ${Ve().lo.toFixed(1)}–${Ve().hi.toFixed(1)} kg)` : u === "maxtest" ? "(no Max test for this exercise yet)" : "(no previous set for this exercise yet)", r("sGoal").textContent = oe ? L(oe) : "–", H.opts.ghost = De ? re?.samples ?? null : null, H.opts.zone = St() ? Ve() : null, I.recording || (H.opts.marks = []);
}
function St() {
  return r("zoneOn").checked && Y > 0;
}
function Ve() {
  const t = Number(r("zoneLo").value) / 100 * Y, e = Number(r("zoneHi").value) / 100 * Y;
  return { lo: Math.min(t, e), hi: Math.max(t, e) };
}
async function wt(t) {
  z && await z.stop(), z = t, t.onStatus(Ge), t.onSample((e) => {
    We = e.kg, J === "live" && (r("statusKg").textContent = `${e.kg.toFixed(1)} kg`), I.push(e), os(e.kg);
  });
  try {
    await t.start(), r("btnTare").disabled = !1, r("btnStart").disabled = !1;
  } catch (e) {
    Ge("error"), r("statusText").textContent = e.message, alert("Connect failed: " + e.message);
  }
}
let J = "idle";
function cn() {
  return localStorage.getItem("ufl.keepAwake") !== "0";
}
function ln() {
  if (!B.isNativePlatform()) return;
  (cn() && (J === "live" || J === "scanning" || J === "lost") ? qt.keepAwake() : qt.allowSleep()).catch(() => {
  });
}
function Ge(t) {
  J = t, ln(), r("statusDot").className = `dot ${t}`, r("statusPill").className = `pill ${t}`;
  const e = {
    idle: "Not connected",
    scanning: "Listening…",
    live: "",
    lost: "Lost — retrying…",
    error: "Error"
  };
  r("statusText").textContent = e[t], t !== "live" && (r("statusKg").textContent = "");
  const n = r("btnConnect");
  n.textContent = t === "live" || t === "scanning" ? "Disconnect" : "Connect scale";
}
function un() {
  return localStorage.getItem("ufl.autoConnect") !== "0";
}
let Ye = !1, yt = !1, dt = !1;
function bt() {
  if (!un() || !B.isNativePlatform() || z instanceof $e || te || yt || Ye && J === "error") return;
  Ye = !0;
  const t = new $e();
  t.onSeen = () => vn(t), r("simPanel").classList.add("hidden"), wt(t);
}
let Ut = 0;
function os(t) {
  if (!I.recording || !St()) {
    ge = null;
    return;
  }
  const e = ne.running ? ne.current() : null;
  if (e && e.cue === "rest") {
    ge = null;
    return;
  }
  const n = Ve(), s = t >= n.lo && t <= n.hi, i = r("phaseBanner");
  s && ge !== "in" && (ge = "in", i.classList.add("inzone"), i.classList.remove("outzone"), k.say("in zone")), !s && ge !== "out" && (ge = "out", i.classList.add("outzone"), i.classList.remove("inzone"), t > 2 && k.say(t < n.lo ? "more" : "ease off"), K && t > 2 && Date.now() - Ut > 1500 && (X.outZone(), Ut = Date.now()));
}
let Et = null, me = null;
function cs() {
  const t = Math.max(0, Math.floor(Number(r("preCount").value) || 0));
  if (!t) {
    Vt();
    return;
  }
  k.unlock(), r("btnStart").classList.add("hidden"), r("btnStop").classList.remove("hidden"), r("btnStop").textContent = "Cancel", Xe(!0);
  let e = t;
  const n = () => {
    Me("rest", "Get ready", String(e)), e > 0 && (k.say(String(e), !0), K && X.tick());
  };
  n(), me = setInterval(() => {
    if (e--, e <= 0) {
      clearInterval(me), me = null, r("btnStop").textContent = "Stop", Vt();
      return;
    }
    n();
  }, 1e3);
}
function ls() {
  return me ? (clearInterval(me), me = null, r("btnStop").textContent = "Stop", r("btnStop").classList.add("hidden"), r("btnStart").classList.remove("hidden"), Xe(!1), Me("rest", "Ready", ""), !0) : !1;
}
function Vt() {
  Et = null;
  const t = r("protocol").value, e = Je(t, kt());
  r("summary").classList.add("hidden"), I.start(), k.unlock(), hs(), H.opts.marks = [], H.opts.peaks = [];
  const n = e.phases.length ? Qt(e).reduce((s, i) => s + i.seconds, 0) : 60;
  H.opts.windowS = Math.max(10, Math.ceil(n / 10) * 10), r("btnStart").classList.add("hidden"), r("btnStop").classList.remove("hidden"), Xe(!0), e.phases.length ? (ne.onPhase = us, ne.onTick = ds, ne.onDone = () => dn(), ne.start(e)) : (Me("work", "Free set — go", ""), k.say("Go", !0), K && X.go());
}
function us(t, e, n) {
  Me(t.cue, t.name, t.seconds.toFixed(0)), t.cue === "work" ? (K && X.go(), k.say(t.name.replace(/\d+\/\d+/, ""), !0), H.opts.marks.push(I.elapsed())) : t.cue === "ramp" ? (K && X.go(), k.say("Build up", !0)) : (e > 0 && K && X.rest(), e > 0 && k.say(e === n - 1 ? "Done" : "Rest", !0));
}
let Ht = -1;
function ds(t, e) {
  r("phaseTime").textContent = t.toFixed(t < 10 ? 1 : 0);
  const n = Math.ceil(t);
  n !== Ht && (Ht = n, n <= 3 && n > 0 && K && X.tick());
}
async function dn() {
  if (ls()) return;
  ne.stop(), hn();
  const t = r("exercise").value, e = r("side").value, n = r("protocol").value, s = r("contraction").value, i = I.finish({ exercise: t, side: e, mode: n, contraction: s, handle: ze(), links: Ae(), extKg: Ke() });
  i && i.manualReps === void 0 && (i.reps?.length ?? 0) >= 2 && (i.manualReps = i.reps.length), Et = i, r("btnStop").classList.add("hidden"), r("btnStart").classList.remove("hidden"), Xe(!1), Me("idle", "Done", "—"), K && X.done(), i && (n === "maxtest" && i.peak > 0 && (await T.setMax(we(t, e, s, ze(), Ae(), Ke()), i.peak), k.say(`New max ${i.peak.toFixed(0)} kilos`, !0)), await T.saveSet(i), N.push(i), G()?.upsertForceSet(nn(i)), await fs(i), await D(), Q(), Z());
}
function hs() {
  hn(), lt = -1, Ue = setInterval(() => {
    if (!I.recording) return;
    const t = Math.floor(I.elapsed());
    if (t === lt || t === 0) return;
    lt = t;
    const e = ne.running ? ne.current() : null;
    if (e && e.cue !== "work") return;
    const n = gt && !St() && t % je === 0;
    (mt && K || n && K) && X.tick();
    const s = [];
    vt && s.push(zn(t)), n && s.push(We.toFixed(0)), s.length && (!n && k.speaking() || k.say(s.join(", "), n, !0));
  }, 100);
}
function hn() {
  Ue && clearInterval(Ue), Ue = null;
}
function Xe(t) {
  for (const e of ["exercise", "side", "protocol", "contraction", "handle", "links", "extKg", "preCount"]) r(e).disabled = t;
}
function Me(t, e, n) {
  const s = r("phaseBanner");
  s.className = `banner ${t}`, r("phaseName").textContent = e, r("phaseTime").textContent = n;
}
async function fs(t) {
  const e = re, n = await T.maxes(), s = t.side === "left" ? "right" : t.side === "right" ? "left" : null, i = [];
  t.extKg && i.push(R("External load", `+${t.extKg} kg (not measured by the scale)`)), i.push(R("Duration", `${t.durationS.toFixed(1)} s`)), i.push(R("Peak force", `${L(t.peak)} kg`, Oe(t.peak, e?.peak))), i.push(R("Intensity (avg)", `${L(t.avg)} kg`, Oe(t.avg, e?.avg))), i.push(R("Output (kg·s)", L(t.output), Oe(t.output, e?.output))), i.push(R("Inroad", `${t.inroad.toFixed(0)}%`, t.inroad >= 30 ? '<span class="badge good">deep fatigue</span>' : t.inroad >= 15 ? '<span class="badge">moderate</span>' : '<span class="badge warn">shallow — stopped early?</span>')), oe && i.push(R("vs. best output", `${(t.output / oe * 100).toFixed(0)}%`, t.output > oe ? '<span class="badge good">new best</span>' : "")), Y && i.push(R("Peak as % of max", `${(t.peak / Y * 100).toFixed(0)}%`));
  let a = "";
  if (t.reps && t.reps.length) {
    const d = Math.max(...t.reps.map((h) => h.peak));
    a = `<div class="muted" style="margin-top:8px">Reps: ${t.reps.length} · first ${L(t.reps[0].peak)} → last ${L(t.reps[t.reps.length - 1].peak)} kg · avg rep ${(t.reps.reduce((h, p) => h + p.durationS, 0) / t.reps.length).toFixed(1)} s</div>
      <div class="repbars">${t.reps.map((h) => `<div style="height:${Math.max(4, h.peak / d * 100)}%"><span>${h.peak.toFixed(0)}</span></div>`).join("")}</div>`;
    const u = t.mode === "critical" ? Nn(t.reps) : null;
    u && (a += R("Critical force", `${L(u)} kg${Y ? ` (${(u / Y * 100).toFixed(0)}% of max)` : ""}`));
  }
  let o = "";
  if (s) {
    const d = (p) => N.filter((g) => Jt(g, t.exercise, p, t.contraction, t.handle, t.links, t.extKg)).reduce((g, l) => Math.max(g, l.peak), 0), u = Math.max(n[we(t.exercise, t.side, t.contraction, t.handle, t.links, t.extKg)]?.kg ?? 0, d(t.side)) || void 0, h = Math.max(n[we(t.exercise, s, t.contraction, t.handle, t.links, t.extKg)]?.kg ?? 0, d(s)) || void 0;
    if (u && h) {
      const p = (Math.abs(u - h) / Math.max(u, h) * 100).toFixed(0);
      o = R("Left/right gap", `${p}% (L ${L(t.side === "left" ? u : h)} / R ${L(t.side === "left" ? h : u)})`, Number(p) > 10 ? '<span class="badge warn">asymmetry</span>' : '<span class="badge good">balanced</span>');
    }
  }
  const c = r("summary");
  c.innerHTML = `<h4>${O(xe(t.exercise, t.side, t.contraction, t.handle, t.links, t.extKg))} · ${t.mode}</h4>${i.join("")}${o}${a}
    ${fn(t, "sum")}`, c.classList.remove("hidden"), pn(t, "sum", async () => {
    await D(), Q();
  });
}
function fn(t, e) {
  const n = Te(fe(t));
  return `<div class="editor">
      <label>Reps <input type="number" id="${e}Reps" min="1" step="1" inputmode="numeric" placeholder="1" value="${t.manualReps ?? ""}" /></label>
      <label>Date performed <input type="date" id="${e}Date" value="${n}" max="${Te(Date.now())}" /></label>
      <label class="grow">Note <input type="text" id="${e}Note" placeholder="optional" value="${O(t.note ?? "")}" /></label>
      <button class="sm primary" id="${e}Save" type="button">Save</button>
      <span class="muted" id="${e}Msg">${t.reps?.length ? `auto-detected ${t.reps.length} — change it if that's wrong` : "blank reps = 1"}</span>
    </div>`;
}
function pn(t, e, n) {
  const s = async () => {
    const i = Number(r(`${e}Reps`).value);
    t.manualReps = i > 0 ? Math.round(i) : void 0;
    const a = r(`${e}Date`).value;
    if (a) {
      const [c, d, u] = a.split("-").map(Number), h = new Date(t.startedAt);
      t.performedAt = new Date(c, d - 1, u, h.getHours(), h.getMinutes(), h.getSeconds()).getTime();
    }
    t.note = r(`${e}Note`).value.trim() || void 0, await T.updateSet(t), G()?.upsertForceSet(nn(t));
    const o = N.findIndex((c) => c.id === t.id);
    o >= 0 && (N[o] = t), r(`${e}Msg`).textContent = `saved · ${ye(t)} rep${ye(t) === 1 ? "" : "s"} · ${Te(fe(t))}`, await n();
  };
  r(`${e}Save`).onclick = s;
  for (const i of [`${e}Reps`, `${e}Date`, `${e}Note`]) r(i).onkeydown = (a) => {
    a.key === "Enter" && s();
  };
}
function R(t, e, n = "") {
  return `<div class="fl-line"><span>${t}</span><span>${e} ${n}</span></div>`;
}
function Oe(t, e) {
  if (!e) return "";
  const n = (t - e) / e * 100;
  return `<span class="${n >= 0 ? "fl-d up" : "fl-d down"}">${n >= 0 ? "+" : ""}${n.toFixed(1)}%</span>`;
}
function gn() {
  const t = I.current(), e = I.recording ? I.elapsed() : Et?.durationS ?? I.elapsed();
  if (r("liveKg").textContent = We.toFixed(1), r("elapsed").textContent = wn(e), H.draw(t, e, We), I.recording && t.length > 2) {
    const n = Xt(t);
    r("sPeak").textContent = L(n.peak), r("sAvg").textContent = L(n.avg), r("sOut").textContent = L(n.output), r("sInroad").textContent = `${n.inroad.toFixed(0)}%`;
    const s = re;
    r("dPeak").innerHTML = Oe(n.peak, s?.peak), r("dAvg").innerHTML = Oe(n.avg, s?.avg), r("dOut").innerHTML = oe ? `<span class="muted">${(n.output / oe * 100).toFixed(0)}% of goal</span>` : "";
    const i = xt(t);
    H.opts.peaks = i.map((a) => ({ t: a.peakT ?? a.startS, kg: a.peak })), r("sReps").textContent = i.length ? String(i.length) : "–", r("dReps").textContent = i.length ? `last ${i[i.length - 1].peak.toFixed(0)} kg` : "";
  }
  requestAnimationFrame(gn);
}
let Le = null;
function Q() {
  const t = r("histExercise").value, e = N.filter((n) => !t || n.exercise === t).slice().sort((n, s) => fe(s) - fe(n) || s.startedAt - n.startedAt);
  r("histBody").innerHTML = e.map((n) => `<tr data-id="${n.id}" class="${Le?.id === n.id ? "sel" : ""}">
      <td>${new Date(fe(n)).toLocaleDateString(void 0, { month: "short", day: "numeric" })}</td>
      <td>${O(xe(n.exercise, n.side, n.contraction, n.handle, n.links, n.extKg))}</td>
      <td>${n.mode}</td><td>${ye(n)}</td><td>${wn(n.durationS)}</td><td>${L(n.peak)}</td><td>${L(n.avg)}</td><td>${L(n.output)}</td><td>${n.inroad.toFixed(0)}%</td>
      <td><button data-del="${n.id}">✕</button></td></tr>`).join("") || '<tr><td colspan="10" class="muted">No sets yet.</td></tr>', r("histBody").querySelectorAll("tr[data-id]").forEach((n) => {
    n.onclick = (s) => {
      s.target.dataset.del || (Le = N.find((i) => i.id === n.dataset.id) ?? null, Q(), ps());
    };
  }), r("histBody").querySelectorAll("button[data-del]").forEach((n) => {
    n.onclick = async () => {
      confirm("Delete this set?") && (await T.deleteSet(n.dataset.del), G()?.removeForceSet(`fl-${n.dataset.del}`), N = N.filter((s) => s.id !== n.dataset.del), Le?.id === n.dataset.del && (Le = null), Q(), await D());
    };
  }), gs(t ? e.slice().reverse() : []);
}
function ps() {
  const t = Le, e = r("histDetail");
  if (!t) {
    e.classList.add("hidden");
    return;
  }
  e.classList.remove("hidden"), e.innerHTML = `<h4>${O(xe(t.exercise, t.side, t.contraction, t.handle, t.links, t.extKg))} · ${new Date(t.startedAt).toLocaleString()}</h4>
    <div class="chartwrap small"><canvas id="histCanvas"></canvas></div>
    ${R("Peak", `${L(t.peak)} kg`)}${R("Intensity", `${L(t.avg)} kg`)}${R("Output", L(t.output))}${R("Inroad", `${t.inroad.toFixed(0)}%`)}
    ${R("Reps (logged)", String(ye(t)))}
    ${t.reps?.length ? R("Auto-detected", `${t.reps.length} (${t.reps.map((s) => s.peak.toFixed(0)).join(", ")} kg)`) : ""}
    ${fn(t, "hist")}
    <div class="actions-inline" style="margin-top:8px"><button class="sm" id="btnUseGhost">Use as ghost trace</button><button class="sm ghost" id="btnSetCsv">Export samples CSV</button></div>`, pn(t, "hist", async () => {
    Q(), await D();
  });
  const n = new Zt(r("histCanvas"));
  n.opts.windowS = Math.max(10, Math.ceil(t.durationS / 10) * 10), n.opts.peaks = xt(t.samples).map((s) => ({ t: s.peakT ?? s.startS, kg: s.peak })), n.draw(t.samples, t.durationS, 0), r("btnUseGhost").onclick = () => {
    De = !0, localStorage.setItem("ufl.ghostOn", "1"), r("ghostOn").checked = !0, H.opts.ghost = t.samples, mn("train");
  }, r("btnSetCsv").onclick = () => pt(`set-${t.id}.csv`, es(t), "text/csv");
}
function gs(t) {
  const e = r("progress");
  if (t.length < 2) {
    e.classList.add("hidden");
    return;
  }
  e.classList.remove("hidden");
  const n = Math.max(1, window.devicePixelRatio || 1), s = e.clientWidth - 12, i = 160;
  Ee.width = s * n, Ee.height = i * n, Ee.style.width = `${s}px`, Ee.style.height = `${i}px`;
  const a = Ee.getContext("2d");
  a.setTransform(n, 0, 0, n, 0, 0), a.clearRect(0, 0, s, i);
  const o = getComputedStyle(document.getElementById("view-force") ?? document.documentElement), c = 36, d = 8, u = 10, h = 18, p = s - c - d, g = i - u - h, l = Math.max(10, ...t.map((w) => w.peak)) * 1.1, f = (w) => c + w / Math.max(1, t.length - 1) * p, y = (w) => u + g - w / l * g;
  a.strokeStyle = o.getPropertyValue("--grid"), a.fillStyle = o.getPropertyValue("--muted"), a.font = "10px system-ui", a.textAlign = "right";
  for (let w = 0; w <= 4; w++) {
    const A = l / 4 * w;
    a.beginPath(), a.moveTo(c, y(A)), a.lineTo(s - d, y(A)), a.stroke(), a.fillText(A.toFixed(0), c - 4, y(A) + 3);
  }
  const b = [["peak", o.getPropertyValue("--accent")], ["avg", o.getPropertyValue("--accent2")]];
  for (const [w, A] of b)
    a.strokeStyle = A, a.lineWidth = 2, a.beginPath(), t.forEach((j, V) => V ? a.lineTo(f(V), y(j[w])) : a.moveTo(f(V), y(j[w]))), a.stroke(), a.fillStyle = A, t.forEach((j, V) => {
      a.beginPath(), a.arc(f(V), y(j[w]), 3, 0, Math.PI * 2), a.fill();
    });
  a.fillStyle = o.getPropertyValue("--muted"), a.textAlign = "left", a.fillText("peak", c + 4, u + 10), a.fillStyle = o.getPropertyValue("--accent2"), a.fillText("intensity", c + 36, u + 10);
}
async function Z() {
  const t = await T.maxes(), e = Object.entries(t).map(([n, s]) => {
    const [i, a, o, c, d, u] = n.split("|");
    return `<tr><td>${O(xe(i, "both", o, c, Number((d ?? "").replace("L", "")) || 0, Number((u ?? "").replace("E", "")) || 0))}</td><td>${a}</td><td>${L(s.kg)}</td><td>${new Date(s.at).toLocaleDateString()}</td><td><button data-mdel="${O(n)}">✕</button></td></tr>`;
  });
  r("maxBody").innerHTML = e.join("") || '<tr><td colspan="5" class="muted">No maxes yet.</td></tr>', r("maxBody").querySelectorAll("button[data-mdel]").forEach((n) => n.onclick = async () => {
    await T.deleteMax(n.dataset.mdel), Z(), D();
  }), r("exList").innerHTML = x.map((n) => `<span>${O(n)}<button data-xren="${O(n)}" title="Rename">✎</button><button data-xdel="${O(n)}">✕</button></span>`).join(""), r("exList").querySelectorAll("button[data-xren]").forEach((n) => n.onclick = async () => {
    const s = n.dataset.xren, i = prompt(`Rename "${s}" to:`, s);
    !i || i.trim() === s || await as(s, i.trim());
  }), r("exList").querySelectorAll("button[data-xdel]").forEach((n) => n.onclick = async () => {
    const s = G();
    if (s) {
      if (!s.removeExercise(n.dataset.xdel)) {
        alert("Built-in Gym Log exercises can't be removed here.");
        return;
      }
      x = s.exerciseNames();
    } else
      x = x.filter((i) => i !== n.dataset.xdel), await T.saveExercises(x);
    ce(), Z();
  });
}
function mn(t) {
  document.querySelectorAll(".fl-tabs button").forEach((e) => e.classList.toggle("active", e.dataset.tab === t)), document.querySelectorAll(".fl-tab").forEach((e) => e.classList.toggle("active", e.id === `tab-${t}`)), t === "train" && H.resize(), t === "history" && Q();
}
function ms() {
  document.querySelectorAll(".fl-tabs button").forEach((l) => l.onclick = () => mn(l.dataset.tab)), r("hdrExercise").onclick = () => {
    I.recording || ss(r("exercise"));
  };
  for (const l of ["exercise", "side", "protocol", "contraction", "handle", "links", "extKg"]) r(l).addEventListener("change", he);
  he(), r("btnConnect").onclick = async () => {
    if (z instanceof $e && (J === "live" || J === "scanning")) {
      await z.stop(), z = null, Ge("idle"), yt = !0;
      return;
    }
    yt = !1, r("simPanel").classList.add("hidden"), te = null;
    const l = new $e();
    l.onSeen = () => vn(l), wt(l);
  }, r("btnSim").onclick = () => {
    te = new In(), te.exact = r("simExact").checked, r("simPanel").classList.remove("hidden"), wt(te);
  }, r("simExact").onchange = (l) => {
    const f = l.target.checked;
    te && (te.exact = f), r("simHelp").textContent = f ? "Reading tracks the slider exactly." : 'Slide up to "push", back to 0 to rest. Fatigue is simulated.';
  }, r("btnTare").onclick = () => z?.tare(), r("btnStart").onclick = cs, r("camOn").checked = localStorage.getItem("ufl.camOn") === "1";
  const t = async () => {
    const l = r("camOn").checked;
    if (localStorage.setItem("ufl.camOn", l ? "1" : "0"), l) {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert("Camera not available here."), r("camOn").checked = !1;
        return;
      }
      qe ?? (qe = new ts(r("camVideo")));
      try {
        await qe.start(), r("camPip").classList.remove("hidden"), r("btnCamFlip").classList.remove("hidden");
      } catch (f) {
        alert("Camera failed: " + f.message + `
Allow the Camera permission for UY Force Lab in Android settings.`), r("camOn").checked = !1;
      }
    } else
      qe?.stop(), r("camPip").classList.add("hidden"), r("btnCamFlip").classList.add("hidden");
  };
  r("camOn").onchange = t, r("camOn").checked && t(), r("btnCamFlip").onclick = () => qe?.flip();
  const e = r("camPip"), n = localStorage.getItem("ufl.pipPos");
  if (n) {
    const [l, f] = n.split(",").map(Number);
    e.style.left = `${l}px`, e.style.top = `${f}px`;
  }
  let s = null;
  e.onpointerdown = (l) => {
    const f = e.getBoundingClientRect();
    s = { x: l.clientX, y: l.clientY, l: f.left, t: f.top, moved: !1 }, e.setPointerCapture(l.pointerId);
  }, e.onpointermove = (l) => {
    if (!s) return;
    const f = l.clientX - s.x, y = l.clientY - s.y;
    if (Math.abs(f) + Math.abs(y) > 6 && (s.moved = !0), !s.moved) return;
    const b = e.getBoundingClientRect(), w = Math.min(window.innerWidth - b.width, Math.max(0, s.l + f)), A = Math.min(window.innerHeight - b.height, Math.max(0, s.t + y));
    e.style.left = `${w}px`, e.style.top = `${A}px`;
  }, e.onpointerup = () => {
    if (s) {
      if (s.moved) {
        const l = e.getBoundingClientRect();
        localStorage.setItem("ufl.pipPos", `${Math.round(l.left)},${Math.round(l.top)}`);
      } else e.classList.toggle("large");
      s = null;
    }
  }, r("btnStop").onclick = dn, r("simEffort").oninput = (l) => {
    const f = Number(l.target.value);
    te && (te.effort = f), r("simVal").textContent = String(f);
  }, r("exercise").onchange = D, ct(r("exercise"), { recent: ut, all: () => x, onCreate: jt }), ct(r("maxExercise"), { recent: ut, all: () => x, onCreate: jt }), ct(r("histExercise"), { recent: ut, all: () => x, allOption: { value: "", label: "All exercises" } }), r("btnNewEx").onclick = () => {
    r("newExBox").classList.remove("hidden"), r("newExName").focus();
  }, r("btnNewExCancel").onclick = () => {
    r("newExBox").classList.add("hidden"), r("newExName").value = "";
  };
  const i = async () => {
    const l = r("newExName").value.trim();
    if (l) {
      if (!x.includes(l)) {
        const f = G();
        f ? (f.addExercise(l), x = f.exerciseNames()) : (x.push(l), await T.saveExercises(x));
      }
      ce(), r("exercise").value = l, r("newExBox").classList.add("hidden"), r("newExName").value = "", Z(), await D();
    }
  };
  r("btnNewExSave").onclick = i, r("newExName").onkeydown = (l) => {
    l.key === "Enter" && i();
  }, r("side").onchange = D, r("contraction").onchange = D, r("zoneRef").value = localStorage.getItem("ufl.zoneRef") ?? "best", r("zoneRef").onchange = () => {
    localStorage.setItem("ufl.zoneRef", r("zoneRef").value), D();
  };
  const a = (l) => Math.max(1, Number(localStorage.getItem(`ufl.links.${l}`) ?? "1") || 1), o = () => {
    r("links").value = String(Math.min(8, a(r("exercise").value)));
  };
  r("exercise").addEventListener("change", () => {
    o(), he();
  }), r("extKg").oninput = () => {
    he(), D();
  }, r("links").onchange = () => {
    localStorage.setItem(`ufl.links.${r("exercise").value}`, String(Ae())), he(), D();
  }, setTimeout(o, 0), r("preCount").value = localStorage.getItem("ufl.preCount") ?? "10", r("preCount").onchange = () => localStorage.setItem("ufl.preCount", String(Math.max(0, Number(r("preCount").value) || 0)));
  const c = r("handle"), d = localStorage.getItem("ufl.handle") ?? "";
  d && ![...c.options].some((l) => l.value === d) && c.insertAdjacentHTML("beforeend", `<option>${O(d)}</option>`), c.value = d;
  const u = JSON.parse(localStorage.getItem("ufl.handles") ?? "[]");
  for (const l of u) [...c.options].some((f) => f.value === l) || c.insertAdjacentHTML("beforeend", `<option>${O(l)}</option>`);
  c.onchange = () => {
    if (c.value === "__custom") {
      const l = (prompt("Handle / attachment name") ?? "").trim();
      if (!l) {
        c.value = localStorage.getItem("ufl.handle") ?? "";
        return;
      }
      [...c.options].some((f) => f.value === l) || (c.insertAdjacentHTML("beforeend", `<option>${O(l)}</option>`), u.push(l), localStorage.setItem("ufl.handles", JSON.stringify(u))), c.value = l;
    }
    localStorage.setItem("ufl.handle", c.value), he(), D();
  }, r("protocol").onchange = () => on(), r("params").oninput = () => r("protocolHelp").textContent = Je(r("protocol").value, kt()).describe;
  for (const l of ["zoneOn", "zoneLo", "zoneHi"]) r(l).oninput = D;
  r("ghostOn").checked = De, r("ghostOn").onchange = (l) => {
    De = l.target.checked, localStorage.setItem("ufl.ghostOn", De ? "1" : "0"), D();
  }, r("histExercise").onchange = Q, r("btnCsv").onclick = () => pt(`uy-force-lab-${zt()}.csv`, Qn(N), "text/csv"), r("btnJson").onclick = () => pt(`uy-force-lab-${zt()}.json`, JSON.stringify(N, null, 1), "application/json"), r("voiceOn").onchange = (l) => k.enabled = l.target.checked, r("keepAwake").checked = cn(), r("keepAwake").onchange = (l) => {
    localStorage.setItem("ufl.keepAwake", l.target.checked ? "1" : "0"), ln();
  }, r("autoConnect").checked = un(), r("autoConnect").onchange = (l) => {
    localStorage.setItem("ufl.autoConnect", l.target.checked ? "1" : "0"), Ye = !1, bt();
  }, document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "hidden") {
      z instanceof $e && !I.recording && (await z.stop(), z = null, Ge("idle"), dt = !0);
      return;
    }
    (dt || J === "idle" || J === "error") && (dt = !1, Ye = !1, bt());
  }), k.rate = Number(be("ufl.voiceRate", "1.2")) || 1.2, k.pitch = Number(be("ufl.voicePitch", "1")) || 1;
  const h = (l, f, y, b) => {
    const w = r(l);
    w.value = String(b), r(l + "Val").textContent = b.toFixed(1) + "×", w.oninput = () => {
      const A = Number(w.value);
      y(A), localStorage.setItem(f, String(A)), r(l + "Val").textContent = A.toFixed(1) + "×";
    };
  };
  h("voiceRate", "ufl.voiceRate", (l) => k.rate = l, k.rate), h("voicePitch", "ufl.voicePitch", (l) => k.pitch = l, k.pitch), r("beepOn").onchange = (l) => K = l.target.checked, r("calloutEvery").value = String(je), r("calloutEvery").onchange = (l) => {
    je = Math.max(1, Number(l.target.value) || 1), localStorage.setItem("ufl.calloutEvery", String(je));
  };
  const p = (l, f, y, b) => {
    const w = r(l);
    w.checked = b, w.onchange = () => {
      y(w.checked), localStorage.setItem(f, w.checked ? "1" : "0");
    };
  };
  p("calloutOn", "ufl.calloutOn", (l) => gt = l, gt), p("secBeep", "ufl.secBeep", (l) => mt = l, mt), p("secCount", "ufl.secCount", (l) => vt = l, vt);
  let g = null;
  k.onSpeak = (l) => {
    const f = r("said");
    f.textContent = `🔊 ${l}`, f.classList.add("on"), g && clearTimeout(g), g = setTimeout(() => f.classList.remove("on"), 900);
  }, document.addEventListener("pointerdown", () => k.unlock(), { once: !0 }), document.addEventListener("visibilitychange", () => {
    document.visibilityState === "visible" && k.reset();
  }), r("btnTestVoice").onclick = async () => {
    k.reset();
    const l = r("voiceStatus");
    l.textContent = await k.status(), k.say("Force lab voice check, 1, 2, 3", !0);
  }, r("btnSetMax").onclick = async () => {
    const l = Number(r("maxKg").value);
    l && (await T.setMax(we(r("maxExercise").value, r("maxSide").value), l), r("maxKg").value = "", Z(), D());
  }, r("btnAddEx").onclick = async () => {
    const l = r("newEx").value.trim();
    if (!(!l || x.includes(l))) {
      {
        const f = G();
        f ? (f.addExercise(l), x = f.exerciseNames()) : (x.push(l), await T.saveExercises(x));
      }
      r("newEx").value = "", ce(), Z();
    }
  };
}
let Wt = 0;
function vn(t) {
  const e = Date.now();
  if (e - Wt < 1e3 || r("tab-settings").classList.contains("active") === !1) return;
  Wt = e;
  const n = [...t.seen.values()].sort((s, i) => i.t - s.t).slice(0, 12);
  r("seenBody").innerHTML = n.map((s) => `<tr><td>${O(s.name || "(no name)")}<br><small class="muted">${O(s.id)}</small></td><td>${s.rssi}</td><td>${O(s.keys || "–")}</td><td style="white-space:normal;font-family:monospace;font-size:11px">${O(s.hex || "–")}</td><td>${s.kg === null ? "–" : s.kg.toFixed(2)}</td></tr>`).join("") || '<tr><td colspan="5" class="muted">Listening… nothing heard yet.</td></tr>';
}
function L(t) {
  return t >= 100 ? t.toFixed(0) : t.toFixed(1);
}
function wn(t) {
  const e = Math.floor(t / 60), n = Math.floor(t % 60);
  return `${e}:${n.toString().padStart(2, "0")}`;
}
function zt() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function O(t) {
  return t.replace(/[&<>"]/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[e]);
}
rs();
window.ForceLab = {
  onShow() {
    H.resize(), bt();
  },
  // called by the host after it renamed an exercise in its own data
  renameExercise(t, e) {
    an(t, e).then(async () => {
      x = G()?.exerciseNames() ?? x, ce(), Z(), Q(), await D();
    });
  }
};
async function vs(t, e, n) {
  let s;
  return Promise.race([
    t,
    new Promise((i, a) => {
      s = setTimeout(() => a(n), e);
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
    const n = this.getFilters(e), s = await navigator.bluetooth.requestDevice({
      filters: n.length ? n : void 0,
      optionalServices: e?.optionalServices,
      acceptAllDevices: n.length === 0
    });
    return this.deviceMap.set(s.id, s), this.getBleDevice(s);
  }
  async requestLEScan(e) {
    this.requestBleDeviceOptions = e;
    const n = this.getFilters(e);
    await this.stopLEScan(), this.discoveredDevices = /* @__PURE__ */ new Map(), navigator.bluetooth.removeEventListener("advertisementreceived", this.onAdvertisementReceivedCallback), navigator.bluetooth.addEventListener("advertisementreceived", this.onAdvertisementReceivedCallback), this.scan = await navigator.bluetooth.requestLEScan({
      filters: n.length ? n : void 0,
      acceptAllAdvertisements: n.length === 0,
      keepRepeatedDevices: e?.allowDuplicates
    });
  }
  onAdvertisementReceived(e) {
    var n, s, i;
    const a = e.device.id;
    this.deviceMap.set(a, e.device);
    const o = !this.discoveredDevices.has(a);
    if (!(!((n = this.requestBleDeviceOptions) === null || n === void 0) && n.serviceData && !this.matchesServiceDataFilter(e)) && (o || !((s = this.requestBleDeviceOptions) === null || s === void 0) && s.allowDuplicates)) {
      this.discoveredDevices.set(a, !0);
      const c = this.getBleDevice(e.device), d = {
        device: c,
        localName: c.name,
        rssi: e.rssi,
        txPower: e.txPower,
        manufacturerData: _t(e.manufacturerData),
        serviceData: _t(e.serviceData),
        uuids: (i = e.uuids) === null || i === void 0 ? void 0 : i.map(Tn)
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
    var n, s;
    const i = this.getDeviceFromMap(e.deviceId);
    i.removeEventListener("gattserverdisconnected", this.onDisconnectedCallback), i.addEventListener("gattserverdisconnected", this.onDisconnectedCallback);
    const a = Symbol();
    if (i.gatt === void 0)
      throw new Error("No gatt server available.");
    try {
      const o = (n = e.timeout) !== null && n !== void 0 ? n : this.DEFAULT_CONNECTION_TIMEOUT;
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
    var n;
    (n = this.getDeviceFromMap(e.deviceId).gatt) === null || n === void 0 || n.disconnect();
  }
  async getServices(e) {
    var n, s;
    const i = (s = await ((n = this.getDeviceFromMap(e.deviceId).gatt) === null || n === void 0 ? void 0 : n.getPrimaryServices())) !== null && s !== void 0 ? s : [], a = [];
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
    var n;
    const s = await ((n = this.getDeviceFromMap(e.deviceId).gatt) === null || n === void 0 ? void 0 : n.getPrimaryService(e?.service));
    return s?.getCharacteristic(e?.characteristic);
  }
  async getDescriptor(e) {
    const n = await this.getCharacteristic(e);
    return n?.getDescriptor(e?.descriptor);
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
    const n = await this.getCharacteristic(e);
    return { value: await n?.readValue() };
  }
  async write(e) {
    const n = await this.getCharacteristic(e);
    let s;
    typeof e.value == "string" ? s = Ce(e.value) : s = e.value, await n?.writeValueWithResponse(et(s));
  }
  async writeWithoutResponse(e) {
    const n = await this.getCharacteristic(e);
    let s;
    typeof e.value == "string" ? s = Ce(e.value) : s = e.value, await n?.writeValueWithoutResponse(et(s));
  }
  async readDescriptor(e) {
    const n = await this.getDescriptor(e);
    return { value: await n?.readValue() };
  }
  async writeDescriptor(e) {
    const n = await this.getDescriptor(e);
    let s;
    typeof e.value == "string" ? s = Ce(e.value) : s = e.value, await n?.writeValue(et(s));
  }
  async startNotifications(e) {
    const n = await this.getCharacteristic(e);
    n?.removeEventListener("characteristicvaluechanged", this.onCharacteristicValueChangedCallback), n?.addEventListener("characteristicvaluechanged", this.onCharacteristicValueChangedCallback), await n?.startNotifications();
  }
  onCharacteristicValueChanged(e) {
    var n, s;
    const i = e.target, a = `notification|${(n = i.service) === null || n === void 0 ? void 0 : n.device.id}|${(s = i.service) === null || s === void 0 ? void 0 : s.uuid}|${i.uuid}`;
    this.notifyListeners(a, {
      value: i.value
    });
  }
  async stopNotifications(e) {
    const n = await this.getCharacteristic(e);
    await n?.stopNotifications();
  }
  getFilters(e) {
    var n, s;
    const i = [];
    for (const a of (n = e?.services) !== null && n !== void 0 ? n : [])
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
    var n;
    const s = (n = this.requestBleDeviceOptions) === null || n === void 0 ? void 0 : n.serviceData;
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
          for (let h = 0; h < c.byteLength; h++)
            if ((o[h] & d.getUint8(h)) !== (c.getUint8(h) & d.getUint8(h))) {
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
    const n = this.deviceMap.get(e);
    if (n === void 0)
      throw new Error('Device not found. Call "requestDevice", "requestLEScan" or "getDevices" first.');
    return n;
  }
  getBleDevice(e) {
    var n;
    return {
      deviceId: e.id,
      // use undefined instead of null if name is not available
      name: (n = e.name) !== null && n !== void 0 ? n : void 0
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
    const n = this.speechSynthesis, s = this.createSpeechSynthesisUtterance(e);
    return new Promise((i, a) => {
      s.onend = () => {
        i();
      }, s.onerror = (o) => {
        a(o);
      }, n.speak(s);
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
    const n = this.getSpeechSynthesisVoices(), s = new SpeechSynthesisUtterance(), { text: i, lang: a, rate: o, pitch: c, volume: d, voice: u } = e;
    return u !== void 0 && (s.voice = n[u]), d !== void 0 && (s.volume = d >= 0 && d <= 1 ? d : 1), o !== void 0 && (s.rate = o >= 0.1 && o <= 10 ? o : 1), c !== void 0 && (s.pitch = c >= 0 && c <= 2 ? c : 2), a && (s.lang = a), s.text = i, s;
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
    return { keys: this.rawKeys().map((n) => n.substring(this.prefix.length)) };
  }
  async clear() {
    for (const e of this.rawKeys())
      this.impl.removeItem(e);
  }
  async migrate() {
    var e;
    const n = [], s = [], i = "_cap_", a = Object.keys(this.impl).filter((o) => o.indexOf(i) === 0);
    for (const o of a) {
      const c = o.substring(i.length), d = (e = this.impl.getItem(o)) !== null && e !== void 0 ? e : "", { value: u } = await this.get({ key: c });
      typeof u == "string" ? s.push(c) : (await this.set({ key: c, value: d }), n.push(c));
    }
    return { migrated: n, existing: s };
  }
  async removeOld() {
    const e = "_cap_", n = Object.keys(this.impl).filter((s) => s.indexOf(e) === 0);
    for (const s of n)
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
function Kt(t) {
  const e = t.split("/").filter((s) => s !== "."), n = [];
  return e.forEach((s) => {
    s === ".." && n.length > 0 && n[n.length - 1] !== ".." ? n.pop() : n.push(s);
  }), n.join("/");
}
function Cs(t, e) {
  t = Kt(t), e = Kt(e);
  const n = t.split("/"), s = e.split("/");
  return t !== e && n.every((i, a) => i === s[a]);
}
class Ze extends ie {
  constructor() {
    super(...arguments), this.DB_VERSION = 1, this.DB_NAME = "Disc", this._writeCmds = ["add", "put", "delete"], this.downloadFile = async (e) => {
      var n, s;
      const i = Gt(e, e.webFetchExtra), a = await fetch(e.url, i);
      let o;
      if (!e.progress)
        o = await a.blob();
      else if (!a?.body)
        o = new Blob();
      else {
        const d = a.body.getReader();
        let u = 0;
        const h = [], p = a.headers.get("content-type"), g = parseInt(a.headers.get("content-length") || "0", 10);
        for (; ; ) {
          const { done: y, value: b } = await d.read();
          if (y)
            break;
          h.push(b), u += b?.length || 0;
          const w = {
            url: e.url,
            bytes: u,
            contentLength: g
          };
          this.notifyListeners("progress", w);
        }
        const l = new Uint8Array(u);
        let f = 0;
        for (const y of h)
          typeof y > "u" || (l.set(y, f), f += y.length);
        o = new Blob([l.buffer], { type: p || void 0 });
      }
      return { path: (await this.writeFile({
        path: e.path,
        directory: (n = e.directory) !== null && n !== void 0 ? n : void 0,
        recursive: (s = e.recursive) !== null && s !== void 0 ? s : !1,
        data: o
      })).uri, blob: o };
    };
  }
  readFileInChunks(e, n) {
    throw this.unavailable("Method not implemented.");
  }
  async initDb() {
    if (this._db !== void 0)
      return this._db;
    if (!("indexedDB" in window))
      throw this.unavailable("This browser doesn't support IndexedDB");
    return new Promise((e, n) => {
      const s = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      s.onupgradeneeded = Ze.doUpgrade, s.onsuccess = () => {
        this._db = s.result, e(s.result);
      }, s.onerror = () => n(s.error), s.onblocked = () => {
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
  async dbRequest(e, n) {
    const s = this._writeCmds.indexOf(e) !== -1 ? "readwrite" : "readonly";
    return this.initDb().then((i) => new Promise((a, o) => {
      const u = i.transaction(["FileStorage"], s).objectStore("FileStorage")[e](...n);
      u.onsuccess = () => a(u.result), u.onerror = () => o(u.error);
    }));
  }
  async dbIndexRequest(e, n, s) {
    const i = this._writeCmds.indexOf(n) !== -1 ? "readwrite" : "readonly";
    return this.initDb().then((a) => new Promise((o, c) => {
      const p = a.transaction(["FileStorage"], i).objectStore("FileStorage").index(e)[n](...s);
      p.onsuccess = () => o(p.result), p.onerror = () => c(p.error);
    }));
  }
  getPath(e, n) {
    const s = n !== void 0 ? n.replace(/^[/]+|[/]+$/g, "") : "";
    let i = "";
    return e !== void 0 && (i += "/" + e), n !== "" && (i += "/" + s), i;
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
    const n = this.getPath(e.directory, e.path), s = await this.dbRequest("get", [n]);
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
    const n = this.getPath(e.directory, e.path);
    let s = e.data;
    const i = e.encoding, a = e.recursive, o = await this.dbRequest("get", [n]);
    if (o && o.type === "directory")
      throw Error("The supplied path is a directory.");
    const c = n.substr(0, n.lastIndexOf("/"));
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
    const u = Date.now(), h = {
      path: n,
      folder: c,
      type: "file",
      size: s instanceof Blob ? s.size : s.length,
      ctime: u,
      mtime: u,
      content: s
    };
    return await this.dbRequest("put", [h]), {
      uri: h.path
    };
  }
  /**
   * Append to a file on disk in the specified location on device
   * @param options options for the file append
   * @return a promise that resolves with the file write result
   */
  async appendFile(e) {
    const n = this.getPath(e.directory, e.path);
    let s = e.data;
    const i = e.encoding, a = n.substr(0, n.lastIndexOf("/")), o = Date.now();
    let c = o;
    const d = await this.dbRequest("get", [n]);
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
    const h = {
      path: n,
      folder: a,
      type: "file",
      size: s.length,
      ctime: c,
      mtime: o,
      content: s
    };
    await this.dbRequest("put", [h]);
  }
  /**
   * Delete a file from disk
   * @param options options for the file delete
   * @return a promise that resolves with the deleted file data result
   */
  async deleteFile(e) {
    const n = this.getPath(e.directory, e.path);
    if (await this.dbRequest("get", [n]) === void 0)
      throw Error("File does not exist.");
    if ((await this.dbIndexRequest("by_folder", "getAllKeys", [IDBKeyRange.only(n)])).length !== 0)
      throw Error("Folder is not empty.");
    await this.dbRequest("delete", [n]);
  }
  /**
   * Create a directory.
   * @param options options for the mkdir
   * @return a promise that resolves with the mkdir result
   */
  async mkdir(e) {
    const n = this.getPath(e.directory, e.path), s = e.recursive, i = n.substr(0, n.lastIndexOf("/")), a = (n.match(/\//g) || []).length, o = await this.dbRequest("get", [i]), c = await this.dbRequest("get", [n]);
    if (a === 1)
      throw Error("Cannot create Root directory");
    if (c !== void 0)
      throw Error("Current directory does already exist.");
    if (!s && a !== 2 && o === void 0)
      throw Error("Parent directory must exist");
    if (s && a !== 2 && o === void 0) {
      const h = i.substr(i.indexOf("/", 1));
      await this.mkdir({
        path: h,
        directory: e.directory,
        recursive: s
      });
    }
    const d = Date.now(), u = {
      path: n,
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
    const { path: n, directory: s, recursive: i } = e, a = this.getPath(s, n), o = await this.dbRequest("get", [a]);
    if (o === void 0)
      throw Error("Folder does not exist.");
    if (o.type !== "directory")
      throw Error("Requested path is not a directory");
    const c = await this.readdir({ path: n, directory: s });
    if (c.files.length !== 0 && !i)
      throw Error("Folder is not empty");
    for (const d of c.files) {
      const u = `${n}/${d.name}`;
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
    const n = this.getPath(e.directory, e.path), s = await this.dbRequest("get", [n]);
    if (e.path !== "" && s === void 0)
      throw Error("Folder does not exist.");
    const i = await this.dbIndexRequest("by_folder", "getAllKeys", [IDBKeyRange.only(n)]);
    return { files: await Promise.all(i.map(async (o) => {
      let c = await this.dbRequest("get", [o]);
      return c === void 0 && (c = await this.dbRequest("get", [o + "/"])), {
        name: o.substring(n.length + 1),
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
    const n = this.getPath(e.directory, e.path);
    let s = await this.dbRequest("get", [n]);
    return s === void 0 && (s = await this.dbRequest("get", [n + "/"])), {
      uri: s?.path || n
    };
  }
  /**
   * Return data about a file
   * @param options the options for the stat operation
   * @return a promise that resolves with the file stat result
   */
  async stat(e) {
    const n = this.getPath(e.directory, e.path);
    let s = await this.dbRequest("get", [n]);
    if (s === void 0 && (s = await this.dbRequest("get", [n + "/"])), s === void 0)
      throw Error("Entry does not exist.");
    return {
      name: s.path.substring(n.length + 1),
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
  async _copy(e, n = !1) {
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
      const f = i.split("/");
      f.pop();
      const y = f.join("/");
      if (f.length > 0 && (await this.stat({
        path: y,
        directory: s
      })).type !== "directory")
        throw new Error("Parent directory of the to path is a file");
    }
    if (u && u.type === "directory")
      throw new Error("Cannot overwrite a directory with a file");
    const h = await this.stat({
      path: a,
      directory: o
    }), p = async (l, f, y) => {
      const b = this.getPath(s, l), w = await this.dbRequest("get", [b]);
      w.ctime = f, w.mtime = y, await this.dbRequest("put", [w]);
    }, g = h.ctime ? h.ctime : Date.now();
    switch (h.type) {
      case "file": {
        const l = await this.readFile({
          path: a,
          directory: o
        });
        n && await this.deleteFile({
          path: a,
          directory: o
        });
        let f;
        !(l.data instanceof Blob) && !this.isBase64String(l.data) && (f = He.UTF8);
        const y = await this.writeFile({
          path: i,
          directory: s,
          data: l.data,
          encoding: f
        });
        return n && await p(i, g, h.mtime), y;
      }
      case "directory": {
        if (u)
          throw Error("Cannot move a directory over an existing object");
        try {
          await this.mkdir({
            path: i,
            directory: s,
            recursive: !1
          }), n && await p(i, g, h.mtime);
        } catch {
        }
        const l = (await this.readdir({
          path: a,
          directory: o
        })).files;
        for (const f of l)
          await this._copy({
            from: `${a}/${f.name}`,
            to: `${i}/${f.name}`,
            directory: o,
            toDirectory: s
          }, n);
        n && await this.rmdir({
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
