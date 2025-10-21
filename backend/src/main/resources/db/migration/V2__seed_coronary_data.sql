-- Seed data for coronary arteries
-- Educational note: This seeds the database with the coronary circulation system,
-- which supplies oxygenated blood to the heart muscle itself.

-- Insert regions
INSERT INTO regions (id, name, description) VALUES
(1, 'Heart', 'The muscular organ that pumps blood throughout the body'),
(2, 'Thorax', 'The chest region containing the heart and lungs');

-- Insert vessels (coronary arteries)
-- Educational note: Coronary arteries branch from the ascending aorta and supply the heart muscle

-- Root: Ascending Aorta (starting point for coronary circulation)
INSERT INTO vessels (id, name, type, oxygenation, diameter_min_mm, diameter_max_mm, description, clinical_notes, region_id) VALUES
(1, 'Ascending Aorta', 'ARTERY', 'OXYGENATED', 25.00, 30.00,
 'The first section of the aorta as it exits the left ventricle. Gives rise to the coronary arteries.',
 'Aortic dissection and aneurysms are serious conditions affecting this vessel. The coronary arteries branch from the sinuses of Valsalva.',
 1);

-- Left Coronary Artery (LCA) - main branch
INSERT INTO vessels (id, name, type, oxygenation, diameter_min_mm, diameter_max_mm, description, clinical_notes, region_id) VALUES
(2, 'Left Coronary Artery', 'ARTERY', 'OXYGENATED', 4.00, 5.00,
 'Also known as the left main coronary artery (LMCA). Arises from the left aortic sinus and quickly divides into the LAD and LCx.',
 'Left main disease is particularly dangerous as it affects blood supply to a large portion of the left ventricle. Often called the "widow maker" when blocked.',
 1);

-- Left Anterior Descending (LAD)
INSERT INTO vessels (id, name, type, oxygenation, diameter_min_mm, diameter_max_mm, description, clinical_notes, region_id) VALUES
(3, 'Left Anterior Descending Artery', 'ARTERY', 'OXYGENATED', 3.00, 4.00,
 'Travels down the anterior interventricular sulcus toward the apex of the heart. Supplies the anterior wall of the left ventricle and most of the interventricular septum.',
 'The most commonly occluded coronary artery in myocardial infarction. LAD occlusion typically causes anterior wall MI. Critical for left ventricular function.',
 1);

-- LAD branches: Diagonal branches
INSERT INTO vessels (id, name, type, oxygenation, diameter_min_mm, diameter_max_mm, description, clinical_notes, region_id) VALUES
(4, 'First Diagonal Branch', 'ARTERY', 'OXYGENATED', 1.50, 2.00,
 'The first major diagonal branch of the LAD. Travels laterally across the anterior surface of the left ventricle.',
 'Supplies the anterolateral wall of the left ventricle. Important in collateral circulation.',
 1),
(5, 'Second Diagonal Branch', 'ARTERY', 'OXYGENATED', 1.00, 1.50,
 'The second diagonal branch of the LAD, coursing laterally toward the left ventricular free wall.',
 'Provides additional blood supply to the anterolateral left ventricle.',
 1);

-- LAD branches: Septal branches
INSERT INTO vessels (id, name, type, oxygenation, diameter_min_mm, diameter_max_mm, description, clinical_notes, region_id) VALUES
(6, 'First Septal Branch', 'ARTERY', 'OXYGENATED', 1.00, 1.50,
 'Perforating branch that penetrates the interventricular septum. Supplies the anterior two-thirds of the septum.',
 'Critical for septal function and conduction system blood supply. The bundle of His receives blood from septal branches.',
 1),
(7, 'Second Septal Branch', 'ARTERY', 'OXYGENATED', 0.80, 1.20,
 'Additional septal perforator supplying the interventricular septum.',
 'Contributes to blood supply of the conducting system.',
 1);

-- Left Circumflex (LCx)
INSERT INTO vessels (id, name, type, oxygenation, diameter_min_mm, diameter_max_mm, description, clinical_notes, region_id) VALUES
(8, 'Left Circumflex Artery', 'ARTERY', 'OXYGENATED', 2.50, 3.50,
 'Branches from the left coronary artery and courses in the left atrioventricular groove. Wraps around the lateral and posterior aspects of the heart.',
 'Supplies the lateral and posterior walls of the left ventricle. LCx occlusion causes lateral wall MI. Anatomical variations are common.',
 1);

-- LCx branches: Obtuse Marginal branches
INSERT INTO vessels (id, name, type, oxygenation, diameter_min_mm, diameter_max_mm, description, clinical_notes, region_id) VALUES
(9, 'First Obtuse Marginal Branch', 'ARTERY', 'OXYGENATED', 1.50, 2.00,
 'The first major obtuse marginal branch from the LCx. Travels down the lateral wall of the left ventricle.',
 'OM1 is important for lateral wall perfusion. Often targeted in coronary bypass surgery.',
 1),
