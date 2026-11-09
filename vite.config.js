import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // relative base so the build works on GitHub Pages (served from /<repo>/)
  base: './',
  plugins: [react(), tailwindcss()],
})
