package com.vasomap.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing an educational note or article about a vessel.
 *
 * Educational note: Notes provide rich educational content in Markdown format.
 * They can include:
 * - Detailed anatomy explanations
 * - Clinical case studies
 * - Surgical considerations
 * - Imaging appearance
 * - Embryological development
 *
 * Markdown allows for formatted text, lists, links, and even embedded images.
 */
@Entity
@Table(name = "notes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Note {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/**
	 * The vessel this note is about.
	 */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "vessel_id", nullable = false)
	private Vessel vessel;

	/**
	 * Title of the note (e.g., "Clinical Significance", "Anatomical Variations")
	 */
	@Column(nullable = false, length = 200)
	private String title;

	/**
	 * Content of the note in Markdown format.
	 * Supports headings, lists, bold/italic text, links, etc.
	 */
	@Column(nullable = false, columnDefinition = "TEXT")
	private String markdown;

	/**
	 * Timestamp when this note was created.
	 */
	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;
}
