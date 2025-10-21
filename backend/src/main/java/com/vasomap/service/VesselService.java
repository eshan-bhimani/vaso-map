package com.vasomap.service;

import com.vasomap.dto.VesselDTO;
import com.vasomap.dto.VesselDetailDTO;
import com.vasomap.dto.VesselDetailDTO.VesselNeighborDTO;
import com.vasomap.dto.RegionDTO;
import com.vasomap.entity.Alias;
import com.vasomap.entity.Vessel;
import com.vasomap.entity.VesselEdge;
import com.vasomap.exception.ResourceNotFoundException;
import com.vasomap.repository.VesselRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for vessel-related business logic.
 *
 * Educational note: The service layer sits between controllers and repositories.
 * It handles:
 * - Business logic and validation
 * - Transaction management
 * - Conversion between entities and DTOs
 * - Orchestration of multiple repository calls
 *
 * The @Transactional annotation ensures database consistency.
 */
@Service
@RequiredArgsConstructor
public class VesselService {

	private final VesselRepository vesselRepository;

	/**
	 * Get all vessels with optional search filtering.
	 *
	 * Educational note: If a query is provided, we search by name/alias.
	 * Otherwise, we return all vessels. This supports both the initial
	 * graph load and the search functionality.
	 *
	 * @param query Optional search term (can be null or empty)
	 * @return List of VesselDTOs
	 */
	@Transactional(readOnly = true)
	public List<VesselDTO> getAllVessels(String query) {
		List<Vessel> vessels;

		// If query is provided, search; otherwise get all
		if (query != null && !query.trim().isEmpty()) {
			vessels = vesselRepository.searchByNameOrAlias(query);
		} else {
			vessels = vesselRepository.findAllWithAliases();
		}

		// Convert entities to DTOs
		return vessels.stream()
			.map(this::convertToDTO)
			.collect(Collectors.toList());
	}

	/**
	 * Get detailed information about a specific vessel by ID.
	 *
	 * Educational note: This method eagerly loads all related data
	 * (aliases, region, notes, edges) to avoid N+1 queries.
	 * It also computes upstream and downstream neighbors.
	 *
	 * @param id The vessel ID
	 * @return VesselDetailDTO with complete vessel information
	 * @throws ResourceNotFoundException if vessel not found
	 */
	@Transactional(readOnly = true)
	public VesselDetailDTO getVesselById(Long id) {
		Vessel vessel = vesselRepository.findByIdWithDetails(id)
			.orElseThrow(() -> new ResourceNotFoundException("Vessel with id " + id + " not found"));

		return convertToDetailDTO(vessel);
	}

	/**
	 * Converts a Vessel entity to a lightweight VesselDTO.
	 *
	 * Educational note: This mapping extracts only the essential data
	 * needed for list/search displays. We avoid loading heavy relationships
	 * to keep responses fast.
	 *
	 * @param vessel The vessel entity
	 * @return VesselDTO
	 */
	private VesselDTO convertToDTO(Vessel vessel) {
		VesselDTO dto = new VesselDTO();
		dto.setId(vessel.getId());
		dto.setName(vessel.getName());
		dto.setType(vessel.getType());
		dto.setOxygenation(vessel.getOxygenation());

		// Extract region name if present
		if (vessel.getRegion() != null) {
			dto.setRegion(vessel.getRegion().getName());
		}

		// Extract alias strings from Alias entities
		dto.setAliases(
			vessel.getAliases().stream()
				.map(Alias::getAlias)
				.collect(Collectors.toList())
		);

		return dto;
	}

	/**
	 * Converts a Vessel entity to a detailed VesselDetailDTO.
	 *
	 * Educational note: This method performs comprehensive mapping including:
	 * - All vessel properties
	 * - Region information
	 * - Aliases
	 * - Upstream neighbors (parent vessels)
	 * - Downstream neighbors (child vessels)
	 *
	 * @param vessel The vessel entity with all relationships loaded
	 * @return VesselDetailDTO
	 */
	private VesselDetailDTO convertToDetailDTO(Vessel vessel) {
		VesselDetailDTO dto = new VesselDetailDTO();

		// Basic properties
		dto.setId(vessel.getId());
		dto.setName(vessel.getName());
		dto.setType(vessel.getType());
		dto.setOxygenation(vessel.getOxygenation());
		dto.setDiameterMinMm(vessel.getDiameterMinMm());
		dto.setDiameterMaxMm(vessel.getDiameterMaxMm());
		dto.setDescription(vessel.getDescription());
		dto.setClinicalNotes(vessel.getClinicalNotes());

		// Region
		if (vessel.getRegion() != null) {
			RegionDTO regionDTO = new RegionDTO();
			regionDTO.setId(vessel.getRegion().getId());
			regionDTO.setName(vessel.getRegion().getName());
			regionDTO.setDescription(vessel.getRegion().getDescription());
			dto.setRegion(regionDTO);
		}

		// Aliases
		dto.setAliases(
			vessel.getAliases().stream()
				.map(Alias::getAlias)
				.collect(Collectors.toList())
		);

		// Upstream neighbors (vessels that feed into this one)
		// These come from incoming edges where this vessel is the child
		dto.setUpstreamNeighbors(
			vessel.getIncomingEdges().stream()
				.map(VesselEdge::getParent)
				.map(this::convertToNeighborDTO)
				.collect(Collectors.toList())
		);

		// Downstream neighbors (vessels that branch from this one)
		// These come from outgoing edges where this vessel is the parent
		dto.setDownstreamNeighbors(
			vessel.getOutgoingEdges().stream()
				.map(VesselEdge::getChild)
				.map(this::convertToNeighborDTO)
				.collect(Collectors.toList())
		);

		return dto;
	}

	/**
	 * Converts a Vessel entity to a lightweight VesselNeighborDTO.
	 *
	 * @param vessel The vessel entity
	 * @return VesselNeighborDTO
	 */
	private VesselNeighborDTO convertToNeighborDTO(Vessel vessel) {
		return new VesselNeighborDTO(
			vessel.getId(),
			vessel.getName(),
			vessel.getType()
		);
	}
}
