-- Lost & Found App Database Schema for Supabase

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

-- Enable Row Level Security (RLS) - Optional
-- ALTER TABLE items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy examples (if using RLS)
-- Allow all operations for service role (backend)
-- CREATE POLICY "Service role can do everything" ON items FOR ALL USING (true);
-- CREATE POLICY "Service role can do everything" ON subscriptions FOR ALL USING (true);

