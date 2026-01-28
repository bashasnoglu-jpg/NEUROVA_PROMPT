describe('Site Navigation', () => {
  beforeEach(() => {
    cy.visit('/tr/index.html');
  });

  it('should navigate to Hamam page', () => {
    // Target the link specifically within the primary nav to avoid mobile/footer duplicates
    cy.get('nav[aria-label="Primary"] a[href="hamam.html"]').click();
    cy.url().should('include', '/hamam.html');
    cy.get('h1').should('contain', 'Hamam');
  });

  it('should navigate to Masajlar page', () => {
    cy.get('nav[aria-label="Primary"] a[href="masajlar.html"]').click();
    cy.url().should('include', '/masajlar.html');
    cy.get('h1').should('contain', 'Masaj');
  });
});