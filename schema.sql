CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  pubDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  tags TEXT, -- JSON array string
  content_path TEXT NOT NULL, -- Path in R2
  is_published INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS portfolio (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  year INTEGER,
  link TEXT,
  tags TEXT, -- JSON array string
  content_path TEXT NOT NULL, -- Path in R2
  is_published INTEGER DEFAULT 0
);
