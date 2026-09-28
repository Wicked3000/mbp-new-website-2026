-- Seed rows for the FODE admin tables.
--
-- The exact strings src/pages/FODE.tsx rendered before these sections became
-- database-backed, so /fode is visually unchanged by this seed. Each INSERT is
-- guarded, so re-running does not duplicate rows.
--
-- `desc` is a reserved word in MySQL/MariaDB and is always backticked.

INSERT INTO fode_hero (eyebrow, title, subtitle, description, banner, alt, sort_order)
SELECT 'Program 04 - Flexible Open & Distance Education',
  'Flexible Open &', ' Distance Education (FODE)',
  'Quality secondary education for remote communities, working adults, and students needing flexible pathways - learning without boundaries across Milne Bay Province.',
  '/assets/fode/fode-banner-img.jpg', 'FODE learning materials', 1
WHERE NOT EXISTS (SELECT 1 FROM fode_hero);

INSERT INTO fode_overview (eyebrow, heading, intro, body, features_title, sort_order)
SELECT 'Program Overview', 'Education Without Boundaries',
  'FODE provides the same national curriculum and examinations as conventional schools, delivered through flexible distance learning. The Division operates 12 study centres across all 4 districts, serving 3,500+ students annually.',
  'Students include Grade 10/12 upgraders, remote island learners, working adults, and those who missed conventional schooling. All courses lead to nationally recognized Grade 10 and Grade 12 certificates.',
  'Key Features', 1
WHERE NOT EXISTS (SELECT 1 FROM fode_overview);

INSERT INTO fode_overview_cards (icon, title, `desc`, sort_order)
SELECT * FROM (
  SELECT '📚' AS icon, 'Same National Curriculum' AS title,
    'Identical syllabus, textbooks, and examinations as classroom-based schools' AS `desc`, 1 AS sort_order
  UNION ALL SELECT '⏰', 'Flexible Scheduling',
    'Study at your own pace; no fixed timetables - ideal for working students and parents', 2
  UNION ALL SELECT '🏝️', 'Remote Access',
    'Study centres on islands and mainland; materials delivered by boat, plane, and digital platforms', 3
  UNION ALL SELECT '🎓', 'National Certification',
    'Grade 10 & 12 certificates identical to conventional schools; accepted for tertiary entry', 4
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM fode_overview_cards);

INSERT INTO fode_overview_features (feature, sort_order)
SELECT * FROM (
  SELECT 'Free tuition under Government FODE subsidy' AS feature, 1 AS sort_order
  UNION ALL SELECT '12 study centres + 25+ correspondence sites', 2
  UNION ALL SELECT 'Print & digital materials (Moodle LMS, offline apps)', 3
  UNION ALL SELECT 'Tutor support via phone, WhatsApp, and centre visits', 4
  UNION ALL SELECT 'Same Grade 10/12 National Exams as conventional schools', 5
  UNION ALL SELECT 'Credit transfer to/from conventional and VET pathways', 6
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM fode_overview_features);

INSERT INTO fode_overview_stats (value_text, label, color, sort_order)
SELECT * FROM (
  SELECT '12' AS value_text, 'Study Centres' AS label, 'bg-[#0B2545]' AS color, 1 AS sort_order
  UNION ALL SELECT '3,500+', 'Active Students', 'bg-[#163663]', 2
  UNION ALL SELECT '25+', 'Correspondence Sites', 'bg-teal-600', 3
  UNION ALL SELECT '92%', 'Exam Pass Rate', 'bg-teal-700', 4
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM fode_overview_stats);

INSERT INTO fode_programs (name, level, duration, subjects, target, icon, color, sort_order)
SELECT * FROM (
  SELECT 'Grade 10 Upgrade' AS name, 'Grade 10' AS level, '12–18 months' AS duration,
    'English, Math, Science, Social Science, Personal Development, Business Studies' AS subjects,
    'Grade 8/9 leavers seeking Grade 10 cert' AS target, '📖' AS icon, 'bg-blue-500' AS color, 1 AS sort_order
  UNION ALL SELECT 'Grade 12 Upgrade', 'Grade 12', '18–24 months',
    'English (A/L), Math (A/L), Science, Social Science, plus 2 electives per stream',
    'Grade 10 holders seeking Grade 12 cert', '🎓', 'bg-purple-500', 2
  UNION ALL SELECT 'Matriculation Program', 'Pre-University', '12 months',
    'English, Math, Science, Humanities - university preparation stream',
    'Grade 12 grads improving marks for uni', '🏛️', 'bg-indigo-500', 3
  UNION ALL SELECT 'Adult Literacy & Numeracy', 'Foundation', '6–12 months',
    'Basic literacy, numeracy, digital skills, life skills',
    'Adults with limited formal education', '📝', 'bg-green-500', 4
  UNION ALL SELECT 'VET Pathway Courses', 'Certificate', '6–12 months',
    'Trade theory modules aligned with VET NC1 - practical at nearest centre',
    'FODE students entering trades', '🔧', 'bg-orange-500', 5
  UNION ALL SELECT 'Teacher Upgrading', 'Professional', '12–18 months',
    'Curriculum, pedagogy, assessment - for untrained teachers',
    'In-service teachers without certification', '👨‍🏫', 'bg-teal-500', 6
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM fode_programs);

