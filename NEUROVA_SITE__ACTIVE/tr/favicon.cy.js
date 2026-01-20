describe('Favicon Presence', () => {
  const pages = [
    '/tr/index.html',
    '/tr/hamam.html'
  ];

  pages.forEach((page) => {
    it(`should have favicon links on ${page}`, () => {
      cy.visit(page);

      // Check for standard favicon
      cy.get('link[rel="icon"][sizes="32x32"]').should('have.attr', 'href').and('include', 'favicon-32x32.png');
      cy.get('link[rel="icon"][sizes="16x16"]').should('have.attr', 'href').and('include', 'favicon-16x16.png');

      // Check for Apple Touch Icon
      cy.get('link[rel="apple-touch-icon"]').should('have.attr', 'href').and('include', 'apple-touch-icon.png');
    });
  });
});