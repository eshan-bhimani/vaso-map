package com.vasomap.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing a directed connection between two vessels.
 *
 * Educational note: The vascular system is a directed graph. Each edge represents
 * a connection where blood flows from a parent vessel to a child vessel.
 * For example: Aorta (parent) -> Left Coronary Artery (child)
 *
 * This edge-based model allows us to:
 * - Trace pathways through the vascular system
 * - Find all vessels upstream or downstream of a given vessel
 * - Calculate shortest paths between any two vessels
 */
@Entity
@Table(name = "vessel_edges", indexes = {
	@Index(name = "idx_edges_parent", columnList = "parent_id"),
	@Index(name = "idx_edges_child", columnList = "child_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VesselEdge {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/**
	 * The parent vessel (source of the connection).
	 * In arterial trees, this is the vessel that branches into the child.
	 */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_id", nullable = false)
	private Vessel parent;

	/**
	 * The child vessel (destination of the connection).
	 * In arterial trees, this is the vessel that branches from the parent.
	 */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "child_id", nullable = false)
	private Vessel child;

	/**
	 * Direction of blood flow through this edge.
	 * Typically FORWARD, but can be REVERSE in certain physiological conditions.
	 */
	@Enumerated(EnumType.STRING)
	@Column(name = "flow_direction", nullable = false)
	private FlowDirection flowDirection;

	/**
	 * Optional label for this connection.
	 * For example: "first diagonal branch", "second septal branch"
	 * This helps identify specific branches when a parent has multiple children.
	 */
	@Column(length = 100)
	private String label;
}
