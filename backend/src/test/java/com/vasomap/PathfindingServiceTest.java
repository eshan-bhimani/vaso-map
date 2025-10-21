package com.vasomap;

import com.vasomap.dto.PathRequestDTO;
import com.vasomap.dto.PathResponseDTO;
import com.vasomap.entity.Oxygenation;
import com.vasomap.entity.Vessel;
import com.vasomap.entity.VesselType;
import com.vasomap.exception.ResourceNotFoundException;
import com.vasomap.repository.VesselRepository;
import com.vasomap.service.PathfindingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration tests for PathfindingService using Testcontainers.
 *
 * Educational note: Integration tests verify that components work together correctly.
 * We use Testcontainers to spin up a real PostgreSQL database for testing.
 * This ensures our recursive CTE query actually works with real PostgreSQL.
 *
 * @Testcontainers enables Testcontainers support
 * @Container marks the PostgreSQL container
 * @SpringBootTest loads the full Spring context
 */
@SpringBootTest
@Testcontainers
class PathfindingServiceTest {

	/**
	 * Testcontainers PostgreSQL instance.
	 *
	 * Educational note: This creates a Docker container with PostgreSQL.
	 * The container is automatically started before tests and stopped after.
	 * Each test run gets a fresh database with migrations applied.
	 */
	@Container
	static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine")
		.withDatabaseName("vasomap_test")
		.withUsername("test")
		.withPassword("test");

	/**
	 * Configures Spring to use the Testcontainers database.
	 *
	 * Educational note: This overrides application.yml properties to point
	 * to the Testcontainers database URL.
	 */
	@DynamicPropertySource
	static void configureProperties(DynamicPropertyRegistry registry) {
		registry.add("spring.datasource.url", postgres::getJdbcUrl);
		registry.add("spring.datasource.username", postgres::getUsername);
		registry.add("spring.datasource.password", postgres::getPassword);
	}

	@Autowired
	private PathfindingService pathfindingService;

	@Autowired
	private VesselRepository vesselRepository;

	/**
	 * Test finding a simple path in the coronary system.
	 *
	 * Educational note: This uses the seeded data from V2__seed_coronary_data.sql.
	 * We're testing a path from Ascending Aorta (id=1) to LAD (id=3).
	 * Expected path: Ascending Aorta → Left Coronary Artery → LAD
	 */
	@Test
	void findPath_fromAortaToLAD_returnsCorrectPath() {
		// Arrange
		PathRequestDTO request = new PathRequestDTO(1L, 3L);  // Aorta to LAD

		// Act
		PathResponseDTO response = pathfindingService.findPath(request);

		// Assert
		assertNotNull(response);
		assertEquals(3, response.getPathLength());
		assertEquals(3, response.getPath().size());

		// Verify path order
		assertEquals("Ascending Aorta", response.getPath().get(0).getName());
		assertEquals("Left Coronary Artery", response.getPath().get(1).getName());
		assertEquals("Left Anterior Descending Artery", response.getPath().get(2).getName());

		// Verify types
		assertEquals(VesselType.ARTERY, response.getPath().get(0).getType());
	}

	/**
	 * Test finding a longer path (4 hops).
	 *
	 * Path from Ascending Aorta (id=1) to First Diagonal (id=4).
	 * Expected: Aorta → LCA → LAD → First Diagonal
	 */
	@Test
	void findPath_fromAortaToD1_returnsLongerPath() {
		// Arrange
		PathRequestDTO request = new PathRequestDTO(1L, 4L);  // Aorta to D1

		// Act
		PathResponseDTO response = pathfindingService.findPath(request);

		// Assert
		assertEquals(4, response.getPathLength());
		assertEquals("Ascending Aorta", response.getPath().get(0).getName());
		assertEquals("Left Coronary Artery", response.getPath().get(1).getName());
		assertEquals("Left Anterior Descending Artery", response.getPath().get(2).getName());
		assertEquals("First Diagonal Branch", response.getPath().get(3).getName());
	}

