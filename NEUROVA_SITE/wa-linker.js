"use strict";

// wa-linker.js — builds WhatsApp prefill messages (booking/products) with source/tier tags
(function () {
  const cfg = window.NV_WA || {};
  const waNum = (cfg.WA_NUM || "").replace(/\D/g, "");

  const I18N = {
    tr: {
      helloBook: (brand) => `Merhaba, ${brand}’dan rezervasyon yapmak istiyorum.`,
      helloProducts: (brand) => `Merhaba, Products sayfasindan yaziyorum. ${brand} icin siparis olusturmak istiyorum.`,
      bookQ: [
        "1) Gün tercihi: Bugün / Yarın",
        "2) Saat aralığı: (örn. 12:00–15:00 veya 18:00–20:00)",
        "3) Odak: Rahatlama / Toparlanma",
        "4) Koku hassasiyeti var mı? Basınç tercihi: Yumuşak / Orta / Sert",
      ],
      bookClose: "Uygunsa en iyi slotu ayırır mısınız?",
      productLine: (name) => `- ${name} — Adet: [1]`,
      prodQ: (productNames = []) => {
        const items = productNames.length ? productNames.map((n) => `- ${n} — Adet: [1]`) : ["- [urun adi] — Adet: [1]"];
        return [
          "Ürün(ler):",
          ...items,
          "Teslim tercihi: Resepsiyon / Kurye",
          "Bütçe aralığı: ₺____–₺____",
          "Koku hassasiyeti: Var / Yok",
          "Not (opsiyonel):",
        ];
      },
      prodClose: "Stok + fiyat ve bugun teslim/kuryeyi yazabilir misiniz?",
      packLabel: "Paket",
      topicLabel: "Konu",
      productsTopic: "Ürün danışma",
      tagPrefix: "Kaynak",
    },

    en: {
      helloBook: (brand) => `Hello, I’d like to book at ${brand}.`,
      helloProducts: (brand) => `Hi, I'm on the Products page. I'd like to place an order with ${brand}.`,
      bookQ: [
        "1) Preferred day: Today / Tomorrow",
        "2) Preferred time window: (e.g., 12:00–15:00 or 18:00–20:00)",
        "3) Focus: Relax / Recovery",
        "4) Any scent sensitivity? Pressure preference: Soft / Medium / Firm",
      ],
      bookClose: "If available, please reserve the best matching slot.",
      productLine: (name) => `- ${name} — Qty: [1]`,
      prodQ: (productNames = []) => {
        const items = productNames.length ? productNames.map((n) => `- ${n} — Qty: [1]`) : ["- [product name] — Qty: [1]"];
        return [
          "Products I'm interested in:",
          ...items,
          "Delivery: Reception / Courier",
          "Budget range: TL ***-***",
          "Scent sensitivity: Yes / No",
          "Note (optional):",
        ];
      },
      prodClose: "Please confirm stock + pricing and whether today pickup/courier works.",
      packLabel: "Package",
      topicLabel: "Topic",
      productsTopic: "Products inquiry",
      tagPrefix: "Source",
    },
  };

  function joinLines(lines) {
    return "\n\n" + lines.join("\n");
  }

  function getLang() {
    const htmlLang = document.documentElement.getAttribute("lang");
    if (htmlLang) return htmlLang.toLowerCase().startsWith("tr") ? "tr" : "en";
    const path = (location.pathname || "").toLowerCase();
    if (path.includes("paketler")) return "tr";
    if (path.includes("packages")) return "en";
    return "tr";
  }

  function pageLabel() {
    const path = (location.pathname || "").toLowerCase();
    if (path.includes("products")) return { tr: "Ürünler", en: "Products" };
    if (path.includes("paketler") || path.includes("packages")) return { tr: "Paketler", en: "Packages" };
    return { tr: "NEUROVA", en: "NEUROVA" };
  }

  function buildMessageParts({ lang, tier, pack, duration, products = [] }) {
    const brand = cfg.WA_BRAND || "NEUROVA";
    const L = lang === "en" ? I18N.en : I18N.tr;

    const srcLabel = (() => {
      const path = (location.pathname || "").toLowerCase();
      if (path.includes("products")) return lang === "en" ? "Products" : "Ürünler";
      if (path.includes("packages")) return "Packages";
      if (path.includes("paketler")) return "Paketler";
      const file = (location.pathname || "").split("/").filter(Boolean).pop() || "unknown";
      return file;
    })();

    const isProducts = (location.pathname || "").toLowerCase().includes("products");
    const tierTag = tier ? tier : "N/A";
    const tierText = tier ? ` (${tier})` : "";
    const durText =
      duration && String(duration).trim()
        ? (lang === "en" ? ` Duration: ${duration}.` : ` Süre: ${duration}.`)
        : "";

    const headLine = isProducts
      ? ""
      : pack
        ? `${L.packLabel}: ${pack}${tierText}.${durText}`
        : `${durText}`.trim();

    const intro = isProducts ? L.helloProducts(brand) : L.helloBook(brand);
    const questions = isProducts ? L.prodQ(products) : L.bookQ;
    const closeLine = isProducts ? L.prodClose : L.bookClose;
    const tagLine = `\n\n${L.tagPrefix}: ${srcLabel} | Tier: ${tierTag}`;

    const text = intro + (headLine ? " " + headLine : "") + joinLines(questions) + "\n\n" + closeLine + tagLine;
    return { text, srcLabel, tierTag };
  }

  function waUrl(text) {
    if (!waNum) {
      return "https://wa.me/?text=" + encodeURIComponent(text);
    }
    return "https://wa.me/" + waNum + "?text=" + encodeURIComponent(text);
  }

  function inferPackFromCard(cardEl) {
    const sectionTitle = cardEl?.closest(".nv-pack-section")?.querySelector("h2")?.textContent?.trim();
    return sectionTitle || cardEl?.querySelector("h3")?.textContent?.trim() || "";
  }

  function inferTierFromCard(cardEl) {
    const h3 = cardEl?.querySelector("h3")?.textContent || "";
    if (/entry/i.test(h3)) return "Entry";
    if (/value/i.test(h3)) return "Value";
    if (/premium/i.test(h3)) return "Premium";
    if (cardEl?.classList.contains("nv-tier-entry")) return "Entry";
    if (cardEl?.classList.contains("nv-tier-value")) return "Value";
    if (cardEl?.classList.contains("nv-tier-premium")) return "Premium";
    return "";
  }

  function inferTierFromLink(linkEl) {
    const direct = linkEl?.getAttribute("data-tier") || "";
    if (direct && direct.trim()) return direct.trim();
    const holder = linkEl?.closest("[data-tier]");
    const val = holder?.getAttribute("data-tier") || "";
    return val ? val.trim() : "";
  }

  function inferDurationFromCard() {
    return "";
  }

  function inferProducts(linkEl, cardEl) {
    const names = [];
    const add = (val) => {
      if (!val) return;
      const name = String(val).trim();
      if (name) names.push(name);
    };
    add(linkEl?.getAttribute("data-product"));
    add(cardEl?.getAttribute("data-product"));
    const h3 = cardEl?.querySelector("h3")?.textContent;
    add(h3);
    return Array.from(new Set(names));
  }

  function bumpHeat(srcLabel, tierTag) {
    if (window.__NV_WA_TRACKER__ === "v2" || window.__NV_WA_TRACKER_V2__) return;
    if (!window.NV_HEAT || typeof window.NV_HEAT.bump !== "function") return;
    window.NV_HEAT.bump(srcLabel, tierTag);
  }

  function wire() {
    const lang = getLang();

    const links = Array.from(document.querySelectorAll('a[href="#nv-wa"], a[data-wa="1"], .nv-cta[data-wa="1"]'));
    links.forEach((a) => {
      a.addEventListener("click", (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();

        const card = a.closest(".nv-card, .nv-product-card");
        const isProducts = (location.pathname || "").toLowerCase().includes("products");
        const pack = !isProducts && card ? inferPackFromCard(card) : "";
        const tier = !isProducts ? (inferTierFromCard(card) || inferTierFromLink(a)) : "";
        const duration = card ? inferDurationFromCard(card) : "";
        const products = isProducts ? inferProducts(a, card) : [];

        const msgParts = buildMessageParts({ lang, tier, pack, duration, products });
        bumpHeat(msgParts.srcLabel, msgParts.tierTag);

        const url = waUrl(msgParts.text);
        const w = window.open(url, "_blank", "noopener,noreferrer");
        if (!w) {
          window.location.href = url;
        }
      });
    });

    const waLinks = Array.from(document.querySelectorAll("a.nv-wa-link"));
    waLinks.forEach((a) => {
      a.addEventListener("click", (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        const tier = inferTierFromLink(a);
        const msgParts = buildMessageParts({ lang, tier, pack: "", duration: "" });
        bumpHeat(msgParts.srcLabel, msgParts.tierTag);
        const url = waUrl(msgParts.text);
        const w = window.open(url, "_blank", "noopener,noreferrer");
        if (!w) {
          window.location.href = url;
        }
      });

      // keep href for progressive enhancement
      const tier = inferTierFromLink(a);
      const msgParts = buildMessageParts({ lang, tier, pack: "", duration: "" });
      a.setAttribute("href", waUrl(msgParts.text));
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})();
