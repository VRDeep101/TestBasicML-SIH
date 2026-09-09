import type { Habitation, Priority, Site, Zone } from '../types';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API}${path}`);
  if (!response.ok) throw new Error(`${path}: ${response.status}`);
  return response.json();
}

export const api = {
  zones: () => get<Zone[]>('/zones'),
  habitations: () => get<Habitation[]>('/habitations'),
  sites: () => get<Site[]>('/sites'),
  priorities: () => get<Priority[]>('/priorities'),
};

export { API };
