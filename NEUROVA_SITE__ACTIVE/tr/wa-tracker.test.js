/**
 * @jest-environment jsdom
 */

describe('WhatsApp Tracker Logic', () => {
  // --- Replicated Logic from assets/js/wa-click-tracker.js for testing ---
  
  function nvNormStr(input) {
    let s = (input ?? "").toString().trim();

    // Unicode normalize + remove diacritics (best effort)
    try {
      s = s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
    } catch (_) {}

    s = s.toLowerCase();

    s = s
      .replace(/\s+/g, " ")
      .replace(/[|/\\]+/g, "-")
      .replace(/[^a-z0-9 _-]/g, "")
      .trim();

    s = s.replace(/\s+/g, "-");

    s = s.replace(/-+/g, "-").replace(/^-/, "").replace(/-$/, "");

    return s;
  }

  const NV_SOURCE_ALIAS = new Map([
    ["wa", "whatsapp"],
    ["whats-app", "whatsapp"],
    ["whatsapp", "whatsapp"],
    ["ig", "instagram"],
    ["insta", "instagram"],
    ["instagram", "instagram"],
    ["direct", "direct"],
    ["none", "direct"],
    ["(direct)", "direct"],
  ]);

  const NV_DEFAULT_SOURCE = "direct";

  function nvNormalizeSource(rawSource) {
    const s = nvNormStr(rawSource);
    const mapped = NV_SOURCE_ALIAS.get(s) || s;
    return mapped || NV_DEFAULT_SOURCE;
  }

  function isWhatsAppTarget(el) {
    const href = (el.getAttribute("href") || "").trim().toLowerCase();
    if (href.includes("wa.me/")) return true;
    if (href.includes("api.whatsapp.com")) return true;
    if (href.includes("whatsapp.com")) return true;

    if (el.hasAttribute("data-wa")) return true;
    const aria = (el.getAttribute("aria-label") || "").toLowerCase();
    if (aria.includes("whatsapp")) return true;

    return false;
  }

  // --- Tests ---

  describe('nvNormStr', () => {
    test('should normalize strings correctly', () => {
      expect(nvNormStr('  Hello   World  ')).toBe('hello-world');
      expect(nvNormStr('Test/Path')).toBe('test-path');
      expect(nvNormStr('multiple---dashes')).toBe('multiple-dashes');
    });

    test('should handle diacritics (if supported)', () => {
      // Basic check, might depend on node environment
      expect(nvNormStr('Crème Brûlée')).toBe('creme-brulee');
    });

    test('should handle empty/null inputs', () => {
      expect(nvNormStr(null)).toBe('');
      expect(nvNormStr(undefined)).toBe('');
      expect(nvNormStr('')).toBe('');
    });
  });

  describe('nvNormalizeSource', () => {
    test('should map aliases correctly', () => {
      expect(nvNormalizeSource('wa')).toBe('whatsapp');
      expect(nvNormalizeSource('ig')).toBe('instagram');
      expect(nvNormalizeSource('none')).toBe('direct');
    });

    test('should return normalized source if no alias found', () => {
      expect(nvNormalizeSource('Google Ads')).toBe('google-ads');
    });

    test('should return default source for empty input', () => {
      expect(nvNormalizeSource('')).toBe('direct');
    });
  });

  describe('isWhatsAppTarget', () => {
    test('should detect wa.me links', () => {
      const a = document.createElement('a');
      a.href = 'https://wa.me/905551234567';
      expect(isWhatsAppTarget(a)).toBe(true);
    });

    test('should detect api.whatsapp.com links', () => {
      const a = document.createElement('a');
      a.href = 'https://api.whatsapp.com/send?phone=905551234567';
      expect(isWhatsAppTarget(a)).toBe(true);
    });

    test('should detect data-wa attribute', () => {
      const btn = document.createElement('button');
      btn.setAttribute('data-wa', '1');
      expect(isWhatsAppTarget(btn)).toBe(true);
    });

    test('should detect aria-label containing whatsapp', () => {
      const a = document.createElement('a');
      a.href = '#';
      a.setAttribute('aria-label', 'Chat on WhatsApp');
      expect(isWhatsAppTarget(a)).toBe(true);
    });

    test('should return false for non-whatsapp links', () => {
      const a = document.createElement('a');
      a.href = 'https://google.com';
      expect(isWhatsAppTarget(a)).toBe(false);
    });
  });
});