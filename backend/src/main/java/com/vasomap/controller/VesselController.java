package com.vasomap.controller;

import com.vasomap.dto.VesselDTO;
import com.vasomap.dto.VesselDetailDTO;
import com.vasomap.service.VesselService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for vessel-related endpoints.
 *
 * Educational note: Controllers handle HTTP requests and responses.
 * They:
 * 1. Map URLs to methods using @GetMapping, @PostMapping, etc.
 * 2. Extract parameters from the request
 * 3. Call service methods to perform business logic
 * 4. Return responses as JSON (Spring Boot handles serialization)
 *
 * The @RestController annotation combines @Controller and @ResponseBody,
 * meaning all methods return data (not views).
 */
@RestController
@RequestMapping("/api/v1/vessels")
@RequiredArgsConstructor
@Tag(name = "Vessels", description = "Endpoints for managing and querying blood vessels")
public class VesselController {

	private final VesselService vesselService;

	/**
	 * Get all vessels, optionally filtered by a search query.
	 *
	 * Examples:
	 * - GET /api/v1/vessels - returns all vessels
	 * - GET /api/v1/vessels?query=LAD - searches for vessels matching "LAD"
	 *
	 * Educational note: @RequestParam makes the query parameter optional.
	 * The service decides whether to search or return all based on the query value.
	 *
	 * @param query Optional search term
	 * @return List of VesselDTOs
	 */
	@GetMapping
	@Operation(
		summary = "Get all vessels",
		description = "Retrieve all vessels, optionally filtered by name or alias"
	)
	@ApiResponses(value = {
		@ApiResponse(
			responseCode = "200",
			description = "Successfully retrieved vessels",
			content = @Content(schema = @Schema(implementation = VesselDTO.class))
		)
	})
	public ResponseEntity<List<VesselDTO>> getAllVessels(
		@Parameter(description = "Optional search term to filter vessels by name or alias")
		@RequestParam(required = false) String query
	) {
		List<VesselDTO> vessels = vesselService.getAllVessels(query);
		return ResponseEntity.ok(vessels);
	}

	/**
	 * Get detailed information about a specific vessel.
	 *
	 * Example: GET /api/v1/vessels/5
	 *
	 * Educational note: @PathVariable extracts the ID from the URL path.
	 * Spring automatically converts the string to a Long.
	 *
	 * @param id The vessel ID
	 * @return VesselDetailDTO with complete vessel information
	 */
	@GetMapping("/{id}")
	@Operation(
		summary = "Get vessel by ID",
		description = "Retrieve detailed information about a specific vessel including neighbors"
	)
	@ApiResponses(value = {
		@ApiResponse(
			responseCode = "200",
			description = "Successfully retrieved vessel details",
			content = @Content(schema = @Schema(implementation = VesselDetailDTO.class))
		),
		@ApiResponse(
			responseCode = "404",
			description = "Vessel not found"
		)
	})
	public ResponseEntity<VesselDetailDTO> getVesselById(
		@Parameter(description = "ID of the vessel to retrieve")
		@PathVariable Long id
	) {
		VesselDetailDTO vessel = vesselService.getVesselById(id);
		return ResponseEntity.ok(vessel);
	}
}
