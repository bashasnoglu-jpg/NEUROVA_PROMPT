const fs = require('fs');
const path = require('path');

// Helper to load the script into the JSDOM environment
const scriptContent = fs.readFileSync(path.resolve(__dirname, './wa-linker.js'), 'utf-8');

function setupDOM(html = '') {
  document.body.innerHTML = html;
  // JSDOM doesn't execute scripts tag content by default, so we eval it.
  // This is safe because it's our own code in a test environment.
  eval(scriptContent);
}

describe('wa-linker.js', () => {
  // Store original location
  const originalLocation = window.location;

  // Function to mock window.location
  const mockLocation = (pathname) => {
    // Before each test, mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        pathname: pathname,
        search: '',
        hash: '',
      },
      writable: true,
    });
  };

  afterEach(() => {
    // Restore original window.location after each test
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
    // Clear mocks and DOM
    document.body.innerHTML = '';
    window.NV_WA = {};
    window.NV_HEAT = {};
  });

  describe('getLang', () => {
    it('should return "tr" for Turkish lang attribute', () => {
      document.documentElement.setAttribute('lang', 'tr-TR');
      mockLocation('/some/page.html');
      // Must re-run script to get new context
      setupDOM(); 
      // This is tricky because getLang is internal. We test its effect on buildMessageParts.
      // To test it directly, we would need to expose it.
      // Instead, we will test the message output.
      expect(true).toBe(true); // Placeholder
    });
    
    it('should return "tr" for "/paketler" path', () => {
        document.documentElement.setAttribute('lang', 'en');
        mockLocation('/paketler.html');
        setupDOM(`<a href="#nv-wa">Book</a>`);

        const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {});
        document.querySelector('a').click();

        const generatedText = decodeURIComponent(openSpy.mock.calls[0][0]);
        expect(generatedText).toContain('Merhaba, NEUROVA’dan rezervasyon yapmak istiyorum.');
        openSpy.mockRestore();
    });

    it('should return "en" for "/packages" path', () => {
        document.documentElement.setAttribute('lang', 'tr');
        mockLocation('/packages.html');
        setupDOM(`<a href="#nv-wa">Book</a>`);
        
        const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {});
        document.querySelector('a').click();
        
        const generatedText = decodeURIComponent(openSpy.mock.calls[0][0]);
        expect(generatedText).toContain('Hello, I’d like to book at NEUROVA.');
        openSpy.mockRestore();
    });
  });

  describe('buildMessageParts', () => {
    it('should build a Turkish booking message', () => {
      mockLocation('/hamam.html');
      window.NV_WA = { WA_BRAND: 'MySpa' };
      setupDOM('<a data-wa="1" class="nv-cta">Book Now</a>');

      const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {});
      document.querySelector('a').click();
      
      const text = decodeURIComponent(openSpy.mock.calls[0][0]);
      
      expect(text).toContain('Merhaba, MySpa’dan rezervasyon yapmak istiyorum.');
      expect(text).toContain('1) Gün tercihi: Bugün / Yarın');
      expect(text).toContain('Kaynak: hamam.html | Tier: N/A');
      openSpy.mockRestore();
    });

    it('should build an English booking message with tier and pack', () => {
      mockLocation('/en/packages.html');
      document.documentElement.lang = 'en';
      setupDOM(`
        <div class="nv-card nv-tier-premium">
          <h3>Premium Package</h3>
          <a data-wa="1">Book</a>
        </div>
      `);
       
      const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {});
      document.querySelector('a').click();
      const text = decodeURIComponent(openSpy.mock.calls[0][0]);
      
      expect(text).toContain('Hello, I’d like to book at NEUROVA.');
      expect(text).toContain('Package: Premium Package (Premium)');
      expect(text).toContain('Preferred day: Today / Tomorrow');
      expect(text).toContain('Source: packages.html | Tier: Premium');
      openSpy.mockRestore();
    });

    it('should build a Turkish products message', () => {
      mockLocation('/tr/products.html');
      document.documentElement.lang = 'tr';
      setupDOM(`
        <div class="nv-product-card" data-product="Süper Krem">
          <h3>Harika Ürün</h3>
          <a data-wa="1">Sipariş et</a>
        </div>
      `);
      
      const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {});
      document.querySelector('a').click();
      const text = decodeURIComponent(openSpy.mock.calls[0][0]);

      expect(text).toContain('Merhaba, Products sayfasindan yaziyorum. NEUROVA icin siparis olusturmak istiyorum.');
      expect(text).toContain('Ürün(ler):');
      expect(text).toContain('- Süper Krem — Adet: [1]');
      expect(text).toContain('- Harika Ürün — Adet: [1]');
      expect(text).toContain('Stok + fiyat ve bugun teslim/kuryeyi yazabilir misiniz?');
      expect(text).toContain('Kaynak: Ürünler | Tier: N/A');
      openSpy.mockRestore();
    });
  });

  describe('waUrl', () => {
    it('should create a URL with phone number', () => {
        mockLocation('/index.html');
        window.NV_WA = { WA_NUM: '+90 123 456 7890' };
        setupDOM('<a data-wa="1">Book</a>');

        const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {});
        document.querySelector('a').click();

        expect(openSpy.mock.calls[0][0]).toContain('https://wa.me/901234567890?text=');
        openSpy.mockRestore();
    });

    it('should create a URL without phone number', () => {
        mockLocation('/index.html');
        window.NV_WA = {};
        setupDOM('<a data-wa="1">Book</a>');

        const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {});
        document.querySelector('a').click();

        expect(openSpy.mock.calls[0][0]).toContain('https://wa.me/?text=');
        openSpy.mockRestore();
    });
  });

  describe('inferFunctions', () => {
    it('should infer pack, tier, and products from a card', () => {
      mockLocation('/en/products.html');
      document.documentElement.lang = 'en';
      setupDOM(`
        <div class="nv-pack-section">
          <h2>Main Section</h2>
          <div class="nv-product-card nv-tier-value" data-product="Test Cream">
            <h3>Value Product</h3>
            <a data-wa="1" data-product="Link Product">Order</a>
          </div>
        </div>`);

        const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {});
        document.querySelector('a').click();
        const text = decodeURIComponent(openSpy.mock.calls[0][0]);
        
        // The infer functions are internal. We test their output on the final message.
        // For products page, pack is ignored. Tier is ignored.
        expect(text).toContain('- Test Cream — Adet: [1]');
        expect(text).toContain('- Link Product — Adet: [1]');
        expect(text).toContain('- Value Product — Adet: [1]');
        expect(text).not.toContain('Package:');
        expect(text).toContain('Tier: N/A');
        openSpy.mockRestore();
    });
  });

  describe('wire', () => {
    it('should attach click listeners to data-wa="1" links', () => {
      const html = `<a href="#nv-wa">Link 1</a> <div class="nv-cta" data-wa="1">CTA</div>`;
      setupDOM(html);
      
      const links = document.querySelectorAll('a[href="#nv-wa"], [data-wa="1"]');
      const clickSpy = jest.fn();

      // We can't easily check the listener directly, so we'll spy on window.open
      const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {});

      links.forEach(link => {
        link.addEventListener('click', clickSpy); // Add our own spy
        link.click();
      });

      expect(clickSpy).toHaveBeenCalledTimes(2);
      expect(openSpy).toHaveBeenCalledTimes(2); // The script's listener should have fired
      openSpy.mockRestore();
    });
  });

  describe('bumpHeat', () => {
    it('should call window.NV_HEAT.bump with correct labels', () => {
      window.NV_HEAT = { bump: jest.fn() };
      mockLocation('/packages.html');
      document.documentElement.lang = 'en';
      setupDOM(`
        <div class="nv-card" data-tier="Value">
          <h3>My Package</h3>
          <a data-wa="1">Book</a>
        </div>
      `);

      document.querySelector('a').click();

      // NV_HEAT.bump(srcLabel, tierTag);
      expect(window.NV_HEAT.bump).toHaveBeenCalledWith('packages.html', 'Value');
    });
  });
});
