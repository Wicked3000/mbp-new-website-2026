-- Seed rows for the Post Primary admin tables.
--
-- The exact strings src/pages/PostPrimary.tsx rendered before these sections
-- became database-backed, so /post is visually unchanged by this seed. Each
-- INSERT is guarded, so re-running does not duplicate rows.
--
-- `desc` is a reserved word in MySQL/MariaDB and is always backticked.

INSERT INTO post_hero (eyebrow, title, subtitle, description, banner, alt, sort_order)
SELECT 'Program 02 - Post Primary', 'Post Primary', 'Grades 9 – 12',
  'Secondary education pathways preparing students for tertiary admission, technical training, and employment across Milne Bay''s 24 secondary and national high schools.',
  '/assets/education_programs/post/banner.jpg',
  'Secondary school students', 1
WHERE NOT EXISTS (SELECT 1 FROM post_hero);

INSERT INTO post_overview (eyebrow, heading, intro, body, features_title, sort_order)
SELECT 'Program Overview', 'Pathways to Future Success',
  'Post Primary Education in Milne Bay covers Grades 9–12, providing critical pathways for students transitioning from basic education. The Division oversees 24 secondary and national high schools serving 13,000+ students.',
  'Students can choose from academic streams leading to university, technical pathways into VET, or flexible learning through FODE. Our schools span urban centers and remote districts, with boarding facilities at key locations.',
  'Key Features', 1
WHERE NOT EXISTS (SELECT 1 FROM post_overview);

INSERT INTO post_overview_cards (icon, title, `desc`, sort_order)
SELECT * FROM (
  SELECT '🎓' AS icon, 'Lower Secondary (Grades 9–10)' AS title,
    'Broad curriculum with core subjects plus electives; Grade 10 National Examination for certification' AS `desc`, 1 AS sort_order
  UNION ALL SELECT '🏫', 'Upper Secondary (Grades 11–12)',
    'Specialised streams: Science, Humanities, Business, Technical; Grade 12 Exam for tertiary entry', 2
  UNION ALL SELECT '🔬', 'STEM Focus Schools',
    'Enhanced science & mathematics at Cameron & Alotau Secondary for university pathways', 3
  UNION ALL SELECT '🛠️', 'Technical Secondary',
    'Trade-focused curriculum at selected schools with VET articulation pathways', 4
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM post_overview_cards);

INSERT INTO post_overview_features (feature, sort_order)
SELECT * FROM (
  SELECT 'Free tuition under Government TFF policy (Grades 9–12)' AS feature, 1 AS sort_order
  UNION ALL SELECT 'National curriculum with provincial contextualization', 2
  UNION ALL SELECT 'Grade 10 & 12 National Examinations', 3
  UNION ALL SELECT 'School-based assessment contributing to final grades', 4
  UNION ALL SELECT 'Career guidance & tertiary application support', 5
  UNION ALL SELECT 'Boarding facilities at 8 provincial high schools', 6
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM post_overview_features);

INSERT INTO post_overview_stats (value_text, label, color, sort_order)
SELECT * FROM (
  SELECT '24' AS value_text, 'Schools' AS label, 'bg-[#163663]' AS color, 1 AS sort_order
  UNION ALL SELECT '13,200+', 'Students', 'bg-[#0B2545]', 2
  UNION ALL SELECT '420', 'Teachers', 'bg-amber-600', 3
  UNION ALL SELECT '8', 'Boarding Schools', 'bg-amber-700', 4
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM post_overview_stats);

