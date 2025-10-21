package com.vasomap.controller;

import com.vasomap.dto.RegionDTO;
import com.vasomap.service.RegionService;
import io.swagger.v3.oas.annotations.Operation;
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
 * REST controller for region-related endpoints.
 *
 * Educational note: Regions represent anatomical areas of the body.
 * This controller provides access to the hierarchical region structure,
 * which can be used for filtering vessels by location.
 */
@RestController
@RequestMapping("/api/v1/regions")
@RequiredArgsConstructor
@Tag(name = "Regions", description = "Endpoints for anatomical regions")
public class RegionController {

	private final RegionService regionService;

	/**
	 * Get all regions in a hierarchical tree structure.
	 *
	 * Example: GET /api/v1/regions
	 *
	 * Returns top-level regions with their children nested.
	 *
	 * @return List of top-level RegionDTOs with children
	 */
	@GetMapping
	@Operation(
		summary = "Get all regions",
		description = "Retrieve all anatomical regions in a hierarchical tree structure"
	)
	@ApiResponses(value = {
		@ApiResponse(
			responseCode = "200",
			description = "Successfully retrieved regions",
			content = @Content(schema = @Schema(implementation = RegionDTO.class))
		)
	})
	public ResponseEntity<List<RegionDTO>> getAllRegions() {
		List<RegionDTO> regions = regionService.getAllRegions();
		return ResponseEntity.ok(regions);
	}
}
