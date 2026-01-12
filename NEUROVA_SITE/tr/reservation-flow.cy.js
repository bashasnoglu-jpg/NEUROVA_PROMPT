describe('Reservation Flow', () => {
  beforeEach(() => {
    cy.visit('/tr/index.html');
  });

  it('should intercept WhatsApp click and verify URL', () => {
    cy.window().then((win) => {
      cy.stub(win, 'open').as('open');
    });

    // Click the header reservation button
    cy.get('header a[href="#nv-wa"]').click();

    // Verify window.open was called with the correct WhatsApp URL
    cy.get('@open').should('have.been.calledWith', Cypress.sinon.match('wa.me/905348350169'), '_blank');
  });

  it('should verify floating reservation button on mobile', () => {
    cy.viewport('iphone-x');
    cy.get('a.fixed.bottom-4.wa-cta').should('be.visible');
  });
});