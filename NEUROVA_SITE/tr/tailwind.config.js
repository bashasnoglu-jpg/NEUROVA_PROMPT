/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '375px',    // Küçük telefonlar
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Mevcut Renkler (Geri uyumluluk için korundu)
        'nv-bg': '#090B0F',
        'nv-frame': '#110F11',
        'nv-panel': '#19161A',
        'nv-panel-2': '#211E21',
        'nv-surface': '#2A282B',
        'nv-divider': '#353437',
        'nv-stroke': '#444347',
        'nv-highlight': '#6D6C72',
        'nv-text': '#D6D7DA',
        'nv-muted': '#8F9094',
        'nv-stone': '#E6E2DC',
        
        // YENİ PALET (İyileştirme Planı)
        'nv-primary': '#2C5530',        // Derin yeşil
        'nv-secondary': '#8B9A8C',      // Yumuşak yeşil
        'nv-accent': '#D4AF37',         // Altın
        'nv-warm': '#F5E6D3',           // Sıcak krem
        'nv-dark': '#1A1D1A',           // Koyu gri-yeşil
        'nv-light': '#F8F9F8',          // Açık gri
        'nv-muted-green': '#6B7B6E',
      },
      backgroundImage: {
        'nv-gradient-primary': 'linear-gradient(135deg, #2C5530 0%, #8B9A8C 100%)',
        'nv-gradient-warm': 'linear-gradient(45deg, #F5E6D3 0%, #D4AF37 100%)',
      },
      borderRadius: {
        'nv': '18px',
      },
      boxShadow: {
        'nv': '0 12px 30px rgba(0,0,0,.35)',
        'nv-soft': '0 8px 24px rgba(0,0,0,0.15)',
      },
      transitionDuration: {
        'nv': '400ms', 
        'nv-slow': '700ms',
      },
      transitionTimingFunction: {
        'nv': 'ease-out',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-left': {
          'from': { opacity: '0', transform: 'translateX(-50px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          'from': { opacity: '0', transform: 'scale(0.9)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'fade-in': 'fade-in 1s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.8s ease-out forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
      }
    },
  },
  content: [
    "./*.html",
    "../en/*.html",
    "../assets/**/*.{js,html}"
  ],
  plugins: [
    function({ addComponents, theme }) {
      addComponents({
        '.nv-heading-1': {
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          lineHeight: '1.2',
          fontWeight: '300',
          letterSpacing: '-0.02em',
        },
        '.nv-heading-2': {
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          lineHeight: '1.3',
          fontWeight: '300',
        },
        '.nv-body': {
          fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
          lineHeight: '1.6',
          color: theme('colors.nv-text'),
        },
        '.nv-card-hover': {
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: theme('boxShadow.nv'),
          },
        }
      })
    }
  ],
}

