describe('SEO & Meta Tags', () => {
  const pages = [
    { url: '/tr/index.html', title: 'NEUROVA' },
    { url: '/tr/hamam.html', title: 'Hamam' },
    { url: '/tr/masajlar.html', title: 'Masajlar' }
  ];

  pages.forEach((page) => {
    it(`should have correct SEO tags on ${page.url}`, () => {
      cy.visit(page.url);

      // Verify Title
      cy.title().should('include', page.title);

      // Verify Meta Description
      cy.get('meta[name="description"]')
        .should('have.attr', 'content')
        .and('not.be.empty');

      // Verify Viewport
      cy.get('meta[name="viewport"]')
        .should('have.attr', 'content')
        .and('contain', 'width=device-width');

      // Verify Charset
      cy.document().should((doc) => {
        const charset = doc.querySelector('meta[charset]');
        expect(charset).to.exist;
        expect(charset.getAttribute('charset').toLowerCase()).to.eq('utf-8');
      });

      // Verify Language Attribute
      cy.get('html').should('have.attr', 'lang', 'tr');

      // Verify JSON-LD Schema
      cy.get('script[type="application/ld+json"]').should('exist');
    });
  });
});