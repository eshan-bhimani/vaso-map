package com.vasomap.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for pathfinding requests.
 *
 * Educational note: This DTO represents a request to find a path between two vessels.
 * For example: "Find the path from Ascending Aorta to Left Anterior Descending Artery"
 * This is useful for understanding vascular anatomy and blood flow routes.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PathRequestDTO {

	/**
	 * ID of the source (starting) vessel
	 */
	@NotNull(message = "Source vessel ID is required")
	private Long sourceId;

	/**
	 * ID of the target (destination) vessel
	 */
	@NotNull(message = "Target vessel ID is required")
	private Long targetId;
}
