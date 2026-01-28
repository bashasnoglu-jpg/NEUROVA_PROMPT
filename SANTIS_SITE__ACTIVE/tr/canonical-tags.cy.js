describe('Canonical Tags', () => {
  const pages = [
    { url: '/tr/index.html', expected: 'https://www.santis.com/tr/index.html' },
    { url: '/tr/hamam.html', expected: 'https://www.santis.com/tr/hamam.html' },
    { url: '/en/index.html', expected: 'https://www.santis.com/en/index.html' },
    { url: '/en/hamam.html', expected: 'https://www.santis.com/en/hamam.html' }
  ];

  pages.forEach((page) => {
    it(`should have correct canonical tag on ${page.url}`, () => {
      cy.visit(page.url);
      cy.get('link[rel="canonical"]')
        .should('have.attr', 'href', page.expected);
    });
  });
});