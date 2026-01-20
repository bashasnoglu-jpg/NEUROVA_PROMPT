describe('UX Enhancements (Quiet Luxury)', () => {

  context('Homepage Hero Video', () => {
    beforeEach(() => {
      // Mock video to prevent 404s and save bandwidth
      cy.intercept('GET', '**/hero.mp4', {
        statusCode: 200,
        headers: { 'Content-Type': 'video/mp4' },
        body: 'mock-video-content'
      }).as('mockVideo');
    });

    // Not: index.html güncellendiğinde bu test aktifleşmelidir.
    it('should have a video element with correct attributes', () => {
      cy.visit('/tr/index.html');
      cy.get('video#hero-video').should('exist')
        .and('have.prop', 'muted', true)
        .and('have.prop', 'autoplay', true)
        .and('have.prop', 'loop', true);
    });

    it('should respect reduced motion preference', () => {
      cy.visit('/tr/index.html', {
        onBeforeLoad: (win) => {
          cy.stub(win, 'matchMedia').withArgs('(prefers-reduced-motion: reduce)').returns({
            matches: true
          });
        }
      });
      // Video durdurulmuş veya DOM'dan kaldırılmış olmalı
      cy.get('video#hero-video').should('not.be.visible');
    });
  });

  context('Detail Page CTA', () => {
    it('should display the premium CTA section on Hamam page', () => {
      cy.visit('/tr/hamam.html');
      cy.contains('Dengenizi Yeniden Bulun').should('be.visible');
      cy.contains('Ortalama Yanıt Süresi').should('be.visible');
      cy.get('a[href*="wa.me"]').should('be.visible').and('contain', 'Rezervasyon');
    });
  });

  context('404 Page Experience', () => {
    it('should display the refined quiet luxury message', () => {
      cy.visit('/tr/404.html');
      cy.contains('YOLCULUKTA').should('be.visible');
      cy.contains('KÜÇÜK BİR ARA').should('be.visible');
      cy.contains('Ana Sayfaya Dön').should('be.visible');
    });
  });
});