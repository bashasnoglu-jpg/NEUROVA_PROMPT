describe('Form Validation Logic', () => {
  beforeEach(() => {
    cy.visit('/tr/contact.html');
  });

  it('should enforce required fields', () => {
    // Attempt to submit the form without filling any fields
    cy.get('form button[type="submit"]').click();

    // Verify that the browser considers the required inputs invalid
    cy.get('input[name="name"]').should(($input) => {
      expect($input[0].checkValidity()).to.be.false;
      expect($input[0].validationMessage).to.not.be.empty;
    });

    cy.get('input[name="email"]').should(($input) => {
      expect($input[0].checkValidity()).to.be.false;
    });

    cy.get('textarea[name="message"]').should(($input) => {
      expect($input[0].checkValidity()).to.be.false;
    });
  });

  it('should validate email format', () => {
    // Fill required fields but with an invalid email
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="phone"]').type('05551234567');
    cy.get('textarea[name="message"]').type('Testing email validation.');
    
    // Type invalid email
    cy.get('input[name="email"]').type('invalid-email-format');
    
    cy.get('form button[type="submit"]').click();

    // Verify email input is still invalid
    cy.get('input[name="email"]').should(($input) => {
      expect($input[0].checkValidity()).to.be.false;
    });

    // Correct the email
    cy.get('input[name="email"]').clear().type('valid@example.com');
    cy.get('input[name="email"]').should(($input) => {
      expect($input[0].checkValidity()).to.be.true;
    });
  });
});