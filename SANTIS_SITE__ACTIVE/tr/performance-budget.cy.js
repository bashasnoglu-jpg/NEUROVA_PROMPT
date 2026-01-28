describe('Performance Budget', () => {
  it('should satisfy First Contentful Paint (FCP) budget', () => {
    cy.visit('/tr/index.html', {
      onBeforeLoad: (win) => {
        // Ensure performance API is available
        if (!win.performance) return;
      }
    });

    cy.window().then((win) => {
      const paint = win.performance.getEntriesByType('paint');
      const fcp = paint.find(p => p.name === 'first-contentful-paint');
      if (fcp) {
        // Budget: 2000ms (from budget.json)
        expect(fcp.startTime).to.be.lessThan(2000);
      }
    });
  });
});