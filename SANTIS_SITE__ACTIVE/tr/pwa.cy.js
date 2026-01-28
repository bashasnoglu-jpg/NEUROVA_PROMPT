describe('PWA & Service Worker', () => {
  it('should register the service worker successfully', () => {
    cy.visit('/tr/index.html');

    // Wait for the load event and SW registration
    cy.window().then((win) => {
      return new Promise((resolve) => {
        // Check if already controlled or wait for ready
        if (win.navigator.serviceWorker.controller) {
          resolve(win.navigator.serviceWorker.controller);
        } else {
          win.navigator.serviceWorker.ready.then((registration) => {
            resolve(registration.active);
          });
        }
      });
    }).then((sw) => {
      expect(sw).to.exist;
    });
  });

  it('should have a versioned cache storage', () => {
    cy.visit('/tr/index.html');
    cy.wait(1000); // Allow time for caching

    cy.window().then((win) => {
      return win.caches.keys();
    }).then((keys) => {
      // Look for the cache name pattern defined in build-sw.js
      const hasSantisCache = keys.some(key => key.startsWith('santis-v'));
      expect(hasSantisCache, 'Cache starting with santis-v should exist').to.be.true;
    });
  });
});