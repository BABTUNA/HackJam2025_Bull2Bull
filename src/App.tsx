import { useState, useCallback } from 'react';
import MapView from './components/MapView';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AboutUs from './components/AboutUs';
import SocialMedia from './components/SocialMedia';
import LiveChat from './components/LiveChat';
import type { LostAndFoundItem } from './types';

const App = () => {
  const [activePage, setActivePage] = useState<'map' | 'about' | 'social' | 'chat'>('map');
  const [items, setItems] = useState<LostAndFoundItem[]>([
    {
      id: '1',
      type: 'lost',
      title: 'Lost iPhone 13',
      description: 'Black iPhone 13 with a blue case. Lost near the library entrance.',
      location: { lat: 28.0590, lng: -82.4145 },
      date: new Date().toISOString(),
      contact: 'john@example.com',
    },
    {
      id: '2',
      type: 'found',
      title: 'Found Wallet',
      description: 'Brown leather wallet found at the student center. Contains ID and cards.',
      location: { lat: 28.0580, lng: -82.4130 },
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
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
