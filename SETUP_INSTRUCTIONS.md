# Database Setup Instructions

You're absolutely right - there was a step missed! Follow these steps **in order**:

## Step 1: Create Tables with Proper Schema

Run these SQL files in your Supabase SQL Editor **in this exact order**:

1. **SETUP_DATABASE.sql** - Creates users, word_lists, and word_searches tables
2. **SETUP_DATABASE_PART2.sql** - Creates remaining tables (word_images, picture_feedback, learning_paths, word_definitions)

## Step 2: Apply Row Level Security

After all tables are created, run:

3. **RLS_POLICIES.sql** - Applies security policies

## Why This Order Matters

- Tables must exist before you can apply RLS policies to them
- Tables must have the correct columns (teacher_id, student_id, etc.) before policies can reference them
- The error you saw meant the tables existed but didn't have the expected columns

## Verification

After running all three files, verify in Supabase:
- Go to Table Editor
- Check that each table has the correct columns
- Go to Authentication > Policies to see RLS policies applied

## Need to Start Fresh?

If tables already exist but have wrong columns, you may need to drop and recreate:

```sql
DROP TABLE IF EXISTS learning_paths CASCADE;
DROP TABLE IF EXISTS word_searches CASCADE;
DROP TABLE IF EXISTS picture_feedback CASCADE;
DROP TABLE IF EXISTS word_lists CASCADE;
DROP TABLE IF EXISTS word_definitions CASCADE;
DROP TABLE IF EXISTS word_images CASCADE;
DROP TABLE IF EXISTS flagged_words CASCADE;
DROP TABLE IF EXISTS paypal_settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

Then run SETUP_DATABASE.sql and SETUP_DATABASE_PART2.sql again.
