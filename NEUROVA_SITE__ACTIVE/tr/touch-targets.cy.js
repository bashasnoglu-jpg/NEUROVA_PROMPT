describe('Touch Targets', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.visit('/tr/index.html');
  });

  it('should have accessible touch target sizes for key interactive elements', () => {
    // Check mobile menu toggle
    cy.get('[data-nv-mobile-toggle]').should('be.visible').and(($el) => {
      expect($el[0].getBoundingClientRect().width).to.be.at.least(40);
      expect($el[0].getBoundingClientRect().height).to.be.at.least(40);
    });

    // Check reservation CTA
    cy.get('.wa-cta').filter(':visible').should(($el) => {
      expect($el[0].getBoundingClientRect().height).to.be.at.least(40);
    });
  });
});