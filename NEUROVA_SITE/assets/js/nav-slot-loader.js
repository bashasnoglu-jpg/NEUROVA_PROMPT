// NEUROVA_SITE/assets/js/nav-slot-loader.js
// Loads canonical nav partial into #nv-nav-slot and injects nav assets once.

(() => {
  const DEV = new URLSearchParams(location.search || '').get('nvdev') === '1';

  const log = (...args) => {
    if (DEV) console.log('[NV NAV LOADER]', ...args);
  };

  function computeBasePrefix() {
    // Build a relative prefix from current path to NEUROVA_SITE root
    let segments = (location.pathname || '/').split('/').filter(Boolean);
    // Drop filename
    if (segments.length && segments[segments.length - 1].includes('.')) {
      segments.pop();
    }
    // Trim leading drive letter on file:// (e.g., C:)
    if (segments.length && /^[A-Za-z]:$/.test(segments[0])) {
      segments = segments.slice(1);
    }
    // Find NEUROVA_SITE anchor
    const idx = segments.map((s) => s.toLowerCase()).indexOf('neurova_site');
    if (idx !== -1) {
      segments = segments.slice(idx + 1);
    }
    if (!segments.length) return './';
    return '../'.repeat(segments.length);
  }

  function ensureSlot() {
    let slot = document.getElementById('nv-nav-slot');
    if (!slot) {
      slot = document.createElement('div');
      slot.id = 'nv-nav-slot';
      const target = document.body || document.documentElement;
      target.insertBefore(slot, target.firstChild);
      log('created #nv-nav-slot');
    }
    return slot;
  }

  function injectOnce(tag, attrs, id) {
    if (id && document.getElementById(id)) return false;
    const el = document.createElement(tag);
    if (id) el.id = id;
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
    return true;
  }

  function hideLegacyNav(slot) {
    const selectors = [
      '[data-nv-header]',
      '.nv-header',
      'header.nv-nav',
      '#nv-header',
      '.nv-navbar',
      'nav.nv-shell',
      'header .nv-nav',
      '.nv-nav-inner',
      '#nvMobileMenu',
    ];
    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        if (slot.contains(el)) return;
        if (el.dataset.nvLegacyNav === '1') return;
        el.dataset.nvLegacyNav = '1';
        if (DEV) log('removing legacy nav node', sel);
        el.remove();
      });
    });
  }

  async function mountNav() {
    const base = computeBasePrefix();
    const slot = ensureSlot();
    hideLegacyNav(slot);

    injectOnce('link', { rel: 'stylesheet', href: `${base}assets/css/nv-global-stage.css?v=1.0` }, 'nv-global-stage-css');
    injectOnce('script', { defer: '', src: `${base}assets/reservation.js` }, 'nv-reservation-js');

    // file:// cannot fetch reliably; inline template with dev notice
    if (location.protocol === 'file:') {
      console.warn('[NV NAV LOADER] file:// fallback active — ensure partials/nav.html stays in sync');
      slot.innerHTML = getNavTemplate();
      injectOnce('link', { rel: 'stylesheet', href: `${base}assets/nav.css` }, 'nv-nav-css');
      injectOnce('script', { defer: '', src: `${base}assets/nav.js` }, 'nv-nav-js');
      document.dispatchEvent(new Event('nv:nav:mounted'));
      log('nav mounted (inline, file://)');
      return;
    }

    const navUrl = `${base}partials/nav.html`;
    log('mounting nav from', navUrl);

    try {
      const res = await fetch(navUrl, { cache: 'no-cache' });
      if (!res.ok) {
        log('nav fetch failed', res.status, res.statusText);
        return;
      }

      const html = await res.text();
      slot.innerHTML = html;

      injectOnce('link', { rel: 'stylesheet', href: `${base}assets/nav.css` }, 'nv-nav-css');
      injectOnce('script', { defer: '', src: `${base}assets/nav.js` }, 'nv-nav-js');

      document.dispatchEvent(new Event('nv:nav:mounted'));
      log('nav mounted');
    } catch (err) {
      log('nav mount error', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountNav);
  } else {
    mountNav();
  }
})();

