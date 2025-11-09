# Kid-tionary Database Schema

## Overview
All tables are already created in Supabase. This document serves as reference.

---

## Tables

### 1. `users`
Stores student and teacher accounts

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'parent')),
  grade_level INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);
```

### 2. `word_lists`
Teacher-created vocabulary lists

```sql
CREATE TABLE word_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  words TEXT[] NOT NULL,
  grade_level INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. `word_searches`
Tracks student word searches

```sql
CREATE TABLE word_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id),
  word TEXT NOT NULL,
  searched_at TIMESTAMP DEFAULT NOW(),
  grade_level INTEGER
);
```

### 4. `word_images`
Caches AI-generated word visualizations

```sql
CREATE TABLE word_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word TEXT UNIQUE NOT NULL,
  image_url TEXT NOT NULL,
  generated_at TIMESTAMP DEFAULT NOW()
);
```

### 5. `picture_feedback`
User feedback on AI images

```sql
CREATE TABLE picture_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_helpful BOOLEAN NOT NULL,
  user_id UUID REFERENCES users(id),
  submitted_at TIMESTAMP DEFAULT NOW()
);
```

### 6. `learning_paths`
Personalized learning recommendations

```sql
CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id),
  recommended_words TEXT[] NOT NULL,
  difficulty_level INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  completed BOOLEAN DEFAULT FALSE
);
```

### 7. `word_definitions`
Cached word definitions from multiple sources

```sql
CREATE TABLE word_definitions (
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
```

---

---

## Row Level Security (RLS)

All tables have RLS enabled. Policies allow:
- Students: Read their own data
- Teachers: Read/write their class data
- Public: Read word_images (cached definitions)

---

## Indexes

Performance indexes on:
- `users.username`
- `word_searches.student_id`
- `word_searches.searched_at`
- `word_lists.teacher_id`
- `word_images.word`
