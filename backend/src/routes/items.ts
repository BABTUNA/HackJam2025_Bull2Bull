import express from 'express';
import { saveItem, getItems, getItemById, updateItem, deleteItem } from '../services/dbService.js';
import type { LostAndFoundItem } from '../types/index.js';

const router = express.Router();

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await getItems();
    res.json(items);
  } catch (error: any) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items', message: error.message });
  }
});

// Get single item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error: any) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item', message: error.message });
  }
});

// Create new item
router.post('/', async (req, res) => {
  try {
    const item: LostAndFoundItem = req.body;

    // Validate required fields
    if (!item.title || !item.type || !item.location || !item.location.lat || !item.location.lng) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['title', 'type', 'location.lat', 'location.lng'],
      });
    }

    // Generate ID if not provided
    if (!item.id) {
      item.id = Date.now().toString();
    }

    // Set date if not provided
    if (!item.date) {
      item.date = new Date().toISOString();
    }

    // Save to database
    const savedItem = await saveItem(item);

    res.status(201).json(savedItem);
  } catch (error: any) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item', message: error.message });
  }
});

// Update item
router.put('/:id', async (req, res) => {
  try {
    const item = await updateItem(req.params.id, req.body);
    res.json(item);
  } catch (error: any) {
    console.error('Error updating item:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(500).json({ error: 'Failed to update item', message: error.message });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    await deleteItem(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting item:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(500).json({ error: 'Failed to delete item', message: error.message });
  }
});

export default router;