INSERT INTO post_streams (name, grades, subjects, icon, color, sort_order)
SELECT * FROM (
  SELECT 'Science Stream' AS name, '11–12' AS grades,
    'Physics, Chemistry, Biology, Adv. Math, English, ICT' AS subjects,
    '🔬' AS icon, 'bg-blue-500' AS color, 1 AS sort_order
  UNION ALL SELECT 'Humanities Stream', '11–12',
    'History, Geography, Economics, Legal Studies, English, Language', '📜', 'bg-green-500', 2
  UNION ALL SELECT 'Business Stream', '11–12',
    'Accounting, Business Studies, Economics, Math, English, ICT', '💼', 'bg-purple-500', 3
  UNION ALL SELECT 'Technical Stream', '11–12',
    'Tech Drawing, Applied Tech, Math, English, Physics, VET modules', '⚙️', 'bg-orange-500', 4
  UNION ALL SELECT 'Core Subjects (Gr 9–10)', '9–10',
    'English, Math, Science, Social Science, Personal Dev, Making a Living', '📚', 'bg-teal-500', 5
  UNION ALL SELECT 'Electives (Gr 9–10)', '9–10',
    'Agriculture, Home Economics, Design Tech, ICT, Visual Arts, Music', '🎨', 'bg-pink-500', 6
  UNION ALL SELECT 'Flexible Learning (FODE)', '9–12',
    'All streams via distance mode; same curriculum & examinations', '💻', 'bg-indigo-500', 7
  UNION ALL SELECT 'Career Education', '9–12',
    'Career planning, tertiary applications, work experience, life skills', '🎯', 'bg-cyan-500', 8
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM post_streams);

-- The icon and heading repeat on every row: the original markup rendered them
-- once above the bullet list, and one table has to carry both.
INSERT INTO post_assessment (icon, heading, bullet, sort_order)
SELECT * FROM (
  SELECT '📋' AS icon, 'Assessment & Certification' AS heading,
    'Grade 10 National Exam: English, Math, Science, Social Science, Personal Development' AS bullet, 1 AS sort_order
  UNION ALL SELECT '📋', 'Assessment & Certification',
    'Grade 12 National Exam: Stream-specific subjects (5–6 papers per stream)', 2
  UNION ALL SELECT '📋', 'Assessment & Certification',
    'School-based assessment (30%) + National exam (70%) = Final grade', 3
  UNION ALL SELECT '📋', 'Assessment & Certification',
    'Certificates: Grade 10 Certificate, Higher School Certificate (Grade 12)', 4
  UNION ALL SELECT '📋', 'Assessment & Certification',
    'Tertiary entry via Grade 12 results + STAT-P for universities', 5
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM post_assessment);

INSERT INTO post_pathways (title, `desc`, icon, color, stats, sort_order)
SELECT * FROM (
  SELECT 'University Entrance' AS title,
    'Grade 12 Higher School Certificate with required subject combinations for UPNG, DWU, PAU, and overseas universities. STAT-P testing available.' AS `desc`,
    '🎓' AS icon, 'bg-blue-500' AS color, '65% of Grade 12 grads' AS stats, 1 AS sort_order
  UNION ALL SELECT 'Technical & VET Articulation',
    'Direct entry into VET certificate/diploma programs. Technical stream students receive credit recognition. Partnerships with 4 provincial VET centres.',
    '🔧', 'bg-orange-500', '20% transition to VET', 2
  UNION ALL SELECT 'Teacher Education',
    'Primary teacher training at PNGEI & DWU. Secondary teacher education at UPNG & DWU. Division coordinates selections annually.',
    '👨‍🏫', 'bg-green-500', '120+ teachers/year', 3
  UNION ALL SELECT 'Health & Nursing',
    'Entry to nursing colleges (St. Mary''s, Mendi, Lae) and community health worker programs. Science stream prerequisite.',
    '🏥', 'bg-red-500', '80+ health workers/yr', 4
  UNION ALL SELECT 'Police & Defence Forces',
    'Grade 12 certificate minimum for officer cadet programs. Physical fitness & leadership from school programs valued.',
    '🛡️', 'bg-gray-700', '40+ recruits/year', 5
  UNION ALL SELECT 'Maritime & Fisheries',
    'National Fisheries College & maritime training. Island district students given priority. Business/Technical streams relevant.',
    '⚓', 'bg-cyan-500', '25+ cadets/year', 6
  UNION ALL SELECT 'Agriculture & Rural Dev',
    'University of Natural Resources (UNRE) & agriculture colleges. Making a Living subject provides foundation.',
    '🌱', 'bg-lime-600', '30+ agriculture students', 7
  UNION ALL SELECT 'FODE & Distance Upgrading',
    'Grade 10/12 upgrades via FODE for missed exams or improved marks. Flexible for working students.',
    '📚', 'bg-indigo-500', '500+ FODE enrolments', 8
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM post_pathways);

