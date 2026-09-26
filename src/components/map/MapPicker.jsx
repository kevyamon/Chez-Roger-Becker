/**
 * Sélecteur cartographique interactif avec géolocalisation GPS et Leaflet (MapPicker).
 * Reverse Geocoding multi-sources ultra-robuste adapté à Abidjan et la Côte d'Ivoire.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Navigation, Loader2 } from 'lucide-react';
import L from 'leaflet';
import { useToast } from '../../context/ToastContext';

export const MapPicker = ({ location, onLocationChange, readOnly = false }) => {
  const { showError, showSuccess } = useToast();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [isLocating, setIsLocating] = useState(false);

  // Coordonnées par défaut : Abidjan, Côte d'Ivoire [lng, lat]
  const defaultCoords = [location?.coordinates?.[0] || -4.0083, location?.coordinates?.[1] || 5.3599];

  /**
   * Résolution d'adresse en texte clair multi-sources (Nominatim + BigDataCloud).
   */
  const reverseGeocode = useCallback(async (lat, lng) => {
    // 1. Source primaire : OpenStreetMap Nominatim
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        { headers: { 'Accept-Language': 'fr' } }
      );
      if (response.ok) {
        const data = await response.json();
        if (data?.address) {
          const a = data.address;
          const poi = a.amenity || a.building || a.university || a.school || a.hospital || a.shop || a.tourism;
          const street = a.road || a.pedestrian || a.footway || a.path;
          const quarter = a.suburb || a.quarter || a.neighbourhood || a.residential || a.city_district;
          const city = a.city || a.town || a.village || a.municipality || a.county || 'Abidjan';

          const segments = [poi, street, quarter, city].filter(Boolean);
          if (segments.length > 0) {
            return segments.join(', ');
          }
          if (data.display_name) {
            return data.display_name.split(',').slice(0, 3).join(', ').trim();
          }
        }
      }
    } catch {
      // Poursuite vers le fallback
    }

    // 2. Source secondaire : BigDataCloud Client Geocoding (Rapide et sans quota bloquant)
    try {
      const bdcRes = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=fr`
      );
      if (bdcRes.ok) {
        const bdcData = await bdcRes.json();
        const segments = [
          bdcData.locality || bdcData.subLocality,
          bdcData.principalSubdivision,
          bdcData.city || bdcData.countryName || 'Abidjan'
        ].filter(Boolean);
        if (segments.length > 0) {
          return segments.join(', ');
        }
      }
    } catch {
      // Fallback final
    }

    // 3. Fallback textuel de sécurité
    return `Position GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }, []);

  const handlePositionSelected = useCallback(async (lng, lat) => {
    if (!onLocationChange) return null;
    const resolvedAddress = await reverseGeocode(lat, lng);
    onLocationChange({
      type: 'Point',
      coordinates: [lng, lat],
      resolvedAddress
    });
    return resolvedAddress;
  }, [onLocationChange, reverseGeocode]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = defaultCoords[1];
      const initialLng = defaultCoords[0];

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([initialLat, initialLng], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="background-color: var(--color-primary, #E65100); width: 28px; height: 28px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="background-color: #FFFFFF; width: 8px; height: 8px; border-radius: 50%;"></div></div>`,
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
    if (!navigator.geolocation) {
      showError('La géolocalisation n\'est pas supportée par votre navigateur.');
      return;
    }

    setIsLocating(true);

    const onGeoSuccess = async (pos) => {
      const { latitude, longitude } = pos.coords;
      if (mapInstanceRef.current && markerRef.current) {
        mapInstanceRef.current.setView([latitude, longitude], 16);
        markerRef.current.setLatLng([latitude, longitude]);
      }
      const addr = await handlePositionSelected(longitude, latitude);
      setIsLocating(false);
      showSuccess(addr ? `Adresse détectée : ${addr}` : 'Position GPS détectée avec succès !');
    };

    const onGeoError = () => {
      // Seconde tentative en mode précision standard
      navigator.geolocation.getCurrentPosition(
        onGeoSuccess,
        (fallbackErr) => {
          setIsLocating(false);
          if (fallbackErr.code === 1) {
            showError('Accès GPS refusé. Veuillez autoriser la localisation ou déplacer le repère sur la carte.');
          } else if (fallbackErr.code === 2) {
            showError('Signal GPS indisponible. Cliquez directement sur la carte pour définir votre position.');
          } else {
            showError('Délai d\'attente GPS dépassé. Veuillez déplacer le repère sur la carte.');
          }
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
      );
    };

    navigator.geolocation.getCurrentPosition(
      onGeoSuccess,
      onGeoError,
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 30000 }
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
          <span>{isLocating ? 'Détection GPS en cours...' : 'Utiliser ma position actuelle'}</span>
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
  color: 'var(--color-primary-contrast, #FFFFFF)',
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
