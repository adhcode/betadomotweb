import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'brand-teal': {
          50: '#f0f9fa',
          100: '#d9eff2',
          200: '#b7dfe6',
          300: '#87c8d4',
          400: '#50a8bc',
          500: '#236B7C',
          600: '#1f5c6b',
          700: '#1c4d59',
          800: '#1a404a',
          900: '#18353f',
        },
        'brand-orange': {
          50: '#fdf6f0',
          100: '#faebd9',
          200: '#f4d4b3',
          300: '#ecb882',
          400: '#e29850',
          500: '#D98958',
          600: '#c4714a',
          700: '#a35a3d',
          800: '#844935',
          900: '#6c3d2e',
        },
        'brand-ivory': {
          50: '#fefefe',
          100: '#F3F3E0',
          200: '#f0f0d7',
          300: '#eaeac4',
          400: '#e0e0a8',
          500: '#d4d488',
          600: '#c4c46d',
          700: '#a8a855',
          800: '#888847',
          900: '#6d6d3a',
        },
      },
      fontFamily: {
        'heading': ['var(--font-playfair)', 'serif'],
        'body': ['var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '900' }],
        'h1': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '800' }],
        'h2': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h3': ['1.875rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '700' }],
        'body-xl': ['1.25rem', { lineHeight: '1.7', fontWeight: '500' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7', fontWeight: '500' }],
        'body': ['1rem', { lineHeight: '1.7', fontWeight: '500' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '500' }],
      },
      fontWeight: {
        'extra-bold': '800',
        'black': '900',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config; 