describe('Performance Metrics', () => {
  it('should load the homepage and fire load event', () => {
    cy.visit('/tr/index.html', {
      onBeforeLoad: (win) => {
        // Mark start if needed, but we use navigation timing API
      }
    });

    cy.window().should((win) => {
      const navEntry = win.performance.getEntriesByType('navigation')[0];
      // Ensure the load event has completed
      expect(navEntry.loadEventEnd).to.be.greaterThan(0);
      // Ensure DOM interactive happened reasonably fast (e.g. < 2s)
      // expect(navEntry.domInteractive).to.be.lessThan(2000);
    });
  });
});