/**
 * API service for communicating with the VasoMap backend.
 *
 * Educational note: This module centralizes all HTTP requests to the backend.
 * Benefits:
 * - Single place to configure base URL and headers
 * - Consistent error handling
 * - Type-safe requests and responses with TypeScript
 * - Easy to mock for testing
 */

import type {
  Vessel,
  VesselDetail,
  PathRequest,
  PathResponse,
  ErrorResponse,
} from '../types/vessel';

// Base URL for API requests
// In production, this would come from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * Custom error class for API errors.
 *
 * Educational note: Custom errors allow us to attach extra data
 * (like HTTP status and error response) for better error handling.
 */
export class ApiError extends Error {
  status: number;
  errorResponse?: ErrorResponse;

  constructor(message: string, status: number, errorResponse?: ErrorResponse) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errorResponse = errorResponse;
  }
}

/**
 * Makes an HTTP request and handles errors.
 *
 * Educational note: This helper function:
 * 1. Adds JSON content-type header
 * 2. Parses JSON responses
 * 3. Throws ApiError for non-2xx responses
 * 4. Includes error details from backend
 *
 * @param url Request URL
 * @param options Fetch options
 * @returns Parsed JSON response
 */
async function fetchApi<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  // Parse response body (even for errors, backend sends JSON)
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Backend sends ErrorResponse format
    const errorResponse = data as ErrorResponse | null;
    throw new ApiError(
      errorResponse?.message || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorResponse || undefined
    );
  }

  return data as T;
}

/**
 * API methods for vessel operations.
 */
export const vesselsApi = {
  /**
   * Get all vessels, optionally filtered by search query.
   *
   * @param query Optional search term
   * @returns Array of vessels
   */
  getAll: async (query?: string): Promise<Vessel[]> => {
    const url = query ? `/vessels?query=${encodeURIComponent(query)}` : '/vessels';
    return fetchApi<Vessel[]>(url);
  },

  /**
   * Get detailed information about a specific vessel.
   *
   * @param id Vessel ID
   * @returns Detailed vessel information
   */
  getById: async (id: number): Promise<VesselDetail> => {
    return fetchApi<VesselDetail>(`/vessels/${id}`);
  },
};

/**
 * API methods for pathfinding operations.
 */
export const pathsApi = {
  /**
   * Find the shortest path between two vessels.
   *
   * @param request Path request with source and target IDs
   * @returns Path response with ordered vessel list
   */
  findPath: async (request: PathRequest): Promise<PathResponse> => {
    return fetchApi<PathResponse>('/paths', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },
};

/**
 * Combined API object for easy imports.
 *
 * Usage: import { api } from './services/api';
 *        const vessels = await api.vessels.getAll();
 */
export const api = {
  vessels: vesselsApi,
  paths: pathsApi,
};
