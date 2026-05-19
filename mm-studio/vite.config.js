import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/projeto-v2/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  plugins: [react(), tailwindcss()],
})
