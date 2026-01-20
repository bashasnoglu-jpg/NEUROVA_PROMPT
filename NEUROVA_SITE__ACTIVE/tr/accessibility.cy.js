describe('Basic Accessibility Checks', () => {
  const pages = [
    '/tr/index.html',
    '/tr/hamam.html',
    '/tr/contact.html'
  ];

  pages.forEach((page) => {
    context(`Page: ${page}`, () => {
      beforeEach(() => {
        cy.visit(page);
      });

      it('should have a lang attribute on the html tag', () => {
        cy.get('html').should('have.attr', 'lang').and('not.be.empty');
      });

      it('should have a main landmark', () => {
        cy.get('main').should('exist');
      });

      it('should have a skip-to-content link', () => {
        cy.get('a[href="#main-content"]').should('exist');
        cy.get('main').should('have.attr', 'id', 'main-content');
      });

      it('should have a single h1 heading', () => {
        cy.get('h1').should('have.length', 1);
      });

      it('should ensure all images have alt attributes', () => {
        cy.get('body').then(($body) => {
          if ($body.find('img').length > 0) {
            cy.get('img').each(($img) => {
              cy.wrap($img).should('have.attr', 'alt');
            });
          }
        });
      });

      it('should ensure all buttons have discernible text or aria-label', () => {
        cy.get('button').each(($btn) => {
          const text = $btn.text().trim();
          const ariaLabel = $btn.attr('aria-label');
          const ariaLabelledBy = $btn.attr('aria-labelledby');
          
          if (!text) {
            expect(ariaLabel || ariaLabelledBy, 'Button should have text or aria-label').to.be.ok;
          }
        });
      });

      it('should ensure all inputs have associated labels', () => {
        cy.get('input, textarea, select').each(($input) => {
          if ($input.attr('type') === 'hidden') return;

          const id = $input.attr('id');
          const ariaLabel = $input.attr('aria-label');
          const ariaLabelledBy = $input.attr('aria-labelledby');
          const isWrapped = $input.parents('label').length > 0;
          
          const hasForLabel = id ? $input[0].ownerDocument.querySelector(`label[for="${id}"]`) : false;
          const hasAria = !!(ariaLabel || ariaLabelledBy);

          expect(!!hasForLabel || isWrapped || hasAria, `Input ${$input.attr('name') || id} should have a label`).to.be.true;
        });
      });
    });
  });
});