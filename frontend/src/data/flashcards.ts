export interface Flashcard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  hint?: string;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  dynamic?: boolean;
}

export const DECKS: Deck[] = [
  { id: 'coronary-anatomy', name: 'Coronary Anatomy', description: 'Vessel names, locations, diameters, and branching patterns of the coronary circulation.', icon: '\u2764\uFE0F', color: '#e11d48' },
  { id: 'clinical-significance', name: 'Clinical Significance', description: 'Pathology, interventions, and clinical relevance of each coronary vessel.', icon: '\uD83E\uDE7A', color: '#22d3ee' },
  { id: 'vascular-pathways', name: 'Vascular Pathways', description: 'Blood flow routes, upstream/downstream relationships, and collateral circulation.', icon: '\uD83E\uDEC0', color: '#2563eb' },
  { id: 'abbreviations', name: 'Abbreviations & Terminology', description: 'Essential medical abbreviations and cardiovascular terminology.', icon: '\uD83D\uDCDA', color: '#7c3aed' },
  { id: 'review', name: 'Review', description: 'Cards you flagged or are still learning. Auto-generated from your progress.', icon: '\uD83D\uDD01', color: '#f59e0b', dynamic: true },
];

export const FLASHCARDS: Flashcard[] = [
  // ── Coronary Anatomy (15 cards) ──
  { id: 'ca-1', deckId: 'coronary-anatomy', front: 'Ascending Aorta', back: 'The first section of the aorta as it exits the left ventricle. Diameter: 25\u201330 mm. Gives rise to the left and right coronary arteries from the sinuses of Valsalva.' },
  { id: 'ca-2', deckId: 'coronary-anatomy', front: 'Left Main Coronary Artery (LMCA)', back: 'Short trunk (4\u20135 mm diameter) arising from the left aortic sinus. Bifurcates into the LAD and LCx. Also called the Left Coronary Artery (LCA).', hint: 'Also known as LCA or LM' },
  { id: 'ca-3', deckId: 'coronary-anatomy', front: 'Left Anterior Descending Artery (LAD)', back: 'Travels down the anterior interventricular sulcus toward the apex. Diameter: 3\u20134 mm. Supplies the anterior wall of the LV and anterior 2/3 of the interventricular septum via diagonal and septal branches.' },
  { id: 'ca-4', deckId: 'coronary-anatomy', front: 'First Diagonal Branch (D1)', back: 'First major diagonal branch of the LAD. Diameter: 1.5\u20132 mm. Travels laterally across the anterior surface of the left ventricle, supplying the anterolateral wall.' },
  { id: 'ca-5', deckId: 'coronary-anatomy', front: 'Septal Perforator Branches (S1, S2)', back: 'Perforating branches from the LAD that penetrate the interventricular septum. S1 diameter: 1\u20131.5 mm. Supply the anterior two-thirds of the septum and the bundle of His.' },
  { id: 'ca-6', deckId: 'coronary-anatomy', front: 'Left Circumflex Artery (LCx)', back: 'Branches from the LMCA and courses in the left atrioventricular groove. Diameter: 2.5\u20133.5 mm. Wraps around the lateral and posterior aspects of the heart, supplying the lateral wall of the LV.' },
  { id: 'ca-7', deckId: 'coronary-anatomy', front: 'Obtuse Marginal Branches (OM1, OM2)', back: 'Branches from the LCx that travel down the lateral wall of the LV. OM1 diameter: 1.5\u20132 mm. Important for lateral wall perfusion and often targeted in coronary bypass surgery.' },
  { id: 'ca-8', deckId: 'coronary-anatomy', front: 'Right Coronary Artery (RCA)', back: 'Arises from the right aortic sinus. Diameter: 3\u20134 mm. Travels in the right AV groove, supplying the RV, SA node (60%), and AV node (80\u201390%). Dominant in 70\u201385% of people.' },
  { id: 'ca-9', deckId: 'coronary-anatomy', front: 'Acute Marginal Branch', back: 'Branch of the RCA along the acute margin of the right ventricle. Diameter: 1.5\u20132 mm. Supplies the right ventricular free wall. Important in right ventricular infarction.' },
  { id: 'ca-10', deckId: 'coronary-anatomy', front: 'Posterior Descending Artery (PDA)', back: 'Travels in the posterior interventricular groove. Diameter: 1.5\u20132.5 mm. Arises from the RCA in right-dominant systems (70%). Supplies the inferior LV wall and posterior 1/3 of the septum.' },
  { id: 'ca-11', deckId: 'coronary-anatomy', front: 'What is coronary dominance?', back: 'Determined by which artery gives rise to the PDA. Right dominant (70\u201385%): PDA from RCA. Left dominant (8\u201315%): PDA from LCx. Co-dominant (20%): both contribute to the inferior wall.' },
  { id: 'ca-12', deckId: 'coronary-anatomy', front: 'Where do the coronary arteries originate?', back: 'From the aortic root, specifically the sinuses of Valsalva. The LCA arises from the left aortic sinus and the RCA from the right aortic sinus, just above the aortic valve.' },
  { id: 'ca-13', deckId: 'coronary-anatomy', front: 'Great Cardiac Vein', back: 'The largest coronary vein. Runs alongside the LAD in the anterior interventricular groove, then curves posteriorly to drain into the coronary sinus. Receives tributaries from both ventricles.' },
  { id: 'ca-14', deckId: 'coronary-anatomy', front: 'Coronary Sinus', back: 'Primary venous drainage structure of the heart. Located in the posterior AV groove. Receives the great, middle, and small cardiac veins. Empties into the posterior wall of the right atrium.' },
  { id: 'ca-15', deckId: 'coronary-anatomy', front: 'Left Posterolateral Branch', back: 'Branch of the LCx supplying the posterolateral aspect of the LV. Diameter: 1\u20131.5 mm. Prominent in left-dominant coronary systems (10\u201315% of people).' },

  // ── Clinical Significance (15 cards) ──
  { id: 'cs-1', deckId: 'clinical-significance', front: 'Why is LMCA occlusion called the "widow maker"?', back: 'The LMCA supplies ~75% of the left ventricle via the LAD and LCx. Acute occlusion causes massive infarction with high mortality. Requires emergent CABG or PCI.' },
  { id: 'cs-2', deckId: 'clinical-significance', front: 'Which vessel is most commonly occluded in MI?', back: 'The LAD, accounting for 40\u201350% of all myocardial infarctions. LAD occlusion causes anterior wall MI with ST elevation in leads V1\u2013V6, I, and aVL.' },
  { id: 'cs-3', deckId: 'clinical-significance', front: 'ECG changes in proximal LAD occlusion', back: 'ST elevation in V1\u2013V6, I, aVL. Reciprocal ST depression in II, III, aVF. May also show new LBBB. High risk of cardiogenic shock due to large territory.' },
  { id: 'cs-4', deckId: 'clinical-significance', front: 'ECG changes in RCA occlusion', back: 'ST elevation in leads II, III, aVF (inferior MI). Often associated with bradycardia due to SA/AV node ischemia. Check V4R for right ventricular involvement.' },
  { id: 'cs-5', deckId: 'clinical-significance', front: 'What is right ventricular infarction?', back: 'Occurs in ~50% of inferior MIs from RCA occlusion. Diagnosed with right-sided ECG leads (V3R, V4R showing ST elevation). Requires careful fluid management\u2014preload dependent. Avoid nitrates and diuretics.' },
  { id: 'cs-6', deckId: 'clinical-significance', front: 'LCx occlusion presentation', back: 'Causes lateral wall MI: ST elevation in I, aVL, V5\u2013V6. Often called the "silent MI artery" because posterior involvement can be ECG-occult. Check posterior leads V7\u2013V9.' },
  { id: 'cs-7', deckId: 'clinical-significance', front: 'What is coronary steal syndrome?', back: 'Vasodilators (adenosine, dipyridamole) cause blood to flow preferentially through healthy vessels with intact autoregulation, reducing flow through stenotic segments. Used diagnostically in stress testing.' },
  { id: 'cs-8', deckId: 'clinical-significance', front: 'What is Wellens syndrome?', back: 'Deep T-wave inversions or biphasic T-waves in V2\u2013V3, indicating critical proximal LAD stenosis. ECG may normalize, but high risk of massive anterior MI without intervention. Pain-free at time of ECG.' },
  { id: 'cs-9', deckId: 'clinical-significance', front: 'Indications for CABG over PCI', back: 'Left main disease, three-vessel disease, diabetes with multivessel disease, reduced LVEF with multivessel disease, failed PCI. CABG provides long-term survival benefit in these groups.' },
  { id: 'cs-10', deckId: 'clinical-significance', front: 'Why is the LIMA the preferred graft in CABG?', back: 'Left Internal Mammary Artery has >90% patency at 10 years (vs ~50% for saphenous vein grafts). Resistant to atherosclerosis due to endothelial NO production. Usually grafted to the LAD.' },
  { id: 'cs-11', deckId: 'clinical-significance', front: 'What are the zones of the LAD?', back: 'Proximal (before D1), mid (between D1 and D2), distal (after D2). Proximal LAD occlusion is most dangerous\u2014affects the largest territory including diagonal and septal branches.' },
  { id: 'cs-12', deckId: 'clinical-significance', front: 'Complications of anterior wall MI', back: 'Cardiogenic shock, ventricular septal rupture (3\u20135 days post-MI), LV aneurysm, LV thrombus with risk of systemic embolization, conduction abnormalities (LBBB, bifascicular block).' },
  { id: 'cs-13', deckId: 'clinical-significance', front: 'What is de Winter pattern on ECG?', back: 'Upsloping ST depression >1mm at J-point in V1\u2013V6 with tall, prominent T-waves. Indicates acute proximal LAD occlusion. STEMI equivalent\u2014requires emergent reperfusion despite no classic ST elevation.' },
  { id: 'cs-14', deckId: 'clinical-significance', front: 'Why does RCA occlusion cause bradycardia?', back: 'The RCA supplies the SA node (60% of people) and AV node (80\u201390%). Ischemia to these structures causes sinus bradycardia, AV block (Mobitz I, complete heart block). Usually responds to atropine.' },
  { id: 'cs-15', deckId: 'clinical-significance', front: 'What is MINOCA?', back: 'Myocardial Infarction with Non-Obstructive Coronary Arteries. Causes: coronary spasm, microvascular dysfunction, plaque erosion/disruption, spontaneous coronary dissection, Takotsubo. Found in 5\u201315% of MI patients.' },

  // ── Vascular Pathways (12 cards) ──
  { id: 'vp-1', deckId: 'vascular-pathways', front: 'Trace the path: Aorta \u2192 Apex of the heart', back: 'Ascending Aorta \u2192 Left aortic sinus \u2192 LMCA \u2192 LAD \u2192 (diagonal branches to anterolateral wall) \u2192 distal LAD wraps around the apex (in 78% of patients).' },
  { id: 'vp-2', deckId: 'vascular-pathways', front: 'Trace the path: Aorta \u2192 Inferior wall of the LV', back: 'Ascending Aorta \u2192 Right aortic sinus \u2192 RCA \u2192 (courses through right AV groove) \u2192 PDA (in right-dominant hearts) \u2192 supplies inferior LV wall and posterior septum.' },
  { id: 'vp-3', deckId: 'vascular-pathways', front: 'How does venous blood return from the anterior LV to the right atrium?', back: 'Anterior LV capillaries \u2192 anterior cardiac veins / Great Cardiac Vein (alongside LAD in AIV groove) \u2192 Coronary Sinus \u2192 Right Atrium (posterior wall).' },
  { id: 'vp-4', deckId: 'vascular-pathways', front: 'What is the collateral pathway between LAD and RCA territories?', back: 'Septal perforators from the LAD anastomose with posterior septal branches from the PDA within the interventricular septum. These collaterals develop with chronic stenosis and can limit infarct size.' },
  { id: 'vp-5', deckId: 'vascular-pathways', front: 'In left-dominant circulation, trace the path to the inferior wall.', back: 'Ascending Aorta \u2192 LMCA \u2192 LCx \u2192 (courses through left AV groove) \u2192 PDA (arises from distal LCx instead of RCA) \u2192 inferior LV wall. Occurs in ~8\u201315% of people.' },
  { id: 'vp-6', deckId: 'vascular-pathways', front: 'Blood supply to the interventricular septum', back: 'Anterior 2/3: septal perforators from the LAD. Posterior 1/3: septal branches from the PDA. The bundle of His and bundle branches receive dual supply, making complete ischemic AV block less common.' },
  { id: 'vp-7', deckId: 'vascular-pathways', front: 'Blood supply to the SA node', back: 'SA nodal artery arises from the RCA in ~60% of people and from the LCx in ~40%. Courses posteriorly around the SVC-RA junction. Explains sinus bradycardia in both inferior and lateral MIs.' },
  { id: 'vp-8', deckId: 'vascular-pathways', front: 'Blood supply to the AV node', back: 'AV nodal artery arises from the RCA in 80\u201390% (at the crux of the heart). Arises from the LCx in 10\u201320%. This is why RCA occlusion commonly causes AV nodal block.' },
  { id: 'vp-9', deckId: 'vascular-pathways', front: 'Name the three tributaries of the coronary sinus.', back: '1) Great Cardiac Vein (anterior, alongside LAD). 2) Middle Cardiac Vein (posterior, alongside PDA). 3) Small Cardiac Vein (right margin, alongside RCA). Together they drain >95% of coronary venous blood.' },
  { id: 'vp-10', deckId: 'vascular-pathways', front: 'What are Thebesian veins?', back: 'Small veins that drain directly into any cardiac chamber (mostly RV and RA), bypassing the coronary sinus. Account for <5% of coronary venous drainage. Contribute to normal physiological shunting.' },
  { id: 'vp-11', deckId: 'vascular-pathways', front: 'Trace the path from the LMCA to the lateral wall of the LV.', back: 'LMCA \u2192 LCx \u2192 Obtuse Marginal branches (OM1, OM2) \u2192 lateral wall of LV. The OM branches are the main blood supply to the lateral free wall.' },
  { id: 'vp-12', deckId: 'vascular-pathways', front: 'Where does the RCA give off its acute marginal branch?', back: 'Along the acute (right) margin of the heart, before the RCA reaches the crux (junction of AV and interventricular grooves). Supplies the right ventricular free wall.' },

  // ── Abbreviations & Terminology (14 cards) ──
  { id: 'ab-1', deckId: 'abbreviations', front: 'PCI', back: 'Percutaneous Coronary Intervention. Catheter-based procedure to open stenotic coronary arteries using balloon angioplasty and/or stent placement. Primary PCI is the preferred treatment for STEMI.' },
  { id: 'ab-2', deckId: 'abbreviations', front: 'STEMI', back: 'ST-Elevation Myocardial Infarction. Complete coronary artery occlusion causing transmural ischemia. Diagnosed by \u22651mm ST elevation in \u22652 contiguous leads. Requires emergent reperfusion (<90 min door-to-balloon).' },
  { id: 'ab-3', deckId: 'abbreviations', front: 'NSTEMI', back: 'Non-ST-Elevation Myocardial Infarction. Partial coronary occlusion or microembolization causing subendocardial ischemia. Elevated troponin without ST elevation. Treated with early invasive strategy in high-risk patients.' },
  { id: 'ab-4', deckId: 'abbreviations', front: 'CABG', back: 'Coronary Artery Bypass Grafting. Open-heart surgery using arterial (LIMA, RIMA, radial) or venous (saphenous) grafts to bypass stenotic coronary segments. Pronounced "cabbage."' },
  { id: 'ab-5', deckId: 'abbreviations', front: 'FFR', back: 'Fractional Flow Reserve. Invasive pressure-wire measurement during catheterization. Ratio of distal to proximal coronary pressure during maximal hyperemia. FFR < 0.80 indicates hemodynamically significant stenosis.' },
  { id: 'ab-6', deckId: 'abbreviations', front: 'LVEF', back: 'Left Ventricular Ejection Fraction. Percentage of blood ejected from the LV per beat. Normal: 55\u201370%. Mild reduction: 40\u201354%. Moderate: 30\u201339%. Severe: <30%. Measured by echocardiography, MRI, or nuclear imaging.' },
  { id: 'ab-7', deckId: 'abbreviations', front: 'TIMI Flow Grade', back: 'Thrombolysis In Myocardial Infarction flow classification. Grade 0: no flow. Grade 1: penetration without perfusion. Grade 2: partial perfusion. Grade 3: complete perfusion. Goal of PCI is TIMI 3 flow.' },
  { id: 'ab-8', deckId: 'abbreviations', front: 'DES vs BMS', back: 'Drug-Eluting Stent vs Bare-Metal Stent. DES coated with antiproliferative drugs (sirolimus, everolimus) to prevent in-stent restenosis. DES requires longer dual antiplatelet therapy (6\u201312 months vs 1 month for BMS).' },
  { id: 'ab-9', deckId: 'abbreviations', front: 'DAPT', back: 'Dual Antiplatelet Therapy. Aspirin + P2Y12 inhibitor (clopidogrel, ticagrelor, or prasugrel). Required after stent placement to prevent stent thrombosis. Duration varies by stent type and bleeding risk.' },
  { id: 'ab-10', deckId: 'abbreviations', front: 'IVUS', back: 'Intravascular Ultrasound. Catheter-based imaging using a miniature ultrasound probe inside the coronary artery. Provides cross-sectional images of vessel wall, plaque burden, and stent apposition.' },
  { id: 'ab-11', deckId: 'abbreviations', front: 'OCT', back: 'Optical Coherence Tomography. Catheter-based imaging using near-infrared light. 10x higher resolution than IVUS (~10 \u00b5m). Best for thin-cap fibroatheroma detection, stent strut coverage, and dissection assessment.' },
  { id: 'ab-12', deckId: 'abbreviations', front: 'ACS', back: 'Acute Coronary Syndrome. Spectrum of conditions from unstable angina to NSTEMI to STEMI. Caused by acute plaque rupture or erosion with thrombus formation. All require urgent evaluation and risk stratification.' },
  { id: 'ab-13', deckId: 'abbreviations', front: 'SCAD', back: 'Spontaneous Coronary Artery Dissection. Non-atherosclerotic cause of ACS. Intimal tear or intramural hematoma compromises lumen. Most common in young women. Often managed conservatively unless flow is compromised.' },
  { id: 'ab-14', deckId: 'abbreviations', front: 'CTO', back: 'Chronic Total Occlusion. Complete coronary artery blockage present for \u226530 days. Characterized by organized thrombus and fibrocalcific plaque. PCI for CTOs requires specialized techniques (antegrade/retrograde approaches).' },
];

export function getCardsByDeck(deckId: string): Flashcard[] {
  return FLASHCARDS.filter((c) => c.deckId === deckId);
}

export function getCardById(id: string): Flashcard | undefined {
  return FLASHCARDS.find((c) => c.id === id);
}

export function getDeckById(id: string): Deck | undefined {
  return DECKS.find((d) => d.id === id);
}
