-- URGENT FIX: Run this FIRST before init-with-data.sql
-- This will add the contact_email column to your existing table

-- Step 1: Add contact_email column (safe to run multiple times)
ALTER TABLE items ADD COLUMN IF NOT EXISTS contact_email TEXT;

-- Step 2: Migrate existing data from contact to contact_email
DO $$
BEGIN
  -- Check if contact column exists
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'items' 
    AND column_name = 'contact'
  ) THEN
    -- Copy data from contact to contact_email
    UPDATE items 
    SET contact_email = contact 
    WHERE (contact_email IS NULL OR contact_email = '') 
    AND contact IS NOT NULL 
    AND contact != '';
  END IF;
END $$;

-- Step 3: Remove old constraint if it exists (to avoid conflicts)
ALTER TABLE items DROP CONSTRAINT IF EXISTS check_contact_email_format;

-- Step 4: Add email validation constraint
ALTER TABLE items 
ADD CONSTRAINT check_contact_email_format 
CHECK (contact_email IS NULL OR contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Step 5: Verify it worked
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'items'
AND column_name IN ('contact', 'contact_email')
ORDER BY column_name;

-- Show sample data to confirm migration
SELECT 
  id, 
  type, 
  title, 
  contact_email,
  CASE 
    WHEN contact_email IS NULL THEN 'No email'
    WHEN contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN 'Valid email'
    ELSE 'Invalid format'
  END as email_status
FROM items 
LIMIT 10;

