# Quick Start: Update Database with Contact Email

## For New Databases

Run this in Supabase SQL Editor:

```sql
-- Copy and paste the entire contents of:
-- backend/database/init-with-data.sql
```

**Steps:**
1. Open Supabase Dashboard → SQL Editor
2. Click "New query"
3. Copy entire `init-with-data.sql` file
4. Paste and click "Run"

## For Existing Databases

Run this in Supabase SQL Editor:

```sql
-- Copy and paste the entire contents of:
-- backend/database/migrate-contact-to-email.sql
```

**Steps:**
1. **Backup first!** (Database → Backups)
2. Open Supabase Dashboard → SQL Editor
3. Click "New query"
4. Copy entire `migrate-contact-to-email.sql` file
5. Paste and click "Run"
6. Review the verification output at the bottom

## What Changed

- ✅ `contact` field → `contact_email` (with email validation)
- ✅ Email format is now validated automatically
- ✅ Backend code updated to work with new field
- ✅ API interface unchanged (still uses `contact` in requests)

## Verify It Worked

After running the script, check:

```sql
SELECT id, title, contact_email FROM items LIMIT 5;
```

You should see the `contact_email` column with email addresses.

## Need Help?

See `DATABASE_UPDATE_GUIDE.md` for detailed instructions and troubleshooting.

