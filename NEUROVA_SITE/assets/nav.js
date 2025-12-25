"use strict";

const prefersReduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const map = {
  "index.html": "home",
  "hamam.html": "hamam",
  "masajlar.html": "masajlar",
  "face-sothys.html": "face",
  "kids-family.html": "kids-family",
  "galeri.html": "galeri",
  "products.html": "urunler",
  "about.html": "about",
  "team.html": "team",
  "packages.html": "paketler",
  "paketler.html": "paketler"
  // prompt-library.html intentionally omitted from nav mapping (Prompt is hidden)
};

const normalizePath = () => {
  const last = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  return last.split("?")[0].split("#")[0];
};

const key = map[normalizePath()];
if (key) {
  qsa(`[data-nav="${key}"]`).forEach(a => a.classList.add("is-active"));
}

const header = qs("[data-nv-header]");
const main = qs("main") || qs(".nv-main") || qs("#main");
if (header && main) {
  const applyPad = () => {
    const h = Math.ceil(header.getBoundingClientRect().height || 0);
    main.style.paddingTop = h ? `${h + 10}px` : "";
  };
  applyPad();
  window.addEventListener("resize", applyPad, { passive: true });
}

const setLock = (on) => {
  document.documentElement.classList.toggle("nv-lock", !!on);
  document.body.classList.toggle("nv-lock", !!on);
};

const toggle = qs("[data-nv-mobile-toggle]");
const panel = qs("[data-nv-mobile-panel]");
const overlay = qs("[data-nv-mobile-overlay]");
const OPEN_CLASS = "is-open";
const BURGER_CLASS = "is-open";

const open = () => {
  if (!toggle || !panel) return;
  toggle.setAttribute("aria-expanded", "true");
  toggle.classList.add(BURGER_CLASS);
  panel.hidden = false;
  panel.classList.add(OPEN_CLASS);
  if (overlay) {
    overlay.hidden = false;
    overlay.classList.add(OPEN_CLASS);
  }
  setLock(true);
};

const close = () => {
  if (!toggle || !panel) return;
  toggle.setAttribute("aria-expanded", "false");
  toggle.classList.remove(BURGER_CLASS);
  panel.classList.remove(OPEN_CLASS);
  const delay = prefersReduced ? 0 : 180;
  window.setTimeout(() => { panel.hidden = true; }, delay);
  setLock(false);
  if (overlay) {
    overlay.classList.remove(OPEN_CLASS);
    window.setTimeout(() => { overlay.hidden = true; }, delay);
  }
};

if (toggle && panel) {
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    expanded ? close() : open();
  });
  panel.addEventListener("click", (e) => {
    if (e.target === panel) close();
  });
  qsa("a", panel).forEach(a => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
  if (overlay) {
    overlay.addEventListener("click", close);
  }
}

const openReservation = () => {
  const fn =
    window.NV_OPEN_RESERVATION ||
    window.nvOpenReservation ||
    window.openReservation ||
    null;

  if (typeof fn === "function") return fn();

  // Fallback: sayfada #nv-wa varsa oraya kaydır
  const anchor = document.getElementById("nv-wa");
  if (anchor) anchor.scrollIntoView({ behavior: "smooth", block: "start" });

  console.log("[NEUROVA] Reservation CTA clicked (no handler found).");
};

function wireReservationTriggers(root = document) {
  root.querySelectorAll("[data-nv-open-reservation]").forEach((el) => {
    if (el.dataset.nvReservationWired === "1") return;
    el.dataset.nvReservationWired = "1";
    el.addEventListener("click", openReservation);
  });
}

// Keep existing behavior (doesn't hurt)…
wireReservationTriggers(document);

