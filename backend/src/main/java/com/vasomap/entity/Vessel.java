package com.vasomap.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing a blood vessel in the cardiovascular system.
 *
 * Educational note: Each vessel has properties like diameter, type, and connections
 * to other vessels. The vascular system forms a directed graph where vessels are nodes
 * and vessel_edges represent connections between them.
 */
@Entity
@Table(name = "vessels", indexes = {
	@Index(name = "idx_vessel_name", columnList = "name"),
	@Index(name = "idx_vessel_type", columnList = "type")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vessel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/**
	 * Primary anatomical name of the vessel (e.g., "Left Anterior Descending Artery")
	 */
	@Column(nullable = false)
	private String name;

	/**
	 * Type of vessel: ARTERY, VEIN, or CAPILLARY
	 */
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private VesselType type;

	/**
	 * Oxygenation status of blood flowing through this vessel
	 */
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Oxygenation oxygenation;

	/**
	 * Minimum diameter in millimeters.
	 * Vessels taper as they branch, so min/max represent the range.
	 * For example, the aorta might be 25-30mm while capillaries are 0.005-0.010mm.
	 */
	@Column(name = "diameter_min_mm", precision = 5, scale = 2)
	private BigDecimal diameterMinMm;

	/**
	 * Maximum diameter in millimeters.
	 */
	@Column(name = "diameter_max_mm", precision = 5, scale = 2)
	private BigDecimal diameterMaxMm;

	/**
	 * Detailed anatomical and functional description of the vessel.
	 */
	@Column(columnDefinition = "TEXT")
	private String description;

	/**
	 * Clinical significance, common pathologies, and medical notes.
	 * For example: "Most commonly occluded artery in myocardial infarction"
	 */
	@Column(name = "clinical_notes", columnDefinition = "TEXT")
	private String clinicalNotes;

	/**
	 * Anatomical region where this vessel is located.
	 * For coronary arteries, this would typically be "Heart".
	 */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "region_id")
	private Region region;

	/**
	 * Alternative names for this vessel (e.g., "LAD" for "Left Anterior Descending").
	 * Mapped by the vessel field in Alias entities.
	 */
	@OneToMany(mappedBy = "vessel", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Alias> aliases = new ArrayList<>();

	/**
	 * Educational notes and articles about this vessel.
	 * Mapped by the vessel field in Note entities.
	 */
	@OneToMany(mappedBy = "vessel", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Note> notes = new ArrayList<>();

	/**
	 * Edges where this vessel is the parent (vessels branching from this one).
	 * Mapped by the parent field in VesselEdge entities.
	 */
	@OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<VesselEdge> outgoingEdges = new ArrayList<>();

	/**
	 * Edges where this vessel is the child (vessels feeding into this one).
	 * Mapped by the child field in VesselEdge entities.
	 */
	@OneToMany(mappedBy = "child", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<VesselEdge> incomingEdges = new ArrayList<>();

	/**
	 * Timestamp when this vessel record was created.
	 */
	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	/**
	 * Timestamp when this vessel record was last updated.
	 */
	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;
}
