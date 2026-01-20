describe('External Links', () => {
  it('should open external links in a new tab with security attributes', () => {
    cy.visit('/tr/index.html');

    cy.get('a').each(($a) => {
      const href = $a.prop('href');
      const isExternal = href && !href.includes(location.hostname) && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:');

      if (isExternal) {
        cy.wrap($a).should('have.attr', 'target', '_blank');
        cy.wrap($a).should('have.attr', 'rel').and('include', 'noopener');
      }
    });
  });
});