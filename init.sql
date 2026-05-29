-- Create tables for NoteHub application

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  google_id VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  picture VARCHAR(500),
  password_hash VARCHAR(255),
  semester VARCHAR(50),
  department VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  uploader_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  uploader_name VARCHAR(255) NOT NULL,
  subject VARCHAR(100),
  semester VARCHAR(50),
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  file_type VARCHAR(20),
  file_size VARCHAR(20),
  verified BOOLEAN DEFAULT FALSE,
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3,1) DEFAULT 0,
  likes INTEGER DEFAULT 0,
  file_url VARCHAR(500),
  file_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  points INTEGER DEFAULT 0,
  rank INTEGER,
  uploads INTEGER DEFAULT 0,
  badges INTEGER DEFAULT 0,
  verified_notes INTEGER DEFAULT 0,
  collaborations INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages/Chat table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  group_name VARCHAR(100) DEFAULT 'General',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Profile table
CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  interests TEXT[],
  badges TEXT[],
  verified_notes INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  rank INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Study Groups table
CREATE TABLE IF NOT EXISTS study_groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(100),
  creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Study Group Members table
CREATE TABLE IF NOT EXISTS study_group_members (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES study_groups(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(group_id, user_id)
);

-- Help Requests table
CREATE TABLE IF NOT EXISTS help_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Broadcasts table
CREATE TABLE IF NOT EXISTS broadcasts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notes_uploader_id ON notes(uploader_id);
CREATE INDEX IF NOT EXISTS idx_notes_verified ON notes(verified);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_group ON messages(group_name);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON leaderboard(user_id);
CREATE INDEX IF NOT EXISTS idx_study_groups_creator ON study_groups(creator_id);
CREATE INDEX IF NOT EXISTS idx_study_group_members_group ON study_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_help_requests_status ON help_requests(status);

-- Insert seed data
INSERT INTO users (name, email, semester, department) VALUES 
('Tushar Khandagale', 'tushar@notehub.com', '7th Semester', 'Computer Engineering'),
('Omkar Pokharkar', 'omkar@notehub.com', '7th Semester', 'Computer Engineering'),
('Raj Jadhav', 'raj@notehub.com', '6th Semester', 'Computer Engineering')
ON CONFLICT (email) DO NOTHING;

-- Seed notes (consolidated — no duplicates)
INSERT INTO notes (title, uploader_id, uploader_name, subject, semester, file_type, file_size, verified, downloads, rating, likes, file_name) VALUES
('Data Structures - Complete Notes', (SELECT id FROM users WHERE name = 'Tushar Khandagale' LIMIT 1), 'Tushar Khandagale', 'Computer Science', 'Semester 5', 'PDF', '2.4 MB', TRUE, 156, 4.8, 89, 'data-structures.pdf'),
('Operating Systems Chapter 3', (SELECT id FROM users WHERE name = 'Omkar Pokharkar' LIMIT 1), 'Omkar Pokharkar', 'Computer Science', 'Semester 5', 'PDF', '1.8 MB', TRUE, 124, 4.6, 67, 'os-chapter3.pdf'),
('Database Management Systems - Complete Course', (SELECT id FROM users WHERE name = 'Raj Jadhav' LIMIT 1), 'Raj Jadhav', 'Computer Science', 'Semester 6', 'PDF', '3.2 MB', TRUE, 245, 4.9, 156, 'dbms-complete.pdf'),
('Machine Learning Algorithms', (SELECT id FROM users WHERE name = 'Raj Jadhav' LIMIT 1), 'Raj Jadhav', 'Computer Science', 'Semester 7', 'PDF', '5.6 MB', TRUE, 512, 4.9, 289, 'ml-algorithms.pdf')
ON CONFLICT DO NOTHING;

-- Seed Leaderboard
INSERT INTO leaderboard (user_id, name, points, rank, uploads, badges, verified_notes)
SELECT id, name, 
  CASE 
    WHEN name = 'Tushar Khandagale' THEN 892
    WHEN name = 'Omkar Pokharkar' THEN 765
    WHEN name = 'Raj Jadhav' THEN 698
    ELSE 0
  END,
  CASE 
    WHEN name = 'Tushar Khandagale' THEN 1
    WHEN name = 'Omkar Pokharkar' THEN 2
    WHEN name = 'Raj Jadhav' THEN 3
    ELSE 0
  END,
  CASE 
    WHEN name = 'Tushar Khandagale' THEN 4
    WHEN name = 'Omkar Pokharkar' THEN 2
    WHEN name = 'Raj Jadhav' THEN 1
    ELSE 0
  END,
  CASE 
    WHEN name = 'Tushar Khandagale' THEN 3
    WHEN name = 'Omkar Pokharkar' THEN 2
    WHEN name = 'Raj Jadhav' THEN 1
    ELSE 0
  END,
  CASE 
    WHEN name = 'Tushar Khandagale' THEN 2
    WHEN name = 'Omkar Pokharkar' THEN 1
    WHEN name = 'Raj Jadhav' THEN 1
    ELSE 0
  END
FROM users
WHERE name IN ('Tushar Khandagale', 'Omkar Pokharkar', 'Raj Jadhav')
ON CONFLICT DO NOTHING;
