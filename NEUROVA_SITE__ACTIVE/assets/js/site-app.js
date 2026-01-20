"use strict";

/* =========================
   NEUROVA Prompt UI Ã¢â‚¬â€ app.js (RESET FINAL)
   ========================= */

// --- Safe globals ---
window.NV_PROMPTS = Array.isArray(window.NV_PROMPTS) ? window.NV_PROMPTS : [];
window.NV_PROMPT_PACKS =
    window.NV_PROMPT_PACKS && typeof window.NV_PROMPT_PACKS === "object"
        ? window.NV_PROMPT_PACKS
        : {};

// --- Prod-safe debug detection (uses helpers from prompt-export.js if present) ---
const PROD_SAFE_DEBUG_MODE = (() => {
    if (typeof window === "undefined") return false;
    if (typeof window.__NV_PROD_SAFE_DEBUG__ === "boolean") return window.__NV_PROD_SAFE_DEBUG__;

    const detector = window.__NV_PROD_SAFE_DEBUG_FN__;
    const computed = typeof detector === "function" ? detector() : false;
    window.__NV_PROD_SAFE_DEBUG__ = computed;
    return computed;
})();

// --- DOM helpers ---
const $ = (id) => document.getElementById(id);

const el = {
    q: $("nv-q"),
    count: $("nv-count"),
    grid: $("nv-grid"),
    cat: $("nv-cat"),
    role: $("nv-role"),
    tag: $("nv-tag"),
    health: $("nv-health"),
};

const state = { q: "", category: "ALL", role: "ALL", tag: "ALL", lang: "all" };

function normalize(s) {
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

function uniqSorted(arr) {
    return Array.from(new Set(arr.filter(Boolean))).sort((a, b) => a.localeCompare(b, "tr"));
}

function searchText(item) {
    const tags = Array.isArray(item?.tags) ? item.tags.join(" ") : "";
    const tr = item?.lang?.tr || "";
    const en = item?.lang?.en || "";
    return normalize([item?.id, item?.category, item?.role, item?.title, tags, tr, en].join(" "));
}

// --- NV Dedupe Policy v1.0 ---
// overwrite (default): last write wins, debug logs etc.
// ignore: keep the first occurrence.
try {
    const savedPolicy = localStorage.getItem("NV_DEDUPE_POLICY");
    if (savedPolicy) {
        window.__NV_DEDUPE_POLICY__ = savedPolicy;
    }
} catch (_) {}

function nvDedupePrompts(list, policy = "overwrite") {
    const seen = new Map();
    const dups = [];
    const counts = new Map();

    (Array.isArray(list) ? list : []).forEach((p) => {
        const id = String(p?.id ?? "").trim();
        if (!id) return;

        counts.set(id, (counts.get(id) || 0) + 1);

        if (!seen.has(id)) {
            seen.set(id, p);
        } else if (policy === "overwrite") {
            seen.set(id, p);
        }
    });

    counts.forEach((count, id) => {
        if (count > 1) {
            dups.push({ id, count });
        }
    });

    return { deduped: Array.from(seen.values()), dups };
}

function markActiveLang(btn) {
    document.querySelectorAll("[data-nv-lang]").forEach((b) => {
        b.classList.toggle("nv-btn--gold", b === btn);
    });
}

function mkChip(text, value, group) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = text;
    b.dataset.value = value;
    b.dataset.group = group;
    return b;
}

function setActiveChip(groupEl, value) {
    groupEl?.querySelectorAll(".chip").forEach((ch) => ch.classList.toggle("is-on", ch.dataset.value === value));
}

function nvOpenReservationFromCard(item) {
    if (typeof window.NV_OPEN_RESERVATION !== "function") return;

    const program = item?.title || item?.name || "NEUROVA Program";
    const category = item?.category || "";
    const role = item?.role || "";
    const tags = Array.isArray(item?.tags) ? item.tags.join(", ") : "";

    const noteLines = [
        category ? `Kategori: ${category}` : "",
        role ? `Role: ${role}` : "",
        tags ? `Tags: ${tags}` : "",
    ].filter(Boolean);

    const ref = item?.id ? `Ref: ${item.id}` : "";
    const source = "Source: NEUROVA Prompt Library";
    if (ref) noteLines.push(ref);
    if (source) noteLines.push(source);

    window.NV_OPEN_RESERVATION({
        program,
        note: noteLines.join("\n"),
    });
}

