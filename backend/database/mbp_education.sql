-- MBP Education Admin - MySQL Database (XAMPP / phpMyAdmin)
-- Create database: mbp_education

CREATE DATABASE IF NOT EXISTS mbp_education CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mbp_education;

SET FOREIGN_KEY_CHECKS=0;

-- Users (admin auth)
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(80) NOT NULL UNIQUE,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL DEFAULT '',
  role ENUM('super_admin','editor') NOT NULL DEFAULT 'editor',
  -- Bumped on every password change; tokens carrying an older value are rejected.
  auth_version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Hero slider
DROP TABLE IF EXISTS hero_slides;
CREATE TABLE hero_slides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  src TEXT NOT NULL,
  alt VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- News
DROP TABLE IF EXISTS news;
CREATE TABLE news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tag VARCHAR(40) NOT NULL,
  tag_color VARCHAR(40) NOT NULL DEFAULT 'bg-[#0D9488]',
  news_date VARCHAR(40) NOT NULL,
  title VARCHAR(300) NOT NULL,
  excerpt TEXT NOT NULL,
  img MEDIUMTEXT NOT NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  is_previous TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Notices
DROP TABLE IF EXISTS notices;
CREATE TABLE notices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  notice_date VARCHAR(20) NOT NULL,
  title VARCHAR(300) NOT NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Events
DROP TABLE IF EXISTS events;
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  month VARCHAR(10) NOT NULL,
  day VARCHAR(10) NOT NULL,
  title VARCHAR(255) NOT NULL,
  event_time VARCHAR(150) NOT NULL,
  cat VARCHAR(60) NOT NULL,
  color VARCHAR(80) NOT NULL DEFAULT 'bg-[#0B2545]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Programs
DROP TABLE IF EXISTS programs;
CREATE TABLE programs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL,
  label VARCHAR(80) NOT NULL,
  level VARCHAR(80) NOT NULL,
  description TEXT NOT NULL,
  color VARCHAR(40) NOT NULL,
  accent VARCHAR(40) NOT NULL,
  href VARCHAR(120) NOT NULL,
  img TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Stats
DROP TABLE IF EXISTS stats;
CREATE TABLE stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  value_text VARCHAR(40) NOT NULL,
  label VARCHAR(60) NOT NULL,
  sub VARCHAR(60) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- Districts
DROP TABLE IF EXISTS districts;
CREATE TABLE districts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  capital VARCHAR(120) DEFAULT NULL,
  schools INT NOT NULL DEFAULT 0,
  type VARCHAR(40) NOT NULL,
  students VARCHAR(40) NOT NULL DEFAULT '0',
  img TEXT DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Existing databases: ALTER TABLE districts
--   ADD COLUMN capital VARCHAR(120) DEFAULT NULL,
--   ADD COLUMN img TEXT DEFAULT NULL,
--   ADD COLUMN sort_order INT NOT NULL DEFAULT 0;

-- Milne Bay Province has FOUR districts. The district capital is shown on the
-- district page and in the directory.

-- Schools (optional detailed)
DROP TABLE IF EXISTS schools;
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  district_id INT NULL,
  name VARCHAR(160) NOT NULL,
  district VARCHAR(80) NOT NULL,
  type VARCHAR(60) NOT NULL DEFAULT 'Provincial High',
  level VARCHAR(60) NOT NULL DEFAULT 'Primary',
  capacity INT DEFAULT 0,
  enrolled INT DEFAULT 0,
  img TEXT DEFAULT NULL,
  head_teacher VARCHAR(160) DEFAULT NULL,
  contact VARCHAR(160) DEFAULT NULL,
  location VARCHAR(160) DEFAULT NULL,
  male INT NOT NULL DEFAULT 0,
  female INT NOT NULL DEFAULT 0,
  teachers INT NOT NULL DEFAULT 0,
  staff INT NOT NULL DEFAULT 0,
  lat DECIMAL(10,7) DEFAULT NULL,
  lng DECIMAL(10,7) DEFAULT NULL,
  -- Contact & address
  email VARCHAR(160) DEFAULT NULL,
  address TEXT DEFAULT NULL,
  alt_phone VARCHAR(60) DEFAULT NULL,
  contact_person VARCHAR(160) DEFAULT NULL,
  -- Identity
  code VARCHAR(60) DEFAULT NULL,
  established INT DEFAULT NULL,
  day_boarding VARCHAR(40) DEFAULT 'Day',
  category VARCHAR(60) DEFAULT 'Government',
  -- Facilities
  classrooms INT NOT NULL DEFAULT 0,
  land_hectares DECIMAL(7,2) DEFAULT NULL,
  has_library VARCHAR(3) DEFAULT 'No',
  has_computer_lab VARCHAR(3) DEFAULT 'No',
  has_science_lab VARCHAR(3) DEFAULT 'No',
  has_sports_field VARCHAR(3) DEFAULT 'No',
  has_boarding VARCHAR(3) DEFAULT 'No',
  -- Staffing
  principal VARCHAR(160) DEFAULT NULL,
  teachers_male INT NOT NULL DEFAULT 0,
  teachers_female INT NOT NULL DEFAULT 0,
  untrained_teachers INT NOT NULL DEFAULT 0,
  admin_officers INT NOT NULL DEFAULT 0,
  support_staff INT NOT NULL DEFAULT 0,
  -- Academics
  streams TEXT DEFAULT NULL,
  exam_centre VARCHAR(80) DEFAULT NULL,
  extracurricular TEXT DEFAULT NULL,
  -- Students & logistics
  day_students INT NOT NULL DEFAULT 0,
  boarders INT NOT NULL DEFAULT 0,
  transport TEXT DEFAULT NULL,
  uniform TEXT DEFAULT NULL,
  fees TEXT DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Existing databases: run the statements below in place of a fresh import.
