import "./prompt-app.js"; "use strict";

// Safe globals
window.NV_PROMPTS = Array.isArray(window.NV_PROMPTS) ? window.NV_PROMPTS : [];

const $ = (id) => document.getElementById(id);

const el = {
    q: $("nv-q"),
    count: $("nv-count"),
    grid: $("nv-grid"),
    cat: $("nv-cat"),
    role: $("nv-role"),
    tag: $("nv-tag"),
};

const state = {
    q: "",
    category: "ALL",
    role: "ALL",
    tag: "ALL",
    lang: "all", // "tr" | "en" | "all"
};

function norm(s) {
    return String(s ?? "").toLowerCase().trim();
}

function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    }[c]));
}

function getLangText(p) {
    // Pack formatların farklı olabilir; en yaygınlarını destekleyelim:
    const tr = p?.tr?.text || p?.tr || p?.textTR || p?.text_tr;
    const en = p?.en?.text || p?.en || p?.textEN || p?.text_en;

    if (state.lang === "tr") return tr || "";
    if (state.lang === "en") return en || "";
    // all
    const a = tr ? `TR: ${tr}` : "";
    const b = en ? `EN: ${en}` : "";
    return [a, b].filter(Boolean).join("\n\n");
}

function matches(p) {
    const q = norm(state.q);
    const id = norm(p?.id);
    const title = norm(p?.title);
    const cat = String(p?.category || "ALL");
    const role = String(p?.role || "ALL");
    const tags = Array.isArray(p?.tags) ? p.tags.map(norm) : [];

    if (state.category !== "ALL" && cat !== state.category) return false;
    if (state.role !== "ALL" && role !== state.role) return false;
    if (state.tag !== "ALL" && !tags.includes(norm(state.tag))) return false;

    if (!q) return true;

    const text = norm(getLangText(p));
    return (
        id.includes(q) ||
        title.includes(q) ||
        text.includes(q) ||
        tags.some((t) => t.includes(q))
    );
}

function renderCard(p) {
    const text = getLangText(p);
    const tags = Array.isArray(p?.tags) ? p.tags : [];

    return `
  <article class="nv-card" data-id="${esc(p?.id || "")}">
    <header class="nv-card-h">
      <div class="nv-card-title">${esc(p?.title || p?.id || "Untitled")}</div>
      <div class="nv-card-meta">
        <span class="nv-pill">${esc(p?.category || "—")}</span>
        <span class="nv-pill">${esc(p?.role || "—")}</span>
      </div>
    </header>

    <pre class="nv-card-text">${esc(text || "")}</pre>

    ${tags.length ? `
      <div class="nv-tags">
        ${tags.map(t => `<span class="nv-tag">${esc(t)}</span>`).join("")}
      </div>` : ""
        }

    ${p?.safeNote ? `<div class="nv-safe">${esc(p.safeNote)}</div>` : ""}
  </article>`;
}

function fillSelect(selectEl, values) {
    if (!selectEl) return;
    const cur = selectEl.value || "ALL";
    selectEl.innerHTML = values.map(v => `<option value="${esc(v)}">${esc(v)}</option>`).join("");
    // restore
    const hasCur = values.includes(cur);
    selectEl.value = hasCur ? cur : "ALL";
}

function rebuildFacets(prompts) {
    const cats = ["ALL", ...Array.from(new Set(prompts.map(p => String(p?.category || "ALL")))).sort()];
    const roles = ["ALL", ...Array.from(new Set(prompts.map(p => String(p?.role || "ALL")))).sort()];

    const allTags = new Set();
    prompts.forEach(p => (Array.isArray(p?.tags) ? p.tags : []).forEach(t => allTags.add(String(t))));
    const tags = ["ALL", ...Array.from(allTags).sort()];

    fillSelect(el.cat, cats);
    fillSelect(el.role, roles);
    fillSelect(el.tag, tags);
}

function render() {
    const prompts = Array.isArray(window.NV_PROMPTS) ? window.NV_PROMPTS : [];
    const filtered = prompts.filter(matches);

    if (el.count) el.count.textContent = String(filtered.length);
    if (el.grid) el.grid.innerHTML = filtered.map(renderCard).join("");

    // ilk kez facet doldurma
    if (!render._facetsBuilt) {
        rebuildFacets(prompts);
        render._facetsBuilt = true;
    }
}

function bind() {
    if (el.q) el.q.addEventListener("input", (e) => { state.q = e.target.value; render(); });
    if (el.cat) el.cat.addEventListener("change", (e) => { state.category = e.target.value; render(); });
    if (el.role) el.role.addEventListener("change", (e) => { state.role = e.target.value; render(); });
    if (el.tag) el.tag.addEventListener("change", (e) => { state.tag = e.target.value; render(); });

    // Dil dropdown’unun id’si sende farklı olabilir:
    // Eğer HTML’de lang select varsa onu da bağla:
    const langSel =
        document.querySelector('[data-nv-lang]') ||
        document.getElementById("nv-lang") ||
        document.querySelector('select[name="nv-lang"]');
    if (langSel) {
        langSel.addEventListener("change", (e) => {
            const v = String(e.target.value || "all").toLowerCase();
            state.lang = (v === "tr" || v === "en") ? v : "all";
            render();
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    bind();
    render();
    // loader geç doldurursa: 1 kez daha dene
    setTimeout(render, 250);
});

