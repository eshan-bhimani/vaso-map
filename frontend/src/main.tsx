/**
 * Application entry point.
 *
 * Educational note: This file:
 * - Mounts the React application to the DOM
 * - Imports global styles
 * - Wraps the app with necessary providers (if any)
 *
 * Vite handles module bundling and hot module replacement (HMR)
 * for fast development.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Get the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Create React root and render the app
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
