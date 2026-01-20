describe('Console Errors', () => {
  const pages = [
    '/tr/index.html',
    '/tr/hamam.html',
    '/tr/contact.html'
  ];

  pages.forEach((page) => {
    it(`should not have any console errors on ${page}`, () => {
      cy.visit(page, {
        onBeforeLoad(win) {
          cy.stub(win.console, 'error').as('consoleError');
        },
      });

      // Wait for page to load and scripts to execute
      cy.wait(1000);

      cy.get('@consoleError').should('not.be.called');
    });
  });
});