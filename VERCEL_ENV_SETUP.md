# Vercel Environment Variables Setup

## Critical: Environment Variables Required

Your Kid-tionary app requires these environment variables to function:

### Required Variables

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## How to Add Environment Variables in Vercel

### Step 1: Get Your Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Select your Kid-tionary project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (this is your VITE_SUPABASE_URL)
   - **anon/public key** (this is your VITE_SUPABASE_ANON_KEY)

---

### Step 2: Add to Vercel

1. Go to https://vercel.com/dashboard
2. Select your Kid-tionary project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:

**Variable 1:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://your-project.supabase.co`
- Environment: Check all (Production, Preview, Development)

**Variable 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: `your_anon_key_here`
- Environment: Check all (Production, Preview, Development)

5. Click **Save** for each

---

### Step 3: Redeploy

After adding environment variables:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy** (three dots menu)
4. Wait 2-3 minutes

---

## ⚠️ Important Notes

- Environment variables are **NOT** included in your Git repository (for security)
- Vercel needs them configured separately
- Changes to environment variables require a **redeploy** to take effect
- Without these variables, authentication and data features won't work

---

## Verify Variables Are Set

1. In Vercel, go to **Settings** → **Environment Variables**
2. You should see:
   - ✅ VITE_SUPABASE_URL
   - ✅ VITE_SUPABASE_ANON_KEY
3. Both should be set for all environments

---

## Common Issues

### Issue: "Supabase client not initialized"
**Fix:** Add environment variables and redeploy

### Issue: Authentication not working
**Fix:** Verify VITE_SUPABASE_ANON_KEY is correct

### Issue: Variables not taking effect
**Fix:** Redeploy after adding variables (changes don't auto-apply)

---

## Local Development

For local development, create a `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Note:** This file is in `.gitignore` and won't be committed to Git.
