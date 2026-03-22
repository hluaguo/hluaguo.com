-- Seeding Initial Atlas Pins

-- 1. Istanbul (Koç University)
INSERT OR REPLACE INTO places (id, name, lat, lng, note, visit_date) 
VALUES (
  'istanbul-koc', 
  'Koç University, Istanbul', 
  41.2050, 
  29.0720, 
  'Currently established as an exchange student. A chaotic, beautiful bridge between worlds.',
  CURRENT_TIMESTAMP
);

-- 2. Kyoto, Japan
INSERT OR REPLACE INTO places (id, name, lat, lng, note, visit_date) 
VALUES (
  'kyoto-japan', 
  'Kyoto, Japan', 
  35.0116, 
  135.7681, 
  'Exploring the stone paths of Higashiyama. A perfect blend of history and atmosphere.',
  CURRENT_TIMESTAMP
);
