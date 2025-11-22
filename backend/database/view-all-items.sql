-- Query to view all items in the database
-- Run this in Supabase SQL Editor

SELECT 
  id,
  type,
  title,
  description,
  location,
  date,
  contact_email,
  image_url,
  created_at
FROM items
ORDER BY created_at DESC;

-- Alternative: More readable format with formatted output
SELECT 
  id,
  type,
  title,
  description,
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

-- Count summary
SELECT 
  type,
  COUNT(*) as count
FROM items
GROUP BY type;

