# Domain Setup Guide

## Current Situation
- **Vercel Project**: `kid-tionary` (only project)
- **Current Domains**: kid-tionary.com, www.kid-tionary.com, kid-tionary.vercel.app
- **Missing Domain**: simplify-pictures-learning.com (never added to Vercel)
- **Supabase Project**: simplify-learning-pictures (name doesn't matter - connection is via env vars)

## Understanding the 307 Redirect
The **307** code next to `kid-tionary.com` is a **temporary redirect**:
- It redirects `kid-tionary.com` → `www.kid-tionary.com`
- This is standard practice (non-www → www)
- Nothing to worry about - it's working correctly

## Solution: Add simplify-pictures-learning.com Domain

### Step 1: Add the Domain in Vercel
1. Go to your Vercel project: `kid-tionary`
2. Click **Settings** → **Domains**
3. Click **Add Domain** button
4. Enter: `simplify-pictures-learning.com`
5. Click **Add**
6. Repeat for: `www.simplify-pictures-learning.com`

### Step 2: Configure DNS (at your domain registrar)
Vercel will show you DNS instructions. You need to add:

**For simplify-pictures-learning.com:**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21`

**For www.simplify-pictures-learning.com:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

### Step 3: Wait for DNS Propagation
- Usually takes 5-30 minutes
- Can take up to 48 hours in rare cases
- Check status in Vercel Domains page

### Step 4: Set Primary Domain (Optional)
If you want simplify-pictures-learning.com to be the main domain:
1. In Vercel Domains, click **Edit** next to `www.simplify-pictures-learning.com`
2. Check "Redirect other domains to this one"
3. Save

## About Supabase Project Name
The Supabase project name `simplify-learning-pictures` is **fine** - it doesn't need to match:
- Connection uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- As long as these env vars are correct in Vercel, it will work
- Project name is just a label in Supabase dashboard

## Verification Checklist
After adding domains:
- [ ] simplify-pictures-learning.com shows "Valid Configuration"
- [ ] www.simplify-pictures-learning.com shows "Production"
- [ ] Both domains load the current version of the app
- [ ] All three domain sets work: kid-tionary.com, simplify-pictures-learning.com, kid-tionary.vercel.app

## If Still Showing Old Version
After adding domains, if you still see the old version:
1. Go to Vercel **Deployments** tab
2. Find the latest deployment
3. Click the **...** menu → **Redeploy**
4. Check "Use existing Build Cache" is **OFF**
5. Click **Redeploy**

This forces Vercel to rebuild from the current GitHub code.
