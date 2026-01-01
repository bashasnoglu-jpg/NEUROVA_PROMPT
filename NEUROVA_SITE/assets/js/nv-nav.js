(function () {
  const prefersReduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const docLang = (document.documentElement.lang || '').toLowerCase();
  const isEnglish = docLang.startsWith('en') || location.pathname.startsWith('/en/');

  const NV_ROUTES = {
    tr: {
      home: '/index.html',
      hamam: '/hamam.html',
      massages: '/masajlar.html',
      kids: '/kids-family.html',
      face: '/face-sothys.html',
      products: '/products.html',
      about: '/about.html',
      team: '/team.html',
      packages: '/paketler.html',
      gallery: '/galeri.html'
    },
    en: {
      home: '/en/index.html',
      hamam: '/en/hamam.html',
      massages: '/en/masajlar.html',
      kids: '/en/kids-family.html',
      face: '/en/face-sothys.html',
      products: '/en/products.html',
      about: '/en/about.html',
      team: '/en/team.html',
      packages: '/en/packages.html',
      gallery: '/en/galeri.html'
    }
  };

  const lang = isEnglish ? 'en' : 'tr';
  const R = NV_ROUTES[lang] || NV_ROUTES.tr;

  const navItems = isEnglish ? [
    { page: 'home', label: 'Home', href: R.home },
    { page: 'hamam', label: 'Hammam', href: R.hamam },
    { page: 'masajlar', label: 'Massages', href: R.massages },
    { page: 'kids-family', label: 'Kids & Family', href: R.kids },
    { page: 'face-sothys', label: 'Face & Sothys', href: R.face },
    { page: 'products', label: 'Products / Store', href: R.products },
    { page: 'paketler', label: 'Packages', href: R.packages },
    { page: 'galeri', label: 'Gallery', href: R.gallery },
    { page: 'about', label: 'About', href: R.about },
    { page: 'team', label: 'Our Team', href: R.team }
  ] : [
    { page: 'home', label: 'Ana Sayfa', href: R.home },
    { page: 'hamam', label: 'Hamam', href: R.hamam },
    { page: 'masajlar', label: 'Masajlar', href: R.massages },
    { page: 'kids-family', label: 'Kids & Family', href: R.kids },
    { page: 'face-sothys', label: 'Face & Sothys', href: R.face },
    { page: 'products', label: 'Ürünler', href: R.products },
    { page: 'paketler', label: 'Paketler', href: R.packages },
    { page: 'galeri', label: 'Galeri', href: R.gallery },
    { page: 'about', label: 'Hakkımızda', href: R.about },
    { page: 'team', label: 'Ekibimiz', href: R.team }
  ];

  const navSlot = document.getElementById('nv-nav-slot');
  if (!navSlot) return;
  if (navSlot.dataset.nvNavMounted === '1') return;
  navSlot.dataset.nvNavMounted = '1';

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const navLinks = navItems.map((item) =>
    `<a class="nv-link" href="${item.href}" data-page="${item.page}">${item.label}</a>`
  ).join('');

  const mobileLinks = navItems.map((item) =>
    `<a class="nv-mlink" href="${item.href}" data-page="${item.page}">${item.label}</a>`
  ).join('');

  const ctaLabel = isEnglish ? 'Reservation' : 'Rezervasyon';
  const ariaLabelMenu = isEnglish ? 'Menu' : 'Menü';

  navSlot.innerHTML = `
    <header class="nv-header" data-nv-header>
      <div class="nv-shell">
        <a class="nv-brand" href="${R.home}" aria-label="NEUROVA Home">
          <span class="nv-brand__word">NEUROVA</span>
          <span class="nv-brand__sub">Spa & Wellness</span>
        </a>

        <div class="nv-nav-row">
          <nav class="nv-nav" aria-label="Primary">
            ${navLinks}
          </nav>

          <div class="nv-actions">
            <a class="nv-cta nv-nav-cta" href="#nv-wa" data-nv-open-reservation>${ctaLabel}</a>
            <button class="nv-burger" type="button" data-nv-mobile-toggle aria-label="${ariaLabelMenu}" aria-expanded="false">
              <span></span><span></span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="nv-mpanel" data-nv-mobile-panel aria-hidden="true" hidden>
      <div class="nv-mpanel__inner">
        ${mobileLinks}
        <div class="nv-mobile__cta--sticky">
          <a class="nv-cta nv-nav-cta" href="#nv-wa" data-nv-open-reservation>${ctaLabel}</a>
        </div>
      </div>
    </div>
  `;

  const normalizePath = () => {
    const last = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return last.split('?')[0].split('#')[0];
  };

  // ✅ Slug standardı: body data-page bunlardan biri olmalı
  const pathMap = {
    'index.html': 'home',
    'hamam.html': 'hamam',
    'masajlar.html': 'masajlar',
    'kids-family.html': 'kids-family',
    'face-sothys.html': 'face-sothys',
    'products.html': 'products',
    'urunler.html': 'products',
    'about.html': 'about',
    'team.html': 'team',
    'packages.html': 'paketler',
    'paketler.html': 'paketler',
    'galeri.html': 'galeri'
  };

  function setActiveNav() {
    const bodySlug = document.body.dataset.page;
    const slug = bodySlug || pathMap[normalizePath()] || null;
    if (slug && !bodySlug) document.body.dataset.page = slug;
    if (!slug) return;
    qsa(`[data-page="${slug}"]`).forEach((el) => el.classList.add('is-active'));
  }

  function setLock(on) {
    document.documentElement.classList.toggle('nv-lock', !!on);
    document.body.classList.toggle('nv-lock', !!on);
  }

  function wireMobilePanel() {
    const slot = document.getElementById('nv-nav-slot');
    const toggle = qs('[data-nv-mobile-toggle]', navSlot);
    const panel = qs('[data-nv-mobile-panel]', navSlot);
    if (!toggle || !panel) return;
    if (slot?.dataset.nvMobileWired === '1') return;
    if (slot) slot.dataset.nvMobileWired = '1';

    const OPEN_CLASS = 'is-open';
    const BURGER_CLASS = 'is-open';

    let hideTimer = null;

    const close = () => {
      if (hideTimer) { window.clearTimeout(hideTimer); hideTimer = null; }

      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove(BURGER_CLASS);
      panel.classList.remove(OPEN_CLASS);
      panel.setAttribute('aria-hidden', 'true');
      const delay = prefersReduced ? 0 : 180;
      hideTimer = window.setTimeout(() => {
        panel.hidden = true;
        hideTimer = null;
      }, delay);
      setLock(false);
    };

    const open = () => {
      if (hideTimer) { window.clearTimeout(hideTimer); hideTimer = null; }

      toggle.setAttribute('aria-expanded', 'true');
      toggle.classList.add(BURGER_CLASS);
      panel.hidden = false;
      panel.classList.add(OPEN_CLASS);
      panel.setAttribute('aria-hidden', 'false');
      setLock(true);
    };

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      expanded ? close() : open();
    });

    panel.addEventListener('click', (e) => {
      if (!e.target.closest('.nv-mpanel__inner')) close();
    });

    qsa('a', panel).forEach((a) => a.addEventListener('click', close));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }

  function openReservation() {
    const fn =
      window.NV_OPEN_RESERVATION ||
      window.nvOpenReservation ||
      window.openReservation ||
      null;

    if (typeof fn === 'function') return fn();

    const anchor = document.getElementById('nv-wa');
    if (anchor) anchor.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
  }

  // ✅ Her durumda modal varsa aç, yoksa #nv-wa'ya kay
  function wireReservationTriggers(root = document) {
    root.querySelectorAll('[data-nv-open-reservation]').forEach((el) => {
      if (el.dataset.nvReservationWired === '1') return;
      el.dataset.nvReservationWired = '1';
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openReservation();
      });
    });
  }

  function wireMobilePanelFallback() {
    if (document.documentElement.dataset.nvMobileFallback === '1') return;
    document.documentElement.dataset.nvMobileFallback = '1';

    let hideTimer = null;

    const getEls = () => {
      const slot = document.getElementById('nv-nav-slot');
      const toggle =
        (slot && slot.querySelector('[data-nv-mobile-toggle]')) ||
        document.querySelector('[data-nv-mobile-toggle]');

      const panel =
        (slot && slot.querySelector('[data-nv-mobile-panel]')) ||
        document.querySelector('[data-nv-mobile-panel]');

      return { toggle, panel };
    };

    const setLockSafe = (on) => {
      document.documentElement.classList.toggle('nv-lock', !!on);
      document.body.classList.toggle('nv-lock', !!on);
    };

    const close = (toggle, panel) => {
      if (!toggle || !panel) return;
      if (hideTimer) { window.clearTimeout(hideTimer); hideTimer = null; }

      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('is-open');
      panel.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');

      const delay = prefersReduced ? 0 : 180;
      hideTimer = window.setTimeout(() => {
        panel.hidden = true;
        hideTimer = null;
      }, delay);

      setLockSafe(false);
    };

    const open = (toggle, panel) => {
      if (!toggle || !panel) return;
      if (hideTimer) { window.clearTimeout(hideTimer); hideTimer = null; }

      toggle.setAttribute('aria-expanded', 'true');
      toggle.classList.add('is-open');
      panel.hidden = false;
      panel.classList.add('is-open');
      panel.setAttribute('aria-hidden', 'false');

      setLockSafe(true);
    };

    document.addEventListener('click', (e) => {
      const { toggle, panel } = getEls();
      if (!toggle || !panel) return;
      if (document.getElementById('nv-nav-slot')?.dataset.nvMobileWired === '1') return;

      const hitToggle = e.target.closest('[data-nv-mobile-toggle]');
      if (hitToggle) {
        const expanded = hitToggle.getAttribute('aria-expanded') === 'true';
        expanded ? close(toggle, panel) : open(toggle, panel);
        return;
      }

      if (panel.classList.contains('is-open')) {
        if (!e.target.closest('.nv-mpanel__inner')) close(toggle, panel);
      }
    }, true);

    document.addEventListener('keydown', (e) => {
      const { toggle, panel } = getEls();
      if (!toggle || !panel) return;
      if (document.getElementById('nv-nav-slot')?.dataset.nvMobileWired === '1') return;
      if (e.key === 'Escape') close(toggle, panel);
    });
  }

  setActiveNav();
  wireMobilePanel();
  const navSlotEl = document.getElementById('nv-nav-slot');
  if (navSlotEl?.dataset.nvMobileWired !== '1') {
    wireMobilePanelFallback();
  }
  wireReservationTriggers(document);
})();

