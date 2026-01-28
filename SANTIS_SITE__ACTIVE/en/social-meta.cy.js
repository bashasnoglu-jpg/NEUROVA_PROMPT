describe('Social Meta Tags', () => {
  const pages = [
    '/tr/index.html',
    '/tr/hamam.html'
  ];

  pages.forEach((page) => {
    it(`should have correct Open Graph and Twitter tags on ${page}`, () => {
      cy.visit(page);

      // Open Graph
      cy.get('meta[property="og:title"]').should('have.attr', 'content').and('not.be.empty');
      cy.get('meta[property="og:description"]').should('have.attr', 'content').and('not.be.empty');
      cy.get('meta[property="og:image"]').should('have.attr', 'content').and('not.be.empty');
      cy.get('meta[property="og:url"]').should('have.attr', 'content').and('not.be.empty');
      cy.get('meta[property="og:type"]').should('have.attr', 'content').and('not.be.empty');

      // Twitter Card
      cy.get('meta[name="twitter:card"]').should('have.attr', 'content').and('not.be.empty');
      cy.get('meta[name="twitter:title"]').should('have.attr', 'content').and('not.be.empty');
      cy.get('meta[name="twitter:description"]').should('have.attr', 'content').and('not.be.empty');
      cy.get('meta[name="twitter:image"]').should('have.attr', 'content').and('not.be.empty');
    });
  });
});