import React, { useEffect, useState } from 'react';

export default function ExploredMap() {
  const [MapComponents, setMapComponents] = useState<any>(null);
  const [L, setL] = useState<any>(null);
  const [places, setPlaces] = useState<any[]>([]);

  useEffect(() => {
    const loadMapAndData = async () => {
      // 1. Fetch dynamic places from D1 API
      try {
        const response = await fetch('/api/posts?type=place');
        const data = await response.json();
        setPlaces(data);
      } catch (e) {
        console.error("Failed to load places:", e);
      }

      // 2. Load Leaflet components
      const [Leaflet, ReactLeaflet] = await Promise.all([
        import('leaflet'),
        import('react-leaflet'),
      ]);

      // Fix for icons using CDN
      // @ts-ignore
      delete Leaflet.default.Icon.Default.prototype._getIconUrl;
      Leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      await import('leaflet/dist/leaflet.css');

      setL(Leaflet.default);
      setMapComponents(ReactLeaflet);
    };

    loadMapAndData();
  }, []);

  if (!MapComponents || !L) {
    return (
      <div className="h-[650px] w-full bg-earth-200 animate-pulse flex items-center justify-center italic text-earth-500 font-light tracking-widest">
        Syncing with Atlas...
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  return (
    <div className="h-[650px] w-full bg-earth-200 relative group overflow-hidden border border-earth-300">
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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((place) => (
          <Marker key={place.id} position={[place.lat, place.lng]}>
            <Popup minWidth={250} className="custom-popup">
              <div className="font-serif bg-earth-100 -m-1 overflow-hidden rounded-sm">
                {place.image_path && (
                    <div className="w-full h-40 overflow-hidden mb-3 border-b border-earth-200">
                        <img 
                            src={`/api/media?path=${place.image_path}`} 
                            alt={place.name} 
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
                        />
                    </div>
                )}
                <div className="p-3 pt-1">
                    <strong className="block text-xl font-light text-earth-900 leading-tight mb-2 border-b border-earth-200 pb-1">{place.name}</strong>
                    <p className="text-earth-700 text-sm italic font-light leading-relaxed">{place.note}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
