-- Admin-managed content for the VET page (/vet).
--
-- Same shape as the basic_* and post_* sets. Every section of the VET page was
-- hardcoded in src/pages/VET.tsx; these tables hold the same content so it can
-- be edited from the admin panel.
--
-- VET selection lists are deliberately NOT here. They hold trainees' names and
-- the API keeps selection_students admin-only, so no copy belongs in a page
-- bundle. VET_CENTRES is public place data and is kept in vet_centres.

CREATE TABLE IF NOT EXISTS vet_hero (
  id INT AUTO_INCREMENT PRIMARY KEY,
  eyebrow VARCHAR(160) NOT NULL DEFAULT '',
  title VARCHAR(160) NOT NULL DEFAULT '',
  subtitle VARCHAR(160) NOT NULL DEFAULT '',
  description TEXT,
  banner VARCHAR(255) DEFAULT NULL,
  alt VARCHAR(255) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vet_overview (
  id INT AUTO_INCREMENT PRIMARY KEY,
  eyebrow VARCHAR(160) NOT NULL DEFAULT '',
  heading VARCHAR(255) NOT NULL DEFAULT '',
  intro TEXT,
  body TEXT,
  features_title VARCHAR(160) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vet_overview_cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(16) NOT NULL DEFAULT '',
  title VARCHAR(255) NOT NULL DEFAULT '',
  `desc` TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_vet_overview_cards_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vet_overview_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  feature TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_vet_overview_features_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vet_overview_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  value_text VARCHAR(80) NOT NULL DEFAULT '',
  label VARCHAR(120) NOT NULL DEFAULT '',
  color VARCHAR(60) NOT NULL DEFAULT 'bg-[#0D9488]',
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_vet_overview_stats_order (sort_order)
) ENGINE=InnoDB;

-- Trade programs. `trades` lists the specialisations within the qualification.
CREATE TABLE IF NOT EXISTS vet_programs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(40) NOT NULL DEFAULT '',
  name VARCHAR(200) NOT NULL DEFAULT '',
  duration VARCHAR(60) NOT NULL DEFAULT '',
  level VARCHAR(40) NOT NULL DEFAULT '',
  trades TEXT,
  icon VARCHAR(16) NOT NULL DEFAULT '',
  color VARCHAR(60) NOT NULL DEFAULT 'bg-amber-500',
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_vet_programs_order (sort_order)
) ENGINE=InnoDB;

-- Training centres, with the district and facility detail each card shows.
CREATE TABLE IF NOT EXISTS vet_centres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL DEFAULT '',
  district VARCHAR(120) NOT NULL DEFAULT '',
  status VARCHAR(60) NOT NULL DEFAULT 'Operational',
  programs TEXT,
  capacity VARCHAR(40) NOT NULL DEFAULT '',
  facilities TEXT,
  icon VARCHAR(16) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_vet_centres_order (sort_order)
) ENGINE=InnoDB;

-- The centre names listed in the selection-lists accordion. Place data, not
-- personal data, so it is safe to publish.
CREATE TABLE IF NOT EXISTS vet_centre_names (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_vet_centre_names_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vet_partners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL DEFAULT '',
  sector VARCHAR(160) NOT NULL DEFAULT '',
  programs TEXT,
  icon VARCHAR(16) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_vet_partners_order (sort_order)
) ENGINE=InnoDB;

-- The Apprenticeship & Traineeship callout under the partner grid.
CREATE TABLE IF NOT EXISTS vet_apprenticeship (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(16) NOT NULL DEFAULT '',
  heading VARCHAR(255) NOT NULL DEFAULT '',
  body TEXT,
  bullet TEXT,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vet_initiatives (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL DEFAULT '',
  `desc` TEXT,
  icon VARCHAR(16) NOT NULL DEFAULT '',
  status VARCHAR(60) NOT NULL DEFAULT '',
  color VARCHAR(60) NOT NULL DEFAULT 'bg-teal-500',
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_vet_initiatives_order (sort_order)
) ENGINE=InnoDB;

-- The five enrolment steps on the left of the How to Enrol section.
CREATE TABLE IF NOT EXISTS vet_enrolment_steps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  step VARCHAR(8) NOT NULL DEFAULT '',
  title VARCHAR(200) NOT NULL DEFAULT '',
  `desc` TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_vet_enrolment_steps_order (sort_order)
) ENGINE=InnoDB;

-- The intake date table beside the enrolment steps.
CREATE TABLE IF NOT EXISTS vet_intake_dates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(200) NOT NULL DEFAULT '',
  date_text VARCHAR(80) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_vet_intake_dates_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vet_support (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(16) NOT NULL DEFAULT '',
  title VARCHAR(255) NOT NULL DEFAULT '',
  `desc` TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_vet_support_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vet_support_contact (
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

CREATE TABLE IF NOT EXISTS vet_faq (
  id INT AUTO_INCREMENT PRIMARY KEY,
  q TEXT NOT NULL,
  a TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_vet_faq_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vet_section_headings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  skey VARCHAR(80) NOT NULL UNIQUE,
  eyebrow VARCHAR(160) NOT NULL DEFAULT '',
  heading VARCHAR(255) NOT NULL DEFAULT '',
  blurb TEXT,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;
