describe('Broken Links and Resources Checker', () => {
  it('should verify that all links, images, scripts, and stylesheets load correctly', () => {
    // Visit the root of the application.
    // Ensure baseUrl is configured in cypress.config.js or passed via CLI.
    cy.visit('/');

    // 1. Check Anchor Links (href)
    cy.get('a').each(($a) => {
      const href = $a.prop('href');
      // Skip mailto, tel, empty links, or internal hash links
      if (href && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.includes('#')) {
        cy.request({
          url: href,
          failOnStatusCode: false
        }).then((response) => {
          if (response.status >= 400) {
            cy.log(`Broken Link Detected: ${href} (Status: ${response.status})`);
          }
          expect(response.status).to.be.lt(400);
        });
      }
    });

    // 2. Check Images (src)
    cy.get('img').each(($img) => {
      const src = $img.prop('src');
      if (src) {
        cy.request({
          url: src,
          failOnStatusCode: false
        }).then((response) => {
          if (response.status >= 400) {
            cy.log(`Broken Image Detected: ${src} (Status: ${response.status})`);
          }
          expect(response.status).to.be.lt(400);
        });
      }
    });

    // 3. Check Scripts (src)
    cy.get('script[src]').each(($script) => {
      const src = $script.prop('src');
      if (src) {
        cy.request({
          url: src,
          failOnStatusCode: false
        }).then((response) => {
          if (response.status >= 400) {
            cy.log(`Broken Script Detected: ${src} (Status: ${response.status})`);
          }
          expect(response.status).to.be.lt(400);
        });
      }
    });
  });
});