INSERT INTO fode_centres (name, district, centre_type, students, facilities, coordinator, icon, sort_order)
SELECT * FROM (
  SELECT 'Alotau FODE Centre' AS name, 'Alotau' AS district, 'Main Centre' AS centre_type,
    '850+' AS students, 'Admin, Library, Computer Lab, Tutorial Rooms' AS facilities,
    'Ms. Grace Kila' AS coordinator, '🏢' AS icon, 1 AS sort_order
  UNION ALL SELECT 'Kiriwina FODE Centre', 'Kiriwina-Goodenough', 'Island Centre', '320+',
    'Solar Power, Satellite Internet, Tutorial Room', 'Mr. John Bula', '🏝️', 2
  UNION ALL SELECT 'Losuia FODE Centre', 'Losuia', 'Island Centre', '280+',
    'Library, Computer Lab, Staff Housing', 'Ms. Mary Tovue', '🌊', 3
  UNION ALL SELECT 'Esa''ala FODE Centre', 'Esa''ala', 'Island Centre', '240+',
    'Tutorial Room, Solar, Boat Access', 'Mr. Peter Waso', '⚓', 4
  UNION ALL SELECT 'Samarai FODE Centre', 'Samarai-Murua', 'Island Centre', '190+',
    'Library, Tutorial Room, Internet', 'Ms. Helen Gwali', '🏝️', 5
  UNION ALL SELECT 'Rabaruana FODE Centre', 'Rabaruana', 'Mainland Centre', '410+',
    'Admin, Library, Lab, Dormitory', 'Mr. David Gari', '🏫', 6
  UNION ALL SELECT 'Wanigela FODE Centre', 'Wanigela', 'Remote Centre', '160+',
    'Tutorial Room, Solar, Radio Link', 'Ms. Susan Kora', '📡', 7
  UNION ALL SELECT 'Agaivaro FODE Centre', 'Agaivaro', 'Rural Centre', '220+',
    'Library, Computer Access, Tutorial Room', 'Mr. Thomas Vali', '🌿', 8
  UNION ALL SELECT 'Dobu FODE Centre', 'Dobu', 'Island Centre', '180+',
    'Tutorial Room, Solar Power', 'Ms. Jenny Moi', '🏝️', 9
  UNION ALL SELECT 'Huhu FODE Centre', 'Huhu', 'Rural Centre', '280+',
    'Library, Tutorial Room, Internet', 'Mr. Paul Boga', '🏫', 10
  UNION ALL SELECT 'Misima FODE Centre', 'Samarai-Murua', 'Remote Island', '150+',
    'Tutorial Room, Satellite Link', 'Ms. Rose Kewa', '📡', 11
  UNION ALL SELECT 'Rossel Island FODE', 'Samarai-Murua', 'Remote Island', '90+',
    'Basic Tutorial Room, Radio', 'Mr. Henry Uva', '📻', 12
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM fode_centres);

INSERT INTO fode_delivery_methods (name, `desc`, icon, availability, sort_order)
SELECT * FROM (
  SELECT 'Printed Course Materials' AS name,
    'Full curriculum textbooks, workbooks, and assignment booklets delivered to centres and correspondence sites. Updated annually.' AS `desc`,
    '📦' AS icon, 'All Centres' AS availability, 1 AS sort_order
  UNION ALL SELECT 'Digital Learning Platform',
    'Moodle LMS with interactive lessons, videos, quizzes, and progress tracking. Offline app for areas without internet.',
    '💻', '8 Centres + App', 2
  UNION ALL SELECT 'Radio Broadcast Lessons',
    'Weekly 30-min lessons on NBC Milne Bay & community radio. Covers all core subjects. Schedule distributed each term.',
    '📻', 'Province-wide', 3
  UNION ALL SELECT 'Tutorial Support Sessions',
    'Face-to-face tutorials at centres (weekly/fortnightly). Tutor-marked assignments with feedback. Practical sessions for science.',
    '👨‍🏫', 'All Centres', 4
  UNION ALL SELECT 'WhatsApp Study Groups',
    'Subject-specific groups with tutor moderation. Peer support, quick questions, assignment reminders. 85% student participation.',
    '💬', 'Mobile Coverage Areas', 5
  UNION ALL SELECT 'Mobile Centre Visits',
    'Staff visit remote correspondence sites quarterly for enrolment, material distribution, exams, and counselling.',
    '🚤', '25+ Remote Sites', 6
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM fode_delivery_methods);

