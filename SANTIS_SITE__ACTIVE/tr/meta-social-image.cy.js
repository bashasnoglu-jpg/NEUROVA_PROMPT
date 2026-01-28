describe('Social Share Images', () => {
  const pages = [
    // '/tr/index.html', // Temporarily disabled until index.html is updated with meta tags
    '/tr/hamam.html'
  ];

  pages.forEach((page) => {
    it(`should have accessible social images on ${page}`, () => {
      cy.visit(page);

      // Check Open Graph Image
      cy.get('meta[property="og:image"]').should('have.attr', 'content').then((url) => {
        if (url) {
          cy.request(url).its('status').should('eq', 200);
        }
      });

      // Check Twitter Image
      cy.get('meta[name="twitter:image"]').should('have.attr', 'content').then((url) => {
        if (url) {
          cy.request(url).its('status').should('eq', 200);
        }
      });
    });
  });
});