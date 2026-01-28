// section-map.js
// Single source of truth for pages and sections (semantic layer)
window.NV_SECTION_MAP = {
  home: {
    page: "home",
    sections: [
      { section: "hero", nav: "home" },
      { section: "shortcuts", nav: "home" },
      { section: "hamam-feature", nav: "hamam" },
      { section: "masaj-feature", nav: "masajlar" },
      { section: "face-feature", nav: "face" },
      { section: "packages", nav: "paketler" },
      { section: "nv-wa", nav: "reservation" },
    ],
  },

  hamam: {
    page: "hamam",
    sections: [
      { section: "hamam-hero", nav: "hamam" },
      { section: "hamam-details", nav: "hamam" },
      { section: "hamam-gallery", nav: "hamam" },
      { section: "hamam-upgrade", nav: "hamam" },
      { section: "hamam-faq", nav: "hamam" },
      { section: "nv-wa", nav: "reservation" },
    ],
  },

  masajlar: {
    page: "masajlar",
    sections: [
      { section: "massages-hero", nav: "masajlar" },
      { section: "massages-details", nav: "masajlar" },
      { section: "massages-notes", nav: "masajlar" },
      { section: "massages-cta", nav: "masajlar" },
      { section: "nv-wa", nav: "reservation" },
    ],
  },

  face: {
    page: "face",
    sections: [
      { section: "face-hero", nav: "face" },
      { section: "face-programs", nav: "face" },
      { section: "face-accordions", nav: "face" },
      { section: "face-flow", nav: "face" },
      { section: "face-cta", nav: "face" },
      { section: "nv-wa", nav: "reservation" },
    ],
  },
};

