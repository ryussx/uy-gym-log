var vt;
(function(t) {
  t[t.SCAN_MODE_LOW_POWER = 0] = "SCAN_MODE_LOW_POWER", t[t.SCAN_MODE_BALANCED = 1] = "SCAN_MODE_BALANCED", t[t.SCAN_MODE_LOW_LATENCY = 2] = "SCAN_MODE_LOW_LATENCY";
})(vt || (vt = {}));
var _t;
(function(t) {
  t[t.PHY_LE_1M = 1] = "PHY_LE_1M", t[t.PHY_LE_2M = 2] = "PHY_LE_2M", t[t.PHY_LE_CODED = 3] = "PHY_LE_CODED", t[t.PHY_LE_ALL_SUPPORTED = 255] = "PHY_LE_ALL_SUPPORTED";
})(_t || (_t = {}));
var It;
(function(t) {
  t[t.CONNECTION_PRIORITY_BALANCED = 0] = "CONNECTION_PRIORITY_BALANCED", t[t.CONNECTION_PRIORITY_HIGH = 1] = "CONNECTION_PRIORITY_HIGH", t[t.CONNECTION_PRIORITY_LOW_POWER = 2] = "CONNECTION_PRIORITY_LOW_POWER";
})(It || (It = {}));
/*! Capacitor: https://capacitorjs.com/ - MIT License */
var xe;
(function(t) {
  t.Unimplemented = "UNIMPLEMENTED", t.Unavailable = "UNAVAILABLE";
})(xe || (xe = {}));
class it extends Error {
  constructor(e, n, s) {
    super(e), this.message = e, this.code = n, this.data = s;
  }
}
const Dn = (t) => {
  var e, n;
  return t?.androidBridge ? "android" : !((n = (e = t?.webkit) === null || e === void 0 ? void 0 : e.messageHandlers) === null || n === void 0) && n.bridge ? "ios" : "web";
}, Tn = (t) => {
  const e = t.CapacitorCustomPlatform || null, n = t.Capacitor || {}, s = n.Plugins = n.Plugins || {}, i = () => e !== null ? e.name : Dn(t), a = () => i() !== "web", o = (f) => {
    const m = l.get(f);
    return !!(m?.platforms.has(i()) || c(f));
  }, c = (f) => {
    var m;
    return (m = n.PluginHeaders) === null || m === void 0 ? void 0 : m.find((v) => v.name === f);
  }, d = (f) => t.console.error(f), l = /* @__PURE__ */ new Map(), h = (f, m = {}) => {
    const v = l.get(f);
    if (v)
      return console.warn(`Capacitor plugin "${f}" already registered. Cannot register plugins twice.`), v.proxy;
    const y = i(), b = c(f);
    let u;
    const p = async () => (!u && y in m ? u = typeof m[y] == "function" ? u = await m[y]() : u = m[y] : e !== null && !u && "web" in m && (u = typeof m.web == "function" ? u = await m.web() : u = m.web), u), D = (S, x) => {
      var z, V;
      if (b) {
        const Z = b?.methods.find((g) => x === g.name);
        if (Z)
          return Z.rtype === "promise" ? (g) => n.nativePromise(f, x.toString(), g) : (g, $) => n.nativeCallback(f, x.toString(), g, $);
        if (S)
          return (z = S[x]) === null || z === void 0 ? void 0 : z.bind(S);
      } else {
        if (S)
          return (V = S[x]) === null || V === void 0 ? void 0 : V.bind(S);
        throw new it(`"${f}" plugin is not implemented on ${y}`, xe.Unimplemented);
      }
    }, P = (S) => {
      let x;
      const z = (...V) => {
        const Z = p().then((g) => {
          const $ = D(g, S);
          if ($) {
            const H = $(...V);
            return x = H?.remove, H;
          } else
            throw new it(`"${f}.${S}()" is not implemented on ${y}`, xe.Unimplemented);
        });
        return S === "addListener" && (Z.remove = async () => x()), Z;
      };
      return z.toString = () => `${S.toString()}() { [capacitor code] }`, Object.defineProperty(z, "name", {
        value: S,
        writable: !1,
        configurable: !1
      }), z;
    }, C = P("addListener"), T = P("removeListener"), j = (S, x) => {
      const z = C({ eventName: S }, x), V = async () => {
        const g = await z;
        T({
          eventName: S,
          callbackId: g
        }, x);
      }, Z = new Promise((g) => z.then(() => g({ remove: V })));
      return Z.remove = async () => {
        console.warn("Using addListener() without 'await' is deprecated."), await V();
      }, Z;
    }, $e = new Proxy({}, {
      get(S, x) {
        switch (x) {
          case "$$typeof":
            return;
          case "toJSON":
            return () => ({});
          case "addListener":
            return b ? j : C;
          case "removeListener":
            return T;
          default:
            return P(x);
        }
      }
    });
    return s[f] = $e, l.set(f, {
      name: f,
      proxy: $e,
      platforms: /* @__PURE__ */ new Set([...Object.keys(m), ...b ? [y] : []])
    }), $e;
  };
  return n.convertFileSrc || (n.convertFileSrc = (f) => f), n.getPlatform = i, n.handleError = d, n.isNativePlatform = a, n.isPluginAvailable = o, n.registerPlugin = h, n.Exception = it, n.DEBUG = !!n.DEBUG, n.isLoggingEnabled = !!n.isLoggingEnabled, n;
}, An = (t) => t.Capacitor = Tn(t), B = /* @__PURE__ */ An(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {}), re = B.registerPlugin;
class oe {
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
    return new B.Exception(e, xe.Unimplemented);
  }
  unavailable(e = "not available") {
    return new B.Exception(e, xe.Unavailable);
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
const Rt = (t) => encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape), Ft = (t) => t.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class Mn extends oe {
  async getCookies() {
    const e = document.cookie, n = {};
    return e.split(";").forEach((s) => {
      if (s.length <= 0)
        return;
      let [i, a] = s.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
      i = Ft(i).trim(), a = Ft(a).trim(), n[i] = a;
    }), n;
  }
  async setCookie(e) {
    try {
      const n = Rt(e.key), s = Rt(e.value), i = e.expires ? `; expires=${e.expires.replace("expires=", "")}` : "", a = (e.path || "/").replace("path=", ""), o = e.url != null && e.url.length > 0 ? `domain=${e.url}` : "";
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
re("CapacitorCookies", {
  web: () => new Mn()
});
const _n = async (t) => new Promise((e, n) => {
  const s = new FileReader();
  s.onload = () => {
    const i = s.result;
    e(i.indexOf(",") >= 0 ? i.split(",")[1] : i);
  }, s.onerror = (i) => n(i), s.readAsDataURL(t);
}), In = (t = {}) => {
  const e = Object.keys(t);
  return Object.keys(t).map((i) => i.toLocaleLowerCase()).reduce((i, a, o) => (i[a] = t[e[o]], i), {});
}, Rn = (t, e = !0) => t ? Object.entries(t).reduce((s, i) => {
  const [a, o] = i;
  let c, d;
  return Array.isArray(o) ? (d = "", o.forEach((l) => {
    c = e ? encodeURIComponent(l) : l, d += `${a}=${c}&`;
  }), d.slice(0, -1)) : (c = e ? encodeURIComponent(o) : o, d = `${a}=${c}`), `${s}&${d}`;
}, "").substr(1) : null, sn = (t, e = {}) => {
  const n = Object.assign({ method: t.method || "GET", headers: t.headers }, e), i = In(t.headers)["content-type"] || "";
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
class Fn extends oe {
  /**
   * Perform an Http request given a set of options
   * @param options Options to build the HTTP request
   */
  async request(e) {
    const n = sn(e, e.webFetchExtra), s = Rn(e.params, e.shouldEncodeUrlParams), i = s ? `${e.url}?${s}` : e.url, a = await fetch(i, n), o = a.headers.get("content-type") || "";
    let { responseType: c = "text" } = a.ok ? e : {};
    o.includes("application/json") && (c = "json");
    let d, l;
    switch (c) {
      case "arraybuffer":
      case "blob":
        l = await a.blob(), d = await _n(l);
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
    return a.headers.forEach((f, m) => {
      h[m] = f;
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
re("CapacitorHttp", {
  web: () => new Fn()
});
var Nt;
(function(t) {
  t.Dark = "DARK", t.Light = "LIGHT", t.Default = "DEFAULT";
})(Nt || (Nt = {}));
var Bt;
(function(t) {
  t.StatusBar = "StatusBar", t.NavigationBar = "NavigationBar";
})(Bt || (Bt = {}));
class Nn extends oe {
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
re("SystemBars", {
  web: () => new Nn()
});
function Bn(t) {
  return new DataView(Uint8Array.from(t).buffer);
}
function qn(t) {
  return Array.from(new Uint8Array(t.buffer, t.byteOffset, t.byteLength));
}
function jn(t) {
  return `0000${t.toString(16).padStart(4, "0")}-0000-1000-8000-00805f9b34fb`;
}
function Ae(t) {
  const e = [];
  let n, s, i = 1, a = 0;
  for (n = 0; n < t.length; n++)
    s = t.charCodeAt(n), (s > 47 && s < 58 || s > 64 && s < 71 || s > 96 && s < 103) && (a = a << 4 ^ (s > 64 ? s + 9 : s) & 15, (i ^= 1) && e.push(a & 255));
  return Bn(e);
}
function Me(t) {
  return qn(t).map((e) => {
    let n = e.toString(16);
    return n.length == 1 && (n = "0" + n), n;
  }).join("");
}
function Un(t) {
  if (typeof t == "string")
    return t;
  if (typeof t == "number")
    return jn(t);
  throw new Error("Invalid UUID");
}
function qt(t) {
  const e = {};
  if (t)
    return t.forEach((n, s) => {
      e[s.toString()] = n;
    }), e;
}
function jt(t) {
  if (t !== void 0) {
    if (typeof t == "string") {
      const e = Ae(t);
      return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
    }
    return t instanceof DataView ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength) : t;
  }
}
function je(t) {
  if (t !== void 0)
    return t instanceof DataView ? Me(t) : Me(new DataView(t.buffer, t.byteOffset, t.byteLength));
}
function at(t) {
  if (typeof SharedArrayBuffer < "u" && t.buffer instanceof SharedArrayBuffer) {
    const n = new Uint8Array(t.buffer, t.byteOffset, t.byteLength).slice().buffer;
    return new DataView(n);
  }
  return t;
}
const w = re("BluetoothLe", {
  web: () => Promise.resolve().then(() => Ts).then((t) => new t.BluetoothLeWeb())
}), Vn = () => {
  let t = Promise.resolve();
  return (e) => new Promise((n, s) => {
    t = t.then(() => e()).then(n).catch(s);
  });
};
function rt(t) {
  return t ? Vn() : (e) => e();
}
function A(t) {
  if (typeof t != "string")
    throw new Error(`Invalid UUID type ${typeof t}. Expected string.`);
  if (t = t.toLowerCase(), !(t.search(/^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/) >= 0))
    throw new Error(`Invalid UUID format ${t}. Expected 128 bit string (e.g. "0000180d-0000-1000-8000-00805f9b34fb").`);
  return t;
}
class Hn {
  constructor() {
    this.scanListener = null, this.eventListeners = /* @__PURE__ */ new Map(), this.queue = rt(!0);
  }
  enableQueue() {
    this.queue = rt(!0);
  }
  disableQueue() {
    this.queue = rt(!1);
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
    return e = e.map(A), this.queue(async () => (await w.getConnectedDevices({ services: e })).devices);
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
    return n = A(n), s = A(s), await this.queue(async () => {
      const o = await w.read(Object.assign({
        deviceId: e,
        service: n,
        characteristic: s
      }, i));
      return this.convertValue(o.value);
    });
  }
  async write(e, n, s, i, a) {
    return n = A(n), s = A(s), this.queue(async () => {
      if (!i?.buffer)
        throw new Error("Invalid data.");
      let o = i;
      B.getPlatform() !== "web" && (o = Me(i)), await w.write(Object.assign({
        deviceId: e,
        service: n,
        characteristic: s,
        value: o
      }, a));
    });
  }
  async writeWithoutResponse(e, n, s, i, a) {
    n = A(n), s = A(s), await this.queue(async () => {
      if (!i?.buffer)
        throw new Error("Invalid data.");
      let o = i;
      B.getPlatform() !== "web" && (o = Me(i)), await w.writeWithoutResponse(Object.assign({
        deviceId: e,
        service: n,
        characteristic: s,
        value: o
      }, a));
    });
  }
  async readDescriptor(e, n, s, i, a) {
    return n = A(n), s = A(s), i = A(i), await this.queue(async () => {
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
    return n = A(n), s = A(s), i = A(i), this.queue(async () => {
      if (!a?.buffer)
        throw new Error("Invalid data.");
      let c = a;
      B.getPlatform() !== "web" && (c = Me(a)), await w.writeDescriptor(Object.assign({
        deviceId: e,
        service: n,
        characteristic: s,
        descriptor: i,
        value: c
      }, o));
    });
  }
  async startNotifications(e, n, s, i, a) {
    n = A(n), s = A(s), await this.queue(async () => {
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
    n = A(n), s = A(s), await this.queue(async () => {
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
    return e = Object.assign({}, e), e.services && (e.services = e.services.map(A)), e.optionalServices && (e.optionalServices = e.optionalServices.map(A)), e.serviceData && B.getPlatform() !== "web" && (e.serviceData = e.serviceData.map((n) => Object.assign(Object.assign({}, n), { serviceUuid: A(n.serviceUuid), dataPrefix: je(n.dataPrefix), mask: je(n.mask) }))), e.manufacturerData && (B.getPlatform() !== "web" ? e.manufacturerData = e.manufacturerData.map((n) => Object.assign(Object.assign({}, n), { dataPrefix: je(n.dataPrefix), mask: je(n.mask) })) : e.manufacturerData = e.manufacturerData.map((n) => Object.assign(Object.assign({}, n), { dataPrefix: jt(n.dataPrefix), mask: jt(n.mask) }))), e;
  }
  convertValue(e) {
    return typeof e == "string" ? Ae(e) : e === void 0 ? new DataView(new ArrayBuffer(0)) : e;
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
const me = new Hn(), ot = 256, ct = 10, Kn = 4e3;
class an {
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
    this.setStatus("live"), this.sampleFns.forEach((s) => s(n)), this.lostTimer && clearTimeout(this.lostTimer), this.lostTimer = setTimeout(() => this.setStatus("lost"), Kn);
  }
  clearLost() {
    this.lostTimer && clearTimeout(this.lostTimer), this.lostTimer = null;
  }
}
function Ut(t) {
  let e = "";
  for (let n = 0; n < t.byteLength; n++) e += t.getUint8(n).toString(16).padStart(2, "0") + " ";
  return e.trim();
}
function Vt(t, e) {
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
function Wn(t) {
  return t.byteLength < ct + 2 ? null : (t.getUint8(ct) << 8 | t.getUint8(ct + 1)) / 100;
}
class pe extends an {
  constructor() {
    super(...arguments), this.name = "WeiHeng scale", this.preferredId = null, this.activeId = null, this.activeName = "", this.onDevice = () => {
    }, this.scanning = !1, this.seen = /* @__PURE__ */ new Map(), this.onSeen = () => {
    }, this.lastScanStart = 0, this.healTimer = null, this.lastPacketAt = 0, this.restarts = 0;
  }
  /** Switch to another device (or back to auto with null). */
  useDevice(e) {
    this.preferredId = e, this.activeId = null, this.activeName = "";
  }
  async start() {
    if (!B.isNativePlatform())
      throw new Error("Bluetooth scanning needs the Android build. Use the simulator in the browser.");
    if (await me.initialize({ androidNeverForLocation: !0 }), !await me.isEnabled().catch(() => !0))
      try {
        await me.requestEnable();
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
        await me.stopLEScan();
      } catch {
      }
      await new Promise((e) => setTimeout(e, 300)), this.restarts++;
    }
    this.setStatus("scanning"), this.scanning = !0, this.lastScanStart = Date.now(), await me.requestLEScan(
      { allowDuplicates: !0, scanMode: vt.SCAN_MODE_LOW_LATENCY },
      (e) => {
        const n = e.localName ?? e.device.name ?? "", s = e.manufacturerData ?? {}, i = Object.keys(s);
        let a = s[String(ot)] ?? s[ot.toString(16)];
        !a && /^(IF_|WH-|WEIHENG)/i.test(n) && i.length && (a = s[i[0]]), !a && e.rawAdvertisement && (a = Vt(e.rawAdvertisement, ot) ?? (/^IF_/i.test(n) ? Vt(e.rawAdvertisement) : void 0));
        const o = a ? Wn(a) : null, c = { id: e.device.deviceId, name: n, rssi: e.rssi ?? 0, keys: i.join(","), hex: a ? Ut(a) : e.rawAdvertisement ? Ut(e.rawAdvertisement).slice(0, 60) : "", kg: o, t: Date.now() };
        if (this.seen.set(c.id, c), this.onSeen(c), o !== null) {
          if (this.preferredId) {
            if (c.id !== this.preferredId) return;
          } else if (this.activeId && c.id !== this.activeId) return;
          this.activeId !== c.id && (this.activeId = c.id, this.activeName = n || c.id, this.onDevice(c.id, this.activeName)), this.lastPacketAt = Date.now(), this.emitRaw(o);
        }
      }
    );
  }
  async stop() {
    if (this.healTimer && (clearInterval(this.healTimer), this.healTimer = null), this.scanning)
      try {
        await me.stopLEScan();
      } catch {
      }
    this.scanning = !1, this.clearLost(), this.setStatus("idle");
  }
}
class zn extends an {
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
const Gn = { both: "", left: "Left", right: "Right" }, Yn = { complete: "", concentric: "Concentric", eccentric: "Eccentric" };
function Ce(t, e, n, s, i, a) {
  const o = [s?.trim() ?? "", Gn[e] ?? "", Yn[n ?? "complete"] ?? "", (i ?? 0) > 1 ? `${i} links` : "", a ? `+${a} kg` : ""].filter(Boolean);
  return o.length ? `${t} — ${o.join(", ")}` : t;
}
function ke(t, e, n, s, i, a) {
  const o = n ?? "complete", c = s?.trim() ?? "", d = (i ?? 0) > 1 ? i : 0, l = a ?? 0;
  let h = o === "complete" && !c && !d && !l ? `${t}|${e}` : `${t}|${e}|${o}`;
  return (c || d || l) && (h += `|${c}`), (d || l) && (h += `|${d}L`), l && (h += `|${l}E`), h;
}
function rn(t, e, n, s, i, a, o) {
  return t.exercise === e && t.side === n && (t.contraction ?? "complete") === (s ?? "complete") && (t.handle ?? "") === (i?.trim() ?? "") && Math.max(1, t.links ?? 1) === Math.max(1, a ?? 1) && (t.extKg ?? 0) === (o ?? 0);
}
function Se(t) {
  return t.manualReps && t.manualReps > 0 ? Math.round(t.manualReps) : 1;
}
function ge(t) {
  return t.performedAt ?? t.startedAt;
}
const We = 2;
class Jn {
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
    const s = on(n);
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
      reps: Ct(n)
    };
  }
}
function on(t) {
  let e = 0, n = 0, s = 0, i = 0;
  for (let d = 0; d < t.length; d++) {
    i = Math.min(i, t[d].kg);
    const l = Math.max(0, t[d].kg);
    e = Math.max(e, l), n += l, d > 0 && (s += l * (t[d].t - t[d - 1].t));
  }
  const a = n / t.length, o = t.filter((d) => d.kg > We);
  let c = 0;
  if (o.length >= 10) {
    const d = Math.max(3, Math.floor(o.length * 0.2)), l = Math.max(...o.slice(0, d).map((f) => f.kg)), h = Math.max(...o.slice(-d).map((f) => f.kg));
    c = l > 0 ? Math.max(0, (l - h) / l * 100) : 0;
  }
  return { peak: F(e), avg: F(a), output: F(s), inroad: F(c), low: F(i) };
}
function Ct(t) {
  if (t.length < 5) return [];
  const e = Math.max(...t.map((l) => l.kg));
  if (e < We * 2) return [];
  const n = Math.max(We, e * 0.35), s = Math.max(We * 0.5, e * 0.2), i = [];
  let a = !1, o = 0, c = 0, d = 0;
  for (const l of t)
    !a && l.kg >= n ? (a = !0, o = l.t, c = l.kg, d = l.t) : a && (l.kg > c && (c = l.kg, d = l.t), l.kg <= s && (l.t - o >= 0.6 && i.push({ index: i.length + 1, peak: F(c), peakT: F(d), startS: F(o), endS: F(l.t), durationS: F(l.t - o) }), a = !1));
  if (a) {
    const l = t[t.length - 1].t;
    l - o >= 0.6 && i.push({ index: i.length + 1, peak: F(c), peakT: F(d), startS: F(o), endS: F(l), durationS: F(l - o) });
  }
  return i.length >= 2 ? i : [];
}
function Xn(t) {
  if (t.length < 6) return null;
  const e = t.slice(-Math.max(3, Math.floor(t.length / 3)));
  return F(e.reduce((n, s) => n + s.peak, 0) / e.length);
}
function F(t) {
  return Math.round(t * 100) / 100;
}
class cn {
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
    const { ctx: i } = this, a = this.canvas.width / this.dpr, o = this.canvas.height / this.dpr, c = 42, d = 12, l = 12, h = 24, f = a - c - d, m = o - l - h, v = getComputedStyle(document.getElementById("view-force") ?? document.documentElement), y = v.getPropertyValue("--muted").trim() || "#888", b = v.getPropertyValue("--grid").trim() || "#333", u = v.getPropertyValue("--accent").trim() || "#e8552f", p = v.getPropertyValue("--ghost").trim() || "#7a7a7a", D = v.getPropertyValue("--zone").trim() || "rgba(60,180,90,0.18)";
    i.clearRect(0, 0, a, o);
    const P = Math.max(this.opts.windowS, Math.ceil(n / 10) * 10 || 10), C = this.opts.ghost ?? [];
    let T = 10;
    for (const g of e) T = Math.max(T, g.kg);
    for (const g of C) T = Math.max(T, g.kg);
    this.opts.zone && (T = Math.max(T, this.opts.zone.hi)), T = Ht(T * 1.1);
    let j = 0;
    for (const g of e) j = Math.min(j, g.kg);
    for (const g of C) j = Math.min(j, g.kg);
    j < 0 && (j = -Ht(-j * 1.1));
    const $e = T - j, S = (g) => c + g / P * f, x = (g) => l + m - (g - j) / $e * m;
    if (this.opts.zone) {
      i.fillStyle = D;
      const g = x(this.opts.zone.hi), $ = x(this.opts.zone.lo);
      i.fillRect(c, g, f, $ - g);
    }
    i.strokeStyle = b, i.lineWidth = 1, i.fillStyle = y, i.font = "11px system-ui, sans-serif", i.textAlign = "right", i.textBaseline = "middle";
    const V = T / 5;
    for (let g = 0; g <= T + 1e-6; g += V) {
      const $ = x(g);
      i.beginPath(), i.moveTo(c, $), i.lineTo(a - d, $), i.stroke(), i.fillText(g.toFixed(0), c - 6, $);
    }
    for (let g = -V; g >= j - 1e-6; g -= V) {
      const $ = x(g);
      i.beginPath(), i.moveTo(c, $), i.lineTo(a - d, $), i.stroke(), i.fillText(g.toFixed(0), c - 6, $);
    }
    j < 0 && (i.save(), i.strokeStyle = y, i.lineWidth = 1.5, i.beginPath(), i.moveTo(c, x(0)), i.lineTo(a - d, x(0)), i.stroke(), i.restore()), i.textAlign = "center", i.textBaseline = "top";
    const Z = P <= 30 ? 5 : P <= 90 ? 10 : 30;
    for (let g = 0; g <= P; g += Z) {
      const $ = S(g);
      i.beginPath(), i.moveTo($, l), i.lineTo($, l + m), i.stroke(), i.fillText(Zn(g), $, l + m + 6);
    }
    if (this.opts.marks?.length) {
      i.strokeStyle = p, i.setLineDash([3, 4]);
      for (const g of this.opts.marks)
        i.beginPath(), i.moveTo(S(g), l), i.lineTo(S(g), l + m), i.stroke();
      i.setLineDash([]);
    }
    if (C.length > 1 && (i.strokeStyle = p, i.lineWidth = 1.5, i.globalAlpha = 0.55, i.beginPath(), C.forEach((g, $) => $ ? i.lineTo(S(g.t), x(g.kg)) : i.moveTo(S(g.t), x(g.kg))), i.stroke(), i.globalAlpha = 1), e.length > 1) {
      i.strokeStyle = u, i.lineWidth = 2.5, i.lineJoin = "round", i.beginPath(), e.forEach((H, se) => se ? i.lineTo(S(H.t), x(H.kg)) : i.moveTo(S(H.t), x(H.kg))), i.stroke();
      const g = e[e.length - 1];
      i.lineTo(S(g.t), x(0)), i.lineTo(S(e[0].t), x(0)), i.closePath(), i.fillStyle = u, i.globalAlpha = 0.12, i.fill(), i.globalAlpha = 1;
      const $ = this.opts.peaks ?? [];
      if ($.length) {
        const H = Math.max(...$.map((se) => se.kg));
        i.font = "bold 11px system-ui, sans-serif", i.textAlign = "center", i.textBaseline = "bottom";
        for (const se of $) {
          const Ot = S(se.t), Dt = x(se.kg);
          i.fillStyle = se.kg === H ? u : "#ecebe6", i.beginPath(), i.arc(Ot, Dt, 3.5, 0, Math.PI * 2), i.fill();
          const Tt = se.kg.toFixed(0), qe = i.measureText(Tt).width + 8, At = Math.min(Math.max(Ot, c + qe / 2), c + f - qe / 2), Mt = Math.max(l + 14, Dt - 6);
          i.fillStyle = se.kg === H ? u : "rgba(40,42,48,0.92)", i.fillRect(At - qe / 2, Mt - 14, qe, 14), i.fillStyle = "#fff", i.fillText(Tt, At, Mt - 1);
        }
        i.textAlign = "left", i.textBaseline = "alphabetic";
      }
      i.fillStyle = u, i.beginPath(), i.arc(S(g.t), x(g.kg), 4, 0, Math.PI * 2), i.fill();
    } else s > 0 && (i.fillStyle = u, i.beginPath(), i.arc(S(0), x(s), 4, 0, Math.PI * 2), i.fill());
  }
}
function Ht(t) {
  const e = [10, 20, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500];
  for (const n of e) if (t <= n) return n;
  return Math.ceil(t / 100) * 100;
}
function Zn(t) {
  const e = Math.floor(t / 60), n = t % 60;
  return `${e}:${n.toString().padStart(2, "0")}`;
}
function Re(t, e = {}) {
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
      return Re("free");
  }
}
function ln(t) {
  if (!t.repeat || t.phases.length < 2) return t.phases;
  const [e, ...n] = t.phases, s = [e];
  for (let i = 0; i < t.repeat; i++)
    for (const a of n)
      i === t.repeat - 1 && a === n[n.length - 1] && a.cue === "rest" || s.push({ ...a, name: n.length > 1 && a.cue !== "rest" ? `${a.name} ${i + 1}/${t.repeat}` : a.name });
  return s;
}
class Qn {
  constructor() {
    this.timeline = [], this.idx = -1, this.phaseStart = 0, this.timer = null, this.running = !1, this.onPhase = () => {
    }, this.onTick = () => {
    }, this.onDone = () => {
    };
  }
  start(e) {
    this.timeline = ln(e), this.idx = -1, this.running = !0, this.next(), this.timer = setInterval(() => this.tick(), 100);
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
var Kt;
(function(t) {
  t[t.Flush = 0] = "Flush", t[t.Add = 1] = "Add";
})(Kt || (Kt = {}));
const Ue = re("TextToSpeech", {
  web: () => Promise.resolve().then(() => Ms).then((t) => new t.TextToSpeechWeb())
}), Ve = B.isNativePlatform();
let lt = null;
function es() {
  return lt || (lt = new (window.AudioContext || window.webkitAudioContext)()), lt;
}
function ce(t = 880, e = 120, n = 0.25) {
  try {
    const s = es(), i = s.createOscillator(), a = s.createGain();
    i.frequency.value = t, i.type = "sine", a.gain.value = n, i.connect(a), a.connect(s.destination), i.start(), a.gain.exponentialRampToValueAtTime(1e-4, s.currentTime + e / 1e3), i.stop(s.currentTime + e / 1e3);
  } catch {
  }
}
const K = {
  go: () => ce(1200, 220, 0.3),
  rest: () => ce(500, 220, 0.25),
  tick: () => ce(900, 60, 0.15),
  done: () => {
    ce(1e3, 120), setTimeout(() => ce(1300, 160), 140), setTimeout(() => ce(1600, 220), 320);
  },
  inZone: () => ce(1e3, 50, 0.1),
  outZone: () => ce(300, 120, 0.2)
};
class ts {
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
    if (Ve) return this.nativeBusy;
    try {
      return speechSynthesis.speaking || speechSynthesis.pending ? (this.busySince || (this.busySince = Date.now()), Date.now() - this.busySince > 4e3 ? (this.reset(), !1) : !0) : (this.busySince = 0, !1);
    } catch {
      return !1;
    }
  }
  /** Hard reset of the engine. */
  reset() {
    if (Ve) {
      Ue.stop().catch(() => {
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
    if (Ve)
      try {
        return `${(await Ue.getSupportedVoices()).voices.length} native voices`;
      } catch {
        return "native TTS unavailable";
      }
    if (!("speechSynthesis" in window)) return "no speech engine in this browser — open in Chrome";
    const e = speechSynthesis.getVoices().length;
    return e ? `${e} voices` : "no voices installed";
  }
  say(e, n = !1, s = !1) {
    if (!this.enabled) return;
    if (this.onSpeak(e), Ve) {
      if (this.nativeBusy && !n) return;
      this.nativeBusy = !0, (n ? Ue.stop().catch(() => {
      }) : Promise.resolve()).then(() => Ue.speak({ text: e, lang: "en-US", rate: this.rate, pitch: this.pitch, volume: 1, category: "ambient" })).catch(() => {
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
function ns(t) {
  const e = Math.floor(t / 60), n = t % 60;
  return n === 0 && e > 0 ? e === 1 ? "1 minute" : `${e} minutes` : String(n);
}
const Wt = re("KeepAwake", {
  web: () => Promise.resolve().then(() => Is).then((t) => new t.KeepAwakeWeb())
}), un = re("Preferences", {
  web: () => Promise.resolve().then(() => Fs).then((t) => new t.PreferencesWeb())
}), Pe = "ufl.sets.v1", He = "ufl.max.v1", ut = "ufl.exercises.v1", dn = [
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
function ss(t) {
  return /^SR\b|self.?resisted/i.test(t) ? "self-resisted" : "iso";
}
async function dt(t, e) {
  try {
    const n = B.isNativePlatform() ? (await un.get({ key: t })).value : localStorage.getItem(t);
    return n ? JSON.parse(n) : e;
  } catch {
    return e;
  }
}
async function ie(t, e) {
  const n = JSON.stringify(e);
  B.isNativePlatform() ? await un.set({ key: t, value: n }) : localStorage.setItem(t, n);
}
const I = {
  async sets() {
    return dt(Pe, []);
  },
  async saveSet(t) {
    const e = await this.sets();
    e.push(t), await ie(Pe, e.slice(-500));
  },
  async updateSet(t) {
    const e = await this.sets(), n = e.findIndex((s) => s.id === t.id);
    n >= 0 ? e[n] = t : e.push(t), await ie(Pe, e);
  },
  async deleteSet(t) {
    const e = await this.sets();
    await ie(Pe, e.filter((n) => n.id !== t));
  },
  async maxes() {
    return dt(He, {});
  },
  async setMax(t, e) {
    const n = await this.maxes();
    n[t] = { kg: e, at: Date.now() }, await ie(He, n);
  },
  async deleteMax(t) {
    const e = await this.maxes();
    delete e[t], await ie(He, e);
  },
  async exercises() {
    return dt(ut, dn);
  },
  /** Rename an exercise in every stored set and max (and the local list). */
  async renameExercise(t, e) {
    const n = await this.sets();
    for (const o of n) o.exercise === t && (o.exercise = e);
    await ie(Pe, n);
    const s = await this.maxes(), i = {};
    for (const [o, c] of Object.entries(s)) {
      const [d, ...l] = o.split("|"), h = [d === t ? e : d, ...l].join("|");
      (!i[h] || i[h].kg < c.kg) && (i[h] = c);
    }
    await ie(He, i);
    const a = await this.exercises();
    if (a.includes(t)) {
      const o = a.map((c) => c === t ? e : c);
      await ie(ut, [...new Set(o)]);
    }
  },
  async saveExercises(t) {
    await ie(ut, t);
  }
};
function is(t) {
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
function as(t) {
  t.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, n) {
        return t.cordova.plugins[n];
      }
    }
  );
}
function rs(t = !1) {
  typeof window > "u" || (window.CapacitorUtils = window.CapacitorUtils || {}, window.Capacitor !== void 0 && !t ? is(window) : window.cordova !== void 0 && as(window));
}
var yt;
(function(t) {
  t.Documents = "DOCUMENTS", t.Data = "DATA", t.Library = "LIBRARY", t.Cache = "CACHE", t.External = "EXTERNAL", t.ExternalStorage = "EXTERNAL_STORAGE", t.ExternalCache = "EXTERNAL_CACHE", t.LibraryNoCloud = "LIBRARY_NO_CLOUD", t.Temporary = "TEMPORARY";
})(yt || (yt = {}));
var Je;
(function(t) {
  t.UTF8 = "utf8", t.ASCII = "ascii", t.UTF16 = "utf16";
})(Je || (Je = {}));
const os = re("Filesystem", {
  web: () => Promise.resolve().then(() => Bs).then((t) => new t.FilesystemWeb())
});
rs();
const cs = re("Share", {
  web: () => Promise.resolve().then(() => js).then((t) => new t.ShareWeb())
});
function ls(t) {
  const e = ["id", "date_performed", "recorded_at", "exercise", "side", "contraction", "handle", "links", "external_kg", "offset_kg", "lowest_kg", "mode", "duration_s", "peak_kg", "avg_kg", "output_kgs", "inroad_pct", "reps", "auto_reps", "rep_peaks"], n = t.map((s) => [
    s.id,
    Fe(ge(s)),
    new Date(s.startedAt).toISOString(),
    ht(s.exercise),
    s.side,
    s.contraction ?? "complete",
    ht(s.handle ?? ""),
    s.links ?? 0,
    s.extKg ?? 0,
    s.offsetKg ?? 0,
    s.low ?? 0,
    s.mode,
    s.durationS.toFixed(1),
    s.peak,
    s.avg,
    s.output,
    s.inroad,
    Se(s),
    s.reps?.length ?? 0,
    ht((s.reps ?? []).map((i) => i.peak).join(" "))
  ].join(","));
  return [e.join(","), ...n].join(`
`);
}
function us(t) {
  return ["t_s,kg", ...t.samples.map((e) => `${e.t.toFixed(2)},${e.kg.toFixed(2)}`)].join(`
`);
}
function ht(t) {
  return `"${t.replace(/"/g, '""')}"`;
}
async function wt(t, e, n) {
  if (B.isNativePlatform()) {
    const o = await os.writeFile({ path: t, data: e, directory: yt.Cache, encoding: Je.UTF8 });
    await cs.share({ title: t, files: [o.uri] });
    return;
  }
  const s = new Blob([e], { type: n }), i = URL.createObjectURL(s), a = document.createElement("a");
  a.href = i, a.download = t, document.body.appendChild(a), a.click(), setTimeout(() => {
    URL.revokeObjectURL(i), a.remove();
  }, 500);
}
function Fe(t) {
  const e = new Date(t);
  return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
class ds {
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
function hn(t) {
  return {
    id: `fl-${t.id}`,
    date: Fe(ge(t)),
    exercise: Ce(t.exercise, t.side, t.contraction, t.handle, t.links, t.extKg),
    kg: t.peak,
    reps: Se(t),
    variation: ss(t.exercise),
    at: t.startedAt,
    dur: t.durationS,
    note: [t.extKg ? `external load ${t.extKg} kg` : "", t.offsetKg ? `offset ${t.offsetKg} kg` : "", t.mode, t.note].filter(Boolean).join(" · ")
  };
}
function hs() {
  const t = X();
  if (t)
    for (const e of dn) t.addExercise(e);
}
let G = null;
const fn = /* @__PURE__ */ new Map();
function fs(t) {
  fn.get(t)?.();
}
function he(t) {
  return t.replace(/[&<>"']/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[e]);
}
function ft(t, e) {
  t.classList.add("picker-hidden");
  const n = document.createElement("button");
  n.type = "button", n.className = "picker-btn", t.insertAdjacentElement("afterend", n);
  const s = () => {
    const i = t.value;
    n.textContent = i || (e.allOption?.label ?? "Choose…"), n.disabled = t.disabled;
  };
  return s(), new MutationObserver(s).observe(t, { attributes: !0, childList: !0 }), t.addEventListener("change", s), n.onclick = () => zt(t, e, s), fn.set(t, () => zt(t, e, s)), s;
}
function zt(t, e, n) {
  Oe();
  const s = document.getElementById("view-force") ?? document.body;
  G = document.createElement("div"), G.className = "picker-overlay", G.innerHTML = `<div class="picker-panel">
    <div class="picker-head"><input type="text" class="picker-search" placeholder="Search exercises…" autocomplete="off" /><button type="button" class="sm ghost picker-close">✕</button></div>
    <div class="picker-list"></div>
  </div>`, s.appendChild(G);
  const i = G.querySelector(".picker-search"), a = G.querySelector(".picker-list"), o = (d) => {
    t.value = d, t.dispatchEvent(new Event("change", { bubbles: !0 })), n(), Oe();
  }, c = () => {
    const d = i.value.trim().toLowerCase(), l = e.recent().filter((v) => !d || v.toLowerCase().includes(d)), h = e.all().filter((v) => !l.includes(v) && (!d || v.toLowerCase().includes(d))).sort((v, y) => v.localeCompare(y));
    let f = "";
    e.allOption && (!d || e.allOption.label.toLowerCase().includes(d)) && (f += `<button type="button" class="picker-item" data-v="${he(e.allOption.value)}">${he(e.allOption.label)}</button>`), l.length && (f += '<div class="picker-group">Recent in Force Lab</div>' + l.map((v) => `<button type="button" class="picker-item" data-v="${he(v)}">${he(v)}</button>`).join("")), h.length && (f += `<div class="picker-group">${l.length ? "All exercises" : "Exercises"}</div>` + h.map((v) => `<button type="button" class="picker-item" data-v="${he(v)}">${he(v)}</button>`).join(""));
    const m = i.value.trim();
    m && e.onCreate && !e.all().some((v) => v.toLowerCase() === m.toLowerCase()) && (f += `<button type="button" class="picker-item picker-create" data-create="1">+ Create "${he(m)}"</button>`), f || (f = '<div class="picker-group">No match</div>'), a.innerHTML = f, a.querySelectorAll(".picker-item").forEach((v) => {
      v.onclick = async () => {
        if (v.dataset.create) {
          const y = i.value.trim();
          await e.onCreate(y) && o(y);
          return;
        }
        o(v.dataset.v);
      };
    });
  };
  i.oninput = c, i.onkeydown = (d) => {
    d.key === "Escape" && Oe(), d.key === "Enter" && a.querySelector(".picker-item")?.click();
  }, G.querySelector(".picker-close").onclick = Oe, G.onclick = (d) => {
    d.target === G && Oe();
  }, c(), setTimeout(() => i.focus(), 50);
}
function Oe() {
  G?.remove(), G = null;
}
const r = (t) => document.getElementById(t);
let R = null, Q = null, Xe = 0, E = [], q = [], le = null, ue = 0, ee = 0, ve = null, U = !0, _e = localStorage.getItem("ufl.ghostOn") !== "0", Ke = null;
const Ee = (t, e) => localStorage.getItem(t) ?? e;
let ze = Math.max(1, Number(Ee("ufl.calloutEvery", "5"))), bt = Ee("ufl.calloutOn", "1") === "1", xt = Ee("ufl.secBeep", "0") === "1", kt = Ee("ufl.secCount", "0") === "1", Ge = null, pt = -1;
const k = new ts(), N = new Jn(), ae = new Qn(), W = new cn(r("chart")), De = r("progressChart"), ps = {
  countdown: [{ key: "total", label: "seconds", def: 60 }],
  ramp: [{ key: "ramp", label: "ramp s", def: 5 }, { key: "hold", label: "hold s", def: 10 }],
  repeaters: [{ key: "reps", label: "reps", def: 6 }, { key: "hold", label: "on s", def: 10 }, { key: "rest", label: "off s", def: 20 }],
  offset: [{ key: "steady", label: "steady for s", def: 5 }, { key: "tol", label: "± kg", def: 0.5 }]
};
let Be = null;
function gs(t, e) {
  Be = { active: !0, t0: 0, lo: 0, hi: 0, sum: 0, n: 0, steady: t, tol: e, spoken: -1 }, J("rest", "Hang still…", ""), k.say("Hang from the scale and stay still", !0);
}
function ms(t) {
  const e = Be;
  if (!e || !e.active) return;
  const n = Date.now();
  if (e.n === 0 || t < e.lo - e.tol || t > e.hi + e.tol || t < 1) {
    const o = e.n > 0 && (n - e.t0) / 1e3 >= 1;
    e.t0 = n, e.lo = t, e.hi = t, e.sum = t, e.n = t >= 1 ? 1 : 0, e.spoken = -1, J("rest", t < 1 ? "Hang from the scale…" : "Moved — hold still", ""), o && k.say("Moved. Hold still", !0);
    return;
  }
  e.lo = Math.min(e.lo, t), e.hi = Math.max(e.hi, t), e.sum += t, e.n++;
  const s = (n - e.t0) / 1e3, i = Math.max(0, e.steady - s);
  J("rest", `Steady ${t.toFixed(1)} kg`, `${i.toFixed(1)}`);
  const a = Math.ceil(i);
  if (a !== e.spoken && a > 0 && (e.spoken = a, k.say(String(a), !0), U && K.tick()), s >= e.steady) {
    e.active = !1;
    const o = Math.round(e.sum / e.n * 10) / 10;
    U && K.go(), k.say(`Offset ${o.toFixed(1)} kilograms?`, !0), confirm(`Steady for ${e.steady}s at ${o.toFixed(1)} kg.
Use ${o.toFixed(1)} kg as the offset for ${r("exercise").value}?`) ? (r("offsetKg").value = o.toFixed(1), localStorage.setItem(`ufl.offset.${r("exercise").value}`, String(o)), J("rest", `Offset set: ${o.toFixed(1)} kg`, "")) : J("rest", "Offset not changed", ""), pn();
  }
}
function pn() {
  Be = null, r("btnStop").classList.add("hidden"), r("btnStart").classList.remove("hidden"), Le(!1);
}
function Ze() {
  const t = r("handle").value;
  return t === "__custom" ? "" : t;
}
function Ne() {
  return Math.max(1, Math.floor(Number(r("links").value) || 1));
}
let gn = 0;
function Qe() {
  return Math.max(0, Math.round((Number(r("offsetKg").value) || 0) * 10) / 10);
}
function et() {
  return Math.max(0, Math.round((Number(r("extKg").value) || 0) * 2) / 2);
}
function fe() {
  const t = r("exercise").value || "Choose exercise", e = r("side").value, n = r("protocol").value, s = r("contraction").value;
  r("hdrExName").textContent = r("exercise").value ? Ce(t, e, s, Ze(), Ne(), et()) : t, r("hdrExMeta").textContent = n;
}
async function vs(t, e) {
  const n = X();
  if (n) {
    if (!n.renameExercise(t, e)) return;
    E = n.exerciseNames();
  } else
    await mn(t, e), E = await I.exercises();
  de(), te(), ne(), await M();
}
async function mn(t, e) {
  await I.renameExercise(t, e), q = await I.sets(), r("exercise").value === t && (de(), r("exercise").value = e);
}
async function ys() {
  hs(), E = X()?.exerciseNames() ?? await I.exercises(), q = await I.sets(), de(), yn(), await M(), ne(), te(), Ps(), Cn(), k.enabled = r("voiceOn").checked;
}
function gt() {
  const t = /* @__PURE__ */ new Map();
  for (const e of q) t.set(e.exercise, Math.max(t.get(e.exercise) ?? 0, e.startedAt));
  for (const e of Object.keys(vn)) {
    const n = e.split("|")[0];
    t.has(n) || t.set(n, 0);
  }
  return [...t.entries()].filter(([e]) => E.includes(e)).sort((e, n) => n[1] - e[1]).map(([e]) => e);
}
let vn = {};
async function Gt(t) {
  if (t = t.trim(), !t) return !1;
  if (!E.includes(t)) {
    const e = X();
    e ? (e.addExercise(t), E = e.exerciseNames()) : (E.push(t), await I.saveExercises(E));
  }
  return de(), te(), !0;
}
function de() {
  setTimeout(fe, 0);
  for (const n of ["exercise", "maxExercise"]) {
    const s = r(n), i = s.value;
    s.innerHTML = E.map((a) => `<option>${L(a)}</option>`).join(""), i && E.includes(i) && (s.value = i);
  }
  const t = r("histExercise"), e = t.value;
  t.innerHTML = '<option value="">All</option>' + E.map((n) => `<option>${L(n)}</option>`).join(""), t.value = e;
}
function yn() {
  const t = r("protocol").value, e = r("params"), n = JSON.parse(localStorage.getItem(`ufl.params.${t}`) ?? "{}");
  e.innerHTML = (ps[t] ?? []).map((s) => `<label>${s.label}<input type="number" data-k="${s.key}" value="${n[s.key] ?? s.def}" min="${s.key === "tol" ? 0.1 : 1}" step="${s.key === "tol" ? 0.1 : 1}" /></label>`).join(""), e.querySelectorAll("input").forEach((s) => s.oninput = () => {
    localStorage.setItem(`ufl.params.${t}`, JSON.stringify(ye())), r("protocolHelp").textContent = Re(t, ye()).describe;
  }), r("protocolHelp").textContent = Re(t, ye()).describe;
}
function ye() {
  const t = {};
  return r("params").querySelectorAll("input").forEach((e) => t[e.dataset.k] = Number(e.value) || (e.dataset.k === "tol" ? 0.5 : 1)), t;
}
async function M() {
  const t = r("exercise").value, e = r("side").value, n = r("contraction").value, s = Ze(), i = Ne(), a = et(), o = q.filter((h) => rn(h, t, e, n, s, i, a));
  le = o.length ? o[o.length - 1] : null, ue = o.reduce((h, f) => Math.max(h, f.output), 0);
  const c = await I.maxes();
  vn = c;
  const d = o.reduce((h, f) => Math.max(h, f.peak), 0), l = r("zoneRef").value;
  if (ee = l === "last" ? le?.peak ?? 0 : l === "maxtest" ? c[ke(t, e, n, s, i, a)]?.kg ?? 0 : Math.max(c[ke(t, e, n, s, i, a)]?.kg ?? 0, d), !N.recording) {
    const h = o.reduce((f, m) => Math.max(f, m.peak), 0);
    r("sPeak").textContent = le ? O(le.peak) : "–", r("dPeak").innerHTML = le ? `<span class="muted">last · best ${O(h)} kg</span>` : '<span class="muted">no previous set</span>';
  }
  r("zoneMax").textContent = ee ? `(${l === "last" ? "last" : l === "maxtest" ? "max test" : "best"} ${ee.toFixed(1)} kg → ${Ye().lo.toFixed(1)}–${Ye().hi.toFixed(1)} kg)` : l === "maxtest" ? "(no Max test for this exercise yet)" : "(no previous set for this exercise yet)", r("sGoal").textContent = ue ? O(ue) : "–", W.opts.ghost = _e ? le?.samples ?? null : null, W.opts.zone = $t() ? Ye() : null, N.recording || (W.opts.marks = []);
}
function $t() {
  return r("zoneOn").checked && ee > 0;
}
function Ye() {
  const t = Number(r("zoneLo").value) / 100 * ee, e = Number(r("zoneHi").value) / 100 * ee;
  return { lo: Math.min(t, e), hi: Math.max(t, e) };
}
async function St(t) {
  R && await R.stop(), R = t, t.onStatus(Ie), t.onSample((e) => {
    if (gn = e.kg, Be?.active) {
      ms(e.kg);
      return;
    }
    const n = Qe(), s = e.kg - n, i = n ? { ...e, kg: s } : e;
    Xe = i.kg, Y === "live" && (r("statusKg").textContent = n ? `${s.toFixed(1)} kg (raw ${e.kg.toFixed(1)})` : `${i.kg.toFixed(1)} kg`), N.push(i), ws(Math.max(0, i.kg));
  });
  try {
    await t.start(), r("btnTare").disabled = !1, r("btnStart").disabled = !1;
  } catch (e) {
    Ie("error"), r("statusText").textContent = e.message, alert("Connect failed: " + e.message);
  }
}
let Y = "idle";
function wn() {
  return localStorage.getItem("ufl.keepAwake") !== "0";
}
function bn() {
  if (!B.isNativePlatform()) return;
  (wn() && (Y === "live" || Y === "scanning" || Y === "lost") ? Wt.keepAwake() : Wt.allowSleep()).catch(() => {
  });
}
function Ie(t) {
  Y = t, bn(), r("statusDot").className = `dot ${t}`, r("statusPill").className = `pill ${t}`;
  const e = {
    idle: "Not connected",
    scanning: "Listening…",
    live: R instanceof pe && R.activeName ? nt(R.activeName) : "",
    lost: "Lost — retrying…",
    error: "Error"
  };
  r("statusText").textContent = e[t], t !== "live" && (r("statusKg").textContent = "");
  const n = r("btnConnect");
  n.textContent = t === "live" || t === "scanning" ? "Disconnect" : "Connect scale";
}
function xn() {
  return localStorage.getItem("ufl.autoConnect") !== "0";
}
let tt = !1, Et = !1, mt = !1;
function Lt() {
  if (!xn() || !B.isNativePlatform() || R instanceof pe || Q || Et || tt && Y === "error") return;
  tt = !0;
  const t = new pe();
  t.onSeen = () => Pn(t), r("simPanel").classList.add("hidden"), St(t);
}
let Yt = 0;
function ws(t) {
  if (!N.recording || !$t()) {
    ve = null;
    return;
  }
  const e = ae.running ? ae.current() : null;
  if (e && e.cue === "rest") {
    ve = null;
    return;
  }
  const n = Ye(), s = t >= n.lo && t <= n.hi, i = r("phaseBanner");
  s && ve !== "in" && (ve = "in", i.classList.add("inzone"), i.classList.remove("outzone"), k.say("in zone")), !s && ve !== "out" && (ve = "out", i.classList.add("outzone"), i.classList.remove("inzone"), t > 2 && k.say(t < n.lo ? "more" : "ease off"), U && t > 2 && Date.now() - Yt > 1500 && (K.outZone(), Yt = Date.now()));
}
let Pt = null, we = null;
function bs() {
  const t = Math.max(0, Math.floor(Number(r("preCount").value) || 0));
  if (!t || r("protocol").value === "offset") {
    Jt();
    return;
  }
  k.unlock(), r("btnStart").classList.add("hidden"), r("btnStop").classList.remove("hidden"), r("btnStop").textContent = "Cancel", Le(!0);
  let e = t;
  const n = () => {
    J("rest", "Get ready", String(e)), e > 0 && (k.say(String(e), !0), U && K.tick());
  };
  n(), we = setInterval(() => {
    if (e--, e <= 0) {
      clearInterval(we), we = null, r("btnStop").textContent = "Stop", Jt();
      return;
    }
    n();
  }, 1e3);
}
function xs() {
  return we ? (clearInterval(we), we = null, r("btnStop").textContent = "Stop", r("btnStop").classList.add("hidden"), r("btnStart").classList.remove("hidden"), Le(!1), J("rest", "Ready", ""), !0) : !1;
}
function Jt() {
  Pt = null;
  const t = r("protocol").value;
  if (t === "offset") {
    if (!R) {
      alert("Connect the scale (or the simulator) first.");
      return;
    }
    const s = ye();
    r("summary").classList.add("hidden"), r("btnStart").classList.add("hidden"), r("btnStop").classList.remove("hidden"), Le(!0), gs(Math.max(1, s.steady || 5), Math.max(0.1, s.tol || 1));
    return;
  }
  const e = Re(t, ye());
  r("summary").classList.add("hidden"), N.start(), k.unlock(), Es(), W.opts.marks = [], W.opts.peaks = [];
  const n = e.phases.length ? ln(e).reduce((s, i) => s + i.seconds, 0) : 60;
  W.opts.windowS = Math.max(10, Math.ceil(n / 10) * 10), r("btnStart").classList.add("hidden"), r("btnStop").classList.remove("hidden"), Le(!0), e.phases.length ? (ae.onPhase = ks, ae.onTick = Ss, ae.onDone = () => kn(), ae.start(e)) : (J("work", "Free set — go", ""), k.say("Go", !0), U && K.go());
}
function ks(t, e, n) {
  J(t.cue, t.name, t.seconds.toFixed(0)), t.cue === "work" ? (U && K.go(), k.say(t.name.replace(/\d+\/\d+/, ""), !0), W.opts.marks.push(N.elapsed())) : t.cue === "ramp" ? (U && K.go(), k.say("Build up", !0)) : (e > 0 && U && K.rest(), e > 0 && k.say(e === n - 1 ? "Done" : "Rest", !0));
}
let Xt = -1;
function Ss(t, e) {
  r("phaseTime").textContent = t.toFixed(t < 10 ? 1 : 0);
  const n = Math.ceil(t);
  n !== Xt && (Xt = n, n <= 3 && n > 0 && U && K.tick());
}
async function kn() {
  if (xs()) return;
  if (Be) {
    pn(), J("rest", "Offset capture cancelled", "");
    return;
  }
  ae.stop(), Sn();
  const t = r("exercise").value, e = r("side").value, n = r("protocol").value, s = r("contraction").value, i = N.finish({ exercise: t, side: e, mode: n, contraction: s, handle: Ze(), links: Ne(), extKg: et(), offsetKg: Qe() });
  i && i.manualReps === void 0 && (i.reps?.length ?? 0) >= 2 && (i.manualReps = i.reps.length), Pt = i, r("btnStop").classList.add("hidden"), r("btnStart").classList.remove("hidden"), Le(!1), J("idle", "Done", "—"), U && K.done(), i && (n === "maxtest" && i.peak > 0 && (await I.setMax(ke(t, e, s, Ze(), Ne(), et()), i.peak), k.say(`New max ${i.peak.toFixed(0)} kilos`, !0)), await I.saveSet(i), q.push(i), X()?.upsertForceSet(hn(i)), await Ls(i), await M(), ne(), te());
}
function Es() {
  Sn(), pt = -1, Ge = setInterval(() => {
    if (!N.recording) return;
    const t = Math.floor(N.elapsed());
    if (t === pt || t === 0) return;
    pt = t;
    const e = ae.running ? ae.current() : null;
    if (e && e.cue !== "work") return;
    const n = bt && !$t() && t % ze === 0;
    (xt && U || n && U) && K.tick();
    const s = [];
    kt && s.push(ns(t)), n && s.push(Xe.toFixed(0)), s.length && (!n && k.speaking() || k.say(s.join(", "), n, !0));
  }, 100);
}
function Sn() {
  Ge && clearInterval(Ge), Ge = null;
}
function Le(t) {
  for (const e of ["exercise", "side", "protocol", "contraction", "handle", "links", "extKg", "offsetKg", "preCount"]) r(e).disabled = t;
}
function J(t, e, n) {
  const s = r("phaseBanner");
  s.className = `banner ${t}`, r("phaseName").textContent = e, r("phaseTime").textContent = n;
}
async function Ls(t) {
  const e = le, n = await I.maxes(), s = t.side === "left" ? "right" : t.side === "right" ? "left" : null, i = [];
  t.extKg && i.push(_("External load", `+${t.extKg} kg (not measured by the scale)`)), t.offsetKg && i.push(_("Offset", `−${t.offsetKg} kg subtracted from every reading`)), t.low !== void 0 && t.low < 0 && i.push(_("Lowest reading", `${t.low.toFixed(1)} kg — the other arm carried ${(-t.low).toFixed(1)} kg more than the offset`)), i.push(_("Duration", `${t.durationS.toFixed(1)} s`)), i.push(_("Peak force", `${O(t.peak)} kg`, be(t.peak, e?.peak))), i.push(_("Intensity (avg)", `${O(t.avg)} kg`, be(t.avg, e?.avg))), i.push(_("Output (kg·s)", O(t.output), be(t.output, e?.output))), i.push(_("Inroad", `${t.inroad.toFixed(0)}%`, t.inroad >= 30 ? '<span class="badge good">deep fatigue</span>' : t.inroad >= 15 ? '<span class="badge">moderate</span>' : '<span class="badge warn">shallow — stopped early?</span>')), ue && i.push(_("vs. best output", `${(t.output / ue * 100).toFixed(0)}%`, t.output > ue ? '<span class="badge good">new best</span>' : "")), ee && i.push(_("Peak as % of max", `${(t.peak / ee * 100).toFixed(0)}%`));
  let a = "";
  if (t.reps && t.reps.length) {
    const d = Math.max(...t.reps.map((h) => h.peak));
    a = `<div class="muted" style="margin-top:8px">Reps: ${t.reps.length} · first ${O(t.reps[0].peak)} → last ${O(t.reps[t.reps.length - 1].peak)} kg · avg rep ${(t.reps.reduce((h, f) => h + f.durationS, 0) / t.reps.length).toFixed(1)} s</div>
      <div class="repbars">${t.reps.map((h) => `<div style="height:${Math.max(4, h.peak / d * 100)}%"><span>${h.peak.toFixed(0)}</span></div>`).join("")}</div>`;
    const l = t.mode === "critical" ? Xn(t.reps) : null;
    l && (a += _("Critical force", `${O(l)} kg${ee ? ` (${(l / ee * 100).toFixed(0)}% of max)` : ""}`));
  }
  let o = "";
  if (s) {
    const d = (f) => q.filter((m) => rn(m, t.exercise, f, t.contraction, t.handle, t.links, t.extKg)).reduce((m, v) => Math.max(m, v.peak), 0), l = Math.max(n[ke(t.exercise, t.side, t.contraction, t.handle, t.links, t.extKg)]?.kg ?? 0, d(t.side)) || void 0, h = Math.max(n[ke(t.exercise, s, t.contraction, t.handle, t.links, t.extKg)]?.kg ?? 0, d(s)) || void 0;
    if (l && h) {
      const f = (Math.abs(l - h) / Math.max(l, h) * 100).toFixed(0);
      o = _("Left/right gap", `${f}% (L ${O(t.side === "left" ? l : h)} / R ${O(t.side === "left" ? h : l)})`, Number(f) > 10 ? '<span class="badge warn">asymmetry</span>' : '<span class="badge good">balanced</span>');
    }
  }
  const c = r("summary");
  c.innerHTML = `<h4>${L(Ce(t.exercise, t.side, t.contraction, t.handle, t.links, t.extKg))} · ${t.mode}</h4>${i.join("")}${o}${a}
    ${En(t, "sum")}`, c.classList.remove("hidden"), Ln(t, "sum", async () => {
    await M(), ne();
  });
}
function En(t, e) {
  const n = Fe(ge(t));
  return `<div class="editor">
      <label>Reps <input type="number" id="${e}Reps" min="1" step="1" inputmode="numeric" placeholder="1" value="${t.manualReps ?? ""}" /></label>
      <label>Date performed <input type="date" id="${e}Date" value="${n}" max="${Fe(Date.now())}" /></label>
      <label class="grow">Note <input type="text" id="${e}Note" placeholder="optional" value="${L(t.note ?? "")}" /></label>
      <button class="sm primary" id="${e}Save" type="button">Save</button>
      <span class="muted" id="${e}Msg">${t.reps?.length ? `auto-detected ${t.reps.length} — change it if that's wrong` : "blank reps = 1"}</span>
    </div>`;
}
function Ln(t, e, n) {
  const s = async () => {
    const i = Number(r(`${e}Reps`).value);
    t.manualReps = i > 0 ? Math.round(i) : void 0;
    const a = r(`${e}Date`).value;
    if (a) {
      const [c, d, l] = a.split("-").map(Number), h = new Date(t.startedAt);
      t.performedAt = new Date(c, d - 1, l, h.getHours(), h.getMinutes(), h.getSeconds()).getTime();
    }
    t.note = r(`${e}Note`).value.trim() || void 0, await I.updateSet(t), X()?.upsertForceSet(hn(t));
    const o = q.findIndex((c) => c.id === t.id);
    o >= 0 && (q[o] = t), r(`${e}Msg`).textContent = `saved · ${Se(t)} rep${Se(t) === 1 ? "" : "s"} · ${Fe(ge(t))}`, await n();
  };
  r(`${e}Save`).onclick = s;
  for (const i of [`${e}Reps`, `${e}Date`, `${e}Note`]) r(i).onkeydown = (a) => {
    a.key === "Enter" && s();
  };
}
function _(t, e, n = "") {
  return `<div class="fl-line"><span>${t}</span><span>${e} ${n}</span></div>`;
}
function be(t, e) {
  if (!e) return "";
  const n = (t - e) / e * 100;
  return `<span class="${n >= 0 ? "fl-d up" : "fl-d down"}">${n >= 0 ? "+" : ""}${n.toFixed(1)}%</span>`;
}
function Cn() {
  const t = N.current(), e = N.recording ? N.elapsed() : Pt?.durationS ?? N.elapsed();
  if (r("liveKg").textContent = Xe.toFixed(1), r("elapsed").textContent = On(e), W.draw(t, e, Xe), N.recording && t.length > 2) {
    const n = on(t);
    r("sPeak").textContent = O(n.peak), r("sAvg").textContent = O(n.avg), r("sOut").textContent = O(n.output), r("sInroad").textContent = `${n.inroad.toFixed(0)}%`;
    const s = le;
    r("dPeak").innerHTML = n.low < 0 ? `<span class="muted">low ${n.low.toFixed(1)} kg</span> ${be(n.peak, s?.peak)}` : be(n.peak, s?.peak), r("dAvg").innerHTML = be(n.avg, s?.avg), r("dOut").innerHTML = ue ? `<span class="muted">${(n.output / ue * 100).toFixed(0)}% of goal</span>` : "";
    const i = Ct(t);
    W.opts.peaks = i.map((a) => ({ t: a.peakT ?? a.startS, kg: a.peak })), r("sReps").textContent = i.length ? String(i.length) : "–", r("dReps").textContent = i.length ? `last ${i[i.length - 1].peak.toFixed(0)} kg` : "";
  }
  requestAnimationFrame(Cn);
}
let Te = null;
function ne() {
  const t = r("histExercise").value, e = q.filter((n) => !t || n.exercise === t).slice().sort((n, s) => ge(s) - ge(n) || s.startedAt - n.startedAt);
  r("histBody").innerHTML = e.map((n) => `<tr data-id="${n.id}" class="${Te?.id === n.id ? "sel" : ""}">
      <td>${new Date(ge(n)).toLocaleDateString(void 0, { month: "short", day: "numeric" })}</td>
      <td>${L(Ce(n.exercise, n.side, n.contraction, n.handle, n.links, n.extKg))}</td>
      <td>${n.mode}</td><td>${Se(n)}</td><td>${On(n.durationS)}</td><td>${O(n.peak)}</td><td>${O(n.avg)}</td><td>${O(n.output)}</td><td>${n.inroad.toFixed(0)}%</td>
      <td><button data-del="${n.id}">✕</button></td></tr>`).join("") || '<tr><td colspan="10" class="muted">No sets yet.</td></tr>', r("histBody").querySelectorAll("tr[data-id]").forEach((n) => {
    n.onclick = (s) => {
      s.target.dataset.del || (Te = q.find((i) => i.id === n.dataset.id) ?? null, ne(), Cs());
    };
  }), r("histBody").querySelectorAll("button[data-del]").forEach((n) => {
    n.onclick = async () => {
      confirm("Delete this set?") && (await I.deleteSet(n.dataset.del), X()?.removeForceSet(`fl-${n.dataset.del}`), q = q.filter((s) => s.id !== n.dataset.del), Te?.id === n.dataset.del && (Te = null), ne(), await M());
    };
  }), $s(t ? e.slice().reverse() : []);
}
function Cs() {
  const t = Te, e = r("histDetail");
  if (!t) {
    e.classList.add("hidden");
    return;
  }
  e.classList.remove("hidden"), e.innerHTML = `<h4>${L(Ce(t.exercise, t.side, t.contraction, t.handle, t.links, t.extKg))} · ${new Date(t.startedAt).toLocaleString()}</h4>
    <div class="chartwrap small"><canvas id="histCanvas"></canvas></div>
    ${_("Peak", `${O(t.peak)} kg`)}${_("Intensity", `${O(t.avg)} kg`)}${_("Output", O(t.output))}${_("Inroad", `${t.inroad.toFixed(0)}%`)}
    ${_("Reps (logged)", String(Se(t)))}
    ${t.reps?.length ? _("Auto-detected", `${t.reps.length} (${t.reps.map((s) => s.peak.toFixed(0)).join(", ")} kg)`) : ""}
    ${En(t, "hist")}
    <div class="actions-inline" style="margin-top:8px"><button class="sm" id="btnUseGhost">Use as ghost trace</button><button class="sm ghost" id="btnSetCsv">Export samples CSV</button></div>`, Ln(t, "hist", async () => {
    ne(), await M();
  });
  const n = new cn(r("histCanvas"));
  n.opts.windowS = Math.max(10, Math.ceil(t.durationS / 10) * 10), n.opts.peaks = Ct(t.samples).map((s) => ({ t: s.peakT ?? s.startS, kg: s.peak })), n.draw(t.samples, t.durationS, 0), r("btnUseGhost").onclick = () => {
    _e = !0, localStorage.setItem("ufl.ghostOn", "1"), r("ghostOn").checked = !0, W.opts.ghost = t.samples, $n("train");
  }, r("btnSetCsv").onclick = () => wt(`set-${t.id}.csv`, us(t), "text/csv");
}
function $s(t) {
  const e = r("progress");
  if (t.length < 2) {
    e.classList.add("hidden");
    return;
  }
  e.classList.remove("hidden");
  const n = Math.max(1, window.devicePixelRatio || 1), s = e.clientWidth - 12, i = 160;
  De.width = s * n, De.height = i * n, De.style.width = `${s}px`, De.style.height = `${i}px`;
  const a = De.getContext("2d");
  a.setTransform(n, 0, 0, n, 0, 0), a.clearRect(0, 0, s, i);
  const o = getComputedStyle(document.getElementById("view-force") ?? document.documentElement), c = 36, d = 8, l = 10, h = 18, f = s - c - d, m = i - l - h, v = Math.max(10, ...t.map((p) => p.peak)) * 1.1, y = (p) => c + p / Math.max(1, t.length - 1) * f, b = (p) => l + m - p / v * m;
  a.strokeStyle = o.getPropertyValue("--grid"), a.fillStyle = o.getPropertyValue("--muted"), a.font = "10px system-ui", a.textAlign = "right";
  for (let p = 0; p <= 4; p++) {
    const D = v / 4 * p;
    a.beginPath(), a.moveTo(c, b(D)), a.lineTo(s - d, b(D)), a.stroke(), a.fillText(D.toFixed(0), c - 4, b(D) + 3);
  }
  const u = [["peak", o.getPropertyValue("--accent")], ["avg", o.getPropertyValue("--accent2")]];
  for (const [p, D] of u)
    a.strokeStyle = D, a.lineWidth = 2, a.beginPath(), t.forEach((P, C) => C ? a.lineTo(y(C), b(P[p])) : a.moveTo(y(C), b(P[p]))), a.stroke(), a.fillStyle = D, t.forEach((P, C) => {
      a.beginPath(), a.arc(y(C), b(P[p]), 3, 0, Math.PI * 2), a.fill();
    });
  a.fillStyle = o.getPropertyValue("--muted"), a.textAlign = "left", a.fillText("peak", c + 4, l + 10), a.fillStyle = o.getPropertyValue("--accent2"), a.fillText("intensity", c + 36, l + 10);
}
async function te() {
  const t = await I.maxes(), e = Object.entries(t).map(([n, s]) => {
    const [i, a, o, c, d, l] = n.split("|");
    return `<tr><td>${L(Ce(i, "both", o, c, Number((d ?? "").replace("L", "")) || 0, Number((l ?? "").replace("E", "")) || 0))}</td><td>${a}</td><td>${O(s.kg)}</td><td>${new Date(s.at).toLocaleDateString()}</td><td><button data-mdel="${L(n)}">✕</button></td></tr>`;
  });
  r("maxBody").innerHTML = e.join("") || '<tr><td colspan="5" class="muted">No maxes yet.</td></tr>', r("maxBody").querySelectorAll("button[data-mdel]").forEach((n) => n.onclick = async () => {
    await I.deleteMax(n.dataset.mdel), te(), M();
  }), r("exList").innerHTML = E.map((n) => `<span>${L(n)}<button data-xren="${L(n)}" title="Rename">✎</button><button data-xdel="${L(n)}">✕</button></span>`).join(""), r("exList").querySelectorAll("button[data-xren]").forEach((n) => n.onclick = async () => {
    const s = n.dataset.xren, i = prompt(`Rename "${s}" to:`, s);
    !i || i.trim() === s || await vs(s, i.trim());
  }), r("exList").querySelectorAll("button[data-xdel]").forEach((n) => n.onclick = async () => {
    const s = X();
    if (s) {
      if (!s.removeExercise(n.dataset.xdel)) {
        alert("Built-in Gym Log exercises can't be removed here.");
        return;
      }
      E = s.exerciseNames();
    } else
      E = E.filter((i) => i !== n.dataset.xdel), await I.saveExercises(E);
    de(), te();
  });
}
function $n(t) {
  document.querySelectorAll(".fl-tabs button").forEach((e) => e.classList.toggle("active", e.dataset.tab === t)), document.querySelectorAll(".fl-tab").forEach((e) => e.classList.toggle("active", e.id === `tab-${t}`)), t === "train" && W.resize(), t === "history" && ne();
}
function Ps() {
  document.querySelectorAll(".fl-tabs button").forEach((u) => u.onclick = () => $n(u.dataset.tab)), r("hdrExercise").onclick = () => {
    N.recording || fs(r("exercise"));
  };
  for (const u of ["exercise", "side", "protocol", "contraction", "handle", "links", "extKg"]) r(u).addEventListener("change", fe);
  fe();
  const t = JSON.parse(localStorage.getItem("ufl.scales") ?? "{}");
  r("scaleSel").innerHTML = '<option value="">Auto — first scale heard</option>' + Object.entries(t).map(([u, p]) => `<option value="${L(u)}">${L(nt(p))} · ${L(p)} (${L(u.slice(-5))})</option>`).join(""), r("scaleSel").value = localStorage.getItem("ufl.scaleId") ?? "", r("scaleSel").onchange = () => {
    const u = r("scaleSel").value;
    u ? localStorage.setItem("ufl.scaleId", u) : localStorage.removeItem("ufl.scaleId"), R instanceof pe && (R.useDevice(u || null), Ie("scanning"));
  }, r("btnConnect").onclick = async () => {
    if (R instanceof pe && (Y === "live" || Y === "scanning")) {
      await R.stop(), R = null, Ie("idle"), Et = !0;
      return;
    }
    Et = !1, r("simPanel").classList.add("hidden"), Q = null;
    const u = new pe();
    u.onSeen = () => {
      Pn(u), Qt(u);
    }, u.preferredId = localStorage.getItem("ufl.scaleId") || null, u.onDevice = (p, D) => {
      r("statusText").textContent = nt(D), Qt(u);
    }, St(u);
  }, r("btnSim").onclick = () => {
    Q = new zn(), Q.exact = r("simExact").checked, r("simPanel").classList.remove("hidden"), St(Q);
  }, r("simExact").onchange = (u) => {
    const p = u.target.checked;
    Q && (Q.exact = p), r("simHelp").textContent = p ? "Reading tracks the slider exactly." : 'Slide up to "push", back to 0 to rest. Fatigue is simulated.';
  }, r("btnTare").onclick = () => R?.tare(), r("btnStart").onclick = bs, r("camOn").checked = localStorage.getItem("ufl.camOn") === "1";
  const e = async () => {
    const u = r("camOn").checked;
    if (localStorage.setItem("ufl.camOn", u ? "1" : "0"), u) {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert("Camera not available here."), r("camOn").checked = !1;
        return;
      }
      Ke ?? (Ke = new ds(r("camVideo")));
      try {
        await Ke.start(), r("camPip").classList.remove("hidden"), r("btnCamFlip").classList.remove("hidden");
      } catch (p) {
        alert("Camera failed: " + p.message + `
Allow the Camera permission for UY Force Lab in Android settings.`), r("camOn").checked = !1;
      }
    } else
      Ke?.stop(), r("camPip").classList.add("hidden"), r("btnCamFlip").classList.add("hidden");
  };
  r("camOn").onchange = e, r("camOn").checked && e(), r("btnCamFlip").onclick = () => Ke?.flip();
  const n = r("camPip"), s = localStorage.getItem("ufl.pipPos");
  if (s) {
    const [u, p] = s.split(",").map(Number);
    n.style.left = `${u}px`, n.style.top = `${p}px`;
  }
  let i = null;
  n.onpointerdown = (u) => {
    const p = n.getBoundingClientRect();
    i = { x: u.clientX, y: u.clientY, l: p.left, t: p.top, moved: !1 }, n.setPointerCapture(u.pointerId);
  }, n.onpointermove = (u) => {
    if (!i) return;
    const p = u.clientX - i.x, D = u.clientY - i.y;
    if (Math.abs(p) + Math.abs(D) > 6 && (i.moved = !0), !i.moved) return;
    const P = n.getBoundingClientRect(), C = Math.min(window.innerWidth - P.width, Math.max(0, i.l + p)), T = Math.min(window.innerHeight - P.height, Math.max(0, i.t + D));
    n.style.left = `${C}px`, n.style.top = `${T}px`;
  }, n.onpointerup = () => {
    if (i) {
      if (i.moved) {
        const u = n.getBoundingClientRect();
        localStorage.setItem("ufl.pipPos", `${Math.round(u.left)},${Math.round(u.top)}`);
      } else n.classList.toggle("large");
      i = null;
    }
  }, r("btnStop").onclick = kn, r("simEffort").oninput = (u) => {
    const p = Number(u.target.value);
    Q && (Q.effort = p), r("simVal").textContent = String(p);
  }, r("exercise").onchange = M, ft(r("exercise"), { recent: gt, all: () => E, onCreate: Gt }), ft(r("maxExercise"), { recent: gt, all: () => E, onCreate: Gt }), ft(r("histExercise"), { recent: gt, all: () => E, allOption: { value: "", label: "All exercises" } }), r("btnNewEx").onclick = () => {
    r("newExBox").classList.remove("hidden"), r("newExName").focus();
  }, r("btnNewExCancel").onclick = () => {
    r("newExBox").classList.add("hidden"), r("newExName").value = "";
  };
  const a = async () => {
    const u = r("newExName").value.trim();
    if (u) {
      if (!E.includes(u)) {
        const p = X();
        p ? (p.addExercise(u), E = p.exerciseNames()) : (E.push(u), await I.saveExercises(E));
      }
      de(), r("exercise").value = u, r("newExBox").classList.add("hidden"), r("newExName").value = "", te(), await M();
    }
  };
  r("btnNewExSave").onclick = a, r("newExName").onkeydown = (u) => {
    u.key === "Enter" && a();
  }, r("side").onchange = M, r("contraction").onchange = M, r("zoneRef").value = localStorage.getItem("ufl.zoneRef") ?? "best", r("zoneRef").onchange = () => {
    localStorage.setItem("ufl.zoneRef", r("zoneRef").value), M();
  };
  const o = (u) => Math.max(1, Number(localStorage.getItem(`ufl.links.${u}`) ?? "1") || 1), c = () => {
    r("links").value = String(Math.min(8, o(r("exercise").value)));
  };
  r("exercise").addEventListener("change", () => {
    c(), fe();
  }), r("extKg").oninput = () => {
    fe(), M();
  };
  const d = (u) => Number(localStorage.getItem(`ufl.offset.${u}`) ?? "0") || 0, l = () => {
    r("offsetKg").value = String(d(r("exercise").value));
  };
  r("exercise").addEventListener("change", l), setTimeout(l, 0), r("offsetKg").oninput = () => localStorage.setItem(`ufl.offset.${r("exercise").value}`, String(Qe())), r("btnOffsetNow").onclick = () => {
    if (Y !== "live" && !Q) {
      alert("Connect the scale (or the simulator) first, then hang from it and tap again.");
      return;
    }
    r("offsetKg").value = (Math.round(gn * 10) / 10).toFixed(1), localStorage.setItem(`ufl.offset.${r("exercise").value}`, String(Qe()));
  }, r("links").onchange = () => {
    localStorage.setItem(`ufl.links.${r("exercise").value}`, String(Ne())), fe(), M();
  }, setTimeout(c, 0), r("preCount").value = localStorage.getItem("ufl.preCount") ?? "10", r("preCount").onchange = () => localStorage.setItem("ufl.preCount", String(Math.max(0, Number(r("preCount").value) || 0)));
  const h = r("handle"), f = localStorage.getItem("ufl.handle") ?? "";
  f && ![...h.options].some((u) => u.value === f) && h.insertAdjacentHTML("beforeend", `<option>${L(f)}</option>`), h.value = f;
  const m = JSON.parse(localStorage.getItem("ufl.handles") ?? "[]");
  for (const u of m) [...h.options].some((p) => p.value === u) || h.insertAdjacentHTML("beforeend", `<option>${L(u)}</option>`);
  h.onchange = () => {
    if (h.value === "__custom") {
      const u = (prompt("Handle / attachment name") ?? "").trim();
      if (!u) {
        h.value = localStorage.getItem("ufl.handle") ?? "";
        return;
      }
      [...h.options].some((p) => p.value === u) || (h.insertAdjacentHTML("beforeend", `<option>${L(u)}</option>`), m.push(u), localStorage.setItem("ufl.handles", JSON.stringify(m))), h.value = u;
    }
    localStorage.setItem("ufl.handle", h.value), fe(), M();
  }, r("protocol").onchange = () => yn(), r("params").oninput = () => r("protocolHelp").textContent = Re(r("protocol").value, ye()).describe;
  for (const u of ["zoneOn", "zoneLo", "zoneHi"]) r(u).oninput = M;
  r("ghostOn").checked = _e, r("ghostOn").onchange = (u) => {
    _e = u.target.checked, localStorage.setItem("ufl.ghostOn", _e ? "1" : "0"), M();
  }, r("histExercise").onchange = ne, r("btnCsv").onclick = () => wt(`uy-force-lab-${tn()}.csv`, ls(q), "text/csv"), r("btnJson").onclick = () => wt(`uy-force-lab-${tn()}.json`, JSON.stringify(q, null, 1), "application/json"), r("voiceOn").onchange = (u) => k.enabled = u.target.checked, r("keepAwake").checked = wn(), r("keepAwake").onchange = (u) => {
    localStorage.setItem("ufl.keepAwake", u.target.checked ? "1" : "0"), bn();
  }, r("autoConnect").checked = xn(), r("autoConnect").onchange = (u) => {
    localStorage.setItem("ufl.autoConnect", u.target.checked ? "1" : "0"), tt = !1, Lt();
  }, document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "hidden") {
      R instanceof pe && !N.recording && (await R.stop(), R = null, Ie("idle"), mt = !0);
      return;
    }
    (mt || Y === "idle" || Y === "error") && (mt = !1, tt = !1, Lt());
  }), k.rate = Number(Ee("ufl.voiceRate", "1.2")) || 1.2, k.pitch = Number(Ee("ufl.voicePitch", "1")) || 1;
  const v = (u, p, D, P) => {
    const C = r(u);
    C.value = String(P), r(u + "Val").textContent = P.toFixed(1) + "×", C.oninput = () => {
      const T = Number(C.value);
      D(T), localStorage.setItem(p, String(T)), r(u + "Val").textContent = T.toFixed(1) + "×";
    };
  };
  v("voiceRate", "ufl.voiceRate", (u) => k.rate = u, k.rate), v("voicePitch", "ufl.voicePitch", (u) => k.pitch = u, k.pitch), r("beepOn").onchange = (u) => U = u.target.checked, r("calloutEvery").value = String(ze), r("calloutEvery").onchange = (u) => {
    ze = Math.max(1, Number(u.target.value) || 1), localStorage.setItem("ufl.calloutEvery", String(ze));
  };
  const y = (u, p, D, P) => {
    const C = r(u);
    C.checked = P, C.onchange = () => {
      D(C.checked), localStorage.setItem(p, C.checked ? "1" : "0");
    };
  };
  y("calloutOn", "ufl.calloutOn", (u) => bt = u, bt), y("secBeep", "ufl.secBeep", (u) => xt = u, xt), y("secCount", "ufl.secCount", (u) => kt = u, kt);
  let b = null;
  k.onSpeak = (u) => {
    const p = r("said");
    p.textContent = `🔊 ${u}`, p.classList.add("on"), b && clearTimeout(b), b = setTimeout(() => p.classList.remove("on"), 900);
  }, document.addEventListener("pointerdown", () => k.unlock(), { once: !0 }), document.addEventListener("visibilitychange", () => {
    document.visibilityState === "visible" && k.reset();
  }), r("btnTestVoice").onclick = async () => {
    k.reset();
    const u = r("voiceStatus");
    u.textContent = await k.status(), k.say("Force lab voice check, 1, 2, 3", !0);
  }, r("btnSetMax").onclick = async () => {
    const u = Number(r("maxKg").value);
    u && (await I.setMax(ke(r("maxExercise").value, r("maxSide").value), u), r("maxKg").value = "", te(), M());
  }, r("btnAddEx").onclick = async () => {
    const u = r("newEx").value.trim();
    if (!(!u || E.includes(u))) {
      {
        const p = X();
        p ? (p.addExercise(u), E = p.exerciseNames()) : (E.push(u), await I.saveExercises(E));
      }
      r("newEx").value = "", de(), te();
    }
  };
}
function nt(t) {
  return /^(UY|IF_ISO)/i.test(t) ? "ESP32 scale" : t || "scale";
}
let Zt = 0;
function Qt(t) {
  const e = Date.now();
  if (e - Zt < 1e3) return;
  Zt = e;
  const n = r("scaleSel"), s = localStorage.getItem("ufl.scaleId") ?? "", i = [...t.seen.values()].filter((o) => o.kg !== null), a = JSON.parse(localStorage.getItem("ufl.scales") ?? "{}");
  for (const o of i) a[o.id] = o.name || o.id;
  localStorage.setItem("ufl.scales", JSON.stringify(a)), n.innerHTML = '<option value="">Auto — first scale heard</option>' + Object.entries(a).map(([o, c]) => `<option value="${L(o)}">${L(nt(c))} · ${L(c)} (${L(o.slice(-5))})${t.activeId === o ? " — active" : ""}</option>`).join(""), n.value = s;
}
let en = 0;
function Pn(t) {
  const e = Date.now();
  if (e - en < 1e3 || r("tab-settings").classList.contains("active") === !1) return;
  en = e;
  const n = [...t.seen.values()].sort((s, i) => i.t - s.t).slice(0, 12);
  r("seenBody").innerHTML = n.map((s) => `<tr><td>${L(s.name || "(no name)")}<br><small class="muted">${L(s.id)}</small></td><td>${s.rssi}</td><td>${L(s.keys || "–")}</td><td style="white-space:normal;font-family:monospace;font-size:11px">${L(s.hex || "–")}</td><td>${s.kg === null ? "–" : s.kg.toFixed(2)}</td></tr>`).join("") || '<tr><td colspan="5" class="muted">Listening… nothing heard yet.</td></tr>';
}
function O(t) {
  return t >= 100 ? t.toFixed(0) : t.toFixed(1);
}
function On(t) {
  const e = Math.floor(t / 60), n = Math.floor(t % 60);
  return `${e}:${n.toString().padStart(2, "0")}`;
}
function tn() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function L(t) {
  return t.replace(/[&<>"]/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[e]);
}
ys();
window.ForceLab = {
  onShow() {
    W.resize(), Lt();
  },
  // called by the host after it renamed an exercise in its own data
  renameExercise(t, e) {
    mn(t, e).then(async () => {
      E = X()?.exerciseNames() ?? E, de(), te(), ne(), await M();
    });
  }
};
async function Os(t, e, n) {
  let s;
  return Promise.race([
    t,
    new Promise((i, a) => {
      s = setTimeout(() => a(n), e);
    })
  ]).finally(() => clearTimeout(s));
}
class Ds extends oe {
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
        manufacturerData: qt(e.manufacturerData),
        serviceData: qt(e.serviceData),
        uuids: (i = e.uuids) === null || i === void 0 ? void 0 : i.map(Un)
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
      await Os(i.gatt.connect(), o, a);
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
    typeof e.value == "string" ? s = Ae(e.value) : s = e.value, await n?.writeValueWithResponse(at(s));
  }
  async writeWithoutResponse(e) {
    const n = await this.getCharacteristic(e);
    let s;
    typeof e.value == "string" ? s = Ae(e.value) : s = e.value, await n?.writeValueWithoutResponse(at(s));
  }
  async readDescriptor(e) {
    const n = await this.getDescriptor(e);
    return { value: await n?.readValue() };
  }
  async writeDescriptor(e) {
    const n = await this.getDescriptor(e);
    let s;
    typeof e.value == "string" ? s = Ae(e.value) : s = e.value, await n?.writeValue(at(s));
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
const Ts = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BluetoothLeWeb: Ds
}, Symbol.toStringTag, { value: "Module" }));
class As extends oe {
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
const Ms = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  TextToSpeechWeb: As
}, Symbol.toStringTag, { value: "Module" }));
class _s extends oe {
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
const Is = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  KeepAwakeWeb: _s
}, Symbol.toStringTag, { value: "Module" }));
class Rs extends oe {
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
const Fs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PreferencesWeb: Rs
}, Symbol.toStringTag, { value: "Module" }));
function nn(t) {
  const e = t.split("/").filter((s) => s !== "."), n = [];
  return e.forEach((s) => {
    s === ".." && n.length > 0 && n[n.length - 1] !== ".." ? n.pop() : n.push(s);
  }), n.join("/");
}
function Ns(t, e) {
  t = nn(t), e = nn(e);
  const n = t.split("/"), s = e.split("/");
  return t !== e && n.every((i, a) => i === s[a]);
}
class st extends oe {
  constructor() {
    super(...arguments), this.DB_VERSION = 1, this.DB_NAME = "Disc", this._writeCmds = ["add", "put", "delete"], this.downloadFile = async (e) => {
      var n, s;
      const i = sn(e, e.webFetchExtra), a = await fetch(e.url, i);
      let o;
      if (!e.progress)
        o = await a.blob();
      else if (!a?.body)
        o = new Blob();
      else {
        const d = a.body.getReader();
        let l = 0;
        const h = [], f = a.headers.get("content-type"), m = parseInt(a.headers.get("content-length") || "0", 10);
        for (; ; ) {
          const { done: b, value: u } = await d.read();
          if (b)
            break;
          h.push(u), l += u?.length || 0;
          const p = {
            url: e.url,
            bytes: l,
            contentLength: m
          };
          this.notifyListeners("progress", p);
        }
        const v = new Uint8Array(l);
        let y = 0;
        for (const b of h)
          typeof b > "u" || (v.set(b, y), y += b.length);
        o = new Blob([v.buffer], { type: f || void 0 });
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
      s.onupgradeneeded = st.doUpgrade, s.onsuccess = () => {
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
        const m = c.substr(f);
        await this.mkdir({
          path: m,
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
        const m = a.substr(f);
        await this.mkdir({
          path: m,
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
    if (Ns(c, d))
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
      const b = y.join("/");
      if (y.length > 0 && (await this.stat({
        path: b,
        directory: s
      })).type !== "directory")
        throw new Error("Parent directory of the to path is a file");
    }
    if (l && l.type === "directory")
      throw new Error("Cannot overwrite a directory with a file");
    const h = await this.stat({
      path: a,
      directory: o
    }), f = async (v, y, b) => {
      const u = this.getPath(s, v), p = await this.dbRequest("get", [u]);
      p.ctime = y, p.mtime = b, await this.dbRequest("put", [p]);
    }, m = h.ctime ? h.ctime : Date.now();
    switch (h.type) {
      case "file": {
        const v = await this.readFile({
          path: a,
          directory: o
        });
        n && await this.deleteFile({
          path: a,
          directory: o
        });
        let y;
        !(v.data instanceof Blob) && !this.isBase64String(v.data) && (y = Je.UTF8);
        const b = await this.writeFile({
          path: i,
          directory: s,
          data: v.data,
          encoding: y
        });
        return n && await f(i, m, h.mtime), b;
      }
      case "directory": {
        if (l)
          throw Error("Cannot move a directory over an existing object");
        try {
          await this.mkdir({
            path: i,
            directory: s,
            recursive: !1
          }), n && await f(i, m, h.mtime);
        } catch {
        }
        const v = (await this.readdir({
          path: a,
          directory: o
        })).files;
        for (const y of v)
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
st._debug = !0;
const Bs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  FilesystemWeb: st
}, Symbol.toStringTag, { value: "Module" }));
class qs extends oe {
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
  ShareWeb: qs
}, Symbol.toStringTag, { value: "Module" }));
