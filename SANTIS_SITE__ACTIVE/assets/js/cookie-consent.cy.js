describe('Cookie Consent Banner', () => {
  beforeEach(() => {
    // Clear local storage to simulate a new user
    cy.clearLocalStorage();
    cy.visit('/tr/index.html');
  });

  it('should show the banner after delay if no consent is stored', () => {
    // Wait for the 1000ms timeout defined in app.js
    cy.wait(1000);
    cy.get('#cookie-consent').should('not.have.class', 'translate-y-full');
    cy.get('#cookie-consent').should('have.attr', 'aria-hidden', 'false');
  });

  it('should hide banner and store "accepted" when Accept is clicked', () => {
    cy.wait(1000); // Wait for banner appearance
    cy.get('#cookie-accept').should('be.visible').click();

    // Verify banner hides
    cy.get('#cookie-consent').should('have.class', 'translate-y-full');
    cy.get('#cookie-consent').should('have.attr', 'aria-hidden', 'true');

    // Verify storage update
    cy.window().then((win) => {
      expect(win.localStorage.getItem('nv_cookie_consent')).to.eq('accepted');
    });
  });

  it('should hide banner and store "rejected" when Reject is clicked', () => {
    cy.wait(1000);
    cy.get('#cookie-reject').should('be.visible').click();

    cy.get('#cookie-consent').should('have.class', 'translate-y-full');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('nv_cookie_consent')).to.eq('rejected');
    });
  });

  it('should not show banner on reload if consent is already stored', () => {
    // Pre-set consent
    cy.window().then((win) => win.localStorage.setItem('nv_cookie_consent', 'accepted'));
    cy.reload();
    cy.wait(1200); // Wait longer than the trigger time
    cy.get('#cookie-consent').should('have.class', 'translate-y-full');
  });
});