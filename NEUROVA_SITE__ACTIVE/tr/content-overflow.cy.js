describe('Content Overflow', () => {
  const viewports = [
    'iphone-x',
    'ipad-2',
    'macbook-13'
  ];

  viewports.forEach((viewport) => {
    it(`should not have horizontal scroll on ${viewport}`, () => {
      cy.viewport(viewport);
      cy.visit('/tr/index.html');

      cy.window().then((win) => {
        const scrollWidth = win.document.documentElement.scrollWidth;
        const clientWidth = win.document.documentElement.clientWidth;

        // Allow a small margin of error (e.g., 1px) for sub-pixel rendering differences
        expect(scrollWidth).to.be.closeTo(clientWidth, 1);
      });

      cy.scrollTo('bottom');
    });
  });
});