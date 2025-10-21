package com.vasomap.service;

import com.vasomap.dto.RegionDTO;
import com.vasomap.entity.Region;
import com.vasomap.repository.RegionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for region-related business logic.
 *
 * Educational note: Regions provide hierarchical organization of anatomical areas.
 * This service builds a tree structure of regions that can be used for
 * filtering and categorizing vessels.
 */
@Service
@RequiredArgsConstructor
public class RegionService {

	private final RegionRepository regionRepository;

	/**
	 * Get all regions as a hierarchical tree structure.
	 *
	 * Educational note: This returns only top-level regions (those without parents),
	 * but each region includes its children recursively. This creates a tree
	 * structure that the frontend can use for navigation.
	 *
	 * Example output structure:
	 * - Heart
	 *   - Left Ventricle
	 *     - Apex
	 *   - Right Ventricle
	 * - Brain
	 *   - Cerebral Cortex
	 *
	 * @return List of top-level RegionDTOs with children
	 */
	@Transactional(readOnly = true)
	public List<RegionDTO> getAllRegions() {
		// Get all regions with their children loaded
		List<Region> allRegions = regionRepository.findAllWithChildren();

		// Filter to only top-level regions (no parent)
		return allRegions.stream()
			.filter(region -> region.getParent() == null)
			.map(this::convertToDTO)
			.collect(Collectors.toList());
	}

	/**
	 * Recursively converts a Region entity to a RegionDTO with all children.
	 *
	 * Educational note: This method uses recursion to build the tree structure.
	 * Each region is converted to a DTO, and then its children are recursively
	 * converted, maintaining the hierarchical relationship.
	 *
	 * @param region The region entity
	 * @return RegionDTO with children
	 */
	private RegionDTO convertToDTO(Region region) {
		RegionDTO dto = new RegionDTO();
		dto.setId(region.getId());
		dto.setName(region.getName());
		dto.setDescription(region.getDescription());

		// Set parent ID if parent exists
		if (region.getParent() != null) {
			dto.setParentId(region.getParent().getId());
		}

		// Recursively convert children
		if (region.getChildren() != null && !region.getChildren().isEmpty()) {
			dto.setChildren(
				region.getChildren().stream()
					.map(this::convertToDTO)
					.collect(Collectors.toList())
			);
		}

		return dto;
	}
}
