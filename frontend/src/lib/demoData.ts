import type { Habitation, Priority, Site, Zone } from '../types';

const polygon = (lng: number, lat: number, size: number) => ({
  type: 'Polygon' as const,
  coordinates: [[
    [lng - size, lat - size], [lng + size, lat - size],
    [lng + size, lat + size], [lng - size, lat + size],
    [lng - size, lat - size],
  ]],
});

export const demoZones: Zone[] = [
  { zone_id: 'DEMO-Z1', hazard_type: 'landslide', risk_level: 'high', geometry: polygon(79.35, 30.40, .045) },
  { zone_id: 'DEMO-Z2', hazard_type: 'flood', risk_level: 'medium', geometry: polygon(79.44, 30.34, .04) },
  { zone_id: 'DEMO-Z3', hazard_type: 'glof', risk_level: 'high', geometry: polygon(79.28, 30.47, .035) },
];

export const demoHabitations: Habitation[] = [
  { habitation_id: 'H-01', name: 'Demo Hamlet A', population: 680, coordinates: { type: 'Point', coordinates: [79.35, 30.40] }, current_zone_id: 'DEMO-Z1' },
  { habitation_id: 'H-02', name: 'Demo Hamlet B', population: 420, coordinates: { type: 'Point', coordinates: [79.44, 30.34] }, current_zone_id: 'DEMO-Z2' },
  { habitation_id: 'H-03', name: 'Demo Hamlet C', population: 260, coordinates: { type: 'Point', coordinates: [79.28, 30.47] }, current_zone_id: 'DEMO-Z3' },
  { habitation_id: 'H-04', name: 'Demo Hamlet D', population: 180, coordinates: { type: 'Point', coordinates: [79.39, 30.37] }, current_zone_id: null },
];

export const demoSites: Site[] = [
  { site_id: 'SITE-01', capacity_score: .88, available_land: 5.8, infra_access: .86, geometry: polygon(79.40, 30.36, .018) },
  { site_id: 'SITE-02', capacity_score: .74, available_land: 4.2, infra_access: .71, geometry: polygon(79.31, 30.43, .016) },
  { site_id: 'SITE-03', capacity_score: .61, available_land: 3.1, infra_access: .59, geometry: polygon(79.47, 30.38, .014) },
];

export const demoPriorities: Priority[] = [
  { habitation_id: 'H-01', name: 'Demo Hamlet A', population: 680, risk_level: 'high', priority_score: .91, urgency: 'immediate', explanation: { normalized_risk: 1, risk_contribution: .6, normalized_population: 1, population_contribution: .4 } },
  { habitation_id: 'H-02', name: 'Demo Hamlet B', population: 420, risk_level: 'medium', priority_score: .62, urgency: 'short-term', explanation: { normalized_risk: .5, risk_contribution: .3, normalized_population: .8, population_contribution: .32 } },
  { habitation_id: 'H-03', name: 'Demo Hamlet C', population: 260, risk_level: 'high', priority_score: .55, urgency: 'short-term', explanation: { normalized_risk: 1, risk_contribution: .6, normalized_population: .45, population_contribution: .18 } },
  { habitation_id: 'H-04', name: 'Demo Hamlet D', population: 180, risk_level: 'unknown', priority_score: 0, urgency: 'medium-term', explanation: { note: 'Demo fallback record with no associated risk zone.' } },
];
