var tt;
(function(s) {
  s[s.SCAN_MODE_LOW_POWER = 0] = "SCAN_MODE_LOW_POWER", s[s.SCAN_MODE_BALANCED = 1] = "SCAN_MODE_BALANCED", s[s.SCAN_MODE_LOW_LATENCY = 2] = "SCAN_MODE_LOW_LATENCY";
})(tt || (tt = {}));
var ft;
(function(s) {
  s[s.PHY_LE_1M = 1] = "PHY_LE_1M", s[s.PHY_LE_2M = 2] = "PHY_LE_2M", s[s.PHY_LE_CODED = 3] = "PHY_LE_CODED", s[s.PHY_LE_ALL_SUPPORTED = 255] = "PHY_LE_ALL_SUPPORTED";
})(ft || (ft = {}));
var pt;
(function(s) {
  s[s.CONNECTION_PRIORITY_BALANCED = 0] = "CONNECTION_PRIORITY_BALANCED", s[s.CONNECTION_PRIORITY_HIGH = 1] = "CONNECTION_PRIORITY_HIGH", s[s.CONNECTION_PRIORITY_LOW_POWER = 2] = "CONNECTION_PRIORITY_LOW_POWER";
})(pt || (pt = {}));
/*! Capacitor: https://capacitorjs.com/ - MIT License */
var he;
(function(s) {
  s.Unimplemented = "UNIMPLEMENTED", s.Unavailable = "UNAVAILABLE";
})(he || (he = {}));
class Ve extends Error {
  constructor(e, t, n) {
    super(e), this.message = e, this.code = t, this.data = n;
  }
}
const ss = (s) => {
  var e, t;
  return s?.androidBridge ? "android" : !((t = (e = s?.webkit) === null || e === void 0 ? void 0 : e.messageHandlers) === null || t === void 0) && t.bridge ? "ios" : "web";
}, ns = (s) => {
  const e = s.CapacitorCustomPlatform || null, t = s.Capacitor || {}, n = t.Plugins = t.Plugins || {}, i = () => e !== null ? e.name : ss(s), a = () => i() !== "web", o = (h) => {
    const f = u.get(h);
    return !!(f?.platforms.has(i()) || l(h));
  }, l = (h) => {
    var f;
    return (f = t.PluginHeaders) === null || f === void 0 ? void 0 : f.find((p) => p.name === h);
  }, r = (h) => s.console.error(h), u = /* @__PURE__ */ new Map(), d = (h, f = {}) => {
    const p = u.get(h);
    if (p)
      return console.warn(`Capacitor plugin "${h}" already registered. Cannot register plugins twice.`), p.proxy;
    const v = i(), y = l(h);
    let b;
    const x = async () => (!b && v in f ? b = typeof f[v] == "function" ? b = await f[v]() : b = f[v] : e !== null && !b && "web" in f && (b = typeof f.web == "function" ? b = await f.web() : b = f.web), b), V = (L, $) => {
      var g, S;
      if (y) {
        const _ = y?.methods.find((H) => $ === H.name);
        if (_)
          return _.rtype === "promise" ? (H) => t.nativePromise(h, $.toString(), H) : (H, Le) => t.nativeCallback(h, $.toString(), H, Le);
        if (L)
          return (g = L[$]) === null || g === void 0 ? void 0 : g.bind(L);
      } else {
        if (L)
          return (S = L[$]) === null || S === void 0 ? void 0 : S.bind(L);
        throw new Ve(`"${h}" plugin is not implemented on ${v}`, he.Unimplemented);
      }
    }, M = (L) => {
      let $;
      const g = (...S) => {
        const _ = x().then((H) => {
          const Le = V(H, L);
          if (Le) {
            const Ce = Le(...S);
            return $ = Ce?.remove, Ce;
          } else
            throw new Ve(`"${h}.${L}()" is not implemented on ${v}`, he.Unimplemented);
        });
        return L === "addListener" && (_.remove = async () => $()), _;
      };
      return g.toString = () => `${L.toString()}() { [capacitor code] }`, Object.defineProperty(g, "name", {
        value: L,
        writable: !1,
        configurable: !1
      }), g;
    }, U = M("addListener"), I = M("removeListener"), F = (L, $) => {
      const g = U({ eventName: L }, $), S = async () => {
        const H = await g;
        I({
          eventName: L,
          callbackId: H
        }, $);
      }, _ = new Promise((H) => g.then(() => H({ remove: S })));
      return _.remove = async () => {
        console.warn("Using addListener() without 'await' is deprecated."), await S();
      }, _;
    }, D = new Proxy({}, {
      get(L, $) {
        switch ($) {
          case "$$typeof":
            return;
          case "toJSON":
            return () => ({});
          case "addListener":
            return y ? F : U;
          case "removeListener":
            return I;
          default:
            return M($);
        }
      }
    });
    return n[h] = D, u.set(h, {
      name: h,
      proxy: D,
      platforms: /* @__PURE__ */ new Set([...Object.keys(f), ...y ? [v] : []])
    }), D;
  };
  return t.convertFileSrc || (t.convertFileSrc = (h) => h), t.getPlatform = i, t.handleError = r, t.isNativePlatform = a, t.isPluginAvailable = o, t.registerPlugin = d, t.Exception = Ve, t.DEBUG = !!t.DEBUG, t.isLoggingEnabled = !!t.isLoggingEnabled, t;
}, is = (s) => s.Capacitor = ns(s), A = /* @__PURE__ */ is(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {}), ne = A.registerPlugin;
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
    return new A.Exception(e, he.Unimplemented);
  }
  unavailable(e = "not available") {
    return new A.Exception(e, he.Unavailable);
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
const gt = (s) => encodeURIComponent(s).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape), mt = (s) => s.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class as extends ie {
  async getCookies() {
    const e = document.cookie, t = {};
    return e.split(";").forEach((n) => {
      if (n.length <= 0)
        return;
      let [i, a] = n.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
      i = mt(i).trim(), a = mt(a).trim(), t[i] = a;
    }), t;
  }
  async setCookie(e) {
    try {
      const t = gt(e.key), n = gt(e.value), i = e.expires ? `; expires=${e.expires.replace("expires=", "")}` : "", a = (e.path || "/").replace("path=", ""), o = e.url != null && e.url.length > 0 ? `domain=${e.url}` : "";
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
  web: () => new as()
});
const rs = async (s) => new Promise((e, t) => {
  const n = new FileReader();
  n.onload = () => {
    const i = n.result;
    e(i.indexOf(",") >= 0 ? i.split(",")[1] : i);
  }, n.onerror = (i) => t(i), n.readAsDataURL(s);
}), os = (s = {}) => {
  const e = Object.keys(s);
  return Object.keys(s).map((i) => i.toLocaleLowerCase()).reduce((i, a, o) => (i[a] = s[e[o]], i), {});
}, cs = (s, e = !0) => s ? Object.entries(s).reduce((n, i) => {
  const [a, o] = i;
  let l, r;
  return Array.isArray(o) ? (r = "", o.forEach((u) => {
    l = e ? encodeURIComponent(u) : u, r += `${a}=${l}&`;
  }), r.slice(0, -1)) : (l = e ? encodeURIComponent(o) : o, r = `${a}=${l}`), `${n}&${r}`;
}, "").substr(1) : null, Tt = (s, e = {}) => {
  const t = Object.assign({ method: s.method || "GET", headers: s.headers }, e), i = os(s.headers)["content-type"] || "";
  if (typeof s.data == "string")
    t.body = s.data;
  else if (i.includes("application/x-www-form-urlencoded")) {
    const a = new URLSearchParams();
    for (const [o, l] of Object.entries(s.data || {}))
      a.set(o, l);
    t.body = a.toString();
  } else if (i.includes("multipart/form-data") || s.data instanceof FormData) {
    const a = new FormData();
    if (s.data instanceof FormData)
      s.data.forEach((l, r) => {
        a.append(r, l);
      });
    else
      for (const l of Object.keys(s.data))
        a.append(l, s.data[l]);
    t.body = a;
    const o = new Headers(t.headers);
    o.delete("content-type"), t.headers = o;
  } else (i.includes("application/json") || typeof s.data == "object") && (t.body = JSON.stringify(s.data));
  return t;
};
class ls extends ie {
  /**
   * Perform an Http request given a set of options
   * @param options Options to build the HTTP request
   */
  async request(e) {
    const t = Tt(e, e.webFetchExtra), n = cs(e.params, e.shouldEncodeUrlParams), i = n ? `${e.url}?${n}` : e.url, a = await fetch(i, t), o = a.headers.get("content-type") || "";
    let { responseType: l = "text" } = a.ok ? e : {};
    o.includes("application/json") && (l = "json");
    let r, u;
    switch (l) {
      case "arraybuffer":
      case "blob":
        u = await a.blob(), r = await rs(u);
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
  web: () => new ls()
});
var vt;
(function(s) {
  s.Dark = "DARK", s.Light = "LIGHT", s.Default = "DEFAULT";
})(vt || (vt = {}));
var wt;
(function(s) {
  s.StatusBar = "StatusBar", s.NavigationBar = "NavigationBar";
})(wt || (wt = {}));
class us extends ie {
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
  web: () => new us()
});
function ds(s) {
  return new DataView(Uint8Array.from(s).buffer);
}
function hs(s) {
  return Array.from(new Uint8Array(s.buffer, s.byteOffset, s.byteLength));
}
function fs(s) {
  return `0000${s.toString(16).padStart(4, "0")}-0000-1000-8000-00805f9b34fb`;
}
function ye(s) {
  const e = [];
  let t, n, i = 1, a = 0;
  for (t = 0; t < s.length; t++)
    n = s.charCodeAt(t), (n > 47 && n < 58 || n > 64 && n < 71 || n > 96 && n < 103) && (a = a << 4 ^ (n > 64 ? n + 9 : n) & 15, (i ^= 1) && e.push(a & 255));
  return ds(e);
}
function be(s) {
  return hs(s).map((e) => {
    let t = e.toString(16);
    return t.length == 1 && (t = "0" + t), t;
  }).join("");
}
function ps(s) {
  if (typeof s == "string")
    return s;
  if (typeof s == "number")
    return fs(s);
  throw new Error("Invalid UUID");
}
function yt(s) {
  const e = {};
  if (s)
    return s.forEach((t, n) => {
      e[n.toString()] = t;
    }), e;
}
function bt(s) {
  if (s !== void 0) {
    if (typeof s == "string") {
      const e = ye(s);
      return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
    }
    return s instanceof DataView ? new Uint8Array(s.buffer, s.byteOffset, s.byteLength) : s;
  }
}
function Pe(s) {
  if (s !== void 0)
    return s instanceof DataView ? be(s) : be(new DataView(s.buffer, s.byteOffset, s.byteLength));
}
function He(s) {
  if (typeof SharedArrayBuffer < "u" && s.buffer instanceof SharedArrayBuffer) {
    const t = new Uint8Array(s.buffer, s.byteOffset, s.byteLength).slice().buffer;
    return new DataView(t);
  }
  return s;
}
const m = ne("BluetoothLe", {
  web: () => Promise.resolve().then(() => Qs).then((s) => new s.BluetoothLeWeb())
}), gs = () => {
  let s = Promise.resolve();
  return (e) => new Promise((t, n) => {
    s = s.then(() => e()).then(t).catch(n);
  });
};
function We(s) {
  return s ? gs() : (e) => e();
}
function E(s) {
  if (typeof s != "string")
    throw new Error(`Invalid UUID type ${typeof s}. Expected string.`);
  if (s = s.toLowerCase(), !(s.search(/^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/) >= 0))
    throw new Error(`Invalid UUID format ${s}. Expected 128 bit string (e.g. "0000180d-0000-1000-8000-00805f9b34fb").`);
  return s;
}
class ms {
  constructor() {
    this.scanListener = null, this.eventListeners = /* @__PURE__ */ new Map(), this.queue = We(!0);
  }
  enableQueue() {
    this.queue = We(!0);
  }
  disableQueue() {
    this.queue = We(!1);
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
    return e = e.map(E), this.queue(async () => (await m.getConnectedDevices({ services: e })).devices);
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
    return t = E(t), n = E(n), await this.queue(async () => {
      const o = await m.read(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n
      }, i));
      return this.convertValue(o.value);
    });
  }
  async write(e, t, n, i, a) {
    return t = E(t), n = E(n), this.queue(async () => {
      if (!i?.buffer)
        throw new Error("Invalid data.");
      let o = i;
      A.getPlatform() !== "web" && (o = be(i)), await m.write(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n,
        value: o
      }, a));
    });
  }
  async writeWithoutResponse(e, t, n, i, a) {
    t = E(t), n = E(n), await this.queue(async () => {
      if (!i?.buffer)
        throw new Error("Invalid data.");
      let o = i;
      A.getPlatform() !== "web" && (o = be(i)), await m.writeWithoutResponse(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n,
        value: o
      }, a));
    });
  }
  async readDescriptor(e, t, n, i, a) {
    return t = E(t), n = E(n), i = E(i), await this.queue(async () => {
      const l = await m.readDescriptor(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n,
        descriptor: i
      }, a));
      return this.convertValue(l.value);
    });
  }
  async writeDescriptor(e, t, n, i, a, o) {
    return t = E(t), n = E(n), i = E(i), this.queue(async () => {
      if (!a?.buffer)
        throw new Error("Invalid data.");
      let l = a;
      A.getPlatform() !== "web" && (l = be(a)), await m.writeDescriptor(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n,
        descriptor: i,
        value: l
      }, o));
    });
  }
  async startNotifications(e, t, n, i, a) {
    t = E(t), n = E(n), await this.queue(async () => {
      var o;
      const l = `notification|${e}|${t}|${n}`;
      await ((o = this.eventListeners.get(l)) === null || o === void 0 ? void 0 : o.remove());
      const r = await m.addListener(l, (u) => {
        i(this.convertValue(u?.value));
      });
      this.eventListeners.set(l, r), await m.startNotifications(Object.assign({
        deviceId: e,
        service: t,
        characteristic: n
      }, a));
    });
  }
  async stopNotifications(e, t, n) {
    t = E(t), n = E(n), await this.queue(async () => {
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
    return e = Object.assign({}, e), e.services && (e.services = e.services.map(E)), e.optionalServices && (e.optionalServices = e.optionalServices.map(E)), e.serviceData && A.getPlatform() !== "web" && (e.serviceData = e.serviceData.map((t) => Object.assign(Object.assign({}, t), { serviceUuid: E(t.serviceUuid), dataPrefix: Pe(t.dataPrefix), mask: Pe(t.mask) }))), e.manufacturerData && (A.getPlatform() !== "web" ? e.manufacturerData = e.manufacturerData.map((t) => Object.assign(Object.assign({}, t), { dataPrefix: Pe(t.dataPrefix), mask: Pe(t.mask) })) : e.manufacturerData = e.manufacturerData.map((t) => Object.assign(Object.assign({}, t), { dataPrefix: bt(t.dataPrefix), mask: bt(t.mask) }))), e;
  }
  convertValue(e) {
    return typeof e == "string" ? ye(e) : e === void 0 ? new DataView(new ArrayBuffer(0)) : e;
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
const ue = new ms(), ze = 256, Ke = 10, vs = 4e3;
class _t {
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
    this.setStatus("live"), this.sampleFns.forEach((n) => n(t)), this.lostTimer && clearTimeout(this.lostTimer), this.lostTimer = setTimeout(() => this.setStatus("lost"), vs);
  }
  clearLost() {
    this.lostTimer && clearTimeout(this.lostTimer), this.lostTimer = null;
  }
}
function xt(s) {
  let e = "";
  for (let t = 0; t < s.byteLength; t++) e += s.getUint8(t).toString(16).padStart(2, "0") + " ";
  return e.trim();
}
function St(s, e) {
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
function ws(s) {
  return s.byteLength < Ke + 2 ? null : (s.getUint8(Ke) << 8 | s.getUint8(Ke + 1)) / 100;
}
class xe extends _t {
  constructor() {
    super(...arguments), this.name = "WeiHeng scale", this.scanning = !1, this.seen = /* @__PURE__ */ new Map(), this.onSeen = () => {
    }, this.lastScanStart = 0, this.healTimer = null, this.lastPacketAt = 0, this.restarts = 0;
  }
  async start() {
    if (!A.isNativePlatform())
      throw new Error("Bluetooth scanning needs the Android build. Use the simulator in the browser.");
    if (await ue.initialize({ androidNeverForLocation: !0 }), !await ue.isEnabled().catch(() => !0))
      try {
        await ue.requestEnable();
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
        await ue.stopLEScan();
      } catch {
      }
      await new Promise((e) => setTimeout(e, 300)), this.restarts++;
    }
    this.setStatus("scanning"), this.scanning = !0, this.lastScanStart = Date.now(), await ue.requestLEScan(
      { allowDuplicates: !0, scanMode: tt.SCAN_MODE_LOW_LATENCY },
      (e) => {
        const t = e.localName ?? e.device.name ?? "", n = e.manufacturerData ?? {}, i = Object.keys(n);
        let a = n[String(ze)] ?? n[ze.toString(16)];
        !a && /^(IF_|WH-|WEIHENG)/i.test(t) && i.length && (a = n[i[0]]), !a && e.rawAdvertisement && (a = St(e.rawAdvertisement, ze) ?? (/^IF_/i.test(t) ? St(e.rawAdvertisement) : void 0));
        const o = a ? ws(a) : null, l = { id: e.device.deviceId, name: t, rssi: e.rssi ?? 0, keys: i.join(","), hex: a ? xt(a) : e.rawAdvertisement ? xt(e.rawAdvertisement).slice(0, 60) : "", kg: o, t: Date.now() };
        this.seen.set(l.id, l), this.onSeen(l), o !== null && (this.lastPacketAt = Date.now(), this.emitRaw(o));
      }
    );
  }
  async stop() {
    if (this.healTimer && (clearInterval(this.healTimer), this.healTimer = null), this.scanning)
      try {
        await ue.stopLEScan();
      } catch {
      }
    this.scanning = !1, this.clearLost(), this.setStatus("idle");
  }
}
class ys extends _t {
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
function fe(s) {
  return s.manualReps && s.manualReps > 0 ? Math.round(s.manualReps) : 1;
}
function le(s) {
  return s.performedAt ?? s.startedAt;
}
const Te = 2;
class bs {
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
    const n = Rt(t);
    return {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      exercise: e.exercise,
      side: e.side,
      mode: e.mode,
      startedAt: this.t0,
      durationS: t[t.length - 1].t,
      samples: t,
      ...n,
      reps: Mt(t)
    };
  }
}
function Rt(s) {
  let e = 0, t = 0, n = 0;
  for (let l = 0; l < s.length; l++) {
    const r = Math.max(0, s[l].kg);
    e = Math.max(e, r), t += r, l > 0 && (n += r * (s[l].t - s[l - 1].t));
  }
  const i = t / s.length, a = s.filter((l) => l.kg > Te);
  let o = 0;
  if (a.length >= 10) {
    const l = Math.max(3, Math.floor(a.length * 0.2)), r = Math.max(...a.slice(0, l).map((d) => d.kg)), u = Math.max(...a.slice(-l).map((d) => d.kg));
    o = r > 0 ? Math.max(0, (r - u) / r * 100) : 0;
  }
  return { peak: B(e), avg: B(i), output: B(n), inroad: B(o) };
}
function Mt(s) {
  if (s.length < 5) return [];
  const e = Math.max(...s.map((r) => r.kg));
  if (e < Te * 2) return [];
  const t = Math.max(Te, e * 0.35), n = Math.max(Te * 0.5, e * 0.2), i = [];
  let a = !1, o = 0, l = 0;
  for (const r of s)
    !a && r.kg >= t ? (a = !0, o = r.t, l = r.kg) : a && (l = Math.max(l, r.kg), r.kg <= n && (r.t - o >= 0.6 && i.push({ index: i.length + 1, peak: B(l), startS: B(o), endS: B(r.t), durationS: B(r.t - o) }), a = !1));
  if (a) {
    const r = s[s.length - 1].t;
    r - o >= 0.6 && i.push({ index: i.length + 1, peak: B(l), startS: B(o), endS: B(r), durationS: B(r - o) });
  }
  return i.length >= 2 ? i : [];
}
function xs(s) {
  if (s.length < 6) return null;
  const e = s.slice(-Math.max(3, Math.floor(s.length / 3)));
  return B(e.reduce((t, n) => t + n.peak, 0) / e.length);
}
function B(s) {
  return Math.round(s * 100) / 100;
}
class It {
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
    const { ctx: i } = this, a = this.canvas.width / this.dpr, o = this.canvas.height / this.dpr, l = 42, r = 12, u = 12, d = 24, h = a - l - r, f = o - u - d, p = getComputedStyle(document.getElementById("view-force") ?? document.documentElement), v = p.getPropertyValue("--muted").trim() || "#888", y = p.getPropertyValue("--grid").trim() || "#333", b = p.getPropertyValue("--accent").trim() || "#e8552f", x = p.getPropertyValue("--ghost").trim() || "#7a7a7a", V = p.getPropertyValue("--zone").trim() || "rgba(60,180,90,0.18)";
    i.clearRect(0, 0, a, o);
    const M = Math.max(this.opts.windowS, Math.ceil(t / 10) * 10 || 10), U = this.opts.ghost ?? [];
    let I = 10;
    for (const g of e) I = Math.max(I, g.kg);
    for (const g of U) I = Math.max(I, g.kg);
    this.opts.zone && (I = Math.max(I, this.opts.zone.hi)), I = Ss(I * 1.1);
    const F = (g) => l + g / M * h, D = (g) => u + f - Math.max(0, g) / I * f;
    if (this.opts.zone) {
      i.fillStyle = V;
      const g = D(this.opts.zone.hi), S = D(this.opts.zone.lo);
      i.fillRect(l, g, h, S - g);
    }
    i.strokeStyle = y, i.lineWidth = 1, i.fillStyle = v, i.font = "11px system-ui, sans-serif", i.textAlign = "right", i.textBaseline = "middle";
    const L = 5;
    for (let g = 0; g <= L; g++) {
      const S = I / L * g, _ = D(S);
      i.beginPath(), i.moveTo(l, _), i.lineTo(a - r, _), i.stroke(), i.fillText(S.toFixed(0), l - 6, _);
    }
    i.textAlign = "center", i.textBaseline = "top";
    const $ = M <= 30 ? 5 : M <= 90 ? 10 : 30;
    for (let g = 0; g <= M; g += $) {
      const S = F(g);
      i.beginPath(), i.moveTo(S, u), i.lineTo(S, u + f), i.stroke(), i.fillText(ks(g), S, u + f + 6);
    }
    if (this.opts.marks?.length) {
      i.strokeStyle = x, i.setLineDash([3, 4]);
      for (const g of this.opts.marks)
        i.beginPath(), i.moveTo(F(g), u), i.lineTo(F(g), u + f), i.stroke();
      i.setLineDash([]);
    }
    if (U.length > 1 && (i.strokeStyle = x, i.lineWidth = 1.5, i.globalAlpha = 0.55, i.beginPath(), U.forEach((g, S) => S ? i.lineTo(F(g.t), D(g.kg)) : i.moveTo(F(g.t), D(g.kg))), i.stroke(), i.globalAlpha = 1), e.length > 1) {
      i.strokeStyle = b, i.lineWidth = 2.5, i.lineJoin = "round", i.beginPath(), e.forEach((S, _) => _ ? i.lineTo(F(S.t), D(S.kg)) : i.moveTo(F(S.t), D(S.kg))), i.stroke();
      const g = e[e.length - 1];
      i.lineTo(F(g.t), D(0)), i.lineTo(F(e[0].t), D(0)), i.closePath(), i.fillStyle = b, i.globalAlpha = 0.12, i.fill(), i.globalAlpha = 1, i.fillStyle = b, i.beginPath(), i.arc(F(g.t), D(g.kg), 4, 0, Math.PI * 2), i.fill();
    } else n > 0 && (i.fillStyle = b, i.beginPath(), i.arc(F(0), D(n), 4, 0, Math.PI * 2), i.fill());
  }
}
function Ss(s) {
  const e = [10, 20, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500];
  for (const t of e) if (s <= t) return t;
  return Math.ceil(s / 100) * 100;
}
function ks(s) {
  const e = Math.floor(s / 60), t = s % 60;
  return `${e}:${t.toString().padStart(2, "0")}`;
}
function Ne(s, e = {}) {
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
      return Ne("free");
  }
}
function Ft(s) {
  if (!s.repeat || s.phases.length < 2) return s.phases;
  const [e, ...t] = s.phases, n = [e];
  for (let i = 0; i < s.repeat; i++)
    for (const a of t)
      i === s.repeat - 1 && a === t[t.length - 1] && a.cue === "rest" || n.push({ ...a, name: t.length > 1 && a.cue !== "rest" ? `${a.name} ${i + 1}/${s.repeat}` : a.name });
  return n;
}
class Es {
  constructor() {
    this.timeline = [], this.idx = -1, this.phaseStart = 0, this.timer = null, this.running = !1, this.onPhase = () => {
    }, this.onTick = () => {
    }, this.onDone = () => {
    };
  }
  start(e) {
    this.timeline = Ft(e), this.idx = -1, this.running = !0, this.next(), this.timer = setInterval(() => this.tick(), 100);
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
var kt;
(function(s) {
  s[s.Flush = 0] = "Flush", s[s.Add = 1] = "Add";
})(kt || (kt = {}));
const $e = ne("TextToSpeech", {
  web: () => Promise.resolve().then(() => tn).then((s) => new s.TextToSpeechWeb())
}), De = A.isNativePlatform();
let Ge = null;
function Ls() {
  return Ge || (Ge = new (window.AudioContext || window.webkitAudioContext)()), Ge;
}
function ae(s = 880, e = 120, t = 0.25) {
  try {
    const n = Ls(), i = n.createOscillator(), a = n.createGain();
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
class Cs {
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
    if (De) return this.nativeBusy;
    try {
      return speechSynthesis.speaking || speechSynthesis.pending ? (this.busySince || (this.busySince = Date.now()), Date.now() - this.busySince > 4e3 ? (this.reset(), !1) : !0) : (this.busySince = 0, !1);
    } catch {
      return !1;
    }
  }
  /** Hard reset of the engine. */
  reset() {
    if (De) {
      $e.stop().catch(() => {
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
    if (De)
      try {
        return `${(await $e.getSupportedVoices()).voices.length} native voices`;
      } catch {
        return "native TTS unavailable";
      }
    if (!("speechSynthesis" in window)) return "no speech engine in this browser — open in Chrome";
    const e = speechSynthesis.getVoices().length;
    return e ? `${e} voices` : "no voices installed";
  }
  say(e, t = !1, n = !1) {
    if (!this.enabled) return;
    if (this.onSpeak(e), De) {
      if (this.nativeBusy && !t) return;
      this.nativeBusy = !0, (t ? $e.stop().catch(() => {
      }) : Promise.resolve()).then(() => $e.speak({ text: e, lang: "en-US", rate: this.rate, pitch: this.pitch, volume: 1, category: "ambient" })).catch(() => {
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
          const o = this.keep.indexOf(a);
          o >= 0 && this.keep.splice(o, 1);
        }, speechSynthesis.speak(a), this.lastSpoke = i, this.lastText = e;
      } catch {
      }
  }
}
function Ps(s) {
  const e = Math.floor(s / 60), t = s % 60;
  return t === 0 && e > 0 ? e === 1 ? "1 minute" : `${e} minutes` : String(t);
}
const Et = ne("KeepAwake", {
  web: () => Promise.resolve().then(() => nn).then((s) => new s.KeepAwakeWeb())
}), Bt = ne("Preferences", {
  web: () => Promise.resolve().then(() => rn).then((s) => new s.PreferencesWeb())
}), ge = "ufl.sets.v1", Oe = "ufl.max.v1", Ye = "ufl.exercises.v1", qt = [
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
function $s(s) {
  return /^SR\b|self.?resisted/i.test(s) ? "self-resisted" : "iso";
}
async function Xe(s, e) {
  try {
    const t = A.isNativePlatform() ? (await Bt.get({ key: s })).value : localStorage.getItem(s);
    return t ? JSON.parse(t) : e;
  } catch {
    return e;
  }
}
async function Q(s, e) {
  const t = JSON.stringify(e);
  A.isNativePlatform() ? await Bt.set({ key: s, value: t }) : localStorage.setItem(s, t);
}
const P = {
  async sets() {
    return Xe(ge, []);
  },
  async saveSet(s) {
    const e = await this.sets();
    e.push(s), await Q(ge, e.slice(-500));
  },
  async updateSet(s) {
    const e = await this.sets(), t = e.findIndex((n) => n.id === s.id);
    t >= 0 ? e[t] = s : e.push(s), await Q(ge, e);
  },
  async deleteSet(s) {
    const e = await this.sets();
    await Q(ge, e.filter((t) => t.id !== s));
  },
  async maxes() {
    return Xe(Oe, {});
  },
  async setMax(s, e, t) {
    const n = await this.maxes();
    n[`${s}|${e}`] = { kg: t, at: Date.now() }, await Q(Oe, n);
  },
  async deleteMax(s) {
    const e = await this.maxes();
    delete e[s], await Q(Oe, e);
  },
  async exercises() {
    return Xe(Ye, qt);
  },
  /** Rename an exercise in every stored set and max (and the local list). */
  async renameExercise(s, e) {
    const t = await this.sets();
    for (const o of t) o.exercise === s && (o.exercise = e);
    await Q(ge, t);
    const n = await this.maxes(), i = {};
    for (const [o, l] of Object.entries(n)) {
      const [r, u] = o.split("|"), d = `${r === s ? e : r}|${u}`;
      (!i[d] || i[d].kg < l.kg) && (i[d] = l);
    }
    await Q(Oe, i);
    const a = await this.exercises();
    if (a.includes(s)) {
      const o = a.map((l) => l === s ? e : l);
      await Q(Ye, [...new Set(o)]);
    }
  },
  async saveExercises(s) {
    await Q(Ye, s);
  }
};
function Ds(s) {
  s.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, t) {
        return new Proxy({}, {
          get(n, i) {
            return (a, o, l) => {
              const r = s.Capacitor.Plugins[t];
              if (r === void 0) {
                l(new Error(`Capacitor plugin ${t} not found`));
                return;
              }
              if (typeof r[i] != "function") {
                l(new Error(`Method ${i} not found in Capacitor plugin ${t}`));
                return;
              }
              (async () => {
                try {
                  const u = await r[i](a);
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
function Os(s) {
  s.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, t) {
        return s.cordova.plugins[t];
      }
    }
  );
}
function As(s = !1) {
  typeof window > "u" || (window.CapacitorUtils = window.CapacitorUtils || {}, window.Capacitor !== void 0 && !s ? Ds(window) : window.cordova !== void 0 && Os(window));
}
var st;
(function(s) {
  s.Documents = "DOCUMENTS", s.Data = "DATA", s.Library = "LIBRARY", s.Cache = "CACHE", s.External = "EXTERNAL", s.ExternalStorage = "EXTERNAL_STORAGE", s.ExternalCache = "EXTERNAL_CACHE", s.LibraryNoCloud = "LIBRARY_NO_CLOUD", s.Temporary = "TEMPORARY";
})(st || (st = {}));
var Ie;
(function(s) {
  s.UTF8 = "utf8", s.ASCII = "ascii", s.UTF16 = "utf16";
})(Ie || (Ie = {}));
const Ts = ne("Filesystem", {
  web: () => Promise.resolve().then(() => cn).then((s) => new s.FilesystemWeb())
});
As();
const _s = ne("Share", {
  web: () => Promise.resolve().then(() => un).then((s) => new s.ShareWeb())
});
function Rs(s) {
  const e = ["id", "date_performed", "recorded_at", "exercise", "side", "mode", "duration_s", "peak_kg", "avg_kg", "output_kgs", "inroad_pct", "reps", "auto_reps", "rep_peaks"], t = s.map((n) => [
    n.id,
    Ee(le(n)),
    new Date(n.startedAt).toISOString(),
    Lt(n.exercise),
    n.side,
    n.mode,
    n.durationS.toFixed(1),
    n.peak,
    n.avg,
    n.output,
    n.inroad,
    fe(n),
    n.reps?.length ?? 0,
    Lt((n.reps ?? []).map((i) => i.peak).join(" "))
  ].join(","));
  return [e.join(","), ...t].join(`
`);
}
function Ms(s) {
  return ["t_s,kg", ...s.samples.map((e) => `${e.t.toFixed(2)},${e.kg.toFixed(2)}`)].join(`
`);
}
function Lt(s) {
  return `"${s.replace(/"/g, '""')}"`;
}
async function nt(s, e, t) {
  if (A.isNativePlatform()) {
    const o = await Ts.writeFile({ path: s, data: e, directory: st.Cache, encoding: Ie.UTF8 });
    await _s.share({ title: s, files: [o.uri] });
    return;
  }
  const n = new Blob([e], { type: t }), i = URL.createObjectURL(n), a = document.createElement("a");
  a.href = i, a.download = s, document.body.appendChild(a), a.click(), setTimeout(() => {
    URL.revokeObjectURL(i), a.remove();
  }, 500);
}
function Ee(s) {
  const e = new Date(s);
  return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
class Is {
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
function z() {
  return window.GymLog ?? null;
}
function Ut(s) {
  return {
    id: `fl-${s.id}`,
    date: Ee(le(s)),
    exercise: s.exercise,
    kg: s.peak,
    reps: fe(s),
    variation: $s(s.exercise),
    at: s.startedAt,
    dur: s.durationS,
    note: [s.side !== "both" ? s.side : "", s.mode, s.note].filter(Boolean).join(" · ")
  };
}
function Fs() {
  const s = z();
  if (s)
    for (const e of qt) s.addExercise(e);
}
let W = null;
function ce(s) {
  return s.replace(/[&<>"']/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[e]);
}
function Je(s, e) {
  s.classList.add("picker-hidden");
  const t = document.createElement("button");
  t.type = "button", t.className = "picker-btn", s.insertAdjacentElement("afterend", t);
  const n = () => {
    const i = s.value;
    t.textContent = i || (e.allOption?.label ?? "Choose…"), t.disabled = s.disabled;
  };
  return n(), new MutationObserver(n).observe(s, { attributes: !0, childList: !0 }), s.addEventListener("change", n), t.onclick = () => Bs(s, e, n), n;
}
function Bs(s, e, t) {
  me();
  const n = document.getElementById("view-force") ?? document.body;
  W = document.createElement("div"), W.className = "picker-overlay", W.innerHTML = `<div class="picker-panel">
    <div class="picker-head"><input type="text" class="picker-search" placeholder="Search exercises…" autocomplete="off" /><button type="button" class="sm ghost picker-close">✕</button></div>
    <div class="picker-list"></div>
  </div>`, n.appendChild(W);
  const i = W.querySelector(".picker-search"), a = W.querySelector(".picker-list"), o = (r) => {
    s.value = r, s.dispatchEvent(new Event("change", { bubbles: !0 })), t(), me();
  }, l = () => {
    const r = i.value.trim().toLowerCase(), u = e.recent().filter((p) => !r || p.toLowerCase().includes(r)), d = e.all().filter((p) => !u.includes(p) && (!r || p.toLowerCase().includes(r))).sort((p, v) => p.localeCompare(v));
    let h = "";
    e.allOption && (!r || e.allOption.label.toLowerCase().includes(r)) && (h += `<button type="button" class="picker-item" data-v="${ce(e.allOption.value)}">${ce(e.allOption.label)}</button>`), u.length && (h += '<div class="picker-group">Recent in Force Lab</div>' + u.map((p) => `<button type="button" class="picker-item" data-v="${ce(p)}">${ce(p)}</button>`).join("")), d.length && (h += `<div class="picker-group">${u.length ? "All exercises" : "Exercises"}</div>` + d.map((p) => `<button type="button" class="picker-item" data-v="${ce(p)}">${ce(p)}</button>`).join(""));
    const f = i.value.trim();
    f && e.onCreate && !e.all().some((p) => p.toLowerCase() === f.toLowerCase()) && (h += `<button type="button" class="picker-item picker-create" data-create="1">+ Create "${ce(f)}"</button>`), h || (h = '<div class="picker-group">No match</div>'), a.innerHTML = h, a.querySelectorAll(".picker-item").forEach((p) => {
      p.onclick = async () => {
        if (p.dataset.create) {
          const v = i.value.trim();
          await e.onCreate(v) && o(v);
          return;
        }
        o(p.dataset.v);
      };
    });
  };
  i.oninput = l, i.onkeydown = (r) => {
    r.key === "Escape" && me(), r.key === "Enter" && a.querySelector(".picker-item")?.click();
  }, W.querySelector(".picker-close").onclick = me, W.onclick = (r) => {
    r.target === W && me();
  }, l(), setTimeout(() => i.focus(), 50);
}
function me() {
  W?.remove(), W = null;
}
const c = (s) => document.getElementById(s);
let N = null, ee = null, Fe = 0, w = [], q = [], Be = null, re = 0, K = 0, de = null, Y = !0, Se = localStorage.getItem("ufl.ghostOn") !== "0", Ae = null;
const pe = (s, e) => localStorage.getItem(s) ?? e;
let _e = Math.max(1, Number(pe("ufl.calloutEvery", "5"))), it = pe("ufl.calloutOn", "1") === "1", at = pe("ufl.secBeep", "0") === "1", rt = pe("ufl.secCount", "0") === "1", Re = null, Ze = -1;
const k = new Cs(), j = new bs(), te = new Es(), X = new It(c("chart")), ve = c("progressChart"), qs = {
  countdown: [{ key: "total", label: "seconds", def: 60 }],
  ramp: [{ key: "ramp", label: "ramp s", def: 5 }, { key: "hold", label: "hold s", def: 10 }],
  repeaters: [{ key: "reps", label: "reps", def: 6 }, { key: "hold", label: "on s", def: 10 }, { key: "rest", label: "off s", def: 20 }]
};
async function Us(s, e) {
  const t = z();
  if (t) {
    if (!t.renameExercise(s, e)) return;
    w = t.exerciseNames();
  } else
    await Nt(s, e), w = await P.exercises();
  oe(), J(), Z(), await R();
}
async function Nt(s, e) {
  await P.renameExercise(s, e), q = await P.sets(), c("exercise").value === s && (oe(), c("exercise").value = e);
}
async function Ns() {
  Fs(), w = z()?.exerciseNames() ?? await P.exercises(), q = await P.sets(), oe(), Vt(), await R(), Z(), J(), Xs(), Zt(), k.enabled = c("voiceOn").checked;
}
function Qe() {
  const s = /* @__PURE__ */ new Map();
  for (const e of q) s.set(e.exercise, Math.max(s.get(e.exercise) ?? 0, e.startedAt));
  for (const e of Object.keys(jt)) {
    const t = e.split("|")[0];
    s.has(t) || s.set(t, 0);
  }
  return [...s.entries()].filter(([e]) => w.includes(e)).sort((e, t) => t[1] - e[1]).map(([e]) => e);
}
let jt = {};
async function Ct(s) {
  if (s = s.trim(), !s) return !1;
  if (!w.includes(s)) {
    const e = z();
    e ? (e.addExercise(s), w = e.exerciseNames()) : (w.push(s), await P.saveExercises(w));
  }
  return oe(), J(), !0;
}
function oe() {
  for (const t of ["exercise", "maxExercise"]) {
    const n = c(t), i = n.value;
    n.innerHTML = w.map((a) => `<option>${T(a)}</option>`).join(""), i && w.includes(i) && (n.value = i);
  }
  const s = c("histExercise"), e = s.value;
  s.innerHTML = '<option value="">All</option>' + w.map((t) => `<option>${T(t)}</option>`).join(""), s.value = e;
}
function Vt() {
  const s = c("protocol").value, e = c("params");
  e.innerHTML = (qs[s] ?? []).map((t) => `<label>${t.label}<input type="number" data-k="${t.key}" value="${t.def}" min="1" /></label>`).join(""), c("protocolHelp").textContent = Ne(s, ut()).describe;
}
function ut() {
  const s = {};
  return c("params").querySelectorAll("input").forEach((e) => s[e.dataset.k] = Number(e.value) || 1), s;
}
async function R() {
  const s = c("exercise").value, e = c("side").value, t = q.filter((i) => i.exercise === s && i.side === e);
  Be = t.length ? t[t.length - 1] : null, re = t.reduce((i, a) => Math.max(i, a.output), 0);
  const n = await P.maxes();
  jt = n, K = n[`${s}|${e}`]?.kg ?? 0, c("zoneMax").textContent = K ? `(max ${K} kg → ${Me().lo.toFixed(1)}–${Me().hi.toFixed(1)} kg)` : "(no max yet — run a Max test)", c("sGoal").textContent = re ? C(re) : "–", X.opts.ghost = Se ? Be?.samples ?? null : null, X.opts.zone = dt() ? Me() : null, j.recording || (X.opts.marks = []);
}
function dt() {
  return c("zoneOn").checked && K > 0;
}
function Me() {
  const s = Number(c("zoneLo").value) / 100 * K, e = Number(c("zoneHi").value) / 100 * K;
  return { lo: Math.min(s, e), hi: Math.max(s, e) };
}
async function ot(s) {
  N && await N.stop(), N = s, s.onStatus(qe), s.onSample((e) => {
    Fe = e.kg, G === "live" && (c("statusKg").textContent = `· ${e.kg.toFixed(1)} kg`), j.push(e), js(e.kg);
  });
  try {
    await s.start(), c("btnTare").disabled = !1, c("btnStart").disabled = !1;
  } catch (e) {
    qe("error"), c("statusText").textContent = e.message, alert("Connect failed: " + e.message);
  }
}
let G = "idle";
function Ht() {
  return localStorage.getItem("ufl.keepAwake") !== "0";
}
function Wt() {
  if (!A.isNativePlatform()) return;
  (Ht() && (G === "live" || G === "scanning" || G === "lost") ? Et.keepAwake() : Et.allowSleep()).catch(() => {
  });
}
function qe(s) {
  G = s, Wt(), c("statusDot").className = `dot ${s}`, c("statusPill").className = `pill ${s}`;
  const e = {
    idle: "Not connected",
    scanning: "Listening for scale… turn it on / pull the hook",
    live: `${N?.name ?? "Scale"} connected ✓`,
    lost: "Signal lost — reconnecting…",
    error: "Error"
  };
  c("statusText").textContent = e[s], s !== "live" && (c("statusKg").textContent = "");
  const t = c("btnConnect");
  t.textContent = s === "live" || s === "scanning" ? "Disconnect" : "Connect scale";
}
function zt() {
  return localStorage.getItem("ufl.autoConnect") !== "0";
}
let Ue = !1, ct = !1, et = !1;
function lt() {
  if (!zt() || !A.isNativePlatform() || N instanceof xe || ee || ct || Ue && G === "error") return;
  Ue = !0;
  const s = new xe();
  s.onSeen = () => es(s), c("simPanel").classList.add("hidden"), ot(s);
}
let Pt = 0;
function js(s) {
  if (!j.recording || !dt()) {
    de = null;
    return;
  }
  const e = te.running ? te.current() : null;
  if (e && e.cue === "rest") {
    de = null;
    return;
  }
  const t = Me(), n = s >= t.lo && s <= t.hi, i = c("phaseBanner");
  n && de !== "in" && (de = "in", i.classList.add("inzone"), i.classList.remove("outzone"), k.say("in zone")), !n && de !== "out" && (de = "out", i.classList.add("outzone"), i.classList.remove("inzone"), s > 2 && k.say(s < t.lo ? "more" : "ease off"), Y && s > 2 && Date.now() - Pt > 1500 && (se.outZone(), Pt = Date.now()));
}
function Vs() {
  const s = c("protocol").value, e = Ne(s, ut());
  c("summary").classList.add("hidden"), j.start(), k.unlock(), zs(), X.opts.marks = [];
  const t = e.phases.length ? Ft(e).reduce((n, i) => n + i.seconds, 0) : 60;
  X.opts.windowS = Math.max(10, Math.ceil(t / 10) * 10), c("btnStart").classList.add("hidden"), c("btnStop").classList.remove("hidden"), Yt(!0), e.phases.length ? (te.onPhase = Hs, te.onTick = Ws, te.onDone = () => Kt(), te.start(e)) : (ht("work", "Free set — go", ""), k.say("Go", !0), Y && se.go());
}
function Hs(s, e, t) {
  ht(s.cue, s.name, s.seconds.toFixed(0)), s.cue === "work" ? (Y && se.go(), k.say(s.name.replace(/\d+\/\d+/, ""), !0), X.opts.marks.push(j.elapsed())) : s.cue === "ramp" ? (Y && se.go(), k.say("Build up", !0)) : (e > 0 && Y && se.rest(), e > 0 && k.say(e === t - 1 ? "Done" : "Rest", !0));
}
let $t = -1;
function Ws(s, e) {
  c("phaseTime").textContent = s.toFixed(s < 10 ? 1 : 0);
  const t = Math.ceil(s);
  t !== $t && ($t = t, t <= 3 && t > 0 && Y && se.tick());
}
async function Kt() {
  te.stop(), Gt();
  const s = c("exercise").value, e = c("side").value, t = c("protocol").value, n = j.finish({ exercise: s, side: e, mode: t });
  c("btnStop").classList.add("hidden"), c("btnStart").classList.remove("hidden"), Yt(!1), ht("idle", "Done", "—"), Y && se.done(), n && (t === "maxtest" && n.peak > 0 && (await P.setMax(s, e, n.peak), k.say(`New max ${n.peak.toFixed(0)} kilos`, !0)), await P.saveSet(n), q.push(n), z()?.upsertForceSet(Ut(n)), await Ks(n), await R(), Z(), J());
}
function zs() {
  Gt(), Ze = -1, Re = setInterval(() => {
    if (!j.recording) return;
    const s = Math.floor(j.elapsed());
    if (s === Ze || s === 0) return;
    Ze = s;
    const e = te.running ? te.current() : null;
    if (e && e.cue !== "work") return;
    const t = it && !dt() && s % _e === 0;
    (at && Y || t && Y) && se.tick();
    const n = [];
    rt && n.push(Ps(s)), t && n.push(Fe.toFixed(0)), n.length && (!t && k.speaking() || k.say(n.join(", "), t, !0));
  }, 100);
}
function Gt() {
  Re && clearInterval(Re), Re = null;
}
function Yt(s) {
  for (const e of ["exercise", "side", "protocol"]) c(e).disabled = s;
}
function ht(s, e, t) {
  const n = c("phaseBanner");
  n.className = `banner ${s}`, c("phaseName").textContent = e, c("phaseTime").textContent = t;
}
async function Ks(s) {
  const e = Be, t = await P.maxes(), n = s.side === "left" ? "right" : s.side === "right" ? "left" : null, i = [];
  i.push(O("Duration", `${s.durationS.toFixed(1)} s`)), i.push(O("Peak force", `${C(s.peak)} kg`, ke(s.peak, e?.peak))), i.push(O("Intensity (avg)", `${C(s.avg)} kg`, ke(s.avg, e?.avg))), i.push(O("Output (kg·s)", C(s.output), ke(s.output, e?.output))), i.push(O("Inroad", `${s.inroad.toFixed(0)}%`, s.inroad >= 30 ? '<span class="badge good">deep fatigue</span>' : s.inroad >= 15 ? '<span class="badge">moderate</span>' : '<span class="badge warn">shallow — stopped early?</span>')), re && i.push(O("vs. best output", `${(s.output / re * 100).toFixed(0)}%`, s.output > re ? '<span class="badge good">new best</span>' : "")), K && i.push(O("Peak as % of max", `${(s.peak / K * 100).toFixed(0)}%`));
  let a = "";
  if (s.reps && s.reps.length) {
    const r = Math.max(...s.reps.map((d) => d.peak));
    a = `<div class="muted" style="margin-top:8px">Reps: ${s.reps.length} · first ${C(s.reps[0].peak)} → last ${C(s.reps[s.reps.length - 1].peak)} kg · avg rep ${(s.reps.reduce((d, h) => d + h.durationS, 0) / s.reps.length).toFixed(1)} s</div>
      <div class="repbars">${s.reps.map((d) => `<div style="height:${Math.max(4, d.peak / r * 100)}%"><span>${d.peak.toFixed(0)}</span></div>`).join("")}</div>`;
    const u = s.mode === "critical" ? xs(s.reps) : null;
    u && (a += O("Critical force", `${C(u)} kg${K ? ` (${(u / K * 100).toFixed(0)}% of max)` : ""}`));
  }
  let o = "";
  if (n) {
    const r = t[`${s.exercise}|${s.side}`]?.kg, u = t[`${s.exercise}|${n}`]?.kg;
    if (r && u) {
      const d = (Math.abs(r - u) / Math.max(r, u) * 100).toFixed(0);
      o = O("Left/right gap", `${d}% (L ${C(s.side === "left" ? r : u)} / R ${C(s.side === "left" ? u : r)})`, Number(d) > 10 ? '<span class="badge warn">asymmetry</span>' : '<span class="badge good">balanced</span>');
    }
  }
  const l = c("summary");
  l.innerHTML = `<h4>${T(s.exercise)} · ${s.side} · ${s.mode}</h4>${i.join("")}${o}${a}
    ${Xt(s, "sum")}`, l.classList.remove("hidden"), Jt(s, "sum", async () => {
    await R(), Z();
  });
}
function Xt(s, e) {
  const t = Ee(le(s));
  return `<div class="editor">
      <label>Reps <input type="number" id="${e}Reps" min="1" step="1" inputmode="numeric" placeholder="1" value="${s.manualReps ?? ""}" /></label>
      <label>Date performed <input type="date" id="${e}Date" value="${t}" max="${Ee(Date.now())}" /></label>
      <label class="grow">Note <input type="text" id="${e}Note" placeholder="optional" value="${T(s.note ?? "")}" /></label>
      <button class="sm primary" id="${e}Save" type="button">Save</button>
      <span class="muted" id="${e}Msg">${s.reps?.length ? `auto-detected ${s.reps.length} — for info only` : "blank reps = 1"}</span>
    </div>`;
}
function Jt(s, e, t) {
  const n = async () => {
    const i = Number(c(`${e}Reps`).value);
    s.manualReps = i > 0 ? Math.round(i) : void 0;
    const a = c(`${e}Date`).value;
    if (a) {
      const [l, r, u] = a.split("-").map(Number), d = new Date(s.startedAt);
      s.performedAt = new Date(l, r - 1, u, d.getHours(), d.getMinutes(), d.getSeconds()).getTime();
    }
    s.note = c(`${e}Note`).value.trim() || void 0, await P.updateSet(s), z()?.upsertForceSet(Ut(s));
    const o = q.findIndex((l) => l.id === s.id);
    o >= 0 && (q[o] = s), c(`${e}Msg`).textContent = `saved · ${fe(s)} rep${fe(s) === 1 ? "" : "s"} · ${Ee(le(s))}`, await t();
  };
  c(`${e}Save`).onclick = n;
  for (const i of [`${e}Reps`, `${e}Date`, `${e}Note`]) c(i).onkeydown = (a) => {
    a.key === "Enter" && n();
  };
}
function O(s, e, t = "") {
  return `<div class="fl-line"><span>${s}</span><span>${e} ${t}</span></div>`;
}
function ke(s, e) {
  if (!e) return "";
  const t = (s - e) / e * 100;
  return `<span class="${t >= 0 ? "fl-d up" : "fl-d down"}">${t >= 0 ? "+" : ""}${t.toFixed(1)}%</span>`;
}
function Zt() {
  const s = j.current(), e = j.elapsed();
  if (c("liveKg").textContent = Fe.toFixed(1), c("elapsed").textContent = ts(e), X.draw(s, e, Fe), j.recording && s.length > 2) {
    const t = Rt(s);
    c("sPeak").textContent = C(t.peak), c("sAvg").textContent = C(t.avg), c("sOut").textContent = C(t.output), c("sInroad").textContent = `${t.inroad.toFixed(0)}%`;
    const n = Be;
    c("dPeak").innerHTML = ke(t.peak, n?.peak), c("dAvg").innerHTML = ke(t.avg, n?.avg), c("dOut").innerHTML = re ? `<span class="muted">${(t.output / re * 100).toFixed(0)}% of goal</span>` : "";
    const i = Mt(s);
    c("sReps").textContent = i.length ? String(i.length) : "–", c("dReps").textContent = i.length ? `last ${i[i.length - 1].peak.toFixed(0)} kg` : "";
  }
  requestAnimationFrame(Zt);
}
let we = null;
function Z() {
  const s = c("histExercise").value, e = q.filter((t) => !s || t.exercise === s).slice().sort((t, n) => le(n) - le(t) || n.startedAt - t.startedAt);
  c("histBody").innerHTML = e.map((t) => `<tr data-id="${t.id}" class="${we?.id === t.id ? "sel" : ""}">
      <td>${new Date(le(t)).toLocaleDateString(void 0, { month: "short", day: "numeric" })}</td>
      <td>${T(t.exercise)}${t.side !== "both" ? ` <small class="muted">${t.side[0].toUpperCase()}</small>` : ""}</td>
      <td>${t.mode}</td><td>${fe(t)}</td><td>${ts(t.durationS)}</td><td>${C(t.peak)}</td><td>${C(t.avg)}</td><td>${C(t.output)}</td><td>${t.inroad.toFixed(0)}%</td>
      <td><button data-del="${t.id}">✕</button></td></tr>`).join("") || '<tr><td colspan="10" class="muted">No sets yet.</td></tr>', c("histBody").querySelectorAll("tr[data-id]").forEach((t) => {
    t.onclick = (n) => {
      n.target.dataset.del || (we = q.find((i) => i.id === t.dataset.id) ?? null, Z(), Gs());
    };
  }), c("histBody").querySelectorAll("button[data-del]").forEach((t) => {
    t.onclick = async () => {
      confirm("Delete this set?") && (await P.deleteSet(t.dataset.del), z()?.removeForceSet(`fl-${t.dataset.del}`), q = q.filter((n) => n.id !== t.dataset.del), we?.id === t.dataset.del && (we = null), Z(), await R());
    };
  }), Ys(s ? e.slice().reverse() : []);
}
function Gs() {
  const s = we, e = c("histDetail");
  if (!s) {
    e.classList.add("hidden");
    return;
  }
  e.classList.remove("hidden"), e.innerHTML = `<h4>${T(s.exercise)} · ${new Date(s.startedAt).toLocaleString()}</h4>
    <div class="chartwrap small"><canvas id="histCanvas"></canvas></div>
    ${O("Peak", `${C(s.peak)} kg`)}${O("Intensity", `${C(s.avg)} kg`)}${O("Output", C(s.output))}${O("Inroad", `${s.inroad.toFixed(0)}%`)}
    ${O("Reps (logged)", String(fe(s)))}
    ${s.reps?.length ? O("Auto-detected", `${s.reps.length} (${s.reps.map((n) => n.peak.toFixed(0)).join(", ")} kg)`) : ""}
    ${Xt(s, "hist")}
    <div class="actions-inline" style="margin-top:8px"><button class="sm" id="btnUseGhost">Use as ghost trace</button><button class="sm ghost" id="btnSetCsv">Export samples CSV</button></div>`, Jt(s, "hist", async () => {
    Z(), await R();
  });
  const t = new It(c("histCanvas"));
  t.opts.windowS = Math.max(10, Math.ceil(s.durationS / 10) * 10), t.opts.marks = s.reps?.map((n) => n.startS) ?? [], t.draw(s.samples, s.durationS, 0), c("btnUseGhost").onclick = () => {
    Se = !0, localStorage.setItem("ufl.ghostOn", "1"), c("ghostOn").checked = !0, X.opts.ghost = s.samples, Qt("train");
  }, c("btnSetCsv").onclick = () => nt(`set-${s.id}.csv`, Ms(s), "text/csv");
}
function Ys(s) {
  const e = c("progress");
  if (s.length < 2) {
    e.classList.add("hidden");
    return;
  }
  e.classList.remove("hidden");
  const t = Math.max(1, window.devicePixelRatio || 1), n = e.clientWidth - 12, i = 160;
  ve.width = n * t, ve.height = i * t, ve.style.width = `${n}px`, ve.style.height = `${i}px`;
  const a = ve.getContext("2d");
  a.setTransform(t, 0, 0, t, 0, 0), a.clearRect(0, 0, n, i);
  const o = getComputedStyle(document.getElementById("view-force") ?? document.documentElement), l = 36, r = 8, u = 10, d = 18, h = n - l - r, f = i - u - d, p = Math.max(10, ...s.map((x) => x.peak)) * 1.1, v = (x) => l + x / Math.max(1, s.length - 1) * h, y = (x) => u + f - x / p * f;
  a.strokeStyle = o.getPropertyValue("--grid"), a.fillStyle = o.getPropertyValue("--muted"), a.font = "10px system-ui", a.textAlign = "right";
  for (let x = 0; x <= 4; x++) {
    const V = p / 4 * x;
    a.beginPath(), a.moveTo(l, y(V)), a.lineTo(n - r, y(V)), a.stroke(), a.fillText(V.toFixed(0), l - 4, y(V) + 3);
  }
  const b = [["peak", o.getPropertyValue("--accent")], ["avg", o.getPropertyValue("--accent2")]];
  for (const [x, V] of b)
    a.strokeStyle = V, a.lineWidth = 2, a.beginPath(), s.forEach((M, U) => U ? a.lineTo(v(U), y(M[x])) : a.moveTo(v(U), y(M[x]))), a.stroke(), a.fillStyle = V, s.forEach((M, U) => {
      a.beginPath(), a.arc(v(U), y(M[x]), 3, 0, Math.PI * 2), a.fill();
    });
  a.fillStyle = o.getPropertyValue("--muted"), a.textAlign = "left", a.fillText("peak", l + 4, u + 10), a.fillStyle = o.getPropertyValue("--accent2"), a.fillText("intensity", l + 36, u + 10);
}
async function J() {
  const s = await P.maxes(), e = Object.entries(s).map(([t, n]) => {
    const [i, a] = t.split("|");
    return `<tr><td>${T(i)}</td><td>${a}</td><td>${C(n.kg)}</td><td>${new Date(n.at).toLocaleDateString()}</td><td><button data-mdel="${T(t)}">✕</button></td></tr>`;
  });
  c("maxBody").innerHTML = e.join("") || '<tr><td colspan="5" class="muted">No maxes yet.</td></tr>', c("maxBody").querySelectorAll("button[data-mdel]").forEach((t) => t.onclick = async () => {
    await P.deleteMax(t.dataset.mdel), J(), R();
  }), c("exList").innerHTML = w.map((t) => `<span>${T(t)}<button data-xren="${T(t)}" title="Rename">✎</button><button data-xdel="${T(t)}">✕</button></span>`).join(""), c("exList").querySelectorAll("button[data-xren]").forEach((t) => t.onclick = async () => {
    const n = t.dataset.xren, i = prompt(`Rename "${n}" to:`, n);
    !i || i.trim() === n || await Us(n, i.trim());
  }), c("exList").querySelectorAll("button[data-xdel]").forEach((t) => t.onclick = async () => {
    const n = z();
    if (n) {
      if (!n.removeExercise(t.dataset.xdel)) {
        alert("Built-in Gym Log exercises can't be removed here.");
        return;
      }
      w = n.exerciseNames();
    } else
      w = w.filter((i) => i !== t.dataset.xdel), await P.saveExercises(w);
    oe(), J();
  });
}
function Qt(s) {
  document.querySelectorAll(".fl-tabs button").forEach((e) => e.classList.toggle("active", e.dataset.tab === s)), document.querySelectorAll(".fl-tab").forEach((e) => e.classList.toggle("active", e.id === `tab-${s}`)), s === "train" && X.resize(), s === "history" && Z();
}
function Xs() {
  document.querySelectorAll(".fl-tabs button").forEach((r) => r.onclick = () => Qt(r.dataset.tab)), c("btnConnect").onclick = async () => {
    if (N instanceof xe && (G === "live" || G === "scanning")) {
      await N.stop(), N = null, qe("idle"), ct = !0;
      return;
    }
    ct = !1, c("simPanel").classList.add("hidden"), ee = null;
    const r = new xe();
    r.onSeen = () => es(r), ot(r);
  }, c("btnSim").onclick = () => {
    ee = new ys(), ee.exact = c("simExact").checked, c("simPanel").classList.remove("hidden"), ot(ee);
  }, c("simExact").onchange = (r) => {
    const u = r.target.checked;
    ee && (ee.exact = u), c("simHelp").textContent = u ? "Reading tracks the slider exactly." : 'Slide up to "push", back to 0 to rest. Fatigue is simulated.';
  }, c("btnTare").onclick = () => N?.tare(), c("btnStart").onclick = Vs, c("camOn").checked = localStorage.getItem("ufl.camOn") === "1";
  const s = async () => {
    const r = c("camOn").checked;
    if (localStorage.setItem("ufl.camOn", r ? "1" : "0"), r) {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert("Camera not available here."), c("camOn").checked = !1;
        return;
      }
      Ae ?? (Ae = new Is(c("camVideo")));
      try {
        await Ae.start(), c("camPip").classList.remove("hidden"), c("btnCamFlip").classList.remove("hidden");
      } catch (u) {
        alert("Camera failed: " + u.message + `
Allow the Camera permission for UY Force Lab in Android settings.`), c("camOn").checked = !1;
      }
    } else
      Ae?.stop(), c("camPip").classList.add("hidden"), c("btnCamFlip").classList.add("hidden");
  };
  c("camOn").onchange = s, c("camOn").checked && s(), c("btnCamFlip").onclick = () => Ae?.flip();
  const e = c("camPip"), t = localStorage.getItem("ufl.pipPos");
  if (t) {
    const [r, u] = t.split(",").map(Number);
    e.style.left = `${r}px`, e.style.top = `${u}px`;
  }
  let n = null;
  e.onpointerdown = (r) => {
    const u = e.getBoundingClientRect();
    n = { x: r.clientX, y: r.clientY, l: u.left, t: u.top, moved: !1 }, e.setPointerCapture(r.pointerId);
  }, e.onpointermove = (r) => {
    if (!n) return;
    const u = r.clientX - n.x, d = r.clientY - n.y;
    if (Math.abs(u) + Math.abs(d) > 6 && (n.moved = !0), !n.moved) return;
    const h = e.getBoundingClientRect(), f = Math.min(window.innerWidth - h.width, Math.max(0, n.l + u)), p = Math.min(window.innerHeight - h.height, Math.max(0, n.t + d));
    e.style.left = `${f}px`, e.style.top = `${p}px`;
  }, e.onpointerup = () => {
    if (n) {
      if (n.moved) {
        const r = e.getBoundingClientRect();
        localStorage.setItem("ufl.pipPos", `${Math.round(r.left)},${Math.round(r.top)}`);
      } else e.classList.toggle("large");
      n = null;
    }
  }, c("btnStop").onclick = Kt, c("simEffort").oninput = (r) => {
    const u = Number(r.target.value);
    ee && (ee.effort = u), c("simVal").textContent = String(u);
  }, c("exercise").onchange = R, Je(c("exercise"), { recent: Qe, all: () => w, onCreate: Ct }), Je(c("maxExercise"), { recent: Qe, all: () => w, onCreate: Ct }), Je(c("histExercise"), { recent: Qe, all: () => w, allOption: { value: "", label: "All exercises" } }), c("btnNewEx").onclick = () => {
    c("newExBox").classList.remove("hidden"), c("newExName").focus();
  }, c("btnNewExCancel").onclick = () => {
    c("newExBox").classList.add("hidden"), c("newExName").value = "";
  };
  const i = async () => {
    const r = c("newExName").value.trim();
    if (r) {
      if (!w.includes(r)) {
        const u = z();
        u ? (u.addExercise(r), w = u.exerciseNames()) : (w.push(r), await P.saveExercises(w));
      }
      oe(), c("exercise").value = r, c("newExBox").classList.add("hidden"), c("newExName").value = "", J(), await R();
    }
  };
  c("btnNewExSave").onclick = i, c("newExName").onkeydown = (r) => {
    r.key === "Enter" && i();
  }, c("side").onchange = R, c("protocol").onchange = () => Vt(), c("params").oninput = () => c("protocolHelp").textContent = Ne(c("protocol").value, ut()).describe;
  for (const r of ["zoneOn", "zoneLo", "zoneHi"]) c(r).oninput = R;
  c("ghostOn").checked = Se, c("ghostOn").onchange = (r) => {
    Se = r.target.checked, localStorage.setItem("ufl.ghostOn", Se ? "1" : "0"), R();
  }, c("histExercise").onchange = Z, c("btnCsv").onclick = () => nt(`uy-force-lab-${Ot()}.csv`, Rs(q), "text/csv"), c("btnJson").onclick = () => nt(`uy-force-lab-${Ot()}.json`, JSON.stringify(q, null, 1), "application/json"), c("voiceOn").onchange = (r) => k.enabled = r.target.checked, c("keepAwake").checked = Ht(), c("keepAwake").onchange = (r) => {
    localStorage.setItem("ufl.keepAwake", r.target.checked ? "1" : "0"), Wt();
  }, c("autoConnect").checked = zt(), c("autoConnect").onchange = (r) => {
    localStorage.setItem("ufl.autoConnect", r.target.checked ? "1" : "0"), Ue = !1, lt();
  }, document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "hidden") {
      N instanceof xe && !j.recording && (await N.stop(), N = null, qe("idle"), et = !0);
      return;
    }
    (et || G === "idle" || G === "error") && (et = !1, Ue = !1, lt());
  }), k.rate = Number(pe("ufl.voiceRate", "1.2")) || 1.2, k.pitch = Number(pe("ufl.voicePitch", "1")) || 1;
  const a = (r, u, d, h) => {
    const f = c(r);
    f.value = String(h), c(r + "Val").textContent = h.toFixed(1) + "×", f.oninput = () => {
      const p = Number(f.value);
      d(p), localStorage.setItem(u, String(p)), c(r + "Val").textContent = p.toFixed(1) + "×";
    };
  };
  a("voiceRate", "ufl.voiceRate", (r) => k.rate = r, k.rate), a("voicePitch", "ufl.voicePitch", (r) => k.pitch = r, k.pitch), c("beepOn").onchange = (r) => Y = r.target.checked, c("calloutEvery").value = String(_e), c("calloutEvery").onchange = (r) => {
    _e = Math.max(1, Number(r.target.value) || 1), localStorage.setItem("ufl.calloutEvery", String(_e));
  };
  const o = (r, u, d, h) => {
    const f = c(r);
    f.checked = h, f.onchange = () => {
      d(f.checked), localStorage.setItem(u, f.checked ? "1" : "0");
    };
  };
  o("calloutOn", "ufl.calloutOn", (r) => it = r, it), o("secBeep", "ufl.secBeep", (r) => at = r, at), o("secCount", "ufl.secCount", (r) => rt = r, rt);
  let l = null;
  k.onSpeak = (r) => {
    const u = c("said");
    u.textContent = `🔊 ${r}`, u.classList.add("on"), l && clearTimeout(l), l = setTimeout(() => u.classList.remove("on"), 900);
  }, document.addEventListener("pointerdown", () => k.unlock(), { once: !0 }), document.addEventListener("visibilitychange", () => {
    document.visibilityState === "visible" && k.reset();
  }), c("btnTestVoice").onclick = async () => {
    k.reset();
    const r = c("voiceStatus");
    r.textContent = await k.status(), k.say("Force lab voice check, 1, 2, 3", !0);
  }, c("btnSetMax").onclick = async () => {
    const r = Number(c("maxKg").value);
    r && (await P.setMax(c("maxExercise").value, c("maxSide").value, r), c("maxKg").value = "", J(), R());
  }, c("btnAddEx").onclick = async () => {
    const r = c("newEx").value.trim();
    if (!(!r || w.includes(r))) {
      {
        const u = z();
        u ? (u.addExercise(r), w = u.exerciseNames()) : (w.push(r), await P.saveExercises(w));
      }
      c("newEx").value = "", oe(), J();
    }
  };
}
let Dt = 0;
function es(s) {
  const e = Date.now();
  if (e - Dt < 1e3 || c("tab-settings").classList.contains("active") === !1) return;
  Dt = e;
  const t = [...s.seen.values()].sort((n, i) => i.t - n.t).slice(0, 12);
  c("seenBody").innerHTML = t.map((n) => `<tr><td>${T(n.name || "(no name)")}<br><small class="muted">${T(n.id)}</small></td><td>${n.rssi}</td><td>${T(n.keys || "–")}</td><td style="white-space:normal;font-family:monospace;font-size:11px">${T(n.hex || "–")}</td><td>${n.kg === null ? "–" : n.kg.toFixed(2)}</td></tr>`).join("") || '<tr><td colspan="5" class="muted">Listening… nothing heard yet.</td></tr>';
}
function C(s) {
  return s >= 100 ? s.toFixed(0) : s.toFixed(1);
}
function ts(s) {
  const e = Math.floor(s / 60), t = Math.floor(s % 60);
  return `${e}:${t.toString().padStart(2, "0")}`;
}
function Ot() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function T(s) {
  return s.replace(/[&<>"]/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[e]);
}
Ns();
window.ForceLab = {
  onShow() {
    X.resize(), lt();
  },
  // called by the host after it renamed an exercise in its own data
  renameExercise(s, e) {
    Nt(s, e).then(async () => {
      w = z()?.exerciseNames() ?? w, oe(), J(), Z(), await R();
    });
  }
};
async function Js(s, e, t) {
  let n;
  return Promise.race([
    s,
    new Promise((i, a) => {
      n = setTimeout(() => a(t), e);
    })
  ]).finally(() => clearTimeout(n));
}
class Zs extends ie {
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
      const l = this.getBleDevice(e.device), r = {
        device: l,
        localName: l.name,
        rssi: e.rssi,
        txPower: e.txPower,
        manufacturerData: yt(e.manufacturerData),
        serviceData: yt(e.serviceData),
        uuids: (i = e.uuids) === null || i === void 0 ? void 0 : i.map(ps)
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
      const o = (t = e.timeout) !== null && t !== void 0 ? t : this.DEFAULT_CONNECTION_TIMEOUT;
      await Js(i.gatt.connect(), o, a);
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
      const l = await o.getCharacteristics(), r = [];
      for (const u of l)
        r.push({
          uuid: u.uuid,
          properties: this.getProperties(u),
          descriptors: await this.getDescriptors(u)
        });
      a.push({ uuid: o.uuid, characteristics: r });
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
    typeof e.value == "string" ? n = ye(e.value) : n = e.value, await t?.writeValueWithResponse(He(n));
  }
  async writeWithoutResponse(e) {
    const t = await this.getCharacteristic(e);
    let n;
    typeof e.value == "string" ? n = ye(e.value) : n = e.value, await t?.writeValueWithoutResponse(He(n));
  }
  async readDescriptor(e) {
    const t = await this.getDescriptor(e);
    return { value: await t?.readValue() };
  }
  async writeDescriptor(e) {
    const t = await this.getDescriptor(e);
    let n;
    typeof e.value == "string" ? n = ye(e.value) : n = e.value, await t?.writeValue(He(n));
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
      const o = new Uint8Array(a.buffer), l = i.dataPrefix;
      if (!(o.length < l.byteLength))
        if (i.mask) {
          const r = i.mask;
          let u = !0;
          for (let d = 0; d < l.byteLength; d++)
            if ((o[d] & r.getUint8(d)) !== (l.getUint8(d) & r.getUint8(d))) {
              u = !1;
              break;
            }
          if (u)
            return !0;
        } else {
          let r = !0;
          for (let u = 0; u < l.byteLength; u++)
            if (o[u] !== l.getUint8(u)) {
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
const Qs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BluetoothLeWeb: Zs
}, Symbol.toStringTag, { value: "Module" }));
class en extends ie {
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
    const t = this.getSpeechSynthesisVoices(), n = new SpeechSynthesisUtterance(), { text: i, lang: a, rate: o, pitch: l, volume: r, voice: u } = e;
    return u !== void 0 && (n.voice = t[u]), r !== void 0 && (n.volume = r >= 0 && r <= 1 ? r : 1), o !== void 0 && (n.rate = o >= 0.1 && o <= 10 ? o : 1), l !== void 0 && (n.pitch = l >= 0 && l <= 2 ? l : 2), a && (n.lang = a), n.text = i, n;
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
const tn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  TextToSpeechWeb: en
}, Symbol.toStringTag, { value: "Module" }));
class sn extends ie {
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
const nn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  KeepAwakeWeb: sn
}, Symbol.toStringTag, { value: "Module" }));
class an extends ie {
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
      const l = o.substring(i.length), r = (e = this.impl.getItem(o)) !== null && e !== void 0 ? e : "", { value: u } = await this.get({ key: l });
      typeof u == "string" ? n.push(l) : (await this.set({ key: l, value: r }), t.push(l));
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
const rn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PreferencesWeb: an
}, Symbol.toStringTag, { value: "Module" }));
function At(s) {
  const e = s.split("/").filter((n) => n !== "."), t = [];
  return e.forEach((n) => {
    n === ".." && t.length > 0 && t[t.length - 1] !== ".." ? t.pop() : t.push(n);
  }), t.join("/");
}
function on(s, e) {
  s = At(s), e = At(e);
  const t = s.split("/"), n = e.split("/");
  return s !== e && t.every((i, a) => i === n[a]);
}
class je extends ie {
  constructor() {
    super(...arguments), this.DB_VERSION = 1, this.DB_NAME = "Disc", this._writeCmds = ["add", "put", "delete"], this.downloadFile = async (e) => {
      var t, n;
      const i = Tt(e, e.webFetchExtra), a = await fetch(e.url, i);
      let o;
      if (!e.progress)
        o = await a.blob();
      else if (!a?.body)
        o = new Blob();
      else {
        const r = a.body.getReader();
        let u = 0;
        const d = [], h = a.headers.get("content-type"), f = parseInt(a.headers.get("content-length") || "0", 10);
        for (; ; ) {
          const { done: y, value: b } = await r.read();
          if (y)
            break;
          d.push(b), u += b?.length || 0;
          const x = {
            url: e.url,
            bytes: u,
            contentLength: f
          };
          this.notifyListeners("progress", x);
        }
        const p = new Uint8Array(u);
        let v = 0;
        for (const y of d)
          typeof y > "u" || (p.set(y, v), v += y.length);
        o = new Blob([p.buffer], { type: h || void 0 });
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
      n.onupgradeneeded = je.doUpgrade, n.onsuccess = () => {
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
    return this.initDb().then((a) => new Promise((o, l) => {
      const h = a.transaction(["FileStorage"], i).objectStore("FileStorage").index(e)[t](...n);
      h.onsuccess = () => o(h.result), h.onerror = () => l(h.error);
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
    const l = t.substr(0, t.lastIndexOf("/"));
    if (await this.dbRequest("get", [l]) === void 0) {
      const h = l.indexOf("/", 1);
      if (h !== -1) {
        const f = l.substr(h);
        await this.mkdir({
          path: f,
          directory: e.directory,
          recursive: a
        });
      }
    }
    if (!i && !(n instanceof Blob) && (n = n.indexOf(",") >= 0 ? n.split(",")[1] : n, !this.isBase64String(n)))
      throw Error("The supplied data is not valid base64 content.");
    const u = Date.now(), d = {
      path: t,
      folder: l,
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
    let l = o;
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
      r.content !== void 0 && !i ? n = btoa(atob(r.content) + atob(n)) : n = r.content + n, l = r.ctime;
    }
    const d = {
      path: t,
      folder: a,
      type: "file",
      size: n.length,
      ctime: l,
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
    const t = this.getPath(e.directory, e.path), n = e.recursive, i = t.substr(0, t.lastIndexOf("/")), a = (t.match(/\//g) || []).length, o = await this.dbRequest("get", [i]), l = await this.dbRequest("get", [t]);
    if (a === 1)
      throw Error("Cannot create Root directory");
    if (l !== void 0)
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
    const r = Date.now(), u = {
      path: t,
      folder: i,
      type: "directory",
      size: 0,
      ctime: r,
      mtime: r
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
    const l = await this.readdir({ path: t, directory: n });
    if (l.files.length !== 0 && !i)
      throw Error("Folder is not empty");
    for (const r of l.files) {
      const u = `${t}/${r.name}`;
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
    const l = this.getPath(o, a), r = this.getPath(n, i);
    if (l === r)
      return {
        uri: r
      };
    if (on(l, r))
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
      const y = v.join("/");
      if (v.length > 0 && (await this.stat({
        path: y,
        directory: n
      })).type !== "directory")
        throw new Error("Parent directory of the to path is a file");
    }
    if (u && u.type === "directory")
      throw new Error("Cannot overwrite a directory with a file");
    const d = await this.stat({
      path: a,
      directory: o
    }), h = async (p, v, y) => {
      const b = this.getPath(n, p), x = await this.dbRequest("get", [b]);
      x.ctime = v, x.mtime = y, await this.dbRequest("put", [x]);
    }, f = d.ctime ? d.ctime : Date.now();
    switch (d.type) {
      case "file": {
        const p = await this.readFile({
          path: a,
          directory: o
        });
        t && await this.deleteFile({
          path: a,
          directory: o
        });
        let v;
        !(p.data instanceof Blob) && !this.isBase64String(p.data) && (v = Ie.UTF8);
        const y = await this.writeFile({
          path: i,
          directory: n,
          data: p.data,
          encoding: v
        });
        return t && await h(i, f, d.mtime), y;
      }
      case "directory": {
        if (u)
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
          directory: o
        })).files;
        for (const v of p)
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
je._debug = !0;
const cn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  FilesystemWeb: je
}, Symbol.toStringTag, { value: "Module" }));
class ln extends ie {
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
const un = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ShareWeb: ln
}, Symbol.toStringTag, { value: "Module" }));
