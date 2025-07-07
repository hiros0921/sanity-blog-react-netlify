/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'display': ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        // CSS変数を使用したカラー定義
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        gray: {
          50: 'var(--color-gray-50)',
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          400: 'var(--color-gray-400)',
          500: 'var(--color-gray-500)',
          600: 'var(--color-gray-600)',
          700: 'var(--color-gray-700)',
          800: 'var(--color-gray-800)',
          900: 'var(--color-gray-900)',
        },
        // 背景色
        background: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
        },
        // テキストカラー
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          inverse: 'var(--text-inverse)',
        },
        // ボーダーカラー
        border: {
          light: 'var(--border-light)',
          medium: 'var(--border-medium)',
          dark: 'var(--border-dark)',
        },
      },
      backgroundColor: {
        'base': 'var(--bg-primary)',
        'surface': 'var(--bg-secondary)',
        'elevated': 'var(--bg-tertiary)',
      },
      textColor: {
        'base': 'var(--text-primary)',
        'muted': 'var(--text-secondary)',
        'subtle': 'var(--text-tertiary)',
        'inverted': 'var(--text-inverse)',
      },
      borderColor: {
        'base': 'var(--border-light)',
        'strong': 'var(--border-medium)',
        'emphasis': 'var(--border-dark)',
      },
      transitionDuration: {
        'theme': 'var(--transition-duration)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}