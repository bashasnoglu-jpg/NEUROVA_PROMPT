;(function () {
  "use strict";

  const KEY = "NV_RES_LOG_V1";
  const MAX = 50;
  const DEDUPE_MS = 3000;
  let __lastSig = "";
  let __lastAt = 0;
  window.__NV_RES_SESSION__ =
    window.__NV_RES_SESSION__ ||
    (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `sess-${Date.now()}-${Math.floor(Math.random() * 1000)}`);

  function stableStringify(obj) {
    try {
      const seen = new WeakSet();
      return JSON.stringify(obj, function (k, v) {
        if (v && typeof v === "object") {
          if (seen.has(v)) return "[Circular]";
          seen.add(v);
          if (!Array.isArray(v)) {
            const out = {};
            Object.keys(v)
              .sort()
              .forEach((key) => {
                out[key] = v[key];
              });
            return out;
          }
        }
        return v;
      });
    } catch (_) {
      return String(obj);
    }
  }

  function mkSig(entry) {
    return (
      (entry.type || "") +
      "|" +
      (entry.url || "") +
      "|" +
      stableStringify(entry.payload || {})
    );
  }

  function isDebug() {
    try {
      return location.search.includes("debug=1") || localStorage.getItem("NV_DEBUG") === "1";
    } catch (_) {
      return false;
    }
  }

  function safeJsonParse(s, fallback) {
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

  function pushLog(entry) {
    const raw = localStorage.getItem(KEY);
    const parsed = Array.isArray(raw ? safeJsonParse(raw, []) : []) ? safeJsonParse(raw, []) : [];
    parsed.push(entry);
    while (parsed.length > MAX) parsed.shift();
    localStorage.setItem(KEY, JSON.stringify(parsed));
  }

  function processEntry(entry) {
    const e = entry && typeof entry === "object" ? { ...entry } : { payload: entry };
    e.type = e.type || "open";
    e.url = e.url || location.href;
    e.ts = e.ts || nowIso();
    e.payload = e.payload || {};
    e.payload.sessionId = window.__NV_RES_SESSION__;

    const sig = mkSig(e);
    const t = Date.now();

    if (__lastSig === sig && t - __lastAt < DEDUPE_MS) {
      if (isDebug()) {
        console.log(`[NV][RES][${String(e.type).toUpperCase()}] deduped`);
      }
      return;
    }

    __lastSig = sig;
    __lastAt = t;

    try {
      pushLog(e);
    } catch (_) {}

    if (isDebug()) {
      console.log(`[NV][RES][${String(e.type).toUpperCase()}]`, e);
    }
  }

  const prev = window.NV_ON_RESERVATION_OPEN;
  window.NV_ON_RESERVATION_OPEN = function (payload) {
    try {
      if (typeof prev === "function") prev(payload);
    } catch (_) {}

    processEntry({
      type: "open",
      payload: payload && typeof payload === "object" ? payload : { value: payload },
    });
  };

  const prevEvent = window.NV_ON_RESERVATION_EVENT;
  window.NV_ON_RESERVATION_EVENT = function (event) {
    try {
      if (typeof prevEvent === "function") prevEvent(event);
    } catch (_) {}

    processEntry(event);
  };

  window.NV_RES_LOG_DUMP = function () {
    return safeJsonParse(localStorage.getItem(KEY) || "[]", []);
  };

  window.NV_RES_LOG_CLEAR = function () {
    localStorage.removeItem(KEY);
    if (isDebug()) console.log("[NV][RES] log cleared");
  };

  function nvCsvEscape(v) {
    const s = String(v ?? "");
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  }

  function nvBuildCsvText(rows, columns) {
    const cols = Array.isArray(columns) ? columns : [];
    const lines = [];
    lines.push(cols.map(nvCsvEscape).join(","));
    for (const row of Array.isArray(rows) ? rows : []) {
      lines.push(
        cols
          .map((col) => nvCsvEscape(row && typeof row === "object" ? row[col] : ""))
          .join(",")
      );
    }
    return lines.join("\n") + "\n";
  }

  if (typeof window !== "undefined") {
    window.nvBuildCsvText = nvBuildCsvText;
  }

  window.NV_RES_LOG_EXPORT_CSV = function (filename, opts) {
    const rows = window.NV_RES_LOG_DUMP();
    const name =
      filename || "nv-res-log-" + new Date().toISOString().slice(0, 10) + ".csv";
    const normalizedOpts = opts && typeof opts === "object" ? opts : {};

    const columns = [
      "ts",
      "url",
      "sessionId",
      "program",
      "ref",
      "source",
      "note",
      "crmLastLatencyMs",
      "crmLastHttpStatus",
    ];

    const normalizedRows = (Array.isArray(rows) ? rows : []).map((r) => {
      const p = r && r.payload && typeof r.payload === "object" ? r.payload : {};
      const program = p.program || "";
      const note = p.note || "";
      const ref =
        (String(note).match(/Ref:\s*([^\n]+)/i) || ["", ""])[1] || "";
      const source =
        (String(note).match(/Source:\s*([^\n]+)/i) || ["", ""])[1] || "";
      const crmLatency =
        window.__NV_CRM_LAST__ && window.__NV_CRM_LAST__.lastLatencyMs != null
          ? String(Math.round(window.__NV_CRM_LAST__.lastLatencyMs))
          : "";
      const crmStatus =
        window.__NV_CRM_LAST__ && window.__NV_CRM_LAST__.lastHttpStatus != null
          ? String(window.__NV_CRM_LAST__.lastHttpStatus)
          : "";

      return {
        ts: r.ts || "",
        url: r.url || "",
        sessionId: (r.payload && r.payload.sessionId) || "",
        program,
        ref,
        source,
        note,
        crmLastLatencyMs: crmLatency,
        crmLastHttpStatus: crmStatus,
      };
    });

    const csvText = nvBuildCsvText(normalizedRows, columns);
    if (normalizedOpts.returnOnly) {
      return csvText;
    }

    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 0);
  };
})();
