-- Simple query to show all items in the database
-- Run this in Supabase SQL Editor

-- Basic query - shows all columns
SELECT * FROM items ORDER BY created_at DESC;

-- More readable format with formatted output
SELECT 
  id,
  type,
  title,
  description,
  category,
  location->>'lat' as latitude,
  location->>'lng' as longitude,
  date,
  contact_email,
  CASE 
    WHEN image_url IS NOT NULL THEN 'Yes'
    ELSE 'No'
  END as has_image,
  created_at
FROM items
ORDER BY created_at DESC;

-- Summary by category
SELECT 
  category,
  COUNT(*) as count
FROM items
WHERE category IS NOT NULL
GROUP BY category
ORDER BY count DESC;

-- Summary by type (lost vs found)
SELECT 
  type,
  COUNT(*) as count
FROM items
GROUP BY type;

