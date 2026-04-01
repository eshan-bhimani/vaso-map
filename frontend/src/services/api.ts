import type {
  Vessel,
  VesselDetail,
  VesselNeighbor,
  PathRequest,
  PathResponse,
  ErrorResponse,
} from '../types/vessel';
import { VesselType, Oxygenation } from '../types/vessel';
import {
  staticVessels,
  staticEdges,
  getStaticVesselDetail,
} from '../data/vessels';
import { supabase } from '../lib/supabase';

/** Whether to use static fallback data (set on first failed Supabase call). */
let useStaticData: boolean | null = null;

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

/* ── Supabase → frontend type mappers ── */

function mapVessel(row: any, aliases: string[]): Vessel {
  return {
    id: row.id,
    name: row.name,
    type: row.type as VesselType,
    oxygenation: row.oxygenation as Oxygenation,
    region: row.regions?.name ?? null,
    aliases,
  };
}

function mapNeighbor(row: any): VesselNeighbor {
  return { id: row.id, name: row.name, type: row.type as VesselType };
}

/* ── Vessel API ── */

export const vesselsApi = {
  getAll: async (query?: string): Promise<Vessel[]> => {
    if (useStaticData) {
      const q = query?.toLowerCase();
      return q
        ? staticVessels.filter(
            (v) =>
              v.name.toLowerCase().includes(q) ||
              v.aliases.some((a) => a.toLowerCase().includes(q)),
          )
        : staticVessels;
    }

    try {
      // Fetch vessels with region name and aliases
      const { data: vessels, error } = await supabase
        .from('vessels')
        .select('*, regions(name), aliases(alias)')
        .order('id');

      if (error) throw error;

      const result = (vessels ?? []).map((v: any) => {
        const aliases = (v.aliases ?? []).map((a: any) => a.alias);
        return mapVessel(v, aliases);
      });

      // Filter client-side if query provided
      if (query) {
        const q = query.toLowerCase();
        return result.filter(
          (v) =>
            v.name.toLowerCase().includes(q) ||
            v.aliases.some((a) => a.toLowerCase().includes(q)),
        );
      }

      useStaticData = false;
      return result;
    } catch {
      if (useStaticData === null) useStaticData = true;
      return vesselsApi.getAll(query);
    }
  },

  getById: async (id: number): Promise<VesselDetail> => {
    if (useStaticData) {
      const detail = getStaticVesselDetail(id);
      if (!detail) throw new ApiError('Vessel not found', 404);
      return detail;
    }

    try {
      const { data: vessel, error } = await supabase
        .from('vessels')
        .select('*, regions(id, name, description), aliases(alias)')
        .eq('id', id)
        .single();

      if (error || !vessel) throw new ApiError('Vessel not found', 404);

      // Get downstream neighbors (this vessel is parent)
      const { data: downEdges } = await supabase
        .from('vessel_edges')
        .select('child_id, vessels!vessel_edges_child_id_fkey(id, name, type)')
        .eq('parent_id', id);

      // Get upstream neighbors (this vessel is child)
      const { data: upEdges } = await supabase
        .from('vessel_edges')
        .select('parent_id, vessels!vessel_edges_parent_id_fkey(id, name, type)')
        .eq('child_id', id);

      const aliases = (vessel.aliases ?? []).map((a: any) => a.alias);
      const region = vessel.regions
        ? { id: vessel.regions.id, name: vessel.regions.name, description: vessel.regions.description }
        : null;

      useStaticData = false;
      return {
        id: vessel.id,
        name: vessel.name,
        type: vessel.type as VesselType,
        oxygenation: vessel.oxygenation as Oxygenation,
        diameterMinMm: vessel.diameter_min_mm ? Number(vessel.diameter_min_mm) : null,
        diameterMaxMm: vessel.diameter_max_mm ? Number(vessel.diameter_max_mm) : null,
        description: vessel.description,
        clinicalNotes: vessel.clinical_notes,
        region,
        aliases,
        upstreamNeighbors: (upEdges ?? []).map((e: any) => mapNeighbor(e.vessels)),
        downstreamNeighbors: (downEdges ?? []).map((e: any) => mapNeighbor(e.vessels)),
      };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      if (useStaticData === null) useStaticData = true;
      return vesselsApi.getById(id);
    }
  },
};

/* ── Pathfinding API ── */

export const pathsApi = {
  findPath: async (request: PathRequest): Promise<PathResponse> => {
    if (useStaticData) {
      return staticFindPath(request);
    }

    try {
      // Fetch all edges from Supabase and do BFS client-side
      const { data: edges, error } = await supabase
        .from('vessel_edges')
        .select('parent_id, child_id');

      if (error) throw error;

      const adj = new Map<number, number[]>();
      for (const e of edges ?? []) {
        if (!adj.has(e.parent_id)) adj.set(e.parent_id, []);
        if (!adj.has(e.child_id)) adj.set(e.child_id, []);
        adj.get(e.parent_id)!.push(e.child_id);
        adj.get(e.child_id)!.push(e.parent_id);
      }

      const { sourceId, targetId } = request;
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

      // Fetch vessel names for the path
      const { data: pathVessels } = await supabase
        .from('vessels')
        .select('id, name, type')
        .in('id', ids);

      const vesselMap = new Map((pathVessels ?? []).map((v: any) => [v.id, v]));
      const path = ids.map((id) => {
        const v = vesselMap.get(id)!;
        return { id: v.id, name: v.name, type: v.type as VesselType };
      });

      useStaticData = false;
      return { path, pathLength: path.length };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      if (useStaticData === null) useStaticData = true;
      return staticFindPath(request);
    }
  },
};

/** BFS pathfinding on static edge data (fallback). */
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

export const api = {
  vessels: vesselsApi,
  paths: pathsApi,
};
