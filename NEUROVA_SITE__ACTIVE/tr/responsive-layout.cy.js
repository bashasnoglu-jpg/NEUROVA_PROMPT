describe('Responsive Layout', () => {
  const viewports = [
    { device: 'iphone-x', width: 375, height: 812 },
    { device: 'ipad-2', width: 768, height: 1024 },
    { device: 'macbook-13', width: 1280, height: 800 }
  ];

  viewports.forEach((viewport) => {
    it(`should display correctly on ${viewport.device}`, () => {
      if (typeof viewport.device === 'string') {
        cy.viewport(viewport.device);
      } else {
        cy.viewport(viewport.width, viewport.height);
      }

      cy.visit('/tr/index.html');

      // Check header visibility
      cy.get('[data-nv-header]').should('be.visible');

      if (viewport.width < 768) {
        cy.get('[data-nv-mobile-toggle]').should('be.visible');
      } else {
        cy.get('nav[aria-label="Primary"]').should('be.visible');
      }
    });
  });
});