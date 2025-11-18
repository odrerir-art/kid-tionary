-- =====================================================
-- Kid-tionary Database Setup
-- Run this FIRST before RLS_POLICIES.sql
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'parent', 'admin')),
  grade_level INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- 2. WORD_LISTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS word_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  words TEXT[] NOT NULL,
  grade_level INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_word_lists_teacher ON word_lists(teacher_id);

-- 3. WORD_SEARCHES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS word_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id),
  word TEXT NOT NULL,
  searched_at TIMESTAMP DEFAULT NOW(),
  grade_level INTEGER
);

CREATE INDEX IF NOT EXISTS idx_word_searches_student ON word_searches(student_id);
CREATE INDEX IF NOT EXISTS idx_word_searches_date ON word_searches(searched_at);
