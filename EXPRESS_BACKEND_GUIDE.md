# Express.js Backend Guide for Lost & Found App

## Overview
Express.js is a minimal, flexible Node.js web framework. It's perfect for building REST APIs and works great with React frontends.

---

## Why Express.js?

### ✅ Advantages

1. **Full Control**
   - Complete control over your backend code
   - Choose your own database (PostgreSQL, MongoDB, MySQL, etc.)
   - Customize everything to your needs

2. **Flexible & Lightweight**
   - Minimal framework, add only what you need
   - Large ecosystem of middleware
   - Easy to understand and maintain

3. **TypeScript Support**
   - Works great with TypeScript
   - Type safety for your API
   - Same language as your React frontend

4. **Easy Deployment**
   - Deploy to Vercel, Netlify, Railway, Render, etc.
   - Serverless functions or traditional server
   - Free tiers available

5. **Great for Learning**
   - Industry standard
   - Lots of tutorials and resources
   - Easy to debug and test

6. **Database Flexibility**
   - Use any database you want
   - PostgreSQL, MongoDB, MySQL, SQLite, etc.
   - Easy to switch databases later

### ❌ Disadvantages

1. **More Setup Required**
   - Need to set up database
   - Need to configure middleware
   - More boilerplate code

2. **Server Management**
   - Need to handle deployment
   - Need to manage environment variables
   - Need to set up CORS, security, etc.

3. **No Built-in Real-time**
   - Need Socket.io for real-time updates
   - More complex than Firebase real-time

---

## Architecture with Express

```
React Frontend (Vite)
    ↓ (HTTP requests)
Express.js API (Node.js)
    ↓
Database (PostgreSQL/MongoDB)
    ↓
Firebase Admin SDK (send FCM notifications)
```

---

## Project Structure

```
hackjam/
  frontend/              # Your existing React app
    src/
    package.json
  backend/               # New Express backend
    src/
      index.ts          # Express server entry
      routes/
        items.ts        # Item CRUD routes
        subscriptions.ts # Subscription routes
      services/
        fcmService.ts   # Firebase FCM service
        dbService.ts    # Database service
      models/
        Item.ts         # Item model/types
        Subscription.ts # Subscription model
      middleware/
        cors.ts         # CORS configuration
        errorHandler.ts # Error handling
    package.json
    tsconfig.json
  package.json           # Root package.json (optional)
```

---

## Setup Steps

### 1. Install Dependencies

```bash
# In backend directory
npm init -y
npm install express cors dotenv
npm install firebase-admin
npm install -D typescript @types/express @types/node @types/cors ts-node nodemon
```

### 2. Database Options

**Option A: PostgreSQL (Recommended)**
```bash
npm install pg
npm install -D @types/pg
# Or use Prisma ORM
npm install prisma @prisma/client
```

**Option B: MongoDB**
```bash
npm install mongoose
```

**Option C: SQLite (Quick Start)**
```bash
npm install better-sqlite3
npm install -D @types/better-sqlite3
```

---

## Express Server Example

### Basic Server Setup

```typescript
// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Items routes
app.use('/api/items', require('./routes/items'));
app.use('/api/subscriptions', require('./routes/subscriptions'));

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Items Route

```typescript
// backend/src/routes/items.ts
import express from 'express';
import { sendNotificationToSubscribers } from '../services/fcmService';
import { saveItem, getItems, getItemById } from '../services/dbService';