	/**
	 * Test finding path from Aorta to RCA (different branch).
	 *
	 * Expected path: Aorta → RCA (2 vessels)
	 */
	@Test
	void findPath_fromAortaToRCA_returnsShortPath() {
		// Arrange
		PathRequestDTO request = new PathRequestDTO(1L, 12L);  // Aorta to RCA

		// Act
		PathResponseDTO response = pathfindingService.findPath(request);

		// Assert
		assertEquals(2, response.getPathLength());
		assertEquals("Ascending Aorta", response.getPath().get(0).getName());
		assertEquals("Right Coronary Artery", response.getPath().get(1).getName());
	}

	/**
	 * Test path where source and target are the same.
	 *
	 * Educational note: When source = target, the path should contain
	 * just that single vessel.
	 */
	@Test
	void findPath_sameSourceAndTarget_returnsSingleVessel() {
		// Arrange
		PathRequestDTO request = new PathRequestDTO(1L, 1L);  // Aorta to Aorta

		// Act
		PathResponseDTO response = pathfindingService.findPath(request);

		// Assert
		assertEquals(1, response.getPathLength());
		assertEquals(1, response.getPath().size());
		assertEquals("Ascending Aorta", response.getPath().get(0).getName());
	}

	/**
	 * Test pathfinding with non-existent source vessel.
	 *
	 * Educational note: Should throw ResourceNotFoundException.
	 */
	@Test
	void findPath_nonExistentSource_throwsException() {
		// Arrange
		PathRequestDTO request = new PathRequestDTO(999L, 1L);

		// Act & Assert
		ResourceNotFoundException exception = assertThrows(
			ResourceNotFoundException.class,
			() -> pathfindingService.findPath(request)
		);

		assertTrue(exception.getMessage().contains("999"));
		assertTrue(exception.getMessage().contains("not found"));
	}

	/**
	 * Test pathfinding with non-existent target vessel.
	 */
	@Test
	void findPath_nonExistentTarget_throwsException() {
		// Arrange
		PathRequestDTO request = new PathRequestDTO(1L, 999L);

		// Act & Assert
		ResourceNotFoundException exception = assertThrows(
			ResourceNotFoundException.class,
			() -> pathfindingService.findPath(request)
		);

		assertTrue(exception.getMessage().contains("999"));
	}

	/**
	 * Test pathfinding where no path exists (disconnected vessels).
	 *
	 * Educational note: We create a disconnected vessel that has no edges
	 * connecting it to the main graph. Pathfinding should fail gracefully.
	 */
	@Test
	void findPath_noPathExists_throwsException() {
		// Arrange: Create a disconnected vessel
		Vessel disconnected = new Vessel();
		disconnected.setName("Disconnected Test Vessel");
		disconnected.setType(VesselType.ARTERY);
		disconnected.setOxygenation(Oxygenation.OXYGENATED);
		Vessel saved = vesselRepository.save(disconnected);

		PathRequestDTO request = new PathRequestDTO(1L, saved.getId());

		// Act & Assert
		ResourceNotFoundException exception = assertThrows(
			ResourceNotFoundException.class,
			() -> pathfindingService.findPath(request)
		);

		assertTrue(exception.getMessage().contains("No path found"));
	}

	/**
	 * Test that database is properly seeded with coronary data.
	 *
	 * Educational note: This verifies our migration scripts ran correctly.
	 */
	@Test
	void database_isProperlySeeded() {
		// Assert: Check key vessels exist
		assertTrue(vesselRepository.findById(1L).isPresent(), "Ascending Aorta should exist");
		assertTrue(vesselRepository.findById(2L).isPresent(), "Left Coronary Artery should exist");
		assertTrue(vesselRepository.findById(3L).isPresent(), "LAD should exist");
		assertTrue(vesselRepository.findById(12L).isPresent(), "RCA should exist");

		// Verify we have the expected number of vessels (15 coronary vessels)
		long count = vesselRepository.count();
		assertEquals(15, count, "Should have 15 vessels seeded");
	}
}
