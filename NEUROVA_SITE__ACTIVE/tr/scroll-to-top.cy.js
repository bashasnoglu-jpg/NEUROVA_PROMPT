describe('Scroll to Top Button', () => {
  context('On Long Pages (Home)', () => {
    beforeEach(() => {
      cy.visit('/tr/index.html');
    });

    it('should appear on scroll and scroll to top when clicked', () => {
      // 1. Initial State: Hidden (at top of page)
      // Based on dom.test.js logic, it uses opacity/visibility classes
      cy.get('#scrollToTopBtn')
        .should('have.class', 'opacity-0')
        .and('have.class', 'invisible');

      // 2. Scroll Down to trigger appearance (Threshold is > 300px)
      cy.scrollTo(0, 500);

      // 3. Verify Visible
      cy.get('#scrollToTopBtn')
        .should('not.have.class', 'opacity-0')
        .and('not.have.class', 'invisible')
        .and('be.visible');

      // 4. Click the button
      cy.get('#scrollToTopBtn').click();

      // 5. Verify Scroll Position returns to 0
      // Cypress retries assertions, so this handles the smooth scroll duration
      cy.window().its('scrollY').should('equal', 0);

      // 6. Verify Button is hidden again
      cy.get('#scrollToTopBtn').should('have.class', 'opacity-0');
    });
  });

  context('On Short Pages (404)', () => {
    it('should not be visible', () => {
      cy.visit('/tr/404.html');

      // The button might exist in DOM but should be hidden
      cy.get('body').then(($body) => {
        if ($body.find('#scrollToTopBtn').length > 0) {
          cy.get('#scrollToTopBtn').should('have.class', 'invisible');
          cy.get('#scrollToTopBtn').should('have.class', 'opacity-0');
        }
      });
    });
  });
});