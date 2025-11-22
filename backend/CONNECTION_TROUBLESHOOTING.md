# Database Connection Troubleshooting

## Current Issue
DNS resolution is failing for: `db.dhjnqalrtfnbvvjzligz.supabase.co`

## How to Get the Correct Connection String

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/dhjnqalrtfnbvvjzligz
2. Click **Settings** (gear icon) → **Database**
3. Scroll down to **Connection string** section
4. Select **URI** tab
5. Copy the connection string - it should look like one of these formats:

### Format 1 (Direct Connection):
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

### Format 2 (Session Mode):
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

### Format 3 (Transaction Mode):
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

## Important Notes

- The connection string from Supabase dashboard is the **correct** one to use
- The hostname format might be different (e.g., `aws-0-us-east-1.pooler.supabase.com`)
- Make sure to replace `[PASSWORD]` with your actual database password
- If your password contains special characters, they may need URL encoding:
  - `@` → `%40`
  - `#` → `%23`
  - `%` → `%25`
  - `&` → `%26`
  - `+` → `%2B`
  - `=` → `%3D`

## Quick Fix

1. Copy the connection string from Supabase Dashboard
2. Replace `[PASSWORD]` with your actual password (URL-encode if needed)
3. Update your `.env` file:
   ```
   DATABASE_URL=postgresql://postgres.xxxxx:your_password@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```

