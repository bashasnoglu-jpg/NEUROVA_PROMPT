/**
 * @jest-environment jsdom
 */

const path = require("path");

// ✅ nv-nav.js dosyanın gerçek yolu (repo yapına göre düzenle)
const NV_NAV_PATH = path.resolve(__dirname, "./nv-nav.js");

function setupDom({ withSlot = true } = {}) {
  document.documentElement.className = "";
  document.body.className = "";
  document.body.innerHTML = withSlot ? `<div id="nv-nav-slot"></div>` : ``;

  // Reset inline styles that tests may set
  document.body.style.paddingRight = "";
  document.documentElement.style.cssText = "";
}

function loadNavScriptFresh() {
  jest.resetModules();
  // require: IIFE anında çalışır
  require(NV_NAV_PATH);
}

function getEls() {
  const slot = document.getElementById("nv-nav-slot");
  const toggle = slot?.querySelector("[data-nav-toggle]");
  const panel = slot?.querySelector("[data-nav-panel]");
  const overlay = slot?.querySelector("[data-nav-overlay]");
  const links = slot ? Array.from(slot.querySelectorAll("[data-nav-link]")) : [];
  const reservation = slot ? Array.from(slot.querySelectorAll("[data-nv-open-reservation]")) : [];
  return { slot, toggle, panel, overlay, links, reservation };
}

function setLocationPathname(pathname) {
  // jsdom allows redefining location via history API
  window.history.pushState({}, "", pathname);
}

