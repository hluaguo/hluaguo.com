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
      <div className="h-full w-full bg-earth-200 animate-pulse flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-clay border-t-transparent animate-spin"></div>
        <span className="italic text-earth-500 font-light tracking-widest text-xs uppercase">Syncing with Atlas...</span>
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
    const size = Math.max(32, Math.min(90, zoom * 14)); // Scale size based on zoom
    const imageUrl = place.image_path ? `/api/media?path=${place.image_path}` : null;

    if (imageUrl) {
      return L.divIcon({
        className: 'custom-image-marker',
        html: `
          <div class="relative group" style="width: ${size}px; height: ${size}px;">
            <div class="absolute inset-0 rounded-full border-2 border-earth-900 bg-earth-200 overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3">
              <img src="${imageUrl}" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-clay rounded-full border-2 border-earth-100 shadow-sm"></div>
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
          <div class="w-4 h-4 bg-clay rounded-full border-2 border-earth-100 shadow-lg"></div>
          <div class="w-0.5 h-3 bg-clay shadow-sm"></div>
        </div>
      `,
      iconSize: [16, 28],
      iconAnchor: [8, 28],
      popupAnchor: [0, -28],
    });
  };

  return (
    <div className="h-full w-full bg-earth-200 relative group overflow-hidden border border-earth-300">
      {/* Decorative corner brackets */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-earth-900 z-50 pointer-events-none opacity-40"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-earth-900 z-50 pointer-events-none opacity-40"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-earth-900 z-50 pointer-events-none opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-earth-900 z-50 pointer-events-none opacity-40"></div>

      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        scrollWheelZoom={false} 
        className="h-full w-full opacity-90 transition-opacity duration-1000 group-hover:opacity-100"
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
            <Popup minWidth={280} className="custom-popup">
              <div className="font-serif bg-earth-100 -m-1 overflow-hidden rounded-sm border border-earth-200">
                {place.image_path && (
                    <div className="w-full h-44 overflow-hidden mb-3 border-b border-earth-200">
                        <img 
                            src={`/api/media?path=${place.image_path}`} 
                            alt={place.name} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                )}
                <div className="p-4 pt-1">
                    <strong className="block text-2xl font-serif font-light text-earth-900 leading-tight mb-2 border-b border-earth-200/50 pb-2">{place.name}</strong>
                    <p className="text-earth-700 text-sm italic font-light leading-relaxed">{place.note}</p>
                    <div className="mt-4 flex justify-between items-center opacity-30 text-[9px] uppercase tracking-widest font-bold">
                        <span>LAT: {place.lat.toFixed(2)}</span>
                        <span>LNG: {place.lng.toFixed(2)}</span>
                    </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
