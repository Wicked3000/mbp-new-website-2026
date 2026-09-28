-- Seed rows for the Basic Education admin tables.
--
-- These are the exact strings src/pages/BasicEducation.tsx rendered before the
-- sections became database-backed, so applying this leaves /basic visually
-- unchanged. Each INSERT is guarded: re-running does not duplicate rows.
--
-- Icons are written as INSERTs with literal characters. Note that `desc` is a
-- reserved word in MySQL/MariaDB and is always backticked.

INSERT INTO basic_hero (eyebrow, title, subtitle, description, banner, alt, sort_order)
SELECT 'Program 01 - Basic Education', 'Basic Education', 'Elementary to Grade 8',
  'Providing foundational literacy, numeracy and life skills for all children from Prep through to Grade 8 across Milne Bay Province''s 312 schools.',
  '/assets/education_programs/basic/banner.jpg',
  'Elementary school students in Milne Bay', 1
WHERE NOT EXISTS (SELECT 1 FROM basic_hero);

INSERT INTO basic_overview (eyebrow, heading, intro, body, features_title, sort_order)
SELECT 'Program Overview', 'Foundation for Lifelong Learning',
  'Basic Education in Milne Bay Province covers the critical foundational years from Elementary Prep through Grade 8. This nine-year journey equips children with essential literacy, numeracy, and life skills that form the bedrock of all future learning.',
  'The Division oversees schools across all 4 districts of Milne Bay Province with a teaching workforce of 1,800+ qualified educators. Our schools span from urban Alotau to remote island communities in Samarai-Murua, ensuring every child has access to quality basic education.',
  'Key Features', 1
WHERE NOT EXISTS (SELECT 1 FROM basic_overview);

INSERT INTO basic_overview_cards (icon, title, `desc`, sort_order)
SELECT * FROM (
  SELECT '📘' AS icon, 'Elementary (Prep–Grade 2)' AS title,
    'Vernacular-based early learning focusing on oral language, pre-literacy, and cultural identity' AS `desc`, 1 AS sort_order
  UNION ALL SELECT '📗', 'Primary (Grades 3–8)',
    'English-medium curriculum covering English, Mathematics, Science, Social Science, and Personal Development', 2
  UNION ALL SELECT '📙', 'Life Skills & Values',
    'Health, hygiene, environmental awareness, and citizenship education integrated across all grades', 3
  UNION ALL SELECT '📕', 'Inclusive Education',
    'Support for children with disabilities and learning difficulties through specialist teacher aides', 4
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM basic_overview_cards);

INSERT INTO basic_overview_features (feature, sort_order)
SELECT * FROM (
  SELECT 'Free tuition under Government TFF policy' AS feature, 1 AS sort_order
  UNION ALL SELECT 'Standard-based curriculum (SBC) implementation', 2
  UNION ALL SELECT 'Vernacular education in Elementary years', 3
  UNION ALL SELECT 'School Learning Improvement Plans (SLIP)', 4
  UNION ALL SELECT 'Community participation through Boards of Management', 5
  UNION ALL SELECT 'Regular school inspections & quality assurance', 6
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM basic_overview_features);

INSERT INTO basic_overview_stats (value_text, label, color, sort_order)
SELECT * FROM (
  SELECT '312' AS value_text, 'Schools' AS label, 'bg-[#0B2545]' AS color, 1 AS sort_order
  UNION ALL SELECT '35,200+', 'Students', 'bg-[#163663]', 2
  UNION ALL SELECT '1,840', 'Teachers', 'bg-teal-600', 3
  UNION ALL SELECT '17', 'Districts', 'bg-teal-700', 4
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM basic_overview_stats);

INSERT INTO basic_curriculum (area, grades, `desc`, icon, sort_order)
SELECT * FROM (
  SELECT 'English' AS area, '3–8' AS grades,
    'Reading, writing, speaking, listening; phonics to advanced comprehension' AS `desc`, '📝' AS icon, 1 AS sort_order
  UNION ALL SELECT 'Mathematics', '3–8',
    'Number, algebra, measurement, geometry, statistics, problem-solving', '🔢', 2
  UNION ALL SELECT 'Science', '3–8',
    'Living world, physical world, earth & space, scientific inquiry skills', '🔬', 3
  UNION ALL SELECT 'Social Science', '3–8',
    'History, geography, civics, economics, PNG studies & culture', '🌍', 4
  UNION ALL SELECT 'Personal Development', '3–8',
    'Health, physical education, values, life skills, career awareness', '💪', 5
  UNION ALL SELECT 'Making a Living', '6–8',
    'Agriculture, business basics, home economics, technical skills', '🛠️', 6
  UNION ALL SELECT 'Vernacular / Tok Pisin', 'Prep–2',
    'Oral language, cultural stories, early literacy in mother tongue', '🗣️', 7
  UNION ALL SELECT 'Religious Education', 'Prep–8',
    'Christian principles, values, ethics (per Education Act)', '✝️', 8
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM basic_curriculum);

