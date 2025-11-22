# Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Project Settings → API
4. Copy:
   - **Project URL** → `SUPABASE_URL` in `.env`
   - **Service Role Key** (secret) → `SUPABASE_SERVICE_ROLE_KEY` in `.env`

5. Go to SQL Editor and run the schema:
   - Copy contents of `database/schema.sql`
   - Paste and run in Supabase SQL Editor

### 3. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Go to Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Download the JSON file
6. Copy values to `.env`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep quotes and \n characters)
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

### 4. Create .env File

Copy `.env.example` to `.env` and fill in your values:

```env
PORT=3000
NODE_ENV=development

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

CORS_ORIGIN=http://localhost:5173
```

### 5. Run the Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

## Testing the API

### Test Health Endpoint
```bash
curl http://localhost:3000/api/health
```

### Test Create Item
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-1",
    "type": "lost",
    "title": "Test Item",
    "description": "Testing the API",
    "location": {"lat": 28.0586, "lng": -82.4139},
    "date": "2025-11-22T12:00:00Z"
  }'
```

### Test Get Items
```bash
curl http://localhost:3000/api/items
```

## Troubleshooting

### Supabase Connection Issues
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct
- Check that tables exist in Supabase dashboard
- Verify RLS policies if enabled

### Firebase Issues
- Ensure `FIREBASE_PRIVATE_KEY` has proper formatting (quotes and \n)
- Verify service account has proper permissions
- Check Firebase project ID is correct

### CORS Issues
- Update `CORS_ORIGIN` in `.env` to match your frontend URL
- Default is `http://localhost:5173` (Vite default)

