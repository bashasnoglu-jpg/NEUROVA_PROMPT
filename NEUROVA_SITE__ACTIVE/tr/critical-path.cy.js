describe('Critical User Journey', () => {
  it('should navigate from home to service to contact', () => {
    // 1. Landing
    cy.visit('/tr/index.html');
    cy.title().should('include', 'NEUROVA');
    cy.contains('NEUROVA').should('be.visible');

    // 2. Service Discovery (Navigate to Hamam)
    // Using the primary nav
    cy.get('nav[aria-label="Primary"] a[href="hamam.html"]').click();

    // Verify transition
    cy.url().should('include', '/hamam.html');
    cy.get('h1').should('contain', 'Hamam');
    cy.contains('Klasik Hamam Ritüeli').should('be.visible');

    // 3. Intent to Reserve (Check WhatsApp CTA)
    cy.get('a[href*="wa.me"]').should('exist');

    // 4. Contact & Conversion
    // Open dropdown to find Contact link on desktop
    cy.get('[data-nv-dropdown-toggle]').click();
    cy.get('[data-nv-dropdown-menu]').contains('İletişim').click();

    cy.url().should('include', '/contact.html');
    cy.get('input[name="name"]').type('Critical Path User');
    cy.get('input[name="email"]').type('critical@test.com');
    cy.get('form button[type="submit"]').should('be.visible');
  });
});