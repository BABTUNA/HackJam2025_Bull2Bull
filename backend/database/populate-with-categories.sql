-- Data Population Script with Categories
-- This script populates the database with sample lost and found items
-- All items include appropriate categories
-- Run this after ensuring the category column exists (use FIX_CATEGORY_ERROR.sql first if needed)

-- Clear existing data (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE items;

-- Insert sample items with categories
-- All coordinates are within University of South Florida campus boundaries
INSERT INTO items (id, type, title, description, category, location, date, contact_email, image_url) VALUES
  -- Lost Items
  (
    '1',
    'lost',
    'Lost iPhone 13',
    'Black iPhone 13 with a blue case. Lost near the library entrance.',
    'electronics',
    '{"lat": 28.0590, "lng": -82.4145}'::jsonb,
    (NOW() AT TIME ZONE 'UTC')::text,
    'john@example.com',
    NULL
  ),
  (
    '3',
    'lost',
    'Lost AirPods Pro',
    'White AirPods Pro in a black case. Last seen at the gym near the basketball courts.',
    'electronics',
    '{"lat": 28.0603, "lng": -82.4082}'::jsonb,
    (NOW() AT TIME ZONE 'UTC' - INTERVAL '2 days')::text,
    'mike@usf.edu',
    NULL
  ),
  (
    '5',
    'lost',
    'Lost Keys',
    'Set of keys with a USF keychain and car key fob. Lost near the parking garage.',
    'keys',
    '{"lat": 28.0569, "lng": -82.4143}'::jsonb,
    (NOW() AT TIME ZONE 'UTC' - INTERVAL '1 day')::text,
    'david@usf.edu',
    NULL
  ),
  (
    '7',
    'lost',
    'Lost Laptop',
    'Silver MacBook Pro 13" in a gray sleeve. Lost in the engineering building study room.',
    'electronics',
    '{"lat": 28.0595, "lng": -82.4067}'::jsonb,
    (NOW() AT TIME ZONE 'UTC' - INTERVAL '3 days')::text,
    'alex@usf.edu',
    NULL
  ),
  (
    '9',
    'lost',
    'Lost Backpack',
    'Black Nike backpack with textbooks and calculator inside. Lost near the student center food court.',
    'bags',
    '{"lat": 28.0612, "lng": -82.4098}'::jsonb,
    (NOW() AT TIME ZONE 'UTC' - INTERVAL '4 hours')::text,
    'jessica@usf.edu',
    NULL
  ),
  (
    '11',
    'lost',
    'Lost Water Bottle',
    'Green Hydro Flask with USF stickers. Lost at the recreation center pool area.',
    'accessories',
    '{"lat": 28.0608, "lng": -82.4075}'::jsonb,
    (NOW() AT TIME ZONE 'UTC' - INTERVAL '6 hours')::text,
    'emily@usf.edu',
    NULL
  ),
  (
    '13',
    'lost',
    'Lost Glasses',
    'Black Ray-Ban prescription glasses in a brown case. Lost in the library reading room.',
    'accessories',
    '{"lat": 28.0587, "lng": -82.4125}'::jsonb,
    (NOW() AT TIME ZONE 'UTC' - INTERVAL '1 day')::text,
    'robert@usf.edu',
    NULL
  ),
  (
    '15',
    'lost',
    'Lost Watch',
    'Silver Apple Watch Series 7 with a black sport band. Lost during morning jog around campus.',
    'electronics',
    '{"lat": 28.0601, "lng": -82.4105}'::jsonb,
    (NOW() AT TIME ZONE 'UTC' - INTERVAL '2 days')::text,
    'chris@usf.edu',
    NULL
  ),
  (
    '17',
    'lost',
    'Lost USB Drive',
    'Red SanDisk USB drive with important project files. Lost in the computer lab.',
    'electronics',
    '{"lat": 28.0598, "lng": -82.4078}'::jsonb,
    (NOW() AT TIME ZONE 'UTC' - INTERVAL '5 hours')::text,
    'maria@usf.edu',
    NULL
  ),
  (
    '19',
    'lost',
    'Lost Student ID',
    'USF student ID card with photo. Lost near the bookstore entrance.',
    'documents',
    '{"lat": 28.0610, "lng": -82.4090}'::jsonb,
    (NOW() AT TIME ZONE 'UTC' - INTERVAL '3 hours')::text,
    'taylor@usf.edu',
    NULL
  ),
  (
    '21',
    'lost',
    'Lost Calculator',
    'TI-84 Plus CE graphing calculator in a blue case. Lost in the math building.',
    'electronics',
    '{"lat": 28.0585, "lng": -82.4069}'::jsonb,
    (NOW() AT TIME ZONE 'UTC' - INTERVAL '1 day')::text,
    'ryan@usf.edu',
    NULL
  ),
  (
    '23',
    'lost',
    'Lost Bike Lock Key',
    'Small silver key for a Kryptonite bike lock. Lost near the bike racks by the library.',
    'keys',
    '{"lat": 28.0592, "lng": -82.4135}'::jsonb,
    (NOW() AT TIME ZONE 'UTC' - INTERVAL '2 hours')::text,
    'sam@usf.edu',
    NULL
  ),
  (
    '25',
    'lost',
    'Lost Notebook',
    'Blue spiral notebook with chemistry notes. Lost in the science building hallway.',
    'books',
    '{"lat": 28.0589, "lng": -82.4085}'::jsonb,
    (NOW() AT TIME ZONE 'UTC' - INTERVAL '1 day')::text,
    'lisa@usf.edu',
    NULL
  ),
  (
    '27',
    'lost',
    'Lost Charger',
    'MacBook Pro charger with extension cord. Lost in the study lounge.',
    'electronics',
    '{"lat": 28.0605, "lng": -82.4110}'::jsonb,
    (NOW() AT TIME ZONE 'UTC' - INTERVAL '4 hours')::text,
    'kevin@usf.edu',
    NULL
  ),
  (
    '29',
    'lost',
    'Lost Headphones',
    'Sony WH-1000XM4 wireless headphones in a black case. Lost on the campus bus.',
    'electronics',
    '{"lat": 28.0615, "lng": -82.4100}'::jsonb,
    (NOW() AT TIME ZONE 'UTC' - INTERVAL '3 days')::text,
    'nina@usf.edu',
    NULL
  ),
  -- Found Items
  (
    '2',
    'found',
    'Found Wallet',
    'Brown leather wallet found at the student center. Contains ID and cards.',
    'accessories',
    '{"lat": 28.0580, "lng": -82.4130}'::jsonb,
    (NOW() AT TIME ZONE 'UTC')::text,
    'sarah@example.com',
    NULL
  ),
  (
    '4',
    'found',
    'Found Sunglasses',
    'Black Ray-Ban sunglasses found at the campus cafe.',
    'accessories',
    '{"lat": 28.0585, "lng": -82.4135}'::jsonb,
    (NOW() AT TIME ZONE 'UTC' - INTERVAL '1 day')::text,
    'emily@example.com',
    NULL
  ),
  (
    '6',
    'found',
    'Found Backpack',
    'Blue Nike backpack found near the engineering building. Contains textbooks and laptop.',
    'bags',
    '{"lat": 28.0575, "lng": -82.4125}'::jsonb,
    (NOW() AT TIME ZONE 'UTC' - INTERVAL '2 days')::text,
    'lisa@example.com',
    NULL
  ),
  (
    '8',
    'found',
    'Found Phone',
    'Samsung Galaxy S21 found in the parking lot. Has a clear case with stickers.',
    'electronics',
    '{"lat": 28.0570, "lng": -82.4140}'::jsonb,
    (NOW() AT TIME ZONE 'UTC' - INTERVAL '5 hours')::text,
    'michael@usf.edu',
    NULL
  ),
  (
    '10',
    'found',
    'Found Keys',
    'Set of keys with a USF lanyard found near the student union.',
    'keys',
    '{"lat": 28.0610, "lng": -82.4095}'::jsonb,
    (NOW() AT TIME ZONE 'UTC' - INTERVAL '3 hours')::text,
    'james@usf.edu',
    NULL
  )
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  location = EXCLUDED.location,
  date = EXCLUDED.date,
  contact_email = EXCLUDED.contact_email,
  image_url = EXCLUDED.image_url;

-- ============================================
-- VERIFICATION
-- ============================================

-- Show all items with categories
SELECT 
  id,
  type,
  title,
  category,
  contact_email,
  created_at
FROM items
ORDER BY created_at DESC;

-- Count items by category
SELECT 
  category,
  COUNT(*) as count
FROM items
WHERE category IS NOT NULL
GROUP BY category
ORDER BY count DESC;

-- Count items by type
SELECT 
  type,
  COUNT(*) as count
FROM items
GROUP BY type;

