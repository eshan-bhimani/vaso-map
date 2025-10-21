/**
 * Tailwind CSS configuration.
 *
 * Educational note: This configures Tailwind's behavior:
 * - content: Files to scan for class names
 * - theme: Customize design tokens (colors, spacing, etc.)
 * - plugins: Add additional Tailwind functionality
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom colors can be added here
      // For now, we use Tailwind's default palette
    },
  },
  plugins: [],
}
