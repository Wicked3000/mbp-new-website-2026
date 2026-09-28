-- Seed rows for the VET admin tables.
--
-- The exact strings src/pages/VET.tsx rendered before these sections became
-- database-backed, so /vet is visually unchanged by this seed. Each INSERT is
-- guarded, so re-running does not duplicate rows.
--
-- `desc` is a reserved word in MySQL/MariaDB and is always backticked.

INSERT INTO vet_hero (eyebrow, title, subtitle, description, banner, alt, sort_order)
SELECT 'Program 03 - Vocational Education & Training',
  'Vocational Education', ' & Training (VET)',
  'Skills and trades training for out-of-school youth and adults, delivered through registered VET providers across Milne Bay Province - building a skilled workforce for PNG''s future.',
  '/assets/vet/vet-banner.jpg', 'VET training workshop', 1
WHERE NOT EXISTS (SELECT 1 FROM vet_hero);

INSERT INTO vet_overview (eyebrow, heading, intro, body, features_title, sort_order)
SELECT 'Program Overview', 'Skills for Employment & Entrepreneurship',
  'The VET program provides competency-based skills training aligned with national qualifications. The Division coordinates 6 registered VET centres across the province, offering certificate and diploma programs in priority trade areas.',
  'Training is open to Grade 10 and Grade 12 school leavers, out-of-school youth, and existing workers seeking formal recognition. Programs range from 6-month certificates to 2-year diplomas, with pathways to higher education and apprenticeships.',
  'Key Features', 1
WHERE NOT EXISTS (SELECT 1 FROM vet_overview);

INSERT INTO vet_overview_cards (icon, title, `desc`, sort_order)
SELECT * FROM (
  SELECT '🔧' AS icon, 'Competency-Based Training' AS title,
    'Industry-aligned qualifications (NC1–NC3) assessed against national competency standards' AS `desc`, 1 AS sort_order
  UNION ALL SELECT '🏭', 'Workplace Learning',
    'Structured workplace training & industry attachments mandatory for all programs', 2
  UNION ALL SELECT '📜', 'National Certification',
    'TVET Authority accredited; qualifications recognized nationally and regionally', 3
  UNION ALL SELECT '🚀', 'Pathways to Higher Study',
    'Credit articulation into technical colleges, universities, and apprenticeship schemes', 4
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM vet_overview_cards);

INSERT INTO vet_overview_features (feature, sort_order)
SELECT * FROM (
  SELECT 'Free tuition for eligible students under Government subsidy' AS feature, 1 AS sort_order
  UNION ALL SELECT '8 trade programs across 6 training centres', 2
  UNION ALL SELECT 'Industry partnerships with PNG LNG, Ok Tedi, local businesses', 3
  UNION ALL SELECT 'Recognition of Prior Learning (RPL) for experienced workers', 4
  UNION ALL SELECT 'Entrepreneurship & business skills embedded in all courses', 5
  UNION ALL SELECT 'Job placement support through provincial industry links', 6
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM vet_overview_features);

INSERT INTO vet_overview_stats (value_text, label, color, sort_order)
SELECT * FROM (
  SELECT '6' AS value_text, 'Training Centres' AS label, 'bg-[#0D9488]' AS color, 1 AS sort_order
  UNION ALL SELECT '8', 'Trade Programs', 'bg-[#14B8A6]', 2
  UNION ALL SELECT '1,200+', 'Annual Trainees', 'bg-teal-600', 3
  UNION ALL SELECT '85%', 'Employment Rate', 'bg-teal-700', 4
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM vet_overview_stats);

