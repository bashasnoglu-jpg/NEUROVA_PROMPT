document.addEventListener('DOMContentLoaded', () => {
  initNavSlotLoader();
  initGlobalNav();
  initReservationModal();
  initReservationTriggers();
  initMobileMenu();
  initDropdowns();
  initActiveState();
  initWhatsApp();
  initScrollEffects();
  initServiceWorker();
  initScrollToTop();
  initThemeToggle();
  initSkipLink();
  initLoadingSpinner();
  initCookieConsent();
  initScrollProgress();
  initLanguageSwitcher();
  initScrollReveal();
  initParallax();
  initBlurLoad();
  initLightbox();
});

// Some pages mount the canonical nav asynchronously (via nav-slot-loader.js).
// Re-run nav-related initializers once the nav is mounted (idempotent guards inside).
document.addEventListener('nv:nav:mounted', () => {
  initGlobalNav();
  initReservationTriggers();
  initMobileMenu();
  initDropdowns();
  initActiveState();
  initWhatsApp();
  initScrollEffects();
});

function initMobileMenu() {
  const toggle = document.querySelector('[data-nv-mobile-toggle]');
  const panel = document.querySelector('[data-nv-mobile-panel]');
  const overlay = document.querySelector('[data-nv-mobile-overlay]');
  
  if (!toggle || !panel) return;
  if (toggle.dataset.nvMobileInited === '1') return;
  toggle.dataset.nvMobileInited = '1';

  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
    if (overlay) overlay.hidden = true;
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    toggle.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    if (overlay) overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay?.addEventListener('click', closeMenu);
  panel.querySelectorAll('a, button').forEach(item => {
    item.addEventListener('click', closeMenu);
  });
}

function initDropdowns() {
  const dropdowns = document.querySelectorAll('[data-nv-dropdown]');

  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('[data-nv-dropdown-toggle]');
    const menu = dropdown.querySelector('[data-nv-dropdown-menu]');

    if (!toggle || !menu) return;
    if (toggle.dataset.nvDropdownInited === '1') return;
    toggle.dataset.nvDropdownInited = '1';

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      
      // Close all other dropdowns first
      closeAllDropdowns();

      if (!isExpanded) {
        toggle.setAttribute('aria-expanded', 'true');
        menu.hidden = false;
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-nv-dropdown]')) {
      closeAllDropdowns();
    }
  });
}

function closeAllDropdowns() {
  document.querySelectorAll('[data-nv-dropdown-toggle]').forEach(t => t.setAttribute('aria-expanded', 'false'));
  document.querySelectorAll('[data-nv-dropdown-menu]').forEach(m => m.hidden = true);
}

function initActiveState() {
  const page = document.body.getAttribute('data-page');
  if (!page) return;

  const links = document.querySelectorAll(`[data-nav="${page}"]`);
  links.forEach(link => {
    link.classList.add('is-active');

    // Highlight parent dropdown if exists
    const dropdown = link.closest('[data-nv-dropdown]');
    if (dropdown) {
      const toggle = dropdown.querySelector('[data-nv-dropdown-toggle]');
      if (toggle) {
        toggle.classList.add('is-active');
        toggle.classList.add('bg-gray-100', 'dark:bg-white/10');
      }
    }
  });
}

function initWhatsApp() {
  const buttons = document.querySelectorAll('[data-wa="1"], .wa-cta');
  
  buttons.forEach(btn => {
    // Reservation CTAs are handled by `initReservationTriggers()`.
    if (btn.matches('[data-nv-open-reservation]')) return;
    if (btn.dataset.nvWaInited === '1') return;
    btn.dataset.nvWaInited = '1';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const phone = '905348350169';
      const isEn = document.documentElement.lang.startsWith('en');
      const text = isEn 
        ? 'Hello, I would like to get information about NEUROVA Spa & Wellness reservations and services.'
        : 'Merhaba, NEUROVA Spa & Wellness rezervasyon ve hizmetleri hakkında bilgi almak istiyorum.';
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    });
  });
}

