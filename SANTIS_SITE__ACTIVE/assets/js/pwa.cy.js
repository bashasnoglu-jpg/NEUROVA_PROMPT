describe('PWA & Offline Support', () => {
  it('should register a service worker on the homepage', () => {
    cy.visit('/tr/index.html');

    cy.window().then((win) => {
      if ('serviceWorker' in win.navigator) {
        // Wait for registration to complete
        cy.wait(1000);
        win.navigator.serviceWorker.getRegistrations().then((registrations) => {
          expect(registrations.length).to.be.greaterThan(0);
          const registration = registrations[0];
          expect(registration.scope).to.include(win.location.origin);
        });
      }
    });
  });

  it('should have a valid manifest.json', () => {
    cy.request('/manifest.json').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.headers['content-type']).to.include('application/json');
      expect(response.body).to.have.property('name', 'SANTIS Spa & Wellness');
      expect(response.body).to.have.property('start_url');
      expect(response.body.icons).to.be.an('array');
    });
  });

  it('should serve the offline fallback page', () => {
    cy.visit('/tr/offline.html');
    cy.get('h1').should('contain', 'Offline');
    cy.contains('Ã„Â°nternet BaÃ„Å¸lantÃ„Â±sÃ„± Yok').should('be.visible');
  });
});