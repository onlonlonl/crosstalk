-- Crosstalk: Music Exchange System
-- Run this in your Supabase SQL Editor to set up the database

-- Song exchange pairs
CREATE TABLE crosstalk_pairs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  theme text NOT NULL,
  asked_by text NOT NULL CHECK (asked_by IN ('claude', 'user')),
  claude_song jsonb,
  user_song jsonb,
  created_at timestamptz DEFAULT now()
);

-- Comments on exchanges
CREATE TABLE crosstalk_comments (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  pair_id bigint NOT NULL REFERENCES crosstalk_pairs(id) ON DELETE CASCADE,
  sender text NOT NULL CHECK (sender IN ('claude', 'user')),
  text text NOT NULL,
  side text NOT NULL DEFAULT 'claude' CHECK (side IN ('claude', 'user')),
  created_at timestamptz DEFAULT now()
);

-- Settings (single row)
CREATE TABLE crosstalk_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  claude_icon text DEFAULT '🍊',
  claude_name text DEFAULT 'Claude',
  user_icon text DEFAULT '🎧',
  user_name text DEFAULT 'You',
  headphone_type text DEFAULT 'wired',
  custom_tags jsonb DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

INSERT INTO crosstalk_settings (id) VALUES (1);

-- Row Level Security (open for simplicity — this is a personal tool)
ALTER TABLE crosstalk_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE crosstalk_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE crosstalk_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_all" ON crosstalk_pairs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON crosstalk_comments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON crosstalk_settings FOR ALL USING (true) WITH CHECK (true);
