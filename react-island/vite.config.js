import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The island is built as a single self-mounting IIFE bundle that the Jekyll
// site loads from /assets/manta/manta.js (+ manta.css). Output is committed so
// GitHub Pages (Jekyll-only, no npm) can serve it without a build step.
export default defineConfig({
  plugins: [react()],
  // Vite's library mode does NOT auto-replace process.env.NODE_ENV, so React /
  // r3f leave bare `process.env.NODE_ENV` checks in the IIFE — which throw
  // "process is not defined" in the browser and kill the whole bundle. Define it
  // so those references are inlined at build time.
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
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
