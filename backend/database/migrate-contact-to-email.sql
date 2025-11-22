-- Migration Script: Rename contact to contact_email
-- Run this script in Supabase SQL Editor to update existing databases
-- This script safely migrates the contact field to contact_email with email validation

-- ============================================
-- STEP 1: Add the new contact_email column
-- ============================================

-- Add contact_email column if it doesn't exist
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS contact_email TEXT;

-- ============================================
-- STEP 2: Migrate existing data
-- ============================================

-- Copy data from contact to contact_email (only if contact_email is NULL)
UPDATE items 
SET contact_email = contact 
WHERE contact_email IS NULL AND contact IS NOT NULL;

-- ============================================
-- STEP 3: Add email validation constraint
-- ============================================

-- Add email validation check constraint
ALTER TABLE items 
ADD CONSTRAINT check_contact_email_format 
CHECK (contact_email IS NULL OR contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- ============================================
-- STEP 4: Remove old contact column (optional)
-- ============================================

-- Uncomment the line below to remove the old contact column after verifying migration
-- ALTER TABLE items DROP COLUMN IF EXISTS contact;

-- ============================================
-- STEP 5: Verify migration
-- ============================================

-- Check that all data was migrated correctly
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

