describe('404 Error Page', () => {
  beforeEach(() => {
    // Directly visit the 404 page since local http-server doesn't handle 404 redirects like Netlify
    cy.visit('/tr/404.html');
  });

  it('should display the 404 error message', () => {
    cy.get('h1').should('contain', '404');
    cy.get('h2').should('contain', 'Sayfa Bulunamadı');
    cy.get('p').should('contain', 'Aradığınız sayfa silinmiş');
  });

  it('should have a working "Back to Home" button', () => {
    cy.contains('Ana Sayfaya Dön')
      .should('be.visible')
      .click();

    // Verify navigation to home page
    cy.url().should('include', 'index.html');
  });
});