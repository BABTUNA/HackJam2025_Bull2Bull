# MapLibre Available Styles

## Demo Tiles (Free, No API Key Required)

From `https://demotiles.maplibre.org/`:

1. **style.json** - Detailed street map with roads, labels, and POIs
   ```
   https://demotiles.maplibre.org/style.json
   ```

2. **globe.json** - Simple globe/world view
   ```
   https://demotiles.maplibre.org/globe.json
   ```

## OpenMapTiles Styles (Free)

From OpenMapTiles project:

1. **OSM Bright** - Bright, colorful style similar to Google Maps
   ```
   https://api.maptiler.com/maps/openstreetmap/style.json?key=YOUR_KEY
   ```
   (Note: Requires free API key from MapTiler)

2. **Positron** - Light, minimal style
3. **Dark Matter** - Dark theme style
4. **Toner** - High contrast black and white style

## Stadia Maps Styles (Free Tier Available)

1. **Alidade Smooth** - Clean, modern street map
2. **Alidade Smooth Dark** - Dark version of Alidade Smooth
3. **Alidade Satellite** - Satellite imagery
4. **Outdoors** - Outdoor/topographic style
5. **Stamen Toner** - High contrast style
6. **Stamen Terrain** - Topographic style
7. **Stamen Watercolor** - Artistic watercolor style

## Shortbread/VersaTiles Styles (Free)

1. **VersaTiles Colorful** - Vibrant, full-featured map
   ```
   https://shortbread-tiles.org/styles/versatiles-colorful/style.json
   ```

2. **VersaTiles Neutrino** - Light basemap style
   ```
   https://shortbread-tiles.org/styles/versatiles-neutrino/style.json
   ```

3. **Shortbread-Demo-MapLibre** - Basic demo style
   ```
   https://shortbread-tiles.org/styles/shortbread-demo-maplibre/style.json
   ```

4. **Shortbread-Mapnik** - Colored base map with roads, land use, water
   ```
   https://shortbread-tiles.org/styles/shortbread-mapnik/style.json
   ```

## MapLibre Basemaps Project

Available styles include:
- OSM Bright
- Positron
- Dark Matter
- Toner
- Fiord Color
- ArcGIS Hybrid
- Carto Voyager
- ICGC Standard
- Mono Red, Green, Blue, Purple, Orange, Yellow, Black, Gray

## Usage Example

```typescript
// In your MapView component
map.current = new maplibregl.Map({
  container: mapContainer.current,
  style: 'https://demotiles.maplibre.org/style.json', // Change this URL
  center: [-122.4194, 37.7749],
  zoom: 12
});
```

## Recommended for Lost & Found App

**Best options for detailed street maps:**
1. `https://demotiles.maplibre.org/style.json` - Good detail, no API key
2. `https://shortbread-tiles.org/styles/versatiles-colorful/style.json` - Very detailed, colorful
3. `https://shortbread-tiles.org/styles/shortbread-mapnik/style.json` - Good street detail

**For dark theme:**
- Stadia Maps Alidade Smooth Dark (requires API key setup)

**For minimal/clean look:**
- VersaTiles Neutrino
- Positron

