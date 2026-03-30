import type { Vessel, VesselDetail, VesselEdge, VesselType, Oxygenation } from '../types/vessel';

/* ── Color palette ── */
export const VESSEL_COLORS: Record<string, string> = {
  ARTERY:    '#e11d48',
  VEIN:      '#2563eb',
  CAPILLARY: '#7c3aed',
};

export const VESSEL_GLOW_COLORS: Record<string, string> = {
  ARTERY:    'rgba(225,29,72,0.5)',
  VEIN:      'rgba(37,99,235,0.5)',
  CAPILLARY: 'rgba(124,58,237,0.5)',
};

export const SELECTED_COLOR = '#f59e0b';
export const PATH_HIGHLIGHT_COLOR = '#22d3ee';
export const PATH_GLOW = 'rgba(34,211,238,0.55)';

export function getVesselTypeColor(type: VesselType | string): string {
  return VESSEL_COLORS[type as string] ?? '#6b7280';
}

export function getOxygenationColor(oxygenation: Oxygenation): string {
  switch (oxygenation) {
    case 'OXYGENATED':   return '#e11d48';
    case 'DEOXYGENATED': return '#2563eb';
    case 'MIXED':        return '#7c3aed';
    default:             return '#6b7280';
  }
}

/* ── Graph helpers ── */
export function buildEdgesFromVessels(_vessels: Vessel[]): VesselEdge[] {
  return [];
}

export function isVesselInPath(vesselId: number, pathHighlight: number[]): boolean {
  return pathHighlight.includes(vesselId);
}

export function isEdgeInPath(source: number, target: number, pathHighlight: number[]): boolean {
  for (let i = 0; i < pathHighlight.length - 1; i++) {
    if (pathHighlight[i] === source && pathHighlight[i + 1] === target) return true;
  }
  return false;
}

export function getVesselDisplayName(vessel: Vessel): string {
  if (vessel.aliases.length === 0) return vessel.name;
  return `${vessel.name} (${vessel.aliases.join(', ')})`;
}

export function formatDiameterRange(minMm: number | null, maxMm: number | null): string {
  if (minMm === null && maxMm === null) return 'Unknown';
  if (minMm === null) return `~${maxMm} mm`;
  if (maxMm === null) return `~${minMm} mm`;
  if (minMm === maxMm) return `${minMm} mm`;
  return `${minMm} – ${maxMm} mm`;
}

export function truncateText(text: string, maxLength: number): string {
  return text.length <= maxLength ? text : text.slice(0, maxLength - 3) + '…';
}

/* ── Anatomical data generators ── */
export function getCommonConditions(vessel: VesselDetail): Array<{ name: string; severity: 'high' | 'medium' | 'low' }> {
  const byType: Record<string, Array<{ name: string; severity: 'high' | 'medium' | 'low' }>> = {
    ARTERY: [
      { name: 'Atherosclerosis', severity: 'high' },
      { name: 'Arterial stenosis', severity: 'high' },
      { name: 'Aneurysm', severity: 'high' },
      { name: 'Thrombosis', severity: 'medium' },
      { name: 'Vasospasm', severity: 'medium' },
    ],
    VEIN: [
      { name: 'Deep vein thrombosis', severity: 'high' },
      { name: 'Varicose veins', severity: 'medium' },
      { name: 'Venous insufficiency', severity: 'medium' },
      { name: 'Phlebitis', severity: 'low' },
    ],
    CAPILLARY: [
      { name: 'Microvascular disease', severity: 'high' },
      { name: 'Capillaritis', severity: 'medium' },
      { name: 'Ischemic microangiopathy', severity: 'high' },
      { name: 'Diabetic angiopathy', severity: 'medium' },
    ],
  };
  return byType[vessel.type] ?? [];
}

export function getConnectedSystems(vessel: VesselDetail): string[] {
  const region = vessel.region?.name?.toUpperCase() ?? '';
  const byRegion: Record<string, string[]> = {
    HEAD:        ['Nervous System', 'Lymphatic System', 'Ophthalmic System'],
    THORAX:      ['Cardiovascular System', 'Respiratory System', 'Lymphatic System'],
    ABDOMEN:     ['Digestive System', 'Urinary System', 'Hepatic Portal System'],
    UPPER_LIMB:  ['Musculoskeletal System', 'Lymphatic System', 'Peripheral Nervous System'],
    LOWER_LIMB:  ['Musculoskeletal System', 'Lymphatic System', 'Peripheral Nervous System'],
    PELVIS:      ['Urogenital System', 'Lymphatic System'],
    NECK:        ['Lymphatic System', 'Nervous System'],
  };
  for (const key of Object.keys(byRegion)) {
    if (region.includes(key)) return byRegion[key];
  }
  return ['Cardiovascular System', 'Lymphatic System'];
}

export function getVesselTypeLabel(type: string): string {
  return { ARTERY: 'Artery', VEIN: 'Vein', CAPILLARY: 'Capillary' }[type] ?? type;
}

export function getOxygenationLabel(o: string): string {
  return { OXYGENATED: 'Oxygenated', DEOXYGENATED: 'Deoxygenated', MIXED: 'Mixed' }[o] ?? o;
}
