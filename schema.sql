-- Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Clubs
CREATE TABLE IF NOT EXISTS clubs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(100) NOT NULL,                       -- legacy single Field for back-compat
  club_type VARCHAR(50) DEFAULT NULL,                  -- legacy (kept for back-compat)
  primary_mode VARCHAR(50) DEFAULT NULL,               -- legacy (kept for back-compat)

  volunteer_hours TINYINT(1) NOT NULL DEFAULT 0,
  meeting_frequency ENUM('weekly','biweekly','monthly','event') DEFAULT NULL,

  meeting_time_type ENUM('lunch','after_school') DEFAULT NULL,
  meeting_time_range VARCHAR(100) DEFAULT '',

  meeting_room VARCHAR(50) DEFAULT NULL,               -- NEW: matches server
  website_url VARCHAR(512) DEFAULT NULL,               -- NEW: matches server

  open_to_all TINYINT(1) NOT NULL DEFAULT 1,
  prereq_required TINYINT(1) NOT NULL DEFAULT 0,
  prerequisites VARCHAR(255) DEFAULT '',

  description TEXT,
  president_code VARCHAR(255) DEFAULT NULL,
  status ENUM('pending','approved') NOT NULL DEFAULT 'approved',

  president_id INT,
  CONSTRAINT fk_clubs_president FOREIGN KEY (president_id) REFERENCES users(id) ON DELETE SET NULL,

  CONSTRAINT uq_club_name_code UNIQUE (name, president_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- STEM subfields master list
CREATE TABLE IF NOT EXISTS subfields (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Weekdays
CREATE TABLE IF NOT EXISTS meeting_days (
  id INT PRIMARY KEY,
  name VARCHAR(20) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO meeting_days (id,name) VALUES
  (1,'Monday'),(2,'Tuesday'),(3,'Wednesday'),(4,'Thursday'),(5,'Friday')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Join: club ↔ subfields
CREATE TABLE IF NOT EXISTS club_subfields (
  club_id INT NOT NULL,
  subfield_id INT NOT NULL,
  PRIMARY KEY (club_id, subfield_id),
  CONSTRAINT fk_cs_club FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
  CONSTRAINT fk_cs_sub FOREIGN KEY (subfield_id) REFERENCES subfields(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Join: club ↔ meeting days
CREATE TABLE IF NOT EXISTS club_meeting_days (
  club_id INT NOT NULL,
  day_id INT NOT NULL,
  PRIMARY KEY (club_id, day_id),
  CONSTRAINT fk_cmd_club FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
  CONSTRAINT fk_cmd_day FOREIGN KEY (day_id) REFERENCES meeting_days(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Multi-select: Fields / Focus Area (STEM, Arts, etc.)
CREATE TABLE IF NOT EXISTS club_fields (
  club_id INT NOT NULL,
  field_label VARCHAR(100) NOT NULL,   -- matches server
  PRIMARY KEY (club_id, field_label),
  CONSTRAINT fk_cf_club FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Multi-select: Categories (competition, activity, community, research, advocacy, outreach)
CREATE TABLE IF NOT EXISTS club_categories (
  club_id INT NOT NULL,
  category VARCHAR(50) NOT NULL,       -- matches server
  PRIMARY KEY (club_id, category),
  CONSTRAINT fk_cc_club FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
