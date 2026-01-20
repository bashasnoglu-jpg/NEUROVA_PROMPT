describe('Desktop Navigation Flows', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.visit('/tr/index.html');
  });

  it('should navigate to Hamam page via primary nav', () => {
    cy.get('nav[aria-label="Primary"] a[href="hamam.html"]').click();
    cy.url().should('include', '/hamam.html');
    cy.get('h1').should('contain', 'Hamam');
  });

  it('should navigate to About page via dropdown', () => {
    cy.get('[data-nv-dropdown-toggle]').click();
    cy.get('[data-nv-dropdown-menu]').should('be.visible');
    cy.get('[data-nv-dropdown-menu] a[href="about.html"]').click();
    cy.url().should('include', '/about.html');
    cy.get('h1').should('contain', 'Hakkımızda');
  });
});