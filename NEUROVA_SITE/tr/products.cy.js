describe('Products Page', () => {
  beforeEach(() => {
    cy.visit('/tr/products.html');
  });

  it('should display the boutique title', () => {
    cy.get('h1').should('contain', 'NEUROVA Boutique');
  });

  it('should display product sections', () => {
    cy.contains('Sothys Paris Ev Devam Ürünleri').should('be.visible');
    cy.contains('Aromaterapi & Doğal Yağlar').should('be.visible');
  });

  it('should have a WhatsApp order button', () => {
    cy.get('a.wa-cta').should('contain', 'Bilgi & Sipariş');
    cy.get('a.wa-cta').should('have.attr', 'href').and('include', '#nv-wa');
  });
});