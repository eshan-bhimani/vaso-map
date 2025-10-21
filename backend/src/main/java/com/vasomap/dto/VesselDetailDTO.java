package com.vasomap.dto;

import com.vasomap.entity.Oxygenation;
import com.vasomap.entity.VesselType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Data Transfer Object for detailed vessel information.
 *
 * Educational note: This DTO provides complete information about a vessel,
 * including its neighbors (upstream and downstream connections).
 * Used when a user selects a vessel to view full details.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VesselDetailDTO {

	/**
	 * Unique identifier for the vessel
	 */
	private Long id;

	/**
	 * Primary name of the vessel
	 */
	private String name;

	/**
	 * Type of vessel (ARTERY, VEIN, CAPILLARY)
	 */
	private VesselType type;

	/**
	 * Oxygenation status of blood in this vessel
	 */
	private Oxygenation oxygenation;

	/**
	 * Minimum diameter in millimeters
	 */
	private BigDecimal diameterMinMm;

	/**
	 * Maximum diameter in millimeters
	 */
	private BigDecimal diameterMaxMm;

	/**
	 * Detailed anatomical and functional description
	 */
	private String description;

	/**
	 * Clinical significance and medical notes
	 */
	private String clinicalNotes;

	/**
	 * Region information (nested DTO)
	 */
	private RegionDTO region;

	/**
	 * List of alternative names for this vessel
	 */
	private List<String> aliases;

	/**
	 * Vessels that feed into this vessel (coming from the heart)
	 */
	private List<VesselNeighborDTO> upstreamNeighbors;

	/**
	 * Vessels that branch from this vessel (going toward organs)
	 */
	private List<VesselNeighborDTO> downstreamNeighbors;

	/**
	 * Nested DTO representing a neighboring vessel.
	 * Lightweight to avoid deep nesting in the JSON response.
	 */
	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class VesselNeighborDTO {
		private Long id;
		private String name;
		private VesselType type;
	}
}
