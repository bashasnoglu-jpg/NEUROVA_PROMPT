window.tailwind.config = {
    darkMode: 'class',
    theme: {
        screens: {
            'xs': '375px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
        },
        extend: {
            colors: {
                // Legacy / Current Colors
                'nv-bg': '#34393D',
                'nv-panel': '#41464A',
                'nv-frame': '#2C2F32',
                'nv-highlight': '#9F9F9F',
                'nv-text': '#ECECEC',
                'nv-stone': '#E6E2DC',

                // New Palette
                'nv-primary': '#2C5530',
                'nv-secondary': '#8B9A8C',
                'nv-accent': '#D4AF37',
                'nv-warm': '#F5E6D3',
                'nv-dark': '#1A1D1A',
                'nv-light': '#F8F9F8',
                'nv-muted': '#6B7B6E',
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
    }
}