-- The icon, heading and body repeat on every row; the page reads them from the
-- first, so the callout renders once as it did before.
INSERT INTO fode_app_callout (icon, heading, body, bullet, sort_order)
SELECT * FROM (
  SELECT '📱' AS icon, 'FODE Mobile App (New 2026)' AS heading,
    'Offline-first Android app with full course materials, video lessons, assignment submission, progress tracking, and tutor chat. Free download at centres or via APK.' AS body,
    'Works offline - syncs when online' AS bullet, 1 AS sort_order
  UNION ALL SELECT '📱', 'FODE Mobile App (New 2026)',
    'Offline-first Android app with full course materials, video lessons, assignment submission, progress tracking, and tutor chat. Free download at centres or via APK.',
    'Push notifications for deadlines & announcements', 2
  UNION ALL SELECT '📱', 'FODE Mobile App (New 2026)',
    'Offline-first Android app with full course materials, video lessons, assignment submission, progress tracking, and tutor chat. Free download at centres or via APK.',
    'Assignment photo upload & voice notes', 3
  UNION ALL SELECT '📱', 'FODE Mobile App (New 2026)',
    'Offline-first Android app with full course materials, video lessons, assignment submission, progress tracking, and tutor chat. Free download at centres or via APK.',
    'Progress dashboard & exam countdown', 4
  UNION ALL SELECT '📱', 'FODE Mobile App (New 2026)',
    'Offline-first Android app with full course materials, video lessons, assignment submission, progress tracking, and tutor chat. Free download at centres or via APK.',
    'Low data mode for expensive connections', 5
  UNION ALL SELECT '📱', 'FODE Mobile App (New 2026)',
    'Offline-first Android app with full course materials, video lessons, assignment submission, progress tracking, and tutor chat. Free download at centres or via APK.',
    'Tok Pisin & English interface', 6
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM fode_app_callout);

INSERT INTO fode_enrolment_steps (step, title, `desc`, sort_order)
SELECT * FROM (
  SELECT '01' AS step, 'Choose Your Program' AS title,
    'Grade 10 Upgrade, Grade 12 Upgrade, Matriculation, Adult Literacy, VET Pathway, or Teacher Upgrading. Counsellors available at all centres.' AS `desc`, 1 AS sort_order
  UNION ALL SELECT '02', 'Gather Documents',
    'Birth certificate/ID, previous certificates (if any), passport photos, medical form. Grade 8/10 certs for upgrade programs.', 2
  UNION ALL SELECT '03', 'Visit Nearest Centre',
    '12 study centres + 25 correspondence sites. Staff assist with forms, course selection, and material collection. Remote: apply via WhatsApp/phone.', 3
  UNION ALL SELECT '04', 'Receive Materials',
    'Full course package: textbooks, workbooks, assignment booklets, study guide, exam timetable. Digital access via app/LMS activated.', 4
  UNION ALL SELECT '05', 'Start Learning',
    'Flexible start - begin any week. Tutor assigned. Study plan created. Submit assignments monthly. Attend tutorials as schedule allows.', 5
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM fode_enrolment_steps);

INSERT INTO fode_key_dates (label, date_text, sort_order)
SELECT * FROM (
  SELECT 'Major Intake 1 Opens' AS label, '15 January 2026' AS date_text, 1 AS sort_order
  UNION ALL SELECT 'Major Intake 1 Closes', '31 March 2026', 2
  UNION ALL SELECT 'Grade 10 Exams (FODE)', '12–16 October 2026', 3
  UNION ALL SELECT 'Grade 12 Exams (FODE)', '19–23 October 2026', 4
  UNION ALL SELECT 'Major Intake 2 Opens', '1 July 2026', 5
  UNION ALL SELECT 'Major Intake 2 Closes', '30 September 2026', 6
  UNION ALL SELECT 'Results Released', 'December 2026', 7
  UNION ALL SELECT 'Continuous Enrolment', 'Year-round (foundation programs)', 8
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM fode_key_dates);

