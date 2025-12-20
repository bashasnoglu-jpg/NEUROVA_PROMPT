"use strict";

/**
 * NEUROVA Prompt Loader v1.1 (compat)
 * Pack scriptlerini yükler ve şu kaynaklardan promptları toplar:
 * 1) window.NV_PROMPT_PACKS (önerilen format)
 * 2) window.NV_PROMPTS (bazı pack’ler direkt buna yazabilir)
 * 3) window.PROMPTS / window.ALL_PROMPT_ARRAYS (legacy birleşimler)
 */

(function () {
  // --- NV metrics globals (always defined) ---
  window.__NV_PACK_ERRORS__  = window.__NV_PACK_ERRORS__  || {};
  window.__NV_PACK_METRICS__ = window.__NV_PACK_METRICS__ || {};
  window.__NV_PACK_ERRORS_LOG__ = Array.isArray(window.__NV_PACK_ERRORS_LOG__) ? window.__NV_PACK_ERRORS_LOG__ : [];

  const FLAG = "__NV_PROMPTS_LOADER_V1_1__";
  if (window[FLAG]) return;
  window[FLAG] = true;

  const asArray = (x) => (Array.isArray(x) ? x : []);

  function normalizeItem(it) {
    const item = (it && typeof it === "object") ? { ...it } : {};
    item.id = String(item.id ?? "").trim();
    item.category = String(item.category ?? "").trim();
    item.role = String(item.role ?? "").trim();
    item.title = String(item.title ?? "").trim();

    const lang = (item.lang && typeof item.lang === "object") ? item.lang : {};
    item.lang = { tr: String(lang.tr ?? ""), en: String(lang.en ?? "") };

    item.tags = Array.isArray(item.tags) ? item.tags.map(t => String(t).trim()).filter(Boolean) : [];
    if (item.safeNote != null) item.safeNote = String(item.safeNote);

    return item;
  }

  function dedupeById(items) {
    const seen = new Set();
    const out = [];
    for (const it of items) {
      const id = String(it?.id ?? "");
      if (!id) continue;
      if (seen.has(id)) continue;
      seen.add(id);
      out.push(it);
    }
    return out;
  }

  function nvResolvePackSrc(srcOrName) {
    const s = String(srcOrName || "").trim();
    if (!s) return "";

    if (s.includes("/") || s.startsWith("./") || s.startsWith("../")) return s;

    return "./packs/" + s;
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => resolve(src);
      s.onerror = () => reject(new Error("Pack load failed: " + src));
      document.head.appendChild(s);
    });
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function loadPackManifest() {
    if (Array.isArray(window.__NV_PACK_MANIFEST__)) return window.__NV_PACK_MANIFEST__;
    if (typeof fetch !== "function") {
      window.__NV_PACK_MANIFEST__ = [];
      return [];
    }

    try {
      const response = await fetch("./packs/manifest.json", { cache: "no-store" });
      if (!response.ok) throw new Error("manifest load failed");
      const manifest = await response.json();
      const entries =
        Array.isArray(manifest) ? manifest :
        Array.isArray(manifest.packs) ? manifest.packs :
        Array.isArray(manifest.files) ? manifest.files :
        [];
      window.__NV_PACK_MANIFEST__ = entries;
      return entries;
    } catch (err) {
      window.__NV_PACK_MANIFEST__ = [];
      return [];
    }
  }

  function collectUniquePackSources(...sources) {
    const seen = new Set();
    const out = [];
    for (const source of sources) {
      for (const raw of asArray(source)) {
        const resolved = nvResolvePackSrc(raw);
        if (!resolved) continue;
        if (seen.has(resolved)) continue;
        seen.add(resolved);
        out.push(resolved);
      }
    }
    return out;
  }

  async function loadPackWithRetry(src, maxRetry = 1) {
    const errors = [];
    for (let attempt = 1; attempt <= maxRetry + 1; attempt++) {
      try {
        await loadScript(src);
        return { ok: true, attempts: attempt };
      } catch (err) {
        errors.push(err?.message || String(err));
        if (attempt > maxRetry) break;
        await delay(150);
      }
    }
    return { ok: false, attempts: maxRetry + 1, errors };
  }

  function collectFromNV_PROMPT_PACKS() {
    const packsObj = (window.NV_PROMPT_PACKS && typeof window.NV_PROMPT_PACKS === "object")
      ? window.NV_PROMPT_PACKS
      : {};
    const all = Object.values(packsObj).flatMap(asArray).map(normalizeItem).filter(x => x.id);
    return dedupeById(all);
  }

  function collectFromLegacyGlobals() {
    // Bazı projelerde pack’ler direkt buraya basıyor
    const a = asArray(window.NV_PROMPTS).map(normalizeItem);
    const b = asArray(window.PROMPTS).map(normalizeItem);
    const c = asArray(window.ALL_PROMPT_ARRAYS).flatMap(asArray).map(normalizeItem);

    return dedupeById([...a, ...b, ...c].filter(x => x.id));
  }

  window.nvLoadPromptPacks = async function nvLoadPromptPacks(files) {
    const debugParams = new URLSearchParams(location.search);
    const isDebug = debugParams.get("debug") === "1" || localStorage.getItem("NV_DEBUG") === "1";

    let list = [];
    if (Array.isArray(files)) {
      list = [...files];
    } else if (typeof files === "string") {
      list = [files];
    } else if (files && typeof files === "object") {
      list = [
        ...asArray(files.packs),
        ...asArray(files.list),
        ...asArray(files.files)
      ];
    }
    list = list.filter(Boolean);

    const manifestList = await loadPackManifest();
    const fallbackList = Array.isArray(window.NV_PACK_LIST) ? window.NV_PACK_LIST : [];
    const mergedList = collectUniquePackSources(list, fallbackList, manifestList);
    window.NV_PACK_INDEX = { manifest: manifestList, list: mergedList };
    window.NV_PACK_LIST = mergedList;
    window.__NV_PACK_MANIFEST__ = manifestList;
    list = mergedList;

    window.NV_PROMPT_PACKS = window.NV_PROMPT_PACKS || {};
    window.NV_PROMPTS = window.NV_PROMPTS || [];
    const prevErrors = window.__NV_PACK_ERRORS__ || {};
    if (Object.keys(prevErrors).length) {
      const log = Array.isArray(window.__NV_PACK_ERRORS_LOG__) ? window.__NV_PACK_ERRORS_LOG__ : [];
      const snapshot = JSON.parse(JSON.stringify(prevErrors));
      log.push({ ts: new Date().toISOString(), errors: snapshot });
      // sadece son 10 kaydı tut
      while (log.length > 10) log.shift();
      window.__NV_PACK_ERRORS_LOG__ = log;
    }
    window.__NV_PACK_ERRORS__ = {};

    // pack scriptlerini yükle
    for (const item of list) {
      const raw = (item && typeof item === "object")
        ? item.src || item.file || item.path || item.name || ""
        : item;
      const src = nvResolvePackSrc(raw);
      if (!src) continue;

      if (isDebug && window.console) {
        window.console.debug("[nvLoadPromptPacks] pack src:", raw, "->", src);
      }

      const start = (typeof performance !== "undefined" && performance && typeof performance.now === "function")
        ? performance.now()
        : Date.now();
      const res = await loadPackWithRetry(src, 1);
      const end = (typeof performance !== "undefined" && performance && typeof performance.now === "function")
        ? performance.now()
        : Date.now();
      const duration = Math.max(0, end - start);
      const metrics = window.__NV_PACK_METRICS__ = window.__NV_PACK_METRICS__ || {};
      metrics[src] = metrics[src] || {};
      metrics[src].ms = duration;
      metrics[src].attempts = res.attempts;
      metrics[src].ok = res.ok;
      metrics[src].ts = new Date().toISOString();
      if (!res.ok) {
        metrics[src].error = res.errors?.[res.errors.length - 1] || "load failed";
      } else {
        delete metrics[src].error;
      }

      if (!res.ok) {
        window.__NV_PACK_ERRORS__[src] = {
          error: res.errors?.[res.errors.length - 1] || "load failed",
          attempts: res.attempts,
          ts: new Date().toISOString()
        };
        continue; // bu pack'i atla, sıradaki pack'e geç
      }
    }

    // 1) önce önerilen kaynak
    let merged = collectFromNV_PROMPT_PACKS();

    // 2) boşsa legacy/global kaynaklara bak
    if (!merged.length) merged = collectFromLegacyGlobals();

    // 3) yine boşsa NV_PROMPTS mevcutsa onu olduğu gibi bırak (son çare)
    if (!merged.length && Array.isArray(window.NV_PROMPTS) && window.NV_PROMPTS.length) {
      merged = dedupeById(window.NV_PROMPTS.map(normalizeItem).filter(x => x.id));
    }

    window.NV_PROMPTS = merged;

    const packErrorCount = Object.keys(window.__NV_PACK_ERRORS__ || {}).length;
    try {
      if (packErrorCount) {
        window.dispatchEvent(new CustomEvent("nv:packErrors", { detail: { errors: window.__NV_PACK_ERRORS__ } }));
      } else {
        window.dispatchEvent(new Event("nv:packErrors:clear"));
      }
    } catch (_) {}

    if (typeof window.nvOnPromptsReady === "function") window.nvOnPromptsReady(merged);
    if (isDebug && typeof window.NV_RUN_SELFTEST === "function") {
      window.NV_RUN_SELFTEST();
    }
    return merged;
  };

  function buildSelftestSnapshot() {
    const prompts = Array.isArray(window.NV_PROMPTS) ? window.NV_PROMPTS.length : 0;
    const packErrors = window.__NV_PACK_ERRORS__ || {};
    const metrics = window.__NV_PACK_METRICS__ || {};
    const listLength = Array.isArray(window.NV_PACK_LIST) ? window.NV_PACK_LIST.length : 0;
    return {
      ts: new Date().toISOString(),
      prompts,
      packs: listLength,
      packErrors: Object.keys(packErrors).length,
      metrics,
      ok: Object.keys(packErrors).length === 0 && prompts > 0,
    };
  }

  window.NV_RUN_SELFTEST = function NV_RUN_SELFTEST() {
    if (typeof window.NV_OBS_SELFTEST_RUN === "function") {
      return window.NV_OBS_SELFTEST_RUN();
    }
    const snapshot = buildSelftestSnapshot();
    window.__NV_SELFTEST_LAST__ = snapshot;
    window.__NV_SELFTEST_OK__ = snapshot.ok;
    try {
      window.dispatchEvent(new Event("nv:selftest:render"));
    } catch (_) {}
    return snapshot;
  };
})();