INSERT INTO vet_programs (code, name, duration, level, trades, icon, color, sort_order)
SELECT * FROM (
  SELECT 'CPC10120' AS code, 'Certificate I in Construction' AS name, '6 months' AS duration,
    'NC1' AS level, 'Carpentry, Masonry, Concreting' AS trades, '🔨' AS icon, 'bg-amber-500' AS color, 1 AS sort_order
  UNION ALL SELECT 'MEM10119', 'Certificate I in Engineering', '6 months', 'NC1',
    'Welding, Fitting, Machining', '⚙️', 'bg-blue-500', 2
  UNION ALL SELECT 'AUR10120', 'Certificate I in Automotive', '6 months', 'NC1',
    'Light Vehicle, Diesel, Electrical', '🚗', 'bg-red-500', 3
  UNION ALL SELECT 'UEE10120', 'Certificate I in Electrotechnology', '6 months', 'NC1',
    'Electrical, Renewable Energy', '⚡', 'bg-yellow-500', 4
  UNION ALL SELECT 'SIT10122', 'Certificate I in Hospitality', '6 months', 'NC1',
    'Cookery, Front Office, Housekeeping', '🍳', 'bg-pink-500', 5
  UNION ALL SELECT 'AHC10116', 'Certificate I in Agriculture', '6 months', 'NC1',
    'Crop Production, Livestock, Machinery', '🌱', 'bg-green-500', 6
  UNION ALL SELECT 'ICT10119', 'Certificate I in ICT', '6 months', 'NC1',
    'Computer Hardware, Networking, Support', '💻', 'bg-purple-500', 7
  UNION ALL SELECT 'MST10119', 'Certificate I in Maritime', '8 months', 'NC1',
    'Deck Rating, Engine Rating, Safety', '⚓', 'bg-cyan-500', 8
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM vet_programs);

INSERT INTO vet_centres (name, district, status, programs, capacity, facilities, icon, sort_order)
SELECT * FROM (
  SELECT 'Alotau VET Centre' AS name, 'Alotau' AS district, 'Operational' AS status,
    'Construction, Engineering, Automotive, Hospitality' AS programs, '300' AS capacity,
    'Workshops, Computer Lab, Dormitory' AS facilities, '🏢' AS icon, 1 AS sort_order
  UNION ALL SELECT 'Samarai VET Centre', 'Samarai-Murua', 'Opening 2026',
    'Maritime, Construction, Agriculture', '150',
    'Workshops, Jetty Access, Staff Housing', '⚓', 2
  UNION ALL SELECT 'Kiriwina Skills Centre', 'Kiriwina-Goodenough', 'Operational',
    'Hospitality, Construction, ICT', '120',
    'Kitchen, Workshop, Solar Power', '🏝️', 3
  UNION ALL SELECT 'Esa''ala Training Centre', 'Esa''ala', 'Operational',
    'Maritime, Agriculture, Hospitality', '100',
    'Workshop, Boat Access, Garden', '🌊', 4
  UNION ALL SELECT 'Rabaruana Technical School', 'Rabaruana', 'Operational',
    'Engineering, Automotive, Construction', '200',
    'Modern Workshops, Library, Boarding', '🔧', 5
  UNION ALL SELECT 'Misima Skills Centre', 'Samarai-Murua', 'Planned',
    'Maritime, Agriculture, ICT', '80',
    'Workshop, Satellite Internet', '📡', 6
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM vet_centres);

-- Centre names shown in the selection-lists accordion.
INSERT INTO vet_centre_names (name, sort_order)
SELECT * FROM (
  SELECT 'Kwato TVET' AS name, 1 AS sort_order
  UNION ALL SELECT 'Rabaraba TVET', 2
  UNION ALL SELECT 'Sideia TVET', 3
  UNION ALL SELECT 'Ubuya TVET', 4
  UNION ALL SELECT 'Kaubwaga TVET', 5
  UNION ALL SELECT 'Nabusa TVET', 6
  UNION ALL SELECT 'Watuluma TVET', 7
  UNION ALL SELECT 'Bolubolu TVET', 8
  UNION ALL SELECT 'Ailuluai TVET', 9
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM vet_centre_names);

INSERT INTO vet_partners (name, sector, programs, icon, sort_order)
SELECT * FROM (
  SELECT 'PNG LNG Project' AS name, 'Oil & Gas' AS sector,
    'Engineering, Welding, Electrical, Safety' AS programs, '🛢️' AS icon, 1 AS sort_order
  UNION ALL SELECT 'Ok Tedi Mining', 'Mining',
    'Heavy Diesel, Electrical, Mechanical', '⛏️', 2
  UNION ALL SELECT 'Pacific Towing', 'Maritime',
    'Deck Rating, Engine Rating, Marine Engineering', '🚢', 3
  UNION ALL SELECT 'Kumul Consolidated Holdings', 'State Enterprises',
    'Multiple trades across subsidiaries', '🏛️', 4
  UNION ALL SELECT 'Alotau Chamber of Commerce', 'Private Sector',
    'Hospitality, Business, Construction', '🤝', 5
  UNION ALL SELECT 'Provincial Health Authority', 'Health',
    'Biomedical Equipment, Maintenance', '🏥', 6
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM vet_partners);

