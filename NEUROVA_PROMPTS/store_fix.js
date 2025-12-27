/**
 * NEUROVA STORE FIX v5.0
 * Purpose: Revive Cart, Curation, Delivery modules with mock data + debug overlay.
 */

const NEUROVA_STORE = (function () {
  // --- STATE MANAGEMENT ---
  const state = {
    cart: JSON.parse(localStorage.getItem('neurova_cart') || '[]'),
    deliveryMethod: localStorage.getItem('neurova_delivery') || 'pickup', // 'pickup' | 'courier'
    courierFee: 45.0,
    promoCode: localStorage.getItem('neurova_promo') || null,
    debugMode: true,
  };

  // --- DOM ELEMENTS (Cache) ---
  const DOM = {
    cartCount: document.getElementById('cart-count'),
    cartTotal: document.getElementById('cart-total-display'),
    cartItemsContainer: document.getElementById('cart-items-preview'),
    curationForm: document.getElementById('curation-form'),
    curationResults: document.getElementById('curation-results'),
    deliveryInputs: document.querySelectorAll('input[name="delivery_method"]'),
    deliveryFeeDisplay: document.getElementById('delivery-fee-display'),
    addToCartBtns: document.querySelectorAll('.add-to-cart-btn'),
  };

  // --- PROMO CODES (Mock DB) ---
  const PROMO_CODES = {
    NEUROVA10: { type: 'percent', value: 10 }, // %10 indirim
    MERHABA50: { type: 'fixed', value: 50 }, // 50 TL indirim
  };

  // --- INVENTORY (Mock DB) ---
  const INVENTORY = {
    set_calm_01: 5,
    set_focus_02: 2,
    set_luxury_03: 0, // stok yok
    default: 10,
  };

  // --- 1. CART MODULE ---
  function initCart() {
    updateCartUI();
    initPromo();

    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('.add-to-cart-btn');
      if (!btn) return;
      const product = {
        id: btn.dataset.id || String(Date.now()),
        name: btn.dataset.name || 'Bilinmeyen Ürün',
        price: parseFloat(btn.dataset.price || '0'),
      };
      addToCart(product);
    });
  }

  function addToCart(product) {
    const stockLimit = INVENTORY[product.id] !== undefined ? INVENTORY[product.id] : INVENTORY.default;
    const currentQty = state.cart.filter((item) => item.id === product.id).length;

    if (currentQty >= stockLimit) {
      alert(`Üzgünüz, "${product.name}" stokta yok veya limit aşıldı. Kalan: ${stockLimit - currentQty}`);
      logDebug(`Stock insufficient: ${product.name}`);
      return;
    }

    state.cart.push(product);
    saveCart();
    updateCartUI();
    logDebug(`Added to cart: ${product.name} (${product.price} TL)`);
  }

  function saveCart() {
    localStorage.setItem('neurova_cart', JSON.stringify(state.cart));
  }

  function calculateTotal() {
    const subtotal = state.cart.reduce((sum, item) => sum + item.price, 0);

    let discount = 0;
    if (state.promoCode && PROMO_CODES[state.promoCode]) {
      const rule = PROMO_CODES[state.promoCode];
      discount = rule.type === 'percent' ? subtotal * (rule.value / 100) : rule.value;
    }
    if (discount > subtotal) discount = subtotal;

    const delivery = state.deliveryMethod === 'courier' ? state.courierFee : 0;

    return {
      subtotal,
      discount,
      delivery,
      total: (subtotal - discount + delivery).toFixed(2),
    };
  }

  function updateCartUI() {
    const calc = calculateTotal();

    if (DOM.cartCount) DOM.cartCount.innerText = state.cart.length;
    if (DOM.cartTotal) DOM.cartTotal.innerText = `${calc.total} TL`;

    const discountRow = document.getElementById('discount-row');
    const discountAmt = document.getElementById('discount-amount');
    if (discountRow && discountAmt) {
      if (calc.discount > 0) {
        discountRow.style.display = 'flex';
        discountRow.style.justifyContent = 'space-between';
        discountAmt.innerText = `-${calc.discount.toFixed(2)} TL`;
        discountAmt.style.color = 'green';
      } else {
        discountRow.style.display = 'none';
      }
    }

    if (DOM.cartItemsContainer) {
      DOM.cartItemsContainer.innerHTML = state.cart
        .map((item) => `<div class="cart-item-mini">${item.name} - ${item.price} TL</div>`)
        .join('');
    }

    updateDebugOverlay();
  }

  function clearCart() {
    state.cart = [];
    saveCart();
    updateCartUI();
    logDebug('Cart cleared');
  }

  // --- 2. CURATION MODULE ---
  function initCuration() {
    if (!DOM.curationForm) return;

    DOM.curationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const mood = document.getElementById('curation-mood')?.value || 'calm';
      const budget = parseFloat(document.getElementById('curation-budget')?.value || '1000');

      logDebug(`Curation requested: mood=${mood}, budget=${budget}`);

      try {
        const response = await fetch('./mock/curation.json');
        const data = await response.json();
        const suggestions = data.sets.filter((set) => set.tags.includes(mood) && set.price <= budget);
        renderCurationResults(suggestions.length ? suggestions : data.sets.slice(0, 2));
      } catch (error) {
        console.error('Curation Error:', error);
        logDebug('Curation error: mock API unreachable');
      }
    });
  }

  function renderCurationResults(sets) {
    if (!DOM.curationResults) return;

    DOM.curationResults.innerHTML = sets
      .map(
        (set) => `
        <div class="curation-card">
          <h4>${set.title}</h4>
          <p>${set.description}</p>
          <span class="price">${set.price} TL</span>
          <button onclick="NEUROVA_STORE.addSetToCart('${set.id}', ${set.price}, '${set.title}')">
            Seti Sepete Ekle
          </button>
        </div>
      `,
      )
      .join('');

    logDebug(`${sets.length} öneri gösterildi.`);
  }

  // --- 3. DELIVERY MODULE ---
  function initDelivery() {
    const savedMethod = localStorage.getItem('neurova_delivery');
    if (savedMethod) {
      const input = document.querySelector(`input[name="delivery_method"][value="${savedMethod}"]`);
      if (input) input.checked = true;
    }

    DOM.deliveryInputs.forEach((input) => {
      input.addEventListener('change', (e) => {
        state.deliveryMethod = e.target.value;
        localStorage.setItem('neurova_delivery', state.deliveryMethod);
        updateCartUI();
        logDebug(`Delivery: ${state.deliveryMethod}`);
      });
    });
  }

  // --- 4. PROMO MODULE ---
  function initPromo() {
    const promoForm = document.getElementById('promo-form');
    const promoInput = document.getElementById('promo-code');

    if (!promoForm || !promoInput) return;

    promoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = (promoInput.value || '').trim().toUpperCase();
      if (PROMO_CODES[code]) {
        state.promoCode = code;
        localStorage.setItem('neurova_promo', code);
        updateCartUI();
        logDebug(`Promo applied: ${code}`);
      } else {
        alert('Geçersiz promo kodu');
        logDebug(`Invalid promo: ${code}`);
      }
    });
  }

  // --- 5. DEBUG & LOGGING ---
  function initDebug() {
    if (!state.debugMode) return;
    const overlay = document.createElement('div');
    overlay.id = 'neurova-debug-overlay';
    overlay.style.cssText = `
      position: fixed; bottom: 10px; right: 10px;
      background: rgba(0,0,0,0.8); color: #0f0;
      padding: 10px; font-family: monospace; font-size: 12px;
      z-index: 9999; border-radius: 4px; pointer-events: none;
    `;
    document.body.appendChild(overlay);
    updateDebugOverlay();
  }

  function logDebug(msg) {
    console.log(`[NEUROVA] ${msg}`);
    const overlay = document.getElementById('neurova-debug-overlay');
    if (overlay) {
      overlay.innerHTML = `LAST ACTION: ${msg}<br>CART SIZE: ${state.cart.length}`;
      overlay.style.opacity = 1;
      setTimeout(() => (overlay.style.opacity = 0.5), 2000);
    }
  }

  function updateDebugOverlay() {
    const overlay = document.getElementById('neurova-debug-overlay');
    if (overlay) overlay.innerHTML = `READY<br>CART SIZE: ${state.cart.length}`;
  }

  // --- PUBLIC API ---
  return {
    init: () => {
      initCart();
      initCuration();
      initDelivery();
      initDebug();
      console.log('NEUROVA Store Module Initialized');
    },
    addSetToCart: (id, price, name) => addToCart({ id, price, name }),
    clearCart: clearCart,
  };
})();

// Auto-init when DOM is ready
document.addEventListener('DOMContentLoaded', NEUROVA_STORE.init);
