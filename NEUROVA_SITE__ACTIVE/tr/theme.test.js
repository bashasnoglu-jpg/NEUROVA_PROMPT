/**
 * @jest-environment jsdom
 */

describe('Theme Toggle Logic', () => {
  let toggleBtn;

  // Mock localStorage
  const localStorageMock = (function() {
    let store = {};
    return {
      getItem: function(key) {
        return store[key] || null;
      },
      setItem: function(key, value) {
        store[key] = value.toString();
      },
      clear: function() {
        store = {};
      },
      removeItem: function(key) {
        delete store[key];
      },
      get theme() {
        return store.theme;
      },
      set theme(val) {
        store.theme = val;
      }
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  });

  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  beforeEach(() => {
    document.body.innerHTML = '<button id="themeToggle">Toggle</button>';
    toggleBtn = document.getElementById('themeToggle');
    document.documentElement.className = ''; // Reset classes
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  // The function to test (replicating logic from app.js for unit testing isolation)
  function initThemeToggle() {
    const btn = document.getElementById('themeToggle');
    
    // Check local storage or system preference on load
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (!btn) return;

    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.theme = isDark ? 'dark' : 'light';
    });
  }

  test('should respect localStorage "dark" preference on init', () => {
    window.localStorage.theme = 'dark';
    initThemeToggle();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  test('should respect localStorage "light" preference on init', () => {
    window.localStorage.theme = 'light';
    initThemeToggle();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  test('should respect system preference (dark) if no localStorage', () => {
    window.matchMedia.mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
    }));
    
    initThemeToggle();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  test('should toggle theme and update localStorage on click', () => {
    // Start light
    window.localStorage.theme = 'light';
    initThemeToggle();
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Click to toggle dark
    toggleBtn.click();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(window.localStorage.theme).toBe('dark');

    // Click to toggle light
    toggleBtn.click();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(window.localStorage.theme).toBe('light');
  });
});