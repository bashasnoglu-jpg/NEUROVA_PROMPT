/*
 * NEUROVA_STORE_INTERACTIVE_FIX.js
 * Lightweight fallback interactions for cart, curation, and delivery on static pages.
 * - Adds cart state with localStorage persistence
 * - Updates cart badges and list rendering
 * - Generates WhatsApp checkout / curation messages
 * - Adds delivery selection mock (courier vs pickup)
 */
(function () {
  if (window.NV_STORE_INTERACTIVE_FIX_LOADED) return;
  window.NV_STORE_INTERACTIVE_FIX_LOADED = true;

  const lang = (document.documentElement.getAttribute("lang") || "tr").toLowerCase().startsWith("en") ? "en" : "tr";
  const t = (tr, en) => (lang === "en" ? en : tr);
  const storageKey = "nv_cart_v1";

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // If no cart controls exist, bail early to avoid running on unrelated pages.
  const hasCartUI = $('[data-cart-items]') || $$('[data-add]').length;
  if (!hasCartUI) return;

  const els = {
    addBtns: $$('[data-add]'),
    cartItems: $('[data-cart-items]'),
    cartTotal: $('[data-cart-total]'),
    cartCount: $$('[data-cart-count]'),
    checkout: $('[data-checkout]'),
    curation: $('[data-curation]'),
    deliveryBtns: $$('[data-delivery]'),
    deliveryStatus: $('[data-delivery-status]'),
    curationForm: $('[data-curation-form]'),
    curationOut: $('[data-curation-output]'),
  };

  const productIndex = new Map();

  function buildProductIndex() {
    els.addBtns.forEach((btn) => {
      const id = btn.dataset.add;
      if (!id || productIndex.has(id)) return;
      const card = btn.closest("article") || btn.closest(".product-card") || btn.closest(".nv-card");
      const name = (card && (card.querySelector(".product-name") || card.querySelector("h3")))?.textContent?.trim();
      const priceText = (card && (card.querySelector(".price") || card.querySelector(".product-price")))?.textContent || "";
      const price = parsePrice(priceText);
      productIndex.set(id, {
        id,
        name: name || id,
        price: Number.isFinite(price) ? price : 0,
      });
    });
  }

  function parsePrice(text) {
    const cleaned = (text || "").replace(/[^0-9.,-]/g, "").replace(",", ".");
    const num = parseFloat(cleaned);
    return Number.isFinite(num) ? num : 0;
  }

  function fmtCurrency(value) {
    const safe = Number.isFinite(value) ? value : 0;
    const locale = lang === "en" ? "en-US" : "tr-TR";
    return new Intl.NumberFormat(locale, { style: "currency", currency: "TRY", minimumFractionDigits: 0 }).format(safe);
  }

  function loadCart() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((item) => ({ ...item, qty: item.qty || 1 }));
    } catch (_) {
      return [];
    }
  }

  let cart = loadCart();

  function saveCart() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch (_) {
      /* ignore */
    }
  }

  function addToCart(id) {
    if (!id) return;
    const meta = productIndex.get(id) || { id, name: id, price: 0 };
    const existing = cart.find((c) => c.id === id);
    if (existing) existing.qty += 1;
    else cart.push({ id, name: meta.name, price: meta.price, qty: 1 });
    saveCart();
    renderCart();
  }

  function changeQty(id, delta) {
    const item = cart.find((c) => c.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter((c) => c.id !== id);
    }
    saveCart();
    renderCart();
  }

  function renderCart() {
    const count = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
    if (els.cartCount.length) {
      els.cartCount.forEach((el) => (el.textContent = `${t("Sepet", "Cart")}: ${count}`));
    }

    const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 0), 0);
    if (els.cartTotal) {
      els.cartTotal.textContent = fmtCurrency(total);
    }

    if (els.cartItems) {
      if (!cart.length) {
        els.cartItems.innerHTML = `<div class="cart-empty">${t("Henüz ürün yok. Hediye seti ekleyin.", "Your cart is empty.")}</div>`;
      } else {
        els.cartItems.innerHTML = cart
          .map((item) => {
            const name = item.name || item.id;
            const lineTotal = fmtCurrency((item.price || 0) * (item.qty || 0));
            return `
              <div class="cart-item" data-cart-line="${item.id}">
                <p class="cart-item-name">${name}</p>
                <div class="cart-price">${lineTotal}</div>
                <div class="cart-qty">
                  <button type="button" data-step="-1" data-id="${item.id}">-</button>
                  <span>${item.qty}</span>
                  <button type="button" data-step="1" data-id="${item.id}">+</button>
                </div>
              </div>
            `;
          })
          .join("");

        els.cartItems.querySelectorAll("[data-step]").forEach((btn) => {
          if (btn.dataset.bound === "1") return;
          btn.dataset.bound = "1";
          btn.addEventListener("click", () => {
            const delta = parseInt(btn.dataset.step, 10) || 0;
            changeQty(btn.dataset.id, delta);
          });
        });
      }
    }

    if (els.checkout) {
      els.checkout.disabled = !cart.length;
    }
  }

  function buildMessage(mode = "cart") {
    const brand = (window.NV_WA && window.NV_WA.WA_BRAND) || "NEUROVA";
    const intro =
      mode === "single"
        ? t("Bu ürünü sipariş etmek istiyorum:", "I would like to order this product:")
        : mode === "curation"
          ? t("Lütfen bütçe ve hisse göre 3'lü set önerin:", "Please curate a 3-piece set for my budget/mood:")
          : t("Sepetimi paylaşıyorum:", "Sharing my cart:");

    const bodyItems = cart.map((item) => `- ${item.name || item.id} x${item.qty}`);
    const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 0), 0);

    const lines = [
      `${intro} (${brand})`,
      "",
      bodyItems.length ? bodyItems.join("\n") : mode === "curation" ? "- Curation request" : "-",
    ];

    if (mode !== "curation" && total > 0) {
      lines.push("", `${t("Toplam", "Total")}: ${fmtCurrency(total)}`);
    }

    const delivery = localStorage.getItem("nv_delivery_method") || t("Teslim tercihi: resepsiyon/kurye", "Delivery: pickup/courier");
    lines.push("", delivery, t("Hediye notu + stok bilgisini paylaşır mısınız?", "Please confirm stock + delivery."));

    return lines.join("\n");
  }

  function openWhatsApp(mode = "cart") {
    const num = ((window.NV_WA && window.NV_WA.WA_NUM) || "").replace(/\D/g, "");
    const msg = buildMessage(mode);
    const base = num ? `https://wa.me/${num}` : "https://wa.me/";
    const url = `${base}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener");
  }

  function wireAddButtons() {
    els.addBtns.forEach((btn) => {
      if (btn.dataset.bound === "1") return;
      btn.dataset.bound = "1";
      btn.addEventListener("click", () => addToCart(btn.dataset.add));
    });
  }

  function wireCuration() {
    if (els.curation) {
      els.curation.addEventListener("click", () => openWhatsApp("curation"));
    }

    if (els.curationForm) {
      els.curationForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const budget = (els.curationForm.querySelector("[name='budget']") || {}).value || "";
        const mood = (els.curationForm.querySelector("[name='mood']") || {}).value || "";
        const note = `${t("Bütçe", "Budget")}: ${budget} | ${t("Hissiyat", "Mood")}: ${mood}`;
        const out = els.curationOut;
        if (out) {
          out.textContent = t("Curation talebi kaydedildi. WhatsApp ile paylaşabilirsiniz.", "Curation request captured. You can share via WhatsApp.");
        }
        const msg = `${note}\n\n${buildMessage("curation")}`;
        const num = ((window.NV_WA && window.NV_WA.WA_NUM) || "").replace(/\D/g, "");
        const url = `${num ? `https://wa.me/${num}` : "https://wa.me/"}?text=${encodeURIComponent(msg)}`;
        window.open(url, "_blank", "noopener");
      });
    }
  }

  function wireCheckout() {
    if (els.checkout) {
      els.checkout.addEventListener("click", () => openWhatsApp("cart"));
    }
  }

  function wireDelivery() {
    if (!els.deliveryBtns.length && !els.deliveryStatus) return;
    els.deliveryBtns.forEach((btn) => {
      if (btn.dataset.bound === "1") return;
      btn.dataset.bound = "1";
      btn.addEventListener("click", () => {
        const option = btn.dataset.delivery || "pickup";
        localStorage.setItem("nv_delivery_method", t(option === "courier" ? "Kurye seçildi" : "Resepsiyon teslim", option === "courier" ? "Courier selected" : "Pickup selected"));
        updateDeliveryStatus(option);
      });
    });
    updateDeliveryStatus();
  }

  function updateDeliveryStatus(option) {
    const saved = localStorage.getItem("nv_delivery_method");
    const label = option
      ? option === "courier"
        ? t("Kurye seçildi ??", "Courier selected ??")
        : t("Resepsiyon teslim seçildi", "Pickup selected")
      : saved || t("Teslim tercihi kaydedilmedi.", "No delivery choice yet.");
    if (els.deliveryStatus) {
      els.deliveryStatus.textContent = label;
    }
  }

  function init() {
    buildProductIndex();
    wireAddButtons();
    wireCheckout();
    wireCuration();
    wireDelivery();
    renderCart();
  }

  init();
})();
