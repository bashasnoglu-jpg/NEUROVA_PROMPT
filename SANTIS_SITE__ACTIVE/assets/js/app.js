/* =========================================
   SANTIS MASTER APP.JS
   Updated: 2026-01-20
   ========================================= */

(function () {
  "use strict";

  // Configuration
  const CONFIG = {
    conciergeNumber: window.NV_CONCIERGE_NUMBER || "905320000000",
    scrollThreshold: 10
  };

  function log(msg) {
    console.log(`[NV] ${msg}`);
  }

  /* =========================================
     SANTIS â€“ GLOBAL NAVIGATION v1.0
     ========================================= */
  function initNavigation() {
    log("Initializing Navigation...");

    // 1. Identify Current Page
    const path = window.location.pathname;
    let page = path.split("/").pop().split(".")[0];
    if (!page || page === "") page = "index";

    // 2. Highlight Active Link
    const navLinks = document.querySelectorAll('[data-nav]');
    navLinks.forEach(link => {
      const target = link.getAttribute('data-nav');
      // If target is home, it matches index or empty
      const isHome = (target === 'home' && (page === 'index' || page === ''));
      const isMatch = (target === page) || isHome;

      if (isMatch) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      }
    });

    // 3. Mobile Menu Toggle
    const toggle = document.querySelector('[data-nv-mobile-toggle]');
    const panel = document.querySelector('[data-nv-mobile-panel]');

    if (toggle && panel) {
      // Remove old listeners to be safe (though cloning is better, simple listener is fine for unmount/mount)
      const newToggle = toggle.cloneNode(true);
      toggle.parentNode.replaceChild(newToggle, toggle);

      newToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const expanded = newToggle.getAttribute('aria-expanded') === 'true';
        newToggle.setAttribute('aria-expanded', !expanded);
        panel.classList.toggle('hidden');
      });

      // Close when clicking outside or on a link
      document.addEventListener('click', (e) => {
        if (panel && !panel.classList.contains('hidden') && !panel.contains(e.target) && !newToggle.contains(e.target)) {
          panel.classList.add('hidden');
          newToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // 4. Dropdowns
    const dropdowns = document.querySelectorAll('[data-nv-dropdown]');
    dropdowns.forEach(dd => {
      const btn = dd.querySelector('[data-nv-dropdown-toggle]');
      const menu = dd.querySelector('[data-nv-dropdown-menu]');

      if (btn && menu) {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const expanded = newBtn.getAttribute('aria-expanded') === 'true';

          // Close others
          dropdowns.forEach(other => {
            if (other !== dd) {
              other.querySelector('[data-nv-dropdown-menu]')?.classList.add('hidden');
              other.querySelector('[data-nv-dropdown-toggle]')?.setAttribute('aria-expanded', 'false');
            }
          });

          newBtn.setAttribute('aria-expanded', !expanded);
          menu.classList.toggle('hidden');
        });
      }
    });

    // Global click closer for dropdowns (ensure single listener)
    if (!window._nvGlobalClickAttached) {
      document.addEventListener('click', () => {
        dropdowns.forEach(dd => {
          dd.querySelector('[data-nv-dropdown-menu]')?.classList.add('hidden');
          dd.querySelector('[data-nv-dropdown-toggle]')?.setAttribute('aria-expanded', 'false');
        });
      });
      window._nvGlobalClickAttached = true;
    }

    // 5. Sticky Header
    const header = document.querySelector('[data-nv-header]');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > CONFIG.scrollThreshold) {
          header.classList.add('is-sticky');
        } else {
          header.classList.remove('is-sticky');
        }
      });
    }
  }

  /* =========================================
     SANTIS â€“ RESERVATION MODAL MASTER BLOÄU v1.1 (WhatsApp Entegre)
     ========================================= */
  function initReservation() {
    log("Initializing Reservation System...");

    // Start from scratch to avoid dupes
    window.NV_OPEN_RESERVATION = function (data) {
      const message = data?.note
        ? `Merhaba, rezervasyon hakkÄ±nda bilgi almak istiyorum: ${data.note}`
        : "Merhaba, SANTIS'dan rezervasyon yapmak istiyorum.";

      // Check if modal exists
      const modal = document.getElementById('nv-reservation-modal');
      if (modal) {
        modal.classList.remove('hidden');
        // Assume standard close button exists inside
        const close = modal.querySelector('[data-close-modal]');
        if (close) {
          close.onclick = () => modal.classList.add('hidden');
        }
      } else {
        // Fallback: WhatsApp Direct
        const url = `https://wa.me/${CONFIG.conciergeNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
      }
    };

    // Wire up trigger buttons
    // We use delegation on document to catch any button even if added later
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-nv-open-reservation]');
      if (btn) {
        e.preventDefault();
        const product = btn.getAttribute('data-product-name') || "";
        window.NV_OPEN_RESERVATION({ note: product });
      }
    });
  }

  /* =========================================
     BOOTSTRAP
     ========================================= */
  function bootNV() {
    initNavigation();
    initReservation();
    log("Boot Complete.");
  }

  // Initialize when slots are ready
  document.addEventListener('nv:slots:ready', bootNV);

  // Also expose bootNV globally just in case
  window.bootNV = bootNV;

})();