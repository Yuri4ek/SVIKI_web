/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './index.html'
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          on: 'var(--color-on-primary)',
          container: 'var(--color-primary-container)',
          'on-container': 'var(--color-on-primary-container)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          on: 'var(--color-on-secondary)',
          container: 'var(--color-secondary-container)',
          'on-container': 'var(--color-on-secondary-container)',
        },
        tertiary: {
          DEFAULT: 'var(--color-tertiary)',
          on: 'var(--color-on-tertiary)',
          container: 'var(--color-tertiary-container)',
          'on-container': 'var(--color-on-tertiary-container)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          on: 'var(--color-on-error)',
          container: 'var(--color-error-container)',
          'on-container': 'var(--color-on-error-container)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          on: 'var(--color-on-surface)',
          variant: 'var(--color-surface-variant)',
          'on-variant': 'var(--color-on-surface-variant)',
          'container-lowest': 'var(--color-surface-container-lowest)',
          'container-low': 'var(--color-surface-container-low)',
          container: 'var(--color-surface-container)',
          'container-high': 'var(--color-surface-container-high)',
          'container-highest': 'var(--color-surface-container-highest)',
        },
        background: {
          DEFAULT: 'var(--color-background)',
          on: 'var(--color-on-background)',
        },
        outline: {
          DEFAULT: 'var(--color-outline)',
          variant: 'var(--color-outline-variant)',
        },
        tint: 'var(--color-tint)',
        icon: {
          DEFAULT: 'var(--color-icon)',
          tab: 'var(--color-tab-icon-default)',
          'tab-selected': 'var(--color-tab-icon-selected)',
        },
      },
      textColor: {
        DEFAULT: 'var(--color-text)',
      }
    },
  },
  plugins: [],
};