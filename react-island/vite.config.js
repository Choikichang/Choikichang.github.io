import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The island is built as a single self-mounting IIFE bundle that the Jekyll
// site loads from /assets/manta/manta.js (+ manta.css). Output is committed so
// GitHub Pages (Jekyll-only, no npm) can serve it without a build step.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../assets/manta',
    emptyOutDir: true,
    lib: {
      entry: 'src/main.jsx',
      name: 'MantaBG',
      formats: ['iife'],
      fileName: () => 'manta.js',
    },
    rollupOptions: {
      output: { assetFileNames: 'manta.[ext]' },
    },
  },
})
