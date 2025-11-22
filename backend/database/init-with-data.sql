-- Lost & Found App Database Initialization with Sample Data
-- Run this script in Supabase SQL Editor to set up your database

-- ============================================
-- STEP 1: CREATE TABLES
-- ============================================

-- Items table
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  title TEXT NOT NULL,
  description TEXT,
  location JSONB NOT NULL,
  date TEXT NOT NULL,
  contact TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fcm_token TEXT UNIQUE NOT NULL,
  email TEXT,
  preferences JSONB DEFAULT '{"notifyOnLost": true, "notifyOnFound": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 2: CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_items_type ON items(type);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_fcm_token ON subscriptions(fcm_token);
CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions(email) WHERE email IS NOT NULL;

-- ============================================
-- STEP 3: INSERT SAMPLE DATA
-- ============================================

-- Insert sample items (matching App.tsx format)
-- All coordinates are within University of South Florida campus boundaries
INSERT INTO items (id, type, title, description, location, date, contact, image_url) VALUES
  -- Lost Items
  (
    '1',
    'lost',
    'Lost iPhone 13',
    'Black iPhone 13 with a blue case. Lost near the library entrance.',
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
    '{"lat": 28.0610, "lng": -82.4095}'::jsonb,
    (NOW() AT TIME ZONE 'UTC' - INTERVAL '3 hours')::text,
    'james@usf.edu',
    NULL
  )
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  location = EXCLUDED.location,
  date = EXCLUDED.date,
  contact = EXCLUDED.contact,
  image_url = EXCLUDED.image_url;

-- ============================================
-- STEP 4: VERIFY DATA
-- ============================================

-- Show all items
SELECT 
  id,
  type,
  title,
  description,
  location,
  date,
  contact,
  created_at
FROM items
ORDER BY created_at DESC;

