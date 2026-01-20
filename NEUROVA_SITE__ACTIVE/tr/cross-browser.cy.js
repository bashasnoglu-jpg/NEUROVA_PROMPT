describe('Cross Browser Compatibility', () => {
  // Cypress runs inside a browser, so we can't easily switch browsers within a test.
  // However, we can check for features that might be browser-specific or use polyfills.

  it('should support essential features', () => {
    cy.visit('/tr/index.html');

    cy.window().then((win) => {
      // Check for CSS Grid support
      expect(win.CSS.supports('display', 'grid')).to.be.true;

      // Check for Flexbox support
      expect(win.CSS.supports('display', 'flex')).to.be.true;

      // Check for Sticky positioning
      expect(win.CSS.supports('position', 'sticky')).to.be.true;

      // Check for IntersectionObserver (used for lazy loading/scroll effects)
      expect('IntersectionObserver' in win).to.be.true;
    });
  });
});