INSERT INTO basic_initiatives (title, `desc`, icon, status, color, sort_order)
SELECT * FROM (
  SELECT 'Early Grade Reading Assessment (EGRA)' AS title,
    'Annual literacy screening for Grades 1–3 to identify struggling readers early and provide targeted intervention.' AS `desc`,
    '📖' AS icon, 'Active' AS status, 'bg-teal-500' AS color, 1 AS sort_order
  UNION ALL SELECT 'School Learning Improvement Plans (SLIP)',
    'Every school develops a 3-year improvement plan with community input, focusing on infrastructure, teaching quality, and student outcomes.',
    '📋', 'Active', 'bg-blue-500', 2
  UNION ALL SELECT 'Vernacular Education Support',
    'Development of orthographies, teaching materials, and teacher training for 12+ local languages used in Elementary schools.',
    '🗣️', 'Ongoing', 'bg-amber-500', 3
  UNION ALL SELECT 'Inclusive Education Pilot',
    'Specialist teacher aides and adaptive resources in 15 pilot schools supporting children with disabilities in mainstream classrooms.',
    '🤝', 'Pilot', 'bg-purple-500', 4
  UNION ALL SELECT 'WASH in Schools Program',
    'Water, sanitation, and hygiene infrastructure upgrades plus hygiene education in 50 priority schools across the province.',
    '💧', 'Active', 'bg-cyan-500', 5
  UNION ALL SELECT 'Digital Learning Trial',
    'Tablet-based literacy and numeracy apps deployed in 10 remote schools with solar charging, measuring learning gains.',
    '💻', 'Trial', 'bg-indigo-500', 6
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM basic_initiatives);

INSERT INTO basic_support (icon, title, `desc`, sort_order)
SELECT * FROM (
  SELECT '📄' AS icon, 'Curriculum Materials' AS title,
    'Syllabuses, teacher guides, student workbooks distributed annually' AS `desc`, 1 AS sort_order
  UNION ALL SELECT '🏗️', 'Infrastructure Grants',
    'Maintenance and construction funding through SLIP and TFF', 2
  UNION ALL SELECT '👨‍🏫', 'Teacher Professional Development',
    'In-service training, cluster workshops, and certification support', 3
  UNION ALL SELECT '📊', 'Data & Monitoring',
    'EMIS reporting, school inspections, and performance dashboards', 4
  UNION ALL SELECT '🤝', 'Community Engagement',
    'Board of Management training, P&C support, awareness campaigns', 5
  UNION ALL SELECT '🚨', 'Emergency Response',
    'Cyclone/disaster recovery, temporary learning spaces, psychosocial support', 6
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM basic_support);

INSERT INTO basic_support_contact (heading, body, phone_label, phone_value, email_label, email_value, office_label, office_value, button_label, button_href, sort_order)
SELECT 'Basic Education Helpdesk',
  'Need assistance with enrolments, transfers, curriculum, or school issues? Our dedicated Basic Education support team is here to help.',
  'Provincial Basic Education Officer', '+675 641 1234 (ext. 2)',
  'Email', 'basic.education@mbpeducation.gov.pg',
  'Office', 'Division of Education, Alotau',
  'Submit Enquiry', '/contact', 1
WHERE NOT EXISTS (SELECT 1 FROM basic_support_contact);

