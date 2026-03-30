/**
 * Vite configuration file.
 *
 * Educational note: Vite is a modern build tool that provides:
 * - Lightning-fast hot module replacement (HMR)
 * - Optimized production builds
 * - Native ES modules support
 * - Plugin ecosystem
 *
 * This config sets up React and defines development server options.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: true,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
