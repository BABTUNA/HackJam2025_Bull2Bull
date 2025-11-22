-- Quick Fix Script for Existing Database
-- Run this FIRST if you get the "column contact_email does not exist" error
-- Then you can run init-with-data.sql

-- ============================================
-- STEP 1: Add contact_email column if missing
-- ============================================

-- Add contact_email column if it doesn't exist
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS contact_email TEXT;

-- ============================================
-- STEP 2: Migrate existing data
-- ============================================

-- Copy data from contact to contact_email (if contact column exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'items' 
    AND column_name = 'contact'
  ) THEN
    UPDATE items 
    SET contact_email = contact 
    WHERE contact_email IS NULL AND contact IS NOT NULL;
  END IF;
END $$;

-- ============================================
-- STEP 3: Add email validation
-- ============================================

-- Remove existing constraint if it exists
ALTER TABLE items 
DROP CONSTRAINT IF EXISTS check_contact_email_format;

-- Add email validation check constraint
ALTER TABLE items 
ADD CONSTRAINT check_contact_email_format 
CHECK (contact_email IS NULL OR contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- ============================================
-- STEP 4: Verify
-- ============================================

-- Check the table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'items'
ORDER BY ordinal_position;

-- Show sample data
SELECT id, type, title, contact_email 
FROM items 
LIMIT 5;

