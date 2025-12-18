/* tools/obs-test-harness.js */
(function () {
  "use strict";

  if (typeof window.NV_OBS_SELFTEST_RUN === "function") return;

  function bool(v) {
    return v === true;
  }

  window.NV_OBS_SELFTEST_RUN = function NV_OBS_SELFTEST_RUN() {
    const result = {
      ts: new Date().toISOString(),
      ok: true,
      checks: {},
      failures: []
    };

    try {
      result.checks.loaderFn = (typeof window.nvLoadPromptPacks === "function");
      result.checks.onReadyFn = (typeof window.nvOnPromptsReady === "function");
      result.checks.promptsLoaded = Array.isArray(window.NV_PROMPTS) && window.NV_PROMPTS.length > 0;
      result.checks.packErrorsGlobal = (typeof window.__NV_PACK_ERRORS__ === "object");
      result.checks.packMetricsGlobal = (typeof window.__NV_PACK_METRICS__ === "object");
      result.checks.packErrorsZero = result.checks.packErrorsGlobal
        ? (Object.keys(window.__NV_PACK_ERRORS__).length === 0)
        : false;

      const root = window.__NV_ROOT_OK__;
      result.checks.rootOk = (root === undefined) ? true : bool(root);

      Object.entries(result.checks).forEach(([k, v]) => {
        if (!v) result.failures.push(k);
      });

      result.ok =
        result.checks.loaderFn &&
        result.checks.onReadyFn &&
        result.checks.promptsLoaded &&
        result.checks.packErrorsGlobal &&
        result.checks.packMetricsGlobal &&
        result.checks.packErrorsZero &&
        result.checks.rootOk;

      window.__NV_SELFTEST_OK__ = !!result.ok;
      window.__NV_SELFTEST_LAST__ = result;
      try { window.dispatchEvent(new Event("nv:selftest:render")); } catch (_) {}

      return result;
    } catch (e) {
      window.__NV_SELFTEST_OK__ = false;
      window.__NV_SELFTEST_LAST__ = { ok: false, error: String(e), ts: new Date().toISOString() };
      try {
        console.error("NV selftest failed", window.__NV_SELFTEST_LAST__);
      } catch (_) {}
      try { window.dispatchEvent(new Event("nv:selftest:render")); } catch (_) {}
      return window.__NV_SELFTEST_LAST__;
    }
  };

  function isQaMode() {
    try {
      const params = new URLSearchParams(window.location.search || "");
      if (params.get("qa") === "1") return true;
    } catch (e) {
      // ignore URL parse issues
    }
    return false;
  }

  function autoRunSelftest() {
    if (!isQaMode()) return;
    try {
      const res = window.NV_OBS_SELFTEST_RUN();
      console.info("NV selftest", res);
    } catch (err) {
      console.warn("NV selftest auto-run failed", err);
    }
  }

  if (document.readyState === "complete") {
    autoRunSelftest();
  } else {
    window.addEventListener("load", autoRunSelftest, { once: true });
  }
})();