-- The icon and heading repeat on every row; the page reads them from the first.
INSERT INTO vet_apprenticeship (icon, heading, body, bullet, sort_order)
SELECT * FROM (
  SELECT '🎓' AS icon, 'Apprenticeship & Traineeship Program' AS heading,
    'The Division facilitates formal apprenticeships combining on-the-job training with structured off-the-job learning. Employers receive wage subsidies; apprentices earn while they learn.' AS body,
    '4-year apprenticeships in Engineering, Construction, Automotive' AS bullet, 1 AS sort_order
  UNION ALL SELECT '🎓', 'Apprenticeship & Traineeship Program',
    'The Division facilitates formal apprenticeships combining on-the-job training with structured off-the-job learning. Employers receive wage subsidies; apprentices earn while they learn.',
    '2-year traineeships in Hospitality, Business, ICT', 2
  UNION ALL SELECT '🎓', 'Apprenticeship & Traineeship Program',
    'The Division facilitates formal apprenticeships combining on-the-job training with structured off-the-job learning. Employers receive wage subsidies; apprentices earn while they learn.',
    'Competency-based progression (not time-based)', 3
  UNION ALL SELECT '🎓', 'Apprenticeship & Traineeship Program',
    'The Division facilitates formal apprenticeships combining on-the-job training with structured off-the-job learning. Employers receive wage subsidies; apprentices earn while they learn.',
    'National Trade Testing on completion', 4
  UNION ALL SELECT '🎓', 'Apprenticeship & Traineeship Program',
    'The Division facilitates formal apprenticeships combining on-the-job training with structured off-the-job learning. Employers receive wage subsidies; apprentices earn while they learn.',
    'Pathway to Certificate IV & Diploma', 5
  UNION ALL SELECT '🎓', 'Apprenticeship & Traineeship Program',
    'The Division facilitates formal apprenticeships combining on-the-job training with structured off-the-job learning. Employers receive wage subsidies; apprentices earn while they learn.',
    'Employer incentives & training support', 6
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM vet_apprenticeship);

INSERT INTO vet_initiatives (title, `desc`, icon, status, color, sort_order)
SELECT * FROM (
  SELECT 'New Centres in Alotau & Samarai' AS title,
    'K5M investment for two new VET centres opening 2026. Alotau: expanded engineering/automotive. Samarai: maritime focus for island communities.' AS `desc`,
    '🏫' AS icon, 'Underway' AS status, 'bg-teal-500' AS color, 1 AS sort_order
  UNION ALL SELECT 'Mobile Training Units',
    'Fully equipped training trucks delivering short courses to remote districts. 3 units operational reaching 500+ trainees annually in villages.',
    '🚚', 'Active', 'bg-blue-500', 2
  UNION ALL SELECT 'Recognition of Prior Learning (RPL)',
    'Fast-track certification for experienced workers without formal qualifications. Assessment weekends at all centres. 200+ certified in 2025.',
    '📜', 'Expanding', 'bg-amber-500', 3
  UNION ALL SELECT 'Women in Trades Initiative',
    'Targeted recruitment, mentoring, and support for women in non-traditional trades. 35% female enrolment target by 2027. Childcare at centres.',
    '👩‍🔧', 'Active', 'bg-pink-500', 4
  UNION ALL SELECT 'Green Skills & Renewable Energy',
    'New solar installation, biogas, and energy efficiency modules. Partnership with PNG Power & international NGOs. Aligned with PNG Climate Goals.',
    '☀️', 'New', 'bg-green-500', 5
  UNION ALL SELECT 'Digital Skills Integration',
    'Basic ICT & digital literacy embedded in all trade programs. Computer labs at all centres. E-portfolio for competency evidence.',
    '💻', 'Rolling Out', 'bg-indigo-500', 6
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM vet_initiatives);

