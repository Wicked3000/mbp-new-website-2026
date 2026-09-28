-- Admin-managed content for the Basic Education page (/basic).
--
-- Every section on that page was hardcoded in src/pages/BasicEducation.tsx.
-- These tables hold the same content so it can be edited from the admin panel
-- without a code change. The seed rows are the exact text the page rendered
-- before, so the page is visually identical after this is applied.
--
-- sort_order drives the display order and is editable in the admin.
-- Empty results are not an error: the page falls back to its inline copy.

CREATE TABLE IF NOT EXISTS basic_hero (
  id INT AUTO_INCREMENT PRIMARY KEY,
  eyebrow VARCHAR(160) NOT NULL DEFAULT '',
  title VARCHAR(160) NOT NULL DEFAULT '',
  subtitle VARCHAR(160) NOT NULL DEFAULT '',
  description TEXT,
  banner VARCHAR(255) DEFAULT NULL,
  alt VARCHAR(255) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS basic_overview (
  id INT AUTO_INCREMENT PRIMARY KEY,
  eyebrow VARCHAR(160) NOT NULL DEFAULT '',
  heading VARCHAR(255) NOT NULL DEFAULT '',
  intro TEXT,
  body TEXT,
  features_title VARCHAR(160) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS basic_overview_cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(16) NOT NULL DEFAULT '',
  title VARCHAR(255) NOT NULL DEFAULT '',
  `desc` TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_basic_overview_cards_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS basic_overview_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  feature TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_basic_overview_features_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS basic_overview_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  value_text VARCHAR(80) NOT NULL DEFAULT '',
  label VARCHAR(120) NOT NULL DEFAULT '',
  color VARCHAR(60) NOT NULL DEFAULT 'bg-[#0B2545]',
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_basic_overview_stats_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS basic_curriculum (
  id INT AUTO_INCREMENT PRIMARY KEY,
  area VARCHAR(160) NOT NULL DEFAULT '',
  grades VARCHAR(40) NOT NULL DEFAULT '',
  `desc` TEXT,
  icon VARCHAR(16) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_basic_curriculum_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS basic_initiatives (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL DEFAULT '',
  `desc` TEXT,
  icon VARCHAR(16) NOT NULL DEFAULT '',
  status VARCHAR(60) NOT NULL DEFAULT '',
  color VARCHAR(60) NOT NULL DEFAULT 'bg-teal-500',
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_basic_initiatives_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS basic_support (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(16) NOT NULL DEFAULT '',
  title VARCHAR(255) NOT NULL DEFAULT '',
  `desc` TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_basic_support_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS basic_faq (
  id INT AUTO_INCREMENT PRIMARY KEY,
  q TEXT NOT NULL,
  a TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_basic_faq_order (sort_order)
) ENGINE=InnoDB;

-- The support panel's contact block sits beside the support cards.
CREATE TABLE IF NOT EXISTS basic_support_contact (
  id INT AUTO_INCREMENT PRIMARY KEY,
  heading VARCHAR(255) NOT NULL DEFAULT '',
  body TEXT,
  phone_label VARCHAR(160) NOT NULL DEFAULT '',
  phone_value VARCHAR(120) NOT NULL DEFAULT '',
  email_label VARCHAR(160) NOT NULL DEFAULT '',
  email_value VARCHAR(190) NOT NULL DEFAULT '',
  office_label VARCHAR(160) NOT NULL DEFAULT '',
  office_value VARCHAR(255) NOT NULL DEFAULT '',
  button_label VARCHAR(120) NOT NULL DEFAULT '',
  button_href VARCHAR(255) NOT NULL DEFAULT '/contact',
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- Section headings are edited as their own rows so the admin does not need a
-- separate copy of each section's chrome.
CREATE TABLE IF NOT EXISTS basic_section_headings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  skey VARCHAR(80) NOT NULL UNIQUE,
  eyebrow VARCHAR(160) NOT NULL DEFAULT '',
  heading VARCHAR(255) NOT NULL DEFAULT '',
  blurb TEXT,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

