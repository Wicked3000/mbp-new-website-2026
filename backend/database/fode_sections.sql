-- Admin-managed content for the FODE page (/fode).
--
-- Same shape as the basic_*, post_* and vet_* sets. Every section of the FODE
-- page was hardcoded in src/pages/FODE.tsx; these tables hold the same content
-- so it can be edited from the admin panel.
--
-- FODE selection lists are deliberately NOT here. They hold students' names and
-- the API keeps selection_students admin-only, so no copy belongs in a page
-- bundle.

CREATE TABLE IF NOT EXISTS fode_hero (
  id INT AUTO_INCREMENT PRIMARY KEY,
  eyebrow VARCHAR(160) NOT NULL DEFAULT '',
  title VARCHAR(160) NOT NULL DEFAULT '',
  subtitle VARCHAR(160) NOT NULL DEFAULT '',
  description TEXT,
  banner VARCHAR(255) DEFAULT NULL,
  alt VARCHAR(255) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS fode_overview (
  id INT AUTO_INCREMENT PRIMARY KEY,
  eyebrow VARCHAR(160) NOT NULL DEFAULT '',
  heading VARCHAR(255) NOT NULL DEFAULT '',
  intro TEXT,
  body TEXT,
  features_title VARCHAR(160) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS fode_overview_cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(16) NOT NULL DEFAULT '',
  title VARCHAR(255) NOT NULL DEFAULT '',
  `desc` TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_fode_overview_cards_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS fode_overview_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  feature TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_fode_overview_features_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS fode_overview_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  value_text VARCHAR(80) NOT NULL DEFAULT '',
  label VARCHAR(120) NOT NULL DEFAULT '',
  color VARCHAR(60) NOT NULL DEFAULT 'bg-[#0B2545]',
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_fode_overview_stats_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS fode_programs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL DEFAULT '',
  level VARCHAR(80) NOT NULL DEFAULT '',
  duration VARCHAR(60) NOT NULL DEFAULT '',
  subjects TEXT,
  target VARCHAR(255) NOT NULL DEFAULT '',
  icon VARCHAR(16) NOT NULL DEFAULT '',
  color VARCHAR(60) NOT NULL DEFAULT 'bg-blue-500',
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_fode_programs_order (sort_order)
) ENGINE=InnoDB;

-- `type` is a reserved-ish word kept as centre_type so the entity layer stays
-- simple; the page maps it back to the "type" field the cards display.
CREATE TABLE IF NOT EXISTS fode_centres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL DEFAULT '',
  district VARCHAR(120) NOT NULL DEFAULT '',
  centre_type VARCHAR(60) NOT NULL DEFAULT 'Main Centre',
  students VARCHAR(40) NOT NULL DEFAULT '',
  facilities TEXT,
  coordinator VARCHAR(160) NOT NULL DEFAULT '',
  icon VARCHAR(16) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_fode_centres_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS fode_delivery_methods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL DEFAULT '',
  `desc` TEXT,
  icon VARCHAR(16) NOT NULL DEFAULT '',
  availability VARCHAR(120) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_fode_delivery_methods_order (sort_order)
) ENGINE=InnoDB;

-- The FODE Mobile App callout under the delivery method grid.
CREATE TABLE IF NOT EXISTS fode_app_callout (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(16) NOT NULL DEFAULT '',
  heading VARCHAR(255) NOT NULL DEFAULT '',
  body TEXT,
  bullet TEXT,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS fode_enrolment_steps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  step VARCHAR(8) NOT NULL DEFAULT '',
  title VARCHAR(200) NOT NULL DEFAULT '',
  `desc` TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_fode_enrolment_steps_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS fode_key_dates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(200) NOT NULL DEFAULT '',
  date_text VARCHAR(120) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_fode_key_dates_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS fode_support (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(16) NOT NULL DEFAULT '',
  title VARCHAR(255) NOT NULL DEFAULT '',
  `desc` TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_fode_support_order (sort_order)
) ENGINE=InnoDB;

-- The helpdesk panel has four contact rows; whatsapp is the extra one
-- compared with the other programme pages.
CREATE TABLE IF NOT EXISTS fode_support_contact (
  id INT AUTO_INCREMENT PRIMARY KEY,
  heading VARCHAR(255) NOT NULL DEFAULT '',
  body TEXT,
  phone_label VARCHAR(160) NOT NULL DEFAULT '',
  phone_value VARCHAR(120) NOT NULL DEFAULT '',
  email_label VARCHAR(160) NOT NULL DEFAULT '',
  email_value VARCHAR(190) NOT NULL DEFAULT '',
  whatsapp_label VARCHAR(160) NOT NULL DEFAULT '',
  whatsapp_value VARCHAR(120) NOT NULL DEFAULT '',
  office_label VARCHAR(160) NOT NULL DEFAULT '',
  office_value VARCHAR(255) NOT NULL DEFAULT '',
  button_label VARCHAR(120) NOT NULL DEFAULT '',
  button_href VARCHAR(255) NOT NULL DEFAULT '/contact',
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS fode_initiatives (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL DEFAULT '',
  `desc` TEXT,
  icon VARCHAR(16) NOT NULL DEFAULT '',
  status VARCHAR(60) NOT NULL DEFAULT '',
  color VARCHAR(60) NOT NULL DEFAULT 'bg-teal-500',
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_fode_initiatives_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS fode_faq (
  id INT AUTO_INCREMENT PRIMARY KEY,
  q TEXT NOT NULL,
  a TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_fode_faq_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS fode_section_headings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  skey VARCHAR(80) NOT NULL UNIQUE,
  eyebrow VARCHAR(160) NOT NULL DEFAULT '',
  heading VARCHAR(255) NOT NULL DEFAULT '',
  blurb TEXT,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;
