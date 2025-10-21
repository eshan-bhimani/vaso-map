package com.vasomap.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing an alternative name for a vessel.
 *
 * Educational note: Medical terminology often has multiple names for the same structure:
 * - Common/informal names (e.g., "LAD")
 * - Formal anatomical names (e.g., "Left Anterior Descending Artery")
 * - Latin names (e.g., "Arteria coronaria sinistra")
 * - Regional variations in terminology
 *
 * Storing aliases separately allows flexible searching while maintaining
 * a single primary name for each vessel.
 */
@Entity
@Table(name = "aliases", indexes = {
	@Index(name = "idx_alias_vessel", columnList = "vessel_id"),
	@Index(name = "idx_alias_alias", columnList = "alias")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alias {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/**
	 * The vessel this alias refers to.
	 */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "vessel_id", nullable = false)
	private Vessel vessel;

	/**
	 * The alternative name/abbreviation for the vessel.
	 * Examples: "LAD", "RCA", "Widow Maker" (colloquial for LAD)
	 */
	@Column(nullable = false)
	private String alias;
}
