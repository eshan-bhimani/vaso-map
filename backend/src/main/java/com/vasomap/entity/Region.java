package com.vasomap.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing an anatomical region of the body.
 *
 * Educational note: Regions provide hierarchical organization of vessels.
 * For example: "Heart" might contain "Left Ventricle", "Right Atrium", etc.
 * This allows for filtering and grouping vessels by anatomical location.
 */
@Entity
@Table(name = "regions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Region {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/**
	 * Name of the anatomical region (e.g., "Heart", "Brain", "Left Ventricle")
	 */
	@Column(nullable = false, length = 100)
	private String name;

	/**
	 * Parent region for hierarchical organization.
	 * For example, "Left Ventricle" might have parent "Heart".
	 * Null for top-level regions.
	 */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_id")
	private Region parent;

	/**
	 * Child regions contained within this region.
	 * Mapped by the parent field in the child Region entities.
	 */
	@OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
	private List<Region> children = new ArrayList<>();

	/**
	 * Detailed description of the anatomical region.
	 */
	@Column(columnDefinition = "TEXT")
	private String description;

	/**
	 * Vessels located in this region.
	 * Mapped by the region field in Vessel entities.
	 */
	@OneToMany(mappedBy = "region", cascade = CascadeType.ALL)
	private List<Vessel> vessels = new ArrayList<>();
}
