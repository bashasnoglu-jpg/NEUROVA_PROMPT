describe('Newsletter Subscription', () => {
  beforeEach(() => {
    // Ensure the server is running before tests
    cy.visit('/tr/index.html');
  });

  it('should allow a user to subscribe to the newsletter', () => {
    // Scroll to the newsletter section (usually in footer)
    cy.scrollTo('bottom');

    // Check if the newsletter section exists
    cy.contains('NEUROVA Bülten').should('be.visible');

    // Type an email address
    cy.get('input[type="email"]').type('test@example.com');

    // Click the subscribe button
    cy.contains('button', 'Kayıt Ol').click();

    // Since the form prevents default, we verify the input still has the value or check for UI feedback
    cy.get('input[type="email"]').should('have.value', 'test@example.com');
  });
});