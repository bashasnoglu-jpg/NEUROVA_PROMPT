describe('About Page', () => {
  beforeEach(() => {
    cy.visit('/tr/about.html');
  });

  it('should display the about title', () => {
    cy.get('h1').should('contain', 'Hakkımızda');
  });

  it('should display the philosophy section', () => {
    cy.contains('SANTIS Felsefesi').should('be.visible');
  });

  it('should have a contact CTA', () => {
    cy.get('a.wa-cta').should('contain', 'İletişim');
    cy.get('a.wa-cta').should('have.attr', 'href').and('include', '#nv-wa');
  });
});