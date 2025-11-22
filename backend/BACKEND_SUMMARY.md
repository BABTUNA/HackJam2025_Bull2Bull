# Express Backend with Supabase + Firebase - Summary

## ✅ What's Been Set Up

### Backend Structure
```
backend/
  src/
    config/
      supabase.ts      # Supabase client configuration
      firebase.ts      # Firebase Admin SDK configuration
    routes/
      items.ts         # Item CRUD endpoints
      subscriptions.ts # Subscription management endpoints
    services/
      dbService.ts     # Database operations (Supabase)
      fcmService.ts    # FCM notification service
    types/
      index.ts         # TypeScript types
    index.ts           # Express server entry point
  database/
    schema.sql         # Database schema for Supabase
  package.json
  tsconfig.json
  .env.example
  README.md
  SETUP.md
```

### Features Implemented

1. **Express REST API**
   - TypeScript support
   - CORS configured
   - Error handling
   - Request logging

2. **Supabase Integration**
   - PostgreSQL database
   - Service role client (admin access)
   - Database service layer

3. **Firebase FCM Integration**
   - Firebase Admin SDK
   - Batch notification sending
   - Invalid token cleanup
   - Preference-based filtering

4. **API Endpoints**

   **Items:**
   - `GET /api/items` - Get all items
   - `GET /api/items/:id` - Get item by ID
   - `POST /api/items` - Create item (triggers notifications)
   - `PUT /api/items/:id` - Update item
   - `DELETE /api/items/:id` - Delete item

   **Subscriptions:**
   - `POST /api/subscriptions` - Subscribe with FCM token
   - `GET /api/subscriptions` - Get all subscriptions
   - `PUT /api/subscriptions/:token` - Update preferences
   - `DELETE /api/subscriptions/:token` - Unsubscribe

   **Health:**
   - `GET /api/health` - Server status

## Next Steps

### 1. Set Up Supabase
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get Project URL and Service Role Key
4. Run `database/schema.sql` in SQL Editor

### 2. Set Up Firebase
1. Create Firebase project
2. Generate service account key
3. Copy credentials to `.env`

### 3. Configure Environment
1. Copy `backend/.env.example` to `backend/.env`
2. Fill in all values

### 4. Run Backend
```bash
cd backend
npm run dev
```

### 5. Update Frontend
Update your React app to call the backend API instead of using local state.

## Integration with Frontend

### Example: Fetch Items
```typescript
const fetchItems = async () => {
  const response = await fetch('http://localhost:3000/api/items');
  const items = await response.json();
  setItems(items);
};
```

### Example: Create Item
```typescript
const createItem = async (item: LostAndFoundItem) => {
  const response = await fetch('http://localhost:3000/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  const newItem = await response.json();
  return newItem;
};
```

### Example: Subscribe
```typescript
const subscribe = async (fcmToken: string, email?: string) => {
  const response = await fetch('http://localhost:3000/api/subscriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fcm_token: fcmToken,
      email,
      preferences: {
        notifyOnLost: true,
        notifyOnFound: true,
      },
    }),
  });
  return await response.json();
};
```

## Architecture Flow

```
User creates item in React
    ↓
POST /api/items
    ↓
Express saves to Supabase
    ↓
FCM Service gets all subscribers
    ↓
Firebase Admin sends notifications
    ↓
Users receive push notifications
```

## Database Schema

**Items Table:**
- id (TEXT, PRIMARY KEY)
- type (TEXT: 'lost' | 'found')
- title (TEXT)
- description (TEXT)
- location (JSONB: {lat, lng})
- date (TEXT, ISO format)
- contact (TEXT, optional)
- image_url (TEXT, optional)
- created_at (TIMESTAMP)

**Subscriptions Table:**
- id (UUID, PRIMARY KEY)
- fcm_token (TEXT, UNIQUE)
- email (TEXT, optional)
- preferences (JSONB)
- created_at (TIMESTAMP)

## Deployment Options

1. **Vercel** - Serverless functions
2. **Railway** - Traditional server
3. **Render** - Traditional server
4. **Fly.io** - Global deployment

All support Express.js and have free tiers!