// Legacy inline onclick support (NEUROVA_SITE/index.html)
// Prefer using `[data-nv-open-reservation]` and `[data-wa="1"]` instead.
window.nvOpenReservationModal = function nvOpenReservationModal(payload) {
  if (typeof window.NV_OPEN_RESERVATION === 'function') {
    window.NV_OPEN_RESERVATION(payload && typeof payload === 'object' ? payload : {});
    return;
  }
  // Fallback: open WhatsApp with a default reservation message.
  window.nvOpenWhatsApp('Merhaba, rezervasyon yapmak istiyorum.');
};

window.nvOpenWhatsApp = function nvOpenWhatsApp(message) {
  const phone = '905348350169';
  const text = String(message || '').trim() || (
    document.documentElement.lang.startsWith('en')
      ? 'Hello, I would like to get information about NEUROVA Spa & Wellness reservations and services.'
      : 'Merhaba, NEUROVA Spa & Wellness rezervasyon ve hizmetleri hakkında bilgi almak istiyorum.'
  );
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};

function initScrollEffects() {
  const header = document.querySelector('[data-nv-header]') || document.getElementById('nv-header');
  if (!header) return;
  if (header.dataset.nvScrollInited === '1') return;
  header.dataset.nvScrollInited = '1';

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }, { passive: true });
}

function initServiceWorker() {
  // Service Workers require HTTPS or localhost and do not work on file:// protocol
  if (!('serviceWorker' in navigator)) return;
  if (!window.location.protocol.startsWith('http')) return;

  const params = new URLSearchParams(window.location.search || '');
  const enabled = params.get('nv_sw') === '1' || localStorage.getItem('nv_sw') === '1';

  // Default: NO service worker (avoids stale-cache and network-error issues during development).
  if (!enabled) {
    // Unregister any previously-installed SWs for this origin (one-time per tab).
    if (sessionStorage.getItem('nv_sw_cleanup_done') === '1') return;
    sessionStorage.setItem('nv_sw_cleanup_done', '1');

    navigator.serviceWorker.getRegistrations()
      .then((regs) => Promise.all(regs.map((r) => r.unregister())))
      .then(() => {
        // Best-effort cache cleanup for old SW caches.
        if (!('caches' in window)) return;
        return caches.keys()
          .then((keys) => Promise.all(keys.filter((k) => /^neurova/i.test(k)).map((k) => caches.delete(k))));
      })
      .catch(() => {});

    return;
  }

  // Persist toggle if enabled via query string.
  if (params.get('nv_sw') === '1') localStorage.setItem('nv_sw', '1');

  // Register SW from the NEUROVA_SITE root when served under /NEUROVA_SITE/,
  // otherwise fall back to the origin root (for deployments where NEUROVA_SITE is the site root).
  const pathname = String(window.location.pathname || '/');
  const lower = pathname.toLowerCase();
  const marker = '/neurova_site/';
  const base = lower.includes(marker)
    ? pathname.slice(0, lower.indexOf(marker) + marker.length)
    : '/';

  const swUrl = `${base}sw.js`;
  navigator.serviceWorker.register(swUrl, { scope: base })
    .then(() => console.log('Service Worker Registered'))
    .catch(e => console.error('SW Registration Failed:', e));
}

