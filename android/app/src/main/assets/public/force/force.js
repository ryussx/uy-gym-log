var at;
(function(s) {
  s[s.SCAN_MODE_LOW_POWER = 0] = "SCAN_MODE_LOW_POWER", s[s.SCAN_MODE_BALANCED = 1] = "SCAN_MODE_BALANCED", s[s.SCAN_MODE_LOW_LATENCY = 2] = "SCAN_MODE_LOW_LATENCY";
})(at || (at = {}));
var rt;
(function(s) {
  s[s.PHY_LE_1M = 1] = "PHY_LE_1M", s[s.PHY_LE_2M = 2] = "PHY_LE_2M", s[s.PHY_LE_CODED = 3] = "PHY_LE_CODED", s[s.PHY_LE_ALL_SUPPORTED = 255] = "PHY_LE_ALL_SUPPORTED";
})(rt || (rt = {}));
var ot;
(function(s) {
  s[s.CONNECTION_PRIORITY_BALANCED = 0] = "CONNECTION_PRIORITY_BALANCED", s[s.CONNECTION_PRIORITY_HIGH = 1] = "CONNECTION_PRIORITY_HIGH", s[s.CONNECTION_PRIORITY_LOW_POWER = 2] = "CONNECTION_PRIORITY_LOW_POWER";
})(ot || (ot = {}));
/*! Capacitor: https://capacitorjs.com/ - MIT License */
var le;
(function(s) {
  s.Unimplemented = "UNIMPLEMENTED", s.Unavailable = "UNAVAILABLE";
})(le || (le = {}));
class qe extends Error {
  constructor(e, t, n) {
    super(e), this.message = e, this.code = t, this.data = n;
  }
}
const Wt = (s) => {
  var e, t;
  return s?.androidBridge ? "android" : !((t = (e = s?.webkit) === null || e === void 0 ? void 0 : e.messageHandlers) === null || t === void 0) && t.bridge ? "ios" : "web";
}, zt = (s) => {
  const e = s.CapacitorCustomPlatform || null, t = s.Capacitor || {}, n = t.Plugins = t.Plugins || {}, i = () => e !== null ? e.name : Wt(s), a = () => i() !== "web", o = (h) => {
    const p = u.get(h);
    return !!(p?.platforms.has(i()) || r(h));
  }, r = (h) => {
    var p;
    return (p = t.PluginHeaders) === null || p === void 0 ? void 0 : p.find((f) => f.name === h);
  }, c = (h) => s.console.error(h), u = /* @__PURE__ */ new Map(), d = (h, p = {}) => {
    const f = u.get(h);
    if (f)
      return console.warn(`Capacitor plugin "${h}" already registered. Cannot register plugins twice.`), f.proxy;
    const v = i(), w = r(h);
    let b;
    const x = async () => (!b && v in p ? b = typeof p[v] == "function" ? b = await p[v]() : b = p[v] : e !== null && !b && "web" in p && (b = typeof p.web == "function" ? b = await p.web() : b = p.web), b), U = (E, P) => {
      var g, S;
      if (w) {
        const T = w?.methods.find((j) => P === j.name);
        if (T)
          return T.rtype === "promise" ? (j) => t.nativePromise(h, P.toString(), j) : (j, xe) => t.nativeCallback(h, P.toString(), j, xe);
        if (E)
          return (g = E[P]) === null || g === void 0 ? void 0 : g.bind(E);
      } else {
        if (E)
          return (S = E[P]) === null || S === void 0 ? void 0 : S.bind(E);
        throw new qe(`"${h}" plugin is not implemented on ${v}`, le.Unimplemented);
      }
    }, _ = (E) => {
      let P;
      const g = (...S) => {
        const T = x().then((j) => {
          const xe = U(j, E);
          if (xe) {
            const Se = xe(...S);
            return P = Se?.remove, Se;
          } else
            throw new qe(`"${h}.${E}()" is not implemented on ${v}`, le.Unimplemented);
        });
        return E === "addListener" && (T.remove = async () => P()), T;
      };
      return g.toString = () => `${E.toString()}() { [capacitor code] }`, Object.defineProperty(g, "name", {
        value: E,
        writable: !1,
        configurable: !1
      }), g;
    }, I = _("addListener"), R = _("removeListener"), M = (E, P) => {
      const g = I({ eventName: E }, P), S = async () => {
        const j = await g;
        R({
          eventName: E,
          callbackId: j
        }, P);
      }, T = new Promise((j) => g.then(() => j({ remove: S })));
      return T.remove = async () => {
        console.warn("Using addListener() without 'await' is deprecated."), await S();
      }, T;
    }, $ = new Proxy({}, {
      get(E, P) {
        switch (P) {
          case "$$typeof":
            return;
          case "toJSON":
            return () => ({});
          case "addListener":
            return w ? M : I;
          case "removeListener":
            return R;
          default:
            return _(P);
        }
      }
    });
    return n[h] = $, u.set(h, {
      name: h,
      proxy: $,
      platforms: /* @__PURE__ */ new Set([...Object.keys(p), ...w ? [v] : []])
    }), $;
  };
  return t.convertFileSrc || (t.convertFileSrc = (h) => h), t.getPlatform = i, t.handleError = c, t.isNativePlatform = a, t.isPluginAvailable = o, t.registerPlugin = d, t.Exception = qe, t.DEBUG = !!t.DEBUG, t.isLoggingEnabled = !!t.isLoggingEnabled, t;
}, Gt = (s) => s.Capacitor = zt(s), B = /* @__PURE__ */ Gt(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {}), ne = B.registerPlugin;
class ie {
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
    return new B.Exception(e, le.Unimplemented);
  }
  unavailable(e = "not available") {
    return new B.Exception(e, le.Unavailable);
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
const ct = (s) => encodeURIComponent(s).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape), lt = (s) => s.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class Kt extends ie {
  async getCookies() {
    const e = document.cookie, t = {};
    return e.split(";").forEach((n) => {
      if (n.length <= 0)
        return;
      let [i, a] = n.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
      i = lt(i).trim(), a = lt(a).trim(), t[i] = a;
    }), t;
  }
  async setCookie(e) {
    try {
      const t = ct(e.key), n = ct(e.value), i = e.expires ? `; expires=${e.expires.replace("expires=", "")}` : "", a = (e.path || "/").replace("path=", ""), o = e.url != null && e.url.length > 0 ? `domain=${e.url}` : "";
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
ne("CapacitorCookies", {
  web: () => new Kt()
});
const Yt = async (s) => new Promise((e, t) => {
  const n = new FileReader();
  n.onload = () => {
    const i = n.result;
    e(i.indexOf(",") >= 0 ? i.split(",")[1] : i);
  }, n.onerror = (i) => t(i), n.readAsDataURL(s);
}), Xt = (s = {}) => {
  const e = Object.keys(s);
  return Object.keys(s).map((i) => i.toLocaleLowerCase()).reduce((i, a, o) => (i[a] = s[e[o]], i), {});
}, Jt = (s, e = !0) => s ? Object.entries(s).reduce((n, i) => {
  const [a, o] = i;
  let r, c;
  return Array.isArray(o) ? (c = "", o.forEach((u) => {
    r = e ? encodeURIComponent(u) : u, c += `${a}=${r}&`;
  }), c.slice(0, -1)) : (r = e ? encodeURIComponent(o) : o, c = `${a}=${r}`), `${n}&${c}`;
}, "").substr(1) : null, Ct = (s, e = {}) => {
  const t = Object.assign({ method: s.method || "GET", headers: s.headers }, e), i = Xt(s.headers)["content-type"] || "";
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
      s.data.forEach((r, c) => {
        a.append(c, r);
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
class Zt extends ie {
  /**
   * Perform an Http request given a set of options
   * @param options Options to build the HTTP request
   */
  async request(e) {
    const t = Ct(e, e.webFetchExtra), n = Jt(e.params, e.shouldEncodeUrlParams), i = n ? `${e.url}?${n}` : e.url, a = await fetch(i, t), o = a.headers.get("content-type") || "";
    let { responseType: r = "text" } = a.ok ? e : {};
    o.includes("application/json") && (r = "json");
    let c, u;
    switch (r) {
      case "arraybuffer":
      case "blob":
        u = await a.blob(), c = await Yt(u);
        break;
      case "json":
        c = await a.json();
        break;
      case "document":
      case "text":
      default:
        c = await a.text();
    }
    const d = {};
    return a.headers.forEach((h, p) => {
      d[p] = h;
    }), {
      data: c,
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
  web: () => new Zt()
});
var ut;
(function(s) {
  s.Dark = "DARK", s.Light = "LIGHT", s.Default = "DEFAULT";
})(ut || (ut = {}));
var dt;
(function(s) {
  s.StatusBar = "StatusBar", s.NavigationBar = "NavigationBar";
})(dt || (dt = {}));
class Qt extends ie {
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
  web: () => new Qt()
});
function es(s) {
  return new DataView(Uint8Array.from(s).buffer);
}
function ts(s) {
  return Array.from(new Uint8Array(s.buffer, s.byteOffset, s.byteLength));
}
function ss(s) {
  return `0000${s.toString(16).padStart(4, "0")}-0000-1000-8000-00805f9b34fb`;
}
function ge(s) {
  const e = [];
  let t, n, i = 1, a = 0;
  for (t = 0; t < s.length; t++)
    n = s.charCodeAt(t), (n > 47 && n < 58 || n > 64 && n < 71 || n > 96 && n < 103) && (a = a << 4 ^ (n > 64 ? n + 9 : n) & 15, (i ^= 1) && e.push(a & 255));
  return es(e);
}
function me(s) {
  return ts(s).map((e) => {
    let t = e.toString(16);
    return t.length == 1 && (t = "0" + t), t;
  }).join("");
}
function ns(s) {
  if (typeof s == "string")
    return s;
  if (typeof s == "number")
    return ss(s);
  throw new Error("Invalid UUID");
}
function ht(s) {
  const e = {};
  if (s)
    return s.forEach((t, n) => {
      e[n.toString()] = t;
    }), e;
}
function ft(s) {
  if (s !== void 0) {
    if (typeof s == "string") {
      const e = ge(s);
      return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
    }
    return s instanceof DataView ? new Uint8Array(s.buffer, s.byteOffset, s.byteLength) : s;
  }
}
function ke(s) {
  if (s !== void 0)
    return s instanceof DataView ? me(s) : me(new DataView(s.buffer, s.byteOffset, s.byteLength));
}
function Ne(s) {
  if (typeof SharedArrayBuffer < "u" && s.buffer instanceof SharedArrayBuffer) {
    const t = new Uint8Array(s.buffer, s.byteOffset, s.byteLength).slice().buffer;
    return new DataView(t);
  }
  return s;
}
const m = ne("BluetoothLe", {
  web: () => Promise.resolve().then(() => js).then((s) => new s.BluetoothLeWeb())
}), is = () => {
  let s = Promise.resolve();
  return (e) => new Promise((t, n) => {
    s = s.then(() => e()).then(t).catch(n);
  });
};
function Ue(s) {
  return s ? is() : (e) => e();
}
function k(s) {
  if (typeof s != "string")
    throw new Error(`Invalid UUID type ${typeof s}. Expected string.`);
  if (s = s.toLowerCase(), !(s.search(/^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/) >= 0))
    throw new Error(`Invalid UUID format ${s}. Expected 128 bit string (e.g. "0000180d-0000-1000-8000-00805f9b34fb").`);
  return s;
}
class as {
  constructor() {
    this.scanListener = null, this.eventListeners = /* @__PURE__ */ new Map(), this.queue = Ue(!0);
  }
  enableQueue() {
    this.queue = Ue(!0);
  }
  disableQueue() {
    this.queue = Ue(!1);
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
    return e = e.map(k), this.queue(async () => (await m.getConnectedDevices({ services: e })).devices);
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
        const o = await m.addListener(a, () => {
          t(e);
        });
        this.eventListeners.set(a, o);
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
    return t = k(t), n = k(n), await this.queue(async () => {
      const o = await m.read(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n
      }, i));
      return this.convertValue(o.value);
    });
  }
  async write(e, t, n, i, a) {
    return t = k(t), n = k(n), this.queue(async () => {
      if (!i?.buffer)
        throw new Error("Invalid data.");
      let o = i;
      B.getPlatform() !== "web" && (o = me(i)), await m.write(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n,
        value: o
      }, a));
    });
  }
  async writeWithoutResponse(e, t, n, i, a) {
    t = k(t), n = k(n), await this.queue(async () => {
      if (!i?.buffer)
        throw new Error("Invalid data.");
      let o = i;
      B.getPlatform() !== "web" && (o = me(i)), await m.writeWithoutResponse(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n,
        value: o
      }, a));
    });
  }
  async readDescriptor(e, t, n, i, a) {
    return t = k(t), n = k(n), i = k(i), await this.queue(async () => {
      const r = await m.readDescriptor(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n,
        descriptor: i
      }, a));
      return this.convertValue(r.value);
    });
  }
  async writeDescriptor(e, t, n, i, a, o) {
    return t = k(t), n = k(n), i = k(i), this.queue(async () => {
      if (!a?.buffer)
        throw new Error("Invalid data.");
      let r = a;
      B.getPlatform() !== "web" && (r = me(a)), await m.writeDescriptor(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n,
        descriptor: i,
        value: r
      }, o));
    });
  }
  async startNotifications(e, t, n, i, a) {
    t = k(t), n = k(n), await this.queue(async () => {
      var o;
      const r = `notification|${e}|${t}|${n}`;
      await ((o = this.eventListeners.get(r)) === null || o === void 0 ? void 0 : o.remove());
      const c = await m.addListener(r, (u) => {
        i(this.convertValue(u?.value));
      });
      this.eventListeners.set(r, c), await m.startNotifications(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n
      }, a));
    });
  }
  async stopNotifications(e, t, n) {
    t = k(t), n = k(n), await this.queue(async () => {
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
    return e = Object.assign({}, e), e.services && (e.services = e.services.map(k)), e.optionalServices && (e.optionalServices = e.optionalServices.map(k)), e.serviceData && B.getPlatform() !== "web" && (e.serviceData = e.serviceData.map((t) => Object.assign(Object.assign({}, t), { serviceUuid: k(t.serviceUuid), dataPrefix: ke(t.dataPrefix), mask: ke(t.mask) }))), e.manufacturerData && (B.getPlatform() !== "web" ? e.manufacturerData = e.manufacturerData.map((t) => Object.assign(Object.assign({}, t), { dataPrefix: ke(t.dataPrefix), mask: ke(t.mask) })) : e.manufacturerData = e.manufacturerData.map((t) => Object.assign(Object.assign({}, t), { dataPrefix: ft(t.dataPrefix), mask: ft(t.mask) }))), e;
  }
  convertValue(e) {
    return typeof e == "string" ? ge(e) : e === void 0 ? new DataView(new ArrayBuffer(0)) : e;
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
const de = new as(), je = 256, Ve = 10, rs = 4e3;
class Pt {
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
    this.setStatus("live"), this.sampleFns.forEach((n) => n(t)), this.lostTimer && clearTimeout(this.lostTimer), this.lostTimer = setTimeout(() => this.setStatus("lost"), rs);
  }
  clearLost() {
    this.lostTimer && clearTimeout(this.lostTimer), this.lostTimer = null;
  }
}
function pt(s) {
  let e = "";
  for (let t = 0; t < s.byteLength; t++) e += s.getUint8(t).toString(16).padStart(2, "0") + " ";
  return e.trim();
}
function gt(s, e) {
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
function os(s) {
  return s.byteLength < Ve + 2 ? null : (s.getUint8(Ve) << 8 | s.getUint8(Ve + 1)) / 100;
}
class mt extends Pt {
  constructor() {
    super(...arguments), this.name = "WeiHeng scale", this.scanning = !1, this.seen = /* @__PURE__ */ new Map(), this.onSeen = () => {
    };
  }
  async start() {
    if (!B.isNativePlatform())
      throw new Error("Bluetooth scanning needs the Android build. Use the simulator in the browser.");
    if (await de.initialize({ androidNeverForLocation: !0 }), !await de.isEnabled().catch(() => !0))
      try {
        await de.requestEnable();
      } catch {
        throw new Error("Bluetooth is off — turn it on and try again.");
      }
    this.setStatus("scanning"), this.scanning = !0, await de.requestLEScan(
      { allowDuplicates: !0 },
      (t) => {
        const n = t.localName ?? t.device.name ?? "", i = t.manufacturerData ?? {}, a = Object.keys(i);
        let o = i[String(je)] ?? i[je.toString(16)];
        !o && /^(IF_|WH-|WEIHENG)/i.test(n) && a.length && (o = i[a[0]]), !o && t.rawAdvertisement && (o = gt(t.rawAdvertisement, je) ?? (/^IF_/i.test(n) ? gt(t.rawAdvertisement) : void 0));
        const r = o ? os(o) : null, c = { id: t.device.deviceId, name: n, rssi: t.rssi ?? 0, keys: a.join(","), hex: o ? pt(o) : t.rawAdvertisement ? pt(t.rawAdvertisement).slice(0, 60) : "", kg: r, t: Date.now() };
        this.seen.set(c.id, c), this.onSeen(c), r !== null && this.emitRaw(r);
      }
    );
  }
  async stop() {
    if (this.scanning)
      try {
        await de.stopLEScan();
      } catch {
      }
    this.scanning = !1, this.clearLost(), this.setStatus("idle");
  }
}
class cs extends Pt {
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
function ue(s) {
  return s.manualReps && s.manualReps > 0 ? Math.round(s.manualReps) : 1;
}
function re(s) {
  return s.performedAt ?? s.startedAt;
}
const $e = 2;
class ls {
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
    const n = $t(t);
    return {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      exercise: e.exercise,
      side: e.side,
      mode: e.mode,
      startedAt: this.t0,
      durationS: t[t.length - 1].t,
      samples: t,
      ...n,
      reps: Dt(t)
    };
  }
}
function $t(s) {
  let e = 0, t = 0, n = 0;
  for (let r = 0; r < s.length; r++) {
    const c = Math.max(0, s[r].kg);
    e = Math.max(e, c), t += c, r > 0 && (n += c * (s[r].t - s[r - 1].t));
  }
  const i = t / s.length, a = s.filter((r) => r.kg > $e);
  let o = 0;
  if (a.length >= 10) {
    const r = Math.max(3, Math.floor(a.length * 0.2)), c = Math.max(...a.slice(0, r).map((d) => d.kg)), u = Math.max(...a.slice(-r).map((d) => d.kg));
    o = c > 0 ? Math.max(0, (c - u) / c * 100) : 0;
  }
  return { peak: F(e), avg: F(i), output: F(n), inroad: F(o) };
}
function Dt(s) {
  if (s.length < 5) return [];
  const e = Math.max(...s.map((c) => c.kg));
  if (e < $e * 2) return [];
  const t = Math.max($e, e * 0.35), n = Math.max($e * 0.5, e * 0.2), i = [];
  let a = !1, o = 0, r = 0;
  for (const c of s)
    !a && c.kg >= t ? (a = !0, o = c.t, r = c.kg) : a && (r = Math.max(r, c.kg), c.kg <= n && (c.t - o >= 0.6 && i.push({ index: i.length + 1, peak: F(r), startS: F(o), endS: F(c.t), durationS: F(c.t - o) }), a = !1));
  if (a) {
    const c = s[s.length - 1].t;
    c - o >= 0.6 && i.push({ index: i.length + 1, peak: F(r), startS: F(o), endS: F(c), durationS: F(c - o) });
  }
  return i.length >= 2 ? i : [];
}
function us(s) {
  if (s.length < 6) return null;
  const e = s.slice(-Math.max(3, Math.floor(s.length / 3)));
  return F(e.reduce((t, n) => t + n.peak, 0) / e.length);
}
function F(s) {
  return Math.round(s * 100) / 100;
}
class Ot {
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
    const { ctx: i } = this, a = this.canvas.width / this.dpr, o = this.canvas.height / this.dpr, r = 42, c = 12, u = 12, d = 24, h = a - r - c, p = o - u - d, f = getComputedStyle(document.getElementById("view-force") ?? document.documentElement), v = f.getPropertyValue("--muted").trim() || "#888", w = f.getPropertyValue("--grid").trim() || "#333", b = f.getPropertyValue("--accent").trim() || "#e8552f", x = f.getPropertyValue("--ghost").trim() || "#7a7a7a", U = f.getPropertyValue("--zone").trim() || "rgba(60,180,90,0.18)";
    i.clearRect(0, 0, a, o);
    const _ = Math.max(this.opts.windowS, Math.ceil(t / 10) * 10 || 10), I = this.opts.ghost ?? [];
    let R = 10;
    for (const g of e) R = Math.max(R, g.kg);
    for (const g of I) R = Math.max(R, g.kg);
    this.opts.zone && (R = Math.max(R, this.opts.zone.hi)), R = ds(R * 1.1);
    const M = (g) => r + g / _ * h, $ = (g) => u + p - Math.max(0, g) / R * p;
    if (this.opts.zone) {
      i.fillStyle = U;
      const g = $(this.opts.zone.hi), S = $(this.opts.zone.lo);
      i.fillRect(r, g, h, S - g);
    }
    i.strokeStyle = w, i.lineWidth = 1, i.fillStyle = v, i.font = "11px system-ui, sans-serif", i.textAlign = "right", i.textBaseline = "middle";
    const E = 5;
    for (let g = 0; g <= E; g++) {
      const S = R / E * g, T = $(S);
      i.beginPath(), i.moveTo(r, T), i.lineTo(a - c, T), i.stroke(), i.fillText(S.toFixed(0), r - 6, T);
    }
    i.textAlign = "center", i.textBaseline = "top";
    const P = _ <= 30 ? 5 : _ <= 90 ? 10 : 30;
    for (let g = 0; g <= _; g += P) {
      const S = M(g);
      i.beginPath(), i.moveTo(S, u), i.lineTo(S, u + p), i.stroke(), i.fillText(hs(g), S, u + p + 6);
    }
    if (this.opts.marks?.length) {
      i.strokeStyle = x, i.setLineDash([3, 4]);
      for (const g of this.opts.marks)
        i.beginPath(), i.moveTo(M(g), u), i.lineTo(M(g), u + p), i.stroke();
      i.setLineDash([]);
    }
    if (I.length > 1 && (i.strokeStyle = x, i.lineWidth = 1.5, i.globalAlpha = 0.55, i.beginPath(), I.forEach((g, S) => S ? i.lineTo(M(g.t), $(g.kg)) : i.moveTo(M(g.t), $(g.kg))), i.stroke(), i.globalAlpha = 1), e.length > 1) {
      i.strokeStyle = b, i.lineWidth = 2.5, i.lineJoin = "round", i.beginPath(), e.forEach((S, T) => T ? i.lineTo(M(S.t), $(S.kg)) : i.moveTo(M(S.t), $(S.kg))), i.stroke();
      const g = e[e.length - 1];
      i.lineTo(M(g.t), $(0)), i.lineTo(M(e[0].t), $(0)), i.closePath(), i.fillStyle = b, i.globalAlpha = 0.12, i.fill(), i.globalAlpha = 1, i.fillStyle = b, i.beginPath(), i.arc(M(g.t), $(g.kg), 4, 0, Math.PI * 2), i.fill();
    } else n > 0 && (i.fillStyle = b, i.beginPath(), i.arc(M(0), $(n), 4, 0, Math.PI * 2), i.fill());
  }
}
function ds(s) {
  const e = [10, 20, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500];
  for (const t of e) if (s <= t) return t;
  return Math.ceil(s / 100) * 100;
}
function hs(s) {
  const e = Math.floor(s / 60), t = s % 60;
  return `${e}:${t.toString().padStart(2, "0")}`;
}
function Fe(s, e = {}) {
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
      return Fe("free");
  }
}
function Tt(s) {
  if (!s.repeat || s.phases.length < 2) return s.phases;
  const [e, ...t] = s.phases, n = [e];
  for (let i = 0; i < s.repeat; i++)
    for (const a of t)
      i === s.repeat - 1 && a === t[t.length - 1] && a.cue === "rest" || n.push({ ...a, name: t.length > 1 && a.cue !== "rest" ? `${a.name} ${i + 1}/${s.repeat}` : a.name });
  return n;
}
class fs {
  constructor() {
    this.timeline = [], this.idx = -1, this.phaseStart = 0, this.timer = null, this.running = !1, this.onPhase = () => {
    }, this.onTick = () => {
    }, this.onDone = () => {
    };
  }
  start(e) {
    this.timeline = Tt(e), this.idx = -1, this.running = !0, this.next(), this.timer = setInterval(() => this.tick(), 100);
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
var vt;
(function(s) {
  s[s.Flush = 0] = "Flush", s[s.Add = 1] = "Add";
})(vt || (vt = {}));
const Ee = ne("TextToSpeech", {
  web: () => Promise.resolve().then(() => Hs).then((s) => new s.TextToSpeechWeb())
}), Le = B.isNativePlatform();
let He = null;
function ps() {
  return He || (He = new (window.AudioContext || window.webkitAudioContext)()), He;
}
function J(s = 880, e = 120, t = 0.25) {
  try {
    const n = ps(), i = n.createOscillator(), a = n.createGain();
    i.frequency.value = s, i.type = "sine", a.gain.value = t, i.connect(a), a.connect(n.destination), i.start(), a.gain.exponentialRampToValueAtTime(1e-4, n.currentTime + e / 1e3), i.stop(n.currentTime + e / 1e3);
  } catch {
  }
}
const Y = {
  go: () => J(1200, 220, 0.3),
  rest: () => J(500, 220, 0.25),
  tick: () => J(900, 60, 0.15),
  done: () => {
    J(1e3, 120), setTimeout(() => J(1300, 160), 140), setTimeout(() => J(1600, 220), 320);
  },
  inZone: () => J(1e3, 50, 0.1),
  outZone: () => J(300, 120, 0.2)
};
class gs {
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
    if (Le) return this.nativeBusy;
    try {
      return speechSynthesis.speaking || speechSynthesis.pending ? (this.busySince || (this.busySince = Date.now()), Date.now() - this.busySince > 4e3 ? (this.reset(), !1) : !0) : (this.busySince = 0, !1);
    } catch {
      return !1;
    }
  }
  /** Hard reset of the engine. */
  reset() {
    if (Le) {
      Ee.stop().catch(() => {
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
    if (Le)
      try {
        return `${(await Ee.getSupportedVoices()).voices.length} native voices`;
      } catch {
        return "native TTS unavailable";
      }
    if (!("speechSynthesis" in window)) return "no speech engine in this browser — open in Chrome";
    const e = speechSynthesis.getVoices().length;
    return e ? `${e} voices` : "no voices installed";
  }
  say(e, t = !1, n = !1) {
    if (!this.enabled) return;
    if (this.onSpeak(e), Le) {
      if (this.nativeBusy && !t) return;
      this.nativeBusy = !0, (t ? Ee.stop().catch(() => {
      }) : Promise.resolve()).then(() => Ee.speak({ text: e, lang: "en-US", rate: 1.2, pitch: 1, volume: 1, category: "ambient" })).catch(() => {
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
function ms(s) {
  const e = Math.floor(s / 60), t = s % 60;
  return t === 0 && e > 0 ? e === 1 ? "1 minute" : `${e} minutes` : String(t);
}
const At = ne("Preferences", {
  web: () => Promise.resolve().then(() => zs).then((s) => new s.PreferencesWeb())
}), Ce = "ufl.sets.v1", We = "ufl.max.v1", wt = "ufl.exercises.v1", _t = [
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
function vs(s) {
  return /^SR\b|self.?resisted/i.test(s) ? "self-resisted" : "iso";
}
async function ze(s, e) {
  try {
    const t = B.isNativePlatform() ? (await At.get({ key: s })).value : localStorage.getItem(s);
    return t ? JSON.parse(t) : e;
  } catch {
    return e;
  }
}
async function oe(s, e) {
  const t = JSON.stringify(e);
  B.isNativePlatform() ? await At.set({ key: s, value: t }) : localStorage.setItem(s, t);
}
const O = {
  async sets() {
    return ze(Ce, []);
  },
  async saveSet(s) {
    const e = await this.sets();
    e.push(s), await oe(Ce, e.slice(-500));
  },
  async updateSet(s) {
    const e = await this.sets(), t = e.findIndex((n) => n.id === s.id);
    t >= 0 ? e[t] = s : e.push(s), await oe(Ce, e);
  },
  async deleteSet(s) {
    const e = await this.sets();
    await oe(Ce, e.filter((t) => t.id !== s));
  },
  async maxes() {
    return ze(We, {});
  },
  async setMax(s, e, t) {
    const n = await this.maxes();
    n[`${s}|${e}`] = { kg: t, at: Date.now() }, await oe(We, n);
  },
  async deleteMax(s) {
    const e = await this.maxes();
    delete e[s], await oe(We, e);
  },
  async exercises() {
    return ze(wt, _t);
  },
  async saveExercises(s) {
    await oe(wt, s);
  }
};
function ws(s) {
  s.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, t) {
        return new Proxy({}, {
          get(n, i) {
            return (a, o, r) => {
              const c = s.Capacitor.Plugins[t];
              if (c === void 0) {
                r(new Error(`Capacitor plugin ${t} not found`));
                return;
              }
              if (typeof c[i] != "function") {
                r(new Error(`Method ${i} not found in Capacitor plugin ${t}`));
                return;
              }
              (async () => {
                try {
                  const u = await c[i](a);
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
function ys(s) {
  s.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, t) {
        return s.cordova.plugins[t];
      }
    }
  );
}
function bs(s = !1) {
  typeof window > "u" || (window.CapacitorUtils = window.CapacitorUtils || {}, window.Capacitor !== void 0 && !s ? ws(window) : window.cordova !== void 0 && ys(window));
}
var Xe;
(function(s) {
  s.Documents = "DOCUMENTS", s.Data = "DATA", s.Library = "LIBRARY", s.Cache = "CACHE", s.External = "EXTERNAL", s.ExternalStorage = "EXTERNAL_STORAGE", s.ExternalCache = "EXTERNAL_CACHE", s.LibraryNoCloud = "LIBRARY_NO_CLOUD", s.Temporary = "TEMPORARY";
})(Xe || (Xe = {}));
var Ae;
(function(s) {
  s.UTF8 = "utf8", s.ASCII = "ascii", s.UTF16 = "utf16";
})(Ae || (Ae = {}));
const xs = ne("Filesystem", {
  web: () => Promise.resolve().then(() => Ks).then((s) => new s.FilesystemWeb())
});
bs();
const Ss = ne("Share", {
  web: () => Promise.resolve().then(() => Xs).then((s) => new s.ShareWeb())
});
function ks(s) {
  const e = ["id", "date_performed", "recorded_at", "exercise", "side", "mode", "duration_s", "peak_kg", "avg_kg", "output_kgs", "inroad_pct", "reps", "auto_reps", "rep_peaks"], t = s.map((n) => [
    n.id,
    ye(re(n)),
    new Date(n.startedAt).toISOString(),
    yt(n.exercise),
    n.side,
    n.mode,
    n.durationS.toFixed(1),
    n.peak,
    n.avg,
    n.output,
    n.inroad,
    ue(n),
    n.reps?.length ?? 0,
    yt((n.reps ?? []).map((i) => i.peak).join(" "))
  ].join(","));
  return [e.join(","), ...t].join(`
`);
}
function Es(s) {
  return ["t_s,kg", ...s.samples.map((e) => `${e.t.toFixed(2)},${e.kg.toFixed(2)}`)].join(`
`);
}
function yt(s) {
  return `"${s.replace(/"/g, '""')}"`;
}
async function Je(s, e, t) {
  if (B.isNativePlatform()) {
    const o = await xs.writeFile({ path: s, data: e, directory: Xe.Cache, encoding: Ae.UTF8 });
    await Ss.share({ title: s, files: [o.uri] });
    return;
  }
  const n = new Blob([e], { type: t }), i = URL.createObjectURL(n), a = document.createElement("a");
  a.href = i, a.download = s, document.body.appendChild(a), a.click(), setTimeout(() => {
    URL.revokeObjectURL(i), a.remove();
  }, 500);
}
function ye(s) {
  const e = new Date(s);
  return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
class Ls {
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
function X() {
  return window.GymLog ?? null;
}
function Rt(s) {
  return {
    id: `fl-${s.id}`,
    date: ye(re(s)),
    exercise: s.exercise,
    kg: s.peak,
    reps: ue(s),
    variation: vs(s.exercise),
    note: [s.side !== "both" ? s.side : "", s.mode, s.note].filter(Boolean).join(" · ")
  };
}
function Cs() {
  const s = X();
  if (s)
    for (const e of _t) s.addExercise(e);
}
let V = null;
function ae(s) {
  return s.replace(/[&<>"']/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[e]);
}
function Ge(s, e) {
  s.classList.add("picker-hidden");
  const t = document.createElement("button");
  t.type = "button", t.className = "picker-btn", s.insertAdjacentElement("afterend", t);
  const n = () => {
    const i = s.value;
    t.textContent = i || (e.allOption?.label ?? "Choose…"), t.disabled = s.disabled;
  };
  return n(), new MutationObserver(n).observe(s, { attributes: !0, childList: !0 }), s.addEventListener("change", n), t.onclick = () => Ps(s, e, n), n;
}
function Ps(s, e, t) {
  he();
  const n = document.getElementById("view-force") ?? document.body;
  V = document.createElement("div"), V.className = "picker-overlay", V.innerHTML = `<div class="picker-panel">
    <div class="picker-head"><input type="text" class="picker-search" placeholder="Search exercises…" autocomplete="off" /><button type="button" class="sm ghost picker-close">✕</button></div>
    <div class="picker-list"></div>
  </div>`, n.appendChild(V);
  const i = V.querySelector(".picker-search"), a = V.querySelector(".picker-list"), o = (c) => {
    s.value = c, s.dispatchEvent(new Event("change", { bubbles: !0 })), t(), he();
  }, r = () => {
    const c = i.value.trim().toLowerCase(), u = e.recent().filter((f) => !c || f.toLowerCase().includes(c)), d = e.all().filter((f) => !u.includes(f) && (!c || f.toLowerCase().includes(c))).sort((f, v) => f.localeCompare(v));
    let h = "";
    e.allOption && (!c || e.allOption.label.toLowerCase().includes(c)) && (h += `<button type="button" class="picker-item" data-v="${ae(e.allOption.value)}">${ae(e.allOption.label)}</button>`), u.length && (h += '<div class="picker-group">Recent in Force Lab</div>' + u.map((f) => `<button type="button" class="picker-item" data-v="${ae(f)}">${ae(f)}</button>`).join("")), d.length && (h += `<div class="picker-group">${u.length ? "All exercises" : "Exercises"}</div>` + d.map((f) => `<button type="button" class="picker-item" data-v="${ae(f)}">${ae(f)}</button>`).join(""));
    const p = i.value.trim();
    p && e.onCreate && !e.all().some((f) => f.toLowerCase() === p.toLowerCase()) && (h += `<button type="button" class="picker-item picker-create" data-create="1">+ Create "${ae(p)}"</button>`), h || (h = '<div class="picker-group">No match</div>'), a.innerHTML = h, a.querySelectorAll(".picker-item").forEach((f) => {
      f.onclick = async () => {
        if (f.dataset.create) {
          const v = i.value.trim();
          await e.onCreate(v) && o(v);
          return;
        }
        o(f.dataset.v);
      };
    });
  };
  i.oninput = r, i.onkeydown = (c) => {
    c.key === "Escape" && he(), c.key === "Enter" && a.querySelector(".picker-item")?.click();
  }, V.querySelector(".picker-close").onclick = he, V.onclick = (c) => {
    c.target === V && he();
  }, r(), setTimeout(() => i.focus(), 50);
}
function he() {
  V?.remove(), V = null;
}
const l = (s) => document.getElementById(s);
let Q = null, Z = null, _e = 0, y = [], N = [], Re = null, ee = 0, W = 0, ce = null, z = !0, ve = localStorage.getItem("ufl.ghostOn") !== "0", Pe = null;
const Be = (s, e) => localStorage.getItem(s) ?? e;
let De = Math.max(1, Number(Be("ufl.calloutEvery", "5"))), Ze = Be("ufl.calloutOn", "1") === "1", Qe = Be("ufl.secBeep", "0") === "1", et = Be("ufl.secCount", "0") === "1", Oe = null, Ke = -1;
const C = new gs(), H = new ls(), K = new fs(), G = new Ot(l("chart")), fe = l("progressChart"), $s = {
  countdown: [{ key: "total", label: "seconds", def: 60 }],
  ramp: [{ key: "ramp", label: "ramp s", def: 5 }, { key: "hold", label: "hold s", def: 10 }],
  repeaters: [{ key: "reps", label: "reps", def: 6 }, { key: "hold", label: "on s", def: 10 }, { key: "rest", label: "off s", def: 20 }]
};
async function Ds() {
  Cs(), y = X()?.exerciseNames() ?? await O.exercises(), N = await O.sets(), be(), Ft(), await q(), se(), te(), Is(), jt(), C.enabled = l("voiceOn").checked;
}
function Ye() {
  const s = /* @__PURE__ */ new Map();
  for (const e of N) s.set(e.exercise, Math.max(s.get(e.exercise) ?? 0, e.startedAt));
  for (const e of Object.keys(Mt)) {
    const t = e.split("|")[0];
    s.has(t) || s.set(t, 0);
  }
  return [...s.entries()].filter(([e]) => y.includes(e)).sort((e, t) => t[1] - e[1]).map(([e]) => e);
}
let Mt = {};
async function bt(s) {
  if (s = s.trim(), !s) return !1;
  if (!y.includes(s)) {
    const e = X();
    e ? (e.addExercise(s), y = e.exerciseNames()) : (y.push(s), await O.saveExercises(y));
  }
  return be(), te(), !0;
}
function be() {
  for (const t of ["exercise", "maxExercise"]) {
    const n = l(t), i = n.value;
    n.innerHTML = y.map((a) => `<option>${A(a)}</option>`).join(""), i && y.includes(i) && (n.value = i);
  }
  const s = l("histExercise"), e = s.value;
  s.innerHTML = '<option value="">All</option>' + y.map((t) => `<option>${A(t)}</option>`).join(""), s.value = e;
}
function Ft() {
  const s = l("protocol").value, e = l("params");
  e.innerHTML = ($s[s] ?? []).map((t) => `<label>${t.label}<input type="number" data-k="${t.key}" value="${t.def}" min="1" /></label>`).join(""), l("protocolHelp").textContent = Fe(s, st()).describe;
}
function st() {
  const s = {};
  return l("params").querySelectorAll("input").forEach((e) => s[e.dataset.k] = Number(e.value) || 1), s;
}
async function q() {
  const s = l("exercise").value, e = l("side").value, t = N.filter((i) => i.exercise === s && i.side === e);
  Re = t.length ? t[t.length - 1] : null, ee = t.reduce((i, a) => Math.max(i, a.output), 0);
  const n = await O.maxes();
  Mt = n, W = n[`${s}|${e}`]?.kg ?? 0, l("zoneMax").textContent = W ? `(max ${W} kg → ${Te().lo.toFixed(1)}–${Te().hi.toFixed(1)} kg)` : "(no max yet — run a Max test)", l("sGoal").textContent = ee ? L(ee) : "–", G.opts.ghost = ve ? Re?.samples ?? null : null, G.opts.zone = nt() ? Te() : null, H.recording || (G.opts.marks = []);
}
function nt() {
  return l("zoneOn").checked && W > 0;
}
function Te() {
  const s = Number(l("zoneLo").value) / 100 * W, e = Number(l("zoneHi").value) / 100 * W;
  return { lo: Math.min(s, e), hi: Math.max(s, e) };
}
async function xt(s) {
  Q && await Q.stop(), Q = s, s.onStatus(tt), s.onSample((e) => {
    _e = e.kg, Me === "live" && (l("statusKg").textContent = `· ${e.kg.toFixed(1)} kg`), H.push(e), Os(e.kg);
  });
  try {
    await s.start(), l("btnTare").disabled = !1, l("btnStart").disabled = !1;
  } catch (e) {
    tt("error"), l("statusText").textContent = e.message, alert("Connect failed: " + e.message);
  }
}
let Me = "idle";
function tt(s) {
  Me = s, l("statusDot").className = `dot ${s}`, l("statusPill").className = `pill ${s}`;
  const e = {
    idle: "Not connected",
    scanning: "Listening for scale… turn it on / pull the hook",
    live: `${Q?.name ?? "Scale"} connected ✓`,
    lost: "Signal lost — is the scale still on?",
    error: "Error"
  };
  l("statusText").textContent = e[s], s !== "live" && (l("statusKg").textContent = "");
  const t = l("btnConnect");
  t.textContent = s === "live" || s === "scanning" ? "Disconnect" : "Connect scale";
}
let St = 0;
function Os(s) {
  if (!H.recording || !nt()) {
    ce = null;
    return;
  }
  const e = K.running ? K.current() : null;
  if (e && e.cue === "rest") {
    ce = null;
    return;
  }
  const t = Te(), n = s >= t.lo && s <= t.hi, i = l("phaseBanner");
  n && ce !== "in" && (ce = "in", i.classList.add("inzone"), i.classList.remove("outzone"), C.say("in zone")), !n && ce !== "out" && (ce = "out", i.classList.add("outzone"), i.classList.remove("inzone"), s > 2 && C.say(s < t.lo ? "more" : "ease off"), z && s > 2 && Date.now() - St > 1500 && (Y.outZone(), St = Date.now()));
}
function Ts() {
  const s = l("protocol").value, e = Fe(s, st());
  l("summary").classList.add("hidden"), H.start(), C.unlock(), Rs(), G.opts.marks = [];
  const t = e.phases.length ? Tt(e).reduce((n, i) => n + i.seconds, 0) : 60;
  G.opts.windowS = Math.max(10, Math.ceil(t / 10) * 10), l("btnStart").classList.add("hidden"), l("btnStop").classList.remove("hidden"), qt(!0), e.phases.length ? (K.onPhase = As, K.onTick = _s, K.onDone = () => Bt(), K.start(e)) : (it("work", "Free set — go", ""), C.say("Go", !0), z && Y.go());
}
function As(s, e, t) {
  it(s.cue, s.name, s.seconds.toFixed(0)), s.cue === "work" ? (z && Y.go(), C.say(s.name.replace(/\d+\/\d+/, ""), !0), G.opts.marks.push(H.elapsed())) : s.cue === "ramp" ? (z && Y.go(), C.say("Build up", !0)) : (e > 0 && z && Y.rest(), e > 0 && C.say(e === t - 1 ? "Done" : "Rest", !0));
}
let kt = -1;
function _s(s, e) {
  l("phaseTime").textContent = s.toFixed(s < 10 ? 1 : 0);
  const t = Math.ceil(s);
  t !== kt && (kt = t, t <= 3 && t > 0 && z && Y.tick());
}
async function Bt() {
  K.stop(), It();
  const s = l("exercise").value, e = l("side").value, t = l("protocol").value, n = H.finish({ exercise: s, side: e, mode: t });
  l("btnStop").classList.add("hidden"), l("btnStart").classList.remove("hidden"), qt(!1), it("idle", "Done", "—"), z && Y.done(), n && (t === "maxtest" && n.peak > 0 && (await O.setMax(s, e, n.peak), C.say(`New max ${n.peak.toFixed(0)} kilos`, !0)), await O.saveSet(n), N.push(n), X()?.upsertForceSet(Rt(n)), await Ms(n), await q(), se(), te());
}
function Rs() {
  It(), Ke = -1, Oe = setInterval(() => {
    if (!H.recording) return;
    const s = Math.floor(H.elapsed());
    if (s === Ke || s === 0) return;
    Ke = s;
    const e = K.running ? K.current() : null;
    if (e && e.cue !== "work") return;
    const t = Ze && !nt() && s % De === 0;
    (Qe && z || t && z) && Y.tick();
    const n = [];
    et && n.push(ms(s)), t && n.push(_e.toFixed(0)), n.length && (!t && C.speaking() || C.say(n.join(", "), t, !0));
  }, 100);
}
function It() {
  Oe && clearInterval(Oe), Oe = null;
}
function qt(s) {
  for (const e of ["exercise", "side", "protocol"]) l(e).disabled = s;
}
function it(s, e, t) {
  const n = l("phaseBanner");
  n.className = `banner ${s}`, l("phaseName").textContent = e, l("phaseTime").textContent = t;
}
async function Ms(s) {
  const e = Re, t = await O.maxes(), n = s.side === "left" ? "right" : s.side === "right" ? "left" : null, i = [];
  i.push(D("Duration", `${s.durationS.toFixed(1)} s`)), i.push(D("Peak force", `${L(s.peak)} kg`, we(s.peak, e?.peak))), i.push(D("Intensity (avg)", `${L(s.avg)} kg`, we(s.avg, e?.avg))), i.push(D("Output (kg·s)", L(s.output), we(s.output, e?.output))), i.push(D("Inroad", `${s.inroad.toFixed(0)}%`, s.inroad >= 30 ? '<span class="badge good">deep fatigue</span>' : s.inroad >= 15 ? '<span class="badge">moderate</span>' : '<span class="badge warn">shallow — stopped early?</span>')), ee && i.push(D("vs. best output", `${(s.output / ee * 100).toFixed(0)}%`, s.output > ee ? '<span class="badge good">new best</span>' : "")), W && i.push(D("Peak as % of max", `${(s.peak / W * 100).toFixed(0)}%`));
  let a = "";
  if (s.reps && s.reps.length) {
    const c = Math.max(...s.reps.map((d) => d.peak));
    a = `<div class="muted" style="margin-top:8px">Reps: ${s.reps.length} · first ${L(s.reps[0].peak)} → last ${L(s.reps[s.reps.length - 1].peak)} kg · avg rep ${(s.reps.reduce((d, h) => d + h.durationS, 0) / s.reps.length).toFixed(1)} s</div>
      <div class="repbars">${s.reps.map((d) => `<div style="height:${Math.max(4, d.peak / c * 100)}%"><span>${d.peak.toFixed(0)}</span></div>`).join("")}</div>`;
    const u = s.mode === "critical" ? us(s.reps) : null;
    u && (a += D("Critical force", `${L(u)} kg${W ? ` (${(u / W * 100).toFixed(0)}% of max)` : ""}`));
  }
  let o = "";
  if (n) {
    const c = t[`${s.exercise}|${s.side}`]?.kg, u = t[`${s.exercise}|${n}`]?.kg;
    if (c && u) {
      const d = (Math.abs(c - u) / Math.max(c, u) * 100).toFixed(0);
      o = D("Left/right gap", `${d}% (L ${L(s.side === "left" ? c : u)} / R ${L(s.side === "left" ? u : c)})`, Number(d) > 10 ? '<span class="badge warn">asymmetry</span>' : '<span class="badge good">balanced</span>');
    }
  }
  const r = l("summary");
  r.innerHTML = `<h4>${A(s.exercise)} · ${s.side} · ${s.mode}</h4>${i.join("")}${o}${a}
    ${Nt(s, "sum")}`, r.classList.remove("hidden"), Ut(s, "sum", async () => {
    await q(), se();
  });
}
function Nt(s, e) {
  const t = ye(re(s));
  return `<div class="editor">
      <label>Reps <input type="number" id="${e}Reps" min="1" step="1" inputmode="numeric" placeholder="1" value="${s.manualReps ?? ""}" /></label>
      <label>Date performed <input type="date" id="${e}Date" value="${t}" max="${ye(Date.now())}" /></label>
      <label class="grow">Note <input type="text" id="${e}Note" placeholder="optional" value="${A(s.note ?? "")}" /></label>
      <button class="sm primary" id="${e}Save" type="button">Save</button>
      <span class="muted" id="${e}Msg">${s.reps?.length ? `auto-detected ${s.reps.length} — for info only` : "blank reps = 1"}</span>
    </div>`;
}
function Ut(s, e, t) {
  const n = async () => {
    const i = Number(l(`${e}Reps`).value);
    s.manualReps = i > 0 ? Math.round(i) : void 0;
    const a = l(`${e}Date`).value;
    if (a) {
      const [r, c, u] = a.split("-").map(Number), d = new Date(s.startedAt);
      s.performedAt = new Date(r, c - 1, u, d.getHours(), d.getMinutes(), d.getSeconds()).getTime();
    }
    s.note = l(`${e}Note`).value.trim() || void 0, await O.updateSet(s), X()?.upsertForceSet(Rt(s));
    const o = N.findIndex((r) => r.id === s.id);
    o >= 0 && (N[o] = s), l(`${e}Msg`).textContent = `saved · ${ue(s)} rep${ue(s) === 1 ? "" : "s"} · ${ye(re(s))}`, await t();
  };
  l(`${e}Save`).onclick = n;
  for (const i of [`${e}Reps`, `${e}Date`, `${e}Note`]) l(i).onkeydown = (a) => {
    a.key === "Enter" && n();
  };
}
function D(s, e, t = "") {
  return `<div class="fl-line"><span>${s}</span><span>${e} ${t}</span></div>`;
}
function we(s, e) {
  if (!e) return "";
  const t = (s - e) / e * 100;
  return `<span class="${t >= 0 ? "fl-d up" : "fl-d down"}">${t >= 0 ? "+" : ""}${t.toFixed(1)}%</span>`;
}
function jt() {
  const s = H.current(), e = H.elapsed();
  if (l("liveKg").textContent = _e.toFixed(1), l("elapsed").textContent = Ht(e), G.draw(s, e, _e), H.recording && s.length > 2) {
    const t = $t(s);
    l("sPeak").textContent = L(t.peak), l("sAvg").textContent = L(t.avg), l("sOut").textContent = L(t.output), l("sInroad").textContent = `${t.inroad.toFixed(0)}%`;
    const n = Re;
    l("dPeak").innerHTML = we(t.peak, n?.peak), l("dAvg").innerHTML = we(t.avg, n?.avg), l("dOut").innerHTML = ee ? `<span class="muted">${(t.output / ee * 100).toFixed(0)}% of goal</span>` : "";
    const i = Dt(s);
    l("sReps").textContent = i.length ? String(i.length) : "–", l("dReps").textContent = i.length ? `last ${i[i.length - 1].peak.toFixed(0)} kg` : "";
  }
  requestAnimationFrame(jt);
}
let pe = null;
function se() {
  const s = l("histExercise").value, e = N.filter((t) => !s || t.exercise === s).slice().sort((t, n) => re(n) - re(t) || n.startedAt - t.startedAt);
  l("histBody").innerHTML = e.map((t) => `<tr data-id="${t.id}" class="${pe?.id === t.id ? "sel" : ""}">
      <td>${new Date(re(t)).toLocaleDateString(void 0, { month: "short", day: "numeric" })}</td>
      <td>${A(t.exercise)}${t.side !== "both" ? ` <small class="muted">${t.side[0].toUpperCase()}</small>` : ""}</td>
      <td>${t.mode}</td><td>${ue(t)}</td><td>${Ht(t.durationS)}</td><td>${L(t.peak)}</td><td>${L(t.avg)}</td><td>${L(t.output)}</td><td>${t.inroad.toFixed(0)}%</td>
      <td><button data-del="${t.id}">✕</button></td></tr>`).join("") || '<tr><td colspan="10" class="muted">No sets yet.</td></tr>', l("histBody").querySelectorAll("tr[data-id]").forEach((t) => {
    t.onclick = (n) => {
      n.target.dataset.del || (pe = N.find((i) => i.id === t.dataset.id) ?? null, se(), Fs());
    };
  }), l("histBody").querySelectorAll("button[data-del]").forEach((t) => {
    t.onclick = async () => {
      confirm("Delete this set?") && (await O.deleteSet(t.dataset.del), X()?.removeForceSet(`fl-${t.dataset.del}`), N = N.filter((n) => n.id !== t.dataset.del), pe?.id === t.dataset.del && (pe = null), se(), await q());
    };
  }), Bs(s ? e.slice().reverse() : []);
}
function Fs() {
  const s = pe, e = l("histDetail");
  if (!s) {
    e.classList.add("hidden");
    return;
  }
  e.classList.remove("hidden"), e.innerHTML = `<h4>${A(s.exercise)} · ${new Date(s.startedAt).toLocaleString()}</h4>
    <div class="chartwrap small"><canvas id="histCanvas"></canvas></div>
    ${D("Peak", `${L(s.peak)} kg`)}${D("Intensity", `${L(s.avg)} kg`)}${D("Output", L(s.output))}${D("Inroad", `${s.inroad.toFixed(0)}%`)}
    ${D("Reps (logged)", String(ue(s)))}
    ${s.reps?.length ? D("Auto-detected", `${s.reps.length} (${s.reps.map((n) => n.peak.toFixed(0)).join(", ")} kg)`) : ""}
    ${Nt(s, "hist")}
    <div class="actions-inline" style="margin-top:8px"><button class="sm" id="btnUseGhost">Use as ghost trace</button><button class="sm ghost" id="btnSetCsv">Export samples CSV</button></div>`, Ut(s, "hist", async () => {
    se(), await q();
  });
  const t = new Ot(l("histCanvas"));
  t.opts.windowS = Math.max(10, Math.ceil(s.durationS / 10) * 10), t.opts.marks = s.reps?.map((n) => n.startS) ?? [], t.draw(s.samples, s.durationS, 0), l("btnUseGhost").onclick = () => {
    ve = !0, localStorage.setItem("ufl.ghostOn", "1"), l("ghostOn").checked = !0, G.opts.ghost = s.samples, Vt("train");
  }, l("btnSetCsv").onclick = () => Je(`set-${s.id}.csv`, Es(s), "text/csv");
}
function Bs(s) {
  const e = l("progress");
  if (s.length < 2) {
    e.classList.add("hidden");
    return;
  }
  e.classList.remove("hidden");
  const t = Math.max(1, window.devicePixelRatio || 1), n = e.clientWidth - 12, i = 160;
  fe.width = n * t, fe.height = i * t, fe.style.width = `${n}px`, fe.style.height = `${i}px`;
  const a = fe.getContext("2d");
  a.setTransform(t, 0, 0, t, 0, 0), a.clearRect(0, 0, n, i);
  const o = getComputedStyle(document.getElementById("view-force") ?? document.documentElement), r = 36, c = 8, u = 10, d = 18, h = n - r - c, p = i - u - d, f = Math.max(10, ...s.map((x) => x.peak)) * 1.1, v = (x) => r + x / Math.max(1, s.length - 1) * h, w = (x) => u + p - x / f * p;
  a.strokeStyle = o.getPropertyValue("--grid"), a.fillStyle = o.getPropertyValue("--muted"), a.font = "10px system-ui", a.textAlign = "right";
  for (let x = 0; x <= 4; x++) {
    const U = f / 4 * x;
    a.beginPath(), a.moveTo(r, w(U)), a.lineTo(n - c, w(U)), a.stroke(), a.fillText(U.toFixed(0), r - 4, w(U) + 3);
  }
  const b = [["peak", o.getPropertyValue("--accent")], ["avg", o.getPropertyValue("--accent2")]];
  for (const [x, U] of b)
    a.strokeStyle = U, a.lineWidth = 2, a.beginPath(), s.forEach((_, I) => I ? a.lineTo(v(I), w(_[x])) : a.moveTo(v(I), w(_[x]))), a.stroke(), a.fillStyle = U, s.forEach((_, I) => {
      a.beginPath(), a.arc(v(I), w(_[x]), 3, 0, Math.PI * 2), a.fill();
    });
  a.fillStyle = o.getPropertyValue("--muted"), a.textAlign = "left", a.fillText("peak", r + 4, u + 10), a.fillStyle = o.getPropertyValue("--accent2"), a.fillText("intensity", r + 36, u + 10);
}
async function te() {
  const s = await O.maxes(), e = Object.entries(s).map(([t, n]) => {
    const [i, a] = t.split("|");
    return `<tr><td>${A(i)}</td><td>${a}</td><td>${L(n.kg)}</td><td>${new Date(n.at).toLocaleDateString()}</td><td><button data-mdel="${A(t)}">✕</button></td></tr>`;
  });
  l("maxBody").innerHTML = e.join("") || '<tr><td colspan="5" class="muted">No maxes yet.</td></tr>', l("maxBody").querySelectorAll("button[data-mdel]").forEach((t) => t.onclick = async () => {
    await O.deleteMax(t.dataset.mdel), te(), q();
  }), l("exList").innerHTML = y.map((t) => `<span>${A(t)}<button data-xdel="${A(t)}">✕</button></span>`).join(""), l("exList").querySelectorAll("button[data-xdel]").forEach((t) => t.onclick = async () => {
    const n = X();
    if (n) {
      if (!n.removeExercise(t.dataset.xdel)) {
        alert("Built-in Gym Log exercises can't be removed here.");
        return;
      }
      y = n.exerciseNames();
    } else
      y = y.filter((i) => i !== t.dataset.xdel), await O.saveExercises(y);
    be(), te();
  });
}
function Vt(s) {
  document.querySelectorAll(".fl-tabs button").forEach((e) => e.classList.toggle("active", e.dataset.tab === s)), document.querySelectorAll(".fl-tab").forEach((e) => e.classList.toggle("active", e.id === `tab-${s}`)), s === "train" && G.resize(), s === "history" && se();
}
function Is() {
  document.querySelectorAll(".fl-tabs button").forEach((r) => r.onclick = () => Vt(r.dataset.tab)), l("btnConnect").onclick = async () => {
    if (Q instanceof mt && (Me === "live" || Me === "scanning")) {
      await Q.stop(), Q = null, tt("idle");
      return;
    }
    l("simPanel").classList.add("hidden"), Z = null;
    const r = new mt();
    r.onSeen = () => qs(r), xt(r);
  }, l("btnSim").onclick = () => {
    Z = new cs(), Z.exact = l("simExact").checked, l("simPanel").classList.remove("hidden"), xt(Z);
  }, l("simExact").onchange = (r) => {
    const c = r.target.checked;
    Z && (Z.exact = c), l("simHelp").textContent = c ? "Reading tracks the slider exactly." : 'Slide up to "push", back to 0 to rest. Fatigue is simulated.';
  }, l("btnTare").onclick = () => Q?.tare(), l("btnStart").onclick = Ts, l("camOn").checked = localStorage.getItem("ufl.camOn") === "1";
  const s = async () => {
    const r = l("camOn").checked;
    if (localStorage.setItem("ufl.camOn", r ? "1" : "0"), r) {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert("Camera not available here."), l("camOn").checked = !1;
        return;
      }
      Pe ?? (Pe = new Ls(l("camVideo")));
      try {
        await Pe.start(), l("camPip").classList.remove("hidden"), l("btnCamFlip").classList.remove("hidden");
      } catch (c) {
        alert("Camera failed: " + c.message + `
Allow the Camera permission for UY Force Lab in Android settings.`), l("camOn").checked = !1;
      }
    } else
      Pe?.stop(), l("camPip").classList.add("hidden"), l("btnCamFlip").classList.add("hidden");
  };
  l("camOn").onchange = s, l("camOn").checked && s(), l("btnCamFlip").onclick = () => Pe?.flip();
  const e = l("camPip"), t = localStorage.getItem("ufl.pipPos");
  if (t) {
    const [r, c] = t.split(",").map(Number);
    e.style.left = `${r}px`, e.style.top = `${c}px`;
  }
  let n = null;
  e.onpointerdown = (r) => {
    const c = e.getBoundingClientRect();
    n = { x: r.clientX, y: r.clientY, l: c.left, t: c.top, moved: !1 }, e.setPointerCapture(r.pointerId);
  }, e.onpointermove = (r) => {
    if (!n) return;
    const c = r.clientX - n.x, u = r.clientY - n.y;
    if (Math.abs(c) + Math.abs(u) > 6 && (n.moved = !0), !n.moved) return;
    const d = e.getBoundingClientRect(), h = Math.min(window.innerWidth - d.width, Math.max(0, n.l + c)), p = Math.min(window.innerHeight - d.height, Math.max(0, n.t + u));
    e.style.left = `${h}px`, e.style.top = `${p}px`;
  }, e.onpointerup = () => {
    if (n) {
      if (n.moved) {
        const r = e.getBoundingClientRect();
        localStorage.setItem("ufl.pipPos", `${Math.round(r.left)},${Math.round(r.top)}`);
      } else e.classList.toggle("large");
      n = null;
    }
  }, l("btnStop").onclick = Bt, l("simEffort").oninput = (r) => {
    const c = Number(r.target.value);
    Z && (Z.effort = c), l("simVal").textContent = String(c);
  }, l("exercise").onchange = q, Ge(l("exercise"), { recent: Ye, all: () => y, onCreate: bt }), Ge(l("maxExercise"), { recent: Ye, all: () => y, onCreate: bt }), Ge(l("histExercise"), { recent: Ye, all: () => y, allOption: { value: "", label: "All exercises" } }), l("btnNewEx").onclick = () => {
    l("newExBox").classList.remove("hidden"), l("newExName").focus();
  }, l("btnNewExCancel").onclick = () => {
    l("newExBox").classList.add("hidden"), l("newExName").value = "";
  };
  const i = async () => {
    const r = l("newExName").value.trim();
    if (r) {
      if (!y.includes(r)) {
        const c = X();
        c ? (c.addExercise(r), y = c.exerciseNames()) : (y.push(r), await O.saveExercises(y));
      }
      be(), l("exercise").value = r, l("newExBox").classList.add("hidden"), l("newExName").value = "", te(), await q();
    }
  };
  l("btnNewExSave").onclick = i, l("newExName").onkeydown = (r) => {
    r.key === "Enter" && i();
  }, l("side").onchange = q, l("protocol").onchange = () => Ft(), l("params").oninput = () => l("protocolHelp").textContent = Fe(l("protocol").value, st()).describe;
  for (const r of ["zoneOn", "zoneLo", "zoneHi"]) l(r).oninput = q;
  l("ghostOn").checked = ve, l("ghostOn").onchange = (r) => {
    ve = r.target.checked, localStorage.setItem("ufl.ghostOn", ve ? "1" : "0"), q();
  }, l("histExercise").onchange = se, l("btnCsv").onclick = () => Je(`uy-force-lab-${Et()}.csv`, ks(N), "text/csv"), l("btnJson").onclick = () => Je(`uy-force-lab-${Et()}.json`, JSON.stringify(N, null, 1), "application/json"), l("voiceOn").onchange = (r) => C.enabled = r.target.checked, l("beepOn").onchange = (r) => z = r.target.checked, l("calloutEvery").value = String(De), l("calloutEvery").onchange = (r) => {
    De = Math.max(1, Number(r.target.value) || 1), localStorage.setItem("ufl.calloutEvery", String(De));
  };
  const a = (r, c, u, d) => {
    const h = l(r);
    h.checked = d, h.onchange = () => {
      u(h.checked), localStorage.setItem(c, h.checked ? "1" : "0");
    };
  };
  a("calloutOn", "ufl.calloutOn", (r) => Ze = r, Ze), a("secBeep", "ufl.secBeep", (r) => Qe = r, Qe), a("secCount", "ufl.secCount", (r) => et = r, et);
  let o = null;
  C.onSpeak = (r) => {
    const c = l("said");
    c.textContent = `🔊 ${r}`, c.classList.add("on"), o && clearTimeout(o), o = setTimeout(() => c.classList.remove("on"), 900);
  }, document.addEventListener("pointerdown", () => C.unlock(), { once: !0 }), document.addEventListener("visibilitychange", () => {
    document.visibilityState === "visible" && C.reset();
  }), l("btnTestVoice").onclick = async () => {
    C.reset();
    const r = l("voiceStatus");
    r.textContent = await C.status(), C.say("Force lab voice check, 1, 2, 3", !0);
  }, l("btnSetMax").onclick = async () => {
    const r = Number(l("maxKg").value);
    r && (await O.setMax(l("maxExercise").value, l("maxSide").value, r), l("maxKg").value = "", te(), q());
  }, l("btnAddEx").onclick = async () => {
    const r = l("newEx").value.trim();
    if (!(!r || y.includes(r))) {
      {
        const c = X();
        c ? (c.addExercise(r), y = c.exerciseNames()) : (y.push(r), await O.saveExercises(y));
      }
      l("newEx").value = "", be(), te();
    }
  };
}
function qs(s) {
  const e = [...s.seen.values()].sort((t, n) => n.t - t.t).slice(0, 12);
  l("seenBody").innerHTML = e.map((t) => `<tr><td>${A(t.name || "(no name)")}<br><small class="muted">${A(t.id)}</small></td><td>${t.rssi}</td><td>${A(t.keys || "–")}</td><td style="white-space:normal;font-family:monospace;font-size:11px">${A(t.hex || "–")}</td><td>${t.kg === null ? "–" : t.kg.toFixed(2)}</td></tr>`).join("") || '<tr><td colspan="5" class="muted">Listening… nothing heard yet.</td></tr>';
}
function L(s) {
  return s >= 100 ? s.toFixed(0) : s.toFixed(1);
}
function Ht(s) {
  const e = Math.floor(s / 60), t = Math.floor(s % 60);
  return `${e}:${t.toString().padStart(2, "0")}`;
}
function Et() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function A(s) {
  return s.replace(/[&<>"]/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[e]);
}
Ds();
window.ForceLab = { onShow() {
  G.resize();
} };
async function Ns(s, e, t) {
  let n;
  return Promise.race([
    s,
    new Promise((i, a) => {
      n = setTimeout(() => a(t), e);
    })
  ]).finally(() => clearTimeout(n));
}
class Us extends ie {
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
      const r = this.getBleDevice(e.device), c = {
        device: r,
        localName: r.name,
        rssi: e.rssi,
        txPower: e.txPower,
        manufacturerData: ht(e.manufacturerData),
        serviceData: ht(e.serviceData),
        uuids: (i = e.uuids) === null || i === void 0 ? void 0 : i.map(ns)
      };
      this.notifyListeners("onScanResult", c);
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
      await Ns(i.gatt.connect(), o, a);
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
      const r = await o.getCharacteristics(), c = [];
      for (const u of r)
        c.push({
          uuid: u.uuid,
          properties: this.getProperties(u),
          descriptors: await this.getDescriptors(u)
        });
      a.push({ uuid: o.uuid, characteristics: c });
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
    typeof e.value == "string" ? n = ge(e.value) : n = e.value, await t?.writeValueWithResponse(Ne(n));
  }
  async writeWithoutResponse(e) {
    const t = await this.getCharacteristic(e);
    let n;
    typeof e.value == "string" ? n = ge(e.value) : n = e.value, await t?.writeValueWithoutResponse(Ne(n));
  }
  async readDescriptor(e) {
    const t = await this.getDescriptor(e);
    return { value: await t?.readValue() };
  }
  async writeDescriptor(e) {
    const t = await this.getDescriptor(e);
    let n;
    typeof e.value == "string" ? n = ge(e.value) : n = e.value, await t?.writeValue(Ne(n));
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
          const c = i.mask;
          let u = !0;
          for (let d = 0; d < r.byteLength; d++)
            if ((o[d] & c.getUint8(d)) !== (r.getUint8(d) & c.getUint8(d))) {
              u = !1;
              break;
            }
          if (u)
            return !0;
        } else {
          let c = !0;
          for (let u = 0; u < r.byteLength; u++)
            if (o[u] !== r.getUint8(u)) {
              c = !1;
              break;
            }
          if (c)
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
const js = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BluetoothLeWeb: Us
}, Symbol.toStringTag, { value: "Module" }));
class Vs extends ie {
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
    const t = this.getSpeechSynthesisVoices(), n = new SpeechSynthesisUtterance(), { text: i, lang: a, rate: o, pitch: r, volume: c, voice: u } = e;
    return u !== void 0 && (n.voice = t[u]), c !== void 0 && (n.volume = c >= 0 && c <= 1 ? c : 1), o !== void 0 && (n.rate = o >= 0.1 && o <= 10 ? o : 1), r !== void 0 && (n.pitch = r >= 0 && r <= 2 ? r : 2), a && (n.lang = a), n.text = i, n;
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
const Hs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  TextToSpeechWeb: Vs
}, Symbol.toStringTag, { value: "Module" }));
class Ws extends ie {
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
      const r = o.substring(i.length), c = (e = this.impl.getItem(o)) !== null && e !== void 0 ? e : "", { value: u } = await this.get({ key: r });
      typeof u == "string" ? n.push(r) : (await this.set({ key: r, value: c }), t.push(r));
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
const zs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PreferencesWeb: Ws
}, Symbol.toStringTag, { value: "Module" }));
function Lt(s) {
  const e = s.split("/").filter((n) => n !== "."), t = [];
  return e.forEach((n) => {
    n === ".." && t.length > 0 && t[t.length - 1] !== ".." ? t.pop() : t.push(n);
  }), t.join("/");
}
function Gs(s, e) {
  s = Lt(s), e = Lt(e);
  const t = s.split("/"), n = e.split("/");
  return s !== e && t.every((i, a) => i === n[a]);
}
class Ie extends ie {
  constructor() {
    super(...arguments), this.DB_VERSION = 1, this.DB_NAME = "Disc", this._writeCmds = ["add", "put", "delete"], this.downloadFile = async (e) => {
      var t, n;
      const i = Ct(e, e.webFetchExtra), a = await fetch(e.url, i);
      let o;
      if (!e.progress)
        o = await a.blob();
      else if (!a?.body)
        o = new Blob();
      else {
        const c = a.body.getReader();
        let u = 0;
        const d = [], h = a.headers.get("content-type"), p = parseInt(a.headers.get("content-length") || "0", 10);
        for (; ; ) {
          const { done: w, value: b } = await c.read();
          if (w)
            break;
          d.push(b), u += b?.length || 0;
          const x = {
            url: e.url,
            bytes: u,
            contentLength: p
          };
          this.notifyListeners("progress", x);
        }
        const f = new Uint8Array(u);
        let v = 0;
        for (const w of d)
          typeof w > "u" || (f.set(w, v), v += w.length);
        o = new Blob([f.buffer], { type: h || void 0 });
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
      n.onupgradeneeded = Ie.doUpgrade, n.onsuccess = () => {
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
    const c = await this.dbRequest("get", [t]);
    if (c && c.type === "directory")
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
    if (c !== void 0) {
      if (c.content instanceof Blob)
        throw Error("The occupied entry contains a Blob object which cannot be appended to.");
      c.content !== void 0 && !i ? n = btoa(atob(c.content) + atob(n)) : n = c.content + n, r = c.ctime;
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
    const c = Date.now(), u = {
      path: t,
      folder: i,
      type: "directory",
      size: 0,
      ctime: c,
      mtime: c
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
    for (const c of r.files) {
      const u = `${t}/${c.name}`;
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
    const r = this.getPath(o, a), c = this.getPath(n, i);
    if (r === c)
      return {
        uri: c
      };
    if (Gs(r, c))
      throw Error("To path cannot contain the from path");
    let u;
    try {
      u = await this.stat({
        path: i,
        directory: n
      });
    } catch {
      const v = i.split("/");
      v.pop();
      const w = v.join("/");
      if (v.length > 0 && (await this.stat({
        path: w,
        directory: n
      })).type !== "directory")
        throw new Error("Parent directory of the to path is a file");
    }
    if (u && u.type === "directory")
      throw new Error("Cannot overwrite a directory with a file");
    const d = await this.stat({
      path: a,
      directory: o
    }), h = async (f, v, w) => {
      const b = this.getPath(n, f), x = await this.dbRequest("get", [b]);
      x.ctime = v, x.mtime = w, await this.dbRequest("put", [x]);
    }, p = d.ctime ? d.ctime : Date.now();
    switch (d.type) {
      case "file": {
        const f = await this.readFile({
          path: a,
          directory: o
        });
        t && await this.deleteFile({
          path: a,
          directory: o
        });
        let v;
        !(f.data instanceof Blob) && !this.isBase64String(f.data) && (v = Ae.UTF8);
        const w = await this.writeFile({
          path: i,
          directory: n,
          data: f.data,
          encoding: v
        });
        return t && await h(i, p, d.mtime), w;
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
        const f = (await this.readdir({
          path: a,
          directory: o
        })).files;
        for (const v of f)
          await this._copy({
            from: `${a}/${v.name}`,
            to: `${i}/${v.name}`,
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
      uri: c
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
Ie._debug = !0;
const Ks = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  FilesystemWeb: Ie
}, Symbol.toStringTag, { value: "Module" }));
class Ys extends ie {
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
const Xs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ShareWeb: Ys
}, Symbol.toStringTag, { value: "Module" }));
