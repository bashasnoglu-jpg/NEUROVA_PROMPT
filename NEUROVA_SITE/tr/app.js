// NAV & MOBILE
(function () {
    const mobileToggle = document.querySelector('[data-nv-mobile-toggle]');
    const mobilePanel = document.querySelector('[data-nv-mobile-panel]');

    if (mobileToggle && mobilePanel) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = mobilePanel.hasAttribute('hidden');
            if (isHidden) {
                mobilePanel.removeAttribute('hidden');
                mobileToggle.setAttribute('aria-expanded', 'true');
            } else {
                mobilePanel.setAttribute('hidden', '');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('click', (e) => {
            if (!mobilePanel.hasAttribute('hidden') && !mobilePanel.contains(e.target) && !mobileToggle.contains(e.target)) {
                mobilePanel.setAttribute('hidden', '');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
})();

// CTA TRACKING (console only placeholder)
document.addEventListener('click', (e) => {
    const ctaButton = e.target.closest('[data-cta-name]');
    if (ctaButton) {
        const ctaName = ctaButton.dataset.ctaName;
        const ctaContext = ctaButton.dataset.ctaPageContext || 'Unknown';
        console.log(`CTA tıklandı: ${ctaName} | Sayfa: ${ctaContext} | Hedef: ${ctaButton.href || 'Button Action'}`);
    }
});

// SERVICE WORKER (disabled by default; enable via ?nv_sw=1 or localStorage nv_sw=1)
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    try {
        const params = new URLSearchParams(window.location.search || '');
        const enabled = params.get('nv_sw') === '1' || localStorage.getItem('nv_sw') === '1';

        if (!enabled) {
            // Best-effort: unregister existing SWs (avoid stale SW causing 504s)
            navigator.serviceWorker.getRegistrations()
                .then((regs) => Promise.all(regs.map((r) => r.unregister())))
                .catch(() => {});
        } else {
            if (params.get('nv_sw') === '1') localStorage.setItem('nv_sw', '1');
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('../sw.js', { scope: '../' })
                    .then((registration) => console.log('SW registered:', registration.scope))
                    .catch((err) => console.log('SW registration failed:', err));
            });
        }
    } catch (_) {}
}

// LAZY LOADING FALLBACK (native first)
document.addEventListener('DOMContentLoaded', () => {
    const supportsLazy = 'loading' in HTMLImageElement.prototype;
    if (supportsLazy) {
        document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
            if (!img.src && img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    obs.unobserve(img);
                }
            });
        });
        document.querySelectorAll('img[loading="lazy"]').forEach((img) => observer.observe(img));
    }
});

// WHATSAPP CTA NORMALIZER
(function () {
    const number = '905348350169';
    const baseUrl = `https://wa.me/${number}`;
    document.querySelectorAll('.wa-cta').forEach((link) => {
        if (!link.href.includes('wa.me')) {
            link.href = baseUrl;
        }
    });
})();
