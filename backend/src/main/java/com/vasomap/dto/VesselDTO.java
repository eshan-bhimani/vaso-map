package com.vasomap.dto;

import com.vasomap.entity.Oxygenation;
import com.vasomap.entity.VesselType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Data Transfer Object for basic vessel information.
 *
 * Educational note: DTOs are lightweight objects used for API communication.
 * They differ from entities in that they:
 * 1. Only contain data needed by the client (no internal DB details)
 * 2. Avoid circular references that would break JSON serialization
 * 3. Can combine data from multiple entities
 * 4. Are immutable representations of data at a point in time
 *
 * This DTO is used for vessel lists and search results.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VesselDTO {

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
	 * Name of the anatomical region containing this vessel
	 */
	private String region;

	/**
	 * List of alternative names for this vessel
	 */
	private List<String> aliases;
}
