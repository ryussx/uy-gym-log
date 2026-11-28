var gt;
(function(t) {
  t[t.SCAN_MODE_LOW_POWER = 0] = "SCAN_MODE_LOW_POWER", t[t.SCAN_MODE_BALANCED = 1] = "SCAN_MODE_BALANCED", t[t.SCAN_MODE_LOW_LATENCY = 2] = "SCAN_MODE_LOW_LATENCY";
})(gt || (gt = {}));
var Dt;
(function(t) {
  t[t.PHY_LE_1M = 1] = "PHY_LE_1M", t[t.PHY_LE_2M = 2] = "PHY_LE_2M", t[t.PHY_LE_CODED = 3] = "PHY_LE_CODED", t[t.PHY_LE_ALL_SUPPORTED = 255] = "PHY_LE_ALL_SUPPORTED";
})(Dt || (Dt = {}));
var Tt;
(function(t) {
  t[t.CONNECTION_PRIORITY_BALANCED = 0] = "CONNECTION_PRIORITY_BALANCED", t[t.CONNECTION_PRIORITY_HIGH = 1] = "CONNECTION_PRIORITY_HIGH", t[t.CONNECTION_PRIORITY_LOW_POWER = 2] = "CONNECTION_PRIORITY_LOW_POWER";
})(Tt || (Tt = {}));
/*! Capacitor: https://capacitorjs.com/ - MIT License */
var ye;
(function(t) {
  t.Unimplemented = "UNIMPLEMENTED", t.Unavailable = "UNAVAILABLE";
})(ye || (ye = {}));
class nt extends Error {
  constructor(e, n, s) {
    super(e), this.message = e, this.code = n, this.data = s;
  }
}
const Sn = (t) => {
  var e, n;
  return t?.androidBridge ? "android" : !((n = (e = t?.webkit) === null || e === void 0 ? void 0 : e.messageHandlers) === null || n === void 0) && n.bridge ? "ios" : "web";
}, En = (t) => {
  const e = t.CapacitorCustomPlatform || null, n = t.Capacitor || {}, s = n.Plugins = n.Plugins || {}, i = () => e !== null ? e.name : Sn(t), a = () => i() !== "web", o = (f) => {
    const g = l.get(f);
    return !!(g?.platforms.has(i()) || c(f));
  }, c = (f) => {
    var g;
    return (g = n.PluginHeaders) === null || g === void 0 ? void 0 : g.find((m) => m.name === f);
  }, d = (f) => t.console.error(f), l = /* @__PURE__ */ new Map(), h = (f, g = {}) => {
    const m = l.get(f);
    if (m)
      return console.warn(`Capacitor plugin "${f}" already registered. Cannot register plugins twice.`), m.proxy;
    const y = i(), u = c(f);
    let p;
    const b = async () => (!p && y in g ? p = typeof g[y] == "function" ? p = await g[y]() : p = g[y] : e !== null && !p && "web" in g && (p = typeof g.web == "function" ? p = await g.web() : p = g.web), p), O = (D, F) => {
      var v, E;
      if (u) {
        const $ = u?.methods.find((L) => F === L.name);
        if ($)
          return $.rtype === "promise" ? (L) => n.nativePromise(f, F.toString(), L) : (L, ue) => n.nativeCallback(f, F.toString(), L, ue);
        if (D)
          return (v = D[F]) === null || v === void 0 ? void 0 : v.bind(D);
      } else {
        if (D)
          return (E = D[F]) === null || E === void 0 ? void 0 : E.bind(D);
        throw new nt(`"${f}" plugin is not implemented on ${y}`, ye.Unimplemented);
      }
    }, S = (D) => {
      let F;
      const v = (...E) => {
        const $ = b().then((L) => {
          const ue = O(L, D);
          if (ue) {
            const de = ue(...E);
            return F = de?.remove, de;
          } else
            throw new nt(`"${f}.${D}()" is not implemented on ${y}`, ye.Unimplemented);
        });
        return D === "addListener" && ($.remove = async () => F()), $;
      };
      return v.toString = () => `${D.toString()}() { [capacitor code] }`, Object.defineProperty(v, "name", {
        value: D,
        writable: !1,
        configurable: !1
      }), v;
    }, A = S("addListener"), V = S("removeListener"), j = (D, F) => {
      const v = A({ eventName: D }, F), E = async () => {
        const L = await v;
        V({
          eventName: D,
          callbackId: L
        }, F);
      }, $ = new Promise((L) => v.then(() => L({ remove: E })));
      return $.remove = async () => {
        console.warn("Using addListener() without 'await' is deprecated."), await E();
      }, $;
    }, I = new Proxy({}, {
      get(D, F) {
        switch (F) {
          case "$$typeof":
            return;
          case "toJSON":
            return () => ({});
          case "addListener":
            return u ? j : A;
          case "removeListener":
            return V;
          default:
            return S(F);
        }
      }
    });
    return s[f] = I, l.set(f, {
      name: f,
      proxy: I,
      platforms: /* @__PURE__ */ new Set([...Object.keys(g), ...u ? [y] : []])
    }), I;
  };
  return n.convertFileSrc || (n.convertFileSrc = (f) => f), n.getPlatform = i, n.handleError = d, n.isNativePlatform = a, n.isPluginAvailable = o, n.registerPlugin = h, n.Exception = nt, n.DEBUG = !!n.DEBUG, n.isLoggingEnabled = !!n.isLoggingEnabled, n;
}, Ln = (t) => t.Capacitor = En(t), N = /* @__PURE__ */ Ln(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {}), ie = N.registerPlugin;
class ae {
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
    return new N.Exception(e, ye.Unimplemented);
  }
  unavailable(e = "not available") {
    return new N.Exception(e, ye.Unavailable);
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
const At = (t) => encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape), Mt = (t) => t.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class Cn extends ae {
  async getCookies() {
    const e = document.cookie, n = {};
    return e.split(";").forEach((s) => {
      if (s.length <= 0)
        return;
      let [i, a] = s.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
      i = Mt(i).trim(), a = Mt(a).trim(), n[i] = a;
    }), n;
  }
  async setCookie(e) {
    try {
      const n = At(e.key), s = At(e.value), i = e.expires ? `; expires=${e.expires.replace("expires=", "")}` : "", a = (e.path || "/").replace("path=", ""), o = e.url != null && e.url.length > 0 ? `domain=${e.url}` : "";
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
ie("CapacitorCookies", {
  web: () => new Cn()
});
const $n = async (t) => new Promise((e, n) => {
  const s = new FileReader();
  s.onload = () => {
    const i = s.result;
    e(i.indexOf(",") >= 0 ? i.split(",")[1] : i);
  }, s.onerror = (i) => n(i), s.readAsDataURL(t);
}), Pn = (t = {}) => {
  const e = Object.keys(t);
  return Object.keys(t).map((i) => i.toLocaleLowerCase()).reduce((i, a, o) => (i[a] = t[e[o]], i), {});
}, On = (t, e = !0) => t ? Object.entries(t).reduce((s, i) => {
  const [a, o] = i;
  let c, d;
  return Array.isArray(o) ? (d = "", o.forEach((l) => {
    c = e ? encodeURIComponent(l) : l, d += `${a}=${c}&`;
  }), d.slice(0, -1)) : (c = e ? encodeURIComponent(o) : o, d = `${a}=${c}`), `${s}&${d}`;
}, "").substr(1) : null, Jt = (t, e = {}) => {
  const n = Object.assign({ method: t.method || "GET", headers: t.headers }, e), i = Pn(t.headers)["content-type"] || "";
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
class Dn extends ae {
  /**
   * Perform an Http request given a set of options
   * @param options Options to build the HTTP request
   */
  async request(e) {
    const n = Jt(e, e.webFetchExtra), s = On(e.params, e.shouldEncodeUrlParams), i = s ? `${e.url}?${s}` : e.url, a = await fetch(i, n), o = a.headers.get("content-type") || "";
    let { responseType: c = "text" } = a.ok ? e : {};
    o.includes("application/json") && (c = "json");
    let d, l;
    switch (c) {
      case "arraybuffer":
      case "blob":
        l = await a.blob(), d = await $n(l);
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
    return a.headers.forEach((f, g) => {
      h[g] = f;
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
ie("CapacitorHttp", {
  web: () => new Dn()
});
var _t;
(function(t) {
  t.Dark = "DARK", t.Light = "LIGHT", t.Default = "DEFAULT";
})(_t || (_t = {}));
var Rt;
(function(t) {
  t.StatusBar = "StatusBar", t.NavigationBar = "NavigationBar";
})(Rt || (Rt = {}));
class Tn extends ae {
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
ie("SystemBars", {
  web: () => new Tn()
});
function An(t) {
  return new DataView(Uint8Array.from(t).buffer);
}
function Mn(t) {
  return Array.from(new Uint8Array(t.buffer, t.byteOffset, t.byteLength));
}
function _n(t) {
  return `0000${t.toString(16).padStart(4, "0")}-0000-1000-8000-00805f9b34fb`;
}
function Pe(t) {
  const e = [];
  let n, s, i = 1, a = 0;
  for (n = 0; n < t.length; n++)
    s = t.charCodeAt(n), (s > 47 && s < 58 || s > 64 && s < 71 || s > 96 && s < 103) && (a = a << 4 ^ (s > 64 ? s + 9 : s) & 15, (i ^= 1) && e.push(a & 255));
  return An(e);
}
function Oe(t) {
  return Mn(t).map((e) => {
    let n = e.toString(16);
    return n.length == 1 && (n = "0" + n), n;
  }).join("");
}
function Rn(t) {
  if (typeof t == "string")
    return t;
  if (typeof t == "number")
    return _n(t);
  throw new Error("Invalid UUID");
}
function It(t) {
  const e = {};
  if (t)
    return t.forEach((n, s) => {
      e[s.toString()] = n;
    }), e;
}
function Ft(t) {
  if (t !== void 0) {
    if (typeof t == "string") {
      const e = Pe(t);
      return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
    }
    return t instanceof DataView ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength) : t;
  }
}
function Fe(t) {
  if (t !== void 0)
    return t instanceof DataView ? Oe(t) : Oe(new DataView(t.buffer, t.byteOffset, t.byteLength));
}
function st(t) {
  if (typeof SharedArrayBuffer < "u" && t.buffer instanceof SharedArrayBuffer) {
    const n = new Uint8Array(t.buffer, t.byteOffset, t.byteLength).slice().buffer;
    return new DataView(n);
  }
  return t;
}
const w = ie("BluetoothLe", {
  web: () => Promise.resolve().then(() => Ls).then((t) => new t.BluetoothLeWeb())
}), In = () => {
  let t = Promise.resolve();
  return (e) => new Promise((n, s) => {
    t = t.then(() => e()).then(n).catch(s);
  });
};
function it(t) {
  return t ? In() : (e) => e();
}
function P(t) {
  if (typeof t != "string")
    throw new Error(`Invalid UUID type ${typeof t}. Expected string.`);
  if (t = t.toLowerCase(), !(t.search(/^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/) >= 0))
    throw new Error(`Invalid UUID format ${t}. Expected 128 bit string (e.g. "0000180d-0000-1000-8000-00805f9b34fb").`);
  return t;
}
class Fn {
  constructor() {
    this.scanListener = null, this.eventListeners = /* @__PURE__ */ new Map(), this.queue = it(!0);
  }
  enableQueue() {
    this.queue = it(!0);
  }
  disableQueue() {
    this.queue = it(!1);
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
      var n;
      const s = "onEnabledChanged";
      await ((n = this.eventListeners.get(s)) === null || n === void 0 ? void 0 : n.remove());
      const i = await w.addListener(s, (a) => {
        e(a.value);
      });
      this.eventListeners.set(s, i), await w.startEnabledNotifications();
    });
  }
  async stopEnabledNotifications() {
    await this.queue(async () => {
      var e;
      const n = "onEnabledChanged";
      await ((e = this.eventListeners.get(n)) === null || e === void 0 ? void 0 : e.remove()), this.eventListeners.delete(n), await w.stopEnabledNotifications();
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
  async requestLEScan(e, n) {
    e = this.validateRequestBleDeviceOptions(e), await this.queue(async () => {
      var s;
      await ((s = this.scanListener) === null || s === void 0 ? void 0 : s.remove()), this.scanListener = await w.addListener("onScanResult", (i) => {
        const a = Object.assign(Object.assign({}, i), { manufacturerData: this.convertObject(i.manufacturerData), serviceData: this.convertObject(i.serviceData), rawAdvertisement: i.rawAdvertisement ? this.convertValue(i.rawAdvertisement) : void 0 });
        n(a);
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
    return e = e.map(P), this.queue(async () => (await w.getConnectedDevices({ services: e })).devices);
  }
  async getBondedDevices() {
    return this.queue(async () => (await w.getBondedDevices()).devices);
  }
  async connect(e, n, s) {
    await this.queue(async () => {
      var i;
      if (n) {
        const a = `disconnected|${e}`;
        await ((i = this.eventListeners.get(a)) === null || i === void 0 ? void 0 : i.remove());
        const o = await w.addListener(a, () => {
          n(e);
        });
        this.eventListeners.set(a, o);
      }
      await w.connect(Object.assign({ deviceId: e }, s));
    });
  }
  async createBond(e, n) {
    await this.queue(async () => {
      await w.createBond(Object.assign({ deviceId: e }, n));
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
  async requestConnectionPriority(e, n) {
    await this.queue(async () => {
      await w.requestConnectionPriority({ deviceId: e, connectionPriority: n });
    });
  }
  async readRssi(e) {
    return await this.queue(async () => {
      const s = await w.readRssi({ deviceId: e });
      return parseFloat(s.value);
    });
  }
  async read(e, n, s, i) {
    return n = P(n), s = P(s), await this.queue(async () => {
      const o = await w.read(Object.assign({
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
      N.getPlatform() !== "web" && (o = Oe(i)), await w.write(Object.assign({
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
      N.getPlatform() !== "web" && (o = Oe(i)), await w.writeWithoutResponse(Object.assign({
        deviceId: e,
        service: n,
        characteristic: s,
        value: o
      }, a));
    });
  }
  async readDescriptor(e, n, s, i, a) {
    return n = P(n), s = P(s), i = P(i), await this.queue(async () => {
      const c = await w.readDescriptor(Object.assign({
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
      N.getPlatform() !== "web" && (c = Oe(a)), await w.writeDescriptor(Object.assign({
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
      const d = await w.addListener(c, (l) => {
        i(this.convertValue(l?.value));
      });
      this.eventListeners.set(c, d), await w.startNotifications(Object.assign({
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
      await ((i = this.eventListeners.get(a)) === null || i === void 0 ? void 0 : i.remove()), this.eventListeners.delete(a), await w.stopNotifications({
        deviceId: e,
        service: n,
        characteristic: s
      });
    });
  }
  validateRequestBleDeviceOptions(e) {
    return e = Object.assign({}, e), e.services && (e.services = e.services.map(P)), e.optionalServices && (e.optionalServices = e.optionalServices.map(P)), e.serviceData && N.getPlatform() !== "web" && (e.serviceData = e.serviceData.map((n) => Object.assign(Object.assign({}, n), { serviceUuid: P(n.serviceUuid), dataPrefix: Fe(n.dataPrefix), mask: Fe(n.mask) }))), e.manufacturerData && (N.getPlatform() !== "web" ? e.manufacturerData = e.manufacturerData.map((n) => Object.assign(Object.assign({}, n), { dataPrefix: Fe(n.dataPrefix), mask: Fe(n.mask) })) : e.manufacturerData = e.manufacturerData.map((n) => Object.assign(Object.assign({}, n), { dataPrefix: Ft(n.dataPrefix), mask: Ft(n.mask) }))), e;
  }
  convertValue(e) {
    return typeof e == "string" ? Pe(e) : e === void 0 ? new DataView(new ArrayBuffer(0)) : e;
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
const ge = new Fn(), at = 256, rt = 10, Bn = 4e3;
class Xt {
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
    this.setStatus("live"), this.sampleFns.forEach((s) => s(n)), this.lostTimer && clearTimeout(this.lostTimer), this.lostTimer = setTimeout(() => this.setStatus("lost"), Bn);
  }
  clearLost() {
    this.lostTimer && clearTimeout(this.lostTimer), this.lostTimer = null;
  }
}
function Bt(t) {
  let e = "";
  for (let n = 0; n < t.byteLength; n++) e += t.getUint8(n).toString(16).padStart(2, "0") + " ";
  return e.trim();
}
function qt(t, e) {
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
function qn(t) {
  return t.byteLength < rt + 2 ? null : (t.getUint8(rt) << 8 | t.getUint8(rt + 1)) / 100;
}
class De extends Xt {
  constructor() {
    super(...arguments), this.name = "WeiHeng scale", this.scanning = !1, this.seen = /* @__PURE__ */ new Map(), this.onSeen = () => {
    }, this.lastScanStart = 0, this.healTimer = null, this.lastPacketAt = 0, this.restarts = 0;
  }
  async start() {
    if (!N.isNativePlatform())
      throw new Error("Bluetooth scanning needs the Android build. Use the simulator in the browser.");
    if (await ge.initialize({ androidNeverForLocation: !0 }), !await ge.isEnabled().catch(() => !0))
      try {
        await ge.requestEnable();
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
        await ge.stopLEScan();
      } catch {
      }
      await new Promise((e) => setTimeout(e, 300)), this.restarts++;
    }
    this.setStatus("scanning"), this.scanning = !0, this.lastScanStart = Date.now(), await ge.requestLEScan(
      { allowDuplicates: !0, scanMode: gt.SCAN_MODE_LOW_LATENCY },
      (e) => {
        const n = e.localName ?? e.device.name ?? "", s = e.manufacturerData ?? {}, i = Object.keys(s);
        let a = s[String(at)] ?? s[at.toString(16)];
        !a && /^(IF_|WH-|WEIHENG)/i.test(n) && i.length && (a = s[i[0]]), !a && e.rawAdvertisement && (a = qt(e.rawAdvertisement, at) ?? (/^IF_/i.test(n) ? qt(e.rawAdvertisement) : void 0));
        const o = a ? qn(a) : null, c = { id: e.device.deviceId, name: n, rssi: e.rssi ?? 0, keys: i.join(","), hex: a ? Bt(a) : e.rawAdvertisement ? Bt(e.rawAdvertisement).slice(0, 60) : "", kg: o, t: Date.now() };
        this.seen.set(c.id, c), this.onSeen(c), o !== null && (this.lastPacketAt = Date.now(), this.emitRaw(o));
      }
    );
  }
  async stop() {
    if (this.healTimer && (clearInterval(this.healTimer), this.healTimer = null), this.scanning)
      try {
        await ge.stopLEScan();
      } catch {
      }
    this.scanning = !1, this.clearLost(), this.setStatus("idle");
  }
}
class Nn extends Xt {
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
const jn = { both: "", left: "Left", right: "Right" }, Un = { complete: "", concentric: "Concentric", eccentric: "Eccentric" };
function Se(t, e, n, s, i, a) {
  const o = [s?.trim() ?? "", jn[e] ?? "", Un[n ?? "complete"] ?? "", (i ?? 0) > 1 ? `${i} links` : "", a ? `+${a} kg` : ""].filter(Boolean);
  return o.length ? `${t} — ${o.join(", ")}` : t;
}
function we(t, e, n, s, i, a) {
  const o = n ?? "complete", c = s?.trim() ?? "", d = (i ?? 0) > 1 ? i : 0, l = a ?? 0;
  let h = o === "complete" && !c && !d && !l ? `${t}|${e}` : `${t}|${e}|${o}`;
  return (c || d || l) && (h += `|${c}`), (d || l) && (h += `|${d}L`), l && (h += `|${l}E`), h;
}
function Zt(t, e, n, s, i, a, o) {
  return t.exercise === e && t.side === n && (t.contraction ?? "complete") === (s ?? "complete") && (t.handle ?? "") === (i?.trim() ?? "") && Math.max(1, t.links ?? 1) === Math.max(1, a ?? 1) && (t.extKg ?? 0) === (o ?? 0);
}
function be(t) {
  return t.manualReps && t.manualReps > 0 ? Math.round(t.manualReps) : 1;
}
function pe(t) {
  return t.performedAt ?? t.startedAt;
}
const Ue = 2;
class Vn {
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
    const s = Qt(n);
    return {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      exercise: e.exercise,
      side: e.side,
      contraction: e.contraction ?? "complete",
      handle: e.handle?.trim() || void 0,
      links: e.links || void 0,
      extKg: e.extKg || void 0,
      offsetKg: e.offsetKg || void 0,
      mode: e.mode,
      startedAt: this.t0,
      durationS: n[n.length - 1].t,
      samples: n,
      ...s,
      reps: Et(n)
    };
  }
}
function Qt(t) {
  let e = 0, n = 0, s = 0;
  for (let c = 0; c < t.length; c++) {
    const d = Math.max(0, t[c].kg);
    e = Math.max(e, d), n += d, c > 0 && (s += d * (t[c].t - t[c - 1].t));
  }
  const i = n / t.length, a = t.filter((c) => c.kg > Ue);
  let o = 0;
  if (a.length >= 10) {
    const c = Math.max(3, Math.floor(a.length * 0.2)), d = Math.max(...a.slice(0, c).map((h) => h.kg)), l = Math.max(...a.slice(-c).map((h) => h.kg));
    o = d > 0 ? Math.max(0, (d - l) / d * 100) : 0;
  }
  return { peak: q(e), avg: q(i), output: q(s), inroad: q(o) };
}
function Et(t) {
  if (t.length < 5) return [];
  const e = Math.max(...t.map((l) => l.kg));
  if (e < Ue * 2) return [];
  const n = Math.max(Ue, e * 0.35), s = Math.max(Ue * 0.5, e * 0.2), i = [];
  let a = !1, o = 0, c = 0, d = 0;
  for (const l of t)
    !a && l.kg >= n ? (a = !0, o = l.t, c = l.kg, d = l.t) : a && (l.kg > c && (c = l.kg, d = l.t), l.kg <= s && (l.t - o >= 0.6 && i.push({ index: i.length + 1, peak: q(c), peakT: q(d), startS: q(o), endS: q(l.t), durationS: q(l.t - o) }), a = !1));
  if (a) {
    const l = t[t.length - 1].t;
    l - o >= 0.6 && i.push({ index: i.length + 1, peak: q(c), peakT: q(d), startS: q(o), endS: q(l), durationS: q(l - o) });
  }
  return i.length >= 2 ? i : [];
}
function Hn(t) {
  if (t.length < 6) return null;
  const e = t.slice(-Math.max(3, Math.floor(t.length / 3)));
  return q(e.reduce((n, s) => n + s.peak, 0) / e.length);
}
function q(t) {
  return Math.round(t * 100) / 100;
}
class en {
  constructor(e) {
    this.canvas = e, this.dpr = Math.max(1, window.devicePixelRatio || 1), this.opts = { windowS: 60, zone: null, ghost: null, marks: [] }, this.last = null, this.ctx = e.getContext("2d"), this.resize(), new ResizeObserver(() => this.resize()).observe(e.parentElement ?? e);
  }
  resize() {
    const e = this.canvas.parentElement ?? this.canvas, n = e.clientWidth || 320, i = getComputedStyle(e).getPropertyValue("--chart-fill").trim() === "1" ? Math.max(140, e.clientHeight - 12) : Math.max(220, Math.min(380, Math.round(n * 0.6)));
    this.canvas.width = n * this.dpr, this.canvas.height = i * this.dpr, this.canvas.style.width = `${n}px`, this.canvas.style.height = `${i}px`, this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0), this.last && this.render(...this.last);
  }
  draw(e, n, s) {
    this.last = [e, n, s], this.render(e, n, s);
  }
  render(e, n, s) {
    const { ctx: i } = this, a = this.canvas.width / this.dpr, o = this.canvas.height / this.dpr, c = 42, d = 12, l = 12, h = 24, f = a - c - d, g = o - l - h, m = getComputedStyle(document.getElementById("view-force") ?? document.documentElement), y = m.getPropertyValue("--muted").trim() || "#888", u = m.getPropertyValue("--grid").trim() || "#333", p = m.getPropertyValue("--accent").trim() || "#e8552f", b = m.getPropertyValue("--ghost").trim() || "#7a7a7a", O = m.getPropertyValue("--zone").trim() || "rgba(60,180,90,0.18)";
    i.clearRect(0, 0, a, o);
    const S = Math.max(this.opts.windowS, Math.ceil(n / 10) * 10 || 10), A = this.opts.ghost ?? [];
    let V = 10;
    for (const v of e) V = Math.max(V, v.kg);
    for (const v of A) V = Math.max(V, v.kg);
    this.opts.zone && (V = Math.max(V, this.opts.zone.hi)), V = Kn(V * 1.1);
    const j = (v) => c + v / S * f, I = (v) => l + g - Math.max(0, v) / V * g;
    if (this.opts.zone) {
      i.fillStyle = O;
      const v = I(this.opts.zone.hi), E = I(this.opts.zone.lo);
      i.fillRect(c, v, f, E - v);
    }
    i.strokeStyle = u, i.lineWidth = 1, i.fillStyle = y, i.font = "11px system-ui, sans-serif", i.textAlign = "right", i.textBaseline = "middle";
    const D = 5;
    for (let v = 0; v <= D; v++) {
      const E = V / D * v, $ = I(E);
      i.beginPath(), i.moveTo(c, $), i.lineTo(a - d, $), i.stroke(), i.fillText(E.toFixed(0), c - 6, $);
    }
    i.textAlign = "center", i.textBaseline = "top";
    const F = S <= 30 ? 5 : S <= 90 ? 10 : 30;
    for (let v = 0; v <= S; v += F) {
      const E = j(v);
      i.beginPath(), i.moveTo(E, l), i.lineTo(E, l + g), i.stroke(), i.fillText(Wn(v), E, l + g + 6);
    }
    if (this.opts.marks?.length) {
      i.strokeStyle = b, i.setLineDash([3, 4]);
      for (const v of this.opts.marks)
        i.beginPath(), i.moveTo(j(v), l), i.lineTo(j(v), l + g), i.stroke();
      i.setLineDash([]);
    }
    if (A.length > 1 && (i.strokeStyle = b, i.lineWidth = 1.5, i.globalAlpha = 0.55, i.beginPath(), A.forEach((v, E) => E ? i.lineTo(j(v.t), I(v.kg)) : i.moveTo(j(v.t), I(v.kg))), i.stroke(), i.globalAlpha = 1), e.length > 1) {
      i.strokeStyle = p, i.lineWidth = 2.5, i.lineJoin = "round", i.beginPath(), e.forEach(($, L) => L ? i.lineTo(j($.t), I($.kg)) : i.moveTo(j($.t), I($.kg))), i.stroke();
      const v = e[e.length - 1];
      i.lineTo(j(v.t), I(0)), i.lineTo(j(e[0].t), I(0)), i.closePath(), i.fillStyle = p, i.globalAlpha = 0.12, i.fill(), i.globalAlpha = 1;
      const E = this.opts.peaks ?? [];
      if (E.length) {
        const $ = Math.max(...E.map((L) => L.kg));
        i.font = "bold 11px system-ui, sans-serif", i.textAlign = "center", i.textBaseline = "bottom";
        for (const L of E) {
          const ue = j(L.t), de = I(L.kg);
          i.fillStyle = L.kg === $ ? p : "#ecebe6", i.beginPath(), i.arc(ue, de, 3.5, 0, Math.PI * 2), i.fill();
          const $t = L.kg.toFixed(0), Ie = i.measureText($t).width + 8, Pt = Math.min(Math.max(ue, c + Ie / 2), c + f - Ie / 2), Ot = Math.max(l + 14, de - 6);
          i.fillStyle = L.kg === $ ? p : "rgba(40,42,48,0.92)", i.fillRect(Pt - Ie / 2, Ot - 14, Ie, 14), i.fillStyle = "#fff", i.fillText($t, Pt, Ot - 1);
        }
        i.textAlign = "left", i.textBaseline = "alphabetic";
      }
      i.fillStyle = p, i.beginPath(), i.arc(j(v.t), I(v.kg), 4, 0, Math.PI * 2), i.fill();
    } else s > 0 && (i.fillStyle = p, i.beginPath(), i.arc(j(0), I(s), 4, 0, Math.PI * 2), i.fill());
  }
}
function Kn(t) {
  const e = [10, 20, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500];
  for (const n of e) if (t <= n) return n;
  return Math.ceil(t / 100) * 100;
}
function Wn(t) {
  const e = Math.floor(t / 60), n = t % 60;
  return `${e}:${n.toString().padStart(2, "0")}`;
}
function et(t, e = {}) {
  const n = e.hold ?? 10, s = e.rest ?? 20, i = e.reps ?? 6, a = e.ramp ?? 5, o = e.total ?? 60;
  switch (t) {
    case "free":
      return { id: t, label: "Free set", describe: "Open-ended. Start, work, stop.", phases: [] };
    case "offset":
      return { id: t, label: "Offset capture", describe: `Hang from the scale and stay still. When the raw reading holds steady for ${e.steady ?? 5} s, that value is proposed as the offset (e.g. your body weight) — you confirm, nothing is logged.`, phases: [] };
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
      return et("free");
  }
}
function tn(t) {
  if (!t.repeat || t.phases.length < 2) return t.phases;
  const [e, ...n] = t.phases, s = [e];
  for (let i = 0; i < t.repeat; i++)
    for (const a of n)
      i === t.repeat - 1 && a === n[n.length - 1] && a.cue === "rest" || s.push({ ...a, name: n.length > 1 && a.cue !== "rest" ? `${a.name} ${i + 1}/${t.repeat}` : a.name });
  return s;
}
class zn {
  constructor() {
    this.timeline = [], this.idx = -1, this.phaseStart = 0, this.timer = null, this.running = !1, this.onPhase = () => {
    }, this.onTick = () => {
    }, this.onDone = () => {
    };
  }
  start(e) {
    this.timeline = tn(e), this.idx = -1, this.running = !0, this.next(), this.timer = setInterval(() => this.tick(), 100);
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
var Nt;
(function(t) {
  t[t.Flush = 0] = "Flush", t[t.Add = 1] = "Add";
})(Nt || (Nt = {}));
const Be = ie("TextToSpeech", {
  web: () => Promise.resolve().then(() => $s).then((t) => new t.TextToSpeechWeb())
}), qe = N.isNativePlatform();
let ot = null;
function Gn() {
  return ot || (ot = new (window.AudioContext || window.webkitAudioContext)()), ot;
}
function re(t = 880, e = 120, n = 0.25) {
  try {
    const s = Gn(), i = s.createOscillator(), a = s.createGain();
    i.frequency.value = t, i.type = "sine", a.gain.value = n, i.connect(a), a.connect(s.destination), i.start(), a.gain.exponentialRampToValueAtTime(1e-4, s.currentTime + e / 1e3), i.stop(s.currentTime + e / 1e3);
  } catch {
  }
}
const Y = {
  go: () => re(1200, 220, 0.3),
  rest: () => re(500, 220, 0.25),
  tick: () => re(900, 60, 0.15),
  done: () => {
    re(1e3, 120), setTimeout(() => re(1300, 160), 140), setTimeout(() => re(1600, 220), 320);
  },
  inZone: () => re(1e3, 50, 0.1),
  outZone: () => re(300, 120, 0.2)
};
class Yn {
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
    if (qe) return this.nativeBusy;
    try {
      return speechSynthesis.speaking || speechSynthesis.pending ? (this.busySince || (this.busySince = Date.now()), Date.now() - this.busySince > 4e3 ? (this.reset(), !1) : !0) : (this.busySince = 0, !1);
    } catch {
      return !1;
    }
  }
  /** Hard reset of the engine. */
  reset() {
    if (qe) {
      Be.stop().catch(() => {
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
    if (qe)
      try {
        return `${(await Be.getSupportedVoices()).voices.length} native voices`;
      } catch {
        return "native TTS unavailable";
      }
    if (!("speechSynthesis" in window)) return "no speech engine in this browser — open in Chrome";
    const e = speechSynthesis.getVoices().length;
    return e ? `${e} voices` : "no voices installed";
  }
  say(e, n = !1, s = !1) {
    if (!this.enabled) return;
    if (this.onSpeak(e), qe) {
      if (this.nativeBusy && !n) return;
      this.nativeBusy = !0, (n ? Be.stop().catch(() => {
      }) : Promise.resolve()).then(() => Be.speak({ text: e, lang: "en-US", rate: this.rate, pitch: this.pitch, volume: 1, category: "ambient" })).catch(() => {
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
function Jn(t) {
  const e = Math.floor(t / 60), n = t % 60;
  return n === 0 && e > 0 ? e === 1 ? "1 minute" : `${e} minutes` : String(n);
}
const jt = ie("KeepAwake", {
  web: () => Promise.resolve().then(() => Os).then((t) => new t.KeepAwakeWeb())
}), nn = ie("Preferences", {
  web: () => Promise.resolve().then(() => Ts).then((t) => new t.PreferencesWeb())
}), Ee = "ufl.sets.v1", Ne = "ufl.max.v1", ct = "ufl.exercises.v1", sn = [
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
function Xn(t) {
  return /^SR\b|self.?resisted/i.test(t) ? "self-resisted" : "iso";
}
async function lt(t, e) {
  try {
    const n = N.isNativePlatform() ? (await nn.get({ key: t })).value : localStorage.getItem(t);
    return n ? JSON.parse(n) : e;
  } catch {
    return e;
  }
}
async function ne(t, e) {
  const n = JSON.stringify(e);
  N.isNativePlatform() ? await nn.set({ key: t, value: n }) : localStorage.setItem(t, n);
}
const _ = {
  async sets() {
    return lt(Ee, []);
  },
  async saveSet(t) {
    const e = await this.sets();
    e.push(t), await ne(Ee, e.slice(-500));
  },
  async updateSet(t) {
    const e = await this.sets(), n = e.findIndex((s) => s.id === t.id);
    n >= 0 ? e[n] = t : e.push(t), await ne(Ee, e);
  },
  async deleteSet(t) {
    const e = await this.sets();
    await ne(Ee, e.filter((n) => n.id !== t));
  },
  async maxes() {
    return lt(Ne, {});
  },
  async setMax(t, e) {
    const n = await this.maxes();
    n[t] = { kg: e, at: Date.now() }, await ne(Ne, n);
  },
  async deleteMax(t) {
    const e = await this.maxes();
    delete e[t], await ne(Ne, e);
  },
  async exercises() {
    return lt(ct, sn);
  },
  /** Rename an exercise in every stored set and max (and the local list). */
  async renameExercise(t, e) {
    const n = await this.sets();
    for (const o of n) o.exercise === t && (o.exercise = e);
    await ne(Ee, n);
    const s = await this.maxes(), i = {};
    for (const [o, c] of Object.entries(s)) {
      const [d, ...l] = o.split("|"), h = [d === t ? e : d, ...l].join("|");
      (!i[h] || i[h].kg < c.kg) && (i[h] = c);
    }
    await ne(Ne, i);
    const a = await this.exercises();
    if (a.includes(t)) {
      const o = a.map((c) => c === t ? e : c);
      await ne(ct, [...new Set(o)]);
    }
  },
  async saveExercises(t) {
    await ne(ct, t);
  }
};
function Zn(t) {
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
                  const l = await d[i](a);
                  o(l);
                } catch (l) {
                  c(l);
                }
              })();
            };
          }
        });
      }
    }
  );
}
function Qn(t) {
  t.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, n) {
        return t.cordova.plugins[n];
      }
    }
  );
}
function es(t = !1) {
  typeof window > "u" || (window.CapacitorUtils = window.CapacitorUtils || {}, window.Capacitor !== void 0 && !t ? Zn(window) : window.cordova !== void 0 && Qn(window));
}
var mt;
(function(t) {
  t.Documents = "DOCUMENTS", t.Data = "DATA", t.Library = "LIBRARY", t.Cache = "CACHE", t.External = "EXTERNAL", t.ExternalStorage = "EXTERNAL_STORAGE", t.ExternalCache = "EXTERNAL_CACHE", t.LibraryNoCloud = "LIBRARY_NO_CLOUD", t.Temporary = "TEMPORARY";
})(mt || (mt = {}));
var We;
(function(t) {
  t.UTF8 = "utf8", t.ASCII = "ascii", t.UTF16 = "utf16";
})(We || (We = {}));
const ts = ie("Filesystem", {
  web: () => Promise.resolve().then(() => Ms).then((t) => new t.FilesystemWeb())
});
es();
const ns = ie("Share", {
  web: () => Promise.resolve().then(() => Rs).then((t) => new t.ShareWeb())
});
function ss(t) {
  const e = ["id", "date_performed", "recorded_at", "exercise", "side", "contraction", "handle", "links", "external_kg", "offset_kg", "mode", "duration_s", "peak_kg", "avg_kg", "output_kgs", "inroad_pct", "reps", "auto_reps", "rep_peaks"], n = t.map((s) => [
    s.id,
    Me(pe(s)),
    new Date(s.startedAt).toISOString(),
    ut(s.exercise),
    s.side,
    s.contraction ?? "complete",
    ut(s.handle ?? ""),
    s.links ?? 0,
    s.extKg ?? 0,
    s.offsetKg ?? 0,
    s.mode,
    s.durationS.toFixed(1),
    s.peak,
    s.avg,
    s.output,
    s.inroad,
    be(s),
    s.reps?.length ?? 0,
    ut((s.reps ?? []).map((i) => i.peak).join(" "))
  ].join(","));
  return [e.join(","), ...n].join(`
`);
}
function is(t) {
  return ["t_s,kg", ...t.samples.map((e) => `${e.t.toFixed(2)},${e.kg.toFixed(2)}`)].join(`
`);
}
function ut(t) {
  return `"${t.replace(/"/g, '""')}"`;
}
async function vt(t, e, n) {
  if (N.isNativePlatform()) {
    const o = await ts.writeFile({ path: t, data: e, directory: mt.Cache, encoding: We.UTF8 });
    await ns.share({ title: t, files: [o.uri] });
    return;
  }
  const s = new Blob([e], { type: n }), i = URL.createObjectURL(s), a = document.createElement("a");
  a.href = i, a.download = t, document.body.appendChild(a), a.click(), setTimeout(() => {
    URL.revokeObjectURL(i), a.remove();
  }, 500);
}
function Me(t) {
  const e = new Date(t);
  return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
class as {
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
function J() {
  return window.GymLog ?? null;
}
function an(t) {
  return {
    id: `fl-${t.id}`,
    date: Me(pe(t)),
    exercise: Se(t.exercise, t.side, t.contraction, t.handle, t.links, t.extKg),
    kg: t.peak,
    reps: be(t),
    variation: Xn(t.exercise),
    at: t.startedAt,
    dur: t.durationS,
    note: [t.extKg ? `external load ${t.extKg} kg` : "", t.offsetKg ? `offset ${t.offsetKg} kg` : "", t.mode, t.note].filter(Boolean).join(" · ")
  };
}
function rs() {
  const t = J();
  if (t)
    for (const e of sn) t.addExercise(e);
}
let z = null;
const rn = /* @__PURE__ */ new Map();
function os(t) {
  rn.get(t)?.();
}
function he(t) {
  return t.replace(/[&<>"']/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[e]);
}
function dt(t, e) {
  t.classList.add("picker-hidden");
  const n = document.createElement("button");
  n.type = "button", n.className = "picker-btn", t.insertAdjacentElement("afterend", n);
  const s = () => {
    const i = t.value;
    n.textContent = i || (e.allOption?.label ?? "Choose…"), n.disabled = t.disabled;
  };
  return s(), new MutationObserver(s).observe(t, { attributes: !0, childList: !0 }), t.addEventListener("change", s), n.onclick = () => Ut(t, e, s), rn.set(t, () => Ut(t, e, s)), s;
}
function Ut(t, e, n) {
  Le();
  const s = document.getElementById("view-force") ?? document.body;
  z = document.createElement("div"), z.className = "picker-overlay", z.innerHTML = `<div class="picker-panel">
    <div class="picker-head"><input type="text" class="picker-search" placeholder="Search exercises…" autocomplete="off" /><button type="button" class="sm ghost picker-close">✕</button></div>
    <div class="picker-list"></div>
  </div>`, s.appendChild(z);
  const i = z.querySelector(".picker-search"), a = z.querySelector(".picker-list"), o = (d) => {
    t.value = d, t.dispatchEvent(new Event("change", { bubbles: !0 })), n(), Le();
  }, c = () => {
    const d = i.value.trim().toLowerCase(), l = e.recent().filter((m) => !d || m.toLowerCase().includes(d)), h = e.all().filter((m) => !l.includes(m) && (!d || m.toLowerCase().includes(d))).sort((m, y) => m.localeCompare(y));
    let f = "";
    e.allOption && (!d || e.allOption.label.toLowerCase().includes(d)) && (f += `<button type="button" class="picker-item" data-v="${he(e.allOption.value)}">${he(e.allOption.label)}</button>`), l.length && (f += '<div class="picker-group">Recent in Force Lab</div>' + l.map((m) => `<button type="button" class="picker-item" data-v="${he(m)}">${he(m)}</button>`).join("")), h.length && (f += `<div class="picker-group">${l.length ? "All exercises" : "Exercises"}</div>` + h.map((m) => `<button type="button" class="picker-item" data-v="${he(m)}">${he(m)}</button>`).join(""));
    const g = i.value.trim();
    g && e.onCreate && !e.all().some((m) => m.toLowerCase() === g.toLowerCase()) && (f += `<button type="button" class="picker-item picker-create" data-create="1">+ Create "${he(g)}"</button>`), f || (f = '<div class="picker-group">No match</div>'), a.innerHTML = f, a.querySelectorAll(".picker-item").forEach((m) => {
      m.onclick = async () => {
        if (m.dataset.create) {
          const y = i.value.trim();
          await e.onCreate(y) && o(y);
          return;
        }
        o(m.dataset.v);
      };
    });
  };
  i.oninput = c, i.onkeydown = (d) => {
    d.key === "Escape" && Le(), d.key === "Enter" && a.querySelector(".picker-item")?.click();
  }, z.querySelector(".picker-close").onclick = Le, z.onclick = (d) => {
    d.target === z && Le();
  }, c(), setTimeout(() => i.focus(), 50);
}
function Le() {
  z?.remove(), z = null;
}
const r = (t) => document.getElementById(t);
let H = null, X = null, ze = 0, x = [], U = [], oe = null, ce = 0, Z = 0, me = null, K = !0, Te = localStorage.getItem("ufl.ghostOn") !== "0", je = null;
const xe = (t, e) => localStorage.getItem(t) ?? e;
let Ve = Math.max(1, Number(xe("ufl.calloutEvery", "5"))), yt = xe("ufl.calloutOn", "1") === "1", wt = xe("ufl.secBeep", "0") === "1", bt = xe("ufl.secCount", "0") === "1", He = null, ht = -1;
const k = new Yn(), B = new Vn(), se = new zn(), W = new en(r("chart")), Ce = r("progressChart"), cs = {
  countdown: [{ key: "total", label: "seconds", def: 60 }],
  ramp: [{ key: "ramp", label: "ramp s", def: 5 }, { key: "hold", label: "hold s", def: 10 }],
  repeaters: [{ key: "reps", label: "reps", def: 6 }, { key: "hold", label: "on s", def: 10 }, { key: "rest", label: "off s", def: 20 }],
  offset: [{ key: "steady", label: "steady for s", def: 5 }, { key: "tol", label: "± kg", def: 1 }]
};
let Re = null;
function ls(t, e) {
  Re = { active: !0, t0: 0, lo: 0, hi: 0, sum: 0, n: 0, steady: t, tol: e }, Q("rest", "Hang still…", ""), k.say("Hang from the scale and stay still", !0);
}
function us(t) {
  const e = Re;
  if (!e || !e.active) return;
  const n = Date.now();
  if (e.n === 0 || t < e.lo - e.tol || t > e.hi + e.tol || t < 1) {
    e.t0 = n, e.lo = t, e.hi = t, e.sum = t, e.n = t >= 1 ? 1 : 0, r("phaseTime").textContent = "";
    return;
  }
  e.lo = Math.min(e.lo, t), e.hi = Math.max(e.hi, t), e.sum += t, e.n++;
  const s = (n - e.t0) / 1e3;
  if (r("phaseTime").textContent = `${Math.max(0, e.steady - s).toFixed(1)}`, Q("rest", `Steady ${t.toFixed(1)} kg`, `${Math.max(0, e.steady - s).toFixed(1)}`), s >= e.steady) {
    e.active = !1;
    const i = Math.round(e.sum / e.n * 10) / 10;
    K && Y.go(), k.say(`Offset ${i.toFixed(1)} kilograms?`, !0), confirm(`Steady for ${e.steady}s at ${i.toFixed(1)} kg.
Use ${i.toFixed(1)} kg as the offset for ${r("exercise").value}?`) ? (r("offsetKg").value = i.toFixed(1), localStorage.setItem(`ufl.offset.${r("exercise").value}`, String(i)), Q("rest", `Offset set: ${i.toFixed(1)} kg`, "")) : Q("rest", "Offset not changed", ""), on();
  }
}
function on() {
  Re = null, r("btnStop").classList.add("hidden"), r("btnStart").classList.remove("hidden"), ke(!1);
}
function Ge() {
  const t = r("handle").value;
  return t === "__custom" ? "" : t;
}
function _e() {
  return Math.max(1, Math.floor(Number(r("links").value) || 1));
}
let cn = 0;
function Ye() {
  return Math.max(0, Math.round((Number(r("offsetKg").value) || 0) * 10) / 10);
}
function Je() {
  return Math.max(0, Math.round((Number(r("extKg").value) || 0) * 2) / 2);
}
function fe() {
  const t = r("exercise").value || "Choose exercise", e = r("side").value, n = r("protocol").value, s = r("contraction").value;
  r("hdrExName").textContent = r("exercise").value ? Se(t, e, s, Ge(), _e(), Je()) : t, r("hdrExMeta").textContent = n;
}
async function ds(t, e) {
  const n = J();
  if (n) {
    if (!n.renameExercise(t, e)) return;
    x = n.exerciseNames();
  } else
    await ln(t, e), x = await _.exercises();
  le(), ee(), te(), await T();
}
async function ln(t, e) {
  await _.renameExercise(t, e), U = await _.sets(), r("exercise").value === t && (le(), r("exercise").value = e);
}
async function hs() {
  rs(), x = J()?.exerciseNames() ?? await _.exercises(), U = await _.sets(), le(), dn(), await T(), te(), ee(), ks(), wn(), k.enabled = r("voiceOn").checked;
}
function ft() {
  const t = /* @__PURE__ */ new Map();
  for (const e of U) t.set(e.exercise, Math.max(t.get(e.exercise) ?? 0, e.startedAt));
  for (const e of Object.keys(un)) {
    const n = e.split("|")[0];
    t.has(n) || t.set(n, 0);
  }
  return [...t.entries()].filter(([e]) => x.includes(e)).sort((e, n) => n[1] - e[1]).map(([e]) => e);
}
let un = {};
async function Vt(t) {
  if (t = t.trim(), !t) return !1;
  if (!x.includes(t)) {
    const e = J();
    e ? (e.addExercise(t), x = e.exerciseNames()) : (x.push(t), await _.saveExercises(x));
  }
  return le(), ee(), !0;
}
function le() {
  setTimeout(fe, 0);
  for (const n of ["exercise", "maxExercise"]) {
    const s = r(n), i = s.value;
    s.innerHTML = x.map((a) => `<option>${M(a)}</option>`).join(""), i && x.includes(i) && (s.value = i);
  }
  const t = r("histExercise"), e = t.value;
  t.innerHTML = '<option value="">All</option>' + x.map((n) => `<option>${M(n)}</option>`).join(""), t.value = e;
}
function dn() {
  const t = r("protocol").value, e = r("params");
  e.innerHTML = (cs[t] ?? []).map((n) => `<label>${n.label}<input type="number" data-k="${n.key}" value="${n.def}" min="1" /></label>`).join(""), r("protocolHelp").textContent = et(t, Xe()).describe;
}
function Xe() {
  const t = {};
  return r("params").querySelectorAll("input").forEach((e) => t[e.dataset.k] = Number(e.value) || 1), t;
}
async function T() {
  const t = r("exercise").value, e = r("side").value, n = r("contraction").value, s = Ge(), i = _e(), a = Je(), o = U.filter((h) => Zt(h, t, e, n, s, i, a));
  oe = o.length ? o[o.length - 1] : null, ce = o.reduce((h, f) => Math.max(h, f.output), 0);
  const c = await _.maxes();
  un = c;
  const d = o.reduce((h, f) => Math.max(h, f.peak), 0), l = r("zoneRef").value;
  if (Z = l === "last" ? oe?.peak ?? 0 : l === "maxtest" ? c[we(t, e, n, s, i, a)]?.kg ?? 0 : Math.max(c[we(t, e, n, s, i, a)]?.kg ?? 0, d), !B.recording) {
    const h = o.reduce((f, g) => Math.max(f, g.peak), 0);
    r("sPeak").textContent = oe ? C(oe.peak) : "–", r("dPeak").innerHTML = oe ? `<span class="muted">last · best ${C(h)} kg</span>` : '<span class="muted">no previous set</span>';
  }
  r("zoneMax").textContent = Z ? `(${l === "last" ? "last" : l === "maxtest" ? "max test" : "best"} ${Z.toFixed(1)} kg → ${Ke().lo.toFixed(1)}–${Ke().hi.toFixed(1)} kg)` : l === "maxtest" ? "(no Max test for this exercise yet)" : "(no previous set for this exercise yet)", r("sGoal").textContent = ce ? C(ce) : "–", W.opts.ghost = Te ? oe?.samples ?? null : null, W.opts.zone = Lt() ? Ke() : null, B.recording || (W.opts.marks = []);
}
function Lt() {
  return r("zoneOn").checked && Z > 0;
}
function Ke() {
  const t = Number(r("zoneLo").value) / 100 * Z, e = Number(r("zoneHi").value) / 100 * Z;
  return { lo: Math.min(t, e), hi: Math.max(t, e) };
}
async function xt(t) {
  H && await H.stop(), H = t, t.onStatus(Ze), t.onSample((e) => {
    if (cn = e.kg, Re?.active) {
      us(e.kg);
      return;
    }
    const n = Ye(), s = n ? { ...e, kg: Math.max(0, e.kg - n) } : e;
    ze = s.kg, G === "live" && (r("statusKg").textContent = n ? `${s.kg.toFixed(1)} kg (raw ${e.kg.toFixed(1)})` : `${s.kg.toFixed(1)} kg`), B.push(s), fs(s.kg);
  });
  try {
    await t.start(), r("btnTare").disabled = !1, r("btnStart").disabled = !1;
  } catch (e) {
    Ze("error"), r("statusText").textContent = e.message, alert("Connect failed: " + e.message);
  }
}
let G = "idle";
function hn() {
  return localStorage.getItem("ufl.keepAwake") !== "0";
}
function fn() {
  if (!N.isNativePlatform()) return;
  (hn() && (G === "live" || G === "scanning" || G === "lost") ? jt.keepAwake() : jt.allowSleep()).catch(() => {
  });
}
function Ze(t) {
  G = t, fn(), r("statusDot").className = `dot ${t}`, r("statusPill").className = `pill ${t}`;
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
function pn() {
  return localStorage.getItem("ufl.autoConnect") !== "0";
}
let Qe = !1, kt = !1, pt = !1;
function St() {
  if (!pn() || !N.isNativePlatform() || H instanceof De || X || kt || Qe && G === "error") return;
  Qe = !0;
  const t = new De();
  t.onSeen = () => xn(t), r("simPanel").classList.add("hidden"), xt(t);
}
let Ht = 0;
function fs(t) {
  if (!B.recording || !Lt()) {
    me = null;
    return;
  }
  const e = se.running ? se.current() : null;
  if (e && e.cue === "rest") {
    me = null;
    return;
  }
  const n = Ke(), s = t >= n.lo && t <= n.hi, i = r("phaseBanner");
  s && me !== "in" && (me = "in", i.classList.add("inzone"), i.classList.remove("outzone"), k.say("in zone")), !s && me !== "out" && (me = "out", i.classList.add("outzone"), i.classList.remove("inzone"), t > 2 && k.say(t < n.lo ? "more" : "ease off"), K && t > 2 && Date.now() - Ht > 1500 && (Y.outZone(), Ht = Date.now()));
}
let Ct = null, ve = null;
function ps() {
  const t = Math.max(0, Math.floor(Number(r("preCount").value) || 0));
  if (!t || r("protocol").value === "offset") {
    Kt();
    return;
  }
  k.unlock(), r("btnStart").classList.add("hidden"), r("btnStop").classList.remove("hidden"), r("btnStop").textContent = "Cancel", ke(!0);
  let e = t;
  const n = () => {
    Q("rest", "Get ready", String(e)), e > 0 && (k.say(String(e), !0), K && Y.tick());
  };
  n(), ve = setInterval(() => {
    if (e--, e <= 0) {
      clearInterval(ve), ve = null, r("btnStop").textContent = "Stop", Kt();
      return;
    }
    n();
  }, 1e3);
}
function gs() {
  return ve ? (clearInterval(ve), ve = null, r("btnStop").textContent = "Stop", r("btnStop").classList.add("hidden"), r("btnStart").classList.remove("hidden"), ke(!1), Q("rest", "Ready", ""), !0) : !1;
}
function Kt() {
  Ct = null;
  const t = r("protocol").value;
  if (t === "offset") {
    if (!H) {
      alert("Connect the scale (or the simulator) first.");
      return;
    }
    const s = Xe();
    r("summary").classList.add("hidden"), r("btnStart").classList.add("hidden"), r("btnStop").classList.remove("hidden"), ke(!0), ls(Math.max(1, s.steady || 5), Math.max(0.1, s.tol || 1));
    return;
  }
  const e = et(t, Xe());
  r("summary").classList.add("hidden"), B.start(), k.unlock(), ys(), W.opts.marks = [], W.opts.peaks = [];
  const n = e.phases.length ? tn(e).reduce((s, i) => s + i.seconds, 0) : 60;
  W.opts.windowS = Math.max(10, Math.ceil(n / 10) * 10), r("btnStart").classList.add("hidden"), r("btnStop").classList.remove("hidden"), ke(!0), e.phases.length ? (se.onPhase = ms, se.onTick = vs, se.onDone = () => gn(), se.start(e)) : (Q("work", "Free set — go", ""), k.say("Go", !0), K && Y.go());
}
function ms(t, e, n) {
  Q(t.cue, t.name, t.seconds.toFixed(0)), t.cue === "work" ? (K && Y.go(), k.say(t.name.replace(/\d+\/\d+/, ""), !0), W.opts.marks.push(B.elapsed())) : t.cue === "ramp" ? (K && Y.go(), k.say("Build up", !0)) : (e > 0 && K && Y.rest(), e > 0 && k.say(e === n - 1 ? "Done" : "Rest", !0));
}
let Wt = -1;
function vs(t, e) {
  r("phaseTime").textContent = t.toFixed(t < 10 ? 1 : 0);
  const n = Math.ceil(t);
  n !== Wt && (Wt = n, n <= 3 && n > 0 && K && Y.tick());
}
async function gn() {
  if (gs()) return;
  if (Re) {
    on(), Q("rest", "Offset capture cancelled", "");
    return;
  }
  se.stop(), mn();
  const t = r("exercise").value, e = r("side").value, n = r("protocol").value, s = r("contraction").value, i = B.finish({ exercise: t, side: e, mode: n, contraction: s, handle: Ge(), links: _e(), extKg: Je(), offsetKg: Ye() });
  i && i.manualReps === void 0 && (i.reps?.length ?? 0) >= 2 && (i.manualReps = i.reps.length), Ct = i, r("btnStop").classList.add("hidden"), r("btnStart").classList.remove("hidden"), ke(!1), Q("idle", "Done", "—"), K && Y.done(), i && (n === "maxtest" && i.peak > 0 && (await _.setMax(we(t, e, s, Ge(), _e(), Je()), i.peak), k.say(`New max ${i.peak.toFixed(0)} kilos`, !0)), await _.saveSet(i), U.push(i), J()?.upsertForceSet(an(i)), await ws(i), await T(), te(), ee());
}
function ys() {
  mn(), ht = -1, He = setInterval(() => {
    if (!B.recording) return;
    const t = Math.floor(B.elapsed());
    if (t === ht || t === 0) return;
    ht = t;
    const e = se.running ? se.current() : null;
    if (e && e.cue !== "work") return;
    const n = yt && !Lt() && t % Ve === 0;
    (wt && K || n && K) && Y.tick();
    const s = [];
    bt && s.push(Jn(t)), n && s.push(ze.toFixed(0)), s.length && (!n && k.speaking() || k.say(s.join(", "), n, !0));
  }, 100);
}
function mn() {
  He && clearInterval(He), He = null;
}
function ke(t) {
  for (const e of ["exercise", "side", "protocol", "contraction", "handle", "links", "extKg", "offsetKg", "preCount"]) r(e).disabled = t;
}
function Q(t, e, n) {
  const s = r("phaseBanner");
  s.className = `banner ${t}`, r("phaseName").textContent = e, r("phaseTime").textContent = n;
}
async function ws(t) {
  const e = oe, n = await _.maxes(), s = t.side === "left" ? "right" : t.side === "right" ? "left" : null, i = [];
  t.extKg && i.push(R("External load", `+${t.extKg} kg (not measured by the scale)`)), t.offsetKg && i.push(R("Offset", `−${t.offsetKg} kg subtracted from every reading`)), i.push(R("Duration", `${t.durationS.toFixed(1)} s`)), i.push(R("Peak force", `${C(t.peak)} kg`, Ae(t.peak, e?.peak))), i.push(R("Intensity (avg)", `${C(t.avg)} kg`, Ae(t.avg, e?.avg))), i.push(R("Output (kg·s)", C(t.output), Ae(t.output, e?.output))), i.push(R("Inroad", `${t.inroad.toFixed(0)}%`, t.inroad >= 30 ? '<span class="badge good">deep fatigue</span>' : t.inroad >= 15 ? '<span class="badge">moderate</span>' : '<span class="badge warn">shallow — stopped early?</span>')), ce && i.push(R("vs. best output", `${(t.output / ce * 100).toFixed(0)}%`, t.output > ce ? '<span class="badge good">new best</span>' : "")), Z && i.push(R("Peak as % of max", `${(t.peak / Z * 100).toFixed(0)}%`));
  let a = "";
  if (t.reps && t.reps.length) {
    const d = Math.max(...t.reps.map((h) => h.peak));
    a = `<div class="muted" style="margin-top:8px">Reps: ${t.reps.length} · first ${C(t.reps[0].peak)} → last ${C(t.reps[t.reps.length - 1].peak)} kg · avg rep ${(t.reps.reduce((h, f) => h + f.durationS, 0) / t.reps.length).toFixed(1)} s</div>
      <div class="repbars">${t.reps.map((h) => `<div style="height:${Math.max(4, h.peak / d * 100)}%"><span>${h.peak.toFixed(0)}</span></div>`).join("")}</div>`;
    const l = t.mode === "critical" ? Hn(t.reps) : null;
    l && (a += R("Critical force", `${C(l)} kg${Z ? ` (${(l / Z * 100).toFixed(0)}% of max)` : ""}`));
  }
  let o = "";
  if (s) {
    const d = (f) => U.filter((g) => Zt(g, t.exercise, f, t.contraction, t.handle, t.links, t.extKg)).reduce((g, m) => Math.max(g, m.peak), 0), l = Math.max(n[we(t.exercise, t.side, t.contraction, t.handle, t.links, t.extKg)]?.kg ?? 0, d(t.side)) || void 0, h = Math.max(n[we(t.exercise, s, t.contraction, t.handle, t.links, t.extKg)]?.kg ?? 0, d(s)) || void 0;
    if (l && h) {
      const f = (Math.abs(l - h) / Math.max(l, h) * 100).toFixed(0);
      o = R("Left/right gap", `${f}% (L ${C(t.side === "left" ? l : h)} / R ${C(t.side === "left" ? h : l)})`, Number(f) > 10 ? '<span class="badge warn">asymmetry</span>' : '<span class="badge good">balanced</span>');
    }
  }
  const c = r("summary");
  c.innerHTML = `<h4>${M(Se(t.exercise, t.side, t.contraction, t.handle, t.links, t.extKg))} · ${t.mode}</h4>${i.join("")}${o}${a}
    ${vn(t, "sum")}`, c.classList.remove("hidden"), yn(t, "sum", async () => {
    await T(), te();
  });
}
function vn(t, e) {
  const n = Me(pe(t));
  return `<div class="editor">
      <label>Reps <input type="number" id="${e}Reps" min="1" step="1" inputmode="numeric" placeholder="1" value="${t.manualReps ?? ""}" /></label>
      <label>Date performed <input type="date" id="${e}Date" value="${n}" max="${Me(Date.now())}" /></label>
      <label class="grow">Note <input type="text" id="${e}Note" placeholder="optional" value="${M(t.note ?? "")}" /></label>
      <button class="sm primary" id="${e}Save" type="button">Save</button>
      <span class="muted" id="${e}Msg">${t.reps?.length ? `auto-detected ${t.reps.length} — change it if that's wrong` : "blank reps = 1"}</span>
    </div>`;
}
function yn(t, e, n) {
  const s = async () => {
    const i = Number(r(`${e}Reps`).value);
    t.manualReps = i > 0 ? Math.round(i) : void 0;
    const a = r(`${e}Date`).value;
    if (a) {
      const [c, d, l] = a.split("-").map(Number), h = new Date(t.startedAt);
      t.performedAt = new Date(c, d - 1, l, h.getHours(), h.getMinutes(), h.getSeconds()).getTime();
    }
    t.note = r(`${e}Note`).value.trim() || void 0, await _.updateSet(t), J()?.upsertForceSet(an(t));
    const o = U.findIndex((c) => c.id === t.id);
    o >= 0 && (U[o] = t), r(`${e}Msg`).textContent = `saved · ${be(t)} rep${be(t) === 1 ? "" : "s"} · ${Me(pe(t))}`, await n();
  };
  r(`${e}Save`).onclick = s;
  for (const i of [`${e}Reps`, `${e}Date`, `${e}Note`]) r(i).onkeydown = (a) => {
    a.key === "Enter" && s();
  };
}
function R(t, e, n = "") {
  return `<div class="fl-line"><span>${t}</span><span>${e} ${n}</span></div>`;
}
function Ae(t, e) {
  if (!e) return "";
  const n = (t - e) / e * 100;
  return `<span class="${n >= 0 ? "fl-d up" : "fl-d down"}">${n >= 0 ? "+" : ""}${n.toFixed(1)}%</span>`;
}
function wn() {
  const t = B.current(), e = B.recording ? B.elapsed() : Ct?.durationS ?? B.elapsed();
  if (r("liveKg").textContent = ze.toFixed(1), r("elapsed").textContent = kn(e), W.draw(t, e, ze), B.recording && t.length > 2) {
    const n = Qt(t);
    r("sPeak").textContent = C(n.peak), r("sAvg").textContent = C(n.avg), r("sOut").textContent = C(n.output), r("sInroad").textContent = `${n.inroad.toFixed(0)}%`;
    const s = oe;
    r("dPeak").innerHTML = Ae(n.peak, s?.peak), r("dAvg").innerHTML = Ae(n.avg, s?.avg), r("dOut").innerHTML = ce ? `<span class="muted">${(n.output / ce * 100).toFixed(0)}% of goal</span>` : "";
    const i = Et(t);
    W.opts.peaks = i.map((a) => ({ t: a.peakT ?? a.startS, kg: a.peak })), r("sReps").textContent = i.length ? String(i.length) : "–", r("dReps").textContent = i.length ? `last ${i[i.length - 1].peak.toFixed(0)} kg` : "";
  }
  requestAnimationFrame(wn);
}
let $e = null;
function te() {
  const t = r("histExercise").value, e = U.filter((n) => !t || n.exercise === t).slice().sort((n, s) => pe(s) - pe(n) || s.startedAt - n.startedAt);
  r("histBody").innerHTML = e.map((n) => `<tr data-id="${n.id}" class="${$e?.id === n.id ? "sel" : ""}">
      <td>${new Date(pe(n)).toLocaleDateString(void 0, { month: "short", day: "numeric" })}</td>
      <td>${M(Se(n.exercise, n.side, n.contraction, n.handle, n.links, n.extKg))}</td>
      <td>${n.mode}</td><td>${be(n)}</td><td>${kn(n.durationS)}</td><td>${C(n.peak)}</td><td>${C(n.avg)}</td><td>${C(n.output)}</td><td>${n.inroad.toFixed(0)}%</td>
      <td><button data-del="${n.id}">✕</button></td></tr>`).join("") || '<tr><td colspan="10" class="muted">No sets yet.</td></tr>', r("histBody").querySelectorAll("tr[data-id]").forEach((n) => {
    n.onclick = (s) => {
      s.target.dataset.del || ($e = U.find((i) => i.id === n.dataset.id) ?? null, te(), bs());
    };
  }), r("histBody").querySelectorAll("button[data-del]").forEach((n) => {
    n.onclick = async () => {
      confirm("Delete this set?") && (await _.deleteSet(n.dataset.del), J()?.removeForceSet(`fl-${n.dataset.del}`), U = U.filter((s) => s.id !== n.dataset.del), $e?.id === n.dataset.del && ($e = null), te(), await T());
    };
  }), xs(t ? e.slice().reverse() : []);
}
function bs() {
  const t = $e, e = r("histDetail");
  if (!t) {
    e.classList.add("hidden");
    return;
  }
  e.classList.remove("hidden"), e.innerHTML = `<h4>${M(Se(t.exercise, t.side, t.contraction, t.handle, t.links, t.extKg))} · ${new Date(t.startedAt).toLocaleString()}</h4>
    <div class="chartwrap small"><canvas id="histCanvas"></canvas></div>
    ${R("Peak", `${C(t.peak)} kg`)}${R("Intensity", `${C(t.avg)} kg`)}${R("Output", C(t.output))}${R("Inroad", `${t.inroad.toFixed(0)}%`)}
    ${R("Reps (logged)", String(be(t)))}
    ${t.reps?.length ? R("Auto-detected", `${t.reps.length} (${t.reps.map((s) => s.peak.toFixed(0)).join(", ")} kg)`) : ""}
    ${vn(t, "hist")}
    <div class="actions-inline" style="margin-top:8px"><button class="sm" id="btnUseGhost">Use as ghost trace</button><button class="sm ghost" id="btnSetCsv">Export samples CSV</button></div>`, yn(t, "hist", async () => {
    te(), await T();
  });
  const n = new en(r("histCanvas"));
  n.opts.windowS = Math.max(10, Math.ceil(t.durationS / 10) * 10), n.opts.peaks = Et(t.samples).map((s) => ({ t: s.peakT ?? s.startS, kg: s.peak })), n.draw(t.samples, t.durationS, 0), r("btnUseGhost").onclick = () => {
    Te = !0, localStorage.setItem("ufl.ghostOn", "1"), r("ghostOn").checked = !0, W.opts.ghost = t.samples, bn("train");
  }, r("btnSetCsv").onclick = () => vt(`set-${t.id}.csv`, is(t), "text/csv");
}
function xs(t) {
  const e = r("progress");
  if (t.length < 2) {
    e.classList.add("hidden");
    return;
  }
  e.classList.remove("hidden");
  const n = Math.max(1, window.devicePixelRatio || 1), s = e.clientWidth - 12, i = 160;
  Ce.width = s * n, Ce.height = i * n, Ce.style.width = `${s}px`, Ce.style.height = `${i}px`;
  const a = Ce.getContext("2d");
  a.setTransform(n, 0, 0, n, 0, 0), a.clearRect(0, 0, s, i);
  const o = getComputedStyle(document.getElementById("view-force") ?? document.documentElement), c = 36, d = 8, l = 10, h = 18, f = s - c - d, g = i - l - h, m = Math.max(10, ...t.map((b) => b.peak)) * 1.1, y = (b) => c + b / Math.max(1, t.length - 1) * f, u = (b) => l + g - b / m * g;
  a.strokeStyle = o.getPropertyValue("--grid"), a.fillStyle = o.getPropertyValue("--muted"), a.font = "10px system-ui", a.textAlign = "right";
  for (let b = 0; b <= 4; b++) {
    const O = m / 4 * b;
    a.beginPath(), a.moveTo(c, u(O)), a.lineTo(s - d, u(O)), a.stroke(), a.fillText(O.toFixed(0), c - 4, u(O) + 3);
  }
  const p = [["peak", o.getPropertyValue("--accent")], ["avg", o.getPropertyValue("--accent2")]];
  for (const [b, O] of p)
    a.strokeStyle = O, a.lineWidth = 2, a.beginPath(), t.forEach((S, A) => A ? a.lineTo(y(A), u(S[b])) : a.moveTo(y(A), u(S[b]))), a.stroke(), a.fillStyle = O, t.forEach((S, A) => {
      a.beginPath(), a.arc(y(A), u(S[b]), 3, 0, Math.PI * 2), a.fill();
    });
  a.fillStyle = o.getPropertyValue("--muted"), a.textAlign = "left", a.fillText("peak", c + 4, l + 10), a.fillStyle = o.getPropertyValue("--accent2"), a.fillText("intensity", c + 36, l + 10);
}
async function ee() {
  const t = await _.maxes(), e = Object.entries(t).map(([n, s]) => {
    const [i, a, o, c, d, l] = n.split("|");
    return `<tr><td>${M(Se(i, "both", o, c, Number((d ?? "").replace("L", "")) || 0, Number((l ?? "").replace("E", "")) || 0))}</td><td>${a}</td><td>${C(s.kg)}</td><td>${new Date(s.at).toLocaleDateString()}</td><td><button data-mdel="${M(n)}">✕</button></td></tr>`;
  });
  r("maxBody").innerHTML = e.join("") || '<tr><td colspan="5" class="muted">No maxes yet.</td></tr>', r("maxBody").querySelectorAll("button[data-mdel]").forEach((n) => n.onclick = async () => {
    await _.deleteMax(n.dataset.mdel), ee(), T();
  }), r("exList").innerHTML = x.map((n) => `<span>${M(n)}<button data-xren="${M(n)}" title="Rename">✎</button><button data-xdel="${M(n)}">✕</button></span>`).join(""), r("exList").querySelectorAll("button[data-xren]").forEach((n) => n.onclick = async () => {
    const s = n.dataset.xren, i = prompt(`Rename "${s}" to:`, s);
    !i || i.trim() === s || await ds(s, i.trim());
  }), r("exList").querySelectorAll("button[data-xdel]").forEach((n) => n.onclick = async () => {
    const s = J();
    if (s) {
      if (!s.removeExercise(n.dataset.xdel)) {
        alert("Built-in Gym Log exercises can't be removed here.");
        return;
      }
      x = s.exerciseNames();
    } else
      x = x.filter((i) => i !== n.dataset.xdel), await _.saveExercises(x);
    le(), ee();
  });
}
function bn(t) {
  document.querySelectorAll(".fl-tabs button").forEach((e) => e.classList.toggle("active", e.dataset.tab === t)), document.querySelectorAll(".fl-tab").forEach((e) => e.classList.toggle("active", e.id === `tab-${t}`)), t === "train" && W.resize(), t === "history" && te();
}
function ks() {
  document.querySelectorAll(".fl-tabs button").forEach((u) => u.onclick = () => bn(u.dataset.tab)), r("hdrExercise").onclick = () => {
    B.recording || os(r("exercise"));
  };
  for (const u of ["exercise", "side", "protocol", "contraction", "handle", "links", "extKg"]) r(u).addEventListener("change", fe);
  fe(), r("btnConnect").onclick = async () => {
    if (H instanceof De && (G === "live" || G === "scanning")) {
      await H.stop(), H = null, Ze("idle"), kt = !0;
      return;
    }
    kt = !1, r("simPanel").classList.add("hidden"), X = null;
    const u = new De();
    u.onSeen = () => xn(u), xt(u);
  }, r("btnSim").onclick = () => {
    X = new Nn(), X.exact = r("simExact").checked, r("simPanel").classList.remove("hidden"), xt(X);
  }, r("simExact").onchange = (u) => {
    const p = u.target.checked;
    X && (X.exact = p), r("simHelp").textContent = p ? "Reading tracks the slider exactly." : 'Slide up to "push", back to 0 to rest. Fatigue is simulated.';
  }, r("btnTare").onclick = () => H?.tare(), r("btnStart").onclick = ps, r("camOn").checked = localStorage.getItem("ufl.camOn") === "1";
  const t = async () => {
    const u = r("camOn").checked;
    if (localStorage.setItem("ufl.camOn", u ? "1" : "0"), u) {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert("Camera not available here."), r("camOn").checked = !1;
        return;
      }
      je ?? (je = new as(r("camVideo")));
      try {
        await je.start(), r("camPip").classList.remove("hidden"), r("btnCamFlip").classList.remove("hidden");
      } catch (p) {
        alert("Camera failed: " + p.message + `
Allow the Camera permission for UY Force Lab in Android settings.`), r("camOn").checked = !1;
      }
    } else
      je?.stop(), r("camPip").classList.add("hidden"), r("btnCamFlip").classList.add("hidden");
  };
  r("camOn").onchange = t, r("camOn").checked && t(), r("btnCamFlip").onclick = () => je?.flip();
  const e = r("camPip"), n = localStorage.getItem("ufl.pipPos");
  if (n) {
    const [u, p] = n.split(",").map(Number);
    e.style.left = `${u}px`, e.style.top = `${p}px`;
  }
  let s = null;
  e.onpointerdown = (u) => {
    const p = e.getBoundingClientRect();
    s = { x: u.clientX, y: u.clientY, l: p.left, t: p.top, moved: !1 }, e.setPointerCapture(u.pointerId);
  }, e.onpointermove = (u) => {
    if (!s) return;
    const p = u.clientX - s.x, b = u.clientY - s.y;
    if (Math.abs(p) + Math.abs(b) > 6 && (s.moved = !0), !s.moved) return;
    const O = e.getBoundingClientRect(), S = Math.min(window.innerWidth - O.width, Math.max(0, s.l + p)), A = Math.min(window.innerHeight - O.height, Math.max(0, s.t + b));
    e.style.left = `${S}px`, e.style.top = `${A}px`;
  }, e.onpointerup = () => {
    if (s) {
      if (s.moved) {
        const u = e.getBoundingClientRect();
        localStorage.setItem("ufl.pipPos", `${Math.round(u.left)},${Math.round(u.top)}`);
      } else e.classList.toggle("large");
      s = null;
    }
  }, r("btnStop").onclick = gn, r("simEffort").oninput = (u) => {
    const p = Number(u.target.value);
    X && (X.effort = p), r("simVal").textContent = String(p);
  }, r("exercise").onchange = T, dt(r("exercise"), { recent: ft, all: () => x, onCreate: Vt }), dt(r("maxExercise"), { recent: ft, all: () => x, onCreate: Vt }), dt(r("histExercise"), { recent: ft, all: () => x, allOption: { value: "", label: "All exercises" } }), r("btnNewEx").onclick = () => {
    r("newExBox").classList.remove("hidden"), r("newExName").focus();
  }, r("btnNewExCancel").onclick = () => {
    r("newExBox").classList.add("hidden"), r("newExName").value = "";
  };
  const i = async () => {
    const u = r("newExName").value.trim();
    if (u) {
      if (!x.includes(u)) {
        const p = J();
        p ? (p.addExercise(u), x = p.exerciseNames()) : (x.push(u), await _.saveExercises(x));
      }
      le(), r("exercise").value = u, r("newExBox").classList.add("hidden"), r("newExName").value = "", ee(), await T();
    }
  };
  r("btnNewExSave").onclick = i, r("newExName").onkeydown = (u) => {
    u.key === "Enter" && i();
  }, r("side").onchange = T, r("contraction").onchange = T, r("zoneRef").value = localStorage.getItem("ufl.zoneRef") ?? "best", r("zoneRef").onchange = () => {
    localStorage.setItem("ufl.zoneRef", r("zoneRef").value), T();
  };
  const a = (u) => Math.max(1, Number(localStorage.getItem(`ufl.links.${u}`) ?? "1") || 1), o = () => {
    r("links").value = String(Math.min(8, a(r("exercise").value)));
  };
  r("exercise").addEventListener("change", () => {
    o(), fe();
  }), r("extKg").oninput = () => {
    fe(), T();
  };
  const c = (u) => Number(localStorage.getItem(`ufl.offset.${u}`) ?? "0") || 0, d = () => {
    r("offsetKg").value = String(c(r("exercise").value));
  };
  r("exercise").addEventListener("change", d), setTimeout(d, 0), r("offsetKg").oninput = () => localStorage.setItem(`ufl.offset.${r("exercise").value}`, String(Ye())), r("btnOffsetNow").onclick = () => {
    if (G !== "live" && !X) {
      alert("Connect the scale (or the simulator) first, then hang from it and tap again.");
      return;
    }
    r("offsetKg").value = (Math.round(cn * 10) / 10).toFixed(1), localStorage.setItem(`ufl.offset.${r("exercise").value}`, String(Ye()));
  }, r("links").onchange = () => {
    localStorage.setItem(`ufl.links.${r("exercise").value}`, String(_e())), fe(), T();
  }, setTimeout(o, 0), r("preCount").value = localStorage.getItem("ufl.preCount") ?? "10", r("preCount").onchange = () => localStorage.setItem("ufl.preCount", String(Math.max(0, Number(r("preCount").value) || 0)));
  const l = r("handle"), h = localStorage.getItem("ufl.handle") ?? "";
  h && ![...l.options].some((u) => u.value === h) && l.insertAdjacentHTML("beforeend", `<option>${M(h)}</option>`), l.value = h;
  const f = JSON.parse(localStorage.getItem("ufl.handles") ?? "[]");
  for (const u of f) [...l.options].some((p) => p.value === u) || l.insertAdjacentHTML("beforeend", `<option>${M(u)}</option>`);
  l.onchange = () => {
    if (l.value === "__custom") {
      const u = (prompt("Handle / attachment name") ?? "").trim();
      if (!u) {
        l.value = localStorage.getItem("ufl.handle") ?? "";
        return;
      }
      [...l.options].some((p) => p.value === u) || (l.insertAdjacentHTML("beforeend", `<option>${M(u)}</option>`), f.push(u), localStorage.setItem("ufl.handles", JSON.stringify(f))), l.value = u;
    }
    localStorage.setItem("ufl.handle", l.value), fe(), T();
  }, r("protocol").onchange = () => dn(), r("params").oninput = () => r("protocolHelp").textContent = et(r("protocol").value, Xe()).describe;
  for (const u of ["zoneOn", "zoneLo", "zoneHi"]) r(u).oninput = T;
  r("ghostOn").checked = Te, r("ghostOn").onchange = (u) => {
    Te = u.target.checked, localStorage.setItem("ufl.ghostOn", Te ? "1" : "0"), T();
  }, r("histExercise").onchange = te, r("btnCsv").onclick = () => vt(`uy-force-lab-${Gt()}.csv`, ss(U), "text/csv"), r("btnJson").onclick = () => vt(`uy-force-lab-${Gt()}.json`, JSON.stringify(U, null, 1), "application/json"), r("voiceOn").onchange = (u) => k.enabled = u.target.checked, r("keepAwake").checked = hn(), r("keepAwake").onchange = (u) => {
    localStorage.setItem("ufl.keepAwake", u.target.checked ? "1" : "0"), fn();
  }, r("autoConnect").checked = pn(), r("autoConnect").onchange = (u) => {
    localStorage.setItem("ufl.autoConnect", u.target.checked ? "1" : "0"), Qe = !1, St();
  }, document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "hidden") {
      H instanceof De && !B.recording && (await H.stop(), H = null, Ze("idle"), pt = !0);
      return;
    }
    (pt || G === "idle" || G === "error") && (pt = !1, Qe = !1, St());
  }), k.rate = Number(xe("ufl.voiceRate", "1.2")) || 1.2, k.pitch = Number(xe("ufl.voicePitch", "1")) || 1;
  const g = (u, p, b, O) => {
    const S = r(u);
    S.value = String(O), r(u + "Val").textContent = O.toFixed(1) + "×", S.oninput = () => {
      const A = Number(S.value);
      b(A), localStorage.setItem(p, String(A)), r(u + "Val").textContent = A.toFixed(1) + "×";
    };
  };
  g("voiceRate", "ufl.voiceRate", (u) => k.rate = u, k.rate), g("voicePitch", "ufl.voicePitch", (u) => k.pitch = u, k.pitch), r("beepOn").onchange = (u) => K = u.target.checked, r("calloutEvery").value = String(Ve), r("calloutEvery").onchange = (u) => {
    Ve = Math.max(1, Number(u.target.value) || 1), localStorage.setItem("ufl.calloutEvery", String(Ve));
  };
  const m = (u, p, b, O) => {
    const S = r(u);
    S.checked = O, S.onchange = () => {
      b(S.checked), localStorage.setItem(p, S.checked ? "1" : "0");
    };
  };
  m("calloutOn", "ufl.calloutOn", (u) => yt = u, yt), m("secBeep", "ufl.secBeep", (u) => wt = u, wt), m("secCount", "ufl.secCount", (u) => bt = u, bt);
  let y = null;
  k.onSpeak = (u) => {
    const p = r("said");
    p.textContent = `🔊 ${u}`, p.classList.add("on"), y && clearTimeout(y), y = setTimeout(() => p.classList.remove("on"), 900);
  }, document.addEventListener("pointerdown", () => k.unlock(), { once: !0 }), document.addEventListener("visibilitychange", () => {
    document.visibilityState === "visible" && k.reset();
  }), r("btnTestVoice").onclick = async () => {
    k.reset();
    const u = r("voiceStatus");
    u.textContent = await k.status(), k.say("Force lab voice check, 1, 2, 3", !0);
  }, r("btnSetMax").onclick = async () => {
    const u = Number(r("maxKg").value);
    u && (await _.setMax(we(r("maxExercise").value, r("maxSide").value), u), r("maxKg").value = "", ee(), T());
  }, r("btnAddEx").onclick = async () => {
    const u = r("newEx").value.trim();
    if (!(!u || x.includes(u))) {
      {
        const p = J();
        p ? (p.addExercise(u), x = p.exerciseNames()) : (x.push(u), await _.saveExercises(x));
      }
      r("newEx").value = "", le(), ee();
    }
  };
}
let zt = 0;
function xn(t) {
  const e = Date.now();
  if (e - zt < 1e3 || r("tab-settings").classList.contains("active") === !1) return;
  zt = e;
  const n = [...t.seen.values()].sort((s, i) => i.t - s.t).slice(0, 12);
  r("seenBody").innerHTML = n.map((s) => `<tr><td>${M(s.name || "(no name)")}<br><small class="muted">${M(s.id)}</small></td><td>${s.rssi}</td><td>${M(s.keys || "–")}</td><td style="white-space:normal;font-family:monospace;font-size:11px">${M(s.hex || "–")}</td><td>${s.kg === null ? "–" : s.kg.toFixed(2)}</td></tr>`).join("") || '<tr><td colspan="5" class="muted">Listening… nothing heard yet.</td></tr>';
}
function C(t) {
  return t >= 100 ? t.toFixed(0) : t.toFixed(1);
}
function kn(t) {
  const e = Math.floor(t / 60), n = Math.floor(t % 60);
  return `${e}:${n.toString().padStart(2, "0")}`;
}
function Gt() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function M(t) {
  return t.replace(/[&<>"]/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[e]);
}
hs();
window.ForceLab = {
  onShow() {
    W.resize(), St();
  },
  // called by the host after it renamed an exercise in its own data
  renameExercise(t, e) {
    ln(t, e).then(async () => {
      x = J()?.exerciseNames() ?? x, le(), ee(), te(), await T();
    });
  }
};
async function Ss(t, e, n) {
  let s;
  return Promise.race([
    t,
    new Promise((i, a) => {
      s = setTimeout(() => a(n), e);
    })
  ]).finally(() => clearTimeout(s));
}
class Es extends ae {
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
        manufacturerData: It(e.manufacturerData),
        serviceData: It(e.serviceData),
        uuids: (i = e.uuids) === null || i === void 0 ? void 0 : i.map(Rn)
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
      await Ss(i.gatt.connect(), o, a);
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
      for (const l of c)
        d.push({
          uuid: l.uuid,
          properties: this.getProperties(l),
          descriptors: await this.getDescriptors(l)
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
    typeof e.value == "string" ? s = Pe(e.value) : s = e.value, await n?.writeValueWithResponse(st(s));
  }
  async writeWithoutResponse(e) {
    const n = await this.getCharacteristic(e);
    let s;
    typeof e.value == "string" ? s = Pe(e.value) : s = e.value, await n?.writeValueWithoutResponse(st(s));
  }
  async readDescriptor(e) {
    const n = await this.getDescriptor(e);
    return { value: await n?.readValue() };
  }
  async writeDescriptor(e) {
    const n = await this.getDescriptor(e);
    let s;
    typeof e.value == "string" ? s = Pe(e.value) : s = e.value, await n?.writeValue(st(s));
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
          let l = !0;
          for (let h = 0; h < c.byteLength; h++)
            if ((o[h] & d.getUint8(h)) !== (c.getUint8(h) & d.getUint8(h))) {
              l = !1;
              break;
            }
          if (l)
            return !0;
        } else {
          let d = !0;
          for (let l = 0; l < c.byteLength; l++)
            if (o[l] !== c.getUint8(l)) {
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
const Ls = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BluetoothLeWeb: Es
}, Symbol.toStringTag, { value: "Module" }));
class Cs extends ae {
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
    const n = this.getSpeechSynthesisVoices(), s = new SpeechSynthesisUtterance(), { text: i, lang: a, rate: o, pitch: c, volume: d, voice: l } = e;
    return l !== void 0 && (s.voice = n[l]), d !== void 0 && (s.volume = d >= 0 && d <= 1 ? d : 1), o !== void 0 && (s.rate = o >= 0.1 && o <= 10 ? o : 1), c !== void 0 && (s.pitch = c >= 0 && c <= 2 ? c : 2), a && (s.lang = a), s.text = i, s;
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
const $s = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  TextToSpeechWeb: Cs
}, Symbol.toStringTag, { value: "Module" }));
class Ps extends ae {
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
const Os = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  KeepAwakeWeb: Ps
}, Symbol.toStringTag, { value: "Module" }));
class Ds extends ae {
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
      const c = o.substring(i.length), d = (e = this.impl.getItem(o)) !== null && e !== void 0 ? e : "", { value: l } = await this.get({ key: c });
      typeof l == "string" ? s.push(c) : (await this.set({ key: c, value: d }), n.push(c));
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
const Ts = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PreferencesWeb: Ds
}, Symbol.toStringTag, { value: "Module" }));
function Yt(t) {
  const e = t.split("/").filter((s) => s !== "."), n = [];
  return e.forEach((s) => {
    s === ".." && n.length > 0 && n[n.length - 1] !== ".." ? n.pop() : n.push(s);
  }), n.join("/");
}
function As(t, e) {
  t = Yt(t), e = Yt(e);
  const n = t.split("/"), s = e.split("/");
  return t !== e && n.every((i, a) => i === s[a]);
}
class tt extends ae {
  constructor() {
    super(...arguments), this.DB_VERSION = 1, this.DB_NAME = "Disc", this._writeCmds = ["add", "put", "delete"], this.downloadFile = async (e) => {
      var n, s;
      const i = Jt(e, e.webFetchExtra), a = await fetch(e.url, i);
      let o;
      if (!e.progress)
        o = await a.blob();
      else if (!a?.body)
        o = new Blob();
      else {
        const d = a.body.getReader();
        let l = 0;
        const h = [], f = a.headers.get("content-type"), g = parseInt(a.headers.get("content-length") || "0", 10);
        for (; ; ) {
          const { done: u, value: p } = await d.read();
          if (u)
            break;
          h.push(p), l += p?.length || 0;
          const b = {
            url: e.url,
            bytes: l,
            contentLength: g
          };
          this.notifyListeners("progress", b);
        }
        const m = new Uint8Array(l);
        let y = 0;
        for (const u of h)
          typeof u > "u" || (m.set(u, y), y += u.length);
        o = new Blob([m.buffer], { type: f || void 0 });
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
      s.onupgradeneeded = tt.doUpgrade, s.onsuccess = () => {
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
      const l = i.transaction(["FileStorage"], s).objectStore("FileStorage")[e](...n);
      l.onsuccess = () => a(l.result), l.onerror = () => o(l.error);
    }));
  }
  async dbIndexRequest(e, n, s) {
    const i = this._writeCmds.indexOf(n) !== -1 ? "readwrite" : "readonly";
    return this.initDb().then((a) => new Promise((o, c) => {
      const f = a.transaction(["FileStorage"], i).objectStore("FileStorage").index(e)[n](...s);
      f.onsuccess = () => o(f.result), f.onerror = () => c(f.error);
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
      const f = c.indexOf("/", 1);
      if (f !== -1) {
        const g = c.substr(f);
        await this.mkdir({
          path: g,
          directory: e.directory,
          recursive: a
        });
      }
    }
    if (!i && !(s instanceof Blob) && (s = s.indexOf(",") >= 0 ? s.split(",")[1] : s, !this.isBase64String(s)))
      throw Error("The supplied data is not valid base64 content.");
    const l = Date.now(), h = {
      path: n,
      folder: c,
      type: "file",
      size: s instanceof Blob ? s.size : s.length,
      ctime: l,
      mtime: l,
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
      const f = a.indexOf("/", 1);
      if (f !== -1) {
        const g = a.substr(f);
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
    const d = Date.now(), l = {
      path: n,
      folder: i,
      type: "directory",
      size: 0,
      ctime: d,
      mtime: d
    };
    await this.dbRequest("put", [l]);
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
      const l = `${n}/${d.name}`;
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
    if (As(c, d))
      throw Error("To path cannot contain the from path");
    let l;
    try {
      l = await this.stat({
        path: i,
        directory: s
      });
    } catch {
      const y = i.split("/");
      y.pop();
      const u = y.join("/");
      if (y.length > 0 && (await this.stat({
        path: u,
        directory: s
      })).type !== "directory")
        throw new Error("Parent directory of the to path is a file");
    }
    if (l && l.type === "directory")
      throw new Error("Cannot overwrite a directory with a file");
    const h = await this.stat({
      path: a,
      directory: o
    }), f = async (m, y, u) => {
      const p = this.getPath(s, m), b = await this.dbRequest("get", [p]);
      b.ctime = y, b.mtime = u, await this.dbRequest("put", [b]);
    }, g = h.ctime ? h.ctime : Date.now();
    switch (h.type) {
      case "file": {
        const m = await this.readFile({
          path: a,
          directory: o
        });
        n && await this.deleteFile({
          path: a,
          directory: o
        });
        let y;
        !(m.data instanceof Blob) && !this.isBase64String(m.data) && (y = We.UTF8);
        const u = await this.writeFile({
          path: i,
          directory: s,
          data: m.data,
          encoding: y
        });
        return n && await f(i, g, h.mtime), u;
      }
      case "directory": {
        if (l)
          throw Error("Cannot move a directory over an existing object");
        try {
          await this.mkdir({
            path: i,
            directory: s,
            recursive: !1
          }), n && await f(i, g, h.mtime);
        } catch {
        }
        const m = (await this.readdir({
          path: a,
          directory: o
        })).files;
        for (const y of m)
          await this._copy({
            from: `${a}/${y.name}`,
            to: `${i}/${y.name}`,
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
tt._debug = !0;
const Ms = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  FilesystemWeb: tt
}, Symbol.toStringTag, { value: "Module" }));
class _s extends ae {
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
const Rs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ShareWeb: _s
}, Symbol.toStringTag, { value: "Module" }));
