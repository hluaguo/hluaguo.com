import React, { useEffect, useState } from 'react';

// Sample places data
const places = [
  { id: 1, name: 'Kyoto, Japan', lat: 35.0116, lng: 135.7681, note: 'Temples and matcha.' },
  { id: 2, name: 'Interlaken, Switzerland', lat: 46.6863, lng: 7.8632, note: 'Breathtaking alpine views.' },
  { id: 3, name: 'London, UK', lat: 51.5074, lng: -0.1278, note: 'Rainy days and museums.' },
];

export default function ExploredMap() {
  const [MapComponents, setMapComponents] = useState<any>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    // Dynamic import to strictly prevent any server-side execution/imports
    const loadMap = async () => {
      // @ts-ignore
      const [Leaflet, ReactLeaflet] = await Promise.all([
        import('leaflet'),
        import('react-leaflet'),
      ]);

      // Fix for icons using CDN for reliability
      // @ts-ignore
      delete Leaflet.default.Icon.Default.prototype._getIconUrl;
      Leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Load CSS on client side only
      await import('leaflet/dist/leaflet.css');

      setL(Leaflet.default);
      setMapComponents(ReactLeaflet);
    };

    loadMap();
  }, []);

  if (!MapComponents || !L) {
    return (
      <div className="h-[650px] w-full bg-earth-200 animate-pulse flex items-center justify-center italic text-earth-500">
        Syncing with Atlas...
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  return (
    <div className="h-[650px] w-full bg-earth-200 relative group overflow-hidden border border-earth-300">
      {/* Decorative corner brackets */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-earth-800 z-50 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-earth-800 z-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-earth-800 z-50 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-earth-800 z-50 pointer-events-none"></div>

      <MapContainer 
        center={[25, 10]} 
        zoom={2} 
        scrollWheelZoom={false} 
        className="h-full w-full opacity-90 transition-opacity duration-1000 group-hover:opacity-100"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((place) => (
          <Marker key={place.id} position={[place.lat, place.lng]}>
            <Popup>
              <div className="font-serif p-1">
                <strong className="block text-lg font-light text-earth-900 mb-1">{place.name}</strong>
                <span className="text-earth-600 text-sm italic">{place.note}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