function initScrollToTop() {
  const btn = document.getElementById('scrollToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.remove('opacity-0', 'invisible');
      btn.classList.add('opacity-100', 'visible');
    } else {
      btn.classList.add('opacity-0', 'invisible');
      btn.classList.remove('opacity-100', 'visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  
  // Default to dark (smoke theme). Allow opt-in light via localStorage.
  if (localStorage.theme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.theme = isDark ? 'dark' : 'light';
  });
}

function initSkipLink() {
  const main = document.querySelector('main');
  if (!main) return;

  if (!main.id) {
    main.id = 'main-content';
  }

  if (document.querySelector('a[href="#main-content"]')) return;

  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-5 focus:py-2.5 focus:bg-white focus:text-gray-900 focus:rounded-full focus:shadow-xl focus:font-medium transition-transform duration-200';
  skipLink.textContent = 'Ana İçeriğe Atla';
  document.body.prepend(skipLink);
}

function initLoadingSpinner() {
  if (document.getElementById('loading-spinner')) return;

  const spinner = document.createElement('div');
  spinner.id = 'loading-spinner';
  spinner.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-nv-bg/80 backdrop-blur-sm transition-opacity duration-300 opacity-0 pointer-events-none';
  spinner.setAttribute('aria-hidden', 'true');
  spinner.innerHTML = '<div class="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>';
  
  document.body.appendChild(spinner);

  window.nvShowSpinner = () => {
    spinner.classList.remove('opacity-0', 'pointer-events-none');
    spinner.setAttribute('aria-hidden', 'false');
  };

  window.nvHideSpinner = () => {
    spinner.classList.add('opacity-0', 'pointer-events-none');
    spinner.setAttribute('aria-hidden', 'true');
  };
}

function initCookieConsent() {
  const banner = document.getElementById('cookie-consent');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');

  if (!banner || !acceptBtn || !rejectBtn) return;

  if (!localStorage.getItem('nv_cookie_consent')) {
    setTimeout(() => {
      banner.classList.remove('translate-y-full');
      banner.setAttribute('aria-hidden', 'false');
    }, 1000);
  }

  const hide = () => {
    banner.classList.add('translate-y-full');
    banner.setAttribute('aria-hidden', 'true');
  };

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('nv_cookie_consent', 'accepted');
    hide();
  });

  rejectBtn.addEventListener('click', () => {
    localStorage.setItem('nv_cookie_consent', 'rejected');
    hide();
  });
}

function initScrollProgress() {
  if (document.getElementById('scroll-progress-bar')) return;

  const container = document.createElement('div');
  container.className = 'fixed top-0 left-0 w-full h-1 z-[100] bg-transparent pointer-events-none';
  
  const bar = document.createElement('div');
  bar.id = 'scroll-progress-bar';
  bar.className = 'h-full bg-gray-900 dark:bg-white w-0 transition-all duration-100 ease-out';
  
  container.appendChild(bar);
  document.body.prepend(container);

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${scrolled}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

function initLanguageSwitcher() {
  const buttons = document.querySelectorAll('[data-lang-switch]');
  
  buttons.forEach(btn => {
    if (btn.dataset.nvLangInited === '1') return;
    btn.dataset.nvLangInited = '1';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetLang = btn.dataset.langSwitch;
      const currentPath = window.location.pathname;
      
      if (targetLang === 'en' && currentPath.includes('/tr/')) {
        window.location.href = currentPath.replace('/tr/', '/en/');
      } else if (targetLang === 'tr' && currentPath.includes('/en/')) {
        window.location.href = currentPath.replace('/en/', '/tr/');
      }
    });
  });
}

function initScrollReveal() {
  // Otomatik olarak ana bölümlere ve kartlara uygula
  const elements = document.querySelectorAll('main section, .nv-card, .hero__content, .grid > div');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Sadece bir kez çalışsın
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  elements.forEach(el => {
    el.classList.add('nv-reveal');
    observer.observe(el);
  });
}

function initParallax() {
  const items = document.querySelectorAll('.nv-parallax');
  if (!items.length) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    items.forEach(item => {
      const speed = item.dataset.speed || 0.05; // Çok hafif hız
      item.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }, { passive: true });
}

