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

    // USF campus bounds
    const campusBounds = {
      west: -82.4300,
      east: -82.4000,
      south: 28.0500,
      north: 28.0700
    };

    // Convert 500 meters to degrees
    // At latitude ~28°, 1 degree longitude ≈ 98,000 meters, 1 degree latitude ≈ 111,000 meters
    const metersToDegreesLng = 500 / 98000; // ~0.0051 degrees
    const metersToDegreesLat = 500 / 111000; // ~0.0045 degrees

    // Extended bounds (500 meters outside campus)
    const extendedBounds = [
      [campusBounds.west - metersToDegreesLng, campusBounds.south - metersToDegreesLat], // Southwest
      [campusBounds.east + metersToDegreesLng, campusBounds.north + metersToDegreesLat]  // Northeast
    ] as [[number, number], [number, number]];

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/bright',
      center: [-82.4139, 28.0586],
      zoom: 15,
      maxBounds: extendedBounds,
      minZoom: 13 // Prevent zooming out too far
    });

    map.current.once('style.load', () => {
      console.log('Map style loaded: globe.json');
    });

    map.current.on('load', async () => {
      if (!map.current) return;
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      // Create diagonal line pattern for restricted area (one direction only)
      const patternSize = 32;
      const patternCanvas = document.createElement('canvas');
      patternCanvas.width = patternSize;
      patternCanvas.height = patternSize;
      const patternCtx = patternCanvas.getContext('2d');
      if (patternCtx) {
        patternCtx.strokeStyle = '#ef4444';
        patternCtx.lineWidth = 2;
        patternCtx.beginPath();
        // Draw diagonal lines in one direction only (bottom-left to top-right)
        patternCtx.moveTo(0, patternSize);
        patternCtx.lineTo(patternSize, 0);
        patternCtx.stroke();
        const patternImageData = patternCtx.getImageData(0, 0, patternSize, patternSize);
        map.current.addImage('diagonal-red-pattern', patternImageData);
      }

      // Campus boundary coordinates
      const campusCoords = [
        [-82.4300, 28.0500], // Southwest corner
        [-82.4000, 28.0500], // Southeast corner
        [-82.4000, 28.0700], // Northeast corner
        [-82.4300, 28.0700], // Northwest corner
        [-82.4300, 28.0500]  // Close the polygon
      ];

      // Extended boundary coordinates (500m outside)
      const extendedCoords = [
        [campusBounds.west - metersToDegreesLng, campusBounds.south - metersToDegreesLat], // Southwest
        [campusBounds.east + metersToDegreesLng, campusBounds.south - metersToDegreesLat], // Southeast
        [campusBounds.east + metersToDegreesLng, campusBounds.north + metersToDegreesLat], // Northeast
        [campusBounds.west - metersToDegreesLng, campusBounds.north + metersToDegreesLat], // Northwest
        [campusBounds.west - metersToDegreesLng, campusBounds.south - metersToDegreesLat]  // Close
      ];

      // Add USF campus outline
      map.current.addSource('usf-campus', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [campusCoords]
          }
        }
      });

      // Add restricted area (outside campus, inside extended boundary) - polygon with hole
      // Reverse campus coords for the hole (must be counter-clockwise)
      const campusCoordsReversed = [...campusCoords].reverse();
      map.current.addSource('restricted-area', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [
              extendedCoords, // Outer ring (extended boundary)
              campusCoordsReversed // Inner hole (campus boundary, reversed for hole)
            ]
          }
        }
      });

      // Add semi-transparent red fill layer for restricted area
      map.current.addLayer({
        id: 'restricted-area-fill',
        type: 'fill',
        source: 'restricted-area',
        paint: {
          'fill-color': '#ef4444',
          'fill-opacity': 0.15
        }
      });

      // Add diagonal pattern layer (fully opaque) on top of the fill
      map.current.addLayer({
        id: 'restricted-area-pattern',
        type: 'fill',
        source: 'restricted-area',
        paint: {
          'fill-pattern': 'diagonal-red-pattern',
          'fill-opacity': 1.0
        }
      });

      // Add outline layer for restricted area
      map.current.addLayer({
        id: 'restricted-area-outline',
        type: 'line',
        source: 'restricted-area',
        paint: {
          'line-color': '#ef4444',
          'line-width': 2,
          'line-opacity': 0.6
        }
      });

      // Add outline layer for campus boundary
      map.current.addLayer({
        id: 'usf-campus-outline',
        type: 'line',
        source: 'usf-campus',
        paint: {
          'line-color': '#6366f1',
          'line-width': 3,
          'line-opacity': 0.8
        }
      });
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
        // Remove restricted area layers if they exist
        if (map.current.getLayer('restricted-area-outline')) {
          map.current.removeLayer('restricted-area-outline');
        }
        if (map.current.getLayer('restricted-area-pattern')) {
          map.current.removeLayer('restricted-area-pattern');
        }
        if (map.current.getLayer('restricted-area-fill')) {
          map.current.removeLayer('restricted-area-fill');
        }
        if (map.current.getSource('restricted-area')) {
          map.current.removeSource('restricted-area');
        }
        // Remove campus layer if it exists
        if (map.current.getLayer('usf-campus-outline')) {
          map.current.removeLayer('usf-campus-outline');
        }
        if (map.current.getSource('usf-campus')) {
          map.current.removeSource('usf-campus');
        }
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
        ${popupInfo.contact ? `
          <p class="mt-2 mb-1 text-xs text-gray-700">
            <strong>Contact:</strong> 
            <a href="mailto:${popupInfo.contact}" class="text-emerald-600 hover:text-emerald-700 hover:underline ml-1">
              ${popupInfo.contact}
            </a>
          </p>
        ` : ''}
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

