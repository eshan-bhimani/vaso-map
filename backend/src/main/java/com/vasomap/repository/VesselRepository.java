package com.vasomap.repository;

import com.vasomap.entity.Vessel;
import com.vasomap.entity.VesselType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Vessel entity database operations.
 *
 * Educational note: Spring Data JPA automatically implements this interface at runtime.
 * We only need to declare method signatures, and Spring generates the implementation.
 * Custom queries use JPQL (Java Persistence Query Language), which is database-agnostic.
 */
@Repository
public interface VesselRepository extends JpaRepository<Vessel, Long> {

	/**
	 * Find a vessel by its exact name (case-insensitive).
	 *
	 * Spring Data automatically generates: SELECT * FROM vessels WHERE LOWER(name) = LOWER(?)
	 *
	 * @param name The vessel name to search for
	 * @return Optional containing the vessel if found, empty otherwise
	 */
	Optional<Vessel> findByNameIgnoreCase(String name);

	/**
	 * Find all vessels of a specific type.
	 *
	 * @param type The vessel type (ARTERY, VEIN, or CAPILLARY)
	 * @return List of vessels matching the type
	 */
	List<Vessel> findByType(VesselType type);

	/**
	 * Search vessels by name or aliases using a custom query.
	 *
	 * This query:
	 * 1. Searches vessel names (case-insensitive, partial match)
	 * 2. LEFT JOINs with aliases to also search alternative names
	 * 3. Uses DISTINCT to avoid duplicate results when a vessel has multiple matching aliases
	 * 4. Orders results alphabetically
	 *
	 * Educational note: The :query parameter uses JPQL named parameters.
	 * LOWER() ensures case-insensitive search, and CONCAT adds SQL wildcards for partial matching.
	 *
	 * @param query The search term (will match partial names/aliases)
	 * @return List of vessels matching the query
	 */
	@Query("""
		SELECT DISTINCT v FROM Vessel v
		LEFT JOIN v.aliases a
		WHERE LOWER(v.name) LIKE LOWER(CONCAT('%', :query, '%'))
		   OR LOWER(a.alias) LIKE LOWER(CONCAT('%', :query, '%'))
		ORDER BY v.name
	""")
	List<Vessel> searchByNameOrAlias(@Param("query") String query);

	/**
	 * Find all vessels with eager loading of their aliases.
	 *
	 * This prevents the N+1 query problem by fetching aliases in a single JOIN query
	 * instead of making separate queries for each vessel's aliases.
	 *
	 * @return List of all vessels with their aliases loaded
	 */
	@Query("SELECT DISTINCT v FROM Vessel v LEFT JOIN FETCH v.aliases")
	List<Vessel> findAllWithAliases();

	/**
	 * Find a vessel by ID with all related entities eagerly loaded.
	 *
	 * This loads the vessel with its:
	 * - Aliases
	 * - Region
	 * - Notes
	 * - Outgoing edges (downstream connections)
	 * - Incoming edges (upstream connections)
	 *
	 * Multiple LEFT JOIN FETCH clauses ensure all relationships are loaded in one query.
	 *
	 * @param id The vessel ID
	 * @return Optional containing the fully-loaded vessel if found
	 */
	@Query("""
		SELECT DISTINCT v FROM Vessel v
		LEFT JOIN FETCH v.aliases
		LEFT JOIN FETCH v.region
		LEFT JOIN FETCH v.notes
		LEFT JOIN FETCH v.outgoingEdges
		LEFT JOIN FETCH v.incomingEdges
		WHERE v.id = :id
	""")
	Optional<Vessel> findByIdWithDetails(@Param("id") Long id);
}
