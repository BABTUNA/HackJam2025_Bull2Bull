-- Lost & Found App Database Initialization Script
-- This script creates the schema and populates it with sample data

-- ============================================
-- SCHEMA CREATION
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_items_type ON items(type);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_fcm_token ON subscriptions(fcm_token);
CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions(email) WHERE email IS NOT NULL;

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Clear existing data (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE items;

-- Insert sample lost and found items
INSERT INTO items (id, type, title, description, location, date, contact, image_url) VALUES
  (
    '1',
    'lost',
    'Lost iPhone 13',
    'Black iPhone 13 with a blue case. Lost near the library entrance.',
    '{"lat": 28.0590, "lng": -82.4145}'::jsonb,
    NOW()::text,
    'john@example.com',
    NULL
  ),
  (
    '2',
    'found',
    'Found Wallet',
    'Brown leather wallet found at the student center. Contains ID and cards.',
    '{"lat": 28.0580, "lng": -82.4130}'::jsonb,
    NOW()::text,
    'sarah@example.com',
    NULL
  ),
  (
    '3',
    'lost',
    'Lost AirPods Pro',
    'White AirPods Pro in a black case. Last seen at the gym.',
    '{"lat": 28.0600, "lng": -82.4150}'::jsonb,
    NOW()::text,
    'mike@example.com',
    NULL
  ),
  (
    '4',
    'found',
    'Found Backpack',
    'Blue Nike backpack found near the engineering building. Contains textbooks and laptop.',
    '{"lat": 28.0575, "lng": -82.4125}'::jsonb,
    NOW()::text,
    'lisa@example.com',
    NULL
  ),
  (
    '5',
    'lost',
    'Lost Keys',
    'Set of keys with a USF keychain. Lost near the parking garage.',
    '{"lat": 28.0610, "lng": -82.4160}'::jsonb,
    NOW()::text,
    'david@example.com',
    NULL
  ),
  (
    '6',
    'found',
    'Found Sunglasses',
    'Black Ray-Ban sunglasses found at the campus cafe.',
    '{"lat": 28.0585, "lng": -82.4135}'::jsonb,
    NOW()::text,
    'emily@example.com',
    NULL
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFICATION
-- ============================================

-- Show inserted items
SELECT 
  id,
  type,
  title,
  location,
  created_at
FROM items
ORDER BY created_at DESC;

-- Show count
SELECT 
  type,
  COUNT(*) as count
FROM items
GROUP BY type;

