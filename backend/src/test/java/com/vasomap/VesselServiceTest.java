package com.vasomap;

import com.vasomap.dto.VesselDTO;
import com.vasomap.dto.VesselDetailDTO;
import com.vasomap.entity.*;
import com.vasomap.exception.ResourceNotFoundException;
import com.vasomap.repository.VesselRepository;
import com.vasomap.service.VesselService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for VesselService.
 *
 * Educational note: Unit tests verify that individual components work correctly.
 * We use Mockito to mock dependencies (repositories) so we're only testing
 * the service logic, not the database.
 *
 * @ExtendWith(MockitoExtension.class) enables Mockito annotations
 * @Mock creates a mock object
 * @InjectMocks creates the service and injects the mocks
 */
@ExtendWith(MockitoExtension.class)
class VesselServiceTest {

	@Mock
	private VesselRepository vesselRepository;

	@InjectMocks
	private VesselService vesselService;

	private Vessel testVessel;
	private Region testRegion;

	/**
	 * Set up test data before each test.
	 * This runs before every @Test method.
	 */
	@BeforeEach
	void setUp() {
		// Create test region
		testRegion = new Region();
		testRegion.setId(1L);
		testRegion.setName("Heart");
		testRegion.setDescription("The cardiovascular organ");

		// Create test vessel
		testVessel = new Vessel();
		testVessel.setId(1L);
		testVessel.setName("Left Anterior Descending Artery");
		testVessel.setType(VesselType.ARTERY);
		testVessel.setOxygenation(Oxygenation.OXYGENATED);
		testVessel.setDiameterMinMm(new BigDecimal("3.00"));
		testVessel.setDiameterMaxMm(new BigDecimal("4.00"));
		testVessel.setDescription("Supplies anterior left ventricle");
		testVessel.setClinicalNotes("Most commonly occluded in MI");
		testVessel.setRegion(testRegion);

		// Add aliases
		Alias alias1 = new Alias();
		alias1.setId(1L);
		alias1.setVessel(testVessel);
		alias1.setAlias("LAD");

		Alias alias2 = new Alias();
		alias2.setId(2L);
		alias2.setVessel(testVessel);
		alias2.setAlias("Anterior Interventricular Artery");

		testVessel.setAliases(List.of(alias1, alias2));

		// Add empty edges for simplicity
		testVessel.setIncomingEdges(new ArrayList<>());
		testVessel.setOutgoingEdges(new ArrayList<>());
	}

	/**
	 * Test getAllVessels without search query.
	 *
	 * Educational note: This tests the "get all" functionality.
	 * We mock the repository to return a list, then verify the service
	 * correctly converts it to DTOs.
	 */
	@Test
	void getAllVessels_withoutQuery_returnsAllVessels() {
		// Arrange: Set up mock behavior
		when(vesselRepository.findAllWithAliases()).thenReturn(List.of(testVessel));

		// Act: Call the service method
		List<VesselDTO> result = vesselService.getAllVessels(null);

		// Assert: Verify the results
		assertEquals(1, result.size());
		assertEquals("Left Anterior Descending Artery", result.get(0).getName());
		assertEquals(VesselType.ARTERY, result.get(0).getType());
		assertEquals("Heart", result.get(0).getRegion());
		assertEquals(2, result.get(0).getAliases().size());
		assertTrue(result.get(0).getAliases().contains("LAD"));

		// Verify the repository method was called
		verify(vesselRepository, times(1)).findAllWithAliases();
		verify(vesselRepository, never()).searchByNameOrAlias(anyString());
	}

	/**
	 * Test getAllVessels with search query.
	 */
	@Test
	void getAllVessels_withQuery_returnsFilteredVessels() {
		// Arrange
		when(vesselRepository.searchByNameOrAlias("LAD")).thenReturn(List.of(testVessel));

		// Act
		List<VesselDTO> result = vesselService.getAllVessels("LAD");

		// Assert
		assertEquals(1, result.size());
		assertEquals("Left Anterior Descending Artery", result.get(0).getName());

		verify(vesselRepository, times(1)).searchByNameOrAlias("LAD");
		verify(vesselRepository, never()).findAllWithAliases();
	}

	/**
	 * Test getAllVessels with empty query (should get all).
	 */
	@Test
	void getAllVessels_withEmptyQuery_returnsAllVessels() {
		// Arrange
		when(vesselRepository.findAllWithAliases()).thenReturn(List.of(testVessel));

		// Act
		List<VesselDTO> result = vesselService.getAllVessels("   ");

		// Assert
		assertEquals(1, result.size());
		verify(vesselRepository, times(1)).findAllWithAliases();
	}

	/**
	 * Test getVesselById with existing vessel.
	 *
	 * Educational note: This tests the happy path where the vessel exists.
	 */
	@Test
	void getVesselById_existingVessel_returnsDetailDTO() {
		// Arrange
		when(vesselRepository.findByIdWithDetails(1L)).thenReturn(Optional.of(testVessel));

		// Act
		VesselDetailDTO result = vesselService.getVesselById(1L);

		// Assert: Verify all fields are correctly mapped
		assertEquals(1L, result.getId());
		assertEquals("Left Anterior Descending Artery", result.getName());
		assertEquals(VesselType.ARTERY, result.getType());
		assertEquals(Oxygenation.OXYGENATED, result.getOxygenation());
		assertEquals(new BigDecimal("3.00"), result.getDiameterMinMm());
		assertEquals(new BigDecimal("4.00"), result.getDiameterMaxMm());
		assertEquals("Supplies anterior left ventricle", result.getDescription());
		assertEquals("Most commonly occluded in MI", result.getClinicalNotes());

		// Verify region
		assertNotNull(result.getRegion());
		assertEquals("Heart", result.getRegion().getName());

		// Verify aliases
		assertEquals(2, result.getAliases().size());
		assertTrue(result.getAliases().contains("LAD"));

		// Verify neighbors (empty in this test)
		assertEquals(0, result.getUpstreamNeighbors().size());
		assertEquals(0, result.getDownstreamNeighbors().size());

		verify(vesselRepository, times(1)).findByIdWithDetails(1L);
	}

	/**
	 * Test getVesselById with non-existing vessel.
	 *
	 * Educational note: This tests error handling.
	 * We expect a ResourceNotFoundException to be thrown.
	 */
	@Test
	void getVesselById_nonExistingVessel_throwsException() {
		// Arrange
		when(vesselRepository.findByIdWithDetails(999L)).thenReturn(Optional.empty());

		// Act & Assert: Verify exception is thrown
		ResourceNotFoundException exception = assertThrows(
			ResourceNotFoundException.class,
			() -> vesselService.getVesselById(999L)
		);

		assertTrue(exception.getMessage().contains("999"));
		assertTrue(exception.getMessage().contains("not found"));

		verify(vesselRepository, times(1)).findByIdWithDetails(999L);
	}

	/**
	 * Test that vessel with no region doesn't cause null pointer.
	 */
	@Test
	void getVesselById_vesselWithoutRegion_handlesGracefully() {
		// Arrange: Create vessel without region
		testVessel.setRegion(null);
		when(vesselRepository.findByIdWithDetails(1L)).thenReturn(Optional.of(testVessel));

		// Act
		VesselDetailDTO result = vesselService.getVesselById(1L);

		// Assert
		assertNull(result.getRegion());
		assertEquals("Left Anterior Descending Artery", result.getName());

		verify(vesselRepository, times(1)).findByIdWithDetails(1L);
	}
}
