package com.vasomap.repository;

import com.vasomap.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Region entity database operations.
 *
 * Educational note: Regions form a tree structure (hierarchical).
 * For example: Body > Thorax > Heart > Left Ventricle
 */
@Repository
public interface RegionRepository extends JpaRepository<Region, Long> {

	/**
	 * Find a region by its exact name.
	 *
	 * @param name The region name
	 * @return Optional containing the region if found
	 */
	Optional<Region> findByName(String name);

	/**
	 * Find all top-level regions (regions without a parent).
	 *
	 * These are the root nodes of the region hierarchy tree.
	 * For example, this might return regions like "Heart", "Brain", "Abdomen", etc.
	 *
	 * @return List of regions where parent is null
	 */
	List<Region> findByParentIsNull();

	/**
	 * Find all child regions of a given parent.
	 *
	 * @param parentId The parent region ID
	 * @return List of child regions
	 */
	List<Region> findByParentId(Long parentId);

	/**
	 * Find all regions with their children eagerly loaded.
	 *
	 * This is useful for building the complete region hierarchy tree
	 * without triggering lazy loading exceptions.
	 *
	 * @return List of all regions with children loaded
	 */
	@Query("SELECT DISTINCT r FROM Region r LEFT JOIN FETCH r.children")
	List<Region> findAllWithChildren();
}
