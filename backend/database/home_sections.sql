-- Admin-managed content for the three hardcoded home page sections.
--
-- Most of the home page already reads from existing tables: the hero slider
-- from hero_slides, quick links, stats, programs, news, notices, events,
-- leadership, districts and partners each have their own admin page. Only the
-- mission section, the selection banner and the WhatsApp call to action were
-- hardcoded in src/App.tsx, and these tables cover those.
--
-- What is deliberately not here: the WhatsApp subscribe form's behaviour. The
-- form still posts to /api/whatsapp/subscribe through api.subscribeWhatsApp.
-- Only its copy and channel list are editable.

CREATE TABLE IF NOT EXISTS home_mission (
  id INT AUTO_INCREMENT PRIMARY KEY,
  eyebrow VARCHAR(160) NOT NULL DEFAULT '',
  heading VARCHAR(255) NOT NULL DEFAULT '',
  heading_accent VARCHAR(255) NOT NULL DEFAULT '',
  para1 TEXT,
  para2 TEXT,
  image VARCHAR(255) DEFAULT NULL,
  image_alt VARCHAR(255) NOT NULL DEFAULT '',
  badge_value VARCHAR(40) NOT NULL DEFAULT '',
  badge_label VARCHAR(160) NOT NULL DEFAULT '',
  badge_sub VARCHAR(190) NOT NULL DEFAULT '',
  button_label VARCHAR(120) NOT NULL DEFAULT '',
  button_href VARCHAR(255) NOT NULL DEFAULT '/about',
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS home_mission_points (
  id INT AUTO_INCREMENT PRIMARY KEY,
  feature TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_home_mission_points_order (sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS home_selection_banner (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(16) NOT NULL DEFAULT '',
  title VARCHAR(255) NOT NULL DEFAULT '',
  badge VARCHAR(40) NOT NULL DEFAULT '',
  body TEXT,
  primary_label VARCHAR(120) NOT NULL DEFAULT '',
  primary_href VARCHAR(255) NOT NULL DEFAULT '/selections',
  secondary_label VARCHAR(120) NOT NULL DEFAULT '',
  secondary_href VARCHAR(255) NOT NULL DEFAULT '/downloads',
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS home_cta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  badge VARCHAR(60) NOT NULL DEFAULT '',
  heading VARCHAR(255) NOT NULL DEFAULT '',
  body TEXT,
  sub_body TEXT,
  image VARCHAR(255) DEFAULT NULL,
  image_alt VARCHAR(255) NOT NULL DEFAULT '',
  tagline VARCHAR(160) NOT NULL DEFAULT '',
  form_title VARCHAR(200) NOT NULL DEFAULT '',
  form_body TEXT,
  phone_label VARCHAR(160) NOT NULL DEFAULT '',
  phone_placeholder VARCHAR(60) NOT NULL DEFAULT '',
  channel_label VARCHAR(160) NOT NULL DEFAULT '',
  channel_prompt VARCHAR(120) NOT NULL DEFAULT '',
  button_label VARCHAR(160) NOT NULL DEFAULT '',
  button_loading_label VARCHAR(160) NOT NULL DEFAULT '',
  response_note VARCHAR(255) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- Options for the WhatsApp channel dropdown. These values are stored as the
-- "source" column on whatsapp_subscribers, so renaming one does not rewrite
-- existing subscribers that were recorded under the old label.
CREATE TABLE IF NOT EXISTS home_cta_channels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_home_cta_channels_order (sort_order)
) ENGINE=InnoDB;
