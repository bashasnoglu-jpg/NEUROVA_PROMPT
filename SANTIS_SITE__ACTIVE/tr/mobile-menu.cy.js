describe('Mobile Menu Functionality', () => {
  beforeEach(() => {
    cy.visit('/tr/index.html');
  });

  it('should be hidden on desktop viewports', () => {
    cy.viewport('macbook-13');

    // Toggle button should not be visible
    cy.get('[data-nv-mobile-toggle]').should('not.be.visible');

    // Panel should be hidden (via hidden attribute or CSS)
    cy.get('[data-nv-mobile-panel]').should('have.attr', 'hidden');
    cy.get('[data-nv-mobile-panel]').should('not.be.visible');
  });

  context('On Mobile Viewport (iPhone X)', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
    });

    it('should toggle the menu open and closed', () => {
      // 1. Initial State: Closed
      cy.get('[data-nv-mobile-toggle]')
        .should('be.visible')
        .and('have.attr', 'aria-expanded', 'false');

      cy.get('[data-nv-mobile-panel]')
        .should('have.attr', 'hidden')
        .and('not.be.visible');

      // 2. Action: Click to Open
      cy.get('[data-nv-mobile-toggle]').click();

      // 3. Verify: Open
      cy.get('[data-nv-mobile-toggle]').should('have.attr', 'aria-expanded', 'true');
      cy.get('[data-nv-mobile-panel]').should('not.have.attr', 'hidden');
      cy.get('[data-nv-mobile-panel]').should('be.visible');

      // 4. Action: Click to Close
      cy.get('[data-nv-mobile-toggle]').click();

      // 5. Verify: Closed
      cy.get('[data-nv-mobile-toggle]').should('have.attr', 'aria-expanded', 'false');
      cy.get('[data-nv-mobile-panel]').should('have.attr', 'hidden');
    });

    it('should close the menu when a link is clicked', () => {
      // Open menu
      cy.get('[data-nv-mobile-toggle]').click();
      cy.get('[data-nv-mobile-panel]').should('be.visible');

      // Click a link inside the menu (e.g., Hamam)
      cy.get('[data-nv-mobile-panel]').contains('Hamam').click();

      // Verify navigation occurred
      cy.url().should('include', 'hamam.html');

      // Verify menu is closed on the destination page
      cy.get('[data-nv-mobile-panel]').should('have.attr', 'hidden');
      cy.get('[data-nv-mobile-toggle]').should('have.attr', 'aria-expanded', 'false');
    });
  });
});