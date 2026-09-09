export type RiskLevel = 'low' | 'medium' | 'high' | 'unknown';
export type Urgency = 'immediate' | 'short-term' | 'medium-term';

export interface Zone {
  zone_id: string;
  hazard_type: string;
  risk_level: RiskLevel;
  geometry: { type: 'Polygon'; coordinates: number[][][] };
}

export interface Habitation {
  habitation_id: string;
  name: string;
  population: number;
  coordinates: { type: 'Point'; coordinates: [number, number] };
  current_zone_id: string | null;
}

export interface Site {
  site_id: string;
  capacity_score: number;
  available_land: number;
  infra_access: number;
  geometry: { type: 'Polygon'; coordinates: number[][][] };
}

export interface Priority {
  habitation_id: string;
  name: string;
  population: number;
  risk_level: RiskLevel;
  priority_score: number;
  urgency: Urgency;
  explanation?: {
    normalized_risk?: number;
    risk_contribution?: number;
    normalized_population?: number;
    population_contribution?: number;
    note?: string;
  };
}
