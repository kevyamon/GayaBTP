import type { Config } from 'tailwindcss';
import formsPlugin from '@tailwindcss/forms';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#E99021',
          'primary-hover': '#D47F15',
          'primary-light': '#FEF3E7',
          secondary: '#2C5F7C',
          'secondary-hover': '#234C63',
          'secondary-light': '#EBF3F8',
          accent: '#91C29E',
          'accent-hover': '#7EB28C',
          'accent-light': '#EEF7F1',
          urgent: '#CE6D3C',
          'urgent-hover': '#B85E30',
          dark: '#0F172A',
          'dark-surface': '#1E293B',
          'dark-border': '#334155',
          light: '#F8FAFC',
          'light-surface': '#FFFFFF',
          'light-border': '#E2E8F0',
        },
      },
      fontFamily: {
        title: ['"Changa One"', 'Impact', 'system-ui', 'sans-serif'],
        body: ['"Open Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(15, 23, 42, 0.08)',
        'card-dark': '0 4px 25px -2px rgba(0, 0, 0, 0.35)',
        elevated: '0 10px 35px -5px rgba(44, 95, 124, 0.15)',
        'elevated-dark': '0 10px 35px -5px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        brand: '12px',
        'brand-lg': '16px',
        'brand-xl': '24px',
      },
    },
  },
  plugins: [formsPlugin],
};

export default config;
