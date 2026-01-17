/* ===============================
   NEUROVA — NAV SCRIPT v1.0
   Simple • Deterministic • No-Cache
   =============================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sayfa kimliğini al
  const pageId = document.body.getAttribute('data-page');
  if (!pageId) return;

  // 2. Navigasyonda eşleşen linki bul
  const activeLink = document.querySelector(`.nv-nav a[data-nav="${pageId}"]`);

  // 3. Active class ekle
  if (activeLink) {
    activeLink.classList.add('is-active');
  }
});

// Sticky header (soft)
(function () {
  const header = document.querySelector('.nv-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('is-stuck');
    } else {
      header.classList.remove('is-stuck');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* =========================================================
   NEUROVA – MOBILE NAV TOGGLE v1.0
   ========================================================= */

const burger = document.getElementById("nvBurger");
const mobileMenu = document.getElementById("nvMobileMenu");

if (burger && mobileMenu) {
  burger.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
  });
}

/* =========================================================
   NEUROVA – HERO PARALLAX ENGINE v1.0
   ========================================================= */

const hero = document.getElementById("nvHero");

if (hero && window.innerWidth > 768) {
  const layerBack = hero.querySelector(".nv-layer-back");
  const layerMid = hero.querySelector(".nv-layer-mid");
  const layerFront = hero.querySelector(".nv-layer-front");

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;

    if (layerBack) {
      layerBack.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
    if (layerMid) {
      layerMid.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    if (layerFront) {
      layerFront.style.transform = `translateY(${scrolled * 0.45}px)`;
    }
  });
}
