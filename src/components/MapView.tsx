import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { LostAndFoundItem } from '../types';

interface MapViewProps {
  items: LostAndFoundItem[];
  onMarkerClick?: (item: LostAndFoundItem) => void;
  onMapClick?: (event: { lngLat: { lat: number; lng: number } }) => void;
}

const MapView = ({ items, onMarkerClick, onMapClick }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const popupsRef = useRef<maplibregl.Popup[]>([]);
  const [popupInfo, setPopupInfo] = useState<LostAndFoundItem | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/bright',
      center: [-82.4139, 28.0586],
      zoom: 15
    });

    map.current.once('style.load', () => {
      console.log('Map style loaded: globe.json');
    });

    map.current.on('load', () => {
      if (!map.current) return;
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    });

    const handleMapClick = (e: maplibregl.MapMouseEvent) => {
      if (onMapClick && e.lngLat) {
        onMapClick({ lngLat: { lat: e.lngLat.lat, lng: e.lngLat.lng } });
      }
    };

    if (map.current) {
      map.current.on('click', handleMapClick);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      markersRef.current.forEach(marker => marker.remove());
      popupsRef.current.forEach(popup => popup.remove());
      markersRef.current = [];
      popupsRef.current = [];
    };
  }, [onMapClick]);

  useEffect(() => {
    if (!map.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    items.forEach((item) => {
      if (!map.current) return;

      const el = document.createElement('div');
      el.className = `cursor-pointer text-2xl transition-transform hover:scale-125 ${item.type === 'lost' ? 'text-red-500' : 'text-green-500'}`;
      el.innerHTML = item.type === 'lost' ? '🔴' : '🟢';
      el.style.cursor = 'pointer';

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([item.location.lng, item.location.lat])
        .addTo(map.current);

      el.addEventListener('click', () => {
        setPopupInfo(item);
        if (onMarkerClick) {
          onMarkerClick(item);
        }
      });

      markersRef.current.push(marker);
    });
  }, [items, onMarkerClick]);

  useEffect(() => {
    if (!map.current) return;

    popupsRef.current.forEach(popup => popup.remove());
    popupsRef.current = [];

    if (popupInfo) {
      const popupContent = document.createElement('div');
      popupContent.className = 'min-w-[200px]';
      popupContent.innerHTML = `
        <h3 class="m-0 mb-2 text-base font-semibold">${popupInfo.title}</h3>
        <p class="my-1 px-2 py-1 bg-gray-100 rounded text-xs font-semibold uppercase inline-block">
          ${popupInfo.type === 'lost' ? 'Lost' : 'Found'}
        </p>
        <p class="my-2 text-sm text-gray-600">${popupInfo.description}</p>
        <p class="mt-2 mb-0 text-xs text-gray-500">
          ${new Date(popupInfo.date).toLocaleDateString()}
        </p>
        <button class="mt-2 px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded" onclick="this.closest('.maplibregl-popup').remove()">Close</button>
      `;

      const popup = new maplibregl.Popup({ closeOnClick: false })
        .setLngLat([popupInfo.location.lng, popupInfo.location.lat])
        .setDOMContent(popupContent)
        .addTo(map.current);

      popupContent.querySelector('button')?.addEventListener('click', () => {
        setPopupInfo(null);
        popup.remove();
      });

      popupsRef.current.push(popup);
    }
  }, [popupInfo]);

  return <div ref={mapContainer} className="w-full h-full" />;
};

export default MapView;

