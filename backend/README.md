# Backend API - Lost & Found App

Express REST API backend using Supabase (database) and Firebase (FCM notifications).

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the `backend` directory:

```env
PORT=3000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### 3. Supabase Database Setup

Run these SQL commands in your Supabase SQL Editor:

```sql
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_items_type ON items(type);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_fcm_token ON subscriptions(fcm_token);
```

### 4. Firebase Setup

1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Copy the values to your `.env` file:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes and \n)
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Items

- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create new item (sends notifications)
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Subscriptions

- `POST /api/subscriptions` - Subscribe (store FCM token)
- `GET /api/subscriptions` - Get all subscriptions
- `PUT /api/subscriptions/:token` - Update subscription preferences
- `DELETE /api/subscriptions/:token` - Unsubscribe

### Health Check

- `GET /api/health` - Server health status

## Example Requests

### Create Item
```bash
POST /api/items
Content-Type: application/json

{
  "id": "123",
  "type": "lost",
  "title": "Lost iPhone",
  "description": "Black iPhone 13",
  "location": {
    "lat": 28.0586,
    "lng": -82.4139
  },
  "date": "2025-11-22T12:00:00Z",
  "contact": "user@example.com"
}
```

### Subscribe
```bash
POST /api/subscriptions
Content-Type: application/json

{
  "fcm_token": "user_fcm_token_here",
  "email": "user@example.com",
  "preferences": {
    "notifyOnLost": true,
    "notifyOnFound": true
  }
}
```

