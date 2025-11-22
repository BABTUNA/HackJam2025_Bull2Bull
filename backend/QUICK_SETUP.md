# Quick Setup Guide

## From Your PostgreSQL Connection String

You have: `postgresql://postgres:[YOUR_PASSWORD]@db.dhjnqalrtfnbvvjzligz.supabase.co:5432/postgres`

### Extract the Project URL:
- Your project reference: `dhjnqalrtfnbvvjzligz`
- **Project URL**: `https://dhjnqalrtfnbvvjzligz.supabase.co`

### Get the Service Role Key:
1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/dhjnqalrtfnbvvjzligz
2. Click **Settings** (gear icon) → **API**
3. Under **Project API keys**, find the **`service_role`** key (it's the **secret** one)
4. Copy that entire key

### Your .env file should have:

```env
PORT=3000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://dhjnqalrtfnbvvjzligz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=paste_your_service_role_key_here

# Firebase (can add later)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=""
FIREBASE_CLIENT_EMAIL=

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

## Important Notes:

- **Don't use the PostgreSQL connection string** - we use the Supabase JS client instead
- The **service_role** key is different from the **anon** key - you need the **service_role** one
- The service_role key bypasses Row Level Security (RLS) - keep it secret!

