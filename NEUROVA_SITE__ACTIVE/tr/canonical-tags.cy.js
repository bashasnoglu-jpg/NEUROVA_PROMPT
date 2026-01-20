describe('Canonical Tags', () => {
  const pages = [
    { url: '/tr/index.html', expected: 'https://www.neurova.com/tr/index.html' },
    { url: '/tr/hamam.html', expected: 'https://www.neurova.com/tr/hamam.html' },
    { url: '/en/index.html', expected: 'https://www.neurova.com/en/index.html' },
    { url: '/en/hamam.html', expected: 'https://www.neurova.com/en/hamam.html' }
  ];

  pages.forEach((page) => {
    it(`should have correct canonical tag on ${page.url}`, () => {
      cy.visit(page.url);
      cy.get('link[rel="canonical"]')
        .should('have.attr', 'href', page.expected);
    });
  });
});