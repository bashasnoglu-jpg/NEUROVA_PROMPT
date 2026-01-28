/**
 * @jest-environment jsdom
 */

describe('Utility Functions', () => {
  // Helper functions to test (replicating logic from assets/js/site-app.js)
  // In a modular setup, these would be imported from a utils module.
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

  describe('normalize', () => {
    test('should lowercase and trim string', () => {
      expect(normalize('  Hello World  ')).toBe('hello world');
    });

    test('should handle null/undefined', () => {
      expect(normalize(null)).toBe('');
      expect(normalize(undefined)).toBe('');
    });

    test('should handle numbers', () => {
      expect(normalize(123)).toBe('123');
    });
  });

  describe('esc (HTML Escape)', () => {
    test('should escape HTML special characters', () => {
      const input = '<div class="test">Me & You</div>';
      const expected = '&lt;div class=&quot;test&quot;&gt;Me &amp; You&lt;/div&gt;';
      expect(esc(input)).toBe(expected);
    });

    test('should return string as is if no special chars', () => {
      expect(esc('Hello World')).toBe('Hello World');
    });

    test('should handle null/undefined', () => {
      expect(esc(null)).toBe('');
      expect(esc(undefined)).toBe('');
    });
  });
});