-- Migration Script: Add category column to items table
-- Run this script in Supabase SQL Editor to add the category field to existing databases

-- ============================================
-- STEP 1: Add category column if it doesn't exist
-- ============================================

ALTER TABLE items 
ADD COLUMN IF NOT EXISTS category TEXT;

-- ============================================
-- STEP 2: Add category validation constraint
-- ============================================

-- Remove existing constraint if it exists (to avoid conflicts)
ALTER TABLE items 
DROP CONSTRAINT IF EXISTS check_category_values;

-- Add category validation check constraint
ALTER TABLE items 
ADD CONSTRAINT check_category_values 
CHECK (category IS NULL OR category IN ('electronics', 'clothing', 'accessories', 'documents', 'keys', 'books', 'bags', 'sports', 'other'));

-- ============================================
-- STEP 3: Create index for better query performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);

-- ============================================
-- STEP 4: Verify the migration
-- ============================================

-- Check the table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'items'
AND column_name = 'category';

-- Show sample data
SELECT 
  id, 
  type, 
  title, 
  category,
  created_at
FROM items 
ORDER BY created_at DESC
LIMIT 10;

