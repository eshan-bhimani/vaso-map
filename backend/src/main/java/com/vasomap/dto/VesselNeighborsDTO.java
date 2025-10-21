package com.vasomap.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Data Transfer Object for vessel neighbor queries.
 *
 * Educational note: This DTO is used when querying neighbors at a specific depth.
 * For example, you might want to find all vessels within 2 hops upstream of the LAD.
 * This supports the "Show me all vessels that feed into this artery" feature.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VesselNeighborsDTO {

	/**
	 * The vessel ID that was queried
	 */
	private Long vesselId;

	/**
	 * The name of the vessel that was queried
	 */
	private String vesselName;

	/**
	 * Depth of the neighbor search (how many hops away)
	 */
	private Integer depth;

	/**
	 * Direction of the search (upstream, downstream, or both)
	 */
	private String direction;

	/**
	 * List of neighbor vessels found
	 */
	private List<NeighborVesselDTO> neighbors;

	/**
	 * Nested DTO representing a neighbor vessel with distance information.
	 */
	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class NeighborVesselDTO {
		/**
		 * Vessel ID
		 */
		private Long id;

		/**
		 * Vessel name
		 */
		private String name;

		/**
		 * Number of hops away from the queried vessel
		 */
		private Integer distance;

		/**
		 * Relationship type (upstream, downstream)
		 */
		private String relationship;
	}
}
