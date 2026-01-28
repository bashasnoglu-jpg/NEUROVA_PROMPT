describe('Language Switcher', () => {
  beforeEach(() => {
    cy.visit('/tr/index.html');
  });

  it('should switch to English when EN option is clicked', () => {
    // Verify initial state
    cy.get('html').should('have.attr', 'lang', 'tr');

    // Click EN switcher (using force:true if it's in a hover menu)
    cy.get('[data-lang-switch="en"]').click({ force: true });

    // Verify URL and Lang attribute
    cy.url().should('include', '/en/');
    cy.get('html').should('have.attr', 'lang', 'en');
  });

  it('should switch back to Turkish from English', () => {
    // Navigate to English page directly
    cy.visit('/en/index.html');
    cy.get('html').should('have.attr', 'lang', 'en');

    // Click TR switcher
    cy.get('[data-lang-switch="tr"]').click({ force: true });

    // Verify URL and Lang attribute
    cy.url().should('include', '/tr/');
    cy.get('html').should('have.attr', 'lang', 'tr');
  });
});