function renderChips(data) {
    const cats = uniqSorted(data.map((x) => x.category));
    const roles = uniqSorted(data.map((x) => x.role));
    const tags = uniqSorted(data.flatMap((x) => (Array.isArray(x.tags) ? x.tags : [])));

    el.cat.innerHTML = "";
    el.role.innerHTML = "";
    el.tag.innerHTML = "";

    el.cat.appendChild(mkChip("ALL", "ALL", "category"));
    cats.forEach((c) => el.cat.appendChild(mkChip(c, c, "category")));

    el.role.appendChild(mkChip("ALL", "ALL", "role"));
    roles.forEach((r) => el.role.appendChild(mkChip(r, r, "role")));

    el.tag.appendChild(mkChip("ALL", "ALL", "tag"));
    tags.forEach((t) => el.tag.appendChild(mkChip("#" + t, t, "tag")));

    setActiveChip(el.cat, state.category);
    setActiveChip(el.role, state.role);
    setActiveChip(el.tag, state.tag);
}

function renderCards(data) {
    el.grid.innerHTML = data
        .map((item) => {
            const tags = Array.isArray(item.tags) ? item.tags : [];
            const tagsHTML = tags.map((t) => `<span class="tag">#${esc(t)}</span>`).join("");
            const tr = item?.lang?.tr || "";
            const en = item?.lang?.en || "";

            // Kart iÃƒÂ§i export: debug prod-safe aÃƒÂ§Ã„Â±kken zaten kapalÃ„±.
            const exportActions = PROD_SAFE_DEBUG_MODE
                ? ""
                : `
  <div class="actions">
    <button class="btn btn--gold" data-export="json">JSON GÃƒ¶nder</button>
    <button class="btn" data-export="md">MD GÃƒ¶nder</button>
  </div>`;

            return `
<div class="card"
  data-id="${esc(item.id)}"
  data-category="${esc(item.category)}"
  data-role="${esc(item.role)}"
  data-tags="${esc(tags.join(" "))}"
  data-search="${esc(searchText(item))}">
  <div class="meta">${esc(item.category)} Ã¢â‚¬Â¢ ${esc(item.role)} Ã¢â‚¬Â¢ ${esc(item.id)}</div>
  <h3 class="title">${esc(item.title)}</h3>

  <p class="p"><b>TR:</b> ${esc(tr)}</p>
  <hr>
  <p class="p"><b>EN:</b> ${esc(en)}</p>

  ${exportActions}

  <div class="tags">${tagsHTML}</div>
  <div class="actions">
    <button class="btn btn--gold" type="button" data-nv-reserve="${esc(item.id)}">Rezervasyon</button>
  </div>
</div>`;
        })
    .join("");
}

if (!window.__NV_RES_CARD_WIRE__) {
    window.__NV_RES_CARD_WIRE__ = true;

    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-nv-reserve]");
        if (!btn) return;

        const id = btn.getAttribute("data-nv-reserve");
        if (!id) return;

        const item = (Array.isArray(window.NV_PROMPTS) ? window.NV_PROMPTS : []).find((p) => String(p.id) === String(id));
        if (!item) return;

        e.preventDefault();
        nvOpenReservationFromCard(item);
    });
}

