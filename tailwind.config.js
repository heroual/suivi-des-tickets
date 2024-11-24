/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '375px',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom, 1rem)',
      },
      colors: {
        dark: {
          DEFAULT: '#111827',
          50: '#1F2937',
          100: '#374151',
          200: '#4B5563',
          300: '#6B7280',
          400: '#9CA3AF',
          500: '#D1D5DB',
          600: '#E5E7EB',
          700: '#F3F4F6',
          800: '#F9FAFB',
          900: '#FFFFFF',
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            h1: {
              color: '#111827',
            },
            h2: {
              color: '#1F2937',
            },
            h3: {
              color: '#374151',
            },
            strong: {
              color: '#111827',
            },
            a: {
              color: '#2563EB',
              '&:hover': {
                color: '#1D4ED8',
              },
            },
            code: {
              color: '#111827',
              backgroundColor: '#F3F4F6',
              padding: '0.25rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: '#F3F4F6',
              color: '#374151',
              fontSize: '0.875rem',
              lineHeight: '1.7142857',
              margin: '1.6em 0',
              padding: '1.2em',
              borderRadius: '0.375rem',
            },
          },
        },
        dark: {
          css: {
            color: '#D1D5DB',
            h1: {
              color: '#F9FAFB',
            },
            h2: {
              color: '#F3F4F6',
            },
            h3: {
              color: '#E5E7EB',
            },
            strong: {
              color: '#F9FAFB',
            },
            a: {
              color: '#60A5FA',
              '&:hover': {
                color: '#93C5FD',
              },
            },
            code: {
              color: '#F9FAFB',
              backgroundColor: '#374151',
            },
            pre: {
              backgroundColor: '#374151',
              color: '#D1D5DB',
            },
          },
        },
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        glow: {
          'from': { boxShadow: '0 0 10px #60A5FA, 0 0 20px #60A5FA, 0 0 30px #60A5FA' },
          'to': { boxShadow: '0 0 20px #60A5FA, 0 0 30px #60A5FA, 0 0 40px #60A5FA' }
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};