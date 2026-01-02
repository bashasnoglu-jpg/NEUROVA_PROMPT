(() => {
  const navSlot = document.getElementById("nv-nav-slot");
  if (!navSlot) return;

  const ensureMarkup = () => {
    if (navSlot.querySelector("[data-nav-panel]")) return;
    navSlot.innerHTML = `
      <header class="nv-nav">
        <button class="nv-nav-toggle" type="button"
          data-nav-toggle aria-expanded="false" aria-controls="nvNavPanel"
          aria-label="Menüyü aç">
          Menü
        </button>
      </header>
      <div class="nv-overlay" data-nav-overlay></div>
      <aside id="nvNavPanel" class="nv-panel" data-nav-panel role="dialog" aria-modal="true" aria-label="Site menüsü">
        <nav aria-label="Ana menü">
          <a href="index.html" data-nav-link>Ana Sayfa</a>
          <a href="hamam.html" data-nav-link>Hamam Ritüelleri</a>
          <a href="masajlar.html" data-nav-link>Masajlar</a>
          <a href="signature.html" data-nav-link>Signature & Couples</a>
          <a href="kids-family.html" data-nav-link>Kids & Family Spa</a>
          <a href="face-sothys.html" data-nav-link>Face – Sothys</a>
          <a href="products.html" data-nav-link>Ürünler / Products</a>
          <a href="about.html" data-nav-link>Hakkımızda</a>
          <a href="team.html" data-nav-link>Ekibimiz</a>
          <a href="#" data-nv-open-reservation style="margin-top:auto;">
            Rezervasyon
          </a>
        </nav>
      </aside>
    `;
  };
  
  ensureMarkup();

  if (navSlot.dataset.nvNavWired === "1") return;
  navSlot.dataset.nvNavWired = "1";

  const toggle  = navSlot.querySelector("[data-nav-toggle]");
  const panel   = navSlot.querySelector("[data-nav-panel]");
  const overlay = navSlot.querySelector("[data-nav-overlay]");

  if (!toggle || !panel || !overlay) return;

  const normalize = (p) => {
    const clean = (p || "").split("?")[0].split("#")[0];
    const file = clean.split("/").pop() || "";
    return (file || "index.html").toLowerCase();
  };
  const activePath = normalize(location.pathname);

  let prevBodyPadRight = "";

  const lockScroll = (on) => {
    const html = document.documentElement;
    if (on) {
      const scrollbarW = Math.max(0, window.innerWidth - html.clientWidth);
      prevBodyPadRight = document.body.style.paddingRight || "";
      document.body.style.paddingRight = `${scrollbarW}px`;
      html.classList.add("nv-scroll-lock");
    } else {
      html.classList.remove("nv-scroll-lock");
      document.body.style.paddingRight = prevBodyPadRight;
      prevBodyPadRight = "";
    }
  };

  let lastFocus = null;

  const closeNav = () => {
    if (!panel.classList.contains("is-open")) return;
    panel.classList.remove("is-open");
    overlay.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Menüyü aç");
    lockScroll(false);

    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
    lastFocus = null;
  };

  const openNav = () => {
    if (panel.classList.contains("is-open")) return;
    lastFocus = document.activeElement;

    panel.classList.add("is-open");
    overlay.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Menüyü kapat");
    lockScroll(true);

    const focusTarget =
      panel.querySelector("a.is-active") ||
      panel.querySelector("a, button, [tabindex]:not([tabindex='-1'])");
    focusTarget?.focus?.();
  };

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    expanded ? closeNav() : openNav();
  });

  overlay.addEventListener("click", closeNav);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("is-open")) {
      closeNav();
    }
  });

  navSlot.querySelectorAll("[data-nav-link]").forEach((link) => {
    const raw = link.getAttribute("href") || "";
    if (!raw || raw === "#") return;

    const href = normalize(raw);
    if (href === activePath) {
      link.classList.add("is-active");
    }
    link.addEventListener("click", closeNav);
  });

  navSlot.querySelectorAll("[data-nv-open-reservation]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      closeNav();
      if (!window.NV_OPEN_RESERVATION?.()) {
        const num = String(window.NV_CONCIERGE_NUMBER || "").replace(/[^\d]/g, "");
        if (num) window.open(`https://wa.me/${num}`, "_blank");
      }
    });
  });
})();