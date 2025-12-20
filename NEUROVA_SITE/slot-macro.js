"use strict";

// slot-macro.js — quick 2-slot clipboard macro (TR/EN) for WhatsApp replies
(function () {
  const prefersReduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  function getLang() {
    const htmlLang = document.documentElement.getAttribute("lang");
    if (htmlLang) return htmlLang.toLowerCase().startsWith("tr") ? "tr" : "en";
    const path = (location.pathname || "").toLowerCase();
    if (path.includes("paketler")) return "tr";
    if (path.includes("packages")) return "en";
    return "tr";
  }

  const L = {
    tr: {
      label: "Slot kopyala",
      prompt: "İki slot gir (virgülle): örn 14:00,18:30",
      fallback: "14:00,18:30",
      premiumPrompt: "Premium için saat (boş bırakılırsa 19:00):",
      premiumFallback: "19:00",
      toast: "Slot mesajı kopyalandı",
      tpl: (a, b, p) => `Bugün için iki uygun saat: ${a} / ${b}.\nPremium için ${p} da müsait. Hangisini ayıralım?`,
    },
    en: {
      label: "Copy slots",
      prompt: "Enter two slots (comma-separated): e.g., 14:00,18:30",
      fallback: "14:00,18:30",
      premiumPrompt: "Premium slot (leave blank for 19:00):",
      premiumFallback: "19:00",
      toast: "Slot message copied",
      tpl: (a, b, p) => `Two available slots today: ${a} / ${b}.\nPremium is also available at ${p}. Which should I reserve?`,
    },
  };

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
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

  function showToast(text) {
    let toast = document.querySelector(".nv-slot-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "nv-slot-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add("is-on");
    window.setTimeout(() => toast.classList.remove("is-on"), prefersReduced ? 400 : 1200);
  }

  function createChip() {
    const lang = getLang();
    const dict = lang === "en" ? L.en : L.tr;

    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "nv-slot-chip";
    chip.textContent = dict.label;

    chip.addEventListener("click", async () => {
      const ans = window.prompt(dict.prompt, dict.fallback);
      const slots = String(ans || dict.fallback).split(",").map((s) => s.trim()).filter(Boolean);
      const [a, b] = slots.length >= 2 ? slots : [dict.fallback.split(",")[0], dict.fallback.split(",")[1]];
      const pAns = window.prompt(dict.premiumPrompt, dict.premiumFallback);
      const premium = String(pAns || dict.premiumFallback).trim() || dict.premiumFallback;
      const msg = dict.tpl(a, b, premium);
      await copyText(msg);
      showToast(dict.toast);
    });

    document.body.appendChild(chip);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createChip);
  } else {
    createChip();
  }
})();
