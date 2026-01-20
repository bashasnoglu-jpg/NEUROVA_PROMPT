describe('Visual Stability & Layout Shifts', () => {
  const pages = [
    '/tr/index.html',
    '/tr/hamam.html',
    '/tr/contact.html'
  ];

  pages.forEach((page) => {
    it(`should have acceptable Cumulative Layout Shift (CLS) on ${page}`, () => {
      let cumulativeLayoutShift = 0;

      cy.visit(page, {
        onBeforeLoad(win) {
          if ('PerformanceObserver' in win) {
            const observer = new win.PerformanceObserver((list) => {
              const entries = list.getEntries();
              entries.forEach((entry) => {
                // Only count layout shifts without recent user input.
                if (!entry.hadRecentInput) {
                  cumulativeLayoutShift += entry.value;
                }
              });
            });

            observer.observe({ type: 'layout-shift', buffered: true });
          }
        },
      });

      // Scroll to trigger potential layout shifts from lazy-loaded images or sticky headers
      cy.scrollTo('bottom', { duration: 1000 });
      cy.wait(500);
      cy.scrollTo('top', { duration: 500 });

      // Google's "Good" CLS threshold is 0.1
      cy.then(() => {
        cy.log(`Cumulative Layout Shift: ${cumulativeLayoutShift}`);
        expect(cumulativeLayoutShift).to.be.lessThan(0.1);
      });
    });

    it(`should verify sticky header stability on ${page}`, () => {
      cy.visit(page);
      
      // Ensure header is sticky
      cy.get('[data-nv-header]')
        .should('have.css', 'position', 'sticky')
        .and('be.visible');

      // Check initial position
      cy.get('[data-nv-header]').then(($header) => {
        const initialRect = $header[0].getBoundingClientRect();
        expect(initialRect.top).to.equal(0);
      });

      // Scroll down
      cy.scrollTo(0, 500);

      // Check position after scroll (should still be 0 if sticky)
      cy.get('[data-nv-header]').then(($header) => {
        const scrolledRect = $header[0].getBoundingClientRect();
        expect(scrolledRect.top).to.equal(0);
      });
    });
  });
});