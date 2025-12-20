"use strict";

// pricing-linker.js — inject "from" prices into package cards based on NV_PRICING
(function () {
  const cfg = window.NV_PRICING || {};

  function getLang() {
    const htmlLang = document.documentElement.getAttribute("lang");
    if (htmlLang) return htmlLang.toLowerCase().startsWith("tr") ? "tr" : "en";
    const path = (location.pathname || "").toLowerCase();
    if (path.includes("paketler")) return "tr";
    if (path.includes("packages")) return "en";
    return "tr";
  }

  function fmtPrice(val, lang) {
    if (typeof val !== "number" || val <= 0) return "";
    const cur = (cfg.currency && cfg.currency[lang]) || "";
    return lang === "en" ? `From: ${cur} ${val}` : `Başlangıç: ${cur}${val}`;
  }

  function getFamily(cardEl) {
    const explicit = cardEl?.dataset.family;
    if (explicit) return explicit.trim();
    const section = cardEl?.closest(".nv-pack-section");
    const secAttr = section?.dataset.family;
    if (secAttr) return secAttr.trim();
    const h2 = section?.querySelector("h2")?.textContent?.trim();
    return h2 || "";
  }

  function getTier(cardEl) {
    if (cardEl?.dataset.tier) return cardEl.dataset.tier;
    if (cardEl?.classList.contains("nv-tier-entry")) return "Entry";
    if (cardEl?.classList.contains("nv-tier-value")) return "Value";
    if (cardEl?.classList.contains("nv-tier-premium")) return "Premium";
    return "";
  }

  function lookupPrice(family, tier, lang) {
    const fam = (cfg.families && family && cfg.families[family]) || null;
    const byFam = fam && fam[tier] ? fam[tier] : null;
    const byTier = cfg.tiers && cfg.tiers[tier] ? cfg.tiers[tier] : null;
    const node = byFam || byTier;
    if (!node) return "";
    const val = node[lang === "en" ? "enFrom" : "trFrom"];
    return fmtPrice(val, lang);
  }

  function inject() {
    const lang = getLang();
    const cards = Array.from(document.querySelectorAll(".nv-card"));
    cards.forEach((card) => {
      const family = getFamily(card);
      const tier = getTier(card);
      const priceText = lookupPrice(family, tier, lang);
      if (!priceText) return;

      // avoid duplicates
      if (card.querySelector(".nv-price")) return;

      const p = document.createElement("p");
      p.className = "nv-price";
      p.textContent = priceText;

      // Insert after meta block if exists, otherwise before CTA
      const meta = card.querySelector(".nv-meta:last-of-type");
      if (meta && meta.nextSibling) {
        meta.parentNode.insertBefore(p, meta.nextSibling);
      } else {
        card.insertBefore(p, card.querySelector(".nv-cta") || card.firstChild);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
