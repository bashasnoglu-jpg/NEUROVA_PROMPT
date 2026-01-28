describe('Viewport Meta Tag', () => {
  const pages = [
    '/tr/index.html',
    '/tr/hamam.html'
  ];

  pages.forEach((page) => {
    it(`should have correct viewport meta tag on ${page}`, () => {
      cy.visit(page);
      cy.get('meta[name="viewport"]')
        .should('have.attr', 'content')
        .and('include', 'width=device-width')
        .and('include', 'initial-scale=1');
    });
  });
});