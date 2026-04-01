/**
 * Static vessel data — fallback when Supabase is unreachable.
 * Mirrors the database schema for offline-capable rendering.
 */

import type { Vessel, VesselDetail, VesselEdge, VesselNeighbor } from '../types/vessel';
import { VesselType, Oxygenation } from '../types/vessel';

const regions: Record<number, { id: number; name: string; description: string }> = {
  1: { id: 1, name: 'Heart', description: 'The muscular organ that pumps blood throughout the body' },
  2: { id: 2, name: 'Thorax', description: 'The chest region containing the heart and lungs' },
  3: { id: 3, name: 'Head & Neck', description: 'The cranial and cervical region containing the brain and major sensory organs' },
  4: { id: 4, name: 'Upper Extremity', description: 'The arm, forearm, and hand' },
  5: { id: 5, name: 'Abdomen', description: 'The abdominal cavity containing digestive and urinary organs' },
  6: { id: 6, name: 'Lower Extremity', description: 'The thigh, leg, and foot' },
  7: { id: 7, name: 'Lungs', description: 'The pulmonary organs responsible for gas exchange' },
};

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
  regionId: number;
}

const A = VesselType.ARTERY;
const V = VesselType.VEIN;
const OX = Oxygenation.OXYGENATED;
const DE = Oxygenation.DEOXYGENATED;
const MX = Oxygenation.MIXED;

