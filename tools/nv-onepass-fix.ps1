$ErrorActionPreference="Stop"

# 0) Ensure folders
New-Item -ItemType Directory -Force -Path ".\tools" | Out-Null
New-Item -ItemType Directory -Force -Path ".\SANTIS_PROMPT\packs" | Out-Null

# 1) NV_PROMPT bootstrap (minimal working prompt app + sample pack)
@'
<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>SANTIS Prompt Kütüphanesi</title>
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;margin:24px}
    .row{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
    input,select,button{padding:10px 12px;border:1px solid #ddd;border-radius:10px}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin-top:16px}
    .card{border:1px solid #eee;border-radius:14px;padding:12px}
    .muted{color:#666;font-size:12px}
    pre{white-space:pre-wrap;background:#fafafa;border:1px solid #eee;border-radius:12px;padding:10px}
  </style>
  <script>
    window.NV_PACK_LIST = window.NV_PACK_LIST || [
      "./packs/pack.sample.js"
    ];
  </script>
  <script defer src="./prompts-loader.js"></script>
  <script defer src="./app.js"></script>
</head>
<body>
  <h1>SANTIS Prompt Kütüphanesi</h1>
  <div class="row">
    <input id="nv-q" placeholder="Ara (id / title / tag)..." />
    <select id="nv-cat"><option value="ALL">ALL</option></select>
    <select id="nv-role"><option value="ALL">ALL</option></select>
    <select id="nv-lang">
      <option value="all">TR+EN</option>
      <option value="tr">TR</option>
      <option value="en">EN</option>
    </select>
    <span class="muted">Count: <b id="nv-count">0</b></span>
  </div>
  <div class="grid" id="nv-grid"></div>
  <hr />
  <div class="muted" id="nv-health"></div>
</body>
</html>
'@ | Set-Content -Encoding UTF8 ".\SANTIS_PROMPT\prompt-library.html"

@'
"use strict";
window.NV_PROMPTS = Array.isArray(window.NV_PROMPTS) ? window.NV_PROMPTS : [];
window.__NV_PACK_ERRORS__ = window.__NV_PACK_ERRORS__ && typeof window.__NV_PACK_ERRORS__==="object" ? window.__NV_PACK_ERRORS__ : {};

async function nvLoadPack(url){
  try{
    const r = await fetch(url, { cache:"no-store" });
    if(!r.ok) throw new Error("HTTP "+r.status);
    const js = await r.text();
    (0, eval)(js);
    return { ok:true, url };
  }catch(e){
    window.__NV_PACK_ERRORS__[url] = String(e);
    return { ok:false, url, err:String(e) };
  }
}

async function nvLoadAllPacks(){
  const list = Array.isArray(window.NV_PACK_LIST) ? window.NV_PACK_LIST : [];
  const results = [];
  for (const u of list) results.push(await nvLoadPack(u));
  window.__NV_PACKS_LOADED__ = true;
  window.__NV_PACK_RESULTS__ = results;
  document.dispatchEvent(new CustomEvent("nv:packs:loaded", { detail: { results } }));
  return results;
}

window.NV_LOAD_PACKS = nvLoadAllPacks;
nvLoadAllPacks();
'@ | Set-Content -Encoding UTF8 ".\SANTIS_PROMPT\prompts-loader.js"

@'
"use strict";
const $ = (id) => document.getElementById(id);
const el = {
  q: $("nv-q"), cat: $("nv-cat"), role: $("nv-role"), lang: $("nv-lang"),
  count: $("nv-count"), grid: $("nv-grid"), health: $("nv-health")
};
function uniq(arr){ return [...new Set(arr.filter(Boolean))]; }
function norm(s){ return String(s??"").toLowerCase().trim(); }
function buildOptions(selectEl, values){
  const keepAll = selectEl.value || "ALL";
  selectEl.innerHTML = `<option value="ALL">ALL</option>` + values.map(v=>`<option value="${v}">${v}</option>`).join("");
  selectEl.value = values.includes(keepAll) ? keepAll : "ALL";
}
function getFiltered(){
  const q = norm(el.q.value);
  const cat = el.cat.value || "ALL";
  const role = el.role.value || "ALL";
  const lang = el.lang.value || "all";
  const all = Array.isArray(window.NV_PROMPTS) ? window.NV_PROMPTS : [];
  return all.filter(p=>{
    if (!p) return false;
    if (cat !== "ALL" && p.category !== cat) return false;
    if (role !== "ALL" && p.role !== role) return false;
    if (q){
      const hay = [p.id,p.title,(p.tags||[]).join(" "),p.category,p.role,p.tr,p.en].map(norm).join(" | ");
      if (!hay.includes(q)) return false;
    }
    if (lang === "tr" && !p.tr) return false;
    if (lang === "en" && !p.en) return false;
    return true;
  });
}
function card(p){
  const tags = (p.tags||[]).map(t=>`#${t}`).join(" ");
  const safe = p.safeNote ? `<div class="muted">SafeNote: ${p.safeNote}</div>` : "";
  const tr = p.tr ? `<pre><b>TR</b>\n${p.tr}</pre>` : "";
  const en = p.en ? `<pre><b>EN</b>\n${p.en}</pre>` : "";
  return `
    <div class="card">
      <div><b>${p.title || p.id}</b></div>
      <div class="muted">ID: ${p.id} • ${p.category} • ${p.role}</div>
      <div class="muted">${tags}</div>
      ${safe}
      ${tr}
      ${en}
    </div>
  `;
}
function render(){
  const all = Array.isArray(window.NV_PROMPTS) ? window.NV_PROMPTS : [];
  buildOptions(el.cat, uniq(all.map(p=>p.category)).sort());
  buildOptions(el.role, uniq(all.map(p=>p.role)).sort());
  const list = getFiltered();
  el.count.textContent = String(list.length);
  el.grid.innerHTML = list.map(card).join("");
  const pe = window.__NV_PACK_ERRORS__ ? Object.keys(window.__NV_PACK_ERRORS__).length : 0;
  el.health.textContent = `packsLoaded=${!!window.__NV_PACKS_LOADED__} prompts=${all.length} packErrors=${pe}`;
}
["input","change"].forEach(evt=>{
  el.q.addEventListener(evt, render);
  el.cat.addEventListener(evt, render);
  el.role.addEventListener(evt, render);
  el.lang.addEventListener(evt, render);
});
document.addEventListener("nv:packs:loaded", render);
setTimeout(render, 250);
'@ | Set-Content -Encoding UTF8 ".\SANTIS_PROMPT\app.js"

@'
(() => {
  "use strict";
  window.NV_PROMPTS = Array.isArray(window.NV_PROMPTS) ? window.NV_PROMPTS : [];
  const P = [{
    id:"SAMPLE_01",
    title:"Sample Prompt Card",
    category:"Hamam Ritüelleri",
    role:"Therapist",
    tags:["sample","hamam","akış"],
    safeNote:"Fully draped. Non-medical. Non-sexual.",
    tr:"Bu bir örnek karttır. Gerçek pack.*.js dosyalarını SANTIS_PROMPT/packs/ içine koyduğunda otomatik görünecek.",
    en:"This is a sample card. Put real pack.*.js files into SANTIS_PROMPT/packs/ and they will appear automatically."
  }];
  const seen = new Set(window.NV_PROMPTS.map(x => x && x.id).filter(Boolean));
  for (const x of P) if (!seen.has(x.id)) window.NV_PROMPTS.push(x);
})();
'@ | Set-Content -Encoding UTF8 ".\SANTIS_PROMPT\packs\pack.sample.js"

# 2) Apply layout
if (!(Test-Path ".\tools\nv-apply-layout.ps1")) {
  throw "tools\\nv-apply-layout.ps1 not found. Create it first."
}
powershell -ExecutionPolicy Bypass -File .\tools\nv-apply-layout.ps1

# 3) Rewrite nav links
if (!(Test-Path ".\tools\nv-rewrite-site-links.js")) {
@'
const fs = require("fs");
const path = require("path");
const f = path.join(process.cwd(), "SANTIS_SITE", "nav.html");
if (!fs.existsSync(f)) { console.log("SKIP: SANTIS_SITE/nav.html not found"); process.exit(0); }
let t = fs.readFileSync(f, "utf8");
const pages = ["index.html","hamam.html","masajlar.html","kids-family.html","face-sothys.html","yoga.html","products.html","about.html","team.html","packages.html","nav.html"];
for (const p of pages) {
  const re = new RegExp("(href\\s*=\\s*[\\"'])(?:\\/)?(?:SANTIS_SITE\\/)?"+p+"([\\"'])", "gi");
  t = t.replace(re, "$1./"+p+"$2");
}
t = t.replace(/(src|href)\s*=\\s*[\\"']\\/SANTIS_SITE\\/(assets\\/[^\\"']+)[\\"']/gi, "$1=\"./$2\"");
fs.writeFileSync(f, t, "utf8");
console.log("OK: rewrote links in SANTIS_SITE/nav.html");
'@ | Set-Content -Encoding UTF8 ".\tools\nv-rewrite-site-links.js"
}
node .\tools\nv-rewrite-site-links.js

# 4) Rerun audit
node .\tools\nv-audit.js
Get-Content .\_audit\nv-audit.summary.txt

