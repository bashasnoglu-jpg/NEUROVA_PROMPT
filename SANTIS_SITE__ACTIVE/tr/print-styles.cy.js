describe('Print Styles', () => {
  it('should load the page without errors for printing', () => {
    cy.visit('/tr/index.html');

    // Verify the page content is loaded
    cy.get('main').should('be.visible');

    // Future: Add assertions for 'print:hidden' classes on navigation elements
  });
});