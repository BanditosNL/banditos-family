import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 1,
      },
      mangle: {
        reserved: ['s', 'i', 'm', 'e', 'd', 'r', 'n', 'a', 'c', 't', 'p', 'v', 'f', 'g', 'h', 'k', 'l', 'o', 'q', 'u', 'w', 'x', 'y', 'z'],
      },
    },
  },
})