const vesselSeeds: VesselSeed[] = [
  // ── Coronary Circulation (1–15) ──
  { id: 1, name: 'Ascending Aorta', type: A, oxygenation: OX, diameterMinMm: 25, diameterMaxMm: 30, description: 'The first section of the aorta as it exits the left ventricle. Gives rise to the coronary arteries.', clinicalNotes: 'Aortic dissection and aneurysms are serious conditions affecting this vessel. The coronary arteries branch from the sinuses of Valsalva.', aliases: [], regionId: 1 },
  { id: 2, name: 'Left Coronary Artery', type: A, oxygenation: OX, diameterMinMm: 4, diameterMaxMm: 5, description: 'Also known as the left main coronary artery (LMCA). Arises from the left aortic sinus and quickly divides into the LAD and LCx.', clinicalNotes: 'Left main disease is particularly dangerous as it affects blood supply to a large portion of the left ventricle. Often called the "widow maker" when blocked.', aliases: ['LCA', 'Left Main', 'LMCA', 'LM'], regionId: 1 },
  { id: 3, name: 'Left Anterior Descending Artery', type: A, oxygenation: OX, diameterMinMm: 3, diameterMaxMm: 4, description: 'Travels down the anterior interventricular sulcus toward the apex of the heart. Supplies the anterior wall of the left ventricle and most of the interventricular septum.', clinicalNotes: 'The most commonly occluded coronary artery in myocardial infarction. LAD occlusion typically causes anterior wall MI. Critical for left ventricular function.', aliases: ['LAD', 'Anterior Interventricular Artery', 'Widow Maker'], regionId: 1 },
  { id: 4, name: 'First Diagonal Branch', type: A, oxygenation: OX, diameterMinMm: 1.5, diameterMaxMm: 2, description: 'The first major diagonal branch of the LAD. Travels laterally across the anterior surface of the left ventricle.', clinicalNotes: 'Supplies the anterolateral wall of the left ventricle. Important in collateral circulation.', aliases: ['D1', 'Diagonal 1'], regionId: 1 },
  { id: 5, name: 'Second Diagonal Branch', type: A, oxygenation: OX, diameterMinMm: 1, diameterMaxMm: 1.5, description: 'The second diagonal branch of the LAD, coursing laterally toward the left ventricular free wall.', clinicalNotes: 'Provides additional blood supply to the anterolateral left ventricle.', aliases: ['D2', 'Diagonal 2'], regionId: 1 },
  { id: 6, name: 'First Septal Branch', type: A, oxygenation: OX, diameterMinMm: 1, diameterMaxMm: 1.5, description: 'Perforating branch that penetrates the interventricular septum. Supplies the anterior two-thirds of the septum.', clinicalNotes: 'Critical for septal function and conduction system blood supply. The bundle of His receives blood from septal branches.', aliases: ['S1'], regionId: 1 },
  { id: 7, name: 'Second Septal Branch', type: A, oxygenation: OX, diameterMinMm: 0.8, diameterMaxMm: 1.2, description: 'Additional septal perforator supplying the interventricular septum.', clinicalNotes: 'Contributes to blood supply of the conducting system.', aliases: ['S2'], regionId: 1 },
  { id: 8, name: 'Left Circumflex Artery', type: A, oxygenation: OX, diameterMinMm: 2.5, diameterMaxMm: 3.5, description: 'Branches from the left coronary artery and courses in the left atrioventricular groove. Wraps around the lateral and posterior aspects of the heart.', clinicalNotes: 'Supplies the lateral and posterior walls of the left ventricle. LCx occlusion causes lateral wall MI. Anatomical variations are common.', aliases: ['LCx', 'LCX', 'Circumflex', 'Circumflex Artery'], regionId: 1 },
  { id: 9, name: 'First Obtuse Marginal Branch', type: A, oxygenation: OX, diameterMinMm: 1.5, diameterMaxMm: 2, description: 'The first major obtuse marginal branch from the LCx. Travels down the lateral wall of the left ventricle.', clinicalNotes: 'OM1 is important for lateral wall perfusion. Often targeted in coronary bypass surgery.', aliases: ['OM1', 'Obtuse Marginal 1'], regionId: 1 },
  { id: 10, name: 'Second Obtuse Marginal Branch', type: A, oxygenation: OX, diameterMinMm: 1.2, diameterMaxMm: 1.8, description: 'The second obtuse marginal branch supplying the lateral left ventricle.', clinicalNotes: 'Provides collateral circulation to lateral and posterior walls.', aliases: ['OM2', 'Obtuse Marginal 2'], regionId: 1 },
  { id: 11, name: 'Left Posterolateral Branch', type: A, oxygenation: OX, diameterMinMm: 1, diameterMaxMm: 1.5, description: 'Branch of the LCx supplying the posterolateral aspect of the left ventricle. Prominent in left-dominant coronary systems.', clinicalNotes: 'In 10-15% of people, this vessel system is dominant and supplies the inferior wall.', aliases: [], regionId: 1 },
  { id: 12, name: 'Right Coronary Artery', type: A, oxygenation: OX, diameterMinMm: 3, diameterMaxMm: 4, description: 'Arises from the right aortic sinus and travels in the right atrioventricular groove. Supplies the right ventricle and usually the inferior wall of the left ventricle.', clinicalNotes: 'RCA occlusion typically causes inferior wall MI. In 70% of people, the RCA is dominant and gives rise to the PDA. May cause bradycardia when occluded due to SA and AV node involvement.', aliases: ['RCA', 'Right Coronary'], regionId: 1 },
  { id: 13, name: 'Acute Marginal Branch', type: A, oxygenation: OX, diameterMinMm: 1.5, diameterMaxMm: 2, description: 'Branch of the RCA traveling along the acute margin of the right ventricle.', clinicalNotes: 'Supplies the right ventricular free wall. Important in right ventricular infarction.', aliases: [], regionId: 1 },
  { id: 14, name: 'Posterior Descending Artery', type: A, oxygenation: OX, diameterMinMm: 1.5, diameterMaxMm: 2.5, description: 'Also called the posterior interventricular artery. In right-dominant systems (70% of people), it arises from the RCA and travels in the posterior interventricular groove.', clinicalNotes: 'Supplies the inferior wall of the left ventricle and posterior third of the interventricular septum. PDA territory involvement indicates inferior MI.', aliases: ['PDA', 'Posterior Interventricular Artery'], regionId: 1 },
  { id: 15, name: 'Right Posterolateral Branch', type: A, oxygenation: OX, diameterMinMm: 1, diameterMaxMm: 1.5, description: 'Branch from the RCA supplying the posterolateral aspect of the left ventricle in right-dominant systems.', clinicalNotes: 'Part of the inferior wall blood supply. Involved in inferior/posterior MI.', aliases: [], regionId: 1 },

  // ── Aortic Arch & Great Vessels (16–26) ──
  { id: 16, name: 'Aortic Arch', type: A, oxygenation: OX, diameterMinMm: 25, diameterMaxMm: 35, description: 'The curved portion of the aorta between the ascending and descending segments. Gives rise to the brachiocephalic trunk, left common carotid, and left subclavian arteries.', clinicalNotes: 'Aortic arch aneurysms can compress the recurrent laryngeal nerve causing hoarseness. Coarctation of the aorta typically occurs just distal to the left subclavian artery origin.', aliases: [], regionId: 2 },
  { id: 17, name: 'Brachiocephalic Trunk', type: A, oxygenation: OX, diameterMinMm: 12, diameterMaxMm: 15, description: 'The first and largest branch of the aortic arch. Also called the innominate artery. Bifurcates into the right common carotid and right subclavian arteries.', clinicalNotes: 'Rarely affected by atherosclerosis in isolation. Brachiocephalic trunk stenosis can cause right arm and cerebral ischemia simultaneously.', aliases: ['Innominate Artery'], regionId: 2 },
  { id: 18, name: 'Right Common Carotid Artery', type: A, oxygenation: OX, diameterMinMm: 6, diameterMaxMm: 8, description: 'Arises from the brachiocephalic trunk. Ascends in the neck lateral to the trachea and bifurcates at C3-C4 into the internal and external carotid arteries.', clinicalNotes: 'The carotid bifurcation contains the carotid sinus (baroreceptor) and carotid body (chemoreceptor). Carotid endarterectomy is performed here for significant stenosis.', aliases: ['Right CCA'], regionId: 3 },
  { id: 19, name: 'Left Common Carotid Artery', type: A, oxygenation: OX, diameterMinMm: 6, diameterMaxMm: 8, description: 'Arises directly from the aortic arch (second branch). Ascends through the thorax and neck to bifurcate at C3-C4 level, similar to the right side.', clinicalNotes: 'Slightly longer than the right common carotid due to its thoracic origin. Same clinical significance as the right regarding atherosclerosis and stroke risk.', aliases: ['Left CCA'], regionId: 3 },
  { id: 20, name: 'Right Internal Carotid Artery', type: A, oxygenation: OX, diameterMinMm: 4, diameterMaxMm: 5.5, description: 'Ascends without branching through the carotid canal into the cranium. Supplies the anterior and middle cerebral circulation via the Circle of Willis.', clinicalNotes: 'Internal carotid dissection is an important cause of stroke in young adults. Supplies ~80% of cerebral blood flow. Stenosis >70% is indication for intervention.', aliases: ['Right ICA'], regionId: 3 },
  { id: 21, name: 'Left Internal Carotid Artery', type: A, oxygenation: OX, diameterMinMm: 4, diameterMaxMm: 5.5, description: 'Mirror of the right internal carotid. Enters the skull through the carotid canal and contributes to the Circle of Willis.', clinicalNotes: 'Same clinical significance as the right ICA. Amaurosis fugax (transient monocular blindness) is a warning sign of ICA stenosis via the ophthalmic artery.', aliases: ['Left ICA'], regionId: 3 },
  { id: 22, name: 'Right External Carotid Artery', type: A, oxygenation: OX, diameterMinMm: 3.5, diameterMaxMm: 5, description: 'Supplies the face, scalp, and meninges. Has eight named branches including the superior thyroid, facial, and maxillary arteries.', clinicalNotes: 'Important collateral pathway to the brain via anastomoses with the internal carotid system. Ligation during surgery is generally well-tolerated due to rich anastomoses.', aliases: ['Right ECA'], regionId: 3 },
  { id: 23, name: 'Left External Carotid Artery', type: A, oxygenation: OX, diameterMinMm: 3.5, diameterMaxMm: 5, description: 'Mirror of the right external carotid. Supplies the left face, scalp, and meninges with the same branching pattern.', clinicalNotes: 'The middle meningeal artery (branch of maxillary artery) is clinically important — rupture causes epidural hematoma.', aliases: ['Left ECA'], regionId: 3 },
  { id: 24, name: 'Basilar Artery', type: A, oxygenation: OX, diameterMinMm: 3, diameterMaxMm: 4.5, description: 'Formed by the union of the two vertebral arteries at the pontomedullary junction. Ascends along the ventral surface of the pons and terminates by bifurcating into the posterior cerebral arteries.', clinicalNotes: 'Basilar artery occlusion is a neurological emergency causing "locked-in syndrome." Supplies the brainstem, cerebellum, and posterior cerebrum. Basilar tip aneurysms are particularly dangerous.', aliases: [], regionId: 3 },
  { id: 25, name: 'Right Vertebral Artery', type: A, oxygenation: OX, diameterMinMm: 3, diameterMaxMm: 4, description: 'First branch of the right subclavian artery. Ascends through the transverse foramina of C6-C1 vertebrae and enters the cranium through the foramen magnum.', clinicalNotes: 'Vertebral artery dissection can occur with neck manipulation or trauma. Gives off the posterior inferior cerebellar artery (PICA) — occlusion causes lateral medullary (Wallenberg) syndrome.', aliases: ['Right VA'], regionId: 3 },
  { id: 26, name: 'Left Vertebral Artery', type: A, oxygenation: OX, diameterMinMm: 3, diameterMaxMm: 4.5, description: 'First branch of the left subclavian artery. Usually slightly larger than the right (dominant in ~50% of people). Same course through the transverse foramina.', clinicalNotes: 'Left vertebral is dominant in about half the population. Subclavian steal syndrome occurs when subclavian stenosis proximal to the vertebral origin reverses vertebral flow.', aliases: ['Left VA'], regionId: 3 },

  // ── Upper Extremity (27–32) ──
  { id: 27, name: 'Right Subclavian Artery', type: A, oxygenation: OX, diameterMinMm: 9, diameterMaxMm: 12, description: 'Arises from the brachiocephalic trunk. Courses over the first rib and becomes the axillary artery at the lateral border of the first rib.', clinicalNotes: 'Subclavian steal syndrome occurs with proximal stenosis. Thoracic outlet syndrome can compress the subclavian artery between the scalene muscles and first rib.', aliases: ['Right SCA'], regionId: 4 },
  { id: 28, name: 'Left Subclavian Artery', type: A, oxygenation: OX, diameterMinMm: 9, diameterMaxMm: 12, description: 'Arises directly from the aortic arch (third branch). Longer intrathoracic course than the right subclavian. Same distal branching pattern.', clinicalNotes: 'Third branch of the aortic arch. An aberrant right subclavian (arteria lusoria) arising as the last arch branch occurs in ~1% of people and can cause dysphagia.', aliases: ['Left SCA'], regionId: 4 },
  { id: 29, name: 'Right Axillary Artery', type: A, oxygenation: OX, diameterMinMm: 6, diameterMaxMm: 8, description: 'Continuation of the subclavian artery from the lateral border of the first rib to the lower border of teres major. Divided into three parts by pectoralis minor.', clinicalNotes: 'Commonly used for arterial access in cardiac catheterization. Anterior shoulder dislocations may injure this vessel.', aliases: [], regionId: 4 },
  { id: 30, name: 'Brachial Artery', type: A, oxygenation: OX, diameterMinMm: 3.5, diameterMaxMm: 5, description: 'Continuation of the axillary artery. Runs in the medial bicipital groove and bifurcates in the cubital fossa into the radial and ulnar arteries.', clinicalNotes: 'Primary site for blood pressure measurement. Supracondylar humerus fractures in children can injure this artery leading to Volkmann ischemic contracture.', aliases: [], regionId: 4 },
  { id: 31, name: 'Radial Artery', type: A, oxygenation: OX, diameterMinMm: 2, diameterMaxMm: 3, description: 'The smaller terminal branch of the brachial artery. Courses laterally in the forearm beneath brachioradialis. Palpable at the wrist (radial pulse).', clinicalNotes: 'Most common site for arterial line placement and radial artery catheterization in coronary angiography. Allen test ensures adequate ulnar collateral flow before harvest for CABG.', aliases: ['RA'], regionId: 4 },
  { id: 32, name: 'Ulnar Artery', type: A, oxygenation: OX, diameterMinMm: 2.5, diameterMaxMm: 3.5, description: 'The larger terminal branch of the brachial artery. Courses medially in the forearm deep to flexor carpi ulnaris. Enters the hand through Guyon canal.', clinicalNotes: 'Dominant blood supply to the hand via the superficial palmar arch. Ulnar artery thrombosis (hypothenar hammer syndrome) occurs with repetitive palmar trauma.', aliases: ['UA'], regionId: 4 },

  // ── Thoracic & Abdominal Aorta (33–38) ──
  { id: 33, name: 'Descending Thoracic Aorta', type: A, oxygenation: OX, diameterMinMm: 20, diameterMaxMm: 25, description: 'Continuation of the aortic arch from T4 to the diaphragm at T12. Gives off intercostal arteries, bronchial arteries, and esophageal branches.', clinicalNotes: 'The artery of Adamkiewicz (great radicular artery, typically T9-T12) supplies the anterior spinal artery — damage during surgery can cause paraplegia.', aliases: [], regionId: 2 },
  { id: 34, name: 'Abdominal Aorta', type: A, oxygenation: OX, diameterMinMm: 15, diameterMaxMm: 20, description: 'Continuation of the thoracic aorta from T12 to L4 where it bifurcates into the common iliac arteries.', clinicalNotes: 'Abdominal aortic aneurysm (AAA) >5.5 cm is indication for elective repair. Screening recommended for men aged 65-75 who have ever smoked. Rupture mortality is >80%.', aliases: [], regionId: 5 },
  { id: 35, name: 'Celiac Trunk', type: A, oxygenation: OX, diameterMinMm: 6, diameterMaxMm: 8, description: 'First unpaired ventral branch of the abdominal aorta at T12. Trifurcates into the left gastric, splenic, and common hepatic arteries. Supplies the foregut.', clinicalNotes: 'Median arcuate ligament syndrome occurs when the diaphragmatic crus compresses the celiac trunk. Rich collaterals with SMA via pancreaticoduodenal arcade.', aliases: ['Celiac Axis'], regionId: 5 },
  { id: 36, name: 'Superior Mesenteric Artery', type: A, oxygenation: OX, diameterMinMm: 6, diameterMaxMm: 8, description: 'Second unpaired ventral branch at L1. Supplies the midgut: duodenum (distal), jejunum, ileum, ascending colon, and proximal 2/3 of transverse colon.', clinicalNotes: 'Acute SMA occlusion is a surgical emergency causing mesenteric ischemia — "pain out of proportion to exam." SMA receives ~25% of cardiac output postprandially.', aliases: ['SMA'], regionId: 5 },
  { id: 37, name: 'Renal Arteries', type: A, oxygenation: OX, diameterMinMm: 5, diameterMaxMm: 7, description: 'Paired branches at L1-L2 level. Each kidney receives ~10% of cardiac output. The right renal artery is longer, passing behind the IVC.', clinicalNotes: 'Renal artery stenosis is a major cause of secondary hypertension (fibromuscular dysplasia in young women, atherosclerosis in elderly). Accessory renal arteries occur in ~25% of people.', aliases: [], regionId: 5 },
  { id: 38, name: 'Inferior Mesenteric Artery', type: A, oxygenation: OX, diameterMinMm: 3, diameterMaxMm: 5, description: 'Third unpaired ventral branch at L3. Supplies the hindgut: distal 1/3 transverse colon, descending colon, sigmoid colon, and upper rectum.', clinicalNotes: 'Watershed area at the splenic flexure (Griffiths point) between SMA and IMA territories is vulnerable to ischemia. The marginal artery of Drummond provides critical collateral flow.', aliases: ['IMA'], regionId: 5 },

  // ── Iliac & Lower Extremity (39–45) ──
  { id: 39, name: 'Common Iliac Artery', type: A, oxygenation: OX, diameterMinMm: 8, diameterMaxMm: 11, description: 'Terminal bifurcation of the abdominal aorta at L4. Each common iliac divides into the external and internal iliac arteries at the pelvic brim.', clinicalNotes: 'Common iliac aneurysms often coexist with AAA. The left common iliac vein passes beneath the right common iliac artery — compression causes May-Thurner syndrome.', aliases: ['CIA'], regionId: 5 },
  { id: 40, name: 'External Iliac Artery', type: A, oxygenation: OX, diameterMinMm: 7, diameterMaxMm: 9, description: 'Continuation toward the lower limb. Passes behind the inguinal ligament to become the common femoral artery.', clinicalNotes: 'Common site for peripheral vascular disease. The inferior epigastric artery is the landmark dividing direct from indirect inguinal hernias.', aliases: ['EIA'], regionId: 6 },
  { id: 41, name: 'Internal Iliac Artery', type: A, oxygenation: OX, diameterMinMm: 4, diameterMaxMm: 6, description: 'Descends into the pelvis and divides into anterior and posterior divisions. Supplies pelvic organs, gluteal muscles, and perineum.', clinicalNotes: 'Ligation controls severe pelvic hemorrhage (e.g., postpartum). The superior gluteal artery can be injured during posterior hip surgery.', aliases: ['IIA', 'Hypogastric Artery'], regionId: 5 },
  { id: 42, name: 'Common Femoral Artery', type: A, oxygenation: OX, diameterMinMm: 6, diameterMaxMm: 8, description: 'Continuation of the external iliac artery below the inguinal ligament. Located in the femoral triangle. Bifurcates into the superficial and deep femoral arteries.', clinicalNotes: 'Primary access site for cardiac catheterization. Pseudoaneurysm is a common complication. NAVEL mnemonic: nerve-artery-vein-empty space-lymphatics.', aliases: ['CFA'], regionId: 6 },
  { id: 43, name: 'Deep Femoral Artery', type: A, oxygenation: OX, diameterMinMm: 4, diameterMaxMm: 6, description: 'Also called the profunda femoris. Major blood supply to the thigh musculature. Gives off medial/lateral circumflex femoral and perforating arteries.', clinicalNotes: 'Critical collateral pathway in SFA occlusion. The medial circumflex femoral artery supplies the femoral head — disruption causes avascular necrosis after hip fracture.', aliases: ['Profunda Femoris', 'DFA'], regionId: 6 },
  { id: 44, name: 'Superficial Femoral Artery', type: A, oxygenation: OX, diameterMinMm: 5, diameterMaxMm: 7, description: 'Continuation of the common femoral artery in the thigh. Travels through the adductor canal (Hunter canal) and passes through the adductor hiatus to become the popliteal artery.', clinicalNotes: 'Most common site of peripheral arterial disease causing intermittent claudication. Endovascular stenting is first-line treatment for symptomatic disease.', aliases: ['SFA'], regionId: 6 },
  { id: 45, name: 'Popliteal Artery', type: A, oxygenation: OX, diameterMinMm: 4, diameterMaxMm: 6, description: 'Continuation of the SFA behind the knee. Passes through the popliteal fossa and trifurcates into the anterior tibial, posterior tibial, and peroneal arteries.', clinicalNotes: 'Popliteal artery aneurysm is the most common peripheral aneurysm. Knee dislocation can injure this artery (mandatory vascular assessment).', aliases: ['PA'], regionId: 6 },

  // ── Pulmonary Circulation (46–49) ──
  { id: 46, name: 'Pulmonary Trunk', type: A, oxygenation: DE, diameterMinMm: 25, diameterMaxMm: 30, description: 'Arises from the right ventricle and bifurcates into the right and left pulmonary arteries at T5-T6 level. The only artery that carries deoxygenated blood.', clinicalNotes: 'Pulmonary embolism lodges at the bifurcation (saddle PE) or in lobar/segmental branches. Pulmonary hypertension causes right heart failure.', aliases: ['Main Pulmonary Artery', 'MPA'], regionId: 7 },
  { id: 47, name: 'Right Pulmonary Artery', type: A, oxygenation: DE, diameterMinMm: 15, diameterMaxMm: 20, description: 'Longer branch passing behind the ascending aorta and SVC to reach the right lung hilum. Divides into lobar branches for the three right lung lobes.', clinicalNotes: 'Most pulmonary emboli lodge in the right pulmonary artery due to its larger caliber. CT pulmonary angiography is the gold standard for diagnosis.', aliases: ['RPA'], regionId: 7 },
  { id: 48, name: 'Left Pulmonary Artery', type: A, oxygenation: DE, diameterMinMm: 14, diameterMaxMm: 18, description: 'Shorter branch connected to the aortic arch by the ligamentum arteriosum (remnant of the ductus arteriosus). Passes over the left main bronchus.', clinicalNotes: 'Patent ductus arteriosus (PDA) causes continuous "machinery murmur" and left-to-right shunt. Treated with indomethacin or surgical ligation.', aliases: ['LPA'], regionId: 7 },
  { id: 49, name: 'Pulmonary Veins', type: V, oxygenation: OX, diameterMinMm: 10, diameterMaxMm: 15, description: 'Four pulmonary veins (two from each lung) return oxygenated blood to the left atrium. The only veins that carry oxygenated blood.', clinicalNotes: 'Pulmonary vein isolation by catheter ablation is the primary treatment for atrial fibrillation. Anomalous pulmonary venous return is a congenital defect.', aliases: [], regionId: 7 },

  // ── Major Veins (50–54) ──
  { id: 50, name: 'Superior Vena Cava', type: V, oxygenation: DE, diameterMinMm: 18, diameterMaxMm: 22, description: 'Formed by the junction of the right and left brachiocephalic veins. Drains the head, neck, upper extremities, and thorax into the right atrium.', clinicalNotes: 'SVC syndrome: obstruction (usually by lung cancer or lymphoma) causes facial/upper extremity edema, cyanosis, and distended neck veins.', aliases: ['SVC'], regionId: 2 },
  { id: 51, name: 'Inferior Vena Cava', type: V, oxygenation: DE, diameterMinMm: 20, diameterMaxMm: 30, description: 'The largest vein in the body. Formed by the confluence of the common iliac veins at L5. Passes through the diaphragm at T8 to enter the right atrium.', clinicalNotes: 'IVC filters prevent pulmonary embolism in patients who cannot be anticoagulated. Budd-Chiari syndrome is hepatic vein/IVC thrombosis.', aliases: ['IVC'], regionId: 5 },
  { id: 52, name: 'Portal Vein', type: V, oxygenation: MX, diameterMinMm: 8, diameterMaxMm: 12, description: 'Formed behind the neck of the pancreas by the union of the superior mesenteric and splenic veins. Carries nutrient-rich blood from the GI tract to the liver.', clinicalNotes: 'Portal hypertension (>10 mmHg) causes esophageal varices, caput medusae, hemorrhoids, and splenomegaly. TIPS is used for refractory portal hypertension.', aliases: [], regionId: 5 },
  { id: 53, name: 'Internal Jugular Vein', type: V, oxygenation: DE, diameterMinMm: 10, diameterMaxMm: 15, description: 'Primary venous drainage of the brain and face. Begins at the jugular foramen as continuation of the sigmoid sinus. Descends in the carotid sheath.', clinicalNotes: 'Primary site for central venous catheter placement. JVP assessment is a key cardiac exam finding — elevated in right heart failure and cardiac tamponade.', aliases: ['IJV'], regionId: 3 },
  { id: 54, name: 'Femoral Vein', type: V, oxygenation: DE, diameterMinMm: 8, diameterMaxMm: 12, description: 'Accompanies the femoral artery in the femoral triangle. Receives the great saphenous vein at the saphenofemoral junction.', clinicalNotes: 'Common site for deep vein thrombosis (DVT). Used for central venous catheterization and cardiac procedures.', aliases: ['FV'], regionId: 6 },
];

