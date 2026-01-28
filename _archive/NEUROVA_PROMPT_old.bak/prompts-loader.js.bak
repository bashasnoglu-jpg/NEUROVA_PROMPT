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
