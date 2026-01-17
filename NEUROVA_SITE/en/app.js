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