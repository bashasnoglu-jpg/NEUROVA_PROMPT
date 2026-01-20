describe('Design System & UI Interactions', () => {
  beforeEach(() => {
    // Mock video to prevent 404s and keep console clean
    cy.intercept('GET', '**/hero.mp4', {
      statusCode: 200,
      headers: { 'Content-Type': 'video/mp4' },
      body: 'mock-video-content'
    }).as('mockVideo');
  });

  it('should apply nv-card-hover class and trigger transform on hover', () => {
    cy.visit('/tr/hamam.html');

    // Select the first card to test interaction
    cy.get('.nv-card-hover').first().as('card');

    // 1. Verify static properties
    cy.get('@card').should('have.css', 'transition-duration', '0.4s');

    // 2. Verify initial state (no transform)
    cy.get('@card').should('have.css', 'transform', 'none');

    // 3. Trigger real hover and verify transform change
    // The class applies: transform: translateY(-8px) scale(1.02)
    cy.get('@card').realHover().should('have.css', 'transform').and('not.equal', 'none');
  });

  it('should apply nv-card-hover class to Masaj cards', () => {
    cy.visit('/tr/masajlar.html');
    cy.get('.nv-card-hover').should('have.length.gt', 0);
  });
});