# Database Initialization Scripts

## Files

- **`schema.sql`** - Creates tables and indexes only (no data)
- **`init-with-data.sql`** - Creates tables and inserts sample data matching App.tsx format
- **`init.sql`** - Full initialization with more sample items

## Quick Start

### Option 1: Schema + Sample Data (Recommended)

Use `init-with-data.sql` to set up everything at once:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/prcchoyhnzyzhquvwmhf
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy the entire contents of `init-with-data.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)

This will:
- ✅ Create the `items` and `subscriptions` tables
- ✅ Create indexes for performance
- ✅ Insert the 2 sample items from App.tsx

### Option 2: Schema Only

If you only want to create tables without data:

1. Use `schema.sql` instead
2. Follow the same steps above

## Sample Data Format

The initialization script inserts items matching your App.tsx format:

```typescript
{
  id: '1',
  type: 'lost',
  title: 'Lost iPhone 13',
  description: 'Black iPhone 13 with a blue case. Lost near the library entrance.',
  location: { lat: 28.0590, lng: -82.4145 },
  date: new Date().toISOString(),
  contact: 'john@example.com',
}
```

## Verify Installation

After running the script, verify the data:

```sql
SELECT * FROM items ORDER BY created_at DESC;
```

You should see 2 items (or more if using `init.sql`).

## Troubleshooting

- **"relation already exists"** - Tables already exist, this is fine
- **"duplicate key value"** - Data already exists, this is fine (ON CONFLICT handles it)
- If you want to start fresh, you can drop tables first:
  ```sql
  DROP TABLE IF EXISTS items CASCADE;
  DROP TABLE IF EXISTS subscriptions CASCADE;
  ```

