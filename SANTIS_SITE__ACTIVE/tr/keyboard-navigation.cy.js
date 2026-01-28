describe('Keyboard Navigation', () => {
  beforeEach(() => {
    cy.visit('/tr/index.html');
  });

  it('should have a skip-to-content link that becomes visible on focus', () => {
    // The skip link is injected by JS in app.js
    cy.get('a[href="#main-content"]').should('exist');

    // Initially it should be visually hidden (sr-only)
    cy.get('a[href="#main-content"]').should('have.class', 'sr-only');

    // Focus it
    cy.get('a[href="#main-content"]').focus();

    // Verify it has focus
    cy.focused().should('have.attr', 'href', '#main-content');
  });

  it('should allow focusing on primary navigation links', () => {
    cy.get('nav[aria-label="Primary"] a').each(($link) => {
      cy.wrap($link).focus();
      cy.focused().should('have.attr', 'href', $link.attr('href'));
    });
  });

  it('should allow focusing on form inputs', () => {
    cy.visit('/tr/contact.html');
    cy.get('input, textarea, button[type="submit"]').each(($el) => {
      cy.wrap($el).focus().should('have.focus');
    });
  });
});