-- ALTER TABLE schools
--   ADD COLUMN img TEXT DEFAULT NULL,
--   ADD COLUMN head_teacher VARCHAR(160) DEFAULT NULL,
--   ADD COLUMN contact VARCHAR(160) DEFAULT NULL,
--   ADD COLUMN location VARCHAR(160) DEFAULT NULL,
--   ADD COLUMN male INT NOT NULL DEFAULT 0,
--   ADD COLUMN female INT NOT NULL DEFAULT 0,
--   ADD COLUMN teachers INT NOT NULL DEFAULT 0,
--   ADD COLUMN staff INT NOT NULL DEFAULT 0,
--   ADD COLUMN lat DECIMAL(10,7) DEFAULT NULL,
--   ADD COLUMN lng DECIMAL(10,7) DEFAULT NULL,
--   ADD COLUMN email VARCHAR(160) DEFAULT NULL,
--   ADD COLUMN address TEXT DEFAULT NULL,
--   ADD COLUMN alt_phone VARCHAR(60) DEFAULT NULL,
--   ADD COLUMN contact_person VARCHAR(160) DEFAULT NULL,
--   ADD COLUMN code VARCHAR(60) DEFAULT NULL,
--   ADD COLUMN established INT DEFAULT NULL,
--   ADD COLUMN day_boarding VARCHAR(40) DEFAULT 'Day',
--   ADD COLUMN category VARCHAR(60) DEFAULT 'Government',
--   ADD COLUMN classrooms INT NOT NULL DEFAULT 0,
--   ADD COLUMN land_hectares DECIMAL(7,2) DEFAULT NULL,
--   ADD COLUMN has_library VARCHAR(3) DEFAULT 'No',
--   ADD COLUMN has_computer_lab VARCHAR(3) DEFAULT 'No',
--   ADD COLUMN has_science_lab VARCHAR(3) DEFAULT 'No',
--   ADD COLUMN has_sports_field VARCHAR(3) DEFAULT 'No',
--   ADD COLUMN has_boarding VARCHAR(3) DEFAULT 'No',
--   ADD COLUMN principal VARCHAR(160) DEFAULT NULL,
--   ADD COLUMN teachers_male INT NOT NULL DEFAULT 0,
--   ADD COLUMN teachers_female INT NOT NULL DEFAULT 0,
--   ADD COLUMN untrained_teachers INT NOT NULL DEFAULT 0,
--   ADD COLUMN admin_officers INT NOT NULL DEFAULT 0,
--   ADD COLUMN support_staff INT NOT NULL DEFAULT 0,
--   ADD COLUMN streams TEXT DEFAULT NULL,
--   ADD COLUMN exam_centre VARCHAR(80) DEFAULT NULL,
--   ADD COLUMN extracurricular TEXT DEFAULT NULL,
--   ADD COLUMN day_students INT NOT NULL DEFAULT 0,
--   ADD COLUMN boarders INT NOT NULL DEFAULT 0,
--   ADD COLUMN transport TEXT DEFAULT NULL,
--   ADD COLUMN uniform TEXT DEFAULT NULL,
--   ADD COLUMN fees TEXT DEFAULT NULL,
--   ADD COLUMN notes TEXT DEFAULT NULL,
--   ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Leadership
DROP TABLE IF EXISTS leadership;
CREATE TABLE leadership (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  title VARCHAR(160) NOT NULL,
  bio TEXT NOT NULL,
  icon VARCHAR(20) DEFAULT '👨‍💼',
  photo TEXT DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- Partners
DROP TABLE IF EXISTS partners;
CREATE TABLE partners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  logo TEXT DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE whatsapp_subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(20) NOT NULL UNIQUE,
  source VARCHAR(120) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Quick links
DROP TABLE IF EXISTS quick_links;
CREATE TABLE quick_links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(20) NOT NULL,
  label VARCHAR(80) NOT NULL,
  description VARCHAR(160) NOT NULL,
  href VARCHAR(160) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- Selections Grade 9
DROP TABLE IF EXISTS selections_grade9;
CREATE TABLE selections_grade9 (
  id INT AUTO_INCREMENT PRIMARY KEY,
  school VARCHAR(160) NOT NULL,
  district VARCHAR(80) NOT NULL,
  type VARCHAR(80) NOT NULL DEFAULT 'Provincial High',
  capacity INT NOT NULL DEFAULT 0,
  placed INT NOT NULL DEFAULT 0,
  stream VARCHAR(200) NOT NULL DEFAULT '',
  cutoff INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- Selections Grade 11 (streams as JSON)
DROP TABLE IF EXISTS selections_grade11;
CREATE TABLE selections_grade11 (
  id INT AUTO_INCREMENT PRIMARY KEY,
  school VARCHAR(160) NOT NULL,
  district VARCHAR(80) NOT NULL,
  type VARCHAR(80) NOT NULL DEFAULT 'Provincial High',
  streams_json TEXT NOT NULL COMMENT 'JSON: {Science: 80, ...}',
  placed_json TEXT NOT NULL COMMENT 'JSON: {Science: 78, ...}',
  cutoff_json TEXT NOT NULL COMMENT 'JSON: {Science: 220, ...}'
) ENGINE=InnoDB;

-- Contact messages
DROP TABLE IF EXISTS contact_messages;
CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(40) DEFAULT NULL,
  email VARCHAR(160) NOT NULL,
  category VARCHAR(60) NOT NULL DEFAULT 'General Enquiry',
  district VARCHAR(60) DEFAULT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('new','read','replied','archived') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Downloads
DROP TABLE IF EXISTS downloads;
CREATE TABLE downloads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'PDF',
  size_text VARCHAR(30) NOT NULL DEFAULT '',
  category VARCHAR(60) NOT NULL DEFAULT 'General',
  description TEXT DEFAULT NULL,
  file_path VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Site settings
DROP TABLE IF EXISTS site_settings;
CREATE TABLE site_settings (
  skey VARCHAR(80) PRIMARY KEY,
  svalue TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS=1;

-- SEED DATA
INSERT INTO users (username,email,password_hash,role) VALUES
('admin','admin@mbpeducation.gov.pg','', 'super_admin');
-- The seed deliberately ships with NO password: any hash committed here is
-- public, and a known hash means anyone who reads this repository can sign in.
-- Set one right after importing, then change it from Admin -> Settings:
--   npm run admin:password -- admin 'a long unique passphrase'
-- Accounts with an empty password_hash are refused by both APIs.

INSERT INTO hero_slides (src,alt,sort_order) VALUES
('/assets/slider/mbp-img1.jpg','Milne Bay students and community learning',1),
('/assets/slider/mbp-img2.jpg','Milne Bay Province schools and education',2),
('/assets/slider/mbp-img3.jpg','Milne Bay coastal education community',3);

INSERT INTO news (tag,tag_color,news_date,title,excerpt,img) VALUES
('Announcement','bg-[#0D9488]','September 18, 2026','Grade 8 and Grade 10 Examination Timetable Released','The Division of Education has officially released the 2026 examination timetable for all Grade 8 and Grade 10 students across Milne Bay Province.','https://images.unsplash.com/photo-1627423896085-e3e694d88e40?w=600&h=380&fit=crop&auto=format'),
('Programs','bg-[#C9A84C] text-[#0B2545]','September 10, 2026','New VET Training Centres to Open in Alotau and Samarai','Two new Vocational Education and Training centres are set to open in Term 4, expanding skills-based learning opportunities for youth across the province.','https://images.unsplash.com/photo-1632215861513-130b66fe97f4?w=600&h=380&fit=crop&auto=format'),
('Notice','bg-[#0B2545]','August 29, 2026','School Subsidy Payment Schedule for Term 4 Now Available','Head teachers and school boards are advised to collect the Term 4 subsidy payment schedules from the Division office by 5 October 2026.','https://images.unsplash.com/photo-1632932693914-89b90ae3d16d?w=600&h=380&fit=crop&auto=format');

INSERT INTO notices (notice_date,title) VALUES
('Sep 22','PEB Meeting – October 2026 agenda published'),
('Sep 17','Teacher Relief Grant applications close 30 Sep'),
('Sep 12','Grade 12 trial exam results now available'),
('Sep 5','School board compliance audit schedule released'),
('Aug 28','Curriculum support materials distributed to all districts'),
('Aug 20','Annual School Sports Carnival registration open');

INSERT INTO events (month,day,title,event_time,cat,color) VALUES
('OCT','07','Grade 8 National Examinations','8:00 AM \u2022 All Centres','Examinations','bg-[#0B2545]'),
('OCT','14','PEB Quarterly Meeting \u2014 Alotau','9:00 AM \u2022 Provincial HQ','Governance','bg-[#0D9488]'),
('NOV','03','School Sports Carnival 2026','All Day \u2022 Alotau Oval','Co-Curricular','bg-[#C9A84C] text-[#0B2545]'),
('DEC','05','Grade 10 & 12 Results Release','Online & School Noticeboards','Results','bg-[#163663]');

INSERT INTO programs (code,label,level,description,color,accent,href,img,sort_order) VALUES
('01','Basic Education','Elementary \u2013 Grade 8','Providing foundational literacy, numeracy and life skills for all children from Prep through to Grade 8 across Milne Bay.','bg-[#0B2545]','bg-teal-500','/basic','/assets/education_programs/basic/banner.jpg',1),
('02','Post Primary','Grade 9 \u2013 Grade 12','Secondary education pathways preparing students for tertiary admission, technical training, and employment in the formal sector.','bg-[#163663]','bg-amber-400','/post','/assets/education_programs/post/banner.jpg',2),
('03','VET','Vocational Education','Skills and trades training for out-of-school youth and adults, delivered through registered VET providers across the province.','bg-[#0D9488]','bg-amber-300','/vet','/assets/education_programs/vet/banner.jpg',3),
('04','FODE','Flexible Open & Distance','Distance and open learning enabling students in remote areas to access quality secondary education without leaving their communities.','bg-[#0B2545]','bg-teal-400','/fode','/assets/education_programs/fode/banner.jpg',4);

INSERT INTO stats (value_text,label,sub,sort_order) VALUES
('312','Schools','Province-wide',1),
('48,200+','Students','Enrolled 2026',2),
('2,140','Teachers','Qualified staff',3),
  ('4','Districts','Covered',4);

-- Milne Bay Province has FOUR districts. Do not add rows for settlements or
-- islands (Losuia, Rabaruana, Dobu, Huhu ...) - those are towns, not districts.
INSERT INTO districts (name,capital,schools,type,students,sort_order) VALUES
('Alotau','Alotau / Rabaraba',42,'Urban','6,800+',1),
('Samarai-Murua','Misima',22,'Island','1,900+',2),
('Esa\'ala','Esa\'ala',15,'Island','1,600+',3),
('Kiriwina-Goodenough','Losuia',18,'Island','2,100+',4);

-- Schools. Names match those already referenced by the selection lists so the
-- two features stay consistent. district_id is resolved by name below.
INSERT INTO schools (district_id,name,district,type,level,capacity,enrolled,male,female,teachers,staff,head_teacher,contact,location) VALUES
((SELECT id FROM districts WHERE name='Alotau'),'Alotau Primary School','Alotau','Provincial Primary','Primary',420,398,206,192,24,31,'Mr. Peter G. Wai','+675 641 1234 ext. 101','Alotau Town'),
((SELECT id FROM districts WHERE name='Alotau'),'Alotau Secondary School','Alotau','Provincial High','Secondary',250,248,126,122,17,23,'Ms. Grace L. Kila','+675 641 1234 ext. 103','Alotau Town'),
((SELECT id FROM districts WHERE name='Alotau'),'Cameron Secondary School','Alotau','National High','Secondary',300,298,152,146,21,29,'Dr. John K. Boro','+675 641 1234 ext. 104','Alotau'),
((SELECT id FROM districts WHERE name='Alotau'),'Bwesiruru Secondary','Alotau','Provincial High','Secondary',180,178,92,86,13,17,'Mr. Amos L. Kila','+675 641 1234 ext. 105','Bwesiruru'),
((SELECT id FROM districts WHERE name='Alotau'),'Hagita Secondary School','Alotau','Provincial High','Secondary',160,158,80,78,12,15,'Ms. Ruth M. Tama','+675 641 1234 ext. 106','Hagita'),
((SELECT id FROM districts WHERE name='Kiriwina-Goodenough'),'Kiriwina Secondary School','Kiriwina-Goodenough','Provincial High','Secondary',120,118,61,57,9,12,'Mr. Joseph B. Kam','+675 641 1234 ext. 107','Kiriwina');
-- lat/lng are intentionally NULL: enter the real coordinates for each school in
-- /admin/schools and the Google Maps link appears on the district page.

INSERT INTO leadership (name,title,bio,icon,sort_order) VALUES
('Dr. John K. Boro','Provincial Education Advisor','Over 25 years in educational leadership across PNG. Holds a PhD in Educational Administration from UPNG.','👨‍💼',1),
('Ms. Margaret M. Tari','Deputy Advisor - Basic Education','Former head teacher with extensive experience in elementary and primary curriculum implementation.','👩‍🏫',2),
('Mr. Peter G. Wai','Deputy Advisor - Post Primary & VET','Specialist in secondary education pathways and vocational training coordination across the province.','👨‍🏫',3),
('Ms. Grace L. Kila','Director - FODE & Distance Learning','Champion of flexible learning for remote communities. Masters in Distance Education from DWU.','👩‍💻',4);

INSERT INTO partners (name,sort_order) VALUES
('National Dept. of Education',1),
('Teaching Service Commission',2),
('TVET Authority',3),
('UNICEF PNG',4),
('Australia PNG Partnership',5),
('World Bank',6);

INSERT INTO quick_links (icon,label,description,href,sort_order) VALUES
('calendar','Term Dates','2026 Academic Calendar','/#news',1),
('school','School Directory','Find schools in Milne Bay','/basic#schools',2),
('file','Forms & Downloads','Official documents','/basic',3),
('phone','Emergency Contacts','Helpline & support','/contact',4);

INSERT INTO selections_grade9 (school,district,type,capacity,placed,stream,cutoff) VALUES
('Cameron Secondary School','Alotau','National High',300,298,'Science, Humanities, Business',185),
('Alotau Secondary School','Alotau','Provincial High',250,248,'Science, Humanities, Business, Technical',165),
('Bwesiruru Secondary','Alotau','Provincial High',180,178,'Science, Humanities, Business',145),
('Hagita Secondary School','Alotau','Provincial High',160,158,'Humanities, Business, Technical',135),
('Kiriwina Secondary School','Kiriwina-Goodenough','Provincial High',120,118,'Humanities, Business',125),
('Samarai Secondary School','Samarai-Murua','Provincial High',80,78,'Humanities, Business',110);

INSERT INTO selections_grade11 (school,district,type,streams_json,placed_json,cutoff_json) VALUES
('Cameron Secondary School','Alotau','National High','{\"Science\":80,\"Humanities\":60,\"Business\":40}','{\"Science\":78,\"Humanities\":58,\"Business\":38}','{\"Science\":220,\"Humanities\":200,\"Business\":190}'),
('Alotau Secondary School','Alotau','Provincial High','{\"Science\":60,\"Humanities\":50,\"Business\":40,\"Technical\":30}','{\"Science\":58,\"Humanities\":48,\"Business\":38,\"Technical\":28}','{\"Science\":200,\"Humanities\":185,\"Business\":175,\"Technical\":165}');

INSERT INTO site_settings (skey,svalue) VALUES
('site_phone','+675 641 1234'),
('site_email','info@mbpeducation.gov.pg'),
('site_hours','Mon – Fri: 8:00am – 4:30pm'),
('site_address','Division of Education, Alotau, Milne Bay Province, PNG'),
('helpdesk_phone','+675 641 1234'),
('helpdesk_email','help@mbpeducation.gov.pg'),
('emergency_note','For urgent school or student matters — cyclones, closures, safety.');
