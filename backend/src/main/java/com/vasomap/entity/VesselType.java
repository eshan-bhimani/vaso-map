package com.vasomap.entity;

/**
 * Enum representing the anatomical type of a blood vessel.
 *
 * Educational note: The cardiovascular system has three main vessel types:
 * - Arteries: Carry blood away from the heart (usually oxygenated except pulmonary arteries)
 * - Veins: Carry blood toward the heart (usually deoxygenated except pulmonary veins)
 * - Capillaries: Microscopic vessels where gas/nutrient exchange occurs
 */
public enum VesselType {
	/**
	 * Arteries have thick, muscular walls to withstand high pressure from the heart.
	 * They branch into smaller arterioles before reaching capillaries.
	 */
	ARTERY,

	/**
	 * Veins have thinner walls and often contain valves to prevent backflow.
	 * They merge from venules into progressively larger vessels.
	 */
	VEIN,

	/**
	 * Capillaries are single-cell-thick vessels enabling diffusion.
	 * They form networks connecting arterioles to venules.
	 */
	CAPILLARY
}
