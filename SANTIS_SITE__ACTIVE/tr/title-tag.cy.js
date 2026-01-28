describe('Title Tag', () => {
  const pages = [
    '/tr/index.html',
    '/tr/hamam.html',
    '/en/index.html'
  ];

  pages.forEach((page) => {
    it(`should have a unique and valid title on ${page}`, () => {
      cy.visit(page);
      cy.title().should('not.be.empty');
      cy.title().should('include', 'SANTIS');
    });
  });
});