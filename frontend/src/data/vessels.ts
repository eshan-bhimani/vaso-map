/**
 * Static vessel data derived from the seed SQL migration.
 * Used as a fallback when the backend API is unreachable (e.g., on Vercel without a backend).
 */

import type { Vessel, VesselDetail, VesselEdge, VesselNeighbor } from '../types/vessel';
import { VesselType, Oxygenation } from '../types/vessel';

const region = { id: 1, name: 'Heart', description: 'The muscular organ that pumps blood throughout the body' };

interface VesselSeed {
  id: number;
  name: string;
  type: VesselType;
  oxygenation: Oxygenation;
  diameterMinMm: number;
  diameterMaxMm: number;
  description: string;
  clinicalNotes: string;
  aliases: string[];
}

const vesselSeeds: VesselSeed[] = [
  { id: 1, name: 'Ascending Aorta', type: VesselType.ARTERY, oxygenation: Oxygenation.OXYGENATED, diameterMinMm: 25, diameterMaxMm: 30, description: 'The first section of the aorta as it exits the left ventricle. Gives rise to the coronary arteries.', clinicalNotes: 'Aortic dissection and aneurysms are serious conditions affecting this vessel. The coronary arteries branch from the sinuses of Valsalva.', aliases: [] },
  { id: 2, name: 'Left Coronary Artery', type: VesselType.ARTERY, oxygenation: Oxygenation.OXYGENATED, diameterMinMm: 4, diameterMaxMm: 5, description: 'Also known as the left main coronary artery (LMCA). Arises from the left aortic sinus and quickly divides into the LAD and LCx.', clinicalNotes: 'Left main disease is particularly dangerous as it affects blood supply to a large portion of the left ventricle. Often called the "widow maker" when blocked.', aliases: ['LCA', 'Left Main', 'LMCA', 'LM'] },
  { id: 3, name: 'Left Anterior Descending Artery', type: VesselType.ARTERY, oxygenation: Oxygenation.OXYGENATED, diameterMinMm: 3, diameterMaxMm: 4, description: 'Travels down the anterior interventricular sulcus toward the apex of the heart. Supplies the anterior wall of the left ventricle and most of the interventricular septum.', clinicalNotes: 'The most commonly occluded coronary artery in myocardial infarction. LAD occlusion typically causes anterior wall MI. Critical for left ventricular function.', aliases: ['LAD', 'Anterior Interventricular Artery', 'Widow Maker'] },
  { id: 4, name: 'First Diagonal Branch', type: VesselType.ARTERY, oxygenation: Oxygenation.OXYGENATED, diameterMinMm: 1.5, diameterMaxMm: 2, description: 'The first major diagonal branch of the LAD. Travels laterally across the anterior surface of the left ventricle.', clinicalNotes: 'Supplies the anterolateral wall of the left ventricle. Important in collateral circulation.', aliases: ['D1', 'Diagonal 1'] },
  { id: 5, name: 'Second Diagonal Branch', type: VesselType.ARTERY, oxygenation: Oxygenation.OXYGENATED, diameterMinMm: 1, diameterMaxMm: 1.5, description: 'The second diagonal branch of the LAD, coursing laterally toward the left ventricular free wall.', clinicalNotes: 'Provides additional blood supply to the anterolateral left ventricle.', aliases: ['D2', 'Diagonal 2'] },
  { id: 6, name: 'First Septal Branch', type: VesselType.ARTERY, oxygenation: Oxygenation.OXYGENATED, diameterMinMm: 1, diameterMaxMm: 1.5, description: 'Perforating branch that penetrates the interventricular septum. Supplies the anterior two-thirds of the septum.', clinicalNotes: 'Critical for septal function and conduction system blood supply. The bundle of His receives blood from septal branches.', aliases: ['S1'] },
  { id: 7, name: 'Second Septal Branch', type: VesselType.ARTERY, oxygenation: Oxygenation.OXYGENATED, diameterMinMm: 0.8, diameterMaxMm: 1.2, description: 'Additional septal perforator supplying the interventricular septum.', clinicalNotes: 'Contributes to blood supply of the conducting system.', aliases: ['S2'] },
  { id: 8, name: 'Left Circumflex Artery', type: VesselType.ARTERY, oxygenation: Oxygenation.OXYGENATED, diameterMinMm: 2.5, diameterMaxMm: 3.5, description: 'Branches from the left coronary artery and courses in the left atrioventricular groove. Wraps around the lateral and posterior aspects of the heart.', clinicalNotes: 'Supplies the lateral and posterior walls of the left ventricle. LCx occlusion causes lateral wall MI. Anatomical variations are common.', aliases: ['LCx', 'LCX', 'Circumflex', 'Circumflex Artery'] },
  { id: 9, name: 'First Obtuse Marginal Branch', type: VesselType.ARTERY, oxygenation: Oxygenation.OXYGENATED, diameterMinMm: 1.5, diameterMaxMm: 2, description: 'The first major obtuse marginal branch from the LCx. Travels down the lateral wall of the left ventricle.', clinicalNotes: 'OM1 is important for lateral wall perfusion. Often targeted in coronary bypass surgery.', aliases: ['OM1', 'Obtuse Marginal 1'] },
  { id: 10, name: 'Second Obtuse Marginal Branch', type: VesselType.ARTERY, oxygenation: Oxygenation.OXYGENATED, diameterMinMm: 1.2, diameterMaxMm: 1.8, description: 'The second obtuse marginal branch supplying the lateral left ventricle.', clinicalNotes: 'Provides collateral circulation to lateral and posterior walls.', aliases: ['OM2', 'Obtuse Marginal 2'] },
  { id: 11, name: 'Left Posterolateral Branch', type: VesselType.ARTERY, oxygenation: Oxygenation.OXYGENATED, diameterMinMm: 1, diameterMaxMm: 1.5, description: 'Branch of the LCx supplying the posterolateral aspect of the left ventricle. Prominent in left-dominant coronary systems.', clinicalNotes: 'In 10-15% of people, this vessel system is dominant and supplies the inferior wall.', aliases: [] },
  { id: 12, name: 'Right Coronary Artery', type: VesselType.ARTERY, oxygenation: Oxygenation.OXYGENATED, diameterMinMm: 3, diameterMaxMm: 4, description: 'Arises from the right aortic sinus and travels in the right atrioventricular groove. Supplies the right ventricle and usually the inferior wall of the left ventricle.', clinicalNotes: 'RCA occlusion typically causes inferior wall MI. In 70% of people, the RCA is dominant and gives rise to the PDA. May cause bradycardia when occluded due to SA and AV node involvement.', aliases: ['RCA', 'Right Coronary'] },
  { id: 13, name: 'Acute Marginal Branch', type: VesselType.ARTERY, oxygenation: Oxygenation.OXYGENATED, diameterMinMm: 1.5, diameterMaxMm: 2, description: 'Branch of the RCA traveling along the acute margin of the right ventricle.', clinicalNotes: 'Supplies the right ventricular free wall. Important in right ventricular infarction.', aliases: [] },
  { id: 14, name: 'Posterior Descending Artery', type: VesselType.ARTERY, oxygenation: Oxygenation.OXYGENATED, diameterMinMm: 1.5, diameterMaxMm: 2.5, description: 'Also called the posterior interventricular artery. In right-dominant systems (70% of people), it arises from the RCA and travels in the posterior interventricular groove.', clinicalNotes: 'Supplies the inferior wall of the left ventricle and posterior third of the interventricular septum. PDA territory involvement indicates inferior MI.', aliases: ['PDA', 'Posterior Interventricular Artery'] },
  { id: 15, name: 'Right Posterolateral Branch', type: VesselType.ARTERY, oxygenation: Oxygenation.OXYGENATED, diameterMinMm: 1, diameterMaxMm: 1.5, description: 'Branch from the RCA supplying the posterolateral aspect of the left ventricle in right-dominant systems.', clinicalNotes: 'Part of the inferior wall blood supply. Involved in inferior/posterior MI.', aliases: [] },
];

