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
      <div class="muted">ID: ${p.id} â€¢ ${p.category} â€¢ ${p.role}</div>
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
