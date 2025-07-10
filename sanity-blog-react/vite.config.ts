import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
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
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})