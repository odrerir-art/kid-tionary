-- =====================================================
-- Kid-tionary Database Setup - Part 2
-- =====================================================

-- 4. WORD_IMAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS word_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word TEXT UNIQUE NOT NULL,
  image_url TEXT NOT NULL,
  generated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_word_images_word ON word_images(word);

-- 5. PICTURE_FEEDBACK TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS picture_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_helpful BOOLEAN NOT NULL,
  user_id UUID REFERENCES users(id),
  submitted_at TIMESTAMP DEFAULT NOW()
);

-- 6. LEARNING_PATHS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id),
  recommended_words TEXT[] NOT NULL,
  difficulty_level INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  completed BOOLEAN DEFAULT FALSE
);

-- 7. WORD_DEFINITIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS word_definitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word TEXT UNIQUE NOT NULL,
  phonetic TEXT,
  part_of_speech TEXT,
  definition_simple TEXT,
  definition_medium TEXT,
  definition_advanced TEXT,
  example TEXT,
  synonyms TEXT[],
  antonyms TEXT[],
  etymology TEXT,
  source TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
