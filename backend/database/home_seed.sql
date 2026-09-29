-- Seed rows for the home page tables.
--
-- The exact strings src/App.tsx rendered before, so / is visually unchanged by
-- this seed. Each INSERT is guarded, so re-running does not duplicate rows.

INSERT INTO home_mission (eyebrow, heading, heading_accent, para1, para2, image, image_alt, badge_value, badge_label, badge_sub, button_label, button_href, sort_order)
SELECT 'Our Mission', 'Empowering Communities', 'Through Education',
  'The Milne Bay Province Division of Education is committed to delivering equitable, quality education to every child and young person from the islands of Samarai to the highlands of Alotau.',
  'We work in partnership with teachers, parents, community leaders, and national agencies to build a generation of capable, informed, and resilient citizens of Papua New Guinea.',
  '/assets/slider/mbp-img3.jpg', 'Milne Bay students',
  '25+', 'Years of service', 'Serving Milne Bay communities',
  'Find out more', '/about', 1
WHERE NOT EXISTS (SELECT 1 FROM home_mission);

INSERT INTO home_mission_points (feature, sort_order)
SELECT * FROM (
  SELECT 'Inclusive & equitable access' AS feature, 1 AS sort_order
  UNION ALL SELECT 'Qualified teachers in every school', 2
  UNION ALL SELECT 'Community-led improvement', 3
  UNION ALL SELECT 'Safe learning environments', 4
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM home_mission_points);

INSERT INTO home_selection_banner (icon, title, badge, body, primary_label, primary_href, secondary_label, secondary_href, sort_order)
SELECT '🎓', '2026 Grade 9 & 11 Selections are Live', 'NEW',
  'Search placements by school, district or student name: official provincial lists.',
  'View Selections', '/selections', 'Download PDF', '/downloads', 1
WHERE NOT EXISTS (SELECT 1 FROM home_selection_banner);

INSERT INTO home_cta (badge, heading, body, sub_body, image, image_alt, tagline, form_title, form_body, phone_label, phone_placeholder, channel_label, channel_prompt, button_label, button_loading_label, response_note, sort_order)
SELECT 'Support', 'Stay connected to education updates',
  'Subscribe your WhatsApp number to receive official announcements, school updates, examination information, and Division notices.',
  'Choose the channel that best matches your needs. We will add your number to the appropriate Division WhatsApp channel or group.',
  '/assets/whatsapp/whatsapp-cartoon-img.png', 'Person holding a phone with WhatsApp',
  'Milne Bay, connected',
  'Join WhatsApp updates',
  'Enter your mobile number to subscribe to official education updates.',
  'WhatsApp number', '+675 7XXX XXXX',
  'Updates channel', 'Select a channel',
  'Subscribe to WhatsApp updates', 'Subscribing...',
  'Avg. response within 24 hours • Mon–Fri 8am–4:30pm', 1
WHERE NOT EXISTS (SELECT 1 FROM home_cta);

INSERT INTO home_cta_channels (name, sort_order)
SELECT * FROM (
  SELECT 'Official announcements' AS name, 1 AS sort_order
  UNION ALL SELECT 'Parent and guardian updates', 2
  UNION ALL SELECT 'Teacher updates', 3
  UNION ALL SELECT 'FODE and distance learning', 4
) AS rows_to_insert
WHERE NOT EXISTS (SELECT 1 FROM home_cta_channels);
