describe('Smoke Test', () => {
  it('should load the homepage successfully', () => {
    cy.visit('/tr/index.html');
    cy.get('header').should('be.visible');
    cy.get('footer').should('be.visible');
    cy.title().should('include', 'NEUROVA');
  });

  it('should navigate to a key service page', () => {
    cy.visit('/tr/index.html');
    // Use the primary nav to avoid mobile/footer duplicates if visible
    cy.get('nav[aria-label="Primary"]').contains('Hamam').click();
    cy.url().should('include', '/hamam.html');
    cy.get('h1').should('contain', 'Hamam');
  });

  it('should load the contact page', () => {
    cy.visit('/tr/contact.html');
    cy.get('form').should('exist');
  });
});