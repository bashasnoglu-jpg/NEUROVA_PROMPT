"use strict";

// heatmap.js — core counters only (UI handled by heatmap-overlay.js)
(function () {
  const STORAGE_KEY = "nv_heat_counts";
  const PREFIX = "nv_wa_click_";
  const LAST_KEY = "nv_heat_last_key";

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (_) {
      return {};
    }
  }

  function save(map) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map || {}));
    } catch (_) {}
  }

  function stripDiacritics(str) {
    try {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    } catch (_) {
      return str;
    }
  }

  function normalizeSource(source) {
    const raw = (source || "unknown").toString().trim();
    const lower = stripDiacritics(raw).toLowerCase().replace(/\s+/g, "");
    const aliasMap = {
      urunler: "Ürünler",
      products: "Products",
      paketler: "Paketler",
      packages: "Packages",
    };
    return aliasMap[lower] || raw || "unknown";
  }

  function normalizeTier(tier) {
    const raw = (tier || "").toString().trim();
    if (/^entry$/i.test(raw)) return "Entry";
    if (/^value$/i.test(raw)) return "Value";
    if (/^premium$/i.test(raw)) return "Premium";
    return "N/A";
  }

  function safeKeyPart(str) {
    return String(str || "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9_-]/g, "-");
  }

  function decodeKeyPart(str) {
    return String(str || "").replace(/-/g, " ").trim() || "unknown";
  }

  function bump(srcLabel, tierTag) {
    const source = normalizeSource(srcLabel);
    const tier = normalizeTier(tierTag);
    const map = load();
    const mapKey = `${source}||${tier}`;
    map[mapKey] = (map[mapKey] || 0) + 1;
    save(map);

    try {
      const safeSrc = safeKeyPart(source);
      const safeTier = safeKeyPart(tier);
      const legacyKey = `${PREFIX}${safeSrc}_${safeTier}`;
      const current = parseInt(localStorage.getItem(legacyKey) || "0", 10) || 0;
      localStorage.setItem(legacyKey, String(current + 1));
      localStorage.setItem(LAST_KEY, `${source}|${tier}`);
    } catch (_) {}
  }

  function mergeInto(acc, source, tier, count) {
    const src = normalizeSource(source);
    const tr = normalizeTier(tier);
    const key = `${src}||${tr}`;
    acc[key] = (acc[key] || 0) + (count || 0);
  }

  function readAll() {
    const acc = {};
    const map = load();
    Object.entries(map).forEach(([key, val]) => {
      const [src, tier] = key.split("||");
      mergeInto(acc, src, tier, Number(val) || 0);
    });

    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(PREFIX)) continue;
      const val = parseInt(localStorage.getItem(k) || "0", 10) || 0;
      if (!val) continue;
      const rest = k.slice(PREFIX.length);
      const idx = rest.lastIndexOf("_");
      const srcPart = idx >= 0 ? rest.slice(0, idx) : rest;
      const tierPart = idx >= 0 ? rest.slice(idx + 1) : "N/A";
      mergeInto(acc, decodeKeyPart(srcPart), decodeKeyPart(tierPart), val);
    }

    return Object.entries(acc)
      .map(([key, count]) => {
        const [src, tier] = key.split("||");
        return { source: src, tier: tier || "N/A", count };
      })
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count || a.source.localeCompare(b.source) || a.tier.localeCompare(b.tier));
  }

  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LAST_KEY);
      const removeKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(PREFIX)) removeKeys.push(k);
      }
      removeKeys.forEach((k) => localStorage.removeItem(k));
    } catch (_) {}
  }

  window.NV_HEAT = { bump, readAll, reset };
})();
