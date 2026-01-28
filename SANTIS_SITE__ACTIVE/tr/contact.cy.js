describe('Contact Page', () => {
  beforeEach(() => {
    cy.visit('/tr/contact.html');
  });

  it('should display contact information and map', () => {
    cy.get('h1').should('contain', 'İletişim');
    cy.contains('Adres & Telefon').should('be.visible');
    cy.get('iframe[title="SANTIS Konum"]').should('be.visible');
  });

  it('should allow filling and submitting the contact form', () => {
    cy.get('input[name="name"]').type('Cypress Tester');
    cy.get('input[name="phone"]').type('05551234567');
    cy.get('input[name="email"]').type('test@santis.com');
    cy.get('textarea[name="message"]').type('This is a test message from Cypress E2E.');

    // Submit the form
    cy.contains('button', 'Gönder').click();

    // Since the form has action="#", we verify the page is still active/loaded
    cy.url().should('include', '/contact.html');
  });
});