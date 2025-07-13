import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
  ],
  build: {
    target: 'es2015',
    minify: 'terser',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }
            if (id.includes('framer-motion')) {
              return 'animation'
            }
            if (id.includes('lucide-react') || id.includes('react-helmet')) {
              return 'ui-vendor'
            }
            if (id.includes('@sanity') || id.includes('@portabletext')) {
              return 'sanity'
            }
            if (id.includes('react-syntax-highlighter')) {
              return 'syntax-highlight'
            }
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'i18n'
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router'],
  },
})