INSERT INTO post_initiatives (title, `desc`, icon, status, color, sort_order)
SELECT * FROM (
  SELECT 'STEM Excellence Program' AS title,
    'Enhanced labs, specialist teachers, and industry partnerships at Cameron & Alotau Secondary. Target: 50% Science stream enrolment.' AS `desc`,
    '🔬' AS icon, 'Active' AS status, 'bg-blue-500' AS color, 1 AS sort_order
  UNION ALL SELECT 'Grade 12 Exam Preparation',
    'Holiday revision camps, past paper workshops, and online resources. 2025 pass rate target: 85%+ across all streams.',
    '📝', 'Active', 'bg-green-500', 2
  UNION ALL SELECT 'Career Guidance Expansion',
    'Trained career counsellors in 15 schools. Annual Provincial Career Expo. Tertiary application workshops for all Grade 12s.',
    '🎯', 'Scaling', 'bg-amber-500', 3
  UNION ALL SELECT 'Boarding Facility Upgrades',
    'K2.5M investment in dormitory renovations, water/sanitation, and dining facilities at 8 boarding schools (2024–2026).',
    '🏠', 'Active', 'bg-teal-500', 4
  UNION ALL SELECT 'Digital Learning Platforms',
    'Moodle LMS deployment at 10 schools. Offline content servers for remote schools. Teacher training in blended delivery.',
    '💻', 'Pilot', 'bg-purple-500', 5
  UNION ALL SELECT 'School-Based Assessment Quality',
    'Standardised SBA moderation across all 24 schools. External marker calibration. Data-driven intervention for at-risk students.',
    '📊', 'Active', 'bg-indigo-500', 6
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM post_initiatives);

INSERT INTO post_support (icon, title, `desc`, sort_order)
SELECT * FROM (
  SELECT '📄' AS icon, 'Curriculum & Exam Resources' AS title,
    'Syllabuses, exam specs, past papers, marking guides distributed annually' AS `desc`, 1 AS sort_order
  UNION ALL SELECT '🏗️', 'Infrastructure & Maintenance',
    'TFF infrastructure component, SLIP grants, boarding facility funding', 2
  UNION ALL SELECT '👨‍🏫', 'Teacher Development',
    'In-service training, subject panels, HOD leadership programs, certification', 3
  UNION ALL SELECT '📊', 'Data & Quality Assurance',
    'EMIS, school inspections, exam analysis, performance dashboards', 4
  UNION ALL SELECT '🎓', 'Student Support Services',
    'Career guidance, counselling, scholarship info, tertiary applications', 5
  UNION ALL SELECT '🚨', 'Emergency & Resilience',
    'Disaster recovery, psychosocial support, temporary learning spaces', 6
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM post_support);

INSERT INTO post_support_contact (heading, body, phone_label, phone_value, email_label, email_value, office_label, office_value, button_label, button_href, sort_order)
SELECT 'Post Primary Helpdesk',
  'Assistance with enrolments, subject selection, exam queries, tertiary applications, and school transfers.',
  'Provincial Post Primary Officer', '+675 641 1234 (ext. 3)',
  'Email', 'post.primary@mbpeducation.gov.pg',
  'Office', 'Division of Education, Alotau',
  'Submit Enquiry', '/contact', 1
WHERE NOT EXISTS (SELECT 1 FROM post_support_contact);

INSERT INTO post_faq (q, a, sort_order)
SELECT * FROM (
  SELECT 'How does my child get into a secondary school?' AS q,
    'Placement is based on Grade 8 Examination results. Students apply through the national online selection system (Grade 9 Selection). The Division manages provincial quotas for each school.' AS a, 1 AS sort_order
  UNION ALL SELECT 'What is the difference between National High and Provincial High schools?',
    'National High Schools (e.g., Cameron) are centrally funded, selective entry, and offer all streams. Provincial High Schools are provincially funded, serve local catchments, and may offer limited streams based on resources.', 2
  UNION ALL SELECT 'Can my child change streams in Grade 11?',
    'Stream changes are possible in the first 4 weeks of Grade 11 with principal approval and subject teacher assessment. After this, changes are not permitted due to assessment requirements.', 3
  UNION ALL SELECT 'What if my child fails the Grade 10 Exam?',
    'Students can repeat Grade 10 at their school, enrol in FODE to upgrade, or enter VET certificate programs. The Division provides counselling on alternative pathways.', 4
  UNION ALL SELECT 'Are there scholarships for Grade 12 graduates?',
    'Yes: TESAS (tertiary), HECAS, and provincial government scholarships. The Division coordinates nominations. Criteria: academic merit, financial need, priority workforce areas.', 5
  UNION ALL SELECT 'How do I get my Grade 12 certificate reissued?',
    'Apply through Measurement Services Division (NDoE) with statutory declaration, police report (if lost), and K30 fee. Processing: 4–6 weeks. Contact Post Primary helpdesk for assistance.', 6
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM post_faq);

