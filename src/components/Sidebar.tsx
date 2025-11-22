import { useState } from 'react';
import type { LostAndFoundItem, ItemType } from '../types';

interface SidebarProps {
  items: LostAndFoundItem[];
  onAddItem: (item: Omit<LostAndFoundItem, 'id' | 'date'>) => void;
  onItemClick?: (item: LostAndFoundItem) => void;
}

const Sidebar = ({ items, onAddItem, onItemClick }: SidebarProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'lost' as ItemType,
    title: '',
    description: '',
    contact: '',
    imageUrl: '',
    location: { lat: 0, lng: 0 }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }

    onAddItem({
      type: formData.type,
      title: formData.title,
      description: formData.description,
      contact: formData.contact || undefined,
      imageUrl: formData.imageUrl || undefined,
      location: formData.location
    });

    setFormData({
      type: 'lost',
      title: '',
      description: '',
      contact: '',
      imageUrl: '',
      location: { lat: 0, lng: 0 }
    });
    setShowForm(false);
  };

  const handleInputChange = (field: string, value: string | ItemType) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (field: 'lat' | 'lng', value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [field]: numValue }
    }));
  };

  const handleFormToggle = () => {
    setShowForm(!showForm);
  };

  const handleFormKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleFormToggle();
    }
  };

  const handleItemClick = (item: LostAndFoundItem) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const handleItemKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, item: LostAndFoundItem) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleItemClick(item);
    }
  };

  return (
    <div className="flex flex-col h-full w-80 bg-white border-r-2 border-emerald-300 shadow-lg">
      <div className="p-4 border-b-2 border-emerald-300 bg-gradient-to-r from-emerald-50 to-emerald-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-emerald-700">Lost & Found Items</h2>
          <button
            className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-emerald-800 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
            onClick={handleFormToggle}
            onKeyDown={handleFormKeyDown}
            tabIndex={0}
            aria-label={showForm ? 'Close form' : 'Add new item'}
          >
            {showForm ? 'Cancel' : '+ Post Item'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value as ItemType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                tabIndex={0}
                aria-label="Item type"
              >
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="e.g., Lost iPhone 13"
                required
                tabIndex={0}
                aria-label="Item title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                rows={3}
                placeholder="Describe the item..."
                required
                tabIndex={0}
                aria-label="Item description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact (Optional)
              </label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => handleInputChange('contact', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="Email or phone"
                tabIndex={0}
                aria-label="Contact information"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (Optional)
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="https://example.com/image.jpg"
                tabIndex={0}
                aria-label="Image URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location (Latitude, Longitude)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="any"
                  value={formData.location.lat || ''}
                  onChange={(e) => handleLocationChange('lat', e.target.value)}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Latitude"
                  tabIndex={0}
                  aria-label="Latitude"
                />
                <input
                  type="number"
                  step="any"
                  value={formData.location.lng || ''}
                  onChange={(e) => handleLocationChange('lng', e.target.value)}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Longitude"
                  tabIndex={0}
                  aria-label="Longitude"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white rounded-lg font-semibold hover:from-emerald-800 hover:to-emerald-950 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
              tabIndex={0}
              aria-label="Submit item"
            >
              Submit Item
            </button>
          </form>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-lg">No items posted yet.</p>
            <p className="text-sm mt-2">Click "Post Item" to add one!</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                item.type === 'lost'
                  ? 'border-red-300 bg-red-50 hover:border-red-400'
                  : 'border-green-300 bg-green-50 hover:border-green-400'
              }`}
              onClick={() => handleItemClick(item)}
              onKeyDown={(e) => handleItemKeyDown(e, item)}
              tabIndex={0}
              role="button"
              aria-label={`${item.type} item: ${item.title}`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-800 flex-1">{item.title}</h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    item.type === 'lost'
                      ? 'bg-red-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {item.type === 'lost' ? 'Lost' : 'Found'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{new Date(item.date).toLocaleDateString()}</span>
                {item.contact && (
                  <span className="truncate max-w-[120px]" title={item.contact}>
                    📧 {item.contact}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;

