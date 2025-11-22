export type ItemType = 'lost' | 'found';

export interface LostAndFoundItem {
  id: string;
  type: ItemType;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  date: string;
  contact?: string;
  imageUrl?: string;
  created_at?: string;
}

export interface Subscription {
  id?: string;
  fcm_token: string;
  email?: string;
  preferences?: {
    notifyOnLost?: boolean;
    notifyOnFound?: boolean;
    notifyInArea?: boolean;
    areaRadius?: number;
  };
  created_at?: string;
}