const router = express.Router();

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await getItems();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Create new item
router.post('/', async (req, res) => {
  try {
    const item = req.body;
    
    // Validate item data
    if (!item.title || !item.type || !item.location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Save to database
    const savedItem = await saveItem(item);
    
    // Send notifications to subscribers
    await sendNotificationToSubscribers(savedItem);
    
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Update item
router.put('/:id', async (req, res) => {
  try {
    const item = await updateItem(req.params.id, req.body);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    await deleteItem(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

export default router;
```

### Subscriptions Route

```typescript
// backend/src/routes/subscriptions.ts
import express from 'express';
import { saveSubscription, getSubscriptions, deleteSubscription } from '../services/dbService';

const router = express.Router();

// Subscribe (store FCM token)
router.post('/', async (req, res) => {
  try {
    const { fcmToken, email, preferences } = req.body;
    
    if (!fcmToken) {
      return res.status(400).json({ error: 'FCM token is required' });
    }
    
    const subscription = await saveSubscription({
      fcmToken,
      email,
      preferences: preferences || { notifyOnLost: true, notifyOnFound: true }
    });
    
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Get all subscriptions (admin only)
router.get('/', async (req, res) => {
  try {
    const subscriptions = await getSubscriptions();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Unsubscribe
router.delete('/:token', async (req, res) => {
  try {
    await deleteSubscription(req.params.token);
    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

export default router;
```

### FCM Service

```typescript
// backend/src/services/fcmService.ts
import admin from 'firebase-admin';
import { getSubscriptions } from './dbService';
import type { LostAndFoundItem } from '../../frontend/src/types';

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  const serviceAccount = require('../../firebase-service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export const sendNotificationToSubscribers = async (item: LostAndFoundItem) => {
  try {
    // Get all subscribers
    const subscribers = await getSubscriptions();
    
    if (subscribers.length === 0) {
      console.log('No subscribers to notify');
      return;
    }
    
    // Filter subscribers based on preferences
    const tokensToNotify = subscribers
      .filter(sub => {
        const prefs = sub.preferences || {};
        if (item.type === 'lost' && !prefs.notifyOnLost) return false;
        if (item.type === 'found' && !prefs.notifyOnFound) return false;
        return true;
      })
      .map(sub => sub.fcmToken)
      .filter(token => token); // Remove null/undefined tokens
    
    if (tokensToNotify.length === 0) {
      console.log('No tokens to notify after filtering');
      return;
    }
    
    // Send notifications
    const message = {
      notification: {
        title: `New ${item.type} item: ${item.title}`,
        body: item.description || 'Check the map for details',
      },
      data: {
        itemId: item.id,
        itemType: item.type,
        lat: item.location.lat.toString(),
        lng: item.location.lng.toString(),
      },
      tokens: tokensToNotify,
    };
    
    const response = await admin.messaging().sendEachForMulticast(message);
    
    console.log(`Successfully sent: ${response.successCount}`);
    console.log(`Failed: ${response.failureCount}`);
    
    // Remove invalid tokens
    if (response.failureCount > 0) {
      const failedTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokensToNotify[idx]);
        }
      });
      // Clean up invalid tokens from database
      await cleanupInvalidTokens(failedTokens);
    }
    
    return response;
  } catch (error) {
    console.error('Error sending notifications:', error);
    throw error;
  }
};

const cleanupInvalidTokens = async (tokens: string[]) => {
  // Remove invalid tokens from database
  for (const token of tokens) {
    await deleteSubscription(token);
  }
};
```

### Database Service (SQLite Example)

```typescript
// backend/src/services/dbService.ts
import Database from 'better-sqlite3';
import type { LostAndFoundItem } from '../../frontend/src/types';

const db = new Database('lostfound.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    location_lat REAL NOT NULL,
    location_lng REAL NOT NULL,
    date TEXT NOT NULL,
    contact TEXT,
    imageUrl TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fcm_token TEXT UNIQUE NOT NULL,
    email TEXT,
    preferences TEXT, -- JSON string
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export const saveItem = (item: LostAndFoundItem): LostAndFoundItem => {
  const stmt = db.prepare(`
    INSERT INTO items (id, type, title, description, location_lat, location_lng, date, contact, imageUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    item.id,
    item.type,
    item.title,
    item.description,
    item.location.lat,
    item.location.lng,
    item.date,
    item.contact || null,
    item.imageUrl || null
  );
  
  return item;
};

export const getItems = (): LostAndFoundItem[] => {
  const stmt = db.prepare('SELECT * FROM items ORDER BY created_at DESC');
  const rows = stmt.all() as any[];
  
  return rows.map(row => ({
    id: row.id,
    type: row.type as 'lost' | 'found',
    title: row.title,
    description: row.description,
    location: {
      lat: row.location_lat,
      lng: row.location_lng,
    },
    date: row.date,
    contact: row.contact,
    imageUrl: row.imageUrl,
  }));
};

export const getItemById = (id: string): LostAndFoundItem | null => {
  const stmt = db.prepare('SELECT * FROM items WHERE id = ?');
  const row = stmt.get(id) as any;
  
  if (!row) return null;
  
  return {
    id: row.id,
    type: row.type as 'lost' | 'found',
    title: row.title,
    description: row.description,
    location: {
      lat: row.location_lat,
      lng: row.location_lng,
    },
    date: row.date,
    contact: row.contact,
    imageUrl: row.imageUrl,
  };
};

export const saveSubscription = (subscription: {
  fcmToken: string;
  email?: string;
  preferences?: any;
}) => {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO subscriptions (fcm_token, email, preferences)
    VALUES (?, ?, ?)
  `);
  
  stmt.run(
    subscription.fcmToken,
    subscription.email || null,
    JSON.stringify(subscription.preferences || {})
  );
  
  return subscription;
};

export const getSubscriptions = () => {
  const stmt = db.prepare('SELECT * FROM subscriptions');
  const rows = stmt.all() as any[];
  
  return rows.map(row => ({
    fcmToken: row.fcm_token,
    email: row.email,
    preferences: JSON.parse(row.preferences || '{}'),
  }));
};

export const deleteSubscription = (fcmToken: string) => {
  const stmt = db.prepare('DELETE FROM subscriptions WHERE fcm_token = ?');
  stmt.run(fcmToken);
};
```

---

## Package.json for Backend

```json
{
  "name": "hackjam-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "firebase-admin": "^12.0.0",
    "better-sqlite3": "^9.2.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.10.0",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2"
  }
}
```

---

## Deployment Options

### 1. **Vercel** (Recommended - Serverless)
- Free tier available
- Easy deployment
- Automatic HTTPS
- Serverless functions

**Setup:**
```bash
npm install -D vercel
vercel
```

### 2. **Netlify Functions**
- Free tier available
- Similar to Vercel
- Easy setup

### 3. **Railway**
- Free tier: $5 credit/month
- Traditional server deployment
- Easy database setup

### 4. **Render**
- Free tier available
- Traditional server
- PostgreSQL included

### 5. **Fly.io**
- Free tier available
- Global deployment
- Good performance

---

## Environment Variables

Create `.env` file:
```env
PORT=3000
NODE_ENV=development
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
DATABASE_URL=sqlite:./lostfound.db
# Or for PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost:5432/lostfound
```

---

## Pros & Cons Summary

### ✅ Pros
- Full control over code
- Choose your database
- Industry standard
- Great for learning
- Flexible and customizable
- TypeScript support
- Easy to test and debug

### ❌ Cons
- More setup required
- Need to manage database
- Need to handle deployment
- More code to write
- No built-in real-time (need Socket.io)

---

## Recommendation

**Use Express.js if:**
- ✅ You want full control
- ✅ You want to learn backend development
- ✅ You have specific database requirements
- ✅ You want flexibility
- ✅ You're comfortable with more setup

**Don't use Express.js if:**
- ❌ You want the quickest setup (use Firebase)
- ❌ You don't want to manage a server
- ❌ You want built-in real-time (use Firebase)

---

## Next Steps

Would you like me to:
1. **Set up Express backend** in your project?
2. **Create the API routes** for items and subscriptions?
3. **Set up database** (SQLite for quick start, or PostgreSQL)?
4. **Integrate Firebase FCM** for notifications?
5. **Set up deployment** configuration?

Let me know and I'll get started!

