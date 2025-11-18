-- RUN THIS IN SUPABASE SQL EDITOR TO FIX THE DATABASE

-- 1. Drop conflicting tables
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS student_profiles CASCADE;

-- 2. Create profiles table (references auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'parent')),
  grade_level INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage profiles"
  ON profiles FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 5. Update learning_paths to reference auth.users
ALTER TABLE learning_paths DROP CONSTRAINT IF EXISTS learning_paths_student_id_fkey;
ALTER TABLE learning_paths ADD CONSTRAINT learning_paths_student_id_fkey 
  FOREIGN KEY (student_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 6. TO CREATE ADMIN USER:
-- Go to Supabase Dashboard > Authentication > Users > Add User
-- Email: admin@yourdomain.com
-- Password: (your secure password)
-- Then run this with the new user's ID:
-- INSERT INTO profiles (id, email, full_name, role) 
-- VALUES ('paste-user-id-here', 'admin@yourdomain.com', 'Admin User', 'admin');
