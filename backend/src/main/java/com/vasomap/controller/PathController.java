package com.vasomap.controller;

import com.vasomap.dto.PathRequestDTO;
import com.vasomap.dto.PathResponseDTO;
import com.vasomap.service.PathfindingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for pathfinding endpoints.
 *
 * Educational note: This controller handles pathfinding queries through the
 * vascular network. It allows users to find how blood flows from one vessel
 * to another, which is useful for understanding anatomy and clinical scenarios.
 */
@RestController
@RequestMapping("/api/v1/paths")
@RequiredArgsConstructor
@Tag(name = "Pathfinding", description = "Endpoints for finding paths between vessels")
public class PathController {

	private final PathfindingService pathfindingService;

	/**
	 * Find the shortest path between two vessels.
	 *
	 * Example request body:
	 * {
	 *   "sourceId": 1,
	 *   "targetId": 5
	 * }
	 *
	 * Educational note: @Valid triggers validation on the PathRequestDTO.
	 * If validation fails (e.g., missing sourceId), Spring returns HTTP 400
	 * with validation error details.
	 *
	 * @RequestBody tells Spring to parse the JSON request body into a DTO.
	 *
	 * @param request PathRequestDTO containing source and target IDs
	 * @return PathResponseDTO with the ordered path
	 */
	@PostMapping
	@Operation(
		summary = "Find path between vessels",
		description = "Find the shortest path between two vessels in the vascular network"
	)
	@ApiResponses(value = {
		@ApiResponse(
			responseCode = "200",
			description = "Path found successfully",
			content = @Content(schema = @Schema(implementation = PathResponseDTO.class))
		),
		@ApiResponse(
			responseCode = "404",
			description = "Source or target vessel not found, or no path exists"
		),
		@ApiResponse(
			responseCode = "400",
			description = "Invalid request (missing required fields)"
		)
	})
	public ResponseEntity<PathResponseDTO> findPath(
		@Valid @RequestBody PathRequestDTO request
	) {
		PathResponseDTO path = pathfindingService.findPath(request);
		return ResponseEntity.ok(path);
	}
}
