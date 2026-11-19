var et;
(function(s) {
  s[s.SCAN_MODE_LOW_POWER = 0] = "SCAN_MODE_LOW_POWER", s[s.SCAN_MODE_BALANCED = 1] = "SCAN_MODE_BALANCED", s[s.SCAN_MODE_LOW_LATENCY = 2] = "SCAN_MODE_LOW_LATENCY";
})(et || (et = {}));
var tt;
(function(s) {
  s[s.PHY_LE_1M = 1] = "PHY_LE_1M", s[s.PHY_LE_2M = 2] = "PHY_LE_2M", s[s.PHY_LE_CODED = 3] = "PHY_LE_CODED", s[s.PHY_LE_ALL_SUPPORTED = 255] = "PHY_LE_ALL_SUPPORTED";
})(tt || (tt = {}));
var st;
(function(s) {
  s[s.CONNECTION_PRIORITY_BALANCED = 0] = "CONNECTION_PRIORITY_BALANCED", s[s.CONNECTION_PRIORITY_HIGH = 1] = "CONNECTION_PRIORITY_HIGH", s[s.CONNECTION_PRIORITY_LOW_POWER = 2] = "CONNECTION_PRIORITY_LOW_POWER";
})(st || (st = {}));
/*! Capacitor: https://capacitorjs.com/ - MIT License */
var oe;
(function(s) {
  s.Unimplemented = "UNIMPLEMENTED", s.Unavailable = "UNAVAILABLE";
})(oe || (oe = {}));
class Fe extends Error {
  constructor(e, t, n) {
    super(e), this.message = e, this.code = t, this.data = n;
  }
}
const It = (s) => {
  var e, t;
  return s?.androidBridge ? "android" : !((t = (e = s?.webkit) === null || e === void 0 ? void 0 : e.messageHandlers) === null || t === void 0) && t.bridge ? "ios" : "web";
}, qt = (s) => {
  const e = s.CapacitorCustomPlatform || null, t = s.Capacitor || {}, n = t.Plugins = t.Plugins || {}, i = () => e !== null ? e.name : It(s), a = () => i() !== "web", o = (h) => {
    const p = u.get(h);
    return !!(p?.platforms.has(i()) || r(h));
  }, r = (h) => {
    var p;
    return (p = t.PluginHeaders) === null || p === void 0 ? void 0 : p.find((w) => w.name === h);
  }, l = (h) => s.console.error(h), u = /* @__PURE__ */ new Map(), d = (h, p = {}) => {
    const w = u.get(h);
    if (w)
      return console.warn(`Capacitor plugin "${h}" already registered. Cannot register plugins twice.`), w.proxy;
    const m = i(), v = r(h);
    let y;
    const b = async () => (!y && m in p ? y = typeof p[m] == "function" ? y = await p[m]() : y = p[m] : e !== null && !y && "web" in p && (y = typeof p.web == "function" ? y = await p.web() : y = p.web), y), U = (k, D) => {
      var f, x;
      if (v) {
        const O = v?.methods.find((N) => D === N.name);
        if (O)
          return O.rtype === "promise" ? (N) => t.nativePromise(h, D.toString(), N) : (N, ve) => t.nativeCallback(h, D.toString(), N, ve);
        if (k)
          return (f = k[D]) === null || f === void 0 ? void 0 : f.bind(k);
      } else {
        if (k)
          return (x = k[D]) === null || x === void 0 ? void 0 : x.bind(k);
        throw new Fe(`"${h}" plugin is not implemented on ${m}`, oe.Unimplemented);
      }
    }, _ = (k) => {
      let D;
      const f = (...x) => {
        const O = b().then((N) => {
          const ve = U(N, k);
          if (ve) {
            const we = ve(...x);
            return D = we?.remove, we;
          } else
            throw new Fe(`"${h}.${k}()" is not implemented on ${m}`, oe.Unimplemented);
        });
        return k === "addListener" && (O.remove = async () => D()), O;
      };
      return f.toString = () => `${k.toString()}() { [capacitor code] }`, Object.defineProperty(f, "name", {
        value: k,
        writable: !1,
        configurable: !1
      }), f;
    }, I = _("addListener"), R = _("removeListener"), M = (k, D) => {
      const f = I({ eventName: k }, D), x = async () => {
        const N = await f;
        R({
          eventName: k,
          callbackId: N
        }, D);
      }, O = new Promise((N) => f.then(() => N({ remove: x })));
      return O.remove = async () => {
        console.warn("Using addListener() without 'await' is deprecated."), await x();
      }, O;
    }, C = new Proxy({}, {
      get(k, D) {
        switch (D) {
          case "$$typeof":
            return;
          case "toJSON":
            return () => ({});
          case "addListener":
            return v ? M : I;
          case "removeListener":
            return R;
          default:
            return _(D);
        }
      }
    });
    return n[h] = C, u.set(h, {
      name: h,
      proxy: C,
      platforms: /* @__PURE__ */ new Set([...Object.keys(p), ...v ? [m] : []])
    }), C;
  };
  return t.convertFileSrc || (t.convertFileSrc = (h) => h), t.getPlatform = i, t.handleError = l, t.isNativePlatform = a, t.isPluginAvailable = o, t.registerPlugin = d, t.Exception = Fe, t.DEBUG = !!t.DEBUG, t.isLoggingEnabled = !!t.isLoggingEnabled, t;
}, Ut = (s) => s.Capacitor = qt(s), B = /* @__PURE__ */ Ut(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {}), te = B.registerPlugin;
class se {
  constructor() {
    this.listeners = {}, this.retainedEventArguments = {}, this.windowListeners = {};
  }
  addListener(e, t) {
    let n = !1;
    this.listeners[e] || (this.listeners[e] = [], n = !0), this.listeners[e].push(t);
    const a = this.windowListeners[e];
    a && !a.registered && this.addWindowListener(a), n && this.sendRetainedArgumentsForEvent(e);
    const o = async () => this.removeListener(e, t);
    return Promise.resolve({ remove: o });
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
    return new B.Exception(e, oe.Unimplemented);
  }
  unavailable(e = "not available") {
    return new B.Exception(e, oe.Unavailable);
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
const nt = (s) => encodeURIComponent(s).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape), it = (s) => s.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class Nt extends se {
  async getCookies() {
    const e = document.cookie, t = {};
    return e.split(";").forEach((n) => {
      if (n.length <= 0)
        return;
      let [i, a] = n.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
      i = it(i).trim(), a = it(a).trim(), t[i] = a;
    }), t;
  }
  async setCookie(e) {
    try {
      const t = nt(e.key), n = nt(e.value), i = e.expires ? `; expires=${e.expires.replace("expires=", "")}` : "", a = (e.path || "/").replace("path=", ""), o = e.url != null && e.url.length > 0 ? `domain=${e.url}` : "";
      document.cookie = `${t}=${n || ""}${i}; path=${a}; ${o};`;
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
te("CapacitorCookies", {
  web: () => new Nt()
});
const jt = async (s) => new Promise((e, t) => {
  const n = new FileReader();
  n.onload = () => {
    const i = n.result;
    e(i.indexOf(",") >= 0 ? i.split(",")[1] : i);
  }, n.onerror = (i) => t(i), n.readAsDataURL(s);
}), Vt = (s = {}) => {
  const e = Object.keys(s);
  return Object.keys(s).map((i) => i.toLocaleLowerCase()).reduce((i, a, o) => (i[a] = s[e[o]], i), {});
}, Ht = (s, e = !0) => s ? Object.entries(s).reduce((n, i) => {
  const [a, o] = i;
  let r, l;
  return Array.isArray(o) ? (l = "", o.forEach((u) => {
    r = e ? encodeURIComponent(u) : u, l += `${a}=${r}&`;
  }), l.slice(0, -1)) : (r = e ? encodeURIComponent(o) : o, l = `${a}=${r}`), `${n}&${l}`;
}, "").substr(1) : null, bt = (s, e = {}) => {
  const t = Object.assign({ method: s.method || "GET", headers: s.headers }, e), i = Vt(s.headers)["content-type"] || "";
  if (typeof s.data == "string")
    t.body = s.data;
  else if (i.includes("application/x-www-form-urlencoded")) {
    const a = new URLSearchParams();
    for (const [o, r] of Object.entries(s.data || {}))
      a.set(o, r);
    t.body = a.toString();
  } else if (i.includes("multipart/form-data") || s.data instanceof FormData) {
    const a = new FormData();
    if (s.data instanceof FormData)
      s.data.forEach((r, l) => {
        a.append(l, r);
      });
    else
      for (const r of Object.keys(s.data))
        a.append(r, s.data[r]);
    t.body = a;
    const o = new Headers(t.headers);
    o.delete("content-type"), t.headers = o;
  } else (i.includes("application/json") || typeof s.data == "object") && (t.body = JSON.stringify(s.data));
  return t;
};
class Wt extends se {
  /**
   * Perform an Http request given a set of options
   * @param options Options to build the HTTP request
   */
  async request(e) {
    const t = bt(e, e.webFetchExtra), n = Ht(e.params, e.shouldEncodeUrlParams), i = n ? `${e.url}?${n}` : e.url, a = await fetch(i, t), o = a.headers.get("content-type") || "";
    let { responseType: r = "text" } = a.ok ? e : {};
    o.includes("application/json") && (r = "json");
    let l, u;
    switch (r) {
      case "arraybuffer":
      case "blob":
        u = await a.blob(), l = await jt(u);
        break;
      case "json":
        l = await a.json();
        break;
      case "document":
      case "text":
      default:
        l = await a.text();
    }
    const d = {};
    return a.headers.forEach((h, p) => {
      d[p] = h;
    }), {
      data: l,
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
te("CapacitorHttp", {
  web: () => new Wt()
});
var at;
(function(s) {
  s.Dark = "DARK", s.Light = "LIGHT", s.Default = "DEFAULT";
})(at || (at = {}));
var rt;
(function(s) {
  s.StatusBar = "StatusBar", s.NavigationBar = "NavigationBar";
})(rt || (rt = {}));
class zt extends se {
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
te("SystemBars", {
  web: () => new zt()
});
function Gt(s) {
  return new DataView(Uint8Array.from(s).buffer);
}
function Kt(s) {
  return Array.from(new Uint8Array(s.buffer, s.byteOffset, s.byteLength));
}
function Yt(s) {
  return `0000${s.toString(16).padStart(4, "0")}-0000-1000-8000-00805f9b34fb`;
}
function he(s) {
  const e = [];
  let t, n, i = 1, a = 0;
  for (t = 0; t < s.length; t++)
    n = s.charCodeAt(t), (n > 47 && n < 58 || n > 64 && n < 71 || n > 96 && n < 103) && (a = a << 4 ^ (n > 64 ? n + 9 : n) & 15, (i ^= 1) && e.push(a & 255));
  return Gt(e);
}
function fe(s) {
  return Kt(s).map((e) => {
    let t = e.toString(16);
    return t.length == 1 && (t = "0" + t), t;
  }).join("");
}
function Xt(s) {
  if (typeof s == "string")
    return s;
  if (typeof s == "number")
    return Yt(s);
  throw new Error("Invalid UUID");
}
function ot(s) {
  const e = {};
  if (s)
    return s.forEach((t, n) => {
      e[n.toString()] = t;
    }), e;
}
function ct(s) {
  if (s !== void 0) {
    if (typeof s == "string") {
      const e = he(s);
      return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
    }
    return s instanceof DataView ? new Uint8Array(s.buffer, s.byteOffset, s.byteLength) : s;
  }
}
function ye(s) {
  if (s !== void 0)
    return s instanceof DataView ? fe(s) : fe(new DataView(s.buffer, s.byteOffset, s.byteLength));
}
function Be(s) {
  if (typeof SharedArrayBuffer < "u" && s.buffer instanceof SharedArrayBuffer) {
    const t = new Uint8Array(s.buffer, s.byteOffset, s.byteLength).slice().buffer;
    return new DataView(t);
  }
  return s;
}
const g = te("BluetoothLe", {
  web: () => Promise.resolve().then(() => Rs).then((s) => new s.BluetoothLeWeb())
}), Jt = () => {
  let s = Promise.resolve();
  return (e) => new Promise((t, n) => {
    s = s.then(() => e()).then(t).catch(n);
  });
};
function Ie(s) {
  return s ? Jt() : (e) => e();
}
function S(s) {
  if (typeof s != "string")
    throw new Error(`Invalid UUID type ${typeof s}. Expected string.`);
  if (s = s.toLowerCase(), !(s.search(/^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/) >= 0))
    throw new Error(`Invalid UUID format ${s}. Expected 128 bit string (e.g. "0000180d-0000-1000-8000-00805f9b34fb").`);
  return s;
}
class Zt {
  constructor() {
    this.scanListener = null, this.eventListeners = /* @__PURE__ */ new Map(), this.queue = Ie(!0);
  }
  enableQueue() {
    this.queue = Ie(!0);
  }
  disableQueue() {
    this.queue = Ie(!1);
  }
  async initialize(e) {
    await this.queue(async () => {
      await g.initialize(e);
    });
  }
  async isEnabled() {
    return await this.queue(async () => (await g.isEnabled()).value);
  }
  async requestEnable() {
    await this.queue(async () => {
      await g.requestEnable();
    });
  }
  async enable() {
    await this.queue(async () => {
      await g.enable();
    });
  }
  async disable() {
    await this.queue(async () => {
      await g.disable();
    });
  }
  async startEnabledNotifications(e) {
    await this.queue(async () => {
      var t;
      const n = "onEnabledChanged";
      await ((t = this.eventListeners.get(n)) === null || t === void 0 ? void 0 : t.remove());
      const i = await g.addListener(n, (a) => {
        e(a.value);
      });
      this.eventListeners.set(n, i), await g.startEnabledNotifications();
    });
  }
  async stopEnabledNotifications() {
    await this.queue(async () => {
      var e;
      const t = "onEnabledChanged";
      await ((e = this.eventListeners.get(t)) === null || e === void 0 ? void 0 : e.remove()), this.eventListeners.delete(t), await g.stopEnabledNotifications();
    });
  }
  async isLocationEnabled() {
    return await this.queue(async () => (await g.isLocationEnabled()).value);
  }
  async openLocationSettings() {
    await this.queue(async () => {
      await g.openLocationSettings();
    });
  }
  async openBluetoothSettings() {
    await this.queue(async () => {
      await g.openBluetoothSettings();
    });
  }
  async openAppSettings() {
    await this.queue(async () => {
      await g.openAppSettings();
    });
  }
  async setDisplayStrings(e) {
    await this.queue(async () => {
      await g.setDisplayStrings(e);
    });
  }
  async requestDevice(e) {
    return e = e ? this.validateRequestBleDeviceOptions(e) : void 0, await this.queue(async () => await g.requestDevice(e));
  }
  async requestLEScan(e, t) {
    e = this.validateRequestBleDeviceOptions(e), await this.queue(async () => {
      var n;
      await ((n = this.scanListener) === null || n === void 0 ? void 0 : n.remove()), this.scanListener = await g.addListener("onScanResult", (i) => {
        const a = Object.assign(Object.assign({}, i), { manufacturerData: this.convertObject(i.manufacturerData), serviceData: this.convertObject(i.serviceData), rawAdvertisement: i.rawAdvertisement ? this.convertValue(i.rawAdvertisement) : void 0 });
        t(a);
      }), await g.requestLEScan(e);
    });
  }
  async stopLEScan() {
    await this.queue(async () => {
      var e;
      await ((e = this.scanListener) === null || e === void 0 ? void 0 : e.remove()), this.scanListener = null, await g.stopLEScan();
    });
  }
  async getDevices(e) {
    if (!Array.isArray(e))
      throw new Error("deviceIds must be an array");
    return this.queue(async () => (await g.getDevices({ deviceIds: e })).devices);
  }
  async getConnectedDevices(e) {
    if (!Array.isArray(e))
      throw new Error("services must be an array");
    return e = e.map(S), this.queue(async () => (await g.getConnectedDevices({ services: e })).devices);
  }
  async getBondedDevices() {
    return this.queue(async () => (await g.getBondedDevices()).devices);
  }
  async connect(e, t, n) {
    await this.queue(async () => {
      var i;
      if (t) {
        const a = `disconnected|${e}`;
        await ((i = this.eventListeners.get(a)) === null || i === void 0 ? void 0 : i.remove());
        const o = await g.addListener(a, () => {
          t(e);
        });
        this.eventListeners.set(a, o);
      }
      await g.connect(Object.assign({ deviceId: e }, n));
    });
  }
  async createBond(e, t) {
    await this.queue(async () => {
      await g.createBond(Object.assign({ deviceId: e }, t));
    });
  }
  async isBonded(e) {
    return await this.queue(async () => (await g.isBonded({ deviceId: e })).value);
  }
  async disconnect(e) {
    await this.queue(async () => {
      await g.disconnect({ deviceId: e });
    });
  }
  async getServices(e) {
    return await this.queue(async () => (await g.getServices({ deviceId: e })).services);
  }
  async discoverServices(e) {
    await this.queue(async () => {
      await g.discoverServices({ deviceId: e });
    });
  }
  async getMtu(e) {
    return await this.queue(async () => (await g.getMtu({ deviceId: e })).value);
  }
  async requestConnectionPriority(e, t) {
    await this.queue(async () => {
      await g.requestConnectionPriority({ deviceId: e, connectionPriority: t });
    });
  }
  async readRssi(e) {
    return await this.queue(async () => {
      const n = await g.readRssi({ deviceId: e });
      return parseFloat(n.value);
    });
  }
  async read(e, t, n, i) {
    return t = S(t), n = S(n), await this.queue(async () => {
      const o = await g.read(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n
      }, i));
      return this.convertValue(o.value);
    });
  }
  async write(e, t, n, i, a) {
    return t = S(t), n = S(n), this.queue(async () => {
      if (!i?.buffer)
        throw new Error("Invalid data.");
      let o = i;
      B.getPlatform() !== "web" && (o = fe(i)), await g.write(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n,
        value: o
      }, a));
    });
  }
  async writeWithoutResponse(e, t, n, i, a) {
    t = S(t), n = S(n), await this.queue(async () => {
      if (!i?.buffer)
        throw new Error("Invalid data.");
      let o = i;
      B.getPlatform() !== "web" && (o = fe(i)), await g.writeWithoutResponse(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n,
        value: o
      }, a));
    });
  }
  async readDescriptor(e, t, n, i, a) {
    return t = S(t), n = S(n), i = S(i), await this.queue(async () => {
      const r = await g.readDescriptor(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n,
        descriptor: i
      }, a));
      return this.convertValue(r.value);
    });
  }
  async writeDescriptor(e, t, n, i, a, o) {
    return t = S(t), n = S(n), i = S(i), this.queue(async () => {
      if (!a?.buffer)
        throw new Error("Invalid data.");
      let r = a;
      B.getPlatform() !== "web" && (r = fe(a)), await g.writeDescriptor(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n,
        descriptor: i,
        value: r
      }, o));
    });
  }
  async startNotifications(e, t, n, i, a) {
    t = S(t), n = S(n), await this.queue(async () => {
      var o;
      const r = `notification|${e}|${t}|${n}`;
      await ((o = this.eventListeners.get(r)) === null || o === void 0 ? void 0 : o.remove());
      const l = await g.addListener(r, (u) => {
        i(this.convertValue(u?.value));
      });
      this.eventListeners.set(r, l), await g.startNotifications(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n
      }, a));
    });
  }
  async stopNotifications(e, t, n) {
    t = S(t), n = S(n), await this.queue(async () => {
      var i;
      const a = `notification|${e}|${t}|${n}`;
      await ((i = this.eventListeners.get(a)) === null || i === void 0 ? void 0 : i.remove()), this.eventListeners.delete(a), await g.stopNotifications({
        deviceId: e,
        service: t,
        characteristic: n
      });
    });
  }
  validateRequestBleDeviceOptions(e) {
    return e = Object.assign({}, e), e.services && (e.services = e.services.map(S)), e.optionalServices && (e.optionalServices = e.optionalServices.map(S)), e.serviceData && B.getPlatform() !== "web" && (e.serviceData = e.serviceData.map((t) => Object.assign(Object.assign({}, t), { serviceUuid: S(t.serviceUuid), dataPrefix: ye(t.dataPrefix), mask: ye(t.mask) }))), e.manufacturerData && (B.getPlatform() !== "web" ? e.manufacturerData = e.manufacturerData.map((t) => Object.assign(Object.assign({}, t), { dataPrefix: ye(t.dataPrefix), mask: ye(t.mask) })) : e.manufacturerData = e.manufacturerData.map((t) => Object.assign(Object.assign({}, t), { dataPrefix: ct(t.dataPrefix), mask: ct(t.mask) }))), e;
  }
  convertValue(e) {
    return typeof e == "string" ? he(e) : e === void 0 ? new DataView(new ArrayBuffer(0)) : e;
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
const le = new Zt(), qe = 256, Ue = 10, Qt = 4e3;
class xt {
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
    this.setStatus("live"), this.sampleFns.forEach((n) => n(t)), this.lostTimer && clearTimeout(this.lostTimer), this.lostTimer = setTimeout(() => this.setStatus("lost"), Qt);
  }
  clearLost() {
    this.lostTimer && clearTimeout(this.lostTimer), this.lostTimer = null;
  }
}
function lt(s) {
  let e = "";
  for (let t = 0; t < s.byteLength; t++) e += s.getUint8(t).toString(16).padStart(2, "0") + " ";
  return e.trim();
}
function ut(s, e) {
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
function es(s) {
  return s.byteLength < Ue + 2 ? null : (s.getUint8(Ue) << 8 | s.getUint8(Ue + 1)) / 100;
}
class dt extends xt {
  constructor() {
    super(...arguments), this.name = "WeiHeng scale", this.scanning = !1, this.seen = /* @__PURE__ */ new Map(), this.onSeen = () => {
    };
  }
  async start() {
    if (!B.isNativePlatform())
      throw new Error("Bluetooth scanning needs the Android build. Use the simulator in the browser.");
    if (await le.initialize({ androidNeverForLocation: !0 }), !await le.isEnabled().catch(() => !0))
      try {
        await le.requestEnable();
      } catch {
        throw new Error("Bluetooth is off — turn it on and try again.");
      }
    this.setStatus("scanning"), this.scanning = !0, await le.requestLEScan(
      { allowDuplicates: !0 },
      (t) => {
        const n = t.localName ?? t.device.name ?? "", i = t.manufacturerData ?? {}, a = Object.keys(i);
        let o = i[String(qe)] ?? i[qe.toString(16)];
        !o && /^(IF_|WH-|WEIHENG)/i.test(n) && a.length && (o = i[a[0]]), !o && t.rawAdvertisement && (o = ut(t.rawAdvertisement, qe) ?? (/^IF_/i.test(n) ? ut(t.rawAdvertisement) : void 0));
        const r = o ? es(o) : null, l = { id: t.device.deviceId, name: n, rssi: t.rssi ?? 0, keys: a.join(","), hex: o ? lt(o) : t.rawAdvertisement ? lt(t.rawAdvertisement).slice(0, 60) : "", kg: r, t: Date.now() };
        this.seen.set(l.id, l), this.onSeen(l), r !== null && this.emitRaw(r);
      }
    );
  }
  async stop() {
    if (this.scanning)
      try {
        await le.stopLEScan();
      } catch {
      }
    this.scanning = !1, this.clearLost(), this.setStatus("idle");
  }
}
class ts extends xt {
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
function ce(s) {
  return s.manualReps && s.manualReps > 0 ? Math.round(s.manualReps) : 1;
}
function ne(s) {
  return s.performedAt ?? s.startedAt;
}
const Ee = 2;
class ss {
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
    const n = St(t);
    return {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      exercise: e.exercise,
      side: e.side,
      mode: e.mode,
      startedAt: this.t0,
      durationS: t[t.length - 1].t,
      samples: t,
      ...n,
      reps: kt(t)
    };
  }
}
function St(s) {
  let e = 0, t = 0, n = 0;
  for (let r = 0; r < s.length; r++) {
    const l = Math.max(0, s[r].kg);
    e = Math.max(e, l), t += l, r > 0 && (n += l * (s[r].t - s[r - 1].t));
  }
  const i = t / s.length, a = s.filter((r) => r.kg > Ee);
  let o = 0;
  if (a.length >= 10) {
    const r = Math.max(3, Math.floor(a.length * 0.2)), l = Math.max(...a.slice(0, r).map((d) => d.kg)), u = Math.max(...a.slice(-r).map((d) => d.kg));
    o = l > 0 ? Math.max(0, (l - u) / l * 100) : 0;
  }
  return { peak: F(e), avg: F(i), output: F(n), inroad: F(o) };
}
function kt(s) {
  if (s.length < 5) return [];
  const e = Math.max(...s.map((l) => l.kg));
  if (e < Ee * 2) return [];
  const t = Math.max(Ee, e * 0.35), n = Math.max(Ee * 0.5, e * 0.2), i = [];
  let a = !1, o = 0, r = 0;
  for (const l of s)
    !a && l.kg >= t ? (a = !0, o = l.t, r = l.kg) : a && (r = Math.max(r, l.kg), l.kg <= n && (l.t - o >= 0.6 && i.push({ index: i.length + 1, peak: F(r), startS: F(o), endS: F(l.t), durationS: F(l.t - o) }), a = !1));
  if (a) {
    const l = s[s.length - 1].t;
    l - o >= 0.6 && i.push({ index: i.length + 1, peak: F(r), startS: F(o), endS: F(l), durationS: F(l - o) });
  }
  return i.length >= 2 ? i : [];
}
function ns(s) {
  if (s.length < 6) return null;
  const e = s.slice(-Math.max(3, Math.floor(s.length / 3)));
  return F(e.reduce((t, n) => t + n.peak, 0) / e.length);
}
function F(s) {
  return Math.round(s * 100) / 100;
}
class Et {
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
    const { ctx: i } = this, a = this.canvas.width / this.dpr, o = this.canvas.height / this.dpr, r = 42, l = 12, u = 12, d = 24, h = a - r - l, p = o - u - d, w = getComputedStyle(document.getElementById("view-force") ?? document.documentElement), m = w.getPropertyValue("--muted").trim() || "#888", v = w.getPropertyValue("--grid").trim() || "#333", y = w.getPropertyValue("--accent").trim() || "#e8552f", b = w.getPropertyValue("--ghost").trim() || "#7a7a7a", U = w.getPropertyValue("--zone").trim() || "rgba(60,180,90,0.18)";
    i.clearRect(0, 0, a, o);
    const _ = Math.max(this.opts.windowS, Math.ceil(t / 10) * 10 || 10), I = this.opts.ghost ?? [];
    let R = 10;
    for (const f of e) R = Math.max(R, f.kg);
    for (const f of I) R = Math.max(R, f.kg);
    this.opts.zone && (R = Math.max(R, this.opts.zone.hi)), R = is(R * 1.1);
    const M = (f) => r + f / _ * h, C = (f) => u + p - Math.max(0, f) / R * p;
    if (this.opts.zone) {
      i.fillStyle = U;
      const f = C(this.opts.zone.hi), x = C(this.opts.zone.lo);
      i.fillRect(r, f, h, x - f);
    }
    i.strokeStyle = v, i.lineWidth = 1, i.fillStyle = m, i.font = "11px system-ui, sans-serif", i.textAlign = "right", i.textBaseline = "middle";
    const k = 5;
    for (let f = 0; f <= k; f++) {
      const x = R / k * f, O = C(x);
      i.beginPath(), i.moveTo(r, O), i.lineTo(a - l, O), i.stroke(), i.fillText(x.toFixed(0), r - 6, O);
    }
    i.textAlign = "center", i.textBaseline = "top";
    const D = _ <= 30 ? 5 : _ <= 90 ? 10 : 30;
    for (let f = 0; f <= _; f += D) {
      const x = M(f);
      i.beginPath(), i.moveTo(x, u), i.lineTo(x, u + p), i.stroke(), i.fillText(as(f), x, u + p + 6);
    }
    if (this.opts.marks?.length) {
      i.strokeStyle = b, i.setLineDash([3, 4]);
      for (const f of this.opts.marks)
        i.beginPath(), i.moveTo(M(f), u), i.lineTo(M(f), u + p), i.stroke();
      i.setLineDash([]);
    }
    if (I.length > 1 && (i.strokeStyle = b, i.lineWidth = 1.5, i.globalAlpha = 0.55, i.beginPath(), I.forEach((f, x) => x ? i.lineTo(M(f.t), C(f.kg)) : i.moveTo(M(f.t), C(f.kg))), i.stroke(), i.globalAlpha = 1), e.length > 1) {
      i.strokeStyle = y, i.lineWidth = 2.5, i.lineJoin = "round", i.beginPath(), e.forEach((x, O) => O ? i.lineTo(M(x.t), C(x.kg)) : i.moveTo(M(x.t), C(x.kg))), i.stroke();
      const f = e[e.length - 1];
      i.lineTo(M(f.t), C(0)), i.lineTo(M(e[0].t), C(0)), i.closePath(), i.fillStyle = y, i.globalAlpha = 0.12, i.fill(), i.globalAlpha = 1, i.fillStyle = y, i.beginPath(), i.arc(M(f.t), C(f.kg), 4, 0, Math.PI * 2), i.fill();
    } else n > 0 && (i.fillStyle = y, i.beginPath(), i.arc(M(0), C(n), 4, 0, Math.PI * 2), i.fill());
  }
}
function is(s) {
  const e = [10, 20, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500];
  for (const t of e) if (s <= t) return t;
  return Math.ceil(s / 100) * 100;
}
function as(s) {
  const e = Math.floor(s / 60), t = s % 60;
  return `${e}:${t.toString().padStart(2, "0")}`;
}
function _e(s, e = {}) {
  const t = e.hold ?? 10, n = e.rest ?? 20, i = e.reps ?? 6, a = e.ramp ?? 5, o = e.total ?? 60;
  switch (s) {
    case "free":
      return { id: s, label: "Free set", describe: "Open-ended. Start, work, stop.", phases: [] };
    case "countdown":
      return {
        id: s,
        label: `Countdown ${o}s`,
        describe: "One continuous max effort for the whole timer — the ARX protocol.",
        phases: [{ name: "Get ready", seconds: 3, cue: "rest" }, { name: "GO — max effort", seconds: o, cue: "work" }]
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
      return _e("free");
  }
}
function Lt(s) {
  if (!s.repeat || s.phases.length < 2) return s.phases;
  const [e, ...t] = s.phases, n = [e];
  for (let i = 0; i < s.repeat; i++)
    for (const a of t)
      i === s.repeat - 1 && a === t[t.length - 1] && a.cue === "rest" || n.push({ ...a, name: t.length > 1 && a.cue !== "rest" ? `${a.name} ${i + 1}/${s.repeat}` : a.name });
  return n;
}
class rs {
  constructor() {
    this.timeline = [], this.idx = -1, this.phaseStart = 0, this.timer = null, this.running = !1, this.onPhase = () => {
    }, this.onTick = () => {
    }, this.onDone = () => {
    };
  }
  start(e) {
    this.timeline = Lt(e), this.idx = -1, this.running = !0, this.next(), this.timer = setInterval(() => this.tick(), 100);
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
var ht;
(function(s) {
  s[s.Flush = 0] = "Flush", s[s.Add = 1] = "Add";
})(ht || (ht = {}));
const be = te("TextToSpeech", {
  web: () => Promise.resolve().then(() => Fs).then((s) => new s.TextToSpeechWeb())
}), xe = B.isNativePlatform();
let Ne = null;
function os() {
  return Ne || (Ne = new (window.AudioContext || window.webkitAudioContext)()), Ne;
}
function Y(s = 880, e = 120, t = 0.25) {
  try {
    const n = os(), i = n.createOscillator(), a = n.createGain();
    i.frequency.value = s, i.type = "sine", a.gain.value = t, i.connect(a), a.connect(n.destination), i.start(), a.gain.exponentialRampToValueAtTime(1e-4, n.currentTime + e / 1e3), i.stop(n.currentTime + e / 1e3);
  } catch {
  }
}
const K = {
  go: () => Y(1200, 220, 0.3),
  rest: () => Y(500, 220, 0.25),
  tick: () => Y(900, 60, 0.15),
  done: () => {
    Y(1e3, 120), setTimeout(() => Y(1300, 160), 140), setTimeout(() => Y(1600, 220), 320);
  },
  inZone: () => Y(1e3, 50, 0.1),
  outZone: () => Y(300, 120, 0.2)
};
class cs {
  constructor() {
    if (this.enabled = !0, this.onSpeak = () => {
    }, this.lastSpoke = 0, this.lastText = "", this.keep = [], this.voice = null, this.busySince = 0, this.nativeBusy = !1, "speechSynthesis" in window) {
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
    if (xe) return this.nativeBusy;
    try {
      return speechSynthesis.speaking || speechSynthesis.pending ? (this.busySince || (this.busySince = Date.now()), Date.now() - this.busySince > 4e3 ? (this.reset(), !1) : !0) : (this.busySince = 0, !1);
    } catch {
      return !1;
    }
  }
  /** Hard reset of the engine. */
  reset() {
    if (xe) {
      be.stop().catch(() => {
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
    if (xe)
      try {
        return `${(await be.getSupportedVoices()).voices.length} native voices`;
      } catch {
        return "native TTS unavailable";
      }
    if (!("speechSynthesis" in window)) return "no speech engine in this browser — open in Chrome";
    const e = speechSynthesis.getVoices().length;
    return e ? `${e} voices` : "no voices installed";
  }
  say(e, t = !1, n = !1) {
    if (!this.enabled) return;
    if (this.onSpeak(e), xe) {
      if (this.nativeBusy && !t) return;
      this.nativeBusy = !0, (t ? be.stop().catch(() => {
      }) : Promise.resolve()).then(() => be.speak({ text: e, lang: "en-US", rate: 1.2, pitch: 1, volume: 1, category: "ambient" })).catch(() => {
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
        a.rate = 1.2, a.lang = "en-US", this.voice && (a.voice = this.voice), this.keep.push(a), this.keep.length > 8 && this.keep.shift(), a.onend = () => {
          const o = this.keep.indexOf(a);
          o >= 0 && this.keep.splice(o, 1);
        }, speechSynthesis.speak(a), this.lastSpoke = i, this.lastText = e;
      } catch {
      }
  }
}
function ls(s) {
  const e = Math.floor(s / 60), t = s % 60;
  return t === 0 && e > 0 ? e === 1 ? "1 minute" : `${e} minutes` : String(t);
}
const Pt = te("Preferences", {
  web: () => Promise.resolve().then(() => Is).then((s) => new s.PreferencesWeb())
}), Se = "ufl.sets.v1", je = "ufl.max.v1", ft = "ufl.exercises.v1", Dt = [
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
function us(s) {
  return /^SR\b|self.?resisted/i.test(s) ? "self-resisted" : "iso";
}
async function Ve(s, e) {
  try {
    const t = B.isNativePlatform() ? (await Pt.get({ key: s })).value : localStorage.getItem(s);
    return t ? JSON.parse(t) : e;
  } catch {
    return e;
  }
}
async function ae(s, e) {
  const t = JSON.stringify(e);
  B.isNativePlatform() ? await Pt.set({ key: s, value: t }) : localStorage.setItem(s, t);
}
const A = {
  async sets() {
    return Ve(Se, []);
  },
  async saveSet(s) {
    const e = await this.sets();
    e.push(s), await ae(Se, e.slice(-500));
  },
  async updateSet(s) {
    const e = await this.sets(), t = e.findIndex((n) => n.id === s.id);
    t >= 0 ? e[t] = s : e.push(s), await ae(Se, e);
  },
  async deleteSet(s) {
    const e = await this.sets();
    await ae(Se, e.filter((t) => t.id !== s));
  },
  async maxes() {
    return Ve(je, {});
  },
  async setMax(s, e, t) {
    const n = await this.maxes();
    n[`${s}|${e}`] = { kg: t, at: Date.now() }, await ae(je, n);
  },
  async deleteMax(s) {
    const e = await this.maxes();
    delete e[s], await ae(je, e);
  },
  async exercises() {
    return Ve(ft, Dt);
  },
  async saveExercises(s) {
    await ae(ft, s);
  }
};
function ds(s) {
  s.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, t) {
        return new Proxy({}, {
          get(n, i) {
            return (a, o, r) => {
              const l = s.Capacitor.Plugins[t];
              if (l === void 0) {
                r(new Error(`Capacitor plugin ${t} not found`));
                return;
              }
              if (typeof l[i] != "function") {
                r(new Error(`Method ${i} not found in Capacitor plugin ${t}`));
                return;
              }
              (async () => {
                try {
                  const u = await l[i](a);
                  o(u);
                } catch (u) {
                  r(u);
                }
              })();
            };
          }
        });
      }
    }
  );
}
function hs(s) {
  s.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, t) {
        return s.cordova.plugins[t];
      }
    }
  );
}
function fs(s = !1) {
  typeof window > "u" || (window.CapacitorUtils = window.CapacitorUtils || {}, window.Capacitor !== void 0 && !s ? ds(window) : window.cordova !== void 0 && hs(window));
}
var We;
(function(s) {
  s.Documents = "DOCUMENTS", s.Data = "DATA", s.Library = "LIBRARY", s.Cache = "CACHE", s.External = "EXTERNAL", s.ExternalStorage = "EXTERNAL_STORAGE", s.ExternalCache = "EXTERNAL_CACHE", s.LibraryNoCloud = "LIBRARY_NO_CLOUD", s.Temporary = "TEMPORARY";
})(We || (We = {}));
var Ce;
(function(s) {
  s.UTF8 = "utf8", s.ASCII = "ascii", s.UTF16 = "utf16";
})(Ce || (Ce = {}));
const ps = te("Filesystem", {
  web: () => Promise.resolve().then(() => Us).then((s) => new s.FilesystemWeb())
});
fs();
const gs = te("Share", {
  web: () => Promise.resolve().then(() => js).then((s) => new s.ShareWeb())
});
function ms(s) {
  const e = ["id", "date_performed", "recorded_at", "exercise", "side", "mode", "duration_s", "peak_kg", "avg_kg", "output_kgs", "inroad_pct", "reps", "auto_reps", "rep_peaks"], t = s.map((n) => [
    n.id,
    me(ne(n)),
    new Date(n.startedAt).toISOString(),
    pt(n.exercise),
    n.side,
    n.mode,
    n.durationS.toFixed(1),
    n.peak,
    n.avg,
    n.output,
    n.inroad,
    ce(n),
    n.reps?.length ?? 0,
    pt((n.reps ?? []).map((i) => i.peak).join(" "))
  ].join(","));
  return [e.join(","), ...t].join(`
`);
}
function vs(s) {
  return ["t_s,kg", ...s.samples.map((e) => `${e.t.toFixed(2)},${e.kg.toFixed(2)}`)].join(`
`);
}
function pt(s) {
  return `"${s.replace(/"/g, '""')}"`;
}
async function ze(s, e, t) {
  if (B.isNativePlatform()) {
    const o = await ps.writeFile({ path: s, data: e, directory: We.Cache, encoding: Ce.UTF8 });
    await gs.share({ title: s, files: [o.uri] });
    return;
  }
  const n = new Blob([e], { type: t }), i = URL.createObjectURL(n), a = document.createElement("a");
  a.href = i, a.download = s, document.body.appendChild(a), a.click(), setTimeout(() => {
    URL.revokeObjectURL(i), a.remove();
  }, 500);
}
function me(s) {
  const e = new Date(s);
  return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
class ws {
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
function Q() {
  return window.GymLog ?? null;
}
function Ct(s) {
  return {
    id: `fl-${s.id}`,
    date: me(ne(s)),
    exercise: s.exercise,
    kg: s.peak,
    reps: ce(s),
    variation: us(s.exercise),
    note: [s.side !== "both" ? s.side : "", s.mode, s.note].filter(Boolean).join(" · ")
  };
}
function ys() {
  const s = Q();
  if (s)
    for (const e of Dt) s.addExercise(e);
}
const c = (s) => document.getElementById(s);
let J = null, X = null, $e = 0, P = [], j = [], Oe = null, Z = 0, H = 0, re = null, W = !0, pe = localStorage.getItem("ufl.ghostOn") !== "0", ke = null;
const Re = (s, e) => localStorage.getItem(s) ?? e;
let Le = Math.max(1, Number(Re("ufl.calloutEvery", "5"))), Ge = Re("ufl.calloutOn", "1") === "1", Ke = Re("ufl.secBeep", "0") === "1", Ye = Re("ufl.secCount", "0") === "1", Pe = null, He = -1;
const L = new cs(), V = new ss(), G = new rs(), z = new Et(c("chart")), ue = c("progressChart"), bs = {
  countdown: [{ key: "total", label: "seconds", def: 60 }],
  ramp: [{ key: "ramp", label: "ramp s", def: 5 }, { key: "hold", label: "hold s", def: 10 }],
  repeaters: [{ key: "reps", label: "reps", def: 6 }, { key: "hold", label: "on s", def: 10 }, { key: "rest", label: "off s", def: 20 }]
};
async function xs() {
  ys(), P = Q()?.exerciseNames() ?? await A.exercises(), j = await A.sets(), Te(), $t(), await q(), ee(), ie(), Os(), Mt(), L.enabled = c("voiceOn").checked;
}
function Te() {
  for (const t of ["exercise", "maxExercise"]) {
    const n = c(t), i = n.value;
    n.innerHTML = P.map((a) => `<option>${T(a)}</option>`).join(""), i && P.includes(i) && (n.value = i);
  }
  const s = c("histExercise"), e = s.value;
  s.innerHTML = '<option value="">All</option>' + P.map((t) => `<option>${T(t)}</option>`).join(""), s.value = e;
}
function $t() {
  const s = c("protocol").value, e = c("params");
  e.innerHTML = (bs[s] ?? []).map((t) => `<label>${t.label}<input type="number" data-k="${t.key}" value="${t.def}" min="1" /></label>`).join(""), c("protocolHelp").textContent = _e(s, Je()).describe;
}
function Je() {
  const s = {};
  return c("params").querySelectorAll("input").forEach((e) => s[e.dataset.k] = Number(e.value) || 1), s;
}
async function q() {
  const s = c("exercise").value, e = c("side").value, t = j.filter((i) => i.exercise === s && i.side === e);
  Oe = t.length ? t[t.length - 1] : null, Z = t.reduce((i, a) => Math.max(i, a.output), 0), H = (await A.maxes())[`${s}|${e}`]?.kg ?? 0, c("zoneMax").textContent = H ? `(max ${H} kg → ${De().lo.toFixed(1)}–${De().hi.toFixed(1)} kg)` : "(no max yet — run a Max test)", c("sGoal").textContent = Z ? E(Z) : "–", z.opts.ghost = pe ? Oe?.samples ?? null : null, z.opts.zone = Ze() ? De() : null, V.recording || (z.opts.marks = []);
}
function Ze() {
  return c("zoneOn").checked && H > 0;
}
function De() {
  const s = Number(c("zoneLo").value) / 100 * H, e = Number(c("zoneHi").value) / 100 * H;
  return { lo: Math.min(s, e), hi: Math.max(s, e) };
}
async function gt(s) {
  J && await J.stop(), J = s, s.onStatus(Xe), s.onSample((e) => {
    $e = e.kg, Ae === "live" && (c("statusKg").textContent = `· ${e.kg.toFixed(1)} kg`), V.push(e), Ss(e.kg);
  });
  try {
    await s.start(), c("btnTare").disabled = !1, c("btnStart").disabled = !1;
  } catch (e) {
    Xe("error"), c("statusText").textContent = e.message, alert("Connect failed: " + e.message);
  }
}
let Ae = "idle";
function Xe(s) {
  Ae = s, c("statusDot").className = `dot ${s}`, c("statusPill").className = `pill ${s}`;
  const e = {
    idle: "Not connected",
    scanning: "Listening for scale… turn it on / pull the hook",
    live: `${J?.name ?? "Scale"} connected ✓`,
    lost: "Signal lost — is the scale still on?",
    error: "Error"
  };
  c("statusText").textContent = e[s], s !== "live" && (c("statusKg").textContent = "");
  const t = c("btnConnect");
  t.textContent = s === "live" || s === "scanning" ? "Disconnect" : "Connect scale";
}
let mt = 0;
function Ss(s) {
  if (!V.recording || !Ze()) {
    re = null;
    return;
  }
  const e = G.running ? G.current() : null;
  if (e && e.cue === "rest") {
    re = null;
    return;
  }
  const t = De(), n = s >= t.lo && s <= t.hi, i = c("phaseBanner");
  n && re !== "in" && (re = "in", i.classList.add("inzone"), i.classList.remove("outzone"), L.say("in zone")), !n && re !== "out" && (re = "out", i.classList.add("outzone"), i.classList.remove("inzone"), s > 2 && L.say(s < t.lo ? "more" : "ease off"), W && s > 2 && Date.now() - mt > 1500 && (K.outZone(), mt = Date.now()));
}
function ks() {
  const s = c("protocol").value, e = _e(s, Je());
  c("summary").classList.add("hidden"), V.start(), L.unlock(), Ps(), z.opts.marks = [];
  const t = e.phases.length ? Lt(e).reduce((n, i) => n + i.seconds, 0) : 60;
  z.opts.windowS = Math.max(10, Math.ceil(t / 10) * 10), c("btnStart").classList.add("hidden"), c("btnStop").classList.remove("hidden"), At(!0), e.phases.length ? (G.onPhase = Es, G.onTick = Ls, G.onDone = () => Ot(), G.start(e)) : (Qe("work", "Free set — go", ""), L.say("Go", !0), W && K.go());
}
function Es(s, e, t) {
  Qe(s.cue, s.name, s.seconds.toFixed(0)), s.cue === "work" ? (W && K.go(), L.say(s.name.replace(/\d+\/\d+/, ""), !0), z.opts.marks.push(V.elapsed())) : s.cue === "ramp" ? (W && K.go(), L.say("Build up", !0)) : (e > 0 && W && K.rest(), e > 0 && L.say(e === t - 1 ? "Done" : "Rest", !0));
}
let vt = -1;
function Ls(s, e) {
  c("phaseTime").textContent = s.toFixed(s < 10 ? 1 : 0);
  const t = Math.ceil(s);
  t !== vt && (vt = t, t <= 3 && t > 0 && W && K.tick());
}
async function Ot() {
  G.stop(), Tt();
  const s = c("exercise").value, e = c("side").value, t = c("protocol").value, n = V.finish({ exercise: s, side: e, mode: t });
  c("btnStop").classList.add("hidden"), c("btnStart").classList.remove("hidden"), At(!1), Qe("idle", "Done", "—"), W && K.done(), n && (t === "maxtest" && n.peak > 0 && (await A.setMax(s, e, n.peak), L.say(`New max ${n.peak.toFixed(0)} kilos`, !0)), await A.saveSet(n), j.push(n), Q()?.upsertForceSet(Ct(n)), await Ds(n), await q(), ee(), ie());
}
function Ps() {
  Tt(), He = -1, Pe = setInterval(() => {
    if (!V.recording) return;
    const s = Math.floor(V.elapsed());
    if (s === He || s === 0) return;
    He = s;
    const e = G.running ? G.current() : null;
    if (e && e.cue !== "work") return;
    const t = Ge && !Ze() && s % Le === 0;
    (Ke && W || t && W) && K.tick();
    const n = [];
    Ye && n.push(ls(s)), t && n.push($e.toFixed(0)), n.length && (!t && L.speaking() || L.say(n.join(", "), t, !0));
  }, 100);
}
function Tt() {
  Pe && clearInterval(Pe), Pe = null;
}
function At(s) {
  for (const e of ["exercise", "side", "protocol"]) c(e).disabled = s;
}
function Qe(s, e, t) {
  const n = c("phaseBanner");
  n.className = `banner ${s}`, c("phaseName").textContent = e, c("phaseTime").textContent = t;
}
async function Ds(s) {
  const e = Oe, t = await A.maxes(), n = s.side === "left" ? "right" : s.side === "right" ? "left" : null, i = [];
  i.push($("Duration", `${s.durationS.toFixed(1)} s`)), i.push($("Peak force", `${E(s.peak)} kg`, ge(s.peak, e?.peak))), i.push($("Intensity (avg)", `${E(s.avg)} kg`, ge(s.avg, e?.avg))), i.push($("Output (kg·s)", E(s.output), ge(s.output, e?.output))), i.push($("Inroad", `${s.inroad.toFixed(0)}%`, s.inroad >= 30 ? '<span class="badge good">deep fatigue</span>' : s.inroad >= 15 ? '<span class="badge">moderate</span>' : '<span class="badge warn">shallow — stopped early?</span>')), Z && i.push($("vs. best output", `${(s.output / Z * 100).toFixed(0)}%`, s.output > Z ? '<span class="badge good">new best</span>' : "")), H && i.push($("Peak as % of max", `${(s.peak / H * 100).toFixed(0)}%`));
  let a = "";
  if (s.reps && s.reps.length) {
    const l = Math.max(...s.reps.map((d) => d.peak));
    a = `<div class="muted" style="margin-top:8px">Reps: ${s.reps.length} · first ${E(s.reps[0].peak)} → last ${E(s.reps[s.reps.length - 1].peak)} kg · avg rep ${(s.reps.reduce((d, h) => d + h.durationS, 0) / s.reps.length).toFixed(1)} s</div>
      <div class="repbars">${s.reps.map((d) => `<div style="height:${Math.max(4, d.peak / l * 100)}%"><span>${d.peak.toFixed(0)}</span></div>`).join("")}</div>`;
    const u = s.mode === "critical" ? ns(s.reps) : null;
    u && (a += $("Critical force", `${E(u)} kg${H ? ` (${(u / H * 100).toFixed(0)}% of max)` : ""}`));
  }
  let o = "";
  if (n) {
    const l = t[`${s.exercise}|${s.side}`]?.kg, u = t[`${s.exercise}|${n}`]?.kg;
    if (l && u) {
      const d = (Math.abs(l - u) / Math.max(l, u) * 100).toFixed(0);
      o = $("Left/right gap", `${d}% (L ${E(s.side === "left" ? l : u)} / R ${E(s.side === "left" ? u : l)})`, Number(d) > 10 ? '<span class="badge warn">asymmetry</span>' : '<span class="badge good">balanced</span>');
    }
  }
  const r = c("summary");
  r.innerHTML = `<h4>${T(s.exercise)} · ${s.side} · ${s.mode}</h4>${i.join("")}${o}${a}
    ${_t(s, "sum")}`, r.classList.remove("hidden"), Rt(s, "sum", async () => {
    await q(), ee();
  });
}
function _t(s, e) {
  const t = me(ne(s));
  return `<div class="editor">
      <label>Reps <input type="number" id="${e}Reps" min="1" step="1" inputmode="numeric" placeholder="1" value="${s.manualReps ?? ""}" /></label>
      <label>Date performed <input type="date" id="${e}Date" value="${t}" max="${me(Date.now())}" /></label>
      <label class="grow">Note <input type="text" id="${e}Note" placeholder="optional" value="${T(s.note ?? "")}" /></label>
      <button class="sm primary" id="${e}Save" type="button">Save</button>
      <span class="muted" id="${e}Msg">${s.reps?.length ? `auto-detected ${s.reps.length} — for info only` : "blank reps = 1"}</span>
    </div>`;
}
function Rt(s, e, t) {
  const n = async () => {
    const i = Number(c(`${e}Reps`).value);
    s.manualReps = i > 0 ? Math.round(i) : void 0;
    const a = c(`${e}Date`).value;
    if (a) {
      const [r, l, u] = a.split("-").map(Number), d = new Date(s.startedAt);
      s.performedAt = new Date(r, l - 1, u, d.getHours(), d.getMinutes(), d.getSeconds()).getTime();
    }
    s.note = c(`${e}Note`).value.trim() || void 0, await A.updateSet(s), Q()?.upsertForceSet(Ct(s));
    const o = j.findIndex((r) => r.id === s.id);
    o >= 0 && (j[o] = s), c(`${e}Msg`).textContent = `saved · ${ce(s)} rep${ce(s) === 1 ? "" : "s"} · ${me(ne(s))}`, await t();
  };
  c(`${e}Save`).onclick = n;
  for (const i of [`${e}Reps`, `${e}Date`, `${e}Note`]) c(i).onkeydown = (a) => {
    a.key === "Enter" && n();
  };
}
function $(s, e, t = "") {
  return `<div class="fl-line"><span>${s}</span><span>${e} ${t}</span></div>`;
}
function ge(s, e) {
  if (!e) return "";
  const t = (s - e) / e * 100;
  return `<span class="${t >= 0 ? "fl-d up" : "fl-d down"}">${t >= 0 ? "+" : ""}${t.toFixed(1)}%</span>`;
}
function Mt() {
  const s = V.current(), e = V.elapsed();
  if (c("liveKg").textContent = $e.toFixed(1), c("elapsed").textContent = Bt(e), z.draw(s, e, $e), V.recording && s.length > 2) {
    const t = St(s);
    c("sPeak").textContent = E(t.peak), c("sAvg").textContent = E(t.avg), c("sOut").textContent = E(t.output), c("sInroad").textContent = `${t.inroad.toFixed(0)}%`;
    const n = Oe;
    c("dPeak").innerHTML = ge(t.peak, n?.peak), c("dAvg").innerHTML = ge(t.avg, n?.avg), c("dOut").innerHTML = Z ? `<span class="muted">${(t.output / Z * 100).toFixed(0)}% of goal</span>` : "";
    const i = kt(s);
    c("sReps").textContent = i.length ? String(i.length) : "–", c("dReps").textContent = i.length ? `last ${i[i.length - 1].peak.toFixed(0)} kg` : "";
  }
  requestAnimationFrame(Mt);
}
let de = null;
function ee() {
  const s = c("histExercise").value, e = j.filter((t) => !s || t.exercise === s).slice().sort((t, n) => ne(n) - ne(t) || n.startedAt - t.startedAt);
  c("histBody").innerHTML = e.map((t) => `<tr data-id="${t.id}" class="${de?.id === t.id ? "sel" : ""}">
      <td>${new Date(ne(t)).toLocaleDateString(void 0, { month: "short", day: "numeric" })}</td>
      <td>${T(t.exercise)}${t.side !== "both" ? ` <small class="muted">${t.side[0].toUpperCase()}</small>` : ""}</td>
      <td>${t.mode}</td><td>${ce(t)}</td><td>${Bt(t.durationS)}</td><td>${E(t.peak)}</td><td>${E(t.avg)}</td><td>${E(t.output)}</td><td>${t.inroad.toFixed(0)}%</td>
      <td><button data-del="${t.id}">✕</button></td></tr>`).join("") || '<tr><td colspan="10" class="muted">No sets yet.</td></tr>', c("histBody").querySelectorAll("tr[data-id]").forEach((t) => {
    t.onclick = (n) => {
      n.target.dataset.del || (de = j.find((i) => i.id === t.dataset.id) ?? null, ee(), Cs());
    };
  }), c("histBody").querySelectorAll("button[data-del]").forEach((t) => {
    t.onclick = async () => {
      confirm("Delete this set?") && (await A.deleteSet(t.dataset.del), Q()?.removeForceSet(`fl-${t.dataset.del}`), j = j.filter((n) => n.id !== t.dataset.del), de?.id === t.dataset.del && (de = null), ee(), await q());
    };
  }), $s(s ? e.slice().reverse() : []);
}
function Cs() {
  const s = de, e = c("histDetail");
  if (!s) {
    e.classList.add("hidden");
    return;
  }
  e.classList.remove("hidden"), e.innerHTML = `<h4>${T(s.exercise)} · ${new Date(s.startedAt).toLocaleString()}</h4>
    <div class="chartwrap small"><canvas id="histCanvas"></canvas></div>
    ${$("Peak", `${E(s.peak)} kg`)}${$("Intensity", `${E(s.avg)} kg`)}${$("Output", E(s.output))}${$("Inroad", `${s.inroad.toFixed(0)}%`)}
    ${$("Reps (logged)", String(ce(s)))}
    ${s.reps?.length ? $("Auto-detected", `${s.reps.length} (${s.reps.map((n) => n.peak.toFixed(0)).join(", ")} kg)`) : ""}
    ${_t(s, "hist")}
    <div class="actions-inline" style="margin-top:8px"><button class="sm" id="btnUseGhost">Use as ghost trace</button><button class="sm ghost" id="btnSetCsv">Export samples CSV</button></div>`, Rt(s, "hist", async () => {
    ee(), await q();
  });
  const t = new Et(c("histCanvas"));
  t.opts.windowS = Math.max(10, Math.ceil(s.durationS / 10) * 10), t.opts.marks = s.reps?.map((n) => n.startS) ?? [], t.draw(s.samples, s.durationS, 0), c("btnUseGhost").onclick = () => {
    pe = !0, localStorage.setItem("ufl.ghostOn", "1"), c("ghostOn").checked = !0, z.opts.ghost = s.samples, Ft("train");
  }, c("btnSetCsv").onclick = () => ze(`set-${s.id}.csv`, vs(s), "text/csv");
}
function $s(s) {
  const e = c("progress");
  if (s.length < 2) {
    e.classList.add("hidden");
    return;
  }
  e.classList.remove("hidden");
  const t = Math.max(1, window.devicePixelRatio || 1), n = e.clientWidth - 12, i = 160;
  ue.width = n * t, ue.height = i * t, ue.style.width = `${n}px`, ue.style.height = `${i}px`;
  const a = ue.getContext("2d");
  a.setTransform(t, 0, 0, t, 0, 0), a.clearRect(0, 0, n, i);
  const o = getComputedStyle(document.getElementById("view-force") ?? document.documentElement), r = 36, l = 8, u = 10, d = 18, h = n - r - l, p = i - u - d, w = Math.max(10, ...s.map((b) => b.peak)) * 1.1, m = (b) => r + b / Math.max(1, s.length - 1) * h, v = (b) => u + p - b / w * p;
  a.strokeStyle = o.getPropertyValue("--grid"), a.fillStyle = o.getPropertyValue("--muted"), a.font = "10px system-ui", a.textAlign = "right";
  for (let b = 0; b <= 4; b++) {
    const U = w / 4 * b;
    a.beginPath(), a.moveTo(r, v(U)), a.lineTo(n - l, v(U)), a.stroke(), a.fillText(U.toFixed(0), r - 4, v(U) + 3);
  }
  const y = [["peak", o.getPropertyValue("--accent")], ["avg", o.getPropertyValue("--accent2")]];
  for (const [b, U] of y)
    a.strokeStyle = U, a.lineWidth = 2, a.beginPath(), s.forEach((_, I) => I ? a.lineTo(m(I), v(_[b])) : a.moveTo(m(I), v(_[b]))), a.stroke(), a.fillStyle = U, s.forEach((_, I) => {
      a.beginPath(), a.arc(m(I), v(_[b]), 3, 0, Math.PI * 2), a.fill();
    });
  a.fillStyle = o.getPropertyValue("--muted"), a.textAlign = "left", a.fillText("peak", r + 4, u + 10), a.fillStyle = o.getPropertyValue("--accent2"), a.fillText("intensity", r + 36, u + 10);
}
async function ie() {
  const s = await A.maxes(), e = Object.entries(s).map(([t, n]) => {
    const [i, a] = t.split("|");
    return `<tr><td>${T(i)}</td><td>${a}</td><td>${E(n.kg)}</td><td>${new Date(n.at).toLocaleDateString()}</td><td><button data-mdel="${T(t)}">✕</button></td></tr>`;
  });
  c("maxBody").innerHTML = e.join("") || '<tr><td colspan="5" class="muted">No maxes yet.</td></tr>', c("maxBody").querySelectorAll("button[data-mdel]").forEach((t) => t.onclick = async () => {
    await A.deleteMax(t.dataset.mdel), ie(), q();
  }), c("exList").innerHTML = P.map((t) => `<span>${T(t)}<button data-xdel="${T(t)}">✕</button></span>`).join(""), c("exList").querySelectorAll("button[data-xdel]").forEach((t) => t.onclick = async () => {
    const n = Q();
    if (n) {
      if (!n.removeExercise(t.dataset.xdel)) {
        alert("Built-in Gym Log exercises can't be removed here.");
        return;
      }
      P = n.exerciseNames();
    } else
      P = P.filter((i) => i !== t.dataset.xdel), await A.saveExercises(P);
    Te(), ie();
  });
}
function Ft(s) {
  document.querySelectorAll(".fl-tabs button").forEach((e) => e.classList.toggle("active", e.dataset.tab === s)), document.querySelectorAll(".fl-tab").forEach((e) => e.classList.toggle("active", e.id === `tab-${s}`)), s === "train" && z.resize(), s === "history" && ee();
}
function Os() {
  document.querySelectorAll(".fl-tabs button").forEach((r) => r.onclick = () => Ft(r.dataset.tab)), c("btnConnect").onclick = async () => {
    if (J instanceof dt && (Ae === "live" || Ae === "scanning")) {
      await J.stop(), J = null, Xe("idle");
      return;
    }
    c("simPanel").classList.add("hidden"), X = null;
    const r = new dt();
    r.onSeen = () => Ts(r), gt(r);
  }, c("btnSim").onclick = () => {
    X = new ts(), X.exact = c("simExact").checked, c("simPanel").classList.remove("hidden"), gt(X);
  }, c("simExact").onchange = (r) => {
    const l = r.target.checked;
    X && (X.exact = l), c("simHelp").textContent = l ? "Reading tracks the slider exactly." : 'Slide up to "push", back to 0 to rest. Fatigue is simulated.';
  }, c("btnTare").onclick = () => J?.tare(), c("btnStart").onclick = ks, c("camOn").checked = localStorage.getItem("ufl.camOn") === "1";
  const s = async () => {
    const r = c("camOn").checked;
    if (localStorage.setItem("ufl.camOn", r ? "1" : "0"), r) {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert("Camera not available here."), c("camOn").checked = !1;
        return;
      }
      ke ?? (ke = new ws(c("camVideo")));
      try {
        await ke.start(), c("camPip").classList.remove("hidden"), c("btnCamFlip").classList.remove("hidden");
      } catch (l) {
        alert("Camera failed: " + l.message + `
Allow the Camera permission for UY Force Lab in Android settings.`), c("camOn").checked = !1;
      }
    } else
      ke?.stop(), c("camPip").classList.add("hidden"), c("btnCamFlip").classList.add("hidden");
  };
  c("camOn").onchange = s, c("camOn").checked && s(), c("btnCamFlip").onclick = () => ke?.flip();
  const e = c("camPip"), t = localStorage.getItem("ufl.pipPos");
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
    const l = r.clientX - n.x, u = r.clientY - n.y;
    if (Math.abs(l) + Math.abs(u) > 6 && (n.moved = !0), !n.moved) return;
    const d = e.getBoundingClientRect(), h = Math.min(window.innerWidth - d.width, Math.max(0, n.l + l)), p = Math.min(window.innerHeight - d.height, Math.max(0, n.t + u));
    e.style.left = `${h}px`, e.style.top = `${p}px`;
  }, e.onpointerup = () => {
    if (n) {
      if (n.moved) {
        const r = e.getBoundingClientRect();
        localStorage.setItem("ufl.pipPos", `${Math.round(r.left)},${Math.round(r.top)}`);
      } else e.classList.toggle("large");
      n = null;
    }
  }, c("btnStop").onclick = Ot, c("simEffort").oninput = (r) => {
    const l = Number(r.target.value);
    X && (X.effort = l), c("simVal").textContent = String(l);
  }, c("exercise").onchange = q, c("btnNewEx").onclick = () => {
    c("newExBox").classList.remove("hidden"), c("newExName").focus();
  }, c("btnNewExCancel").onclick = () => {
    c("newExBox").classList.add("hidden"), c("newExName").value = "";
  };
  const i = async () => {
    const r = c("newExName").value.trim();
    if (r) {
      if (!P.includes(r)) {
        const l = Q();
        l ? (l.addExercise(r), P = l.exerciseNames()) : (P.push(r), await A.saveExercises(P));
      }
      Te(), c("exercise").value = r, c("newExBox").classList.add("hidden"), c("newExName").value = "", ie(), await q();
    }
  };
  c("btnNewExSave").onclick = i, c("newExName").onkeydown = (r) => {
    r.key === "Enter" && i();
  }, c("side").onchange = q, c("protocol").onchange = () => $t(), c("params").oninput = () => c("protocolHelp").textContent = _e(c("protocol").value, Je()).describe;
  for (const r of ["zoneOn", "zoneLo", "zoneHi"]) c(r).oninput = q;
  c("ghostOn").checked = pe, c("ghostOn").onchange = (r) => {
    pe = r.target.checked, localStorage.setItem("ufl.ghostOn", pe ? "1" : "0"), q();
  }, c("histExercise").onchange = ee, c("btnCsv").onclick = () => ze(`uy-force-lab-${wt()}.csv`, ms(j), "text/csv"), c("btnJson").onclick = () => ze(`uy-force-lab-${wt()}.json`, JSON.stringify(j, null, 1), "application/json"), c("voiceOn").onchange = (r) => L.enabled = r.target.checked, c("beepOn").onchange = (r) => W = r.target.checked, c("calloutEvery").value = String(Le), c("calloutEvery").onchange = (r) => {
    Le = Math.max(1, Number(r.target.value) || 1), localStorage.setItem("ufl.calloutEvery", String(Le));
  };
  const a = (r, l, u, d) => {
    const h = c(r);
    h.checked = d, h.onchange = () => {
      u(h.checked), localStorage.setItem(l, h.checked ? "1" : "0");
    };
  };
  a("calloutOn", "ufl.calloutOn", (r) => Ge = r, Ge), a("secBeep", "ufl.secBeep", (r) => Ke = r, Ke), a("secCount", "ufl.secCount", (r) => Ye = r, Ye);
  let o = null;
  L.onSpeak = (r) => {
    const l = c("said");
    l.textContent = `🔊 ${r}`, l.classList.add("on"), o && clearTimeout(o), o = setTimeout(() => l.classList.remove("on"), 900);
  }, document.addEventListener("pointerdown", () => L.unlock(), { once: !0 }), document.addEventListener("visibilitychange", () => {
    document.visibilityState === "visible" && L.reset();
  }), c("btnTestVoice").onclick = async () => {
    L.reset();
    const r = c("voiceStatus");
    r.textContent = await L.status(), L.say("Force lab voice check, 1, 2, 3", !0);
  }, c("btnSetMax").onclick = async () => {
    const r = Number(c("maxKg").value);
    r && (await A.setMax(c("maxExercise").value, c("maxSide").value, r), c("maxKg").value = "", ie(), q());
  }, c("btnAddEx").onclick = async () => {
    const r = c("newEx").value.trim();
    if (!(!r || P.includes(r))) {
      {
        const l = Q();
        l ? (l.addExercise(r), P = l.exerciseNames()) : (P.push(r), await A.saveExercises(P));
      }
      c("newEx").value = "", Te(), ie();
    }
  };
}
function Ts(s) {
  const e = [...s.seen.values()].sort((t, n) => n.t - t.t).slice(0, 12);
  c("seenBody").innerHTML = e.map((t) => `<tr><td>${T(t.name || "(no name)")}<br><small class="muted">${T(t.id)}</small></td><td>${t.rssi}</td><td>${T(t.keys || "–")}</td><td style="white-space:normal;font-family:monospace;font-size:11px">${T(t.hex || "–")}</td><td>${t.kg === null ? "–" : t.kg.toFixed(2)}</td></tr>`).join("") || '<tr><td colspan="5" class="muted">Listening… nothing heard yet.</td></tr>';
}
function E(s) {
  return s >= 100 ? s.toFixed(0) : s.toFixed(1);
}
function Bt(s) {
  const e = Math.floor(s / 60), t = Math.floor(s % 60);
  return `${e}:${t.toString().padStart(2, "0")}`;
}
function wt() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function T(s) {
  return s.replace(/[&<>"]/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[e]);
}
xs();
window.ForceLab = { onShow() {
  z.resize();
} };
async function As(s, e, t) {
  let n;
  return Promise.race([
    s,
    new Promise((i, a) => {
      n = setTimeout(() => a(t), e);
    })
  ]).finally(() => clearTimeout(n));
}
class _s extends se {
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
    const o = !this.discoveredDevices.has(a);
    if (!(!((t = this.requestBleDeviceOptions) === null || t === void 0) && t.serviceData && !this.matchesServiceDataFilter(e)) && (o || !((n = this.requestBleDeviceOptions) === null || n === void 0) && n.allowDuplicates)) {
      this.discoveredDevices.set(a, !0);
      const r = this.getBleDevice(e.device), l = {
        device: r,
        localName: r.name,
        rssi: e.rssi,
        txPower: e.txPower,
        manufacturerData: ot(e.manufacturerData),
        serviceData: ot(e.serviceData),
        uuids: (i = e.uuids) === null || i === void 0 ? void 0 : i.map(Xt)
      };
      this.notifyListeners("onScanResult", l);
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
      const o = (t = e.timeout) !== null && t !== void 0 ? t : this.DEFAULT_CONNECTION_TIMEOUT;
      await As(i.gatt.connect(), o, a);
    } catch (o) {
      throw await ((n = i.gatt) === null || n === void 0 ? void 0 : n.disconnect()), o === a ? new Error("Connection timeout") : o;
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
    for (const o of i) {
      const r = await o.getCharacteristics(), l = [];
      for (const u of r)
        l.push({
          uuid: u.uuid,
          properties: this.getProperties(u),
          descriptors: await this.getDescriptors(u)
        });
      a.push({ uuid: o.uuid, characteristics: l });
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
    typeof e.value == "string" ? n = he(e.value) : n = e.value, await t?.writeValueWithResponse(Be(n));
  }
  async writeWithoutResponse(e) {
    const t = await this.getCharacteristic(e);
    let n;
    typeof e.value == "string" ? n = he(e.value) : n = e.value, await t?.writeValueWithoutResponse(Be(n));
  }
  async readDescriptor(e) {
    const t = await this.getDescriptor(e);
    return { value: await t?.readValue() };
  }
  async writeDescriptor(e) {
    const t = await this.getDescriptor(e);
    let n;
    typeof e.value == "string" ? n = he(e.value) : n = e.value, await t?.writeValue(Be(n));
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
      const o = new Uint8Array(a.buffer), r = i.dataPrefix;
      if (!(o.length < r.byteLength))
        if (i.mask) {
          const l = i.mask;
          let u = !0;
          for (let d = 0; d < r.byteLength; d++)
            if ((o[d] & l.getUint8(d)) !== (r.getUint8(d) & l.getUint8(d))) {
              u = !1;
              break;
            }
          if (u)
            return !0;
        } else {
          let l = !0;
          for (let u = 0; u < r.byteLength; u++)
            if (o[u] !== r.getUint8(u)) {
              l = !1;
              break;
            }
          if (l)
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
const Rs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BluetoothLeWeb: _s
}, Symbol.toStringTag, { value: "Module" }));
class Ms extends se {
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
      }, n.onerror = (o) => {
        a(o);
      }, t.speak(n);
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
    const t = this.getSpeechSynthesisVoices(), n = new SpeechSynthesisUtterance(), { text: i, lang: a, rate: o, pitch: r, volume: l, voice: u } = e;
    return u !== void 0 && (n.voice = t[u]), l !== void 0 && (n.volume = l >= 0 && l <= 1 ? l : 1), o !== void 0 && (n.rate = o >= 0.1 && o <= 10 ? o : 1), r !== void 0 && (n.pitch = r >= 0 && r <= 2 ? r : 2), a && (n.lang = a), n.text = i, n;
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
const Fs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  TextToSpeechWeb: Ms
}, Symbol.toStringTag, { value: "Module" }));
class Bs extends se {
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
    const t = [], n = [], i = "_cap_", a = Object.keys(this.impl).filter((o) => o.indexOf(i) === 0);
    for (const o of a) {
      const r = o.substring(i.length), l = (e = this.impl.getItem(o)) !== null && e !== void 0 ? e : "", { value: u } = await this.get({ key: r });
      typeof u == "string" ? n.push(r) : (await this.set({ key: r, value: l }), t.push(r));
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
const Is = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PreferencesWeb: Bs
}, Symbol.toStringTag, { value: "Module" }));
function yt(s) {
  const e = s.split("/").filter((n) => n !== "."), t = [];
  return e.forEach((n) => {
    n === ".." && t.length > 0 && t[t.length - 1] !== ".." ? t.pop() : t.push(n);
  }), t.join("/");
}
function qs(s, e) {
  s = yt(s), e = yt(e);
  const t = s.split("/"), n = e.split("/");
  return s !== e && t.every((i, a) => i === n[a]);
}
class Me extends se {
  constructor() {
    super(...arguments), this.DB_VERSION = 1, this.DB_NAME = "Disc", this._writeCmds = ["add", "put", "delete"], this.downloadFile = async (e) => {
      var t, n;
      const i = bt(e, e.webFetchExtra), a = await fetch(e.url, i);
      let o;
      if (!e.progress)
        o = await a.blob();
      else if (!a?.body)
        o = new Blob();
      else {
        const l = a.body.getReader();
        let u = 0;
        const d = [], h = a.headers.get("content-type"), p = parseInt(a.headers.get("content-length") || "0", 10);
        for (; ; ) {
          const { done: v, value: y } = await l.read();
          if (v)
            break;
          d.push(y), u += y?.length || 0;
          const b = {
            url: e.url,
            bytes: u,
            contentLength: p
          };
          this.notifyListeners("progress", b);
        }
        const w = new Uint8Array(u);
        let m = 0;
        for (const v of d)
          typeof v > "u" || (w.set(v, m), m += v.length);
        o = new Blob([w.buffer], { type: h || void 0 });
      }
      return { path: (await this.writeFile({
        path: e.path,
        directory: (t = e.directory) !== null && t !== void 0 ? t : void 0,
        recursive: (n = e.recursive) !== null && n !== void 0 ? n : !1,
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
      const n = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      n.onupgradeneeded = Me.doUpgrade, n.onsuccess = () => {
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
    return this.initDb().then((i) => new Promise((a, o) => {
      const u = i.transaction(["FileStorage"], n).objectStore("FileStorage")[e](...t);
      u.onsuccess = () => a(u.result), u.onerror = () => o(u.error);
    }));
  }
  async dbIndexRequest(e, t, n) {
    const i = this._writeCmds.indexOf(t) !== -1 ? "readwrite" : "readonly";
    return this.initDb().then((a) => new Promise((o, r) => {
      const h = a.transaction(["FileStorage"], i).objectStore("FileStorage").index(e)[t](...n);
      h.onsuccess = () => o(h.result), h.onerror = () => r(h.error);
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
    const i = e.encoding, a = e.recursive, o = await this.dbRequest("get", [t]);
    if (o && o.type === "directory")
      throw Error("The supplied path is a directory.");
    const r = t.substr(0, t.lastIndexOf("/"));
    if (await this.dbRequest("get", [r]) === void 0) {
      const h = r.indexOf("/", 1);
      if (h !== -1) {
        const p = r.substr(h);
        await this.mkdir({
          path: p,
          directory: e.directory,
          recursive: a
        });
      }
    }
    if (!i && !(n instanceof Blob) && (n = n.indexOf(",") >= 0 ? n.split(",")[1] : n, !this.isBase64String(n)))
      throw Error("The supplied data is not valid base64 content.");
    const u = Date.now(), d = {
      path: t,
      folder: r,
      type: "file",
      size: n instanceof Blob ? n.size : n.length,
      ctime: u,
      mtime: u,
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
    const i = e.encoding, a = t.substr(0, t.lastIndexOf("/")), o = Date.now();
    let r = o;
    const l = await this.dbRequest("get", [t]);
    if (l && l.type === "directory")
      throw Error("The supplied path is a directory.");
    if (await this.dbRequest("get", [a]) === void 0) {
      const h = a.indexOf("/", 1);
      if (h !== -1) {
        const p = a.substr(h);
        await this.mkdir({
          path: p,
          directory: e.directory,
          recursive: !0
        });
      }
    }
    if (!i && !this.isBase64String(n))
      throw Error("The supplied data is not valid base64 content.");
    if (l !== void 0) {
      if (l.content instanceof Blob)
        throw Error("The occupied entry contains a Blob object which cannot be appended to.");
      l.content !== void 0 && !i ? n = btoa(atob(l.content) + atob(n)) : n = l.content + n, r = l.ctime;
    }
    const d = {
      path: t,
      folder: a,
      type: "file",
      size: n.length,
      ctime: r,
      mtime: o,
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
    const t = this.getPath(e.directory, e.path), n = e.recursive, i = t.substr(0, t.lastIndexOf("/")), a = (t.match(/\//g) || []).length, o = await this.dbRequest("get", [i]), r = await this.dbRequest("get", [t]);
    if (a === 1)
      throw Error("Cannot create Root directory");
    if (r !== void 0)
      throw Error("Current directory does already exist.");
    if (!n && a !== 2 && o === void 0)
      throw Error("Parent directory must exist");
    if (n && a !== 2 && o === void 0) {
      const d = i.substr(i.indexOf("/", 1));
      await this.mkdir({
        path: d,
        directory: e.directory,
        recursive: n
      });
    }
    const l = Date.now(), u = {
      path: t,
      folder: i,
      type: "directory",
      size: 0,
      ctime: l,
      mtime: l
    };
    await this.dbRequest("put", [u]);
  }
  /**
   * Remove a directory
   * @param options the options for the directory remove
   */
  async rmdir(e) {
    const { path: t, directory: n, recursive: i } = e, a = this.getPath(n, t), o = await this.dbRequest("get", [a]);
    if (o === void 0)
      throw Error("Folder does not exist.");
    if (o.type !== "directory")
      throw Error("Requested path is not a directory");
    const r = await this.readdir({ path: t, directory: n });
    if (r.files.length !== 0 && !i)
      throw Error("Folder is not empty");
    for (const l of r.files) {
      const u = `${t}/${l.name}`;
      (await this.stat({ path: u, directory: n })).type === "file" ? await this.deleteFile({ path: u, directory: n }) : await this.rmdir({ path: u, directory: n, recursive: i });
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
    return { files: await Promise.all(i.map(async (o) => {
      let r = await this.dbRequest("get", [o]);
      return r === void 0 && (r = await this.dbRequest("get", [o + "/"])), {
        name: o.substring(t.length + 1),
        type: r.type,
        size: r.size,
        ctime: r.ctime,
        mtime: r.mtime,
        uri: r.path
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
    const { to: i, from: a, directory: o } = e;
    if (!i || !a)
      throw Error("Both to and from must be provided");
    n || (n = o);
    const r = this.getPath(o, a), l = this.getPath(n, i);
    if (r === l)
      return {
        uri: l
      };
    if (qs(r, l))
      throw Error("To path cannot contain the from path");
    let u;
    try {
      u = await this.stat({
        path: i,
        directory: n
      });
    } catch {
      const m = i.split("/");
      m.pop();
      const v = m.join("/");
      if (m.length > 0 && (await this.stat({
        path: v,
        directory: n
      })).type !== "directory")
        throw new Error("Parent directory of the to path is a file");
    }
    if (u && u.type === "directory")
      throw new Error("Cannot overwrite a directory with a file");
    const d = await this.stat({
      path: a,
      directory: o
    }), h = async (w, m, v) => {
      const y = this.getPath(n, w), b = await this.dbRequest("get", [y]);
      b.ctime = m, b.mtime = v, await this.dbRequest("put", [b]);
    }, p = d.ctime ? d.ctime : Date.now();
    switch (d.type) {
      case "file": {
        const w = await this.readFile({
          path: a,
          directory: o
        });
        t && await this.deleteFile({
          path: a,
          directory: o
        });
        let m;
        !(w.data instanceof Blob) && !this.isBase64String(w.data) && (m = Ce.UTF8);
        const v = await this.writeFile({
          path: i,
          directory: n,
          data: w.data,
          encoding: m
        });
        return t && await h(i, p, d.mtime), v;
      }
      case "directory": {
        if (u)
          throw Error("Cannot move a directory over an existing object");
        try {
          await this.mkdir({
            path: i,
            directory: n,
            recursive: !1
          }), t && await h(i, p, d.mtime);
        } catch {
        }
        const w = (await this.readdir({
          path: a,
          directory: o
        })).files;
        for (const m of w)
          await this._copy({
            from: `${a}/${m.name}`,
            to: `${i}/${m.name}`,
            directory: o,
            toDirectory: n
          }, t);
        t && await this.rmdir({
          path: a,
          directory: o
        });
      }
    }
    return {
      uri: l
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
Me._debug = !0;
const Us = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  FilesystemWeb: Me
}, Symbol.toStringTag, { value: "Module" }));
class Ns extends se {
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
const js = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ShareWeb: Ns
}, Symbol.toStringTag, { value: "Module" }));
