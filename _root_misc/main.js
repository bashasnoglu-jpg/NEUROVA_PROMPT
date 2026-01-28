"use strict";

/*
 * ==================================================================
 * NEUROVA TAG NORMALIZE PATCH v1.0
 * ==================================================================
 * Bu fonksiyonlar, prompt kartlarının `tags` alanını
 * her zaman temiz, standart ve deterministik bir array'e dönüştürür.
 * Kural seti Hakan Bey tarafından sağlanmıştır.
 * ==================================================================
 */
function nvNormalizeTags(raw) {
    // 1) array'e çevir
    let arr = [];
    if (Array.isArray(raw)) arr = raw;
    else if (typeof raw === "string" && raw.trim()) arr = raw.split(/[\s,]+/); // "a b,c" -> ["a","b","c"]
    else if (raw != null) arr = [String(raw)];

    // 2) trim + lowercase
    arr = arr.map(t => String(t).trim().toLowerCase()).filter(Boolean);

    // 3) deterministik alias (hamam detox)
    const alias = (t) => {
        // boşluklu gelenleri tek forma çek
        if (t === "deniz" || t === "tuzu") return t; // tek başına gelirse dokunma
        if (t === "deniztuzu" || t === "deniz-tuzu" || t === "deniz tuzu") return "deniz_tuzu";
        if (t === "seasalt" || t === "sea-salt" || t === "sea salt") return "deniz_tuzu";

        if (t === "anti" || t === "cellulite") return t;
        if (t === "anti-cellulite" || t === "anticellulite" || t === "anti cellulite") return "anti_cellulite";

        if (t === "deep" || t === "tissue") return t;
        if (t === "deep-tissue" || t === "deeptissue" || t === "deep tissue") return "derin_doku";

        if (t === "arinma" || t === "arınma") return "detox"; // tek standarda çek
        if (t === "clean" || t === "cleanse") return "detox";

        if (t === "lymph" || t === "drainage" || t === "drene") return "lenf";

        if (t === "coffee") return "kahve";
        if (t === "alg" || t === "algae" || t === "yosun") return "algae";

        return t;
    };

    // 4) alias uygula + tekrarları sil
    const out = [];
    const seen = new Set();
    for (const t of arr.map(alias)) {
        if (!t) continue;
        if (seen.has(t)) continue;
        seen.add(t);
        out.push(t);
    }
    return out;
}

function nvNormalizePromptsTags(list) {
    if (!Array.isArray(list)) return list;
    return list.map(p => ({
        ...p,
        tags: nvNormalizeTags(p?.tags)
    }));
}
// ==================================================================


// Data fallback (prompts-data.js window.NV_PROMPTS basar)
window.NV_PROMPTS = window.NV_PROMPTS || window.PROMPTS || window.ALL_PROMPT_ARRAYS || [];

const gridEl = document.getElementById("nv-grid");
const searchEl = document.getElementById("nv-search");
const countEl = document.getElementById("nv-count");

const catChipsEl = document.getElementById("nv-cat-chips");
const roleChipsEl = document.getElementById("nv-role-chips");
const tagChipsEl = document.getElementById("nv-tag-chips");

const healthEl = document.getElementById("nv-health");

const state = { q: "", category: "ALL", role: "ALL", tag: "ALL" };

