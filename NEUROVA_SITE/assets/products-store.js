"use strict";

(function () {
  const lang = (document.documentElement.getAttribute("lang") || "tr").toLowerCase().startsWith("en") ? "en" : "tr";

  const copy = {
    tr: {
      addToCart: "Sepete ekle",
      askNow: "Anında sor",
      empty: "Henüz ürün yok. Bir hediye seti ya da ev bakımı ekleyin.",
      subtotal: "Ara toplam",
      deliveryNote: "Resepsiyon teslim veya kurye için bize yazın.",
      checkout: "WhatsApp Sipariş",
      curation: "Biz seçelim",
      checkoutIntro: "Merhaba, NEUROVA online mağaza sepetimi paylaşıyorum:",
      curationIntro: "Merhaba, NEUROVA ürünleri için kürasyon önerisi rica ediyorum.",
      totalLabel: "Toplam",
      closing: "Teslim / kurye ve stok bilgisini yazabilir misiniz?",
      singleProductIntro: "Merhaba, bu ürünü sipariş vermek istiyorum:",
      cartBadge: "Sepet",
      curationHint: "Hediye notu, bütçe ve teslim tercihlerini ekleyelim.",
      filterAll: "Hepsi",
      filterGift: "Hediye setleri",
      filterHome: "Ev bakımı",
      filterFace: "Face & Sothys",
      filterCalm: "Dinlenme",
    },
    en: {
      addToCart: "Add to cart",
      askNow: "Ask now",
      empty: "Your cart is empty. Add a gift set or home care item.",
      subtotal: "Subtotal",
      deliveryNote: "Tell us pickup or courier preference in WhatsApp.",
      checkout: "Order via WhatsApp",
      curation: "Curate for me",
      checkoutIntro: "Hi, sharing my NEUROVA online store cart:",
      curationIntro: "Hi, could you curate NEUROVA products for me?",
      totalLabel: "Total",
      closing: "Please confirm stock + pickup/courier options.",
      singleProductIntro: "Hi, I would like to order this product:",
      cartBadge: "Cart",
      curationHint: "Add gift note, budget and delivery preference.",
      filterAll: "All",
      filterGift: "Gift sets",
      filterHome: "Home care",
      filterFace: "Face & Sothys",
      filterCalm: "Rest & reset",
    },
  };

  const products = [
    {
      id: "rituel-box",
      category: "gift",
      price: 2450,
      name: { tr: "Ritüel Hediye Kutusu", en: "Ritual Gift Box" },
      desc: {
        tr: "Spa ritüeli: masaj yağı, peeling, aromatik tütsü + kişisel not.",
        en: "Spa ritual kit: massage oil, body polish, aromatic incense + personal note.",
      },
      tags: {
        tr: ["Hediye kutusu", "Not kartı", "Aynı gün kurye"],
        en: ["Gift box", "Note card", "Same-day courier"],
      },
      details: {
        tr: [
          "Sıcak taş masaj yağı 100 ml",
          "Şeker peeling 150 gr",
          "Cam tütsü + seramik tabak",
        ],
        en: [
          "Hot stone massage oil 100 ml",
          "Sugar body polish 150 gr",
          "Glass incense + ceramic dish",
        ],
      },
      badge: "new",
    },
    {
      id: "signature-pamper",
      category: "gift",
      price: 1950,
      name: { tr: "Signature Spa Set", en: "Signature Spa Set" },
      desc: {
        tr: "Sakinleştirici ikili: aromatik yağ + mineral duş peelingi.",
        en: "Calming duo: aromatic body oil + mineral shower polish.",
      },
      tags: {
        tr: ["Kutulu teslim", "Duşta hızlı bakım"],
        en: ["Gift-ready", "Shower friendly"],
      },
      details: {
        tr: [
          "Aromaterapi vücut yağı 120 ml",
          "Mineral duş peelingi 180 ml",
          "Koku hassasiyeti için hafif nota",
        ],
        en: [
          "Aromatherapy body oil 120 ml",
          "Mineral shower polish 180 ml",
          "Soft fragrance, scent-safe",
        ],
      },
    },
    {
      id: "calm-evening",
      category: "calm",
      price: 1380,
      name: { tr: "Rahatlama Akşam Seti", en: "Calm Evening Set" },
      desc: {
        tr: "Uyku öncesi: mist + masaj yağı mini + lavanta balm.",
        en: "Pre-sleep trio: mist, mini massage oil, lavender balm.",
      },
      tags: {
        tr: ["Uçuş / seyahat", "Hafif kokular"],
        en: ["Travel sized", "Soft scents"],
      },
      details: {
        tr: [
          "Uyku ritüeli mist 100 ml",
          "Mini masaj yağı 50 ml",
          "Lavanta balm stick",
        ],
        en: [
          "Sleep ritual mist 100 ml",
          "Mini massage oil 50 ml",
          "Lavender balm stick",
        ],
      },
    },
    {
      id: "aroma-oil",
      category: "home",
      price: 690,
      name: { tr: "Aromaterapi Masaj Yağı", en: "Aromatherapy Massage Oil" },
      desc: {
        tr: "Isıtıcı notalar, evde 20 dakikalık self-care için.",
        en: "Warming notes for a 20-minute at-home self-care ritual.",
      },
      tags: {
        tr: ["Isıtıcı", "Terapist onaylı"],
        en: ["Warming", "Therapist approved"],
      },
      details: {
        tr: [
          "100 ml, 10-12 kullanım",
          "Germe sonrası rahatlatıcı",
          "Kuru cilde hızlı emilim",
        ],
        en: [
          "100 ml, 10-12 uses",
          "Post-stretch relaxation",
          "Fast absorb, dry skin friendly",
        ],
      },
    },
    {
      id: "rose-peel",
      category: "home",
      price: 560,
      name: { tr: "Gül Kuvars Vücut Peelingi", en: "Rose Quartz Body Polish" },
      desc: {
        tr: "Jojoba yağlı, duşta hızlı yenileme. Duş sonrası nemli bırakır.",
        en: "Jojoba-infused, quick shower polish that leaves skin dewy.",
      },
      tags: {
        tr: ["Duşta bakım", "Işıltı etkisi"],
        en: ["Shower care", "Glow finish"],
      },
      details: {
        tr: [
          "180 ml, 8-10 kullanım",
          "Jojoba & kayısı çekirdeği",
          "Hafif gül kuvars notası",
        ],
        en: [
          "180 ml, 8-10 uses",
          "Jojoba & apricot kernel",
          "Soft rose quartz scent",
        ],
      },
    },
    {
      id: "sleep-mist",
      category: "calm",
      price: 520,
      name: { tr: "Uyku Ritüeli Mist", en: "Sleep Ritual Mist" },
      desc: {
        tr: "Yastık + oda için lavanta/neroli. Hafif, yağsız.",
        en: "Lavender/neroli pillow + room mist. Featherlight, non-oily.",
      },
      tags: {
        tr: ["Yastık spreyi", "Uyku öncesi"],
        en: ["Pillow mist", "Pre-sleep"],
      },
      details: {
        tr: [
          "100 ml, 70+ püskürtme",
          "Yağsız formül, leke bırakmaz",
          "Hafif koku hassasiyetine uygun",
        ],
        en: [
          "100 ml, 70+ spritz",
          "Oil-free, no staining",
          "Gentle for scent sensitivity",
        ],
      },
    },
    {
      id: "hydra-serum",
      category: "face",
      price: 2450,
      name: { tr: "Sothys Hydra-Serum", en: "Sothys Hydra-Serum" },
      desc: {
        tr: "Yoğun nem, matlaşma yapmaz. Klinik Sothys serisi.",
        en: "Deep hydration without shine. From clinical Sothys line.",
      },
      tags: {
        tr: ["Klinik seri", "Yağsız"],
        en: ["Clinical line", "Oil-free"],
      },
      details: {
        tr: [
          "Gündüz + gece, 50 ml",
          "Su bazlı, hafif doku",
          "Tüm cilt tiplerine uygun",
        ],
        en: [
          "Day + night, 50 ml",
          "Water-based, featherlight",
          "For all skin types",
        ],
      },
    },
    {
      id: "eye-cream",
      category: "face",
      price: 1850,
      name: { tr: "Sothys Göz Çevresi", en: "Sothys Eye Contour" },
      desc: {
        tr: "Şişkinlik ve morluk için. Soğuk uçlu aplikatör.",
        en: "De-puff + brighten. Cool-tip applicator.",
      },
      tags: {
        tr: ["Soğuk uç", "Sabah akşam"],
        en: ["Cooling tip", "AM/PM use"],
      },
      details: {
        tr: [
          "15 ml, 60 kullanım+",
          "Kafein + peptid desteği",
          "Lens kullanıcılarına uygun",
        ],
        en: [
          "15 ml, 60+ uses",
          "Caffeine + peptide blend",
          "Contact lens safe",
        ],
      },
    },
  ];

  const state = {
    filter: "all",
    cart: [],
  };

  const els = {
    grid: document.querySelector("[data-product-grid]"),
    filters: Array.from(document.querySelectorAll("[data-filter]")),
    cartItems: document.querySelector("[data-cart-items]"),
    cartTotal: document.querySelector("[data-cart-total]"),
    cartCount: Array.from(document.querySelectorAll("[data-cart-count]")),
    checkout: document.querySelector("[data-checkout]"),
    curation: document.querySelector("[data-curation]"),
    summaryLabel: document.querySelector("[data-summary-label]"),
  };

  function formatPrice(value) {
    const locale = lang === "en" ? "en-US" : "tr-TR";
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
      }).format(value);
    } catch (e) {
      return `${value} TL`;
    }
  }

  const t = (key) => copy[lang][key] || key;

  function findProduct(id) {
    return products.find((p) => p.id === id);
  }

  function sanitize(str = "") {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function renderProducts() {
    if (!els.grid) return;
    const filtered =
      state.filter === "all" ? products : products.filter((p) => p.category === state.filter);

    els.grid.innerHTML = filtered
      .map((product) => {
        const name = sanitize(product.name[lang] || product.name.tr || product.name.en || "");
        const desc = sanitize(product.desc[lang] || product.desc.tr || product.desc.en || "");
        const tags = (product.tags?.[lang] || []).map((tag) => `<span>${sanitize(tag)}</span>`).join("");
        const details = (product.details?.[lang] || [])
          .map((d) => `<li>${sanitize(d)}</li>`)
          .join("");
        const badgeLabel = product.badge === "new" ? (lang === "en" ? "New" : "Yeni") : sanitize(product.badge);
        const badge = product.badge ? `<span class="pill">${badgeLabel}</span>` : "";
        const categoryLabel = (() => {
          const map = {
            gift: { tr: "Hediye", en: "Gift" },
            home: { tr: "Ev bakımı", en: "Home" },
            face: { tr: "Face", en: "Face" },
            calm: { tr: "Rahatlama", en: "Calm" },
          };
          return sanitize(map[product.category]?.[lang] || product.category);
        })();

        return `
          <article class="product-card" data-product="${name}">
            <div class="product-thumb"></div>
            <div class="product-meta">
              <span>${badge || categoryLabel}</span>
              <span>${formatPrice(product.price)}</span>
            </div>
            <h3 class="product-name">${name}</h3>
            <p class="product-desc">${desc}</p>
            <div class="product-tags">${tags}</div>
            <ul class="product-details">${details}</ul>
            <div class="product-price">
              <span class="price">${formatPrice(product.price)}</span>
              <div class="product-actions">
                <button class="nv-cta" type="button" data-add="${product.id}">${t("addToCart")}</button>
                <button class="nv-cta nv-cta-ghost" type="button" data-chat="${product.id}">${t("askNow")}</button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    els.grid.querySelectorAll("[data-add]").forEach((btn) => {
      btn.addEventListener("click", () => addToCart(btn.dataset.add));
    });

    els.grid.querySelectorAll("[data-chat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const product = findProduct(btn.dataset.chat);
        if (!product) return;
        openWhatsApp({ mode: "single", items: [product.name[lang] || product.name.tr || product.name.en] });
      });
    });
  }

  function updateFilterButtons() {
    els.filters.forEach((btn) => {
      const active = btn.dataset.filter === state.filter;
      btn.classList.toggle("is-active", active);
    });
  }

  function addToCart(id) {
    const existing = state.cart.find((item) => item.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({ id, qty: 1 });
    }
    renderCart();
  }

  function changeQty(id, delta) {
    const item = state.cart.find((c) => c.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      state.cart = state.cart.filter((c) => c.id !== id);
    }
    renderCart();
  }

  function renderCart() {
    if (!els.cartItems) return;
    if (!state.cart.length) {
      els.cartItems.innerHTML = `<div class="cart-empty">${t("empty")}</div>`;
    } else {
      els.cartItems.innerHTML = state.cart
        .map((item) => {
          const product = findProduct(item.id);
          if (!product) return "";
          const name = sanitize(product.name[lang] || product.name.tr || product.name.en || "");
          const note = sanitize(product.desc[lang] || product.desc.tr || product.desc.en || "");
          const lineTotal = formatPrice(item.qty * product.price);
          return `
            <div class="cart-item">
              <p class="cart-item-name">${name}</p>
              <div class="cart-price">${lineTotal}</div>
              <p class="cart-item-note">${note}</p>
              <div class="cart-qty">
                <button type="button" aria-label="${lang === "en" ? "Decrease" : "Eksilt"}" data-step="-1" data-id="${product.id}">-</button>
                <span>${item.qty}</span>
                <button type="button" aria-label="${lang === "en" ? "Increase" : "Artir"}" data-step="1" data-id="${product.id}">+</button>
              </div>
            </div>
          `;
        })
        .join("");

      els.cartItems.querySelectorAll("[data-step]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const delta = parseInt(btn.dataset.step, 10) || 0;
          changeQty(btn.dataset.id, delta);
        });
      });
    }

    const total = state.cart.reduce((sum, item) => {
      const product = findProduct(item.id);
      return sum + (product ? product.price * item.qty : 0);
    }, 0);

    if (els.cartTotal) {
      els.cartTotal.textContent = formatPrice(total);
    }

    if (els.summaryLabel) {
      els.summaryLabel.textContent = `${t("subtotal")}: ${formatPrice(total)}`;
    }

    const count = state.cart.reduce((sum, item) => sum + item.qty, 0);
    if (els.cartCount.length) {
      els.cartCount.forEach((el) => (el.textContent = `${t("cartBadge")}: ${count}`));
    }

    if (els.checkout) {
      els.checkout.disabled = !state.cart.length;
    }
  }

  function buildMessage({ mode = "cart", items = [] } = {}) {
    const brand = (window.NV_WA && window.NV_WA.WA_BRAND) || "NEUROVA";
    const intro =
      mode === "single"
        ? t("singleProductIntro")
        : mode === "curation"
          ? t("curationIntro")
          : t("checkoutIntro");

    const bodyItems =
      items.length > 0
        ? items.map((name) => `- ${name} x1`)
        : state.cart.map((item) => {
            const product = findProduct(item.id);
            const name = product ? product.name[lang] || product.name.tr || product.name.en || "" : item.id;
            return `- ${name} x${item.qty}`;
          });
    const total = state.cart.reduce((sum, item) => {
      const product = findProduct(item.id);
      return sum + (product ? product.price * item.qty : 0);
    }, 0);

    const lines = [
      `${intro} (${brand})`,
      "",
      bodyItems.length ? bodyItems.join("\n") : mode === "curation" ? "- Gift / home care curation" : "-",
    ];

    if (mode !== "curation" && total > 0) {
      lines.push("", `${t("totalLabel")}: ${formatPrice(total)}`);
    }

    lines.push(t("deliveryNote"), t("closing"));

    return lines.join("\n");
  }

  function openWhatsApp(params = {}) {
    const num = ((window.NV_WA && window.NV_WA.WA_NUM) || "").replace(/\D/g, "");
    const msg = buildMessage(params);
    const base = num ? `https://wa.me/${num}` : "https://wa.me/";
    const url = `${base}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener");
  }

  function wireFilters() {
    els.filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        state.filter = btn.dataset.filter || "all";
        updateFilterButtons();
        renderProducts();
      });
    });
  }

  function wireActions() {
    if (els.checkout) {
      els.checkout.addEventListener("click", () => openWhatsApp({ mode: "cart" }));
    }
    if (els.curation) {
      els.curation.addEventListener("click", () => {
        const names = state.cart
          .map((item) => {
            const p = findProduct(item.id);
            return p ? p.name[lang] || p.name.tr || p.name.en : "";
          })
          .filter(Boolean);
        openWhatsApp({ mode: "curation", items: names });
      });
    }
  }

  function init() {
    wireFilters();
    updateFilterButtons();
    renderProducts();
    renderCart();
    wireActions();
  }

  init();
})();
