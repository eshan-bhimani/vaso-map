package com.vasomap.service;

import com.vasomap.dto.PathRequestDTO;
import com.vasomap.dto.PathResponseDTO;
import com.vasomap.dto.PathResponseDTO.PathVesselDTO;
import com.vasomap.entity.Vessel;
import com.vasomap.exception.ResourceNotFoundException;
import com.vasomap.repository.VesselRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Service for pathfinding operations in the vascular network.
 *
 * Educational note: The vascular system is a directed graph where:
 * - Vessels are nodes
 * - Vessel edges are directed connections
 * - We want to find the shortest path from one vessel to another
 *
 * This service uses PostgreSQL's recursive CTEs (Common Table Expressions)
 * to perform efficient graph traversal directly in the database.
 * This is much faster than loading all data into memory.
 */
@Service
@RequiredArgsConstructor
public class PathfindingService {

	private final VesselRepository vesselRepository;

	@PersistenceContext
	private EntityManager entityManager;

	/**
	 * Find the shortest path between two vessels.
	 *
	 * Educational note: This method:
	 * 1. Validates that both source and target vessels exist
	 * 2. Uses a recursive CTE to find the shortest path
	 * 3. Converts the result to a DTO for the API response
	 *
	 * The algorithm is essentially a breadth-first search in SQL.
	 *
	 * @param request PathRequestDTO containing source and target IDs
	 * @return PathResponseDTO containing the ordered path
	 * @throws ResourceNotFoundException if either vessel doesn't exist or no path found
	 */
	@Transactional(readOnly = true)
	public PathResponseDTO findPath(PathRequestDTO request) {
		Long sourceId = request.getSourceId();
		Long targetId = request.getTargetId();

		// Validate that both vessels exist
		Vessel source = vesselRepository.findById(sourceId)
			.orElseThrow(() -> new ResourceNotFoundException("Source vessel with id " + sourceId + " not found"));

		Vessel target = vesselRepository.findById(targetId)
			.orElseThrow(() -> new ResourceNotFoundException("Target vessel with id " + targetId + " not found"));

		// If source and target are the same, return a path with just that vessel
		if (sourceId.equals(targetId)) {
			PathVesselDTO pathVessel = new PathVesselDTO(source.getId(), source.getName(), source.getType());
			return new PathResponseDTO(List.of(pathVessel), 1);
		}

		// Execute recursive CTE query to find shortest path
		List<Long> pathIds = findShortestPath(sourceId, targetId);

		if (pathIds.isEmpty()) {
			throw new ResourceNotFoundException(
				"No path found from vessel '" + source.getName() + "' to vessel '" + target.getName() + "'"
			);
		}

		// Convert vessel IDs to full vessel information
		List<PathVesselDTO> pathVessels = new ArrayList<>();
		for (Long vesselId : pathIds) {
			Vessel vessel = vesselRepository.findById(vesselId)
				.orElseThrow(() -> new ResourceNotFoundException("Vessel with id " + vesselId + " not found"));
			pathVessels.add(new PathVesselDTO(vessel.getId(), vessel.getName(), vessel.getType()));
		}

		return new PathResponseDTO(pathVessels, pathVessels.size());
	}

	/**
	 * Executes a recursive CTE query to find the shortest path.
	 *
	 * Educational note: PostgreSQL's WITH RECURSIVE allows us to perform
	 * graph traversal in SQL. The query works as follows:
	 *
	 * 1. Base case: Start with all edges from the source vessel
	 * 2. Recursive case: From each vessel in the current path, explore its children
	 * 3. Stop conditions:
	 *    - Don't revisit vessels (prevents cycles)
	 *    - Maximum depth of 20 (prevents infinite loops)
	 *    - Stop when we reach the target
	 * 4. Return the shortest path that reaches the target
	 *
	 * This is essentially a breadth-first search implemented in SQL.
	 *
	 * @param sourceId Starting vessel ID
	 * @param targetId Destination vessel ID
	 * @return List of vessel IDs forming the path (ordered)
	 */
	@SuppressWarnings("unchecked")
	private List<Long> findShortestPath(Long sourceId, Long targetId) {
		String sql = """
			WITH RECURSIVE vessel_path AS (
				-- Base case: Start with edges from the source vessel
				SELECT
					e.child_id as vessel_id,
					ARRAY[:sourceId, e.child_id] as path,
					1 as depth
				FROM vessel_edges e
				WHERE e.parent_id = :sourceId

				UNION ALL

				-- Recursive case: Extend paths from current vessels
				SELECT
					e.child_id,
					vp.path || e.child_id,
					vp.depth + 1
				FROM vessel_edges e
				INNER JOIN vessel_path vp ON e.parent_id = vp.vessel_id
				WHERE
					-- Prevent cycles by checking if vessel is already in path
					NOT e.child_id = ANY(vp.path)
					-- Limit depth to prevent excessive recursion
					AND vp.depth < 20
					-- Stop exploring once we've reached the target
					AND vp.vessel_id != :targetId
			)
			-- Select the shortest path that reaches the target
			SELECT path FROM vessel_path
			WHERE vessel_id = :targetId
			ORDER BY depth
			LIMIT 1
		""";

		Query query = entityManager.createNativeQuery(sql);
		query.setParameter("sourceId", sourceId);
		query.setParameter("targetId", targetId);

		List<Object> results = query.getResultList();

		if (results.isEmpty()) {
			return List.of();
		}

		// PostgreSQL returns array as java.sql.Array or Object[]
		Object result = results.get(0);

		// Convert the result to a List<Long>
		if (result instanceof Object[]) {
			Object[] arr = (Object[]) result;
			List<Long> pathIds = new ArrayList<>();
			for (Object obj : arr) {
				if (obj instanceof Number) {
					pathIds.add(((Number) obj).longValue());
				}
			}
			return pathIds;
		}

		return List.of();
	}
}
