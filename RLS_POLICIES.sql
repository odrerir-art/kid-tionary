-- =====================================================
-- Kid-tionary RLS Policies
-- =====================================================

-- 1. DROP EXISTING POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Anyone can read word definitions" ON word_definitions;
DROP POLICY IF EXISTS "Admins can manage definitions" ON word_definitions;
DROP POLICY IF EXISTS "Anyone can read word images" ON word_images;
DROP POLICY IF EXISTS "Admins can manage images" ON word_images;
DROP POLICY IF EXISTS "Users can read their own lists" ON word_lists;
DROP POLICY IF EXISTS "Teachers can manage their lists" ON word_lists;
DROP POLICY IF EXISTS "Users can read their searches" ON word_searches;
DROP POLICY IF EXISTS "Users can create searches" ON word_searches;
DROP POLICY IF EXISTS "Users can read their learning paths" ON learning_paths;
DROP POLICY IF EXISTS "System can manage learning paths" ON learning_paths;
DROP POLICY IF EXISTS "Users can read their profile" ON users;
DROP POLICY IF EXISTS "Users can update their profile" ON users;
DROP POLICY IF EXISTS "Authenticated users can submit feedback" ON picture_feedback;
DROP POLICY IF EXISTS "Admins can manage feedback" ON picture_feedback;
DROP POLICY IF EXISTS "Admins can manage flagged words" ON flagged_words;
DROP POLICY IF EXISTS "Admins can manage PayPal settings" ON paypal_settings;

-- 2. ENABLE RLS
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE picture_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE flagged_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE paypal_settings ENABLE ROW LEVEL SECURITY;

-- 3. WORD_DEFINITIONS (Public Read, Admin Write)
-- =====================================================
CREATE POLICY "Anyone can read word definitions"
ON word_definitions FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage definitions"
ON word_definitions FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- 4. WORD_IMAGES (Public Read, System Write)
-- =====================================================
CREATE POLICY "Anyone can read word images"
ON word_images FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage images"
ON word_images FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- 5. WORD_LISTS (Teacher-owned)
-- =====================================================
CREATE POLICY "Users can read their own lists"
ON word_lists FOR SELECT TO authenticated
USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can manage their lists"
ON word_lists FOR ALL TO authenticated
USING (teacher_id = auth.uid());

-- 6. WORD_SEARCHES (Student-owned)
-- =====================================================
CREATE POLICY "Users can read their searches"
ON word_searches FOR SELECT TO authenticated
USING (student_id = auth.uid());

CREATE POLICY "Users can create searches"
ON word_searches FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid());

-- 7. LEARNING_PATHS (Student-owned)
-- =====================================================
CREATE POLICY "Users can read their learning paths"
ON learning_paths FOR SELECT TO authenticated
USING (student_id = auth.uid());

CREATE POLICY "System can manage learning paths"
ON learning_paths FOR ALL TO authenticated
USING (student_id = auth.uid());

-- 8. USERS (Self-access)
-- =====================================================
CREATE POLICY "Users can read their profile"
ON users FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can update their profile"
ON users FOR UPDATE TO authenticated
USING (id = auth.uid());

-- 9. PICTURE_FEEDBACK (User-submitted)
-- =====================================================
CREATE POLICY "Authenticated users can submit feedback"
ON picture_feedback FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage feedback"
ON picture_feedback FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- 10. FLAGGED_WORDS (Admin Only)
-- =====================================================
CREATE POLICY "Admins can manage flagged words"
ON flagged_words FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- 11. PAYPAL_SETTINGS (Admin Only)
-- =====================================================
CREATE POLICY "Admins can manage PayPal settings"
ON paypal_settings FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
