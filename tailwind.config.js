/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
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
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};