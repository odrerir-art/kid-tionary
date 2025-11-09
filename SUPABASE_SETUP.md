# Supabase Setup Guide for Kid-tionary

## 1. Add Environment Variables to Vercel

### Step 1: Get Your Supabase Credentials
1. Go to your Supabase project dashboard at https://supabase.com/dashboard
2. Click on your project (fruxwjbdngbfegedtggj)
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (starts with https://fruxwjbdngbfegedtggj.supabase.co)
   - **anon/public key** (a long JWT token)

### Step 2: Add to Vercel
1. Go to your Vercel dashboard at https://vercel.com
2. Select your Kid-tionary project
3. Go to **Settings** → **Environment Variables**
4. Add these two variables:

**Variable 1:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://fruxwjbdngbfegedtggj.supabase.co`
- Environment: Production, Preview, Development (check all)

**Variable 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: [Your anon key from Supabase]
- Environment: Production, Preview, Development (check all)

### Step 3: Redeploy
After adding variables, go to **Deployments** → click the three dots on latest deployment → **Redeploy**

---

## 2. Verify Supabase Database Tables

All tables are already created. Here's what exists:

### Tables Overview
- ✅ `word_lists` - Teacher-created vocabulary lists
- ✅ `picture_feedback` - User feedback on AI-generated images
- ✅ `word_images` - Cached AI-generated word visualizations
- ✅ `users` - Student and teacher accounts
- ✅ `learning_paths` - Personalized learning recommendations
- ✅ `word_searches` - Student search history tracking

---

## 3. Verify Edge Functions

All edge functions are deployed and active:

### Active Functions
1. ✅ `generate-definition` - AI-powered word definitions
2. ✅ `create-student-account` - Student registration
3. ✅ `student-login` - Student authentication
4. ✅ `track-word-search` - Search analytics
5. ✅ `track-quiz-attempt` - Quiz performance tracking
6. ✅ `get-student-progress` - Progress reports
7. ✅ `analyze-student-performance` - AI performance analysis
8. ✅ `update-performance-analytics` - Analytics updates

---

## 4. Testing the Connection

After deploying with environment variables:

1. Visit your deployed site
2. Try searching for a word (e.g., "happy")
3. Check browser console for any Supabase errors
4. Try creating a student account
5. Verify AI-generated definitions appear

---

## 5. Troubleshooting

### White Screen After Deployment
- Ensure both environment variables are set correctly
- Check Vercel deployment logs for errors
- Verify Supabase project is active

### "Failed to fetch" Errors
- Check if Supabase project URL is correct
- Verify anon key is the public key (not service role key)
- Check browser console for CORS errors

### AI Definitions Not Loading
- Verify OpenAI API key is set in Supabase edge function secrets
- Check edge function logs in Supabase dashboard

---

## 6. Local Development Setup

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://fruxwjbdngbfegedtggj.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Then run:
```bash
npm install
npm run dev
```
