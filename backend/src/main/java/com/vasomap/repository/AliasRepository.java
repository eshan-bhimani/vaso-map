package com.vasomap.repository;

import com.vasomap.entity.Alias;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Alias entity database operations.
 *
 * Educational note: Aliases allow vessels to be found by multiple names.
 * This is particularly important in medical terminology where multiple
 * naming conventions coexist (common names, formal names, abbreviations, etc.)
 */
@Repository
public interface AliasRepository extends JpaRepository<Alias, Long> {

	/**
	 * Find all aliases for a specific vessel.
	 *
	 * @param vesselId The vessel ID
	 * @return List of aliases for this vessel
	 */
	List<Alias> findByVesselId(Long vesselId);

	/**
	 * Find all aliases matching a specific alias text (case-insensitive).
	 *
	 * @param alias The alias text to search for
	 * @return List of alias entities with this text
	 */
	List<Alias> findByAliasIgnoreCase(String alias);
}
