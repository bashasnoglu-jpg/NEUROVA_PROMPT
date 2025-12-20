"use strict";

/**
 * Health panel v1.1
 * - F9 ile aç/kapat
 * - Root badge + errors counter
 */
(function () {
  const FLAG = "__NV_HEALTH_V1__";
  if (window[FLAG]) return;
  window[FLAG] = true;

  function resolveProdSafeDebugMode() {
    if (typeof window === "undefined" || typeof window.location === "undefined") return false;
    let params;
    try {
      params = new URLSearchParams(window.location.search);
    } catch (_) {
      return false;
    }
    if (params.get("debug") !== "1") return false;

    try {
      if (window.localStorage.getItem("NV_DEBUG") !== "1") return false;
    } catch (_) {
      return false;
    }

    const host = window.location.hostname || "";
    return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
  }

  const existingFlag = window.__NV_PROD_SAFE_DEBUG__;
  const existingFn = window.__NV_PROD_SAFE_DEBUG_FN__;

  const PROD_SAFE_DEBUG_MODE =
    typeof existingFlag === "boolean"
      ? existingFlag
      : (typeof existingFn === "function"
          ? existingFn()
          : resolveProdSafeDebugMode());

  if (typeof window.__NV_PROD_SAFE_DEBUG__ !== "boolean") {
    window.__NV_PROD_SAFE_DEBUG__ = PROD_SAFE_DEBUG_MODE;
  }
  if (typeof existingFn !== "function") {
    window.__NV_PROD_SAFE_DEBUG_FN__ = resolveProdSafeDebugMode;
  }

  if (!PROD_SAFE_DEBUG_MODE) {
    window.nvInitHealth = function nvInitHealth() {};
    return;
  }

  const NV_I18N = {
    tr: {
      dedupe_ok: "Dedupe: OK",
      dedupe_warn: (n, p) => `Dedupe: ${n} tekrar (policy=${p})`,
      overwrite_desc: "Overwrite: Aynı ID varsa son yüklenen prompt geçerli olur.",
      ignore_desc: "Ignore: Aynı ID varsa ilk prompt korunur, sonrakiler yok sayılır.",
      confirm_overwrite:
        "Dedupe policy OVERWRITE olarak değiştirilsin mi?\n\nAynı ID’li prompt’larda SON yüklenen geçerli olur.",
      confirm_ignore:
        "Dedupe policy IGNORE olarak değiştirilsin mi?\n\nAynı ID’li prompt’larda İLK yüklenen korunur, sonrakiler yok sayılır.",
      copy_dedupe: "Dedupe Raporunu Kopyala",
      copied: "Kopyalandı ✓",
    },
    en: {
      dedupe_ok: "Dedupe: OK",
      dedupe_warn: (n, p) => `Dedupe: ${n} dup (policy=${p})`,
      overwrite_desc: "Overwrite: last loaded prompt wins on duplicate IDs.",
      ignore_desc: "Ignore: first prompt wins; later duplicates are ignored.",
      confirm_overwrite:
        "Switch dedupe policy to OVERWRITE?\n\nOn duplicate IDs, the LAST loaded prompt wins.",
      confirm_ignore:
        "Switch dedupe policy to IGNORE?\n\nOn duplicate IDs, the FIRST prompt wins; later ones are ignored.",
      copy_dedupe: "Copy Dedupe Report",
      copied: "Copied ✓",
    },
  };

  function nvLang() {
    return document.documentElement.lang === "tr" ? "tr" : "en";
  }

  function nvRootBadge() {
    const ok = window.__NV_ROOT_OK__;
    if (ok === true) return `<span class="nv-badge ok">ROOT: OK</span>`;
    if (ok === false) return `<span class="nv-badge bad">ROOT: FAIL</span>`;
    return `<span class="nv-badge warn">ROOT: ?</span>`;
  }

  function nvErrorsBadge() {
    let n = 0;
    try {
      n = Object.keys(window.__NV_PACK_ERRORS__ || {}).length;
    } catch (_) {}
    const cls = n > 0 ? "bad" : "ok";
    return `<span class="nv-badge ${cls}">ERRORS: ${n}</span>`;
  }

  function getDedupeBadge() {
    const d = window.__NV_DEDUPE__;
    const policy = d?.policy || window.__NV_DEDUPE_POLICY__ || "overwrite";
    const L = NV_I18N[nvLang()];
    const title = policy === "overwrite" ? L.overwrite_desc : L.ignore_desc;

    if (!Array.isArray(d?.duplicates) || d.duplicates.length === 0) {
      return `<span class="nv-badge ok" title="${title}">${L.dedupe_ok}</span>`;
    }

    const n = d.duplicates.length;
    return `<span class="nv-badge warn" title="${title}">${L.dedupe_warn(n, policy)}</span>`;
  }

  function getDedupeDetailsHTML() {
    const d = window.__NV_DEDUPE__;
    if (!d || !Array.isArray(d.duplicates) || d.duplicates.length === 0) return "";
    const rows = d.duplicates
      .slice(0, 6)
      .map((x) => `<div class="nv-health-row"><span class="nv-health-key"><code>${String(x.id)}</code></span><span class="nv-health-val">${x.count}×</span></div>`)
      .join("");
    const more = d.duplicates.length > 6 ? `<div class="nv-health-note">+${d.duplicates.length - 6} more duplicate id(s)…</div>` : "";
    return `<div class="nv-health-row" style="flex-direction:column;gap:4px;margin-top:6px;border-top:1px solid rgba(0,0,0,.1);padding-top:6px;">${rows}${more}</div>`;
  }

  function nvCopyToClipboard(text) {
    if (!text) return Promise.resolve(false);
    if (navigator?.clipboard?.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve) => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand?.("copy");
      document.body.removeChild(ta);
      resolve(true);
    });
  }

  function nvGetLastResEvent() {
    try {
      if (typeof window.NV_RES_LOG_DUMP !== "function") return null;
      const arr = window.NV_RES_LOG_DUMP();
      if (!Array.isArray(arr) || arr.length === 0) return null;
      return arr[arr.length - 1];
    } catch (_) {
      return null;
    }
  }

  function nvFormatAge(ms) {
    if (!isFinite(ms) || ms < 0) return "—";
    const s = Math.floor(ms / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}m ${r}s`;
  }

  function nvFormatIsoAge(iso) {
    if (!iso) return null;
    const d = Date.parse(iso);
    if (!isFinite(d)) return null;
    const age = Date.now() - d;
    return nvFormatAge(age);
  }

  function nvShortSessionId() {
    try {
      const sid = String(window.__NV_RES_SESSION__ || "").trim();
      if (!sid) return "";
      return sid.slice(0, 4) + "…" + sid.slice(-4);
    } catch (_) {
      return "";
    }
  }

  function nvStartLastEventAgeTicker() {
    const elAge = document.getElementById("nv-last-event-age");
    if (!elAge) return;
    if (window.__NV_LAST_EVENT_AGE_TICKER__) return;
    window.__NV_LAST_EVENT_AGE_TICKER__ = true;

    setInterval(() => {
      const last = nvGetLastResEvent();
      if (!last || !last.ts) {
        elAge.textContent = "Last event age: —";
        return;
      }
      const t = Date.parse(last.ts);
    const age = Date.now() - t;
    elAge.textContent = `Last event age: ${nvFormatAge(age)}`;
  }, 1000);
}

  function nvGetSessionCounts() {
    try {
      const sid = window.__NV_RES_SESSION__;
      if (!sid) return null;
      if (typeof window.NV_RES_LOG_DUMP !== "function") return null;

      const arr = window.NV_RES_LOG_DUMP();
      if (!Array.isArray(arr) || arr.length === 0) return { open: 0, copy: 0, wa_send: 0 };

      let open = 0,
        copy = 0,
        wa_send = 0;

      for (const e of arr) {
        const esid = e.sessionId || e.payload?.sessionId;
        if (esid !== sid) continue;

        const t = String(e.type || "").toLowerCase();
        if (t === "open") open++;
        else if (t === "copy") copy++;
        else if (t === "wa_send") wa_send++;
      }

      return { open, copy, wa_send };
    } catch (_) {
      return null;
    }
  }

  function nvStartSessionSummaryTicker() {
    const el = document.getElementById("nv-session-summary");
    if (!el) return;
    if (window.__NV_SESSION_SUMMARY_TICKER__) return;
    window.__NV_SESSION_SUMMARY_TICKER__ = true;

    setInterval(() => {
      const c = nvGetSessionCounts();
      if (!c) {
        el.textContent = "This session: —";
        return;
      }
      el.textContent = `This session: open ${c.open} • copy ${c.copy} • wa_send ${c.wa_send}`;
    }, 1000);
  }

  function nvGetTopRefs(opts) {
    try {
      const N = (opts && opts.N) || 200;
      const limit = (opts && opts.limit) || 5;

      if (typeof window.NV_RES_LOG_DUMP !== "function") return null;

      const arr = window.NV_RES_LOG_DUMP();
      if (!Array.isArray(arr) || arr.length === 0)
        return { N, items: [], total: 0 };

      const slice = arr.slice(-N);
      const counts = new Map();
      const labelByRef = new Map();

      for (const e of slice) {
        const p = e && e.payload && typeof e.payload === "object" ? e.payload : {};
        const note = String(p.note || "");
        const ref =
          p.ref ||
          (note.match(/Ref:\\s*([^\\n]+)/i) || ["", ""])[1] ||
          "";

        const refClean = String(ref || "").trim();
        if (!refClean) continue;

        counts.set(refClean, (counts.get(refClean) || 0) + 1);

        const program = String(p.program || "").trim();
        if (program && !labelByRef.has(refClean)) labelByRef.set(refClean, program);
      }

      const items = [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([ref, count]) => ({
          ref,
          count,
          program: labelByRef.get(ref) || "",
        }));

      return { N, items, total: slice.length };
    } catch (_) {
      return null;
    }
  }

  function nvStartTopRefsTicker() {
    const listEl = document.getElementById("nv-top-refs-list");
    const metaEl = document.getElementById("nv-top-refs-meta");
    if (!listEl || !metaEl) return;
    if (window.__NV_TOPREFS_TICKER__) return;
    window.__NV_TOPREFS_TICKER__ = true;

    setInterval(() => {
      const r = nvGetTopRefs({ N: 200, limit: 5 });

      if (!r) {
        metaEl.textContent = "last 200 • —";
        listEl.innerHTML = `<li class="nv-h-muted">—</li>`;
        return;
      }

      metaEl.textContent = `last ${r.N} • refs=${r.items.length}`;

      if (!r.items.length) {
        listEl.innerHTML = `<li class="nv-h-muted">No refs yet</li>`;
        return;
      }

      listEl.innerHTML = r.items
        .map((it) => {
          const label = it.program
            ? ` — <span class="nv-h-muted">${esc(it.program)}</span>`
            : "";
          return `<li><code>${esc(it.ref)}</code> <span class="nv-h-muted">(${it.count})</span>${label}</li>`;
        })
        .join("");
    }, 2000);
  }

  function nvGetCrmQueueSize() {
    try {
      const cfg =
        window.NV_RES_CRM_CONFIG && typeof window.NV_RES_CRM_CONFIG === "object"
          ? window.NV_RES_CRM_CONFIG
          : {};
      const key = cfg.queueKey || "NV_RES_CRM_QUEUE_V1";
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.length : 0;
    } catch (_) {
      return null;
    }
  }

  function nvStartCrmQueueTicker() {
    const el = document.getElementById("nv-crm-queue-size");
    if (!el) return;
    if (window.__NV_CRM_QUEUE_TICKER__) return;
    window.__NV_CRM_QUEUE_TICKER__ = true;

    setInterval(() => {
      const n = nvGetCrmQueueSize();
      el.textContent =
        n === null ? "CRM queue: —" : `CRM queue: ${n}`;
    }, 1000);
  }

  function nvStartCrmFlushMaxLabel() {
    const el = document.getElementById("nv-crm-flush-max");
    if (!el) return;
    const cfg = window.NV_RES_CRM_CONFIG || {};
    const max = cfg.flushNowMax || 20;
    el.textContent = `Flush max: ${max}`;
  }

  function nvEnsureCrmQueueControls() {
    try {
      const flushBtn = document.querySelector("[data-nv-crm-flush]");
      if (!flushBtn) return;
      const row = flushBtn.parentElement;
      if (!row) return;
      if (row.querySelector("#nv-crm-flush-max") && row.querySelector("[data-nv-crm-purge]")) return;

      const maxEl = document.createElement("span");
      maxEl.id = "nv-crm-flush-max";
      maxEl.className = "nv-h-muted";
      maxEl.style.marginLeft = "8px";
      row.insertBefore(maxEl, flushBtn);

      const purgeBtn = document.createElement("button");
      purgeBtn.type = "button";
      purgeBtn.className = flushBtn.className || "nv-btn";
      purgeBtn.setAttribute("data-nv-crm-purge", "");
      purgeBtn.textContent = "Purge CRM queue";
      purgeBtn.style.marginLeft = "8px";
      row.appendChild(purgeBtn);

      nvStartCrmFlushMaxLabel();
    } catch (_) {}
  }

  let __nvPurgeArmAt = 0;

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-nv-crm-purge]");
    if (!btn) return;

    const now = Date.now();
    if (now - __nvPurgeArmAt > 2500) {
      __nvPurgeArmAt = now;
      if (typeof flashNote === "function") flashNote("Purge armed: click again to confirm");
      return;
    }
    __nvPurgeArmAt = 0;

    if (typeof window.NV_CRM_PURGE_QUEUE !== "function") {
      if (typeof flashNote === "function") flashNote("CRM purge unavailable (module not loaded)");
      return;
    }

    const res = window.NV_CRM_PURGE_QUEUE();
    if (res && res.ok) {
      if (typeof flashNote === "function") flashNote(`Purged CRM queue (n=${res.removed})`);
    } else {
      if (typeof flashNote === "function") flashNote("CRM purge failed");
    }
  });

  function nvGetCrmStatus() {
    try {
      const cfg =
        window.NV_RES_CRM_CONFIG && typeof window.NV_RES_CRM_CONFIG === "object"
          ? window.NV_RES_CRM_CONFIG
          : {};
      const enabled = cfg.enabled !== false;
      const endpoint = String(cfg.endpoint || "").trim();
      const elQueue = nvGetCrmQueueSize();

      if (!enabled) return { text: "CRM: disabled", tone: "muted" };
      const last = window.__NV_CRM_LAST__ || null;
      if (last && (last.lastOkAt || last.lastErrAt)) {
        const parts = [];
        const okAge = nvFormatIsoAge(last.lastOkAt);
        const errAge = nvFormatIsoAge(last.lastErrAt);
        if (okAge) parts.push(`Last OK: ${okAge} ago`);
        else if (last.lastOkAt) parts.push(`Last OK: now`);
        if (errAge) parts.push(`Last Err: ${errAge} ago`);
        else if (last.lastErrAt) parts.push(`Last Err: now`);
        const msg = parts.filter(Boolean).join(" • ");
        const errNote = last.lastErr ? ` (${last.lastErr})` : "";
        const netParts = [];
        if (typeof last.lastLatencyMs === "number") {
          netParts.push(`${Math.round(last.lastLatencyMs)}ms`);
        }
        if (last.lastHttpStatus != null) {
          netParts.push(`HTTP ${last.lastHttpStatus}`);
        }
        const net = netParts.length ? ` • ${netParts.join(" • ")}` : "";
        return {
          text: `CRM: ${endpoint ? "configured" : "endpoint missing"} • ${msg}${errNote}${net}`,
          tone:
            last.lastStatus === "ok"
              ? "ok"
              : last.lastStatus === "queued"
              ? "bad"
              : "warn",
        };
      }
      if (!endpoint) return { text: "CRM: endpoint missing", tone: "warn" };
      if (typeof elQueue === "number" && elQueue > 0)
        return { text: "CRM: queued (send failing)", tone: "bad" };

      return { text: "CRM: configured", tone: "ok" };
    } catch (_) {
      return { text: "CRM: —", tone: "muted" };
    }
  }

  function nvStartCrmStatusTicker() {
    const el = document.getElementById("nv-crm-status");
    if (!el) return;
    if (window.__NV_CRM_STATUS_TICKER__) return;
    window.__NV_CRM_STATUS_TICKER__ = true;

    setInterval(() => {
      const s = nvGetCrmStatus();
      el.textContent = s.text;
      el.classList.remove("ok", "warn", "bad");
      if (s.tone === "ok") el.classList.add("ok");
      if (s.tone === "warn") el.classList.add("warn");
      if (s.tone === "bad") el.classList.add("bad");
    }, 1000);
  }

  function nvGetFooterText() {
    const session =
      window.__NV_RES_SESSION__ || (window.__NV_RES_SESSION__ === 0 ? "0" : null);
    const shortSession = session ? String(session).slice(0, 6) : "—";
    const logCount =
      typeof window.NV_RES_LOG_DUMP === "function"
        ? window.NV_RES_LOG_DUMP().length
        : "—";
    const queue = nvGetCrmQueueSize();
    const qText = queue === null ? "—" : queue;
    return `Reservation Observability v1.0 • session: ${shortSession} • log: ${logCount} • crmQ: ${qText}`;
  }

  function nvGetSelftestBadgeInfo() {
    const res = window.__NV_SELFTEST_RESULTS__;
    if (!res) {
      return { text: "Selftest: not run", tone: "muted" };
    }
    if ((res.failed || 0) > 0) {
      return {
        text: `Selftest: FAIL (${res.failed}/${res.total || 0})`,
        tone: "bad",
      };
    }
    if ((res.warned || 0) > 0) {
      return {
        text: `Selftest: WARN (${res.warned}/${res.total || 0})`,
        tone: "warn",
      };
    }
    return {
      text: `Selftest: PASS (${res.passed || 0}/${res.total || 0})`,
      tone: "ok",
    };
  }

  function nvUpdateSelftestBadge() {
    const badge = document.getElementById("nv-selftest-badge");
    if (!badge) return;
    const info = nvGetSelftestBadgeInfo();
    badge.textContent = info.text;
    badge.classList.remove("ok", "warn", "bad", "muted");
    badge.classList.add(info.tone || "muted");
  }

  function nvStartSelftestBadgeTicker() {
    if (window.__NV_SELFTEST_BADGE_TICKER__) return;
    window.__NV_SELFTEST_BADGE_TICKER__ = true;
    nvUpdateSelftestBadge();
    setInterval(nvUpdateSelftestBadge, 2000);
  }

  function nvStartFooterTicker() {
    const el = document.getElementById("nv-health-footer");
    if (!el) return;
    if (window.__NV_HEALTH_FOOTER_TICKER__) return;
    window.__NV_HEALTH_FOOTER_TICKER__ = true;

    const update = () => {
      el.textContent = nvGetFooterText();
    };

    update();
    setInterval(update, 2000);
  }

  // --- v1.2: Metrics Summary (gate-safe, read-only) ---
  function nvNum(x) {
    const n = Number(x);
    return Number.isFinite(n) ? n : 0;
  }

  const METRICS_BUDGET_MS = 300;

  function nvNum(x) {
    const n = Number(x);
    return Number.isFinite(n) ? n : 0;
  }

  function nvGetPackMetricsList() {
    const m = window.__NV_PACK_METRICS__ || {};
    const out = [];

    for (const k of Object.keys(m)) {
      const v = m[k];
      if (!v || typeof v !== "object") continue;

      const ms =
        nvNum(v.ms) ||
        nvNum(v.timeMs) ||
        nvNum(v.durationMs) ||
        nvNum(v.loadMs) ||
        0;

      const prompts =
        nvNum(v.prompts) ||
        nvNum(v.promptCount) ||
        nvNum(v.count) ||
        nvNum(v.items) ||
        0;

      const errors =
        nvNum(v.errors) ||
        (v.error ? 1 : 0) ||
        (v.ok === false ? 1 : 0) ||
        0;

      out.push({
        pack: k,
        ms,
        prompts,
        errors,
      });
    }

    return out;
  }

  function nvFmtMs(ms) {
    if (!ms) return "—";
    return `${Math.round(ms)}ms`;
  }

  function nvBuildMetricsSummary() {
    const list = nvGetPackMetricsList();
    if (!list.length) {
      return {
        html: `<div class="nv-metrics-empty">PACK METRICS: <b>YOK</b> (loader metrics üretmiyor)</div>`,
        text: `PACK METRICS: NONE`,
      };
    }

    const slowest = [...list].sort((a, b) => b.ms - a.ms).slice(0, 5);
    const largest = [...list].sort((a, b) => b.prompts - a.prompts).slice(0, 5);
    const bad = list.filter(x => x.errors > 0).sort((a, b) => b.errors - a.errors).slice(0, 5);
    const metricsCount = list.length;
    const manifestEntries = Array.isArray(window.NV_PACK_LIST)
      ? window.NV_PACK_LIST.length
      : Object.keys(window.NV_PROMPT_PACKS || {}).length;
    const coverage =
      manifestEntries > 0
        ? `coverage: ${metricsCount}/${manifestEntries} (missing ${Math.max(manifestEntries - metricsCount, 0)})`
        : `coverage: ${metricsCount} (manifest unknown)`;
    const slowList = list.filter(x => x.ms > METRICS_BUDGET_MS);
    const slowWarn =
      slowList.length
        ? slowList
            .slice(0, 3)
            .map(x => `${x.pack} (${nvFmtMs(x.ms)})`)
            .join(", ")
        : "none";

    const html =
      `<div class="nv-metrics">
      <div class="nv-metrics-title"><b>METRICS SUMMARY</b> (Top 5)</div>
      <div class="nv-metrics-coverage">${coverage}</div>
      <div class="nv-metrics-warning${slowList.length ? "" : " ok"}">Slow pack${slowList.length === 1 ? "" : "s"}: ${slowWarn}</div>

      <div class="nv-metrics-grid">
        <div class="nv-metrics-card">
          <div class="nv-metrics-h">Slowest packs</div>
          ${slowest.map(x => `<div class="nv-metrics-row"><span>${x.pack}</span><b>${nvFmtMs(x.ms)}</b></div>`).join("") || `<div class="nv-metrics-row"><span>—</span><b>—</b></div>`}
        </div>

        <div class="nv-metrics-card">
          <div class="nv-metrics-h">Largest packs (prompts)</div>
          ${largest.map(x => `<div class="nv-metrics-row"><span>${x.pack}</span><b>${x.prompts || "—"}</b></div>`).join("") || `<div class="nv-metrics-row"><span>—</span><b>—</b></div>`}
        </div>

        <div class="nv-metrics-card">
          <div class="nv-metrics-h">Packs with errors</div>
          ${bad.length
            ? bad.map(x => `<div class="nv-metrics-row"><span>${x.pack}</span><b>${x.errors}</b></div>`).join("")
            : `<div class="nv-metrics-row"><span>None</span><b>0</b></div>`}
        </div>
      </div>
    </div>`;

    const text =
`METRICS SUMMARY (Top 5)
coverage: ${coverage}
slow packs: ${slowWarn}
- Slowest: ${slowest.map(x => `${x.pack}=${nvFmtMs(x.ms)}`).join(" | ") || "—"}
- Largest:  ${largest.map(x => `${x.pack}=${x.prompts}`).join(" | ") || "—"}
- Errors:   ${bad.map(x => `${x.pack}=${x.errors}`).join(" | ") || "None"}`;

    return { html, text };
  }

  function buildRedactedErrors() {
    const errors = window.__NV_PACK_ERRORS__ || {};
    const entries = Object.entries(errors);
    const totalErrors = entries.length;
    const showingFirst = Math.min(totalErrors, 10);
    if (!entries.length) return "No errors logged.";

    const lines = [
      `totalErrors: ${totalErrors}`,
      `showingFirst: ${showingFirst}`,
    ];

    entries.slice(0, showingFirst).forEach(([pack, info]) => {
      const reason =
        info?.reason ||
        info?.message ||
        info?.error ||
        "unspecified reason";
      const ids = Array.isArray(info?.ids) ? info.ids : [];
      const count =
        typeof info?.count === "number"
          ? info.count
          : ids.length > 0
            ? ids.length
            : "unknown";
      const trimmedIds = ids.slice(0, 5);
      const idsLabel = trimmedIds.length
        ? ` ids=[${trimmedIds.join(", ")}${ids.length > trimmedIds.length ? ",…" : ""}]`
        : "";
      lines.push(`${pack}: ${reason} (count=${count}${idsLabel})`);
    });

    return lines.join("\n");
  }

  function buildDiagnosticsSnapshot(data) {
    const buildId =
      window.__NV_BUILD__ ??
      window.__NV_VERSION__ ??
      window.APP_VERSION ??
      "unknown";
    const manifestFlag =
      typeof window.__NV_MANIFEST__ === "string"
        ? window.__NV_MANIFEST__
        : window.__NV_MANIFEST__
          ? "object"
          : "unset";
    const metrics = window.__NV_PACK_METRICS__ || {};
    const metricsTotals = Object.entries(metrics)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    const timestamp = new Date().toISOString();
    const location = window?.location;
    const pathname = location?.pathname || "unknown";
    const host = location?.hostname || "unknown";
    const url = location?.href || "unknown";
    const rootStatus =
      window.__NV_ROOT_OK__ === true
        ? "OK"
        : window.__NV_ROOT_OK__ === false
          ? "FAIL"
          : "?";
    const errorCount = Object.keys(window.__NV_PACK_ERRORS__ || {}).length;
    const manifestEntries = Array.isArray(window.NV_PACK_LIST)
      ? window.NV_PACK_LIST.length
      : -1;
    const packCount = manifestEntries >= 0 ? manifestEntries : Object.keys(window.NV_PROMPT_PACKS || {}).length;
    const promptCount = Array.isArray(data) ? data.length : 0;
    const manifestStatus = manifestEntries >= 0 ? `entries=${manifestEntries}` : "missing";
    const errorPreview = buildRedactedErrors();
    const metricsSummary = nvBuildMetricsSummary();

    const lines = [
      `build: ${buildId}`,
      `manifestFlag: ${manifestFlag}`,
      `metrics: ${metricsTotals || "none"}`,
      `timestamp: ${timestamp}`,
      `url: ${url}`,
      `pathname: ${pathname}`,
      `host: ${host}`,
      `ROOT: ${rootStatus}`,
      `ERRORS: ${errorCount}`,
      `pack entries: ${packCount}`,
      `prompt entries: ${promptCount}`,
      `manifest: ${manifestStatus}`,
      "",
      "errors preview:",
    ];
    lines.push(errorPreview);
    lines.push("");
    lines.push(metricsSummary.text);

    return lines.join("\n");
  }

  window.nvInitHealth = function nvInitHealth(data) {
    const el = document.getElementById("nv-health");
    if (!el) return;

    const okData = Array.isArray(data) && data.length > 0;
    const hasLang = okData && data.every(x => x && x.lang && typeof x.lang.tr === "string" && typeof x.lang.en === "string");

    const templateMetricsSummary = nvBuildMetricsSummary();
    el.innerHTML = `
      <style>
        .nv-health-panel {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 13px;
          color: #111;
          background: rgba(255, 255, 255, 0.96);
          padding: .85rem 1rem;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          max-width: 320px;
          line-height: 1.35;
        }
        .nv-health-hdr {
          display: flex;
          align-items: center;
          gap: .35rem;
          flex-wrap: wrap;
        }
        .nv-health-hdr strong {
          font-size: 14px;
        }
        .nv-health-row {
          display: flex;
          justify-content: space-between;
          margin-top: .35rem;
        }
        .nv-health-key {
          color: #555;
          font-size: 12px;
        }
        .nv-health-val {
          font-weight: 600;
        }
        .nv-health-val.ok {
          color: #00703c;
        }
        .nv-health-val.bad {
          color: #b00020;
        }
        .nv-health-note {
          margin-top: .55rem;
          color: #666;
          font-size: 11px;
        }
        #nv-health .nv-metrics {
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px solid rgba(0, 0, 0, .08);
        }
        #nv-health .nv-metrics-title {
          margin-bottom: 6px;
          color: #333;
        }
        #nv-health .nv-metrics-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }
        @media (min-width: 520px) {
          #nv-health .nv-metrics-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 760px) {
          #nv-health .nv-metrics-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }
        #nv-health .nv-metrics-card {
          padding: 8px;
          border: 1px solid rgba(0, 0, 0, .08);
          border-radius: 10px;
          background: rgba(255, 255, 255, .6);
        }
        #nv-health .nv-metrics-coverage {
          font-size: 12px;
          color: #222;
          margin-bottom: 4px;
        }
        #nv-health .nv-metrics-warning {
          font-size: 11px;
          padding: 6px;
          border-radius: 8px;
          background: rgba(255, 165, 0, .12);
          color: #9b5f00;
          margin-bottom: 6px;
        }
        #nv-health .nv-metrics-warning.ok {
          background: rgba(0, 128, 0, .1);
          color: #1a6d22;
        }
        #nv-health .nv-metrics-h {
          font-weight: 600;
          margin-bottom: 6px;
          color: #444;
        }
        #nv-health .nv-metrics-row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 2px 0;
        }
        #nv-health .nv-metrics-row span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 70%;
          color: #555;
        }
        #nv-health .nv-metrics-row b {
          color: #222;
        }
        #nv-health .nv-metrics-empty {
          margin-top: 10px;
          color: #666;
        }
        .nv-health-actions {
          display: flex;
          gap: .45rem;
          margin-top: .65rem;
          flex-wrap: wrap;
        }
        .nv-h-sec {
          margin-top: 12px;
          padding: 12px;
          border: 1px solid rgba(0, 0, 0, .08);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.9);
        }
        .nv-h-sec-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
        }
        .nv-h-sec-head div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .nv-h-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .nv-h-muted {
          color: #666;
          font-size: 12px;
        }
        .nv-h-minirow {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          margin-top: 10px;
        }
        .nv-h-minirow .nv-btn {
          padding: 8px 10px;
          border-radius: 12px;
        }
        .nv-h-minirow .ok {
          color: #0a7a2f;
        }
        .nv-h-minirow .warn {
          color: #aa7a00;
        }
        .nv-h-minirow .bad {
          color: #b00020;
        }
        .nv-h-sub {
          margin-top: 10px;
        }
        .nv-h-subhead {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: baseline;
          margin-bottom: 6px;
        }
        .nv-h-toprefs {
          margin: 0;
          padding-left: 18px;
        }
        .nv-h-toprefs li {
          margin: 4px 0;
        }
        .nv-selftest-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 2px 8px;
          border-radius: 999px;
          border: 1px solid rgba(0, 0, 0, .08);
          font-size: 11px;
          line-height: 1;
          cursor: pointer;
          transition: transform .15s ease;
        }
        .nv-selftest-badge.ok {
          color: #0b6b2f;
          border-color: #0b6b2f;
        }
        .nv-selftest-badge.warn {
          color: #9b5f00;
          border-color: #9b5f00;
        }
        .nv-selftest-badge.bad {
          color: #b00020;
          border-color: #b00020;
        }
        .nv-selftest-badge.muted {
          color: #555;
        }
        .nv-selftest-badge:active {
          transform: translateY(1px);
        }
        .nv-selftest-output {
          margin-top: 10px;
          padding: 10px;
          border-radius: 10px;
          border: 1px dashed rgba(0, 0, 0, .12);
          background: rgba(255, 255, 255, .8);
          font-size: 11px;
          line-height: 1.35;
          max-height: 120px;
          overflow: auto;
        }
        .nv-health-footer {
          margin-top: 12px;
          font-size: 11px;
          color: #444;
          text-align: center;
          opacity: 0.8;
        }
        #nv-copy-dedupe {
          min-width: 120px;
        }
        .nv-health-btn {
          flex: 1;
          min-width: 120px;
          border: none;
          border-radius: 6px;
          font-size: 11px;
          padding: .45rem .75rem;
          cursor: pointer;
          color: #fff;
          background: #0b6b99;
          transition: transform .15s ease;
        }
        .nv-health-btn.secondary {
          background: #3f4347;
        }
        .nv-health-btn:active {
          transform: translateY(1px);
        }
        .nv-badge {
          display: inline-flex;
          align-items: center;
          gap: .4rem;
          padding: .2rem .55rem;
          border-radius: 999px;
          border: 1px solid rgba(0, 0, 0, .12);
          font-size: 12px;
          line-height: 1;
        }
        .nv-badge.ok {
          background: rgba(0, 160, 60, .10);
        }
        .nv-badge.warn {
          background: rgba(240, 170, 0, .12);
        }
        .nv-badge.bad {
          background: rgba(220, 0, 0, .10);
        }
      </style>
        <div class="nv-health-panel">
        <div class="nv-health-hdr">
          <strong>NV Health</strong>
          ${nvRootBadge()}
          ${nvErrorsBadge()}
          ${getDedupeBadge()}
        </div>
        <div class="nv-health-row">
          <span class="nv-health-key">NV_PROMPTS</span>
          <span class="nv-health-val ${okData ? "ok" : "bad"}">${okData ? data.length : "YOK"}</span>
        </div>
        <div class="nv-selftest-row">
          <span id="nv-selftest-badge" class="nv-selftest-badge muted">Selftest: not run</span>
        </div>
        <div class="nv-health-row">
          <span class="nv-health-key">Lang (tr/en)</span>
          <span class="nv-health-val ${hasLang ? "ok" : "bad"}">${hasLang ? "OK" : "Eksik"}</span>
        </div>
        <div class="nv-health-note">F9: toggle panel</div>
        <div class="nv-health-actions">
          <button class="nv-health-btn" data-nv-copy-diag>Copy diagnostics</button>
          <button class="nv-health-btn secondary" data-nv-copy-errors>Copy redacted errors</button>
          <button class="nv-health-btn" id="nv-copy-dedupe">Copy Dedupe</button>
          <button class="nv-health-btn" id="nv-dedupe-toggle">Dedupe: overwrite</button>
        </div>
        <section class="nv-h-sec" data-nv-res-telemetry>
          <div class="nv-h-sec-head">
            <strong>Reservation Telemetry</strong>
            <div>
              <span class="nv-h-muted" id="nv-last-event-age">Last event age: —</span>
              <div class="nv-h-muted" id="nv-session-summary">This session: —</div>
            </div>
          </div>
          <div class="nv-h-actions">
            <button type="button" class="nv-health-btn secondary" data-nv-export-res>Export reservation CSV</button>
            <button type="button" class="nv-health-btn" data-nv-clear-res>Clear reservation log</button>
            <button type="button" class="nv-health-btn secondary" data-nv-copy-last-event>Copy last reservation event</button>
          </div>
          <div class="nv-h-sub">
            <div class="nv-h-subhead">
              <strong>Top refs</strong>
              <span class="nv-h-muted" id="nv-top-refs-meta">last 200 • —</span>
            </div>
            <ol class="nv-h-toprefs" id="nv-top-refs-list">
              <li class="nv-h-muted">—</li>
            </ol>
          </div>
          <div class="nv-h-minirow">
            <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
              <span class="nv-h-muted" id="nv-crm-status">CRM: —</span>
              <span class="nv-h-muted" id="nv-crm-queue-size">CRM queue: —</span>
            </div>
            <div class="nv-h-flush-row">
              <span class="nv-h-muted" id="nv-crm-flush-max">Flush max: 20</span>
              <button type="button" class="nv-health-btn" data-nv-crm-flush>Flush CRM queue</button>
              <button type="button" class="nv-health-btn secondary" data-nv-crm-purge>Pur
          </div>
        </section>
        <pre id="nv-selftest-out" class="nv-selftest-output">Selftest: not run</pre>
        ${getDedupeDetailsHTML()}
        ${templateMetricsSummary.html}
        <div class="nv-health-footer" id="nv-health-footer">
          Reservation Observability v1.0
        </div>
      </div>
    `;

    el.style.display = "none";

    const noteEl = el.querySelector(".nv-health-note");
    const originalNote = noteEl ? noteEl.textContent : "F9: toggle panel";
    const flashNote = (msg) => {
      if (!noteEl) return;
      noteEl.textContent = msg;
      setTimeout(() => {
        if (noteEl) noteEl.textContent = originalNote;
      }, 1800);
    };

    const selftestBadge = el.querySelector("#nv-selftest-badge");
    selftestBadge?.addEventListener("click", () => {
      const target = document.getElementById("nv-selftest-out");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    const copyDiagnosticsBtn = el.querySelector("[data-nv-copy-diag]");
    const copyErrorsBtn = el.querySelector("[data-nv-copy-errors]");

    copyDiagnosticsBtn?.addEventListener("click", () => {
      nvCopyToClipboard(buildDiagnosticsSnapshot(data))
        .then(() => flashNote("Diagnostics copied"))
        .catch(() => flashNote("Copy failed"));
    });

    copyErrorsBtn?.addEventListener("click", () => {
      nvCopyToClipboard(buildRedactedErrors())
        .then(() => flashNote("Redacted errors copied"))
        .catch(() => flashNote("Copy failed"));
    });

    const copyDedupeBtn = document.getElementById("nv-copy-dedupe");
    const L = NV_I18N[nvLang()];
    if (copyDedupeBtn) {
      copyDedupeBtn.textContent = L.copy_dedupe;
    }

    copyDedupeBtn?.addEventListener("click", async () => {
      const payload =
        window.__NV_DEDUPE__ || {
          policy: window.__NV_DEDUPE_POLICY__ || "overwrite",
          duplicates: [],
        };
      const txt = JSON.stringify(payload, null, 2);
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(txt);
          const original = copyDedupeBtn.textContent;
          copyDedupeBtn.textContent = L.copied;
          setTimeout(() => {
            copyDedupeBtn.textContent = original;
          }, 900);
        } else {
          window.prompt("Copy Dedupe Report (JSON)", txt);
        }
        flashNote("Dedupe copied");
      } catch (e) {
      console.warn("Copy Dedupe failed:", e);
      flashNote("Copy failed");
    }
  });

    const dedupeToggleBtn = document.getElementById("nv-dedupe-toggle");
    const dedupeLang = NV_I18N[nvLang()];
    const isDebug =
      new URLSearchParams(location.search).get("debug") === "1" ||
      localStorage.getItem("NV_DEBUG") === "1";
    if (dedupeToggleBtn) {
      dedupeToggleBtn.style.display = isDebug ? "" : "none";

      function currentPolicy() {
      const p = (window.__NV_DEDUPE_POLICY__ || "overwrite").toLowerCase();
      return p === "ignore" ? "ignore" : "overwrite";
    }

    function setLabel() {
      dedupeToggleBtn.textContent = `Dedupe: ${currentPolicy()}`;
      dedupeToggleBtn.title =
        currentPolicy() === "overwrite" ? dedupeLang.overwrite_desc : dedupeLang.ignore_desc;
    }

    dedupeToggleBtn.onclick = () => {
      const next = currentPolicy() === "overwrite" ? "ignore" : "overwrite";
      const confirmMsg =
        next === "ignore" ? dedupeLang.confirm_ignore : dedupeLang.confirm_overwrite;

      if (isDebug && !window.confirm(confirmMsg)) {
        return;
      }

      window.__NV_DEDUPE_POLICY__ = next;
      try {
        localStorage.setItem("NV_DEDUPE_POLICY", next);
      } catch (_) {}
      setLabel();

      try {
        if (typeof window.nvLoadPromptPacks === "function" && Array.isArray(window.NV_PACK_LIST) && window.NV_PACK_LIST.length) {
          window.nvLoadPromptPacks(window.NV_PACK_LIST).catch(() => {});
        } else if (typeof window.nvOnPromptsReady === "function") {
          window.nvOnPromptsReady(window.NV_PROMPTS);
        }
      } catch (e) {
        console.warn("Dedupe toggle refresh failed:", e);
      }
    };

    setLabel();

    const exportResBtn = el.querySelector("[data-nv-export-res]");
    const clearResBtn = el.querySelector("[data-nv-clear-res]");

    exportResBtn?.addEventListener("click", () => {
      if (typeof window.NV_RES_LOG_EXPORT_CSV === "function") {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const name = `neurova-reservations-${yyyy}-${mm}-${dd}.csv`;
        window.NV_RES_LOG_EXPORT_CSV(name);
        const n =
          typeof window.NV_RES_LOG_DUMP === "function"
            ? window.NV_RES_LOG_DUMP().length
            : null;
        const sid = nvShortSessionId();
        const sidPart = sid ? `, session=${sid}` : "";
        flashNote(
          n === null
            ? `Exported ${name}`
            : `Exported ${name} (n=${n}${sidPart})`
        );
      } else {
        flashNote("Export helper missing");
      }
    });

    clearResBtn?.addEventListener("click", () => {
      if (typeof window.NV_RES_LOG_CLEAR === "function") {
        window.NV_RES_LOG_CLEAR();
        flashNote("Reservation log cleared");
      } else {
        flashNote("Clear helper missing");
      }
    });

    const copyLastEventBtn = el.querySelector("[data-nv-copy-last-event]");
    copyLastEventBtn?.addEventListener("click", async () => {
      if (typeof window.NV_RES_LOG_DUMP !== "function") {
        flashNote("Reservation logs unavailable");
        return;
      }
      const rows = window.NV_RES_LOG_DUMP();
      if (!Array.isArray(rows) || rows.length === 0) {
        flashNote("No reservation events yet");
        return;
      }
      const last = rows[rows.length - 1];
      const text = JSON.stringify(last, null, 2);
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.setAttribute("readonly", "");
          ta.style.position = "absolute";
          ta.style.left = "-9999px";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand?.("copy");
          document.body.removeChild(ta);
        }
        const type = last?.type || last?.payload?.type || "unknown";
        const note =
          last?.payload?.note || last?.note || "";
        const refMatch = String(note).match(/Ref:\s*([^\n]+)/i);
        const ref = refMatch ? refMatch[1] : "";
        const suffix = ref ? `, ref=${ref}` : "";
        flashNote(`Copied last event (type=${type}${suffix})`);
      } catch (_) {
        flashNote("Copy failed");
      }
    });

    const crmFlushBtn = el.querySelector("[data-nv-crm-flush]");
    crmFlushBtn?.addEventListener("click", async () => {
      if (typeof window.NV_CRM_FLUSH_NOW === "function") {
        const before = nvGetCrmQueueSize();
        try {
          await window.NV_CRM_FLUSH_NOW();
          const after = nvGetCrmQueueSize();
          const note =
            before === null || after === null
              ? "CRM flush triggered"
              : `CRM flush triggered (queue ${before} → ${after})`;
          flashNote(note);
        } catch (_) {
          flashNote("CRM flush failed");
        }
      } else {
        flashNote("CRM flush unavailable (module not loaded)");
      }
    });

    nvStartLastEventAgeTicker();
    nvStartSessionSummaryTicker();
    nvStartTopRefsTicker();
    nvStartCrmQueueTicker();
    nvStartCrmStatusTicker();
    nvStartFooterTicker();
    nvStartSelftestBadgeTicker();
    nvEnsureCrmQueueControls();
  }

    if (!el.__nvHealthKeydown) {
      document.addEventListener("keydown", (ev) => {
        if (ev.key === "F9") {
          ev.preventDefault();
          el.style.display = (el.style.display === "block") ? "none" : "block";
        }
      });
      el.__nvHealthKeydown = true;
    }
  };
})();
