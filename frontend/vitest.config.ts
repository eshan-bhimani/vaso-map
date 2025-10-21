/**
 * Vitest configuration for frontend tests.
 *
 * Educational note: Vitest is a fast unit test framework compatible with Vite.
 * This config sets up the testing environment and integrates with React Testing Library.
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
});
