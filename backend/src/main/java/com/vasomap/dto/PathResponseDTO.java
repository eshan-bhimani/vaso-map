package com.vasomap.dto;

import com.vasomap.entity.VesselType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Data Transfer Object for pathfinding responses.
 *
 * Educational note: This DTO represents the result of a pathfinding query.
 * It contains an ordered list of vessels forming the shortest path from source to target.
 * For example: Ascending Aorta → Left Coronary Artery → Left Anterior Descending
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PathResponseDTO {

	/**
	 * Ordered list of vessels forming the path from source to target.
	 * The first element is the source, the last element is the target.
	 */
	private List<PathVesselDTO> path;

	/**
	 * Number of vessels in the path (including source and target)
	 */
	private Integer pathLength;

	/**
	 * Nested DTO representing a vessel in the path.
	 * Lightweight to keep the response compact.
	 */
	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class PathVesselDTO {
		/**
		 * Vessel ID
		 */
		private Long id;

		/**
		 * Vessel name
		 */
		private String name;

		/**
		 * Vessel type
		 */
		private VesselType type;
	}
}
