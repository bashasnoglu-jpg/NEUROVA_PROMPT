;(function () {
  "use strict";

  const DEFAULTS = {
    enabled: true,
    endpoint: "",
    apiKey: "",
    sendPII: false,
    sendNote: false,
    sendMessage: false,
    rateLimitMs: 3000,
    queueKey: "NV_RES_CRM_QUEUE_V1",
    maxQueue: 100,
    flushIntervalMs: 15000,
    timeoutMs: 8000,
  };

  window.__NV_CRM_LAST__ = window.__NV_CRM_LAST__ || {
    lastOkAt: null,
    lastErrAt: null,
    lastErr: null,
    lastStatus: null,
  };

function nvCrmMarkOk(info) {
  try {
    window.__NV_CRM_LAST__.lastOkAt = new Date().toISOString();
    window.__NV_CRM_LAST__.lastStatus = "ok";
    window.__NV_CRM_LAST__.lastErr = null;
    if (info && typeof info === "object") {
      window.__NV_CRM_LAST__.lastHttpStatus =
        info.status ?? window.__NV_CRM_LAST__.lastHttpStatus ?? null;
      window.__NV_CRM_LAST__.lastLatencyMs =
        info.latencyMs ?? window.__NV_CRM_LAST__.lastLatencyMs ?? null;
    }
  } catch (_) {}
}

function nvCrmMarkErr(err) {
  try {
    window.__NV_CRM_LAST__.lastErrAt = new Date().toISOString();
    window.__NV_CRM_LAST__.lastStatus = "err";
    window.__NV_CRM_LAST__.lastErr = String(err && err.message ? err.message : err);
    if (err && typeof err === "object") {
      window.__NV_CRM_LAST__.lastHttpStatus =
        err.httpStatus ?? window.__NV_CRM_LAST__.lastHttpStatus ?? null;
      window.__NV_CRM_LAST__.lastLatencyMs =
        err.latencyMs ?? window.__NV_CRM_LAST__.lastLatencyMs ?? null;
    }
  } catch (_) {}
}

  function nvCrmMarkQueued(err) {
    try {
      window.__NV_CRM_LAST__.lastStatus = "queued";
      if (err) nvCrmMarkErr(err);
    } catch (_) {}
  }

  function getCfg() {
    const o =
      window.NV_RES_CRM_CONFIG && typeof window.NV_RES_CRM_CONFIG === "object"
        ? window.NV_RES_CRM_CONFIG
        : {};
    return { ...DEFAULTS, ...o };
  }

  function isDebug() {
    try {
      return (
        location.search.includes("debug=1") ||
        localStorage.getItem("NV_DEBUG") === "1"
      );
    } catch (_) {
      return false;
    }
  }

  function safeParse(s, fallback) {
    try {
      return JSON.parse(s);
    } catch (_) {
      return fallback;
    }
  }

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_) {
      return "";
    }
  }

  function pickRefSourceFromNote(note) {
    const n = String(note || "");
    const ref = (n.match(/Ref:\s*([^\n]+)/i) || ["", ""])[1] || "";
    const source = (n.match(/Source:\s*([^\n]+)/i) || ["", ""])[1] || "";
    return { ref, source };
  }

  function qRead() {
    const cfg = getCfg();
    const raw = localStorage.getItem(cfg.queueKey);
    const arr = safeParse(raw || "[]", []);
    return Array.isArray(arr) ? arr : [];
  }

  function qWrite(arr) {
    const cfg = getCfg();
    localStorage.setItem(cfg.queueKey, JSON.stringify(arr));
  }

  function qPush(item) {
    const cfg = getCfg();
    const arr = qRead();
    arr.push(item);
    while (arr.length > cfg.maxQueue) arr.shift();
    qWrite(arr);
  }

  function qShift() {
    const arr = qRead();
    const first = arr.shift();
    qWrite(arr);
    return first || null;
  }

  let __lastSig = "";
  let __lastAt = 0;

  function mkSig(entry) {
    const p = entry.payload || {};
    return `${entry.type || ""}|${entry.url || ""}|${p.program || ""}|${
      p.ref || ""
    }|${p.source || ""}`;
  }

  async function postJSON(url, body, cfg) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), cfg.timeoutMs);
    const t0 = Date.now();

    try {
      const headers = { "Content-Type": "application/json" };
      if (cfg.apiKey) headers["Authorization"] = `Bearer ${cfg.apiKey}`;

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: ctrl.signal,
        keepalive: true,
      });

      const latencyMs = Date.now() - t0;
      const status = res.status;

      if (!res.ok) {
        const err = new Error("HTTP " + status);
        err.httpStatus = status;
        err.latencyMs = latencyMs;
        throw err;
      }

      return { ok: true, status, latencyMs };
    } finally {
      clearTimeout(t);
    }
  }

  function normalizeEntry(type, payload) {
    const p =
      payload && typeof payload === "object" ? payload : { value: payload };

    const derived = pickRefSourceFromNote(p.note);
    const ref = p.ref || derived.ref || "";
    const source = p.source || derived.source || "";

    const sessionId =
      window.__NV_RES_SESSION__ ||
      (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `sess-${Date.now()}-${Math.floor(Math.random() * 1000)}`);

    const base = {
      ts: nowIso(),
      type: String(type || "open"),
      url: location.href,
      payload: {
        program: p.program || "",
        ref,
        source,
        sessionId,
      },
    };

    const cfg = getCfg();
    if (cfg.sendNote) base.payload.note = p.note || "";
    if (cfg.sendMessage) base.payload.message = p.message || p.text || "";
    if (cfg.sendPII) {
      if (p.name) base.payload.name = p.name;
      if (p.phone) base.payload.phone = p.phone;
    }

    return base;
  }

  async function process(type, payload) {
    const cfg = getCfg();
    if (!cfg.enabled) return;
    if (!cfg.endpoint) {
      if (isDebug()) console.warn("[NV][CRM] endpoint missing; skipping");
      return;
    }

    const entry = normalizeEntry(type, payload);

    const sig = mkSig(entry);
    const t = Date.now();
    if (__lastSig === sig && t - __lastAt < cfg.rateLimitMs) {
      if (isDebug()) console.log("[NV][CRM] rate-limited");
      return;
    }
    __lastSig = sig;
    __lastAt = t;

    try {
      const info = await postJSON(cfg.endpoint, entry, cfg);
      nvCrmMarkOk(info);
      if (isDebug()) console.log("[NV][CRM] sent", entry.type, entry.payload.ref);
    } catch (err) {
      nvCrmMarkQueued(err);
      try {
        qPush(entry);
      } catch (_) {}
      if (isDebug())
        console.warn(
          "[NV][CRM] queued (send failed):",
          String((err && err.message) || err)
        );
    }
  }

  const prev = window.NV_ON_RESERVATION_EVENT;
  window.NV_ON_RESERVATION_EVENT = function (event) {
    try {
      if (typeof prev === "function") prev(event);
    } catch (_) {}
    if (event && typeof event === "object") {
      process(event.type, event.payload);
    }
  };

  const prevOpen = window.NV_ON_RESERVATION_OPEN;
  window.NV_ON_RESERVATION_OPEN = function (payload) {
    try {
      if (typeof prevOpen === "function") prevOpen(payload);
    } catch (_) {}
    process("open", payload);
  };

  function startFlush() {
    const cfg = getCfg();
    if (window.__NV_CRM_FLUSH_TIMER__) return;
    window.__NV_CRM_FLUSH_TIMER__ = true;

    setInterval(async () => {
      const cfg2 = getCfg();
      if (!cfg2.enabled || !cfg2.endpoint) return;

      for (let i = 0; i < 5; i++) {
        const item = qShift();
        if (!item) break;
        try {
          const info = await postJSON(cfg2.endpoint, item, cfg2);
          nvCrmMarkOk(info);
          if (isDebug()) console.log("[NV][CRM] flushed", item.type, item.payload?.ref || "");
        } catch (err) {
          try {
            qPush(item);
          } catch (_) {}
          nvCrmMarkErr(err);
          if (isDebug()) console.warn("[NV][CRM] flush failed; will retry later");
          break;
        }
      }
    }, cfg.flushIntervalMs);
  }

  try {
    startFlush();
  } catch (_) {}

  window.NV_CRM_FLUSH_NOW = async function () {
    const cfg2 = getCfg();
    if (!cfg2.enabled || !cfg2.endpoint) return;

    for (let i = 0; i < 20; i++) {
      const item = qShift();
      if (!item) break;
      try {
        const info = await postJSON(cfg2.endpoint, item, cfg2);
        nvCrmMarkOk(info);
      } catch (err) {
        try { qPush(item); } catch (_) {}
        nvCrmMarkErr(err);
        throw err;
      }
    }
  };

  window.NV_CRM_PURGE_QUEUE = function () {
    const cfg = getCfg();
    try {
      const key = cfg.queueKey || "NV_RES_CRM_QUEUE_V1";
      const raw = localStorage.getItem(key);
      const arr = raw ? safeParse(raw, []) : [];
      const n = Array.isArray(arr) ? arr.length : 0;
      localStorage.removeItem(key);
      return { ok: true, removed: n, key };
    } catch (err) {
      return { ok: false, removed: 0, error: String(err && err.message ? err.message : err) };
    }
  };

  // --- Debug/ops helper: purge CRM queue (PII-free) ---
  window.NV_CRM_PURGE_QUEUE = function () {
    const cfg = getCfg();
    try {
      const key = cfg.queueKey || "NV_RES_CRM_QUEUE_V1";
      const raw = localStorage.getItem(key);
      let n = 0;
      try {
        const arr = raw ? JSON.parse(raw) : [];
        n = Array.isArray(arr) ? arr.length : 0;
      } catch (_) {
        n = 0;
      }

      localStorage.removeItem(key);
      return { ok: true, removed: n, key };
    } catch (err) {
      return {
        ok: false,
        removed: 0,
        error: String(err && err.message ? err.message : err),
      };
    }
  };
})();

