const NV_UI_LANG = window.NV_UI_LANG || "tr";
window.NV_UI_COPY = {};

async function NV_UI_BOOTSTRAP_LANGS() {
  const langs = ["tr", "en"];
  await Promise.all(
    langs.map(async (lang) => {
      try {
        const res = await fetch(`../uiCopy.${lang}.json`);
        if (!res.ok) throw new Error(`lang load failed: ${lang}`);
        window.NV_UI_COPY[lang] = await res.json();
      } catch (err) {
        console.warn("NV_UI_COPY:", err);
      }
    })
  );
}

function NV_UI_PATH(obj, path) {
  return path.split(".").reduce((acc, key) => (acc && acc[key] ? acc[key] : null), obj);
}

function tUI(path, lang = window.NV_UI_LANG) {
  const translations = window.NV_UI_COPY[lang] || {};
  return NV_UI_PATH(translations, path) || "";
}

function setUILang(lang) {
  if (!["tr", "en"].includes(lang)) return;
  window.NV_UI_LANG = lang;
  document.documentElement.lang = lang;
}

function NV_UI_TOGGLE_LANG() {
  setUILang(window.NV_UI_LANG === "en" ? "tr" : "en");
  const switcher = document.querySelector("[data-nv-ui-lang]");
  if (switcher) {
    switcher.textContent = window.NV_UI_LANG.toUpperCase();
  }
}

NV_UI_BOOTSTRAP_LANGS().then(() => {
  document.body?.classList.remove("nv-ui-loading");
});

window.NV_UI = { t: tUI, setLang: setUILang, toggleLang: NV_UI_TOGGLE_LANG };
