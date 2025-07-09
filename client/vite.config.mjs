import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': 'http://localhost:5000', // Change 5000 to your backend port if different
    },
  },
  build: {
    outDir: 'build',
    sourcemap: true
  }
}) 