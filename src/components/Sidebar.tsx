import { useState } from 'react';
import type { LostAndFoundItem, ItemType } from '../types';

interface SidebarProps {
  items: LostAndFoundItem[];
  onAddItem: (item: Omit<LostAndFoundItem, 'id' | 'date'>) => Promise<void>;
  onItemClick?: (item: LostAndFoundItem) => void;
}

const Sidebar = ({ items, onAddItem, onItemClick }: SidebarProps) => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    type: 'lost' as ItemType,
    title: '',
    description: '',
    contact: '',
    imageUrl: '',
    location: { lat: 0, lng: 0 }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setSubmitError('Title and description are required');
      return;
    }

    // Validate location
    if (!formData.location.lat || !formData.location.lng || 
        formData.location.lat === 0 || formData.location.lng === 0) {
      setSubmitError('Please set a location on the map by clicking on it');
      return;
    }

    // Validate email format if provided
    if (formData.contact && formData.contact.trim()) {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i;
      if (!emailRegex.test(formData.contact.trim())) {
        setSubmitError('Please enter a valid email address');
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      await onAddItem({
        type: formData.type,
        title: formData.title.trim(),
        description: formData.description.trim(),
        contact: formData.contact.trim() || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
        location: formData.location
      });

      // Reset form on success
      setFormData({
        type: 'lost',
        title: '',
        description: '',
        contact: '',
        imageUrl: '',
        location: { lat: 0, lng: 0 }
      });
      setSubmitError(null);
      setSubmitSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowForm(false);
      }, 2000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save item');
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
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
            {submitError && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {submitError}
              </div>
            )}
            {submitSuccess && (
              <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                ✓ Item saved successfully!
              </div>
            )}
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
                Contact Email (Optional)
              </label>
              <input
                type="email"
                value={formData.contact}
                onChange={(e) => handleInputChange('contact', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="your.email@example.com"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                tabIndex={0}
                aria-label="Contact email address"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a valid email address for contact
              </p>
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
                Location (Latitude, Longitude) *
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
                  required
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
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formData.location.lat && formData.location.lng 
                  ? `Location set: ${formData.location.lat.toFixed(6)}, ${formData.location.lng.toFixed(6)}`
                  : 'Click on the map or enter coordinates manually'}
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white rounded-lg font-semibold hover:from-emerald-800 hover:to-emerald-950 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              tabIndex={0}
              aria-label="Submit item"
            >
              {isSubmitting ? 'Saving...' : 'Submit Item'}
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
                  <a
                    href={`mailto:${item.contact}`}
                    onClick={(e) => e.stopPropagation()}
                    className="truncate max-w-[120px] text-emerald-600 hover:text-emerald-700 hover:underline"
                    title={`Email: ${item.contact}`}
                  >
                    📧 {item.contact}
                  </a>
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

