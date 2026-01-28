/**
 * @jest-environment jsdom
 */
const fs = require('fs');
const path = require('path');

describe('DOM Structure & Interaction Tests', () => {
  let document;

  beforeEach(() => {
    // Test için örnek bir HTML dosyasını yüklüyoruz (örn: index.html veya hamam.html)
    // Burada projenin ana şablonunu barındıran bir dosyayı kullanıyoruz.
    const html = fs.readFileSync(path.resolve(__dirname, 'hamam.html'), 'utf8');
    document = window.document;
    document.body.innerHTML = html;
  });

  test('Header (Üst Bilgi) alanı mevcut olmalı', () => {
    const header = document.querySelector('[data-nv-header]');
    expect(header).toBeTruthy();
  });

  test('Mobil menü bileşenleri mevcut ve başlangıçta gizli olmalı', () => {
    const toggle = document.querySelector('[data-nv-mobile-toggle]');
    const panel = document.querySelector('[data-nv-mobile-panel]');

    expect(toggle).toBeTruthy();
    expect(panel).toBeTruthy();
    expect(panel.hidden).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  test('Navigasyon linkleri doğru veri özniteliklerine sahip olmalı', () => {
    const links = document.querySelectorAll('a[data-nav]');
    expect(links.length).toBeGreaterThan(0);

    links.forEach(link => {
      expect(link.getAttribute('data-nav')).toBeTruthy();
    });
  });

  test('Rezervasyon butonları mevcut olmalı', () => {
    const ctaButtons = document.querySelectorAll('[data-nv-open-reservation]');
    expect(ctaButtons.length).toBeGreaterThan(0);
  });
});