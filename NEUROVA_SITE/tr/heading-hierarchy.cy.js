describe('Heading Hierarchy', () => {
  const pages = [
    '/tr/index.html',
    '/tr/hamam.html',
    '/tr/masajlar.html',
    '/tr/contact.html'
  ];

  pages.forEach((page) => {
    it(`should have a valid heading structure on ${page}`, () => {
      cy.visit(page);

      // 1. Only one H1
      cy.get('h1').should('have.length', 1);

      // 2. H1 should be the first heading found in the document flow
      cy.get('h1, h2, h3, h4, h5, h6').first().then(($el) => {
        expect($el.prop('tagName')).to.equal('H1');
      });
    });
  });
});