/* --- NV Dropdown (Kurumsal) - Delegated Toggle Patch v1.0 --- */
(function () {
  const DROPDOWN_SEL = "[data-nv-dropdown]";
  const TOGGLE_SEL = "[data-nv-dropdown-toggle]";
  const MENU_SEL = "[data-nv-dropdown-menu]";

  function getParts(toggleEl) {
    const dd = toggleEl.closest(DROPDOWN_SEL);
    if (!dd) return null;
    const menu = dd.querySelector(MENU_SEL);
    return menu ? { dd, menu } : null;
  }

  function isOpen(toggleEl, menuEl) {
    return !menuEl.hasAttribute("hidden") && toggleEl.getAttribute("aria-expanded") === "true";
  }

  function closeAll(exceptDropdown) {
    document.querySelectorAll(DROPDOWN_SEL).forEach((dd) => {
      if (exceptDropdown && dd === exceptDropdown) return;
      const toggle = dd.querySelector(TOGGLE_SEL);
      const menu = dd.querySelector(MENU_SEL);
      if (!toggle || !menu) return;
      toggle.setAttribute("aria-expanded", "false");
      menu.setAttribute("hidden", "");
    });
  }

  function openDD(toggleEl, menuEl, ddEl) {
    closeAll(ddEl);
    toggleEl.setAttribute("aria-expanded", "true");
    menuEl.removeAttribute("hidden");
  }

  function closeDD(toggleEl, menuEl) {
    toggleEl.setAttribute("aria-expanded", "false");
    menuEl.setAttribute("hidden", "");
  }

  document.addEventListener("click", (e) => {
    const toggle = e.target.closest(TOGGLE_SEL);
    if (toggle) {
      e.preventDefault();
      const parts = getParts(toggle);
      if (!parts) return;

      const { dd, menu } = parts;
      if (isOpen(toggle, menu)) closeDD(toggle, menu);
      else openDD(toggle, menu, dd);

      e.stopPropagation();
      return;
    }

    if (!e.target.closest(DROPDOWN_SEL)) {
      closeAll();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });

  document.addEventListener("click", (e) => {
    const item = e.target.closest(`${DROPDOWN_SEL} ${MENU_SEL} a`);
    if (item) closeAll();
  });
})();

/* --- NV Reservation - Delegated Click Patch v1.0 (slot-safe) --- */
(function () {
  const RES_SEL = "[data-nv-open-reservation]";
  const DROPDOWN_SEL = "[data-nv-dropdown]";
  const MOBILE_PANEL_SEL = "[data-nv-mobile-panel]";
  const MOBILE_TOGGLE_SEL = "[data-nv-mobile-toggle]";

  function closeMobilePanelIfOpen() {
    const panel = document.querySelector(MOBILE_PANEL_SEL);
    const btn = document.querySelector(MOBILE_TOGGLE_SEL);
    if (!panel || panel.hasAttribute("hidden")) return;

    // reuse existing close behavior if available
    panel.classList.remove("is-open");
    const delay = prefersReduced ? 0 : 180;
    window.setTimeout(() => { panel.hidden = true; }, delay);

    if (btn) {
      btn.setAttribute("aria-expanded", "false");
      btn.classList.remove("is-open");
    }

    document.documentElement.classList.remove("nv-lock");
    document.body.classList.remove("nv-lock");
  }

  function closeDropdownIfOpen() {
    const dd = document.querySelector(DROPDOWN_SEL);
    if (!dd) return;
    const t = dd.querySelector("[data-nv-dropdown-toggle]");
    const m = dd.querySelector("[data-nv-dropdown-menu]");
    if (!t || !m) return;
    t.setAttribute("aria-expanded", "false");
    m.setAttribute("hidden", "");
  }

  document.addEventListener("click", (e) => {
    const el = e.target.closest(RES_SEL);
    if (!el) return;
    if (el && el.hasAttribute("data-wa")) return; // WA linker yönetsin

    // UX: close open UI layers
    closeDropdownIfOpen();
    closeMobilePanelIfOpen();

    // Slot-safe: always work even if nav injected later
    e.preventDefault();
    openReservation();
  });
})();
