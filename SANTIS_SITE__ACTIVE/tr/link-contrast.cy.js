describe('Link Color Contrast', () => {
  const pages = [
    '/tr/index.html',
    '/tr/hamam.html'
  ];

  pages.forEach((page) => {
    it(`should have sufficient contrast for links on ${page}`, () => {
      cy.visit(page);
      cy.injectAxe();

      // Check specifically for color contrast issues on links
      cy.checkA11y('a', {
        runOnly: {
          type: 'rule',
          values: ['color-contrast']
        }
      }, (violations) => {
        // Log violations for debugging but don't fail immediately if you want to see all issues
        // Or fail:
        if (violations.length > 0) {
          cy.log(`${violations.length} contrast violations found`);
          violations.forEach(v => {
            cy.log(`Violation: ${v.help} on ${v.nodes.length} nodes`);
          });
        }
      });
    });
  });
});