// Inline template used for file:// scenarios (mirrors partials/nav.html)
function getNavTemplate() {
  return `
<nav class="nv-header" aria-label="Primary">
  <div class="nv-shell nv-nav-row">
    <a class="nv-brand" data-nav="home" href="#">
      <span class="nv-brand__word">NEUROVA</span>
      <span class="nv-brand__sub">Spa & Wellness</span>
    </a>

    <div class="nv-nav">
      <a class="nv-link nv-link-hover" data-nav="home" href="#"><span data-nav-label="home"></span></a>
      <a class="nv-link nv-link-hover" data-nav="hamam" href="#"><span data-nav-label="hamam"></span></a>
      <a class="nv-link nv-link-hover" data-nav="masajlar" href="#"><span data-nav-label="masajlar"></span></a>
      <a class="nv-link nv-link-hover" data-nav="kids-family" href="#"><span data-nav-label="kids-family"></span></a>
      <a class="nv-link nv-link-hover" data-nav="face" href="#"><span data-nav-label="face"></span></a>
      <a class="nv-link nv-link-hover" data-nav="paketler" href="#"><span data-nav-label="paketler"></span></a>
      <a class="nv-link nv-link-hover" data-nav="urunler" href="#"><span data-nav-label="urunler"></span></a>

      <div class="nv-dropdown" data-nv-dropdown>
        <button class="nv-link nv-link-hover nv-link--dropdown" type="button" data-nv-dropdown-toggle aria-expanded="false">
          <span data-nav-label="kurumsal"></span>
        </button>
        <div class="nv-dropdown__menu" data-nv-dropdown-menu hidden>
          <a class="nv-link nv-link-hover" data-nav="galeri" href="#"><span data-nav-label="galeri"></span></a>
          <a class="nv-link nv-link-hover" data-nav="about" href="#"><span data-nav-label="about"></span></a>
          <a class="nv-link nv-link-hover" data-nav="team" href="#"><span data-nav-label="team"></span></a>
          <a class="nv-link nv-link-hover" data-nav="iletisim" href="#"><span data-nav-label="iletisim"></span></a>
        </div>
      </div>
    </div>

    <div class="nv-actions">
      <a class="nv-cta" href="#nv-wa" data-wa="1" data-nv-open-reservation><span data-nav-label="reservation"></span></a>

      <button class="nv-burger" type="button" data-nv-mobile-toggle aria-label="Menu" aria-expanded="false">
        <span></span>
        <span></span>
      </button>
    </div>
  </div>

  <div class="nv-mpanel" data-nv-mobile-panel hidden aria-modal="true" role="dialog">
    <div class="nv-mpanel__inner">
      <a class="nv-mlink" data-nav="home" href="#"><span data-nav-label="home"></span></a>
      <a class="nv-mlink" data-nav="hamam" href="#"><span data-nav-label="hamam"></span></a>
      <a class="nv-mlink" data-nav="masajlar" href="#"><span data-nav-label="masajlar"></span></a>
      <a class="nv-mlink" data-nav="kids-family" href="#"><span data-nav-label="kids-family"></span></a>
      <a class="nv-mlink" data-nav="face" href="#"><span data-nav-label="face"></span></a>
      <a class="nv-mlink" data-nav="paketler" href="#"><span data-nav-label="paketler"></span></a>
      <a class="nv-mlink" data-nav="urunler" href="#"><span data-nav-label="urunler"></span></a>
      <a class="nv-mlink" data-nav="galeri" href="#"><span data-nav-label="galeri"></span></a>
      <a class="nv-mlink" data-nav="about" href="#"><span data-nav-label="about"></span></a>
      <a class="nv-mlink" data-nav="team" href="#"><span data-nav-label="team"></span></a>
      <a class="nv-mlink" data-nav="iletisim" href="#"><span data-nav-label="iletisim"></span></a>

      <div class="nv-mobile__cta--sticky">
        <a class="nv-mcta" href="#nv-wa" data-wa="1" data-nv-open-reservation><span data-nav-label="reservation"></span></a>
      </div>
    </div>
  </div>
</nav>

<div class="nv-mobile-overlay" data-nv-mobile-overlay hidden></div>
`;
}
