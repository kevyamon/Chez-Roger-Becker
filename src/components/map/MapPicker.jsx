/**
 * Sélecteur cartographique interactif avec géolocalisation GPS et Leaflet.
 * Respecte l'abstraction cartographique du cahier des charges.
 */

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import L from 'leaflet';

export const MapPicker = ({ location, onLocationChange, readOnly = false }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [isLocating, setIsLocating] = useState(false);

  // Position par défaut : Abidjan, Côte d'Ivoire [lng, lat]
  const defaultCoords = [location?.coordinates?.[0] || -4.0083, location?.coordinates?.[1] || 5.3599];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = defaultCoords[1];
      const initialLng = defaultCoords[0];

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([initialLat, initialLng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      // Icône de marqueur stylisée
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="background-color: #E65100; width: 28px; height: 28px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="background-color: #FFFFFF; width: 8px; height: 8px; border-radius: 50%;"></div></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([initialLat, initialLng], {
        draggable: !readOnly,
        icon: customIcon
      }).addTo(map);

      if (!readOnly) {
        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          onLocationChange && onLocationChange({ type: 'Point', coordinates: [pos.lng, pos.lat] });
        });

        map.on('click', (e) => {
          marker.setLatLng(e.latlng);
          onLocationChange && onLocationChange({ type: 'Point', coordinates: [e.latlng.lng, e.latlng.lat] });
        });
      }

      mapInstanceRef.current = map;
      markerRef.current = marker;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 16);
          markerRef.current.setLatLng([latitude, longitude]);
          onLocationChange && onLocationChange({ type: 'Point', coordinates: [longitude, latitude] });
        }
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div style={containerStyle}>
      <div ref={mapContainerRef} style={mapWrapperStyle} />
      {!readOnly && (
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          style={gpsButtonStyle}
          disabled={isLocating}
        >
          {isLocating ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
          <span>{isLocating ? 'Recherche GPS en cours...' : 'Utiliser ma position actuelle'}</span>
        </button>
      )}
    </div>
  );
};

const containerStyle = {
  position: 'relative',
  width: '100%',
  borderRadius: '16px',
  overflow: 'hidden',
  border: '1px solid var(--border-color)',
  marginTop: '8px',
  marginBottom: '16px'
};

const mapWrapperStyle = {
  width: '100%',
  height: '220px',
  backgroundColor: '#E2E8F0'
};

const gpsButtonStyle = {
  position: 'absolute',
  bottom: '12px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 400,
  backgroundColor: 'var(--color-primary)',
  color: '#FFFFFF',
  padding: '8px 16px',
  borderRadius: '9999px',
  fontSize: '0.8rem',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  boxShadow: '0 4px 14px rgba(230, 81, 0, 0.4)',
  whiteSpace: 'nowrap'
};
