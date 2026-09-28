-- Admin-managed content for the Post Primary page (/post).
--
-- Mirrors backend/database/basic_education_sections.sql for the Post Primary
-- page. Every section there was hardcoded in src/pages/PostPrimary.tsx; these
-- tables hold the same content so it can be edited from the admin panel.
--
-- Student selection lists are deliberately NOT in this file. They come from
-- the selection_students table, which the API restricts to authenticated
-- admins, and no copy of them belongs in a page bundle.

CREATE TABLE IF NOT EXISTS post_hero (
  id INT AUTO_INCREMENT PRIMARY KEY,
  eyebrow VARCHAR(160) NOT NULL DEFAULT '',
  title VARCHAR(160) NOT NULL DEFAULT '',
  subtitle VARCHAR(160) NOT NULL DEFAULT '',
  description TEXT,
  banner VARCHAR(255) DEFAULT NULL,
  alt VARCHAR(255) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS post_overview (
  id INT AUTO_INCREMENT PRIMARY KEY,
  eyebrow VARCHAR(160) NOT NULL DEFAULT '',
  heading VARCHAR(255) NOT NULL DEFAULT '',
  intro TEXT,
  body TEXT,
  features_title VARCHAR(160) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS post_overview_cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(16) NOT NULL DEFAULT '',
  title VARCHAR(255) NOT NULL DEFAULT '',
  `desc` TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_post_overview_cards_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS post_overview_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  feature TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_post_overview_features_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS post_overview_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  value_text VARCHAR(80) NOT NULL DEFAULT '',
  label VARCHAR(120) NOT NULL DEFAULT '',
  color VARCHAR(60) NOT NULL DEFAULT 'bg-[#163663]',
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_post_overview_stats_order (sort_order)
) ENGINE=InnoDB;

-- Curriculum & Streams. `subjects` rather than `desc` because the original
-- field listed the subjects taught, not a description.
CREATE TABLE IF NOT EXISTS post_streams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL DEFAULT '',
  grades VARCHAR(40) NOT NULL DEFAULT '',
  subjects TEXT,
  icon VARCHAR(16) NOT NULL DEFAULT '',
  color VARCHAR(60) NOT NULL DEFAULT 'bg-blue-500',
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_post_streams_order (sort_order)
) ENGINE=InnoDB;

-- The Assessment & Certification callout that sits under the stream grid.
CREATE TABLE IF NOT EXISTS post_assessment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(16) NOT NULL DEFAULT '',
  heading VARCHAR(255) NOT NULL DEFAULT '',
  bullet TEXT,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS post_pathways (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL DEFAULT '',
  `desc` TEXT,
  icon VARCHAR(16) NOT NULL DEFAULT '',
  color VARCHAR(60) NOT NULL DEFAULT 'bg-blue-500',
  stats VARCHAR(120) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_post_pathways_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS post_initiatives (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL DEFAULT '',
  `desc` TEXT,
  icon VARCHAR(16) NOT NULL DEFAULT '',
  status VARCHAR(60) NOT NULL DEFAULT '',
  color VARCHAR(60) NOT NULL DEFAULT 'bg-amber-500',
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_post_initiatives_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS post_support (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(16) NOT NULL DEFAULT '',
  title VARCHAR(255) NOT NULL DEFAULT '',
  `desc` TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_post_support_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS post_support_contact (
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

CREATE TABLE IF NOT EXISTS post_faq (
  id INT AUTO_INCREMENT PRIMARY KEY,
  q TEXT NOT NULL,
  a TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_post_faq_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS post_section_headings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  skey VARCHAR(80) NOT NULL UNIQUE,
  eyebrow VARCHAR(160) NOT NULL DEFAULT '',
  heading VARCHAR(255) NOT NULL DEFAULT '',
  blurb TEXT,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;