INSERT INTO vet_enrolment_steps (step, title, `desc`, sort_order)
SELECT * FROM (
  SELECT '01' AS step, 'Choose a Trade' AS title,
    'Review programs at vet.mbpeducation.gov.pg or visit your nearest centre. Consider your interests, aptitude, and local job market.' AS `desc`, 1 AS sort_order
  UNION ALL SELECT '02', 'Check Eligibility',
    'Grade 10 certificate (minimum), medical fitness, age 16+. Mature entry (21+) considered with work experience. RPL available.', 2
  UNION ALL SELECT '03', 'Submit Application',
    'Online at VET portal or paper form at any centre. Attach: certificates, ID, medical report, references. No application fee.', 3
  UNION ALL SELECT '04', 'Selection & Interview',
    'Aptitude test + panel interview. Ranking based on grades, test, interview. Results within 2 weeks. Waitlist maintained.', 4
  UNION ALL SELECT '05', 'Enrol & Commence',
    'Accept offer, pay subsidized fees (K200–K500/term), attend orientation. Tools & PPE provided. Training starts first Monday of term.', 5
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM vet_enrolment_steps);

INSERT INTO vet_intake_dates (label, date_text, sort_order)
SELECT * FROM (
  SELECT 'January Intake Applications Open' AS label, '1 October 2025' AS date_text, 1 AS sort_order
  UNION ALL SELECT 'January Intake Applications Close', '30 November 2025', 2
  UNION ALL SELECT 'January Intake Interviews', '8–12 December 2025', 3
  UNION ALL SELECT 'January Intake Commences', '26 January 2026', 4
  UNION ALL SELECT 'July Intake Applications Open', '1 April 2026', 5
  UNION ALL SELECT 'July Intake Applications Close', '31 May 2026', 6
  UNION ALL SELECT 'July Intake Interviews', '9–13 June 2026', 7
  UNION ALL SELECT 'July Intake Commences', '20 July 2026', 8
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM vet_intake_dates);

INSERT INTO vet_support (icon, title, `desc`, sort_order)
SELECT * FROM (
  SELECT '📚' AS icon, 'Training Resources' AS title,
    'Learning guides, assessment tools, e-learning portal, industry-standard equipment' AS `desc`, 1 AS sort_order
  UNION ALL SELECT '👨‍🏫', 'Trainer Development',
    'Certificate IV in Training & Assessment, industry currency programs, moderation', 2
  UNION ALL SELECT '🏢', 'Employer Services',
    'Apprentice sign-up, wage subsidies, workplace assessor training, skills audits', 3
  UNION ALL SELECT '💰', 'Funding & Scholarships',
    'Government subsidies, industry scholarships, tool allowances, travel support', 4
  UNION ALL SELECT '📊', 'Quality Assurance',
    'Internal audit, external moderation, TVET Authority compliance, tracer studies', 5
  UNION ALL SELECT '🎯', 'Job Placement',
    'Industry job board, resume workshops, interview prep, graduate tracking system', 6
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM vet_support);

INSERT INTO vet_support_contact (heading, body, phone_label, phone_value, email_label, email_value, office_label, office_value, button_label, button_href, sort_order)
SELECT 'VET Helpdesk',
  'Information on courses, enrolment, apprenticeships, RPL, employer incentives, and centre locations.',
  'Provincial VET Coordinator', '+675 641 1234 (ext. 4)',
  'Email', 'vet@mbpeducation.gov.pg',
  'Office', 'Alotau VET Centre, Milne Bay',
  'Contact VET Team', '/contact', 1
WHERE NOT EXISTS (SELECT 1 FROM vet_support_contact);

INSERT INTO vet_faq (q, a, sort_order)
SELECT * FROM (
  SELECT 'What are the entry requirements for VET certificate courses?' AS q,
    'Minimum Grade 10 certificate pass. Some trades require specific subjects (e.g., Maths/Science for Engineering). Mature age entry (21+) with relevant work experience considered. Medical fitness certificate required.' AS a, 1 AS sort_order
  UNION ALL SELECT 'How much does VET training cost?',
    'Government-subsidized fees: K200–K500 per term depending on trade. Full fee-paying options available. Tool kits and PPE provided. Scholarships available for high-performing and disadvantaged students.', 2
  UNION ALL SELECT 'Can I do VET while working?',
    'Yes. Evening/weekend classes available for Certificate I in some trades. Block release (2 weeks on, 2 weeks off) for apprentices. RPL allows experienced workers to certify without full-time study.', 3
  UNION ALL SELECT 'What qualification will I receive?',
    'National Certificate Level 1 (NC1) on completion. Recognized by TVET Authority PNG. Pathways: NC2 → NC3 → Certificate IV → Diploma. Credit transfer to technical colleges and universities.', 4
  UNION ALL SELECT 'How do I apply for an apprenticeship?',
    'Employer must register with Division. Apprentice signs training contract. Division facilitates registration with TVET Authority. Wage subsidies available for employers. Contact VET Helpdesk for forms.', 5
  UNION ALL SELECT 'Are the new Samarai and Alotau centres open for 2026?',
    'Alotau VET Centre expansion: operational January 2026. Samarai VET Centre: opening July 2026 (maritime focus). Applications for both open October 2025. Limited places - apply early.', 6
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM vet_faq);

