import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RouteData } from '../types/tripTypes';
// Fix for Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});
interface RouteMapProps {
  routeData: RouteData;
}
const RouteMap: React.FC<RouteMapProps> = ({
  routeData
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize the map
      mapInstanceRef.current = L.map(mapRef.current).setView([39.8283, -98.5795], 4); // Center on US
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);
    }
    if (mapInstanceRef.current && routeData && routeData.points.length > 0) {
      const map = mapInstanceRef.current;
      // Clear existing layers
      map.eachLayer(layer => {
        if (!(layer instanceof L.TileLayer)) {
          map.removeLayer(layer);
        }
      });
      // Add markers for each point
      const markers: L.Marker[] = [];
      const latLngs: L.LatLng[] = [];
      routeData.points.forEach((point, index) => {
        const [lat, lng] = point.coordinates;
        const latLng = L.latLng(lat, lng);
        latLngs.push(latLng);
        // Create custom icon based on point type
        let iconUrl = '';
        let iconSize: [number, number] = [25, 41];
        switch (point.type) {
          case 'pickup':
            iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png';
            break;
          case 'dropoff':
            iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';
            break;
          case 'rest':
            iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png';
            break;
          case 'fuel':
            iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png';
            break;
        }
        const icon = L.icon({
          iconUrl,
          iconSize,
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
          shadowSize: [41, 41]
        });
        // Create marker with popup
        const marker = L.marker(latLng, {
          icon
        }).addTo(map).bindPopup(`
            <strong>${point.location}</strong><br>
            ${point.type.charAt(0).toUpperCase() + point.type.slice(1)} Point<br>
            ${point.time.toLocaleString()}<br>
            ${point.duration ? `Duration: ${point.duration >= 60 ? `${point.duration / 60} hr` : `${point.duration} min`}` : ''}
          `);
        markers.push(marker);
      });
      // Draw route line
      L.polyline(latLngs, {
        color: 'teal',
        weight: 4
      }).addTo(map);
      // Fit map to bounds
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, {
        padding: [50, 50]
      });
    }
    return () => {
      if (mapInstanceRef.current) {
        // Clean up map when component unmounts
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [routeData]);
  return <div ref={mapRef} className="w-full h-full" />;
};
export default RouteMap;