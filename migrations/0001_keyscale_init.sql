-- Keyscale Database Schema Migration 0001
-- Cloudflare D1 (SQLite)

CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  website TEXT,
  country TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS families (
  id TEXT PRIMARY KEY,
  brand_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS keyboards (
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  family TEXT,
  family_id TEXT,
  sku TEXT,
  width REAL, -- mm
  depth REAL, -- mm
  height REAL, -- mm
  front_height REAL, -- mm
  rear_height REAL, -- mm
  weight REAL, -- grams
  layout TEXT, -- 100%, TKL, 75%, 65%, 60%, 40%
  key_count INTEGER,
  technology TEXT, -- Mechanical, Magnetic / Hall effect, Optical, Membrane
  connectivity TEXT, -- Wired, 2.4GHz, Bluetooth
  wired INTEGER DEFAULT 1,
  wireless INTEGER DEFAULT 0,
  bluetooth INTEGER DEFAULT 0,
  wireless24 INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Current',
  release_year INTEGER,
  verified_date TEXT,
  last_verified TEXT,
  dimension_unit TEXT DEFAULT 'mm',
  weight_unit TEXT DEFAULT 'g',
  note TEXT,
  image_url TEXT,
  review_flag INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_keyboards_brand ON keyboards(brand);
CREATE INDEX IF NOT EXISTS idx_keyboards_family ON keyboards(family_id);
CREATE INDEX IF NOT EXISTS idx_keyboards_layout ON keyboards(layout);
CREATE INDEX IF NOT EXISTS idx_keyboards_dims ON keyboards(width, depth, height);

CREATE TABLE IF NOT EXISTS specification_claims (
  id TEXT PRIMARY KEY,
  keyboard_id TEXT NOT NULL,
  field_name TEXT NOT NULL,
  claimed_value TEXT NOT NULL,
  normalized_value REAL,
  unit TEXT,
  source_url TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_tier INTEGER DEFAULT 1, -- Tier 1 (Manufacturer) to 5 (Unverified)
  confidence_grade REAL DEFAULT 1.0,
  checked_date TEXT NOT NULL,
  condition_note TEXT,
  review_state TEXT DEFAULT 'verified',
  FOREIGN KEY (keyboard_id) REFERENCES keyboards(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_claims_keyboard ON specification_claims(keyboard_id);

CREATE TABLE IF NOT EXISTS price_observations (
  id TEXT PRIMARY KEY,
  keyboard_id TEXT NOT NULL,
  retailer TEXT NOT NULL,
  market_country TEXT NOT NULL,
  currency TEXT NOT NULL,
  amount REAL NOT NULL,
  amount_usd REAL NOT NULL,
  product_url TEXT NOT NULL,
  variant_note TEXT,
  availability TEXT DEFAULT 'in-stock',
  condition TEXT DEFAULT 'new',
  checked_date TEXT NOT NULL,
  is_stale INTEGER DEFAULT 0,
  FOREIGN KEY (keyboard_id) REFERENCES keyboards(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_prices_keyboard ON price_observations(keyboard_id);

CREATE TABLE IF NOT EXISTS research_queue (
  id TEXT PRIMARY KEY,
  keyboard_id TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  missing_field TEXT NOT NULL,
  priority INTEGER DEFAULT 3,
  status TEXT DEFAULT 'pending', -- pending, researching, verified, unavailable
  attempts INTEGER DEFAULT 0,
  last_searched TEXT,
  recommended_query TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_research_status ON research_queue(status);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  actor TEXT DEFAULT 'system',
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
