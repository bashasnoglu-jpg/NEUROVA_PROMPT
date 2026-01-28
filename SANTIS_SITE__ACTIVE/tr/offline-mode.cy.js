describe('Offline Mode', () => {
  it('should display the offline page content', () => {
    cy.visit('/tr/offline.html');
    cy.get('h1').should('contain', 'Offline');
    cy.contains('İnternet Bağlantısı Yok').should('be.visible');
    cy.get('button').contains('Tekrar Dene').should('be.visible');
  });
});