function initBlurLoad() {
  const images = document.querySelectorAll('main img');
  images.forEach(img => {
    img.classList.add('nv-blur-load');
    if (img.complete) {
      img.classList.add('is-loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('is-loaded'));
    }
  });
}

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxIframe = document.getElementById('lightbox-iframe');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const triggers = document.querySelectorAll('[data-lightbox-src]');

  if (!lightbox || !triggers.length) return;

  const openLightbox = (src, caption, type) => {
    if (type === 'video') {
      lightboxImg.classList.add('hidden');
      lightboxVideo.classList.remove('hidden');
      if (lightboxIframe) lightboxIframe.src = src;
      requestAnimationFrame(() => {
        lightboxVideo.classList.remove('scale-95');
      });
    } else {
      lightboxVideo.classList.add('hidden');
      lightboxImg.classList.remove('hidden');
      lightboxImg.src = src;
      requestAnimationFrame(() => {
        lightboxImg.classList.remove('scale-95');
      });
    }

    if (lightboxCaption) lightboxCaption.textContent = caption || '';
    lightbox.classList.remove('hidden');
    
    // Small delay to allow display:block to apply before opacity transition
    requestAnimationFrame(() => {
      lightbox.classList.remove('opacity-0');
    });
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.add('opacity-0');
    if (!lightboxImg.classList.contains('hidden')) lightboxImg.classList.add('scale-95');
    if (!lightboxVideo.classList.contains('hidden')) lightboxVideo.classList.add('scale-95');
    
    setTimeout(() => {
      lightbox.classList.add('hidden');
      lightboxImg.src = '';
      if (lightboxIframe) lightboxIframe.src = ''; // Stop video
      document.body.style.overflow = '';
    }, 300);
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const src = trigger.dataset.lightboxSrc;
      const type = trigger.dataset.lightboxType || 'image';
      const caption = trigger.querySelector('h3')?.textContent;
      openLightbox(src, caption, type);
    });
  });

  closeBtn?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
      closeLightbox();
    }
  });
}

function initNavSlotLoader() {
  // Move nav-slot-loader.js logic into app.js to keep JS single-source.
  if (window.__nv_nav_slot_loader_inited__ === true) return;
  window.__nv_nav_slot_loader_inited__ = true;

  const DEV = new URLSearchParams(location.search || '').get('nvdev') === '1';
  const log = (...args) => { if (DEV) console.log('[NV NAV]', ...args); };

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
        el.remove();
      });
    });
  }

  const mount = (html) => {
    const base = computeBasePrefix();
    const slot = ensureSlot();

    // Load global stage + nav styles early to reduce FOUC on injected nav.
    injectOnce('link', { rel: 'stylesheet', href: `${base}assets/css/nv-global-stage.css?v=1.0` }, 'nv-global-stage-css');
    injectOnce('link', { rel: 'stylesheet', href: `${base}assets/nav.css?v=1.1` }, 'nv-nav-css');

    slot.innerHTML = html;
    hideLegacyNav(slot);

    document.dispatchEvent(new Event('nv:nav:mounted'));
    log('nav mounted');
  };

  // file:// cannot fetch reliably; inline template fallback.
  if (location.protocol === 'file:') {
    mount(getNavTemplate());
    return;
  }

  (async () => {
    const base = computeBasePrefix();
    const navUrl = `${base}partials/nav.html`;
    log('mounting nav from', navUrl);

    try {
      const res = await fetch(navUrl, { cache: 'no-cache' });
      if (!res.ok) {
        log('nav fetch failed', res.status, res.statusText);
        return; // keep legacy nav if present
      }
      const html = await res.text();
      mount(html);
    } catch (err) {
      log('nav mount error', err);
    }
  })();
}