function esc(s) {
    return String(s ?? "").replace(/[&<>'"`]/g, (c) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", "`": "&#96;", '"': "&quot;"
    }[c]));
}
function normalize(s) { return (s || "").toString().toLowerCase().trim(); }
function uniqSorted(arr) {
    return Array.from(new Set(arr.filter(Boolean))).sort((a, b) => a.localeCompare(b, "tr"));
}
function downloadText(filename, mime, text) {
    const blob = new Blob([text], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 700);
}
function wrapCodeFence(text) {
    const str = String(text ?? "");
    const matches = str.match(/`+/g) || [];
    const longest = matches.reduce((max, curr) => Math.max(max, curr.length), 0);
    const fence = "`".repeat(Math.max(3, longest + 1));
    return `${fence}\n${str}\n${fence}`;
}
function buildMD(item) {
    const tags = Array.isArray(item.tags) ? item.tags : [];
    const trBlock = wrapCodeFence(item?.lang?.tr || "");
    const enBlock = wrapCodeFence(item?.lang?.en || "");
    return [
        `## ${item.title || "NEUROVA Prompt"}`,
        ``,
        item.id ? `**ID:** ${item.id}` : null,
        item.category ? `**Category:** ${item.category}` : null,
        item.role ? `**Role:** ${item.role}` : null,
        tags.length ? `**Tags:** ${tags.map((t) => `#${t}`).join(" ")}` : null,
        ``,
        `---`,
        ``,
        `### TR`,
        trBlock,
        ``,
        `### EN`,
        enBlock,
        ``
    ].filter(Boolean).join("\n");
}
function searchText(item) {
    const tags = Array.isArray(item.tags) ? item.tags.join(" ") : "";
    const tr = item?.lang?.tr || "";
    const en = item?.lang?.en || "";
    return normalize([item.id, item.category, item.role, item.title, tags, tr, en].join(" "));
}
function mkChip(text, value, group) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.textContent = text;
    btn.dataset.value = value;
    btn.dataset.group = group;
    return btn;
}
function setActiveChip(groupEl, value) {
    groupEl.querySelectorAll(".chip").forEach(ch => {
        ch.classList.toggle("is-on", ch.dataset.value === value);
    });
}
function renderChips(data) {
    const cats = uniqSorted(data.map(x => x.category));
    const roles = uniqSorted(data.map(x => x.role));
    const tags = uniqSorted(data.flatMap(x => Array.isArray(x.tags) ? x.tags : []));

    catChipsEl.innerHTML = "";
    roleChipsEl.innerHTML = "";
    tagChipsEl.innerHTML = "";

    catChipsEl.appendChild(mkChip("ALL", "ALL", "category"));
    cats.forEach(c => catChipsEl.appendChild(mkChip(c, c, "category")));

    roleChipsEl.appendChild(mkChip("ALL", "ALL", "role"));
    roles.forEach(r => roleChipsEl.appendChild(mkChip(r, r, "role")));

    tagChipsEl.appendChild(mkChip("ALL", "ALL", "tag"));
    tags.forEach(t => tagChipsEl.appendChild(mkChip("#" + t, t, "tag")));

    setActiveChip(catChipsEl, state.category);
    setActiveChip(roleChipsEl, state.role);
    setActiveChip(tagChipsEl, state.tag);
}
function renderCards(data) {
    gridEl.innerHTML = data.map(item => {
        const tags = Array.isArray(item.tags) ? item.tags : [];
        const tagsHTML = tags.map(t => `<span class="tag">#${esc(t)}</span>`).join("");

        return (
            `
      <div class="card"
           data-id="${esc(item.id)}"
           data-category="${esc(item.category)}"
           data-role="${esc(item.role)}"
           data-tags="${esc(tags.join(" "))}"
           data-search="${esc(searchText(item))}">
        <div class="meta">${esc(item.category)} • ${esc(item.role)} • ${esc(item.id)}</div>
        <h3 class="title">${esc(item.title)}</h3>

        <p class="p"><b>TR:</b> ${esc(item?.lang?.tr || "")}</p>
        <hr>
        <p class="p"><b>EN:</b> ${esc(item?.lang?.en || "")}</p>

        <div class="actions">
          <button class="btn btn--gold" data-export="json">JSON İndir</button>
          <button class="btn" data-export="md">MD İndir</button>
        </div>

        <div class="tags">${tagsHTML}</div>
      </div>
    `
        );
    }).join("");
}
function applyFilter() {
    const q = normalize(state.q);
    const cards = Array.from(document.querySelectorAll(".card"));
    let visible = 0;

    cards.forEach(card => {
        const cat = card.getAttribute("data-category") || "";
        const role = card.getAttribute("data-role") || "";
        const tags = card.getAttribute("data-tags") || "";
        const hay = normalize(card.getAttribute("data-search") || "");

        const okCat = (state.category === "ALL") || (cat === state.category);
        const okRole = (state.role === "ALL") || (role === state.role);
        const okTag = (state.tag === "ALL") || normalize(tags).includes(normalize(state.tag));
        const okQ = !q || hay.includes(q);

        const ok = okCat && okRole && okTag && okQ;
        card.style.display = ok ? "" : "none";
        if (ok) visible++;
    });

    if (countEl) countEl.textContent = `${visible}/${cards.length}`;
}
function initHealth(data) {
    const okData = Array.isArray(data) && data.length > 0;
    const hasLang = okData && data.every(x => x && x.lang && typeof x.lang.tr === "string" && typeof x.lang.en === "string");

    healthEl.innerHTML = (
        `
    <div><b>HEALTH</b></div>
    <div>NV_PROMPTS: <b class="${okData ? "ok" : "bad"}">${okData ? data.length : "YOK"}</b></div>
    <div>lang(tr/en): <b class="${hasLang ? "ok" : "bad"}">${hasLang ? "OK" : "Eksik"}</b></div>
    <div style="margin-top:6px;color:#666">F9: panel</div>
  `
    );

    document.addEventListener("keydown", (ev) => {
        if (ev.key === "F9") {
            ev.preventDefault();
            healthEl.style.display = (healthEl.style.display === "block") ? "none" : "block";
        }
    });
}

