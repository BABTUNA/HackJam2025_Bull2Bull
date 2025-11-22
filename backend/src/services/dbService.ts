import { pool } from '../config/supabase.js';
import type { LostAndFoundItem, Subscription } from '../types/index.js';

// Items
export const saveItem = async (item: LostAndFoundItem): Promise<LostAndFoundItem> => {
  const result = await pool.query(
    `INSERT INTO items (id, type, title, description, location, date, contact_email, image_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      item.id,
      item.type,
      item.title,
      item.description,
      JSON.stringify(item.location),
      item.date,
      item.contact || null,
      item.imageUrl || null,
    ]
  );

  const row = result.rows[0];
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description,
    location: row.location,
    date: row.date,
    contact: row.contact_email,
    imageUrl: row.image_url,
    created_at: row.created_at,
  };
};

export const getItems = async (): Promise<LostAndFoundItem[]> => {
  const result = await pool.query(
    'SELECT * FROM items ORDER BY created_at DESC'
  );

  return result.rows.map((row) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description,
    location: row.location,
    date: row.date,
    contact: row.contact_email,
    imageUrl: row.image_url,
    created_at: row.created_at,
  }));
};

export const getItemById = async (id: string): Promise<LostAndFoundItem | null> => {
  const result = await pool.query(
    'SELECT * FROM items WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description,
    location: row.location,
    date: row.date,
    contact: row.contact_email,
    imageUrl: row.image_url,
    created_at: row.created_at,
  };
};

export const updateItem = async (id: string, updates: Partial<LostAndFoundItem>): Promise<LostAndFoundItem> => {
  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (updates.title !== undefined) {
    setClauses.push(`title = $${paramIndex++}`);
    values.push(updates.title);
  }
  if (updates.description !== undefined) {
    setClauses.push(`description = $${paramIndex++}`);
    values.push(updates.description);
  }
  if (updates.location !== undefined) {
    setClauses.push(`location = $${paramIndex++}`);
    values.push(JSON.stringify(updates.location));
  }
  if (updates.contact !== undefined) {
    setClauses.push(`contact_email = $${paramIndex++}`);
    values.push(updates.contact);
  }
  if (updates.imageUrl !== undefined) {
    setClauses.push(`image_url = $${paramIndex++}`);
    values.push(updates.imageUrl);
  }

  if (setClauses.length === 0) {
    // No updates, just return the existing item
    const existing = await getItemById(id);
    if (!existing) {
      throw new Error('Item not found');
    }
    return existing;
  }

  values.push(id);
  const result = await pool.query(
    `UPDATE items SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error('Item not found');
  }

  const row = result.rows[0];
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description,
    location: row.location,
    date: row.date,
    contact: row.contact_email,
    imageUrl: row.image_url,
    created_at: row.created_at,
  };
};

export const deleteItem = async (id: string): Promise<void> => {
  const result = await pool.query(
    'DELETE FROM items WHERE id = $1',
    [id]
  );

  if (result.rowCount === 0) {
    throw new Error('Item not found');
  }
};

// Subscriptions
export const saveSubscription = async (subscription: Subscription): Promise<Subscription> => {
  const result = await pool.query(
    `INSERT INTO subscriptions (fcm_token, email, preferences)
     VALUES ($1, $2, $3)
     ON CONFLICT (fcm_token) 
     DO UPDATE SET 
       email = EXCLUDED.email,
       preferences = EXCLUDED.preferences
     RETURNING *`,
    [
      subscription.fcm_token,
      subscription.email || null,
      JSON.stringify(subscription.preferences || {}),
    ]
  );

  const row = result.rows[0];
  return {
    id: row.id,
    fcm_token: row.fcm_token,
    email: row.email,
    preferences: row.preferences,
    created_at: row.created_at,
  };
};

export const getSubscriptions = async (): Promise<Subscription[]> => {
  const result = await pool.query('SELECT * FROM subscriptions');

  return result.rows.map((row) => ({
    id: row.id,
    fcm_token: row.fcm_token,
    email: row.email,
    preferences: row.preferences || {},
    created_at: row.created_at,
  }));
};

export const deleteSubscription = async (fcmToken: string): Promise<void> => {
  const result = await pool.query(
    'DELETE FROM subscriptions WHERE fcm_token = $1',
    [fcmToken]
  );

  if (result.rowCount === 0) {
    throw new Error('Subscription not found');
  }
};

