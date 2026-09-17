import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { IListing } from '../../types';
import { formatFCFA, formatSurface } from '../../theme/theme';
import { Link } from 'react-router-dom';

// Création d'icônes Leaflet personnalisées aux couleurs de GayaBTP
const createCustomMarkerIcon = (priceText: string, isACD: boolean) => {
  const bgClass = isACD ? '#2C5F7C' : '#E99021';
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${bgClass};
        color: white;
        font-weight: 700;
        font-size: 11px;
        padding: 4px 8px;
        border-radius: 20px;
        border: 2px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
        transform: translate(-50%, -50%);
      ">
        <span>${priceText}</span>
      </div>
    `,
    iconSize: [80, 30],
    iconAnchor: [40, 15],
  });
};

// Composant pour recentrer la carte sur les annonces
const MapRecenter: React.FC<{ listings: IListing[] }> = ({ listings }) => {
  const map = useMap();

  useEffect(() => {
    if (listings.length === 0) return;
    const validCoords = listings
      .filter((l) => l.coordinates?.latitude && l.coordinates?.longitude)
      .map((l) => [l.coordinates!.latitude, l.coordinates!.longitude] as [number, number]);

    if (validCoords.length > 0) {
      const bounds = L.latLngBounds(validCoords);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [listings, map]);

  return null;
};

interface MapViewProps {
  listings: IListing[];
  selectedListingId?: string;
  onSelectListing?: (id: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({ listings, onSelectListing }) => {
  // Centre par défaut : Abidjan, Côte d'Ivoire
  const defaultCenter: [number, number] = [5.3599, -4.0083];

  return (
    <div className="w-full h-full min-h-[400px] rounded-brand-lg overflow-hidden border border-brand-light-border dark:border-brand-dark-border shadow-card relative z-0">
      <MapContainer
        center={defaultCenter}
        zoom={11}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
        style={{ height: '100%', minHeight: '450px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter listings={listings} />

        {listings.map((item) => {
          if (!item.coordinates?.latitude || !item.coordinates?.longitude) return null;
          const isACD = item.titleType === 'ACD' || item.titleType === 'CMP';
          const priceShort = `${(item.priceFCFA / 1000000).toFixed(1)}M FCFA`;

          return (
            <Marker
              key={item._id}
              position={[item.coordinates.latitude, item.coordinates.longitude]}
              icon={createCustomMarkerIcon(priceShort, isACD)}
              eventHandlers={{
                click: () => onSelectListing?.(item._id),
              }}
            >
              <Popup className="custom-popup">
                <div className="w-64 p-3 space-y-2">
                  <div className="relative aspect-[16/9] w-full rounded overflow-hidden bg-slate-100">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1.5 left-1.5 text-[10px] font-bold px-2 py-0.5 rounded bg-brand-secondary text-white">
                      {item.titleType}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-slate-900 line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs font-bold text-brand-primary mt-0.5">
                      {formatFCFA(item.priceFCFA)} • {formatSurface(item.surfaceM2)}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {item.district ? `${item.district}, ` : ''}{item.city}
                    </p>
                  </div>
                  <Link
                    to={`/annonces/${item._id}`}
                    className="block text-center text-xs font-semibold py-1.5 px-3 rounded bg-brand-secondary text-white hover:bg-brand-secondary-hover transition-colors"
                  >
                    Voir la fiche complète
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