describe("nv-nav.js (pilot global nav)", () => {
  beforeEach(() => {
    // Clean global hooks
    delete window.NV_OPEN_RESERVATION;
    delete window.NV_CONCIERGE_NUMBER;

    // Default viewport metrics for scrollbar width calculation:
    // scrollbarW = innerWidth - html.clientWidth
    Object.defineProperty(window, "innerWidth", { value: 1200, configurable: true });
    Object.defineProperty(document.documentElement, "clientWidth", { value: 1180, configurable: true });

    setupDom({ withSlot: true });
    setLocationPathname("/index.html");
  });

  test("does nothing if #nv-nav-slot is missing", () => {
    setupDom({ withSlot: false });
    expect(() => loadNavScriptFresh()).not.toThrow();
    expect(document.querySelector("[data-nav-panel]")).toBeNull();
  });

  test("injects markup into slot if panel is not present", () => {
    loadNavScriptFresh();
    const { toggle, panel, overlay } = getEls();
    expect(toggle).toBeTruthy();
    expect(panel).toBeTruthy();
    expect(overlay).toBeTruthy();
  });

  test("idempotency: loading the script twice does not double-bind or duplicate markup", () => {
    loadNavScriptFresh();
    const { slot } = getEls();
    const initialHtml = slot.innerHTML;

    // Load again
    loadNavScriptFresh();
    const afterHtml = slot.innerHTML;

    expect(afterHtml).toBe(initialHtml);
    // dataset guard must be set
    expect(slot.dataset.nvNavWired).toBe("1");
  });

  test("toggle opens and closes the nav; aria-expanded updates; overlay/panel classes update", () => {
    loadNavScriptFresh();
    const { toggle, panel, overlay } = getEls();

    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(panel.classList.contains("is-open")).toBe(false);
    expect(overlay.classList.contains("is-open")).toBe(false);

    toggle.click();

    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(panel.classList.contains("is-open")).toBe(true);
    expect(overlay.classList.contains("is-open")).toBe(true);

    toggle.click();

    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(panel.classList.contains("is-open")).toBe(false);
    expect(overlay.classList.contains("is-open")).toBe(false);
  });

  test("overlay click closes the nav when open", () => {
    loadNavScriptFresh();
    const { toggle, panel, overlay } = getEls();

    toggle.click();
    expect(panel.classList.contains("is-open")).toBe(true);

    overlay.click();
    expect(panel.classList.contains("is-open")).toBe(false);
    expect(overlay.classList.contains("is-open")).toBe(false);
  });

  test("Escape closes the nav only when it is open", () => {
    loadNavScriptFresh();
    const { toggle, panel } = getEls();

    // ESC when closed -> should remain closed
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(panel.classList.contains("is-open")).toBe(false);

    toggle.click();
    expect(panel.classList.contains("is-open")).toBe(true);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(panel.classList.contains("is-open")).toBe(false);
  });

  test("scroll lock toggles html.nv-scroll-lock and applies padding-right compensation", () => {
    loadNavScriptFresh();
    const { toggle } = getEls();

    toggle.click(); // open
    expect(document.documentElement.classList.contains("nv-scroll-lock")).toBe(true);

    // innerWidth 1200 - clientWidth 1180 => 20px
    expect(document.body.style.paddingRight).toBe("20px");

    toggle.click(); // close
    expect(document.documentElement.classList.contains("nv-scroll-lock")).toBe(false);
    // should restore/clear paddingRight
    // If you implement "restore previous", this becomes that previous value (here empty string)
    expect(document.body.style.paddingRight).toBe("");
  });

  test("active link highlighting matches current pathname (index.html)", () => {
    setLocationPathname("/index.html");
    loadNavScriptFresh();

    const { links } = getEls();
    const active = links.filter((a) => a.classList.contains("is-active"));
    expect(active).toHaveLength(1);
    expect(active[0].getAttribute("href").toLowerCase()).toBe("index.html");
  });

  test("active link highlighting matches current pathname (query/hash are ignored)", () => {
    setLocationPathname("/products.html?x=1#top");
    loadNavScriptFresh();

    const { links } = getEls();
    const active = links.filter((a) => a.classList.contains("is-active"));
    expect(active).toHaveLength(1);
    expect(active[0].getAttribute("href").toLowerCase()).toBe("products.html");
  });

  test("focus management: opening focuses active link (or first link); closing restores last focus", () => {
    setLocationPathname("/products.html");
    loadNavScriptFresh();
    const { toggle, panel } = getEls();

    // Put focus somewhere else
    const outsideBtn = document.createElement("button");
    outsideBtn.textContent = "Outside";
    document.body.appendChild(outsideBtn);
    outsideBtn.focus();
    expect(document.activeElement).toBe(outsideBtn);

    toggle.click(); // open -> should focus active link if exists
    const activeLink = panel.querySelector("a.is-active");
    expect(activeLink).toBeTruthy();
    expect(document.activeElement).toBe(activeLink);

    // close -> restore
    toggle.click();
    expect(document.activeElement).toBe(outsideBtn);
  });

  test("nav link click closes the nav", () => {
    setLocationPathname("/index.html");
    loadNavScriptFresh();
    const { toggle, panel, links } = getEls();

    toggle.click();
    expect(panel.classList.contains("is-open")).toBe(true);

    const hamam = links.find((a) => (a.getAttribute("href") || "").toLowerCase() === "hamam.html");
    expect(hamam).toBeTruthy();

    hamam.click();
    expect(panel.classList.contains("is-open")).toBe(false);
  });

  test("reservation button: calls NV_OPEN_RESERVATION when available", () => {
    loadNavScriptFresh();
    const { toggle, reservation } = getEls();

    const spy = jest.fn(() => true);
    window.NV_OPEN_RESERVATION = spy;

    toggle.click();
    expect(reservation).toHaveLength(1);

    reservation[0].dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("reservation button: falls back to wa.me if NV_OPEN_RESERVATION is missing/false and NV_CONCIERGE_NUMBER exists", () => {
    loadNavScriptFresh();
    const { toggle, reservation } = getEls();

    // Force NV_OPEN_RESERVATION to be absent or return falsy
    window.NV_OPEN_RESERVATION = undefined;

    // Set a number with symbols; script should sanitize if you used the suggested normalize patch.
    window.NV_CONCIERGE_NUMBER = "+90 (555) 111-2233";

    const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);

    toggle.click();
    reservation[0].dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

    // If you applied sanitize patch:
    // expected url -> https://wa.me/905551112233
    // If you didn't, update expected accordingly.
    expect(openSpy).toHaveBeenCalled();
    const [url] = openSpy.mock.calls[0];
    expect(String(url)).toContain("https://wa.me/905551112233");

    openSpy.mockRestore();
  });
});