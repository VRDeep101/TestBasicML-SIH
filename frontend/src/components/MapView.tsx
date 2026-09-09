import { useEffect } from 'react';
import { CircleMarker, GeoJSON, MapContainer, TileLayer, Tooltip, useMap } from 'react-leaflet';
import type { Habitation, Site, Zone } from '../types';
import 'leaflet/dist/leaflet.css';

function FitChamoli() {
  const map = useMap();
  useEffect(() => {
    map.setView([30.401, 79.325], 9);
  }, [map]);
  return null;
}

const riskStyle = (risk: string) => ({
  color: risk === 'high' ? '#ef4444' : risk === 'medium' ? '#f59e0b' : '#22c55e',
  fillColor: risk === 'high' ? '#ef4444' : risk === 'medium' ? '#f59e0b' : '#22c55e',
  fillOpacity: risk === 'high' ? .20 : .14,
  weight: 2,
});

export function MapView({ zones, habitations, sites, selectedId, onSelect }: {
  zones: Zone[]; habitations: Habitation[]; sites: Site[]; selectedId?: string; onSelect: (id: string) => void;
}) {
  return (
    <MapContainer className="map" center={[30.401, 79.325]} zoom={9} scrollWheelZoom>
      <FitChamoli />
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {zones.map((z) => (
        <GeoJSON key={z.zone_id} data={z.geometry as never} style={() => riskStyle(z.risk_level)}>
          <Tooltip sticky>{z.hazard_type} · {z.risk_level} risk</Tooltip>
        </GeoJSON>
      ))}
      {sites.map((s) => (
        <GeoJSON key={s.site_id} data={s.geometry as never} style={() => ({ color: '#0f766e', fillColor: '#14b8a6', fillOpacity: .18, weight: 2, dashArray: '5 5' })}>
          <Tooltip sticky>{s.site_id} · {(s.capacity_score * 100).toFixed(0)}% capacity</Tooltip>
        </GeoJSON>
      ))}
      {habitations.map((h) => {
        const active = h.habitation_id === selectedId;
        return <CircleMarker
          key={h.habitation_id}
          center={[h.coordinates.coordinates[1], h.coordinates.coordinates[0]]}
          radius={active ? 9 : 6}
          pathOptions={{ color: '#0f172a', fillColor: active ? '#2563eb' : '#334155', fillOpacity: .9, weight: 2 }}
          eventHandlers={{ click: () => onSelect(h.habitation_id) }}
        ><Tooltip>{h.name} · {h.population.toLocaleString()} people</Tooltip></CircleMarker>;
      })}
    </MapContainer>
  );
}
