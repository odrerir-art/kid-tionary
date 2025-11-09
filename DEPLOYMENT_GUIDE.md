# Deployment Guide for Kid-tionary

## Important Clarification
I cannot directly deploy websites or configure domains. However, I can guide you through the process!

## Deploy to Vercel (Step-by-Step)

### 1. Prerequisites
- GitHub account
- Vercel account (free at vercel.com)
- Your code pushed to a GitHub repository

### 2. Deploy from GitHub
1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Vite settings
5. Click "Deploy"

### 3. Configure Custom Domains
After deployment:
1. Go to Project Settings → Domains
2. Add `kid-tionary.com` and click Add
3. Add `simplify-pictures-learning.com` and click Add
4. Vercel will show DNS records you need to configure

### 4. Update DNS Settings (at your domain registrar)
For each domain, add these records:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 5. Add Environment Variables
In Vercel Project Settings → Environment Variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Alternative: Deploy via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

## Troubleshooting
- DNS changes take 24-48 hours to propagate
- Check Vercel deployment logs for build errors
- Ensure Supabase URL is accessible from production
