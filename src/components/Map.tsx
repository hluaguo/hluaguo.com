import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Sample places data
const places = [
  { id: 1, name: 'Kyoto, Japan', lat: 35.0116, lng: 135.7681, note: 'Temples and matcha.' },
  { id: 2, name: 'Interlaken, Switzerland', lat: 46.6863, lng: 7.8632, note: 'Breathtaking alpine views.' },
  { id: 3, name: 'London, UK', lat: 51.5074, lng: -0.1278, note: 'Rainy days and museums.' },
];

export default function ExploredMap() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Only run on client
    import('leaflet').then((L) => {
      // Fix for missing marker icons in Leaflet with Vite
      // @ts-ignore
      import('leaflet/dist/images/marker-icon.png').then((icon) => {
        // @ts-ignore
        import('leaflet/dist/images/marker-shadow.png').then((iconShadow) => {
          const DefaultIcon = L.default.icon({
            iconUrl: icon.default,
            shadowUrl: iconShadow.default,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
          });
          L.default.Marker.prototype.options.icon = DefaultIcon;
          setIsReady(true);
        });
      });
    });
  }, []);

  if (!isReady) return <div className="h-[650px] w-full bg-earth-200 animate-pulse flex items-center justify-center italic text-earth-500">Initializing Atlas...</div>;

  return (
    <div className="h-[650px] w-full bg-earth-200 relative group">
      {/* Decorative corner brackets */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-earth-800 z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-earth-800 z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-earth-800 z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-earth-800 z-10 pointer-events-none"></div>

      <MapContainer center={[30, 10]} zoom={3} scrollWheelZoom={false} className="h-full w-full opacity-90 transition-opacity duration-1000 group-hover:opacity-100">
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {places.map((place) => (
          <Marker key={place.id} position={[place.lat, place.lng]}>
            <Popup className="custom-popup">
              <div className="font-serif p-1">
                <strong className="block text-xl font-light text-earth-900 mb-1">{place.name}</strong>
                <span className="text-earth-600 text-sm italic">{place.note}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