INSERT INTO basic_faq (q, a, sort_order)
SELECT * FROM (
  SELECT 'At what age should my child start Elementary Prep?' AS q,
    'Children should be 6 years old by June 30 of the enrolment year to start Elementary Prep. Early or late enrolment requires approval from the Provincial Education Advisor.' AS a, 1 AS sort_order
  UNION ALL SELECT 'What language is used for instruction in Elementary grades?',
    'Elementary Prep to Grade 2 uses the local vernacular language (or Tok Pisin in multilingual settings) as the medium of instruction. English is introduced as a subject from Elementary 2 and becomes the medium of instruction from Grade 3 onwards.', 2
  UNION ALL SELECT 'How do I enrol my child in a Basic Education school?',
    'Visit your nearest school during enrolment period (typically January). Bring your child''s birth certificate or clinic card, and proof of residence. The head teacher will process the enrolment. No fees are charged under the Tuition Fee Free policy.', 3
  UNION ALL SELECT 'What is the Grade 8 National Examination?',
    'The Grade 8 Examination is a national assessment held annually in October. It covers English, Mathematics, Science, and Social Science. Results determine placement into Grade 9 (Post Primary) and certification of Basic Education completion.', 4
  UNION ALL SELECT 'My child has a disability. Can they attend a regular school?',
    'Yes. The Division is implementing inclusive education across schools. Contact the Basic Education Officer to discuss your child''s needs. Specialist teacher aides and adaptive resources are available in pilot schools, with expansion planned.', 5
  UNION ALL SELECT 'How can I get a copy of my child''s Grade 8 certificate?',
    'Certificates are issued by the Measurement Services Division of NDoE through the school. If lost, apply through your former school with a statutory declaration and K20 processing fee. Contact the Basic Education helpdesk for assistance.', 6
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM basic_faq);

INSERT INTO basic_section_headings (skey, eyebrow, heading, blurb, sort_order)
SELECT * FROM (
  SELECT 'curriculum' AS skey, 'Curriculum' AS eyebrow, 'Standards-Based Curriculum' AS heading,
    'Milne Bay schools implement the National Standards-Based Curriculum (SBC), ensuring consistent learning outcomes across all schools while allowing local contextualization.' AS blurb, 1 AS sort_order
  UNION ALL SELECT 'initiatives', 'Key Initiatives', 'Programs Driving Quality',
    'Targeted initiatives addressing literacy, inclusion, infrastructure, and innovation across the basic education sector.', 2
  UNION ALL SELECT 'support', 'Support & Resources', 'For Teachers, Parents & Communities',
    'The Division provides comprehensive support to ensure every school can deliver quality basic education.', 3
  UNION ALL SELECT 'downloads', 'Resources', 'Documents & Downloads', NULL, 4
  UNION ALL SELECT 'faq', 'Frequently Asked', 'Common Questions', NULL, 5
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM basic_section_headings);

-- Downloads shown in the Basic Education section. The shared downloads table
-- also backs /downloads, so the program column is what keeps the two views
-- separate.
INSERT INTO downloads (name, type, size_text, category, description, file_path, program, sort_order)
SELECT * FROM (
  SELECT 'Basic Education Handbook 2026' AS name, 'PDF' AS type, '2.4 MB' AS size_text,
    'Policy' AS category, 'Complete handbook' AS description, '' AS file_path, 'basic' AS program, 1 AS sort_order
  UNION ALL SELECT 'Standards-Based Curriculum: Grades 3–8', 'PDF', '18.7 MB', 'Curriculum',
    'National SBC for Grades 3 to 8', '', 'basic', 2
  UNION ALL SELECT 'Elementary Vernacular Guide', 'PDF', '5.1 MB', 'Curriculum',
    'Teaching guide for vernacular early years', '', 'basic', 3
  UNION ALL SELECT 'School Learning Improvement Plan Template', 'DOCX', '890 KB', 'Planning',
    'SLIP planning template for schools', '', 'basic', 4
  UNION ALL SELECT 'Grade 8 Examination Specifications', 'PDF', '1.2 MB', 'Assessment',
    'Grade 8 national examination specifications', '', 'basic', 5
  UNION ALL SELECT 'Inclusive Education Guidelines', 'PDF', '3.3 MB', 'Policy',
    'Guidance on inclusive education delivery', '', 'basic', 6
  UNION ALL SELECT 'Teacher Performance Appraisal Forms', 'PDF', '650 KB', 'HR',
    'Teacher appraisal forms', '', 'basic', 7
  UNION ALL SELECT 'WASH in Schools Standards', 'PDF', '2.1 MB', 'Infrastructure',
    'Water, sanitation and hygiene standards', '', 'basic', 8
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM downloads WHERE program = 'basic');
