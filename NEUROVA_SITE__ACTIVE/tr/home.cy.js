describe('NEUROVA Home Page', () => {
  beforeEach(() => {
    // Visits the Turkish index page. Ensure your local server is running (npm start).
    cy.visit('/tr/index.html');
  });

  it('should display the correct page title', () => {
    cy.title().should('include', 'NEUROVA');
  });

  it('should have a visible main hero heading', () => {
    cy.get('h1').should('be.visible');
  });

  it('should navigate to the Hamam page correctly', () => {
    // Click the navigation link for Hamam
    cy.get('nav a[href="hamam.html"]').first().click();
    cy.url().should('include', '/hamam.html');
    cy.get('h1').should('contain', 'Hamam');
  });

  it('should toggle the mobile menu on small viewports', () => {
    cy.viewport('iphone-x');
    cy.get('[data-nv-mobile-toggle]').click();
    cy.get('[data-nv-mobile-panel]').should('not.have.attr', 'hidden');
  });
});