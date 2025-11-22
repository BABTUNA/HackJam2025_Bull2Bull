-- QUICK FIX: Add category column to existing database
-- Run this FIRST if you get "column category does not exist" error
-- Then you can run init-with-data.sql

-- Step 1: Add category column
ALTER TABLE items ADD COLUMN IF NOT EXISTS category TEXT;

-- Step 2: Add category validation constraint
ALTER TABLE items DROP CONSTRAINT IF EXISTS check_category_values;
ALTER TABLE items 
ADD CONSTRAINT check_category_values 
CHECK (category IS NULL OR category IN ('electronics', 'clothing', 'accessories', 'documents', 'keys', 'books', 'bags', 'sports', 'other'));

-- Step 3: Create index
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);

-- Step 4: Verify
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'items' AND column_name = 'category';

