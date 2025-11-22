import { useState, useCallback } from 'react';
import MapView from './components/MapView';
import type { LostAndFoundItem } from './types';

const App = () => {
  const [items] = useState<LostAndFoundItem[]>([
    {
      id: '1',
      type: 'lost',
      title: 'Lost iPhone 13',
      description: 'Black iPhone 13 with a blue case. Lost near the park entrance.',
      location: { lat: 37.7749, lng: -122.4194 },
      date: new Date().toISOString(),
      contact: 'john@example.com',
    },
    {
      id: '2',
      type: 'found',
      title: 'Found Wallet',
      description: 'Brown leather wallet found at the coffee shop. Contains ID and cards.',
      location: { lat: 37.7849, lng: -122.4094 },
      date: new Date().toISOString(),
      contact: 'sarah@example.com',
    },
  ]);

  const handleMapClick = useCallback((event: { lngLat: { lat: number; lng: number } }) => {
    console.log('Map clicked at:', event.lngLat);
  }, []);

  const handleMarkerClick = useCallback((item: LostAndFoundItem) => {
    console.log('Marker clicked:', item);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <header className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-md z-10">
        <h1 className="m-0 text-2xl font-semibold">🔍 Lost & Found Map</h1>
        <button
          className="px-5 py-2.5 bg-white text-purple-600 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all shadow-sm hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-md"
          onClick={() => console.log('Add item clicked')}
          tabIndex={0}
          aria-label="Add new lost or found item"
        >
          + Add Item
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden min-h-0">
        <div className="flex-1 relative min-h-0">
          <MapView
            items={items}
            onMarkerClick={handleMarkerClick}
            onMapClick={handleMapClick}
          />
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/95 px-4 py-2 rounded-full text-xs text-gray-600 shadow-lg z-10 pointer-events-none">
            Click on the map to add a new lost or found item
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
