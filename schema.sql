-- hluaguo.com Database Schema Update

-- Journal Posts (with image_path)
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  pubDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  tags TEXT, -- JSON array string
  content_path TEXT NOT NULL, -- Path in R2
  image_path TEXT, -- Feature image path in R2
  is_published INTEGER DEFAULT 0
);

-- Portfolio Projects (with image_path)
CREATE TABLE IF NOT EXISTS portfolio (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  year INTEGER,
  link TEXT,
  tags TEXT, -- JSON array string
  content_path TEXT NOT NULL, -- Path in R2
  image_path TEXT, -- Project image path in R2
  is_published INTEGER DEFAULT 0
);

-- Atlas / Explored Places
CREATE TABLE IF NOT EXISTS places (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  note TEXT,
  image_path TEXT, -- Path in R2
  visit_date DATETIME DEFAULT CURRENT_TIMESTAMP
);
