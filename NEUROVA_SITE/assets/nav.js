"use strict";

const prefersReduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const map = {
  "index.html": "home",
  "hamam.html": "hamam",
  "masajlar.html": "masajlar",
  "kids-family.html": "kids-family",
  "face-sothys.html": "face",
  "yoga.html": "yoga",
  "products.html": "urunler",
  "about.html": "about",
  "team.html": "team",
  "packages.html": "paketler",
  "paketler.html": "paketler",
  "prompt-library.html": "prompt"
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
const OPEN_CLASS = "is-open";
const BURGER_CLASS = "is-open";

const open = () => {
  if (!toggle || !panel) return;
  toggle.setAttribute("aria-expanded", "true");
  toggle.classList.add(BURGER_CLASS);
  panel.hidden = false;
  panel.classList.add(OPEN_CLASS);
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
}

const openReservation = () => {
  const fn =
    window.NV_OPEN_RESERVATION ||
    window.nvOpenReservation ||
    window.openReservation ||
    null;

  if (typeof fn === "function") return fn();
  console.log("[NEUROVA] Reservation CTA clicked (no handler found).");
};

qsa("[data-nv-open-reservation]").forEach(btn => {
  btn.addEventListener("click", openReservation);
});
