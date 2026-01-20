describe('Language Switching', () => {
  it('should verify English homepage content', () => {
    cy.visit('/en/index.html');
    cy.get('html').should('have.attr', 'lang', 'en');
    cy.title().should('include', 'NEUROVA');
    cy.contains('Silence, Ritual, Balance').should('be.visible');
  });

  it('should switch from TR to EN on Hamam page', () => {
    cy.visit('/tr/hamam.html');
    // Verify we are on TR page
    cy.get('h1').should('contain', 'Hamam Ritüelleri');

    // Click EN switcher
    cy.get('[data-lang-switch="en"]').click();

    // Verify URL and Content
    cy.url().should('include', '/en/hamam.html');
    cy.get('h1').should('contain', 'Hammam Rituals');
  });

  it('should switch from EN to TR on Hamam page', () => {
    cy.visit('/en/hamam.html');
    // Verify we are on EN page
    cy.get('h1').should('contain', 'Hammam Rituals');

    // Click TR switcher
    cy.get('[data-lang-switch="tr"]').click();

    // Verify URL and Content
    cy.url().should('include', '/tr/hamam.html');
    cy.get('h1').should('contain', 'Hamam Ritüelleri');
  });
});