(10, 'Second Obtuse Marginal Branch', 'ARTERY', 'OXYGENATED', 1.20, 1.80,
 'The second obtuse marginal branch supplying the lateral left ventricle.',
 'Provides collateral circulation to lateral and posterior walls.',
 1);

-- LCx branch: Left Posterolateral (in left-dominant systems)
INSERT INTO vessels (id, name, type, oxygenation, diameter_min_mm, diameter_max_mm, description, clinical_notes, region_id) VALUES
(11, 'Left Posterolateral Branch', 'ARTERY', 'OXYGENATED', 1.00, 1.50,
 'Branch of the LCx supplying the posterolateral aspect of the left ventricle. Prominent in left-dominant coronary systems.',
 'In 10-15% of people, this vessel system is dominant and supplies the inferior wall.',
 1);

-- Right Coronary Artery (RCA)
INSERT INTO vessels (id, name, type, oxygenation, diameter_min_mm, diameter_max_mm, description, clinical_notes, region_id) VALUES
(12, 'Right Coronary Artery', 'ARTERY', 'OXYGENATED', 3.00, 4.00,
 'Arises from the right aortic sinus and travels in the right atrioventricular groove. Supplies the right ventricle and usually the inferior wall of the left ventricle.',
 'RCA occlusion typically causes inferior wall MI. In 70% of people, the RCA is dominant and gives rise to the PDA. May cause bradycardia when occluded due to SA and AV node involvement.',
 1);

-- RCA branch: Acute Marginal
INSERT INTO vessels (id, name, type, oxygenation, diameter_min_mm, diameter_max_mm, description, clinical_notes, region_id) VALUES
(13, 'Acute Marginal Branch', 'ARTERY', 'OXYGENATED', 1.50, 2.00,
 'Branch of the RCA traveling along the acute margin of the right ventricle.',
 'Supplies the right ventricular free wall. Important in right ventricular infarction.',
 1);

-- RCA branch: Posterior Descending Artery (PDA)
INSERT INTO vessels (id, name, type, oxygenation, diameter_min_mm, diameter_max_mm, description, clinical_notes, region_id) VALUES
(14, 'Posterior Descending Artery', 'ARTERY', 'OXYGENATED', 1.50, 2.50,
 'Also called the posterior interventricular artery. In right-dominant systems (70% of people), it arises from the RCA and travels in the posterior interventricular groove.',
 'Supplies the inferior wall of the left ventricle and posterior third of the interventricular septum. PDA territory involvement indicates inferior MI.',
 1);

-- RCA branch: Right Posterolateral
INSERT INTO vessels (id, name, type, oxygenation, diameter_min_mm, diameter_max_mm, description, clinical_notes, region_id) VALUES
(15, 'Right Posterolateral Branch', 'ARTERY', 'OXYGENATED', 1.00, 1.50,
 'Branch from the RCA supplying the posterolateral aspect of the left ventricle in right-dominant systems.',
 'Part of the inferior wall blood supply. Involved in inferior/posterior MI.',
 1);

-- Insert vessel edges (connections between vessels)
-- Educational note: These edges form a directed graph representing blood flow

-- Aorta → Left and Right Coronary Arteries
INSERT INTO vessel_edges (parent_id, child_id, flow_direction, label) VALUES
(1, 2, 'FORWARD', 'Left coronary ostium'),
(1, 12, 'FORWARD', 'Right coronary ostium');

-- Left Coronary Artery → LAD and LCx
INSERT INTO vessel_edges (parent_id, child_id, flow_direction, label) VALUES
(2, 3, 'FORWARD', 'LAD branch'),
(2, 8, 'FORWARD', 'LCx branch');

-- LAD → Diagonal branches
INSERT INTO vessel_edges (parent_id, child_id, flow_direction, label) VALUES
(3, 4, 'FORWARD', 'D1 - First diagonal'),
(3, 5, 'FORWARD', 'D2 - Second diagonal');

-- LAD → Septal branches
INSERT INTO vessel_edges (parent_id, child_id, flow_direction, label) VALUES
(3, 6, 'FORWARD', 'S1 - First septal'),
(3, 7, 'FORWARD', 'S2 - Second septal');

-- LCx → Obtuse Marginal branches
INSERT INTO vessel_edges (parent_id, child_id, flow_direction, label) VALUES
(8, 9, 'FORWARD', 'OM1 - First obtuse marginal'),
(8, 10, 'FORWARD', 'OM2 - Second obtuse marginal');

