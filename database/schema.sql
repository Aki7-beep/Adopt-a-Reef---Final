-- Adopt a Reef — MySQL schema for XAMPP (phpMyAdmin)
-- Run this entire file in phpMyAdmin or: mysql -u root < database/schema.sql

CREATE DATABASE IF NOT EXISTS adopt_a_reef
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE adopt_a_reef;

DROP TABLE IF EXISTS volunteer_signups;
DROP TABLE IF EXISTS volunteer_works;
DROP TABLE IF EXISTS donations;
DROP TABLE IF EXISTS adoptions;
DROP TABLE IF EXISTS corals;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  is_admin TINYINT(1) NOT NULL DEFAULT 0,
  first_name VARCHAR(255) NULL,
  last_name VARCHAR(255) NULL,
  email VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE corals (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price INT NOT NULL,
  stock INT NOT NULL
) ENGINE=InnoDB;

CREATE TABLE adoptions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  coral_id VARCHAR(36) NULL,
  coral_name VARCHAR(255) NOT NULL,
  coral_image TEXT NOT NULL,
  amount INT NOT NULL,
  price INT NOT NULL,
  adopted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (coral_id) REFERENCES corals(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE donations (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  amount INT NOT NULL,
  donor_name VARCHAR(255) NULL,
  donor_email VARCHAR(255) NULL,
  donated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE volunteer_works (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  scheduled_for DATETIME NOT NULL,
  end_date DATETIME NULL,
  hours INT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'open',
  category VARCHAR(32) NOT NULL DEFAULT 'other',
  max_volunteers INT NULL
) ENGINE=InnoDB;

CREATE TABLE volunteer_signups (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  work_id VARCHAR(36) NOT NULL,
  signed_up_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_work (user_id, work_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (work_id) REFERENCES volunteer_works(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Sample corals
INSERT INTO corals (id, name, image, description, price, stock) VALUES
('c1111111-1111-4111-8111-111111111101', 'Staghorn Coral', '/figmaAssets/adopt/coral-1.png', 'Fast-growing branching coral that builds the reef''s structural backbone.', 50, 25),
('c1111111-1111-4111-8111-111111111102', 'Brain Coral', '/figmaAssets/adopt/coral-2.png', 'Slow-growing dome coral known for its grooved, brain-like surface.', 75, 15),
('c1111111-1111-4111-8111-111111111103', 'Elkhorn Coral', '/figmaAssets/adopt/coral-3.png', 'Critically endangered shallow-water coral with broad, antler-like branches.', 90, 10);

-- Sample volunteer opportunities (dates relative to import time)
INSERT INTO volunteer_works (id, title, description, location, scheduled_for, end_date, hours, status, category, max_volunteers) VALUES
('v1111111-1111-4111-8111-111111111101', 'Reef Cleanup Dive — Santa Cruz Island', 'Join certified local divers to remove ghost nets and debris from the reefs surrounding Great Santa Cruz Island in Zamboanga City''s bay.', 'Great Santa Cruz Island, Zamboanga City', DATE_ADD(NOW(), INTERVAL 14 DAY), DATE_ADD(NOW(), INTERVAL 14 DAY) + INTERVAL 6 HOUR, 6, 'open', 'cleanup', 20),
('v1111111-1111-4111-8111-111111111102', 'Coral Nursery Maintenance — Basilan Strait', 'Help clean underwater nursery trees, monitor coral fragment growth, and prep colonies for outplanting at our Basilan Strait restoration site.', 'Basilan Strait, Zamboanga City', DATE_ADD(NOW(), INTERVAL 21 DAY), NULL, 4, 'open', 'replanting', 15),
('v1111111-1111-4111-8111-111111111103', 'Cawa-Cawa Boulevard Beach Cleanup', 'A morning shoreline cleanup along Cawa-Cawa Boulevard focused on microplastics and single-use waste. Gloves and eco-bags provided.', 'Cawa-Cawa Boulevard, Zamboanga City', DATE_ADD(NOW(), INTERVAL 7 DAY), NULL, 3, 'open', 'cleanup', 30),
('v1111111-1111-4111-8111-111111111104', 'Mangrove Replanting — Rio Hondo', 'Restore the coastal mangrove buffer along Rio Hondo that shields nearby reef zones from sedimentation and land runoff.', 'Rio Hondo, Zamboanga City', DATE_ADD(NOW(), INTERVAL 30 DAY), DATE_ADD(NOW(), INTERVAL 31 DAY), 5, 'open', 'replanting', 25),
('v1111111-1111-4111-8111-111111111105', 'School Outreach — WMSU Marine Biology Day', 'We partnered with Western Mindanao State University to teach students about coral biology and responsible fishing.', 'Western Mindanao State University, Zamboanga City', DATE_SUB(NOW(), INTERVAL 12 DAY), NULL, 4, 'completed', 'outreach', NULL),
('v1111111-1111-4111-8111-111111111106', 'Reef Survey — Sibugay Bay', 'Volunteer divers logged coral bleaching observations and fish population data across reef sites near Zamboanga City.', 'Sibugay Bay, Zamboanga City', DATE_SUB(NOW(), INTERVAL 28 DAY), DATE_SUB(NOW(), INTERVAL 25 DAY), 8, 'completed', 'survey', NULL);
