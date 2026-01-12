describe('Scroll Progress Bar', () => {
  beforeEach(() => {
    cy.visit('/tr/index.html');
  });

  it('should be visible and update width on scroll', () => {
    // Check existence
    cy.get('#scroll-progress-bar').should('exist');

    // Scroll to bottom
    cy.scrollTo('bottom');
    cy.wait(200); // Wait for transition
    
    // Check width is greater than 0 (pixels)
    cy.get('#scroll-progress-bar').invoke('width').should('be.gt', 0);
    
    // Scroll to top
    cy.scrollTo('top');
    cy.wait(200);
    
    // Check width is 0px
    cy.get('#scroll-progress-bar').should('have.css', 'width', '0px');
  });
});