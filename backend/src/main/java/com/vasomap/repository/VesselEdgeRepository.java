package com.vasomap.repository;

import com.vasomap.entity.VesselEdge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for VesselEdge entity database operations.
 *
 * Educational note: This repository manages the graph edges connecting vessels.
 * It's crucial for pathfinding and navigating the vascular network.
 */
@Repository
public interface VesselEdgeRepository extends JpaRepository<VesselEdge, Long> {

	/**
	 * Find all edges where the given vessel is the parent.
	 * These are the "outgoing" edges showing vessels that branch FROM this vessel.
	 *
	 * @param parentId The parent vessel ID
	 * @return List of edges originating from this vessel
	 */
	List<VesselEdge> findByParentId(Long parentId);

	/**
	 * Find all edges where the given vessel is the child.
	 * These are the "incoming" edges showing vessels that feed INTO this vessel.
	 *
	 * @param childId The child vessel ID
	 * @return List of edges leading to this vessel
	 */
	List<VesselEdge> findByChildId(Long childId);

	/**
	 * Find all edges with parent and child vessels eagerly loaded.
	 *
	 * This is essential for graph operations where we need to traverse the network.
	 * Eager loading prevents N+1 queries when processing multiple edges.
	 *
	 * @return List of all edges with vessel entities loaded
	 */
	@Query("SELECT DISTINCT e FROM VesselEdge e " +
	       "LEFT JOIN FETCH e.parent " +
	       "LEFT JOIN FETCH e.child")
	List<VesselEdge> findAllWithVessels();

	/**
	 * Find all downstream neighbors (children) of a vessel.
	 *
	 * Returns the child vessels that branch from the given parent vessel.
	 * These are the vessels "downstream" in the blood flow direction.
	 *
	 * @param parentId The parent vessel ID
	 * @return List of child vessel IDs
	 */
	@Query("SELECT e.child.id FROM VesselEdge e WHERE e.parent.id = :parentId")
	List<Long> findDownstreamNeighbors(@Param("parentId") Long parentId);

	/**
	 * Find all upstream neighbors (parents) of a vessel.
	 *
	 * Returns the parent vessels that feed into the given child vessel.
	 * These are the vessels "upstream" in the blood flow direction.
	 *
	 * @param childId The child vessel ID
	 * @return List of parent vessel IDs
	 */
	@Query("SELECT e.parent.id FROM VesselEdge e WHERE e.child.id = :childId")
	List<Long> findUpstreamNeighbors(@Param("childId") Long childId);

	/**
	 * Find all edges involving a specific vessel (as either parent or child).
	 *
	 * This is useful for getting a complete view of a vessel's connections.
	 *
	 * @param vesselId The vessel ID
	 * @return List of edges where this vessel is either parent or child
	 */
	@Query("SELECT e FROM VesselEdge e " +
	       "WHERE e.parent.id = :vesselId OR e.child.id = :vesselId")
	List<VesselEdge> findAllByVesselId(@Param("vesselId") Long vesselId);
}
