import { useState, useCallback, useEffect } from 'react';
import MapView from './components/MapView';
import type { LostAndFoundItem } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const App = () => {
  const [items, setItems] = useState<LostAndFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch items from backend API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/api/items`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch items: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Backend already returns imageUrl, but handle both formats for safety
        const transformedItems: LostAndFoundItem[] = data.map((item: any) => ({
          id: item.id,
          type: item.type,
          title: item.title,
          description: item.description,
          location: item.location,
          date: item.date,
          contact: item.contact || undefined,
          imageUrl: item.imageUrl || item.image_url || undefined,
        }));
        
        setItems(transformedItems);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError(err instanceof Error ? err.message : 'Failed to load items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

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
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2"></div>
                <p className="text-gray-600">Loading items...</p>
              </div>
            </div>
          )}
          {error && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-20 max-w-md">
              <p className="font-semibold">Error loading items</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}
          {!loading && !error && (
            <>
              <MapView
                items={items}
                onMarkerClick={handleMarkerClick}
                onMapClick={handleMapClick}
              />
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/95 px-4 py-2 rounded-full text-xs text-gray-600 shadow-lg z-10 pointer-events-none">
                {items.length > 0 
                  ? `${items.length} item${items.length !== 1 ? 's' : ''} on map`
                  : 'Click on the map to add a new lost or found item'}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
