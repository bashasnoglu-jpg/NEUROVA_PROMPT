document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const currentPage = body.getAttribute('data-page');

  if (!currentPage) {
    console.error('NEUROVA Error: Body tag missing data-page attribute.');
    return;
  }

  const navLinks = document.querySelectorAll('[data-nav]');
  let matchFound = false;

  navLinks.forEach(link => {
    const navKey = link.getAttribute('data-nav');

    // Validation: Check for broken links
    const href = link.getAttribute('href');
    if (!href || href.includes('../')) {
      console.error(`NEUROVA Error: Invalid href in navigation for key: ${navKey}`);
    }

    // Active State Logic
    if (navKey === currentPage) {
      link.classList.add('active');
      matchFound = true;

      // Handle Dropdown Parent Active State
      const parentDropdown = link.closest('.dropdown');
      if (parentDropdown) {
        const parentToggle = parentDropdown.querySelector('.nav-link');
        if (parentToggle) parentToggle.classList.add('active');
      }
    }
  });

  // Strict Check
  if (!matchFound && currentPage !== '404') {
    console.warn(`NEUROVA Warning: No navigation link found for page: ${currentPage}`);
  }

  console.log('NEUROVA Nav System: Initialized.');
});