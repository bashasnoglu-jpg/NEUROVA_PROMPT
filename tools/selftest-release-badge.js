/* tools/selftest-release-badge.js */
(function () {
  "use strict";

  function ensureBadge() {
    let el = document.getElementById("nv-selftest-badge");
    if (el) return el;

    el = document.createElement("div");
    el.id = "nv-selftest-badge";
    el.style.cssText =
      "position:fixed;right:12px;bottom:12px;z-index:99999;" +
      "font:12px/1.25 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;" +
      "padding:10px 12px;border-radius:12px;background:#fff;border:1px solid #e9e9e9;" +
      "box-shadow:0 10px 26px rgba(0,0,0,.10);color:#111;opacity:.97";

    el.addEventListener("click", () => {
      try {
        if (typeof window.NV_OBS_SELFTEST_RUN === "function") {
          const r = window.NV_OBS_SELFTEST_RUN();
          renderBadge(el, r);
          console.log("NV SELFTEST RUN", r);
        } else {
          el.textContent = "Selftest: MISSING";
        }
      } catch (e) {
        el.textContent = "Selftest: ERROR";
        console.error(e);
      }
    });

    document.body.appendChild(el);
    return el;
  }

  function renderBadge(el, r) {
    const ok = (r && r.ok === true) || (window.__NV_SELFTEST_OK__ === true);
    const pc = Array.isArray(window.NV_PROMPTS) ? window.NV_PROMPTS.length : 0;
    const pe = window.__NV_PACK_ERRORS__ ? Object.keys(window.__NV_PACK_ERRORS__).length : 0;

    el.textContent =
      "QA " + (ok ? "PASS" : "FAIL") +
      " | pc=" + pc +
      " | pe=" + pe +
      " (click to rerun)";
    el.setAttribute("data-ok", ok ? "1" : "0");
  }

  const el = ensureBadge();
  setTimeout(() => {
    try {
      const r = (typeof window.NV_OBS_SELFTEST_RUN === "function")
        ? window.NV_OBS_SELFTEST_RUN()
        : null;
      renderBadge(el, r);
    } catch (_) {}
  }, 400);
})();