INSERT INTO vet_section_headings (skey, eyebrow, heading, blurb, sort_order)
SELECT * FROM (
  SELECT 'programs' AS skey, 'Trade Programs' AS eyebrow, 'Certificate Courses Offered' AS heading,
    'All programs are TVET Authority accredited. Graduates receive National Certificates (NC1) with pathways to NC2/NC3 and diploma programs.' AS blurb, 1 AS sort_order
  UNION ALL SELECT 'centres', 'Training Network', '6 VET Centres Province-Wide', NULL, 2
  UNION ALL SELECT 'selections', '2026 VET Selection', 'VET Centre Selection Lists',
    'Official 2026 VET trainee selection lists for Milne Bay Province TVET centres. Click a centre to view the selected trainees.', 3
  UNION ALL SELECT 'industry', 'Industry Partnerships', 'Training for Real Jobs',
    'Strong industry links ensure curriculum relevance, workplace placements, and employment pathways for graduates.', 4
  UNION ALL SELECT 'initiatives', 'Key Initiatives', 'Innovating Skills Development',
    'Strategic programs expanding access, improving quality, and aligning VET with emerging industry needs across Milne Bay.', 5
  UNION ALL SELECT 'enrolment', 'How to Enrol', 'Start Your Trade Career',
    'VET enrolments open twice yearly (January & July intakes). Priority given to Grade 10/12 school leavers and out-of-school youth aged 16–35.', 6
  UNION ALL SELECT 'support', 'Support & Resources', 'For Trainees, Employers & Trainers',
    'Comprehensive support ecosystem ensuring quality training delivery and successful outcomes for all VET stakeholders.', 7
  UNION ALL SELECT 'downloads', 'Resources', 'Documents & Downloads', NULL, 8
  UNION ALL SELECT 'faq', 'Frequently Asked', 'Common Questions', NULL, 9
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM vet_section_headings);

INSERT INTO downloads (name, type, size_text, category, description, file_path, program, sort_order)
SELECT * FROM (
  SELECT 'VET Prospectus 2026' AS name, 'PDF' AS type, '4.5 MB' AS size_text,
    'Guide' AS category, 'VET programme prospectus' AS description, '' AS file_path, 'vet' AS program, 1 AS sort_order
  UNION ALL SELECT 'Course Information Sheets (All Trades)', 'PDF', '8.2 MB', 'Curriculum',
    'Course information for every trade', '', 'vet', 2
  UNION ALL SELECT 'Enrolment Application Form', 'PDF', '650 KB', 'Forms',
    'VET enrolment application form', '', 'vet', 3
  UNION ALL SELECT 'Apprenticeship Guidelines for Employers', 'PDF', '2.1 MB', 'Guidelines',
    'Guidelines for employers taking apprentices', '', 'vet', 4
  UNION ALL SELECT 'RPL Application & Evidence Guide', 'PDF', '1.8 MB', 'Assessment',
    'Recognition of Prior Learning guide', '', 'vet', 5
  UNION ALL SELECT 'Centre Facility Standards', 'PDF', '3.4 MB', 'Standards',
    'Standards for training centre facilities', '', 'vet', 6
  UNION ALL SELECT 'Trainer Qualification Requirements', 'PDF', '920 KB', 'HR',
    'Trainer qualification requirements', '', 'vet', 7
  UNION ALL SELECT 'Graduate Tracer Study 2024', 'PDF', '2.7 MB', 'Reports',
    'Graduate tracer study report', '', 'vet', 8
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM downloads WHERE program = 'vet');