-- LCx → Left Posterolateral
INSERT INTO vessel_edges (parent_id, child_id, flow_direction, label) VALUES
(8, 11, 'FORWARD', 'Left posterolateral');

-- RCA → Acute Marginal
INSERT INTO vessel_edges (parent_id, child_id, flow_direction, label) VALUES
(12, 13, 'FORWARD', 'Acute marginal');

-- RCA → PDA and Right Posterolateral
INSERT INTO vessel_edges (parent_id, child_id, flow_direction, label) VALUES
(12, 14, 'FORWARD', 'PDA'),
(12, 15, 'FORWARD', 'Right posterolateral');

-- Insert aliases for common abbreviations and alternative names
INSERT INTO aliases (vessel_id, alias) VALUES
-- Left Coronary Artery
(2, 'LCA'),
(2, 'Left Main'),
(2, 'LMCA'),
(2, 'LM'),

-- LAD
(3, 'LAD'),
(3, 'Anterior Interventricular Artery'),
(3, 'Widow Maker'),

-- Diagonal branches
(4, 'D1'),
(4, 'Diagonal 1'),
(5, 'D2'),
(5, 'Diagonal 2'),

-- Septal branches
(6, 'S1'),
(7, 'S2'),

-- LCx
(8, 'LCx'),
(8, 'LCX'),
(8, 'Circumflex'),
(8, 'Circumflex Artery'),

-- Obtuse Marginal
(9, 'OM1'),
(9, 'Obtuse Marginal 1'),
(10, 'OM2'),
(10, 'Obtuse Marginal 2'),

-- RCA
(12, 'RCA'),
(12, 'Right Coronary'),

-- PDA
(14, 'PDA'),
(14, 'Posterior Interventricular Artery');

-- Insert educational notes for key vessels
INSERT INTO notes (vessel_id, title, markdown) VALUES
(3, 'Clinical Significance of LAD Occlusion', E'## Anterior Wall Myocardial Infarction

The LAD is the most commonly occluded coronary artery, accounting for 40-50% of myocardial infarctions.

### Territory Supplied
- Anterior wall of left ventricle
- Anterolateral wall (via diagonal branches)
- Anterior 2/3 of interventricular septum (via septal branches)
- Apex of the heart

### ECG Changes in LAD Occlusion
**Proximal LAD occlusion:**
- ST elevation in V1-V6, I, aVL
- Reciprocal ST depression in II, III, aVF

**Mid-LAD occlusion (after D1):**
- ST elevation in V2-V4

### Clinical Implications
- High risk of cardiogenic shock due to large territory affected
- May cause ventricular septal rupture
- Can affect conduction system (bundle branches)
- Associated with highest mortality in acute MI

### Treatment
- Urgent reperfusion therapy (PCI or thrombolytics)
- Aspirin, antiplatelet agents, anticoagulation
- Beta blockers and ACE inhibitors for remodeling prevention'),

(12, 'RCA Dominance and Inferior MI', E'## Right Coronary Artery Anatomy and Clinical Significance

### Coronary Dominance
The term "dominant" refers to which artery gives rise to the PDA and supplies the inferior wall.

**Right Dominant (70% of population):**
- RCA gives rise to PDA
- RCA supplies AV node

**Left Dominant (10%):**
- LCx gives rise to PDA
- LCx supplies AV node

**Co-Dominant (20%):**
- Both RCA and LCx contribute to inferior wall supply

### RCA Occlusion Syndromes

**Inferior Wall MI:**
- ST elevation in leads II, III, aVF
- Often associated with bradycardia (SA/AV node ischemia)
- May involve right ventricle

**Right Ventricular Infarction:**
- Occurs in 50% of inferior MIs
- Diagnosed with right-sided ECG leads (V3R, V4R)
- Requires careful fluid management (preload dependent)

### Anatomical Considerations
- RCA travels in right AV groove
- Gives off SA nodal branch (60% of people)
- Gives off AV nodal branch (90% of people)
- Supplies right ventricle via acute marginal branches

### Treatment Pearls
- Bradycardia common, may require atropine or pacing
- Avoid nitrates in RV infarction (preload dependent)
- Careful with morphine (can cause hypotension)');

-- Reset sequences to continue from the last ID
SELECT setval('regions_id_seq', (SELECT MAX(id) FROM regions));
SELECT setval('vessels_id_seq', (SELECT MAX(id) FROM vessels));
SELECT setval('vessel_edges_id_seq', (SELECT MAX(id) FROM vessel_edges));
SELECT setval('aliases_id_seq', (SELECT MAX(id) FROM aliases));
SELECT setval('notes_id_seq', (SELECT MAX(id) FROM notes));
