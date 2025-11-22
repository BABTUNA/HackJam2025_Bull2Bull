import express from 'express';
import { saveSubscription, getSubscriptions, deleteSubscription } from '../services/dbService.js';
import type { Subscription } from '../types/index.js';

const router = express.Router();

// Subscribe (store FCM token)
router.post('/', async (req, res) => {
  try {
    const { fcm_token, email, preferences } = req.body;

    if (!fcm_token) {
      return res.status(400).json({ error: 'fcm_token is required' });
    }

    const subscription: Subscription = {
      fcm_token,
      email: email || undefined,
      preferences: preferences || {
        notifyOnLost: true,
        notifyOnFound: true,
      },
    };

    const saved = await saveSubscription(subscription);
    res.status(201).json(saved);
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to subscribe', message: error.message });
  }
});

// Get all subscriptions (for admin/debugging)
router.get('/', async (req, res) => {
  try {
    const subscriptions = await getSubscriptions();
    res.json(subscriptions);
  } catch (error: any) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions', message: error.message });
  }
});

// Update subscription preferences
router.put('/:token', async (req, res) => {
  try {
    const { preferences, email } = req.body;
    
    const subscription: Subscription = {
      fcm_token: req.params.token,
      email,
      preferences,
    };

    const updated = await saveSubscription(subscription);
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Failed to update subscription', message: error.message });
  }
});

// Unsubscribe
router.delete('/:token', async (req, res) => {
  try {
    await deleteSubscription(req.params.token);
    res.json({ message: 'Unsubscribed successfully' });
  } catch (error: any) {
    console.error('Error deleting subscription:', error);
    res.status(500).json({ error: 'Failed to unsubscribe', message: error.message });
  }
});

export default router;