function init() {
    const data = Array.isArray(window.NV_PROMPTS) ? window.NV_PROMPTS : [];

    if (!gridEl || !searchEl || !catChipsEl || !roleChipsEl || !tagChipsEl || !healthEl) {
        console.error("DOM eksik: HTML id'leri uyuşmuyor.");
        return;
    }

    if (!data.length) {
        gridEl.innerHTML = (
            `
      <div class="card">
        <h3 class="title">Veri yok</h3>
        <p class="p">prompts-data.js yüklendi ama NV_PROMPTS boş/yanlış format.</p>
      </div>`
        );
        if (countEl) countEl.textContent = "0/0";
        initHealth(data);
        return;
    }

    renderChips(data);
    renderCards(data);
    applyFilter();
    initHealth(data);
}

// Events
searchEl?.addEventListener("input", () => {
    state.q = searchEl.value || "";
    applyFilter();
});

document.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (chip) {
        const group = chip.dataset.group;
        const val = chip.dataset.value;

        if (group === "category") state.category = val;
        if (group === "role") state.role = val;
        if (group === "tag") state.tag = val;

        if (group === "category") setActiveChip(catChipsEl, state.category);
        if (group === "role") setActiveChip(roleChipsEl, state.role);
        if (group === "tag") setActiveChip(tagChipsEl, state.tag);

        applyFilter();
        return;
    }

    const btn = e.target.closest("[data-export]");
    if (!btn) return;

    const card = btn.closest(".card");
    if (!card) return;

    const id = card.getAttribute("data-id");
    const mode = btn.getAttribute("data-export");

    const data = Array.isArray(window.NV_PROMPTS) ? window.NV_PROMPTS : [];
    const item = data.find(p => String(p.id) === String(id)) || null;
    if (!item) return;

    if (mode === "json") {
        downloadText(`neurova-prompt-${id}.json`, "application/json", JSON.stringify(item, null, 2));
    } else if (mode === "md") {
        downloadText(`neurova-prompt-${id}.md`, "text/markdown", buildMD(item));
    }
});


// Loader bittiğinde bu fonksiyonu çağıracak
window.nvOnPromptsReady = function () {
    console.log("PROMPTS READY: Tag normalizasyonu başlıyor...");
    // 1. TAG'LERİ NORMALIZE ET
    window.NV_PROMPTS = nvNormalizePromptsTags(window.NV_PROMPTS);

    // 2. SAYFAYI RENDER ET
    init();
    console.log("Normalizasyon ve render tamamlandı.");
};

window.init = init; // debug için
