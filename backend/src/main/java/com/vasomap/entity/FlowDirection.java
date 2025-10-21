package com.vasomap.entity;

/**
 * Enum representing the direction of blood flow through a vessel edge.
 *
 * Educational note: In most vessels, blood flows in one direction due to:
 * - Heart's pumping action creating pressure gradients
 * - One-way valves in veins and the heart
 * - However, some vessels (like coronary circulation during systole/diastole)
 *   may have bidirectional flow patterns
 */
public enum FlowDirection {
	/**
	 * Normal flow direction from parent to child vessel.
	 * This is the typical direction in arterial trees.
	 */
	FORWARD,

	/**
	 * Reverse flow direction (child to parent).
	 * Less common, but can occur in certain physiological or pathological conditions.
	 */
	REVERSE
}
