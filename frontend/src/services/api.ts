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
import {
  staticVessels,
  staticEdges,
  getStaticVesselDetail,
} from '../data/vessels';

// Base URL for API requests
// In production, this would come from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

/** Whether to use static fallback data (set on first failed API call). */
let useStaticData: boolean | null = null;

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
    if (useStaticData) {
      const q = query?.toLowerCase();
      return q
        ? staticVessels.filter((v) =>
            v.name.toLowerCase().includes(q) ||
            v.aliases.some((a) => a.toLowerCase().includes(q))
          )
        : staticVessels;
    }
    try {
      const url = query ? `/vessels?query=${encodeURIComponent(query)}` : '/vessels';
      const result = await fetchApi<Vessel[]>(url);
      if (!Array.isArray(result)) throw new Error('Invalid response');
      useStaticData = false;
      return result;
    } catch {
      if (useStaticData === null) useStaticData = true;
      return vesselsApi.getAll(query);
    }
  },

  /**
   * Get detailed information about a specific vessel.
   *
   * @param id Vessel ID
   * @returns Detailed vessel information
   */
  getById: async (id: number): Promise<VesselDetail> => {
    if (useStaticData) {
      const detail = getStaticVesselDetail(id);
      if (!detail) throw new ApiError('Vessel not found', 404);
      return detail;
    }
    try {
      return await fetchApi<VesselDetail>(`/vessels/${id}`);
    } catch {
      if (useStaticData === null) useStaticData = true;
      return vesselsApi.getById(id);
    }
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
    if (useStaticData) {
      return staticFindPath(request);
    }
    try {
      return await fetchApi<PathResponse>('/paths', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch {
      if (useStaticData === null) useStaticData = true;
      return staticFindPath(request);
    }
  },
};

/** BFS pathfinding on static edge data (undirected). */
function staticFindPath(request: PathRequest): PathResponse {
  const { sourceId, targetId } = request;
  const adj = new Map<number, number[]>();
  for (const e of staticEdges) {
    if (!adj.has(e.source)) adj.set(e.source, []);
    if (!adj.has(e.target)) adj.set(e.target, []);
    adj.get(e.source)!.push(e.target);
    adj.get(e.target)!.push(e.source);
  }
  const visited = new Set<number>([sourceId]);
  const parent = new Map<number, number>();
  const queue = [sourceId];
  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (curr === targetId) break;
    for (const neighbor of adj.get(curr) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent.set(neighbor, curr);
        queue.push(neighbor);
      }
    }
  }
  if (!parent.has(targetId) && sourceId !== targetId) {
    throw new ApiError('No path found', 404);
  }
  const ids: number[] = [];
  let cur = targetId;
  while (cur !== sourceId) {
    ids.unshift(cur);
    cur = parent.get(cur)!;
  }
  ids.unshift(sourceId);
  const path = ids.map((id) => {
    const v = staticVessels.find((v) => v.id === id)!;
    return { id: v.id, name: v.name, type: v.type };
  });
  return { path, pathLength: path.length };
}

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
