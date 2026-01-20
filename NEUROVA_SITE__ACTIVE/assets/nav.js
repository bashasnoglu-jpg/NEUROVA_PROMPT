'use strict';

(() => {
  const doc = document;
  const html = doc.documentElement;
  const body = doc.body;

  const CANON_KEYS = [
    'home', 'hamam', 'masajlar', 'signature-couples', 'kids-family', 'face',
    'paketler', 'urunler', 'galeri', 'about', 'team'
  ];

  const FILE_TO_KEY = {
    index: 'home',
    hamam: 'hamam',
    hammam: 'hamam',
    masajlar: 'masajlar',
    massages: 'masajlar',
    'signature-couples': 'signature-couples',
    'kids-family': 'kids-family',
    'face-sothys': 'face',
    paketler: 'paketler',
    packages: 'paketler',
    products: 'urunler',
    urunler: 'urunler',
    galeri: 'galeri',
    gallery: 'galeri',
    about: 'about',
    team: 'team'
  };

  const ROUTES_TR = {
    home: 'index.html',
    hamam: 'hamam.html',
    masajlar: 'masajlar.html',
    'signature-couples': 'signature-couples.html',
    'kids-family': 'kids-family.html',
    face: 'face-sothys.html',
    paketler: 'paketler.html',
    urunler: 'products.html',
    galeri: 'galeri.html',
    about: 'about.html',
    team: 'team.html'
  };

  const ROUTES_EN = {
    home: 'index.html',
    hamam: 'hamam.html',
    masajlar: 'massages.html',
    'signature-couples': 'signature-couples.html',
    'kids-family': 'kids-family.html',
    face: 'face-sothys.html',
    paketler: 'packages.html',
    urunler: 'products.html',
    galeri: 'gallery.html',
    about: 'about.html',
    team: 'team.html'
  };

  const ALIAS_MAP = {
    massages: 'masajlar',
    packages: 'paketler',
    products: 'urunler',
    gallery: 'galeri',
    corporate: 'kurumsal'
  };

  const isDev = (() => {
    const search = new URLSearchParams(window.location.search || '');
    return search.get('nvdev') === '1' || html.dataset.nvDev === '1';
  })();

  const isEn = (() => {
    const lang = (html.lang || '').toLowerCase();
    if (lang.startsWith('en')) return true;
    return (window.location.pathname || '').startsWith('/en/');
  })();

  function canonKey(key) {
    if (!key) return null;
    const lower = key.toLowerCase();
    if (ALIAS_MAP[lower]) return ALIAS_MAP[lower];
    return lower;
  }

  function devGuard() {
    if (!isDev) return;
    const badTokens = ['ÃƒÅ“', 'Ã¢â‚¬â€œ', 'ÃƒÂ¢Ã¢â‚¬â€œÃ‚¾', 'ï¿½'];
    const htmlText = doc.documentElement.innerHTML;
    if (badTokens.some((t) => htmlText.includes(t))) {
      throw new Error('nvdev: mojibake detected');
    }
    const allLinks = Array.from(doc.querySelectorAll('[href],[src]'));
    const parentRefs = allLinks.filter((el) => {
      const val = el.getAttribute('href') || el.getAttribute('src') || '';
      return val.includes('../');
    });
    if (parentRefs.length) {
      throw new Error('nvdev: parent path ../ found');
    }
    const allowed = new Set([...CANON_KEYS, ...Object.keys(ALIAS_MAP)]);
    const invalid = Array.from(doc.querySelectorAll('[data-nav]')).filter((el) => {
      const key = canonKey(el.dataset.nav);
      return !key || (!allowed.has(key) && !CANON_KEYS.includes(key));
    });
    if (invalid.length) {
      throw new Error('nvdev: unknown data-nav key');
    }
  }

  function applyNavTargets() {
    const map = isEn ? ROUTES_EN : ROUTES_TR;
    const base = '';
    doc.querySelectorAll('a[data-nav]').forEach((anchor) => {
      const key = canonKey(anchor.dataset.nav);
      if (!key || !map[key]) return;
      anchor.setAttribute('href', `${base}${map[key]}`);
    });
  }

  function currentFileName() {
    const path = window.location.pathname || '';
    if (!path || path === '/') return 'index.html';
    const trimmed = path.endsWith('/') ? path.slice(0, -1) : path;
    const parts = trimmed.split('/').filter(Boolean);
    const last = parts[parts.length - 1] || 'index.html';
    return last.includes('.') ? last : `${last}.html`;
  }

  function resolveActiveKey() {
    const fromBody = canonKey(body?.dataset?.page);
    if (fromBody && CANON_KEYS.includes(fromBody)) return fromBody;
    const file = currentFileName().replace(/\.html$/i, '');
    const mapped = FILE_TO_KEY[file];
    const key = canonKey(mapped || file);
    if (key && CANON_KEYS.includes(key)) return key;
    return null;
  }

  function applyActiveState() {
    const active = resolveActiveKey();
    if (!active) return;
    doc.querySelectorAll('[data-nav]').forEach((el) => {
      const key = canonKey(el.dataset.nav);
      if (key === active) el.classList.add('is-active');
    });
  }

  function setupDropdown() {
    const dropdown = doc.querySelector('[data-nv-dropdown]');
    if (!dropdown) return;
    const toggle = dropdown.querySelector('[data-nv-dropdown-toggle]');
    const menu = dropdown.querySelector('[data-nv-dropdown-menu]');
    if (!toggle || !menu) return;

    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    };
    const open = () => {
      toggle.setAttribute('aria-expanded', 'true');
      menu.hidden = false;
    };

    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      expanded ? close() : open();
    });

    doc.addEventListener('click', (event) => {
      if (menu.hidden) return;
      if (dropdown.contains(event.target)) return;
      close();
    });

    doc.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });

    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  }

  const mobileToggles = Array.from(doc.querySelectorAll('[data-nv-mobile-toggle]'));
  const mobilePanel = doc.querySelector('[data-nv-mobile-panel]');
  const mobileOverlay = doc.querySelector('[data-nv-mobile-overlay]');

  function setMobile(open) {
    if (!mobilePanel || !mobileOverlay) return;
    mobilePanel.hidden = !open;
    mobileOverlay.hidden = !open;
    mobileToggles.forEach((btn) => btn.setAttribute('aria-expanded', open ? 'true' : 'false'));
    [html, body].forEach((el) => el && el.classList[open ? 'add' : 'remove']('nv-lock'));
  }

  function setupMobile() {
    if (!mobilePanel || !mobileOverlay) return;
    setMobile(false);
    mobileToggles.forEach((btn) => btn.addEventListener('click', () => setMobile(mobilePanel.hidden)));
    mobileOverlay.addEventListener('click', () => setMobile(false));
    mobilePanel.addEventListener('click', (event) => {
      const anchor = event.target instanceof Element ? event.target.closest('a') : null;
      if (anchor) setMobile(false);
    });
    doc.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMobile(false);
    });
  }

  function setupReservation() {
    const getHandler = () => {
      if (typeof window.NV_OPEN_RESERVATION === 'function') return window.NV_OPEN_RESERVATION;
      if (typeof window.nvOpenReservation === 'function') return window.nvOpenReservation;
      if (typeof window.openReservation === 'function') return window.openReservation;
      return null;
    };

    const scrollFallback = () => {
      const anchor = doc.getElementById('nv-wa') || doc.getElementById('reservation');
      if (anchor?.scrollIntoView) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else alert('Reservation: WhatsApp');
    };

    doc.querySelectorAll('[data-nv-open-reservation]').forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        const handler = getHandler();
        if (handler) {
          handler();
          return;
        }
        scrollFallback();
      });
    });
  }

  function init() {
    devGuard();
    applyNavTargets();
    applyActiveState();
    setupDropdown();
    setupMobile();
    setupReservation();
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
