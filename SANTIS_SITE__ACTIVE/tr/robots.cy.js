describe('Robots.txt', () => {
  it('should have a valid robots.txt', () => {
    cy.request('/robots.txt').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.headers['content-type']).to.include('text/plain');
      expect(response.body).to.contain('User-agent: *');
      expect(response.body).to.contain('Allow: /');
    });
  });
});