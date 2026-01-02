"use strict";

// heatmap-overlay.js — UI overlay for WA click stats (reads nv_wa_click_* counters)
(function () {
  const PREFIX = "nv_wa_click_";
  const VERSION = "v1.1.3";

  if (window.__NV_HEATMAP_ON__) return;
  window.__NV_HEATMAP_ON__ = true;

  function getLang() {
    const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    if (htmlLang.startsWith("en")) return "en";
    return "tr";
  }

    const L = {
    tr: {
      chip: "Isı haritası",
      title: "HEATMAP",
      subtitle: "WhatsApp tıklamaları (localStorage)",
      collapse: "Daralt",
      expand: "Genişlet",
      sources: "Kaynaklar",
      tiers: "Tier",
      total: "Toplam",
      none: "Henüz veri yok. WhatsApp CTA’larına tıkla.",
      hintGenerate: "WhatsApp CTA’larından birine tıkla, sayaçlar dolsun.",
      reset: "Sıfırla",
      close: "Kapat",
      copy: "Kopyala",
      copied: "Kopyalandı",
      confirmReset: "Tüm heatmap sayaçlarını sıfırlamak istiyor musun?",
      toastCopied: "Kopyalandı (CSV + Page mix)",
      toastResetOk: "Sıfırlandı",
      toastCopyFail: "Kopyalanamadı (izin/odak). Not: http bağlantısı kullan.",
      download: "İndir",
      toastDownloaded: "İndirildi",
      dockRight: "Sağ alta hizala",
      helpLines: [
        "Isı haritasını açmak için sol alttaki "Isı haritası" chip’ine tıkla.",
        "WhatsApp CTA’larına tıklayınca sayaçlar artar; panel veriyi localStorage’dan okur.",
        "Kapat butonu veya ESC ile paneli gizleyebilirsin."
      ],
      helpChip: "Isı haritası panelini aç",
    },
    en: {
      chip: "Heatmap",
      title: "HEATMAP",
      subtitle: "WhatsApp clicks (localStorage)",
      collapse: "Collapse",
      expand: "Expand",
      sources: "Sources",
      tiers: "Tier",
      total: "Total",
      none: "No data yet. Click WhatsApp CTAs.",
      hintGenerate: "Tap any WhatsApp CTA to generate data.",
      reset: "Reset",
      close: "Close",
      copy: "Copy",
      copied: "Copied",
      confirmReset: "Reset all heatmap counters?",
      toastCopied: "Copied (CSV + Page mix)",
      toastResetOk: "Reset OK",
      toastCopyFail: "Copy failed (permission/focus). Tip: use http:// instead of file://",
      download: "Download",
      toastDownloaded: "Downloaded",
      dockRight: "Dock bottom-right",
      helpLines: [
        "Tap the bottom-left “Heatmap” chip to reveal the overlay.",
        "WhatsApp CTA clicks grow the counters; the panel reads data from localStorage.",
        "Close with the button, ESC, or by clicking the backdrop."
      ],
      helpChip: "Open the heatmap panel",
    },
  };

  function resolveLang(lang) {
    if (lang) {
      const normalized = String(lang || "").toLowerCase();
      return normalized.startsWith("en") ? "en" : "tr";
    }
    return getLang();
  }

  function tNow() {
    return L[resolveLang()];
  }

  function nvParseWaClickKey(key) {
    if (!key) return null;

    if (key.startsWith("nv_wa_click__")) {
      const p = key.split("__");
      return {
        source: p[1] || "na",
        tier: p[2] || "na",
        day: p[3] || "na",
        lang: p[4] || "UNKNOWN",
      };
    }

    if (key.startsWith("nv_wa_click_")) {
      const tail = key.slice("nv_wa_click_".length);
      if (tail.includes("__")) {
        const p = tail.split("__");
        return {
          source: p[0] || "na",
          tier: p[1] || "na",
          day: p[2] || "na",
          lang: p[3] || "UNKNOWN",
        };
      }
      const idx = tail.lastIndexOf("_");
      if (idx > 0) {
        return {
          source: tail.slice(0, idx) || "na",
          tier: tail.slice(idx + 1) || "na",
          day: "na",
          lang: "UNKNOWN",
        };
      }
      return { source: tail || "na", tier: "na", day: "na", lang: "UNKNOWN" };
    }

    return null;
  }

  function getCells() {
    if (window.NV_HEAT && typeof window.NV_HEAT.readAll === "function") {
      try {
        const out = window.NV_HEAT.readAll() || [];
        if (Array.isArray(out) && out.length) return out;
      } catch (e) {
        console.warn("NV_HEAT.readAll failed", e);
      }
    }
    // Fallback: legacy prefix scan
    const rows = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(PREFIX)) continue;
      const v = parseInt(localStorage.getItem(k) || "0", 10);
      if (!v) continue;
      const meta = nvParseWaClickKey(k);
      if (!meta) continue;
      rows.push({ source: meta.source, tier: meta.tier, count: v, lang: meta.lang });
    }
    return rows;
  }

  function countPrefixedKeys(prefix) {
    let n = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) n++;
    }
    return n;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function toCSV(rows) {
    const head = "source,tier,count";
    const total = rows.reduce((sum, r) => sum + (Number(r.count) || 0), 0);
    return [
      head,
      ...rows.map((r) => `${r.source},${r.tier},${r.count}`),
      `TOTAL,,${total}`,
    ].join("\n");
  }

  function nvComputePageMixFromCells(cells) {
    const mix = { TR: 0, EN: 0, TREn: 0, Unknown: 0, total: 0, knownTotal: 0 };

    for (const c of cells || []) {
      const n = Number(c.count || 0) || 0;
      if (!n) continue;

      const lang = String(c.lang || "").toUpperCase();
      if (lang === "TR") { mix.TR += n; mix.knownTotal += n; }
      else if (lang === "EN") { mix.EN += n; mix.knownTotal += n; }
      else if (lang === "TR+EN") { mix.TREn += n; mix.knownTotal += n; }
      else { mix.Unknown += n; }

      mix.total += n;
    }

    const pct = (x, denom) => (denom ? Math.round((x / denom) * 100) : 0);

    return {
      ...mix,
      pctTR: pct(mix.TR, mix.knownTotal),
      pctEN: pct(mix.EN, mix.knownTotal),
      pctTREn: pct(mix.TREn, mix.knownTotal),
      pctUnknownKnown: pct(mix.Unknown, mix.knownTotal),
      pctTR_all: pct(mix.TR, mix.total),
      pctEN_all: pct(mix.EN, mix.total),
      pctTREn_all: pct(mix.TREn, mix.total),
      pctUnknown_all: pct(mix.Unknown, mix.total),
    };
  }

  function buildExportText(csv, rows) {
    const mix = nvComputePageMixFromCells(rows || []);
    const mixLine =
      `Page mix (known-only): TR / EN / TR+EN = ${mix.pctTR}% / ${mix.pctEN}% / ${mix.pctTREn}%` +
      ` | unknown: ${mix.Unknown} (${mix.pctUnknown_all}%)` +
      ` | total: ${mix.total}`;
    return `${mixLine}\n\n${csv}`.trim() + "\n";
  }

  function nvMixAggregateFromLocalStorage() {
    const rows = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(PREFIX)) continue;
      const v = Number(localStorage.getItem(k) || 0);
      if (!v) continue;
      const meta = nvParseWaClickKey(k);
      if (!meta) continue;
      rows.push({ count: v, lang: meta.lang });
    }
    return nvComputePageMixFromCells(rows);
  }

  function nvMixPercent(n, total) {
    if (!total) return "0%";
    return `${Math.round((n / total) * 100)}%`;
  }

  function nvPageMixDump() {
    const mix = nvMixAggregateFromLocalStorage();
    const rows = [
      ["mode", "count", "pct_known", "pct_all"],
      ["TR", String(mix.TR), `${mix.pctTR}%`, `${mix.pctTR_all}%`],
      ["EN", String(mix.EN), `${mix.pctEN}%`, `${mix.pctEN_all}%`],
      ["TR+EN", String(mix.TREn), `${mix.pctTREn}%`, `${mix.pctTREn_all}%`],
      ["UNKNOWN", String(mix.Unknown), `${mix.pctUnknownKnown}%`, `${mix.pctUnknown_all}%`],
      ["TOTAL", String(mix.total), "", "100%"],
      ["KNOWN_TOTAL", String(mix.knownTotal), "100%", ""],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    console.log(csv);
    return csv;
  }

  function nvMergeCsvSourceTier(csvText) {
    const lines = String(csvText || "").trim().split(/\r?\n/);
    if (lines.length < 2) return "";

    const out = new Map();
    const header = lines[0].toLowerCase();
    const hasHeader = header.includes("source") && header.includes("tier") && header.includes("count");
    const start = hasHeader ? 1 : 0;

    const normSource = (s) => {
      s = String(s || "").trim().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
      const raw = s.toLowerCase();

      if (raw.includes("paket")) return "paketler";
      if (raw.includes("urun") || raw.includes("r nler") || raw.includes("rnler")) return "urunler";

      return raw.replace(/[^a-z0-9]+/g, "") || "na";
    };

    const normTier = (t) => {
      t = String(t || "").trim().toLowerCase();
      if (!t || t === "n/a") return "na";
      if (t.includes("entry")) return "entry";
      if (t.includes("value")) return "value";
      return t.replace(/[^a-z0-9]+/g, "") || "na";
    };

    for (let i = start; i < lines.length; i++) {
      const row = lines[i].trim();
      if (!row) continue;
      const cols = row.split(",");
      const source = normSource(cols[0]);
      const tier = normTier(cols[1]);
      const count = Number(cols[2] || 0) || 0;

      const key = `${source},${tier}`;
      out.set(key, (out.get(key) || 0) + count);
    }

    const merged = [["source", "tier", "count"]];
    for (const [k, sum] of out.entries()) {
      const [source, tier] = k.split(",");
      merged.push([source, tier, String(sum)]);
    }
    return merged.map((r) => r.join(",")).join("\n");
  }

  window.NV_MERGE_CSV = nvMergeCsvSourceTier;

  window.NV_PAGE_MIX_DUMP = nvPageMixDump;

  function copyText(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }
    } catch (_) {}
    return new Promise((resolve) => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (_) {}
      document.body.removeChild(ta);
      resolve();
    });
  }

  function downloadText(filename, text, mime = "text/plain;charset=utf-8") {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }

  function safeDateStamp() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
  }

  function nvBackupWaClicks() {
    const dump = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("nv_wa_click_")) dump[k] = localStorage.getItem(k);
    }
    const text = JSON.stringify({ ts: new Date().toISOString(), dump }, null, 2);
    const blob = new Blob([text], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nv_wa_click_backup_${safeDateStamp().replace("_", "-")}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
    return { keys: Object.keys(dump).length };
  }

  function nvCleanupMergeWaClicks(cfg) {
    const opt = Object.assign({ dryRun: true, deleteLegacy: true }, cfg || {});
    const PREFIX_ANY = "nv_wa_click_";
    const PREFIX_NEW = "nv_wa_click__";

    const isDay = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || ""));
    const clampDay = (s) => String(s || "").slice(0, 10) || "na";

    const normSource = (s) => {
      s = String(s || "").trim().toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
      s = s.replace(/[^a-z0-9]+/g, "");
      if (!s) return "na";
      if (s.includes("urun") || s.includes("rnler")) return "urunler";
      if (s.includes("paket")) return "paketler";
      return s;
    };

    const normTier = (t) => {
      t = String(t || "").trim().toLowerCase();
      t = t.replace(/[^a-z0-9+]+/g, "");
      if (!t || t === "na" || t === "n" || t === "a") return "na";
      if (t.includes("entry")) return "entry";
      if (t.includes("value")) return "value";
      if (t.includes("vip")) return "vip";
      return t || "na";
    };

    const parseKey = (k) => {
      if (k.startsWith(PREFIX_NEW)) {
        const p = k.split("__");
        return { source: p[1] || "na", tier: p[2] || "na", day: p[3] || "na", lang: (p[4] || "TR").toUpperCase(), isNew: true };
      }
      if (!k.startsWith(PREFIX_ANY)) return null;
      const rest = k.slice(PREFIX_ANY.length);

      if (rest.includes("__")) {
        const p = rest.split("__");
        const source = p[0] || "na";
        const tier = p[1] || "na";
        const day = (p[2] && isDay(p[2])) ? p[2] : "na";
        return { source, tier, day, lang: "UNKNOWN", isNew: false };
      }

      const idx = rest.lastIndexOf("_");
      const source = idx > 0 ? rest.slice(0, idx) : rest;
      const tier = idx > 0 ? rest.slice(idx + 1) : "na";
      return { source, tier, day: "na", lang: "UNKNOWN", isNew: false };
    };

    const buildNewKey = ({ source, tier, day, lang }) =>
      `nv_wa_click__${source}__${tier}__${day}__${lang}`;

    const allKeys = Object.keys(localStorage).filter(k => k.startsWith(PREFIX_ANY));
    const legacyKeys = allKeys.filter(k => !k.startsWith(PREFIX_NEW));

    const planMap = new Map();

    for (const k of legacyKeys) {
      const v = Number(localStorage.getItem(k) || 0) || 0;
      if (!v) continue;

      const m = parseKey(k);
      if (!m || m.isNew) continue;

      const rec = {
        source: normSource(m.source),
        tier: normTier(m.tier),
        day: clampDay(m.day),
        lang: "UNKNOWN",
      };

      const nk = buildNewKey(rec);
      const cur = planMap.get(nk);
      if (cur) { cur.sum += v; cur.from.push(k); }
      else { planMap.set(nk, { sum: v, from: [k] }); }
    }

    const plan = {
      dryRun: opt.dryRun,
      legacyKeyCount: legacyKeys.length,
      mergeTargets: planMap.size,
      movedSum: Array.from(planMap.values()).reduce((a, b) => a + (b.sum || 0), 0),
      deleteLegacy: !!opt.deleteLegacy,
      samples: [],
    };

    for (const [nk, rec] of planMap.entries()) {
      if (plan.samples.length >= 10) break;
      plan.samples.push({ to: nk, add: rec.sum, fromCount: rec.from.length, from: rec.from.slice(0, 3) });
    }

    if (opt.dryRun) return plan;

    let writes = 0, deletes = 0;
    for (const [nk, rec] of planMap.entries()) {
      const existing = Number(localStorage.getItem(nk) || 0) || 0;
      localStorage.setItem(nk, String(existing + rec.sum));
      writes++;
      if (opt.deleteLegacy) {
        for (const oldKey of rec.from) {
          localStorage.removeItem(oldKey);
          deletes++;
        }
      }
    }
    return Object.assign(plan, { writes, deletes });
  }

  function toast(msg) {
    let t = document.querySelector(".nv-heat-toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "nv-heat-toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toast._tm);
    toast._tm = setTimeout(() => t.classList.remove("is-on"), 1200);
  }

  function nvHeatmapApplyDockPadding(panelEl, dockSide) {
    try {
      const w = Math.round(panelEl.getBoundingClientRect().width || 0);
      const pad = Math.max(0, w + 18);
      document.documentElement.style.setProperty("--nv-heatmap-dock-pad", `${pad}px`);
      document.body.classList.remove("nv-heatmap-docked-left", "nv-heatmap-docked-right");
      if (dockSide === "left") document.body.classList.add("nv-heatmap-docked-left");
      if (dockSide === "right") document.body.classList.add("nv-heatmap-docked-right");
    } catch (_) {}
  }

  function nvHeatmapClearDockPadding() {
    try {
      document.documentElement.style.setProperty("--nv-heatmap-dock-pad", "0px");
      document.body.classList.remove("nv-heatmap-docked-left", "nv-heatmap-docked-right");
    } catch (_) {}
  }

  function setupCollapse(overlay) {
    const KEY = "nv_heat_overlay_collapsed";
    const btn = overlay.querySelector('[data-act="toggle"]');
    if (!btn) return;

    const updateLabel = () => {
      const tt = tNow();
      btn.textContent = overlay.classList.contains("is-collapsed") ? tt.expand : tt.collapse;
    };

    const apply = (collapsed) => {
      overlay.classList.toggle("is-collapsed", collapsed);
      updateLabel();
    };

    const initial = localStorage.getItem(KEY) === "1";
    apply(initial);

    btn.addEventListener("click", () => {
      const next = !overlay.classList.contains("is-collapsed");
      apply(next);
      localStorage.setItem(KEY, next ? "1" : "0");
      render(overlay);
    });

    overlay.__nvHeatCollapseUpdate__ = updateLabel;
  }

  /* =========================================================
   * HEATMAP OVERLAY: drag + resize + snap + ESC + persist
   * Drop-in block
   * ========================================================= */
  function nvAttachOverlayDragResize(opts) {
    const {
      overlayEl,
      panelEl,
      dragHandleEl,
      resizeHandleEl,
      onClose,
      storageKey = "nv_heat_overlay_state_v1",
    } = opts || {};

    if (!overlayEl || !panelEl) return;

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const snap = (v, edgeMin, edgeMax, threshold) => {
      if (Math.abs(v - edgeMin) <= threshold) return edgeMin;
      if (Math.abs(v - edgeMax) <= threshold) return edgeMax;
      return v;
    };

    // ensure base styles
    overlayEl.style.position = overlayEl.style.position || "fixed";
    overlayEl.style.inset = overlayEl.style.inset || "0";
    overlayEl.style.zIndex = overlayEl.style.zIndex || "9999";

    const computedPos = getComputedStyle(panelEl).position;
    if (computedPos !== "fixed" && computedPos !== "absolute") {
      panelEl.style.position = "fixed";
    }

    let rh = resizeHandleEl;
    if (!rh) {
      rh = document.createElement("div");
      rh.className = "nv-overlay-resize-handle";
      Object.assign(rh.style, {
        position: "absolute",
        right: "10px",
        bottom: "10px",
        width: "14px",
        height: "14px",
        cursor: "nwse-resize",
        opacity: "0.7",
        borderRight: "2px solid rgba(255,255,255,0.55)",
        borderBottom: "2px solid rgba(255,255,255,0.55)",
        borderRadius: "2px",
        userSelect: "none",
      });
      panelEl.style.position = panelEl.style.position || "fixed";
      panelEl.style.boxSizing = "border-box";
      panelEl.appendChild(rh);
    }

    const dh = dragHandleEl || panelEl;
    dh.style.cursor = dh === panelEl ? "grab" : (dh.style.cursor || "grab");

    const SNAP_PX = 18;

    const isVisible = () =>
      overlayEl.classList.contains("is-on") ||
      (overlayEl.offsetParent !== null && getComputedStyle(overlayEl).display !== "none");

    const getDockSide = () => {
      const r = panelEl.getBoundingClientRect();
      const minX = 8;
      const maxX = Math.max(minX, window.innerWidth - r.width - 8);
      if (Math.abs(r.left - minX) <= SNAP_PX) return "left";
      if (Math.abs(r.left - maxX) <= SNAP_PX) return "right";
      return null;
    };

    const updateDockPadding = () => {
      if (!isVisible()) {
        nvHeatmapClearDockPadding();
        return;
      }
      const side = getDockSide();
      if (side) nvHeatmapApplyDockPadding(panelEl, side);
      else nvHeatmapClearDockPadding();
    };

    const safeParse = (s) => {
      try { return JSON.parse(s); } catch { return null; }
    };

    const savedLegacy = safeParse(localStorage.getItem(storageKey));
    const savedPos = safeParse(localStorage.getItem("nv_heat_overlay_pos"));
    const savedSize = safeParse(localStorage.getItem("nv_heat_overlay_size"));

    const applySize = (size) => {
      if (!size || typeof size !== "object") return;
      if (typeof size.w === "number" && size.w > 0) panelEl.style.width = `${size.w}px`;
      if (typeof size.h === "number" && size.h > 0) panelEl.style.height = `${size.h}px`;
    };
    const applyPos = (pos) => {
      if (!pos || typeof pos !== "object") return;
      if (typeof pos.x === "number") panelEl.style.left = `${pos.x}px`;
      if (typeof pos.y === "number") panelEl.style.top = `${pos.y}px`;
    };

    if (savedSize && typeof savedSize === "object") {
      applySize(savedSize);
    } else if (savedLegacy && typeof savedLegacy === "object") {
      applySize(savedLegacy);
    }

    if (savedPos && typeof savedPos === "object") {
      applyPos(savedPos);
    } else if (savedLegacy && typeof savedLegacy === "object") {
      applyPos(savedLegacy);
    }

    const rect0 = panelEl.getBoundingClientRect();
    if (!saved || saved.x == null || saved.y == null) {
      panelEl.style.left = `${Math.max(16, window.innerWidth - rect0.width - 16)}px`;
      panelEl.style.top = `${Math.max(16, 96)}px`;
    }

    panelEl.style.right = "auto";
    panelEl.style.bottom = "auto";
    updateDockPadding();

    const persist = () => {
      try {
        const r = panelEl.getBoundingClientRect();
        const pos = { x: Math.round(r.left), y: Math.round(r.top) };
        const size = { w: Math.round(r.width), h: Math.round(r.height) };
        localStorage.setItem("nv_heat_overlay_pos", JSON.stringify(pos));
        localStorage.setItem("nv_heat_overlay_size", JSON.stringify(size));
        localStorage.setItem(storageKey, JSON.stringify(Object.assign({}, pos, size)));
      } catch (_) {}
    };

    // drag
    let dragging = false;
    let dragStartX = 0, dragStartY = 0;
    let panelStartLeft = 0, panelStartTop = 0;

    const onDragDown = (e) => {
      if (e.target === rh || rh.contains(e.target)) return;
      if (e.target && e.target.closest && e.target.closest("[data-nv-nodrag], .nv-no-drag")) return;
      if (e.target && e.target.closest && e.target.closest("button, a, input, select, textarea")) return;

      dragging = true;
      dh.style.cursor = "grabbing";
      panelEl.classList.add("nv-overlay-dragging");

      const r = panelEl.getBoundingClientRect();
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      panelStartLeft = r.left;
      panelStartTop = r.top;

      e.preventDefault();
    };

    const onDragMove = (e) => {
      if (!dragging) return;

      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;

      const r = panelEl.getBoundingClientRect();
      const w = r.width;
      const h = r.height;

      const minX = 8;
      const minY = 8;
      const maxX = window.innerWidth - w - 8;
      const maxY = window.innerHeight - h - 8;

      let x = clamp(panelStartLeft + dx, minX, maxX);
      let y = clamp(panelStartTop + dy, minY, maxY);

      x = snap(x, minX, maxX, SNAP_PX);
      y = snap(y, minY, maxY, SNAP_PX);

      panelEl.style.left = `${Math.round(x)}px`;
      panelEl.style.top = `${Math.round(y)}px`;
      updateDockPadding();
    };

    const onDragUp = () => {
      if (!dragging) return;
      dragging = false;
      dh.style.cursor = "grab";
      panelEl.classList.remove("nv-overlay-dragging");
      persist();
      updateDockPadding();
    };

    dh.addEventListener("pointerdown", onDragDown);
    window.addEventListener("pointermove", onDragMove);
    window.addEventListener("pointerup", onDragUp);

    // resize
    let resizing = false;
    let resizeStartX = 0, resizeStartY = 0;
    let startW = 0, startH = 0;
    let startLeft = 0, startTop = 0;

    const onResizeDown = (e) => {
      resizing = true;
      panelEl.classList.add("nv-overlay-resizing");

      const r = panelEl.getBoundingClientRect();
      resizeStartX = e.clientX;
      resizeStartY = e.clientY;
      startW = r.width;
      startH = r.height;
      startLeft = r.left;
      startTop = r.top;

      e.preventDefault();
      e.stopPropagation();
    };

    const onResizeMove = (e) => {
      if (!resizing) return;

      const dx = e.clientX - resizeStartX;
      const dy = e.clientY - resizeStartY;

      const MIN_W = 320;
      const MIN_H = 260;

      const maxW = Math.max(MIN_W, window.innerWidth - startLeft - 8);
      const maxH = Math.max(MIN_H, window.innerHeight - startTop - 8);

      const newW = clamp(startW + dx, MIN_W, maxW);
      const newH = clamp(startH + dy, MIN_H, maxH);

      panelEl.style.width = `${Math.round(newW)}px`;
      panelEl.style.height = `${Math.round(newH)}px`;
      updateDockPadding();
    };

    const onResizeUp = () => {
      if (!resizing) return;
      resizing = false;
      panelEl.classList.remove("nv-overlay-resizing");

      const r = panelEl.getBoundingClientRect();
      const w = r.width;

      const minX = 8;
      const minY = 8;
      const maxX = window.innerWidth - w - 8;
      const maxY = window.innerHeight - r.height - 8;

      let x = clamp(r.left, minX, maxX);
      let y = clamp(r.top, minY, maxY);
      x = snap(x, minX, maxX, SNAP_PX);
      y = snap(y, minY, maxY, SNAP_PX);

      panelEl.style.left = `${Math.round(x)}px`;
      panelEl.style.top = `${Math.round(y)}px`;

      persist();
      updateDockPadding();
    };

    rh.addEventListener("pointerdown", onResizeDown);
    window.addEventListener("pointermove", onResizeMove);
    window.addEventListener("pointerup", onResizeUp);

    // ESC to close
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      const visible = overlayEl.offsetParent !== null && getComputedStyle(overlayEl).display !== "none";
      if (!visible) return;

      if (typeof onClose === "function") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    // keep within viewport on resize
    const onWindowResize = () => {
      const r = panelEl.getBoundingClientRect();
      const w = r.width;
      const h = r.height;

      const minX = 8;
      const minY = 8;
      const maxX = window.innerWidth - w - 8;
      const maxY = window.innerHeight - h - 8;

      const x = clamp(r.left, minX, maxX);
      const y = clamp(r.top, minY, maxY);

      panelEl.style.left = `${Math.round(x)}px`;
      panelEl.style.top = `${Math.round(y)}px`;
      persist();
      updateDockPadding();
    };
    window.addEventListener("resize", onWindowResize);

    overlayEl.__nvDockRefresh__ = updateDockPadding;
    overlayEl.__nvDockClear__ = nvHeatmapClearDockPadding;
    overlayEl.__nvClamp = onWindowResize;
    overlayEl.__nvHeatPersist__ = persist;
    panelEl.__nvHeatPersist__ = persist;

    panelEl.__nvOverlayDispose__ = () => {
      try {
        dh.removeEventListener("pointerdown", onDragDown);
        rh.removeEventListener("pointerdown", onResizeDown);
        window.removeEventListener("pointermove", onDragMove);
        window.removeEventListener("pointerup", onDragUp);
        window.removeEventListener("pointermove", onResizeMove);
        window.removeEventListener("pointerup", onResizeUp);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("resize", onWindowResize);
      } catch (_) {}
    };
  }

  function renderKpis({ total, sourcesCount, tiersCount, lang }) {
    const kpis = document.getElementById("nv-heat-kpis");
    if (!kpis) return;
    const labels = lang === "en" ? { total: "Total", sources: "Sources", tiers: "Tier", mode: "Mode" } : { total: "Toplam", sources: "Kaynaklar", tiers: "Tier", mode: "Mod" };
    kpis.innerHTML = `
      <div class="nv-heat-kpi"><div class="k">${escapeHtml(labels.total)}</div><div class="v">${total}</div></div>
      <div class="nv-heat-kpi"><div class="k">${escapeHtml(labels.sources)}</div><div class="v">${sourcesCount}</div></div>
      <div class="nv-heat-kpi"><div class="k">${escapeHtml(labels.tiers)}</div><div class="v">${tiersCount}</div></div>
      <div class="nv-heat-kpi"><div class="k">${escapeHtml(labels.mode)}</div><div class="v">${VERSION}</div></div>
    `;
  }

  function isDebug() {
    const qs = new URLSearchParams(window.location.search);
    return qs.get("debug") === "1" || localStorage.getItem("nv_debug") === "1";
  }

  function render(overlay, lang) {
    const currentLang = resolveLang(lang);
    const t = L[currentLang];
    const cells = getCells();
    const total = cells.reduce((acc, c) => acc + (c.count || 0), 0);
    const sources = Array.from(new Set(cells.map((c) => c.source))).sort();
    const tiers = Array.from(new Set(cells.map((c) => c.tier))).sort();
    const ov = overlay || document.getElementById("nv-heat-overlay");
    const isCollapsed = !!(ov && ov.classList.contains("is-collapsed"));
    const helpLines = Array.isArray(t.helpLines) ? t.helpLines : [];
    const helpBlock = helpLines.length
      ? `<div class="nv-heat-help">${helpLines
          .map((line) => `<div>${escapeHtml(line)}</div>`)
          .join("")}</div>`
      : "";

    const mini = document.getElementById("nv-heat-mini");
    const miniTotal = document.getElementById("nv-heat-mini-total");
    if (mini && miniTotal) {
      mini.style.display = isCollapsed ? "block" : "none";
      miniTotal.textContent = String(total);
    }

    renderKpis({ total: String(total), sourcesCount: String(sources.length), tiersCount: String(tiers.length), lang: currentLang });

    const bodyEl = document.getElementById("nv-heat-body");
    if (!bodyEl) {
      console.warn("[heatmap-overlay] nv-heat-body missing");
      return;
    }

    if (!cells.length) {
      const hint = t.hintGenerate ? `<div class="nv-heat-hint">${escapeHtml(t.hintGenerate)}</div>` : "";
      bodyEl.innerHTML = `${helpBlock}<div class="nv-heat-empty">${escapeHtml(t.none)}${hint ? `<br/>${hint}` : ""}</div>`;
      ov.__nvHeatLangUpdate__?.();
      ov.__nvHeatCollapseUpdate__?.();
      return;
    }

    const sourcesAggList = sources
      .map((s) => ({
        source: s,
        count: cells.filter((c) => c.source === s).reduce((a, b) => a + b.count, 0),
      }))
      .sort((a, b) => b.count - a.count || a.source.localeCompare(b.source));

    const tiersAggList = tiers
      .map((tier) => ({
        tier,
        count: cells.filter((c) => c.tier === tier).reduce((a, b) => a + b.count, 0),
      }))
      .sort((a, b) => b.count - a.count || a.tier.localeCompare(b.tier));

    const matrix = {};
    cells.forEach((c) => {
      matrix[c.source] ||= {};
      matrix[c.source][c.tier] = (matrix[c.source][c.tier] || 0) + c.count;
    });

    const matrixTable = `
      <div class="nv-heat-table-wrap">
        <table class="nv-heat-table">
          <thead>
            <tr>
              <th>Source</th>
              ${tiers.map((tVal) => `<th>${escapeHtml(tVal)}</th>`).join("")}
              <th>${escapeHtml(t.total)}</th>
            </tr>
          </thead>
          <tbody>
            ${sources
              .map((s) => {
                const rowTotal = tiers.reduce((sum, tVal) => sum + (matrix[s]?.[tVal] || 0), 0);
                return `
                  <tr>
                    <td>${escapeHtml(s)}</td>
                    ${tiers.map((tVal) => `<td>${matrix[s]?.[tVal] || ""}</td>`).join("")}
                    <td><b>${rowTotal || ""}</b></td>
                  </tr>
                `;
              })
              .join("")}
            <tr>
              <td><b>${escapeHtml(t.total)}</b></td>
              ${tiers
                .map((tVal) => {
                  const colTotal = sources.reduce((sum, s) => sum + (matrix[s]?.[tVal] || 0), 0);
                  return `<td><b>${colTotal || ""}</b></td>`;
                })
                .join("")}
              <td><b>${total || ""}</b></td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    const mix = nvComputePageMixFromCells(cells);

    const debugHtml = isDebug()
      ? `<div class="nv-heat-debug" style="margin:10px 0;padding:10px;border:1px dashed rgba(255,255,255,.35);border-radius:12px;font-size:12px;line-height:1.4;">
          <div><b>Debug</b></div>
          <div style="margin:8px 0; display:flex; gap:8px; flex-wrap:wrap;">
            <button type="button" data-act="nv-backup" style="padding:6px 10px;border-radius:999px;font-size:12px;">Backup</button>
            <button type="button" data-act="nv-cleanup-dry" style="padding:6px 10px;border-radius:999px;font-size:12px;">Cleanup (dry-run)</button>
            <button type="button" data-act="nv-cleanup-apply" style="padding:6px 10px;border-radius:999px;font-size:12px;">Cleanup (apply)</button>
          </div>
          <div>Keys: ${countPrefixedKeys(PREFIX)}</div>
          <div>Last: ${localStorage.getItem("nv_heat_last_key") || "-"}</div>
          <div>NV_HEAT.readAll: ${typeof window.NV_HEAT?.readAll}</div>
          <div>Overlay on: ${window.__NV_HEATMAP_ON__ ? "yes" : "no"}</div>
          <div>Mix (known-only): TR ${mix.pctTR}% / EN ${mix.pctEN}% / TR+EN ${mix.pctTREn}% | unknown ${mix.pctUnknown_all}%</div>
        </div>`
      : "";

    const mixHtml = `
      <section class="nvhm-sec">
        <div class="nvhm-sec-title">Page mix (known-only)</div>
        <div class="nvhm-kv">
          <div class="nvhm-kv-row"><span>TR only</span><b>${mix.TR}</b><i>${mix.pctTR}%</i></div>
          <div class="nvhm-kv-row"><span>EN only</span><b>${mix.EN}</b><i>${mix.pctEN}%</i></div>
          <div class="nvhm-kv-row"><span>TR+EN</span><b>${mix.TREn}</b><i>${mix.pctTREn}%</i></div>
          ${mix.Unknown ? `<div class="nvhm-kv-row"><span>Unknown</span><b>${mix.Unknown}</b><i>${mix.pctUnknown_all}%</i></div>` : ""}
          <div class="nvhm-kv-foot">Total: <b>${mix.total}</b>${mix.knownTotal ? ` | Known: <b>${mix.knownTotal}</b>` : ""}</div>
        </div>
      </section>
    `;

    bodyEl.innerHTML = `
      ${helpBlock}
      <div class="nv-heat-subtitle">${escapeHtml(t.subtitle)}</div>
      ${debugHtml}
      ${mixHtml}

      <details class="nv-heat-section" open>
        <summary>${escapeHtml(t.sources)} <span class="nv-heat-sum">${sourcesAggList.length}</span></summary>
        <div class="nv-heat-table-wrap is-simple">
          <table class="nv-heat-table nv-heat-table--simple">
            <thead><tr><th>${escapeHtml(t.sources)}</th><th>${escapeHtml(t.total)}</th></tr></thead>
            <tbody>
              ${sourcesAggList.map((r) => `<tr><td>${escapeHtml(r.source)}</td><td><b>${r.count}</b></td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </details>

      <details class="nv-heat-section" open>
        <summary>${escapeHtml(t.tiers)} <span class="nv-heat-sum">${tiersAggList.length}</span></summary>
        <div class="nv-heat-table-wrap is-simple">
          <table class="nv-heat-table nv-heat-table--simple">
            <thead><tr><th>${escapeHtml(t.tiers)}</th><th>${escapeHtml(t.total)}</th></tr></thead>
            <tbody>
              ${tiersAggList.map((r) => `<tr><td>${escapeHtml(r.tier)}</td><td><b>${r.count}</b></td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </details>

      <details class="nv-heat-section" open>
        <summary>Source × Tier <span class="nv-heat-sum">${escapeHtml(t.total)}: ${total || 0}</span></summary>
        ${matrixTable}
      </details>
    `;

    bodyEl.querySelectorAll(".nv-heat-table-wrap").forEach((w) => {
      try { w.scrollLeft = 0; } catch (_) {}
    });
    ov.__nvHeatLangUpdate__?.();
    ov.__nvHeatCollapseUpdate__?.();
  }

  function buildUI() {
    const initialT = tNow();

    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "nv-heat-chip";
    chip.textContent = initialT.chip;
    chip.setAttribute("title", initialT.helpChip || initialT.chip);
    chip.setAttribute("aria-label", initialT.helpChip || initialT.chip);
    document.body.appendChild(chip);

    const overlay = document.createElement("div");
    overlay.id = "nv-heat-overlay";
    overlay.className = "nv-heat-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `
      <div class="nv-heat-panel" id="nv-heat-panel">

        <div class="nv-heat-head" id="nv-heat-head">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
            <div style="font-weight:800;">HEATMAP</div>
            <button type="button" id="nv-heat-toggle" data-act="toggle" style="padding:8px 10px;border-radius:999px;font-size:12px;">${escapeHtml(initialT.collapse)}</button>
          </div>

          <div class="nv-heat-actions" id="nv-heat-actions">
            <button type="button" id="nv-heat-copy" data-act="copy">${escapeHtml(initialT.copy)}</button>
            <button type="button" id="nv-heat-dl" data-act="download">${escapeHtml(initialT.download)}</button>
            <button type="button" id="nv-heat-reset" data-act="reset">${escapeHtml(initialT.reset)}</button>
            <button type="button" id="nv-heat-dock" data-act="dock-right">${escapeHtml(initialT.dockRight)}</button>
            <button type="button" id="nv-heat-close" data-act="close">${escapeHtml(initialT.close)}</button>
          </div>

          <!-- Collapsed (mini) -->
          <div id="nv-heat-mini" style="margin-top:10px;display:none;">
            <div style="
              border:1px solid rgba(255,255,255,.10);
              background: rgba(255,255,255,.06);
              border-radius: 14px;
              padding: 10px 12px;
              display:flex;
              align-items:center;
              justify-content:space-between;
              gap:10px;
            ">
              <div style="font-size:12px;opacity:.8;">${escapeHtml(initialT.total)}</div>
              <div id="nv-heat-mini-total" style="font-weight:900;font-size:18px;">0</div>
            </div>
          </div>
        </div>

        <!-- Expanded KPIs -->
        <div class="nv-heat-kpis nv-heat-hide-when-collapsed" id="nv-heat-kpis"></div>

        <!-- Expanded Data area -->
        <div class="nv-heat-data nv-heat-hide-when-collapsed" id="nv-heat-data">
          <div id="nv-heat-body"></div>
        </div>

        <div class="nv-heat-resize" id="nv-heat-resize" title="Resize"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    const panelEl = overlay.querySelector("#nv-heat-panel");
    const headEl = overlay.querySelector("#nv-heat-head");
    const resizeEl = overlay.querySelector("#nv-heat-resize");

    const syncLang = () => {
      const tt = tNow();
      chip.textContent = tt.chip;
      chip.setAttribute("title", tt.helpChip || tt.chip);
      chip.setAttribute("aria-label", tt.helpChip || tt.chip);
      [
        ["copy", tt.copy],
        ["download", tt.download],
        ["reset", tt.reset],
        ["dock-right", tt.dockRight],
        ["close", tt.close],
      ].forEach(([act, label]) => {
        const btn = overlay.querySelector(`[data-act="${act}"]`);
        if (btn) btn.textContent = label;
      });
      overlay.__nvHeatCollapseUpdate__?.();
    };
    overlay.__nvHeatLangUpdate__ = syncLang;

    setupCollapse(overlay);
    nvAttachOverlayDragResize({
      overlayEl: overlay,
      panelEl,
      dragHandleEl: headEl,
      resizeHandleEl: resizeEl,
      onClose: () => overlay.querySelector('[data-act="close"]')?.click(),
      storageKey: "nv_heat_overlay_state_v1",
    });

    syncLang();

    const langObserver = new MutationObserver((records) => {
      if (!records.some((rec) => rec.attributeName === "lang")) return;
      syncLang();
      if (overlay.classList.contains("is-on")) {
        render(overlay);
      }
    });
    langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

    const originalDispose = panelEl.__nvOverlayDispose__;
    panelEl.__nvOverlayDispose__ = () => {
      try { langObserver.disconnect(); } catch (_) {}
      if (typeof originalDispose === "function") originalDispose();
    };

    const dockButton = overlay.querySelector('[data-act="dock-right"]');
    if (dockButton) {
      dockButton.addEventListener("click", () => {
        const rect = panelEl.getBoundingClientRect();
        const targetLeft = Math.max(8, window.innerWidth - rect.width - 16);
        const targetTop = Math.max(8, window.innerHeight - rect.height - 16);
        panelEl.style.left = `${Math.round(targetLeft)}px`;
        panelEl.style.top = `${Math.round(targetTop)}px`;
        panelEl.__nvHeatPersist__?.();
        overlay.__nvClamp?.();
        overlay.__nvDockRefresh__?.();
      });
    }

    chip.addEventListener("click", () => {
      syncLang();
      render(overlay);
      overlay.classList.add("is-on");
      overlay.setAttribute("aria-hidden", "false");
      if (overlay.__nvClamp) {
        try { overlay.__nvClamp(); } catch (_) {}
      }
      if (overlay.__nvDockRefresh__) {
        try { overlay.__nvDockRefresh__(); } catch (_) {}
      }
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("is-on");
        overlay.setAttribute("aria-hidden", "true");
        nvHeatmapClearDockPadding();
      }
    });

    // Debug-only tools (Backup/Cleanup)
    overlay.addEventListener("click", (e) => {
      const act = e.target && e.target.getAttribute && e.target.getAttribute("data-act");
      if (!act) return;
      if (!isDebug()) return;

      if (act === "nv-backup") {
        const r = nvBackupWaClicks();
        toast(`Backup OK (${r.keys} keys)`);
        return;
      }

      if (act === "nv-cleanup-dry") {
        const plan = nvCleanupMergeWaClicks({ dryRun: true, deleteLegacy: true });
        console.log("[NV Cleanup dry-run]", plan);
        toast(`Cleanup plan: ${plan.mergeTargets} targets, movedSum=${plan.movedSum}`);
        return;
      }

      if (act === "nv-cleanup-apply") {
        const ok = window.confirm("Cleanup APPLY: legacy keys will be merged into new format (lang=UNKNOWN). Continue?");
        if (!ok) return;
        const res = nvCleanupMergeWaClicks({ dryRun: false, deleteLegacy: true });
        console.log("[NV Cleanup apply]", res);
        toast(`Cleanup done: writes=${res.writes || 0}, deletes=${res.deletes || 0}`);
        render(overlay);
        return;
      }
    });

    overlay.querySelector('[data-act="close"]').addEventListener("click", () => {
      overlay.classList.remove("is-on");
      overlay.setAttribute("aria-hidden", "true");
      nvHeatmapClearDockPadding();
    });

    overlay.querySelector('[data-act="reset"]').addEventListener("click", () => {
      const tt = tNow();
      if (!window.confirm(tt.confirmReset)) return;
      if (window.NV_HEAT && typeof window.NV_HEAT.reset === "function") {
        window.NV_HEAT.reset();
      } else {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(PREFIX)) keys.push(k);
        }
        keys.forEach((k) => localStorage.removeItem(k));
      }
      render(overlay);
      toast(tt.toastResetOk);
    });

    overlay.querySelector('[data-act="copy"]').addEventListener("click", async () => {
      const rows = getCells()
        .slice()
        .sort((a, b) => (b.count - a.count) || a.source.localeCompare(b.source) || a.tier.localeCompare(b.tier));

      const csv = toCSV(rows);
      const out = buildExportText(csv, rows);
      const tt = tNow();
      try {
        await copyText(out);
        toast(tt.toastCopied);
      } catch (e) {
        console.warn("[heatmap] copy failed", e);
        toast(tt.toastCopyFail);
      }
    });

    overlay.querySelector('[data-act="download"]').addEventListener("click", () => {
      const rows = getCells()
        .slice()
        .sort((a, b) => (b.count - a.count) || a.source.localeCompare(b.source) || a.tier.localeCompare(b.tier));
      const csv = toCSV(rows);
      const out = buildExportText(csv, rows);
      const tt = tNow();
      const nameTxt = `nv-heatmap_${safeDateStamp()}.txt`;
      downloadText(nameTxt, out, "text/plain;charset=utf-8");
      toast(tt.toastDownloaded);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildUI);
  } else {
    buildUI();
  }
})();
