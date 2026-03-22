import React, { useEffect, useState } from 'react';

export default function ExploredMap() {
  const [MapComponents, setMapComponents] = useState<any>(null);
  const [L, setL] = useState<any>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [zoom, setZoom] = useState(2);

  useEffect(() => {
    const loadMapAndData = async () => {
      try {
        const response = await fetch('/api/posts?type=place');
        const data = await response.json();
        setPlaces(data);
      } catch (e) {
        console.error("Failed to load places:", e);
      }

      const [Leaflet, ReactLeaflet] = await Promise.all([
        import('leaflet'),
        import('react-leaflet'),
      ]);

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

  const { MapContainer, TileLayer, Marker, Popup, useMapEvents } = MapComponents;

  // Track zoom level to scale pins
  function ZoomTracker() {
    const map = useMapEvents({
      zoomend: () => {
        setZoom(map.getZoom());
      },
    });
    return null;
  }

  // Create a custom Image Marker Icon
  const createPlaceIcon = (place: any) => {
    const size = Math.max(30, Math.min(80, zoom * 15)); // Scale size based on zoom
    const imageUrl = place.image_path ? `/api/media?path=${place.image_path}` : null;

    if (imageUrl) {
      return L.divIcon({
        className: 'custom-image-marker',
        html: `
          <div class="relative group" style="width: ${size}px; height: ${size}px;">
            <div class="absolute inset-0 rounded-full border-2 border-earth-800 bg-earth-200 overflow-hidden shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              <img src="${imageUrl}" class="w-full h-full object-cover" />
            </div>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-earth-800 rounded-full border border-earth-100 shadow-sm"></div>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size],
      });
    }

    // Default pin for places without images
    return L.divIcon({
      className: 'custom-pin-marker',
      html: `
        <div class="flex flex-col items-center">
          <div class="w-4 h-4 bg-earth-800 rounded-full border-2 border-earth-100 shadow-md"></div>
          <div class="w-0.5 h-3 bg-earth-800 shadow-sm"></div>
        </div>
      `,
      iconSize: [16, 28],
      iconAnchor: [8, 28],
      popupAnchor: [0, -28],
    });
  };

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
        className="h-full w-full opacity-95 transition-opacity duration-1000 group-hover:opacity-100"
      >
        <ZoomTracker />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((place) => (
          <Marker 
            key={place.id} 
            position={[place.lat, place.lng]}
            icon={createPlaceIcon(place)}
          >
            <Popup minWidth={250} className="custom-popup">
              <div className="font-serif bg-earth-100 -m-1 overflow-hidden rounded-sm">
                {place.image_path && (
                    <div className="w-full h-40 overflow-hidden mb-3 border-b border-earth-200">
                        <img 
                            src={`/api/media?path=${place.image_path}`} 
                            alt={place.name} 
                            className="w-full h-full object-cover" 
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