// Edge definitions: [parentId, childId]
const edgeDefs: [number, number][] = [
  [1, 2], [1, 12],       // Aorta → LCA, RCA
  [2, 3], [2, 8],        // LCA → LAD, LCx
  [3, 4], [3, 5],        // LAD → D1, D2
  [3, 6], [3, 7],        // LAD → S1, S2
  [8, 9], [8, 10],       // LCx → OM1, OM2
  [8, 11],               // LCx → Left Posterolateral
  [12, 13],              // RCA → Acute Marginal
  [12, 14], [12, 15],    // RCA → PDA, Right Posterolateral
];

// Build lookup maps
const vesselMap = new Map(vesselSeeds.map((v) => [v.id, v]));

const downstreamMap = new Map<number, number[]>();
const upstreamMap = new Map<number, number[]>();
for (const [parent, child] of edgeDefs) {
  if (!downstreamMap.has(parent)) downstreamMap.set(parent, []);
  downstreamMap.get(parent)!.push(child);
  if (!upstreamMap.has(child)) upstreamMap.set(child, []);
  upstreamMap.get(child)!.push(parent);
}

function toNeighbor(id: number): VesselNeighbor {
  const v = vesselMap.get(id)!;
  return { id: v.id, name: v.name, type: v.type };
}

/** All vessels (list view). */
export const staticVessels: Vessel[] = vesselSeeds.map((v) => ({
  id: v.id,
  name: v.name,
  type: v.type,
  oxygenation: v.oxygenation,
  region: region.name,
  aliases: v.aliases,
}));

/** Vessel detail by ID. */
export function getStaticVesselDetail(id: number): VesselDetail | null {
  const v = vesselMap.get(id);
  if (!v) return null;
  return {
    id: v.id,
    name: v.name,
    type: v.type,
    oxygenation: v.oxygenation,
    diameterMinMm: v.diameterMinMm,
    diameterMaxMm: v.diameterMaxMm,
    description: v.description,
    clinicalNotes: v.clinicalNotes,
    region,
    aliases: v.aliases,
    upstreamNeighbors: (upstreamMap.get(v.id) ?? []).map(toNeighbor),
    downstreamNeighbors: (downstreamMap.get(v.id) ?? []).map(toNeighbor),
  };
}

/** All edges for the graph. */
export const staticEdges: VesselEdge[] = edgeDefs.map(
  ([source, target]) => ({ id: `${source}-${target}`, source, target })
);
