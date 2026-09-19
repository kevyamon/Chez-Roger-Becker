/**
 * Sélecteur cartographique interactif avec géolocalisation GPS et Leaflet.
 * Intègre la résolution d'adresse automatique (Reverse Geocoding) lors des déplacements.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Navigation, Loader2 } from 'lucide-react';
import L from 'leaflet';

export const MapPicker = ({ location, onLocationChange, readOnly = false }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [isLocating, setIsLocating] = useState(false);

  // Position par défaut : Abidjan, Côte d'Ivoire [lng, lat]
  const defaultCoords = [location?.coordinates?.[0] || -4.0083, location?.coordinates?.[1] || 5.3599];

  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        { headers: { 'Accept-Language': 'fr' } }
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data.address) {
          const addr = data.address;
          const parts = [
            addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood,
            addr.city || addr.town || addr.village || addr.county || 'Abidjan'
          ].filter(Boolean);
          return parts.length > 0 ? parts.join(', ') : data.display_name;
        }
      }
    } catch {
      // Échec silencieux, ne bloque pas la sélection
    }
    return null;
  }, []);

  const handlePositionSelected = useCallback(async (lng, lat) => {
    if (!onLocationChange) return;
    const resolvedAddress = await reverseGeocode(lat, lng);
    onLocationChange({
      type: 'Point',
      coordinates: [lng, lat],
      resolvedAddress: resolvedAddress || undefined
    });
  }, [onLocationChange, reverseGeocode]);

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
        html: `<div style="background-color: var(--color-primary, #E65100); width: 28px; height: 28px; border-radius: 50%; border: 3px solid var(--bg-elevated, #FFFFFF); box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="background-color: var(--bg-elevated, #FFFFFF); width: 8px; height: 8px; border-radius: 50%;"></div></div>`,
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
          handlePositionSelected(pos.lng, pos.lat);
        });

        map.on('click', (e) => {
          marker.setLatLng(e.latlng);
          handlePositionSelected(e.latlng.lng, e.latlng.lat);
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
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 16);
          markerRef.current.setLatLng([latitude, longitude]);
          await handlePositionSelected(longitude, latitude);
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
  backgroundColor: 'var(--border-color)'
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
  whiteSpace: 'nowrap',
  border: 'none',
  cursor: 'pointer'
};