INSERT INTO fode_support (icon, title, `desc`, sort_order)
SELECT * FROM (
  SELECT '👨‍🏫' AS icon, 'Dedicated Tutors' AS title,
    'Subject-specialist tutors at each centre; phone/WhatsApp/email support; monthly progress calls' AS `desc`, 1 AS sort_order
  UNION ALL SELECT '📚', 'Learning Resources',
    'Full textbook sets, video lessons, past exam papers, marking guides, study planners', 2
  UNION ALL SELECT '💰', 'Financial Support',
    'Government FODE subsidy (free tuition), travel allowances for exams, device loan scheme', 3
  UNION ALL SELECT '🧭', 'Career & Pathway Guidance',
    'Grade 12 tertiary applications, VET articulation, resume building, interview prep', 4
  UNION ALL SELECT '🤝', 'Peer Support Networks',
    'WhatsApp study groups, centre study buddies, alumni mentoring, graduation events', 5
  UNION ALL SELECT '🌏', 'Inclusive Access',
    'Materials in large print/audio, sign language tutors, disability support officers at main centres', 6
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM fode_support);

INSERT INTO fode_support_contact (heading, body, phone_label, phone_value, email_label, email_value, whatsapp_label, whatsapp_value, office_label, office_value, button_label, button_href, sort_order)
SELECT 'FODE Helpdesk',
  'Enrolment, materials, exams, tutor issues, technical support, pathway advice.',
  'Provincial FODE Coordinator', '+675 641 1234 (ext. 5)',
  'Email', 'fode@mbpeducation.gov.pg',
  'WhatsApp Support', '+675 7XXX XXXX',
  'Main Centre', 'Alotau FODE Centre, Milne Bay',
  'Contact FODE Team', '/contact', 1
WHERE NOT EXISTS (SELECT 1 FROM fode_support_contact);

INSERT INTO fode_initiatives (title, `desc`, icon, status, color, sort_order)
SELECT * FROM (
  SELECT 'FODE Mobile App Launch' AS title,
    'Offline-first Android app with full curriculum, video lessons, assignment upload, and tutor chat. 2,000+ downloads target for 2026.' AS `desc`,
    '📱' AS icon, 'Launched' AS status, 'bg-teal-500' AS color, 1 AS sort_order
  UNION ALL SELECT 'Satellite Internet for Island Centres',
    'Starlink terminals at 6 remote island centres (Kiriwina, Losuia, Esa''ala, Samarai, Misima, Rossel). High-speed access for LMS & video calls.',
    '🛰️', 'Rolling Out', 'bg-blue-500', 2
  UNION ALL SELECT 'Radio Education Expansion',
    'Daily 1-hour slots on NBC Milne Bay. New studio at Alotau Centre. Programs in English & Tok Pisin. Reaches 95% of province.',
    '📻', 'Active', 'bg-amber-500', 3
  UNION ALL SELECT 'Women''s Learning Circles',
    'Safe study spaces for women with childcare. Female tutors. Flexible timing. 40% female enrolment increase since 2024.',
    '👩‍🎓', 'Active', 'bg-pink-500', 4
  UNION ALL SELECT 'Digital Literacy Integration',
    'Basic ICT module now compulsory in all programs. Computer labs upgraded at all centres. ICDL certification pathway available.',
    '💻', 'New', 'bg-indigo-500', 5
  UNION ALL SELECT 'Tracer Study & Alumni Network',
    'Annual graduate tracking (employment, further study). Alumni mentorship program. FODE graduates database for provincial workforce planning.',
    '📊', 'Active', 'bg-purple-500', 6
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM fode_initiatives);

