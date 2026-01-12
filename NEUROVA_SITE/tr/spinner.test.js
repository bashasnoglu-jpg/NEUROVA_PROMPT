/**
 * @jest-environment jsdom
 */

describe('Loading Spinner Logic', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // Clean up global functions if they exist
    delete window.nvShowSpinner;
    delete window.nvHideSpinner;
  });

  // Replicate logic from app.js for unit testing
  function initLoadingSpinner() {
    if (document.getElementById('loading-spinner')) return;

    const spinner = document.createElement('div');
    spinner.id = 'loading-spinner';
    spinner.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-nv-bg/80 backdrop-blur-sm transition-opacity duration-300 opacity-0 pointer-events-none';
    spinner.setAttribute('aria-hidden', 'true');
    spinner.innerHTML = '<div class="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>';
    
    document.body.appendChild(spinner);

    window.nvShowSpinner = () => {
      spinner.classList.remove('opacity-0', 'pointer-events-none');
      spinner.setAttribute('aria-hidden', 'false');
    };

    window.nvHideSpinner = () => {
      spinner.classList.add('opacity-0', 'pointer-events-none');
      spinner.setAttribute('aria-hidden', 'true');
    };
  }

  test('should inject spinner into DOM', () => {
    initLoadingSpinner();
    const spinner = document.getElementById('loading-spinner');
    expect(spinner).toBeTruthy();
    expect(spinner.getAttribute('aria-hidden')).toBe('true');
    expect(spinner.classList.contains('opacity-0')).toBe(true);
  });

  test('should expose global control functions', () => {
    initLoadingSpinner();
    expect(typeof window.nvShowSpinner).toBe('function');
    expect(typeof window.nvHideSpinner).toBe('function');
  });

  test('should show and hide spinner correctly', () => {
    initLoadingSpinner();
    const spinner = document.getElementById('loading-spinner');

    // Show
    window.nvShowSpinner();
    expect(spinner.classList.contains('opacity-0')).toBe(false);
    expect(spinner.classList.contains('pointer-events-none')).toBe(false);
    expect(spinner.getAttribute('aria-hidden')).toBe('false');

    // Hide
    window.nvHideSpinner();
    expect(spinner.classList.contains('opacity-0')).toBe(true);
    expect(spinner.classList.contains('pointer-events-none')).toBe(true);
    expect(spinner.getAttribute('aria-hidden')).toBe('true');
  });

  test('should not inject duplicate spinner', () => {
    initLoadingSpinner();
    initLoadingSpinner();
    expect(document.querySelectorAll('#loading-spinner').length).toBe(1);
  });
});