// Edge definitions: [parentId, childId]
const edgeDefs: [number, number][] = [
  // Coronary
  [1, 2], [1, 12],
  [2, 3], [2, 8],
  [3, 4], [3, 5], [3, 6], [3, 7],
  [8, 9], [8, 10], [8, 11],
  [12, 13], [12, 14], [12, 15],
  // Aortic arch & great vessels
  [1, 16],
  [16, 17], [16, 19], [16, 28], [16, 33],
  [17, 18], [17, 27],
  [18, 20], [18, 22],
  [19, 21], [19, 23],
  // Vertebrobasilar
  [27, 25], [28, 26],
  [25, 24], [26, 24],
  // Upper extremity
  [27, 29], [29, 30], [30, 31], [30, 32],
  // Thoracic → Abdominal → branches
  [33, 34],
  [34, 35], [34, 36], [34, 37], [34, 38], [34, 39],
  // Lower extremity
  [39, 40], [39, 41],
  [40, 42], [42, 43], [42, 44], [44, 45],
  // Pulmonary
  [46, 47], [46, 48],
  // Venous
  [20, 53], [53, 50], [54, 51],
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
  region: regions[v.regionId].name,
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
    region: regions[v.regionId],
    aliases: v.aliases,
    upstreamNeighbors: (upstreamMap.get(v.id) ?? []).map(toNeighbor),
    downstreamNeighbors: (downstreamMap.get(v.id) ?? []).map(toNeighbor),
  };
}

/** All edges for the graph. */
export const staticEdges: VesselEdge[] = edgeDefs.map(
  ([source, target]) => ({ id: `${source}-${target}`, source, target })
);