INSERT INTO fode_faq (q, a, sort_order)
SELECT * FROM (
  SELECT 'Is a FODE certificate the same as a regular school certificate?' AS q,
    'Yes. FODE students sit the identical Grade 10 and Grade 12 National Examinations as conventional schools. Certificates are issued by the same authority (Measurement Services Division) with no distinction.' AS a, 1 AS sort_order
  UNION ALL SELECT 'Can I study FODE while working full-time?',
    'Absolutely. FODE is designed for flexible, self-paced learning. Many students work full-time. You submit assignments monthly and attend tutorials when your schedule allows. No fixed class times.', 2
  UNION ALL SELECT 'How do I get course materials if I live on a remote island?',
    'Materials are shipped to your nearest centre or correspondence site by boat/plane. Digital materials sync via the mobile app when you have internet. Radio lessons broadcast weekly. Tutors visit remote sites quarterly.', 3
  UNION ALL SELECT 'What if I fail an assignment or exam?',
    'Assignments can be resubmitted after tutor feedback. Failed exams can be re-sat at the next exam sitting (June or October). No limit on attempts. Tutor support provided for improvement.', 4
  UNION ALL SELECT 'Can I transfer from FODE to a regular school?',
    'Yes. Credit transfer is available. Provide your FODE transcripts and certificates. The Division coordinates transfers with the receiving school. Many students do Grade 10 via FODE then enter Grade 11 conventionally.', 5
  UNION ALL SELECT 'How much does FODE cost?',
    'Tuition is free under Government FODE subsidy. Students pay only for: exam fees (K50–K100), optional printing, and travel to exam centres. Device loan scheme available for eligible students.', 6
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM fode_faq);

INSERT INTO fode_section_headings (skey, eyebrow, heading, blurb, sort_order)
SELECT * FROM (
  SELECT 'programs' AS skey, 'Study Programs' AS eyebrow, 'Flexible Learning Pathways' AS heading,
    'Six program types serving diverse learners - from school leavers to working adults. All use the national curriculum with flexible delivery.' AS blurb, 1 AS sort_order
  UNION ALL SELECT 'centres', 'Study Network', '12 Study Centres Across the Province', NULL, 2
  UNION ALL SELECT 'selections', '2026 FODE Selection', 'FODE Student Enrolment Lists',
    'Official 2026 FODE student enrolment list for the main Alotau FODE Centre. Students enrolled in Grade 10/12 upgrade programs.', 3
  UNION ALL SELECT 'delivery', 'Delivery Methods', 'Multi-Modal Learning Delivery',
    'Students choose the mode that works for their location and circumstances. Most combine multiple methods for best results.', 4
  UNION ALL SELECT 'enrolment', 'How to Enrol', 'Join Anytime, Study Anywhere',
    'FODE has continuous enrolment with two main intakes. No age limit. No previous school required for foundation programs.', 5
  UNION ALL SELECT 'support', 'Student Support', 'Every Learner Supported',
    'Comprehensive support ensuring distance learners succeed - from enrolment to graduation and beyond.', 6
  UNION ALL SELECT 'initiatives', 'Key Initiatives', 'Innovating Distance Learning',
    'Strategic programs using technology and community engagement to reach every learner in Milne Bay.', 7
  UNION ALL SELECT 'downloads', 'Resources', 'Documents & Downloads', NULL, 8
  UNION ALL SELECT 'faq', 'Frequently Asked', 'Common Questions', NULL, 9
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM fode_section_headings);

INSERT INTO downloads (name, type, size_text, category, description, file_path, program, sort_order)
SELECT * FROM (
  SELECT 'FODE Prospectus 2026' AS name, 'PDF' AS type, '3.8 MB' AS size_text,
    'Guide' AS category, 'FODE programme prospectus' AS description, '' AS file_path, 'fode' AS program, 1 AS sort_order
  UNION ALL SELECT 'Course Guides (All Subjects)', 'PDF', '15.2 MB', 'Curriculum',
    'Course guides for every subject', '', 'fode', 2
  UNION ALL SELECT 'Enrolment Application Form', 'PDF', '580 KB', 'Forms',
    'FODE enrolment application form', '', 'fode', 3
  UNION ALL SELECT 'Assignment Submission Guidelines', 'PDF', '1.2 MB', 'Assessment',
    'Guidelines for submitting assignments', '', 'fode', 4
  UNION ALL SELECT 'Exam Timetable & Centre List 2026', 'PDF', '890 KB', 'Examinations',
    'Exam timetable and centre list', '', 'fode', 5
  UNION ALL SELECT 'Mobile App User Guide', 'PDF', '2.4 MB', 'Digital',
    'FODE mobile app user guide', '', 'fode', 6
  UNION ALL SELECT 'Tutor Handbook & Marking Standards', 'PDF', '2.1 MB', 'Staff',
    'Tutor handbook and marking standards', '', 'fode', 7
  UNION ALL SELECT 'Graduate Outcomes Report 2024', 'PDF', '1.9 MB', 'Reports',
    'Graduate outcomes report', '', 'fode', 8
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM downloads WHERE program = 'fode');
