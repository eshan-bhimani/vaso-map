package com.vasomap.entity;

/**
 * Enum representing the oxygenation status of blood within a vessel.
 *
 * Educational note: While arteries typically carry oxygenated blood and veins carry
 * deoxygenated blood, there are important exceptions:
 * - Pulmonary arteries carry deoxygenated blood to the lungs
 * - Pulmonary veins carry oxygenated blood from the lungs
 * - Portal systems may have mixed oxygenation
 */
public enum Oxygenation {
	/**
	 * Blood rich in oxygen (arterial blood in systemic circulation).
	 * Bright red in color due to oxyhemoglobin.
	 */
	OXYGENATED,

	/**
	 * Blood depleted of oxygen (venous blood in systemic circulation).
	 * Darker red/purple in color due to deoxyhemoglobin.
	 */
	DEOXYGENATED,

	/**
	 * Blood with mixed oxygen content.
	 * Can occur in portal systems or during cardiac shunts.
	 */
	MIXED
}
