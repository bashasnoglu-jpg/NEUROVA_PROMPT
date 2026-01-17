(function nvSetActiveNav() {
  // current file name (works on /path/page.html, ignores query/hash)
  const raw = (location.pathname.split("/").pop() || "index.html");
  const file = raw.split("?")[0].split("#")[0].toLowerCase();

  // Map file -> nav key
  function navKeyFromFile(f) {
    if (f === "" || f === "index.html") return "home";

    // exact hubs
    if (f === "hamam.html") return "hamam";
    if (f === "masajlar.html") return "masaj";
    if (f === "kids-family.html") return "kids";
    if (f === "cilt-bakimi.html") return "cilt";
    if (f === "iletisim.html") return "iletisim";
    if (f === "paketler.html") return "paketler";
    if (f === "urunler.html") return "urunler";
    if (f === "galeri.html") return "galeri";
    if (f === "hakkimizda.html") return "hakkimizda";
    if (f === "ekibimiz.html") return "ekip";

    // detail prefixes (very important)
    if (f.startsWith("hamam-")) return "hamam";

    if (f.startsWith("masaj-") || f.startsWith("ayurveda-")) return "masaj";

    if (f.startsWith("kids-") || f.startsWith("teen-") || f.startsWith("family-")) return "kids";

    if (f.startsWith("cilt-") || f.startsWith("sothys-")) return "cilt";

    if (f.startsWith("paketler-") || f.startsWith("paket-")) return "paketler";

    if (f.startsWith("urunler-") || f.startsWith("urun-")) return "urunler";

    return null;
  }

  const key = navKeyFromFile(file);
  if (!key) return;

  // Clear previous
  document.querySelectorAll('[data-nav].is-active').forEach(el => el.classList.remove("is-active"));

  // Apply active to both desktop + mobile links that match
  document.querySelectorAll(`[data-nav="${key}"]`).forEach(el => el.classList.add("is-active"));

  // If an item inside Kurumsal is active, also mark the dropdown trigger
  const isCorporate = (key === "galeri" || key === "hakkimizda" || key === "ekip");
  if (isCorporate) {
    const triggerBtn = document.querySelector(".nv-dropdown-trigger .nv-dropdown-btn");
    if (triggerBtn) triggerBtn.classList.add("is-active");
  }
})();

(function nvInitMobileMenu() {
  const btn = document.getElementById("nvBurger");
  const menu = document.getElementById("nvMobileMenu");
  if (!btn || !menu) return;

  const toggleMenu = () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    const nextState = !expanded;

    btn.setAttribute("aria-expanded", nextState);
    menu.setAttribute("aria-hidden", !nextState);
    menu.classList.toggle("is-active");
    document.body.style.overflow = nextState ? "hidden" : "";
  };

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close on link click
  menu.addEventListener("click", (e) => {
    if (e.target.matches("a, button") || e.target.closest("a, button")) {
      if (btn.getAttribute("aria-expanded") === "true") {
        toggleMenu();
      }
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
      toggleMenu();
    }
  });
})();
