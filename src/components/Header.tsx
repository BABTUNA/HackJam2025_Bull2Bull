import { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  onAddItemClick?: () => void;
  onTabClick?: (tab: 'about' | 'social' | 'chat' | null) => void;
  onInstagramClick?: () => void;
  instagramUrl?: string;
  activeTab?: 'about' | 'social' | 'chat' | null;
  logoUrl?: string;
  logoAlt?: string;
}

const Header = ({ onAddItemClick, onTabClick, onInstagramClick, instagramUrl, activeTab: externalActiveTab, logoUrl, logoAlt = 'Lost & Found Map Logo' }: HeaderProps) => {
  const [internalActiveTab, setInternalActiveTab] = useState<'about' | 'social' | 'chat' | null>(null);
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.style.setProperty('background', 'linear-gradient(to right, rgb(5, 150, 105), rgb(4, 120, 87))', 'important');
      headerRef.current.style.setProperty('background-image', 'linear-gradient(to right, rgb(5, 150, 105), rgb(4, 120, 87))', 'important');
      
      const observer = new MutationObserver(() => {
        if (headerRef.current) {
          headerRef.current.style.setProperty('background', 'linear-gradient(to right, rgb(147, 51, 234), rgb(107, 33, 168))', 'important');
          headerRef.current.style.setProperty('background-image', 'linear-gradient(to right, rgb(147, 51, 234), rgb(107, 33, 168))', 'important');
        }
      });

      observer.observe(headerRef.current, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        childList: false,
        subtree: false
      });

      return () => observer.disconnect();
    }
  }, []);

  const handleAddItemClick = () => {
    if (onAddItemClick) {
      onAddItemClick();
    }
  };

  const handleAddItemKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleAddItemClick();
    }
  };

  const handleInstagramClick = () => {
    if (instagramUrl) {
      window.open(instagramUrl, '_blank', 'noopener,noreferrer');
    }
    if (onInstagramClick) {
      onInstagramClick();
    }
  };

  const handleInstagramKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleInstagramClick();
    }
  };

  const handleTabClick = (tab: 'about' | 'social' | 'chat') => {
    const newActiveTab = activeTab === tab ? null : tab;
    if (externalActiveTab === undefined) {
      setInternalActiveTab(newActiveTab);
    }
    if (onTabClick) {
      onTabClick(newActiveTab);
    }
  };

  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    tab: 'about' | 'social' | 'chat'
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTabClick(tab);
    }
  };

  return (
    <header 
      ref={headerRef}
      id="app-header" 
      className="flex justify-between items-center px-6 py-4 !bg-gradient-to-r !from-emerald-700 !to-emerald-900 text-white shadow-md z-10"
    >
      <div
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => {
          if (onTabClick) {
            onTabClick(null);
          }
        }}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && onTabClick) {
            e.preventDefault();
            onTabClick(null);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Return to map view"
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={logoAlt}
            className="h-10 w-auto object-contain"
            onError={(e) => {
              console.error('Logo failed to load:', logoUrl);
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <span className="text-3xl" role="img" aria-hidden="true">
            🔍
          </span>
        )}
        <h1 className="m-0 text-2xl font-semibold">
          Lost & Found Map
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <nav className="flex gap-2" role="tablist" aria-label="Navigation tabs">
          <button
            className={`!px-4 !py-2 !rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-700 ${
              activeTab === 'about'
                ? '!bg-emerald-600 text-white shadow-md'
                : '!bg-white/10 text-white hover:!bg-white/20'
            }`}
            onClick={() => handleTabClick('about')}
            onKeyDown={(e) => handleTabKeyDown(e, 'about')}
            tabIndex={0}
            role="tab"
            aria-label="About Us"
            aria-selected={activeTab === 'about'}
          >
            About Us
          </button>
          
          <button
            className={`!px-4 !py-2 !rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-700 ${
              activeTab === 'social'
                ? '!bg-emerald-600 text-white shadow-md'
                : '!bg-white/10 text-white hover:!bg-white/20'
            }`}
            onClick={() => handleTabClick('social')}
            onKeyDown={(e) => handleTabKeyDown(e, 'social')}
            tabIndex={0}
            role="tab"
            aria-label="Social Media"
            aria-selected={activeTab === 'social'}
          >
            Social Media
          </button>
          
          <button
            className={`!px-4 !py-2 !rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-700 ${
              activeTab === 'chat'
                ? '!bg-emerald-600 text-white shadow-md'
                : '!bg-white/10 text-white hover:!bg-white/20'
            }`}
            onClick={() => handleTabClick('chat')}
            onKeyDown={(e) => handleTabKeyDown(e, 'chat')}
            tabIndex={0}
            role="tab"
            aria-label="Live Chat"
            aria-selected={activeTab === 'chat'}
          >
            Live Chat
          </button>
        </nav>

        <button
          className="!p-2.5 !bg-white/10 text-white !border-none !rounded-lg cursor-pointer transition-all hover:!bg-white/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-700"
          onClick={handleInstagramClick}
          onKeyDown={handleInstagramKeyDown}
          tabIndex={0}
          aria-label="Visit our Instagram page"
        >
          <span className="text-xl" role="img" aria-hidden="true">
            📷
          </span>
        </button>

        <button
          className="!px-5 !py-2.5 !bg-white text-emerald-700 !border-none !rounded-lg text-sm font-semibold cursor-pointer transition-all shadow-sm hover:!bg-gray-100 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-700"
          onClick={handleAddItemClick}
          onKeyDown={handleAddItemKeyDown}
          tabIndex={0}
          aria-label="Add new lost or found item"
        >
          + Add Item
        </button>
      </div>
    </header>
  );
};

export default Header;

