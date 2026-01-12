describe('Structured Data (JSON-LD)', () => {
  const pages = [
    '/tr/hamam.html',
    '/tr/masajlar.html',
    '/tr/face-sothys.html',
    '/tr/contact.html',
    '/tr/about.html',
    '/tr/team.html',
    '/tr/galeri.html',
    '/tr/products.html',
    '/tr/paketler.html'
  ];

  pages.forEach((page) => {
    it(`should have valid JSON-LD on ${page}`, () => {
      cy.visit(page);
      cy.get('script[type="application/ld+json"]')
        .should('exist')
        .then(($script) => {
          const json = JSON.parse($script.text());
          expect(json).to.be.an('object');
          expect(json['@context']).to.equal('https://schema.org');
          expect(json['@type']).to.equal('Spa');
        });
    });
  });
});