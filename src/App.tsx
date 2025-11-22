import { useState, useCallback, useEffect } from 'react';
import MapView from './components/MapView';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AboutUs from './components/AboutUs';
import SocialMedia from './components/SocialMedia';
import LiveChat from './components/LiveChat';
import type { LostAndFoundItem } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const App = () => {
  const [activePage, setActivePage] = useState<'map' | 'about' | 'social' | 'chat'>('map');
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

  const handleAddItemClick = useCallback(() => {
    console.log('Add item clicked');
  }, []);

  const handleAddItem = useCallback((itemData: Omit<LostAndFoundItem, 'id' | 'date'>) => {
    const newItem: LostAndFoundItem = {
      ...itemData,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    setItems(prev => [...prev, newItem]);
  }, []);

  const handleItemClick = useCallback((item: LostAndFoundItem) => {
    console.log('Item clicked:', item);
  }, []);

  const handleTabClick = useCallback((tab: 'about' | 'social' | 'chat' | null) => {
    if (tab === null) {
      setActivePage('map');
    } else {
      setActivePage(tab);
    }
  }, []);

  const renderContent = () => {
    switch (activePage) {
      case 'about':
        return <AboutUs />;
      case 'social':
        return <SocialMedia />;
      case 'chat':
        return <LiveChat />;
      case 'map':
      default:
        return (
          <div className="flex flex-1 overflow-hidden min-h-0">
            <Sidebar
              items={items}
              onAddItem={handleAddItem}
              onItemClick={handleItemClick}
            />
            <div className="flex-1 relative min-h-0 p-4">
              <div className="w-full h-full border-4 border-emerald-400 rounded-lg shadow-xl overflow-hidden">
                {!loading && !error && (
                  <MapView
                    items={items}
                    onMarkerClick={handleMarkerClick}
                    onMapClick={handleMapClick}
                  />
                )}
                {!loading && !error && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/95 px-4 py-2 rounded-full text-xs text-gray-600 shadow-lg z-10 pointer-events-none">
                    {items.length > 0 
                      ? `${items.length} item${items.length !== 1 ? 's' : ''} on map`
                      : 'Click on the map to add a new lost or found item'}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <Header 
        onAddItemClick={handleAddItemClick}
        onTabClick={handleTabClick}
        activeTab={activePage === 'map' ? null : activePage}
        logoUrl="/Official_USF_Bulls_Athletic_Logo.png"
        logoAlt="USF Bulls Logo"
      />

      <div className="flex flex-1 overflow-hidden min-h-0">
        {loading && activePage === 'map' && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2"></div>
              <p className="text-gray-600">Loading items...</p>
            </div>
          </div>
        )}
        {error && activePage === 'map' && (
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
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
