describe('Mobile Menu Interaction', () => {
  beforeEach(() => {
    // Set viewport to mobile size (iPhone X)
    cy.viewport('iphone-x');
    cy.visit('/tr/index.html');
  });

  it('should open and close the mobile menu', () => {
    // Initial state
    cy.get('[data-nv-mobile-panel]').should('have.attr', 'hidden');
    cy.get('[data-nv-mobile-toggle]').should('have.attr', 'aria-expanded', 'false');

    // Open menu
    cy.get('[data-nv-mobile-toggle]').click();
    cy.get('[data-nv-mobile-panel]').should('not.have.attr', 'hidden');
    cy.get('[data-nv-mobile-toggle]').should('have.attr', 'aria-expanded', 'true');
    cy.get('body').should('have.css', 'overflow', 'hidden');

    // Close menu
    cy.get('[data-nv-mobile-toggle]').click();
    cy.get('[data-nv-mobile-panel]').should('have.attr', 'hidden');
    cy.get('[data-nv-mobile-toggle]').should('have.attr', 'aria-expanded', 'false');
    cy.get('body').should('not.have.css', 'overflow', 'hidden');
  });

  it('should display correct navigation links in mobile menu', () => {
    cy.get('[data-nv-mobile-toggle]').click();

    cy.get('[data-nv-mobile-panel]').within(() => {
      cy.contains('Ana Sayfa').should('be.visible').and('have.attr', 'href', 'index.html');
      cy.contains('Hamam').should('be.visible').and('have.attr', 'href', 'hamam.html');
      cy.contains('İletişim').should('be.visible').and('have.attr', 'href', 'contact.html');
    });
  });
});