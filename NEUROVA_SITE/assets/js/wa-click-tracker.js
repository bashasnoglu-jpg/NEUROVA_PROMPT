"use strict";

// wa-click-tracker.js — capture WhatsApp CTA clicks and write nv_wa_click_* counters
(function () {
  const alreadyV2 =
    (window.__NV_WA_TRACKER__ && window.__NV_WA_TRACKER__ === "v2") ||
    window.__NV_WA_TRACKER_V2__ === true;
  if (alreadyV2) return;
  window.__NV_WA_TRACKER__ = "v2";
  window.__NV_WA_TRACKER_V2__ = true;
  const PREFIX = "nv_wa_click__";

  function normalizeToken(s) {
    return String(s || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  function detectSource(el) {
    const srcEl = el && el.closest ? el.closest("[data-source]") : null;
    const explicit = srcEl ? srcEl.getAttribute("data-source") : "";
    if (explicit && explicit.trim()) return normalizeToken(explicit) || "page";

    const bodyPage = document.body.getAttribute("data-page");
    if (bodyPage) return normalizeToken(bodyPage) || "page";
    const file = (location.pathname.split("/").pop() || "page").replace(".html", "");
    return normalizeToken(file) || "page";
  }

  function detectTier(el) {
    const tierEl = el.closest("[data-tier]");
    const t = tierEl ? tierEl.getAttribute("data-tier") : "";
    return normalizeToken(t) || "na";
  }

  /* =========================================================
   * NV WA CLICK TRACKER - NORMALIZE v1.0 (drop-in)
   * Purpose: normalize source/tier to reduce key explosion
   * ========================================================= */

  function nvNormStr(input) {
    let s = (input ?? "").toString().trim();

    // Unicode normalize + remove diacritics (best effort)
    try {
      s = s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
    } catch (_) {}

    s = s.toLowerCase();

    s = s
      .replace(/\s+/g, " ")
      .replace(/[|/\\]+/g, "-")
      .replace(/[^a-z0-9 _-]/g, "")
      .trim();

    s = s.replace(/\s+/g, "-");

    s = s.replace(/-+/g, "-").replace(/^-/, "").replace(/-$/, "");

    return s;
  }

  function nvDetectLangFromUrl(u) {
    try {
      const url = new URL(u, location.origin);
      const p = (url.pathname || "").toLowerCase();

      const qp = (url.searchParams.get("lang") || "").toLowerCase();
      if (qp === "en") return "EN";
      if (qp === "tr") return "TR";

      if (p.startsWith("/en/") || p === "/en" || p.endsWith("-en.html") || p.includes("/en-")) return "EN";
      if (p.startsWith("/tr/") || p === "/tr" || p.endsWith("-tr.html") || p.includes("/tr-")) return "TR";

      return null;
    } catch (_) {
      return null;
    }
  }

  function nvDetectLangFromDom() {
    const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    if (htmlLang.startsWith("en")) return "EN";
    if (htmlLang.startsWith("tr")) return "TR";

    const og = document.querySelector('meta[property="og:locale"]');
    const ogc = ((og && og.getAttribute("content")) || "").toLowerCase();
    if (ogc.includes("en_")) return "EN";
    if (ogc.includes("tr_")) return "TR";

    return null;
  }

  function nvDetectTrEnToggle() {
    const txt = (s) => (s || "").trim().toLowerCase();
    const candidates = Array.from(document.querySelectorAll("a,button,[role='button']"));
    let hasTR = false;
    let hasEN = false;

    for (const el of candidates) {
      const t = txt(el.textContent);
      const aria = txt(el.getAttribute("aria-label"));
      const href = (el.getAttribute("href") || "").toLowerCase();

      if (t === "tr" || aria.includes("turkish") || href.includes("lang=tr") || href.startsWith("/tr")) hasTR = true;
      if (t === "en" || aria.includes("english") || href.includes("lang=en") || href.startsWith("/en")) hasEN = true;

      if (hasTR && hasEN) return true;
    }
    return false;
  }

  function nvDetectHreflangAlternates() {
    const alts = Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]'));
    let hasTR = false;
    let hasEN = false;

    for (const l of alts) {
      const hl = (l.getAttribute("hreflang") || "").toLowerCase();
      if (hl.startsWith("tr")) hasTR = true;
      if (hl.startsWith("en")) hasEN = true;
    }
    return hasTR && hasEN;
  }

  function nvDetectBilingualBlocks() {
    const hasTrBlock = !!document.querySelector("[data-lang='tr'], .lang-tr, [lang='tr']");
    const hasEnBlock = !!document.querySelector("[data-lang='en'], .lang-en, [lang='en']");
    return hasTrBlock && hasEnBlock;
  }

  function nvDetectPageMixMode() {
    const urlLang = nvDetectLangFromUrl(location.href);
    if (urlLang) return { mode: urlLang, reason: "url" };

    const hasAlt = nvDetectHreflangAlternates();
    const hasToggle = nvDetectTrEnToggle();
    const hasBlocks = nvDetectBilingualBlocks();
    if (hasAlt || hasToggle || hasBlocks) {
      return { mode: "TR+EN", reason: hasBlocks ? "blocks" : (hasAlt ? "hreflang" : "toggle") };
    }

    const domLang = nvDetectLangFromDom();
    if (domLang) return { mode: domLang, reason: "dom" };

    return { mode: "TR", reason: "fallback" };
  }

  function nvNormalizeLangMode(raw) {
    const s = String(raw || "").toUpperCase().replace(/[^A-Z+]/g, "");
    if (s === "TR" || s === "EN" || s === "TR+EN") return s;
    if (s === "EN+TR") return "TR+EN";
    return "TR";
  }

  const NV_SOURCE_ALIAS = new Map([
    ["wa", "whatsapp"],
    ["whats-app", "whatsapp"],
    ["whatsapp", "whatsapp"],

    ["ig", "instagram"],
    ["insta", "instagram"],
    ["instagram", "instagram"],

    ["g", "google"],
    ["google", "google"],
    ["google-ads", "googleads"],
    ["googleads", "googleads"],
    ["adwords", "googleads"],

    ["fb", "facebook"],
    ["facebook", "facebook"],
    ["meta", "meta"],
    ["meta-ads", "metaads"],
    ["metaads", "metaads"],

    ["direct", "direct"],
    ["none", "direct"],
    ["(direct)", "direct"],
    ["ref", "referral"],
    ["referral", "referral"],

    ["bybit", "bybit"],
  ]);

  const NV_DEFAULT_SOURCE = "direct";
  const NV_DEFAULT_TIER = "base";
  const NV_MAX_SOURCE_LEN = 48;
  const NV_MAX_TIER_LEN = 24;
  const NV_MAX_DATE_LEN = 10;

  function nvNormalizeSource(rawSource) {
    const s = nvNormStr(rawSource);
    const mapped = NV_SOURCE_ALIAS.get(s) || s;
    return mapped || NV_DEFAULT_SOURCE;
  }

  const NV_TIER_ALIAS = new Map([
    ["t0", "t0"],
    ["tier0", "t0"],
    ["tier-0", "t0"],

    ["t1", "t1"],
    ["tier1", "t1"],
    ["tier-1", "t1"],

    ["t2", "t2"],
    ["tier2", "t2"],
    ["tier-2", "t2"],

    ["vip", "vip"],
    ["premium", "vip"],
  ]);

  function nvNormalizeTier(rawTier) {
    const t = nvNormStr(rawTier);
    const mapped = NV_TIER_ALIAS.get(t) || t;
    return mapped || NV_DEFAULT_TIER;
  }

  function nvNormalizeClickParts({ source, tier, dateStr, langMode }) {
    let s = nvNormalizeSource(source).slice(0, NV_MAX_SOURCE_LEN);
    let t = nvNormalizeTier(tier).slice(0, NV_MAX_TIER_LEN);
    if (!s) s = NV_DEFAULT_SOURCE;
    if (!t) t = NV_DEFAULT_TIER;
    const d = nvNormStr(dateStr || "").slice(0, NV_MAX_DATE_LEN) || "na";
    const l = nvNormalizeLangMode(langMode);
    return { source: s, tier: t, day: d, lang: l };
  }

  function nvBuildClickKeyFromParts(parts) {
    return `${PREFIX}${parts.source}__${parts.tier}__${parts.day}__${parts.lang}`;
  }

  // Key format: nv_wa_click__<source>__<tier>__<yyyy-mm-dd>__<lang>
  function nvBuildClickKey({ source, tier, dateStr, langMode }) {
    return nvBuildClickKeyFromParts(nvNormalizeClickParts({ source, tier, dateStr, langMode }));
  }

  function isWhatsAppTarget(el) {
    const href = (el.getAttribute("href") || "").trim().toLowerCase();
    if (href.includes("wa.me/")) return true;
    if (href.includes("api.whatsapp.com")) return true;
    if (href.includes("whatsapp.com")) return true;

    if (el.hasAttribute("data-wa")) return true;
    const aria = (el.getAttribute("aria-label") || "").toLowerCase();
    if (aria.includes("whatsapp")) return true;

    return false;
  }

  function bump(source, tier, dateStr, langMode, mixReason) {
    const parts = nvNormalizeClickParts({ source, tier, dateStr, langMode });
    const key = nvBuildClickKeyFromParts(parts);
    const v = parseInt(localStorage.getItem(key) || "0", 10) || 0;
    localStorage.setItem(key, String(v + 1));
    try {
      localStorage.setItem("nv_heat_last_key", key);
      localStorage.setItem("nv_heat_last_source", parts.source);
      localStorage.setItem("nv_heat_last_tier", parts.tier);
      localStorage.setItem("nv_heat_last_day", parts.day);
      localStorage.setItem("nv_mix_last_mode", parts.lang);
      if (mixReason) localStorage.setItem("nv_mix_last_reason", String(mixReason));
    } catch (e) {}
    if (localStorage.getItem("nv_debug") === "1") {
      console.info("[wa-click-tracker] bump", key);
    }
  }

  // Capture + delegation for static and dynamic CTAs
  document.addEventListener(
    "click",
    (e) => {
      const target = e.target && e.target.closest ? e.target.closest("a,button") : null;
      if (!target) return;
      if (!isWhatsAppTarget(target)) return;

      const href = (target.getAttribute("href") || "").trim();
      const sourceRaw = detectSource(target);
      const tierRaw = detectTier(target);

      if (href.startsWith("#") && (!tierRaw || tierRaw === "na")) return;

      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      const mix = nvDetectPageMixMode();
      bump(sourceRaw, tierRaw, dateStr, mix.mode, mix.reason);
    },
    true
  );
})();
