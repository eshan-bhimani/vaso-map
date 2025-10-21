/**
 * Test setup file.
 *
 * Educational note: This file runs before all tests and sets up:
 * - Testing library matchers
 * - Global mocks
 * - Test utilities
 */

import '@testing-library/jest-dom';

// Mock environment variables
process.env.VITE_API_BASE_URL = 'http://localhost:8080/api/v1';
