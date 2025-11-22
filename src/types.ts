export type ItemType = 'lost' | 'found';
export type ItemCategory = 'electronics' | 'clothing' | 'accessories' | 'documents' | 'keys' | 'books' | 'bags' | 'sports' | 'other';

export interface LostAndFoundItem {
  id: string;
  type: ItemType;
  title: string;
  description: string;
  category?: ItemCategory;
  location: {
    lat: number;
    lng: number;
  };
  date: string;
  contact?: string;
  imageUrl?: string;
}

