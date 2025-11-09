# Single Domain Setup - kid-tionary.com Only

## Good News! 🎉
Your app code doesn't need any changes. All domain configuration is in Supabase settings only.

---

## Update Supabase Authentication URLs

### Step 1: Go to Supabase Authentication Settings
1. Visit https://supabase.com/dashboard
2. Select your project (fruxwjbdngbfegedtggj)
3. Go to **Authentication** → **URL Configuration**

### Step 2: Update Site URL
Set to: `https://kid-tionary.com`

### Step 3: Update Redirect URLs
Add these allowed redirect URLs:
```
https://kid-tionary.com/*
https://www.kid-tionary.com/*
https://kid-tionary.vercel.app/*
http://localhost:5173/*
```

**Remove any references to simplify-pictures-learning.com**

### Step 4: Save Changes
Click **Save** - changes take effect immediately

---

## That's It!
Your app will now work with kid-tionary.com only. No code changes needed!

---

## Verification
After updating Supabase:
- ✅ Login/Signup works on kid-tionary.com
- ✅ Email verification redirects to kid-tionary.com
- ✅ Password reset works correctly
