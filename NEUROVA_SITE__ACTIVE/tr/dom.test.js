/**
 * @jest-environment jsdom
 */

describe('DOM Interaction Logic', () => {
  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = '';
  });

  test('Mobile menu toggle logic', () => {
    // Setup mock DOM elements
    document.body.innerHTML = `
      <button data-nv-mobile-toggle aria-expanded="false">Menu</button>
      <div data-nv-mobile-panel hidden>Panel Content</div>
    `;

    const toggle = document.querySelector('[data-nv-mobile-toggle]');
    const panel = document.querySelector('[data-nv-mobile-panel]');

    // Define the logic to be tested (replicating app.js behavior)
    // In a modular setup, you would import this function
    function handleToggle() {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      const newState = !isExpanded;
      toggle.setAttribute('aria-expanded', newState);
      panel.hidden = !newState;
    }

    toggle.addEventListener('click', handleToggle);

    // Act: Click to open
    toggle.click();

    // Assert: Open state
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(panel.hidden).toBe(false);

    // Act: Click to close
    toggle.click();

    // Assert: Closed state
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(panel.hidden).toBe(true);
  });

  test('Scroll to Top button logic', () => {
    document.body.innerHTML = '<button id="scrollToTopBtn" class="opacity-0 invisible">Top</button>';
    const btn = document.getElementById('scrollToTopBtn');

    // Mock window.scrollTo
    window.scrollTo = jest.fn();

    // Logic from app.js
    function handleScroll() {
      if (window.scrollY > 300) {
        btn.classList.remove('opacity-0', 'invisible');
        btn.classList.add('opacity-100', 'visible');
      } else {
        btn.classList.add('opacity-0', 'invisible');
        btn.classList.remove('opacity-100', 'visible');
      }
    }

    window.addEventListener('scroll', handleScroll);
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Simulate scroll down
    Object.defineProperty(window, 'scrollY', { value: 301, writable: true, configurable: true });
    window.dispatchEvent(new Event('scroll'));

    expect(btn.classList.contains('opacity-100')).toBe(true);

    // Simulate scroll up
    window.scrollY = 100;
    window.dispatchEvent(new Event('scroll'));

    expect(btn.classList.contains('opacity-0')).toBe(true);

    // Simulate click
    btn.click();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});