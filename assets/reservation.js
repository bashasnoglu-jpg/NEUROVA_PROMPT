(function () {
  "use strict";

  // If a real handler already exists, do nothing (safe for future upgrades)
  if (typeof window.NV_OPEN_RESERVATION === "function" && window.__NV_RESERVATION_V11__) return;

  window.__NV_RESERVATION_V11__ = true;
  window.NV_ON_RESERVATION_OPEN = window.NV_ON_RESERVATION_OPEN || function () {};
  window.NV_ON_RESERVATION_EVENT = window.NV_ON_RESERVATION_EVENT || function () {};

  const DEFAULTS = {
    brand: "NEUROVA",
    phoneE164: "", // ör: "905551112233" (başında + yok)
    defaultMsgTR:
      "Merhaba NEUROVA, rezervasyon yapmak istiyorum.\n" +
      "Tarih: \nSaat: \nKişi sayısı: \nProgram: \nNot: ",
    defaultMsgEN:
      "Hello NEUROVA, I’d like to make a reservation.\n" +
      "Date: \nTime: \nGuests: \nProgram: \nNote: ",
  };

  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[c]));
  }

  function getConfig() {
    // Opsiyonel: window.NV_RESERVATION_CONFIG ile override edilebilir
    const cfg = (window.NV_RESERVATION_CONFIG && typeof window.NV_RESERVATION_CONFIG === "object")
      ? window.NV_RESERVATION_CONFIG
      : {};
    const result = {
      ...DEFAULTS,
      ...cfg,
    };
    if (location.search.includes("debug=1") && !window.__NV_RES_CONFIG_LOGGED__) {
      console.log("[NV] Reservation v1.1 config phoneE164:", result.phoneE164 || "(empty)");
      window.__NV_RES_CONFIG_LOGGED__ = true;
    }
    return result;
  }

  function buildWAUrl(phoneE164, text) {
    const msg = encodeURIComponent(text || "");
    // phone boşsa sadece wa.me açar, ama ideal olan phone set etmek.
    if (phoneE164) return `https://wa.me/${phoneE164}?text=${msg}`;
    return `https://wa.me/?text=${msg}`;
  }

  function sendReservationEvent(type, eventPayload = {}) {
    if (!type) return;
    const event = { type, ...eventPayload };
    try {
      window.NV_ON_RESERVATION_EVENT(event);
    } catch (_) {}
  }

  function ensureModal() {
    if (document.getElementById("nv-reservation-overlay")) return;

    const style = document.createElement("style");
    style.id = "nv-reservation-style";
    style.textContent = `
      :root{
        --nv-ink:#1f1f1f; --nv-muted:#777; --nv-line:#e9e9e9; --nv-bg:rgba(0,0,0,.45);
        --nv-card:#fff; --nv-r:16px; --nv-shadow:0 18px 60px rgba(0,0,0,.18);
        --nv-gold:#d4af37;
      }
      html.nv-modal-open, body.nv-modal-open{ overflow:hidden; }
      #nv-reservation-overlay{
        position:fixed; inset:0; background:var(--nv-bg);
        display:none; align-items:center; justify-content:center;
        padding:18px; z-index:9999;
      }
      #nv-reservation-overlay.is-open{ display:flex; }
      .nv-res-card{
        width:min(920px, 100%);
        background:var(--nv-card);
        border-radius:24px;
        box-shadow:var(--nv-shadow);
        overflow:hidden;
      }
      .nv-res-head{
        display:flex; align-items:center; justify-content:space-between;
        padding:18px 18px 14px;
        border-bottom:1px solid var(--nv-line);
      }
      .nv-res-title{
        display:flex; gap:10px; align-items:baseline;
      }
      .nv-res-title h3{ margin:0; font-size:16px; letter-spacing:.2px; }
      .nv-res-title .sub{ color:var(--nv-muted); font-size:12px; }
      .nv-res-close{
        border:1px solid var(--nv-line);
        background:#fff;
        border-radius:12px;
        padding:8px 10px;
        cursor:pointer;
      }
      .nv-res-body{
        display:grid;
        grid-template-columns: 1.1fr .9fr;
        gap:0;
      }
      @media (max-width: 820px){
        .nv-res-body{ grid-template-columns:1fr; }
      }
      .nv-res-pane{
        padding:16px 18px;
      }
      .nv-res-pane + .nv-res-pane{
        border-left:1px solid var(--nv-line);
      }
      @media (max-width: 820px){
        .nv-res-pane + .nv-res-pane{ border-left:none; border-top:1px solid var(--nv-line); }
      }
      .nv-res-grid{
        display:grid; grid-template-columns:1fr 1fr; gap:10px;
      }
      @media (max-width: 520px){ .nv-res-grid{ grid-template-columns:1fr; } }
      .nv-field label{
        display:block; font-size:12px; color:var(--nv-muted); margin-bottom:6px;
      }
      .nv-field input, .nv-field select, .nv-field textarea{
        width:100%;
        border:1px solid var(--nv-line);
        border-radius:12px;
        padding:10px 12px;
        font: inherit;
        outline:none;
      }
      .nv-field textarea{ min-height:120px; resize:vertical; }
      .nv-row{ display:flex; gap:10px; align-items:center; }
      .nv-chip{
        display:inline-flex; align-items:center; gap:8px;
        border:1px solid var(--nv-line);
        background:#fff;
        border-radius:999px;
        padding:8px 10px;
        cursor:pointer;
        font-size:12px;
      }
      .nv-chip.is-on{
        border-color:rgba(212,175,55,.55);
        box-shadow:0 0 0 3px rgba(212,175,55,.18);
      }
      .nv-actions{
        display:flex; gap:10px; flex-wrap:wrap;
        margin-top:12px;
      }
      .nv-btn{
        border:1px solid var(--nv-line);
        background:#fff;
        border-radius:14px;
        padding:10px 12px;
        cursor:pointer;
        font-weight:600;
      }
      .nv-btn.primary{
        border-color:rgba(212,175,55,.65);
        background:linear-gradient(180deg, #fff, #fff7df);
      }
      .nv-mini{
        font-size:12px; color:var(--nv-muted); line-height:1.4;
      }
      .nv-kv{
        display:flex; flex-direction:column; gap:6px;
        padding:12px;
        border:1px dashed rgba(212,175,55,.55);
        border-radius:16px;
        background:rgba(212,175,55,.06);
      }
      .nv-kv b{ font-size:12px; }
      .nv-kv span{ font-size:12px; color:var(--nv-muted); }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement("div");
    overlay.id = "nv-reservation-overlay";
    overlay.innerHTML = `
      <div class="nv-res-card" role="dialog" aria-modal="true" aria-label="Reservation">
        <div class="nv-res-head">
          <div class="nv-res-title">
            <h3>Rezervasyon</h3>
            <span class="sub">WhatsApp ile hızlı onay</span>
          </div>
          <button class="nv-res-close" type="button" data-nv-res-close>✕</button>
        </div>

        <div class="nv-res-body">
          <div class="nv-res-pane">
            <div class="nv-res-grid">
              <div class="nv-field">
                <label>Ad Soyad</label>
                <input id="nv-res-name" autocomplete="name" placeholder="Adınız" />
              </div>
              <div class="nv-field">
                <label>Telefon (opsiyonel)</label>
                <input id="nv-res-phone" autocomplete="tel" placeholder="+90…" />
              </div>
              <div class="nv-field">
                <label>Tarih</label>
                <input id="nv-res-date" type="date" />
              </div>
              <div class="nv-field">
                <label>Saat</label>
                <input id="nv-res-time" type="time" />
              </div>
              <div class="nv-field">
                <label>Kişi</label>
                <select id="nv-res-guests">
                  ${[1,2,3,4,5,6].map(n=>`<option value="${n}">${n}</option>`).join("")}
                </select>
              </div>
              <div class="nv-field">
                <label>Dil</label>
                <div class="nv-row">
                  <button class="nv-chip is-on" type="button" data-nv-lang="tr">TR</button>
                  <button class="nv-chip" type="button" data-nv-lang="en">EN</button>
                </div>
              </div>
            </div>

            <div class="nv-field" style="margin-top:10px;">
              <label>Program / Not</label>
              <textarea id="nv-res-note" placeholder="İstediğiniz program veya özel not..."></textarea>
            </div>

            <div class="nv-actions">
              <button class="nv-btn primary" type="button" data-nv-wa>WhatsApp ile Gönder</button>
              <button class="nv-btn" type="button" data-nv-copy>Mesajı Kopyala</button>
              <button class="nv-btn" type="button" data-nv-res-close>Kapat</button>
            </div>

            <p class="nv-mini" style="margin:10px 0 0;">
              Not: Bu modal, gerçek rezervasyon sistemi gelene kadar “WhatsApp akışı” ile çalışır.
            </p>
          </div>

          <div class="nv-res-pane">
            <div class="nv-kv">
              <b>Gönderilecek mesaj önizleme</b>
              <span id="nv-res-preview"></span>
            </div>
            <div style="height:10px"></div>
            <p class="nv-mini">
              WhatsApp düğmesi yeni sekmede açılır. İstersen mesajı kopyalayıp WhatsApp’a yapıştırabilirsin.
            </p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Close handlers
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
    overlay.querySelectorAll("[data-nv-res-close]").forEach(btn => {
      btn.addEventListener("click", closeModal);
    });

    // Lang chips
    overlay.querySelectorAll("[data-nv-lang]").forEach(btn => {
      btn.addEventListener("click", () => {
        overlay.querySelectorAll("[data-nv-lang]").forEach(b => b.classList.remove("is-on"));
        btn.classList.add("is-on");
        updatePreview();
      });
    });

    // Live preview updates
    ["nv-res-name","nv-res-phone","nv-res-date","nv-res-time","nv-res-guests","nv-res-note"].forEach(id=>{
      const el = document.getElementById(id);
      el.addEventListener("input", updatePreview);
      el.addEventListener("change", updatePreview);
    });

    // Actions
    overlay.querySelector("[data-nv-copy]").addEventListener("click", async () => {
      const msg = buildMessage();
      try {
        await navigator.clipboard.writeText(msg);
        toast("Kopyalandı ✅");
      } catch {
        // fallback
        const ta = document.getElementById("nv-res-note");
        ta.value = msg;
        ta.focus();
        ta.select();
        toast("Clipboard izin yok — mesaj seçildi.");
      }
      const note = (document.getElementById("nv-res-note").value || "").trim();
      sendReservationEvent("copy", {
        payload: {
          message: msg,
          note,
          method: "clipboard",
        },
      });
    });

    overlay.querySelector("[data-nv-wa]").addEventListener("click", () => {
      const cfg = getConfig();
      const msg = buildMessage();
      const url = buildWAUrl(cfg.phoneE164, msg);
      window.open(url, "_blank", "noopener,noreferrer");
      const note = (document.getElementById("nv-res-note").value || "").trim();
      sendReservationEvent("wa_send", {
        payload: {
          message: msg,
          note,
          url,
          phone: cfg.phoneE164 || "",
        },
      });
    });

    function toast(text){
      // minimal inline toast
      const t = document.createElement("div");
      t.textContent = text;
      t.style.cssText = "position:fixed;left:50%;bottom:18px;transform:translateX(-50%);background:#111;color:#fff;padding:10px 12px;border-radius:12px;font-size:12px;z-index:10000;opacity:.95";
      document.body.appendChild(t);
      setTimeout(()=>t.remove(), 1600);
    }

    function getLang() {
      const on = overlay.querySelector("[data-nv-lang].is-on");
      return (on && on.getAttribute("data-nv-lang")) || "tr";
    }

    function buildMessage() {
      const cfg = getConfig();
      const lang = getLang();
      const name = (document.getElementById("nv-res-name").value || "").trim();
      const phone = (document.getElementById("nv-res-phone").value || "").trim();
      const date = document.getElementById("nv-res-date").value;
      const time = document.getElementById("nv-res-time").value;
      const guests = document.getElementById("nv-res-guests").value;
      const note = (document.getElementById("nv-res-note").value || "").trim();

      const base = (lang === "en") ? cfg.defaultMsgEN : cfg.defaultMsgTR;

      const lines = [
        base,
        name ? `Ad/Name: ${name}` : "",
        phone ? `Tel: ${phone}` : "",
        date ? `Tarih/Date: ${date}` : "",
        time ? `Saat/Time: ${time}` : "",
        guests ? `Kişi/Guests: ${guests}` : "",
        note ? `Not/Note: ${note}` : "",
      ].filter(Boolean);

      return lines.join("\n");
    }

    function updatePreview() {
      const msg = buildMessage();
      const pv = document.getElementById("nv-res-preview");
      pv.textContent = msg;
    }

    // expose helpers for open function
    window.__NV_RES__ = { updatePreview, buildMessage };
    updatePreview();
  }

  function openModal(payload) {
    ensureModal();

    const overlay = document.getElementById("nv-reservation-overlay");
    overlay.classList.add("is-open");
    document.documentElement.classList.add("nv-modal-open");
    document.body.classList.add("nv-modal-open");

    // Optional prefill from payload
    try {
      const p = payload && typeof payload === "object" ? payload : {};
      if (p.name) document.getElementById("nv-res-name").value = String(p.name);
      if (p.phone) document.getElementById("nv-res-phone").value = String(p.phone);
      if (p.date) document.getElementById("nv-res-date").value = String(p.date);
      if (p.time) document.getElementById("nv-res-time").value = String(p.time);
      if (p.guests) document.getElementById("nv-res-guests").value = String(p.guests);
      if (p.note) document.getElementById("nv-res-note").value = String(p.note);

      // program title from card click (nice)
      if (p.program) {
        const cur = (document.getElementById("nv-res-note").value || "").trim();
        document.getElementById("nv-res-note").value =
          (cur ? (cur + "\n") : "") + `Program: ${p.program}`;
      }
    } catch (_) {}

    if (window.__NV_RES__ && typeof window.__NV_RES__.updatePreview === "function") {
      window.__NV_RES__.updatePreview();
    }

    // ESC to close
    const onKey = (e) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", onKey, { once: true });

    // Focus first input
    setTimeout(() => {
      const first = document.getElementById("nv-res-name");
      if (first) first.focus();
    }, 50);
  }

  function closeModal() {
    const overlay = document.getElementById("nv-reservation-overlay");
    if (!overlay) return;
    overlay.classList.remove("is-open");
    document.documentElement.classList.remove("nv-modal-open");
    document.body.classList.remove("nv-modal-open");
  }

  // Public API used by NAV buttons
  window.NV_OPEN_RESERVATION = function (payload) {
    openModal(payload);
    const eventPayload =
      payload && typeof payload === "object" ? { ...payload } : {};
    const message =
      window.__NV_RES__ && typeof window.__NV_RES__.buildMessage === "function"
        ? window.__NV_RES__.buildMessage()
        : "";
    eventPayload.generatedMessage = message;
    try {
      window.NV_ON_RESERVATION_OPEN(eventPayload);
    } catch (_) {}
  };

  // Optional: also allow close globally
  window.NV_CLOSE_RESERVATION = closeModal;

})();
