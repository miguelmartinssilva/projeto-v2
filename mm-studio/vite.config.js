import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const base = process.env.GITHUB_PAGES ? '/projeto-v2/dashboard/' : '/dashboard/';

export default defineConfig({
  base,
  build: {
    outDir: '../dashboard',
    emptyOutDir: true,
  },
  plugins: [react(), tailwindcss()],
})