function getNavTemplate() {
  // Inline template used for file:// scenarios (mirrors partials/nav.html)
  return `
<nav class="nv-header" aria-label="Primary">
  <div class="nv-shell nv-nav-row">
    <a class="nv-brand" data-nav="home" href="#">
      <span class="nv-brand__word">NEUROVA</span>
      <span class="nv-brand__sub">Spa & Wellness</span>
    </a>

    <div class="nv-nav" aria-label="Main">
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

function initGlobalNav() {
  const doc = document;
  const html = doc.documentElement;
  const body = doc.body;

  const CANON_KEYS = [
    'home', 'hamam', 'masajlar', 'signature-couples', 'kids-family', 'face',
    'paketler', 'urunler', 'galeri', 'about', 'team', 'iletisim'
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
    team: 'team',
    iletisim: 'iletisim',
    contact: 'iletisim'
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
    team: 'team.html',
    iletisim: 'iletisim.html'
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
    team: 'team.html',
    iletisim: 'contact.html'
  };

  const LABELS_TR = {
    home: 'Ana Sayfa',
    hamam: 'Hamam',
    masajlar: 'Masajlar',
    'signature-couples': 'Signature & Couples',
    'kids-family': 'Kids & Family',
    face: 'Face - Sothys',
    paketler: 'Paketler',
    urunler: 'Ürünler',
    kurumsal: 'Kurumsal',
    galeri: 'Galeri',
    about: 'Hakkımızda',
    team: 'Ekibimiz',
    iletisim: 'İletişim',
    reservation: 'Rezervasyon'
  };

  const LABELS_EN = {
    home: 'Home',
    hamam: 'Hammam',
    masajlar: 'Massages',
    'signature-couples': 'Signature & Couples',
    'kids-family': 'Kids & Family',
    face: 'Face - Sothys',
    paketler: 'Packages',
    urunler: 'Products',
    kurumsal: 'Corporate',
    galeri: 'Gallery',
    about: 'About',
    team: 'Team',
    iletisim: 'Contact',
    reservation: 'Reservation'
  };

  const isEn = (() => {
    const lang = (html.lang || '').toLowerCase();
    if (lang.startsWith('en')) return true;
    return (window.location.pathname || '').includes('/en/');
  })();

  const basePrefix = (() => {
    const p = window.location.pathname || '';
    if (p.includes('/tr/') || p.includes('/en/')) return '';
    return isEn ? 'en/' : 'tr/';
  })();

  function canonKey(key) {
    if (!key) return null;
    const lower = String(key).toLowerCase();
    return lower;
  }

  function applyNavTargets() {
    const map = isEn ? ROUTES_EN : ROUTES_TR;
    doc.querySelectorAll('a[data-nav]').forEach((anchor) => {
      const key = canonKey(anchor.dataset.nav);
      if (!key || !map[key]) return;
      anchor.setAttribute('href', `${basePrefix}${map[key]}`);
    });
  }

  function applyLabels() {
    const labels = isEn ? LABELS_EN : LABELS_TR;
    doc.querySelectorAll('[data-nav-label]').forEach((node) => {
      const key = canonKey(node.getAttribute('data-nav-label'));
      const text = key && labels[key] ? labels[key] : null;
      if (text) node.textContent = text;
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

    const dropdown = doc.querySelector('[data-nv-dropdown]');
    if (!dropdown) return;
    const toggle = dropdown.querySelector('[data-nv-dropdown-toggle]');
    if (!toggle) return;
    if (dropdown.querySelector('[data-nv-dropdown-menu] .is-active')) {
      toggle.classList.add('is-active');
    }
  }

  applyLabels();
  applyNavTargets();
  applyActiveState();
}

function initReservationTriggers() {
  document.querySelectorAll('[data-nv-open-reservation]').forEach((btn) => {
    if (btn.dataset.nvResTriggerInited === '1') return;
    btn.dataset.nvResTriggerInited = '1';
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      if (typeof window.NV_OPEN_RESERVATION === 'function') {
        window.NV_OPEN_RESERVATION();
        return;
      }
      window.nvOpenWhatsApp?.('Merhaba, rezervasyon yapmak istiyorum.');
    });
  });
}

function initReservationModal() {
  if (window.__nv_reservation_inited__ === true) return;
  window.__nv_reservation_inited__ = true;

  window.NV_ON_RESERVATION_OPEN = window.NV_ON_RESERVATION_OPEN || function () {};
  window.NV_ON_RESERVATION_EVENT = window.NV_ON_RESERVATION_EVENT || function () {};

  const DEFAULTS = {
    brand: 'NEUROVA',
    phoneE164: '905348350169',
    defaultMsgTR:
      'Merhaba NEUROVA, rezervasyon yapmak istiyorum.\\n' +
      'Tarih: \\nSaat: \\nKişi sayısı: \\nProgram: \\nNot: ',
    defaultMsgEN:
      'Hello NEUROVA, I would like to make a reservation.\\n' +
      'Date: \\nTime: \\nGuests: \\nProgram: \\nNote: ',
  };

  function getConfig() {
    const cfg = (window.NV_RESERVATION_CONFIG && typeof window.NV_RESERVATION_CONFIG === 'object')
      ? window.NV_RESERVATION_CONFIG
      : {};
    return { ...DEFAULTS, ...cfg };
  }

  function buildWAUrl(phoneE164, text) {
    const msg = encodeURIComponent(text || '');
    if (phoneE164) return `https://wa.me/${phoneE164}?text=${msg}`;
    return `https://wa.me/?text=${msg}`;
  }

  function ensureInjectedModal() {
    if (document.getElementById('nv-reservation-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'nv-reservation-overlay';
    overlay.className = 'nv-res-overlay';
    overlay.innerHTML = `
      <div class="nv-res-card" role="dialog" aria-modal="true" aria-label="Reservation">
        <div class="nv-res-head">
          <div class="nv-res-title">
            <h3>Rezervasyon</h3>
            <span class="sub">WhatsApp ile hızlı onay</span>
          </div>
          <button class="nv-res-close" type="button" data-nv-res-close aria-label="Kapat">×</button>
        </div>

        <div class="nv-res-body">
          <div class="nv-res-pane">
            <div class="nv-res-grid">
              <div class="nv-field">
                <label for="nv-res-name">Ad Soyad</label>
                <input id="nv-res-name" autocomplete="name" placeholder="Adınız" />
              </div>
              <div class="nv-field">
                <label for="nv-res-phone">Telefon (opsiyonel)</label>
                <input id="nv-res-phone" autocomplete="tel" placeholder="+90…" />
              </div>
              <div class="nv-field">
                <label for="nv-res-date">Tarih</label>
                <input id="nv-res-date" type="date" />
              </div>
              <div class="nv-field">
                <label for="nv-res-time">Saat</label>
                <input id="nv-res-time" type="time" />
              </div>
              <div class="nv-field">
                <label for="nv-res-guests">Kişi</label>
                <select id="nv-res-guests">
                  ${[1,2,3,4,5,6].map(n=>`<option value="${n}">${n}</option>`).join('')}
                </select>
              </div>
              <div class="nv-field">
                <label>Dil</label>
                <div class="nv-row" role="group" aria-label="Language">
                  <button class="nv-chip is-on" type="button" data-nv-lang="tr" aria-pressed="true">TR</button>
                  <button class="nv-chip" type="button" data-nv-lang="en" aria-pressed="false">EN</button>
                </div>
              </div>
            </div>

            <div class="nv-field" style="margin-top:10px;">
              <label for="nv-res-note">Program / Not</label>
              <textarea id="nv-res-note" placeholder="İstediğiniz program veya özel not..."></textarea>
            </div>

            <div class="nv-actions">
              <button class="nv-btn primary" type="button" data-nv-wa>WhatsApp ile Gönder</button>
              <button class="nv-btn" type="button" data-nv-copy>Mesajı Kopyala</button>
              <button class="nv-btn" type="button" data-nv-res-close>Kapat</button>
            </div>

            <p class="nv-mini" style="margin:10px 0 0;">
              Not: Bu akış WhatsApp üzerinden çalışır.
            </p>
          </div>

          <div class="nv-res-pane">
            <div class="nv-kv">
              <b>Gönderilecek mesaj önizleme</b>
              <span id="nv-res-preview"></span>
            </div>
            <div style="height:10px"></div>
            <p class="nv-mini">
              WhatsApp butonu yeni sekmede açılır. İstersen mesajı kopyalayıp WhatsApp'ta yapıştırabilirsin.
            </p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const closeButtons = overlay.querySelectorAll('[data-nv-res-close]');
    closeButtons.forEach((b) => b.addEventListener('click', closeModal));

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    overlay.querySelectorAll('[data-nv-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        overlay.querySelectorAll('[data-nv-lang]').forEach((b) => {
          b.classList.remove('is-on');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-on');
        btn.setAttribute('aria-pressed', 'true');
        updatePreview();
      });
    });

    ['nv-res-name','nv-res-phone','nv-res-date','nv-res-time','nv-res-guests','nv-res-note'].forEach((id) => {
      const el = document.getElementById(id);
      el.addEventListener('input', updatePreview);
      el.addEventListener('change', updatePreview);
    });

    overlay.querySelector('[data-nv-copy]').addEventListener('click', async () => {
      const msg = buildMessage();
      try {
        await navigator.clipboard.writeText(msg);
      } catch {
        const ta = document.getElementById('nv-res-note');
        ta.value = msg;
        ta.focus();
        ta.select();
      }
      try { window.NV_ON_RESERVATION_EVENT({ type: 'copy', payload: { message: msg } }); } catch {}
    });

    overlay.querySelector('[data-nv-wa]').addEventListener('click', () => {
      const cfg = getConfig();
      const msg = buildMessage();
      const url = buildWAUrl(cfg.phoneE164, msg);
      window.open(url, '_blank', 'noopener,noreferrer');
      try { window.NV_ON_RESERVATION_EVENT({ type: 'wa_send', payload: { message: msg, url, phone: cfg.phoneE164 || '' } }); } catch {}
    });

    function getLang() {
      const on = overlay.querySelector('[data-nv-lang].is-on');
      return (on && on.getAttribute('data-nv-lang')) || 'tr';
    }

    function buildMessage() {
      const cfg = getConfig();
      const lang = getLang();
      const name = (document.getElementById('nv-res-name').value || '').trim();
      const phone = (document.getElementById('nv-res-phone').value || '').trim();
      const date = document.getElementById('nv-res-date').value;
      const time = document.getElementById('nv-res-time').value;
      const guests = document.getElementById('nv-res-guests').value;
      const note = (document.getElementById('nv-res-note').value || '').trim();

      const base = (lang === 'en') ? cfg.defaultMsgEN : cfg.defaultMsgTR;

      const lines = [
        base,
        name ? `Ad/Name: ${name}` : '',
        phone ? `Tel: ${phone}` : '',
        date ? `Tarih/Date: ${date}` : '',
        time ? `Saat/Time: ${time}` : '',
        guests ? `Kişi/Guests: ${guests}` : '',
        note ? `Not/Note: ${note}` : '',
      ].filter(Boolean);

      return lines.join('\\n');
    }

    function updatePreview() {
      const msg = buildMessage();
      const pv = document.getElementById('nv-res-preview');
      pv.textContent = msg;
    }

    window.__NV_RES__ = { buildMessage, updatePreview };
    updatePreview();
  }

  let lastActiveElement = null;

  function focusFirst(modalEl) {
    const focusable = modalEl.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])');
    focusable?.focus?.();
  }

  function openInjected(payload) {
    ensureInjectedModal();
    const overlay = document.getElementById('nv-reservation-overlay');
    overlay.classList.add('is-open');
    document.documentElement.classList.add('nv-modal-open');
    document.body.classList.add('nv-modal-open');

    lastActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    try {
      const p = payload && typeof payload === 'object' ? payload : {};
      if (p.name) document.getElementById('nv-res-name').value = String(p.name);
      if (p.phone) document.getElementById('nv-res-phone').value = String(p.phone);
      if (p.date) document.getElementById('nv-res-date').value = String(p.date);
      if (p.time) document.getElementById('nv-res-time').value = String(p.time);
      if (p.guests) document.getElementById('nv-res-guests').value = String(p.guests);
      if (p.note) document.getElementById('nv-res-note').value = String(p.note);
      if (p.program) {
        const cur = (document.getElementById('nv-res-note').value || '').trim();
        document.getElementById('nv-res-note').value = (cur ? (cur + '\\n') : '') + `Program: ${p.program}`;
      }
    } catch {}

    window.__NV_RES__?.updatePreview?.();
    setTimeout(() => focusFirst(overlay), 0);
  }

  function closeInjected() {
    const overlay = document.getElementById('nv-reservation-overlay');
    if (!overlay) return;
    overlay.classList.remove('is-open');
    document.documentElement.classList.remove('nv-modal-open');
    document.body.classList.remove('nv-modal-open');
    lastActiveElement?.focus?.();
  }

  function setupLegacyModal(legacyModal) {
    if (legacyModal.dataset.nvLegacyResInited === '1') return;
    legacyModal.dataset.nvLegacyResInited = '1';

    const drawer = legacyModal.querySelector('.nv-drawer') || legacyModal;

    const close = () => {
      legacyModal.hidden = true;
      document.documentElement.classList.remove('nv-modal-open');
      document.body.classList.remove('nv-modal-open');
      lastActiveElement?.focus?.();
    };

    legacyModal.addEventListener('click', (e) => {
      if (e.target === legacyModal) close();
    });

    legacyModal.querySelectorAll('[data-action="close-modal"]').forEach((btn) => {
      btn.addEventListener('click', close);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !legacyModal.hidden) close();
    });

    const form = legacyModal.querySelector('#nv-reservation-form');
    if (form && form.dataset.nvResFormInited !== '1') {
      form.dataset.nvResFormInited = '1';
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = legacyModal.querySelector('#nv-res-name')?.value?.trim?.() || '';
        const service = legacyModal.querySelector('#nv-res-service')?.value?.trim?.() || '';
        const date = legacyModal.querySelector('#nv-res-date')?.value?.trim?.() || '';
        const msg = `Merhaba, rezervasyon yapmak istiyorum.\\nAd: ${name}\\nDeneyim: ${service}\\nZaman: ${date}`;
        window.nvOpenWhatsApp?.(msg);
        close();
      });
    }

    legacyModal.__nvClose = close;
    legacyModal.__nvDrawer = drawer;
  }

  function openLegacy(payload) {
    const legacyModal = document.getElementById('nv-reservation-modal');
    if (!legacyModal) return false;

    setupLegacyModal(legacyModal);

    lastActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    legacyModal.hidden = false;
    document.documentElement.classList.add('nv-modal-open');
    document.body.classList.add('nv-modal-open');

    try {
      const p = payload && typeof payload === 'object' ? payload : {};
      if (p.name && legacyModal.querySelector('#nv-res-name')) legacyModal.querySelector('#nv-res-name').value = String(p.name);
      if (p.program && legacyModal.querySelector('#nv-res-service')) legacyModal.querySelector('#nv-res-service').value = String(p.program);
    } catch {}

    setTimeout(() => focusFirst(legacyModal.__nvDrawer || legacyModal), 0);
    return true;
  }

  function openModal(payload) {
    if (openLegacy(payload)) return;
    openInjected(payload);
  }

  function closeModal() {
    const legacyModal = document.getElementById('nv-reservation-modal');
    if (legacyModal && legacyModal.hidden === false) {
      legacyModal.__nvClose?.();
      return;
    }
    closeInjected();
  }

  window.NV_OPEN_RESERVATION = function (payload) {
    openModal(payload);
    try { window.NV_ON_RESERVATION_OPEN(payload && typeof payload === 'object' ? { ...payload } : {}); } catch {}
  };

  window.NV_CLOSE_RESERVATION = closeModal;
}

// Export functions for unit testing
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = {
    initNavSlotLoader,
    initGlobalNav,
    initReservationModal,
    initReservationTriggers,
    initMobileMenu,
    initDropdowns,
    closeAllDropdowns,
    initActiveState,
    initWhatsApp,
    initScrollEffects,
    initServiceWorker,
    initScrollToTop,
    initThemeToggle,
    initSkipLink,
    initLoadingSpinner,
    initCookieConsent,
    initScrollProgress,
    initLanguageSwitcher,
    initScrollReveal,
    initParallax,
    initBlurLoad
  };
}