function applyFilter() {
    const q = normalize(state.q);
    const cards = Array.from(document.querySelectorAll(".card"));
    let visible = 0;

    cards.forEach((card) => {
        const cat = card.getAttribute("data-category") || "";
        const role = card.getAttribute("data-role") || "";
        const tags = card.getAttribute("data-tags") || "";
        const hay = normalize(card.getAttribute("data-search") || "");

        const okCat = state.category === "ALL" ? true : cat === state.category;
        const okRole = state.role === "ALL" ? true : role === state.role;
        const okTag = state.tag === "ALL" ? true : normalize(tags).includes(normalize(state.tag));

        // dil filtresi
        const id = card.getAttribute("data-id");
        const prompt = Array.isArray(window.NV_PROMPTS)
            ? window.NV_PROMPTS.find((p) => String(p.id) === String(id))
            : null;

        const tr = normalize(prompt?.lang?.tr || "");
        const en = normalize(prompt?.lang?.en || "");
        const okLang = state.lang === "all" ? true : state.lang === "tr" ? !!tr : !!en;
        const trP = card.querySelector('p.p[data-lang="tr"]') || card.querySelectorAll("p.p")[0];
        const enP = card.querySelector('p.p[data-lang="en"]') || card.querySelectorAll("p.p")[1];
        const hr = card.querySelector("hr");

        if (trP && !trP.dataset.lang) trP.dataset.lang = "tr";
        if (enP && !enP.dataset.lang) enP.dataset.lang = "en";

        if (state.lang === "tr") {
            if (trP) trP.style.display = "";
            if (enP) enP.style.display = "none";
            if (hr) hr.style.display = "none";
        } else if (state.lang === "en") {
            if (trP) trP.style.display = "none";
            if (enP) enP.style.display = "";
            if (hr) hr.style.display = "none";
        } else {
            if (trP) trP.style.display = "";
            if (enP) enP.style.display = "";
            if (hr) hr.style.display = "";
        }

        const okQ = !q ? true : hay.includes(q);

        const ok = okCat && okRole && okTag && okLang && okQ;
        card.style.display = ok ? "" : "none";
        if (ok) visible++;
    });

    if (el.count) el.count.textContent = `${visible}/${cards.length}`;
}

function getVisibleItems() {
    const cards = Array.from(document.querySelectorAll(".card")).filter((c) => c.style.display !== "none");
    const ids = new Set(cards.map((c) => String(c.getAttribute("data-id"))));
    const data = Array.isArray(window.NV_PROMPTS) ? window.NV_PROMPTS : [];
    return data.filter((p) => ids.has(String(p.id)));
}

// Export helpers Ã¢â‚¬â€ prefer window helpers from prompt-export.js
function nvGetExportHelpers() {
    const dl = typeof window.nvDownloadText === "function" ? window.nvDownloadText : null;
    const md = typeof window.nvBuildMD === "function" ? window.nvBuildMD : null;
    return { dl, md };
}

function initUI(data) {
    if (!Array.isArray(data) || !data.length) {
        el.grid.innerHTML = `
      <div class="card">
        <h3 class="title">Veri yok</h3>
        <p class="p">Pack dosyalarÃ„Â± yÃƒÂ¼klenmedi veya iÃƒÂ§erik bulunamadÃ„±.</p>
      </div>`;
        if (el.count) el.count.textContent = "0/0";
        return;
    }

    renderChips(data);
    renderCards(data);
    applyFilter();
}

function wireEvents() {
    // search
    el.q?.addEventListener("input", () => {
        state.q = el.q.value || "";
        applyFilter();
    });

    // chips + lang
    document.addEventListener("click", (e) => {
        const langBtn = e.target.closest("[data-nv-lang]");
        if (langBtn) {
            state.lang = langBtn.getAttribute("data-nv-lang") || "all";
            markActiveLang(langBtn);
            applyFilter();
            return;
        }

        const chip = e.target.closest(".chip");
        if (chip) {
            const group = chip.dataset.group;
            const val = chip.dataset.value;

            if (group === "category") state.category = val;
            if (group === "role") state.role = val;
            if (group === "tag") state.tag = val;

            if (group === "category") setActiveChip(el.cat, state.category);
            if (group === "role") setActiveChip(el.role, state.role);
            if (group === "tag") setActiveChip(el.tag, state.tag);

            applyFilter();
            return;
        }

        // single-card export
        const btn = e.target.closest("[data-export]");
        if (!btn) return;

        const { dl, md } = nvGetExportHelpers();
        if (!dl || !md) return console.warn("Export helpers missing (nvDownloadText/nvBuildMD).");

        const mode = btn.dataset.export; // json | md
        const card = btn.closest(".card");
        if (!card) return;

        const id = card.getAttribute("data-id");
        const data = Array.isArray(window.NV_PROMPTS) ? window.NV_PROMPTS : [];
        const item = data.find((p) => String(p.id) === String(id));
        if (!item) return;

        if (mode === "json") {
            dl(`neurova-prompt-${id}.json`, "application/json", JSON.stringify(item, null, 2));
        } else {
            dl(`neurova-prompt-${id}.md`, "text/markdown", md(item));
        }
    });

    // visible export Ã¢â‚¬â€ always uses window helpers
    const visibleMdBtn = document.getElementById("nv-export-visible-md");
    const visibleJsonBtn = document.getElementById("nv-export-visible-json");

    visibleMdBtn?.addEventListener("click", () => {
        const items = getVisibleItems();
        const { dl, md } = nvGetExportHelpers();
        if (!dl || !md) return console.warn("Export helpers missing (nvDownloadText/nvBuildMD).");
        const out = items.map(md).join("\n\n---\n\n");
        dl("neurova-visible-prompts.md", "text/markdown", out);
    });

    visibleJsonBtn?.addEventListener("click", () => {
        const items = getVisibleItems();
        const { dl } = nvGetExportHelpers();
        if (!dl) return console.warn("Export helper missing (nvDownloadText).");
        dl("neurova-visible-prompts.json", "application/json", JSON.stringify(items, null, 2));
    });
}

