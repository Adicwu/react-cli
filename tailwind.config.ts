import { type Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      '2xl': '1536px',
      '3xl': '1920px',
      '4xl': '2440px'
    },
    extend: {
      backgroundColor: {
        base: 'var(--color-base)'
      }
    }
  },
  darkMode: 'class',
  corePlugins: {
    preflight: false
  }
} as Config