INSERT INTO post_section_headings (skey, eyebrow, heading, blurb, sort_order)
SELECT * FROM (
  SELECT 'curriculum' AS skey, 'Curriculum & Streams' AS eyebrow, 'Diverse Learning Pathways' AS heading,
    'Students choose streams at Grade 11 based on Grade 10 results, interests, and career goals. All streams meet national certification requirements.' AS blurb, 1 AS sort_order
  UNION ALL SELECT 'selections', '2026 Selection Lists', 'Grade 9 & Grade 11 Selections',
    'Published selection lists for the current intake year, by school and position.', 2
  UNION ALL SELECT 'pathways', 'Post-Grade 12 Pathways', 'Where Our Students Go',
    'Post Primary education opens multiple pathways. The Division tracks graduate destinations to align programs with provincial workforce needs.', 3
  UNION ALL SELECT 'initiatives', 'Key Initiatives', 'Driving Quality & Access',
    'Targeted programs improving outcomes, expanding pathways, and modernizing secondary education across the province.', 4
  UNION ALL SELECT 'support', 'Support & Resources', 'Empowering Schools & Students',
    'Comprehensive support ensuring every secondary school delivers quality education and every student can access their chosen pathway.', 5
  UNION ALL SELECT 'downloads', 'Resources', 'Documents & Downloads', NULL, 6
  UNION ALL SELECT 'faq', 'Frequently Asked', 'Common Questions', NULL, 7
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM post_section_headings);

-- Documents for the Post Primary section, scoped by the program column so they
-- stay out of the shared /downloads listing and out of /basic.
INSERT INTO downloads (name, type, size_text, category, description, file_path, program, sort_order)
SELECT * FROM (
  SELECT '2026 Grade 9 Selection List' AS name, 'PDF' AS type, '2.4 MB' AS size_text,
    'Selection Lists' AS category, 'Grade 9 selection list' AS description, '' AS file_path, 'post' AS program, 1 AS sort_order
  UNION ALL SELECT '2026 Grade 11 Selection List', 'PDF', '3.1 MB', 'Selection Lists',
    'Grade 11 selection list', '', 'post', 2
  UNION ALL SELECT 'Post Primary Handbook 2026', 'PDF', '3.1 MB', 'Policy',
    'Post Primary programme handbook', '', 'post', 3
  UNION ALL SELECT 'Grade 10 & 12 Exam Specifications', 'PDF', '4.2 MB', 'Assessment',
    'National examination specifications', '', 'post', 4
  UNION ALL SELECT 'Stream Selection Guidelines', 'PDF', '1.8 MB', 'Guidance',
    'Guidelines for choosing a stream', '', 'post', 5
  UNION ALL SELECT 'Secondary Curriculum: Grades 9–12', 'PDF', '22.4 MB', 'Curriculum',
    'Secondary curriculum for Grades 9 to 12', '', 'post', 6
  UNION ALL SELECT 'School Learning Improvement Plan Template', 'DOCX', '920 KB', 'Planning',
    'SLIP planning template for schools', '', 'post', 7
  UNION ALL SELECT 'Career Guidance Resource Kit', 'PDF', '5.6 MB', 'Guidance',
    'Career guidance resources for students', '', 'post', 8
  UNION ALL SELECT 'Boarding School Standards', 'PDF', '2.7 MB', 'Infrastructure',
    'Standards for boarding facilities', '', 'post', 9
  UNION ALL SELECT 'Teacher Subject Panel Minutes 2025', 'PDF', '1.4 MB', 'Professional Dev',
    'Subject panel meeting minutes', '', 'post', 10
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM downloads WHERE program = 'post');
