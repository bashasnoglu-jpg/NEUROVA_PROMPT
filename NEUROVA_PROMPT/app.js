"use strict";

/* =========================
   NEUROVA Prompt UI — app.js (RESET FINAL)
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

function requireDom(keys) {
    const missing = keys.filter((key) => !el[key]);
    if (missing.length) {
        console.warn(`[NV] Missing DOM element(s): ${missing.join(", ")}`);
        return false;
    }
    return true;
}

const PAGE_LANG = (document.documentElement.lang || "tr")
    .toLowerCase()
    .startsWith("en")
    ? "en"
    : "tr";
const LS_KEY = `nvPromptFilterState_${PAGE_LANG}`;

try {
    const legacy = localStorage.getItem("nvPromptFilterState");
    if (legacy && !localStorage.getItem(LS_KEY)) {
        localStorage.setItem(LS_KEY, legacy);
    }
} catch (_) {}

function readFilterState() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") return {};
        const lang = ["all", "tr", "en"].includes(parsed.lang) ? parsed.lang : "all";
        return {
            q: typeof parsed.q === "string" ? parsed.q : "",
            category: typeof parsed.category === "string" ? parsed.category : "ALL",
            role: typeof parsed.role === "string" ? parsed.role : "ALL",
            tag: typeof parsed.tag === "string" ? parsed.tag : "ALL",
            lang,
            kidsMode: !!parsed.kidsMode,
        };
    } catch (_) {
        return {};
    }
}

function persistFilterState() {
    try {
        localStorage.setItem(
            LS_KEY,
            JSON.stringify({
                q: state.q,
                category: state.category,
                role: state.role,
                tag: state.tag,
                lang: state.lang,
                kidsMode: state.kidsMode,
            })
        );
    } catch (_) {}
}

const DEFAULT_STATE = { q: "", category: "ALL", role: "ALL", tag: "ALL", lang: "all", kidsMode: false };
const state = { ...DEFAULT_STATE, ...readFilterState() };
const QA_MODE = new URLSearchParams(location.search || "").get("qa") === "1";

let toastHost = null;
let toastDomReadyHooked = false;

function ensureToastElements() {
    if (toastHost) return toastHost;
    if (!document.body || !document.head) {
        if (!toastDomReadyHooked) {
            toastDomReadyHooked = true;
            document.addEventListener(
                "DOMContentLoaded",
                () => {
                    toastDomReadyHooked = false;
                    ensureToastElements();
                },
                { once: true }
            );
        }
        return null;
    }

    let host = document.getElementById("nv-toast");
    if (!host) {
        host = document.createElement("div");
        host.id = "nv-toast";
        host.style.position = "fixed";
        host.style.right = "12px";
        host.style.bottom = "12px";
        host.style.zIndex = "100000";
        host.style.display = "flex";
        host.style.flexDirection = "column";
        host.style.gap = "8px";
        document.body.appendChild(host);
    }

    if (!document.getElementById("nv-toast-style")) {
        const st = document.createElement("style");
        st.id = "nv-toast-style";
        st.textContent = `
            #nv-toast .nv-toast-item {
                background: #111;
                color: #fff;
                padding: 10px 12px;
                border-radius: 10px;
                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.22);
                font-size: 13px;
                line-height: 1.35;
                opacity: 0;
                transform: translateY(6px);
                transition: opacity .16s ease, transform .16s ease;
            }
            #nv-toast .nv-toast-error { background: #b00020; }
            #nv-toast .nv-toast-ok { background: #0a7a2f; }
            #nv-toast .nv-toast-info { background: #111; }
        `;
        document.head.appendChild(st);
    }

    toastHost = host;
    return host;
}

function nvToast(msg, variant = "info") {
    const host = ensureToastElements();
    if (!host) {
        document.addEventListener("DOMContentLoaded", () => nvToast(msg, variant));
        return;
    }
    const item = document.createElement("div");
    item.className = `nv-toast-item nv-toast-${variant}`;
    item.textContent = msg;
    host.appendChild(item);

    requestAnimationFrame(() => {
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
    });

    setTimeout(() => {
        item.style.opacity = "0";
        item.style.transform = "translateY(-6px)";
        setTimeout(() => item.remove(), 220);
    }, 4000);
}

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
    if (!requireDom(["cat", "role", "tag"])) {
        nvToast("NV UI: filtre düğmeleri DOM'da yok, chip'ler oluşturulmadı.", "info");
        return;
    }
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

function syncStateToUI() {
    if (el.q) el.q.value = state.q || "";

    const langBtn = document.querySelector(`[data-nv-lang="${state.lang}"]`);
    if (langBtn) markActiveLang(langBtn);

    const kidsToggleBtn = document.getElementById("nv-kids-toggle");
    if (kidsToggleBtn) {
        kidsToggleBtn.classList.toggle("nv-btn--gold", state.kidsMode);
        kidsToggleBtn.textContent = state.kidsMode ? "Kids Mode (ON)" : "Kids Mode";
    }
}

function renderCards(data) {
    if (!requireDom(["grid"])) {
        nvToast("NV UI: kartları yerleştirecek grid #nv-grid bulunamadı.", "error");
        return;
    }
    el.grid.innerHTML = data
        .map((item) => {
            const tags = Array.isArray(item.tags) ? item.tags : [];
            const tagsHTML = tags.map((t) => `<span class="tag">#${esc(t)}</span>`).join("");
            const tr = item?.lang?.tr || "";
            const en = item?.lang?.en || "";

            // Kart içi export: debug prod-safe açıkken zaten kapalı.
            const exportActions = PROD_SAFE_DEBUG_MODE
                ? ""
                : `
  <div class="actions">
    <button class="btn btn--gold" data-export="json">JSON Gönder</button>
    <button class="btn" data-export="md">MD Gönder</button>
  </div>`;

            return `
<div class="card"
  data-id="${esc(item.id)}"
  data-category="${esc(item.category)}"
  data-role="${esc(item.role)}"
  data-kids-only="${item.kidsOnly ? "true" : "false"}"
  data-tags="${esc(tags.join(" "))}"
  data-search="${esc(searchText(item))}">
  <div class="meta">${esc(item.category)} • ${esc(item.role)} • ${esc(item.id)}</div>
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
        const isKidsOnly = card.getAttribute("data-kids-only") === "true";
        const okKids = state.kidsMode || !isKidsOnly;

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

        const ok = okCat && okRole && okTag && okLang && okQ && okKids;
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

function buildPrintHtml(items) {
    const cards = items.map((item) => {
        const tags = Array.isArray(item.tags) ? item.tags : [];
        const tagsHtml = tags.map((tag) => `<span>${esc(tag)}</span>`).join(" ");
        const promptBody = item.prompt || item.lang?.en || item.lang?.tr || "";
        const safeNote = item.safeNote ? `<p class="safe-note">${esc(item.safeNote)}</p>` : "";
        return `
    <article class="nv-print-card">
      <header>
        <div class="card-metadata">${esc(item.category)} · ${esc(item.role)} · ${esc(item.id)}</div>
        <h2>${esc(item.title || "NEUROVA Prompt")}</h2>
        ${safeNote}
        <div class="card-tags">${tagsHtml}</div>
      </header>
      <section class="card-prompt">
        <p>${esc(promptBody)}</p>
      </section>
      <section class="card-lang">
        <div>
          <strong>TR</strong>
          <pre>${esc(item.lang?.tr || "")}</pre>
        </div>
        <div>
          <strong>EN</strong>
          <pre>${esc(item.lang?.en || "")}</pre>
        </div>
      </section>
    </article>`;
    }).join("\n");

    const refText = "Quiet luxury, marble planes, gentle steam, explicit consent and safeNote clarity.";
    const generatedAt = new Date().toLocaleString("tr-TR");
    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>NEUROVA Prompt Print</title>
  <style>
    :root {
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      color: #111;
    }
    body {
      margin: 0;
      background: #f4f4f4;
      padding: 24px;
    }
    .nv-print-main {
      max-width: 960px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .nv-print-header,
    .nv-print-footer {
      background: #fff;
      border-radius: 14px;
      padding: 18px 22px;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
    }
    .nv-print-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }
    .nv-print-brand {
      font-weight: 700;
      font-size: 18px;
      letter-spacing: 0.2em;
    }
    .nv-print-ref {
      font-size: 12px;
      color: #555;
      flex: 1;
    }
    .nv-print-card {
      background: #fff;
      padding: 20px 24px;
      border-radius: 16px;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.07);
      page-break-inside: avoid;
    }
    .nv-print-card h2 {
      margin: 0 0 6px;
      font-size: 20px;
    }
    .card-metadata {
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #666;
      margin-bottom: 6px;
    }
    .card-tags {
      margin-top: 8px;
      font-size: 11px;
      color: #555;
    }
    .card-tags span {
      display: inline-block;
      background: #f0f0f0;
      padding: 4px 10px;
      border-radius: 999px;
      margin-right: 4px;
    }
    .card-prompt p {
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
    }
    .card-lang {
      margin-top: 14px;
      display: grid;
      gap: 10px;
    }
    .card-lang div {
      background: #fafafa;
      padding: 10px;
      border-radius: 10px;
    }
    .card-lang pre {
      margin: 6px 0 0;
      font-size: 13px;
      line-height: 1.5;
      white-space: pre-wrap;
    }
    .safe-note {
      margin: 6px 0;
      font-size: 12px;
      color: #0b6b2f;
      font-weight: 600;
    }
    @media print {
      body {
        padding: 18px;
      }
      .nv-print-card {
        box-shadow: none;
        border: 1px solid #ececec;
      }
      .nv-print-header,
      .nv-print-footer {
        box-shadow: none;
        border: 1px solid #ececec;
      }
    }
  </style>
</head>

<body>
  <main class="nv-print-main">
    <header class="nv-print-header">
      <div class="nv-print-brand">NEUROVA Prompt Print</div>
      <div class="nv-print-ref">${esc(refText)}</div>
      <div class="nv-print-meta">${generatedAt}</div>
    </header>
    ${cards}
    <footer class="nv-print-footer">
      <div>Cards: ${items.length}</div>
      <div>Generated: ${generatedAt}</div>
    </footer>
  </main>
</body>
</html>`;
}function openPrintPanel(items) {
    const win = window.open("", "_blank", "width=900,height=1100");
    if (!win) {
        nvToast("Pop-up blocked. Allow pop-ups to print.", "warn");
        return;
    }
    win.document.write(buildPrintHtml(items));
    win.document.close();
    win.focus();
}

// Export helpers — prefer window helpers from prompt-export.js
function nvGetExportHelpers() {
    const dl = typeof window.nvDownloadText === "function" ? window.nvDownloadText : null;
    const md = typeof window.nvBuildMD === "function" ? window.nvBuildMD : null;
    return { dl, md };
}

function initUI(data) {
    if (!el.grid) {
        console.warn("[NV] Navigasyon grid (#nv-grid) DOM'da yok, render kapatıldı.");
        return;
    }
    if (!Array.isArray(data) || !data.length) {
        el.grid.innerHTML = `
      <div class="card">
        <h3 class="title">Veri yok</h3>
        <p class="p">Pack dosyaları yüklenmedi veya içerik bulunamadı.</p>
      </div>`;
        if (el.count) el.count.textContent = "0/0";
        return;
    }

    renderChips(data);
    renderCards(data);
    syncStateToUI();
    applyFilter();
}

function wireEvents() {
    // search
    el.q?.addEventListener("input", () => {
        state.q = el.q.value || "";
        persistFilterState();
        applyFilter();
    });

    // chips + lang
    document.addEventListener("click", (e) => {
        const langBtn = e.target.closest("[data-nv-lang]");
        if (langBtn) {
            state.lang = langBtn.getAttribute("data-nv-lang") || "all";
            markActiveLang(langBtn);
            persistFilterState();
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

            persistFilterState();
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

    // visible export — always uses window helpers
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

    const kidsToggleBtn = document.getElementById("nv-kids-toggle");
    kidsToggleBtn?.addEventListener("click", () => {
        state.kidsMode = !state.kidsMode;
        kidsToggleBtn.classList.toggle("nv-btn--gold", state.kidsMode);
        kidsToggleBtn.textContent = state.kidsMode ? "Kids Mode (ON)" : "Kids Mode";
        persistFilterState();
        applyFilter();
    });

    const printPanelBtn = document.getElementById("nv-print-visible");
    printPanelBtn?.addEventListener("click", () => {
        const items = getVisibleItems();
        if (!items.length) {
            nvToast("No cards visible to print.", "info");
            return;
        }
        openPrintPanel(items);
    });
}

// Loader callback: packs yüklenince burası çalışır
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

// --- Bootstrapping: loader app.js’den önce callback’i tetiklediyse yakala ---
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

// Eğer loader pack’leri otomatik yüklemiyorsa burada çağır:
if (typeof window.nvLoadPromptPacks === "function" && Array.isArray(window.NV_PACK_LIST) && window.NV_PACK_LIST.length) {
    window.nvLoadPromptPacks(window.NV_PACK_LIST).catch((err) => {
        console.error("nvLoadPromptPacks failed:", err);
    });
}

window.addEventListener("nv:packErrors", (evt) => {
    const errors = (evt && evt.detail && evt.detail.errors) || {};
    const names = Object.keys(errors);
    if (!names.length) return;
    const preview = names.slice(0, 3).join(", ");
    nvToast(`Pack yüklenemedi (${names.length}): ${preview}`, "error");
});

window.addEventListener("nv:packErrors:clear", () => {
    if (!QA_MODE) return;
    nvToast("Pack yüklemeleri tamam", "ok");
});

// Tag toggle + debug trigger
(function NV_TAGS_TOGGLE() {
    const btn = document.getElementById("nvToggleTags");
    const wrap = document.getElementById("nvTagsWrap");
    const debugBtn = document.getElementById("nv-run-selftest");

    function updateTagLabel(collapsed) {
        if (!btn) return;
        btn.textContent = collapsed ? "Tag’ler" : "Tag’leri Kapat";
    }

    if (btn && wrap) {
        const collapsed = wrap.classList.contains("isCollapsed");
        updateTagLabel(collapsed);
        btn.addEventListener("click", () => {
            const next = wrap.classList.toggle("isCollapsed");
            updateTagLabel(next);
        });
    }

    if (debugBtn) {
        debugBtn.addEventListener("click", () => {
            if (typeof window.NV_RUN_SELFTEST === "function") {
                const res = window.NV_RUN_SELFTEST();
                if (res && res.ok) {
                    nvToast("Selftest: OK", "ok");
                } else {
                    nvToast("Selftest fail", "warn");
                }
            } else {
                nvToast("Selftest fonksiyonu bulunamadı", "warn");
            }
        });
    }
})();

// --- NV UI Fail-safe Render v1.0 ---
