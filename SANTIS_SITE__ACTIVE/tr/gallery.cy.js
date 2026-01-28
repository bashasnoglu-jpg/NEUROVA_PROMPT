describe('Gallery Page', () => {
  beforeEach(() => {
    cy.visit('/tr/galeri.html');
  });

  it('should display the gallery title', () => {
    cy.get('h1').should('contain', 'Galeri');
  });

  it('should render the masonry layout', () => {
    cy.get('section.columns-1').should('exist');
    cy.get('.break-inside-avoid').should('have.length.at.least', 1);
  });

  it('should load images correctly', () => {
    cy.get('.break-inside-avoid img').each(($img) => {
      cy.wrap($img).should('be.visible');
      cy.wrap($img).should('have.attr', 'src').and('not.be.empty');
      cy.wrap($img).should(($i) => {
        expect($i[0].naturalWidth).to.be.greaterThan(0);
      });
    });
  });
});