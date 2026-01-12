describe('Team Page', () => {
  beforeEach(() => {
    cy.visit('/tr/team.html');
  });

  it('should display the team title', () => {
    cy.get('h1').should('contain', 'Uzman Ekibimiz');
  });

  it('should display team members', () => {
    // Check for specific roles mentioned in the HTML
    cy.contains('Baş Terapist').should('be.visible');
    cy.contains('Estetisyen').should('be.visible');
    cy.contains('Hamam Ustası').should('be.visible');
    cy.contains('Refleksoloji Uzmanı').should('be.visible');
  });

  it('should have a reservation CTA', () => {
    cy.get('a.wa-cta').should('contain', 'Rezervasyon');
    cy.get('a.wa-cta').should('have.attr', 'href').and('include', '#nv-wa');
  });
});