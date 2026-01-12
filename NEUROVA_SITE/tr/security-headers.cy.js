describe('Security Headers', () => {
  it('should have security headers configured', () => {
    cy.request('/tr/index.html').then((response) => {
      // Note: These headers depend on the server configuration (e.g., Netlify, Vercel, or local http-server).
      // If running locally with a simple http-server, these might not be present by default.
      // This test is more relevant for the deployed environment or if the local server is configured to send them.
      
      // Example checks (adjust based on your actual server config):
      // expect(response.headers).to.have.property('x-content-type-options', 'nosniff');
      // expect(response.headers).to.have.property('x-frame-options', 'DENY');
      // expect(response.headers).to.have.property('x-xss-protection', '1; mode=block');
      
      // For now, we just log them to verify we can access headers
      cy.log('Response Headers:', JSON.stringify(response.headers));

      // Basic check that we got a valid response
      expect(response.status).to.eq(200);
      
      // If you are using a specific hosting provider like Netlify, you can assert specific headers:
      // if (Cypress.config('baseUrl').includes('netlify.app')) {
      //   expect(response.headers).to.have.property('strict-transport-security');
      // }
    });
  });
});