// Loader callback: packs yÃƒÂ¼klenince burasÃ„Â± ÃƒÂ§alÃ„Â±Ã…Å¸Ã„±r
window.nvOnPromptsReady = function (merged) {
    const policy = window.__NV_DEDUPE_POLICY__ || "overwrite";
    const { deduped, dups } = nvDedupePrompts(merged, policy);

    if (dups.length) {
        const isDebug =
            new URLSearchParams(location.search).get("debug") === "1" ||
            localStorage.getItem("NV_DEBUG") === "1";
        if (isDebug) {
            console.warn("NV_DEDUPE:", { policy, duplicates: dups });
        } else {
            console.warn(`NV_DEDUPE: ${dups.length} duplicate id(s) detected (policy=${policy}).`);
        }
        window.__NV_DEDUPE__ = { policy, duplicates: dups };
    } else {
        window.__NV_DEDUPE__ = { policy, duplicates: [] };
    }

    window.NV_PROMPTS = Array.isArray(deduped)
        ? deduped
        : Array.isArray(window.NV_PROMPTS)
            ? window.NV_PROMPTS
            : [];

    // health panel init
    try {
        if (typeof window.nvInitHealth === "function") {
            window.nvInitHealth(window.NV_PROMPTS);
        }
    } catch (e) {
        console.warn("nvInitHealth failed:", e);
    }

    initUI(window.NV_PROMPTS);
};

// --- Bootstrapping: loader app.jsÃ¢â‚¬â„¢den ÃƒÂ¶nce callbackÃ¢â‚¬â„¢i tetiklediyse yakala ---
(function nvConsumePendingPrompts() {
    try {
        const pending = window.__NV_PENDING_PROMPTS__;
        if (pending && typeof window.nvOnPromptsReady === "function") {
            window.__NV_PENDING_PROMPTS__ = null;
            window.nvOnPromptsReady(pending);
            console.log("NV_BOOTSTRAP: consumed pending prompts");
        } else {
            const hasPrompts = Array.isArray(window.NV_PROMPTS) && window.NV_PROMPTS.length > 0;
            const gridEmpty = !document.getElementById("nv-grid")?.children?.length;
            if (hasPrompts && gridEmpty) {
                initUI(window.NV_PROMPTS);
                console.log("NV_BOOTSTRAP: initUI from existing NV_PROMPTS");
            }
        }
    } catch (e) {
        console.warn("NV_BOOTSTRAP failed:", e);
    }
})();

// Boot
wireEvents();

// EÃ„Å¸er loader packÃ¢â‚¬â„¢leri otomatik yÃƒÂ¼klemiyorsa burada ÃƒÂ§aÃ„Å¸Ã„±r:
const sitePackList = Array.isArray(window.NV_SITE_PACK_LIST) ? window.NV_SITE_PACK_LIST : [];
if (typeof window.nvLoadPromptPacks === "function" && sitePackList.length) {
    window.nvLoadPromptPacks(sitePackList).catch((err) => {
        console.error("nvLoadPromptPacks failed:", err);
    });
}

// --- NV UI Fail-safe Render v1.0 ---
