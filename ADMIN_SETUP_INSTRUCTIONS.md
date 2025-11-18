# Admin Setup Instructions

## Step 1: Run the Fixed SQL Schema

1. Go to your Supabase Dashboard
2. Click on "SQL Editor" in the left sidebar
3. Open the file `FIXED_DATABASE_SCHEMA.sql`
4. Copy ALL the SQL code
5. Paste it into the SQL Editor
6. Click "Run" or press Ctrl+Enter

This will:
- Drop the conflicting `users` table
- Create a proper `profiles` table that references `auth.users`
- Set up Row Level Security policies
- Fix foreign key constraints

## Step 2: Create Your Admin User

1. In Supabase Dashboard, go to **Authentication > Users**
2. Click **"Add User"**
3. Enter:
   - Email: `admin@yourdomain.com` (use your actual email)
   - Password: (create a secure password)
   - Auto Confirm User: **YES** (check this box)
4. Click **"Create User"**
5. **Copy the User ID** that appears (it's a UUID like `123e4567-e89b-12d3-a456-426614174000`)

## Step 3: Make Yourself Admin

1. Go back to **SQL Editor**
2. Run this query (replace `YOUR-USER-ID` with the ID you copied):

```sql
INSERT INTO profiles (id, email, full_name, role) 
VALUES ('YOUR-USER-ID', 'admin@yourdomain.com', 'Admin User', 'admin');
```

## Step 4: Log In

1. Go to your app's login page
2. Use the email and password you created
3. You should now be logged in as admin!

## Troubleshooting

If you get "profiles table doesn't exist":
- Make sure you ran the FIXED_DATABASE_SCHEMA.sql first

If you can't log in:
- Check that "Auto Confirm User" was enabled
- Verify the email/password are correct
- Check browser console for errors
