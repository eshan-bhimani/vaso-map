package com.vasomap.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Data Transfer Object for anatomical region information.
 *
 * Educational note: Regions form a hierarchical tree structure.
 * This DTO includes children to support building the complete hierarchy.
 * For example: Heart (root) → Left Ventricle (child) → Apex (grandchild)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegionDTO {

	/**
	 * Unique identifier for the region
	 */
	private Long id;

	/**
	 * Name of the region (e.g., "Heart", "Left Ventricle")
	 */
	private String name;

	/**
	 * ID of the parent region (null for top-level regions)
	 */
	private Long parentId;

	/**
	 * Detailed description of the region
	 */
	private String description;

	/**
	 * Child regions contained within this region.
	 * This allows the frontend to build a tree structure.
	 */
	private List<RegionDTO> children;
}
