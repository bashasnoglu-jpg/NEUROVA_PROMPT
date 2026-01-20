describe('Mobile Navigation Flows', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.visit('/tr/index.html');
  });

  it('should navigate to Hamam page via mobile menu', () => {
    // Open menu
    cy.get('[data-nv-mobile-toggle]').click();
    cy.get('[data-nv-mobile-panel]').should('be.visible');

    // Click Hamam link
    cy.get('[data-nv-mobile-panel]').contains('Hamam').click();

    // Verify navigation
    cy.url().should('include', '/hamam.html');
    cy.get('h1').should('contain', 'Hamam');
  });

  it('should navigate to Contact page via mobile menu', () => {
    cy.get('[data-nv-mobile-toggle]').click();
    cy.get('[data-nv-mobile-panel]').should('be.visible');

    // Click Contact link (usually in secondary/bottom section)
    cy.get('[data-nv-mobile-panel]').contains('İletişim').click();

    cy.url().should('include', '/contact.html');
    cy.get('h1').should('contain', 'İletişim');
  });
});