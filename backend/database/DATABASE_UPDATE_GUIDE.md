# Database Update Guide: Contact Email Field

This guide explains how to update your database to use `contact_email` instead of `contact` with email validation.

## Overview

The database schema has been updated to:
- Rename `contact` field to `contact_email` for clarity
- Add email format validation using a CHECK constraint
- Maintain backward compatibility during migration

## Option 1: Fresh Database Setup (New Installations)

If you're setting up a new database, use the updated initialization scripts:

### Using `init-with-data.sql` (Recommended)

1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy the entire contents of `backend/database/init-with-data.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)

This will:
- ✅ Create the `items` table with `contact_email` field
- ✅ Add email validation constraint
- ✅ Create indexes for performance
- ✅ Insert sample data with email addresses

### Using `schema.sql` (Schema Only)

If you only want to create the schema without sample data:

1. Follow the same steps above
2. Use `backend/database/schema.sql` instead

## Option 2: Migrate Existing Database

If you already have a database with the old `contact` field, use the migration script:

### Step-by-Step Migration

1. **Backup your database** (recommended)
   - In Supabase Dashboard, go to **Database** → **Backups**
   - Create a manual backup before proceeding

2. **Run the migration script**
   - Go to **SQL Editor** in Supabase Dashboard
   - Click **New query**
   - Copy the entire contents of `backend/database/migrate-contact-to-email.sql`
   - Paste into the SQL Editor
   - Click **Run**

3. **Verify the migration**
   - The script includes verification queries at the end
   - Check that all items have valid email formats or NULL values
   - Review the email status report

4. **Remove old column (optional)**
   - After verifying everything works, you can remove the old `contact` column
   - Uncomment the last line in the migration script:
     ```sql
     ALTER TABLE items DROP COLUMN IF EXISTS contact;
     ```

### What the Migration Does

1. **Adds `contact_email` column** - New column with email validation
2. **Migrates existing data** - Copies data from `contact` to `contact_email`
3. **Adds validation constraint** - Ensures only valid email formats are accepted
4. **Verifies migration** - Shows status of all items

## Email Validation

The `contact_email` field uses a PostgreSQL CHECK constraint to validate email format:

```sql
CHECK (contact_email IS NULL OR contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
```

This ensures:
- ✅ Email can be NULL (optional field)
- ✅ If provided, must match standard email format
- ✅ Case-insensitive validation

## Verification Queries

After migration, verify your data:

```sql
-- Check all items with their email status
SELECT 
  id,
  type,
  title,
  contact_email,
  CASE 
    WHEN contact_email IS NULL THEN 'No email'
    WHEN contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN 'Valid email'
    ELSE 'Invalid email format'
  END as email_status
FROM items
ORDER BY created_at DESC;

-- Count items with and without emails
SELECT 
  COUNT(*) as total_items,
  COUNT(contact_email) as items_with_email,
  COUNT(*) - COUNT(contact_email) as items_without_email
FROM items;
```

## Backend Code Updates

The backend code has been updated to use `contact_email`:
- ✅ `backend/src/services/dbService.ts` - All queries updated
- ✅ TypeScript types remain the same (`contact` field in code maps to `contact_email` in DB)

The API interface remains unchanged - you still use `contact` in your API requests/responses, but it's stored as `contact_email` in the database.

## Troubleshooting

### Error: "column contact_email already exists"
- The column was already added. You can skip Step 1 of the migration.

### Error: "constraint check_contact_email_format already exists"
- The constraint was already added. You can skip Step 3 of the migration.

### Invalid email format errors
- Check your data for emails that don't match the format
- Update invalid emails manually:
  ```sql
  UPDATE items 
  SET contact_email = 'valid@email.com' 
  WHERE id = 'item-id';
  ```

### Need to rollback
- If you need to rollback, restore from your backup
- Or manually rename the column back:
  ```sql
  ALTER TABLE items RENAME COLUMN contact_email TO contact;
  ALTER TABLE items DROP CONSTRAINT IF EXISTS check_contact_email_format;
  ```

## Next Steps

After updating the database:

1. ✅ Restart your backend server to ensure it picks up the changes
2. ✅ Test creating a new item with an email address
3. ✅ Verify existing items still display correctly
4. ✅ Test email validation by trying to insert an invalid email (should fail)

## Files Updated

- `backend/database/schema.sql` - Updated schema
- `backend/database/init.sql` - Updated initialization
- `backend/database/init-with-data.sql` - Updated with sample data
- `backend/database/migrate-contact-to-email.sql` - New migration script
- `backend/src/services/dbService.ts` - Updated service layer

