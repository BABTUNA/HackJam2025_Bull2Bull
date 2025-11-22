import type { ItemCategory } from '../types';

export const categoryEmojis: Record<ItemCategory, string> = {
  electronics: '📱',
  clothing: '👕',
  accessories: '👜',
  documents: '📄',
  keys: '🔑',
  books: '📚',
  bags: '🎒',
  sports: '⚽',
  other: '📦',
};

export const getCategoryEmoji = (category?: ItemCategory): string => {
  if (!category) return '';
  return categoryEmojis[category] || '📦';
};

export const getCategoryDisplayName = (category?: ItemCategory): string => {
  if (!category) return '';
  return category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1');
};

export const getCategoryWithEmoji = (category?: ItemCategory): string => {
  if (!category) return '';
  return `${getCategoryEmoji(category)} ${getCategoryDisplayName(category)}`;
};

